# 🧠 Business Logic & Allocation Matrix

The core complexity of the InPatient Chart lies in fitting dynamic user data onto a fixed physical format (A4 Paper). This is solved using the **Dynamic Row Allocation System**.

## 🔢 The Allocation Formula: `D + T = TT`

To optimize the use of space on a single A4 page, we define:
- **TT (Total Capacity)**: The strict maximum number of data rows that physically fit between the header and the signature section. **TT = 11**.
- **D (Diet Rows)**: Rows allocated to the Diet/Observation table.
- **T (Treatment Rows)**: Rows allocated to the Treatment Plan table.

Therefore, the application enforces the constraint:
$$ D + T = 11 $$

### Dynamic Balancing
Unlike static forms where Diet might get fixed 5 lines and Treatment fixed 6 lines, our system allows fluid boundaries:
- If a patient has complex dietary needs (e.g., Q2H observations), **D** can increase to 10, forcing **T** to 1.
- If a patient has a complex drug protocol, **T** can increase to 10, forcing **D** to 1.

### Soft vs. Hard Limits
1. **Hard Limit**: $D + T$ cannot exceed 11. The UI blocks the "Add Row" button if this sum is met.
2. **Soft Limit**: We allow "Soft Limits" (e.g., suggested Max D=7) to guide users, but the application default is set to `ALLOW_SOFT_INDIVIDUAL_LIMIT = true`, effectively letting the user use the full page however they wish.

## 🧮 Allocation Algorithm

The logic resides in `src/utils/AllocationMatrix.js` and `src/components/PrintPDFDesign.jsx`.

**Pseudocode for `calculateOptimalAllocation`**:
```javascript
function calculateOptimalAllocation(currentD, currentT) {
  const TT = 11;
  
  // Calculate remaining space
  const remainingSpace = TT - (currentD + currentT);
  
  // Max possible growth for individual tables
  const potentialD = TT - currentT; // If T stays same, D can grow to this
  const potentialT = TT - currentD; // If D stays same, T can grow to this
  
  return {
    canAddDiet: potentialD > currentD,
    canAddTreatment: potentialT > currentT,
    remainingSpace: remainingSpace
  };
}
```

## 📅 Date & Duration Logic

The application also handles date calculations:
- **Admission Date**: Start of the chart.
- **Discharge Date**: End of the chart.
- **Day Columns**: The chart generates columns for each date in the range.
- **Limit**: Currently, the PDF is optimized for portrait A4. If the date range exceeds typical width (e.g., > 7 days), the CSS grid columns shrink. *Future enhancement: Warning for date ranges > 7 days.*

## 🖨️ PDF Generation Logic

### "Print-First" Rendering
The application does NOT use a canvas or screenshot tool to generate PDFs. It uses the browser's native print engine.

**Key Mechanisms:**
1. **CSS Media Queries**: `@media print` ensures:
   - Background colors are removed (save toner).
   - "Add Row" / "Delete" buttons are `display: none`.
   - Input borders are removed to look like lines.
   - Text inputs become plain text.
2. **Fixed Dimensions**:
   - The main container is locked to `210mm` width (A4).
   - Margins are hardcoded in `print-pdf.js` or CSS to match printer defaults.

### Multi-Page Support
Currently, the application is designed for a **Single Page View** tailored for daily/weekly snapshots. If $D+T > 11$, the logic dictates that the user is "out of space". Note: True multi-page overflow is not currently supported; the logic strictly enforces the single-page constraint to ensure legible font sizes.
