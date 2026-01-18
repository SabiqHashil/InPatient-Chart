# 💻 Frontend Documentation

## Component Architecture

### `InPatientChart.jsx` (Page Controller)
This is the "Brain" of the application. It holds the "Source of Truth".

**State:**
```javascript
const [header, setHeader] = useState({...}); // Form data
const [dietRows, setDietRows] = useState([...]); // Array of objects
const [treatmentRows, setTreatmentRows] = useState([...]); // Array of objects
```

**Actions:**
- `handleAddRow(type)`: Checks validation, then pushes a new empty object to the respective state array.
- `handleRemoveRow(type, index)`: Removes item at index. Prevents removing the last remaining row (UI Requirement: Table cannot be empty).
- `handleUpdateRow(type, index, field, value)`: Updates specific field in specific row.

---

### `PrintPDFDesign.jsx` (Layout Engine)
Receives the state from `InPatientChart` and determines how it looks on paper.

**Props:**
- `dietRows`: Array
- `treatmentRows`: Array
- `allocation`: Object (Result of logic calculation)

It uses the `allocation` prop to pass `maxAllowedRows` down to the tables.

---

### `DietPlanTable.jsx` & `TreatmentPlanTable.jsx`
These are "dumb" components. They simply render what they are told and fire callbacks on user interaction.

**Key Props:**
- `rows`: Data to display.
- `maxAllowedRows`: Number. Used to disable the "Add" button if `rows.length >= maxAllowedRows`.
- `onUpdate`: Callback for input changes.

**Styling Note:**
These components make heavy use of Tailwind's `group` and `peer` modifiers to handle hover states in Web view, which are ignored in Print view.

## 🎨 Styling System

We use **Tailwind CSS v4**.

### Common Utility Classes
- `print:hidden`: Hides element in PDF (e.g., Buttons, Placeholders).
- `print:block`: Shows element ONLY in PDF (e.g., Copyright footer).
- `print:text-xs`: Forces smaller font in print to fit data.
- `print:border-none`: Removes heavy borders for a cleaner look.

### Global Styles (`index.css`)
We include a minimal reset. Most print-specific overrides should happen in utility classes, but some global print resets are defined here to ensure background graphics are printed (if the user enables that setting).

```css
@media print {
  @page {
    margin: 10mm;
    size: A4 portrait;
  }
  body {
    -webkit-print-color-adjust: exact;
  }
}
```

## 🧩 State Models

### Diet Row Model
```json
{
  "id": "uuid",
  "parameter": "Appetite", // User input
  "day1": "", "day2": "", ... // Tracking data
}
```

### Treatment Row Model
```json
{
  "id": "uuid",
  "drugName": "Amoxicillin",
  "dosage": "500mg",
  "frequency": "BID",
  "day1": "", "day2": "", ... // Checkboxes
}
```

## ⚠️ Known Limitations
1. **State Persistence**: State is ephemeral. Refreshing the specific page clears data. (This is often a desired privacy feature in shared clinic computers).
2. **Mobile View**: The Web UI is responsive, but the "Print View" logic assumes an A4 width. Creating PDFs from mobile is supported but relies on the mobile browser's limited print engine.
