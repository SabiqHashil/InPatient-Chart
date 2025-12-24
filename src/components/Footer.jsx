import React from "react";

const Footer = ({ isLastPage = true }) => {
  return (
    <div className="hidden print:block mt-2 pt-1.5 border-t border-gray-300">
      <div className="flex flex-col md:flex-row justify-between items-start gap-2 text-[7px] text-gray-600">
        {/* Left: Logo & Clinic Name */}
        <div className="flex-1 flex flex-col items-start">
          <img
            src="/mypetsa-logo.png"
            alt="MyPetsa Logo"
            className="w-5 h-5 object-contain mb-0.5"
          />
          <p className="font-bold text-gray-800 text-[8px]">MyPetsa</p>
          <p className="text-gray-500 text-[7px]">Professional Pet Care</p>
        </div>

        {/* Right: Clinic Details */}
        <div className="flex-1 text-right text-[7px]">
          <h3 className="font-bold text-gray-800 mb-0.5 text-[8px]">
            Clinic Information
          </h3>
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
        <div className="mt-1 pt-1 border-t border-gray-200 text-center text-[7px] text-gray-500">
          <p className="mt-0.5">
            Generated on {new Date().toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default Footer;
