# Quick Reference - Pagination Behavior

## How Pages are Generated

### Step 1: Calculate Date Pages
- Divide total days by 15
- Example: 22 days → 2 date pages (Days 1-15, Days 16-22)

### Step 2: Calculate Row Overflow Pages  
- For Diet: How many overflow pages needed for rows beyond page1DietMax?
- For Treatment: How many overflow pages needed for rows beyond page1TreatmentMax?

### Step 3: Total Pages
```
Total = DatePages + DietOverflowPages + TreatmentOverflowPages
```

---

## What Each Page Shows

### Date Pages (Pages 1 to N where N = datePages)
```
Each Date Page:
├─ Date columns: Advancing (Days 1-15, then 16-30, then 31-45, etc.)
├─ Diet rows: Same rows on each date page (rows 1 to page1DietMax)
└─ Treatment rows: Same rows on each date page (rows 1 to page1TreatmentMax)
```

### Overflow Pages (Pages N+1 onwards)
```
Each Overflow Page:
├─ Date columns: SAME as LAST date page (not advancing!)
├─ Diet rows: Only if diet has overflow → incremented batches
├─ Treatment rows: Only if treatment has overflow → incremented batches
└─ Empty tables: Auto-hidden
```

---

## Visual Examples

### Example A: Short Admission (≤15 days), No Overflow
```
Page 1: Days 1-12 | Diet (3 rows) | Treatment (2 rows) ✓
Status: Complete - only 1 page needed
```

### Example B: Medium Admission (16-30 days), No Overflow
```
Page 1: Days 1-15 | Diet (5 rows) | Treatment (4 rows)
Page 2: Days 16-20 | Diet (5 rows) | Treatment (4 rows)
Status: Complete - 2 pages, no overflow
```

### Example C: Medium Admission (16-30 days), Diet Overflow
```
Page 1: Days 1-15 | Diet[0:5] | Treatment[0:4]
Page 2: Days 16-30 | Diet[0:5] | Treatment[0:4]
Page 3: Days 16-30 ← SAME DATES! | Diet[5:11] | Treatment[] (hidden)
Status: Complete - 3 pages total
```

### Example D: Long Admission (31+ days), Multi-Table Overflow
```
Page 1: Days 1-15  | Diet[0:5] | Treatment[0:4]
Page 2: Days 16-30 | Diet[0:5] | Treatment[0:4]
Page 3: Days 31-35 | Diet[0:5] | Treatment[0:4]
Page 4: Days 31-35 ← SAME DATES! | Diet[5:11] | Treatment[4:9]
Page 5: Days 31-35 ← SAME DATES! | Diet[11:17] | Treatment[9:14]
Status: Complete - 5 pages, multiple overflows
```

---

## Key Rules

✅ **Rule 1:** Overflow pages ALWAYS use the LAST date slice  
✅ **Rule 2:** Date pages show advancing date columns  
✅ **Rule 3:** Date pages come BEFORE overflow pages  
✅ **Rule 4:** Overflow pages show BOTH tables if both have overflow rows  
✅ **Rule 5:** Empty tables are hidden automatically  
✅ **Rule 6:** Overflow rows show +1 extra row per page (5 diet = 6 on overflow, etc.)  
✅ **Rule 7:** Page 1 uses smart row distribution based on treatment count  

---

## Troubleshooting

**Issue:** Overflow page shows wrong date columns
- ✅ **Fixed:** Now uses LAST date slice, not advancing

**Issue:** Only one table shows on overflow page when both have overflow
- ✅ **Fixed:** Both tables now render on same overflow page

**Issue:** Diet rows show on page after all treatment rows exhausted
- ✅ **Expected:** Tables overflow independently with advancing row indices

**Issue:** No page break between date pages and overflow pages
- ✅ **Expected:** Page break styling applied to all pages

---

## File References

- **Core Logic:** `src/App.jsx` (lines 102-195)
- **Test Cases:** `PAGINATION_TEST_CASES.md`
- **Implementation Details:** `PAGINATION_IMPLEMENTATION.md`
