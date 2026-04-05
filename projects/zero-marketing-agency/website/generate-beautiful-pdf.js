import { createBeautifulPDF } from './src/utils/create-beautiful-pdf.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputPath = path.join(__dirname, 'public', 'downloads', 'zero-method-starter-pack.pdf');

console.log('🎨 Creating beautiful professional PDF...');
createBeautifulPDF(outputPath);