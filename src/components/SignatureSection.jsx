const SignatureSection = () => {
  return (
    <div
      className="
        hidden print:block
        print:fixed
        print:bottom-24
        print:left-0
        print:right-0
        px-6
        z-20
      "
    >
      <div className="text-[12px] text-gray-800 leading-snug text-justify mb-3">
        I hereby give my consent for my pet to be admitted and kept as an
        in-patient at MyPet Veterinary Clinic for examination, treatment, and
        monitoring. I confirm that I am aware of and accept these risks and
        agree that the clinic and its staff cannot be held responsible for
        complications or death resulting from the illness or its progression. I
        agree to take full financial responsibility for all treatment and
        hospitalization charges.
      </div>

      <div className="flex justify-between items-end mt-10">
        <div className="text-center">
          <div className="w-32 border-b border-gray-800 h-2 mb-0.5"></div>
          <p className="font-bold text-gray-700 uppercase text-[10px]">
            Doctor Signature
          </p>
        </div>
        <div className="text-center">
          <div className="w-32 border-b border-gray-800 h-2 mb-0.5"></div>
          <p className="font-bold text-gray-700 uppercase text-[10px]">
            Owner Signature
          </p>
        </div>
      </div>
    </div>
  );
};
export default SignatureSection;
