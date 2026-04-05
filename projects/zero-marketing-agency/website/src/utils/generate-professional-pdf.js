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

function createProfessionalPDF(outputPath) {
  // Create a document
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 50, bottom: 50, left: 50, right: 50 },
    bufferPages: true
  });

  // Pipe its output somewhere, like to a file or HTTP response
  doc.pipe(fs.createWriteStream(outputPath));

  // Cover Page
  doc.fontSize(24).fillColor(COLORS.primary).font(FONTS.heading)
     .text('Zero Method', { align: 'center' });
  
  doc.moveDown(0.5);
  doc.fontSize(16).fillColor(COLORS.accent)
     .text('AI Prompts Starter Pack', { align: 'center' });
  
  doc.moveDown(2);
  doc.fontSize(12).fillColor(COLORS.secondary)
     .text('25 Battle-Tested Prompts + 10 Email Templates', { align: 'center' });
  
  doc.moveDown(4);
  doc.fontSize(10).fillColor(COLORS.secondary)
     .text('Save 5+ Hours Per Week with AI', { align: 'center' });
  
  // Add a decorative line
  doc.moveTo(100, doc.y + 30)
     .lineTo(500, doc.y + 30)
     .strokeColor(COLORS.accent)
     .stroke();
  
  doc.addPage();

  // Table of Contents
  doc.fontSize(18).fillColor(COLORS.primary)
     .text('Table of Contents', { underline: true });
  
  doc.moveDown(1);
  
  const tocItems = [
    '1. Email & Communication Prompts ..... 3',
    '2. Reports & Documentation Prompts ..... 7',
    '3. Content Creation Prompts ..... 11',
    '4. Productivity & Organization Prompts ..... 15',
    '5. Research & Analysis Prompts ..... 19',
    '6. Professional Email Templates ..... 23'
  ];
  
  tocItems.forEach(item => {
    doc.fontSize(12).fillColor(COLORS.primary)
       .text(item, { continued: true })
       .fillColor(COLORS.secondary)
       .text(' ......................... ')
       .fillColor(COLORS.accent)
       .text('Page ' + item.split('.....')[1]);
  });
  
  doc.addPage();

  // Section 1: Email & Communication Prompts
  doc.fontSize(18).fillColor(COLORS.primary)
     .text('1. Email & Communication Prompts', { underline: true });
  
  doc.moveDown(1);
  
  const emailPrompts = [
    {
      title: 'Professional Email Polisher',
      useCase: 'Turn rough notes into polished emails',
      prompt: `I need to send a professional email about: [topic]

Here's what I want to communicate:
[your rough notes or bullet points]

Context:
- Recipient: [who you're emailing]
- Relationship: [formal / casual / client]
- Goal: [what you want them to do]
- Urgency: [low / medium / high]

Please write a clear, professional email that:
1. Has an appropriate subject line
2. Gets straight to the point
3. Includes a clear call-to-action
4. Matches the tone to the relationship
5. Is no longer than necessary`
    },
    {
      title: 'Difficult Conversation Starter',
      useCase: 'Say no, push back, or address issues professionally',
      prompt: `I need to [say no to / push back on / address an issue with]:
[situation]

Key points:
- What's happening: [brief description]
- Why I can't agree: [your reason]
- What I can offer instead: [alternative, if any]
- Relationship importance: [high / medium / low]

Write a response that is:
1. Clear and direct (no beating around the bush)
2. Professional but firm
3. Brief (2-3 paragraphs max)
4. Leaves the door open for future collaboration
5. Doesn't over-explain or apologize excessively`
    }
    // Additional prompts would go here...
  ];

  emailPrompts.forEach((promptItem, index) => {
    if (index > 0) doc.addPage();
    
    doc.fontSize(14).fillColor(COLORS.primary)
       .text(`Prompt #${index + 1}: ${promptItem.title}`, { underline: true });
    
    doc.moveDown(0.5);
    doc.fontSize(10).fillColor(COLORS.accent)
       .text(`Use Case: ${promptItem.useCase}`);
    
    doc.moveDown(0.5);
    doc.fontSize(9).fillColor(COLORS.secondary)
       .text('Prompt Template:', { underline: true });
    
    doc.moveDown(0.3);
    doc.fontSize(8).fillColor(COLORS.primary)
       .font(FONTS.code)
       .text(promptItem.prompt, {
         width: 450,
         indent: 20,
         paragraphGap: 5,
         lineBreak: true
       });
    
    doc.font(FONTS.body); // Reset font
  });

  // Add more sections similarly...

  // Finalize PDF file
  doc.end();

  console.log(`Professional PDF created at: ${outputPath}`);
}

// Export the function
export { createProfessionalPDF };