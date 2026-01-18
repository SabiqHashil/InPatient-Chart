# ⚙️ Setup, Build & Deployment

## 💻 Local Development

### Prerequisites
- **Node.js** v16.0.0 or higher.
- **npm** v7.0.0 or higher.

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd InPatient-Chart
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   *Note: This will also install `puppeteer` which downloads a local version of Chromium. This may take a moment.*

### Running the Dev Server
Starts the Vite development server with Hot Module Replacement (HMR).
```bash
npm run dev
```
Access the app at: `http://localhost:5173`

## 🏗️ Production Build

To create an optimized production build:
```bash
npm run build
```
This generates a `dist/` folder containing index.html, JS bundles, and CSS assets.

To preview the production build locally:
```bash
npm run preview
```

## 🖨️ Automated PDF Generation

We include a script to automatically generate a PDF from the current state of the application (default entries). This is useful for testing layout changes without printing manually.

**Usage:**
```bash
# General syntax
node scripts/print-pdf.js <URL> <OUTPUT_FILENAME>

# Example (Ensure your dev server is running first!)
node scripts/print-pdf.js http://localhost:5173 test-chart.pdf
```

## 🚀 Deployment

### Vercel (Recommended)
This project is optimized for Vercel.

1. Connect your GitHub repository to Vercel.
2. Vercel automatically detects Vite.
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. **Deploy**.

### Static Hosting (Apache/Nginx/S3)
Since this is a client-side SPA, you can host the contents of `dist/` on any static file server.

**Important for Static Hosting:**
If you deploy to a subdirectory (e.g., `example.com/apps/chart`), you must update the `base` property in `vite.config.js` before building.
