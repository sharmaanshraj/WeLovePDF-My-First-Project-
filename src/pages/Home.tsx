import { Link } from 'react-router-dom';
import { Layers, Scissors, RotateCw, Type, FileText, Image, Lock, Unlock } from 'lucide-react';

const tools = [
  {
    title: 'Merge PDF',
    description: 'Combine PDFs in the order you want with the easiest PDF merger available.',
    icon: Layers,
    color: 'bg-red-500',
    link: '/merge',
  },
  {
    title: 'Split PDF',
    description: 'Separate one page or a whole set for easy conversion into independent PDF files.',
    icon: Scissors,
    color: 'bg-orange-500',
    link: '/split',
  },
  {
    title: 'Rotate PDF',
    description: 'Rotate your PDFs the way you need them. You can even rotate multiple PDFs at once!',
    icon: RotateCw,
    color: 'bg-yellow-500',
    link: '/rotate',
  },
  {
    title: 'Watermark',
    description: 'Stamp an image or text over your PDF in seconds. Choose the typography, transparency and position.',
    icon: Type,
    color: 'bg-green-500',
    link: '/watermark',
  },
  // Add some dummy tools to make it look like a full suite
  {
    title: 'Compress PDF',
    description: 'Reduce file size while optimizing for maximal PDF quality.',
    icon: FileText,
    color: 'bg-blue-500',
    link: '/compress',
  },
  {
    title: 'PDF to JPG',
    description: 'Convert each PDF page into a JPG or extract all images contained in a PDF.',
    icon: Image,
    color: 'bg-purple-500',
    link: '/pdf-to-jpg',
  },
  {
    title: 'Protect PDF',
    description: 'Encrypt your PDF with a password to keep sensitive data confidential.',
    icon: Lock,
    color: 'bg-pink-500',
    link: '/protect',
  },
  {
    title: 'Unlock PDF',
    description: 'Remove PDF password security, giving you the freedom to use your PDFs as you want.',
    icon: Unlock,
    color: 'bg-indigo-500',
    link: '/unlock',
  },
];

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 lg:p-12">
      <div className="text-center max-w-3xl mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
          Every tool you need to work with PDFs in one place
        </h1>
        <p className="text-xl text-gray-600">
          Every tool you need to use PDFs, at your fingertips. All are 100% FREE and easy to use!
          Merge, split, compress, convert, rotate, unlock and watermark PDFs with just a few clicks.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl w-full">
        {tools.map((tool) => (
          <Link
            key={tool.title}
            to={tool.link}
            className={`group flex flex-col items-center text-center p-8 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1`}
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-6 ${tool.color} group-hover:scale-110 transition-transform duration-200`}>
              <tool.icon size={32} strokeWidth={2} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{tool.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{tool.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
