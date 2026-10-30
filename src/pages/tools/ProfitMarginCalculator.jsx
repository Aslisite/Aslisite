import heroHeading from '../../theme/heroHeading';
import { useState, useCallback } from 'react';
import {
  Box, Container, Typography, TextField, Grid, Card, CardContent,
  Stack, Button, Divider, Tooltip, IconButton, ToggleButton,
  ToggleButtonGroup, Chip, Alert,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import {
  TrendingUp, RotateCcw, Copy, Check, ArrowLeft,
  ChevronRight, Info, Calculator, Percent,
} from 'lucide-react';
import { colors } from '../../theme/theme';
import { absoluteUrl, siteMetadata } from '../../seo/siteMetadata';
import { SectionBadge } from '../../components/common';

/* ─── Helpers ─── */
const fmt = (n, dec = 2) =>
  Number.isFinite(n)
    ? n.toLocaleString('en-IN', { minimumFractionDigits: dec, maximumFractionDigits: dec })
    : '—';

const fmtCur = (n) =>
  Number.isFinite(n)
    ? '₹ ' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '—';

const pct = (n) => (Number.isFinite(n) ? fmt(n) + '%' : '—');

/* ─── Copy Button ─── */
const CopyBtn = ({ text }) => {
  const [copied, setCopied] = useState(false);
  return (
    <Tooltip title={copied ? 'Copied!' : 'Copy'} placement="top">
      <IconButton size="small" onClick={() => {
        navigator.clipboard.writeText(String(text));
        setCopied(true); setTimeout(() => setCopied(false), 1600);
      }} sx={{ color: colors.text.muted, p: 0.4 }}>
        {copied ? <Check size={13} /> : <Copy size={13} />}
      </IconButton>
    </Tooltip>
  );
};

/* ─── Result row ─── */
const Row = ({ label, value, highlight, color }) => (
  <Stack direction="row" justifyContent="space-between" alignItems="center"
    sx={{ py: highlight ? 1.1 : 0.75, px: highlight ? 1.5 : 0, mx: highlight ? -1.5 : 0,
      borderRadius: highlight ? 2 : 0, backgroundColor: highlight ? 'rgba(109,40,217,0.05)' : 'transparent' }}>
    <Typography variant="body2" sx={{ color: colors.text.secondary, fontWeight: highlight ? 700 : 500 }}>{label}</Typography>
    <Stack direction="row" alignItems="center" gap={0.5}>
      <Typography variant="body2" sx={{ fontWeight: highlight ? 800 : 600, color: color || (highlight ? colors.accent.primary : colors.text.primary), fontFamily: '"JetBrains Mono", monospace', fontSize: highlight ? '1rem' : '0.875rem' }}>
        {value}
      </Typography>
      {highlight && <CopyBtn text={String(value).replace(/[₹\s,]/g, '')} />}
    </Stack>
  </Stack>
);

/* ════════════════════
   MAIN
════════════════════ */
const ProfitMarginCalculator = () => {
  const [mode, setMode] = useState('margin'); // margin | markup | selling
  const [cost, setCost] = useState('');
  const [selling, setSelling] = useState('');
  const [marginPct, setMarginPct] = useState('');
  const [markupPct, setMarkupPct] = useState('');

  const c = parseFloat(cost) || 0;
  const s = parseFloat(selling) || 0;
  const mp = parseFloat(marginPct) || 0;
  const mu = parseFloat(markupPct) || 0;

  /* ─── Derived results per mode ─── */
  const result = useCallback(() => {
    if (mode === 'margin') {
      // Know cost + selling price → compute margin, markup, profit
      if (!c || !s || s < c) return null;
      const profit = s - c;
      const margin = (profit / s) * 100;
      const markup = (profit / c) * 100;
      return { profit, margin, markup, sellingPrice: s, cost: c };
    }
    if (mode === 'markup') {
      // Know cost + markup% → compute selling, margin, profit
      if (!c || !mu) return null;
      const sp = c * (1 + mu / 100);
      const profit = sp - c;
      const margin = (profit / sp) * 100;
      return { profit, margin, markup: mu, sellingPrice: sp, cost: c };
    }
    if (mode === 'selling') {
      // Know cost + desired margin% → compute selling price
      if (!c || !mp || mp >= 100) return null;
      const sp = c / (1 - mp / 100);
      const profit = sp - c;
      const markup = (profit / c) * 100;
      return { profit, margin: mp, markup, sellingPrice: sp, cost: c };
    }
    return null;
  }, [mode, c, s, mp, mu])();

  const handleReset = () => { setCost(''); setSelling(''); setMarginPct(''); setMarkupPct(''); };

  const pageTitle = 'Free Profit Margin & Markup Calculator India | Aslisite';
  const pageDesc = 'Calculate profit margin, markup percentage, and selling price instantly. Free online profit calculator for Indian businesses — supports margin-to-price and markup-to-price modes.';

  return (
    <Container maxWidth="lg" className="tool-page-container" sx={{ pt: { xs: 16, md: 16 }, pb: { xs: 8, md: 12 } }}>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={absoluteUrl('/tools/profit-margin-calculator')} />
        <meta property="og:url" content={absoluteUrl('/tools/profit-margin-calculator')} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:image" content={siteMetadata.logo} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <script type="application/ld+json">{JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebApplication', '@id': `${absoluteUrl('/tools/profit-margin-calculator')}#app`, url: absoluteUrl('/tools/profit-margin-calculator'), name: 'Free Profit Margin Calculator — Aslisite', description: pageDesc, applicationCategory: 'FinanceApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' }, publisher: { '@id': `${siteMetadata.baseUrl}/#organization` } })}</script>
      </Helmet>

      {/* Breadcrumb */}
      <Stack direction="row" alignItems="center" gap={0.5} sx={{ mb: 4 }}>
        <Box component={RouterLink} to="/tools" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: colors.text.muted, textDecoration: 'none', fontSize: '0.82rem', fontWeight: 500, '&:hover': { color: colors.accent.primary }, transition: 'color 0.2s' }}>
          <ArrowLeft size={14} />Free Tools
        </Box>
        <ChevronRight size={13} style={{ color: colors.text.muted }} />
        <Typography sx={{ fontSize: '0.82rem', color: colors.text.secondary, fontWeight: 500 }}>Profit Margin Calculator</Typography>
      </Stack>

      {/* Header */}
      <Box component={motion.div} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} sx={{ mb: { xs: 5, md: 6 } }}>
        <SectionBadge icon={TrendingUp} label="Free Profit & Markup Calculator" />
        <Typography variant="h1" sx={{
              ...heroHeading,
              color: colors.text.primary,
              mt: 2,
              mb: 1.5,
            }}>
          Profit Margin & Markup Calculator
        </Typography>
        <Typography variant="subtitle1" sx={{ color: colors.text.secondary, maxWidth: 560, lineHeight: 1.7 }}>
          Calculate profit margin, markup percentage, or the ideal selling price from your cost — instantly.
        </Typography>
      </Box>

      <Grid container spacing={{ xs: 3, md: 4 }} alignItems="flex-start">
        {/* Input */}
        <Grid item xs={12} md={6}>
          <Card component={motion.div} initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            sx={{ borderRadius: 3, border: `1px solid ${colors.border.light}`, boxShadow: 'none' }}>
            <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
              {/* Mode selector */}
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: colors.text.primary, mb: 1.5 }}>What do you want to calculate?</Typography>
              <ToggleButtonGroup value={mode} exclusive onChange={(_, v) => v && setMode(v)} fullWidth size="small" sx={{ mb: 3,
                '& .MuiToggleButton-root': { borderRadius: '10px !important', border: `1px solid ${colors.border.medium} !important`, py: 1.1, fontWeight: 600, fontSize: '0.78rem', textTransform: 'none',
                  '&.Mui-selected': { backgroundColor: colors.accent.primary, color: '#fff', borderColor: `${colors.accent.primary} !important` } } }}>
                <ToggleButton value="margin">Margin & Markup</ToggleButton>
                <ToggleButton value="markup">Selling Price (Markup)</ToggleButton>
                <ToggleButton value="selling">Selling Price (Margin)</ToggleButton>
              </ToggleButtonGroup>

              {/* Cost — always shown */}
              <Box sx={{ mb: 2.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: colors.text.primary, mb: 1 }}>Cost Price (₹) *</Typography>
                <TextField fullWidth size="small" placeholder="e.g. 500" value={cost} onChange={(e) => setCost(e.target.value)}
                  inputProps={{ inputMode: 'decimal' }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontFamily: '"JetBrains Mono", monospace', fontWeight: 600 } }} />
              </Box>

              {/* Selling price — mode: margin */}
              {mode === 'margin' && (
                <Box sx={{ mb: 2.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: colors.text.primary, mb: 1 }}>Selling Price (₹) *</Typography>
                  <TextField fullWidth size="small" placeholder="e.g. 750" value={selling} onChange={(e) => setSelling(e.target.value)}
                    inputProps={{ inputMode: 'decimal' }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontFamily: '"JetBrains Mono", monospace', fontWeight: 600 } }} />
                  {s > 0 && s <= c && <Typography variant="caption" sx={{ color: '#dc2626', mt: 0.5, display: 'block' }}>Selling price must be greater than cost price</Typography>}
                </Box>
              )}

              {/* Markup % — mode: markup */}
              {mode === 'markup' && (
                <Box sx={{ mb: 2.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: colors.text.primary, mb: 1 }}>Markup % *</Typography>
                  <TextField fullWidth size="small" placeholder="e.g. 40" value={markupPct} onChange={(e) => setMarkupPct(e.target.value)}
                    inputProps={{ inputMode: 'decimal' }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontFamily: '"JetBrains Mono", monospace', fontWeight: 600 } }} />
                  <Typography variant="caption" sx={{ color: colors.text.muted, mt: 0.5, display: 'block' }}>Markup = profit as % of cost price</Typography>
                </Box>
              )}

              {/* Desired margin % — mode: selling */}
              {mode === 'selling' && (
                <Box sx={{ mb: 2.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: colors.text.primary, mb: 1 }}>Desired Profit Margin % *</Typography>
                  <TextField fullWidth size="small" placeholder="e.g. 30" value={marginPct} onChange={(e) => setMarginPct(e.target.value)}
                    inputProps={{ inputMode: 'decimal' }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontFamily: '"JetBrains Mono", monospace', fontWeight: 600 } }} />
                  <Typography variant="caption" sx={{ color: colors.text.muted, mt: 0.5, display: 'block' }}>Margin = profit as % of selling price (must be &lt; 100%)</Typography>
                </Box>
              )}

              <Button variant="outlined" size="small" startIcon={<RotateCcw size={13} />} onClick={handleReset}
                sx={{ borderRadius: 2, fontSize: '0.8rem', fontWeight: 600, textTransform: 'none', borderColor: colors.border.medium, color: colors.text.muted, '&:hover': { borderColor: colors.accent.primary, color: colors.accent.primary } }}>
                Reset
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Results */}
        <Grid item xs={12} md={6}>
          <Box component={motion.div} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
            {!result ? (
              <Card sx={{ borderRadius: 3, border: `1px dashed ${colors.border.medium}`, boxShadow: 'none', backgroundColor: '#fafafa' }}>
                <CardContent sx={{ p: { xs: 4, md: 5 }, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ width: 52, height: 52, borderRadius: 3, backgroundColor: 'rgba(109,40,217,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.accent.primary }}>
                    <Calculator size={24} strokeWidth={1.5} />
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: colors.text.primary }}>Enter your values</Typography>
                  <Typography variant="body2" sx={{ color: colors.text.muted, maxWidth: 260 }}>Your profit, margin, and markup will appear here.</Typography>
                </CardContent>
              </Card>
            ) : (
              <AnimatePresence mode="wait">
                <Box component={motion.div} key={JSON.stringify(result)} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.28 }}>
                  {/* Main result */}
                  <Card sx={{ borderRadius: 3, border: `1.5px solid ${colors.border.accent}`, boxShadow: 'none', mb: 2 }}>
                    <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                      <Typography variant="overline" sx={{ color: colors.accent.primary, fontWeight: 700, fontSize: '0.68rem', letterSpacing: '0.1em', display: 'block', mb: 2 }}>Results</Typography>
                      <Stack divider={<Divider />} spacing={0}>
                        <Row label="Cost Price" value={fmtCur(result.cost)} />
                        <Row label="Selling Price" value={fmtCur(result.sellingPrice)} highlight />
                        <Row label="Profit" value={fmtCur(result.profit)} color="#16a34a" />
                        <Row label="Profit Margin" value={pct(result.margin)} highlight />
                        <Row label="Markup" value={pct(result.markup)} />
                      </Stack>
                    </CardContent>
                  </Card>

                  {/* Context card */}
                  <Card sx={{ borderRadius: 3, border: `1px solid ${colors.border.light}`, boxShadow: 'none' }}>
                    <CardContent sx={{ p: 2.5 }}>
                      <Typography variant="caption" sx={{ color: colors.text.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', mb: 1.5 }}>
                        Quick Reference
                      </Typography>
                      <Stack spacing={0.75}>
                        {[
                          { label: 'Margin formula', val: 'Profit ÷ Selling Price × 100' },
                          { label: 'Markup formula', val: 'Profit ÷ Cost Price × 100' },
                          { label: 'For every ₹100 sold', val: `₹${fmt(result.margin)} is profit` },
                          { label: 'For every ₹100 spent', val: `₹${fmt(result.markup)} is earned back` },
                        ].map(({ label, val }) => (
                          <Stack key={label} direction="row" justifyContent="space-between" gap={2}>
                            <Typography variant="caption" sx={{ color: colors.text.muted }}>{label}</Typography>
                            <Typography variant="caption" sx={{ color: colors.text.primary, fontWeight: 600, textAlign: 'right' }}>{val}</Typography>
                          </Stack>
                        ))}
                      </Stack>
                    </CardContent>
                  </Card>
                </Box>
              </AnimatePresence>
            )}
          </Box>
        </Grid>
      </Grid>

      {/* Explainer */}
      <Box component={motion.div} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} sx={{ mt: { xs: 7, md: 10 } }}>
        <Divider sx={{ mb: { xs: 5, md: 7 } }} />
        <Typography variant="h2" sx={{ fontSize: { xs: '1.4rem', md: '1.8rem' }, fontWeight: 800, color: colors.text.primary, mb: 3, letterSpacing: '-0.02em' }}>
          Margin vs Markup — what's the difference?
        </Typography>
        <Grid container spacing={2.5}>
          {[
            { title: 'Profit Margin', color: '#6d28d9', bg: '#f5f3ff', border: '#ddd6fe', text: 'Profit as a percentage of the selling price. If you sell a product for ₹1,000 and your cost is ₹700, your profit margin is 30%. Use margin when pricing for a revenue target.' },
            { title: 'Markup', color: '#0369a1', bg: '#f0f9ff', border: '#bae6fd', text: 'Profit as a percentage of the cost price. Same example — ₹300 profit on ₹700 cost is a 42.86% markup. Use markup when pricing from a cost-plus basis.' },
            { title: 'Key difference', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', text: 'A 30% margin ≠ 30% markup. Margin is always lower than markup for the same profit amount. Confusing them leads to underpricing — a common mistake for small businesses.' },
            { title: 'Which to use?', color: '#92400e', bg: '#fffbeb', border: '#fde68a', text: 'Retailers and e-commerce businesses typically price by margin (target GP%). Manufacturers and wholesalers often use markup. Either way, know both numbers before setting your price.' },
          ].map((item) => (
            <Grid item xs={12} sm={6} key={item.title}>
              <Card sx={{ height: '100%', borderRadius: 3, border: `1.5px solid ${item.border}`, backgroundColor: item.bg, boxShadow: 'none' }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: item.color, mb: 1 }}>{item.title}</Typography>
                  <Typography variant="body2" sx={{ color: colors.text.secondary, fontSize: '0.85rem', lineHeight: 1.7 }}>{item.text}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Alert severity="info" sx={{ mt: 4, borderRadius: 2, backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', '& .MuiAlert-icon': { color: '#0369a1' } }}>
          <Typography variant="caption" sx={{ color: colors.text.secondary, lineHeight: 1.6 }}>
            <strong>Note:</strong> This calculator does not account for GST, shipping, or other overheads. For a complete cost picture, add all indirect costs to your cost price before calculating margin.
          </Typography>
        </Alert>
      </Box>
    </Container>
  );
};

export default ProfitMarginCalculator;
