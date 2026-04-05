import { createProfessionalStarterPackPDF } from './src/utils/final-pdf-generator.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Generate the final professional PDF
const inputPath = path.join(__dirname, 'public', 'downloads', 'zero-method-starter-pack.txt');
const outputPath = path.join(__dirname, 'public', 'downloads', 'zero-method-starter-pack.pdf');

async function main() {
  try {
    createProfessionalStarterPackPDF(inputPath, outputPath);
    console.log('🎉 Complete professional PDF generation completed successfully!');
  } catch (error) {
    console.error('❌ Error generating final PDF:', error);
  }
}

main();