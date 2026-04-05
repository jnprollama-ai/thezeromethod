import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read markdown content
const promptsContent = fs.readFileSync(
  path.join(__dirname, '..', 'product', '25-prompts.md'), 
  'utf8'
);

const templatesContent = fs.readFileSync(
  path.join(__dirname, '..', 'product', '10-templates.md'), 
  'utf8'
);

// Convert markdown to HTML (simple conversion)
function markdownToHtml(md) {
  return md
    .replace(/^# (.*$)/gim, '<h1 style="color: #0F172A; font-family: Arial, sans-serif; font-size: 28px; margin-top: 30px; margin-bottom: 20px; border-bottom: 3px solid #F59E0B; padding-bottom: 10px;">$1</h1>')
    .replace(/^## (.*$)/gim, '<h2 style="color: #1E293B; font-family: Arial, sans-serif; font-size: 22px; margin-top: 25px; margin-bottom: 15px; color: #F59E0B;">$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 style="color: #334155; font-family: Arial, sans-serif; font-size: 16px; margin-top: 20px; margin-bottom: 10px; font-weight: bold;">$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #0F172A;">$1</strong>')
    .replace(/```([\s\S]*?)```/g, '<pre style="background: #F1F5F9; padding: 15px; border-left: 4px solid #F59E0B; margin: 15px 0; font-family: Consolas, monospace; font-size: 11px; line-height: 1.5; overflow-x: auto; white-space: pre-wrap; word-wrap: break-word;">$1</pre>')
    .replace(/- (.*$)/gim, '<li style="margin-bottom: 8px; font-family: Arial, sans-serif; font-size: 12px; line-height: 1.6;">$1</li>')
    .replace(/\n/gim, '<br>');
}

async function createPDF() {
  console.log('Creating professional PDF with Puppeteer...');
  
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @page {
      size: A4;
      margin: 40px;
    }
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
    }
    .cover {
      page-break-after: always;
      text-align: center;
      padding-top: 150px;
      background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
      color: white;
      height: 100vh;
    }
    .cover h1 {
      font-size: 56px;
      color: #F59E0B;
      margin-bottom: 20px;
      border: none;
    }
    .cover h2 {
      font-size: 32px;
      color: white;
      margin-bottom: 30px;
    }
    .cover p {
      font-size: 16px;
      color: #CBD5E1;
      margin-bottom: 15px;
    }
    .toc {
      page-break-after: always;
    }
    .toc h1 {
      color: #0F172A;
      border-bottom: 3px solid #F59E0B;
      padding-bottom: 10px;
    }
    .toc-item {
      display: flex;
      justify-content: space-between;
      margin: 15px 0;
      font-size: 14px;
      border-bottom: 1px dotted #CBD5E1;
      padding-bottom: 5px;
    }
    .section {
      page-break-before: always;
    }
    h1 {
      color: #0F172A;
      font-size: 24px;
      border-bottom: 3px solid #F59E0B;
      padding-bottom: 10px;
      margin-top: 0;
    }
    h2 {
      color: #F59E0B;
      font-size: 18px;
      margin-top: 25px;
    }
    h3 {
      color: #334155;
      font-size: 14px;
      font-weight: bold;
      margin-top: 20px;
    }
    pre {
      background: #F1F5F9;
      padding: 15px;
      border-left: 4px solid #F59E0B;
      margin: 15px 0;
      font-family: Consolas, monospace;
      font-size: 10px;
      line-height: 1.5;
      white-space: pre-wrap;
      word-wrap: break-word;
      page-break-inside: avoid;
    }
    strong {
      color: #0F172A;
    }
    .page-number {
      position: running(pageNumber);
      text-align: center;
      font-size: 10px;
      color: #64748B;
    }
    @media print {
      .page-break {
        page-break-after: always;
      }
    }
  </style>
</head>
<body>
  <!-- Cover Page -->
  <div class="cover">
    <h1>ZERO METHOD</h1>
    <h2>AI Prompts Starter Pack</h2>
    <p style="margin-top: 50px;">25 Battle-Tested Prompts + 10 Email Templates</p>
    <p style="font-size: 14px; color: #94A3B8; margin-top: 100px;">Save 5+ Hours Per Week with AI</p>
    <p style="font-size: 12px; color: #64748B; margin-top: 30px;">Professional Edition v1.0</p>
    <p style="font-size: 12px; color: #64748B;">www.thezeromethod.com</p>
  </div>

  <!-- Table of Contents -->
  <div class="toc">
    <h1>Table of Contents</h1>
    <div class="toc-item"><span>Getting Started</span><span>3</span></div>
    <div class="toc-item"><span>1. Email & Communication Prompts</span><span>4</span></div>
    <div class="toc-item"><span>2. Reports & Documentation Prompts</span><span>9</span></div>
    <div class="toc-item"><span>3. Content Creation Prompts</span><span>14</span></div>
    <div class="toc-item"><span>4. Productivity & Organization Prompts</span><span>19</span></div>
    <div class="toc-item"><span>5. Research & Analysis Prompts</span><span>24</span></div>
    <div class="toc-item"><span>6. Professional Email Templates</span><span>29</span></div>
    <div class="toc-item"><span>Support & Updates</span><span>35</span></div>
  </div>

  <!-- Getting Started -->
  <div class="section">
    <h1>Getting Started</h1>
    <p style="font-size: 12px; line-height: 1.8; margin-bottom: 20px;">
      Welcome to the Zero Method Starter Pack! This collection of 25 carefully crafted AI prompts and 10 professional email templates is designed to help you save 5+ hours every week.
    </p>
    <h2>What's Included</h2>
    <ul style="font-size: 12px; line-height: 1.8;">
      <li>25 AI Prompts across 5 categories</li>
      <li>10 Professional Email Templates</li>
      <li>Copy-paste ready format</li>
      <li>Works with ChatGPT, Claude, and other AI tools</li>
      <li>Free updates for 1 year</li>
    </ul>
  </div>

  <!-- All Prompts -->
  <div class="section">
    ${markdownToHtml(promptsContent)}
  </div>

  <!-- All Templates -->
  <div class="section">
    ${markdownToHtml(templatesContent)}
  </div>

  <!-- Support Page -->
  <div class="section">
    <h1>Support & Updates</h1>
    <p style="font-size: 12px; line-height: 1.8;">
      Thank you for purchasing the Zero Method Starter Pack! We're committed to helping you get the most out of these prompts.
    </p>
    <h2>Contact Us</h2>
    <p style="font-size: 12px; line-height: 1.8;">
      <strong>Email:</strong> support@thezeromethod.com<br>
      <strong>Subject:</strong> Starter Pack Help<br>
      <strong>Website:</strong> www.thezeromethod.com
    </p>
    <h2>Free Updates for 1 Year</h2>
    <p style="font-size: 12px; line-height: 1.8;">
      You'll receive free updates for a full year after purchase. Watch your email for new prompts, templates, and improvements!
    </p>
  </div>
</body>
</html>`;

  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  
  await page.pdf({
    path: path.join(__dirname, 'public', 'downloads', 'zero-method-starter-pack.pdf'),
    format: 'A4',
    printBackground: true,
    margin: { top: '40px', right: '40px', bottom: '40px', left: '40px' }
  });
  
  await browser.close();
  
  console.log('✅ Beautiful PDF created successfully!');
}

createPDF().catch(console.error);