import { useState } from 'react';
import {
  Box, Container, Typography, TextField, Grid, Card, CardContent,
  Stack, Button, IconButton, Divider, MenuItem, Select,
  FormControl, InputLabel, Tooltip, Alert,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import {
  ClipboardList, Plus, Trash2, Printer, RotateCcw,
  ArrowLeft, ChevronRight, Info,
} from 'lucide-react';
import { colors } from '../../theme/theme';
import { absoluteUrl, siteMetadata } from '../../seo/siteMetadata';
import { SectionBadge } from '../../components/common';

/* ─── Helpers ─── */
const fmt = (n) => Number.isFinite(n) ? n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00';
const today = () => new Date().toISOString().split('T')[0];
const addDays = (d) => { const dt = new Date(); dt.setDate(dt.getDate() + d); return dt.toISOString().split('T')[0]; };

const newItem = () => ({ id: crypto.randomUUID(), description: '', qty: '', unit: 'Nos', rate: '', notes: '' });
const calcItem = (item) => { const q = parseFloat(item.qty) || 0; const r = parseFloat(item.rate) || 0; return q * r; };

const SectionHeading = ({ children }) => (
  <Typography variant="overline" sx={{ display: 'block', color: colors.accent.primary, fontWeight: 700, fontSize: '0.68rem', letterSpacing: '0.1em', mb: 2 }}>{children}</Typography>
);
const Field = ({ label, ...props }) => (
  <TextField label={label} size="small" fullWidth variant="outlined"
    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 }, '& .MuiInputLabel-root': { fontSize: '0.82rem' } }} {...props} />
);

/* ════════════════════
   PRINT DOCUMENT
════════════════════ */
const PrintDocument = ({ buyer, vendor, po, items }) => {
  const subTotal = items.reduce((s, it) => s + calcItem(it), 0);
  return (
    <Box id="po-print-area" sx={{ display: 'none', '@media print': { display: 'block' }, fontFamily: '"Inter", sans-serif', fontSize: '12px', color: '#18181b' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: '20px' }}>{buyer.name || 'Buyer Company'}</Typography>
          {buyer.gstin && <Typography sx={{ fontSize: '11px', color: '#52525b' }}>GSTIN: {buyer.gstin}</Typography>}
          {buyer.address && <Typography sx={{ fontSize: '11px', color: '#52525b', whiteSpace: 'pre-line' }}>{buyer.address}</Typography>}
          {buyer.phone && <Typography sx={{ fontSize: '11px', color: '#52525b' }}>Phone: {buyer.phone}</Typography>}
          {buyer.email && <Typography sx={{ fontSize: '11px', color: '#52525b' }}>Email: {buyer.email}</Typography>}
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography sx={{ fontWeight: 900, fontSize: '24px', color: '#0d9488', letterSpacing: '-0.03em' }}>PURCHASE ORDER</Typography>
          <Typography sx={{ fontSize: '11px', color: '#52525b' }}>PO No: <strong>{po.number || '—'}</strong></Typography>
          <Typography sx={{ fontSize: '11px', color: '#52525b' }}>Date: <strong>{po.date || '—'}</strong></Typography>
          {po.deliveryDate && <Typography sx={{ fontSize: '11px', color: '#52525b' }}>Delivery By: <strong>{po.deliveryDate}</strong></Typography>}
          {po.refNumber && <Typography sx={{ fontSize: '11px', color: '#52525b' }}>Ref: <strong>{po.refNumber}</strong></Typography>}
        </Box>
      </Box>

      <Divider sx={{ mb: 2.5, borderColor: '#e4e4e7' }} />

      {/* Vendor */}
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#0d9488', mb: 0.5 }}>Vendor / Supplier</Typography>
        <Typography sx={{ fontWeight: 700, fontSize: '13px' }}>{vendor.name || '—'}</Typography>
        {vendor.gstin && <Typography sx={{ fontSize: '11px', color: '#52525b' }}>GSTIN: {vendor.gstin}</Typography>}
        {vendor.address && <Typography sx={{ fontSize: '11px', color: '#52525b', whiteSpace: 'pre-line' }}>{vendor.address}</Typography>}
        {vendor.phone && <Typography sx={{ fontSize: '11px', color: '#52525b' }}>Phone: {vendor.phone}</Typography>}
        {vendor.email && <Typography sx={{ fontSize: '11px', color: '#52525b' }}>Email: {vendor.email}</Typography>}
      </Box>

      {/* Delivery info */}
      {(po.deliveryAddress || po.paymentTerms) && (
        <Box sx={{ mb: 3, p: '8px 12px', backgroundColor: '#f0fdfa', border: '1px solid #99f6e4', borderRadius: '6px', display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {po.deliveryAddress && (
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#0d9488', mb: 0.25 }}>Ship To</Typography>
              <Typography sx={{ fontSize: '11px', whiteSpace: 'pre-line' }}>{po.deliveryAddress}</Typography>
            </Box>
          )}
          {po.paymentTerms && (
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#0d9488', mb: 0.25 }}>Payment Terms</Typography>
              <Typography sx={{ fontSize: '11px' }}>{po.paymentTerms}</Typography>
            </Box>
          )}
        </Box>
      )}

      {/* Items */}
      <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', mb: 3 }}>
        <Box component="thead">
          <Box component="tr" sx={{ backgroundColor: '#f0fdfa' }}>
            {['#', 'Item / Description', 'Notes', 'Qty', 'Unit', 'Unit Price (₹)', 'Amount (₹)'].map((h) => (
              <Box key={h} component="th" sx={{ p: '6px 8px', textAlign: h === '#' ? 'center' : 'right', fontWeight: 700, fontSize: '10px', color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1.5px solid #99f6e4', '&:nth-of-type(2), &:nth-of-type(3)': { textAlign: 'left' } }}>{h}</Box>
            ))}
          </Box>
        </Box>
        <Box component="tbody">
          {items.map((item, i) => (
            <Box key={item.id} component="tr" sx={{ '&:nth-of-type(even)': { backgroundColor: '#fafafa' } }}>
              <Box component="td" sx={{ p: '6px 8px', textAlign: 'center', fontSize: '11px', borderBottom: '1px solid #f4f4f5' }}>{i + 1}</Box>
              <Box component="td" sx={{ p: '6px 8px', textAlign: 'left', fontWeight: 600, fontSize: '11px', borderBottom: '1px solid #f4f4f5' }}>{item.description || '—'}</Box>
              <Box component="td" sx={{ p: '6px 8px', textAlign: 'left', fontSize: '10px', color: '#52525b', borderBottom: '1px solid #f4f4f5' }}>{item.notes || ''}</Box>
              <Box component="td" sx={{ p: '6px 8px', textAlign: 'right', fontSize: '11px', borderBottom: '1px solid #f4f4f5' }}>{item.qty || '0'}</Box>
              <Box component="td" sx={{ p: '6px 8px', textAlign: 'right', fontSize: '11px', borderBottom: '1px solid #f4f4f5' }}>{item.unit}</Box>
              <Box component="td" sx={{ p: '6px 8px', textAlign: 'right', fontSize: '11px', borderBottom: '1px solid #f4f4f5' }}>{fmt(parseFloat(item.rate) || 0)}</Box>
              <Box component="td" sx={{ p: '6px 8px', textAlign: 'right', fontWeight: 700, fontSize: '11px', borderBottom: '1px solid #f4f4f5' }}>{fmt(calcItem(item))}</Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Total */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Box sx={{ minWidth: 200 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: '6px', borderTop: '1.5px solid #18181b', fontWeight: 800, fontSize: '14px' }}>
            <span>Total (Excl. GST)</span><span>₹ {fmt(subTotal)}</span>
          </Box>
          <Typography sx={{ fontSize: '10px', color: '#52525b', mt: '4px', fontStyle: 'italic' }}>*GST applicable as per actuals at delivery</Typography>
        </Box>
      </Box>

      {/* Terms */}
      {po.terms && (
        <Box sx={{ mb: 3, pt: 2, borderTop: '1px solid #e4e4e7' }}>
          <Typography sx={{ fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#52525b', mb: 0.5 }}>Terms & Conditions</Typography>
          <Typography sx={{ fontSize: '11px', color: '#52525b', whiteSpace: 'pre-line' }}>{po.terms}</Typography>
        </Box>
      )}

      {/* Signatures */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 5, pt: 2, borderTop: '1px solid #e4e4e7' }}>
        {[`Prepared By — ${buyer.name || 'Buyer'}`, `Accepted By — ${vendor.name || 'Vendor'}`].map((label) => (
          <Box key={label} sx={{ width: '45%', textAlign: 'center' }}>
            <Box sx={{ height: 48, borderBottom: '1px solid #18181b', mb: 0.5 }} />
            <Typography sx={{ fontSize: '10px', color: '#52525b' }}>{label}</Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid #e4e4e7', textAlign: 'center' }}>
        <Typography sx={{ fontSize: '10px', color: '#a1a1aa' }}>Generated via aslisite.com/tools/purchase-order-generator</Typography>
      </Box>
    </Box>
  );
};

/* ════════════════════
   MAIN
════════════════════ */
const PurchaseOrderGenerator = () => {
  const [buyer, setBuyer] = useState({ name: '', gstin: '', address: '', phone: '', email: '' });
  const [vendor, setVendor] = useState({ name: '', gstin: '', address: '', phone: '', email: '' });
  const [po, setPo] = useState({
    number: 'PO-001', date: today(), deliveryDate: addDays(14),
    refNumber: '', paymentTerms: 'Net 30', deliveryAddress: '', terms: 'All goods must match agreed specifications.\nGST will be charged as applicable on delivery.',
  });
  const [items, setItems] = useState([newItem()]);

  const subTotal = items.reduce((s, it) => s + calcItem(it), 0);

  const hb = (e) => setBuyer((p) => ({ ...p, [e.target.name]: e.target.value }));
  const hv = (e) => setVendor((p) => ({ ...p, [e.target.name]: e.target.value }));
  const hp = (e) => setPo((p) => ({ ...p, [e.target.name]: e.target.value }));
  const hi = (id, f, v) => setItems((p) => p.map((it) => it.id === id ? { ...it, [f]: v } : it));
  const addItem = () => setItems((p) => [...p, newItem()]);
  const removeItem = (id) => setItems((p) => p.length > 1 ? p.filter((it) => it.id !== id) : p);

  const handleReset = () => {
    setBuyer({ name: '', gstin: '', address: '', phone: '', email: '' });
    setVendor({ name: '', gstin: '', address: '', phone: '', email: '' });
    setPo({ number: 'PO-001', date: today(), deliveryDate: addDays(14), refNumber: '', paymentTerms: 'Net 30', deliveryAddress: '', terms: 'All goods must match agreed specifications.\nGST will be charged as applicable on delivery.' });
    setItems([newItem()]);
  };

  const pageTitle = 'Free Purchase Order Generator India | PO Maker Online | Aslisite';
  const pageDesc = 'Create professional purchase orders online for free. Add buyer and vendor details, line items, delivery date, payment terms, and download as PDF. No login required.';

  return (
    <>
      <style>{`@media print { #po-print-area { display: block !important; } @page { margin: 15mm; size: A4; } }`}</style>

      <Container maxWidth="lg" className="tool-page-container" sx={{ pt: { xs: 16, md: 16 }, pb: { xs: 8, md: 12 } }}>
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageDesc} />
          <link rel="canonical" href={absoluteUrl('/tools/purchase-order-generator')} />
          <meta property="og:url" content={absoluteUrl('/tools/purchase-order-generator')} />
          <meta property="og:type" content="website" />
          <meta property="og:title" content={pageTitle} />
          <meta property="og:description" content={pageDesc} />
          <meta property="og:image" content={siteMetadata.logo} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={pageTitle} />
          <meta name="twitter:description" content={pageDesc} />
          <script type="application/ld+json">{JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebApplication', '@id': `${absoluteUrl('/tools/purchase-order-generator')}#app`, url: absoluteUrl('/tools/purchase-order-generator'), name: 'Free Purchase Order Generator — Aslisite', description: pageDesc, applicationCategory: 'BusinessApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' }, publisher: { '@id': `${siteMetadata.baseUrl}/#organization` } })}</script>
        </Helmet>

        {/* Breadcrumb */}
        <Stack direction="row" alignItems="center" gap={0.5} sx={{ mb: 4 }} className="no-print">
          <Box component={RouterLink} to="/tools" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: colors.text.muted, textDecoration: 'none', fontSize: '0.82rem', fontWeight: 500, '&:hover': { color: colors.accent.primary }, transition: 'color 0.2s' }}>
            <ArrowLeft size={14} />Free Tools
          </Box>
          <ChevronRight size={13} style={{ color: colors.text.muted }} />
          <Typography sx={{ fontSize: '0.82rem', color: colors.text.secondary, fontWeight: 500 }}>Purchase Order Generator</Typography>
        </Stack>

        {/* Header */}
        <Box component={motion.div} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} sx={{ mb: { xs: 5, md: 6 } }} className="no-print">
          <SectionBadge icon={ClipboardList} label="Free Purchase Order Tool" />
          <Typography variant="h1" sx={{ fontSize: { xs: '1.9rem', sm: '2.5rem', md: '2.8rem' }, fontWeight: 800, color: colors.text.primary, mt: 2, mb: 1.5, letterSpacing: '-0.03em' }}>
            Purchase Order Generator
          </Typography>
          <Typography variant="subtitle1" sx={{ color: colors.text.secondary, maxWidth: 560, lineHeight: 1.7 }}>
            Create professional purchase orders with delivery dates, payment terms, and vendor details. Print or save as PDF.
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
            {/* Buyer */}
            <Card sx={{ borderRadius: 3, border: `1px solid ${colors.border.light}`, boxShadow: 'none', mb: 3 }}>
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <SectionHeading>Buyer (Your Company)</SectionHeading>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}><Field label="Company Name *" name="name" value={buyer.name} onChange={hb} /></Grid>
                  <Grid item xs={12} sm={6}><Field label="GSTIN" name="gstin" value={buyer.gstin} onChange={hb} inputProps={{ maxLength: 15 }} /></Grid>
                  <Grid item xs={12}><Field label="Address" name="address" value={buyer.address} onChange={hb} multiline rows={2} /></Grid>
                  <Grid item xs={12} sm={6}><Field label="Phone" name="phone" value={buyer.phone} onChange={hb} /></Grid>
                  <Grid item xs={12} sm={6}><Field label="Email" name="email" value={buyer.email} onChange={hb} type="email" /></Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Vendor */}
            <Card sx={{ borderRadius: 3, border: `1px solid ${colors.border.light}`, boxShadow: 'none', mb: 3 }}>
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <SectionHeading>Vendor / Supplier</SectionHeading>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}><Field label="Vendor Name *" name="name" value={vendor.name} onChange={hv} /></Grid>
                  <Grid item xs={12} sm={6}><Field label="Vendor GSTIN" name="gstin" value={vendor.gstin} onChange={hv} inputProps={{ maxLength: 15 }} /></Grid>
                  <Grid item xs={12}><Field label="Address" name="address" value={vendor.address} onChange={hv} multiline rows={2} /></Grid>
                  <Grid item xs={12} sm={6}><Field label="Phone" name="phone" value={vendor.phone} onChange={hv} /></Grid>
                  <Grid item xs={12} sm={6}><Field label="Email" name="email" value={vendor.email} onChange={hv} type="email" /></Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* PO Details */}
            <Card sx={{ borderRadius: 3, border: `1px solid ${colors.border.light}`, boxShadow: 'none', mb: 3 }}>
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <SectionHeading>PO Details</SectionHeading>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}><Field label="PO Number" name="number" value={po.number} onChange={hp} /></Grid>
                  <Grid item xs={6} sm={3}><Field label="PO Date" name="date" value={po.date} onChange={hp} type="date" InputLabelProps={{ shrink: true }} /></Grid>
                  <Grid item xs={6} sm={3}><Field label="Delivery By" name="deliveryDate" value={po.deliveryDate} onChange={hp} type="date" InputLabelProps={{ shrink: true }} /></Grid>
                  <Grid item xs={6} sm={3}><Field label="Reference No." name="refNumber" value={po.refNumber} onChange={hp} /></Grid>
                  <Grid item xs={12} sm={6}><Field label="Payment Terms" name="paymentTerms" value={po.paymentTerms} onChange={hp} /></Grid>
                  <Grid item xs={12} sm={6}><Field label="Ship To Address (if different)" name="deliveryAddress" value={po.deliveryAddress} onChange={hp} /></Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Items */}
            <Card sx={{ borderRadius: 3, border: `1px solid ${colors.border.light}`, boxShadow: 'none', mb: 3 }}>
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <SectionHeading>Items / Services</SectionHeading>
                <Box sx={{ display: { xs: 'none', md: 'grid' }, gridTemplateColumns: '2.2fr 1.5fr 0.7fr 0.7fr 0.85fr 36px', gap: 1, mb: 1 }}>
                  {['Description', 'Notes', 'Qty', 'Unit', 'Unit Price (₹)', ''].map((h) => (
                    <Typography key={h} variant="caption" sx={{ color: colors.text.muted, fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</Typography>
                  ))}
                </Box>
                <Stack spacing={1.5}>
                  {items.map((item, idx) => (
                    <Box key={item.id} sx={{ p: { xs: 2, md: 0 }, borderRadius: { xs: 2, md: 0 }, border: { xs: `1px solid ${colors.border.light}`, md: 'none' } }}>
                      <Typography sx={{ display: { xs: 'block', md: 'none' }, fontSize: '0.75rem', fontWeight: 700, color: colors.text.muted, mb: 1 }}>Item {idx + 1}</Typography>
                      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: '2.2fr 1.5fr 0.7fr 0.7fr 0.85fr 36px' }, gap: 1, alignItems: 'center' }}>
                        <Box sx={{ gridColumn: { xs: '1 / -1', md: 'auto' } }}>
                          <Field label="Item / Description *" value={item.description} onChange={(e) => hi(item.id, 'description', e.target.value)} />
                        </Box>
                        <Field label="Notes / Specs" value={item.notes} onChange={(e) => hi(item.id, 'notes', e.target.value)} />
                        <Field label="Qty" value={item.qty} onChange={(e) => hi(item.id, 'qty', e.target.value)} inputProps={{ inputMode: 'decimal' }} />
                        <Field label="Unit" value={item.unit} onChange={(e) => hi(item.id, 'unit', e.target.value)} />
                        <Field label="Unit Price" value={item.rate} onChange={(e) => hi(item.id, 'rate', e.target.value)} inputProps={{ inputMode: 'decimal' }} />
                        <Tooltip title="Remove">
                          <IconButton size="small" onClick={() => removeItem(item.id)} disabled={items.length === 1}
                            sx={{ color: colors.text.muted, '&:hover': { color: '#dc2626' }, '&.Mui-disabled': { opacity: 0.3 } }}>
                            <Trash2 size={15} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                      {(item.qty && item.rate) && (
                        <Box sx={{ mt: 0.5, textAlign: { xs: 'left', md: 'right' } }}>
                          <Typography variant="caption" sx={{ color: colors.text.muted, fontFamily: '"JetBrains Mono", monospace' }}>
                            Amount: <strong style={{ color: colors.text.primary }}>₹{fmt(calcItem(item))}</strong>
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
                <Field label="Terms & conditions" name="terms" value={po.terms} onChange={hp} multiline rows={3} />
              </CardContent>
            </Card>
          </Grid>

          {/* Summary */}
          <Grid item xs={12} lg={4}>
            <Card component={motion.div} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.1 }}
              sx={{ borderRadius: 3, border: `1.5px solid #99f6e4`, backgroundColor: '#f0fdfa', boxShadow: 'none', position: { lg: 'sticky' }, top: { lg: 100 } }}>
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <Typography variant="overline" sx={{ color: colors.accent.secondary, fontWeight: 700, fontSize: '0.68rem', letterSpacing: '0.1em', display: 'block', mb: 2 }}>PO Summary</Typography>
                <Stack spacing={0.5} sx={{ mb: 2 }}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: colors.text.secondary }}>Total Items</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{items.filter(it => it.description).length}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: colors.text.secondary }}>Total Qty</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: '"JetBrains Mono", monospace' }}>{items.reduce((s, it) => s + (parseFloat(it.qty) || 0), 0).toLocaleString('en-IN')}</Typography>
                  </Stack>
                  <Divider sx={{ my: 1 }} />
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: colors.text.primary }}>Total (Excl. GST)</Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: colors.accent.secondary, fontFamily: '"JetBrains Mono", monospace' }}>₹ {fmt(subTotal)}</Typography>
                  </Stack>
                </Stack>
                {items.map((item) => {
                  if (!item.qty || !item.rate) return null;
                  return (
                    <Stack key={item.id} direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                      <Typography variant="caption" sx={{ color: colors.text.secondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '60%' }}>{item.description || 'Item'}</Typography>
                      <Typography variant="caption" sx={{ color: colors.text.primary, fontWeight: 600, fontFamily: '"JetBrains Mono", monospace' }}>₹{fmt(calcItem(item))}</Typography>
                    </Stack>
                  );
                })}
                <Divider sx={{ my: 2 }} />
                <Button fullWidth variant="contained" startIcon={<Printer size={15} />} onClick={() => window.print()}
                  sx={{ borderRadius: 2, fontWeight: 700, background: colors.accent.secondary, color: '#fff', '&:hover': { background: '#0f766e' } }}>
                  Print / Save as PDF
                </Button>
                <Alert severity="info" icon={<Info size={14} />} sx={{ mt: 2, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.7)', border: '1px solid #bae6fd', '& .MuiAlert-icon': { color: '#0369a1' }, '& .MuiAlert-message': { fontSize: '0.75rem' } }}>
                  GST is not pre-filled on POs — it will be invoiced by the vendor at actual applicable rates.
                </Alert>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <PrintDocument buyer={buyer} vendor={vendor} po={po} items={items} />
      </Container>
    </>
  );
};

export default PurchaseOrderGenerator;
