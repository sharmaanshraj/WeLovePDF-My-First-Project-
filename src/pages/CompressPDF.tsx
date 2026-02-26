import { useState } from 'react';
import { PDFDocument } from '@cantoo/pdf-lib';
import { FileText } from 'lucide-react';
import ToolLayout from '../components/ToolLayout';

export default function CompressPDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const handleProcess = async (selectedFiles: File[]) => {
    if (selectedFiles.length === 0) return;

    setProcessing(true);
    try {
      const file = selectedFiles[0];
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      // Saving with useObjectStreams helps compress the PDF structure
      const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
    } catch (error) {
      console.error('Error compressing PDF:', error);
      alert('An error occurred while compressing the PDF. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ToolLayout
      title="Compress PDF"
      description="Reduce file size while optimizing for maximal PDF quality."
      color="bg-blue-500"
      icon={FileText}
      acceptMultiple={false}
      onProcess={handleProcess}
      processing={processing}
      resultUrl={resultUrl}
      resultFilename="compressed.pdf"
      files={files}
      setFiles={setFiles}
    >
      <div className="text-sm text-gray-600 space-y-4">
        <p>
          <strong>Note:</strong> This tool performs a basic structural compression by enabling object streams.
          It may not significantly reduce the size of PDFs that are already optimized or contain large images.
        </p>
      </div>
    </ToolLayout>
  );
}
