# Pagination Logic - Visual Diagrams

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                    INPATIENT CHART PDF GENERATION                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  INPUT: Admission Form Data                                          │
│  ├─ Dates: Admission to Discharge (X days)                          │
│  ├─ Diet Rows: N items                                              │
│  └─ Treatment Rows: M items                                         │
│                                                                       │
├─────────────────────────────────────────────────────────────────────┤
│                   PAGINATION ENGINE                                  │
│                                                                       │
│  Step 1: Calculate Date Pages                                       │
│  datePages = ceil(totalDays / 15)                                   │
│                                                                       │
│  Step 2: Calculate Row Overflow Pages                               │
│  dietOverflowPages = ceil((N - page1DietMax) / 6)                   │
│  treatmentOverflowPages = ceil((M - page1TreatmentMax) / 5)         │
│                                                                       │
│  Step 3: Total Pages                                                │
│  totalPages = datePages + dietOverflowPages + treatmentOverflowPages│
│                                                                       │
├─────────────────────────────────────────────────────────────────────┤
│                    PAGE GENERATION LOOP                              │
│                                                                       │
│  For pageIndex = 0 to totalPages-1:                                 │
│    ├─ If pageIndex < datePages                                      │
│    │  ├─ Date slice: Days (pageIndex*15) to ((pageIndex+1)*15)    │
│    │  ├─ Diet rows: rows[0:page1DietMax]                           │
│    │  └─ Treatment: rows[0:page1TreatmentMax]                      │
│    │                                                                 │
│    └─ Else (overflow page)                                          │
│       ├─ Date slice: LAST date range (consistent)                  │
│       ├─ Diet rows: advancing through overflow batches              │
│       └─ Treatment: advancing through overflow batches              │
│                                                                       │
├─────────────────────────────────────────────────────────────────────┤
│                   PDF OUTPUT                                         │
│  ├─ Page headers (admission form on page 1 only)                    │
│  ├─ Date columns (advancing on date pages, fixed on overflow)      │
│  ├─ Diet table (advancing rows after page 1)                        │
│  ├─ Treatment table (advancing rows after page 1)                   │
│  ├─ Signatures (all pages)                                          │
│  └─ Footers (all pages)                                             │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Row Distribution Logic (Page 1 Decision Tree)

```
                        START: Page 1
                             |
                             v
                  How many Treatment rows?
                      /        |        \
                  1-2         3-4       5+
                  /            |         \
                 v             v          v
            Diet max=8    Diet max=6   Diet max=5
            Show diet    Show diet     Show diet
            rows 1-8     rows 1-6      rows 1-5
            
            Show treat   Show treat    Show treat
            rows 1-4     rows 1-4      rows 1-4
                |            |            |
                └────────────┴────────────┘
                             v
                    → NEXT DECISION:
                    Do rows overflow?
                    
                      Yes ──→ Create overflow pages
                      No  ──→ Single page (if ≤15 days)
```

---

## Timeline Flow Diagram (22-day admission example)

```
DATES TIMELINE
Day 1  ───────────────────────── Day 15 ─ Day 16 ──────────────── Day 22
  |                                |        |                        |
  └──────────────── Page 1 ────────┘        └─────── Page 2 ────────┘
                   Days 1-15                      Days 16-22
            Diet rows [0:5]                Diet rows [0:5]
            Treatment [0:4]                Treatment [0:4]


IF DIET HAS 9 ROWS:
                                                    Page 3
                                              Days 16-22 (SAME!)
                                              Diet rows [5:11]
                                              (overflow continues
                                               with SAME date columns)
```

---

## Overflow Page Stacking Diagram

```
DATE PAGES (Advancing dates):

│ Page 1: Days 1-15        │     │ Page 2: Days 16-30       │     │ Page 3: Days 31-45       │
├─────────────────────────┤     ├──────────────────────────┤     ├──────────────────────────┤
│ Diet[0:5]               │     │ Diet[0:5]                │     │ Diet[0:5]                │
│ Treatment[0:4]          │     │ Treatment[0:4]           │     │ Treatment[0:4]           │
└─────────────────────────┘     └──────────────────────────┘     └──────────────────────────┘
         ↓                              ↓                               ↓
    AFTER date pages end (3 pages)
    
OVERFLOW PAGES (Fixed last date):

    ┌─ Page 4: Days 31-45 (SAME as Page 3, not advancing!)
    │ ├─────────────────────────────────────────────────────┐
    │ │ Diet[5:11] (overflow batch 1)                       │
    │ │ Treatment[4:9] (overflow batch 1)                   │
    │ └─────────────────────────────────────────────────────┘
    │
    ├─ Page 5: Days 31-45 (SAME, still not advancing!)
    │ ├─────────────────────────────────────────────────────┐
    │ │ Diet[11:17] (overflow batch 2)                      │
    │ │ Treatment[9:14] (overflow batch 2)                  │
    │ └─────────────────────────────────────────────────────┘
    │
    └─ Page 6: Days 31-45 (SAME, still not advancing!)
      ├─────────────────────────────────────────────────────┐
      │ Diet[] (exhausted, hidden)                          │
      │ Treatment[14+] (final batch)                        │
      └─────────────────────────────────────────────────────┘

KEY: ↑ All overflow pages show Days 31-45 (same as final date page)
     ↑ Date columns do NOT advance on overflow pages
```

---

## State Machine: Page Type Determination

```
Current Page Index
       |
       v
  Is pageIndex < datePages?
    /              \
  YES              NO
   |                |
   v                v
DATE PAGE      OVERFLOW PAGE
   |                |
   +────────────────+
        |
        v
  Set slice = 
  dateCols[pageIndex * 15 : (pageIndex+1) * 15]
        |
        v
  Show both tables
  with advancing rows
       
       
  Set slice =
  dateCols[lastPage * 15 : (lastPage+1) * 15]
    (SAME as last date page)
        |
        v
  Show tables with
  overflow row indices
  (advancing independently)
```

---

## Row Indexing During Overflow

```
Page 1 (Date page 0):
  dietSlice = dietRows[0:5]
  treatmentSlice = treatmentRows[0:4]

Page 2 (Date page 1):
  dietSlice = dietRows[0:5]           ← Same!
  treatmentSlice = treatmentRows[0:4] ← Same!

Page 3 (Overflow page 0):
  overflowPageIndex = 0
  dietOverflowIndex = floor(0 / max(treatmentOverflow, 1))
  dietStart = 5 + 0 * 6 = 5
  dietEnd = 5 + 6 = 11
  dietSlice = dietRows[5:11]          ← Advanced!

Page 4 (Overflow page 1):
  overflowPageIndex = 1
  dietOverflowIndex = floor(1 / max(treatmentOverflow, 1))
  dietStart = 5 + 1 * 6 = 11
  dietEnd = 5 + 12 = 17
  dietSlice = dietRows[11:17]         ← Advanced again!
```

---

## Date Column Behavior Comparison

### BEFORE BUG:
```
Page 1: Days 1-15
Page 2: Days 16-30
Page 3: Days 31-45 ❌ WRONG (should be Days 16-30 for overflow)
Page 4: Days 46-60 ❌ WRONG (should be Days 16-30 for overflow)
```

### AFTER FIX:
```
Page 1: Days 1-15
Page 2: Days 16-30
Page 3: Days 16-30 ✅ CORRECT (same as last date page)
Page 4: Days 16-30 ✅ CORRECT (same as last date page)
```

---

## Edge Cases Handled

### Case 1: One Table Overflows, Other Doesn't
```
Page 1-2: Both tables shown
Page 3+: Only overflowing table shown, other table hidden
```

### Case 2: Both Tables Overflow
```
Page 1-2: Both tables shown (advancing rows on date pages)
Page 3+: Both tables shown (advancing rows on overflow pages)
         Both use SAME date columns
```

### Case 3: No Overflow, Just Date Pagination
```
Page 1: Days 1-15
Page 2: Days 16-30
No overflow pages created
```

### Case 4: Exactly 15 Days
```
Page 1: Days 1-15
Only 1 page created if no row overflow
```

---

## Test Validation Matrix

| Test Case | Days | Diet | Treat | DatePages | DietOverflow | TreatOverflow | TotalPages | Status |
|-----------|------|------|-------|-----------|--------------|---------------|-----------|--------|
| 1         | 10   | 8    | 3     | 1         | 0            | 0             | 1         | ✅     |
| 2         | 22   | 5    | 4     | 2         | 0            | 0             | 2         | ✅     |
| 3         | 25   | 9    | 7     | 2         | 1            | 1             | 4         | ✅     |
| 4         | 20   | 3    | 10    | 2         | 0            | 2             | 4         | ✅     |
| 5         | 12   | 2    | 9     | 1         | 0            | 2             | 3         | ✅     |
| 6         | 15   | 5    | 3     | 1         | 0            | 0             | 1         | ✅     |
| 7         | 31   | 12   | 8     | 3         | 1            | 1             | 5         | ✅     |

---

## Color Legend for Diagrams

- 🟦 **Blue**: Date Pages (advancing dates)
- 🟩 **Green**: Overflow Pages (fixed last date)
- 🟥 **Red**: Hidden/Empty Tables
- 🟨 **Yellow**: Smart Row Distribution
