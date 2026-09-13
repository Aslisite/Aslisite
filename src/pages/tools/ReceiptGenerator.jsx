import { useState } from 'react';
import {
  Box, Container, Typography, TextField, Grid, Card, CardContent,
  Stack, Button, Divider, MenuItem, Select, FormControl,
  InputLabel, Alert, Chip,
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

/* ─── Helpers ─── */
const fmt = (n) =>
  Number.isFinite(n)
    ? n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '0.00';

const fmtWords = (n) => {
  /* Simple number-to-words for amounts up to 9,99,99,999 (Indian system) */
  if (!Number.isFinite(n) || n < 0) return '';
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const twoDigits = (n) => {
    if (n < 20) return ones[n];
    return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
  };

  const convert = (n) => {
    if (n === 0) return '';
    if (n < 100) return twoDigits(n);
    if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + twoDigits(n % 100) : '');
    if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + convert(n % 1000) : '');
    if (n < 10000000) return convert(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + convert(n % 100000) : '');
    return convert(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + convert(n % 10000000) : '');
  };

  const rupees = Math.floor(n);
  const paise = Math.round((n - rupees) * 100);
  let result = convert(rupees);
  if (!result) result = 'Zero';
  result += ' Rupees';
  if (paise > 0) result += ' and ' + twoDigits(paise) + ' Paise';
  result += ' Only';
  return result;
};

const today = () => new Date().toISOString().split('T')[0];

const PAYMENT_METHODS = [
  'Cash', 'UPI', 'Bank Transfer (NEFT/RTGS)', 'IMPS', 'Cheque', 'Credit Card', 'Debit Card', 'Other',
];

const SectionHeading = ({ children }) => (
  <Typography variant="overline" sx={{ display: 'block', color: colors.accent.primary, fontWeight: 700, fontSize: '0.68rem', letterSpacing: '0.1em', mb: 2 }}>
    {children}
  </Typography>
);

const Field = ({ label, ...props }) => (
  <TextField label={label} size="small" fullWidth variant="outlined"
    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 }, '& .MuiInputLabel-root': { fontSize: '0.82rem' } }}
    {...props}
  />
);

/* ════════════════════════════════════════════
   PRINT DOCUMENT
════════════════════════════════════════════ */
const PrintDocument = ({ biz, payer, receipt }) => {
  const amount = parseFloat(receipt.amount) || 0;
  const amountWords = fmtWords(amount);

  return (
    <Box
      id="receipt-print-area"
      sx={{
        display: 'none',
        '@media print': { display: 'block' },
        fontFamily: '"Inter", sans-serif',
        fontSize: '12px',
        color: '#18181b',
      }}
    >
      {/* Watermark style header */}
      <Box sx={{ textAlign: 'center', mb: 3, pb: 2, borderBottom: '2px solid #18181b' }}>
        <Typography sx={{ fontWeight: 900, fontSize: '26px', color: '#18181b', letterSpacing: '-0.03em' }}>
          PAYMENT RECEIPT
        </Typography>
        <Typography sx={{ fontSize: '11px', color: '#52525b', mt: 0.5 }}>
          {receipt.receiptType === 'advance' ? '(Advance Payment)' : receipt.receiptType === 'partial' ? '(Part Payment)' : '(Full Payment)'}
        </Typography>
      </Box>

      {/* Biz + Receipt meta */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: '16px' }}>{biz.name || 'Business Name'}</Typography>
          {biz.gstin && <Typography sx={{ fontSize: '11px', color: '#52525b' }}>GSTIN: {biz.gstin}</Typography>}
          {biz.address && <Typography sx={{ fontSize: '11px', color: '#52525b', whiteSpace: 'pre-line' }}>{biz.address}</Typography>}
          {biz.phone && <Typography sx={{ fontSize: '11px', color: '#52525b' }}>Phone: {biz.phone}</Typography>}
          {biz.email && <Typography sx={{ fontSize: '11px', color: '#52525b' }}>Email: {biz.email}</Typography>}
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography sx={{ fontSize: '11px', color: '#52525b' }}>Receipt No: <strong>{receipt.number || '—'}</strong></Typography>
          <Typography sx={{ fontSize: '11px', color: '#52525b' }}>Date: <strong>{receipt.date || '—'}</strong></Typography>
          {receipt.invoiceNumber && <Typography sx={{ fontSize: '11px', color: '#52525b' }}>Against Invoice: <strong>{receipt.invoiceNumber}</strong></Typography>}
        </Box>
      </Box>

      <Divider sx={{ mb: 2.5, borderColor: '#e4e4e7' }} />

      {/* Received from */}
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#52525b', mb: 0.5 }}>Received From</Typography>
        <Typography sx={{ fontWeight: 700, fontSize: '14px' }}>{payer.name || '—'}</Typography>
        {payer.address && <Typography sx={{ fontSize: '11px', color: '#52525b', whiteSpace: 'pre-line' }}>{payer.address}</Typography>}
        {payer.phone && <Typography sx={{ fontSize: '11px', color: '#52525b' }}>Phone: {payer.phone}</Typography>}
        {payer.gstin && <Typography sx={{ fontSize: '11px', color: '#52525b' }}>GSTIN: {payer.gstin}</Typography>}
      </Box>

      {/* Amount box */}
      <Box sx={{ mb: 3, p: '12px 16px', backgroundColor: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '8px' }}>
        <Typography sx={{ fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#16a34a', mb: 0.5 }}>
          Amount Received
        </Typography>
        <Typography sx={{ fontWeight: 900, fontSize: '28px', color: '#14532d', letterSpacing: '-0.03em' }}>
          ₹ {fmt(amount)}
        </Typography>
        {amountWords && (
          <Typography sx={{ fontSize: '11px', color: '#16a34a', fontWeight: 600, mt: 0.5, fontStyle: 'italic' }}>
            {amountWords}
          </Typography>
        )}
      </Box>

      {/* Details table */}
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

      {/* Notes */}
      {receipt.notes && (
        <Box sx={{ mb: 3, pt: 2, borderTop: '1px solid #e4e4e7' }}>
          <Typography sx={{ fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#52525b', mb: 0.5 }}>Notes</Typography>
          <Typography sx={{ fontSize: '11px', color: '#52525b', whiteSpace: 'pre-line' }}>{receipt.notes}</Typography>
        </Box>
      )}

      {/* Signature area */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 5, pt: 3, borderTop: '1px solid #e4e4e7' }}>
        <Box sx={{ width: '45%' }}>
          <Box sx={{ height: 50, borderBottom: '1px solid #18181b', mb: 0.5 }} />
          <Typography sx={{ fontSize: '10px', color: '#52525b', textAlign: 'center' }}>Payer Signature</Typography>
        </Box>
        <Box sx={{ width: '45%' }}>
          <Box sx={{ height: 50, borderBottom: '1px solid #18181b', mb: 0.5 }} />
          <Typography sx={{ fontSize: '10px', color: '#52525b', textAlign: 'center' }}>Authorised Signatory ({biz.name || 'Business'})</Typography>
        </Box>
      </Box>

      <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid #e4e4e7', textAlign: 'center' }}>
        <Typography sx={{ fontSize: '10px', color: '#a1a1aa' }}>Generated via aslisite.com/tools/receipt-generator</Typography>
      </Box>
    </Box>
  );
};

/* ════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════ */
const ReceiptGenerator = () => {
  const [biz, setBiz] = useState({ name: '', gstin: '', address: '', phone: '', email: '' });
  const [payer, setPayer] = useState({ name: '', gstin: '', address: '', phone: '' });
  const [receipt, setReceipt] = useState({
    number: 'REC-001',
    date: today(),
    amount: '',
    paymentMethod: 'UPI',
    paymentRef: '',
    invoiceNumber: '',
    receiptType: 'full',
    description: '',
    notes: '',
  });

  const amount = parseFloat(receipt.amount) || 0;
  const amountWords = fmtWords(amount);

  const handleBiz = (e) => setBiz((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handlePayer = (e) => setPayer((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleReceipt = (e) => setReceipt((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleReset = () => {
    setBiz({ name: '', gstin: '', address: '', phone: '', email: '' });
    setPayer({ name: '', gstin: '', address: '', phone: '' });
    setReceipt({ number: 'REC-001', date: today(), amount: '', paymentMethod: 'UPI', paymentRef: '', invoiceNumber: '', receiptType: 'full', description: '', notes: '' });
  };

  const pageTitle = 'Free Receipt Generator India | Payment Receipt Maker Online | Aslisite';
  const pageDesc =
    'Create professional payment receipts online for free. Add payment method, reference number, amount in words, and signature area. Print or save as PDF. No login required.';

  return (
    <>
      <style>{`
        @media print {
          #receipt-print-area { display: block !important; }
          @page { margin: 15mm; size: A4; }
        }
      `}</style>

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
          <meta name="twitter:image" content={siteMetadata.logo} />
          <script type="application/ld+json">
            {JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              '@id': `${absoluteUrl('/tools/receipt-generator')}#app`,
              url: absoluteUrl('/tools/receipt-generator'),
              name: 'Free Receipt Generator — Aslisite',
              description: pageDesc,
              applicationCategory: 'FinanceApplication',
              operatingSystem: 'Any',
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
              publisher: { '@id': `${siteMetadata.baseUrl}/#organization` },
            })}
          </script>
        </Helmet>

        {/* Breadcrumb */}
        <Stack direction="row" alignItems="center" gap={0.5} sx={{ mb: 4 }} className="no-print">
          <Box component={RouterLink} to="/tools" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: colors.text.muted, textDecoration: 'none', fontSize: '0.82rem', fontWeight: 500, '&:hover': { color: colors.accent.primary }, transition: 'color 0.2s' }}>
            <ArrowLeft size={14} />Free Tools
          </Box>
          <ChevronRight size={13} style={{ color: colors.text.muted }} />
          <Typography sx={{ fontSize: '0.82rem', color: colors.text.secondary, fontWeight: 500 }}>Receipt Generator</Typography>
        </Stack>

        {/* Header */}
        <Box component={motion.div} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} sx={{ mb: { xs: 5, md: 6 } }} className="no-print">
          <SectionBadge icon={Receipt} label="Amount in Words · Signature · Free" />
          <Typography variant="h1" sx={{ fontSize: { xs: '1.9rem', sm: '2.5rem', md: '2.8rem' }, fontWeight: 800, color: colors.text.primary, mt: 2, mb: 1.5, letterSpacing: '-0.03em' }}>
            Free Receipt Generator
          </Typography>
          <Typography variant="subtitle1" sx={{ color: colors.text.secondary, maxWidth: 560, lineHeight: 1.7 }}>
            Generate professional payment receipts with amount in words, payment method, reference
            number, and signature area. Print or save as PDF.
          </Typography>
        </Box>

        {/* Actions */}
        <Stack direction="row" gap={1.5} flexWrap="wrap" sx={{ mb: 4 }} className="no-print">
          <Button variant="contained" startIcon={<Printer size={15} />} onClick={() => window.print()}
            sx={{ borderRadius: 2, fontWeight: 700, background: colors.accent.primary, color: '#fff', px: 3, '&:hover': { background: colors.accent.primaryHover } }}>
            Print / Save PDF
          </Button>
          <Button variant="outlined" startIcon={<RotateCcw size={14} />} onClick={handleReset}
            sx={{ borderRadius: 2, fontWeight: 600, borderColor: colors.border.medium, color: colors.text.secondary, '&:hover': { borderColor: colors.accent.primary, color: colors.accent.primary } }}>
            Reset
          </Button>
        </Stack>

        <Grid container spacing={3} className="no-print">
          {/* Left — form */}
          <Grid item xs={12} lg={8}>
            {/* Business */}
            <Card sx={{ borderRadius: 3, border: `1px solid ${colors.border.light}`, boxShadow: 'none', mb: 3 }}>
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <SectionHeading>Your Business Details</SectionHeading>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}><Field label="Business Name *" name="name" value={biz.name} onChange={handleBiz} /></Grid>
                  <Grid item xs={12} sm={6}><Field label="GSTIN (optional)" name="gstin" value={biz.gstin} onChange={handleBiz} inputProps={{ maxLength: 15 }} /></Grid>
                  <Grid item xs={12}><Field label="Address" name="address" value={biz.address} onChange={handleBiz} multiline rows={2} /></Grid>
                  <Grid item xs={12} sm={6}><Field label="Phone" name="phone" value={biz.phone} onChange={handleBiz} /></Grid>
                  <Grid item xs={12} sm={6}><Field label="Email" name="email" value={biz.email} onChange={handleBiz} type="email" /></Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Received from */}
            <Card sx={{ borderRadius: 3, border: `1px solid ${colors.border.light}`, boxShadow: 'none', mb: 3 }}>
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <SectionHeading>Received From (Payer)</SectionHeading>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}><Field label="Payer Name *" name="name" value={payer.name} onChange={handlePayer} /></Grid>
                  <Grid item xs={12} sm={6}><Field label="GSTIN (optional)" name="gstin" value={payer.gstin} onChange={handlePayer} inputProps={{ maxLength: 15 }} /></Grid>
                  <Grid item xs={12}><Field label="Address" name="address" value={payer.address} onChange={handlePayer} multiline rows={2} /></Grid>
                  <Grid item xs={12} sm={6}><Field label="Phone" name="phone" value={payer.phone} onChange={handlePayer} /></Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Receipt details */}
            <Card sx={{ borderRadius: 3, border: `1px solid ${colors.border.light}`, boxShadow: 'none', mb: 3 }}>
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <SectionHeading>Receipt Details</SectionHeading>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}><Field label="Receipt No." name="number" value={receipt.number} onChange={handleReceipt} /></Grid>
                  <Grid item xs={12} sm={6} md={4}><Field label="Date" name="date" value={receipt.date} onChange={handleReceipt} type="date" InputLabelProps={{ shrink: true }} /></Grid>
                  <Grid item xs={12} sm={6} md={4}><Field label="Against Invoice No." name="invoiceNumber" value={receipt.invoiceNumber} onChange={handleReceipt} placeholder="Optional" /></Grid>

                  <Grid item xs={12} sm={6}>
                    <Field
                      label="Amount Received (₹) *"
                      name="amount"
                      value={receipt.amount}
                      onChange={handleReceipt}
                      inputProps={{ inputMode: 'decimal', 'aria-label': 'Amount received' }}
                      sx={{ '& .MuiOutlinedInput-root': { fontFamily: '"JetBrains Mono", monospace', fontWeight: 700, fontSize: '1.05rem' } }}
                    />
                    {amount > 0 && (
                      <Typography variant="caption" sx={{ color: colors.text.muted, mt: 0.5, display: 'block', fontStyle: 'italic' }}>
                        {amountWords}
                      </Typography>
                    )}
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel sx={{ fontSize: '0.82rem' }}>Receipt Type</InputLabel>
                      <Select value={receipt.receiptType} label="Receipt Type" name="receiptType" onChange={handleReceipt} sx={{ borderRadius: 1.5 }}>
                        <MenuItem value="full">Full Payment</MenuItem>
                        <MenuItem value="advance">Advance Payment</MenuItem>
                        <MenuItem value="partial">Part / Partial Payment</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel sx={{ fontSize: '0.82rem' }}>Payment Method *</InputLabel>
                      <Select value={receipt.paymentMethod} label="Payment Method *" name="paymentMethod" onChange={handleReceipt} sx={{ borderRadius: 1.5 }}>
                        {PAYMENT_METHODS.map((m) => <MenuItem key={m} value={m}>{m}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Field label="Reference / UTR / Cheque No." name="paymentRef" value={receipt.paymentRef} onChange={handleReceipt} placeholder="Optional" />
                  </Grid>

                  <Grid item xs={12}>
                    <Field label="Payment For / Description" name="description" value={receipt.description} onChange={handleReceipt} placeholder="e.g. Website development - Phase 1" />
                  </Grid>

                  <Grid item xs={12}>
                    <Field label="Notes (optional)" name="notes" value={receipt.notes} onChange={handleReceipt} multiline rows={2} />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Right — preview summary */}
          <Grid item xs={12} lg={4}>
            <Card
              component={motion.div}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              sx={{
                borderRadius: 3,
                border: `1.5px solid #86efac`,
                backgroundColor: '#f0fdf4',
                boxShadow: 'none',
                position: { lg: 'sticky' },
                top: { lg: 100 },
              }}
            >
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <Stack direction="row" alignItems="center" gap={1} mb={2}>
                  <CheckCircle size={18} style={{ color: '#16a34a' }} />
                  <Typography variant="overline" sx={{ color: '#16a34a', fontWeight: 700, fontSize: '0.68rem', letterSpacing: '0.1em' }}>
                    Receipt Preview
                  </Typography>
                </Stack>

                {/* Amount highlight */}
                <Box sx={{ mb: 2.5, p: 2, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.7)', border: '1px solid #86efac', textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ color: '#16a34a', fontWeight: 700, display: 'block', mb: 0.5 }}>
                    Amount Received
                  </Typography>
                  <Typography sx={{ fontWeight: 900, fontSize: '1.8rem', color: '#14532d', fontFamily: '"JetBrains Mono", monospace', lineHeight: 1.1 }}>
                    ₹ {fmt(amount)}
                  </Typography>
                  {amountWords && (
                    <Typography variant="caption" sx={{ color: '#16a34a', fontStyle: 'italic', display: 'block', mt: 0.75, lineHeight: 1.5 }}>
                      {amountWords}
                    </Typography>
                  )}
                </Box>

                {/* Summary rows */}
                <Stack spacing={0.75}>
                  {[
                    { label: 'From', value: payer.name || '—' },
                    { label: 'Method', value: receipt.paymentMethod },
                    { label: 'Type', value: receipt.receiptType === 'full' ? 'Full Payment' : receipt.receiptType === 'advance' ? 'Advance' : 'Part Payment' },
                    receipt.paymentRef && { label: 'Ref', value: receipt.paymentRef },
                    receipt.invoiceNumber && { label: 'Invoice', value: receipt.invoiceNumber },
                  ].filter(Boolean).map(({ label, value }) => (
                    <Stack key={label} direction="row" justifyContent="space-between" gap={1}>
                      <Typography variant="caption" sx={{ color: colors.text.muted, fontWeight: 600, flexShrink: 0 }}>{label}</Typography>
                      <Typography variant="caption" sx={{ color: colors.text.primary, fontWeight: 600, textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '65%' }}>{value}</Typography>
                    </Stack>
                  ))}
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Button fullWidth variant="contained" startIcon={<Printer size={15} />} onClick={() => window.print()}
                  sx={{ borderRadius: 2, fontWeight: 700, backgroundColor: '#16a34a', color: '#fff', '&:hover': { backgroundColor: '#15803d' }, mb: 2 }}>
                  Print / Save as PDF
                </Button>

                <Alert severity="info" icon={<Info size={14} />}
                  sx={{ borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.7)', border: '1px solid #bae6fd', '& .MuiAlert-icon': { color: '#0369a1' }, '& .MuiAlert-message': { fontSize: '0.75rem' } }}>
                  Use <strong>Ctrl+P</strong> → "Save as PDF" for a PDF copy. Data stays in your browser.
                </Alert>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Print document */}
        <PrintDocument biz={biz} payer={payer} receipt={receipt} />
      </Container>
    </>
  );
};

export default ReceiptGenerator;
