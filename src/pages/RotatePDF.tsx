import { useState } from 'react';
import { PDFDocument, degrees } from '@cantoo/pdf-lib';
import { RotateCw } from 'lucide-react';
import ToolLayout from '../components/ToolLayout';

export default function RotatePDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [rotation, setRotation] = useState<number>(90);

  const handleProcess = async (selectedFiles: File[]) => {
    if (selectedFiles.length === 0) return;

    setProcessing(true);
    try {
      const file = selectedFiles[0];
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      const pages = pdfDoc.getPages();
      pages.forEach((page) => {
        const currentRotation = page.getRotation().angle;
        page.setRotation(degrees(currentRotation + rotation));
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
    } catch (error) {
      console.error('Error rotating PDF:', error);
      alert('An error occurred while rotating the PDF. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ToolLayout
      title="Rotate PDF"
      description="Rotate your PDFs the way you need them."
      color="bg-yellow-500"
      icon={RotateCw}
      acceptMultiple={false}
      onProcess={handleProcess}
      processing={processing}
      resultUrl={resultUrl}
      resultFilename="rotated.pdf"
      files={files}
      setFiles={setFiles}
    >
      {files.length > 0 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Rotation Angle
            </label>
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="rotation"
                  value={90}
                  checked={rotation === 90}
                  onChange={() => setRotation(90)}
                  className="w-4 h-4 text-yellow-500 focus:ring-yellow-500"
                />
                <span className="text-sm font-medium text-gray-900">Right (90°)</span>
              </label>
              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="rotation"
                  value={180}
                  checked={rotation === 180}
                  onChange={() => setRotation(180)}
                  className="w-4 h-4 text-yellow-500 focus:ring-yellow-500"
                />
                <span className="text-sm font-medium text-gray-900">Upside Down (180°)</span>
              </label>
              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="rotation"
                  value={270}
                  checked={rotation === 270}
                  onChange={() => setRotation(270)}
                  className="w-4 h-4 text-yellow-500 focus:ring-yellow-500"
                />
                <span className="text-sm font-medium text-gray-900">Left (270°)</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
