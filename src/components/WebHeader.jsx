import React from "react";
import Logo from "./Logo";

const WebHeader = ({ onPrint, canPrint = true }) => {
  return (
    <div className="print:hidden mb-6">
      <Logo />
      {/* --- Action Section (Print Button - Web UI Only) --- */}
      <div className="flex justify-end">
        {canPrint && (
          <button
            onClick={onPrint}
            className="bg-blue-600 text-white px-8 py-2.5 rounded-lg font-bold text-sm hover:bg-blue-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105 flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
            Print IP Chart
          </button>
        )}
      </div>
    </div>
  );
};

export default WebHeader;
