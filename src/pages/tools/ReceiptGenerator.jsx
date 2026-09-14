import { useState } from 'react';
import {
  Box, Container, Typography, TextField, Grid, Card, CardContent,
  Stack, Button, Divider, MenuItem, Select, FormControl,
  InputLabel, Alert, Chip, ToggleButton, ToggleButtonGroup,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import {
  Receipt, Printer, RotateCcw, ArrowLeft, ChevronRight,
  CheckCircle, Info,
} from 'lucide-react';
import { colors } from '../../theme/theme';
import { absoluteUrl, siteMetadata } from '../../seo/siteMetadata';
import { SectionBadge } from '../../components/common';
import {
  CURRENCIES, INDIA_PAYMENT_METHODS, GLOBAL_PAYMENT_METHODS,
  fmtCurrency, currencyPrefix,
  detectRegion,
} from './regionConfig';

/* ─── India: amount in words (unchanged) ─── */
const fmtWords = (n) => {
  if (!Number.isFinite(n) || n < 0) return '';
  const ones = ['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine',
    'Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
  const tens = ['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
  const twoD = (n) => n < 20 ? ones[n] : tens[Math.floor(n/10)] + (n%10 ? ' '+ones[n%10] : '');
  const conv = (n) => {
    if (n===0) return '';
    if (n<100) return twoD(n);
    if (n<1000) return ones[Math.floor(n/100)]+' Hundred'+(n%100?' '+twoD(n%100):'');
    if (n<100000) return conv(Math.floor(n/1000))+' Thousand'+(n%1000?' '+conv(n%1000):'');
    if (n<10000000) return conv(Math.floor(n/100000))+' Lakh'+(n%100000?' '+conv(n%100000):'');
    return conv(Math.floor(n/10000000))+' Crore'+(n%10000000?' '+conv(n%10000000):'');
  };
  const rupees = Math.floor(n); const paise = Math.round((n-rupees)*100);
  let r = conv(rupees)||'Zero'; r+=' Rupees';
  if (paise>0) r+=' and '+twoD(paise)+' Paise';
  return r+' Only';
};

const fmt = (n) => Number.isFinite(n) ? n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00';
const today = () => new Date().toISOString().split('T')[0];

const Field = ({ label, ...props }) => (
  <TextField label={label} size="small" fullWidth variant="outlined"
    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 }, '& .MuiInputLabel-root': { fontSize: '0.82rem' } }} {...props} />
);
const SH = ({ children }) => (
  <Typography variant="overline" sx={{ display: 'block', color: colors.accent.primary, fontWeight: 700, fontSize: '0.68rem', letterSpacing: '0.1em', mb: 2 }}>{children}</Typography>
);

/* ─── Region Selector ─── */
/* ══════════════════════════════
   PRINT — India (unchanged)
══════════════════════════════ */
const IndiaPrint = ({ biz, payer, receipt }) => {
  const amount = parseFloat(receipt.amount) || 0;
  return (
    <Box id="receipt-print-area" sx={{ display: 'none', '@media print': { display: 'block' }, fontFamily: '"Inter", sans-serif', fontSize: '12px', color: '#18181b' }}>
      <Box sx={{ textAlign: 'center', mb: 3, pb: 2, borderBottom: '2px solid #18181b' }}>
        <Typography sx={{ fontWeight: 900, fontSize: '26px', color: '#18181b', letterSpacing: '-0.03em' }}>PAYMENT RECEIPT</Typography>
        <Typography sx={{ fontSize: '11px', color: '#52525b', mt: 0.5 }}>{receipt.receiptType==='advance'?'(Advance Payment)':receipt.receiptType==='partial'?'(Part Payment)':'(Full Payment)'}</Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: '16px' }}>{biz.name||'Business Name'}</Typography>
          {biz.gstin && <Typography sx={{ fontSize: '11px', color: '#52525b' }}>GSTIN: {biz.gstin}</Typography>}
          {biz.address && <Typography sx={{ fontSize: '11px', color: '#52525b', whiteSpace: 'pre-line' }}>{biz.address}</Typography>}
          {biz.phone && <Typography sx={{ fontSize: '11px', color: '#52525b' }}>Phone: {biz.phone}</Typography>}
          {biz.email && <Typography sx={{ fontSize: '11px', color: '#52525b' }}>Email: {biz.email}</Typography>}
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography sx={{ fontSize: '11px', color: '#52525b' }}>Receipt No: <strong>{receipt.number||'—'}</strong></Typography>
          <Typography sx={{ fontSize: '11px', color: '#52525b' }}>Date: <strong>{receipt.date||'—'}</strong></Typography>
          {receipt.invoiceNumber && <Typography sx={{ fontSize: '11px', color: '#52525b' }}>Against Invoice: <strong>{receipt.invoiceNumber}</strong></Typography>}
        </Box>
      </Box>
      <Divider sx={{ mb: 2.5, borderColor: '#e4e4e7' }} />
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#52525b', mb: 0.5 }}>Received From</Typography>
        <Typography sx={{ fontWeight: 700, fontSize: '14px' }}>{payer.name||'—'}</Typography>
        {payer.address && <Typography sx={{ fontSize: '11px', color: '#52525b', whiteSpace: 'pre-line' }}>{payer.address}</Typography>}
        {payer.phone && <Typography sx={{ fontSize: '11px', color: '#52525b' }}>Phone: {payer.phone}</Typography>}
        {payer.gstin && <Typography sx={{ fontSize: '11px', color: '#52525b' }}>GSTIN: {payer.gstin}</Typography>}
      </Box>
      <Box sx={{ mb: 3, p: '12px 16px', backgroundColor: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '8px' }}>
        <Typography sx={{ fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#16a34a', mb: 0.5 }}>Amount Received</Typography>
        <Typography sx={{ fontWeight: 900, fontSize: '28px', color: '#14532d', letterSpacing: '-0.03em' }}>₹ {fmt(amount)}</Typography>
        {fmtWords(amount) && <Typography sx={{ fontSize: '11px', color: '#16a34a', fontWeight: 600, mt: 0.5, fontStyle: 'italic' }}>{fmtWords(amount)}</Typography>}
      </Box>
      <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', mb: 3 }}>
        <Box component="tbody">
          {[
            { label: 'Payment Method', value: receipt.paymentMethod },
            receipt.paymentRef && { label: 'Reference / UTR / Cheque No.', value: receipt.paymentRef },
            receipt.description && { label: 'Payment For', value: receipt.description },
          ].filter(Boolean).map(({ label, value }) => (
            <Box key={label} component="tr">
              <Box component="td" sx={{ p: '5px 8px', width: '35%', fontWeight: 700, fontSize: '11px', color: '#52525b', verticalAlign: 'top', backgroundColor: '#fafafa', borderBottom: '1px solid #f4f4f5' }}>{label}</Box>
              <Box component="td" sx={{ p: '5px 8px', fontSize: '11px', borderBottom: '1px solid #f4f4f5' }}>{value}</Box>
            </Box>
          ))}
        </Box>
      </Box>
      {receipt.notes && <Box sx={{ mb: 3, pt: 2, borderTop: '1px solid #e4e4e7' }}><Typography sx={{ fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#52525b', mb: 0.5 }}>Notes</Typography><Typography sx={{ fontSize: '11px', color: '#52525b', whiteSpace: 'pre-line' }}>{receipt.notes}</Typography></Box>}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 5, pt: 3, borderTop: '1px solid #e4e4e7' }}>
        {['Payer Signature', `Authorised Signatory (${biz.name||'Business'})`].map((label) => (
          <Box key={label} sx={{ width: '45%', textAlign: 'center' }}><Box sx={{ height: 50, borderBottom: '1px solid #18181b', mb: 0.5 }} /><Typography sx={{ fontSize: '10px', color: '#52525b' }}>{label}</Typography></Box>
        ))}
      </Box>
      <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid #e4e4e7', textAlign: 'center' }}><Typography sx={{ fontSize: '10px', color: '#a1a1aa' }}>Generated via aslisite.com/tools/receipt-generator</Typography></Box>
    </Box>
  );
};

/* ══════════════════════════════
   PRINT — Global
══════════════════════════════ */
const GlobalPrint = ({ biz, payer, receipt, currencyCode, customSymbol }) => {
  const amount = parseFloat(receipt.amount) || 0;
  const cp = (n) => fmtCurrency(n, currencyCode, customSymbol, false);
  const pre = currencyPrefix(currencyCode, customSymbol);
  return (
    <Box id="receipt-print-area" sx={{ display: 'none', '@media print': { display: 'block' }, fontFamily: '"Inter", sans-serif', fontSize: '12px', color: '#18181b' }}>
      <Box sx={{ textAlign: 'center', mb: 3, pb: 2, borderBottom: '2px solid #18181b' }}>
        <Typography sx={{ fontWeight: 900, fontSize: '26px', color: '#18181b', letterSpacing: '-0.03em' }}>PAYMENT RECEIPT</Typography>
        <Typography sx={{ fontSize: '11px', color: '#52525b', mt: 0.5 }}>{receipt.receiptType==='advance'?'(Advance Payment)':receipt.receiptType==='partial'?'(Part Payment)':'(Full Payment)'}</Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: '16px' }}>{biz.name||'Business Name'}</Typography>
          {biz.taxId && <Typography sx={{ fontSize: '11px', color: '#52525b' }}>Tax ID: {biz.taxId}</Typography>}
          {biz.address && <Typography sx={{ fontSize: '11px', color: '#52525b', whiteSpace: 'pre-line' }}>{biz.address}</Typography>}
          {biz.phone && <Typography sx={{ fontSize: '11px', color: '#52525b' }}>Phone: {biz.phone}</Typography>}
          {biz.email && <Typography sx={{ fontSize: '11px', color: '#52525b' }}>Email: {biz.email}</Typography>}
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography sx={{ fontSize: '11px', color: '#52525b' }}>Receipt No: <strong>{receipt.number||'—'}</strong></Typography>
          <Typography sx={{ fontSize: '11px', color: '#52525b' }}>Date: <strong>{receipt.date||'—'}</strong></Typography>
          {receipt.invoiceNumber && <Typography sx={{ fontSize: '11px', color: '#52525b' }}>Invoice Ref: <strong>{receipt.invoiceNumber}</strong></Typography>}
          <Typography sx={{ fontSize: '11px', color: '#52525b' }}>Currency: <strong>{currencyCode==='OTHER'?(customSymbol||'Custom'):currencyCode}</strong></Typography>
        </Box>
      </Box>
      <Divider sx={{ mb: 2.5, borderColor: '#e4e4e7' }} />
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#52525b', mb: 0.5 }}>Received From</Typography>
        <Typography sx={{ fontWeight: 700, fontSize: '14px' }}>{payer.name||'—'}</Typography>
        {payer.taxId && <Typography sx={{ fontSize: '11px', color: '#52525b' }}>Tax ID: {payer.taxId}</Typography>}
        {payer.address && <Typography sx={{ fontSize: '11px', color: '#52525b', whiteSpace: 'pre-line' }}>{payer.address}</Typography>}
        {payer.phone && <Typography sx={{ fontSize: '11px', color: '#52525b' }}>Phone: {payer.phone}</Typography>}
      </Box>
      <Box sx={{ mb: 3, p: '12px 16px', backgroundColor: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '8px' }}>
        <Typography sx={{ fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#16a34a', mb: 0.5 }}>Amount Received</Typography>
        <Typography sx={{ fontWeight: 900, fontSize: '28px', color: '#14532d', letterSpacing: '-0.03em' }}>{cp(amount)}</Typography>
      </Box>
      <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', mb: 3 }}>
        <Box component="tbody">
          {[
            { label: 'Payment Method', value: receipt.paymentMethod },
            receipt.paymentRef && { label: 'Reference / Transaction ID', value: receipt.paymentRef },
            receipt.description && { label: 'Payment For', value: receipt.description },
          ].filter(Boolean).map(({ label, value }) => (
            <Box key={label} component="tr">
              <Box component="td" sx={{ p: '5px 8px', width: '35%', fontWeight: 700, fontSize: '11px', color: '#52525b', verticalAlign: 'top', backgroundColor: '#fafafa', borderBottom: '1px solid #f4f4f5' }}>{label}</Box>
              <Box component="td" sx={{ p: '5px 8px', fontSize: '11px', borderBottom: '1px solid #f4f4f5' }}>{value}</Box>
            </Box>
          ))}
        </Box>
      </Box>
      {receipt.notes && <Box sx={{ mb: 3, pt: 2, borderTop: '1px solid #e4e4e7' }}><Typography sx={{ fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#52525b', mb: 0.5 }}>Notes</Typography><Typography sx={{ fontSize: '11px', color: '#52525b', whiteSpace: 'pre-line' }}>{receipt.notes}</Typography></Box>}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 5, pt: 3, borderTop: '1px solid #e4e4e7' }}>
        {['Payer Signature', `Authorised Signatory (${biz.name||'Business'})`].map((label) => (
          <Box key={label} sx={{ width: '45%', textAlign: 'center' }}><Box sx={{ height: 50, borderBottom: '1px solid #18181b', mb: 0.5 }} /><Typography sx={{ fontSize: '10px', color: '#52525b' }}>{label}</Typography></Box>
        ))}
      </Box>
      <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid #e4e4e7', textAlign: 'center' }}><Typography sx={{ fontSize: '10px', color: '#a1a1aa' }}>Generated via aslisite.com/tools/receipt-generator</Typography></Box>
    </Box>
  );
};

/* ══════════════════════════════
   MAIN
══════════════════════════════ */
const ReceiptGenerator = () => {
  const [region, setRegion] = useState(detectRegion);
  const isIndia = region === 'india';

  /* India state (unchanged) */
  const [biz, setBiz]     = useState({ name: '', gstin: '', address: '', phone: '', email: '' });
  const [payer, setPayer] = useState({ name: '', gstin: '', address: '', phone: '' });
  const [receipt, setReceipt] = useState({
    number: 'REC-001', date: today(), amount: '', paymentMethod: 'UPI',
    paymentRef: '', invoiceNumber: '', receiptType: 'full', description: '', notes: '',
  });

  /* Global state */
  const [gBiz, setGBiz]     = useState({ name: '', taxId: '', address: '', phone: '', email: '' });
  const [gPayer, setGPayer] = useState({ name: '', taxId: '', address: '', phone: '' });
  const [gReceipt, setGReceipt] = useState({
    number: 'REC-001', date: today(), amount: '', paymentMethod: 'Bank Transfer',
    paymentRef: '', invoiceNumber: '', receiptType: 'full', description: '', notes: '',
  });
  const [currencyCode, setCurrencyCode] = useState('USD');
  const [customSymbol, setCustomSymbol] = useState('');

  const amount      = parseFloat(receipt.amount) || 0;
  const amountWords = fmtWords(amount);
  const gAmount     = parseFloat(gReceipt.amount) || 0;
  const cp          = (n) => fmtCurrency(n, currencyCode, customSymbol, false);

  const hBiz     = (e) => setBiz((p) => ({ ...p, [e.target.name]: e.target.value }));
  const hPayer   = (e) => setPayer((p) => ({ ...p, [e.target.name]: e.target.value }));
  const hReceipt = (e) => setReceipt((p) => ({ ...p, [e.target.name]: e.target.value }));
  const hGBiz    = (e) => setGBiz((p) => ({ ...p, [e.target.name]: e.target.value }));
  const hGPayer  = (e) => setGPayer((p) => ({ ...p, [e.target.name]: e.target.value }));
  const hGReceipt = (e) => setGReceipt((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleReset = () => {
    if (isIndia) {
      setBiz({ name: '', gstin: '', address: '', phone: '', email: '' }); setPayer({ name: '', gstin: '', address: '', phone: '' });
      setReceipt({ number: 'REC-001', date: today(), amount: '', paymentMethod: 'UPI', paymentRef: '', invoiceNumber: '', receiptType: 'full', description: '', notes: '' });
    } else {
      setGBiz({ name: '', taxId: '', address: '', phone: '', email: '' }); setGPayer({ name: '', taxId: '', address: '', phone: '' });
      setGReceipt({ number: 'REC-001', date: today(), amount: '', paymentMethod: 'Bank Transfer', paymentRef: '', invoiceNumber: '', receiptType: 'full', description: '', notes: '' });
    }
  };

  const pageTitle = 'Free Receipt Generator | Payment Receipt India & Global | Aslisite';
  const pageDesc = 'Create payment receipts online for free. India mode: GSTIN, UPI/NEFT, ₹, amount in words. Global mode: multi-currency, IBAN/SWIFT/wire. No login required.';

  return (
    <>
      <style>{`@media print { #receipt-print-area { display: block !important; } @page { margin: 15mm; size: A4; } }`}</style>
      <Container maxWidth="lg" className="tool-page-container" sx={{ pt: { xs: 16, md: 16 }, pb: { xs: 8, md: 12 } }}>
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageDesc} />
          <link rel="canonical" href={absoluteUrl('/tools/receipt-generator')} />
          <meta property="og:url" content={absoluteUrl('/tools/receipt-generator')} />
          <meta property="og:type" content="website" />
          <meta property="og:title" content={pageTitle} />
          <meta property="og:description" content={pageDesc} />
          <meta property="og:image" content={siteMetadata.logo} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={pageTitle} />
          <meta name="twitter:description" content={pageDesc} />
          <script type="application/ld+json">{JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebApplication', '@id': `${absoluteUrl('/tools/receipt-generator')}#app`, url: absoluteUrl('/tools/receipt-generator'), name: 'Free Receipt Generator — Aslisite', description: pageDesc, applicationCategory: 'FinanceApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' }, publisher: { '@id': `${siteMetadata.baseUrl}/#organization` } })}</script>
        </Helmet>

        <Stack direction="row" alignItems="center" gap={0.5} sx={{ mb: 4 }} className="no-print">
          <Box component={RouterLink} to="/tools" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: colors.text.muted, textDecoration: 'none', fontSize: '0.82rem', fontWeight: 500, '&:hover': { color: colors.accent.primary }, transition: 'color 0.2s' }}><ArrowLeft size={14} />Free Tools</Box>
          <ChevronRight size={13} style={{ color: colors.text.muted }} />
          <Typography sx={{ fontSize: '0.82rem', color: colors.text.secondary, fontWeight: 500 }}>Receipt Generator</Typography>
        </Stack>

        <Box component={motion.div} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} sx={{ mb: { xs: 5, md: 6 } }} className="no-print">
          <SectionBadge icon={Receipt} label={isIndia ? 'Free Payment Receipt · No Login' : 'Global Receipt · Multi-Currency'} />
          <Typography variant="h1" sx={{ fontSize: { xs: '1.9rem', sm: '2.5rem', md: '2.8rem' }, fontWeight: 800, color: colors.text.primary, mt: 2, mb: 1.5, letterSpacing: '-0.03em' }}>Free Receipt Generator</Typography>
          <Typography variant="subtitle1" sx={{ color: colors.text.secondary, maxWidth: 560, lineHeight: 1.7 }}>
            {isIndia ? 'Generate payment receipts with amount in words, UPI/NEFT reference, and signature area.' : 'Generate international payment receipts with multi-currency support and wire transfer details.'}
          </Typography>
        </Box>

        <Stack direction="row" alignItems="center" gap={1.5} flexWrap="wrap" sx={{ mb: 4 }} className="no-print">
          <Button variant="contained" startIcon={<Printer size={15} />} onClick={() => window.print()} sx={{ borderRadius: 2, fontWeight: 700, background: colors.accent.primary, color: '#fff', px: 3, '&:hover': { background: colors.accent.primaryHover } }}>Print / Save PDF</Button>
          <Button variant="outlined" startIcon={<RotateCcw size={14} />} onClick={handleReset} sx={{ borderRadius: 2, fontWeight: 600, borderColor: colors.border.medium, color: colors.text.secondary, '&:hover': { borderColor: colors.accent.primary, color: colors.accent.primary } }}>Reset</Button>
          <Box sx={{ ml: 'auto' }}>
            <ToggleButtonGroup value={region} exclusive onChange={(_, v) => v && setRegion(v)} size="small"
              sx={{ '& .MuiToggleButton-root': { px: 1.5, py: 0.6, fontWeight: 600, fontSize: '0.75rem', textTransform: 'none', border: `1px solid ${colors.border.medium} !important`, gap: 0.5, lineHeight: 1.4,
                '&.Mui-selected': { backgroundColor: colors.accent.primary, color: '#fff', borderColor: `${colors.accent.primary} !important` },
                '&:not(.Mui-selected):hover': { backgroundColor: 'rgba(109,40,217,0.05)' } } }}>
              <ToggleButton value="india" aria-label="India mode">🇮🇳 India</ToggleButton>
              <ToggleButton value="global" aria-label="Global mode">🌐 Global</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Stack>

        <Grid container spacing={3} className="no-print">
          <Grid item xs={12} lg={8}>
            {/* Currency (Global only) */}
            {!isIndia && (
              <Card sx={{ borderRadius: 3, border: `1px solid ${colors.border.light}`, boxShadow: 'none', mb: 3 }}>
                <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                  <SH>Currency</SH>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormControl fullWidth size="small"><InputLabel sx={{ fontSize: '0.82rem' }}>Currency</InputLabel>
                        <Select value={currencyCode} label="Currency" onChange={(e) => setCurrencyCode(e.target.value)} sx={{ borderRadius: 1.5 }}>
                          {CURRENCIES.map((c) => <MenuItem key={c.code} value={c.code}>{c.symbol?`${c.symbol} — `:''}{c.name} ({c.code})</MenuItem>)}
                        </Select>
                      </FormControl>
                    </Grid>
                    {currencyCode === 'OTHER' && <Grid item xs={12} sm={6} md={4}><TextField label="Currency Symbol" size="small" fullWidth value={customSymbol} onChange={(e) => setCustomSymbol(e.target.value)} placeholder="e.g. د.إ" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }} /></Grid>}
                  </Grid>
                </CardContent>
              </Card>
            )}

            {/* Business */}
            <Card sx={{ borderRadius: 3, border: `1px solid ${colors.border.light}`, boxShadow: 'none', mb: 3 }}>
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <SH>Your Business Details</SH>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}><Field label="Business Name *" name="name" value={isIndia?biz.name:gBiz.name} onChange={isIndia?hBiz:hGBiz} /></Grid>
                  <Grid item xs={12} sm={6}><Field label={isIndia?'GSTIN (optional)':'Tax ID / VAT No. (optional)'} name={isIndia?'gstin':'taxId'} value={isIndia?biz.gstin:gBiz.taxId} onChange={isIndia?hBiz:hGBiz} inputProps={isIndia?{maxLength:15}:{}} /></Grid>
                  <Grid item xs={12}><Field label="Address" name="address" value={isIndia?biz.address:gBiz.address} onChange={isIndia?hBiz:hGBiz} multiline rows={2} /></Grid>
                  <Grid item xs={12} sm={6}><Field label="Phone" name="phone" value={isIndia?biz.phone:gBiz.phone} onChange={isIndia?hBiz:hGBiz} /></Grid>
                  <Grid item xs={12} sm={6}><Field label="Email" name="email" value={isIndia?biz.email:gBiz.email} onChange={isIndia?hBiz:hGBiz} type="email" /></Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Payer */}
            <Card sx={{ borderRadius: 3, border: `1px solid ${colors.border.light}`, boxShadow: 'none', mb: 3 }}>
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <SH>Received From (Payer)</SH>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}><Field label="Payer Name *" name="name" value={isIndia?payer.name:gPayer.name} onChange={isIndia?hPayer:hGPayer} /></Grid>
                  <Grid item xs={12} sm={6}><Field label={isIndia?'GSTIN (optional)':'Tax ID (optional)'} name={isIndia?'gstin':'taxId'} value={isIndia?payer.gstin:gPayer.taxId} onChange={isIndia?hPayer:hGPayer} inputProps={isIndia?{maxLength:15}:{}} /></Grid>
                  <Grid item xs={12}><Field label="Address" name="address" value={isIndia?payer.address:gPayer.address} onChange={isIndia?hPayer:hGPayer} multiline rows={2} /></Grid>
                  <Grid item xs={12} sm={6}><Field label="Phone" name="phone" value={isIndia?payer.phone:gPayer.phone} onChange={isIndia?hPayer:hGPayer} /></Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Receipt Details */}
            <Card sx={{ borderRadius: 3, border: `1px solid ${colors.border.light}`, boxShadow: 'none', mb: 3 }}>
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <SH>Receipt Details</SH>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}><Field label="Receipt No." name="number" value={isIndia?receipt.number:gReceipt.number} onChange={isIndia?hReceipt:hGReceipt} /></Grid>
                  <Grid item xs={12} sm={6} md={4}><Field label="Date" name="date" value={isIndia?receipt.date:gReceipt.date} onChange={isIndia?hReceipt:hGReceipt} type="date" InputLabelProps={{ shrink: true }} /></Grid>
                  <Grid item xs={12} sm={6} md={4}><Field label="Against Invoice No." name="invoiceNumber" value={isIndia?receipt.invoiceNumber:gReceipt.invoiceNumber} onChange={isIndia?hReceipt:hGReceipt} placeholder="Optional" /></Grid>

                  <Grid item xs={12} sm={6}>
                    <Field
                      label={isIndia ? 'Amount Received (₹) *' : `Amount Received (${currencyCode==='OTHER'?(customSymbol||'?'):currencyCode}) *`}
                      name="amount" value={isIndia?receipt.amount:gReceipt.amount} onChange={isIndia?hReceipt:hGReceipt}
                      inputProps={{ inputMode: 'decimal' }}
                      sx={{ '& .MuiOutlinedInput-root': { fontFamily: '"JetBrains Mono", monospace', fontWeight: 700, fontSize: '1.05rem' } }}
                    />
                    {isIndia && amount > 0 && <Typography variant="caption" sx={{ color: colors.text.muted, mt: 0.5, display: 'block', fontStyle: 'italic' }}>{amountWords}</Typography>}
                    {!isIndia && gAmount > 0 && <Typography variant="caption" sx={{ color: colors.text.muted, mt: 0.5, display: 'block', fontFamily: '"JetBrains Mono", monospace' }}>{cp(gAmount)}</Typography>}
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth size="small"><InputLabel sx={{ fontSize: '0.82rem' }}>Receipt Type</InputLabel>
                      <Select value={isIndia?receipt.receiptType:gReceipt.receiptType} label="Receipt Type" name="receiptType" onChange={isIndia?hReceipt:hGReceipt} sx={{ borderRadius: 1.5 }}>
                        <MenuItem value="full">Full Payment</MenuItem>
                        <MenuItem value="advance">Advance Payment</MenuItem>
                        <MenuItem value="partial">Part / Partial Payment</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth size="small"><InputLabel sx={{ fontSize: '0.82rem' }}>Payment Method *</InputLabel>
                      <Select value={isIndia?receipt.paymentMethod:gReceipt.paymentMethod} label="Payment Method *" name="paymentMethod" onChange={isIndia?hReceipt:hGReceipt} sx={{ borderRadius: 1.5 }}>
                        {(isIndia ? INDIA_PAYMENT_METHODS : GLOBAL_PAYMENT_METHODS).map((m) => <MenuItem key={m} value={m}>{m}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Field label={isIndia ? 'Reference / UTR / Cheque No.' : 'Reference / Transaction ID'} name="paymentRef" value={isIndia?receipt.paymentRef:gReceipt.paymentRef} onChange={isIndia?hReceipt:hGReceipt} placeholder="Optional" />
                  </Grid>

                  <Grid item xs={12}><Field label="Payment For / Description" name="description" value={isIndia?receipt.description:gReceipt.description} onChange={isIndia?hReceipt:hGReceipt} placeholder="e.g. Website development - Phase 1" /></Grid>
                  <Grid item xs={12}><Field label="Notes (optional)" name="notes" value={isIndia?receipt.notes:gReceipt.notes} onChange={isIndia?hReceipt:hGReceipt} multiline rows={2} /></Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Summary panel */}
          <Grid item xs={12} lg={4}>
            <Card component={motion.div} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.1 }}
              sx={{ borderRadius: 3, border: `1.5px solid #86efac`, backgroundColor: '#f0fdf4', boxShadow: 'none', position: { lg: 'sticky' }, top: { lg: 100 } }}>
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <Stack direction="row" alignItems="center" gap={1} mb={2}><CheckCircle size={18} style={{ color: '#16a34a' }} /><Typography variant="overline" sx={{ color: '#16a34a', fontWeight: 700, fontSize: '0.68rem', letterSpacing: '0.1em' }}>Receipt Preview</Typography></Stack>
                <Box sx={{ mb: 2.5, p: 2, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.7)', border: '1px solid #86efac', textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ color: '#16a34a', fontWeight: 700, display: 'block', mb: 0.5 }}>Amount Received</Typography>
                  <Typography sx={{ fontWeight: 900, fontSize: '1.8rem', color: '#14532d', fontFamily: '"JetBrains Mono", monospace', lineHeight: 1.1 }}>
                    {isIndia ? `₹ ${fmt(amount)}` : cp(gAmount)}
                  </Typography>
                  {isIndia && amountWords && <Typography variant="caption" sx={{ color: '#16a34a', fontStyle: 'italic', display: 'block', mt: 0.75, lineHeight: 1.5 }}>{amountWords}</Typography>}
                </Box>
                <Stack spacing={0.75}>
                  {[
                    { label: 'From', value: isIndia?payer.name:gPayer.name || '—' },
                    { label: 'Method', value: isIndia?receipt.paymentMethod:gReceipt.paymentMethod },
                    { label: 'Type', value: (isIndia?receipt.receiptType:gReceipt.receiptType)==='full'?'Full Payment':(isIndia?receipt.receiptType:gReceipt.receiptType)==='advance'?'Advance':'Part Payment' },
                    (isIndia?receipt.paymentRef:gReceipt.paymentRef) && { label: 'Ref', value: isIndia?receipt.paymentRef:gReceipt.paymentRef },
                    (isIndia?receipt.invoiceNumber:gReceipt.invoiceNumber) && { label: 'Invoice', value: isIndia?receipt.invoiceNumber:gReceipt.invoiceNumber },
                    !isIndia && currencyCode !== 'INR' && { label: 'Currency', value: currencyCode==='OTHER'?(customSymbol||'Custom'):currencyCode },
                  ].filter(Boolean).map(({ label, value }) => (
                    <Stack key={label} direction="row" justifyContent="space-between" gap={1}>
                      <Typography variant="caption" sx={{ color: colors.text.muted, fontWeight: 600, flexShrink: 0 }}>{label}</Typography>
                      <Typography variant="caption" sx={{ color: colors.text.primary, fontWeight: 600, textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '65%' }}>{value}</Typography>
                    </Stack>
                  ))}
                </Stack>
                <Divider sx={{ my: 2 }} />
                <Button fullWidth variant="contained" startIcon={<Printer size={15} />} onClick={() => window.print()} sx={{ borderRadius: 2, fontWeight: 700, backgroundColor: '#16a34a', color: '#fff', '&:hover': { backgroundColor: '#15803d' }, mb: 2 }}>Print / Save as PDF</Button>
                <Alert severity="info" icon={<Info size={14} />} sx={{ borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.7)', border: '1px solid #bae6fd', '& .MuiAlert-icon': { color: '#0369a1' }, '& .MuiAlert-message': { fontSize: '0.75rem' } }}>
                  Use <strong>Ctrl+P</strong> → "Save as PDF". Data stays in your browser.
                </Alert>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {isIndia
          ? <IndiaPrint biz={biz} payer={payer} receipt={receipt} />
          : <GlobalPrint biz={gBiz} payer={gPayer} receipt={gReceipt} currencyCode={currencyCode} customSymbol={customSymbol} />
        }
      </Container>
    </>
  );
};

export default ReceiptGenerator;
