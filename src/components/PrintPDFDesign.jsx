import React from "react";
import PDFHeader from "./PDFHeader";
import PDFFooter from "./PDFFooter";
import AdmissionForm from "./AdmissionForm";
import DietPlanTable from "./DietPlanTable";
import TreatmentPlanTable from "./TreatmentPlanTable";
import SignatureSection from "./SignatureSection";
import NoteUsage from "./Note-Usage";

/**
 * PrintPDFDesign Component
 * ========================
 * Handles all PDF layout and design
 *
 * This component is responsible for:
 * - PDF page layout and structure
 * - Multi-page pagination logic
 * - Print-specific styling and design
 * - Header and footer placement
 * - Signature section layout
 *
 * Usage:
 *   <PrintPDFDesign
 *     dateCols={dateCols}
 *     header={header}
 *     dietRows={dietRows}
 *     treatmentRows={treatmentRows}
 *     onHeaderChange={handleHeaderChange}
 *     onDietUpdate={(id, field, val) => updateRow(...)}
 *     onDietRemove={(id) => removeRow(...)}
 *     onDietAdd={() => addRow(...)}
 *     onTreatmentUpdate={(id, field, val) => updateRow(...)}
 *     onTreatmentRemove={(id) => removeRow(...)}
 *     onTreatmentAdd={() => addRow(...)}
 *     isAdmissionFormComplete={boolean}
 *   />
 */

function PrintPDFDesign({
  dateCols = [],
  header = {},
  dietRows = [],
  treatmentRows = [],
  onHeaderChange,
  onDietUpdate,
  onDietRemove,
  onDietAdd,
  onTreatmentUpdate,
  onTreatmentRemove,
  onTreatmentAdd,
  isAdmissionFormComplete = false,
}) {
  // Constants for pagination
  const MAX_DIET_ROWS_PER_PAGE = 5;
  const MAX_TREATMENT_ROWS_PER_PAGE = 4;
  const DAYS_PER_PAGE = 15;
  const DIET_OVERFLOW_ROW_LIMIT = MAX_DIET_ROWS_PER_PAGE + 1;
  const TREATMENT_OVERFLOW_ROW_LIMIT = MAX_TREATMENT_ROWS_PER_PAGE + 1;

  // Smart row distribution for page 1
  const page1DietMax = 6;
  const page1TreatmentMax = 5;

  // Calculate page count
  const datePages = Math.max(1, Math.ceil(dateCols.length / DAYS_PER_PAGE));

  let dietOverflowPages = 0;
  if (dietRows.length > page1DietMax) {
    const remainingDiet = dietRows.length - page1DietMax;
    dietOverflowPages = Math.ceil(remainingDiet / DIET_OVERFLOW_ROW_LIMIT);
  }

  let treatmentOverflowPages = 0;
  if (treatmentRows.length > page1TreatmentMax) {
    const remainingTreatment = treatmentRows.length - page1TreatmentMax;
    treatmentOverflowPages = Math.ceil(
      remainingTreatment / TREATMENT_OVERFLOW_ROW_LIMIT
    );
  }

  const totalPages = datePages + dietOverflowPages + treatmentOverflowPages;

  // If no data, show note
  if (dateCols.length === 0) {
    return <NoteUsage />;
  }

  // Generate PDF pages
  return (
    <div className="print:p-0 print:m-0">
      {Array.from({ length: totalPages }).map((_, pageIndex) => {
        // Determine date slice for this page
        let slice;
        if (pageIndex < datePages) {
          const dateStart = pageIndex * DAYS_PER_PAGE;
          const dateEnd = dateStart + DAYS_PER_PAGE;
          slice = dateCols.slice(dateStart, dateEnd);
        } else {
          const lastDatePageIndex = datePages - 1;
          const dateStart = lastDatePageIndex * DAYS_PER_PAGE;
          const dateEnd = dateStart + DAYS_PER_PAGE;
          slice = dateCols.slice(dateStart, dateEnd);
        }

        // Determine row slices for this page
        let dietSlice = [];
        let treatmentSlice = [];
        let showDiet = false;
        let showTreatment = false;

        if (pageIndex < datePages) {
          showDiet = true;
          showTreatment = true;
          dietSlice = dietRows.slice(0, page1DietMax);
          treatmentSlice = treatmentRows.slice(0, page1TreatmentMax);
        } else {
          showDiet = true;
          showTreatment = true;

          const overflowPageIndex = pageIndex - datePages;

          if (dietRows.length > page1DietMax) {
            const dietOverflowIndex = Math.floor(
              overflowPageIndex / Math.max(1, treatmentOverflowPages || 1)
            );
            const dietStart =
              page1DietMax + dietOverflowIndex * DIET_OVERFLOW_ROW_LIMIT;
            const dietEnd = dietStart + DIET_OVERFLOW_ROW_LIMIT;
            dietSlice = dietRows.slice(dietStart, dietEnd);
          } else {
            dietSlice = [];
          }

          if (treatmentRows.length > page1TreatmentMax) {
            const treatmentOverflowIndex = Math.floor(
              overflowPageIndex / Math.max(1, dietOverflowPages || 1)
            );
            const treatmentStart =
              page1TreatmentMax +
              treatmentOverflowIndex * TREATMENT_OVERFLOW_ROW_LIMIT;
            const treatmentEnd = treatmentStart + TREATMENT_OVERFLOW_ROW_LIMIT;
            treatmentSlice = treatmentRows.slice(treatmentStart, treatmentEnd);
          } else {
            treatmentSlice = [];
          }

          if (dietSlice.length === 0) showDiet = false;
          if (treatmentSlice.length === 0) showTreatment = false;
        }

        const isFirst = pageIndex === 0;
        const isLast = pageIndex === totalPages - 1;

        return (
          <div
            key={pageIndex}
            className="print-page mb-4 print:mb-0 print:p-6 print:border-t-2 print:border-gray-300 print:m-0 p-4 sm:p-6 print:box-border print:relative"
            style={{ pageBreakAfter: isLast ? "auto" : "always" }}
          >
            {/* WATERMARK LOGO */}
            <div className="hidden print:block print:absolute print:top-0 print:left-0 print:w-full print:h-full print:flex print:items-center print:justify-center print:pointer-events-none print:z-0">
              <img
                src="/mypetsa-logo.png"
                alt="MyPetsa Logo Watermark"
                className="print:max-w-[300px] print:max-h-[300px] print:opacity-10 print:object-contain"
              />
            </div>

            {/* PDF HEADER */}
            <div className="hidden print:block print-header mb-2">
              <PDFHeader
                onPrint={() => window.print()}
                canPrint={dateCols.length > 0 && isAdmissionFormComplete}
              />

              {/* ADMISSION FORM - FIRST PAGE ONLY */}
              {isFirst && (
                <div className="no-break">
                  <AdmissionForm
                    data={header}
                    onChange={onHeaderChange}
                    totalDays={dateCols.length}
                    printMode={true}
                  />
                </div>
              )}
            </div>

            {/* TABLES CONTAINER */}
            <div className="print:grow print:overflow-visible print:mt-40">
              <div />

              {/* DIET PLAN TABLE */}
              {showDiet && dietSlice.length > 0 && (
                <div className="w-full print:w-full print:overflow-visible">
                  <DietPlanTable
                    rows={dietSlice}
                    dateCols={slice}
                    showAddButton={isFirst}
                    onUpdate={onDietUpdate}
                    onRemove={onDietRemove}
                    onAdd={onDietAdd}
                  />
                </div>
              )}

              {/* TREATMENT PLAN TABLE */}
              {showTreatment && treatmentSlice.length > 0 && (
                <div className="w-full print:w-full print:overflow-visible">
                  <TreatmentPlanTable
                    rows={treatmentSlice}
                    dateCols={slice}
                    showAddButton={isFirst}
                    onUpdate={onTreatmentUpdate}
                    onRemove={onTreatmentRemove}
                    onAdd={onTreatmentAdd}
                  />
                </div>
              )}
            </div>

            {/* FOOTER SECTION */}
            <div className="print:mt-auto">
              {/* SIGNATURE - FIRST PAGE ONLY */}
              {isFirst && <SignatureSection isFirstPage={true} />}

              {/* PDF FOOTER - ALL PAGES */}
              <div className="print-footer">
                <PDFFooter isLastPage={isLast} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default PrintPDFDesign;
