/**
 * PDF Merge Tool
 * Uses pdf-lib for client-side PDF manipulation
 */

const { PDFDocument } = PDFLib;

// DOM Elements
const dropZone = document.getElementById('merge-drop-zone');
const fileInput = document.getElementById('merge-input');
const fileList = document.getElementById('merge-file-list');
const filesContainer = document.getElementById('merge-files');
const mergeBtn = document.getElementById('merge-btn');
const clearBtn = document.getElementById('merge-clear');
const resultSection = document.getElementById('merge-result');
const sizeDisplay = document.getElementById('merge-size');
const downloadLink = document.getElementById('merge-download');

let files = [];
let draggedItem = null;

// Event Listeners
dropZone.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (e) => {
    handleFiles(Array.from(e.target.files));
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
    const droppedFiles = Array.from(e.dataTransfer.files).filter(f => f.type === 'application/pdf');
    handleFiles(droppedFiles);
});

mergeBtn.addEventListener('click', mergePDFs);
clearBtn.addEventListener('click', clearFiles);

// Handle files
function handleFiles(newFiles) {
    const pdfFiles = newFiles.filter(f => f.type === 'application/pdf');
    
    if (pdfFiles.length === 0) {
        alert('Please select PDF files only.');
        return;
    }
    
    files = [...files, ...pdfFiles];
    updateFileList();
    fileList.style.display = 'block';
}

// Update file list UI
function updateFileList() {
    filesContainer.innerHTML = '';
    
    files.forEach((file, index) => {
        const item = document.createElement('div');
        item.className = 'file-item';
        item.draggable = true;
        item.dataset.index = index;
        
        item.innerHTML = `
            <span class="file-icon">📄</span>
            <div class="file-info">
                <div class="file-name">${file.name}</div>
                <div class="file-size">${formatFileSize(file.size)}</div>
            </div>
            <button class="file-remove" data-index="${index}">✕</button>
        `;
        
        // Drag events
        item.addEventListener('dragstart', (e) => {
            draggedItem = item;
            item.classList.add('dragging');
        });
        
        item.addEventListener('dragend', () => {
            item.classList.remove('dragging');
            draggedItem = null;
        });
        
        item.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (draggedItem && draggedItem !== item) {
                const draggedIndex = parseInt(draggedItem.dataset.index);
                const targetIndex = parseInt(item.dataset.index);
                
                // Swap files
                [files[draggedIndex], files[targetIndex]] = [files[targetIndex], files[draggedIndex]];
                updateFileList();
            }
        });
        
        // Remove button
        item.querySelector('.file-remove').addEventListener('click', (e) => {
            e.stopPropagation();
            const index = parseInt(e.target.dataset.index);
            files.splice(index, 1);
            updateFileList();
            
            if (files.length === 0) {
                fileList.style.display = 'none';
                resultSection.style.display = 'none';
            }
        });
        
        filesContainer.appendChild(item);
    });
}

// Merge PDFs
async function mergePDFs() {
    if (files.length < 2) {
        alert('Please select at least 2 PDF files to merge.');
        return;
    }
    
    try {
        mergeBtn.disabled = true;
        mergeBtn.querySelector('.btn-text').style.display = 'none';
        mergeBtn.querySelector('.btn-loading').style.display = 'inline';
        
        // Create new PDF document
        const mergedPdf = await PDFDocument.create();
        
        // Process each file
        for (const file of files) {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await PDFDocument.load(arrayBuffer);
            
            // Copy all pages
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach(page => mergedPdf.addPage(page));
        }
        
        // Save merged PDF
        const mergedPdfBytes = await mergedPdf.save();
        const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
        
        // Create download link
        const url = URL.createObjectURL(blob);
        downloadLink.href = url;
        downloadLink.download = `merged_${Date.now()}.pdf`;
        
        // Show result
        sizeDisplay.textContent = formatFileSize(blob.size);
        resultSection.style.display = 'block';
        
        // Scroll to result
        resultSection.scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        console.error('Error merging PDFs:', error);
        alert('Error merging PDFs. Please try again.');
    } finally {
        mergeBtn.disabled = false;
        mergeBtn.querySelector('.btn-text').style.display = 'inline';
        mergeBtn.querySelector('.btn-loading').style.display = 'none';
    }
}

// Clear all files
function clearFiles() {
    files = [];
    updateFileList();
    fileList.style.display = 'none';
    resultSection.style.display = 'none';
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}