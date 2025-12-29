# InPatient Medical Chart Generator

Professional multi-page A4 Landscape PDF generator for veterinary and clinical medical charting.

## Overview

InPatient Chart Generator is a React-based web application designed to create standardized, multi-page medical charts for clinical and veterinary use. It combines a responsive web interface with print-optimized PDF generation using intelligent pagination.

**Perfect for:** Veterinary clinics, animal hospitals, clinical research facilities, and medical charting systems.

## Key Features

✅ **Smart Pagination**
- 15 days per page (automatically splits long admissions)
- Row overflow handling (diet & treatment items continue on new pages)
- Intelligent page distribution (6-7 items page 1, 5-6 on overflow)

✅ **Dynamic Forms**
- Real-time validation with auto-formatting
- Title case for names, uppercase for file numbers
- Smart date calculations (prevents past dates)
- Pre-filled default items

✅ **Professional Output**
- A4 Landscape PDF format
- Multi-page support with proper page breaks
- Clean headers and footers on all pages
- Signature section on first page
- Watermark logo on print

✅ **User-Friendly Interface**
- Responsive design (mobile, tablet, desktop)
- Add/remove diet and treatment items dynamically
- Real-time frequency toggle (Once/Twice daily)
- One-click print to PDF

✅ **No Backend Required**
- Runs entirely in browser
- Local data storage (no external APIs)
- Works offline

## Technology Stack

| Tech | Version | Purpose |
|------|---------|---------|
| React | 19.2 | UI Framework |
| Vite | 7.2 | Build & Dev Server |
| Tailwind CSS | 4.1 | Responsive Styling |
| ESLint | 9.39 | Code Quality |
| Node.js | Latest | Runtime |

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser

### 3. Build for Production
```bash
npm run build
```

### 4. Preview Production Build
```bash
npm run preview
```

## How to Use

### Step 1: Fill Patient Information
- File Number (e.g., VP-2025-001)
- Pet Name
- Owner Name
- Doctor Name
- Assistant Name
- Cage Number
- Diagnosis
- Weight
- Patient Stage

### Step 2: Select Dates
- Admission Date (required)
- Discharge Date (required)
- System auto-calculates duration

### Step 3: Add Diet Monitoring Items
- Click "+ Add Diet Row"
- Pre-filled defaults: Food, Water, Urine, Stool, Vomiting
- Set frequency: Once or Twice daily
- Remove items as needed

### Step 4: Add Treatment Items
- Click "+ Add Treatment Row"
- Enter medication name
- Enter dosage
- Set frequency: Once or Twice daily
- Remove items as needed

### Step 5: Print to PDF
- Click "Print IP Chart" button
- Browser print dialog opens
- Select "Save as PDF"
- Choose save location
- Done!

## File Architecture

```
src/
├── Pages/
│   └── InPatientChart.jsx           Main component (state, web UI)
├── components/
│   ├── PrintPDFDesign.jsx           PDF layout & pagination
│   ├── AdmissionForm.jsx            Patient information form
│   ├── DietPlanTable.jsx            Diet tracking table
│   ├── TreatmentPlanTable.jsx       Medication tracking table
│   ├── SignatureSection.jsx         Signature section (print only)
│   ├── WebHeader.jsx                Web interface header
│   ├── WebFooter.jsx                Web interface footer
│   ├── PDFHeader.jsx                PDF page header
│   ├── PDFFooter.jsx                PDF page footer
│   └── Note-Usage.jsx               Usage instructions
├── utils/
│   ├── PrintPDF.js                  Print trigger functions
│   ├── dateHelpers.js               Date calculations
│   └── validations.js               Form validation & formatting
└── index.css                        Global styles
```

## Component Responsibilities

| Component | Role |
|-----------|------|
| **InPatientChart.jsx** | State management, web UI layout, form handlers |
| **PrintPDFDesign.jsx** | PDF layout, multi-page pagination, print styling |
| **AdmissionForm.jsx** | Patient information input form |
| **DietPlanTable.jsx** | Diet monitoring table with add/remove rows |
| **TreatmentPlanTable.jsx** | Medication tracking with dynamic rows |
| **PrintPDF.js** | Reusable print trigger utility functions |

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Print button disabled | Complete all required fields in admission form |
| Blank pages in PDF | Check browser print settings: set Margins to "None" |
| Missing data on page 2+ | Normal - data is paginated across pages |
| Formatting looks wrong | Verify browser zoom is 100%, check print margins |
| Can't find print dialog | Some browsers require manual print: `Ctrl+P` or `Cmd+P` |

## Browser Compatibility

✅ Chrome/Chromium (recommended)
✅ Firefox
✅ Safari
✅ Edge

## Performance

- **Load Time:** < 2 seconds
- **Print Time:** < 1 second
- **PDF Size:** 50-150 KB (depending on data)
- **Memory Usage:** Minimal (no external dependencies)

## Security & Privacy

- ✅ No external API calls
- ✅ No data sent to servers
- ✅ Runs entirely in browser
- ✅ All data stored locally
- ✅ Safe to use with sensitive patient information

## Support

See **DEVELOPER_GUIDE.md** for technical details.
