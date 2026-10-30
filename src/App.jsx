import { Box } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import CssBaselineImport from '@mui/material/CssBaseline';
import { Routes, Route } from 'react-router-dom';
import theme from './theme/theme';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import { ClickSpark, ScrollToTop } from './components/common';

import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import ServiceDetail from './pages/ServiceDetail';
import PrivacyPolicy from './pages/PrivacyPolicy';
import NotFound from './pages/NotFound';
import SheetAutomation from './pages/SheetAutomation';
import ToolsHub from './pages/tools/ToolsHub';
import GstCalculator from './pages/tools/GstCalculator';
import InvoiceGenerator from './pages/tools/InvoiceGenerator';
import QuotationGenerator from './pages/tools/QuotationGenerator';
import WhatsAppLinkGenerator from './pages/tools/WhatsAppLinkGenerator';
import ReceiptGenerator from './pages/tools/ReceiptGenerator';
import ProfitMarginCalculator from './pages/tools/ProfitMarginCalculator';
import UpiQrGenerator from './pages/tools/UpiQrGenerator';
import BreakEvenCalculator from './pages/tools/BreakEvenCalculator';
import PurchaseOrderGenerator from './pages/tools/PurchaseOrderGenerator';
import RoasCalculator from './pages/tools/RoasCalculator';
import { EmailSignature, ImageTool, BarcodeTool, UTMTool, QRTool, ROITool, LoanTool, DiscountTool, MetaTool, CardTool } from './pages/tools/NewTools';

const CssBaseline = CssBaselineImport.default || CssBaselineImport;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <ClickSpark>
          <Box
            sx={{
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <ScrollToTop />
            <Navbar />
            <Box component="main" sx={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/blog/:slug" element={<BlogDetail />} />
                <Route path="/services/:slug" element={<ServiceDetail />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/products/sheet-automation" element={<SheetAutomation />} />
                <Route path="/tools" element={<ToolsHub />} />
                <Route path="/tools/gst-calculator" element={<GstCalculator />} />
                <Route path="/tools/invoice-generator" element={<InvoiceGenerator />} />
                <Route path="/tools/quotation-generator" element={<QuotationGenerator />} />
                <Route path="/tools/whatsapp-link-generator" element={<WhatsAppLinkGenerator />} />
                <Route path="/tools/receipt-generator" element={<ReceiptGenerator />} />
                <Route path="/tools/profit-margin-calculator" element={<ProfitMarginCalculator />} />
                <Route path="/tools/upi-qr-generator" element={<UpiQrGenerator />} />
                <Route path="/tools/break-even-calculator" element={<BreakEvenCalculator />} />
                <Route path="/tools/purchase-order-generator" element={<PurchaseOrderGenerator />} />
                <Route path="/tools/roas-calculator" element={<RoasCalculator />} />
                <Route path="/tools/email-signature-generator" element={<EmailSignature />} />
                <Route path="/tools/image-compressor-resizer" element={<ImageTool />} />
                <Route path="/tools/barcode-generator" element={<BarcodeTool />} />
                <Route path="/tools/utm-campaign-url-builder" element={<UTMTool />} />
                <Route path="/tools/qr-code-generator" element={<QRTool />} />
                <Route path="/tools/roi-calculator" element={<ROITool />} />
                <Route path="/tools/business-loan-calculator" element={<LoanTool />} />
                <Route path="/tools/discount-sale-price-calculator" element={<DiscountTool />} />
                <Route path="/tools/meta-tag-generator" element={<MetaTool />} />
                <Route path="/tools/business-card-maker" element={<CardTool />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Box>
            <Footer />
          </Box>
        </ClickSpark>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
