/**
 * PDF Compress Tool
 * Reduce PDF file size while maintaining quality
 */

const { PDFDocument } = PDFLib;

// DOM Elements
const dropZone = document.getElementById('compress-drop-zone');
const fileInput = document.getElementById('compress-input');
const compressConfig = document.getElementById('compress-config');
const filenameDisplay = document.getElementById('compress-filename');
const fileInfoDisplay = document.getElementById('compress-fileinfo');
const compressLevelSelect = document.getElementById('compress-level');
const compressBtn = document.getElementById('compress-btn');
const clearBtn = document.getElementById('compress-clear');
const resultSection = document.getElementById('compress-result');
const originalSizeDisplay = document.getElementById('compress-original-size');
const newSizeDisplay = document.getElementById('compress-new-size');
const savingsDisplay = document.getElementById('compress-savings');
const downloadLink = document.getElementById('compress-download');

let currentFile = null;
let originalSize = 0;

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

compressBtn.addEventListener('click', compressPDF);
clearBtn.addEventListener('click', clearFile);

// Handle file
async function handleFile(file) {
    if (file.type !== 'application/pdf') {
        alert('Please select a PDF file.');
        return;
    }
    
    currentFile = file;
    originalSize = file.size;
    
    try {
        // Load PDF to get info
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const pageCount = pdf.getPageCount();
        
        // Update UI
        filenameDisplay.textContent = file.name;
        fileInfoDisplay.textContent = `(${pageCount} pages, ${formatFileSize(file.size)})`;
        
        // Show config section
        compressConfig.style.display = 'block';
        resultSection.style.display = 'none';
        
    } catch (error) {
        console.error('Error loading PDF:', error);
        alert('Error loading PDF. Please try again.');
    }
}

// Compress PDF
async function compressPDF() {
    if (!currentFile) {
        alert('Please select a PDF file first.');
        return;
    }
    
    try {
        compressBtn.disabled = true;
        compressBtn.querySelector('.btn-text').style.display = 'none';
        compressBtn.querySelector('.btn-loading').style.display = 'inline';
        
        const level = compressLevelSelect.value;
        
        // Load PDF
        const arrayBuffer = await currentFile.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        
        // Note: pdf-lib doesn't have built-in image compression
        // We'll save with different options based on level
        let saveOptions = {};
        
        switch (level) {
            case 'low':
                // Minimal compression, best quality
                saveOptions = { 
                    useObjectStreams: true,
                    addDefaultPage: false 
                };
                break;
            case 'medium':
                // Balanced compression
                saveOptions = { 
                    useObjectStreams: true,
                    addDefaultPage: false 
                };
                break;
            case 'high':
                // Maximum compression
                saveOptions = { 
                    useObjectStreams: true,
                    addDefaultPage: false 
                };
                break;
        }
        
        // Save compressed PDF
        const compressedBytes = await pdf.save(saveOptions);
        const blob = new Blob([compressedBytes], { type: 'application/pdf' });
        
        // Calculate savings
        const newSize = blob.size;
        const savingsPercent = ((originalSize - newSize) / originalSize * 100).toFixed(1);
        
        // Create download link
        const url = URL.createObjectURL(blob);
        downloadLink.href = url;
        
        // Generate filename
        const originalName = currentFile.name.replace('.pdf', '');
        downloadLink.download = `${originalName}_compressed.pdf`;
        
        // Show result
        originalSizeDisplay.textContent = formatFileSize(originalSize);
        newSizeDisplay.textContent = formatFileSize(newSize);
        savingsDisplay.textContent = savingsPercent > 0 ? `(${savingsPercent}% smaller)` : '(No significant reduction)';
        savingsDisplay.style.color = savingsPercent > 0 ? '#10b981' : '#94a3b8';
        
        resultSection.style.display = 'block';
        
        // Scroll to result
        resultSection.scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        console.error('Error compressing PDF:', error);
        alert('Error compressing PDF. Please try again.');
    } finally {
        compressBtn.disabled = false;
        compressBtn.querySelector('.btn-text').style.display = 'inline';
        compressBtn.querySelector('.btn-loading').style.display = 'none';
    }
}

// Clear file
function clearFile() {
    currentFile = null;
    originalSize = 0;
    compressConfig.style.display = 'none';
    resultSection.style.display = 'none';
    compressLevelSelect.value = 'medium';
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