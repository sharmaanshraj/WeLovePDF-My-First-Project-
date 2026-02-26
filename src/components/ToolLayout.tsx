import React, { useCallback } from 'react';
import { useDropzone, DropzoneOptions } from 'react-dropzone';
import { UploadCloud, File, X, Settings2, Download } from 'lucide-react';

interface ToolLayoutProps {
  title: string;
  description: string;
  color: string;
  icon: React.ElementType;
  acceptMultiple?: boolean;
  onProcess: (files: File[]) => Promise<void>;
  processing: boolean;
  resultUrl: string | null;
  resultFilename: string;
  children?: React.ReactNode; // For extra settings
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

export default function ToolLayout({
  title,
  description,
  color,
  icon: Icon,
  acceptMultiple = false,
  onProcess,
  processing,
  resultUrl,
  resultFilename,
  children,
  files,
  setFiles,
}: ToolLayoutProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptMultiple) {
        setFiles((prev) => (typeof prev === 'function' ? prev(acceptedFiles) : [...prev, ...acceptedFiles]));
      } else {
        setFiles(acceptedFiles);
      }
    },
    [acceptMultiple, setFiles]
  );

  const dropzoneOptions: DropzoneOptions = {
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    multiple: acceptMultiple,
    onDragEnter: undefined,
    onDragOver: undefined,
    onDragLeave: undefined,
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone(dropzoneOptions);

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const reset = () => {
    setFiles([]);
  };

  if (resultUrl) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gray-50">
        <div className="bg-white p-12 rounded-2xl shadow-xl max-w-2xl w-full text-center border border-gray-100">
          <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center text-white mb-8 ${color}`}>
            <Icon size={48} strokeWidth={1.5} />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Task Complete!</h2>
          <p className="text-xl text-gray-600 mb-10">Your PDF has been processed successfully.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={resultUrl}
              download={resultFilename}
              className={`inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-white font-bold text-lg transition-transform hover:scale-105 ${color}`}
            >
              <Download size={24} />
              Download PDF
            </a>
            <button
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-gray-700 bg-gray-100 hover:bg-gray-200 font-bold text-lg transition-colors"
            >
              Process another file
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col lg:flex-row bg-gray-50">
      <div className="flex-1 p-8 flex flex-col items-center justify-center relative">
        <div className="text-center max-w-2xl mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 tracking-tight">{title}</h1>
          <p className="text-xl text-gray-600">{description}</p>
        </div>

        {files.length === 0 ? (
          <div
            {...getRootProps()}
            className={`w-full max-w-3xl aspect-video rounded-3xl border-4 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-12 cursor-pointer
              ${isDragActive ? 'border-gray-500 bg-gray-100' : 'border-gray-300 bg-white hover:border-gray-400'}`}
          >
            <input {...getInputProps()} />
            <div className={`w-24 h-24 rounded-full flex items-center justify-center text-white mb-6 ${color} shadow-lg`}>
              <UploadCloud size={48} strokeWidth={1.5} />
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-2">
              {isDragActive ? 'Drop files here...' : 'Select PDF files'}
            </p>
            <p className="text-gray-500 text-lg">or drop PDFs here</p>
          </div>
        ) : (
          <div className="w-full max-w-4xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {files.map((file, index) => (
              <div key={`${file.name}-${index}`} className="relative group bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col items-center justify-center aspect-[3/4] hover:shadow-md transition-shadow">
                <File size={48} className="text-gray-400 mb-4" strokeWidth={1.5} />
                <p className="text-sm font-medium text-gray-900 text-center truncate w-full px-2" title={file.name}>
                  {file.name}
                </p>
                <p className="text-xs text-gray-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            {acceptMultiple && (
              <div
                {...getRootProps()}
                className="bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center aspect-[3/4] cursor-pointer hover:bg-gray-200 transition-colors"
              >
                <input {...getInputProps()} />
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white mb-2 ${color}`}>
                  <UploadCloud size={24} />
                </div>
                <p className="text-sm font-medium text-gray-700">Add more</p>
              </div>
            )}
          </div>
        )}
      </div>

      {files.length > 0 && (
        <div className="w-full lg:w-80 bg-white border-l border-gray-200 flex flex-col shadow-xl lg:shadow-none z-10">
          <div className="p-6 border-b border-gray-100 flex items-center gap-3">
            <Settings2 className="text-gray-400" />
            <h3 className="text-lg font-bold text-gray-900">Options</h3>
          </div>
          <div className="flex-1 p-6 overflow-y-auto">
            {children}
          </div>
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            <button
              onClick={() => onProcess(files)}
              disabled={processing || files.length === 0}
              className={`w-full py-4 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg
                ${processing ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'}
                ${color}`}
            >
              {processing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Icon size={24} />
                  {title}
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
