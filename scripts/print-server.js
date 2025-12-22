#!/usr/bin/env node
const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PRINT_SERVER_PORT || 4000;

app.use(express.json({ limit: '5mb' }));

// allow CORS from localhost dev server
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.post('/print-pdf', async (req, res) => {
  const { url = 'http://localhost:5173', filename = 'chart.pdf', format = 'A4' } = req.body || {};
  let browser;
  try {
    console.log(`[${new Date().toISOString()}] Generating PDF for URL: ${url}`);
    browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });
    const buffer = await page.pdf({
      format,
      printBackground: true,
      displayHeaderFooter: false,
      margin: { top: '10mm', bottom: '10mm', left: '8mm', right: '8mm' },
    });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Error:`, err.message);
    res.status(500).json({ error: err.message });
  } finally {
    if (browser) await browser.close();
  }
});

app.listen(PORT, () => {
  console.log(`Print server listening on http://localhost:${PORT}`);
});
