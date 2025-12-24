import React from "react";

const SignatureSection = () => {
  return (
    /* Hidden from web UI, shown only in PDF/Print */
    <div className="hidden print:flex flex-col mt-3 px-4 gap-3">
      {/* Consent Note */}
      <div className="text-[8px] text-gray-800 leading-snug text-justify">
        I hereby give my consent for my cat to be admitted and kept as an
        in-patient at MyPet Veterinary Clinic for examination, treatment, and
        monitoring. I confirm that I am aware of and accept these risks and
        agree that the clinic and its staff cannot be held responsible for
        complications or death resulting from the illness or its progression. I
        agree to take full financial responsibility for all treatment and
        hospitalization charges.
      </div>

      {/* Signatures Section */}
      <div className="flex justify-between items-end mt-1">
        {/* Doctor Signature */}
        <div className="text-center">
          <div className="w-32 border-b border-gray-800 h-2 mb-0.5"></div>
          <p className="font-bold text-gray-700 uppercase text-[8px]">
            Doctor Signature
          </p>
        </div>

        {/* Owner Signature */}
        <div className="text-center">
          <div className="w-32 border-b border-gray-800 h-2 mb-0.5"></div>
          <p className="font-bold text-gray-700 uppercase text-[8px]">
            Owner Signature
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignatureSection;
