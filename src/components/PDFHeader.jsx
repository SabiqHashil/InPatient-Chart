import Logo from "./Logo";

const PDFHeader = () => {
  return (
    <div className="flex flex-col gap-4 mb-6 print:mx-5">
      {/* --- Letterhead Section (PDF ONLY) --- */}
      <div className="hidden print:flex flex-row justify-between items-center gap-0 border-b-2 border-green-500 pb-2 mb-2">
        {/* Left Side: English Clinic Branding */}
        <div className="w-55 shrink-0 m-1.5">
          <div className="bg-[#005288] text-white px-4 py-2 rounded-tr-[30px]">
            <h2 className="text-base font-bold tracking-tight">
              My<span className="text-green-400">Pet</span> Clinic
            </h2>
            <div className="text-[8px] mt-0.5 opacity-90 font-mono ml-5">
              <p>C.R : 4030323545</p>
              <p>(7005885962)</p>
            </div>
          </div>
        </div>

        {/* Center: Component Logo - Print Only */}
        <div className="hidden print:flex justify-center items-center shrink-0 my-4">
          <img
            src="/mypetsa-logo.png"
            alt="MyPetsa Logo"
            className="w-18 h-18 object-contain"
          />
          {/* Logo Text Container */}
          <div className="flex flex-col border-l-2 border-gray-800 pl-3 print:border-gray-800  print:p-2">
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tighter leading-none  print:text-blue-800">
              IP <span className=" print:text-blue-800">Chart</span>
            </h1>
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest mt-1  print:text-black">
              Observation Record
            </p>
          </div>
        </div>

        {/* Right Side: Arabic Clinic Branding */}
        <div className="w-55 text-right shrink-0 m-1.5" dir="rtl">
          <h2 className="text-lg font-bold text-[#005288]">
            عيادتي <span className="text-green-600">البيطرية الأليفة</span>
          </h2>
          <div className="text-[9px] mt-0.5 text-green-700 font-bold mr-5">
            <p>س ت : ٤٠٣٠٣٢٣٥٤٥</p>
            <p>(٧٠٠٥٨٨٥٩٦٢)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFHeader;
