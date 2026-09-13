import { useState } from 'react';
import {
  Box, Container, Typography, TextField, Grid, Card, CardContent,
  Stack, Button, IconButton, Divider, MenuItem, Select,
  FormControl, InputLabel, Tooltip, Alert,
  ToggleButton, ToggleButtonGroup,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import {
  ClipboardList, Plus, Trash2, Printer, RotateCcw,
  ArrowLeft, ChevronRight, Info, Globe, MapPin,
} from 'lucide-react';
import { colors } from '../../theme/theme';
import { absoluteUrl, siteMetadata } from '../../seo/siteMetadata';
import { SectionBadge } from '../../components/common';
import {
  CURRENCIES, TAX_MODES, DEFAULT_GLOBAL_TAX,
  fmtCurrency, calcGlobalTax, taxLineLabel,
} from './regionConfig';

/* ─── Helpers ─── */
const fmt     = (n) => Number.isFinite(n) ? n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00';
const today   = () => new Date().toISOString().split('T')[0];
const addDays = (d) => { const dt = new Date(); dt.setDate(dt.getDate() + d); return dt.toISOString().split('T')[0]; };

const newItem   = ()  => ({ id: crypto.randomUUID(), description: '', qty: '', unit: 'Nos', rate: '', notes: '' });
const calcItem  = (it) => (parseFloat(it.qty) || 0) * (parseFloat(it.rate) || 0);

const SH = ({ children }) => (
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

/* ─── Region Selector ─── */
const RegionSelector = ({ region, onChange }) => (
  <Card sx={{ borderRadius: 3, border: `1.5px solid ${region === 'global' ? colors.accent.secondary : colors.border.accent}`, boxShadow: 'none', mb: 3 }}>
    <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} justifyContent="space-between" gap={2}>
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: colors.text.primary, mb: 0.25 }}>Document Region</Typography>
          <Typography variant="caption" sx={{ color: colors.text.muted }}>
            {region === 'india'
              ? 'India mode — GSTIN for buyer & vendor, ₹, GST note on document'
              : 'Global mode — Tax ID / VAT No., multi-currency, optional tax estimate'}
          </Typography>
        </Box>
        <ToggleButtonGroup value={region} exclusive onChange={(_, v) => v && onChange(v)} size="small"
          sx={{ flexShrink: 0, '& .MuiToggleButton-root': { px: 2, py: 0.9, fontWeight: 600, fontSize: '0.8rem', textTransform: 'none', border: `1px solid ${colors.border.medium} !important`, gap: 0.6, '&.Mui-selected': { backgroundColor: colors.accent.primary, color: '#fff', borderColor: `${colors.accent.primary} !important` } } }}>
          <ToggleButton value="india"><MapPin size={13} />🇮🇳 India</ToggleButton>
          <ToggleButton value="global"><Globe size={13} />🌐 Global</ToggleButton>
        </ToggleButtonGroup>
      </Stack>
    </CardContent>
  </Card>
);

/* ══════════════════════════════════════════
   PRINT DOCUMENT — India (unchanged)
══════════════════════════════════════════ */
const IndiaPrint = ({ buyer, vendor, po, items }) => {
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
      {/* Delivery / payment info */}
      {(po.deliveryAddress || po.paymentTerms) && (
        <Box sx={{ mb: 3, p: '8px 12px', backgroundColor: '#f0fdfa', border: '1px solid #99f6e4', borderRadius: '6px', display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {po.deliveryAddress && <Box><Typography sx={{ fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#0d9488', mb: 0.25 }}>Ship To</Typography><Typography sx={{ fontSize: '11px', whiteSpace: 'pre-line' }}>{po.deliveryAddress}</Typography></Box>}
          {po.paymentTerms && <Box><Typography sx={{ fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#0d9488', mb: 0.25 }}>Payment Terms</Typography><Typography sx={{ fontSize: '11px' }}>{po.paymentTerms}</Typography></Box>}
        </Box>
      )}
      {/* Items */}
      <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', mb: 3 }}>
        <Box component="thead"><Box component="tr" sx={{ backgroundColor: '#f0fdfa' }}>
          {['#', 'Item / Description', 'Notes', 'Qty', 'Unit', 'Unit Price (₹)', 'Amount (₹)'].map((h) => (
            <Box key={h} component="th" sx={{ p: '6px 8px', textAlign: h === '#' ? 'center' : 'right', fontWeight: 700, fontSize: '10px', color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1.5px solid #99f6e4', '&:nth-of-type(2), &:nth-of-type(3)': { textAlign: 'left' } }}>{h}</Box>
          ))}
        </Box></Box>
        <Box component="tbody">
          {items.map((item, i) => (
            <Box key={item.id} component="tr" sx={{ '&:nth-of-type(even)': { backgroundColor: '#fafafa' } }}>
              <Box component="td" sx={{ p: '6px 8px', textAlign: 'center', fontSize: '11px', borderBottom: '1px solid #f4f4f5' }}>{i + 1}</Box>
              <Box component="td" sx={{ p: '6px 8px', textAlign: 'left', fontWeight: 600, fontSize: '11px', borderBottom: '1px solid #f4f4f5' }}>{item.description || '—'}</Box>
              <Box component="td" sx={{ p: '6px 8px', textAlign: 'left', fontSize: '10px', color: '#52525b', borderBottom: '1px solid #f4f4f5' }}>{item.notes || ''}</Box>
              <Box component="td" sx={{ p: '6px 8px', textAlign: 'right', fontSize: '11px', borderBottom: '1px solid #f4f4f5' }}>{item.qty || '0'}</Box>
              <Box component="td" sx={{ p: '6px 8px', textAlign: 'right', fontSize: '11px', borderBottom: '1px solid #f4f4f5' }}>{item.unit}</Box>
              <Box component="td" sx={{ p: '6px 8px', textAlign: 'right', fontSize: '11px', borderBottom: '1px solid #f4f4f5' }}>₹{fmt(parseFloat(item.rate) || 0)}</Box>
              <Box component="td" sx={{ p: '6px 8px', textAlign: 'right', fontWeight: 700, fontSize: '11px', borderBottom: '1px solid #f4f4f5' }}>₹{fmt(calcItem(item))}</Box>
            </Box>
          ))}
        </Box>
      </Box>
      {/* Total */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Box sx={{ minWidth: 220 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: '6px', borderTop: '1.5px solid #18181b', fontWeight: 800, fontSize: '14px' }}>
            <span>Total (Excl. GST)</span><span>₹ {fmt(subTotal)}</span>
          </Box>
          <Typography sx={{ fontSize: '10px', color: '#52525b', mt: '4px', fontStyle: 'italic' }}>*GST applicable as per actuals at delivery</Typography>
        </Box>
      </Box>
      {po.terms && <Box sx={{ mb: 3, pt: 2, borderTop: '1px solid #e4e4e7' }}><Typography sx={{ fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#52525b', mb: 0.5 }}>Terms & Conditions</Typography><Typography sx={{ fontSize: '11px', color: '#52525b', whiteSpace: 'pre-line' }}>{po.terms}</Typography></Box>}
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

/* ══════════════════════════════════════════
   PRINT DOCUMENT — Global
══════════════════════════════════════════ */
const GlobalPrint = ({ buyer, vendor, po, items, currencyCode, customSymbol, taxConfig }) => {
  const cp       = (n) => fmtCurrency(n, currencyCode, customSymbol, false);
  const subTotal = items.reduce((s, it) => s + calcItem(it), 0);
  const taxAmt   = calcGlobalTax(subTotal, taxConfig);
  const grandTotal = subTotal + taxAmt;
  const taxLabel = taxLineLabel(taxConfig);

  return (
    <Box id="po-print-area" sx={{ display: 'none', '@media print': { display: 'block' }, fontFamily: '"Inter", sans-serif', fontSize: '12px', color: '#18181b' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: '20px' }}>{buyer.name || 'Buyer Company'}</Typography>
          {buyer.taxId && <Typography sx={{ fontSize: '11px', color: '#52525b' }}>Tax ID: {buyer.taxId}</Typography>}
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
          <Typography sx={{ fontSize: '11px', color: '#52525b' }}>Currency: <strong>{currencyCode === 'OTHER' ? (customSymbol || 'Custom') : currencyCode}</strong></Typography>
        </Box>
      </Box>
      <Divider sx={{ mb: 2.5, borderColor: '#e4e4e7' }} />
      {/* Vendor */}
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#0d9488', mb: 0.5 }}>Vendor / Supplier</Typography>
        <Typography sx={{ fontWeight: 700, fontSize: '13px' }}>{vendor.name || '—'}</Typography>
        {vendor.taxId && <Typography sx={{ fontSize: '11px', color: '#52525b' }}>Tax ID: {vendor.taxId}</Typography>}
        {vendor.address && <Typography sx={{ fontSize: '11px', color: '#52525b', whiteSpace: 'pre-line' }}>{vendor.address}</Typography>}
        {vendor.phone && <Typography sx={{ fontSize: '11px', color: '#52525b' }}>Phone: {vendor.phone}</Typography>}
        {vendor.email && <Typography sx={{ fontSize: '11px', color: '#52525b' }}>Email: {vendor.email}</Typography>}
      </Box>
      {(po.deliveryAddress || po.paymentTerms) && (
        <Box sx={{ mb: 3, p: '8px 12px', backgroundColor: '#f0fdfa', border: '1px solid #99f6e4', borderRadius: '6px', display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {po.deliveryAddress && <Box><Typography sx={{ fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#0d9488', mb: 0.25 }}>Ship To</Typography><Typography sx={{ fontSize: '11px', whiteSpace: 'pre-line' }}>{po.deliveryAddress}</Typography></Box>}
          {po.paymentTerms && <Box><Typography sx={{ fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#0d9488', mb: 0.25 }}>Payment Terms</Typography><Typography sx={{ fontSize: '11px' }}>{po.paymentTerms}</Typography></Box>}
        </Box>
      )}
      {/* Items */}
      <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', mb: 3 }}>
        <Box component="thead"><Box component="tr" sx={{ backgroundColor: '#f0fdfa' }}>
          {['#', 'Item / Description', 'Notes', 'Qty', 'Unit', 'Unit Price', 'Amount'].map((h) => (
            <Box key={h} component="th" sx={{ p: '6px 8px', textAlign: h === '#' ? 'center' : 'right', fontWeight: 700, fontSize: '10px', color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1.5px solid #99f6e4', '&:nth-of-type(2), &:nth-of-type(3)': { textAlign: 'left' } }}>{h}</Box>
          ))}
        </Box></Box>
        <Box component="tbody">
          {items.map((item, i) => (
            <Box key={item.id} component="tr" sx={{ '&:nth-of-type(even)': { backgroundColor: '#fafafa' } }}>
              <Box component="td" sx={{ p: '6px 8px', textAlign: 'center', fontSize: '11px', borderBottom: '1px solid #f4f4f5' }}>{i + 1}</Box>
              <Box component="td" sx={{ p: '6px 8px', textAlign: 'left', fontWeight: 600, fontSize: '11px', borderBottom: '1px solid #f4f4f5' }}>{item.description || '—'}</Box>
              <Box component="td" sx={{ p: '6px 8px', textAlign: 'left', fontSize: '10px', color: '#52525b', borderBottom: '1px solid #f4f4f5' }}>{item.notes || ''}</Box>
              <Box component="td" sx={{ p: '6px 8px', textAlign: 'right', fontSize: '11px', borderBottom: '1px solid #f4f4f5' }}>{item.qty || '0'}</Box>
              <Box component="td" sx={{ p: '6px 8px', textAlign: 'right', fontSize: '11px', borderBottom: '1px solid #f4f4f5' }}>{item.unit}</Box>
              <Box component="td" sx={{ p: '6px 8px', textAlign: 'right', fontSize: '11px', borderBottom: '1px solid #f4f4f5' }}>{cp(parseFloat(item.rate) || 0)}</Box>
              <Box component="td" sx={{ p: '6px 8px', textAlign: 'right', fontWeight: 700, fontSize: '11px', borderBottom: '1px solid #f4f4f5' }}>{cp(calcItem(item))}</Box>
            </Box>
          ))}
        </Box>
      </Box>
      {/* Total */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Box sx={{ minWidth: 240 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: '3px', fontSize: '11px' }}>
            <span style={{ color: '#52525b' }}>Sub Total</span><span>{cp(subTotal)}</span>
          </Box>
          {taxConfig.mode !== 'none' && taxAmt > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: '3px', fontSize: '11px' }}>
              <span style={{ color: '#52525b' }}>{taxLabel} (estimated)</span><span>{cp(taxAmt)}</span>
            </Box>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: '6px', borderTop: '1.5px solid #18181b', mt: '4px', fontWeight: 800, fontSize: '14px' }}>
            <span>Total {taxConfig.mode !== 'none' ? '(incl. est. tax)' : ''}</span><span>{cp(taxConfig.mode !== 'none' ? grandTotal : subTotal)}</span>
          </Box>
          {taxConfig.mode !== 'none' && <Typography sx={{ fontSize: '10px', color: '#52525b', mt: '4px', fontStyle: 'italic' }}>*Tax estimated at {taxConfig.rate}%. Actual tax will be confirmed on vendor invoice.</Typography>}
        </Box>
      </Box>
      {po.terms && <Box sx={{ mb: 3, pt: 2, borderTop: '1px solid #e4e4e7' }}><Typography sx={{ fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#52525b', mb: 0.5 }}>Terms & Conditions</Typography><Typography sx={{ fontSize: '11px', color: '#52525b', whiteSpace: 'pre-line' }}>{po.terms}</Typography></Box>}
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

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
const PurchaseOrderGenerator = () => {
  const [region, setRegion] = useState('india');
  const isIndia = region === 'india';

  /* ── India state (unchanged) ── */
  const [buyer,  setBuyer]  = useState({ name: '', gstin: '',  address: '', phone: '', email: '' });
  const [vendor, setVendor] = useState({ name: '', gstin: '',  address: '', phone: '', email: '' });
  const [po,     setPo]     = useState({
    number: 'PO-001', date: today(), deliveryDate: addDays(14),
    refNumber: '', paymentTerms: 'Net 30', deliveryAddress: '',
    terms: 'All goods must match agreed specifications.\nGST will be charged as applicable on delivery.',
  });
  const [items, setItems] = useState([newItem()]);

  /* ── Global state ── */
  const [gBuyer,  setGBuyer]  = useState({ name: '', taxId: '', address: '', phone: '', email: '' });
  const [gVendor, setGVendor] = useState({ name: '', taxId: '', address: '', phone: '', email: '' });
  const [gPo,     setGPo]     = useState({
    number: 'PO-001', date: today(), deliveryDate: addDays(14),
    refNumber: '', paymentTerms: 'Net 30', deliveryAddress: '',
    terms: 'All goods must match agreed specifications.\nActual tax will be confirmed on the vendor invoice.',
  });
  const [gItems,       setGItems]       = useState([newItem()]);
  const [currencyCode, setCurrencyCode] = useState('USD');
  const [customSymbol, setCustomSymbol] = useState('');
  const [taxConfig,    setTaxConfig]    = useState({ ...DEFAULT_GLOBAL_TAX });

  /* ── Derived ── */
  const subTotal  = (isIndia ? items : gItems).reduce((s, it) => s + calcItem(it), 0);
  const cp        = (n) => fmtCurrency(n, currencyCode, customSymbol, false);
  const gTaxAmt   = calcGlobalTax(subTotal, taxConfig);
  const gGrandTot = subTotal + gTaxAmt;

  /* ── Handlers ── */
  const hb  = (e) => setBuyer((p)  => ({ ...p, [e.target.name]: e.target.value }));
  const hv  = (e) => setVendor((p) => ({ ...p, [e.target.name]: e.target.value }));
  const hp  = (e) => setPo((p)     => ({ ...p, [e.target.name]: e.target.value }));
  const hi  = (id, f, v) => setItems((p)  => p.map((it) => it.id === id ? { ...it, [f]: v } : it));
  const hgb = (e) => setGBuyer((p)  => ({ ...p, [e.target.name]: e.target.value }));
  const hgv = (e) => setGVendor((p) => ({ ...p, [e.target.name]: e.target.value }));
  const hgp = (e) => setGPo((p)    => ({ ...p, [e.target.name]: e.target.value }));
  const hgi = (id, f, v) => setGItems((p) => p.map((it) => it.id === id ? { ...it, [f]: v } : it));

  const addItem  = () => setItems((p)  => [...p, newItem()]);
  const remItem  = (id) => setItems((p)  => p.length > 1 ? p.filter((it) => it.id !== id) : p);
  const addGItem = () => setGItems((p) => [...p, newItem()]);
  const remGItem = (id) => setGItems((p) => p.length > 1 ? p.filter((it) => it.id !== id) : p);

  const handleReset = () => {
    if (isIndia) {
      setBuyer({ name: '', gstin: '', address: '', phone: '', email: '' });
      setVendor({ name: '', gstin: '', address: '', phone: '', email: '' });
      setPo({ number: 'PO-001', date: today(), deliveryDate: addDays(14), refNumber: '', paymentTerms: 'Net 30', deliveryAddress: '', terms: 'All goods must match agreed specifications.\nGST will be charged as applicable on delivery.' });
      setItems([newItem()]);
    } else {
      setGBuyer({ name: '', taxId: '', address: '', phone: '', email: '' });
      setGVendor({ name: '', taxId: '', address: '', phone: '', email: '' });
      setGPo({ number: 'PO-001', date: today(), deliveryDate: addDays(14), refNumber: '', paymentTerms: 'Net 30', deliveryAddress: '', terms: 'All goods must match agreed specifications.\nActual tax will be confirmed on the vendor invoice.' });
      setGItems([newItem()]);
    }
  };

  const pageTitle = 'Free Purchase Order Generator | PO India & Global | Aslisite';
  const pageDesc  = 'Create professional purchase orders for free. India mode: GSTIN, ₹. Global mode: multi-currency, estimated VAT/Sales Tax. No login required.';

  /* ── Shared item rows renderer ── */
  const renderItems = (itemList, onItem, onAdd, onRemove) => (
    <>
      <Box sx={{ display: { xs: 'none', md: 'grid' }, gridTemplateColumns: '2.2fr 1.5fr 0.7fr 0.7fr 0.85fr 36px', gap: 1, mb: 1 }}>
        {['Description', 'Notes / Specs', 'Qty', 'Unit', isIndia ? 'Unit Price (₹)' : `Unit Price (${currencyCode === 'OTHER' ? (customSymbol || '?') : currencyCode})`, ''].map((h) => (
          <Typography key={h} variant="caption" sx={{ color: colors.text.muted, fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</Typography>
        ))}
      </Box>
      <Stack spacing={1.5}>
        {itemList.map((item, idx) => (
          <Box key={item.id} sx={{ p: { xs: 2, md: 0 }, borderRadius: { xs: 2, md: 0 }, border: { xs: `1px solid ${colors.border.light}`, md: 'none' } }}>
            <Typography sx={{ display: { xs: 'block', md: 'none' }, fontSize: '0.75rem', fontWeight: 700, color: colors.text.muted, mb: 1 }}>Item {idx + 1}</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: '2.2fr 1.5fr 0.7fr 0.7fr 0.85fr 36px' }, gap: 1, alignItems: 'center' }}>
              <Box sx={{ gridColumn: { xs: '1 / -1', md: 'auto' } }}>
                <Field label="Item / Description *" value={item.description} onChange={(e) => onItem(item.id, 'description', e.target.value)} />
              </Box>
              <Field label="Notes / Specs" value={item.notes} onChange={(e) => onItem(item.id, 'notes', e.target.value)} />
              <Field label="Qty" value={item.qty} onChange={(e) => onItem(item.id, 'qty', e.target.value)} inputProps={{ inputMode: 'decimal' }} />
              <Field label="Unit" value={item.unit} onChange={(e) => onItem(item.id, 'unit', e.target.value)} />
              <Field label="Unit Price" value={item.rate} onChange={(e) => onItem(item.id, 'rate', e.target.value)} inputProps={{ inputMode: 'decimal' }} />
              <Tooltip title="Remove">
                <IconButton size="small" onClick={() => onRemove(item.id)} disabled={itemList.length === 1}
                  sx={{ color: colors.text.muted, '&:hover': { color: '#dc2626' }, '&.Mui-disabled': { opacity: 0.3 } }}>
                  <Trash2 size={15} />
                </IconButton>
              </Tooltip>
            </Box>
            {(item.qty && item.rate) && (
              <Box sx={{ mt: 0.5, textAlign: { xs: 'left', md: 'right' } }}>
                <Typography variant="caption" sx={{ color: colors.text.muted, fontFamily: '"JetBrains Mono", monospace' }}>
                  Amount: <strong style={{ color: colors.text.primary }}>
                    {isIndia ? `₹${fmt(calcItem(item))}` : cp(calcItem(item))}
                  </strong>
                </Typography>
              </Box>
            )}
          </Box>
        ))}
      </Stack>
      <Button startIcon={<Plus size={15} />} onClick={onAdd}
        sx={{ mt: 2, borderRadius: 2, fontWeight: 600, fontSize: '0.82rem', color: colors.accent.primary, textTransform: 'none', '&:hover': { backgroundColor: 'rgba(109,40,217,0.06)' } }}>
        Add Item
      </Button>
    </>
  );

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
          <SectionBadge icon={ClipboardList} label={isIndia ? 'Free Purchase Order Tool' : 'Global PO — Multi-Currency'} />
          <Typography variant="h1" sx={{ fontSize: { xs: '1.9rem', sm: '2.5rem', md: '2.8rem' }, fontWeight: 800, color: colors.text.primary, mt: 2, mb: 1.5, letterSpacing: '-0.03em' }}>
            Purchase Order Generator
          </Typography>
          <Typography variant="subtitle1" sx={{ color: colors.text.secondary, maxWidth: 560, lineHeight: 1.7 }}>
            {isIndia
              ? 'Create professional purchase orders with delivery dates, payment terms, and GSTIN. Print or save as PDF.'
              : 'Create international purchase orders with multi-currency support and estimated tax. Print or save as PDF.'}
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

        {/* Region selector */}
        <RegionSelector region={region} onChange={setRegion} />

        <Grid container spacing={3} className="no-print">
          <Grid item xs={12} lg={8}>

            {/* Global: currency + estimated tax */}
            {!isIndia && (
              <Card sx={{ borderRadius: 3, border: `1px solid ${colors.border.light}`, boxShadow: 'none', mb: 3 }}>
                <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                  <SH>Currency & Estimated Tax</SH>
                  <Typography variant="caption" sx={{ color: colors.text.muted, display: 'block', mb: 2 }}>
                    Tax on a PO is always an estimate — actual tax is invoiced by the vendor. Select "No Tax" to omit the estimate entirely.
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormControl fullWidth size="small">
                        <InputLabel sx={{ fontSize: '0.82rem' }}>Currency</InputLabel>
                        <Select value={currencyCode} label="Currency" onChange={(e) => setCurrencyCode(e.target.value)} sx={{ borderRadius: 1.5 }}>
                          {CURRENCIES.map((c) => <MenuItem key={c.code} value={c.code}>{c.symbol ? `${c.symbol} — ` : ''}{c.name} ({c.code})</MenuItem>)}
                        </Select>
                      </FormControl>
                    </Grid>
                    {currencyCode === 'OTHER' && (
                      <Grid item xs={12} sm={6} md={4}>
                        <Field label="Currency Symbol" value={customSymbol} onChange={(e) => setCustomSymbol(e.target.value)} placeholder="e.g. د.إ" />
                      </Grid>
                    )}
                    <Grid item xs={12} sm={6} md={3}>
                      <FormControl fullWidth size="small">
                        <InputLabel sx={{ fontSize: '0.82rem' }}>Est. Tax Type</InputLabel>
                        <Select value={taxConfig.mode} label="Est. Tax Type" onChange={(e) => setTaxConfig({ ...taxConfig, mode: e.target.value })} sx={{ borderRadius: 1.5 }}>
                          {TAX_MODES.map((t) => <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>)}
                        </Select>
                      </FormControl>
                    </Grid>
                    {taxConfig.mode !== 'none' && (
                      <Grid item xs={6} sm={4} md={2}>
                        <Field label="Rate (%)" value={taxConfig.rate} onChange={(e) => setTaxConfig({ ...taxConfig, rate: e.target.value })} inputProps={{ inputMode: 'decimal' }} />
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            )}

            {/* Buyer */}
            <Card sx={{ borderRadius: 3, border: `1px solid ${colors.border.light}`, boxShadow: 'none', mb: 3 }}>
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <SH>Buyer (Your Company)</SH>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}><Field label="Company Name *" name="name" value={isIndia ? buyer.name : gBuyer.name} onChange={isIndia ? hb : hgb} /></Grid>
                  <Grid item xs={12} sm={6}><Field label={isIndia ? 'GSTIN' : 'Tax ID / VAT No.'} name={isIndia ? 'gstin' : 'taxId'} value={isIndia ? buyer.gstin : gBuyer.taxId} onChange={isIndia ? hb : hgb} inputProps={isIndia ? { maxLength: 15 } : {}} /></Grid>
                  <Grid item xs={12}><Field label="Address" name="address" value={isIndia ? buyer.address : gBuyer.address} onChange={isIndia ? hb : hgb} multiline rows={2} /></Grid>
                  <Grid item xs={12} sm={6}><Field label="Phone" name="phone" value={isIndia ? buyer.phone : gBuyer.phone} onChange={isIndia ? hb : hgb} /></Grid>
                  <Grid item xs={12} sm={6}><Field label="Email" name="email" value={isIndia ? buyer.email : gBuyer.email} onChange={isIndia ? hb : hgb} type="email" /></Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Vendor */}
            <Card sx={{ borderRadius: 3, border: `1px solid ${colors.border.light}`, boxShadow: 'none', mb: 3 }}>
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <SH>Vendor / Supplier</SH>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}><Field label="Vendor Name *" name="name" value={isIndia ? vendor.name : gVendor.name} onChange={isIndia ? hv : hgv} /></Grid>
                  <Grid item xs={12} sm={6}><Field label={isIndia ? 'Vendor GSTIN' : 'Tax ID / VAT No.'} name={isIndia ? 'gstin' : 'taxId'} value={isIndia ? vendor.gstin : gVendor.taxId} onChange={isIndia ? hv : hgv} inputProps={isIndia ? { maxLength: 15 } : {}} /></Grid>
                  <Grid item xs={12}><Field label="Address" name="address" value={isIndia ? vendor.address : gVendor.address} onChange={isIndia ? hv : hgv} multiline rows={2} /></Grid>
                  <Grid item xs={12} sm={6}><Field label="Phone" name="phone" value={isIndia ? vendor.phone : gVendor.phone} onChange={isIndia ? hv : hgv} /></Grid>
                  <Grid item xs={12} sm={6}><Field label="Email" name="email" value={isIndia ? vendor.email : gVendor.email} onChange={isIndia ? hv : hgv} type="email" /></Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* PO Details */}
            <Card sx={{ borderRadius: 3, border: `1px solid ${colors.border.light}`, boxShadow: 'none', mb: 3 }}>
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <SH>PO Details</SH>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}><Field label="PO Number" name="number" value={isIndia ? po.number : gPo.number} onChange={isIndia ? hp : hgp} /></Grid>
                  <Grid item xs={6} sm={3}><Field label="PO Date" name="date" value={isIndia ? po.date : gPo.date} onChange={isIndia ? hp : hgp} type="date" InputLabelProps={{ shrink: true }} /></Grid>
                  <Grid item xs={6} sm={3}><Field label="Delivery By" name="deliveryDate" value={isIndia ? po.deliveryDate : gPo.deliveryDate} onChange={isIndia ? hp : hgp} type="date" InputLabelProps={{ shrink: true }} /></Grid>
                  <Grid item xs={6} sm={3}><Field label="Reference No." name="refNumber" value={isIndia ? po.refNumber : gPo.refNumber} onChange={isIndia ? hp : hgp} /></Grid>
                  <Grid item xs={12} sm={6}><Field label="Payment Terms" name="paymentTerms" value={isIndia ? po.paymentTerms : gPo.paymentTerms} onChange={isIndia ? hp : hgp} /></Grid>
                  <Grid item xs={12} sm={6}><Field label="Ship To Address (if different)" name="deliveryAddress" value={isIndia ? po.deliveryAddress : gPo.deliveryAddress} onChange={isIndia ? hp : hgp} /></Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Items */}
            <Card sx={{ borderRadius: 3, border: `1px solid ${colors.border.light}`, boxShadow: 'none', mb: 3 }}>
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <SH>Items / Services</SH>
                {isIndia
                  ? renderItems(items,  hi,  addItem,  remItem)
                  : renderItems(gItems, hgi, addGItem, remGItem)
                }
              </CardContent>
            </Card>

            {/* Terms */}
            <Card sx={{ borderRadius: 3, border: `1px solid ${colors.border.light}`, boxShadow: 'none' }}>
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <SH>Terms & Conditions</SH>
                <Field label="Terms & conditions" name="terms" value={isIndia ? po.terms : gPo.terms} onChange={isIndia ? hp : hgp} multiline rows={3} />
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
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{(isIndia ? items : gItems).filter((it) => it.description).length}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: colors.text.secondary }}>Total Qty</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: '"JetBrains Mono", monospace' }}>
                      {(isIndia ? items : gItems).reduce((s, it) => s + (parseFloat(it.qty) || 0), 0).toLocaleString('en-IN')}
                    </Typography>
                  </Stack>
                  <Divider sx={{ my: 1 }} />
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: colors.text.secondary }}>Sub Total</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: '"JetBrains Mono", monospace' }}>
                      {isIndia ? `₹ ${fmt(subTotal)}` : cp(subTotal)}
                    </Typography>
                  </Stack>
                  {!isIndia && taxConfig.mode !== 'none' && gTaxAmt > 0 && (
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" sx={{ color: colors.text.secondary }}>{taxLineLabel(taxConfig)} (est.)</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: '"JetBrains Mono", monospace' }}>{cp(gTaxAmt)}</Typography>
                    </Stack>
                  )}
                  <Divider sx={{ my: 1 }} />
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: colors.text.primary }}>
                      {isIndia ? 'Total (Excl. GST)' : 'Total'}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: colors.accent.secondary, fontFamily: '"JetBrains Mono", monospace' }}>
                      {isIndia ? `₹ ${fmt(subTotal)}` : cp(!isIndia && taxConfig.mode !== 'none' ? gGrandTot : subTotal)}
                    </Typography>
                  </Stack>
                </Stack>

                {/* Per-item breakdown */}
                {(isIndia ? items : gItems).map((item) => {
                  if (!item.qty || !item.rate) return null;
                  return (
                    <Stack key={item.id} direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                      <Typography variant="caption" sx={{ color: colors.text.secondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '60%' }}>
                        {item.description || 'Item'}
                      </Typography>
                      <Typography variant="caption" sx={{ color: colors.text.primary, fontWeight: 600, fontFamily: '"JetBrains Mono", monospace' }}>
                        {isIndia ? `₹${fmt(calcItem(item))}` : cp(calcItem(item))}
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
                  {isIndia
                    ? 'GST is not pre-filled on POs — it will be invoiced by the vendor at applicable rates.'
                    : 'Tax shown is an estimate only. Actual tax will be confirmed on the vendor invoice.'}
                </Alert>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {isIndia
          ? <IndiaPrint buyer={buyer} vendor={vendor} po={po} items={items} />
          : <GlobalPrint buyer={gBuyer} vendor={gVendor} po={gPo} items={gItems} currencyCode={currencyCode} customSymbol={customSymbol} taxConfig={taxConfig} />
        }
      </Container>
    </>
  );
};

export default PurchaseOrderGenerator;
