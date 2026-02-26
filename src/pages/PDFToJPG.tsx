import { useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { Image as ImageIcon } from 'lucide-react';
import ToolLayout from '../components/ToolLayout';

// Set up the worker for pdfjs
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export default function PDFToJPG() {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [quality, setQuality] = useState(0.8);

  const handleProcess = async (selectedFiles: File[]) => {
    if (selectedFiles.length === 0) return;

    setProcessing(true);
    try {
      const file = selectedFiles[0];
      const arrayBuffer = await file.arrayBuffer();
      
      // Load the PDF document
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      
      const numPages = pdf.numPages;
      const images: string[] = [];

      // Render each page to a canvas and convert to JPG
      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 }); // 2x scale for better quality
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        if (!context) throw new Error('Could not create canvas context');
        
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        const renderContext = {
          canvasContext: context,
          canvas: canvas,
          viewport: viewport,
        };
        
        await page.render(renderContext).promise;
        
        // Convert canvas to JPG data URL
        const imgData = canvas.toDataURL('image/jpeg', quality);
        images.push(imgData);
      }

      // If it's a single page, just download the image
      // If multiple pages, we could create a zip, but for simplicity we'll just show them or download the first one
      // Let's create an HTML page that displays all images and allows downloading them
      
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Extracted Images - ${file.name}</title>
          <style>
            body { font-family: system-ui, sans-serif; background: #f3f4f6; padding: 2rem; margin: 0; text-align: center; }
            .container { max-w-4xl mx-auto; }
            .image-card { background: white; padding: 1rem; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin-bottom: 2rem; display: inline-block; }
            img { max-width: 100%; height: auto; border: 1px solid #e5e7eb; }
            .download-btn { display: inline-block; margin-top: 1rem; padding: 0.5rem 1rem; background: #8b5cf6; color: white; text-decoration: none; border-radius: 0.25rem; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Extracted Images from ${file.name}</h1>
            <p>Right-click an image to save it, or use the download button below each image.</p>
            ${images.map((img, idx) => `
              <div class="image-card">
                <h3>Page ${idx + 1}</h3>
                <img src="${img}" alt="Page ${idx + 1}" />
                <br />
                <a href="${img}" download="page-${idx + 1}.jpg" class="download-btn">Download Page ${idx + 1}</a>
              </div>
            `).join('')}
          </div>
        </body>
        </html>
      `;
      
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
    } catch (error) {
      console.error('Error converting PDF to JPG:', error);
      alert('An error occurred while converting the PDF. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ToolLayout
      title="PDF to JPG"
      description="Convert each PDF page into a JPG image."
      color="bg-purple-500"
      icon={ImageIcon}
      acceptMultiple={false}
      onProcess={handleProcess}
      processing={processing}
      resultUrl={resultUrl}
      resultFilename="extracted-images.html"
      files={files}
      setFiles={setFiles}
    >
      {files.length > 0 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image Quality: {Math.round(quality * 100)}%
            </label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={quality}
              onChange={(e) => setQuality(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <p className="text-xs text-gray-500 mt-2">
              Higher quality means larger file sizes.
            </p>
          </div>
          <div className="text-sm text-gray-600 bg-purple-50 p-4 rounded-lg border border-purple-100">
            <p>
              <strong>Note:</strong> The result will be an HTML file containing all extracted images.
              You can open it in your browser and save the images individually.
            </p>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
