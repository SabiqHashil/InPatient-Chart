# InPatient Chart Application

**A print-first digital documentation tool for veterinary clinics.**

This application replaces physical clipboards with a smart, responsive web interface that generates pixel-perfect A4 PDF charts for patient admissions, daily diet observations, and treatment plans.

---

## 📚 Documentation

We have organized the documentation into the `/docs` folder for better maintainability:

- **[01 System Architecture](./docs/01-System-Architecture.md)** - High-level design and Tech stack.
- **[02 Folder Structure](./docs/02-Folder-Structure.md)** - File map and responsibilities.
- **[03 Business Logic](./docs/03-Business-Logic.md)** - Deep dive into the **D+T=11 Allocation Formula**.
- **[04 Frontend Documentation](./docs/04-Frontend-Documentation.md)** - Component props, state, and styling.
- **[05 Setup & Deployment](./docs/05-Setup-and-Deployment.md)** - Installation, Build, and Automated Printing.
- **[06 Contribution Guide](./docs/06-Contribution-Guide.md)** - Coding standards and Git workflow.

*(Note: Older documentation files in the root directory like `ALLOCATION_MATRIX-LOGIC.md` are preserved for historical reference but superseded by the docs above.)*

---

## 🚀 Quick Start

### 1. Installation
```bash
git clone <repo-url>
cd InPatient-Chart
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 3. Build for Production
```bash
npm run build
```

---

## 🎯 Key Features

- **Dynamic Row Allocation**: Automatically balances Diet vs. Treatment rows to fit exactly on one A4 page.
- **Print-Optimized**: CSS `@media print` rules ensure the output is clean, omitting web-only UI elements.
- **Client-Side Privacy**: No database required; data persists only for the session (by design).

## 🛠️ Tech Stack

- **React 19**
- **Vite**
- **Tailwind CSS 4**
- **Puppeteer** (for automated PDF testing)

---

**Version**: 1.0.0  
**License**: Proprietary / Clinic Use Only
