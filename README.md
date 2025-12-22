# In-Patient History Dynamic Chart Generator

A specialized medical frontend tool designed for veterinary or clinical environments. This application allows medical staff to manually design and generate structured **Diet** and **Treatment Plan** charts that adjust dynamically based on a patient's admission duration.

## 🚀 Key Features

* **Dynamic Date Logic**: Automatically generates table columns (Date-wise) based on the calculated range between Admission and Discharge dates.
* **Real-time Validations**:
* **Auto-Capitalization**: Names and parameters are automatically formatted to Title Case (e.g., "sabiq hashil" → "Sabiq Hashil").
* **Smart Date Blocking**: Prevents selection of past dates and ensures Discharge Date is never before Admission Date.
* **Input Constraints**: File numbers are restricted to numeric values; Cage numbers are forced to uppercase.


* **Medical Plan Customization**:
* **Diet Plan**: Pre-loaded with standard parameters (Food, Water, Stool, etc.) with the ability to add custom rows.
* **Treatment Plan**: Detailed medication entry including drug name and dosage (e.g., 2ML).
* **Frequency Toggle**: Switch between **Once (1x)** and **Twice (2x)** daily marking. "Twice" visually splits the cell for Morning/Evening manual marking.


* **Print-First Design**: Optimized for A4 Landscape output. Interactive UI elements (buttons, selectors) are hidden during printing, while signature blocks are revealed.

## 🛠️ Tech Stack

* **Framework**: React (Vite)
* **Styling**: Tailwind CSS
* **Icons/UI**: Standard HTML5/CSS3 Print Media Queries
* **State Management**: React Hooks (`useState`, `useEffect`)

## 📂 Project Structure

```text
src/
├── components/
│   ├── Header.jsx           # Page title and print triggers
│   ├── AdmissionForm.jsx    # Patient metadata and validation logic
│   ├── DietPlanTable.jsx    # Dynamic Diet grid with 1x/2x toggle
│   ├── TreatmentPlanTable.jsx # Medication grid with dosage fields
│   └── SignatureSection.jsx # Print-only footer for approvals
├── utils/
│   ├── dateHelpers.js       # Date range calculation logic
│   └── validations.js       # String formatting and date constraints
├── App.jsx                  # Main application orchestrator
└── index.css                # Tailwind directives and @media print rules

```

## 📋 Installation & Setup

1. **Clone the repository**:
```bash
git clone "https://github.com/SabiqHashil/InPatient-Chart.git"
cd inpatient-chart

```


2. **Install dependencies**:
```bash
npm install

```


3. **Run in development mode**:
```bash
npm run dev

```


4. **Build for production**:
```bash
npm run build

```



## 🖨️ Usage Instructions

1. **Enter Admission Details**: Fill out the patient and doctor info. Start with the **Admission Date** to enable the chart generation.
2. **Customize Rows**: Use the "+ Add" buttons to include specific medications or diet parameters.
3. **Set Frequency**: Select "2x" for medications that require both morning and evening administration to split the cell.
4. **Print to PDF**: Click the "Print Chart" button. In the browser print dialog, ensure "Landscape" orientation is selected for the best layout.

---
