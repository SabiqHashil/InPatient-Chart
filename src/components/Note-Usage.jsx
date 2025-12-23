import React from "react";

const NoteUsage = () => {
  return (
    <div className="flex flex-col gap-4">
      {/* Demo notice - Optimized for mobile & large screen alignment */}
      <div className="mx-0 sm:mx-0 my-2 p-3 sm:p-5 bg-amber-50 border-l-4 border-amber-400 text-amber-900 rounded-r-lg shadow-sm print:hidden">
        <div className="flex flex-col gap-2">
          <section>
            <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-amber-700">
              Note:
            </p>
            <p className="text-xs sm:text-sm leading-relaxed">
              This In-Patient Chart generation is intended solely for
              demonstration and training purposes. No patient information
              entered will be stored, recorded, or retained. All data is
              temporary and session-based.
            </p>
          </section>

          <section className="mt-1 border-t border-amber-200 pt-2">
            <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-amber-700">
              Usage:
            </p>
            <p className="text-xs sm:text-sm leading-relaxed">
              Complete the admission, diet, and treatment plans, then use the
              <strong className="text-amber-800"> Print Chart</strong> button to
              save as PDF. Refreshing the page will clear all data for a new
              session.
            </p>
          </section>
        </div>
      </div>

      {/* Empty State / Placeholder: 
          Centered text with a responsive dash-border box 
      */}
      <div className="px-6 py-12 sm:py-20 border-2 border-dashed border-blue-200 rounded-xl bg-gray-50/50 text-gray-400 text-center transition-all print:hidden">
        <div className="max-w-md mx-auto flex flex-col items-center gap-3">
          {/* Visual Icon for "Select Dates" */}
          <svg
            className="w-10 h-10 text-blue-200"
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

          <p className="text-sm sm:text-lg leading-snug">
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
