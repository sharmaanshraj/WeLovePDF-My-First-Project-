import { useState } from 'react';
import { PDFDocument } from '@cantoo/pdf-lib';
import { Layers } from 'lucide-react';
import ToolLayout from '../components/ToolLayout';

export default function MergePDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const handleProcess = async (selectedFiles: File[]) => {
    if (selectedFiles.length < 2) {
      alert('Please select at least 2 PDF files to merge.');
      return;
    }

    setProcessing(true);
    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of selectedFiles) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
    } catch (error) {
      console.error('Error merging PDFs:', error);
      alert('An error occurred while merging the PDFs. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ToolLayout
      title="Merge PDF"
      description="Combine PDFs in the order you want with the easiest PDF merger available."
      color="bg-red-500"
      icon={Layers}
      acceptMultiple={true}
      onProcess={handleProcess}
      processing={processing}
      resultUrl={resultUrl}
      resultFilename="merged.pdf"
      files={files}
      setFiles={setFiles}
    >
      <div className="text-sm text-gray-600 space-y-4">
        <p>
          <strong>Tip:</strong> You can drag and drop files to reorder them before merging.
        </p>
        <p>
          Currently, the files will be merged in the order they were selected or dropped.
        </p>
      </div>
    </ToolLayout>
  );
}
