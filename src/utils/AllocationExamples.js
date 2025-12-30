/**
 * Dynamic Allocation Integration Guide
 * ====================================
 * Shows how to use the allocation utilities in different contexts
 */

// Import the allocation utilities
import {
  generateAllocationMatrixTable,
  generateAllocationHeatmap,
  generateAllocationReport,
  generateAllocationJSON,
  generateAllocationCSV,
  getAllocationStatistics,
  generateStructuredAllocationTable,
  generateComplementaryAllocationTables,
  generateDefaultAllocationTable,
  generateA4OptimizedAllocationTable,
  generatePrintableAllocationTable,
} from "../utils/AllocationMatrix";

/**
 * Example 1: Basic Allocation Logging
 * ===================================
 * Log allocation matrix when component mounts
 */
export const exampleBasicLogging = () => {
  console.log("=== ALLOCATION MATRIX ===");
  console.log(generateAllocationMatrixTable(11));
  console.log("========================\n");
};

/**
 * Example 2: Current Allocation with Heatmap
 * ==========================================
 * Show heatmap for current state
 */
export const exampleAllocationHeatmap = (dietCount, treatmentCount) => {
  console.log("=== ALLOCATION HEATMAP ===");
  console.log(generateAllocationHeatmap(dietCount, treatmentCount, 11));
  console.log("==========================\n");
};

/**
 * Example 3: Detailed Analysis Report
 * ==================================
 * Generate comprehensive report for user
 */
export const exampleDetailedReport = (dietCount, treatmentCount) => {
  const report = generateAllocationReport(dietCount, treatmentCount, 11);
  console.log(report);
  return report;
};

/**
 * Example 4: Export for External Analysis
 * =======================================
 * Export data in JSON format
 */
export const exampleJSONExport = () => {
  const jsonData = generateAllocationJSON(11);
  console.log("JSON Export:", JSON.stringify(jsonData, null, 2));

  // Could be sent to backend or saved to file
  return jsonData;
};

/**
 * Example 5: CSV Export for Excel
 * ===============================
 * Generate CSV for spreadsheet analysis
 */
export const exampleCSVExport = () => {
  const csvData = generateAllocationCSV(11);
  console.log("CSV Export:\n", csvData);

  // Could be downloaded or sent to backend
  return csvData;
};

/**
 * Example 6: Statistical Analysis
 * ==============================
 * Get statistics about allocation patterns
 */
export const exampleStatistics = () => {
  const stats = getAllocationStatistics(11);
  console.log("=== ALLOCATION STATISTICS ===");
  console.log("Total Combinations:", stats.totalCombinations);
  console.log("\nDiet Statistics:");
  console.log(`  Min: ${stats.diet.min}`);
  console.log(`  Max: ${stats.diet.max}`);
  console.log(`  Average: ${stats.diet.average}`);
  console.log(`  Median: ${stats.diet.median}`);
  console.log("\nTreatment Statistics:");
  console.log(`  Min: ${stats.treatment.min}`);
  console.log(`  Max: ${stats.treatment.max}`);
  console.log(`  Average: ${stats.treatment.average}`);
  console.log(`  Median: ${stats.treatment.median}`);
  console.log("\nDominance:");
  console.log(`  Diet Dominant: ${stats.dominance.dietDominant}`);
  console.log(`  Treatment Dominant: ${stats.dominance.treatmentDominant}`);
  console.log(`  Equal: ${stats.dominance.equal}`);
  console.log("=============================\n");

  return stats;
};

/**
 * Example 7: React Hook Integration
 * ================================
 * Use allocation utilities in React component
 */
export const exampleReactHookUsage = () => {
  return `
import { useEffect } from 'react';
import { generateAllocationReport } from '../utils/AllocationMatrix';

function MyComponent({ dietRows, treatmentRows }) {
  useEffect(() => {
    const report = generateAllocationReport(
      dietRows.length,
      treatmentRows.length,
      11
    );
    
    // Log for debugging
    console.log(report);
    
    // Or display in UI
    // setAllocationReport(report);
    
  }, [dietRows.length, treatmentRows.length]);

  return (
    <div>
      {/* Component JSX */}
    </div>
  );
}
  `;
};

/**
 * Example 8: Dynamic Constraint Validation
 * ========================================
 * Validate allocation before allowing action
 */
export const exampleConstraintValidation = (
  currentDiet,
  currentTreatment,
  actionType
) => {
  const TOTAL = 11;
  const maxDiet = 7;
  const maxTreatment = 6;

  const willBeValid =
    currentDiet <= maxDiet &&
    currentTreatment <= maxTreatment &&
    currentDiet + currentTreatment <= TOTAL;

  console.log(
    `Action: ${actionType} - Valid: ${willBeValid ? "✓" : "✗"}`
  );

  if (!willBeValid) {
    console.log(`  Current: D=${currentDiet}, T=${currentTreatment}`);
    console.log(
      `  Total: ${currentDiet + currentTreatment}/${TOTAL}`
    );
    console.log(generateAllocationReport(currentDiet, currentTreatment));
  }

  return willBeValid;
};

/**
 * Example 9: Allocation Strategy Selection
 * ========================================
 * Choose strategy based on current allocation
 */
export const exampleStrategySelection = (dietCount, treatmentCount) => {
  const TOTAL = 11;

  // Strategy 1: Maximize Diet
  const strategyMaxDiet = {
    diet: Math.min(7, TOTAL - treatmentCount),
    treatment: treatmentCount,
    name: "Maximize Diet",
  };

  // Strategy 2: Maximize Treatment
  const strategyMaxTreatment = {
    diet: dietCount,
    treatment: Math.min(6, TOTAL - dietCount),
    name: "Maximize Treatment",
  };

  // Strategy 3: Balanced
  const midpoint = Math.floor(TOTAL / 2);
  const strategyBalanced = {
    diet: midpoint,
    treatment: TOTAL - midpoint,
    name: "Balanced",
  };

  console.log("=== AVAILABLE STRATEGIES ===");
  console.log("Strategy 1:", strategyMaxDiet);
  console.log("Strategy 2:", strategyMaxTreatment);
  console.log("Strategy 3:", strategyBalanced);
  console.log("============================\n");

  return [strategyMaxDiet, strategyMaxTreatment, strategyBalanced];
};

/**
 * Example 10: Real-time Monitoring Dashboard
 * ==========================================
 * Create a dashboard object for monitoring
 */
export const createAllocationDashboard = (dietRows, treatmentRows) => {
  const TOTAL = 11;
  const used = dietRows.length + treatmentRows.length;
  const remaining = TOTAL - used;

  return {
    timestamp: new Date().toISOString(),
    currentState: {
      diet: dietRows.length,
      treatment: treatmentRows.length,
      total: used,
      capacity: TOTAL,
    },
    metrics: {
      utilizationPercent: Math.round((used / TOTAL) * 100),
      dietPercent: Math.round((dietRows.length / 7) * 100),
      treatmentPercent: Math.round((treatmentRows.length / 6) * 100),
      remainingRows: remaining,
    },
    status:
      remaining === 0
        ? "FULL"
        : remaining <= 1
          ? "CRITICAL"
          : remaining <= 3
            ? "WARNING"
            : "OK",
    analysis: generateAllocationReport(dietRows.length, treatmentRows.length),
  };
};

/**
 * Example 11: Structured Table Generation
 * =======================================
 * Generate structured table data for UI rendering
 */
export const exampleStructuredTableGeneration = () => {
  // Generate all combinations
  const allCombinationsTable = generateStructuredAllocationTable(11, "all", "asc");
  console.log("All Combinations Table:", allCombinationsTable);

  // Generate only D > T combinations
  const dietDominantTable = generateStructuredAllocationTable(11, "D > T", "asc");
  console.log("Diet Dominant (D > T) Table:", dietDominantTable);

  // Generate only T > D combinations
  const treatmentDominantTable = generateStructuredAllocationTable(11, "T > D", "asc");
  console.log("Treatment Dominant (T > D) Table:", treatmentDominantTable);

  return { allCombinationsTable, dietDominantTable, treatmentDominantTable };
};

/**
 * Example 12: Complementary Tables
 * ================================
 * Generate both D > T and T > D tables for comparison
 */
export const exampleComplementaryTables = () => {
  const tables = generateComplementaryAllocationTables(11);
  console.log("=== COMPLEMENTARY TABLES ===");
  console.log("Diet Dominant Rows:", tables.dietDominant.rows.length);
  console.log("Treatment Dominant Rows:", tables.treatmentDominant.rows.length);
  console.log(JSON.stringify(tables, null, 2));
  return tables;
};

/**
 * Example 13: Default Allocation Table
 * ===================================
 * Generate table with default rows (D=5, T=1)
 */
export const exampleDefaultAllocationTable = () => {
  // With defaults: Diet=5, Treatment=1
  const table = generateDefaultAllocationTable(5, 1, 11);
  console.log("=== DEFAULT ALLOCATION TABLE ===");
  console.log("Current State:", table.defaultState);
  console.log("Valid Allocations:", table.validAllocationsForCurrentState.totalValid);
  console.log("Recommendation:", table.pageLayout.recommendation);
  return table;
};

/**
 * Example 14: A4 Optimized Table
 * =============================
 * Generate table optimized for A4 page printing
 */
export const exampleA4OptimizedTable = () => {
  const table = generateA4OptimizedAllocationTable(11, 10);
  console.log("=== A4 OPTIMIZED TABLE ===");
  console.log(`Total Pages: ${table.totalPages}`);
  console.log(`Rows Per Page: ${table.rowsPerPage}`);
  console.log(`Total Rows: ${table.totalRows}`);

  table.pages.forEach((page) => {
    console.log(`\nPage ${page.pageNumber}:`);
    console.log(`  Rows: ${page.rowsInPage}`);
    console.log(`  First: ${page.metadata.isFirstPage}, Last: ${page.metadata.isLastPage}`);
  });

  return table;
};

/**
 * Example 15: Printable Table Summary
 * ==================================
 * Generate complete printable table with all metrics
 */
export const examplePrintableTable = () => {
  const table = generatePrintableAllocationTable(5, 1, 11);
  console.log("=== PRINTABLE TABLE SUMMARY ===");
  console.log("Document:", table.documentMetadata.title);
  console.log("Current Allocation:", table.currentAllocation);
  console.log("Total Combinations:", table.summary.totalCombinations);
  console.log("Diet Dominant Count:", table.summary.dietDominantCount);
  console.log("Treatment Dominant Count:", table.summary.treatmentDominantCount);
  return table;
};

/**
 * Example 16: Dynamic Table Rendering in React
 * ============================================
 * Use structured table in React component
 */
export const exampleReactTableComponent = () => {
  return `
import { useEffect, useState } from 'react';
import { generateStructuredAllocationTable } from '../utils/AllocationMatrix';

function AllocationTableComponent() {
  const [tableData, setTableData] = useState(null);

  useEffect(() => {
    const data = generateStructuredAllocationTable(11, 'all', 'asc');
    setTableData(data);
  }, []);

  if (!tableData) return <div>Loading...</div>;

  return (
    <table className="w-full border-collapse border">
      <thead>
        <tr className="bg-gray-200">
          {tableData.columns.map((col) => (
            <th key={col.key} className="border p-2">
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {tableData.rows.map((row, idx) => (
          <tr key={idx} className="border hover:bg-gray-100">
            <td className="border p-2">{row.rowNumber}</td>
            <td className="border p-2">{row.diet}</td>
            <td className="border p-2">{row.treatment}</td>
            <td className="border p-2">{row.total}</td>
            <td className="border p-2">
              <span className={row.dominance === 'D > T' ? 'text-blue-600' : 'text-red-600'}>
                {row.dominance}
              </span>
            </td>
            <td className="border p-2">{row.utilization}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default AllocationTableComponent;
  `;
};

/**
 * Example 17: Filter and Sort Tables
 * ==================================
 * Generate filtered and sorted table data
 */
export const exampleFilteredTableGeneration = () => {
  // Generate D > T in ascending order
  const ascendingDietDominant = generateStructuredAllocationTable(11, "D > T", "asc");
  console.log("D > T Ascending:", ascendingDietDominant.rows);

  // Generate T > D in descending order
  const descendingTreatmentDominant = generateStructuredAllocationTable(11, "T > D", "desc");
  console.log("T > D Descending:", descendingTreatmentDominant.rows);

  // Generate all in specific order
  const allInDescending = generateStructuredAllocationTable(11, "all", "desc");
  console.log("All Descending:", allInDescending.rows);

  return {
    ascendingDietDominant,
    descendingTreatmentDominant,
    allInDescending,
  };
};

/**
 * Example 18: Table Data Export for External Tools
 * ================================================
 * Export structured table for use in external systems
 */
export const exampleTableExportForExternal = () => {
  const tableData = generateStructuredAllocationTable(11, "all", "asc");

  // Export as JSON for API
  const jsonExport = JSON.stringify(tableData, null, 2);

  // Export as CSV
  let csvExport = "Row #,Diet,Treatment,Total,Dominance,Utilization %,Remaining\n";
  tableData.rows.forEach((row) => {
    csvExport += `${row.rowNumber},${row.diet},${row.treatment},${row.total},${row.dominance},${row.utilization}%,${row.remainingCapacity}\n`;
  });

  console.log("JSON Export:", jsonExport);
  console.log("CSV Export:\n", csvExport);

  return { jsonExport, csvExport };
};

/**
 * Example 19: Real-time Table Updates
 * ===================================
 * Update table based on current allocation
 */
export const exampleRealTimeTableUpdate = (currentDiet, currentTreatment) => {
  const defaultTable = generateDefaultAllocationTable(
    currentDiet,
    currentTreatment,
    11
  );

  console.log("=== REAL-TIME TABLE UPDATE ===");
  console.log(`Current State: D=${currentDiet}, T=${currentTreatment}`);
  console.log(
    `Utilization: ${defaultTable.defaultState.utilisationPercent}%`
  );
  console.log(
    `Valid Allocations: ${defaultTable.validAllocationsForCurrentState.totalValid}`
  );
  console.log(
    `Recommendation: ${defaultTable.pageLayout.recommendation}`
  );

  return defaultTable;
};

/**
 * Example 20: Complete Table Analysis
 * ===================================
 * Comprehensive table analysis with all options
 */
export const exampleCompleteTableAnalysis = () => {
  const analysis = {
    allCombinations: generateStructuredAllocationTable(11, "all", "asc"),
    complementary: generateComplementaryAllocationTables(11),
    default: generateDefaultAllocationTable(5, 1, 11),
    printable: generatePrintableAllocationTable(5, 1, 11),
    a4Optimized: generateA4OptimizedAllocationTable(11, 10),
  };

  console.log("=== COMPLETE TABLE ANALYSIS ===");
  console.log("Total Combinations:", analysis.allCombinations.rows.length);
  console.log(
    "Diet Dominant Count:",
    analysis.complementary.dietDominant.rows.length
  );
  console.log(
    "Treatment Dominant Count:",
    analysis.complementary.treatmentDominant.rows.length
  );
  console.log("Default Pages:", analysis.a4Optimized.totalPages);

  return analysis;
};

/**
 * Usage Examples Summary
 * =====================
 *
 * 1. Basic Logging:
 *    exampleBasicLogging();
 *
 * 2. Heatmap View:
 *    exampleAllocationHeatmap(5, 3);
 *
 * 3. Detailed Report:
 *    const report = exampleDetailedReport(5, 3);
 *
 * 4. JSON Export:
 *    const json = exampleJSONExport();
 *
 * 5. CSV Export:
 *    const csv = exampleCSVExport();
 *
 * 6. Statistics:
 *    const stats = exampleStatistics();
 *
 * 7. React Integration:
 *    Use hook in useEffect with allocation utilities
 *
 * 8. Validation:
 *    exampleConstraintValidation(5, 3, "Add Row");
 *
 * 9. Strategy Selection:
 *    const strategies = exampleStrategySelection(5, 3);
 *
 * 10. Dashboard:
 *     const dashboard = createAllocationDashboard(dietRows, treatmentRows);
 *
 */

export default {
  exampleBasicLogging,
  exampleAllocationHeatmap,
  exampleDetailedReport,
  exampleJSONExport,
  exampleCSVExport,
  exampleStatistics,
  exampleReactHookUsage,
  exampleConstraintValidation,
  exampleStrategySelection,
  createAllocationDashboard,
};
