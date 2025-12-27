const NoteUsage = () => {
  return (
    <div className="flex flex-col gap-4 text-sm">
      {/* User Instructions */}
      <div className="p-4 sm:p-5 bg-blue-50 border-l-4 border-blue-500 rounded-r-md shadow-sm print:hidden">
        <h2 className="font-bold uppercase tracking-wide text-blue-700 mb-2">
          User Instructions for Doctors
        </h2>

        <div className="space-y-2 text-blue-900 leading-relaxed">
          <p>
            <span className="font-semibold">Admission Form:</span> Fill the
            Admission form first. While selecting the{" "}
            <span className="font-semibold">Admission</span> and{" "}
            <span className="font-semibold">Discharge</span> dates, the system
            will automatically generate date-wise columns in the{" "}
            <span className="font-semibold">Diet</span> and{" "}
            <span className="font-semibold">Treatment</span> tables.
          </p>

          <p>
            <span className="font-semibold">Form Completion:</span> Ensure all
            required fields in the Admission form are completed. The{" "}
            <span className="font-semibold">“Print IP Chart”</span> button will
            appear only after mandatory details are filled.
          </p>

          <p>
            <span className="font-semibold">Print & Save:</span> After printing
            the IP Chart, save the generated PDF on your system for future
            reference and documentation.
          </p>

          <p>
            <span className="font-semibold">Error Reporting:</span> During chart
            generation, if any error or bug occurs, please take a screenshot and
            send it to{" "}
            <a
              href="mailto:kabsdigital2020@gmail.com"
              className="text-blue-600 hover:text-blue-800 hover:underline font-semibold  hover:font-bold"
            >
              kabsdigital2020@gmail.com
            </a>{" "}
            along with a brief explanation of the steps to reproduce the issue.
            This helps us fix problems more efficiently.
          </p>
        </div>
      </div>

      {/* Important Note */}
      <div className="p-4 sm:p-5 bg-amber-50 border-l-4 border-amber-500 rounded-r-md shadow-sm print:hidden">
        <h2 className="font-bold uppercase tracking-wide text-amber-700 mb-2">
          Note
        </h2>

        <div className="space-y-2 text-amber-900 leading-relaxed">
          <p>
            This IP Chart Generator is developed only for{" "}
            <span className="font-semibold">training and demonstration</span>{" "}
            purposes for doctors. It can be used for observing IP history,
            follow-ups, and customized charting as required.
          </p>

          <p>
            All entered data is{" "}
            <span className="font-semibold">not stored anywhere</span>. The
            information exists only for the current session to generate and
            print the IP Chart.
          </p>

          <p>
            Once the page is refreshed, all data will be cleared automatically,
            allowing a new IP Chart to be created from scratch.
          </p>
        </div>
      </div>

      {/* Empty State */}
      <div className="py-10 sm:py-12 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-center text-gray-500 print:hidden">
        <p className="font-semibold mb-1">Ready to Generate IP Chart</p>
        <p className="leading-relaxed">
          Select <span className="font-semibold text-blue-600">Admission</span>{" "}
          and <span className="font-semibold text-blue-600">Discharge</span>{" "}
          dates to begin.
        </p>
      </div>
    </div>
  );
};

export default NoteUsage;
