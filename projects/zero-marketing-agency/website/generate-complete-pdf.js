import { generateCompletePDF } from './src/utils/generate-complete-pdf.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Generate the complete professional PDF
const outputPath = path.join(__dirname, 'public', 'downloads', 'zero-method-starter-pack.pdf');

async function main() {
  try {
    await generateCompletePDF(outputPath);
    console.log('✅ Complete PDF generation successful!');
  } catch (error) {
    console.error('❌ Error generating PDF:', error);
  }
}

main();