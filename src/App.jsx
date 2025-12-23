import React, { useState, useRef } from "react";
import Header from "./components/Header";
import AdmissionForm from "./components/AdmissionForm";
import DietPlanTable from "./components/DietPlanTable";
import TreatmentPlanTable from "./components/TreatmentPlanTable";
import SignatureSection from "./components/SignatureSection";
import Footer from "./components/Footer";
import { getDatesInRange } from "./utils/dateHelpers";
import {
  isAdmissionFormComplete,
  generatePdfFilename,
} from "./utils/validations";
import "./App.css";
import NoteUsage from "./components/Note-Usage";

function App() {
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
    <div className="min-h-screen bg-blue-50 py-8 print:bg-white print:py-0">
      <div className="max-w-[297mm] mx-auto bg-white rounded-lg shadow-2xl print:shadow-none print:rounded-none print:w-full print:max-w-none overflow-hidden">
        {/* UI-Only Header (before tables) */}
        <div className="print:hidden p-8 border-b-2 border-blue-100 bg-white">
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
              // Paginate by date with a hard limit of 15 days per page for PDF output.
              // Also paginate diet and treatment rows independently so overflowing
              // rows continue on subsequent pages. The number of final pages is
              // the maximum required by dates, diet rows, or treatment rows.
              const DAYS_PER_PAGE = 15;
              const dietRowsPerPage = MAX_DIET_ROWS_PER_PAGE;
              const treatmentRowsPerPage = MAX_TREATMENT_ROWS_PER_PAGE;

              const datePages = Math.max(
                1,
                Math.ceil(dateCols.length / DAYS_PER_PAGE)
              );
              const dietPages = Math.max(
                1,
                Math.ceil(dietRows.length / dietRowsPerPage)
              );
              const treatmentPages = Math.max(
                1,
                Math.ceil(treatmentRows.length / treatmentRowsPerPage)
              );

              const pages = Math.max(datePages, dietPages, treatmentPages);

              return (
                <>
                  {Array.from({ length: pages }).map((_, pageIndex) => {
                    // Date slice: if there are fewer date-pages than total pages,
                    // repeat the last available date slice on remaining pages so
                    // the table headers still show meaningful columns.
                    // Advance date columns per page so page 0 shows dates [0..DAYS_PER_PAGE-1],
                    // page 1 shows the next slice, etc. If no dates remain the slice will be empty.
                    const dateStart = pageIndex * DAYS_PER_PAGE;
                    const dateEnd = dateStart + DAYS_PER_PAGE;
                    const slice = dateCols.slice(dateStart, dateEnd);

                    // Rows slices for this page
                    const dietStart = pageIndex * dietRowsPerPage;
                    const dietSlice = dietRows.slice(
                      dietStart,
                      dietStart + dietRowsPerPage
                    );

                    const treatmentStart = pageIndex * treatmentRowsPerPage;
                    const treatmentSlice = treatmentRows.slice(
                      treatmentStart,
                      treatmentStart + treatmentRowsPerPage
                    );

                    const isLast = pageIndex === pages - 1;

                    return (
                      <div
                        key={pageIndex}
                        className="mb-4 print:p-6 print:border-t-2 print:border-gray-300 print:m-0 p-6"
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

                        {(pageIndex === 0 || dietSlice.length > 0) && (
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

                        {(pageIndex === 0 || treatmentSlice.length > 0) && (
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
      </div>
    </div>
  );
}

export default App;
