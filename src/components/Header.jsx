import Logo from "./Logo";

const Header = () => {
  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* --- Letterhead Section (PDF ONLY) --- */}
      <div className="hidden print:flex flex-row justify-between items-center gap-4 border-b-2 border-green-500 pb-2 mb-2">
        {/* Left Side: English Clinic Branding */}
        <div className="w-[220px] flex-shrink-0 m-1.5">
          <div className="bg-[#005288] text-white px-4 py-2 rounded-tr-[30px]">
            <h2 className="text-base font-bold tracking-tight">
              My<span className="text-green-400">Pet</span> Clinic
            </h2>
            <div className="text-[8px] mt-0.5 opacity-90 font-mono">
              <p>C.R : 4030323545</p>
              <p>(7005885962)</p>
            </div>
          </div>
        </div>

        {/* Center: Component Logo - Print Only */}
        <div className="hidden print:flex justify-center items-center flex-shrink-0 mb-4">
          <img
            src="/mypetsa-logo.png"
            alt="MyPetsa Logo"
            className="w-24 h-24 object-contain"
          />
          {/* Logo Text Container */}
          <div className="flex flex-col border-l-2 border-gray-800 pl-3">
            <h1 className="text-xl font-black text-black uppercase tracking-tighter leading-none">
              IP <span>Chart</span>
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-widest mt-1">
              Observation Record
            </p>
          </div>
        </div>

        {/* Right Side: Arabic Clinic Branding */}
        <div className="w-[220px] text-right flex-shrink-0 m-1.5" dir="rtl">
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
