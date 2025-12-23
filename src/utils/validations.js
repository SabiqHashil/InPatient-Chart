// Function to capitalize the first letter of every word
export const formatName = (value) => {
  if (value == null) return "";
  const str = String(value);
  // Preserve a trailing space while typing so the user can continue to the next word
  const hasTrailingSpace = /\s$/.test(str);
  // Split on any whitespace, ignore empty parts
  const parts = str
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
  const joined = parts.join(" ");
  return hasTrailingSpace && joined ? `${joined} ` : joined;
};

// Function to allow only numbers for File No
export const formatFileNumber = (value) => {
  if (!value) return "";
  return String(value).replace(/\D/g, ""); // Removes any non-digit character
};

// Function to format Cage No (Example: IP 1)
export const formatCageNo = (value) => {
  if (!value) return "";
  let v = String(value)
    .toUpperCase()
    .replace(/[^A-Z0-9 ]+/g, "")
    .trim();
  // Ensure a space between letters and numbers (e.g. IP1 -> IP 1)
  v = v.replace(/^([A-Z]+)(\d+)$/, "$1 $2");
  return v;
};

// Get today's date in YYYY-MM-DD format for the "min" attribute
export const getTodayDate = () => {
  return new Date().toISOString().split("T")[0];
};

// Specific for medications to handle mixed casing if needed,
// but defaulting to Standard Title Case for now.
export const formatMedicine = (value) => formatName(value);

// Validate that all required admission form fields are filled
export const isAdmissionFormComplete = (header) => {
  const requiredFields = [
    "fileNo",
    "petName",
    "ownerName",
    "doctor",
    "assistantName",
    "cageNo",
    "diagnosis",
    "admissionDate",
    "dischargeDate",
  ];
  return requiredFields.every((field) => {
    const val = header[field];
    return val != null && String(val).trim().length > 0;
  });
};

// Generate PDF filename from file number
export const generatePdfFilename = (fileNo) => {
  if (!fileNo) return "chart.pdf";
  const sanitized = String(fileNo).replace(/[^a-zA-Z0-9]/g, "");
  return `chart_${sanitized}.pdf`;
};
