import { useState } from 'react';
import { PDFDocument } from '@cantoo/pdf-lib';
import { Lock } from 'lucide-react';
import ToolLayout from '../components/ToolLayout';

export default function ProtectPDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [password, setPassword] = useState('');

  const handleProcess = async (selectedFiles: File[]) => {
    if (selectedFiles.length === 0 || !password) return;

    setProcessing(true);
    try {
      const file = selectedFiles[0];
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      // Encrypt the document
      pdfDoc.encrypt({
        userPassword: password,
        ownerPassword: password,
        permissions: {
          printing: 'highResolution',
          modifying: false,
          copying: false,
          annotating: false,
          fillingForms: false,
          contentAccessibility: false,
          documentAssembly: false,
        },
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
    } catch (error) {
      console.error('Error protecting PDF:', error);
      alert('An error occurred while protecting the PDF. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ToolLayout
      title="Protect PDF"
      description="Encrypt your PDF with a password to keep sensitive data confidential."
      color="bg-pink-500"
      icon={Lock}
      acceptMultiple={false}
      onProcess={handleProcess}
      processing={processing}
      resultUrl={resultUrl}
      resultFilename="protected.pdf"
      files={files}
      setFiles={setFiles}
    >
      {files.length > 0 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Set Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter a strong password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-shadow"
            />
            <p className="text-xs text-gray-500 mt-2">
              This password will be required to open the PDF file.
            </p>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
