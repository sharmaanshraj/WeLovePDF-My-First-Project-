import { Link, Outlet } from 'react-router-dom';
import { FileText, Heart } from 'lucide-react';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans text-gray-900">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors">
            <div className="flex items-center justify-center bg-red-600 text-white p-1.5 rounded-md">
              <FileText size={20} strokeWidth={2.5} />
            </div>
            <span className="font-bold text-xl tracking-tight">WeLovePDF</span>
          </Link>
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <Link to="/merge" className="hover:text-red-600 transition-colors">Merge PDF</Link>
            <Link to="/split" className="hover:text-red-600 transition-colors">Split PDF</Link>
            <Link to="/rotate" className="hover:text-red-600 transition-colors">Rotate PDF</Link>
            <Link to="/watermark" className="hover:text-red-600 transition-colors">Watermark</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      <footer className="bg-gray-900 text-gray-400 py-8 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} WeLovePDF. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart size={14} className="text-red-500 fill-red-500" /> for PDF lovers
          </p>
        </div>
      </footer>
    </div>
  );
}
