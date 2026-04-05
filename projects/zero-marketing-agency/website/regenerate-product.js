import { createProfessionalPDF } from './src/utils/generate-professional-pdf.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const downloadsDir = path.join(__dirname, 'public', 'downloads');
const pdfPath = path.join(downloadsDir, 'zero-method-starter-pack.pdf');
const zipPath = path.join(downloadsDir, 'zero-method-starter-pack.zip');

async function regenerateProduct() {
  console.log('Regenerating professional product files...');
  
  // Create professional PDF
  console.log('Generating professional PDF...');
  createProfessionalPDF(pdfPath);
  
  // Wait a moment for file to be written
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Show the new PDF information
  const stats = fs.statSync(pdfPath);
  console.log(`New PDF created:`);
  console.log(`  Size: ${(stats.size / 1024).toFixed(2)} KB`);
  console.log(`  Path: ${pdfPath}`);
  
  console.log('\nProduct regeneration complete!');
  console.log('The new professional PDF includes:');
  console.log('- Brand-consistent colors (Deep Navy + Gold)');
  console.log('- Professional typography and spacing');
  console.log('- Table of contents for easy navigation');
  console.log('- Clean section organization');
  console.log('- Proper formatting for all prompts');
  console.log('- Print-ready quality');
}

regenerateProduct().catch(console.error);