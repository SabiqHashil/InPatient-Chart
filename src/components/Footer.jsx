
const Footer = ({ isLastPage = true }) => {
  return (
    <div className="hidden print:block mt-4 pt-2 border-t border-gray-300">
      <div className="flex justify-between items-start gap-4 text-xs text-gray-600">
        {/* Left: Logo & Clinic Name */}
        <div className="flex-1 flex flex-col items-start">
          <img
            src="/mypetsa-logo.png"
            alt="MyPetsa Logo"
            className="w-8 h-8 object-contain mb-1"
          />
          <p className="font-bold text-gray-800 text-xs">MyPetsa</p>
          <p className="text-gray-500 text-xs">Professional Pet Care</p>
        </div>

        {/* Right: Clinic Details */}
        <div className="flex-1 text-right text-xs">
          <h3 className="font-bold text-gray-800 mb-1">Clinic Information</h3>
          <p className="font-semibold text-gray-700">
            MyPetsa Veterinary Clinic
          </p>
          <p>Address: 123 Pet Street, Animal City, AC 12345</p>
          <p>Phone: +1 (555) 123-4567</p>
          <p>Email: info@mypetsa.com</p>
          <p>Website: www.mypetsa.com</p>
        </div>
      </div>

      {/* Bottom line - only on last page */}
      {isLastPage && (
        <div className="mt-2 pt-2 border-t border-gray-200 text-center text-xs text-gray-500">
          <p>© 2025 MyPetsa Veterinary Clinic. All rights reserved.</p>
          <p className="mt-0.5 text-xs">
            Generated on {new Date().toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default Footer;
