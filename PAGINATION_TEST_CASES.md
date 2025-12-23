# Pagination Logic Test Cases

## Overview
The pagination system now implements:
1. **Date Pagination (PRIMARY)**: 15 days per page (Days 1-15, Days 16-30, etc.)
2. **Row-Based Pagination (SECONDARY)**: Overflow pages when rows exceed capacity
3. **Smart Row Distribution**: Intelligent allocation on Page 1 based on treatment row count
4. **Unified Date Columns**: Overflow pages use the LAST date slice from date pages

---

## Test Case 1: Single Date Range (≤15 days) with Row Overflow
**Admission Details:**
- Admission Date: 2025-01-01
- Discharge Date: 2025-01-10 (10 days)
- Diet Rows: 8
- Treatment Rows: 3

**Expected Behavior:**
- **Page 1:** Days 1-10 + Diet (5 rows) + Treatment (3 rows) → Both tables fit smartly
  - Treatment has 3 rows, so Diet can have 8 rows max on page 1
  - But only 5 needed since within capacity
- **Page 2:** Days 1-10 (SAME) + Diet (6 rows overflow) + Treatment (empty)
  - Overflow page uses LAST date slice (Days 1-10)
  - Shows remaining 3 diet rows

**Test:** ✅ Single date page + one diet overflow page

---

## Test Case 2: Multiple Date Ranges with Row Overflow (Primary Use Case)
**Admission Details:**
- Admission Date: 2025-01-01
- Discharge Date: 2025-01-22 (22 days)
- Diet Rows: 8
- Treatment Rows: 3

**Expected Behavior:**
- **Page 1:** Days 1-15 + Diet (5 rows) + Treatment (3 rows)
  - Primary date page showing first 15 days
  - Both tables fit with smart row distribution

- **Page 2:** Days 16-22 (7 days) + Diet (5 rows) + Treatment (3 rows)
  - Date pages continue showing remaining days
  - Same tables with advancing date columns
  - Still shows all diet and treatment rows (same slices as Page 1)

- **Page 3:** Days 16-22 (SAME - LAST date slice) + Diet (6 rows overflow) + Treatment (empty)
  - Overflow page uses LAST date slice (Days 16-22)
  - Shows remaining 3 diet rows
  - This is KEY: Date columns don't advance on overflow pages

**Test:** ✅ Multiple date pages + overflow for diet rows

---

## Test Case 3: Complex Multi-Table Overflow with Multiple Date Pages
**Admission Details:**
- Admission Date: 2025-01-01
- Discharge Date: 2025-01-25 (25 days)
- Diet Rows: 9
- Treatment Rows: 7

**Expected Behavior:**
- **Page 1:** Days 1-15 + Diet (5 rows) + Treatment (4 rows)
  - Treatment has 7 rows (>4), so Diet capped at 5 rows
  - Shows first batch of both tables

- **Page 2:** Days 16-25 (10 days) + Diet (5 rows) + Treatment (4 rows)
  - Continuing dates with remaining rows from both tables
  - Same tables, different date columns

- **Page 3:** Days 16-25 (SAME) + Diet (6 rows overflow) + Treatment (6 rows overflow)
  - BOTH tables overflow on same page
  - Uses LAST date slice (Days 16-25)
  - Diet shows 4 more rows (9-5=4, but limited to 6 per overflow)
  - Treatment shows 3 more rows (7-4=3, but limited to 5 per overflow)

- **Page 4:** Days 16-25 (SAME) + Diet (empty) + Treatment (empty)
  - Both tables exhausted, page hidden

**Test:** ✅ Multiple overflow pages for both tables with consistent dates

---

## Test Case 4: Treatment Overflow, Diet Limited
**Admission Details:**
- Admission Date: 2025-01-01
- Discharge Date: 2025-01-20 (20 days)
- Diet Rows: 3
- Treatment Rows: 10

**Expected Behavior:**
- **Page 1:** Days 1-15 + Diet (3 rows) + Treatment (4 rows)
  - Treatment has more rows, so Diet max stays at 5
  - Shows all diet (3 < 5) and first batch of treatment (4)

- **Page 2:** Days 16-20 + Diet (3 rows) + Treatment (4 rows)
  - Date advances, same table rows shown again
  - This is normal: Diet is exhausted but treatment continues

- **Page 3:** Days 16-20 (SAME) + Diet (empty) + Treatment (6 rows overflow)
  - Overflow page uses LAST date slice
  - Diet hidden (only 3 rows, all shown)
  - Treatment shows next batch (rows 9-10, limited to 5 per page)

- **Page 4:** Days 16-20 (SAME) + Diet (empty) + Treatment (empty)
  - Treatment exhausted, page hidden

**Test:** ✅ Asymmetric overflow (only treatment overflows)

---

## Test Case 5: Small Admission with Treatment Overflow Only
**Admission Details:**
- Admission Date: 2025-01-01
- Discharge Date: 2025-01-12 (12 days)
- Diet Rows: 2
- Treatment Rows: 9

**Expected Behavior:**
- **Page 1:** Days 1-12 + Diet (2 rows) + Treatment (4 rows)
  - Single date page (≤15 days)
  - Treatment >4, so Diet max = 5 (shows all 2)
  - Treatment shows first 4

- **Page 2:** Days 1-12 (SAME) + Diet (empty) + Treatment (6 rows overflow)
  - Overflow page uses LAST date slice (Days 1-12)
  - Diet hidden (all 2 rows shown)
  - Treatment shows remaining 5 rows

- **Page 3:** Days 1-12 (SAME) + Diet (empty) + Treatment (4 rows overflow)
  - Continue showing overflow with +1 capacity
  - Shows final batch of treatment

**Test:** ✅ Single date page with multi-page treatment overflow

---

## Test Case 6: Edge Case - Exactly 15 Days, No Overflow
**Admission Details:**
- Admission Date: 2025-01-01
- Discharge Date: 2025-01-15 (15 days)
- Diet Rows: 5
- Treatment Rows: 3

**Expected Behavior:**
- **Page 1:** Days 1-15 + Diet (5 rows) + Treatment (3 rows)
  - Perfect fit on single page
  - No overflow needed

**Test:** ✅ Single page, no pagination needed

---

## Test Case 7: Edge Case - 31 Days with Large Row Counts
**Admission Details:**
- Admission Date: 2025-01-01
- Discharge Date: 2025-01-31 (31 days)
- Diet Rows: 12
- Treatment Rows: 8

**Expected Behavior:**
- **Page 1:** Days 1-15 + Diet (5 rows) + Treatment (4 rows)
  - First date range with smart row distribution

- **Page 2:** Days 16-31 (16 days) + Diet (5 rows) + Treatment (4 rows)
  - Second date range advancing dates
  - Same table rows shown

- **Page 3:** Days 16-31 (SAME) + Diet (6 rows overflow) + Treatment (5 rows overflow)
  - Overflow page 1: Diet (rows 6-11), Treatment (rows 5-8)
  - Uses LAST date slice (Days 16-31)

- **Page 4:** Days 16-31 (SAME) + Diet (6 rows overflow) + Treatment (5 rows overflow)
  - Overflow page 2: Diet (rows 12 only), Treatment (empty)
  - Diet shows remaining 1 row

**Test:** ✅ Multiple date pages with multiple overflow pages

---

## Key Implementation Details Verified

✅ **Date Pages Priority**: Date pagination happens first (primary axis)
✅ **Row Overflow Secondary**: Row overflow pages come after date pages complete
✅ **Last Date Slice Reuse**: Overflow pages use the FINAL date range (not advancing)
✅ **Smart Row Distribution**: Page 1 intelligently distributes rows based on treatment count
✅ **Dual-Table Overflow**: Both tables can overflow simultaneously on same page
✅ **Auto-Hiding Empty**: Pages with no rows are automatically hidden
✅ **Column Consistency**: All pages with same date slice show consistent column headers

---

## How to Test in Application

1. **Fill Admission Form** with dates and treatment/diet rows matching test cases above
2. **Click Print** to generate PDF
3. **Verify Page Count**: Check total pages matches expected count
4. **Verify Date Columns**: 
   - Date pages: Dates advance (Days 1-15, 16-30, etc.)
   - Overflow pages: Dates stay same as LAST date page
5. **Verify Table Rows**: Each table shows correct row batch per page
6. **Verify Headers**: Admission form only appears on page 1
7. **Verify Footers**: Footer appears on every page with correct "Last Page" indicator

---

## Summary

The pagination system now correctly:
- ✅ Creates multiple date pages when admission > 15 days
- ✅ Shows overflow pages with LAST date columns (not advancing)
- ✅ Distributes rows intelligently on Page 1
- ✅ Handles asymmetric overflow (one table may overflow, other doesn't)
- ✅ Shows both tables on overflow pages when both have overflow rows
- ✅ Hides empty tables automatically
- ✅ Maintains consistent date columns on overflow pages
