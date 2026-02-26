import { useState } from 'react';
import { PDFDocument, rgb, degrees, StandardFonts } from '@cantoo/pdf-lib';
import { Type } from 'lucide-react';
import ToolLayout from '../components/ToolLayout';

export default function WatermarkPDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [opacity, setOpacity] = useState(0.3);

  const handleProcess = async (selectedFiles: File[]) => {
    if (selectedFiles.length === 0 || !watermarkText) return;

    setProcessing(true);
    try {
      const file = selectedFiles[0];
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      const pages = pdfDoc.getPages();
      pages.forEach((page) => {
        const { width, height } = page.getSize();
        const fontSize = 60;
        const textWidth = helveticaFont.widthOfTextAtSize(watermarkText, fontSize);
        const textHeight = helveticaFont.heightAtSize(fontSize);

        page.drawText(watermarkText, {
          x: width / 2 - textWidth / 2,
          y: height / 2 - textHeight / 2,
          size: fontSize,
          font: helveticaFont,
          color: rgb(0.8, 0.2, 0.2), // Reddish color
          opacity: opacity,
          rotate: degrees(45),
        });
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
    } catch (error) {
      console.error('Error adding watermark:', error);
      alert('An error occurred while adding the watermark. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ToolLayout
      title="Watermark PDF"
      description="Stamp text over your PDF in seconds."
      color="bg-green-500"
      icon={Type}
      acceptMultiple={false}
      onProcess={handleProcess}
      processing={processing}
      resultUrl={resultUrl}
      resultFilename="watermarked.pdf"
      files={files}
      setFiles={setFiles}
    >
      {files.length > 0 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Watermark Text
            </label>
            <input
              type="text"
              value={watermarkText}
              onChange={(e) => setWatermarkText(e.target.value)}
              placeholder="Enter watermark text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-shadow"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Opacity: {Math.round(opacity * 100)}%
            </label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={opacity}
              onChange={(e) => setOpacity(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
            />
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
