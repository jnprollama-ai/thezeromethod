/**
 * PDF Split Tool
 * Extract specific pages from PDF files
 */

const { PDFDocument } = PDFLib;

// DOM Elements
const dropZone = document.getElementById('split-drop-zone');
const fileInput = document.getElementById('split-input');
const splitConfig = document.getElementById('split-config');
const filenameDisplay = document.getElementById('split-filename');
const fileInfoDisplay = document.getElementById('split-fileinfo');
const pagesInput = document.getElementById('split-pages');
const splitBtn = document.getElementById('split-btn');
const clearBtn = document.getElementById('split-clear');
const resultSection = document.getElementById('split-result');
const sizeDisplay = document.getElementById('split-size');
const downloadLink = document.getElementById('split-download');

let currentFile = null;
let totalPages = 0;

// Event Listeners
dropZone.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFile(e.target.files[0]);
    }
});

// Drag and Drop
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type === 'application/pdf') {
        handleFile(files[0]);
    }
});

splitBtn.addEventListener('click', splitPDF);
clearBtn.addEventListener('click', clearFile);

// Handle file
async function handleFile(file) {
    if (file.type !== 'application/pdf') {
        alert('Please select a PDF file.');
        return;
    }
    
    currentFile = file;
    
    try {
        // Load PDF to get page count
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        totalPages = pdf.getPageCount();
        
        // Update UI
        filenameDisplay.textContent = file.name;
        fileInfoDisplay.textContent = `(${totalPages} pages, ${formatFileSize(file.size)})`;
        
        // Show config section
        splitConfig.style.display = 'block';
        resultSection.style.display = 'none';
        
        // Set placeholder with example
        pagesInput.placeholder = `e.g., 1-5, 8, 10-${totalPages}`;
        
    } catch (error) {
        console.error('Error loading PDF:', error);
        alert('Error loading PDF. Please try again.');
    }
}

// Split PDF
async function splitPDF() {
    if (!currentFile) {
        alert('Please select a PDF file first.');
        return;
    }
    
    const pageRanges = pagesInput.value.trim();
    if (!pageRanges) {
        alert('Please enter page numbers to extract.');
        return;
    }
    
    try {
        splitBtn.disabled = true;
        splitBtn.querySelector('.btn-text').style.display = 'none';
        splitBtn.querySelector('.btn-loading').style.display = 'inline';
        
        // Parse page ranges
        const pagesToExtract = parsePageRanges(pageRanges, totalPages);
        
        if (pagesToExtract.length === 0) {
            alert('Invalid page range. Please check your input.');
            return;
        }
        
        if (pagesToExtract.length === totalPages) {
            alert('You selected all pages. No splitting needed.');
            return;
        }
        
        // Load original PDF
        const arrayBuffer = await currentFile.arrayBuffer();
        const originalPdf = await PDFDocument.load(arrayBuffer);
        
        // Create new PDF
        const newPdf = await PDFDocument.create();
        
        // Copy selected pages
        const pageIndices = pagesToExtract.map(p => p - 1); // Convert to 0-based
        const copiedPages = await newPdf.copyPages(originalPdf, pageIndices);
        copiedPages.forEach(page => newPdf.addPage(page));
        
        // Save new PDF
        const newPdfBytes = await newPdf.save();
        const blob = new Blob([newPdfBytes], { type: 'application/pdf' });
        
        // Create download link
        const url = URL.createObjectURL(blob);
        downloadLink.href = url;
        
        // Generate filename
        const originalName = currentFile.name.replace('.pdf', '');
        const pageRangeStr = pagesToExtract.length === 1 
            ? `page_${pagesToExtract[0]}` 
            : `pages_${pagesToExtract[0]}-${pagesToExtract[pagesToExtract.length - 1]}`;
        downloadLink.download = `${originalName}_${pageRangeStr}.pdf`;
        
        // Show result
        sizeDisplay.textContent = formatFileSize(blob.size);
        resultSection.style.display = 'block';
        
        // Scroll to result
        resultSection.scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        console.error('Error splitting PDF:', error);
        alert('Error splitting PDF. Please check your page range and try again.');
    } finally {
        splitBtn.disabled = false;
        splitBtn.querySelector('.btn-text').style.display = 'inline';
        splitBtn.querySelector('.btn-loading').style.display = 'none';
    }
}

// Parse page ranges (e.g., "1-5, 8, 10-12" -> [1,2,3,4,5,8,10,11,12])
function parsePageRanges(input, maxPages) {
    const pages = new Set();
    const parts = input.split(',').map(p => p.trim());
    
    for (const part of parts) {
        if (part.includes('-')) {
            // Range (e.g., "1-5")
            const [start, end] = part.split('-').map(n => parseInt(n.trim()));
            if (!isNaN(start) && !isNaN(end)) {
                for (let i = start; i <= end; i++) {
                    if (i >= 1 && i <= maxPages) {
                        pages.add(i);
                    }
                }
            }
        } else {
            // Single page
            const pageNum = parseInt(part);
            if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= maxPages) {
                pages.add(pageNum);
            }
        }
    }
    
    return Array.from(pages).sort((a, b) => a - b);
}

// Clear file
function clearFile() {
    currentFile = null;
    totalPages = 0;
    splitConfig.style.display = 'none';
    resultSection.style.display = 'none';
    pagesInput.value = '';
    fileInput.value = '';
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}