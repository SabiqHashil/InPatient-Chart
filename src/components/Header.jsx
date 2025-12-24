import React from "react";
import Logo from "./Logo";

const Header = () => {
  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* --- Letterhead Section (PDF ONLY) --- */}
      <div className="hidden print:flex flex-row justify-between items-center gap-4 border-b-2 border-green-500 pb-2 mb-2">
        {/* Left Side: English Clinic Branding */}
        <div className="w-[220px] flex-shrink-0">
          <div className="bg-[#005288] text-white px-4 py-2 rounded-tr-[30px]">
            <h2 className="text-base font-bold tracking-tight">
              MyPet <span className="text-green-400">Clinic</span>
            </h2>
            <div className="text-[8px] mt-0.5 opacity-90 font-mono">
              <p>C.R : 4030323545</p>
              <p>(7005885962)</p>
            </div>
          </div>
        </div>

        {/* Center: Component Logo */}
        <div className="flex justify-center items-center flex-shrink-0">
          <Logo />
        </div>

        {/* Right Side: Arabic Clinic Branding */}
        <div className="w-[220px] text-right flex-shrink-0" dir="rtl">
          <h2 className="text-lg font-bold text-[#005288]">
            عيادتي <span className="text-green-600">البيطرية الأليفة</span>
          </h2>
          <div className="text-[9px] mt-0.5 text-green-700 font-bold">
            <p>س ت : ٤٠٣٠٣٢٣٥٤٥</p>
            <p>(٧٠٠٥٨٨٥٩٦٢)</p>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default Header;
