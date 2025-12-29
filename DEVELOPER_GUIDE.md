# Developer Guide - InPatient Chart

Quick reference for developers working on this project.

## 🏗️ Architecture

```
index.html → App.jsx → InPatientChart.jsx (main logic)
                           ↓
                    ├─ AdmissionForm (inputs)
                    ├─ DietPlanTable (diet rows)
                    ├─ TreatmentPlanTable (meds)
                    └─ SignatureSection (print)
```

**Key Files**:
- `src/Pages/InPatientChart.jsx` - All state & pagination logic (307 lines)
- `src/components/` - Reusable UI components (9 files)
- `src/utils/` - Formatting & validation helpers (2 files)

## 🔄 State Management

```javascript
// Header (form data)
const [header, setHeader] = useState({
  fileNo, petName, ownerName, doctor, assistantName,
  cageNo, diagnosis, admissionDate, dischargeDate, 
  weight, patientStage
});

// Dynamic rows
const [dietRows, setDietRows] = useState([...]);
const [treatmentRows, setTreatmentRows] = useState([...]);
```

**Pattern**: Always create new objects for updates (immutability)
```javascript
setRows(rows.map(r => r.id === id ? { ...r, field: value } : r));
```

## 📊 Pagination System

**Two-axis pagination**:
- **Dates**: 15 days per page (primary)
- **Rows**: When rows exceed capacity (secondary)

```javascript
// Calculate pages
const datePages = Math.ceil(dateCols.length / 15);
const dietOverflowPages = Math.ceil((dietRows.length - max) / 6);
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
