import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the markdown files
async function readMarkdownFiles() {
  const promptsPath = path.join(__dirname, '..', '..', '..', 'product', '25-prompts.md');
  const templatesPath = path.join(__dirname, '..', '..', '..', 'product', '10-templates.md');
  
  const promptsContent = await fs.readFile(promptsPath, 'utf8');
  const templatesContent = await fs.readFile(templatesPath, 'utf8');
  
  return { promptsContent, templatesContent };
}

// Simple function to create a text file with all content
async function createCompleteDocument() {
  console.log('Creating complete document with all prompts and templates...');
  
  // Read markdown files
  const { promptsContent, templatesContent } = await readMarkdownFiles();
  
  // Combine all content
  const completeContent = `
ZERO METHOD STARTER PACK
=======================

25 Battle-Tested AI Prompts + 10 Email Templates
Save 5+ Hours Per Week with AI

TABLE OF CONTENTS
=================

1. EMAIL & COMMUNICATION PROMPTS
2. REPORTS & DOCUMENTATION PROMPTS
3. CONTENT CREATION PROMPTS
4. PRODUCTIVITY & ORGANIZATION PROMPTS
5. RESEARCH & ANALYSIS PROMPTS
6. PROFESSIONAL EMAIL TEMPLATES

${'='.repeat(50)}

PART 1: EMAIL & COMMUNICATION PROMPTS
${'='.repeat(40)}

${promptsContent}

${'='.repeat(50)}

PART 2: PROFESSIONAL EMAIL TEMPLATES
${'='.repeat(40)}

${templatesContent}

${'='.repeat(50)}

Thank you for purchasing the Zero Method Starter Pack!

For support, contact: support@thezeromethod.com
`;
  
  // Clean up special characters that might cause issues
  const cleanContent = completeContent
    .replace(/→/g, '->')
    .replace(/•/g, '-')
    .replace(/[^\x00-\x7F]/g, ""); // Remove non-ASCII characters
  
  return cleanContent;
}

// Export the function
export { createCompleteDocument };