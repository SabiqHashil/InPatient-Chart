import React from "react";

const NoteUsage = () => {
  return (
    <div className="flex flex-col gap-4">
      {/* Usage Guide Section */}
      <div className="mx-0 my-2 p-3 sm:p-5 bg-blue-50 border-l-4 border-blue-400 text-blue-900 rounded-r-lg shadow-sm print:hidden">
        <div className="flex flex-col gap-2">
          <section>
            <p className="text-xs sm:text-sm md:text-base font-black uppercase tracking-widest text-blue-700">
              Usage Guide:
            </p>
            <p className="text-xs sm:text-sm md:text-base leading-relaxed">
              1. Fill out the Admission, Diet, and Treatment forms. <br />
              2. Click <strong className="text-blue-800">Print Chart</strong> to save a PDF. <br />
              3. Refreshing the page clears all temporary data for a new session.
            </p>
          </section>
        </div>
      </div>

      {/* Important Note Section */}
      <div className="mx-0 my-2 p-3 sm:p-5 bg-amber-50 border-l-4 border-amber-400 text-amber-900 rounded-r-lg shadow-sm print:hidden">
        <div className="flex flex-col gap-2">
          <section>
            <p className="text-xs sm:text-sm md:text-base font-black uppercase tracking-widest text-amber-700">
              Note:
            </p>
            <p className="text-xs sm:text-sm md:text-base leading-relaxed">
              This In-Patient Chart tool is for demonstration and training only. <br />
              No real patient data is stored. All entries are temporary and session-based. <br />
              Doctors can safely practice charting and PDF generation.
            </p>
          </section>
        </div>
      </div>

      {/* Empty State / Placeholder */}
      <div className="px-6 py-12 sm:py-20 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50/50 text-gray-400 text-center transition-all print:hidden">
        <div className="max-w-md mx-auto flex flex-col items-center gap-3">
          {/* Calendar Icon */}
          <svg
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>

          <p className="text-sm sm:text-base md:text-lg leading-snug">
            Please select an
            <span className="block sm:inline font-bold text-blue-600 mx-1">
              Admission Date
            </span>
            and
            <span className="block sm:inline font-bold text-blue-600 mx-1">
              Discharge Date
            </span>
            to generate the chart.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NoteUsage;