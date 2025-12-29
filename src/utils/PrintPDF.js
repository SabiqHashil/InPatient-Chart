/**
 * PrintPDF Utility
 * ================
 * Handles PDF printing functionality for InPatient Chart
 * 
 * Usage:
 *   import { triggerPrintPDF } from "../utils/PrintPDF";
 *   
 *   <button onClick={() => triggerPrintPDF()}>
 *     Print PDF
 *   </button>
 */

/**
 * Trigger PDF Print Dialog
 * Opens browser's native print dialog to generate PDF
 * 
 * @function triggerPrintPDF
 * @returns {void}
 * 
 * @example
 * // Simple usage
 * triggerPrintPDF();
 * 
 * @example
 * // With button click
 * <button onClick={triggerPrintPDF}>Print Chart</button>
 */
export const triggerPrintPDF = () => {
  window.print();
};

/**
 * Trigger PDF Print Dialog with Custom Options
 * Opens browser's native print dialog with optional configuration
 * 
 * @function triggerPrintPDFWithOptions
 * @param {Object} options - Configuration options
 * @param {string} options.filename - PDF filename (for download)
 * @param {number} options.delay - Delay before printing in milliseconds
 * @returns {void}
 * 
 * @example
 * // Print after 1 second with custom filename
 * triggerPrintPDFWithOptions({
 *   filename: "patient-chart-2025.pdf",
 *   delay: 1000
 * });
 */
export const triggerPrintPDFWithOptions = (options = {}) => {
  const { filename = "InPatient-Chart.pdf", delay = 0 } = options;

  // Set browser filename for PDF download
  if (filename && delay === 0) {
    // Note: Filename is suggested in print dialog (browser-dependent)
    const title = document.title;
    document.title = filename.replace(".pdf", "");
  }

  // Wait specified delay before printing
  if (delay > 0) {
    setTimeout(() => {
      window.print();
    }, delay);
  } else {
    window.print();
  }

  // Restore original title after short delay
  if (filename) {
    setTimeout(() => {
      document.title = document.title;
    }, 100);
  }
};

/**
 * Check if Print is Available
 * Determines if browser supports printing
 * 
 * @function isPrintAvailable
 * @returns {boolean} True if print is available
 * 
 * @example
 * if (isPrintAvailable()) {
 *   // Show print button
 * }
 */
export const isPrintAvailable = () => {
  return typeof window !== "undefined" && window.print;
};

/**
 * Print and Auto-Download PDF
 * Opens print dialog and may trigger download (browser-dependent)
 * 
 * @function printAndDownload
 * @param {string} filename - Desired PDF filename
 * @returns {void}
 * 
 * @example
 * printAndDownload("patient-chart.pdf");
 */
export const printAndDownload = (filename = "InPatient-Chart.pdf") => {
  // Update document title temporarily
  const originalTitle = document.title;
  document.title = filename.replace(".pdf", "");

  // Trigger print
  window.print();

  // Restore title
  setTimeout(() => {
    document.title = originalTitle;
  }, 100);
};

/**
 * Print PDF with Page Setup
 * Opens print dialog (browser determines actual settings)
 * 
 * @function printPDFWithPageSetup
 * @param {Object} pageSetup - Page setup info (informational only)
 * @param {string} pageSetup.orientation - "portrait" or "landscape"
 * @param {string} pageSetup.size - Paper size ("A4", "letter")
 * @returns {void}
 * 
 * @example
 * printPDFWithPageSetup({
 *   orientation: "landscape",
 *   size: "A4"
 * });
 */
export const printPDFWithPageSetup = (pageSetup = {}) => {
  const { orientation = "landscape", size = "A4" } = pageSetup;

  // Note: Page setup is handled by CSS media queries in the application
  // Tailwind CSS @print rules handle the layout (see InPatientChart.jsx)
  // Browser user settings determine final output
  
  window.print();
};

export default {
  triggerPrintPDF,
  triggerPrintPDFWithOptions,
  isPrintAvailable,
  printAndDownload,
  printPDFWithPageSetup,
};
