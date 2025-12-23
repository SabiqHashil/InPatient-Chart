import React from "react";

const Logo = () => {
  return (
    /* On mobile: Centered (justify-center)
       On desktop: Left-aligned (lg:justify-start) to match the 3-section grid
    */
    <div className="flex justify-center lg:justify-start items-center py-4 print:py-2">
      <div className="flex items-center gap-3 px-2 sm:px-4">
        
        {/* Logo Image Container */}
        <div className="bg-blue-600 p-1.5 sm:p-2 rounded-xl shadow-sm print:bg-transparent print:p-0 print:shadow-none">
          <img
            src="/mypetsa-logo.png"
            alt="MyPetsa Logo"
            className="w-10 h-10 sm:w-14 sm:h-14 object-contain print:w-12 print:h-12"
          />
        </div>

        {/* Logo Text Container */}
        <div className="flex flex-col border-l-2 border-blue-200 pl-3 print:border-gray-800">
          <h1 className="text-lg sm:text-2xl font-black text-blue-800 uppercase tracking-tighter leading-none print:text-xl print:text-black">
            In-Patient <span className="text-blue-600 print:text-black">Chart</span>
          </h1>
          <p className="text-[10px] sm:text-xs text-gray-500 font-bold uppercase tracking-widest mt-1 print:text-black">
            Medical Records System
          </p>
        </div>
      </div>
    </div>
  );
};

export default Logo;