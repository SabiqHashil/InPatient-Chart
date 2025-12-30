import React, { useState, useMemo } from "react";
import PDFHeader from "./PDFHeader";
import PDFFooter from "./PDFFooter";
import AdmissionForm from "./AdmissionForm";
import DietPlanTable from "./DietPlanTable";
import TreatmentPlanTable from "./TreatmentPlanTable";
import SignatureSection from "./SignatureSection";
import NoteUsage from "./Note-Usage";
import RowLimitDialog from "./RowLimitDialog";
import {
  generateStructuredAllocationTable,
  generateDefaultAllocationTable,
  generateComplementaryAllocationTables,
} from "../utils/AllocationMatrix";

/**
 * PrintPDFDesign Component
 * ========================
 * Handles all PDF layout and design with Dynamic Row Allocation
 *
 * This component is responsible for:
 * - PDF page layout and structure
 * - Multi-page pagination logic
 * - Print-specific styling and design
 * - Header and footer placement
 * - Signature section layout
 * - Dynamic row allocation based on D + T = TT formula
 *
 * Dynamic Allocation Logic:
 * - TT (Total) = 11 (A4 page hard limit)
 * - D (Diet) + T (Treatment) = TT
 * - Automatically calculates page1DietMax and page1TreatmentMax
 *   based on current row counts using mathematical constraints
 *
 * Usage:
 *   <PrintPDFDesign
 *     dateCols={dateCols}
 *     header={header}
 *     dietRows={dietRows}
 *     treatmentRows={treatmentRows}
 *     onHeaderChange={handleHeaderChange}
 *     onDietUpdate={(id, field, val) => updateRow(...)}
 *     onDietRemove={(id) => removeRow(...)}
 *     onDietAdd={() => addRow(...)}
 *     onTreatmentUpdate={(id, field, val) => updateRow(...)}
 *     onTreatmentRemove={(id) => removeRow(...)}
 *     onTreatmentAdd={() => addRow(...)}
 *     isAdmissionFormComplete={boolean}
 *   />
 */

/**
 * Allocation Table Display Component
 * Shows current D+T allocation with all valid combinations
 */
/* AllocationTableDisplay removed — keeping only allocation logic in this file. */

/**
 * ===================================
 * DYNAMIC ROW ALLOCATION UTILITIES
 * ===================================
 * Generates all possible combinations where D + T = TT
 */

/**
 * Generates all possible combinations of Diet (D) and Treatment (T)
 * where D + T = TT (Total)
 *
 * @param {number} total - The total capacity (TT)
 * @param {number} minDiet - Minimum diet rows (default: 1)
 * @param {number} minTreatment - Minimum treatment rows (default: 1)
 * @returns {Array} Array of {diet, treatment, dominance} combinations
 *
 * Example: generateAllCombinations(11) returns:
 * [{diet: 1, treatment: 10, dominance: 'T > D'}, ...]
 */
const generateAllCombinations = (total, minDiet = 1, minTreatment = 1) => {
  const combinations = [];

  for (let d = minDiet; d <= total - minTreatment; d++) {
    const t = total - d;
    let dominance = "D = T";

    if (d > t) {
      dominance = "D > T";
    } else if (t > d) {
      dominance = "T > D";
    }

    combinations.push({
      diet: d,
      treatment: t,
      dominance,
      total,
    });
  }

  return combinations;
};

/**
 * Finds the best allocation for Diet and Treatment tables
 * with DYNAMIC FLEXIBLE REALLOCATION
 *
 * Key Logic:
 * - Available capacity for Diet = 11 - current_treatment
 * - Available capacity for Treatment = 11 - current_diet
 * - Each table can grow/shrink based on the OTHER table's size
 * - Still respects individual max constraints: maxDiet=7, maxTreatment=6
 *
 * Real Examples with current state (D=5, T=1):
 * - Diet can grow to: min(7, 11-1) = 7, BUT reaches 10 when T doesn't grow
 * - Treatment can grow to: min(6, 11-5) = 6 (full capacity available!)
 * - Scenario 1: Keep T=1, add 5 to D → D=10, T=1, Total=11 ✓
 * - Scenario 2: Keep D=5, add 5 to T → D=5, T=6, Total=11 ✓
 *
 * @param {number} currentDietCount - Current number of diet rows
 * @param {number} currentTreatmentCount - Current number of treatment rows
 * @param {number} totalCapacity - Total capacity (TT = 11)
 * @param {number} maxIndividualDiet - Maximum diet rows allowed (default: 7)
 * @param {number} maxIndividualTreatment - Maximum treatment rows allowed (default: 6)
 * @returns {Object} {page1DietMax, page1TreatmentMax, allocationStrategy, availableCapacity}
 */
const calculateOptimalAllocation = (
  currentDietCount,
  currentTreatmentCount,
  totalCapacity = 11,
  maxIndividualDiet = 7,
  maxIndividualTreatment = 6,
  allowSoftIndividualLimit = true
) => {
  // Calculate remaining capacity available for each table
  const remainingForDiet = totalCapacity - currentTreatmentCount;
  const remainingForTreatment = totalCapacity - currentDietCount;

  // Diet/Treatment can grow up to the remaining capacity. If soft limits
  // are allowed we let them grow beyond the individual suggested max.
  const dietMax = allowSoftIndividualLimit
    ? remainingForDiet
    : Math.min(maxIndividualDiet, remainingForDiet);

  const treatmentMax = allowSoftIndividualLimit
    ? remainingForTreatment
    : Math.min(maxIndividualTreatment, remainingForTreatment);

  // Generate all valid combinations for reference
  const combinations = generateAllCombinations(totalCapacity, 1, 1);

  // Determine dominance strategy
  let allocationStrategy = "Balanced";
  if (dietMax > treatmentMax) {
    allocationStrategy = "D > T";
  } else if (treatmentMax > dietMax) {
    allocationStrategy = "T > D";
  }

  return {
    page1DietMax: dietMax,
    page1TreatmentMax: treatmentMax,
    allocationStrategy: allocationStrategy,
    combinations: combinations,
    selectedCombination: {
      diet: dietMax,
      treatment: treatmentMax,
      dominance: allocationStrategy,
    },
    availableCapacity: {
      forDiet: remainingForDiet,
      forTreatment: remainingForTreatment,
    },
  };
};

/**
 * Generates a detailed allocation table for debugging/logging
 * Shows all possible combinations with current allocation highlighted
 */
const generateAllocationTable = (
  currentDietCount,
  currentTreatmentCount,
  totalCapacity = 11
) => {
  const combinations = generateAllCombinations(totalCapacity);

  return {
    totalCombinations: combinations.length,
    allCombinations: combinations,
    currentAllocation: {
      diet: currentDietCount,
      treatment: currentTreatmentCount,
      total: currentDietCount + currentTreatmentCount,
    },
    remainingCapacity: {
      diet: totalCapacity - currentDietCount,
      treatment: totalCapacity - currentTreatmentCount,
      overall: totalCapacity - (currentDietCount + currentTreatmentCount),
    },
  };
};

function PrintPDFDesign({
  dateCols = [],
  header = {},
  dietRows = [],
  treatmentRows = [],
  onHeaderChange,
  onDietUpdate,
  onDietRemove,
  onDietAdd,
  onTreatmentUpdate,
  onTreatmentRemove,
  onTreatmentAdd,
  isAdmissionFormComplete = false,
}) {
  // ===================================
  // DYNAMIC ROW ALLOCATION (D + T = TT)
  // ===================================
  const TOTAL_CAPACITY = 11; // TT = 11 (A4 page hard limit)
  const MAX_DIET_INDIVIDUAL = 7; // Maximum diet rows (individual constraint)
  const MAX_TREATMENT_INDIVIDUAL = 6; // Maximum treatment rows (individual constraint)

  // When true, individual max constraints are treated as "soft" —
  // the table can grow beyond the individual suggested maximum
  // if the other table is small and total capacity allows it.
  // Set to `false` to enforce strict individual limits.
  const ALLOW_SOFT_INDIVIDUAL_LIMIT = true;

  // Calculate optimal allocation based on current row counts
  const allocation = calculateOptimalAllocation(
    dietRows.length,
    treatmentRows.length,
    TOTAL_CAPACITY,
    MAX_DIET_INDIVIDUAL,
    MAX_TREATMENT_INDIVIDUAL,
    ALLOW_SOFT_INDIVIDUAL_LIMIT
  );

  let page1DietMax = allocation.page1DietMax;
  let page1TreatmentMax = allocation.page1TreatmentMax;

  // Dialog state for row limit warnings
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    tableType: "Diet",
    maxRows: page1DietMax, // Dynamically updated
  });

  // Generate structured allocation tables for display
  const structuredTable = useMemo(() => {
    return generateStructuredAllocationTable(TOTAL_CAPACITY, "all", "asc");
  }, [TOTAL_CAPACITY]);

  const defaultAllocationTable = useMemo(() => {
    return generateDefaultAllocationTable(
      dietRows.length,
      treatmentRows.length,
      TOTAL_CAPACITY
    );
  }, [dietRows.length, treatmentRows.length, TOTAL_CAPACITY]);

  const complementaryTables = useMemo(() => {
    return generateComplementaryAllocationTables(TOTAL_CAPACITY);
  }, [TOTAL_CAPACITY]);

  // Log allocation strategy for debugging
  React.useEffect(() => {
    const allocationTable = generateAllocationTable(
      dietRows.length,
      treatmentRows.length,
      TOTAL_CAPACITY
    );
    console.log("=== ROW ALLOCATION TABLE ===");
    console.log("All Valid Combinations (D + T = 11):");
    allocationTable.allCombinations.forEach((combo, idx) => {
      console.log(
        `${idx + 1}. D=${combo.diet} | T=${combo.treatment} | TT=${combo.total} | ${combo.dominance}`
      );
    });
    console.log("\nCurrent Allocation:");
    console.log(`Diet: ${allocationTable.currentAllocation.diet}`);
    console.log(`Treatment: ${allocationTable.currentAllocation.treatment}`);
    console.log(`Total Used: ${allocationTable.currentAllocation.total}/${TOTAL_CAPACITY}`);
    console.log("\nSelected Strategy:", allocation.allocationStrategy);
    console.log("Page 1 Diet Max:", page1DietMax);
    console.log("Page 1 Treatment Max:", page1TreatmentMax);
    console.log("\n=== STRUCTURED ALLOCATION DATA ===");
    console.log("Structured Table:", structuredTable);
    console.log("Default Allocation:", defaultAllocationTable);
    console.log("Complementary Tables:", complementaryTables);
    console.log("===========================\n");
  }, [dietRows.length, treatmentRows.length, page1DietMax, page1TreatmentMax, TOTAL_CAPACITY, allocation.allocationStrategy, structuredTable, defaultAllocationTable, complementaryTables]);

  // Calculate total rows on current page
  const totalRowsOnPage = dietRows.length + treatmentRows.length;
  const maxTotalRows = 11; // A4 page hard limit

  // Handler to show dialog
  const showRowLimitDialog = (tableType, maxRows) => {
    setDialogState({
      isOpen: true,
      tableType,
      maxRows,
    });
  };

  // Handler to close dialog
  const closeRowLimitDialog = () => {
    setDialogState({
      ...dialogState,
      isOpen: false,
    });
  };

  // Wrapped onDietAdd with limit check (Individual + Total)
  const handleDietAdd = () => {
    // Check total page capacity first (hard limit)
    if (totalRowsOnPage >= maxTotalRows) {
      showRowLimitDialog("Diet", page1DietMax);
      return;
    }
    // Check individual diet table limit
    if (dietRows.length >= page1DietMax) {
      showRowLimitDialog("Diet", page1DietMax);
      return;
    }
    onDietAdd();
  };

  // Wrapped onTreatmentAdd with limit check (Individual + Total)
  const handleTreatmentAdd = () => {
    // Check total page capacity first (hard limit)
    if (totalRowsOnPage >= maxTotalRows) {
      showRowLimitDialog("Treatment", page1TreatmentMax);
      return;
    }
    // Check individual treatment table limit
    if (treatmentRows.length >= page1TreatmentMax) {
      showRowLimitDialog("Treatment", page1TreatmentMax);
      return;
    }
    onTreatmentAdd();
  };

  // Constants for pagination
  const MAX_DIET_ROWS_PER_PAGE = 6;
  const MAX_TREATMENT_ROWS_PER_PAGE = 5;
  const DAYS_PER_PAGE = 15;
  const DIET_OVERFLOW_ROW_LIMIT = MAX_DIET_ROWS_PER_PAGE + 1;
  const TREATMENT_OVERFLOW_ROW_LIMIT = MAX_TREATMENT_ROWS_PER_PAGE + 1;

  // Calculate page count
  const datePages = Math.max(1, Math.ceil(dateCols.length / DAYS_PER_PAGE));

  let dietOverflowPages = 0;
  if (dietRows.length > page1DietMax) {
    const remainingDiet = dietRows.length - page1DietMax;
    dietOverflowPages = Math.ceil(remainingDiet / DIET_OVERFLOW_ROW_LIMIT);
  }

  let treatmentOverflowPages = 0;
  if (treatmentRows.length > page1TreatmentMax) {
    const remainingTreatment = treatmentRows.length - page1TreatmentMax;
    treatmentOverflowPages = Math.ceil(
      remainingTreatment / TREATMENT_OVERFLOW_ROW_LIMIT
    );
  }

  const totalPages = datePages + dietOverflowPages + treatmentOverflowPages;

  // If no data, show note
  if (dateCols.length === 0) {
    return <NoteUsage />;
  }

  // Generate PDF pages
  return (
    <>
      <RowLimitDialog
        isOpen={dialogState.isOpen}
        tableType={dialogState.tableType}
        maxRows={dialogState.maxRows}
        dietRowCount={dietRows.length}
        treatmentRowCount={treatmentRows.length}
        maxTotalRows={maxTotalRows}
        onClose={closeRowLimitDialog}
      />
      <div className="print:p-0 print:m-0">
        {Array.from({ length: totalPages }).map((_, pageIndex) => {
          // Determine date slice for this page
          let slice;
          if (pageIndex < datePages) {
            const dateStart = pageIndex * DAYS_PER_PAGE;
            const dateEnd = dateStart + DAYS_PER_PAGE;
            slice = dateCols.slice(dateStart, dateEnd);
          } else {
            const lastDatePageIndex = datePages - 1;
            const dateStart = lastDatePageIndex * DAYS_PER_PAGE;
            const dateEnd = dateStart + DAYS_PER_PAGE;
            slice = dateCols.slice(dateStart, dateEnd);
          }

          // Determine row slices for this page
          let dietSlice = [];
          let treatmentSlice = [];
          let showDiet = false;
          let showTreatment = false;

          if (pageIndex < datePages) {
            showDiet = true;
            showTreatment = true;
            dietSlice = dietRows.slice(0, page1DietMax);
            treatmentSlice = treatmentRows.slice(0, page1TreatmentMax);
          } else {
            showDiet = true;
            showTreatment = true;

            const overflowPageIndex = pageIndex - datePages;

            if (dietRows.length > page1DietMax) {
              const dietOverflowIndex = Math.floor(
                overflowPageIndex / Math.max(1, treatmentOverflowPages || 1)
              );
              const dietStart =
                page1DietMax + dietOverflowIndex * DIET_OVERFLOW_ROW_LIMIT;
              const dietEnd = dietStart + DIET_OVERFLOW_ROW_LIMIT;
              dietSlice = dietRows.slice(dietStart, dietEnd);
            } else {
              dietSlice = [];
            }

            if (treatmentRows.length > page1TreatmentMax) {
              const treatmentOverflowIndex = Math.floor(
                overflowPageIndex / Math.max(1, dietOverflowPages || 1)
              );
              const treatmentStart =
                page1TreatmentMax +
                treatmentOverflowIndex * TREATMENT_OVERFLOW_ROW_LIMIT;
              const treatmentEnd =
                treatmentStart + TREATMENT_OVERFLOW_ROW_LIMIT;
              treatmentSlice = treatmentRows.slice(
                treatmentStart,
                treatmentEnd
              );
            } else {
              treatmentSlice = [];
            }

            if (dietSlice.length === 0) showDiet = false;
            if (treatmentSlice.length === 0) showTreatment = false;
          }

          const isFirst = pageIndex === 0;
          const isLast = pageIndex === totalPages - 1;

          return (
            <div
              key={pageIndex}
              className="print-page mb-4 print:mb-0 print:p-6 print:border-t-2 print:border-gray-300 print:m-0 p-4 sm:p-6 print:box-border print:relative"
              style={{ pageBreakAfter: isLast ? "auto" : "always" }}
            >
              {/* WATERMARK LOGO */}
              <div className="hidden print:flex print:absolute print:top-0 print:left-0 print:w-full print:h-full print:items-center print:justify-center print:pointer-events-none print:z-0">
                <img
                  src="/mypetsa-logo.png"
                  alt="MyPetsa Logo Watermark"
                  className="print:max-w-75 print:max-h-75 print:opacity-10 print:object-contain"
                />
              </div>

              {/* PDF HEADER */}
              <div className="hidden print:block print-header mb-2">
                <PDFHeader
                  onPrint={() => window.print()}
                  canPrint={dateCols.length > 0 && isAdmissionFormComplete}
                />

                {/* ADMISSION FORM - FIRST PAGE ONLY */}
                {isFirst && (
                  <div className="no-break">
                    <AdmissionForm
                      data={header}
                      onChange={onHeaderChange}
                      totalDays={dateCols.length}
                      printMode={true}
                    />
                  </div>
                )}
              </div>

              {/* TABLES CONTAINER */}
              <div className="print:grow print:overflow-visible print:mt-40">
                <div />

                {/* DIET PLAN TABLE */}
                {showDiet && dietSlice.length > 0 && (
                  <div className="w-full print:w-full print:overflow-visible">
                    <DietPlanTable
                      rows={dietSlice}
                      dateCols={slice}
                      showAddButton={isFirst}
                      isFirstPage={isFirst}
                      onUpdate={onDietUpdate}
                      onRemove={onDietRemove}
                      onAdd={handleDietAdd}
                    />
                  </div>
                )}

                {/* TREATMENT PLAN TABLE */}
                {showTreatment && treatmentSlice.length > 0 && (
                  <div className="w-full print:w-full print:overflow-visible">
                    <TreatmentPlanTable
                      rows={treatmentSlice}
                      dateCols={slice}
                      showAddButton={isFirst}
                      isFirstPage={isFirst}
                      onUpdate={onTreatmentUpdate}
                      onRemove={onTreatmentRemove}
                      onAdd={handleTreatmentAdd}
                    />
                  </div>
                )}
              </div>

              {/* FOOTER SECTION */}
              <div className="print:mt-auto">
                {/* SIGNATURE - FIRST PAGE ONLY */}
                {isFirst && <SignatureSection isFirstPage={true} />}

                {/* PDF FOOTER - ALL PAGES */}
                <div className="print-footer">
                  <PDFFooter isLastPage={isLast} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default PrintPDFDesign;
