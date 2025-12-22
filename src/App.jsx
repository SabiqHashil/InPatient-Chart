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

        {/* Print-Only Header (on every page) */}
        <div className="hidden print:block print:p-6">
          <Header
            onPrint={() => window.print()}
            canPrint={dateCols.length > 0 && isAdmissionFormComplete(header)}
          />
        </div>

        {/* Content Container - Tables */}
        <div className="print:p-0 print:m-0">
          {dateCols.length > 0 ? (
            (() => {
              // Check if we exceed single-page row limits
              const dietRowsExceedLimit =
                dietRows.length > MAX_DIET_ROWS_PER_PAGE;
              const treatmentRowsExceedLimit =
                treatmentRows.length > MAX_TREATMENT_ROWS_PER_PAGE;
              const shouldPaginate =
                dietRowsExceedLimit || treatmentRowsExceedLimit;

              // If rows exceed limits, paginate by date. Otherwise show all on one page.
              const DAYS_PER_PAGE = shouldPaginate ? 14 : dateCols.length;
              const pages = Math.ceil(dateCols.length / DAYS_PER_PAGE);
              return (
                <>
                  {Array.from({ length: pages }).map((_, pageIndex) => {
                    const start = pageIndex * DAYS_PER_PAGE;
                    const end = start + DAYS_PER_PAGE;
                    const slice = dateCols.slice(start, end);
                    const isLast = pageIndex === pages - 1;
                    return (
                      <div
                        key={pageIndex}
                        className="mb-4 print:p-6 print:border-t-2 print:border-gray-300 print:m-0 p-6"
                        style={{ pageBreakAfter: isLast ? "auto" : "always" }}
                      >
                        {/* Print Header on every page */}
                        <div className="hidden print:block mb-2">
                          <Header
                            onPrint={() => window.print()}
                            canPrint={
                              dateCols.length > 0 &&
                              isAdmissionFormComplete(header)
                            }
                          />
                        </div>
                        <DietPlanTable
                          rows={dietRows}
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

                        <TreatmentPlanTable
                          rows={treatmentRows}
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
            <div className="p-8 print:p-6 text-center py-16 border-2 border-dashed border-blue-200 rounded-lg text-gray-400 m-6 print:m-0 print:rounded-none print:border-0">
              <p className="text-lg">
                Please select an{" "}
                <strong className="text-blue-600">Admission Date</strong> and{" "}
                <strong className="text-blue-600">Discharge Date</strong> to
                generate the chart.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
