import { createCompleteDocument } from './src/utils/simple-pdf-generator.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Generate a simple text file with all content
async function main() {
  try {
    const content = await createCompleteDocument();
    const outputPath = path.join(__dirname, 'public', 'downloads', 'zero-method-starter-pack.txt');
    
    await fs.writeFile(outputPath, content);
    console.log('✅ Complete document created successfully!');
    console.log(`📄 File saved at: ${outputPath}`);
    
    // Get file stats
    const stats = await fs.stat(outputPath);
    console.log(`📊 File size: ${(stats.size / 1024).toFixed(2)} KB`);
    
    // Show preview of what's in the file
    const preview = content.substring(0, 1000) + '\n\n... (content truncated for preview)';
    console.log('\n📋 Preview of content:');
    console.log(preview);
    
  } catch (error) {
    console.error('❌ Error creating document:', error);
  }
}

main();