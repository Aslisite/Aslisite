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
import { colors } from '../../theme/theme';
import { absoluteUrl, siteMetadata } from '../../seo/siteMetadata';
import { SectionBadge } from '../../components/common';

/* ─── GST 2.0 Slabs ─── */
const GST_RATES = [
  { value: 0,  label: '0%' },
  { value: 5,  label: '5%' },
  { value: 18, label: '18%' },
  { value: 40, label: '40%' },
];

/* ─── Helpers ─── */
const fmt = (n) =>
  Number.isFinite(n)
    ? n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '0.00';

const newItem = () => ({
  id: crypto.randomUUID(),
  description: '',
  qty: '',
  unit: 'Nos',
  rate: '',
  gstRate: 18,
  notes: '',
});

const calcItem = (item) => {
  const qty = parseFloat(item.qty) || 0;
  const rate = parseFloat(item.rate) || 0;
  const taxableAmount = qty * rate;
  const gstAmount = (taxableAmount * item.gstRate) / 100;
  return { taxableAmount, gstAmount, total: taxableAmount + gstAmount };
};

const calcTotals = (items) => {
  let subTotal = 0, totalGst = 0;
  items.forEach((it) => {
    const { taxableAmount, gstAmount } = calcItem(it);
    subTotal += taxableAmount;
    totalGst += gstAmount;
  });
  return { subTotal, totalGst, grandTotal: subTotal + totalGst };
};

const today = () => new Date().toISOString().split('T')[0];
const addDays = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

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

/* ═══════════════════════════════════════════
   PRINT DOCUMENT
═══════════════════════════════════════════ */
const PrintDocument = ({ biz, client, quote, items, totals }) => (
  <Box
    id="quote-print-area"
    sx={{ display: 'none', '@media print': { display: 'block' }, fontFamily: '"Inter", sans-serif', fontSize: '12px', color: '#18181b', p: 0 }}
  >
    {/* Header */}
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
      <Box>
        <Typography sx={{ fontWeight: 800, fontSize: '20px' }}>{biz.name || 'Your Business'}</Typography>
        {biz.gstin && <Typography sx={{ fontSize: '11px', color: '#52525b' }}>GSTIN: {biz.gstin}</Typography>}
        {biz.address && <Typography sx={{ fontSize: '11px', color: '#52525b', whiteSpace: 'pre-line' }}>{biz.address}</Typography>}
        {biz.phone && <Typography sx={{ fontSize: '11px', color: '#52525b' }}>Phone: {biz.phone}</Typography>}
        {biz.email && <Typography sx={{ fontSize: '11px', color: '#52525b' }}>Email: {biz.email}</Typography>}
      </Box>
      <Box sx={{ textAlign: 'right' }}>
        <Typography sx={{ fontWeight: 900, fontSize: '24px', color: '#0d9488', letterSpacing: '-0.03em' }}>QUOTATION</Typography>
        <Typography sx={{ fontSize: '11px', color: '#52525b' }}>No: <strong>{quote.number || '—'}</strong></Typography>
        <Typography sx={{ fontSize: '11px', color: '#52525b' }}>Date: <strong>{quote.date || '—'}</strong></Typography>
        {quote.validUntil && <Typography sx={{ fontSize: '11px', color: '#52525b' }}>Valid Until: <strong>{quote.validUntil}</strong></Typography>}
        {quote.refNumber && <Typography sx={{ fontSize: '11px', color: '#52525b' }}>Ref: <strong>{quote.refNumber}</strong></Typography>}
      </Box>
    </Box>

    <Divider sx={{ mb: 2.5, borderColor: '#e4e4e7' }} />

    <Box sx={{ mb: 3 }}>
      <Typography sx={{ fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#0d9488', mb: 0.5 }}>Prepared For</Typography>
      <Typography sx={{ fontWeight: 700, fontSize: '13px' }}>{client.name || '—'}</Typography>
      {client.gstin && <Typography sx={{ fontSize: '11px', color: '#52525b' }}>GSTIN: {client.gstin}</Typography>}
      {client.address && <Typography sx={{ fontSize: '11px', color: '#52525b', whiteSpace: 'pre-line' }}>{client.address}</Typography>}
      {client.phone && <Typography sx={{ fontSize: '11px', color: '#52525b' }}>Phone: {client.phone}</Typography>}
      {client.email && <Typography sx={{ fontSize: '11px', color: '#52525b' }}>Email: {client.email}</Typography>}
    </Box>

    {/* Subject */}
    {quote.subject && (
      <Box sx={{ mb: 3, p: '8px 12px', backgroundColor: '#f0fdfa', border: '1px solid #99f6e4', borderRadius: '6px' }}>
        <Typography sx={{ fontWeight: 700, fontSize: '11px', color: '#0d9488' }}>Subject: {quote.subject}</Typography>
      </Box>
    )}

    {/* Items */}
    <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', mb: 3 }}>
      <Box component="thead">
        <Box component="tr" sx={{ backgroundColor: '#f0fdfa' }}>
          {['#', 'Description / Notes', 'Qty', 'Unit', 'Rate (₹)', 'GST %', 'GST (₹)', 'Total (₹)'].map((h) => (
            <Box key={h} component="th" sx={{ p: '6px 8px', textAlign: h === '#' ? 'center' : 'right', fontWeight: 700, fontSize: '10px', color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1.5px solid #99f6e4', '&:nth-of-type(2)': { textAlign: 'left' } }}>
              {h}
            </Box>
          ))}
        </Box>
      </Box>
      <Box component="tbody">
        {items.map((item, i) => {
          const { taxableAmount, gstAmount, total } = calcItem(item);
          return (
            <Box key={item.id} component="tr" sx={{ '&:nth-of-type(even)': { backgroundColor: '#fafafa' } }}>
              <Box component="td" sx={{ p: '6px 8px', textAlign: 'center', fontSize: '11px', borderBottom: '1px solid #f4f4f5' }}>{i + 1}</Box>
              <Box component="td" sx={{ p: '6px 8px', textAlign: 'left', fontSize: '11px', borderBottom: '1px solid #f4f4f5' }}>
                <strong>{item.description || '—'}</strong>
                {item.notes && <Box sx={{ fontSize: '10px', color: '#52525b', mt: '2px' }}>{item.notes}</Box>}
              </Box>
              <Box component="td" sx={{ p: '6px 8px', textAlign: 'right', fontSize: '11px', borderBottom: '1px solid #f4f4f5' }}>{item.qty || '0'}</Box>
              <Box component="td" sx={{ p: '6px 8px', textAlign: 'right', fontSize: '11px', borderBottom: '1px solid #f4f4f5' }}>{item.unit}</Box>
              <Box component="td" sx={{ p: '6px 8px', textAlign: 'right', fontSize: '11px', borderBottom: '1px solid #f4f4f5' }}>{fmt(parseFloat(item.rate) || 0)}</Box>
              <Box component="td" sx={{ p: '6px 8px', textAlign: 'right', fontSize: '11px', borderBottom: '1px solid #f4f4f5' }}>{item.gstRate}%</Box>
              <Box component="td" sx={{ p: '6px 8px', textAlign: 'right', fontSize: '11px', borderBottom: '1px solid #f4f4f5' }}>{fmt(gstAmount)}</Box>
              <Box component="td" sx={{ p: '6px 8px', textAlign: 'right', fontWeight: 700, fontSize: '11px', borderBottom: '1px solid #f4f4f5' }}>{fmt(total)}</Box>
            </Box>
          );
        })}
      </Box>
    </Box>

    {/* Totals */}
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
      <Box sx={{ minWidth: 220 }}>
        {[
          { label: 'Sub Total', value: fmt(totals.subTotal) },
          { label: 'Total GST', value: fmt(totals.totalGst) },
        ].map(({ label, value }) => (
          <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', py: '3px', fontSize: '11px' }}>
            <span style={{ color: '#52525b' }}>{label}</span>
            <span>₹ {value}</span>
          </Box>
        ))}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', py: '6px', borderTop: '1.5px solid #18181b', mt: '4px', fontWeight: 800, fontSize: '13px' }}>
          <span>Total Amount</span><span>₹ {fmt(totals.grandTotal)}</span>
        </Box>
      </Box>
    </Box>

    {/* Terms */}
    {quote.terms && (
      <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e4e4e7' }}>
        <Typography sx={{ fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#52525b', mb: 0.5 }}>Terms & Conditions</Typography>
        <Typography sx={{ fontSize: '11px', color: '#52525b', whiteSpace: 'pre-line' }}>{quote.terms}</Typography>
      </Box>
    )}

    {/* Validity reminder */}
    {quote.validUntil && (
      <Box sx={{ mt: 2, p: '8px 12px', backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: '6px' }}>
        <Typography sx={{ fontSize: '11px', color: '#92400e', fontWeight: 600 }}>
          This quotation is valid until {quote.validUntil}. Please confirm your acceptance before the expiry date.
        </Typography>
      </Box>
    )}

    <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid #e4e4e7', textAlign: 'center' }}>
      <Typography sx={{ fontSize: '10px', color: '#a1a1aa' }}>Generated via aslisite.com/tools/quotation-generator</Typography>
    </Box>
  </Box>
);

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
const QuotationGenerator = () => {
  const [biz, setBiz] = useState({ name: '', gstin: '', address: '', phone: '', email: '' });
  const [client, setClient] = useState({ name: '', gstin: '', address: '', phone: '', email: '' });
  const [quote, setQuote] = useState({
    number: 'QUO-001',
    date: today(),
    validUntil: addDays(30),
    refNumber: '',
    subject: '',
    terms: 'Prices are subject to change without prior notice.\nThis quotation is valid for the period mentioned above.',
  });
  const [items, setItems] = useState([newItem()]);

  const totals = calcTotals(items);

  const handleBiz = (e) => setBiz((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleClient = (e) => setClient((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleQuote = (e) => setQuote((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleItem = (id, field, value) => setItems((prev) => prev.map((it) => it.id === id ? { ...it, [field]: value } : it));
  const addItem = () => setItems((p) => [...p, newItem()]);
  const removeItem = (id) => setItems((p) => p.length > 1 ? p.filter((it) => it.id !== id) : p);

  const handleReset = () => {
    setBiz({ name: '', gstin: '', address: '', phone: '', email: '' });
    setClient({ name: '', gstin: '', address: '', phone: '', email: '' });
    setQuote({ number: 'QUO-001', date: today(), validUntil: addDays(30), refNumber: '', subject: '', terms: 'Prices are subject to change without prior notice.\nThis quotation is valid for the period mentioned above.' });
    setItems([newItem()]);
  };

  const pageTitle = 'Free Quotation Generator India | Business Quote Maker Online | Aslisite';
  const pageDesc =
    'Create professional business quotations online for free. Add GST (GST 2.0 rates), validity dates, terms & conditions, and download as PDF. No login required.';

  return (
    <>
      <style>{`
        @media print {
          #quote-print-area { display: block !important; }
          @page { margin: 15mm; size: A4; }
        }
      `}</style>

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
          <meta name="twitter:image" content={siteMetadata.logo} />
          <script type="application/ld+json">
            {JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              '@id': `${absoluteUrl('/tools/quotation-generator')}#app`,
              url: absoluteUrl('/tools/quotation-generator'),
              name: 'Free Quotation Generator — Aslisite',
              description: pageDesc,
              applicationCategory: 'BusinessApplication',
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
          <Typography sx={{ fontSize: '0.82rem', color: colors.text.secondary, fontWeight: 500 }}>Quotation Generator</Typography>
        </Stack>

        {/* Header */}
        <Box component={motion.div} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} sx={{ mb: { xs: 5, md: 6 } }} className="no-print">
          <SectionBadge icon={CalendarClock} label="Free Business Quotation Tool" />
          <Typography variant="h1" sx={{ fontSize: { xs: '1.9rem', sm: '2.5rem', md: '2.8rem' }, fontWeight: 800, color: colors.text.primary, mt: 2, mb: 1.5, letterSpacing: '-0.03em' }}>
            Free Quotation Generator
          </Typography>
          <Typography variant="subtitle1" sx={{ color: colors.text.secondary, maxWidth: 560, lineHeight: 1.7 }}>
            Generate professional business quotations with validity dates, GST breakdowns, and custom terms. Print or save as PDF.
          </Typography>
        </Box>

        {/* Actions */}
        <Stack direction="row" gap={1.5} flexWrap="wrap" sx={{ mb: 4 }} className="no-print">
          <Button variant="contained" startIcon={<Printer size={15} />} onClick={() => window.print()}
            sx={{ borderRadius: 2, fontWeight: 700, background: colors.accent.secondary, color: '#fff', px: 3, '&:hover': { background: '#0f766e' } }}>
            Print / Save PDF
          </Button>
          <Button variant="outlined" startIcon={<RotateCcw size={14} />} onClick={handleReset}
            sx={{ borderRadius: 2, fontWeight: 600, borderColor: colors.border.medium, color: colors.text.secondary, '&:hover': { borderColor: colors.accent.primary, color: colors.accent.primary } }}>
            Reset
          </Button>
        </Stack>

        <Grid container spacing={3} className="no-print">
          <Grid item xs={12} lg={8}>
            {/* Business */}
            <Card sx={{ borderRadius: 3, border: `1px solid ${colors.border.light}`, boxShadow: 'none', mb: 3 }}>
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <SectionHeading>Your Business Details</SectionHeading>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}><Field label="Business Name *" name="name" value={biz.name} onChange={handleBiz} /></Grid>
                  <Grid item xs={12} sm={6}><Field label="GSTIN" name="gstin" value={biz.gstin} onChange={handleBiz} inputProps={{ maxLength: 15 }} /></Grid>
                  <Grid item xs={12}><Field label="Address" name="address" value={biz.address} onChange={handleBiz} multiline rows={2} /></Grid>
                  <Grid item xs={12} sm={6}><Field label="Phone" name="phone" value={biz.phone} onChange={handleBiz} /></Grid>
                  <Grid item xs={12} sm={6}><Field label="Email" name="email" value={biz.email} onChange={handleBiz} type="email" /></Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Client */}
            <Card sx={{ borderRadius: 3, border: `1px solid ${colors.border.light}`, boxShadow: 'none', mb: 3 }}>
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <SectionHeading>Prepared For (Client)</SectionHeading>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}><Field label="Client / Company Name *" name="name" value={client.name} onChange={handleClient} /></Grid>
                  <Grid item xs={12} sm={6}><Field label="Client GSTIN" name="gstin" value={client.gstin} onChange={handleClient} inputProps={{ maxLength: 15 }} /></Grid>
                  <Grid item xs={12}><Field label="Address" name="address" value={client.address} onChange={handleClient} multiline rows={2} /></Grid>
                  <Grid item xs={12} sm={6}><Field label="Phone" name="phone" value={client.phone} onChange={handleClient} /></Grid>
                  <Grid item xs={12} sm={6}><Field label="Email" name="email" value={client.email} onChange={handleClient} type="email" /></Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Quote Details */}
            <Card sx={{ borderRadius: 3, border: `1px solid ${colors.border.light}`, boxShadow: 'none', mb: 3 }}>
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <SectionHeading>Quotation Details</SectionHeading>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}><Field label="Quote No." name="number" value={quote.number} onChange={handleQuote} /></Grid>
                  <Grid item xs={12} sm={6} md={3}><Field label="Date" name="date" value={quote.date} onChange={handleQuote} type="date" InputLabelProps={{ shrink: true }} /></Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Field label="Valid Until" name="validUntil" value={quote.validUntil} onChange={handleQuote} type="date" InputLabelProps={{ shrink: true }} />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}><Field label="Reference No." name="refNumber" value={quote.refNumber} onChange={handleQuote} /></Grid>
                  <Grid item xs={12}><Field label="Subject / Project Title" name="subject" value={quote.subject} onChange={handleQuote} /></Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Items */}
            <Card sx={{ borderRadius: 3, border: `1px solid ${colors.border.light}`, boxShadow: 'none', mb: 3 }}>
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <SectionHeading>Items / Services</SectionHeading>

                <Box sx={{ display: { xs: 'none', md: 'grid' }, gridTemplateColumns: '2fr 0.7fr 0.7fr 0.7fr 0.9fr 36px', gap: 1, mb: 1 }}>
                  {['Description', 'Qty', 'Unit', 'Rate (₹)', 'GST %', ''].map((h) => (
                    <Typography key={h} variant="caption" sx={{ color: colors.text.muted, fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</Typography>
                  ))}
                </Box>

                <Stack spacing={2}>
                  {items.map((item, idx) => (
                    <Box key={item.id} sx={{ p: { xs: 2, md: 0 }, borderRadius: { xs: 2, md: 0 }, border: { xs: `1px solid ${colors.border.light}`, md: 'none' } }}>
                      <Typography sx={{ display: { xs: 'block', md: 'none' }, fontSize: '0.75rem', fontWeight: 700, color: colors.text.muted, mb: 1 }}>
                        Item {idx + 1}
                      </Typography>
                      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: '2fr 0.7fr 0.7fr 0.7fr 0.9fr 36px' }, gap: 1, alignItems: 'center' }}>
                        <Box sx={{ gridColumn: { xs: '1 / -1', md: 'auto' } }}>
                          <Field label="Description *" value={item.description} onChange={(e) => handleItem(item.id, 'description', e.target.value)} />
                        </Box>
                        <Field label="Qty" value={item.qty} onChange={(e) => handleItem(item.id, 'qty', e.target.value)} inputProps={{ inputMode: 'decimal' }} />
                        <Field label="Unit" value={item.unit} onChange={(e) => handleItem(item.id, 'unit', e.target.value)} />
                        <Field label="Rate (₹)" value={item.rate} onChange={(e) => handleItem(item.id, 'rate', e.target.value)} inputProps={{ inputMode: 'decimal' }} />
                        <FormControl size="small" fullWidth>
                          <InputLabel sx={{ fontSize: '0.82rem' }}>GST %</InputLabel>
                          <Select value={item.gstRate} label="GST %" onChange={(e) => handleItem(item.id, 'gstRate', e.target.value)} sx={{ borderRadius: 1.5 }}>
                            {GST_RATES.map((r) => <MenuItem key={r.value} value={r.value}>{r.value}%</MenuItem>)}
                          </Select>
                        </FormControl>
                        <Tooltip title="Remove">
                          <IconButton size="small" onClick={() => removeItem(item.id)} disabled={items.length === 1}
                            sx={{ color: colors.text.muted, '&:hover': { color: '#dc2626' }, '&.Mui-disabled': { opacity: 0.3 } }}>
                            <Trash2 size={15} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                      {/* Per-item notes */}
                      <Box sx={{ mt: 1 }}>
                        <Field label="Item notes (optional)" value={item.notes} onChange={(e) => handleItem(item.id, 'notes', e.target.value)} size="small" />
                      </Box>
                      {(item.qty && item.rate) && (
                        <Box sx={{ mt: 0.5, textAlign: { xs: 'left', md: 'right' } }}>
                          <Typography variant="caption" sx={{ color: colors.text.muted, fontFamily: '"JetBrains Mono", monospace' }}>
                            ₹{fmt(calcItem(item).taxableAmount)} + ₹{fmt(calcItem(item).gstAmount)} GST = <strong style={{ color: colors.text.primary }}>₹{fmt(calcItem(item).total)}</strong>
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  ))}
                </Stack>

                <Button startIcon={<Plus size={15} />} onClick={addItem}
                  sx={{ mt: 2, borderRadius: 2, fontWeight: 600, fontSize: '0.82rem', color: colors.accent.primary, textTransform: 'none', '&:hover': { backgroundColor: 'rgba(109,40,217,0.06)' } }}>
                  Add Item
                </Button>
              </CardContent>
            </Card>

            {/* Terms */}
            <Card sx={{ borderRadius: 3, border: `1px solid ${colors.border.light}`, boxShadow: 'none' }}>
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <SectionHeading>Terms & Conditions</SectionHeading>
                <Field label="Terms & conditions" name="terms" value={quote.terms} onChange={handleQuote} multiline rows={4} />
              </CardContent>
            </Card>
          </Grid>

          {/* Right — summary */}
          <Grid item xs={12} lg={4}>
            <Card
              component={motion.div}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              sx={{ borderRadius: 3, border: `1.5px solid #99f6e4`, backgroundColor: '#f0fdfa', boxShadow: 'none', position: { lg: 'sticky' }, top: { lg: 100 } }}
            >
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <Typography variant="overline" sx={{ color: colors.accent.secondary, fontWeight: 700, fontSize: '0.68rem', letterSpacing: '0.1em', display: 'block', mb: 2 }}>
                  Quote Summary
                </Typography>

                {/* Validity */}
                {quote.validUntil && (
                  <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 2, p: 1.5, borderRadius: 2, backgroundColor: '#fffbeb', border: '1px solid #fde68a' }}>
                    <CalendarClock size={14} style={{ color: '#92400e', flexShrink: 0 }} />
                    <Typography variant="caption" sx={{ color: '#92400e', fontWeight: 600 }}>
                      Valid until {quote.validUntil}
                    </Typography>
                  </Stack>
                )}

                <Stack spacing={0.5}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: colors.text.secondary }}>Sub Total</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: '"JetBrains Mono", monospace' }}>₹ {fmt(totals.subTotal)}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: colors.text.secondary }}>Total GST</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: '"JetBrains Mono", monospace' }}>₹ {fmt(totals.totalGst)}</Typography>
                  </Stack>
                  <Divider sx={{ my: 1 }} />
                  <Stack direction="row" justifyContent="space-between" sx={{ py: 0.5 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: colors.text.primary }}>Total Amount</Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: colors.accent.secondary, fontFamily: '"JetBrains Mono", monospace' }}>₹ {fmt(totals.grandTotal)}</Typography>
                  </Stack>
                </Stack>

                <Divider sx={{ my: 2 }} />

                {items.map((item) => {
                  if (!item.qty || !item.rate) return null;
                  const { gstAmount } = calcItem(item);
                  return (
                    <Stack key={item.id} direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                      <Typography variant="caption" sx={{ color: colors.text.secondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '55%' }}>
                        {item.description || 'Item'} ({item.gstRate}%)
                      </Typography>
                      <Typography variant="caption" sx={{ color: colors.text.primary, fontWeight: 600, fontFamily: '"JetBrains Mono", monospace' }}>
                        ₹{fmt(gstAmount)}
                      </Typography>
                    </Stack>
                  );
                })}

                <Divider sx={{ my: 2 }} />

                <Button fullWidth variant="contained" startIcon={<Printer size={15} />} onClick={() => window.print()}
                  sx={{ borderRadius: 2, fontWeight: 700, background: colors.accent.secondary, color: '#fff', '&:hover': { background: '#0f766e' } }}>
                  Print / Save as PDF
                </Button>

                <Alert severity="info" icon={<Info size={14} />}
                  sx={{ mt: 2, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.7)', border: '1px solid #bae6fd', '& .MuiAlert-icon': { color: '#0369a1' }, '& .MuiAlert-message': { fontSize: '0.75rem' } }}>
                  Use <strong>Ctrl+P</strong> → "Save as PDF" for a PDF copy.
                </Alert>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <PrintDocument biz={biz} client={client} quote={quote} items={items} totals={totals} />
      </Container>
    </>
  );
};

export default QuotationGenerator;
