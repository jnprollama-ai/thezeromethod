import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Professional color scheme for Zero Method
const COLORS = {
  primary: '#0F172A',    // Deep Navy
  accent: '#F59E0B',     // Gold
  secondary: '#94A3B8',  // Muted Gray
  light: '#FFFFFF',      // White
  background: '#F8FAFC'  // Light Background
};

// Font settings
const FONTS = {
  heading: 'Helvetica-Bold',
  subheading: 'Helvetica',
  body: 'Helvetica',
  code: 'Courier'
};

function createProfessionalStarterPackPDF(inputTextPath, outputPdfPath) {
  console.log('Creating professional PDF with all 25 prompts and 10 templates...');
  
  // Read the complete text file
  const content = fs.readFileSync(inputTextPath, 'utf8');
  const lines = content.split('\n');
  
  // Create a document
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 50, bottom: 50, left: 50, right: 50 }
  });

  // Pipe its output somewhere, like to a file or HTTP response
  doc.pipe(fs.createWriteStream(outputPdfPath));

  // Cover Page
  doc.fontSize(28).fillColor(COLORS.primary).font(FONTS.heading)
     .text('Zero Method', { align: 'center' });
  
  doc.moveDown(0.5);
  doc.fontSize(18).fillColor(COLORS.accent)
     .text('AI Prompts Starter Pack', { align: 'center' });
  
  doc.moveDown(1);
  doc.fontSize(14).fillColor(COLORS.secondary)
     .text('25 Battle-Tested Prompts + 10 Email Templates', { align: 'center' });
  
  doc.moveDown(3);
  doc.fontSize(12).fillColor(COLORS.secondary)
     .text('Save 5+ Hours Per Week with AI', { align: 'center' });
  
  // Add a decorative line
  doc.moveTo(100, doc.y + 30)
     .lineTo(500, doc.y + 30)
     .strokeColor(COLORS.accent)
     .stroke();
  
  doc.moveDown(2);
  doc.fontSize(10).fillColor(COLORS.secondary).font(FONTS.body)
     .text('Professional Edition', { align: 'center' });
  
  doc.addPage();

  // Table of Contents
  doc.fontSize(20).fillColor(COLORS.primary)
     .text('Table of Contents', { underline: true });
  
  doc.moveDown(1);
  
  const tocItems = [
    '1. Email & Communication Prompts ..... 3',
    '2. Reports & Documentation Prompts ..... 8',
    '3. Content Creation Prompts ..... 13',
    '4. Productivity & Organization Prompts ..... 18',
    '5. Research & Analysis Prompts ..... 23',
    '6. Professional Email Templates ..... 28'
  ];
  
  tocItems.forEach(item => {
    doc.fontSize(12).fillColor(COLORS.primary)
       .text(item);
    doc.moveDown(0.3);
  });
  
  doc.addPage();

  // Process content line by line
  let currentSection = '';
  let pageNumber = 3; // Starting from page 3 (after cover and TOC)
  
  lines.forEach((line, index) => {
    // Skip empty lines at the beginning
    if (index < 10 && line.trim() === '') return;
    
    // Check for section headers
    if (line.startsWith('PART ') || line.startsWith('#')) {
      // Add page number to previous page if needed
      if (doc.page.height - doc.y < 100 && currentSection !== '') {
        doc.fontSize(8).fillColor(COLORS.secondary)
           .text(`Page ${pageNumber}`, 500, doc.page.height - 30);
        doc.addPage();
        pageNumber++;
      }
      
      // Add section title
      doc.fontSize(16).fillColor(COLORS.primary).font(FONTS.heading)
         .text(line.replace(/[#=\-]+/g, '').trim());
      doc.moveDown(0.5);
      currentSection = line;
    } 
    // Check for prompt headers
    else if (line.startsWith('### Prompt') || line.startsWith('### Template')) {
      // Add page break if needed
      if (doc.page.height - doc.y < 200) {
        doc.fontSize(8).fillColor(COLORS.secondary)
           .text(`Page ${pageNumber}`, 500, doc.page.height - 30);
        doc.addPage();
        pageNumber++;
      }
      
      // Add prompt/template title
      doc.fontSize(14).fillColor(COLORS.accent).font(FONTS.heading)
         .text(line.replace(/[#=\-]+/g, '').trim());
      doc.moveDown(0.3);
    }
    // Check for use case
    else if (line.startsWith('**Use Case:') || line.startsWith('**Use Case:**')) {
      doc.fontSize(10).fillColor(COLORS.secondary).font(FONTS.subheading)
         .text(line.replace(/[*]+/g, '').trim());
      doc.moveDown(0.3);
    }
    // Check for code blocks
    else if (line.startsWith('```')) {
      // Skip the code block markers
    }
    // Regular content
    else if (line.trim() !== '') {
      // Add page break if needed
      if (doc.page.height - doc.y < 50 && line.length > 0) {
        doc.fontSize(8).fillColor(COLORS.secondary)
           .text(`Page ${pageNumber}`, 500, doc.page.height - 30);
        doc.addPage();
        pageNumber++;
      }
      
      // Add content with appropriate formatting
      doc.fontSize(9).fillColor(COLORS.primary).font(FONTS.body);
      
      // Handle long lines
      if (line.length > 80) {
        const words = line.split(' ');
        let currentLine = '';
        
        words.forEach(word => {
          if ((currentLine + word).length > 80) {
            doc.text(currentLine);
            currentLine = word + ' ';
          } else {
            currentLine += word + ' ';
          }
        });
        
        if (currentLine.trim() !== '') {
          doc.text(currentLine.trim());
        }
      } else {
        doc.text(line);
      }
      
      doc.moveDown(0.2);
    }
    
    // Add page numbers periodically
    if (index % 50 === 0 && index > 0) {
      doc.fontSize(8).fillColor(COLORS.secondary)
         .text(`Page ${pageNumber}`, 500, doc.page.height - 30);
    }
  });

  // Add final page number
  doc.fontSize(8).fillColor(COLORS.secondary)
     .text(`Page ${pageNumber}`, 500, doc.page.height - 30);

  // Finalize PDF file
  doc.end();

  console.log(`✅ Professional PDF created at: ${outputPdfPath}`);
  console.log(`📊 Estimated pages: ${pageNumber}`);
  
  // Get file stats
  const stats = fs.statSync(outputPdfPath);
  console.log(`📁 File size: ${(stats.size / 1024).toFixed(2)} KB`);
}

// Export the function
export { createProfessionalStarterPackPDF };