import { createProfessionalPDF } from './src/utils/generate-professional-pdf.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Generate the professional PDF
const outputPath = path.join(__dirname, 'public', 'downloads', 'zero-method-starter-pack.pdf');
createProfessionalPDF(outputPath);