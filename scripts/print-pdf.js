#!/usr/bin/env node
// Usage: node scripts/print-pdf.js <url> <output.pdf>
const puppeteer = require('puppeteer');

async function printPdf(url, output) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle0' });
  await page.pdf({
    path: output || 'chart.pdf',
    format: 'A4',
    printBackground: true,
    displayHeaderFooter: false,
    margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' },
  });
  await browser.close();
  console.log('PDF saved to', output || 'chart.pdf');
}

const args = process.argv.slice(2);
if (!args[0]) {
  console.error('Please provide a URL to render, e.g. http://localhost:5173');
  process.exit(1);
}
printPdf(args[0], args[1]).catch((err) => {
  console.error(err);
  process.exit(1);
});
