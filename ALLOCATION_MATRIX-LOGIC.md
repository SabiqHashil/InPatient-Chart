# Allocation Matrix Logic - Technical Deep Dive

A comprehensive explanation of the **Dynamic Row Allocation System** used in InPatient Chart, with visual examples and mathematical foundation.

---

## 📋 Table of Contents

1. [Problem Statement](#problem-statement)
2. [The D+T=TT Formula](#the-dtttt-formula)
3. [Core Concepts](#core-concepts)
4. [Allocation Algorithm](#allocation-algorithm)
5. [Real-World Examples](#real-world-examples)
6. [Implementation Details](#implementation-details)
7. [Advanced Scenarios](#advanced-scenarios)

---

## 🎯 Problem Statement

### Challenge
A veterinary clinic needs to record patient observations and treatments during a hospital stay. Each entry is printed on an A4 page. The challenge is:

- **Diet Table**: Records observations like Food, Water, Urine, Stool, Vomiting
- **Treatment Table**: Records medication details with dosages
- **Page Constraint**: A4 paper can hold approximately **11 rows total** per page
- **Requirement**: How do we balance between Diet and Treatment tables when both are needed?

### Solution
Use a **dynamic allocation formula** where:
- **D** = Number of diet rows
- **T** = Number of treatment rows
- **TT** = Total rows (always 11 on an A4 page)
- **Formula**: D + T = TT (which means D + T = 11)

---

## 🔢 The D+T=TT Formula

### Mathematical Definition

```
D + T = TT

Where:
D   = Diet table rows (observation parameters)
T   = Treatment table rows (medication entries)
TT  = Total capacity per A4 page = 11
```

### Valid Combinations

All valid allocations for D + T = 11:

| Row # | Diet (D) | Treatment (T) | Total | Dominance |
|-------|----------|---------------|-------|-----------|
| 1     | 1        | 10            | 11    | T > D     |
| 2     | 2        | 9             | 11    | T > D     |
| 3     | 3        | 8             | 11    | T > D     |
| 4     | 4        | 7             | 11    | T > D     |
| 5     | 5        | 6             | 11    | T > D     |
| 6     | 6        | 5             | 11    | D > T     |
| 7     | 7        | 4             | 11    | D > T     |
| 8     | 8        | 3             | 11    | D > T     |
| 9     | 9        | 2             | 11    | D > T     |
| 10    | 10       | 1             | 11    | D > T     |

**Total Valid Combinations**: 10

---

## 🧠 Core Concepts

### 1. Individual Constraints

While the formula D + T = 11 is hard constraint, we also have **soft individual limits**:

```javascript
Default Individual Constraints:
- Max Diet (D_max)       = 7
- Max Treatment (T_max)  = 6
- Min Diet (D_min)       = 1
- Min Treatment (T_min)  = 1
```

**Why?** These reflect typical use cases:
- Most clinics don't track more than 7 diet observations
- Most don't prescribe more than 6 treatment entries per day

### 2. Remaining Capacity

The key insight: **If one table is small, the other can grow larger**

```
Available for Diet    = TT - current_Treatment
                     = 11 - T
                     
Available for Treatment = TT - current_Diet
                        = 11 - D
```

### 3. Dominance Classification

We classify allocations to indicate which table has priority:

```
D > T   : Diet is primary focus (more diet observations)
T > D   : Treatment is primary focus (more treatment entries)
D = T   : Balanced (both have equal rows) - NOT POSSIBLE with D+T=11
```

---

## 🔧 Allocation Algorithm

### Step-by-Step Process

When calculating optimal allocation for a given state:

#### **Input**
```javascript
currentDietCount        // Current diet rows (e.g., 5)
currentTreatmentCount   // Current treatment rows (e.g., 1)
totalCapacity          // Always 11 for A4
maxIndividualDiet      // Soft limit = 7
maxIndividualTreatment // Soft limit = 6
allowSoftIndividualLimit // Flag = true (allow exceeding limits)
```

#### **Step 1: Calculate Remaining Capacity**
```javascript
remainingForDiet = totalCapacity - currentTreatmentCount
                = 11 - 1 = 10

remainingForTreatment = totalCapacity - currentDietCount
                      = 11 - 5 = 6
```

#### **Step 2: Apply Individual Limits**

**With Soft Limits Enabled (default)**:
```javascript
dietMax = remainingForDiet = 10
treatmentMax = remainingForTreatment = 6
```

**With Soft Limits Disabled**:
```javascript
dietMax = min(maxIndividualDiet, remainingForDiet)
        = min(7, 10) = 7

treatmentMax = min(maxIndividualTreatment, remainingForTreatment)
             = min(6, 6) = 6
```

#### **Step 3: Determine Strategy**
```javascript
if dietRows < treatmentRows:
  strategy = "Treatment-focused"
else if treatmentRows < dietRows:
  strategy = "Diet-focused"
else:
  strategy = "Balanced"
```

#### **Step 4: Calculate Available Capacity**
```javascript
availableCapacity = remainingForDiet + remainingForTreatment - currentDietCount - currentTreatmentCount
                  = (11-1) + (11-5) - 5 - 1
                  = 10 + 6 - 5 - 1
                  = 10
```

---

## 📊 Real-World Examples

### Example 1: Starting State

**Scenario**: Fresh admission, default rows
- Current Diet = 5 rows
- Current Treatment = 1 row
- Total = 6/11 used

**Calculation**:
```javascript
remainingForDiet = 11 - 1 = 10
remainingForTreatment = 11 - 5 = 6

With soft limits:
  dietMax = 10       (can add 5 more)
  treatmentMax = 6   (can add 5 more)

Strategy: Diet-focused (D=5 > T=1)
Available capacity: 10
```

**Interpretation**:
- ✅ Can add 5 more diet rows → D becomes 10, T stays 1 (10+1=11)
- ✅ Can add 5 more treatment rows → D stays 5, T becomes 6 (5+6=11)
- ❌ Cannot add more than 5 to either (hard constraint D+T=11)

---

### Example 2: High Diet Load

**Scenario**: Heavy diet tracking needed
- Current Diet = 7 rows
- Current Treatment = 4 rows
- Total = 11/11 used (FULL)

**Calculation**:
```javascript
remainingForDiet = 11 - 4 = 7
remainingForTreatment = 11 - 7 = 4

dietMax = 7        (at individual limit)
treatmentMax = 4   (below individual limit)

Strategy: Diet-focused (D=7 > T=4)
Available capacity: 0
```

**Interpretation**:
- ❌ Cannot add any more rows (page full)
- ⚠️ If removing a treatment row: Diet could grow to 8
- ✅ UI shows "Capacity reached" warning

---

### Example 3: Flexible Allocation

**Scenario**: User wants to add treatment while at near capacity
- Current Diet = 8 rows
- Current Treatment = 2 rows
- Total = 10/11 used

**Calculation**:
```javascript
remainingForDiet = 11 - 2 = 9 (but only 1 row capacity left)
remainingForTreatment = 11 - 8 = 3

dietMax = 9        (soft limit allows it)
treatmentMax = 3   (room for 1 more)

Strategy: Diet-focused (D=8 > T=2)
Available capacity: 1
```

**What User Sees**:
- 🟢 Add button for Treatment is ENABLED (can add 1 row)
- 🟡 Add button for Diet is DISABLED (no room)

---

## 💻 Implementation Details

### Code Location
- **Main Logic**: `src/components/PrintPDFDesign.jsx`
- **Utility Functions**: `src/utils/AllocationMatrix.js`

### Key Functions

#### `generateAllCombinations(total)`
```javascript
/**
 * Generates ALL valid D+T combinations
 * 
 * @param {number} total - Total capacity (11)
 * @returns {Array} Array of {diet, treatment, dominance, total}
 * 
 * Example output:
 * [
 *   {diet: 1, treatment: 10, dominance: "T > D", total: 11},
 *   {diet: 2, treatment: 9, dominance: "T > D", total: 11},
 *   ...
 *   {diet: 10, treatment: 1, dominance: "D > T", total: 11}
 * ]
 */
export const generateAllCombinations = (total, minD = 1, minT = 1) => {
  const combinations = [];
  for (let d = minD; d <= total - minT; d++) {
    const t = total - d;
    combinations.push({
      diet: d,
      treatment: t,
      dominance: d > t ? "D > T" : (t > d ? "T > D" : "D = T"),
      total
    });
  }
  return combinations;
};
```

#### `calculateOptimalAllocation()`
```javascript
/**
 * Calculates maximum allowed rows for each table
 * 
 * @returns {Object}
 * {
 *   page1DietMax: number,           // Max diet rows
 *   page1TreatmentMax: number,      // Max treatment rows
 *   allocationStrategy: string,     // "Diet-focused", "Treatment-focused", "Balanced"
 *   availableCapacity: number       // Total rows still available
 * }
 */
const calculateOptimalAllocation = (
  currentDietCount,
  currentTreatmentCount,
  totalCapacity = 11,
  maxIndividualDiet = 7,
  maxIndividualTreatment = 6,
  allowSoftIndividualLimit = true
) => {
  // Calculate remaining space for each
  const remainingForDiet = totalCapacity - currentTreatmentCount;
  const remainingForTreatment = totalCapacity - currentDietCount;

  // Apply limits (soft or hard)
  const dietMax = allowSoftIndividualLimit
    ? remainingForDiet
    : Math.min(maxIndividualDiet, remainingForDiet);

  const treatmentMax = allowSoftIndividualLimit
    ? remainingForTreatment
    : Math.min(maxIndividualTreatment, remainingForTreatment);

  // Determine strategy
  let allocationStrategy = "Balanced";
  if (currentDietCount > currentTreatmentCount * 1.5) {
    allocationStrategy = "Diet-focused";
  } else if (currentTreatmentCount > currentDietCount * 1.5) {
    allocationStrategy = "Treatment-focused";
  }

  // Calculate available capacity
  const availableCapacity = totalCapacity - (currentDietCount + currentTreatmentCount);

  return {
    page1DietMax: dietMax,
    page1TreatmentMax: treatmentMax,
    allocationStrategy,
    availableCapacity
  };
};
```

### Usage in Components

```jsx
// In PrintPDFDesign.jsx
const allocation = useMemo(() => {
  return calculateOptimalAllocation(
    dietRows.length,
    treatmentRows.length,
    11,
    7,
    6,
    ALLOW_SOFT_INDIVIDUAL_LIMIT  // true by default
  );
}, [dietRows, treatmentRows]);

// Pass to child components
<DietPlanTable
  rows={dietRows}
  maxAllowedRows={allocation.page1DietMax}
  {...otherProps}
/>

<TreatmentPlanTable
  rows={treatmentRows}
  maxAllowedRows={allocation.page1TreatmentMax}
  {...otherProps}
/>
```

---

## 🔄 Advanced Scenarios

### Scenario 1: User Tries to Add Row When Page is Full

**State**: D=7, T=4, Total=11

**User Action**: Clicks "Add Item" on Diet table

**System Response**:
1. Calls `calculateOptimalAllocation()` → dietMax=4 (only 4 rows available for Diet)
2. Current Diet=7 is already at dietMax=4 conceptually, but needs reallocation
3. Dialog appears: "Row Limit Alert"
   - Message: "Diet table has reached its limit"
   - Shows current counts: Diet=7, Treatment=4, Total=11/11
   - Button: "Acknowledge"

**User Cannot Add** because:
- D + T = 11 is already satisfied
- Adding one more would violate the hard constraint

---

### Scenario 2: User Deletes a Treatment Row

**State**: D=8, T=3, Total=11

**User Action**: Clicks delete on Treatment row (when T=1 remains)

**System Response**:
1. Deletion attempt detected (rows.length <= 1)
2. Dialog appears: "Deletion Warning"
   - Message: "Cannot delete the last row"
   - Explains: "Each table must contain at least one row"
   - Button: "I Understand"
3. **Deletion is BLOCKED**
4. Treatment stays at 1 row

**Why?** System enforces minimum 1 row per table always

---

### Scenario 3: Dynamic Reallocation When Treatment Shrinks

**Initial State**: D=5, T=6, Total=11

**Action**: User deletes 2 treatment rows → T becomes 4

**Automatic Recalculation**:
```javascript
remainingForDiet = 11 - 4 = 7
remainingForTreatment = 11 - 5 = 6

dietMax = 7   (was 6 before! Increased by 1)
treatmentMax = 6
```

**What User Sees**:
- Diet table's add button is now ENABLED
- Can now add 2 more diet rows (5→7)
- UI updates in real-time
- No refresh needed

**Mathematical Verification**:
- D=7, T=4 → 7+4=11 ✓ (formula satisfied)

---

## 📐 Mathematical Proofs

### Proof: Formula Always Maintains Balance

**Theorem**: If we constrain D + T = 11, adding rows to one table automatically prevents adding to the other.

**Proof**:
```
Given: D + T = 11 (constraint)

If we add 1 to D:
  D_new = D + 1
  Since D_new + T = 11
  T_new = 11 - D_new = 11 - (D+1) = T - 1
  
Therefore: Adding 1 to D forces T to decrease by 1
(or prevents T from increasing)

This maintains the balance and prevents page overflow. ∎
```

### Proof: Remaining Capacity Formula

**Theorem**: Available capacity = 11 - (D_current + T_current)

**Proof**:
```
Total capacity = 11
Used capacity = D_current + T_current
Remaining capacity = 11 - (D_current + T_current)

This represents the number of additional rows that can be added
to the page before reaching the hard limit. ∎
```

---

## 🎓 Learning Resources

### Visual Representation

```
A4 Page (11 rows total)
┌─────────────────────┐
│ Diet Table          │  ← D rows
│ (Parameters)        │
├─────────────────────┤
│ Treatment Table     │  ← T rows
│ (Medications)       │
├─────────────────────┤
│ Signature Section   │
└─────────────────────┘

Constraint: D + T ≤ 11
           (Hard limit for A4 formatting)
```

### Key Takeaways

1. **Formula**: D + T = 11 (not just ≤, but exactly equals for optimal use)
2. **Dynamic**: Max for one table = 11 - (current other table rows)
3. **Validation**: System prevents page overflow automatically
4. **User Experience**: Users don't think about math; system handles allocation
5. **Flexibility**: Soft limits allow growing beyond defaults if space permits

---

## 🔗 Related Documentation

- [README.md](./README.md) - Project overview
- [Developers_Guide.md](./Developers_Guide.md) - Implementation details
- Source: `src/components/PrintPDFDesign.jsx`
- Utilities: `src/utils/AllocationMatrix.js`

---

**Last Updated**: December 30, 2025  
**Complexity**: Intermediate (requires understanding of React hooks and state management)
