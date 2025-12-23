
const SignatureSection = () => {
  return (
    /* Hidden from web UI, shown only in PDF/Print.
       - Doctor Signature left-aligned, Owner Signature right-aligned.
    */
    <div className="hidden print:flex justify-between items-center mt-8 px-12 print:mt-auto print:mb-2">
      {/* Doctor Signature */}
      <div className="text-center">
        <div className="w-40 border-b-2 border-gray-800 h-6 mb-1"></div>
        <p className="font-bold text-gray-700 uppercase text-xs">
          Doctor Signature
        </p>
      </div>

      {/* Owner Signature */}
      <div className="text-center">
        <div className="w-40 border-b-2 border-gray-800 h-6 mb-1"></div>
        <p className="font-bold text-gray-700 uppercase text-xs">
          Owner Signature
        </p>
      </div>
    </div>
  );
};

export default SignatureSection;
