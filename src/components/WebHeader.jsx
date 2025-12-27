const WebHeader = ({ onPrint, canPrint = true }) => {
  return (
    <div className="mb-8 relative">
      {/* Header Container */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center sm:relative gap-3 sm:gap-5">
        {/* Logo + Text */}
<div className="flex items-center justify-center sm:justify-start gap-2 mx-auto sm:mx-0">
          {/* Logo */}
          <div className="bg-white p-1.5 sm:p-2 rounded-xl shadow-lg flex-shrink-0">
            <img
              src="/mypetsa-logo.png"
              alt="MyPetsa Logo"
              className="w-10 h-10 sm:w-14 sm:h-14 object-contain"
            />
          </div>

          {/* Logo Text */}
          <div className="flex flex-col border-l-2 border-blue-200 pl-3">
            <h1 className="text-lg sm:text-2xl font-black text-blue-800 uppercase tracking-tighter leading-none">
              IP <span className="text-blue-600">Chart</span> Generator
            </h1>
            <p className="text-[10px] sm:text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">
              MyPet Veterinary Clinic
            </p>
          </div>
        </div>

        {/* Print Button */}
        {canPrint && (
          <div className="sm:absolute sm:right-0 sm:top-0 flex justify-center mt-1 sm:mt-0">
            <button
              onClick={onPrint}
              className="bg-blue-600 text-white px-3 sm:px-5 py-2 rounded-lg font-bold text-sm
                         hover:bg-blue-700 transition-all shadow-md hover:shadow-lg
                         transform hover:scale-105 flex items-center gap-1"
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
          </div>
        )}
      </div>
    </div>
  );
};

export default WebHeader;
