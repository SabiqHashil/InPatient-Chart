import {
  formatName,
  formatFileNumber,
  formatCageNo,
  getTodayDate,
} from "../utils/validations";

// Move InputField outside the main component to avoid creating components during render
const InputField = ({
  label,
  name,
  type = "text",
  val,
  readOnly = false,
  min,
  onChange,
}) => (
  <div className="flex flex-col">
    <label className="font-semibold text-xs uppercase text-blue-600 mb-1.5 tracking-wider">
      {label}
    </label>
    {readOnly ? (
      <div className="p-2.5 bg-blue-100 border-2 border-blue-200 rounded font-bold text-blue-900 h-10 flex items-center text-sm">
        {val ?? ""}
      </div>
    ) : (
      <input
        type={type}
        name={name}
        value={val ?? ""}
        min={min}
        onChange={onChange}
        className="border-2 border-gray-300 p-2.5 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all print:border-0 print:border-b print:rounded-none print:px-0 print:bg-transparent hover:border-blue-400"
      />
    )}
  </div>
);

const AdmissionForm = ({ data, onChange, totalDays, printMode = false }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Apply specific validation logic based on field name
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
    }

    // Call the parent onChange with the formatted value
    onChange({
      target: {
        name,
        value: formattedValue,
      },
    });
  };

  return (
    <div className="grid grid-cols-4 gap-3 mb-6 border-2 border-blue-200 p-6 rounded-lg bg-blue-50 shadow-md print:shadow-none print:border-0 print:bg-white print:border-none print:p-0 print:gap-1 print:mb-4">
      {/* Row 1 */}
      <InputField
        label="File No"
        name="fileNo"
        val={data.fileNo}
        onChange={printMode ? undefined : handleInputChange}
        readOnly={printMode}
      />

      {/* Date fields with 'min' attribute to disable past dates */}
      <InputField
        label="Admission Date"
        name="admissionDate"
        type="date"
        val={data.admissionDate}
        min={getTodayDate()}
        onChange={printMode ? undefined : handleInputChange}
        readOnly={printMode}
      />
      <InputField
        label="Discharge Date"
        name="dischargeDate"
        type="date"
        val={data.dischargeDate}
        min={data.admissionDate || getTodayDate()}
        onChange={printMode ? undefined : handleInputChange}
        readOnly={printMode}
      />

      <InputField
        label="No. of Days"
        name="days"
        val={totalDays}
        readOnly={true}
      />

      {/* Row 2 */}
      <InputField
        label="Pet Name"
        name="petName"
        val={data.petName}
        onChange={printMode ? undefined : handleInputChange}
        readOnly={printMode}
      />
      <InputField
        label="Owner Name"
        name="ownerName"
        val={data.ownerName}
        onChange={printMode ? undefined : handleInputChange}
        readOnly={printMode}
      />
      <InputField
        label="Doctor Name"
        name="doctor"
        val={data.doctor}
        onChange={printMode ? undefined : handleInputChange}
        readOnly={printMode}
      />
      <InputField
        label="Doctor Assistant"
        name="assistantName"
        val={data.assistantName}
        onChange={printMode ? undefined : handleInputChange}
        readOnly={printMode}
      />

      {/* Row 3 */}
      <div className="col-span-1">
        <InputField
          label="Cage No"
          name="cageNo"
          val={data.cageNo}
          onChange={printMode ? undefined : handleInputChange}
          readOnly={printMode}
        />
      </div>
      <div className="col-span-3">
        <InputField
          label="Diagnosis"
          name="diagnosis"
          val={data.diagnosis}
          onChange={printMode ? undefined : handleInputChange}
          readOnly={printMode}
        />
      </div>
    </div>
  );
};

export default AdmissionForm;
