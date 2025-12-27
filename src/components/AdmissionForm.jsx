import { formatDateDDMonYYYY } from "../utils/dateHelpers";
import {
  formatName,
  formatFileNumber,
  formatCageNo,
  getTodayDate,
  formatWeight,
} from "../utils/validations";

const PATIENT_STAGES = [
  { label: "Normal", color: "bg-green-500 text-white" },
  { label: "Serious", color: "bg-yellow-400 text-black" },
  { label: "Critical", color: "bg-red-500 text-white" },
];

const InputField = ({
  label,
  name,
  type = "text",
  val,
  readOnly = false,
  min,
  onChange,
  formatValue,
}) => (
  <div className="flex flex-col w-full">
    <label className="font-bold text-[10px] sm:text-xs uppercase text-blue-700 mb-0.5 sm:mb-1.5 tracking-tight print:text-[10px] print:mb-0.5">
      {label} <span className="text-red-500 print:hidden">*</span>
    </label>
    {readOnly ? (
      <div className="p-1.5 sm:p-2 bg-blue-100 border border-blue-200 rounded font-bold text-blue-900 h-8 sm:h-9 flex items-center text-xs sm:text-sm overflow-hidden truncate print:p-1 print:h-6 print:text-[12px] print:bg-gray-50 print:border-gray-300">
        {formatValue ? formatValue(val) : val ?? ""}
      </div>
    ) : (
      <input
        type={type}
        name={name}
        value={val ?? ""}
        min={min}
        onChange={onChange}
        className="border border-gray-300 p-1.5 sm:p-2 rounded text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none hover:border-blue-400 bg-white h-8 sm:h-9 transition-all print:p-1 print:h-6 print:text-[9px] print:border-gray-400"
      />
    )}
  </div>
);

const AdmissionForm = ({ data, onChange, totalDays, printMode = false }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (
      ["petName", "ownerName", "doctor", "assistantName", "diagnosis"].includes(
        name
      )
    ) {
      formattedValue = formatName(value);
    } else if (name === "fileNo") {
      formattedValue = formatFileNumber(value);
    } else if (name === "cageNo") {
      formattedValue = formatCageNo(value);
    } else if (name === "weight") {
      formattedValue = formatWeight(value);
    }

    onChange({ target: { name, value: formattedValue } });
  };

  return (
    <div
      className="
        grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 
        gap-x-3 gap-y-3 sm:gap-4 mb-4 p-4 sm:p-6 rounded-lg 
        border-2 border-blue-200 bg-blue-50 shadow-md 
        print:shadow-none print:border print:border-gray-300 print:bg-white print:p-2 print:gap-x-2 print:gap-y-1.5 print:mb-2 print:grid-cols-4 print:mx-5
      "
    >
      {/* Administrative Fields */}
      <InputField
        label="File No"
        name="fileNo"
        val={data.fileNo}
        onChange={handleInputChange}
        readOnly={printMode}
      />
      <InputField
        label="Pet Name"
        name="petName"
        val={data.petName}
        onChange={handleInputChange}
        readOnly={printMode}
      />
      <InputField
        label="Owner Name"
        name="ownerName"
        val={data.ownerName}
        onChange={handleInputChange}
        readOnly={printMode}
      />
      <InputField
        label="Weight"
        name="weight"
        val={data.weight}
        onChange={handleInputChange}
        readOnly={printMode}
      />

      {/* Patient & Staff Details */}
      <InputField
        label="Admission Date"
        name="admissionDate"
        type="date"
        val={data.admissionDate}
        min={getTodayDate()}
        onChange={handleInputChange}
        readOnly={printMode}
        formatValue={formatDateDDMonYYYY}
      />
      <InputField
        label="Discharge Date"
        name="dischargeDate"
        type="date"
        val={data.dischargeDate}
        min={data.admissionDate || getTodayDate()}
        onChange={handleInputChange}
        readOnly={printMode}
        formatValue={formatDateDDMonYYYY}
      />

      <div className={printMode ? "hidden" : ""}>
        <InputField label="No. of Days" name="days" val={totalDays} readOnly />
      </div>

      <InputField
        label="Doctor"
        name="doctor"
        val={data.doctor}
        onChange={handleInputChange}
        readOnly={printMode}
      />
      <InputField
        label="Assistant"
        name="assistantName"
        val={data.assistantName}
        onChange={handleInputChange}
        readOnly={printMode}
      />
      <InputField
        label="Cage No"
        name="cageNo"
        val={data.cageNo}
        onChange={handleInputChange}
        readOnly={printMode}
      />

      {/* Diagnosis */}
      <div className="print:col-span-2">
        <InputField
          label="Diagnosis"
          name="diagnosis"
          val={data.diagnosis}
          onChange={handleInputChange}
          readOnly={printMode}
        />
      </div>

      {/* Patient Stage */}
      <div className="flex flex-col">
        <label className="font-bold text-[10px] sm:text-xs uppercase text-blue-700 mb-0.5 sm:mb-1.5 tracking-tight print:text-[10px] print:mb-0.5">
          Patient Stage <span className="text-red-500 print:hidden">*</span>
        </label>

        {!printMode ? (
          <select
            name="patientStage"
            value={data.patientStage || ""}
            onChange={handleInputChange}
            className="border border-gray-300 p-1.5 sm:p-2 rounded text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none hover:border-blue-400 bg-white h-8 sm:h-9 transition-all print:hidden"
          >
            <option value="" disabled>
              Select Patient Status
            </option>
            {PATIENT_STAGES.map((stage) => (
              <option key={stage.label} value={stage.label}>
                {stage.label}
              </option>
            ))}
          </select>
        ) : data.patientStage ? (
          // Print view - colored badge
          <div
            className={`font-bold text-[12px] w-full text-center py-1 rounded ${
              PATIENT_STAGES.find((s) => s.label === data.patientStage)?.color
            }`}
          >
            {data.patientStage}
          </div>
        ) : (
          // Print view - Not selected
          <div className="font-bold text-[12px] w-full text-center py-1 rounded bg-gray-200 text-black">
            Not Selected
          </div>
        )}
      </div>
    </div>
  );
};

export default AdmissionForm;
