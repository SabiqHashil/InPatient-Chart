import React, { useState, useRef } from "react";
import AdmissionForm from "../components/AdmissionForm";
import { getDatesInRange } from "../utils/dateHelpers";
import {
  isAdmissionFormComplete,
  updateDocumentTitle,
} from "../utils/validations";
import { triggerPrintPDF } from "../utils/PrintPDF";
import PrintPDFDesign from "../components/PrintPDFDesign";
import RowLimitDialog from "../components/RowLimitDialog";
import "../index.css";
import WebFooter from "../components/WebFooter";
import WebHeader from "../components/WebHeader";

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
    weight: "",
    patientStage: "",
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
    { id: 101, label: "", dose: "", type: "Once" },
  ]);

  const nextId = useRef(1000);

  // --- 3. Handlers ---
  const handleHeaderChange = (e) => {
    setHeader({ ...header, [e.target.name]: e.target.value });
  };

  const updateRow = (setRows, rows, id, field, value) => {
    setRows(rows.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const [deleteDialogState, setDeleteDialogState] = useState({
    isOpen: false,
    tableType: "Diet",
    maxRows: 0,
    dietRowCount: dietRows.length,
    treatmentRowCount: treatmentRows.length,
    maxTotalRows: 11,
    mode: "limit",
  });

  const removeRow = (tableType, setRows, rows, id) => {
    // Prevent deleting the last remaining row in a table
    if (!Array.isArray(rows) || rows.length <= 1) {
      setDeleteDialogState({
        isOpen: true,
        tableType: tableType,
        maxRows: rows.length,
        dietRowCount: dietRows.length,
        treatmentRowCount: treatmentRows.length,
        maxTotalRows: 11,
          mode: "delete-warning",
        });
      return;
    }

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
            onPrint={triggerPrintPDF}
            canPrint={dateCols.length > 0 && isAdmissionFormComplete(header)}
          />

          <AdmissionForm
            data={header}
            onChange={handleHeaderChange}
            totalDays={dateCols.length}
          />
        </div>

        {/* Content Container - PDF Design */}
        <RowLimitDialog
          isOpen={deleteDialogState.isOpen}
          tableType={deleteDialogState.tableType}
          maxRows={deleteDialogState.maxRows}
          dietRowCount={deleteDialogState.dietRowCount}
          treatmentRowCount={deleteDialogState.treatmentRowCount}
          maxTotalRows={deleteDialogState.maxTotalRows}
          mode={deleteDialogState.mode}
          onClose={() =>
            setDeleteDialogState({ ...deleteDialogState, isOpen: false })
          }
        />

        <PrintPDFDesign
          dateCols={dateCols}
          header={header}
          dietRows={dietRows}
          treatmentRows={treatmentRows}
          onHeaderChange={handleHeaderChange}
          onDietUpdate={(id, field, val) =>
            updateRow(setDietRows, dietRows, id, field, val)
          }
          onDietRemove={(id) => removeRow("Diet", setDietRows, dietRows, id)}
          onDietAdd={() =>
            addRow(setDietRows, dietRows, { label: "", type: "Once" })
          }
          onTreatmentUpdate={(id, field, val) =>
            updateRow(setTreatmentRows, treatmentRows, id, field, val)
          }
          onTreatmentRemove={(id) =>
            removeRow("Treatment", setTreatmentRows, treatmentRows, id)
          }
          onTreatmentAdd={() =>
            addRow(setTreatmentRows, treatmentRows, {
              label: "",
              dose: "",
              type: "Twice",
            })
          }
          isAdmissionFormComplete={
            dateCols.length > 0 && isAdmissionFormComplete(header)
          }
        />

        {/* Web-only sticky footer */}
        <div className="bottom-0 left-0 right-0 z-40 print:hidden">
          <WebFooter />
        </div>
      </div>
    </div>
  );
}

export default InPatientChart;
