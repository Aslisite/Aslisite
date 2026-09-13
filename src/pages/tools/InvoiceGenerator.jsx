import { useState } from 'react';
import {
  Box, Container, Typography, TextField, Grid, Card, CardContent,
  Stack, Button, IconButton, Divider, Chip, MenuItem, Select,
  FormControl, InputLabel, Tooltip, Alert, ToggleButton, ToggleButtonGroup,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import {
  FileText, Plus, Trash2, Printer, RotateCcw,
  ArrowLeft, ChevronRight, Info, Tag,
} from 'lucide-react';
import { colors } from '../../theme/theme';
import { absoluteUrl, siteMetadata } from '../../seo/siteMetadata';
import { SectionBadge } from '../../components/common';

/* ─── GST 2.0 Slabs (effective 22 Sep 2025) ─── */
const GST_RATES = [
  { value: 0,  label: '0% — Exempt' },
  { value: 5,  label: '5% — Merit' },
  { value: 18, label: '18% — Standard' },
  { value: 40, label: '40% — Demerit/Luxury' },
];

const PAYMENT_TERMS = ['Due on Receipt', 'Net 7', 'Net 15', 'Net 30', 'Net 45', 'Net 60'];

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal',
  'Andaman & Nicobar Islands', 'Chandigarh', 'Dadra & Nagar Haveli and Daman & Diu',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];

/* ─── Helpers ─── */
const fmt = (n) =>
  Number.isFinite(n)
    ? n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '0.00';

/* Amount in words — Indian number system */
const fmtWords = (n) => {
  if (!Number.isFinite(n) || n < 0) return '';
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const twoDigits = (n) => n < 20 ? ones[n] : tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
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
  let result = convert(rupees) || 'Zero';
  result += ' Rupees';
  if (paise > 0) result += ' and ' + twoDigits(paise) + ' Paise';
  return result + ' Only';
};

const newItem = () => ({
  id: crypto.randomUUID(),
  description: '',
  hsn: '',
  qty: '',
  unit: 'Nos',
  rate: '',
  gstRate: 18,
});

const calcItem = (item) => {
  const qty = parseFloat(item.qty) || 0;
  const rate = parseFloat(item.rate) || 0;
  const taxableAmount = qty * rate;
  const gstAmount = (taxableAmount * item.gstRate) / 100;
  return { taxableAmount, gstAmount, total: taxableAmount + gstAmount };
};

/**
 * discount: { value: string, type: 'flat' | 'percent' }
 * Returns: { subTotal, discountAmount, taxableAfterDiscount, totalGst, totalCgst, totalSgst, totalIgst, grandTotal }
 */
const calcTotals = (items, txnType, discount) => {
  let subTotal = 0;
  items.forEach((item) => { subTotal += calcItem(item).taxableAmount; });

  // Discount applied on sub-total (before GST)
  const discVal = parseFloat(discount.value) || 0;
  const discountAmount = discount.type === 'percent'
    ? (subTotal * discVal) / 100
    : Math.min(discVal, subTotal);
  const taxableAfterDiscount = subTotal - discountAmount;

  // GST calculated on taxable-after-discount, proportionally per item
  const discountRatio = subTotal > 0 ? taxableAfterDiscount / subTotal : 1;
  let totalGst = 0, totalCgst = 0, totalSgst = 0, totalIgst = 0;
  items.forEach((item) => {
    const { taxableAmount } = calcItem(item);
    const adjustedTaxable = taxableAmount * discountRatio;
    const gst = (adjustedTaxable * item.gstRate) / 100;
    totalGst += gst;
    if (txnType === 'intra') { totalCgst += gst / 2; totalSgst += gst / 2; }
    else { totalIgst += gst; }
  });

  return {
    subTotal,
    discountAmount,
    taxableAfterDiscount,
    totalGst,
    totalCgst,
    totalSgst,
    totalIgst,
    grandTotal: taxableAfterDiscount + totalGst,
  };
};

const today = () => new Date().toISOString().split('T')[0];

/* ─── Sub-components ─── */
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
const PrintDocument = ({ biz, client, invoice, items, txnType, totals, discount, bank }) => {
  const isTaxable = items.some((it) => it.gstRate > 0);
  const discountRatio = totals.subTotal > 0 ? totals.taxableAfterDiscount / totals.subTotal : 1;

  /* Group items by GST rate for GST summary table */
  const taxGroups = {};
  items.forEach((it) => {
    const { taxableAmount } = calcItem(it);
    const adjTaxable = taxableAmount * discountRatio;
    const gst = (adjTaxable * it.gstRate) / 100;
    if (!taxGroups[it.gstRate]) taxGroups[it.gstRate] = { taxable: 0, gst: 0 };
    taxGroups[it.gstRate].taxable += adjTaxable;
    taxGroups[it.gstRate].gst += gst;
  });

  const hasBankDetails = bank.name || bank.account || bank.ifsc || bank.upi;

  return (
    <Box
      id="invoice-print-area"
      sx={{
        display: 'none',
        '@media print': { display: 'block' },
        fontFamily: '"Inter", sans-serif',
        fontSize: '12px',
        color: '#18181b',
        p: 0,
      }}
    >
      {/* ── Header ── */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: '20px', color: '#18181b' }}>{biz.name || 'Your Business Name'}</Typography>
          {biz.gstin && <Typography sx={{ fontSize: '11px', color: '#52525b' }}>GSTIN: {biz.gstin}</Typography>}
          {biz.address && <Typography sx={{ fontSize: '11px', color: '#52525b', whiteSpace: 'pre-line' }}>{biz.address}</Typography>}
          {biz.phone && <Typography sx={{ fontSize: '11px', color: '#52525b' }}>Phone: {biz.phone}</Typography>}
          {biz.email && <Typography sx={{ fontSize: '11px', color: '#52525b' }}>Email: {biz.email}</Typography>}
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography sx={{ fontWeight: 900, fontSize: '24px', color: '#6d28d9', letterSpacing: '-0.03em' }}>TAX INVOICE</Typography>
          <Typography sx={{ fontSize: '11px', color: '#52525b' }}>No: <strong>{invoice.number || '—'}</strong></Typography>
          <Typography sx={{ fontSize: '11px', color: '#52525b' }}>Date: <strong>{invoice.date || '—'}</strong></Typography>
          {invoice.dueDate && <Typography sx={{ fontSize: '11px', color: '#52525b' }}>Due: <strong>{invoice.dueDate}</strong></Typography>}
          {invoice.poNumber && <Typography sx={{ fontSize: '11px', color: '#52525b' }}>PO No: <strong>{invoice.poNumber}</strong></Typography>}
        </Box>
      </Box>

      <Divider sx={{ mb: 2.5, borderColor: '#e4e4e7' }} />

      {/* ── Bill To + Place of Supply ── */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, gap: 4 }}>
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6d28d9', mb: 0.5 }}>Bill To</Typography>
          <Typography sx={{ fontWeight: 700, fontSize: '13px' }}>{client.name || '—'}</Typography>
          {client.gstin && <Typography sx={{ fontSize: '11px', color: '#52525b' }}>GSTIN: {client.gstin}</Typography>}
          {client.address && <Typography sx={{ fontSize: '11px', color: '#52525b', whiteSpace: 'pre-line' }}>{client.address}</Typography>}
          {client.phone && <Typography sx={{ fontSize: '11px', color: '#52525b' }}>Phone: {client.phone}</Typography>}
          {client.email && <Typography sx={{ fontSize: '11px', color: '#52525b' }}>Email: {client.email}</Typography>}
        </Box>
        {(invoice.placeOfSupply || biz.state) && (
          <Box sx={{ textAlign: 'right' }}>
            {biz.state && (
              <Box sx={{ mb: 0.5 }}>
                <Typography sx={{ fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#52525b' }}>Supplier State</Typography>
                <Typography sx={{ fontSize: '11px' }}>{biz.state}</Typography>
              </Box>
            )}
            {invoice.placeOfSupply && (
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#52525b' }}>Place of Supply</Typography>
                <Typography sx={{ fontSize: '11px', fontWeight: 600 }}>{invoice.placeOfSupply}</Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>

      {/* ── Items Table ── */}
      <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', mb: 3 }}>
        <Box component="thead">
          <Box component="tr" sx={{ backgroundColor: '#f4f4f5' }}>
            {['#', 'Description', 'HSN/SAC', 'Qty', 'Unit', 'Rate (₹)', 'Taxable (₹)', 'GST %', 'GST (₹)', 'Total (₹)'].map((h) => (
              <Box key={h} component="th" sx={{ p: '6px 8px', textAlign: h === '#' ? 'center' : 'right', fontWeight: 700, fontSize: '10px', color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1.5px solid #e4e4e7', '&:nth-of-type(2)': { textAlign: 'left' } }}>
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
                <Box component="td" sx={{ p: '6px 8px', textAlign: 'left', fontSize: '11px', borderBottom: '1px solid #f4f4f5' }}>{item.description || '—'}</Box>
                <Box component="td" sx={{ p: '6px 8px', textAlign: 'right', fontSize: '11px', borderBottom: '1px solid #f4f4f5' }}>{item.hsn || '—'}</Box>
                <Box component="td" sx={{ p: '6px 8px', textAlign: 'right', fontSize: '11px', borderBottom: '1px solid #f4f4f5' }}>{item.qty || '0'}</Box>
                <Box component="td" sx={{ p: '6px 8px', textAlign: 'right', fontSize: '11px', borderBottom: '1px solid #f4f4f5' }}>{item.unit}</Box>
                <Box component="td" sx={{ p: '6px 8px', textAlign: 'right', fontSize: '11px', borderBottom: '1px solid #f4f4f5' }}>{fmt(parseFloat(item.rate) || 0)}</Box>
                <Box component="td" sx={{ p: '6px 8px', textAlign: 'right', fontSize: '11px', borderBottom: '1px solid #f4f4f5' }}>{fmt(taxableAmount)}</Box>
                <Box component="td" sx={{ p: '6px 8px', textAlign: 'right', fontSize: '11px', borderBottom: '1px solid #f4f4f5' }}>{item.gstRate}%</Box>
                <Box component="td" sx={{ p: '6px 8px', textAlign: 'right', fontSize: '11px', borderBottom: '1px solid #f4f4f5' }}>{fmt(gstAmount)}</Box>
                <Box component="td" sx={{ p: '6px 8px', textAlign: 'right', fontWeight: 700, fontSize: '11px', borderBottom: '1px solid #f4f4f5' }}>{fmt(total)}</Box>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* ── Totals section ── */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 3, mb: 3 }}>
        {/* GST Summary table */}
        {isTaxable && (
          <Box sx={{ minWidth: 260 }}>
            <Typography sx={{ fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6d28d9', mb: 0.5 }}>GST Summary</Typography>
            <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
              <Box component="thead">
                <Box component="tr">
                  {txnType === 'intra'
                    ? ['Rate', 'Taxable', 'CGST', 'SGST', 'Total GST'].map((h) => (
                        <Box key={h} component="th" sx={{ p: '4px 6px', fontSize: '10px', fontWeight: 700, color: '#52525b', textAlign: 'right', '&:first-of-type': { textAlign: 'left' }, borderBottom: '1px solid #e4e4e7' }}>{h}</Box>
                      ))
                    : ['Rate', 'Taxable', 'IGST'].map((h) => (
                        <Box key={h} component="th" sx={{ p: '4px 6px', fontSize: '10px', fontWeight: 700, color: '#52525b', textAlign: 'right', '&:first-of-type': { textAlign: 'left' }, borderBottom: '1px solid #e4e4e7' }}>{h}</Box>
                      ))
                  }
                </Box>
              </Box>
              <Box component="tbody">
                {Object.entries(taxGroups).map(([rate, { taxable, gst }]) => (
                  <Box key={rate} component="tr">
                    <Box component="td" sx={{ p: '4px 6px', fontSize: '11px', textAlign: 'left' }}>{rate}%</Box>
                    <Box component="td" sx={{ p: '4px 6px', fontSize: '11px', textAlign: 'right' }}>₹{fmt(taxable)}</Box>
                    {txnType === 'intra' ? (
                      <>
                        <Box component="td" sx={{ p: '4px 6px', fontSize: '11px', textAlign: 'right' }}>₹{fmt(gst / 2)}</Box>
                        <Box component="td" sx={{ p: '4px 6px', fontSize: '11px', textAlign: 'right' }}>₹{fmt(gst / 2)}</Box>
                        <Box component="td" sx={{ p: '4px 6px', fontSize: '11px', textAlign: 'right', fontWeight: 700 }}>₹{fmt(gst)}</Box>
                      </>
                    ) : (
                      <Box component="td" sx={{ p: '4px 6px', fontSize: '11px', textAlign: 'right', fontWeight: 700 }}>₹{fmt(gst)}</Box>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        )}

        {/* Grand total block */}
        <Box sx={{ minWidth: 220, ml: 'auto' }}>
          {[
            { label: 'Sub Total', value: fmt(totals.subTotal) },
            ...(totals.discountAmount > 0 ? [{ label: `Discount${discount.type === 'percent' ? ` (${discount.value}%)` : ''}`, value: `- ${fmt(totals.discountAmount)}`, highlight: '#dc2626' }] : []),
            ...(totals.discountAmount > 0 ? [{ label: 'Taxable Amount', value: fmt(totals.taxableAfterDiscount) }] : []),
            ...(txnType === 'intra' && totals.totalCgst > 0
              ? [{ label: 'CGST', value: fmt(totals.totalCgst) }, { label: 'SGST', value: fmt(totals.totalSgst) }]
              : totals.totalIgst > 0 ? [{ label: 'IGST', value: fmt(totals.totalIgst) }] : []),
          ].map(({ label, value, highlight }) => (
            <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', py: '3px', fontSize: '11px' }}>
              <span style={{ color: '#52525b' }}>{label}</span>
              <span style={{ color: highlight || 'inherit', fontWeight: highlight ? 600 : 'normal' }}>{value}</span>
            </Box>
          ))}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: '6px', borderTop: '1.5px solid #18181b', mt: '4px', fontWeight: 800, fontSize: '13px' }}>
            <span>Grand Total</span><span>₹ {fmt(totals.grandTotal)}</span>
          </Box>
          {/* Amount in words */}
          <Box sx={{ mt: '6px', pt: '6px', borderTop: '1px dashed #e4e4e7' }}>
            <Typography sx={{ fontSize: '10px', color: '#52525b', fontStyle: 'italic', lineHeight: 1.5 }}>
              <strong>Rupees:</strong> {fmtWords(totals.grandTotal)}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* ── Bank / Payment details ── */}
      {hasBankDetails && (
        <Box sx={{ mb: 3, p: '10px 12px', backgroundColor: '#fafafa', border: '1px solid #e4e4e7', borderRadius: '6px' }}>
          <Typography sx={{ fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#52525b', mb: 0.75 }}>
            Payment Details
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '4px 24px' }}>
            {bank.name && <Typography sx={{ fontSize: '11px' }}><strong>Bank:</strong> {bank.name}</Typography>}
            {bank.account && <Typography sx={{ fontSize: '11px' }}><strong>Account No:</strong> {bank.account}</Typography>}
            {bank.ifsc && <Typography sx={{ fontSize: '11px' }}><strong>IFSC:</strong> {bank.ifsc}</Typography>}
            {bank.branch && <Typography sx={{ fontSize: '11px' }}><strong>Branch:</strong> {bank.branch}</Typography>}
            {bank.upi && <Typography sx={{ fontSize: '11px' }}><strong>UPI:</strong> {bank.upi}</Typography>}
          </Box>
        </Box>
      )}

      {/* ── Notes ── */}
      {invoice.notes && (
        <Box sx={{ mb: 3, pt: 2, borderTop: '1px solid #e4e4e7' }}>
          <Typography sx={{ fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#52525b', mb: 0.5 }}>Notes</Typography>
          <Typography sx={{ fontSize: '11px', color: '#52525b', whiteSpace: 'pre-line' }}>{invoice.notes}</Typography>
        </Box>
      )}

      {/* ── Signature area ── */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, pt: 2, borderTop: '1px solid #e4e4e7' }}>
        <Box sx={{ width: 200, textAlign: 'center' }}>
          <Box sx={{ height: 48, borderBottom: '1px solid #18181b', mb: 0.5 }} />
          <Typography sx={{ fontSize: '10px', color: '#52525b' }}>Authorised Signatory</Typography>
          <Typography sx={{ fontSize: '10px', color: '#52525b' }}>for {biz.name || 'Business'}</Typography>
        </Box>
      </Box>

      {/* ── Footer ── */}
      <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid #e4e4e7', textAlign: 'center' }}>
        <Typography sx={{ fontSize: '10px', color: '#a1a1aa' }}>
          Generated via aslisite.com/tools/invoice-generator — Free GST Invoice Generator
        </Typography>
      </Box>
    </Box>
  );
};

/* ════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════ */
const InvoiceGenerator = () => {
  const [biz, setBiz] = useState({ name: '', gstin: '', address: '', phone: '', email: '', state: '' });
  const [client, setClient] = useState({ name: '', gstin: '', address: '', phone: '', email: '' });
  const [invoice, setInvoice] = useState({
    number: 'INV-001',
    date: today(),
    dueDate: '',
    poNumber: '',
    paymentTerms: 'Net 30',
    placeOfSupply: '',
    notes: '',
  });
  const [items, setItems] = useState([newItem()]);
  const [txnType, setTxnType] = useState('intra');
  const [discount, setDiscount] = useState({ value: '', type: 'flat' }); // type: 'flat' | 'percent'
  const [bank, setBank] = useState({ name: '', account: '', ifsc: '', branch: '', upi: '' });

  const totals = calcTotals(items, txnType, discount);

  const handleBiz = (e) => setBiz((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleClient = (e) => setClient((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleInvoice = (e) => setInvoice((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleBank = (e) => setBank((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleItem = (id, field, value) => setItems((prev) => prev.map((it) => it.id === id ? { ...it, [field]: value } : it));
  const addItem = () => setItems((p) => [...p, newItem()]);
  const removeItem = (id) => setItems((p) => p.length > 1 ? p.filter((it) => it.id !== id) : p);

  const handleReset = () => {
    setBiz({ name: '', gstin: '', address: '', phone: '', email: '', state: '' });
    setClient({ name: '', gstin: '', address: '', phone: '', email: '' });
    setInvoice({ number: 'INV-001', date: today(), dueDate: '', poNumber: '', paymentTerms: 'Net 30', placeOfSupply: '', notes: '' });
    setItems([newItem()]);
    setTxnType('intra');
    setDiscount({ value: '', type: 'flat' });
    setBank({ name: '', account: '', ifsc: '', branch: '', upi: '' });
  };

  const pageTitle = 'Free GST Invoice Generator India | Tax Invoice Online | Aslisite';
  const pageDesc =
    'Create professional GST tax invoices online for free. Supports GST 2.0 slabs (0%, 5%, 18%, 40%), discount, CGST/SGST/IGST breakdown, amount in words, bank details, and instant PDF download. No login required.';

  return (
    <>
      <style>{`
        @media print {
          #invoice-print-area { display: block !important; }
          @page { margin: 15mm; size: A4; }
        }
      `}</style>

      <Container maxWidth="lg" className="tool-page-container" sx={{ pt: { xs: 16, md: 16 }, pb: { xs: 8, md: 12 } }}>
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageDesc} />
          <link rel="canonical" href={absoluteUrl('/tools/invoice-generator')} />
          <meta property="og:url" content={absoluteUrl('/tools/invoice-generator')} />
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
              '@id': `${absoluteUrl('/tools/invoice-generator')}#app`,
              url: absoluteUrl('/tools/invoice-generator'),
              name: 'Free GST Invoice Generator — Aslisite',
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
          <Typography sx={{ fontSize: '0.82rem', color: colors.text.secondary, fontWeight: 500 }}>Invoice Generator</Typography>
        </Stack>

        {/* Header */}
        <Box component={motion.div} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} sx={{ mb: { xs: 5, md: 6 } }} className="no-print">
          <SectionBadge icon={FileText} label="Free GST Tax Invoice · No Login" />
          <Typography variant="h1" sx={{ fontSize: { xs: '1.9rem', sm: '2.5rem', md: '2.8rem' }, fontWeight: 800, color: colors.text.primary, mt: 2, mb: 1.5, letterSpacing: '-0.03em' }}>
            Free Invoice Generator
          </Typography>
          <Typography variant="subtitle1" sx={{ color: colors.text.secondary, maxWidth: 560, lineHeight: 1.7 }}>
            Create professional GST tax invoices in seconds. Fill in the details below, then print or save as PDF.
          </Typography>
        </Box>

        {/* Action bar */}
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
          {/* ════ LEFT COLUMN ════ */}
          <Grid item xs={12} lg={8}>

            {/* 01 — Business Details */}
            <Card sx={{ borderRadius: 3, border: `1px solid ${colors.border.light}`, boxShadow: 'none', mb: 3 }}>
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <SectionHeading>Your Business Details</SectionHeading>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}><Field label="Business Name *" name="name" value={biz.name} onChange={handleBiz} /></Grid>
                  <Grid item xs={12} sm={6}><Field label="GSTIN" name="gstin" value={biz.gstin} onChange={handleBiz} inputProps={{ maxLength: 15 }} /></Grid>
                  <Grid item xs={12}><Field label="Address" name="address" value={biz.address} onChange={handleBiz} multiline rows={2} /></Grid>
                  <Grid item xs={12} sm={4}><Field label="Phone" name="phone" value={biz.phone} onChange={handleBiz} /></Grid>
                  <Grid item xs={12} sm={4}><Field label="Email" name="email" value={biz.email} onChange={handleBiz} type="email" /></Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth size="small">
                      <InputLabel sx={{ fontSize: '0.82rem' }}>State</InputLabel>
                      <Select value={biz.state} label="State" name="state" onChange={handleBiz} sx={{ borderRadius: 1.5 }}>
                        <MenuItem value=""><em>Select state</em></MenuItem>
                        {INDIAN_STATES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* 02 — Client Details */}
            <Card sx={{ borderRadius: 3, border: `1px solid ${colors.border.light}`, boxShadow: 'none', mb: 3 }}>
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <SectionHeading>Bill To (Client Details)</SectionHeading>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}><Field label="Client Name *" name="name" value={client.name} onChange={handleClient} /></Grid>
                  <Grid item xs={12} sm={6}><Field label="Client GSTIN" name="gstin" value={client.gstin} onChange={handleClient} inputProps={{ maxLength: 15 }} /></Grid>
                  <Grid item xs={12}><Field label="Address" name="address" value={client.address} onChange={handleClient} multiline rows={2} /></Grid>
                  <Grid item xs={12} sm={6}><Field label="Phone" name="phone" value={client.phone} onChange={handleClient} /></Grid>
                  <Grid item xs={12} sm={6}><Field label="Email" name="email" value={client.email} onChange={handleClient} type="email" /></Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* 03 — Invoice Details */}
            <Card sx={{ borderRadius: 3, border: `1px solid ${colors.border.light}`, boxShadow: 'none', mb: 3 }}>
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <SectionHeading>Invoice Details</SectionHeading>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}><Field label="Invoice No." name="number" value={invoice.number} onChange={handleInvoice} /></Grid>
                  <Grid item xs={12} sm={6} md={3}><Field label="Invoice Date" name="date" value={invoice.date} onChange={handleInvoice} type="date" InputLabelProps={{ shrink: true }} /></Grid>
                  <Grid item xs={12} sm={6} md={3}><Field label="Due Date" name="dueDate" value={invoice.dueDate} onChange={handleInvoice} type="date" InputLabelProps={{ shrink: true }} /></Grid>
                  <Grid item xs={12} sm={6} md={3}><Field label="PO Number" name="poNumber" value={invoice.poNumber} onChange={handleInvoice} /></Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <FormControl fullWidth size="small">
                      <InputLabel sx={{ fontSize: '0.82rem' }}>Payment Terms</InputLabel>
                      <Select value={invoice.paymentTerms} label="Payment Terms" name="paymentTerms" onChange={handleInvoice} sx={{ borderRadius: 1.5 }}>
                        {PAYMENT_TERMS.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <FormControl fullWidth size="small">
                      <InputLabel sx={{ fontSize: '0.82rem' }}>Transaction Type</InputLabel>
                      <Select value={txnType} label="Transaction Type" onChange={(e) => setTxnType(e.target.value)} sx={{ borderRadius: 1.5 }}>
                        <MenuItem value="intra">Intra-State (CGST + SGST)</MenuItem>
                        <MenuItem value="inter">Inter-State (IGST)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <FormControl fullWidth size="small">
                      <InputLabel sx={{ fontSize: '0.82rem' }}>Place of Supply *</InputLabel>
                      <Select value={invoice.placeOfSupply} label="Place of Supply *" name="placeOfSupply" onChange={handleInvoice} sx={{ borderRadius: 1.5 }}>
                        <MenuItem value=""><em>Select state</em></MenuItem>
                        {INDIAN_STATES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* 04 — Line Items */}
            <Card sx={{ borderRadius: 3, border: `1px solid ${colors.border.light}`, boxShadow: 'none', mb: 3 }}>
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <SectionHeading>Line Items</SectionHeading>

                <Box sx={{ display: { xs: 'none', md: 'grid' }, gridTemplateColumns: '2.5fr 0.9fr 0.7fr 0.7fr 0.7fr 0.9fr 36px', gap: 1, mb: 1 }}>
                  {['Description', 'HSN/SAC', 'Qty', 'Unit', 'Rate (₹)', 'GST %', ''].map((h) => (
                    <Typography key={h} variant="caption" sx={{ color: colors.text.muted, fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</Typography>
                  ))}
                </Box>

                <Stack spacing={1.5}>
                  {items.map((item, idx) => (
                    <Box key={item.id} sx={{ p: { xs: 2, md: 0 }, borderRadius: { xs: 2, md: 0 }, border: { xs: `1px solid ${colors.border.light}`, md: 'none' } }}>
                      <Typography sx={{ display: { xs: 'block', md: 'none' }, fontSize: '0.75rem', fontWeight: 700, color: colors.text.muted, mb: 1 }}>Item {idx + 1}</Typography>
                      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: '2.5fr 0.9fr 0.7fr 0.7fr 0.7fr 0.9fr 36px' }, gap: 1, alignItems: 'center' }}>
                        <Box sx={{ gridColumn: { xs: '1 / -1', md: 'auto' } }}>
                          <Field label="Description" value={item.description} onChange={(e) => handleItem(item.id, 'description', e.target.value)} />
                        </Box>
                        <Field label="HSN/SAC" value={item.hsn} onChange={(e) => handleItem(item.id, 'hsn', e.target.value)} />
                        <Field label="Qty" value={item.qty} onChange={(e) => handleItem(item.id, 'qty', e.target.value)} inputProps={{ inputMode: 'decimal' }} />
                        <Field label="Unit" value={item.unit} onChange={(e) => handleItem(item.id, 'unit', e.target.value)} />
                        <Field label="Rate" value={item.rate} onChange={(e) => handleItem(item.id, 'rate', e.target.value)} inputProps={{ inputMode: 'decimal' }} />
                        <FormControl size="small" fullWidth>
                          <InputLabel sx={{ fontSize: '0.82rem' }}>GST %</InputLabel>
                          <Select value={item.gstRate} label="GST %" onChange={(e) => handleItem(item.id, 'gstRate', e.target.value)} sx={{ borderRadius: 1.5 }}>
                            {GST_RATES.map((r) => <MenuItem key={r.value} value={r.value}>{r.value}%</MenuItem>)}
                          </Select>
                        </FormControl>
                        <Tooltip title="Remove item">
                          <IconButton size="small" onClick={() => removeItem(item.id)} disabled={items.length === 1}
                            sx={{ color: colors.text.muted, '&:hover': { color: '#dc2626' }, '&.Mui-disabled': { opacity: 0.3 } }}>
                            <Trash2 size={15} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                      {(item.qty && item.rate) && (
                        <Box sx={{ mt: 1, textAlign: { xs: 'left', md: 'right' } }}>
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

            {/* 05 — Discount */}
            <Card sx={{ borderRadius: 3, border: `1px solid ${colors.border.light}`, boxShadow: 'none', mb: 3 }}>
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <Stack direction="row" alignItems="center" gap={1} mb={2}>
                  <Tag size={14} style={{ color: colors.accent.primary }} />
                  <SectionHeading>Discount (optional)</SectionHeading>
                </Stack>
                <Grid container spacing={2} alignItems="flex-start">
                  <Grid item xs={12} sm={5}>
                    <Field
                      label={discount.type === 'percent' ? 'Discount (%)' : 'Discount (₹)'}
                      value={discount.value}
                      onChange={(e) => setDiscount((p) => ({ ...p, value: e.target.value }))}
                      inputProps={{ inputMode: 'decimal', 'aria-label': 'Discount value' }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <ToggleButtonGroup
                      value={discount.type}
                      exclusive
                      onChange={(_, v) => v && setDiscount((p) => ({ ...p, type: v }))}
                      size="small"
                      aria-label="Discount type"
                      sx={{
                        height: 40,
                        '& .MuiToggleButton-root': {
                          px: 2, fontWeight: 600, fontSize: '0.8rem', textTransform: 'none',
                          border: `1px solid ${colors.border.medium} !important`,
                          '&.Mui-selected': { backgroundColor: colors.accent.primary, color: '#fff', borderColor: `${colors.accent.primary} !important` },
                        },
                      }}
                    >
                      <ToggleButton value="flat" aria-label="Flat amount">₹ Flat</ToggleButton>
                      <ToggleButton value="percent" aria-label="Percentage">% Off</ToggleButton>
                    </ToggleButtonGroup>
                  </Grid>
                  {totals.discountAmount > 0 && (
                    <Grid item xs={12} sm={3}>
                      <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: '#fef2f2', border: '1px solid #fecaca', textAlign: 'center' }}>
                        <Typography variant="caption" sx={{ color: '#dc2626', fontWeight: 700, display: 'block', fontSize: '0.7rem' }}>Discount Applied</Typography>
                        <Typography sx={{ color: '#dc2626', fontWeight: 800, fontFamily: '"JetBrains Mono", monospace', fontSize: '0.95rem' }}>
                          - ₹{fmt(totals.discountAmount)}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>
                <Typography variant="caption" sx={{ color: colors.text.muted, mt: 1.5, display: 'block' }}>
                  Discount is applied on the sub-total (before GST). GST is then calculated on the discounted amount.
                </Typography>
              </CardContent>
            </Card>

            {/* 06 — Bank / Payment Details */}
            <Card sx={{ borderRadius: 3, border: `1px solid ${colors.border.light}`, boxShadow: 'none', mb: 3 }}>
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <SectionHeading>Bank / Payment Details (optional)</SectionHeading>
                <Typography variant="caption" sx={{ color: colors.text.muted, display: 'block', mb: 2 }}>
                  These details print on the invoice so your client knows where to send payment.
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}><Field label="Bank Name" name="name" value={bank.name} onChange={handleBank} /></Grid>
                  <Grid item xs={12} sm={6}><Field label="Account Number" name="account" value={bank.account} onChange={handleBank} /></Grid>
                  <Grid item xs={12} sm={4}><Field label="IFSC Code" name="ifsc" value={bank.ifsc} onChange={handleBank} inputProps={{ maxLength: 11 }} /></Grid>
                  <Grid item xs={12} sm={4}><Field label="Branch" name="branch" value={bank.branch} onChange={handleBank} /></Grid>
                  <Grid item xs={12} sm={4}><Field label="UPI ID" name="upi" value={bank.upi} onChange={handleBank} placeholder="e.g. name@upi" /></Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* 07 — Notes */}
            <Card sx={{ borderRadius: 3, border: `1px solid ${colors.border.light}`, boxShadow: 'none' }}>
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <SectionHeading>Notes / Terms</SectionHeading>
                <Field label="Notes or payment terms (optional)" name="notes" value={invoice.notes} onChange={handleInvoice} multiline rows={3} />
              </CardContent>
            </Card>
          </Grid>

          {/* ════ RIGHT COLUMN — Summary ════ */}
          <Grid item xs={12} lg={4}>
            <Card
              component={motion.div}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              sx={{ borderRadius: 3, border: `1.5px solid ${colors.border.accent}`, boxShadow: 'none', position: { lg: 'sticky' }, top: { lg: 100 } }}
            >
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <Typography variant="overline" sx={{ color: colors.accent.primary, fontWeight: 700, fontSize: '0.68rem', letterSpacing: '0.1em', display: 'block', mb: 2 }}>
                  Invoice Summary · Live
                </Typography>

                <Stack spacing={0.6}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: colors.text.secondary }}>Sub Total</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: '"JetBrains Mono", monospace' }}>₹ {fmt(totals.subTotal)}</Typography>
                  </Stack>

                  {/* Discount row */}
                  {totals.discountAmount > 0 && (
                    <>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" sx={{ color: '#dc2626' }}>
                          Discount{discount.type === 'percent' ? ` (${discount.value}%)` : ''}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#dc2626', fontFamily: '"JetBrains Mono", monospace' }}>
                          − ₹ {fmt(totals.discountAmount)}
                        </Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" sx={{ color: colors.text.secondary }}>Taxable Amount</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: '"JetBrains Mono", monospace' }}>₹ {fmt(totals.taxableAfterDiscount)}</Typography>
                      </Stack>
                    </>
                  )}

                  {/* Tax rows */}
                  {txnType === 'intra' && totals.totalCgst > 0 && (
                    <>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" sx={{ color: colors.text.secondary }}>CGST</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: '"JetBrains Mono", monospace' }}>₹ {fmt(totals.totalCgst)}</Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" sx={{ color: colors.text.secondary }}>SGST</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: '"JetBrains Mono", monospace' }}>₹ {fmt(totals.totalSgst)}</Typography>
                      </Stack>
                    </>
                  )}
                  {txnType === 'inter' && totals.totalIgst > 0 && (
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" sx={{ color: colors.text.secondary }}>IGST</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: '"JetBrains Mono", monospace' }}>₹ {fmt(totals.totalIgst)}</Typography>
                    </Stack>
                  )}

                  <Divider sx={{ my: 0.5 }} />
                  <Stack direction="row" justifyContent="space-between" sx={{ py: 0.5 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: colors.text.primary }}>Grand Total</Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: colors.accent.primary, fontFamily: '"JetBrains Mono", monospace' }}>₹ {fmt(totals.grandTotal)}</Typography>
                  </Stack>
                </Stack>

                {/* Amount in words */}
                {totals.grandTotal > 0 && (
                  <Box sx={{ mt: 1.5, p: 1.5, borderRadius: 2, backgroundColor: 'rgba(109,40,217,0.04)', border: `1px solid ${colors.border.accent}` }}>
                    <Typography variant="caption" sx={{ color: colors.text.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', mb: 0.5, fontSize: '0.65rem' }}>
                      Amount in Words
                    </Typography>
                    <Typography variant="caption" sx={{ color: colors.text.secondary, lineHeight: 1.6, fontStyle: 'italic' }}>
                      {fmtWords(totals.grandTotal)}
                    </Typography>
                  </Box>
                )}

                <Divider sx={{ my: 2 }} />

                {/* Per-item GST breakdown */}
                <Typography variant="caption" sx={{ color: colors.text.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', mb: 1.5 }}>
                  GST Breakdown
                </Typography>
                {items.map((item) => {
                  if (!item.qty || !item.rate || item.gstRate === 0) return null;
                  const { taxableAmount } = calcItem(item);
                  const discRatio = totals.subTotal > 0 ? totals.taxableAfterDiscount / totals.subTotal : 1;
                  const gstAmount = (taxableAmount * discRatio * item.gstRate) / 100;
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
                  sx={{ borderRadius: 2, fontWeight: 700, background: colors.accent.primary, color: '#fff', '&:hover': { background: colors.accent.primaryHover } }}>
                  Print / Save as PDF
                </Button>

                <Alert severity="info" icon={<Info size={14} />}
                  sx={{ mt: 2, borderRadius: 2, backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', '& .MuiAlert-icon': { color: '#0369a1' }, '& .MuiAlert-message': { fontSize: '0.75rem' } }}>
                  Use <strong>Ctrl+P</strong> → "Save as PDF". All data stays in your browser.
                </Alert>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Hidden print document */}
        <PrintDocument biz={biz} client={client} invoice={invoice} items={items} txnType={txnType} totals={totals} discount={discount} bank={bank} />
      </Container>
    </>
  );
};

export default InvoiceGenerator;
