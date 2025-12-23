import React, { useState, useRef } from "react";
import Header from "../components/Header";
import AdmissionForm from "../components/AdmissionForm";
import DietPlanTable from "../components/DietPlanTable";
import TreatmentPlanTable from "../components/TreatmentPlanTable";
import SignatureSection from "../components/SignatureSection";
import Footer from "../components/Footer";
import { getDatesInRange } from "../utils/dateHelpers";
import {
  isAdmissionFormComplete,
  generatePdfFilename,
} from "../utils/validations";
import "../App.css";
import NoteUsage from "../components/Note-Usage";
import WebFooter from "../components/WebFooter";

function InPatientChart() {
  // --- 1. Header State ---
  const [header, setHeader] = useState({
    fileNo: "",
    petName: "",
    ownerName: "",
    doctor: "",
    assistantName: "",
    cageNo: "",
    diagnosis: "",
    admissionDate: "",
    dischargeDate: "",
  });

  const dateCols = React.useMemo(() => {
    if (header.admissionDate && header.dischargeDate) {
      return getDatesInRange(header.admissionDate, header.dischargeDate);
    }
    return [];
  }, [header.admissionDate, header.dischargeDate]);

  // --- 2. Row States ---
  // Default Diet Rows

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

  // simple id generator to avoid impure calls during render
  const nextId = useRef(1000);

  // Max rows per page to keep everything on single A4 page
  const MAX_DIET_ROWS_PER_PAGE = 5;
  const MAX_TREATMENT_ROWS_PER_PAGE = 4;

  // --- 3. Handlers ---
  const handleHeaderChange = (e) => {
    setHeader({ ...header, [e.target.name]: e.target.value });
  };

  // Generic Row Updaters
  const updateRow = (setRows, rows, id, field, value) => {
    setRows(rows.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const removeRow = (setRows, rows, id) => {
    setRows(rows.filter((r) => r.id !== id));
  };

  const addRow = (setRows, defaultObj) => {
    setRows((prev) => [...prev, { ...defaultObj, id: ++nextId.current }]);
  };

  // Update document title for PDF naming
  React.useEffect(() => {
    const filename = generatePdfFilename(header.fileNo);
    document.title = filename.replace(".pdf", "");
  }, [header.fileNo]);

  return (
    <div className="min-h-screen bg-blue-50 py-4 sm:py-8 pb-28 sm:pb-32 print:bg-white print:py-0">
      <div className="max-w-[297mm] mx-auto px-4 sm:px-6 bg-white rounded-lg shadow-2xl print:shadow-none print:rounded-none print:w-full print:max-w-none overflow-hidden">
        {/* UI-Only Header (before tables) */}
        <div className="print:hidden p-4 sm:p-8 border-b-2 border-blue-100 bg-white">
          <Header
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
              // Smart pagination logic:
              // PRIMARY: Date pagination (15 days per page) - when days > 15, show remaining days on next page with same tables
              // SECONDARY: Row overflow (tables exceed row limits) - when rows overflow, show on dedicated pages
              // - Page 1: Diet + Treatment with smart row distribution
              //   * If Treatment 1-2 rows: Diet max 8 rows
              //   * If Treatment 3-4 rows: Diet max 6 rows
              //   * If Treatment 5+ rows: Diet max 5 rows
              // - If days > 15: Next date pages show same tables with advancing 15-day date slices
              // - If rows overflow after date pages: Dedicated overflow pages for excess rows

              const DAYS_PER_PAGE = 15;
              const DIET_OVERFLOW_ROW_LIMIT = MAX_DIET_ROWS_PER_PAGE + 1;
              const TREATMENT_OVERFLOW_ROW_LIMIT =
                MAX_TREATMENT_ROWS_PER_PAGE + 1;

              // Calculate smart row distribution for page 1
              let page1DietMax = 5;
              let page1TreatmentMax = 4;

              if (treatmentRows.length <= 2) {
                page1DietMax = 8;
              } else if (treatmentRows.length <= 4) {
                page1DietMax = 6;
              }

              // Calculate date pages (15 days per page)
              const datePages = Math.max(
                1,
                Math.ceil(dateCols.length / DAYS_PER_PAGE)
              );

              // Calculate row overflow pages (only for rows exceeding page 1 capacity)
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

              // Total pages: date pages first, then row overflow pages
              const pages =
                datePages + dietOverflowPages + treatmentOverflowPages;

              return (
                <>
                  {Array.from({ length: pages }).map((_, pageIndex) => {
                    // Date slice logic:
                    // - For date pages: advance 15 days per page
                    // - For overflow pages: use LAST date slice from the date pages
                    let slice;
                    if (pageIndex < datePages) {
                      // Date pages: advance date columns normally
                      const dateStart = pageIndex * DAYS_PER_PAGE;
                      const dateEnd = dateStart + DAYS_PER_PAGE;
                      slice = dateCols.slice(dateStart, dateEnd);
                    } else {
                      // Overflow pages: use LAST date slice (from final date page)
                      const lastDatePageIndex = datePages - 1;
                      const dateStart = lastDatePageIndex * DAYS_PER_PAGE;
                      const dateEnd = dateStart + DAYS_PER_PAGE;
                      slice = dateCols.slice(dateStart, dateEnd);
                    }

                    // Determine which tables to show and their row slices
                    let dietSlice = [];
                    let treatmentSlice = [];
                    let showDiet = false;
                    let showTreatment = false;

                    if (pageIndex < datePages) {
                      // Date pages: Show same tables with advancing date columns
                      showDiet = true;
                      showTreatment = true;
                      dietSlice = dietRows.slice(0, page1DietMax);
                      treatmentSlice = treatmentRows.slice(
                        0,
                        page1TreatmentMax
                      );
                    } else {
                      // Overflow pages: Show both Diet and Treatment with overflow rows + advancing date columns
                      showDiet = true;
                      showTreatment = true;

                      // Calculate which overflow page we're on (0-indexed)
                      const overflowPageIndex = pageIndex - datePages;

                      // Diet rows: handle overflow with advancing through overflow rows
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

                      // Treatment rows: handle overflow with advancing through overflow rows
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

                      // Hide tables if no rows to display
                      if (dietSlice.length === 0) showDiet = false;
                      if (treatmentSlice.length === 0) showTreatment = false;
                    }

                    const isLast = pageIndex === pages - 1;

                    return (
                      <div
                        key={pageIndex}
                        className="mb-4 print:p-6 print:border-t-2 print:border-gray-300 print:m-0 p-4 sm:p-6"
                        style={{ pageBreakAfter: isLast ? "auto" : "always" }}
                      >
                        {/* Print Header on every page (AdmissionForm only on first page) */}
                        <div className="hidden print:block mb-2">
                          <Header
                            onPrint={() => window.print()}
                            canPrint={
                              dateCols.length > 0 &&
                              isAdmissionFormComplete(header)
                            }
                          />
                          {pageIndex === 0 && (
                            <AdmissionForm
                              data={header}
                              onChange={handleHeaderChange}
                              totalDays={dateCols.length}
                              printMode={true}
                            />
                          )}
                        </div>

                        {showDiet && dietSlice.length > 0 && (
                          <DietPlanTable
                            rows={dietSlice}
                            dateCols={slice}
                            onUpdate={(id, field, val) =>
                              updateRow(setDietRows, dietRows, id, field, val)
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
                        )}

                        {showTreatment && treatmentSlice.length > 0 && (
                          <TreatmentPlanTable
                            rows={treatmentSlice}
                            dateCols={slice}
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
                        )}

                        <SignatureSection />

                        {/* Print Footer on every page */}
                        <Footer isLastPage={isLast} />
                      </div>
                    );
                  })}
                </>
              );
            })()
          ) : (
            <>
              {/* Demo notice - web UI only (hidden in print/PDF) */}
              <NoteUsage />
            </>
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
