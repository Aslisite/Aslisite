import { useState } from 'react';
import {
  Box, Container, Typography, TextField, Grid, Card, CardContent,
  Stack, Button, IconButton, Divider, MenuItem, Select,
  FormControl, InputLabel, Tooltip, Alert, Chip,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import {
  ClipboardList, Plus, Trash2, Printer, RotateCcw,
  ArrowLeft, ChevronRight, Info, CalendarClock,
} from 'lucide-react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { colors } from '../../theme/theme';
import { absoluteUrl, siteMetadata } from '../../seo/siteMetadata';
import { SectionBadge } from '../../components/common';
import {
  CURRENCIES, TAX_MODES, DEFAULT_GLOBAL_TAX, REGION_OPTIONS,
  fmtAmount, fmtCurrency, calcGlobalTax, taxLineLabel,
  detectRegion,
} from './regionConfig';

/* ─── India GST 2.0 Slabs ─── */
const GST_RATES = [{ value: 0, label: '0%' }, { value: 5, label: '5%' }, { value: 18, label: '18%' }, { value: 40, label: '40%' }];

/* ─── Helpers ─── */
const fmt = (n) => Number.isFinite(n) ? n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00';
const today = () => new Date().toISOString().split('T')[0];
const addDays = (d) => { const dt = new Date(); dt.setDate(dt.getDate() + d); return dt.toISOString().split('T')[0]; };

/* ─── Item factories ─── */
const newIndiaItem = () => ({ id: crypto.randomUUID(), description: '', qty: '', unit: 'Nos', rate: '', gstRate: 18, notes: '' });
const newGlobalItem = () => ({ id: crypto.randomUUID(), description: '', qty: '', unit: 'Nos', rate: '', notes: '' });

/* ─── Calc functions ─── */
const calcIndiaItem = (item) => {
  const taxableAmount = (parseFloat(item.qty)||0) * (parseFloat(item.rate)||0);
  const gstAmount = (taxableAmount * item.gstRate) / 100;
  return { taxableAmount, gstAmount, total: taxableAmount + gstAmount };
};
const calcGlobalItem = (item) => (parseFloat(item.qty)||0) * (parseFloat(item.rate)||0);

const calcIndiaTotals = (items) => {
  let subTotal = 0, totalGst = 0;
  items.forEach((it) => { const { taxableAmount, gstAmount } = calcIndiaItem(it); subTotal += taxableAmount; totalGst += gstAmount; });
  return { subTotal, totalGst, grandTotal: subTotal + totalGst };
};
const calcGlobalTotals = (items, taxConfig) => {
  const subTotal = items.reduce((s, it) => s + calcGlobalItem(it), 0);
  const taxAmount = calcGlobalTax(subTotal, taxConfig);
  return { subTotal, taxAmount, grandTotal: subTotal + taxAmount };
};

/* ─── Shared UI ─── */
const SectionHeading = ({ children }) => (
  <Typography variant="overline" sx={{ display: 'block', color: colors.accent.primary, fontWeight: 700, fontSize: '0.68rem', letterSpacing: '0.1em', mb: 2 }}>{children}</Typography>
);
const Field = ({ label, ...props }) => (
  <TextField label={label} size="small" fullWidth variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 }, '& .MuiInputLabel-root': { fontSize: '0.82rem' } }} {...props} />
);

/* ─── Region Selector ─── */
/* ══════════════════════════════════════════════
   PRINT DOCUMENT — India (unchanged)
══════════════════════════════════════════════ */
const IndiaPrint = ({ biz, client, quote, items, totals }) => (
  <Box id="quote-print-area" sx={{ display: 'none', '@media print': { display: 'block' }, fontFamily: '"Inter", sans-serif', fontSize: '12px', color: '#18181b', p: 0 }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
      <Box>
        <Typography sx={{ fontWeight: 800, fontSize: '20px' }}>{biz.name||'Your Business'}</Typography>
        {biz.gstin && <Typography sx={{ fontSize: '11px', color: '#52525b' }}>GSTIN: {biz.gstin}</Typography>}
        {biz.address && <Typography sx={{ fontSize: '11px', color: '#52525b', whiteSpace: 'pre-line' }}>{biz.address}</Typography>}
        {biz.phone && <Typography sx={{ fontSize: '11px', color: '#52525b' }}>Phone: {biz.phone}</Typography>}
        {biz.email && <Typography sx={{ fontSize: '11px', color: '#52525b' }}>Email: {biz.email}</Typography>}
      </Box>
      <Box sx={{ textAlign: 'right' }}>
        <Typography sx={{ fontWeight: 900, fontSize: '24px', color: '#0d9488', letterSpacing: '-0.03em' }}>QUOTATION</Typography>
        <Typography sx={{ fontSize: '11px', color: '#52525b' }}>No: <strong>{quote.number||'—'}</strong></Typography>
        <Typography sx={{ fontSize: '11px', color: '#52525b' }}>Date: <strong>{quote.date||'—'}</strong></Typography>
        {quote.validUntil && <Typography sx={{ fontSize: '11px', color: '#52525b' }}>Valid Until: <strong>{quote.validUntil}</strong></Typography>}
        {quote.refNumber && <Typography sx={{ fontSize: '11px', color: '#52525b' }}>Ref: <strong>{quote.refNumber}</strong></Typography>}
      </Box>
    </Box>
    <Divider sx={{ mb: 2.5, borderColor: '#e4e4e7' }} />
    <Box sx={{ mb: 3 }}>
      <Typography sx={{ fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#0d9488', mb: 0.5 }}>Prepared For</Typography>
      <Typography sx={{ fontWeight: 700, fontSize: '13px' }}>{client.name||'—'}</Typography>
      {client.gstin && <Typography sx={{ fontSize: '11px', color: '#52525b' }}>GSTIN: {client.gstin}</Typography>}
      {client.address && <Typography sx={{ fontSize: '11px', color: '#52525b', whiteSpace: 'pre-line' }}>{client.address}</Typography>}
      {client.phone && <Typography sx={{ fontSize: '11px', color: '#52525b' }}>Phone: {client.phone}</Typography>}
      {client.email && <Typography sx={{ fontSize: '11px', color: '#52525b' }}>Email: {client.email}</Typography>}
    </Box>
    {quote.subject && <Box sx={{ mb: 3, p: '8px 12px', backgroundColor: '#f0fdfa', border: '1px solid #99f6e4', borderRadius: '6px' }}><Typography sx={{ fontWeight: 700, fontSize: '11px', color: '#0d9488' }}>Subject: {quote.subject}</Typography></Box>}
    <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', mb: 3 }}>
      <Box component="thead"><Box component="tr" sx={{ backgroundColor: '#f0fdfa' }}>
        {['#','Description / Notes','Qty','Unit','Rate (₹)','GST %','GST (₹)','Total (₹)'].map((h) => (
          <Box key={h} component="th" sx={{ p: '6px 8px', textAlign: h==='#'?'center':'right', fontWeight: 700, fontSize: '10px', color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1.5px solid #99f6e4', '&:nth-of-type(2)': { textAlign: 'left' } }}>{h}</Box>
        ))}
      </Box></Box>
      <Box component="tbody">
        {items.map((item, i) => {
          const { taxableAmount, gstAmount, total } = calcIndiaItem(item);
          return (
            <Box key={item.id} component="tr" sx={{ '&:nth-of-type(even)': { backgroundColor: '#fafafa' } }}>
              <Box component="td" sx={{ p: '6px 8px', textAlign: 'center', fontSize: '11px', borderBottom: '1px solid #f4f4f5' }}>{i+1}</Box>
              <Box component="td" sx={{ p: '6px 8px', textAlign: 'left', fontSize: '11px', borderBottom: '1px solid #f4f4f5' }}><strong>{item.description||'—'}</strong>{item.notes && <Box sx={{ fontSize: '10px', color: '#52525b', mt: '2px' }}>{item.notes}</Box>}</Box>
              <Box component="td" sx={{ p: '6px 8px', textAlign: 'right', fontSize: '11px', borderBottom: '1px solid #f4f4f5' }}>{item.qty||'0'}</Box>
              <Box component="td" sx={{ p: '6px 8px', textAlign: 'right', fontSize: '11px', borderBottom: '1px solid #f4f4f5' }}>{item.unit}</Box>
              <Box component="td" sx={{ p: '6px 8px', textAlign: 'right', fontSize: '11px', borderBottom: '1px solid #f4f4f5' }}>₹{fmt(parseFloat(item.rate)||0)}</Box>
              <Box component="td" sx={{ p: '6px 8px', textAlign: 'right', fontSize: '11px', borderBottom: '1px solid #f4f4f5' }}>{item.gstRate}%</Box>
              <Box component="td" sx={{ p: '6px 8px', textAlign: 'right', fontSize: '11px', borderBottom: '1px solid #f4f4f5' }}>₹{fmt(gstAmount)}</Box>
              <Box component="td" sx={{ p: '6px 8px', textAlign: 'right', fontWeight: 700, fontSize: '11px', borderBottom: '1px solid #f4f4f5' }}>₹{fmt(total)}</Box>
            </Box>
          );
        })}
      </Box>
    </Box>
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
      <Box sx={{ minWidth: 220 }}>
        {[{ label: 'Sub Total', value: fmt(totals.subTotal) }, { label: 'Total GST', value: fmt(totals.totalGst) }].map(({ label, value }) => (
          <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', py: '3px', fontSize: '11px' }}><span style={{ color: '#52525b' }}>{label}</span><span>₹ {value}</span></Box>
        ))}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', py: '6px', borderTop: '1.5px solid #18181b', mt: '4px', fontWeight: 800, fontSize: '13px' }}><span>Total Amount</span><span>₹ {fmt(totals.grandTotal)}</span></Box>
      </Box>
    </Box>
    {quote.terms && <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e4e4e7' }}><Typography sx={{ fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#52525b', mb: 0.5 }}>Terms & Conditions</Typography><Typography sx={{ fontSize: '11px', color: '#52525b', whiteSpace: 'pre-line' }}>{quote.terms}</Typography></Box>}
    {quote.validUntil && <Box sx={{ mt: 2, p: '8px 12px', backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: '6px' }}><Typography sx={{ fontSize: '11px', color: '#92400e', fontWeight: 600 }}>This quotation is valid until {quote.validUntil}. Please confirm your acceptance before the expiry date.</Typography></Box>}
    <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid #e4e4e7', textAlign: 'center' }}><Typography sx={{ fontSize: '10px', color: '#a1a1aa' }}>Generated via aslisite.com/tools/quotation-generator</Typography></Box>
  </Box>
);

/* ══════════════════════════════════════════════
   PRINT DOCUMENT — Global
══════════════════════════════════════════════ */
const GlobalPrint = ({ biz, client, quote, items, totals, taxConfig, currencyCode, customSymbol }) => {
  const cp = (n) => fmtCurrency(n, currencyCode, customSymbol, false);
  const taxLabel = taxLineLabel(taxConfig);
  return (
    <Box id="quote-print-area" sx={{ display: 'none', '@media print': { display: 'block' }, fontFamily: '"Inter", sans-serif', fontSize: '12px', color: '#18181b', p: 0 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: '20px' }}>{biz.name||'Your Business'}</Typography>
          {biz.taxId && <Typography sx={{ fontSize: '11px', color: '#52525b' }}>Tax ID: {biz.taxId}</Typography>}
          {biz.address && <Typography sx={{ fontSize: '11px', color: '#52525b', whiteSpace: 'pre-line' }}>{biz.address}</Typography>}
          {biz.phone && <Typography sx={{ fontSize: '11px', color: '#52525b' }}>Phone: {biz.phone}</Typography>}
          {biz.email && <Typography sx={{ fontSize: '11px', color: '#52525b' }}>Email: {biz.email}</Typography>}
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography sx={{ fontWeight: 900, fontSize: '24px', color: '#0d9488', letterSpacing: '-0.03em' }}>QUOTATION</Typography>
          <Typography sx={{ fontSize: '11px', color: '#52525b' }}>No: <strong>{quote.number||'—'}</strong></Typography>
          <Typography sx={{ fontSize: '11px', color: '#52525b' }}>Date: <strong>{quote.date||'—'}</strong></Typography>
          {quote.validUntil && <Typography sx={{ fontSize: '11px', color: '#52525b' }}>Valid Until: <strong>{quote.validUntil}</strong></Typography>}
          <Typography sx={{ fontSize: '11px', color: '#52525b' }}>Currency: <strong>{currencyCode === 'OTHER' ? (customSymbol||'Custom') : currencyCode}</strong></Typography>
        </Box>
      </Box>
      <Divider sx={{ mb: 2.5, borderColor: '#e4e4e7' }} />
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#0d9488', mb: 0.5 }}>Prepared For</Typography>
        <Typography sx={{ fontWeight: 700, fontSize: '13px' }}>{client.name||'—'}</Typography>
        {client.taxId && <Typography sx={{ fontSize: '11px', color: '#52525b' }}>Tax ID: {client.taxId}</Typography>}
        {client.address && <Typography sx={{ fontSize: '11px', color: '#52525b', whiteSpace: 'pre-line' }}>{client.address}</Typography>}
        {client.phone && <Typography sx={{ fontSize: '11px', color: '#52525b' }}>Phone: {client.phone}</Typography>}
        {client.email && <Typography sx={{ fontSize: '11px', color: '#52525b' }}>Email: {client.email}</Typography>}
      </Box>
      {quote.subject && <Box sx={{ mb: 3, p: '8px 12px', backgroundColor: '#f0fdfa', border: '1px solid #99f6e4', borderRadius: '6px' }}><Typography sx={{ fontWeight: 700, fontSize: '11px', color: '#0d9488' }}>Subject: {quote.subject}</Typography></Box>}
      <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', mb: 3 }}>
        <Box component="thead"><Box component="tr" sx={{ backgroundColor: '#f0fdfa' }}>
          {['#','Description / Notes','Qty','Unit','Rate','Amount'].map((h) => (
            <Box key={h} component="th" sx={{ p: '6px 8px', textAlign: h==='#'?'center':'right', fontWeight: 700, fontSize: '10px', color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1.5px solid #99f6e4', '&:nth-of-type(2)': { textAlign: 'left' } }}>{h}</Box>
          ))}
        </Box></Box>
        <Box component="tbody">
          {items.map((item, i) => {
            const amt = calcGlobalItem(item);
            return (
              <Box key={item.id} component="tr" sx={{ '&:nth-of-type(even)': { backgroundColor: '#fafafa' } }}>
                <Box component="td" sx={{ p: '6px 8px', textAlign: 'center', fontSize: '11px', borderBottom: '1px solid #f4f4f5' }}>{i+1}</Box>
                <Box component="td" sx={{ p: '6px 8px', textAlign: 'left', fontSize: '11px', borderBottom: '1px solid #f4f4f5' }}><strong>{item.description||'—'}</strong>{item.notes && <Box sx={{ fontSize: '10px', color: '#52525b', mt: '2px' }}>{item.notes}</Box>}</Box>
                <Box component="td" sx={{ p: '6px 8px', textAlign: 'right', fontSize: '11px', borderBottom: '1px solid #f4f4f5' }}>{item.qty||'0'}</Box>
                <Box component="td" sx={{ p: '6px 8px', textAlign: 'right', fontSize: '11px', borderBottom: '1px solid #f4f4f5' }}>{item.unit}</Box>
                <Box component="td" sx={{ p: '6px 8px', textAlign: 'right', fontSize: '11px', borderBottom: '1px solid #f4f4f5' }}>{cp(parseFloat(item.rate)||0)}</Box>
                <Box component="td" sx={{ p: '6px 8px', textAlign: 'right', fontWeight: 700, fontSize: '11px', borderBottom: '1px solid #f4f4f5' }}>{cp(amt)}</Box>
              </Box>
            );
          })}
        </Box>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Box sx={{ minWidth: 240 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: '3px', fontSize: '11px' }}><span style={{ color: '#52525b' }}>Sub Total</span><span>{cp(totals.subTotal)}</span></Box>
          {taxConfig.mode !== 'none' && totals.taxAmount > 0 && <Box sx={{ display: 'flex', justifyContent: 'space-between', py: '3px', fontSize: '11px' }}><span style={{ color: '#52525b' }}>{taxLabel}</span><span>{cp(totals.taxAmount)}</span></Box>}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: '6px', borderTop: '1.5px solid #18181b', mt: '4px', fontWeight: 800, fontSize: '13px' }}><span>Total Amount</span><span>{cp(totals.grandTotal)}</span></Box>
        </Box>
      </Box>
      {quote.terms && <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e4e4e7' }}><Typography sx={{ fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#52525b', mb: 0.5 }}>Terms & Conditions</Typography><Typography sx={{ fontSize: '11px', color: '#52525b', whiteSpace: 'pre-line' }}>{quote.terms}</Typography></Box>}
      {quote.validUntil && <Box sx={{ mt: 2, p: '8px 12px', backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: '6px' }}><Typography sx={{ fontSize: '11px', color: '#92400e', fontWeight: 600 }}>This quotation is valid until {quote.validUntil}. Please confirm acceptance before the expiry date.</Typography></Box>}
      <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid #e4e4e7', textAlign: 'center' }}><Typography sx={{ fontSize: '10px', color: '#a1a1aa' }}>Generated via aslisite.com/tools/quotation-generator</Typography></Box>
    </Box>
  );
};

/* ══════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════ */
const QuotationGenerator = () => {
  const [region, setRegion] = useState(detectRegion);
  const isIndia = region === 'india';

  /* India state */
  const [biz, setBiz]     = useState({ name: '', gstin: '', address: '', phone: '', email: '' });
  const [client, setClient] = useState({ name: '', gstin: '', address: '', phone: '', email: '' });
  const [quote, setQuote] = useState({ number: 'QUO-001', date: today(), validUntil: addDays(30), refNumber: '', subject: '', terms: 'Prices are subject to change without prior notice.\nThis quotation is valid for the period mentioned above.' });
  const [items, setItems] = useState([newIndiaItem()]);

  /* Global state */
  const [gBiz, setGBiz]     = useState({ name: '', taxId: '', address: '', phone: '', email: '' });
  const [gClient, setGClient] = useState({ name: '', taxId: '', address: '', phone: '', email: '' });
  const [gQuote, setGQuote] = useState({ number: 'QUO-001', date: today(), validUntil: addDays(30), refNumber: '', subject: '', terms: 'Prices are subject to change without prior notice.\nThis quotation is valid for the period mentioned above.' });
  const [gItems, setGItems] = useState([newGlobalItem()]);
  const [currencyCode, setCurrencyCode] = useState('USD');
  const [customSymbol, setCustomSymbol] = useState('');
  const [taxConfig, setTaxConfig] = useState({ ...DEFAULT_GLOBAL_TAX });

  const indiaTotals  = calcIndiaTotals(items);
  const globalTotals = calcGlobalTotals(gItems, taxConfig);
  const cp = (n) => fmtCurrency(n, currencyCode, customSymbol, false);

  const hBiz = (e) => setBiz((p) => ({ ...p, [e.target.name]: e.target.value }));
  const hClient = (e) => setClient((p) => ({ ...p, [e.target.name]: e.target.value }));
  const hQuote = (e) => setQuote((p) => ({ ...p, [e.target.name]: e.target.value }));
  const hItem = (id, f, v) => setItems((p) => p.map((it) => it.id === id ? { ...it, [f]: v } : it));
  const addItem = () => setItems((p) => [...p, newIndiaItem()]);
  const removeItem = (id) => setItems((p) => p.length > 1 ? p.filter((it) => it.id !== id) : p);

  const hGBiz = (e) => setGBiz((p) => ({ ...p, [e.target.name]: e.target.value }));
  const hGClient = (e) => setGClient((p) => ({ ...p, [e.target.name]: e.target.value }));
  const hGQuote = (e) => setGQuote((p) => ({ ...p, [e.target.name]: e.target.value }));
  const hGItem = (id, f, v) => setGItems((p) => p.map((it) => it.id === id ? { ...it, [f]: v } : it));
  const addGItem = () => setGItems((p) => [...p, newGlobalItem()]);
  const removeGItem = (id) => setGItems((p) => p.length > 1 ? p.filter((it) => it.id !== id) : p);

  const handleReset = () => {
    if (isIndia) {
      setBiz({ name: '', gstin: '', address: '', phone: '', email: '' }); setClient({ name: '', gstin: '', address: '', phone: '', email: '' });
      setQuote({ number: 'QUO-001', date: today(), validUntil: addDays(30), refNumber: '', subject: '', terms: 'Prices are subject to change without prior notice.\nThis quotation is valid for the period mentioned above.' });
      setItems([newIndiaItem()]);
    } else {
      setGBiz({ name: '', taxId: '', address: '', phone: '', email: '' }); setGClient({ name: '', taxId: '', address: '', phone: '', email: '' });
      setGQuote({ number: 'QUO-001', date: today(), validUntil: addDays(30), refNumber: '', subject: '', terms: 'Prices are subject to change without prior notice.\nThis quotation is valid for the period mentioned above.' });
      setGItems([newGlobalItem()]);
    }
  };

  const pageTitle = 'Free Quotation Generator | Business Quote India & Global | Aslisite';
  const pageDesc = 'Create professional business quotations with validity dates. India mode: GST 2.0, GSTIN, ₹. Global mode: multi-currency, VAT / Sales Tax. Free, no login required.';

  return (
    <>
      <style>{`@media print { #quote-print-area { display: block !important; } @page { margin: 15mm; size: A4; } }`}</style>
      <Container maxWidth="lg" className="tool-page-container" sx={{ pt: { xs: 16, md: 16 }, pb: { xs: 8, md: 12 } }}>
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageDesc} />
          <link rel="canonical" href={absoluteUrl('/tools/quotation-generator')} />
          <meta property="og:url" content={absoluteUrl('/tools/quotation-generator')} />
          <meta property="og:type" content="website" />
          <meta property="og:title" content={pageTitle} />
          <meta property="og:description" content={pageDesc} />
          <meta property="og:image" content={siteMetadata.logo} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={pageTitle} />
          <meta name="twitter:description" content={pageDesc} />
          <script type="application/ld+json">{JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebApplication', '@id': `${absoluteUrl('/tools/quotation-generator')}#app`, url: absoluteUrl('/tools/quotation-generator'), name: 'Free Quotation Generator — Aslisite', description: pageDesc, applicationCategory: 'BusinessApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' }, publisher: { '@id': `${siteMetadata.baseUrl}/#organization` } })}</script>
        </Helmet>

        <Stack direction="row" alignItems="center" gap={0.5} sx={{ mb: 4 }} className="no-print">
          <Box component={RouterLink} to="/tools" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: colors.text.muted, textDecoration: 'none', fontSize: '0.82rem', fontWeight: 500, '&:hover': { color: colors.accent.primary }, transition: 'color 0.2s' }}><ArrowLeft size={14} />Free Tools</Box>
          <ChevronRight size={13} style={{ color: colors.text.muted }} />
          <Typography sx={{ fontSize: '0.82rem', color: colors.text.secondary, fontWeight: 500 }}>Quotation Generator</Typography>
        </Stack>

        <Box component={motion.div} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} sx={{ mb: { xs: 5, md: 6 } }} className="no-print">
          <SectionBadge icon={CalendarClock} label={isIndia ? 'Free Business Quotation Tool' : 'Global Quotation — Multi-Currency'} />
          <Typography variant="h1" sx={{ fontSize: { xs: '1.9rem', sm: '2.5rem', md: '2.8rem' }, fontWeight: 800, color: colors.text.primary, mt: 2, mb: 1.5, letterSpacing: '-0.03em' }}>Free Quotation Generator</Typography>
          <Typography variant="subtitle1" sx={{ color: colors.text.secondary, maxWidth: 560, lineHeight: 1.7 }}>
            {isIndia ? 'Generate professional business quotations with validity dates, GST breakdowns, and custom terms.' : 'Create international quotations with multi-currency support and VAT / Sales Tax. Print or save as PDF.'}
          </Typography>
        </Box>

        <Stack direction="row" alignItems="center" gap={1.5} flexWrap="wrap" sx={{ mb: 4 }} className="no-print">
          <Button variant="contained" startIcon={<Printer size={15} />} onClick={() => window.print()} sx={{ borderRadius: 2, fontWeight: 700, background: colors.accent.secondary, color: '#fff', px: 3, '&:hover': { background: '#0f766e' } }}>Print / Save PDF</Button>
          <Button variant="outlined" startIcon={<RotateCcw size={14} />} onClick={handleReset} sx={{ borderRadius: 2, fontWeight: 600, borderColor: colors.border.medium, color: colors.text.secondary, '&:hover': { borderColor: colors.accent.primary, color: colors.accent.primary } }}>Reset</Button>
          <Box sx={{ ml: { xs: 0, sm: 'auto' }, width: { xs: '100%', sm: 'auto' }, display: 'flex', justifyContent: { xs: 'center', sm: 'flex-end' } }}>
            <ToggleButtonGroup value={region} exclusive onChange={(_, v) => v && setRegion(v)} size="small"
              sx={{ '& .MuiToggleButton-root': { px: 1.5, py: 0.6, fontWeight: 600, fontSize: '0.75rem', textTransform: 'none', border: `1px solid ${colors.border.medium} !important`, gap: 0.5, lineHeight: 1.4,
                '&.Mui-selected': { backgroundColor: colors.accent.primary, color: '#fff', borderColor: `${colors.accent.primary} !important` },
                '&:not(.Mui-selected):hover': { backgroundColor: 'rgba(109,40,217,0.05)' } } }}>
              <ToggleButton value="india" aria-label="India GST mode">🇮🇳 India</ToggleButton>
              <ToggleButton value="global" aria-label="Global mode">🌐 Global</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Stack>

        <Grid container spacing={3} className="no-print">
          <Grid item xs={12} lg={8}>

            {/* ── Global currency/tax ── */}
            {!isIndia && (
              <Card sx={{ borderRadius: 3, border: `1px solid ${colors.border.light}`, boxShadow: 'none', mb: 3 }}>
                <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                  <SectionHeading>Currency & Tax Settings</SectionHeading>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormControl fullWidth size="small"><InputLabel sx={{ fontSize: '0.82rem' }}>Currency</InputLabel>
                        <Select value={currencyCode} label="Currency" onChange={(e) => setCurrencyCode(e.target.value)} sx={{ borderRadius: 1.5 }}>
                          {CURRENCIES.map((c) => <MenuItem key={c.code} value={c.code}>{c.symbol ? `${c.symbol} — ` : ''}{c.name} ({c.code})</MenuItem>)}
                        </Select>
                      </FormControl>
                    </Grid>
                    {currencyCode === 'OTHER' && <Grid item xs={12} sm={6} md={4}><TextField label="Currency Symbol" size="small" fullWidth value={customSymbol} onChange={(e) => setCustomSymbol(e.target.value)} placeholder="e.g. د.إ" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }} /></Grid>}
                    <Grid item xs={12} sm={6} md={3}>
                      <FormControl fullWidth size="small"><InputLabel sx={{ fontSize: '0.82rem' }}>Tax Type</InputLabel>
                        <Select value={taxConfig.mode} label="Tax Type" onChange={(e) => setTaxConfig({ ...taxConfig, mode: e.target.value })} sx={{ borderRadius: 1.5 }}>
                          {TAX_MODES.map((t) => <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>)}
                        </Select>
                      </FormControl>
                    </Grid>
                    {taxConfig.mode !== 'none' && <>
                      <Grid item xs={6} sm={4} md={2}><TextField label="Tax Rate (%)" size="small" fullWidth value={taxConfig.rate} onChange={(e) => setTaxConfig({ ...taxConfig, rate: e.target.value })} inputProps={{ inputMode: 'decimal' }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }} /></Grid>
                      {taxConfig.mode === 'custom' && <Grid item xs={6} sm={4} md={3}><TextField label="Tax Label" size="small" fullWidth value={taxConfig.label} onChange={(e) => setTaxConfig({ ...taxConfig, label: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }} /></Grid>}
                    </>}
                  </Grid>
                </CardContent>
              </Card>
            )}

            {/* Business */}
            <Card sx={{ borderRadius: 3, border: `1px solid ${colors.border.light}`, boxShadow: 'none', mb: 3 }}>
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <SectionHeading>Your Business Details</SectionHeading>
                {isIndia ? (
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}><TextField label="Business Name *" size="small" fullWidth name="name" value={biz.name} onChange={hBiz} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }} /></Grid>
                    <Grid item xs={12} sm={6}><TextField label="GSTIN" size="small" fullWidth name="gstin" value={biz.gstin} onChange={hBiz} inputProps={{ maxLength: 15 }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }} /></Grid>
                    <Grid item xs={12}><TextField label="Address" size="small" fullWidth name="address" value={biz.address} onChange={hBiz} multiline rows={2} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }} /></Grid>
                    <Grid item xs={12} sm={6}><TextField label="Phone" size="small" fullWidth name="phone" value={biz.phone} onChange={hBiz} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }} /></Grid>
                    <Grid item xs={12} sm={6}><TextField label="Email" size="small" fullWidth name="email" value={biz.email} onChange={hBiz} type="email" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }} /></Grid>
                  </Grid>
                ) : (
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}><TextField label="Business Name *" size="small" fullWidth name="name" value={gBiz.name} onChange={hGBiz} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }} /></Grid>
                    <Grid item xs={12} sm={6}><TextField label="Tax ID / VAT No." size="small" fullWidth name="taxId" value={gBiz.taxId} onChange={hGBiz} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }} /></Grid>
                    <Grid item xs={12}><TextField label="Address" size="small" fullWidth name="address" value={gBiz.address} onChange={hGBiz} multiline rows={2} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }} /></Grid>
                    <Grid item xs={12} sm={6}><TextField label="Phone" size="small" fullWidth name="phone" value={gBiz.phone} onChange={hGBiz} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }} /></Grid>
                    <Grid item xs={12} sm={6}><TextField label="Email" size="small" fullWidth name="email" value={gBiz.email} onChange={hGBiz} type="email" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }} /></Grid>
                  </Grid>
                )}
              </CardContent>
            </Card>

            {/* Client */}
            <Card sx={{ borderRadius: 3, border: `1px solid ${colors.border.light}`, boxShadow: 'none', mb: 3 }}>
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <SectionHeading>Prepared For (Client)</SectionHeading>
                {isIndia ? (
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}><TextField label="Client / Company Name *" size="small" fullWidth name="name" value={client.name} onChange={hClient} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }} /></Grid>
                    <Grid item xs={12} sm={6}><TextField label="Client GSTIN" size="small" fullWidth name="gstin" value={client.gstin} onChange={hClient} inputProps={{ maxLength: 15 }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }} /></Grid>
                    <Grid item xs={12}><TextField label="Address" size="small" fullWidth name="address" value={client.address} onChange={hClient} multiline rows={2} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }} /></Grid>
                    <Grid item xs={12} sm={6}><TextField label="Phone" size="small" fullWidth name="phone" value={client.phone} onChange={hClient} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }} /></Grid>
                    <Grid item xs={12} sm={6}><TextField label="Email" size="small" fullWidth name="email" value={client.email} onChange={hClient} type="email" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }} /></Grid>
                  </Grid>
                ) : (
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}><TextField label="Client / Company Name *" size="small" fullWidth name="name" value={gClient.name} onChange={hGClient} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }} /></Grid>
                    <Grid item xs={12} sm={6}><TextField label="Tax ID / VAT No." size="small" fullWidth name="taxId" value={gClient.taxId} onChange={hGClient} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }} /></Grid>
                    <Grid item xs={12}><TextField label="Address" size="small" fullWidth name="address" value={gClient.address} onChange={hGClient} multiline rows={2} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }} /></Grid>
                    <Grid item xs={12} sm={6}><TextField label="Phone" size="small" fullWidth name="phone" value={gClient.phone} onChange={hGClient} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }} /></Grid>
                    <Grid item xs={12} sm={6}><TextField label="Email" size="small" fullWidth name="email" value={gClient.email} onChange={hGClient} type="email" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }} /></Grid>
                  </Grid>
                )}
              </CardContent>
            </Card>

            {/* Quote meta */}
            <Card sx={{ borderRadius: 3, border: `1px solid ${colors.border.light}`, boxShadow: 'none', mb: 3 }}>
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <SectionHeading>Quotation Details</SectionHeading>
                <Grid container spacing={2}>
                  {[
                    { label: 'Quote No.', name: 'number' }, { label: 'Date', name: 'date', type: 'date' },
                    { label: 'Valid Until', name: 'validUntil', type: 'date' }, { label: 'Reference No.', name: 'refNumber' },
                  ].map(({ label, name, type }) => (
                    <Grid item xs={12} sm={6} md={3} key={name}>
                      <TextField label={label} size="small" fullWidth name={name} type={type||'text'} InputLabelProps={type?{shrink:true}:undefined}
                        value={isIndia ? quote[name] : gQuote[name]} onChange={isIndia ? hQuote : hGQuote}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 }, '& .MuiInputLabel-root': { fontSize: '0.82rem' } }} />
                    </Grid>
                  ))}
                  <Grid item xs={12}>
                    <TextField label="Subject / Project Title" size="small" fullWidth name="subject"
                      value={isIndia ? quote.subject : gQuote.subject} onChange={isIndia ? hQuote : hGQuote}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }} />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Items */}
            <Card sx={{ borderRadius: 3, border: `1px solid ${colors.border.light}`, boxShadow: 'none', mb: 3 }}>
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <SectionHeading>Items / Services</SectionHeading>
                <Box sx={{ display: { xs: 'none', md: 'grid' }, gridTemplateColumns: isIndia ? '2fr 0.7fr 0.7fr 0.7fr 0.9fr 36px' : '2.5fr 0.7fr 0.7fr 0.9fr 36px', gap: 1, mb: 1 }}>
                  {(isIndia ? ['Description','Qty','Unit','Rate (₹)','GST %',''] : ['Description','Qty','Unit','Rate',''])
                    .map((h) => <Typography key={h} variant="caption" sx={{ color: colors.text.muted, fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</Typography>)}
                </Box>
                <Stack spacing={2}>
                  {(isIndia ? items : gItems).map((item, idx) => (
                    <Box key={item.id} sx={{ p: { xs: 2, md: 0 }, borderRadius: { xs: 2, md: 0 }, border: { xs: `1px solid ${colors.border.light}`, md: 'none' } }}>
                      <Typography sx={{ display: { xs: 'block', md: 'none' }, fontSize: '0.75rem', fontWeight: 700, color: colors.text.muted, mb: 1 }}>Item {idx+1}</Typography>
                      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: isIndia ? '2fr 0.7fr 0.7fr 0.7fr 0.9fr 36px' : '2.5fr 0.7fr 0.7fr 0.9fr 36px' }, gap: 1, alignItems: 'center' }}>
                        <Box sx={{ gridColumn: { xs: '1 / -1', md: 'auto' } }}>
                          <TextField label="Description *" size="small" fullWidth value={item.description} onChange={(e) => isIndia ? hItem(item.id,'description',e.target.value) : hGItem(item.id,'description',e.target.value)} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }} />
                        </Box>
                        <TextField label="Qty" size="small" fullWidth value={item.qty} onChange={(e) => isIndia ? hItem(item.id,'qty',e.target.value) : hGItem(item.id,'qty',e.target.value)} inputProps={{ inputMode: 'decimal' }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }} />
                        <TextField label="Unit" size="small" fullWidth value={item.unit} onChange={(e) => isIndia ? hItem(item.id,'unit',e.target.value) : hGItem(item.id,'unit',e.target.value)} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }} />
                        <TextField label={isIndia ? 'Rate (₹)' : `Rate (${currencyCode==='OTHER'?(customSymbol||'?'):currencyCode})`} size="small" fullWidth value={item.rate} onChange={(e) => isIndia ? hItem(item.id,'rate',e.target.value) : hGItem(item.id,'rate',e.target.value)} inputProps={{ inputMode: 'decimal' }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }} />
                        {isIndia && (
                          <FormControl size="small" fullWidth>
                            <InputLabel sx={{ fontSize: '0.82rem' }}>GST %</InputLabel>
                            <Select value={item.gstRate} label="GST %" onChange={(e) => hItem(item.id,'gstRate',e.target.value)} sx={{ borderRadius: 1.5 }}>
                              {GST_RATES.map((r) => <MenuItem key={r.value} value={r.value}>{r.value}%</MenuItem>)}
                            </Select>
                          </FormControl>
                        )}
                        <Tooltip title="Remove"><span><IconButton size="small" onClick={() => isIndia ? removeItem(item.id) : removeGItem(item.id)} disabled={(isIndia?items:gItems).length === 1} sx={{ color: colors.text.muted, '&:hover': { color: '#dc2626' }, '&.Mui-disabled': { opacity: 0.3 } }}><Trash2 size={15} /></IconButton></span></Tooltip>
                      </Box>
                      {/* Notes per item */}
                      <Box sx={{ mt: 1 }}>
                        <TextField label="Item notes (optional)" size="small" fullWidth value={item.notes} onChange={(e) => isIndia ? hItem(item.id,'notes',e.target.value) : hGItem(item.id,'notes',e.target.value)} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }} />
                      </Box>
                      {(item.qty && item.rate) && (
                        <Box sx={{ mt: 0.5, textAlign: { xs: 'left', md: 'right' } }}>
                          <Typography variant="caption" sx={{ color: colors.text.muted, fontFamily: '"JetBrains Mono", monospace' }}>
                            {isIndia
                              ? `₹${fmt(calcIndiaItem(item).taxableAmount)} + ₹${fmt(calcIndiaItem(item).gstAmount)} GST = ₹${fmt(calcIndiaItem(item).total)}`
                              : `Amount: ${cp(calcGlobalItem(item))}`}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  ))}
                </Stack>
                <Button startIcon={<Plus size={15} />} onClick={isIndia ? addItem : addGItem} sx={{ mt: 2, borderRadius: 2, fontWeight: 600, fontSize: '0.82rem', color: colors.accent.primary, textTransform: 'none', '&:hover': { backgroundColor: 'rgba(109,40,217,0.06)' } }}>Add Item</Button>
              </CardContent>
            </Card>

            {/* Terms */}
            <Card sx={{ borderRadius: 3, border: `1px solid ${colors.border.light}`, boxShadow: 'none' }}>
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <SectionHeading>Terms & Conditions</SectionHeading>
                <TextField label="Terms & conditions" size="small" fullWidth name="terms" value={isIndia ? quote.terms : gQuote.terms} onChange={isIndia ? hQuote : hGQuote} multiline rows={4} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }} />
              </CardContent>
            </Card>
          </Grid>

          {/* Summary */}
          <Grid item xs={12} lg={4}>
            <Card component={motion.div} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.1 }}
              sx={{ borderRadius: 3, border: `1.5px solid #99f6e4`, backgroundColor: '#f0fdfa', boxShadow: 'none', position: { lg: 'sticky' }, top: { lg: 100 } }}>
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <Typography variant="overline" sx={{ color: colors.accent.secondary, fontWeight: 700, fontSize: '0.68rem', letterSpacing: '0.1em', display: 'block', mb: 2 }}>Quote Summary</Typography>
                {(isIndia ? quote.validUntil : gQuote.validUntil) && (
                  <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 2, p: 1.5, borderRadius: 2, backgroundColor: '#fffbeb', border: '1px solid #fde68a' }}>
                    <CalendarClock size={14} style={{ color: '#92400e', flexShrink: 0 }} />
                    <Typography variant="caption" sx={{ color: '#92400e', fontWeight: 600 }}>Valid until {isIndia ? quote.validUntil : gQuote.validUntil}</Typography>
                  </Stack>
                )}
                {isIndia ? (
                  <Stack spacing={0.5}>
                    <Stack direction="row" justifyContent="space-between"><Typography variant="body2" sx={{ color: colors.text.secondary }}>Sub Total</Typography><Typography variant="body2" sx={{ fontWeight: 600, fontFamily: '"JetBrains Mono", monospace' }}>₹ {fmt(indiaTotals.subTotal)}</Typography></Stack>
                    <Stack direction="row" justifyContent="space-between"><Typography variant="body2" sx={{ color: colors.text.secondary }}>Total GST</Typography><Typography variant="body2" sx={{ fontWeight: 600, fontFamily: '"JetBrains Mono", monospace' }}>₹ {fmt(indiaTotals.totalGst)}</Typography></Stack>
                    <Divider sx={{ my: 1 }} />
                    <Stack direction="row" justifyContent="space-between" sx={{ py: 0.5 }}><Typography variant="subtitle1" sx={{ fontWeight: 800, color: colors.text.primary }}>Total Amount</Typography><Typography variant="subtitle1" sx={{ fontWeight: 800, color: colors.accent.secondary, fontFamily: '"JetBrains Mono", monospace' }}>₹ {fmt(indiaTotals.grandTotal)}</Typography></Stack>
                    <Divider sx={{ my: 1 }} />
                    {items.map((item) => { if (!item.qty || !item.rate) return null; const { gstAmount } = calcIndiaItem(item); return (<Stack key={item.id} direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}><Typography variant="caption" sx={{ color: colors.text.secondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '55%' }}>{item.description||'Item'} ({item.gstRate}%)</Typography><Typography variant="caption" sx={{ color: colors.text.primary, fontWeight: 600, fontFamily: '"JetBrains Mono", monospace' }}>₹{fmt(gstAmount)}</Typography></Stack>); })}
                  </Stack>
                ) : (
                  <Stack spacing={0.5}>
                    <Stack direction="row" justifyContent="space-between"><Typography variant="body2" sx={{ color: colors.text.secondary }}>Sub Total</Typography><Typography variant="body2" sx={{ fontWeight: 600, fontFamily: '"JetBrains Mono", monospace' }}>{cp(globalTotals.subTotal)}</Typography></Stack>
                    {taxConfig.mode !== 'none' && globalTotals.taxAmount > 0 && <Stack direction="row" justifyContent="space-between"><Typography variant="body2" sx={{ color: colors.text.secondary }}>{taxLineLabel(taxConfig)}</Typography><Typography variant="body2" sx={{ fontWeight: 600, fontFamily: '"JetBrains Mono", monospace' }}>{cp(globalTotals.taxAmount)}</Typography></Stack>}
                    <Divider sx={{ my: 1 }} />
                    <Stack direction="row" justifyContent="space-between" sx={{ py: 0.5 }}><Typography variant="subtitle1" sx={{ fontWeight: 800, color: colors.text.primary }}>Total Amount</Typography><Typography variant="subtitle1" sx={{ fontWeight: 800, color: colors.accent.secondary, fontFamily: '"JetBrains Mono", monospace' }}>{cp(globalTotals.grandTotal)}</Typography></Stack>
                    <Divider sx={{ my: 1 }} />
                    <Stack direction="row" justifyContent="space-between"><Typography variant="body2" sx={{ color: colors.text.secondary }}>Currency</Typography><Chip label={currencyCode==='OTHER'?(customSymbol||'Custom'):currencyCode} size="small" sx={{ fontWeight: 700, fontSize: '0.72rem', height: 22 }} /></Stack>
                  </Stack>
                )}
                <Divider sx={{ my: 2 }} />
                <Button fullWidth variant="contained" startIcon={<Printer size={15} />} onClick={() => window.print()} sx={{ borderRadius: 2, fontWeight: 700, background: colors.accent.secondary, color: '#fff', '&:hover': { background: '#0f766e' } }}>Print / Save as PDF</Button>
                <Alert severity="info" icon={<Info size={14} />} sx={{ mt: 2, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.7)', border: '1px solid #bae6fd', '& .MuiAlert-icon': { color: '#0369a1' }, '& .MuiAlert-message': { fontSize: '0.75rem' } }}>
                  Use <strong>Ctrl+P</strong> → "Save as PDF" for a PDF copy.
                </Alert>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {isIndia
          ? <IndiaPrint biz={biz} client={client} quote={quote} items={items} totals={indiaTotals} />
          : <GlobalPrint biz={gBiz} client={gClient} quote={gQuote} items={gItems} totals={globalTotals} taxConfig={taxConfig} currencyCode={currencyCode} customSymbol={customSymbol} />
        }
      </Container>
    </>
  );
};

export default QuotationGenerator;
