# In-Patient Medical Chart Generator

A medical charting tool for veterinary/clinical environments. Quickly create, customize, and print medical charts with admission records, diet plans, and treatment schedules.

## 🎯 Quick Features

- **Auto-formatting**: Names → Title Case, file numbers → numeric only
- **Smart dates**: Prevents past dates, generates date columns automatically
- **Dynamic tables**: Add/remove diet items and medications
- **Multi-page PDF**: Automatically splits across pages (15 days/page)
- **Print-optimized**: A4 Landscape layout, perfect for medical paper

## 🚀 Quick Start

```bash
# Setup
git clone https://github.com/SabiqHashil/InPatient-Chart.git
cd InPatient-Chart
npm install
npm run dev

# Then open http://localhost:5173
```

## 📖 How to Use

1. **Fill admission form**: Patient name, doctor, dates, diagnosis
2. **Add diet items**: Pre-filled with Food, Water, Stool, Urine, Vomiting (customize as needed)
3. **Add medications**: Drug name + dosage
4. **Set frequency**: Once (1x daily) or Twice (morning/evening)
5. **Print**: Click "Print Chart" → Select Landscape → Save as PDF

## 🔧 Tech Stack

- **React 19** + **Vite 7** (Frontend)
- **Tailwind CSS 4** (Styling)
- **Pure JavaScript** (Utilities)

## 📁 What's Inside

```
src/
├── Pages/InPatientChart.jsx    ← Main logic & state
├── components/                  ← Form, tables, headers
└── utils/                        ← Formatting & validation
```

## 🐛 Common Issues

| Problem | Solution |
|---------|----------|
| Chart won't load | Fill admission date first |
| Wrong dates | Discharge date must be ≥ admission date |
| Print cuts off | Use Landscape orientation |

## 📚 Learn More

- **For developers**: See [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md)
- **For certification**: See [Certification.md](Certification.md)

---

**Status**: Production Ready ✅  
**Last Updated**: December 29, 2025
