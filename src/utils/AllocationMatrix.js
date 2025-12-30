/**
 * Allocation Matrix Utility
 * =========================
 * Provides visual and analytical representations of D+T=TT allocations
 * for better understanding and debugging
 */

/**
 * Generates a visual ASCII table of all valid combinations
 * @param {number} total - Total capacity (TT)
 * @returns {string} Formatted table string
 */
export const generateAllocationMatrixTable = (total = 11) => {
  const combinations = [];

  for (let d = 1; d <= total - 1; d++) {
    const t = total - d;
    let dominance = "D = T";
    if (d > t) dominance = "D > T";
    else if (t > d) dominance = "T > D";

    combinations.push({ d, t, dominance, total });
  }

  // Create ASCII table
  let table = "\n";
  table += "╔════════════════════════════════════════════════════╗\n";
  table += "║   ROW ALLOCATION MATRIX (D + T = 11)              ║\n";
  table += "╠════╦═════╦═════╦════╦═══════════════╣\n";
  table += "║Row ║ D   ║ T   ║ TT ║  Dominance    ║\n";
  table += "╠════╬═════╬═════╬════╬═══════════════╣\n";

  combinations.forEach((combo, idx) => {
    const row = idx + 1;
    const dStr = combo.d.toString().padStart(2);
    const tStr = combo.t.toString().padStart(2);
    const ttStr = combo.total.toString().padStart(2);
    const domStr = combo.dominance.padEnd(13);

    table += `║ ${row
      .toString()
      .padEnd(2)} ║ ${dStr}  ║ ${tStr}  ║ ${ttStr} ║ ${domStr} ║\n`;
  });

  table += "╚════╩═════╩═════╩════╩═══════════════╝\n";
  table += `Total Valid Combinations: ${combinations.length}\n\n`;

  return table;
};

/**
 * Generates a heatmap-style allocation matrix
 * Shows which combinations are valid for given current counts
 * @param {number} currentDiet - Current diet rows
 * @param {number} currentTreatment - Current treatment rows
 * @param {number} total - Total capacity
 * @returns {string} Formatted heatmap
 */
export const generateAllocationHeatmap = (
  currentDiet,
  currentTreatment,
  total = 11
) => {
  let heatmap = "\n";
  heatmap += "╔═══════════════════════════════════════════════════╗\n";
  heatmap += "║    ALLOCATION HEATMAP                             ║\n";
  heatmap += "║  (✓ = Valid, ✗ = Invalid, • = Current)            ║\n";
  heatmap += "╠═══════════════════════════════════════════════════╣\n";
  heatmap += "║ T │  1   2   3   4   5   6   7   8   9  10       ║\n";
  heatmap += "║───┼──────────────────────────────────────────────║\n";

  // Rows represent T, columns represent D
  for (let t = total - 1; t >= 1; t--) {
    heatmap += `║ ${t.toString().padStart(2)} │`;

    for (let d = 1; d <= total - 1; d++) {
      const sum = d + t;
      let symbol = " ";

      if (sum === total) {
        if (d === currentDiet && t === currentTreatment) {
          symbol = "•"; // Current allocation
        } else if (d >= currentDiet && t >= currentTreatment) {
          symbol = "✓"; // Valid
        } else {
          symbol = "✗"; // Invalid (insufficient capacity)
        }
      } else {
        symbol = " "; // Not applicable
      }

      heatmap += ` ${symbol}  `;
    }

    heatmap += "║\n";
  }

  heatmap += "╚═══════════════════════════════════════════════════╝\n";
  heatmap += `Legend: • = Current (D=${currentDiet}, T=${currentTreatment})\n`;
  heatmap += `        ✓ = Valid allocation\n`;
  heatmap += `        ✗ = Cannot accommodate current count\n\n`;

  return heatmap;
};

/**
 * Generates a detailed allocation report
 * Shows all metrics and recommendations
 * @param {number} currentDiet - Current diet rows
 * @param {number} currentTreatment - Current treatment rows
 * @param {number} total - Total capacity
 * @returns {string} Formatted report
 */
export const generateAllocationReport = (
  currentDiet,
  currentTreatment,
  total = 11
) => {
  const allCombinations = [];
  for (let d = 1; d <= total - 1; d++) {
    allCombinations.push({
      d,
      t: total - d,
      dominance: d > total - d ? "D > T" : d < total - d ? "T > D" : "D = T",
    });
  }

  const validCombinations = allCombinations.filter(
    (c) => c.d >= currentDiet && c.t >= currentTreatment
  );

  const usedCapacity = currentDiet + currentTreatment;
  const remainingCapacity = total - usedCapacity;

  let report = "\n";
  report += "┌─────────────────────────────────────────────┐\n";
  report += "│     ALLOCATION ANALYSIS REPORT              │\n";
  report += "└─────────────────────────────────────────────┘\n\n";

  report += "📊 CURRENT STATE:\n";
  report += `   Diet Rows:       ${currentDiet}\n`;
  report += `   Treatment Rows:  ${currentTreatment}\n`;
  report += `   Total Used:      ${usedCapacity} / ${total}\n`;
  report += `   Remaining:       ${remainingCapacity} rows\n`;
  report += `   Utilization:     ${Math.round(
    (usedCapacity / total) * 100
  )}%\n\n`;

  report += "✓ VALID ALLOCATIONS (can accommodate current count):\n";
  report += `   Total Valid Combinations: ${validCombinations.length}\n`;
  if (validCombinations.length > 0) {
    report += "   Options:\n";
    validCombinations.slice(0, 5).forEach((combo) => {
      report += `      • D=${combo.d}, T=${combo.t} (${combo.dominance})\n`;
    });
    if (validCombinations.length > 5) {
      report += `      ... and ${validCombinations.length - 5} more\n`;
    }
  }
  report += "\n";

  report += "💡 RECOMMENDATIONS:\n";
  if (validCombinations.length === 0) {
    report += "   ⚠️  OVER CAPACITY! Cannot allocate on single page.\n";
    report += "      Action: Move rows to overflow page.\n";
  } else if (remainingCapacity <= 1) {
    report += "   ⚠️  CRITICAL: Only 1 row remaining.\n";
    report += "      Action: Begin overflow page or reduce rows.\n";
  } else if (remainingCapacity <= 3) {
    report +=
      "   ⚡ LIMITED SPACE: " + remainingCapacity + " rows available.\n";
    report += "      Action: Consider overflow pages soon.\n";
  } else {
    report += "   ✅ GOOD SPACE: " + remainingCapacity + " rows available.\n";
    report += "      Action: Can add more rows safely.\n";
  }
  report += "\n";

  report += "📈 ALLOCATION METRICS:\n";
  const dietUsagePercent = Math.round((currentDiet / 7) * 100);
  const treatmentUsagePercent = Math.round((currentTreatment / 6) * 100);
  report += `   Diet Utilization:       ${dietUsagePercent}% (${currentDiet}/7)\n`;
  report += `   Treatment Utilization:  ${treatmentUsagePercent}% (${currentTreatment}/6)\n`;
  report += `   Overall Utilization:    ${Math.round(
    (usedCapacity / total) * 100
  )}% (${usedCapacity}/${total})\n\n`;

  return report;
};

/**
 * Generates JSON export of allocation matrix
 * Useful for data analysis and external processing
 * @param {number} total - Total capacity
 * @returns {Object} Structured allocation data
 */
export const generateAllocationJSON = (total = 11) => {
  const combinations = [];

  for (let d = 1; d <= total - 1; d++) {
    const t = total - d;
    combinations.push({
      row: d,
      diet: d,
      treatment: t,
      total: total,
      dominance: d > t ? "D > T" : d < t ? "T > D" : "D = T",
      capacityUsed: d + t,
      capacityRemaining: total - (d + t),
    });
  }

  return {
    metadata: {
      timestamp: new Date().toISOString(),
      totalCapacity: total,
      totalCombinations: combinations.length,
      minDiet: 1,
      maxDiet: total - 1,
      minTreatment: 1,
      maxTreatment: total - 1,
    },
    combinations: combinations,
    constraints: {
      total: total,
      maxIndividualDiet: 7,
      maxIndividualTreatment: 6,
      minRowsPerTable: 1,
    },
  };
};

/**
 * Generates CSV export of allocation matrix
 * @param {number} total - Total capacity
 * @returns {string} CSV formatted data
 */
export const generateAllocationCSV = (total = 11) => {
  let csv =
    "Row,Diet,Treatment,Total,Dominance,Capacity Used,Capacity Remaining\n";

  for (let d = 1; d <= total - 1; d++) {
    const t = total - d;
    const dominance = d > t ? "D > T" : d < t ? "T > D" : "D = T";
    const used = d + t;
    const remaining = total - used;

    csv += `${d},${d},${t},${total},${dominance},${used},${remaining}\n`;
  }

  return csv;
};

/**
 * Gets statistics about allocation patterns
 * @param {number} total - Total capacity
 * @returns {Object} Statistics object
 */
export const getAllocationStatistics = (total = 11) => {
  const combinations = [];

  for (let d = 1; d <= total - 1; d++) {
    combinations.push({
      d,
      t: total - d,
    });
  }

  const dietValues = combinations.map((c) => c.d);
  const treatmentValues = combinations.map((c) => c.t);

  const avgDiet = dietValues.reduce((a, b) => a + b, 0) / dietValues.length;
  const avgTreatment =
    treatmentValues.reduce((a, b) => a + b, 0) / treatmentValues.length;

  return {
    totalCombinations: combinations.length,
    diet: {
      min: Math.min(...dietValues),
      max: Math.max(...dietValues),
      average: avgDiet.toFixed(2),
      median:
        dietValues.length % 2 === 0
          ? (
              (dietValues[dietValues.length / 2 - 1] +
                dietValues[dietValues.length / 2]) /
              2
            ).toFixed(2)
          : dietValues[Math.floor(dietValues.length / 2)],
    },
    treatment: {
      min: Math.min(...treatmentValues),
      max: Math.max(...treatmentValues),
      average: avgTreatment.toFixed(2),
      median:
        treatmentValues.length % 2 === 0
          ? (
              (treatmentValues[treatmentValues.length / 2 - 1] +
                treatmentValues[treatmentValues.length / 2]) /
              2
            ).toFixed(2)
          : treatmentValues[Math.floor(treatmentValues.length / 2)],
    },
    dominance: {
      dietDominant: combinations.filter((c) => c.d > c.t).length,
      treatmentDominant: combinations.filter((c) => c.t > c.d).length,
      equal: combinations.filter((c) => c.d === c.t).length,
    },
  };
};

/**
 * Generates a structured dynamic allocation table for display/rendering
 * Returns data suitable for table UI rendering with D, T, TT columns
 *
 * @param {number} total - Total capacity (TT)
 * @param {string} dominanceFilter - 'D>T', 'T>D', or 'all' (default: 'all')
 * @param {string} sortOrder - 'asc' (default) or 'desc'
 * @returns {Object} Structured table data
 */
export const generateStructuredAllocationTable = (
  total = 11,
  dominanceFilter = "all",
  sortOrder = "asc"
) => {
  const rows = [];

  for (let d = 1; d <= total - 1; d++) {
    const t = total - d;
    let dominance = "D = T";

    if (d > t) {
      dominance = "D > T";
    } else if (t > d) {
      dominance = "T > D";
    }

    // Filter by dominance if specified
    if (dominanceFilter !== "all" && dominance !== dominanceFilter) {
      continue;
    }

    rows.push({
      rowNumber: d,
      diet: d,
      treatment: t,
      total: total,
      dominance: dominance,
      utilization: Math.round(((d + t) / total) * 100),
      remainingCapacity: total - (d + t),
    });
  }

  // Sort rows
  if (sortOrder === "desc") {
    rows.reverse();
  }

  return {
    metadata: {
      timestamp: new Date().toISOString(),
      totalCapacity: total,
      totalRows: rows.length,
      dominanceFilter: dominanceFilter,
      sortOrder: sortOrder,
    },
    columns: [
      { key: "rowNumber", label: "Row #", width: "10%" },
      { key: "diet", label: "Diet (D)", width: "20%" },
      { key: "treatment", label: "Treatment (T)", width: "20%" },
      { key: "total", label: "Total (TT)", width: "20%" },
      { key: "dominance", label: "Dominance", width: "20%" },
      { key: "utilization", label: "Utilization %", width: "10%" },
    ],
    rows: rows,
  };
};

/**
 * Generates two complementary tables: one for D > T and one for T > D
 * Useful for comparative analysis
 *
 * @param {number} total - Total capacity (TT)
 * @returns {Object} Object with both table datasets
 */
export const generateComplementaryAllocationTables = (total = 11) => {
  const dietDominantTable = generateStructuredAllocationTable(
    total,
    "D > T",
    "asc"
  );
  const treatmentDominantTable = generateStructuredAllocationTable(
    total,
    "T > D",
    "asc"
  );

  return {
    totalCapacity: total,
    dietDominant: dietDominantTable,
    treatmentDominant: treatmentDominantTable,
    allCombinations: generateStructuredAllocationTable(total, "all", "asc"),
  };
};

/**
 * Generates a single allocation table with default rows (D=5, T=1)
 * And shows potential dynamic allocations
 *
 * @param {number} defaultDiet - Default diet rows (default: 5)
 * @param {number} defaultTreatment - Default treatment rows (default: 1)
 * @param {number} total - Total capacity (default: 11)
 * @returns {Object} Table with current state and possible allocations
 */
export const generateDefaultAllocationTable = (
  defaultDiet = 5,
  defaultTreatment = 1,
  total = 11
) => {
  const allCombinations = generateStructuredAllocationTable(
    total,
    "all",
    "asc"
  );

  // Find valid allocations that can accommodate current rows
  const validAllocations = allCombinations.rows.filter(
    (row) => row.diet >= defaultDiet && row.treatment >= defaultTreatment
  );

  return {
    metadata: {
      timestamp: new Date().toISOString(),
      totalCapacity: total,
      pageSize: "A4",
    },
    defaultState: {
      diet: defaultDiet,
      treatment: defaultTreatment,
      total: defaultDiet + defaultTreatment,
      capacity: total,
      utilisationPercent: Math.round(
        ((defaultDiet + defaultTreatment) / total) * 100
      ),
    },
    allPossibleAllocations: allCombinations,
    validAllocationsForCurrentState: {
      totalValid: validAllocations.length,
      rows: validAllocations,
    },
    pageLayout: {
      maxDietRows: 7,
      maxTreatmentRows: 6,
      totalCapacity: total,
      recommendation: `Current: D=${defaultDiet}, T=${defaultTreatment}. Can allocate up to ${
        validAllocations[0]?.diet || 7
      } diet rows and ${validAllocations[0]?.treatment || 6} treatment rows.`,
    },
  };
};

/**
 * Generates A4 page-optimized table with proper formatting
 * Includes page break indicators for multi-page documents
 *
 * @param {number} total - Total capacity (TT)
 * @param {number} rowsPerPage - Rows per page (default: 10)
 * @returns {Object} Paginated table data
 */
export const generateA4OptimizedAllocationTable = (
  total = 11,
  rowsPerPage = 10
) => {
  const allRows = generateStructuredAllocationTable(total, "all", "asc").rows;
  const pages = [];
  const totalPages = Math.ceil(allRows.length / rowsPerPage);

  for (let pageNum = 0; pageNum < totalPages; pageNum++) {
    const startIdx = pageNum * rowsPerPage;
    const endIdx = Math.min(startIdx + rowsPerPage, allRows.length);
    const pageRows = allRows.slice(startIdx, endIdx);

    pages.push({
      pageNumber: pageNum + 1,
      totalPages: totalPages,
      rowsInPage: pageRows.length,
      rows: pageRows,
      metadata: {
        isFirstPage: pageNum === 0,
        isLastPage: pageNum === totalPages - 1,
        pageBreakAfter: pageNum < totalPages - 1,
        format: "A4",
        orientation: "portrait",
      },
    });
  }

  return {
    totalCapacity: total,
    totalRows: allRows.length,
    rowsPerPage: rowsPerPage,
    totalPages: totalPages,
    pages: pages,
  };
};

/**
 * Generates a printable table summary with all metrics
 * Ideal for documentation and analysis
 *
 * @param {number} currentDiet - Current diet rows
 * @param {number} currentTreatment - Current treatment rows
 * @param {number} total - Total capacity
 * @returns {Object} Complete table with analysis
 */
export const generatePrintableAllocationTable = (
  currentDiet = 5,
  currentTreatment = 1,
  total = 11
) => {
  const tableData = generateStructuredAllocationTable(total, "all", "asc");
  const complementary = generateComplementaryAllocationTables(total);
  const optimized = generateA4OptimizedAllocationTable(total);

  return {
    documentMetadata: {
      title: "Dynamic Row Allocation Table",
      date: new Date().toISOString(),
      totalCapacity: total,
      pageFormat: "A4",
    },
    currentAllocation: {
      diet: currentDiet,
      treatment: currentTreatment,
      total: currentDiet + currentTreatment,
      utilizationPercent: Math.round(
        ((currentDiet + currentTreatment) / total) * 100
      ),
    },
    allValidCombinations: tableData,
    dietDominantTable: complementary.dietDominant,
    treatmentDominantTable: complementary.treatmentDominant,
    pagedLayout: optimized,
    summary: {
      totalCombinations: tableData.rows.length,
      dietDominantCount: complementary.dietDominant.rows.length,
      treatmentDominantCount: complementary.treatmentDominant.rows.length,
      recommendation: generateAllocationReport(
        currentDiet,
        currentTreatment,
        total
      ),
    },
  };
};

export default {
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
};
