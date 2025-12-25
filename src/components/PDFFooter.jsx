import React from "react";

const PDFFooter = ({ isLastPage = true }) => {
  return (
    <div className="hidden print:block mt-auto print:mx-5">
      {/* Decorative Branding Line from Image 2 */}
      <div className="flex w-full h-3 mb-2">
        <div className="bg-[#56b72a] grow"></div> {/* Green bar */}
        <div className="bg-[#56b72a] w-10 skew-x-30 -ml-2 z-10"></div>{" "}
        {/* Slant */}
        <div className="bg-white w-2 skew-x-30 -ml-2 z-10"></div>
        <div className="bg-[#005288] w-1/3 -ml-4"></div> {/* Blue bar */}
      </div>

      <div className="flex justify-between items-end px-2 pb-2 text-[#005288] font-bold">
        {/* Left Side: English Address & Tel */}
        <div className="flex-1 text-[10px] leading-tight">
          <p>Sari Street, Salama District, Jeddah,</p>
          <p>Saudi Arabia, Tel : 0533318616</p>
        </div>

        {/* Center Side: Digital Contact */}
        {/* Center Side: Digital Contact */}
        <div className="flex-1 text-center text-[10px] leading-tight flex flex-col items-center print:block">
          <p>
            Email:{" "}
            <a
              href="mailto:info@mypetsa.com"
              className="text-blue-600 hover:underline print:text-blue-600 print:no-underline"
            >
              info@mypetsa.com
            </a>
          </p>
          <p>
            Web:{" "}
            <a
              href="https://www.mypetsa.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline print:text-blue-600 print:no-underline"
            >
              www.mypetsa.com
            </a>
          </p>
        </div>

        {/* Right Side: Arabic Address & Mobile */}
        <div className="flex-1 text-right text-[10px] leading-tight" dir="rtl">
          <p>شارع صاري، حي السلامة، جدة، المملكة</p>
          <p>العربية السعودية، جوال: ٠٥٣٣٣١٨٦١٦</p>
        </div>
      </div>

      {/* Generation Timestamp (Bottom edge) */}
    {/*  {isLastPage && (*/}
        <div className="text-center text-[8px] text-gray-400 mt-1 italic border-t border-gray-100">
          Generated on {new Date().toLocaleDateString()}{" "}
          {new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
        </div>
    {/*  )} */}
    </div>
  );
};

export default PDFFooter;
