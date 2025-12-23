import React from "react";
import {
  formatName,
  formatFileNumber,
  formatCageNo,
  getTodayDate,
} from "../utils/validations";

const InputField = ({
  label,
  name,
  type = "text",
  val,
  readOnly = false,
  min,
  onChange,
}) => (
  <div className="flex flex-col w-full">
    <label className="font-bold text-[10px] sm:text-xs uppercase text-blue-700 mb-0.5 sm:mb-1.5 tracking-tight">
      {label}
    </label>
    {readOnly ? (
      <div className="p-1.5 sm:p-2 bg-blue-100 border border-blue-200 rounded font-bold text-blue-900 h-8 sm:h-9 flex items-center text-xs sm:text-sm overflow-hidden truncate">
        {val ?? ""}
      </div>
    ) : (
      <input
        type={type}
        name={name}
        value={val ?? ""}
        min={min}
        onChange={onChange}
        className="border border-gray-300 p-1.5 sm:p-2 rounded text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none hover:border-blue-400 bg-white h-8 sm:h-9 transition-all"
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
    }
    onChange({ target: { name, value: formattedValue } });
  };

  return (
    <div
      className="
      /* Layout Config */
      grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 
      gap-x-3 gap-y-3 sm:gap-4 mb-4 p-4 sm:p-6 rounded-lg 
      border-2 border-blue-200 bg-blue-50 shadow-md 
      /* Print Config */
      print:shadow-none print:border-0 print:bg-white print:p-0 print:gap-2 print:mb-4
    "
    >
      {/* 1. Administrative Details */}
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
        label="Cage No"
        name="cageNo"
        val={data.cageNo}
        onChange={handleInputChange}
        readOnly={printMode}
      />
      {/* 2. Patient & Staff Details */}
      <InputField
        label="Admission Date"
        name="admissionDate"
        type="date"
        val={data.admissionDate}
        min={getTodayDate()}
        onChange={handleInputChange}
        readOnly={printMode}
      />
      <InputField
        label="Discharge Date"
        name="dischargeDate"
        type="date"
        val={data.dischargeDate}
        min={data.admissionDate || getTodayDate()}
        onChange={handleInputChange}
        readOnly={printMode}
      />

      <InputField
        label="No. of Days"
        name="days"
        val={totalDays}
        readOnly={true}
      />

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

      {/* 3. Diagnosis Section (Full Width)
          - On mobile (2 cols): col-span-2
          - On large (3 cols): col-span-3 
      */}
      <div className="col-span-2 lg:col-span-3">
        <InputField
          label="Diagnosis"
          name="diagnosis"
          val={data.diagnosis}
          onChange={handleInputChange}
          readOnly={printMode}
        />
      </div>
    </div>
  );
};

export default AdmissionForm;
