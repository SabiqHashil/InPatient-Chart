# Developers Guide - InPatient Chart

A comprehensive guide for developers setting up, developing, and maintaining the InPatient Chart application.

---

## 📋 Table of Contents

1. [Development Environment Setup](#development-environment-setup)
2. [Project Architecture](#project-architecture)
3. [Component Structure](#component-structure)
4. [State Management](#state-management)
5. [Development Workflow](#development-workflow)
6. [Code Quality & Linting](#code-quality--linting)
7. [Common Tasks](#common-tasks)
8. [Troubleshooting](#troubleshooting)

---

## 🛠️ Development Environment Setup

### Prerequisites

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (v7 or higher) - Comes with Node.js
- **Git** - For version control
- **Text Editor/IDE** - VS Code recommended

### Initial Setup

```bash
# 1. Clone the repository
git clone <repository-url>
cd InPatient-Chart

# 2. Install all dependencies
npm install

# 3. Start the development server
npm run dev

# 4. Open browser and navigate to
# http://localhost:5173
```

### VS Code Extensions (Recommended)

- **ES7+ React/Redux/React-Native snippets** - dsznajder.es7-react-js-snippets
- **Tailwind CSS IntelliSense** - bradlc.vscode-tailwindcss
- **ESLint** - dbaeumer.vscode-eslint
- **Prettier** - esbenp.prettier-vscode

---

## 🏗️ Project Architecture

### High-Level Flow

```
User Browser
    ↓
App.jsx (Root)
    ↓
InPatientChart.jsx (Page)
├── State Management (Header, Diet Rows, Treatment Rows)
├── Event Handlers (Add, Remove, Update rows)
│   ↓
├── PrintPDFDesign.jsx
│   ├── Allocation Logic (D+T=TT)
│   ├── PDF Layout
│   ├── DietPlanTable
│   ├── TreatmentPlanTable
│   ├── PDFHeader/Footer
│   └── SignatureSection
│
└── UI Components (Web-only)
    ├── WebHeader (Print button)
    ├── AdmissionForm
    └── WebFooter
```

### Key Design Principles

1. **Separation of Concerns**
   - Page components handle state
   - Components handle UI rendering
   - Utils handle business logic

2. **Print-First Design**
   - All components have print CSS classes
   - `print:` prefix for print-specific styling
   - Hidden web UI elements during print

3. **Dynamic Allocation**
   - Centralized allocation logic in PrintPDFDesign.jsx
   - Calculated on every render via `useMemo`
   - Real-time row limit validation

---

## 🧩 Component Structure

### Page Component: `InPatientChart.jsx`

**Responsibility**: Main page state and orchestration

**State Managed**:
```javascript
header          // Patient info (name, diagnosis, dates, etc.)
dateCols        // Array of dates between admission & discharge
dietRows        // Array of diet observation entries
treatmentRows   // Array of treatment entries
deleteDialogState // Warning dialog state for delete attempts
```

**Key Handlers**:
```javascript
handleHeaderChange()    // Update patient info
updateRow()            // Modify a specific row's field
removeRow()            // Delete a row with validation
addRow()               // Add new row to table
```

### Main Component: `PrintPDFDesign.jsx`

**Responsibility**: PDF layout and row allocation logic

**Key Functions**:
```javascript
generateAllCombinations(total)
  // Returns all valid D+T combinations where D+T=total

calculateOptimalAllocation(currentDiet, currentTreatment)
  // Calculates maximum allowed rows for each table
  // Returns: {page1DietMax, page1TreatmentMax, strategy, availableCapacity}
```

**Props Received**:
```javascript
dateCols                 // Dates to display as columns
header                   // Patient info
dietRows/treatmentRows   // Current entries
onDietUpdate/Remove/Add  // Event callbacks
onTreatmentUpdate/Remove/Add
isAdmissionFormComplete  // Validation flag
```

### Table Components: `DietPlanTable.jsx` & `TreatmentPlanTable.jsx`

**Responsibility**: Render table UI and handle row-level interactions

**Features**:
- Responsive table layout (mobile-friendly)
- Add/Remove row buttons
- Print-specific CSS for A4 formatting
- Input validation for fields

### Dialog Component: `RowLimitDialog.jsx`

**Responsibility**: Display warnings for invalid user actions

**Modes**:
- `limit`: Shows capacity alert with current row counts
- `delete-warning`: Shows deletion prevention message

**Props**:
```javascript
isOpen              // Boolean to show/hide
mode               // 'limit' or 'delete-warning'
tableType          // 'Diet' or 'Treatment'
dietRowCount/treatmentRowCount  // Current counts
onClose            // Callback when user acknowledges
```

---

## 💾 State Management

### Pattern: Local Component State (React Hooks)

The application uses React's built-in `useState` and `useMemo` hooks for state management. No external state library is used.

### State Flow Example: Adding a Diet Row

```
User clicks "Add Item" button
  ↓
onDietAdd callback fired
  ↓
addRow(setDietRows, dietRows, {label: "", type: "Once"})
  ↓
setDietRows updates state with new entry
  ↓
Component re-renders
  ↓
PrintPDFDesign recalculates allocation
  ↓
New row limits displayed
```

### Allocation Calculation (Memoized)

Located in `PrintPDFDesign.jsx`:

```javascript
const allocation = useMemo(() => {
  return calculateOptimalAllocation(
    dietRows.length,
    treatmentRows.length,
    11,
    7,
    6,
    ALLOW_SOFT_INDIVIDUAL_LIMIT // true by default
  );
}, [dietRows, treatmentRows]);
```

This ensures allocation is recalculated efficiently whenever row counts change.

---

## 🔄 Development Workflow

### Adding a New Feature

1. **Create/Modify Component**
   ```bash
   # Create new component file in src/components/
   touch src/components/NewFeature.jsx
   ```

2. **Implement Feature**
   - Follow existing component patterns
   - Use `print:` classes for print styling
   - Add prop documentation comments

3. **Integrate into Page**
   - Import component in `InPatientChart.jsx`
   - Pass necessary props and handlers
   - Test in browser (http://localhost:5173)

4. **Test Print Output**
   - Press Ctrl+P or Cmd+P
   - Select "Save as PDF"
   - Verify A4 formatting

5. **Run Linter**
   ```bash
   npm run lint
   ```

### Making Changes to Allocation Logic

1. Edit `calculateOptimalAllocation()` in `PrintPDFDesign.jsx`
2. Update logic comments
3. Test with various row count scenarios:
   - Diet=7, Treatment=1 (max diet)
   - Diet=1, Treatment=6 (max treatment)
   - Diet=5, Treatment=1 (mixed)
4. Verify in browser and PDF output

### Styling Guidelines

**Use Tailwind CSS classes**:
```jsx
// Good
<div className="bg-blue-50 border-l-4 border-blue-500 p-3 print:text-xs">

// Avoid custom CSS when possible
<div style={{backgroundColor: '#f0f9ff'}}>
```

**Print-specific styling**:
```jsx
// Elements hidden during print
<button className="print:hidden">Add Item</button>

// Elements that change in print
<div className="text-base print:text-xs">Content</div>
```

---

## 🔍 Code Quality & Linting

### Running ESLint

```bash
# Check all files
npm run lint

# The linter checks for:
# - React best practices
# - Unused variables
# - Missing dependencies in hooks
# - Syntax errors
```

### Common Linting Issues & Fixes

**Unused variable**
```javascript
// Before (Error)
const result = calculateAllocation();

// After (Fix)
// Remove if not used, or use it
const result = calculateAllocation();
console.log(result);
```

**Missing dependency in useEffect**
```javascript
// Before (Error)
useEffect(() => {
  console.log(data);
}, []); // 'data' is missing

// After (Fix)
useEffect(() => {
  console.log(data);
}, [data]);
```

---

## 📝 Common Tasks

### Task 1: Add a New Patient Information Field

1. Update state in `InPatientChart.jsx`:
```javascript
const [header, setHeader] = useState({
  // ... existing fields
  newField: "",
});
```

2. Add input in `AdmissionForm.jsx`:
```jsx
<input
  name="newField"
  value={header.newField}
  onChange={handleHeaderChange}
  placeholder="New Field"
/>
```

3. Adjust PDF layout in `PrintPDFDesign.jsx` if needed

### Task 2: Change Row Limits

1. Edit `PrintPDFDesign.jsx`:
```javascript
const calculateOptimalAllocation = (
  currentDietCount,
  currentTreatmentCount,
  totalCapacity = 11,  // Change TT here
  maxIndividualDiet = 7,  // Or here
  maxIndividualTreatment = 6,  // Or here
  ...
)
```

2. Update documentation strings
3. Test allocation logic
4. Run lint and preview

### Task 3: Modify PDF Header/Footer

1. Edit `PDFHeader.jsx` or `PDFFooter.jsx`
2. Update print-specific styling
3. Test in PDF preview
4. Ensure fits in A4 format

### Task 4: Add Validation Rules

1. Edit `src/utils/validations.js`:
```javascript
export const validateField = (value) => {
  // Add your validation logic
  return isValid;
};
```

2. Use in component:
```jsx
const isValid = validateField(inputValue);
{!isValid && <p className="text-red-500">Error message</p>}
```

---

## 🐛 Troubleshooting

### Issue: "npm run dev" fails

**Solution 1**: Clear node_modules and reinstall
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**Solution 2**: Check Node.js version
```bash
node --version  # Should be v16+
npm --version   # Should be v7+
```

### Issue: PDF prints incorrectly (cuts off content)

**Solution**:
1. Check `PrintPDFDesign.jsx` page structure
2. Ensure total rows don't exceed A4 limits
3. Verify `print:` CSS classes are applied
4. Test with different browsers' print settings

### Issue: Linter reports errors but code works

**Common causes**:
- ESLint cache is stale: `npm run lint -- --cache-file=/dev/null`
- Missing semicolons: Add them
- Unused imports: Remove them
- Wrong syntax: Check React/JSX rules

### Issue: Row allocation not updating

**Solution**:
1. Check that `calculateOptimalAllocation()` is inside `useMemo`
2. Verify dependencies array includes `[dietRows, treatmentRows]`
3. Add console.log to verify allocation is recalculating
4. Check browser console for errors

### Issue: Print dialog shows blank pages

**Solution**:
1. Open DevTools (F12) → Print Preview
2. Check if elements have `display: none` unexpectedly
3. Remove problematic `print:hidden` classes
4. Verify page margins in print settings

---

## 📚 Useful Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev)
- [ESLint Rules](https://eslint.org/docs/latest/rules)

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/name`
2. Make changes and test
3. Run linter: `npm run lint`
4. Commit with clear messages: `git commit -m "Add feature description"`
5. Push to repository: `git push origin feature/name`
6. Create Pull Request for review

---

**Last Updated**: December 30, 2025  
**For Questions**: Contact the development team
