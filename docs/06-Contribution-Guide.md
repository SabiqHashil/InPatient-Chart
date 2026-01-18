# 🤝 Contribution Guide

## 📏 Coding Standards

### Linting & Formatting
We strictly enforce code style to prevent "bike-shedding" in code reviews.

- **Linter**: ESLint (Flat Config).
- **Rules**: `eslint:recommended`, `react/recommended`, `react-hooks/recommended`.

**Run Linter:**
```bash
npm run lint
```

**Auto-Fix Lint Errors:**
```bash
npm run lint -- --fix
```

### File Naming Conventions
- **React Components**: `PascalCase.jsx` (e.g., `DietPlanTable.jsx`)
- **Utility Files**: `camelCase.js` (e.g., `dateHelpers.js`)
- **Constants/Configs**: `UPPER_CASE` or `kebab-case` (e.g., `ALLOCATION_CONSTANTS.js`, `tailwind.config.js`)

## 🔱 Version Control Strategy

### Branching
- `main` / `master`: Production-ready code.
- `dev` / `develop`: Integration branch for ongoing work.
- `feature/xxx`: New features (e.g., `feature/add-dark-mode`).
- `fix/xxx`: Bug fixes (e.g., `fix/allocation-bug`).

### Commit Messages
Use [Conventional Commits](https://www.conventionalcommits.org/):
- `feat: add new treatment row validation`
- `fix: correct date calculation for leap years`
- `docs: update setup guide`
- `style: fix print margin padding`

## 🧪 Testing Checklist (Manual)

Before submitting a PR, please manually verify the **"Print-First"** requirement:

1. **Fill the Chart**: Add maximum Logic rows (e.g., 7 Diet, 4 Treatment).
2. **Print Preview**: Press `Ctrl+P`.
3. **Verify Layout**:
   - Does it fit on ONE page?
   - Are the margins correct?
   - Are web buttons (Add/Delete) hidden?
   - Is the font size readable?

## 🆕 Future Enhancements (Roadmap)
- **Multi-Page Support**: Allow overflow into a second A4 page.
- **Data Persistence**: Optional LocalStorage saving to prevent data loss on accidental refresh.
- **Dark Mode**: For the Web UI (Print UI must remain White background).
