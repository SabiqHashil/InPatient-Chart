const PDFFooter = ({ isLastPage = true }) => {
  return (
    <div className="hidden print:block mt-auto print:mx-5">
      <div className="flex justify-between items-end px-2 pb-2 text-[#005288] font-bold">
        {/* Left Side: English Address & Tel */}
        <div className="flex-1 text-[10px] leading-tight">
          <p>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Sari+Street,+Salama+District,+Jeddah,+Saudi+Arabia"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Sari Street, Salama District, Jeddah,
            </a>
          </p>
          <p>
            <a
              href="tel:+966533318616"
              className="text-blue-600 hover:underline"
            >
              Tel : 0533318616
            </a>
          </p>
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
          <p>
            <a
              https:target="_blank" //www.google.com/maps/search/?api=1&query=Sari+Street,+Salama+District,+Jeddah,+Saudi+Arabia"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              شارع صاري، حي السلامة، جدة،
            </a>
          </p>
          <p>
            <a
              href="tel:+966533318616"
              className="text-blue-600 hover:underline"
            >
              العربية السعودية، جوال: ٠٥٣٣٣١٨٦١٦
            </a>
          </p>
        </div>
      </div>

      {/* Decorative Branding Line from Image 2 */}
      <div className="flex w-full h-3 mb-2">
        <div className="bg-[#56b72a] grow"></div> {/* Green bar */}
        <div className="bg-[#56b72a] w-10 skew-x-30 -ml-2 z-10"></div>{" "}
        {/* Slant */}
        <div className="bg-white w-2 skew-x-30 -ml-2 z-10"></div>
        <div className="bg-[#005288] w-1/3 -ml-4"></div> {/* Blue bar */}
      </div>

      {/* Generation Timestamp (Bottom edge) */}
      <div className="text-center text-[8px] text-gray-400 mt-1 italic border-t border-gray-100">
        Generated on {new Date().toLocaleDateString()}{" "}
        {new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })}
      </div>
    </div>
  );
};

export default PDFFooter;
