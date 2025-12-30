# InPatient Chart Application

## 📋 Project Overview

**InPatient Chart** is a web-based clinical documentation tool designed for veterinary clinics and hospitals. It provides an A4-optimized digital form for recording patient admission details, diet observations, and treatment plans during patient stays.

### 🎯 Key Features

- **Digital Admission Form** - Record patient info, diagnosis, and stay duration
- **Diet Plan Tracking** - Monitor diet observations (food, water, urine, stool, vomiting) across multiple days
- **Treatment Plan Logging** - Document treatment entries with dosage and frequency information
- **Dynamic Row Allocation** - Intelligent system that automatically balances Diet and Treatment table sizes based on the formula: **D + T = TT** (where TT = 11, representing A4 page capacity)
- **A4-Optimized PDF Export** - Generate professional, print-ready PDF documents
- **Responsive Design** - Works on desktop, tablet, and mobile devices
- **Print-Friendly UI** - Automatic PDF generation when printing to PDF

---

## 🏗️ Project Structure

```
InPatient-Chart/
├── public/                          # Static assets
├── scripts/                         # Utility scripts
│   ├── print-pdf.js                # PDF generation handler
│   └── print-server.js             # Development server for PDF preview
├── src/
│   ├── components/                 # React UI components
│   │   ├── AdmissionForm.jsx      # Patient info input form
│   │   ├── DietPlanTable.jsx      # Diet observations table
│   │   ├── TreatmentPlanTable.jsx # Treatment entries table
│   │   ├── PrintPDFDesign.jsx     # PDF layout & allocation logic
│   │   ├── PDFHeader.jsx          # PDF page header
│   │   ├── PDFFooter.jsx          # PDF page footer
│   │   ├── SignatureSection.jsx   # Signature area
│   │   ├── RowLimitDialog.jsx     # Row limit warning dialog
│   │   ├── WebHeader.jsx          # Web UI header (not in PDF)
│   │   ├── WebFooter.jsx          # Web UI footer (not in PDF)
│   │   └── Note-Usage.jsx         # Usage notes display
│   ├── Pages/
│   │   └── InPatientChart.jsx     # Main page component
│   ├── utils/                      # Utility functions
│   │   ├── AllocationMatrix.js    # Row allocation logic utilities
│   │   ├── dateHelpers.js         # Date manipulation functions
│   │   ├── validations.js         # Form & data validation
│   │   └── PrintPDF.js            # PDF export utilities
│   ├── App.jsx                     # Root component
│   ├── main.jsx                    # App entry point
│   └── index.css                   # Global styling
├── index.html                      # HTML template
├── package.json                    # Dependencies & scripts
├── vite.config.js                  # Build configuration
└── eslint.config.js               # Linting configuration
```

---

## 🚀 Getting Started

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd InPatient-Chart

# Install dependencies
npm install
```

### Development

```bash
# Start development server (runs on http://localhost:5173)
npm run dev
```

### Building

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

### Quality Checks

```bash
# Run ESLint to check code quality
npm run lint
```

---

## 💡 How It Works

### 1. **Patient Admission**
- User enters patient information (name, owner, diagnosis, dates, etc.)
- System calculates total days from admission to discharge

### 2. **Dynamic Row Allocation**
The system uses intelligent allocation logic:
- **Total Capacity (TT)** = 11 rows per A4 page
- **Formula**: D (Diet rows) + T (Treatment rows) = 11
- **Dynamic Calculation**: When adding rows to one table, the other table's maximum capacity adjusts to maintain the balance
- **Example**: If Diet has 5 rows and Treatment has 1 row, you can still add up to 6 more Treatment rows (5+6=11) or grow Diet to 10 if Treatment stays at 1

### 3. **Data Entry**
- Enter diet observations (Food, Water, Urine, Stool, Vomiting) for each day
- Enter treatment details (medication name, dosage, frequency) for each day
- System prevents deleting the last row in each table (minimum 1 row required)
- Dialog warns user if they try to perform invalid actions

### 4. **PDF Generation**
- Click "Print" button in the web interface
- Select "Save as PDF" from the print dialog
- System automatically formats data into A4-sized pages
- Includes header, footer, signature section, and all entered data

---

## 🎨 Technology Stack

- **Frontend Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **Styling**: Tailwind CSS 4.1.18
- **PDF Export**: Browser's native print API
- **Code Quality**: ESLint 9.39.1
- **Package Manager**: npm

---

## 📱 Key Components

### PrintPDFDesign.jsx
Main component handling:
- PDF page layout and pagination
- Dynamic row allocation logic (D+T=TT formula)
- Coordinating Diet and Treatment tables
- Multi-page support

### DietPlanTable.jsx & TreatmentPlanTable.jsx
Display and edit:
- Observation parameters across multiple days
- Add/remove rows with validation
- Print-specific formatting

### RowLimitDialog.jsx
User-friendly dialog for:
- Displaying row capacity limits
- Deletion attempt warnings
- Dynamic mode switching (limit alert vs. deletion warning)

### AllocationMatrix.js
Utility functions for:
- Generating all valid D+T combinations
- Calculating optimal allocation
- Creating structured allocation tables

---

## 🔐 Constraints & Rules

| Constraint | Value | Description |
|-----------|-------|-------------|
| Total Page Capacity (TT) | 11 | Maximum rows per A4 page |
| Min Diet Rows | 1 | Must have at least one diet observation |
| Min Treatment Rows | 1 | Must have at least one treatment entry |
| Default Diet Max | 7 | Suggested maximum diet rows (can grow higher with soft limits) |
| Default Treatment Max | 6 | Suggested maximum treatment rows (can grow higher with soft limits) |

---

## 📖 For More Information

- **[Developers Guide](./Developers_Guide.md)** - Architecture, setup, and development workflow
- **[Allocation Matrix Logic](./AllocationMatrixLogic.md)** - Detailed explanation of the D+T=TT allocation system
- **[Certification](./Certification.md)** - Project certification and compliance information

---

## 📄 License & Support

This project is designed for veterinary clinical use. For support or feature requests, please contact the development team.

---

**Last Updated**: December 30, 2025  
**Version**: 0.0.0
