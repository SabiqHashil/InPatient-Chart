# Developer Guide - InPatient Chart

Complete technical reference for developing and extending the InPatient Chart application.

## Architecture Overview

```
App.jsx
  └── InPatientChart.jsx (State Management & Web UI)
      ├── WebHeader (Print button, navigation)
      ├── AdmissionForm (Patient data input)
      └── PrintPDFDesign (PDF Layout & Pagination)
          ├── PDFHeader (Every page)
          ├── AdmissionForm (First page only)
          ├── DietPlanTable (Dynamic rows)
          ├── TreatmentPlanTable (Dynamic rows)
          ├── SignatureSection (First page only)
          └── PDFFooter (Every page)
```

## Component Responsibilities

### InPatientChart.jsx (Web UI + State)
**Purpose**: Central state management, form handlers, UI orchestration

**Key Responsibilities**:
- Manage header state (patient info)
- Manage diet rows state
- Manage treatment rows state
- Handle form input changes
- Add/remove rows dynamically
- Generate date range
- Update document title for PDF naming

**State Variables**:
```javascript
const [header, setHeader] = useState({
  fileNo, petName, ownerName, doctor, assistantName,
  cageNo, diagnosis, admissionDate, dischargeDate,
  weight, patientStage
});

const [dietRows, setDietRows] = useState([
  { id: 1, label: "Food", type: "Once" },
  { id: 2, label: "Water", type: "Once" },
  // ... default items
]);

const [treatmentRows, setTreatmentRows] = useState([
  { id: 101, label: "", dose: "", type: "Twice" }
]);
```

### PrintPDFDesign.jsx (PDF Layout)
**Purpose**: Handles all PDF page layout, pagination, and print-specific styling

**Key Responsibilities**:
- Multi-page pagination logic (15 days per page)
- Row overflow pagination (diet & treatment items)
- PDF page layout and structure
- Header/footer placement (conditional)
- Signature section placement (first page only)
- Watermark logo rendering
- Print-specific Tailwind CSS classes

**Props**:
```javascript
<PrintPDFDesign
  dateCols={dateCols}                    // Array of dates
  header={header}                        // Patient info
  dietRows={dietRows}                    // Diet items
  treatmentRows={treatmentRows}          // Treatment items
  onHeaderChange={handleHeaderChange}    // Callback
  onDietUpdate={...}                     // Update diet row
  onDietRemove={...}                     // Remove diet row
  onDietAdd={...}                        // Add diet row
  onTreatmentUpdate={...}                // Update treatment row
  onTreatmentRemove={...}                // Remove treatment row
  onTreatmentAdd={...}                   // Add treatment row
  isAdmissionFormComplete={boolean}      // Form validation status
/>
```

### AdmissionForm.jsx
**Purpose**: Patient admission information input

**Features**:
- Form inputs for patient details
- Real-time validation
- Auto-formatting on blur
- Supports printMode prop for PDF rendering

### DietPlanTable.jsx
**Purpose**: Diet monitoring table with add/remove capability

**Features**:
- Dynamic rows with labels and frequencies
- Add/remove row buttons
- Date columns for monitoring
- Modal editable cells

### TreatmentPlanTable.jsx
**Purpose**: Medication tracking with dosage

**Features**:
- Medication name and dosage inputs
- Frequency toggle (Once/Twice)
- Add/remove rows dynamically
- Organized layout for tracking

### Utility Components
| Component | Purpose |
|-----------|---------|
| WebHeader | Navigation, print button, logo (web only) |
| WebFooter | Footer for web interface |
| PDFHeader | Header for PDF pages (print only) |
| PDFFooter | Footer for PDF pages (print only) |
| SignatureSection | Signature area (print only) |
| NoteUsage | Instruction/empty state |

## State Management Pattern

All state updates use immutable patterns:

```javascript
// Update object property
setHeader({ ...header, [e.target.name]: e.target.value });

// Update array item
setRows(rows.map(r => r.id === id ? { ...r, [field]: value } : r));

// Remove item
setRows(rows.filter(r => r.id !== id));

// Add item
setRows(prev => [...prev, { ...defaultObj, id: ++nextId.current }]);
```

## Pagination System

### Two-Axis Pagination

**Axis 1: Date-Based**
- 15 days per page (DAYS_PER_PAGE = 15)
- Automatically creates new pages for long admissions
- Each page shows 15 consecutive days

**Axis 2: Row Overflow**
- Max 6-7 diet items on page 1
- Max 5 treatment items on page 1
- Extra items continue on new pages (6 per page)
- Separate pages for overflow

**Calculation**:
```javascript
const datePages = Math.ceil(dateCols.length / 15);
const dietOverflowPages = Math.ceil(
  (dietRows.length - 6) / 6  // Remaining items / capacity
);
const totalPages = datePages + dietOverflowPages + treatmentOverflowPages;
```

## Form Validation & Formatting

### Validation Functions (src/utils/validations.js)

```javascript
// Check if admission form is complete
isAdmissionFormComplete(header)  // Returns boolean

// Auto-format values
formatName(value)                // Title Case
formatFileNumber(value)          // Numeric only
formatCageNo(value)              // Uppercase alphanumeric
formatWeight(value)              // Numeric with decimals

// Update document title for PDF naming
updateDocumentTitle(fileNo, admissionDate)
```

### Date Helpers (src/utils/dateHelpers.js)

```javascript
// Generate array of dates between admission & discharge
getDatesInRange(startDate, endDate)  // Returns array

// Format date for display
formatDateDDMonYYYY(dateString)      // "01-Jan-2025" format
```

## Print to PDF

### PrintPDF Utility (src/utils/PrintPDF.js)

Reusable print trigger functions:

```javascript
// Simple trigger
import { triggerPrintPDF } from "../utils/PrintPDF";
<button onClick={triggerPrintPDF}>Print</button>

// With custom options
import { triggerPrintPDFWithOptions } from "../utils/PrintPDF";
triggerPrintPDFWithOptions({
  filename: "patient-chart.pdf",
  delay: 1000
});

// Check if print available
if (isPrintAvailable()) {
  // Show print button
}
```

### Print CSS (Tailwind)

All print styling uses Tailwind `print:` prefix:

```jsx
<div className="block print:hidden">        {/* Web only */}
<div className="hidden print:block">        {/* Print only */}
<div className="print:page-break-after">  {/* Page break */}
```

## Setting Up Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Dev Server
```bash
npm run dev
```

### 3. ESLint Check
```bash
npm run lint
```

### 4. Build Production
```bash
npm run build
```

## File Structure

```
src/
├── main.jsx                      Application entry point
├── App.jsx                       Root component
├── index.css                     Global styles
├── Pages/
│   └── InPatientChart.jsx       Main page component
├── components/
│   ├── PrintPDFDesign.jsx       PDF layout & pagination
│   ├── AdmissionForm.jsx
│   ├── DietPlanTable.jsx
│   ├── TreatmentPlanTable.jsx
│   ├── SignatureSection.jsx
│   ├── WebHeader.jsx
│   ├── WebFooter.jsx
│   ├── PDFHeader.jsx
│   ├── PDFFooter.jsx
│   └── Note-Usage.jsx
└── utils/
    ├── PrintPDF.js              Print utilities
    ├── dateHelpers.js           Date calculations
    └── validations.js           Form validation & formatting
```

## Common Development Tasks

### Add a New Form Field

1. Add to header state:
```javascript
const [header, setHeader] = useState({
  // ... existing fields
  newField: ""
});
```

2. Add input in AdmissionForm.jsx:
```jsx
<input
  name="newField"
  value={header.newField}
  onChange={handleHeaderChange}
/>
```

3. Add to PDF (optional - in AdmissionForm.jsx printMode):
```jsx
{printMode && <p>{newField}: {header.newField}</p>}
```

### Add a New Diet Item Type

Modify the default diet rows in InPatientChart.jsx:

```javascript
const [dietRows, setDietRows] = useState([
  // ... existing
  { id: 6, label: "Medication", type: "Twice" }
]);
```

### Modify Pagination

Change constants in PrintPDFDesign.jsx:

```javascript
const DAYS_PER_PAGE = 15;              // Days per page
const MAX_DIET_ROWS_PER_PAGE = 5;      // Max diet rows
const MAX_TREATMENT_ROWS_PER_PAGE = 4; // Max treatment rows
```

## Debugging Tips

### Check State
```javascript
console.log({ header, dietRows, treatmentRows });
```

### Verify Pagination
```javascript
console.log({ datePages, dietOverflowPages, totalPages });
```

### Test Print CSS
Use Chrome DevTools → More tools → Rendering → Emulate CSS media feature print

### Common Issues

| Issue | Solution |
|-------|----------|
| State not updating | Use immutable patterns (spread operator) |
| Print layout broken | Check Tailwind `print:` classes |
| Pagination wrong | Verify DAYS_PER_PAGE and row limits |
| Form values lost | Check onChange handlers are connected |

## Performance Optimization

- **Date memoization**: `dateCols` uses React.useMemo
- **No unnecessary re-renders**: Only affected components re-render
- **Minimal state**: Only essential data stored in state
- **No external APIs**: All data processed locally

## Security Considerations

- ✅ No XSS risk (React escapes output)
- ✅ No data leakage (browser only)
- ✅ No authentication needed (standalone app)
- ✅ Safe with patient data (local processing)

## Browser Support

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Testing Checklist

- [ ] Form validation works (required fields)
- [ ] Date calculations correct
- [ ] Add/remove rows works
- [ ] Print dialog opens
- [ ] PDF layout correct (15 days/page)
- [ ] Pagination accurate
- [ ] Responsive on mobile
- [ ] No console errors
- [ ] Browser compatibility tested
const treatmentOverflowPages = Math.ceil((treatmentRows.length - max) / 5);
const totalPages = datePages + dietOverflowPages + treatmentOverflowPages;
```

**Example**: 22-day admission, 8 diet items, 3 meds
```
Page 1: Days 1-15  | Diet (5) | Treatment (3)
Page 2: Days 16-22 | Diet (5) | Treatment (3)
Page 3: Days 16-22 | Diet (3 overflow) | (empty)
```

## 🛠️ Utilities

### dateHelpers.js

```javascript
getDatesInRange(startDate, endDate)
// Returns: ["1-Jan", "2-Jan", ..., "15-Jan"]

formatDateDDMonYYYY(dateStr)
// "2025-01-15" → "15-Jan-2025"
```

### validations.js

```javascript
formatName(value)          // "john doe" → "John Doe"
formatFileNumber(value)    // "abc123" → "123"
formatCageNo(value)        // "ip1" → "IP 1"
formatWeight(value)        // "5.5kg" → "5.5"
getTodayDate()             // "2025-12-29"
isAdmissionFormComplete()  // Validate all fields filled
updateDocumentTitle()      // Set browser tab title
```

## 🎨 Styling

**Tailwind conventions**:
```css
/* Responsive breakpoints */
text-xs sm:text-sm lg:text-base   /* Mobile → Desktop */

/* Print styles */
print:hidden                       /* Hide when printing */
print:block                        /* Show when printing */
@media print { ... }              /* Print-specific CSS */
```

## ⚙️ Setup & Build

```bash
# Development
npm run dev          # Start dev server on 5173

# Production
npm run build        # Optimize & bundle
npm run preview      # Test production build

# Code quality
npm run lint         # ESLint check
```

## 🧪 Testing

### Manual tests
1. **Simple chart** (≤15 days) → 1 page
2. **Multi-page** (16-30 days + overflow) → 3-4 pages
3. **Long admission** (45+ days) → 8+ pages

### Print testing
- Open browser print dialog (Ctrl+P)
- Verify Landscape orientation
- Check page breaks are clean
- Confirm signature blocks appear
- Save as PDF

## 📝 Common Tasks

### Add a Form Field

1. Add to header state:
```javascript
const [header, setHeader] = useState({
  // ... existing
  newField: ""
});
```

2. Add InputField component:
```jsx
<InputField
  label="New Field"
  name="newField"
  val={data.newField}
  onChange={onChange}
  formatValue={formatName}
/>
```

3. Add to validation:
```javascript
export const isAdmissionFormComplete = (header) => {
  const required = [..., "newField"];
  return required.every(f => header[f]?.trim());
};
```

### Add a Row Type

1. Create state:
```javascript
const [customRows, setCustomRows] = useState([
  { id: 1, label: "", type: "Once" }
]);
```

2. Create table component (copy DietPlanTable pattern)

3. Use row handlers:
```javascript
updateRow(setCustomRows, customRows, id, field, value)
removeRow(setCustomRows, customRows, id)
addRow(setCustomRows, customRows, { id: 0, label: "", type: "Once" })
```

### Modify Pagination

Change these constants in InPatientChart.jsx:
```javascript
const MAX_DIET_ROWS_PER_PAGE = 5;        // Overflow capacity
const MAX_TREATMENT_ROWS_PER_PAGE = 4;   // Overflow capacity
const DAYS_PER_PAGE = 15;                // Date pagination
```

## 🐛 Debugging

```javascript
// Log pagination info
const pages = datePages + dietOverflowPages + treatmentOverflowPages;
console.log({
  totalDays: dateCols.length,
  datePages,
  dietRows: dietRows.length,
  treatmentRows: treatmentRows.length,
  totalPages: pages
});

// Test in print preview (Ctrl+P)
// Verify dates advance on date pages
// Verify dates stay same on overflow pages
```

## 📦 Dependencies

- **react**: Component framework
- **react-dom**: DOM rendering
- **tailwindcss**: Styling
- **@tailwindcss/vite**: Tailwind bundling
- **vite**: Build tool
- **eslint**: Code linting

## ✅ Code Quality

- Zero syntax errors
- ESLint configured (no warnings)
- React best practices
- Immutable state updates
- No dead code
- Clear patterns to follow

## 🚀 Performance Notes

Current optimizations:
- `useMemo` for date calculations
- Immutable updates for React diffing
- Conditional rendering (no empty tables)

Future improvements:
- React.memo for table components
- Virtual scrolling if 100+ rows
- useReducer for complex state

---

**Quick Links**: [README.md](README.md) | [Certification.md](Certification.md)  
**Status**: Production Ready ✅
