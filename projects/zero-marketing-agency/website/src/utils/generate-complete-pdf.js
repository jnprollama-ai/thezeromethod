import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Professional color scheme for Zero Method
const COLORS = {
  primary: rgb(15/255, 23/255, 42/255),    // Deep Navy #0F172A
  accent: rgb(245/255, 158/255, 11/255),   // Gold #F59E0B
  secondary: rgb(148/255, 163/255, 184/255), // Muted Gray #94A3B8
  light: rgb(255/255, 255/255, 255/255),   // White #FFFFFF
  dark: rgb(30/255, 41/255, 59/255)        // Dark Navy #1E293B
};

// Read the markdown files
async function readMarkdownFiles() {
  const promptsPath = path.join(__dirname, '..', '..', '..', 'product', '25-prompts.md');
  const templatesPath = path.join(__dirname, '..', '..', '..', 'product', '10-templates.md');
  
  const promptsContent = await fs.readFile(promptsPath, 'utf8');
  const templatesContent = await fs.readFile(templatesPath, 'utf8');
  
  return { promptsContent, templatesContent };
}

// Parse markdown content into sections
function parseMarkdownSections(content) {
  const sections = [];
  const lines = content.split('\n');
  let currentSection = null;
  
  for (const line of lines) {
    if (line.startsWith('## ') || line.startsWith('### ')) {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = {
        title: line.replace(/^#+\s*/, ''),
        content: '',
        level: line.startsWith('## ') ? 2 : 3
      };
    } else if (currentSection) {
      currentSection.content += line + '\n';
    }
  }
  
  if (currentSection) {
    sections.push(currentSection);
  }
  
  return sections;
}

// Add a cover page
function addCoverPage(page, font, boldFont) {
  const { width, height } = page.getSize();
  
  // Add title
  page.setFont(boldFont);
  page.setFontColor(COLORS.primary);
  page.setFontSize(36);
  page.drawText('Zero Method', {
    x: width / 2 - 100,
    y: height - 150,
  });
  
  page.setFontSize(20);
  page.setFontColor(COLORS.accent);
  page.drawText('AI Prompts Starter Pack', {
    x: width / 2 - 120,
    y: height - 200,
  });
  
  page.setFontSize(14);
  page.setFontColor(COLORS.secondary);
  page.setFont(font);
  page.drawText('25 Battle-Tested Prompts + 10 Email Templates', {
    x: width / 2 - 180,
    y: height - 250,
  });
  
  page.drawText('Save 5+ Hours Per Week with AI', {
    x: width / 2 - 120,
    y: height - 280,
  });
  
  // Add decorative line
  page.drawLine({
    start: { x: 100, y: height - 320 },
    end: { x: width - 100, y: height - 320 },
    thickness: 2,
    color: COLORS.accent,
  });
  
  // Add page number
  page.setFontSize(10);
  page.setFontColor(COLORS.secondary);
  page.drawText('Page 1', {
    x: width - 60,
    y: 30,
  });
}

// Add table of contents
async function addTableOfContents(pdfDoc, font, boldFont) {
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  
  page.setFont(boldFont);
  page.setFontColor(COLORS.primary);
  page.setFontSize(24);
  page.drawText('Table of Contents', {
    x: 50,
    y: height - 100,
  });
  
  page.setFontSize(14);
  page.setFontColor(COLORS.dark);
  page.setFont(font);
  
  const tocItems = [
    '1. Email & Communication Prompts .................................... 3',
    '2. Reports & Documentation Prompts ............................... 11',
    '3. Content Creation Prompts .......................................... 19',
    '4. Productivity & Organization Prompts ............................ 27',
    '5. Research & Analysis Prompts ...................................... 35',
    '6. Professional Email Templates ..................................... 43'
  ];
  
  let yPos = height - 150;
  for (const item of tocItems) {
    page.drawText(item, {
      x: 50,
      y: yPos,
    });
    yPos -= 30;
  }
  
  // Add page number
  page.setFontSize(10);
  page.setFontColor(COLORS.secondary);
  page.drawText('Page 2', {
    x: width - 60,
    y: 30,
  });
  
  return page;
}

// Add content sections
async function addContentSections(pdfDoc, sections, font, boldFont, startIndex = 3) {
  let currentPageIndex = startIndex;
  let currentSection = 0;
  
  while (currentSection < sections.length) {
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    
    // Add section title
    page.setFont(boldFont);
    page.setFontColor(COLORS.primary);
    page.setFontSize(18);
    page.drawText(sections[currentSection].title, {
      x: 50,
      y: height - 80,
    });
    
    // Add content
    page.setFont(font);
    page.setFontSize(10);
    page.setFontColor(COLORS.dark);
    
    const contentLines = sections[currentSection].content.split('\n');
    let yPos = height - 120;
    
    for (const line of contentLines) {
      if (yPos < 100) {
        // Add page number
        page.setFontSize(10);
        page.setFontColor(COLORS.secondary);
        page.drawText(`Page ${currentPageIndex}`, {
          x: width - 60,
          y: 30,
        });
        
        // Start new page
        currentPageIndex++;
        const newPage = pdfDoc.addPage();
        const { width: newWidth, height: newHeight } = newPage.getSize();
        
        // Continue with content on new page
        yPos = newHeight - 80;
        page.setFont(font);
        page.setFontSize(10);
        page.setFontColor(COLORS.dark);
      }
      
      if (line.trim()) {
        page.drawText(line.substring(0, 100), {  // Limit line length
          x: 50,
          y: yPos,
        });
        yPos -= 15;
      } else {
        yPos -= 10; // Extra space for blank lines
      }
    }
    
    // Add page number
    page.setFontSize(10);
    page.setFontColor(COLORS.secondary);
    page.drawText(`Page ${currentPageIndex}`, {
      x: width - 60,
      y: 30,
    });
    
    currentPageIndex++;
    currentSection++;
  }
  
  return currentPageIndex;
}

// Generate the complete professional PDF
export async function generateCompletePDF(outputPath) {
  console.log('Generating complete professional PDF...');
  
  // Read markdown files
  const { promptsContent, templatesContent } = await readMarkdownFiles();
  
  // Parse content into sections
  const promptSections = parseMarkdownSections(promptsContent);
  const templateSections = parseMarkdownSections(templatesContent);
  
  // Create a new PDFDocument
  const pdfDoc = await PDFDocument.create();
  
  // Embed the Helvetica font
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  // Add cover page
  const coverPage = pdfDoc.addPage();
  addCoverPage(coverPage, font, boldFont);
  
  // Add table of contents
  await addTableOfContents(pdfDoc, font, boldFont);
  
  // Add prompt sections
  let currentPageIndex = 3;
  currentPageIndex = await addContentSections(pdfDoc, promptSections, font, boldFont, currentPageIndex);
  
  // Add template sections
  await addContentSections(pdfDoc, templateSections, font, boldFont, currentPageIndex);
  
  // Serialize the PDFDocument to bytes (a Uint8Array)
  const pdfBytes = await pdfDoc.save();
  
  // Write the PDF to a file
  await fs.writeFile(outputPath, pdfBytes);
  
  console.log(`Complete professional PDF created at: ${outputPath}`);
  
  // Get file stats
  const stats = await fs.stat(outputPath);
  console.log(`File size: ${(stats.size / 1024).toFixed(2)} KB`);
  console.log(`Pages: Approximately ${Math.ceil(stats.size / 1024 / 2)} pages`);
  
  return pdfBytes;
}