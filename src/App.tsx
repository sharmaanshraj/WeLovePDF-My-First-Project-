/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import MergePDF from './pages/MergePDF';
import SplitPDF from './pages/SplitPDF';
import RotatePDF from './pages/RotatePDF';
import WatermarkPDF from './pages/WatermarkPDF';
import CompressPDF from './pages/CompressPDF';
import PDFToJPG from './pages/PDFToJPG';
import ProtectPDF from './pages/ProtectPDF';
import UnlockPDF from './pages/UnlockPDF';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="merge" element={<MergePDF />} />
          <Route path="split" element={<SplitPDF />} />
          <Route path="rotate" element={<RotatePDF />} />
          <Route path="watermark" element={<WatermarkPDF />} />
          <Route path="compress" element={<CompressPDF />} />
          <Route path="pdf-to-jpg" element={<PDFToJPG />} />
          <Route path="protect" element={<ProtectPDF />} />
          <Route path="unlock" element={<UnlockPDF />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
