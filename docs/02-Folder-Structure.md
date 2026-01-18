# 📂 Folder Structure & File Responsibilities

This document provides a detailed map of the project structure to help developers locate logic and assets quickly.

## Root Directory

| File/Folder | Purpose |
|-------------|---------|
| `src/` | Main source code for the application. |
| `public/` | Static assets served directly (favicons, manifest, robots.txt). |
| `scripts/` | Node.js utility scripts for automation. |
| `docs/` | Project documentation (this folder). |
| `index.html` | Entry HTML file. |
| `vite.config.js` | Vite build configuration changes. |
| `tailwind.config.js` | (Explicit or Implicit) Tailwind CSS configuration. |
| `package.json` | Project metadata, scripts, and dependencies. |
| `DEVELOPER_GUIDE.md` | **Legacy** developer guide (superseded by `docs/`). |
| `README.md` | Main entry point for the project. |

## `src/` Directory

### `src/Pages/`
Top-level page components.
- **`InPatientChart.jsx`**: The main controller component. It holds the "Source of Truth" state for the entire chart (Header data, Diet rows, Treatment rows).

### `src/components/`
Reusable UI blocks.

| Component | Responsibility |
|-----------|----------------|
| **`PrintPDFDesign.jsx`** | **Critical**. The layout engine that arranges the A4 page and calculates row allocations. |
| **`AdmissionForm.jsx`** | Form inputs for patient demographics (Name, ID, Dates). |
| **`DietPlanTable.jsx`** | Table for daily observation logs (Food, Water, etc.). |
| **`TreatmentPlanTable.jsx`** | Table for medication logs. |
| **`AllocationMatrix.js`** | *Note: Often located in utils, but if present here, it contains specific matrix UI.* |
| **`PDFHeader.jsx`** | Static header for the print view containing Clinic Logo/Title. |
| **`PDFFooter.jsx`** | Static footer for print view (page numbers, ISO codes). |
| **`SignatureSection.jsx`** | Area for Vet/Owner signatures at the bottom of the PDF. |
| **`RowLimitDialog.jsx`** | Modal that alerts users when they hit the `D+T=11` limit. |
| **`WebHeader/WebFooter.jsx`** | UI elements visible ONLY on screen (Save buttons, copyright). |
| **`Note-Usage.jsx`** | Helper component showing usage hints. |

### `src/utils/`
Pure JavaScript helper functions (Business Logic).

- **`AllocationMatrix.js`**: Contains the mathematical logic for the `D + T = 11` formula. Generates valid combinations.
- **`validations.js`**: Input validation functions (e.g., ensuring dates are valid, fields aren't empty).
- **`dateHelpers.js`**: Utilities for date math (calculating length of stay, formatting dates).
- **`PrintPDF.js`**: Triggers the browser's native print dialog.

### `scripts/`
Automation tools.

- **`print-pdf.js`**: A Puppeteer script to headless-render the React app into a PDF file. Usage: `node scripts/print-pdf.js <url> <output.pdf>`.
- **`print-server.js`**: Simple Express/Http server to serve the build for the print script.

## 🗑️ Cleanup Note

Files like `ALLOCATION_MATRIX-LOGIC.md` in the root are now deprecated and their content has been moved to `docs/03-Business-Logic.md`.
