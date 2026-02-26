import { useState } from 'react';
import { PDFDocument } from '@cantoo/pdf-lib';
import { Unlock } from 'lucide-react';
import ToolLayout from '../components/ToolLayout';

export default function UnlockPDF() {
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
      
      // Load the document with the provided password
      const pdfDoc = await PDFDocument.load(arrayBuffer, {
        ignoreEncryption: true,
        password: password,
      });

      // Saving it without calling encrypt() will save it unencrypted
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
    } catch (error: any) {
      console.error('Error unlocking PDF:', error);
      if (error.message && error.message.includes('password')) {
        alert('Incorrect password. Please try again.');
      } else {
        alert('An error occurred while unlocking the PDF. Please try again.');
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ToolLayout
      title="Unlock PDF"
      description="Remove PDF password security, giving you the freedom to use your PDFs as you want."
      color="bg-indigo-500"
      icon={Unlock}
      acceptMultiple={false}
      onProcess={handleProcess}
      processing={processing}
      resultUrl={resultUrl}
      resultFilename="unlocked.pdf"
      files={files}
      setFiles={setFiles}
    >
      {files.length > 0 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Current Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter the PDF password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
            />
            <p className="text-xs text-gray-500 mt-2">
              You must know the current password to unlock the file.
            </p>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
