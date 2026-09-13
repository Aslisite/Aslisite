import { useState, useCallback, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
  Stack,
  Chip,
  Tooltip,
  IconButton,
  Alert,
  Collapse,
  Card,
  CardContent,
  Grid,
  Button,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import {
  Calculator,
  Info,
  Copy,
  Check,
  RotateCcw,
  Printer,
  ChevronRight,
  ArrowLeft,
  TrendingDown,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { colors } from '../../theme/theme';
import { absoluteUrl, siteMetadata } from '../../seo/siteMetadata';
import { SectionBadge } from '../../components/common';

/* ─────────────────────────────────────────────
   GST 2.0 SLABS  (effective 22 Sep 2025)
   56th GST Council — simplified from 5 slabs to 4
   Removed: 12% and 28%
   New special slab: 40% (luxury / sin goods)
───────────────────────────────────────────── */
const GST_SLABS = [
  {
    rate: 0,
    label: '0% — Exempt',
    description: 'Essential food, medicines (33 life-saving drugs), insurance premiums, education supplies',
    examples: 'UHT milk, paneer, Indian bread, life-saving drugs, life & health insurance, exercise books',
    color: '#16a34a',
    bg: '#f0fdf4',
    border: '#bbf7d0',
  },
  {
    rate: 5,
    label: '5% — Merit Rate',
    description: 'FMCG, daily essentials, agriculture, healthcare devices, basic services',
    examples: 'Soaps, shampoos, packaged food, bicycles, tractors, hotel stays ≤₹7,500/day, gyms & salons',
    color: '#0369a1',
    bg: '#f0f9ff',
    border: '#bae6fd',
  },
  {
    rate: 18,
    label: '18% — Standard Rate',
    description: 'Consumer durables, automobiles, most services, construction materials',
    examples: 'ACs, TVs, refrigerators, small cars (≤1200cc), bikes (≤350cc), cement, apparel above ₹2,500',
    color: '#7c3aed',
    bg: '#f5f3ff',
    border: '#ddd6fe',
  },
  {
    rate: 40,
    label: '40% — Demerit / Luxury',
    description: 'Sin goods, luxury items — previously attracted GST + Cess (now merged into one rate)',
    examples: 'Carbonated drinks, caffeinated beverages, luxury & mid-size cars, tobacco, gutkha, cigarettes',
    color: '#dc2626',
    bg: '#fef2f2',
    border: '#fecaca',
  },
];

/* ─── Helpers ─── */
const fmt = (n) =>
  Number.isFinite(n)
    ? n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '0.00';

const fmtInt = (n) =>
  Number.isFinite(n) ? n.toLocaleString('en-IN', { maximumFractionDigits: 2 }) : '0';

const parseAmount = (val) => {
  const n = parseFloat(String(val).replace(/,/g, ''));
  return Number.isFinite(n) && n >= 0 ? n : null;
};

/* ─── Result Row ─── */
const ResultRow = ({ label, value, highlight, sub, dimmed }) => (
  <Stack
    direction="row"
    justifyContent="space-between"
    alignItems="baseline"
    sx={{
      py: highlight ? 1.25 : 0.85,
      px: highlight ? 1.5 : 0,
      mx: highlight ? -1.5 : 0,
      borderRadius: highlight ? 2 : 0,
      backgroundColor: highlight ? 'rgba(109,40,217,0.05)' : 'transparent',
    }}
  >
    <Typography
      variant={highlight ? 'subtitle2' : 'body2'}
      sx={{
        color: dimmed ? colors.text.muted : highlight ? colors.text.primary : colors.text.secondary,
        fontWeight: highlight ? 700 : 500,
        fontSize: sub ? '0.8rem' : undefined,
      }}
    >
      {label}
    </Typography>
    <Typography
      variant={highlight ? 'subtitle1' : 'body2'}
      sx={{
        color: dimmed ? colors.text.muted : highlight ? colors.accent.primary : colors.text.primary,
        fontWeight: highlight ? 800 : 600,
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: highlight ? '1.05rem' : sub ? '0.8rem' : undefined,
      }}
    >
      {value}
    </Typography>
  </Stack>
);

/* ─── Copy Button ─── */
const CopyBtn = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };
  return (
    <Tooltip title={copied ? 'Copied!' : 'Copy value'} placement="top">
      <IconButton size="small" onClick={handleCopy} sx={{ color: colors.text.muted, p: 0.5 }}>
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </IconButton>
    </Tooltip>
  );
};

/* ─── Slab Info Card ─── */
const SlabInfoCard = ({ slab }) => (
  <AnimatePresence mode="wait">
    <Box
      key={slab.rate}
      component={motion.div}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      sx={{
        p: 2,
        borderRadius: 2,
        backgroundColor: slab.bg,
        border: `1px solid ${slab.border}`,
      }}
    >
      <Stack direction="row" alignItems="flex-start" gap={1}>
        <Info size={15} style={{ color: slab.color, flexShrink: 0, marginTop: 2 }} />
        <Box>
          <Typography
            variant="caption"
            sx={{ color: slab.color, fontWeight: 700, display: 'block', mb: 0.3 }}
          >
            {slab.description}
          </Typography>
          <Typography variant="caption" sx={{ color: colors.text.secondary, lineHeight: 1.5 }}>
            <strong>Examples:</strong> {slab.examples}
          </Typography>
        </Box>
      </Stack>
    </Box>
  </AnimatePresence>
);

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
const GstCalculator = () => {
  const [amount, setAmount] = useState('');
  const [mode, setMode] = useState('exclusive'); // 'exclusive' = add GST | 'inclusive' = extract GST
  const [selectedRate, setSelectedRate] = useState(18);
  const [txnType, setTxnType] = useState('intra'); // 'intra' = CGST+SGST | 'inter' = IGST
  const [amountError, setAmountError] = useState('');
  const printRef = useRef(null);

  const slab = GST_SLABS.find((s) => s.rate === selectedRate);
  const parsedAmount = parseAmount(amount);
  const hasAmount = parsedAmount !== null && amount.trim() !== '';

  /* ─── Core calculations ─── */
  const calc = useCallback(() => {
    if (!hasAmount) return null;
    const base = parsedAmount;
    const rate = selectedRate;

    if (rate === 0) {
      return {
        baseAmount: base,
        gstAmount: 0,
        totalAmount: base,
        cgst: 0,
        sgst: 0,
        igst: 0,
        halfRate: 0,
      };
    }

    let baseAmount, gstAmount, totalAmount;

    if (mode === 'exclusive') {
      // Amount is pre-GST — add GST on top
      baseAmount = base;
      gstAmount = (base * rate) / 100;
      totalAmount = base + gstAmount;
    } else {
      // Amount is GST-inclusive — extract base and GST
      baseAmount = (base * 100) / (100 + rate);
      gstAmount = base - baseAmount;
      totalAmount = base;
    }

    const halfRate = rate / 2;
    const cgst = txnType === 'intra' ? gstAmount / 2 : 0;
    const sgst = txnType === 'intra' ? gstAmount / 2 : 0;
    const igst = txnType === 'inter' ? gstAmount : 0;

    return { baseAmount, gstAmount, totalAmount, cgst, sgst, igst, halfRate };
  }, [hasAmount, parsedAmount, selectedRate, mode, txnType]);

  const result = calc();

  const handleAmountChange = (e) => {
    const val = e.target.value;
    setAmount(val);
    if (val.trim() === '') { setAmountError(''); return; }
    const n = parseFloat(val);
    if (isNaN(n) || n < 0) setAmountError('Enter a valid positive amount');
    else setAmountError('');
  };

  const handleReset = () => {
    setAmount('');
    setAmountError('');
    setSelectedRate(18);
    setMode('exclusive');
    setTxnType('intra');
  };

  const handlePrint = () => window.print();

  const pageTitle = 'Free GST Calculator India 2025 | GST 2.0 Slabs (0%, 5%, 18%, 40%) | Aslisite';
  const pageDesc =
    'Free online GST calculator updated for GST 2.0 (effective 22 Sep 2025). Calculate GST-inclusive and GST-exclusive prices across all current slabs — 0%, 5%, 18%, and 40%. Shows CGST, SGST, and IGST breakdown.';

  return (
    <>
      {/* ─── Print-only styles ─── */}
      <style>{`
        @media print {
          .print-area-only { display: block !important; }
          @page { margin: 20mm; }
        }
        @media screen {
          .print-area-only { display: none; }
        }
      `}</style>

      <Container maxWidth="lg" className="tool-page-container" sx={{ pt: { xs: 16, md: 16 }, pb: { xs: 8, md: 12 } }}>
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageDesc} />
          <link rel="canonical" href={absoluteUrl('/tools/gst-calculator')} />
          <meta property="og:url" content={absoluteUrl('/tools/gst-calculator')} />
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
              '@id': `${absoluteUrl('/tools/gst-calculator')}#app`,
              url: absoluteUrl('/tools/gst-calculator'),
              name: 'Free GST Calculator — Aslisite',
              description: pageDesc,
              applicationCategory: 'FinanceApplication',
              operatingSystem: 'Any',
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
              publisher: { '@id': `${siteMetadata.baseUrl}/#organization` },
            })}
          </script>
        </Helmet>

        {/* ─── Breadcrumb ─── */}
        <Stack
          direction="row"
          alignItems="center"
          gap={0.5}
          sx={{ mb: 4 }}
          className="no-print"
        >
          <Box
            component={RouterLink}
            to="/tools"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              color: colors.text.muted,
              textDecoration: 'none',
              fontSize: '0.82rem',
              fontWeight: 500,
              '&:hover': { color: colors.accent.primary },
              transition: 'color 0.2s',
            }}
          >
            <ArrowLeft size={14} />
            Free Tools
          </Box>
          <ChevronRight size={13} style={{ color: colors.text.muted }} />
          <Typography sx={{ fontSize: '0.82rem', color: colors.text.secondary, fontWeight: 500 }}>
            GST Calculator
          </Typography>
        </Stack>

        {/* ─── Header ─── */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          sx={{ mb: { xs: 5, md: 6 } }}
          className="no-print"
        >
          <SectionBadge icon={Zap} label="GST 2.0 Updated — Effective 22 Sep 2025" />
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '1.9rem', sm: '2.5rem', md: '2.8rem' },
              fontWeight: 800,
              color: colors.text.primary,
              mt: 2,
              mb: 1.5,
              letterSpacing: '-0.03em',
            }}
          >
            Free GST Calculator
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ color: colors.text.secondary, maxWidth: 560, lineHeight: 1.7 }}
          >
            Calculate GST-inclusive and exclusive prices instantly. Covers all GST 2.0 slabs with
            CGST / SGST / IGST breakdown.
          </Typography>
        </Box>

        <Grid container spacing={{ xs: 3, md: 4 }} alignItems="flex-start">
          {/* ════════════════════════════════
              LEFT — Input Panel
          ════════════════════════════════ */}
          <Grid item xs={12} md={6} className="no-print">
            <Card
              component={motion.div}
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              sx={{ borderRadius: 3, border: `1px solid ${colors.border.light}`, boxShadow: 'none' }}
            >
              <CardContent sx={{ p: { xs: 3, md: 3.5 } }}>
                {/* Amount */}
                <Box sx={{ mb: 3.5 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: colors.text.primary, fontWeight: 700, mb: 1 }}
                  >
                    Amount (₹)
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="e.g. 10000"
                    value={amount}
                    onChange={handleAmountChange}
                    error={!!amountError}
                    helperText={amountError}
                    inputProps={{
                      inputMode: 'decimal',
                      'aria-label': 'Amount in rupees',
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: '1.1rem',
                        fontWeight: 600,
                      },
                    }}
                  />
                </Box>

                {/* Calculation Mode */}
                <Box sx={{ mb: 3.5 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: colors.text.primary, fontWeight: 700, mb: 1.5 }}
                  >
                    Calculation Type
                  </Typography>
                  <ToggleButtonGroup
                    value={mode}
                    exclusive
                    onChange={(_, v) => v && setMode(v)}
                    fullWidth
                    size="small"
                    aria-label="Calculation mode"
                    sx={{
                      '& .MuiToggleButton-root': {
                        borderRadius: '10px !important',
                        border: `1px solid ${colors.border.medium} !important`,
                        py: 1.2,
                        fontWeight: 600,
                        fontSize: '0.82rem',
                        color: colors.text.secondary,
                        textTransform: 'none',
                        gap: 0.8,
                        transition: 'all 0.2s ease',
                        '&.Mui-selected': {
                          backgroundColor: colors.accent.primary,
                          color: '#fff',
                          borderColor: `${colors.accent.primary} !important`,
                          '&:hover': { backgroundColor: colors.accent.primaryHover },
                        },
                        '&:not(.Mui-selected):hover': {
                          backgroundColor: 'rgba(109,40,217,0.04)',
                          borderColor: `${colors.accent.primary} !important`,
                        },
                      },
                      gap: 1,
                    }}
                  >
                    <ToggleButton value="exclusive" aria-label="Add GST to amount">
                      <TrendingUp size={15} />
                      Add GST
                    </ToggleButton>
                    <ToggleButton value="inclusive" aria-label="Extract GST from amount">
                      <TrendingDown size={15} />
                      Remove GST
                    </ToggleButton>
                  </ToggleButtonGroup>
                  <Typography
                    variant="caption"
                    sx={{ color: colors.text.muted, mt: 0.8, display: 'block' }}
                  >
                    {mode === 'exclusive'
                      ? 'Amount entered is pre-GST (base price) — GST will be added on top'
                      : 'Amount entered already includes GST — GST will be extracted from it'}
                  </Typography>
                </Box>

                {/* GST Slab */}
                <Box sx={{ mb: 3.5 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: colors.text.primary, fontWeight: 700, mb: 1.5 }}
                  >
                    GST Rate (GST 2.0)
                  </Typography>
                  <Stack spacing={1}>
                    {GST_SLABS.map((s) => (
                      <Box
                        key={s.rate}
                        onClick={() => setSelectedRate(s.rate)}
                        role="radio"
                        aria-checked={selectedRate === s.rate}
                        tabIndex={0}
                        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSelectedRate(s.rate)}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                          p: 1.5,
                          borderRadius: 2,
                          border: `1.5px solid ${selectedRate === s.rate ? s.color : colors.border.light}`,
                          backgroundColor: selectedRate === s.rate ? s.bg : 'transparent',
                          cursor: 'pointer',
                          transition: 'all 0.18s ease',
                          '&:hover': {
                            borderColor: s.color,
                            backgroundColor: s.bg,
                          },
                        }}
                      >
                        {/* Radio dot */}
                        <Box
                          sx={{
                            width: 18,
                            height: 18,
                            borderRadius: '50%',
                            border: `2px solid ${selectedRate === s.rate ? s.color : colors.border.medium}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            transition: 'border-color 0.18s',
                          }}
                        >
                          {selectedRate === s.rate && (
                            <Box
                              sx={{
                                width: 9,
                                height: 9,
                                borderRadius: '50%',
                                backgroundColor: s.color,
                              }}
                            />
                          )}
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 700,
                              color: selectedRate === s.rate ? s.color : colors.text.primary,
                              fontSize: '0.88rem',
                            }}
                          >
                            {s.label}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </Box>

                {/* Slab Info */}
                <Box sx={{ mb: 3.5 }}>
                  <SlabInfoCard slab={slab} />
                </Box>

                {/* Transaction Type */}
                {selectedRate > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: colors.text.primary, fontWeight: 700, mb: 1.5 }}
                    >
                      Transaction Type
                    </Typography>
                    <ToggleButtonGroup
                      value={txnType}
                      exclusive
                      onChange={(_, v) => v && setTxnType(v)}
                      fullWidth
                      size="small"
                      aria-label="Transaction type"
                      sx={{
                        '& .MuiToggleButton-root': {
                          borderRadius: '10px !important',
                          border: `1px solid ${colors.border.medium} !important`,
                          py: 1.1,
                          fontWeight: 600,
                          fontSize: '0.82rem',
                          color: colors.text.secondary,
                          textTransform: 'none',
                          transition: 'all 0.2s ease',
                          '&.Mui-selected': {
                            backgroundColor: colors.accent.primary,
                            color: '#fff',
                            borderColor: `${colors.accent.primary} !important`,
                          },
                          '&:not(.Mui-selected):hover': {
                            backgroundColor: 'rgba(109,40,217,0.04)',
                          },
                        },
                        gap: 1,
                      }}
                    >
                      <ToggleButton value="intra" aria-label="Intra-state transaction">
                        Intra-State (CGST + SGST)
                      </ToggleButton>
                      <ToggleButton value="inter" aria-label="Inter-state transaction">
                        Inter-State (IGST)
                      </ToggleButton>
                    </ToggleButtonGroup>
                    <Typography
                      variant="caption"
                      sx={{ color: colors.text.muted, mt: 0.8, display: 'block' }}
                    >
                      {txnType === 'intra'
                        ? 'Buyer and seller are in the same state — split equally into CGST & SGST'
                        : 'Buyer and seller are in different states — single IGST applies'}
                    </Typography>
                  </Box>
                )}

                {/* Reset */}
                <Button
                  variant="outlined"
                  size="small"
                  fullWidth
                  startIcon={<RotateCcw size={14} />}
                  onClick={handleReset}
                  sx={{
                    mt: 1,
                    borderRadius: 2,
                    color: colors.text.muted,
                    borderColor: colors.border.medium,
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: colors.accent.primary,
                      color: colors.accent.primary,
                      backgroundColor: 'rgba(109,40,217,0.04)',
                    },
                  }}
                >
                  Reset
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* ════════════════════════════════
              RIGHT — Results Panel
          ════════════════════════════════ */}
          <Grid item xs={12} md={6}>
            <Box
              component={motion.div}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              {/* Empty state */}
              {!hasAmount && (
                <Card
                  sx={{
                    borderRadius: 3,
                    border: `1px dashed ${colors.border.medium}`,
                    boxShadow: 'none',
                    backgroundColor: '#fafafa',
                  }}
                >
                  <CardContent
                    sx={{
                      p: { xs: 4, md: 5 },
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 1.5,
                    }}
                  >
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 3,
                        backgroundColor: 'rgba(109,40,217,0.07)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: colors.accent.primary,
                      }}
                    >
                      <Calculator size={26} strokeWidth={1.5} />
                    </Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: colors.text.primary }}>
                      Enter an amount to calculate
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.text.muted, maxWidth: 280 }}>
                      Your GST breakdown will appear here — base amount, tax, and total with CGST / SGST
                      or IGST split.
                    </Typography>
                  </CardContent>
                </Card>
              )}

              {/* Results */}
              {hasAmount && result && (
                <AnimatePresence mode="wait">
                  <Box
                    component={motion.div}
                    key={`${amount}-${selectedRate}-${mode}-${txnType}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    ref={printRef}
                  >
                    {/* ── Main result card ── */}
                    <Card
                      sx={{
                        borderRadius: 3,
                        border: `1.5px solid ${slab.border}`,
                        backgroundColor: slab.bg,
                        boxShadow: 'none',
                        mb: 2,
                      }}
                    >
                      <CardContent sx={{ p: { xs: 3, md: 3.5 } }}>
                        {/* Print header */}
                        <Box
                          className="print-area-only"
                          sx={{ mb: 3, pb: 2, borderBottom: `1px solid ${colors.border.light}` }}
                        >
                          <Typography variant="h5" sx={{ fontWeight: 800, color: colors.text.primary }}>
                            GST Calculation Summary
                          </Typography>
                          <Typography variant="caption" sx={{ color: colors.text.muted }}>
                            Generated via aslisite.com/tools/gst-calculator
                          </Typography>
                        </Box>

                        {/* Rate badge */}
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2.5}>
                          <Chip
                            label={`${selectedRate}% GST`}
                            size="small"
                            sx={{
                              backgroundColor: slab.color,
                              color: '#fff',
                              fontWeight: 800,
                              fontSize: '0.8rem',
                              height: 26,
                            }}
                          />
                          <Stack direction="row" gap={0.5} className="no-print">
                            <Tooltip title="Print / Save as PDF">
                              <IconButton
                                size="small"
                                onClick={handlePrint}
                                sx={{ color: colors.text.muted, p: 0.75, '&:hover': { color: colors.accent.primary } }}
                                aria-label="Print or save as PDF"
                              >
                                <Printer size={16} />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </Stack>

                        {/* Breakdown */}
                        <Stack divider={<Divider sx={{ borderColor: `${slab.border}` }} />} spacing={0}>
                          <ResultRow
                            label={mode === 'exclusive' ? 'Base Amount (Pre-GST)' : 'Base Amount (Extracted)'}
                            value={`₹ ${fmt(result.baseAmount)}`}
                          />

                          {selectedRate === 0 ? (
                            <ResultRow label="GST Amount" value="₹ 0.00" dimmed />
                          ) : txnType === 'intra' ? (
                            <>
                              <ResultRow
                                label={`CGST @ ${result.halfRate}%`}
                                value={`₹ ${fmt(result.cgst)}`}
                                sub
                              />
                              <ResultRow
                                label={`SGST @ ${result.halfRate}%`}
                                value={`₹ ${fmt(result.sgst)}`}
                                sub
                              />
                              <ResultRow
                                label={`Total GST (${selectedRate}%)`}
                                value={`₹ ${fmt(result.gstAmount)}`}
                              />
                            </>
                          ) : (
                            <>
                              <ResultRow
                                label={`IGST @ ${selectedRate}%`}
                                value={`₹ ${fmt(result.igst)}`}
                              />
                            </>
                          )}

                          <ResultRow
                            label={mode === 'exclusive' ? 'Total Amount (Incl. GST)' : 'Total (GST-Inclusive)'}
                            value={`₹ ${fmt(result.totalAmount)}`}
                            highlight
                          />
                        </Stack>

                        {/* Copy row */}
                        {selectedRate > 0 && (
                          <Box
                            sx={{
                              mt: 2.5,
                              pt: 2,
                              borderTop: `1px solid ${slab.border}`,
                              display: 'flex',
                              flexWrap: 'wrap',
                              gap: 1,
                            }}
                            className="no-print"
                          >
                            {[
                              { label: 'Base', val: fmt(result.baseAmount) },
                              { label: 'GST', val: fmt(result.gstAmount) },
                              { label: 'Total', val: fmt(result.totalAmount) },
                            ].map(({ label, val }) => (
                              <Stack
                                key={label}
                                direction="row"
                                alignItems="center"
                                gap={0.5}
                                sx={{
                                  px: 1.5,
                                  py: 0.6,
                                  borderRadius: 1.5,
                                  border: `1px solid ${slab.border}`,
                                  backgroundColor: 'rgba(255,255,255,0.7)',
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  sx={{ color: colors.text.muted, fontWeight: 600, fontSize: '0.72rem' }}
                                >
                                  {label}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    fontFamily: '"JetBrains Mono", monospace',
                                    fontWeight: 700,
                                    color: colors.text.primary,
                                    fontSize: '0.75rem',
                                  }}
                                >
                                  ₹{val}
                                </Typography>
                                <CopyBtn text={val} />
                              </Stack>
                            ))}
                          </Box>
                        )}
                      </CardContent>
                    </Card>

                    {/* ── Reverse calc card ── */}
                    {selectedRate > 0 && (
                      <Card
                        sx={{
                          borderRadius: 3,
                          border: `1px solid ${colors.border.light}`,
                          boxShadow: 'none',
                          mb: 2,
                        }}
                      >
                        <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                          <Typography
                            variant="caption"
                            sx={{
                              color: colors.text.muted,
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              letterSpacing: '0.06em',
                              display: 'block',
                              mb: 1.5,
                            }}
                          >
                            Quick Reference
                          </Typography>
                          <Stack spacing={0.5}>
                            <Stack direction="row" justifyContent="space-between">
                              <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                                GST as % of base
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  fontFamily: '"JetBrains Mono", monospace',
                                  fontWeight: 700,
                                  color: colors.text.primary,
                                }}
                              >
                                {fmtInt(selectedRate)}%
                              </Typography>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between">
                              <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                                GST as % of total
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  fontFamily: '"JetBrains Mono", monospace',
                                  fontWeight: 700,
                                  color: colors.text.primary,
                                }}
                              >
                                {fmt((selectedRate / (100 + selectedRate)) * 100)}%
                              </Typography>
                            </Stack>
                            {txnType === 'intra' && (
                              <Stack direction="row" justifyContent="space-between">
                                <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                                  Each of CGST / SGST
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    fontFamily: '"JetBrains Mono", monospace',
                                    fontWeight: 700,
                                    color: colors.text.primary,
                                  }}
                                >
                                  {fmtInt(selectedRate / 2)}%
                                </Typography>
                              </Stack>
                            )}
                          </Stack>
                        </CardContent>
                      </Card>
                    )}
                  </Box>
                </AnimatePresence>
              )}
            </Box>
          </Grid>
        </Grid>

        {/* ═══════════════════════════
            GST 2.0 Info Section
        ═══════════════════════════ */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.3 }}
          sx={{ mt: { xs: 8, md: 10 } }}
          className="no-print"
        >
          <Divider sx={{ mb: { xs: 6, md: 8 } }} />

          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <SectionBadge icon={Info} label="What Changed in GST 2.0" />
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1.5rem', md: '1.9rem' },
                fontWeight: 800,
                color: colors.text.primary,
                mt: 2,
                mb: 1,
                letterSpacing: '-0.03em',
              }}
            >
              Understanding the New GST Structure
            </Typography>
            <Typography variant="body2" sx={{ color: colors.text.secondary, maxWidth: 540, mx: 'auto' }}>
              India's biggest GST overhaul since 2017. The 56th GST Council meeting (Sep 3, 2025)
              simplified the structure from five slabs to four, effective 22 Sep 2025.
            </Typography>
          </Box>

          <Grid container spacing={2.5}>
            {GST_SLABS.map((s) => (
              <Grid item xs={12} sm={6} md={3} key={s.rate}>
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: 3,
                    border: `1.5px solid ${s.border}`,
                    backgroundColor: s.bg,
                    boxShadow: 'none',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: `0 8px 24px ${s.border}`,
                    },
                  }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 900,
                        color: s.color,
                        fontSize: '2rem',
                        lineHeight: 1,
                        mb: 0.5,
                        fontFamily: '"JetBrains Mono", monospace',
                      }}
                    >
                      {s.rate}%
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: s.color,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        display: 'block',
                        mb: 1.5,
                        fontSize: '0.68rem',
                      }}
                    >
                      {s.label.split('—')[1]?.trim()}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: colors.text.secondary, fontSize: '0.8rem', lineHeight: 1.65, mb: 1.5 }}
                    >
                      {s.description}
                    </Typography>
                    <Divider sx={{ borderColor: s.border, mb: 1.5 }} />
                    <Typography variant="caption" sx={{ color: colors.text.muted, lineHeight: 1.6 }}>
                      <strong style={{ color: colors.text.secondary }}>Includes:</strong> {s.examples}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* What changed */}
          <Card
            sx={{
              mt: 3,
              borderRadius: 3,
              border: `1px solid ${colors.border.light}`,
              boxShadow: 'none',
              background: 'linear-gradient(135deg, rgba(109,40,217,0.03) 0%, rgba(13,148,136,0.03) 100%)',
            }}
          >
            <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 800, color: colors.text.primary, mb: 2 }}
              >
                What changed in GST 2.0?
              </Typography>
              <Grid container spacing={2}>
                {[
                  {
                    old: '12% slab',
                    new: 'Moved to 5%',
                    note: 'Most items at 12% shifted down to 5% — butter, ghee, pasta, shampoos, medical devices',
                    good: true,
                  },
                  {
                    old: '28% slab',
                    new: 'Moved to 18%',
                    note: 'Consumer durables like ACs, TVs, refrigerators, small cars now at 18%',
                    good: true,
                  },
                  {
                    old: '28% + Cess',
                    new: 'Merged into 40%',
                    note: 'Luxury & sin goods — GST + Compensation Cess merged into single 40% rate',
                    good: false,
                  },
                  {
                    old: '18% (Insurance)',
                    new: '0% (Exempt)',
                    note: 'Life and health insurance premiums now fully exempt from GST',
                    good: true,
                  },
                ].map((item, i) => (
                  <Grid item xs={12} sm={6} key={i}>
                    <Stack direction="row" gap={1.5} alignItems="flex-start">
                      <Box
                        sx={{
                          mt: 0.4,
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: item.good ? '#16a34a' : '#dc2626',
                          flexShrink: 0,
                        }}
                      />
                      <Box>
                        <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap">
                          <Chip
                            label={item.old}
                            size="small"
                            sx={{
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              backgroundColor: '#fee2e2',
                              color: '#dc2626',
                              height: 20,
                              textDecoration: 'line-through',
                            }}
                          />
                          <Typography variant="caption" sx={{ color: colors.text.muted }}>→</Typography>
                          <Chip
                            label={item.new}
                            size="small"
                            sx={{
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              backgroundColor: item.good ? '#dcfce7' : '#fef2f2',
                              color: item.good ? '#16a34a' : '#dc2626',
                              height: 20,
                            }}
                          />
                        </Stack>
                        <Typography
                          variant="caption"
                          sx={{ color: colors.text.muted, mt: 0.5, display: 'block', lineHeight: 1.5 }}
                        >
                          {item.note}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          {/* FAQ */}
          <Box sx={{ mt: { xs: 6, md: 8 } }}>
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: '1.3rem', md: '1.6rem' },
                fontWeight: 800,
                color: colors.text.primary,
                mb: 3,
                letterSpacing: '-0.02em',
              }}
            >
              Frequently Asked Questions
            </Typography>
            <Stack spacing={2}>
              {[
                {
                  q: 'When did GST 2.0 come into effect?',
                  a: 'The new GST structure became effective on 22 September 2025, following the 56th GST Council meeting held on 3 September 2025.',
                },
                {
                  q: 'What happened to the 12% and 28% GST slabs?',
                  a: 'Both slabs were eliminated. Most goods previously at 12% moved to 5%. Goods at 28% moved to 18% (consumer durables) or to the new 40% demerit slab (luxury/sin goods).',
                },
                {
                  q: 'What is the difference between CGST, SGST, and IGST?',
                  a: 'For intra-state transactions (buyer and seller in same state), GST is split equally into CGST (Central GST) and SGST (State GST). For inter-state transactions, a single IGST (Integrated GST) applies at the full rate.',
                },
                {
                  q: 'What does "Add GST" vs "Remove GST" mean?',
                  a: '"Add GST" (exclusive): your entered amount is the base price before tax — GST is calculated on top. "Remove GST" (inclusive): your entered amount already includes GST — the calculator extracts the base price and tax component.',
                },
                {
                  q: 'Is insurance still taxed under GST 2.0?',
                  a: 'No. Both life insurance and health insurance premiums are fully exempt (0% GST) under GST 2.0, down from 18% previously.',
                },
                {
                  q: 'Why is the 40% slab called a "special rate"?',
                  a: 'Previously, luxury and sin goods attracted 28% GST plus an additional Compensation Cess. Under GST 2.0, these two charges were merged into a single 40% rate, keeping the effective tax burden similar but simpler.',
                },
              ].map(({ q, a }, i) => (
                <Card
                  key={i}
                  sx={{ borderRadius: 2.5, border: `1px solid ${colors.border.light}`, boxShadow: 'none' }}
                >
                  <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 700, color: colors.text.primary, mb: 1 }}
                    >
                      {q}
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.text.secondary, lineHeight: 1.7 }}>
                      {a}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Box>

          {/* CTA */}
          <Card
            sx={{
              mt: { xs: 6, md: 8 },
              borderRadius: 3,
              border: `1px solid ${colors.border.accent}`,
              background: 'linear-gradient(135deg, rgba(109,40,217,0.05) 0%, rgba(13,148,136,0.04) 100%)',
              boxShadow: 'none',
            }}
          >
            <CardContent
              sx={{
                p: { xs: 3, md: 4 },
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontSize: { xs: '1.2rem', md: '1.5rem' },
                  fontWeight: 800,
                  color: colors.text.primary,
                }}
              >
                Need GST Invoices too?
              </Typography>
              <Typography variant="body2" sx={{ color: colors.text.secondary, maxWidth: 440 }}>
                Use our free Invoice Generator to create professional GST invoices with automatic
                tax calculations. No login or payment required.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} gap={1.5} flexWrap="wrap" justifyContent="center">
                <Button
                  component={RouterLink}
                  to="/tools/invoice-generator"
                  variant="contained"
                  endIcon={<ChevronRight size={16} />}
                  sx={{
                    borderRadius: 2,
                    fontWeight: 700,
                    background: colors.accent.primary,
                    color: '#fff',
                    px: 3,
                    '&:hover': { background: colors.accent.primaryHover },
                  }}
                >
                  Free Invoice Generator
                </Button>
                <Button
                  component={RouterLink}
                  to="/tools"
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    fontWeight: 600,
                    borderColor: colors.border.medium,
                    color: colors.text.secondary,
                    px: 3,
                    '&:hover': { borderColor: colors.accent.primary, color: colors.accent.primary },
                  }}
                >
                  All Free Tools
                </Button>
              </Stack>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <Alert
            severity="info"
            sx={{
              mt: 4,
              borderRadius: 2,
              backgroundColor: '#f0f9ff',
              border: `1px solid #bae6fd`,
              '& .MuiAlert-icon': { color: '#0369a1' },
            }}
          >
            <Typography variant="caption" sx={{ color: colors.text.secondary, lineHeight: 1.6 }}>
              <strong>Disclaimer:</strong> This calculator is based on the GST 2.0 structure effective
              22 September 2025. Always verify with a qualified CA or the official GSTN portal for
              compliance. Rates for some goods (e.g., tobacco, beedi) may differ as phased
              notifications are issued.
            </Typography>
          </Alert>
        </Box>
      </Container>
    </>
  );
};

export default GstCalculator;
