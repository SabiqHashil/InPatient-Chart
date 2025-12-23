import React from "react";

const WebFooter = () => {
  return (
    <footer className="mt-auto py-8 px-4 border-t border-gray-100 print:hidden">
      <div className="flex flex-col items-center justify-center gap-1">
        {/* Link with hover effect and security attributes */}
        <a
          href="https://www.kabsdigital.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 font-bold text-sm sm:text-base tracking-tight transition-colors"
        >
          Kabs Digital
        </a>

        {/* Tagline with responsive font sizing */}
        <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-[0.2em] font-medium">
          Innovations In One Click
        </p>
      </div>
    </footer>
  );
};

export default WebFooter;
