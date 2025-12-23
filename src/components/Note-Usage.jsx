import React from "react";

const NoteUsage = () => {
  return (
    <>
      {/* Demo notice - web UI only (hidden in print/PDF) */}
      <div className="mx-8 my-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-900 rounded print:hidden">
        <p className="text-sm font-semibold">Note:</p>
        <p className="text-sm">
          This In-Patient Chart generation is intended solely for demonstration
          and training purposes. No patient information entered will be stored,
          recorded, or retained in the system or web browser. All data entered
          is temporary and session-based.
        </p>
        <p className="mt-2 text-sm font-semibold">Usage:</p>
        <p className="text-sm">
          After completing the admission details, diet plan, and treatment plan,
          users may generate and print the In-Patient Chart or save it as a PDF
          for reference purposes. Any saved PDF is stored only on the user's
          local system. Refreshing the page will clear all entered data,
          allowing a new In-Patient Chart to be generated.
        </p>
      </div>

      <div className="p-8 print:p-6 text-center py-16 border-2 border-dashed border-blue-200 rounded-lg text-gray-400 m-6 print:m-0 print:rounded-none print:border-0">
        <p className="text-lg">
          Please select an
          <strong className="text-blue-600">Admission Date</strong> and{" "}
          <strong className="text-blue-600">Discharge Date</strong> to generate
          the chart.
        </p>
      </div>
    </>
  );
};

export default NoteUsage;
