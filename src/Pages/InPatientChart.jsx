import React, { useState, useRef } from "react";
import AdmissionForm from "../components/AdmissionForm";
import DietPlanTable from "../components/DietPlanTable";
import TreatmentPlanTable from "../components/TreatmentPlanTable";
import SignatureSection from "../components/SignatureSection";
import { getDatesInRange } from "../utils/dateHelpers";
import {
  isAdmissionFormComplete,
  updateDocumentTitle,
} from "../utils/validations";
import "../index.css";
import NoteUsage from "../components/Note-Usage";
import WebFooter from "../components/WebFooter";
import WebHeader from "../components/WebHeader";
import PDFHeader from "../components/PDFHeader";
import PDFFooter from "../components/PDFFooter";

function InPatientChart() {
  // --- 1. Header State ---
  const [header, setHeader] = useState({
    fileNo: "123456",
    petName: "Bruno",
    ownerName: "Ahmed Rahman",
    doctor: "Dr. Ghadhafi",
    assistantName: "Rajesh",
    cageNo: "IP-12",
    diagnosis: "Acute Gastroenteritis",
    admissionDate: "",
    dischargeDate: "",
    weight: "4.8",
  });
  const dateCols = React.useMemo(() => {
    if (header.admissionDate && header.dischargeDate) {
      return getDatesInRange(header.admissionDate, header.dischargeDate);
    }
    return [];
  }, [header.admissionDate, header.dischargeDate]);

  // --- 2. Row States ---
  const [dietRows, setDietRows] = useState([
    { id: 1, label: "Food", type: "Once" },
    { id: 2, label: "Water", type: "Once" },
    { id: 3, label: "Urine", type: "Once" },
    { id: 4, label: "Stool", type: "Once" },
    { id: 5, label: "Vomiting", type: "Once" },
  ]);

  const [treatmentRows, setTreatmentRows] = useState([
    { id: 101, label: "", dose: "", type: "Twice" },
  ]);

  const nextId = useRef(1000);

  // Max rows per page to keep everything on single A4 page
  const MAX_DIET_ROWS_PER_PAGE = 5;
  const MAX_TREATMENT_ROWS_PER_PAGE = 4;

  // --- 3. Handlers ---
  const handleHeaderChange = (e) => {
    setHeader({ ...header, [e.target.name]: e.target.value });
  };

  const updateRow = (setRows, rows, id, field, value) => {
    setRows(rows.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const removeRow = (setRows, rows, id) => {
    setRows(rows.filter((r) => r.id !== id));
  };

  const addRow = (setRows, rows, defaultObj) => {
    setRows((prev) => [...prev, { ...defaultObj, id: ++nextId.current }]);
  };

  // Update document title for PDF naming
  React.useEffect(() => {
    updateDocumentTitle(header.fileNo, header.admissionDate);
  }, [header.fileNo, header.admissionDate]);

  return (
    <div className="min-h-screen bg-blue-50 py-4 sm:py-8 pb-28 sm:pb-32 print:bg-white print:py-0">
      <div className="max-w-[297mm] mx-auto px-4 sm:px-6 bg-white rounded-lg shadow-2xl print:shadow-none print:rounded-none print:w-full print:max-w-none overflow-hidden">
        {/* UI-Only Header (before tables) */}
        <div className="print:hidden p-4 sm:p-8 border-b-2 border-blue-100 bg-white">
          <WebHeader
            onPrint={() => window.print()}
            canPrint={dateCols.length > 0 && isAdmissionFormComplete(header)}
          />

          <AdmissionForm
            data={header}
            onChange={handleHeaderChange}
            totalDays={dateCols.length}
          />
        </div>

        {/* Content Container - Tables */}
        <div className="print:p-0 print:m-0">
          {dateCols.length > 0 ? (
            (() => {
              const DAYS_PER_PAGE = 15;
              const DIET_OVERFLOW_ROW_LIMIT = MAX_DIET_ROWS_PER_PAGE + 1;
              const TREATMENT_OVERFLOW_ROW_LIMIT =
                MAX_TREATMENT_ROWS_PER_PAGE + 1;

              // Calculate smart row distribution for page 1
              let page1DietMax = 6;
              const page1TreatmentMax = 5;

              if (treatmentRows.length <= 4 ? 7 : 6) {
                page1DietMax = 7;
              } else if (treatmentRows.length <= 5) {
                page1DietMax = 6;
              }

              // Calculate date pages (15 days per page)
              const datePages = Math.max(
                1,
                Math.ceil(dateCols.length / DAYS_PER_PAGE)
              );

              // Calculate row overflow pages
              let dietOverflowPages = 0;
              if (dietRows.length > page1DietMax) {
                const remainingDiet = dietRows.length - page1DietMax;
                dietOverflowPages = Math.ceil(
                  remainingDiet / DIET_OVERFLOW_ROW_LIMIT
                );
              }

              let treatmentOverflowPages = 0;
              if (treatmentRows.length > page1TreatmentMax) {
                const remainingTreatment =
                  treatmentRows.length - page1TreatmentMax;
                treatmentOverflowPages = Math.ceil(
                  remainingTreatment / TREATMENT_OVERFLOW_ROW_LIMIT
                );
              }

              const pages =
                datePages + dietOverflowPages + treatmentOverflowPages;

              return (
                <>
                  {Array.from({ length: pages }).map((_, pageIndex) => {
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

                    let dietSlice = [];
                    let treatmentSlice = [];
                    let showDiet = false;
                    let showTreatment = false;

                    if (pageIndex < datePages) {
                      showDiet = true;
                      showTreatment = true;
                      dietSlice = dietRows.slice(0, page1DietMax);
                      treatmentSlice = treatmentRows.slice(
                        0,
                        page1TreatmentMax
                      );
                    } else {
                      showDiet = true;
                      showTreatment = true;

                      const overflowPageIndex = pageIndex - datePages;

                      if (dietRows.length > page1DietMax) {
                        const dietOverflowIndex = Math.floor(
                          overflowPageIndex /
                            Math.max(1, treatmentOverflowPages || 1)
                        );
                        const dietStart =
                          page1DietMax +
                          dietOverflowIndex * DIET_OVERFLOW_ROW_LIMIT;
                        const dietEnd = dietStart + DIET_OVERFLOW_ROW_LIMIT;
                        dietSlice = dietRows.slice(dietStart, dietEnd);
                      } else {
                        dietSlice = [];
                      }

                      if (treatmentRows.length > page1TreatmentMax) {
                        const treatmentOverflowIndex = Math.floor(
                          overflowPageIndex /
                            Math.max(1, dietOverflowPages || 1)
                        );
                        const treatmentStart =
                          page1TreatmentMax +
                          treatmentOverflowIndex * TREATMENT_OVERFLOW_ROW_LIMIT;
                        const treatmentEnd =
                          treatmentStart + TREATMENT_OVERFLOW_ROW_LIMIT;
                        treatmentSlice = treatmentRows.slice(
                          treatmentStart,
                          treatmentEnd
                        );
                      } else {
                        treatmentSlice = [];
                      }

                      if (dietSlice.length === 0) showDiet = false;
                      if (treatmentSlice.length === 0) showTreatment = false;
                    }

                    const isFirst = pageIndex === 0;
                    const isLast = pageIndex === pages - 1;

                    return (
                      <div
                        key={pageIndex}
                        className="print-page mb-4 print:mb-0 print:p-6 print:border-t-2 print:border-gray-300 print:m-0 p-4 sm:p-6 print:box-border"
                        style={{ pageBreakAfter: isLast ? "auto" : "always" }}
                      >
                        {/* --- WATERMARK LOGO --- */}
                        <div className="hidden print:block print:absolute print:inset-0 print:flex print:items-center print:justify-center print:pointer-events-none print:z-0">
                          <img
                            src="/mypetsa-logo.png"
                            alt="MyPetsa Logo Watermark"
                            className="print:w-72 print:h-72 print:opacity-15 print:object-contain"
                          />
                        </div>
                        {/* --- NEW LOGIC: PERMANENT HEADER --- */}
                        {/* Header remains on every page, but AdmissionForm is conditional */}
                        <div className="hidden print:block print-header mb-2">
                          <PDFHeader
                            onPrint={() => window.print()}
                            canPrint={
                              dateCols.length > 0 &&
                              isAdmissionFormComplete(header)
                            }
                          />

                          {/* --- NEW LOGIC: ADMISSION DETAILS ONLY ON FIRST PAGE --- */}
                          {isFirst && (
                            <div className="no-break">
                              <AdmissionForm
                                data={header}
                                onChange={handleHeaderChange}
                                totalDays={dateCols.length}
                                printMode={true}
                              />
                            </div>
                          )}
                        </div>

                        {/* Tables Container with flex-grow to fill space */}
                        <div className="print:grow print:overflow-visible print:mt-40">
                          <div />
                          {showDiet && dietSlice.length > 0 && (
                            <div className="w-full print:w-full print:overflow-visible">
                              <DietPlanTable
                                rows={dietSlice}
                                dateCols={slice}
                                showAddButton={isFirst}
                                onUpdate={(id, field, val) =>
                                  updateRow(
                                    setDietRows,
                                    dietRows,
                                    id,
                                    field,
                                    val
                                  )
                                }
                                onRemove={(id) =>
                                  removeRow(setDietRows, dietRows, id)
                                }
                                onAdd={() =>
                                  addRow(setDietRows, dietRows, {
                                    label: "",
                                    type: "Once",
                                  })
                                }
                              />
                            </div>
                          )}

                          {showTreatment && treatmentSlice.length > 0 && (
                            <div className="w-full print:w-full print:overflow-visible">
                              <TreatmentPlanTable
                                rows={treatmentSlice}
                                dateCols={slice}
                                showAddButton={isFirst}
                                onUpdate={(id, field, val) =>
                                  updateRow(
                                    setTreatmentRows,
                                    treatmentRows,
                                    id,
                                    field,
                                    val
                                  )
                                }
                                onRemove={(id) =>
                                  removeRow(setTreatmentRows, treatmentRows, id)
                                }
                                onAdd={() =>
                                  addRow(setTreatmentRows, treatmentRows, {
                                    label: "",
                                    dose: "",
                                    type: "Twice",
                                  })
                                }
                              />
                            </div>
                          )}
                        </div>

                        {/* Footer Section */}
                        <div className="print:mt-auto">
                          {/* --- NEW LOGIC: SIGNATURE ONLY ON FIRST PAGE --- */}
                          {isFirst && <SignatureSection />}

                          {/* --- NEW LOGIC: PERMANENT FOOTER --- */}
                          {/* Footer shows on every page as per requirement */}
                          <div className="print-footer">
                            <PDFFooter isLastPage={isLast} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              );
            })()
          ) : (
            <NoteUsage />
          )}
        </div>

        {/* Web-only sticky footer */}
        <div className="bottom-0 left-0 right-0 z-40 print:hidden">
          <WebFooter />
        </div>
      </div>
    </div>
  );
}

export default InPatientChart;
