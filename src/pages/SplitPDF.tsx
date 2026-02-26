import { useState } from 'react';
import { PDFDocument } from '@cantoo/pdf-lib';
import { Scissors } from 'lucide-react';
import ToolLayout from '../components/ToolLayout';

export default function SplitPDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [startPage, setStartPage] = useState<number>(1);
  const [endPage, setEndPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);

  const handleFileChange = async (newFiles: File[]) => {
    setFiles(newFiles);
    if (newFiles.length > 0) {
      try {
        const arrayBuffer = await newFiles[0].arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const count = pdf.getPageCount();
        setTotalPages(count);
        setStartPage(1);
        setEndPage(count);
      } catch (error) {
        console.error('Error loading PDF:', error);
      }
    } else {
      setTotalPages(0);
    }
  };

  const handleProcess = async (selectedFiles: File[]) => {
    if (selectedFiles.length === 0) return;

    if (startPage < 1 || endPage > totalPages || startPage > endPage) {
      alert('Invalid page range.');
      return;
    }

    setProcessing(true);
    try {
      const file = selectedFiles[0];
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);

      const splitPdf = await PDFDocument.create();
      const pageIndices = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage - 1 + i);
      const copiedPages = await splitPdf.copyPages(pdf, pageIndices);
      copiedPages.forEach((page) => splitPdf.addPage(page));

      const pdfBytes = await splitPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
    } catch (error) {
      console.error('Error splitting PDF:', error);
      alert('An error occurred while splitting the PDF. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ToolLayout
      title="Split PDF"
      description="Extract a range of pages from your PDF file."
      color="bg-orange-500"
      icon={Scissors}
      acceptMultiple={false}
      onProcess={handleProcess}
      processing={processing}
      resultUrl={resultUrl}
      resultFilename="split.pdf"
      files={files}
      setFiles={handleFileChange}
    >
      {files.length > 0 && totalPages > 0 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Extract Pages
            </label>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">From</label>
                <input
                  type="number"
                  min={1}
                  max={endPage}
                  value={startPage}
                  onChange={(e) => setStartPage(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">To</label>
                <input
                  type="number"
                  min={startPage}
                  max={totalPages}
                  value={endPage}
                  onChange={(e) => setEndPage(parseInt(e.target.value) || totalPages)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Total pages in document: {totalPages}
            </p>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
