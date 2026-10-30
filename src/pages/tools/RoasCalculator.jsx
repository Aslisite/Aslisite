import heroHeading from '../../theme/heroHeading';
import { useState, useCallback } from 'react';
import {
  Box, Container, Typography, TextField, Grid, Card, CardContent,
  Stack, Button, Divider, Chip, Alert, Tooltip, IconButton,
  ToggleButton, ToggleButtonGroup,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import {
  Zap, RotateCcw, Copy, Check, ArrowLeft,
  ChevronRight, TrendingUp, TrendingDown, Info,
} from 'lucide-react';
import { colors } from '../../theme/theme';
import { absoluteUrl, siteMetadata } from '../../seo/siteMetadata';
import { SectionBadge } from '../../components/common';

/* ─── Helpers ─── */
const fmt = (n, dec = 2) => Number.isFinite(n) ? n.toLocaleString('en-IN', { minimumFractionDigits: dec, maximumFractionDigits: dec }) : '—';
const fmtCur = (n) => Number.isFinite(n) ? '₹ ' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—';
const fmtX = (n) => Number.isFinite(n) ? fmt(n) + 'x' : '—';

/* ─── Copy Button ─── */
const CopyBtn = ({ text }) => {
  const [copied, setCopied] = useState(false);
  return (
    <Tooltip title={copied ? 'Copied!' : 'Copy'}>
      <IconButton size="small" onClick={() => { navigator.clipboard.writeText(String(text)); setCopied(true); setTimeout(() => setCopied(false), 1600); }}
        sx={{ color: colors.text.muted, p: 0.4 }}>
        {copied ? <Check size={13} /> : <Copy size={13} />}
      </IconButton>
    </Tooltip>
  );
};

/* ─── Result row ─── */
const Row = ({ label, value, highlight, color, rawVal }) => (
  <Stack direction="row" justifyContent="space-between" alignItems="center"
    sx={{ py: highlight ? 1.1 : 0.75, px: highlight ? 1.5 : 0, mx: highlight ? -1.5 : 0,
      borderRadius: highlight ? 2 : 0, backgroundColor: highlight ? 'rgba(109,40,217,0.05)' : 'transparent' }}>
    <Typography variant="body2" sx={{ color: colors.text.secondary, fontWeight: highlight ? 700 : 500 }}>{label}</Typography>
    <Stack direction="row" alignItems="center" gap={0.5}>
      <Typography variant="body2" sx={{ fontWeight: highlight ? 800 : 600, color: color || (highlight ? colors.accent.primary : colors.text.primary), fontFamily: '"JetBrains Mono", monospace', fontSize: highlight ? '1rem' : '0.875rem' }}>
        {value}
      </Typography>
      {highlight && rawVal !== undefined && <CopyBtn text={String(rawVal)} />}
    </Stack>
  </Stack>
);

/* ─── Benchmark chips ─── */
const ROAS_BENCHMARKS = [
  { label: 'Google Search', min: 4, max: 8, color: '#1a73e8' },
  { label: 'Meta / Facebook', min: 2, max: 5, color: '#1877f2' },
  { label: 'Google Shopping', min: 3, max: 7, color: '#34a853' },
  { label: 'YouTube Ads', min: 2, max: 4, color: '#ff0000' },
];

const getRoasStatus = (roas) => {
  if (!Number.isFinite(roas)) return null;
  if (roas >= 4) return { label: 'Strong', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' };
  if (roas >= 2) return { label: 'Acceptable', color: '#92400e', bg: '#fffbeb', border: '#fde68a' };
  return { label: 'Below Target', color: '#dc2626', bg: '#fef2f2', border: '#fecaca' };
};

/* ════════════════════
   MAIN
════════════════════ */
const RoasCalculator = () => {
  const [mode, setMode] = useState('roas'); // roas | target | budget
  // Inputs
  const [adSpend, setAdSpend] = useState('');
  const [revenue, setRevenue] = useState('');
  const [targetRoas, setTargetRoas] = useState('');
  const [targetRevenue, setTargetRevenue] = useState('');
  const [convValue, setConvValue] = useState('');
  const [convRate, setConvRate] = useState('');

  const sp = parseFloat(adSpend) || 0;
  const rev = parseFloat(revenue) || 0;
  const tRoas = parseFloat(targetRoas) || 0;
  const tRev = parseFloat(targetRevenue) || 0;
  const cv = parseFloat(convValue) || 0;
  const cr = parseFloat(convRate) || 0;

  const result = useCallback(() => {
    if (mode === 'roas') {
      if (!sp || !rev) return null;
      const roas = rev / sp;
      const profit = rev - sp;
      const roiPct = (profit / sp) * 100;
      const costPerConv = cv > 0 ? sp / (rev / cv) : null;
      const status = getRoasStatus(roas);
      return { roas, profit, roiPct, costPerConv, status, sp, rev };
    }
    if (mode === 'target') {
      // Given target ROAS + ad spend → required revenue
      if (!sp || !tRoas) return null;
      const reqRev = sp * tRoas;
      const profit = reqRev - sp;
      const roiPct = (profit / sp) * 100;
      return { roas: tRoas, reqRev, profit, roiPct, sp };
    }
    if (mode === 'budget') {
      // Given target revenue + target ROAS → required budget
      if (!tRev || !tRoas) return null;
      const reqBudget = tRev / tRoas;
      const profit = tRev - reqBudget;
      const roiPct = (profit / reqBudget) * 100;
      return { roas: tRoas, reqBudget, profit, roiPct, tRev };
    }
    return null;
  }, [mode, sp, rev, tRoas, tRev, cv, cr])();

  const handleReset = () => { setAdSpend(''); setRevenue(''); setTargetRoas(''); setTargetRevenue(''); setConvValue(''); setConvRate(''); };

  const pageTitle = 'Free ROAS Calculator India | Return on Ad Spend | Aslisite';
  const pageDesc = 'Calculate your Return on Ad Spend (ROAS) instantly. Free online ROAS calculator for Google Ads, Meta Ads, and all digital ad platforms. Also calculates required revenue and budget targets.';

  return (
    <Container maxWidth="lg" className="tool-page-container" sx={{ pt: { xs: 16, md: 16 }, pb: { xs: 8, md: 12 } }}>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={absoluteUrl('/tools/roas-calculator')} />
        <meta property="og:url" content={absoluteUrl('/tools/roas-calculator')} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:image" content={siteMetadata.logo} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <script type="application/ld+json">{JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebApplication', '@id': `${absoluteUrl('/tools/roas-calculator')}#app`, url: absoluteUrl('/tools/roas-calculator'), name: 'Free ROAS Calculator — Aslisite', description: pageDesc, applicationCategory: 'MarketingApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' }, publisher: { '@id': `${siteMetadata.baseUrl}/#organization` } })}</script>
      </Helmet>

      {/* Breadcrumb */}
      <Stack direction="row" alignItems="center" gap={0.5} sx={{ mb: 4 }}>
        <Box component={RouterLink} to="/tools" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: colors.text.muted, textDecoration: 'none', fontSize: '0.82rem', fontWeight: 500, '&:hover': { color: colors.accent.primary }, transition: 'color 0.2s' }}>
          <ArrowLeft size={14} />Free Tools
        </Box>
        <ChevronRight size={13} style={{ color: colors.text.muted }} />
        <Typography sx={{ fontSize: '0.82rem', color: colors.text.secondary, fontWeight: 500 }}>ROAS Calculator</Typography>
      </Stack>

      {/* Header */}
      <Box component={motion.div} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} sx={{ mb: { xs: 5, md: 6 } }}>
        <SectionBadge icon={Zap} label="Free Ad Performance Calculator" />
        <Typography variant="h1" sx={{
              ...heroHeading,
              color: colors.text.primary,
              mt: 2,
              mb: 1.5,
            }}>
          ROAS Calculator
        </Typography>
        <Typography variant="subtitle1" sx={{ color: colors.text.secondary, maxWidth: 560, lineHeight: 1.7 }}>
          Calculate Return on Ad Spend for Google, Meta, or any paid ad platform. Also works backwards to find your required revenue or budget from a target ROAS.
        </Typography>
      </Box>

      <Grid container spacing={{ xs: 3, md: 4 }} alignItems="flex-start">
        {/* Input */}
        <Grid item xs={12} md={5}>
          <Card component={motion.div} initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            sx={{ borderRadius: 3, border: `1px solid ${colors.border.light}`, boxShadow: 'none' }}>
            <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: colors.text.primary, mb: 1.5 }}>What do you want to calculate?</Typography>
              <ToggleButtonGroup value={mode} exclusive onChange={(_, v) => v && setMode(v)} fullWidth size="small" sx={{ mb: 3,
                '& .MuiToggleButton-root': { borderRadius: '10px !important', border: `1px solid ${colors.border.medium} !important`, py: 1.1, fontWeight: 600, fontSize: '0.77rem', textTransform: 'none',
                  '&.Mui-selected': { backgroundColor: colors.accent.primary, color: '#fff', borderColor: `${colors.accent.primary} !important` } } }}>
                <ToggleButton value="roas">My ROAS</ToggleButton>
                <ToggleButton value="target">Required Revenue</ToggleButton>
                <ToggleButton value="budget">Required Budget</ToggleButton>
              </ToggleButtonGroup>

              {/* Mode: ROAS */}
              {mode === 'roas' && (
                <>
                  <Box sx={{ mb: 2.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: colors.text.primary, mb: 0.75 }}>Total Ad Spend (₹) *</Typography>
                    <TextField fullWidth size="small" placeholder="e.g. 10000" value={adSpend} onChange={(e) => setAdSpend(e.target.value)} inputProps={{ inputMode: 'decimal' }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontFamily: '"JetBrains Mono", monospace', fontWeight: 600 } }} />
                  </Box>
                  <Box sx={{ mb: 2.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: colors.text.primary, mb: 0.75 }}>Total Revenue from Ads (₹) *</Typography>
                    <TextField fullWidth size="small" placeholder="e.g. 45000" value={revenue} onChange={(e) => setRevenue(e.target.value)} inputProps={{ inputMode: 'decimal' }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontFamily: '"JetBrains Mono", monospace', fontWeight: 600 } }} />
                    <Typography variant="caption" sx={{ color: colors.text.muted, mt: 0.5, display: 'block' }}>Total sales/conversions attributed to this ad campaign</Typography>
                  </Box>
                  <Box sx={{ mb: 2.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: colors.text.primary, mb: 0.75 }}>Avg. Order / Conversion Value (₹) <Chip label="Optional" size="small" sx={{ height: 16, fontSize: '0.62rem', fontWeight: 600, ml: 0.5, backgroundColor: colors.background.secondary }} /></Typography>
                    <TextField fullWidth size="small" placeholder="e.g. 1500" value={convValue} onChange={(e) => setConvValue(e.target.value)} inputProps={{ inputMode: 'decimal' }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontFamily: '"JetBrains Mono", monospace' } }} />
                  </Box>
                </>
              )}

              {/* Mode: Target Revenue */}
              {mode === 'target' && (
                <>
                  <Box sx={{ mb: 2.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: colors.text.primary, mb: 0.75 }}>Ad Spend Budget (₹) *</Typography>
                    <TextField fullWidth size="small" placeholder="e.g. 20000" value={adSpend} onChange={(e) => setAdSpend(e.target.value)} inputProps={{ inputMode: 'decimal' }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontFamily: '"JetBrains Mono", monospace', fontWeight: 600 } }} />
                  </Box>
                  <Box sx={{ mb: 2.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: colors.text.primary, mb: 0.75 }}>Target ROAS *</Typography>
                    <TextField fullWidth size="small" placeholder="e.g. 4 (means 4x return)" value={targetRoas} onChange={(e) => setTargetRoas(e.target.value)} inputProps={{ inputMode: 'decimal' }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontFamily: '"JetBrains Mono", monospace', fontWeight: 600 } }} />
                    <Typography variant="caption" sx={{ color: colors.text.muted, mt: 0.5, display: 'block' }}>e.g. 4 = ₹4 revenue for every ₹1 spent</Typography>
                  </Box>
                </>
              )}

              {/* Mode: Budget */}
              {mode === 'budget' && (
                <>
                  <Box sx={{ mb: 2.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: colors.text.primary, mb: 0.75 }}>Target Revenue (₹) *</Typography>
                    <TextField fullWidth size="small" placeholder="e.g. 100000" value={targetRevenue} onChange={(e) => setTargetRevenue(e.target.value)} inputProps={{ inputMode: 'decimal' }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontFamily: '"JetBrains Mono", monospace', fontWeight: 600 } }} />
                  </Box>
                  <Box sx={{ mb: 2.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: colors.text.primary, mb: 0.75 }}>Target ROAS *</Typography>
                    <TextField fullWidth size="small" placeholder="e.g. 5" value={targetRoas} onChange={(e) => setTargetRoas(e.target.value)} inputProps={{ inputMode: 'decimal' }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontFamily: '"JetBrains Mono", monospace', fontWeight: 600 } }} />
                  </Box>
                </>
              )}

              <Button variant="outlined" size="small" startIcon={<RotateCcw size={13} />} onClick={handleReset}
                sx={{ borderRadius: 2, fontSize: '0.8rem', fontWeight: 600, textTransform: 'none', borderColor: colors.border.medium, color: colors.text.muted, '&:hover': { borderColor: colors.accent.primary, color: colors.accent.primary } }}>
                Reset
              </Button>
            </CardContent>
          </Card>

          {/* Benchmarks */}
          <Card sx={{ borderRadius: 3, border: `1px solid ${colors.border.light}`, boxShadow: 'none', mt: 2 }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="caption" sx={{ color: colors.text.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', mb: 1.5 }}>
                Industry ROAS Benchmarks
              </Typography>
              <Stack spacing={1}>
                {ROAS_BENCHMARKS.map((b) => (
                  <Stack key={b.label} direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption" sx={{ color: colors.text.secondary, fontWeight: 500 }}>{b.label}</Typography>
                    <Chip label={`${b.min}x – ${b.max}x`} size="small"
                      sx={{ height: 20, fontSize: '0.68rem', fontWeight: 700, backgroundColor: `${b.color}14`, color: b.color, border: `1px solid ${b.color}30` }} />
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Results */}
        <Grid item xs={12} md={7}>
          <Box component={motion.div} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
            {!result ? (
              <Card sx={{ borderRadius: 3, border: `1px dashed ${colors.border.medium}`, boxShadow: 'none', backgroundColor: '#fafafa' }}>
                <CardContent sx={{ p: { xs: 4, md: 5 }, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ width: 52, height: 52, borderRadius: 3, backgroundColor: 'rgba(109,40,217,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.accent.primary }}>
                    <Zap size={24} strokeWidth={1.5} />
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: colors.text.primary }}>Enter your campaign data</Typography>
                  <Typography variant="body2" sx={{ color: colors.text.muted, maxWidth: 280 }}>ROAS, ROI, profit, and actionable insights will appear here.</Typography>
                </CardContent>
              </Card>
            ) : (
              <AnimatePresence mode="wait">
                <Box component={motion.div} key={JSON.stringify(result)} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.28 }}>
                  {/* Status banner */}
                  {result.status && (
                    <Card sx={{ borderRadius: 3, border: `1.5px solid ${result.status.border}`, backgroundColor: result.status.bg, boxShadow: 'none', mb: 2 }}>
                      <CardContent sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
                        {result.roas >= 4 ? <TrendingUp size={28} style={{ color: result.status.color, flexShrink: 0 }} /> : <TrendingDown size={28} style={{ color: result.status.color, flexShrink: 0 }} />}
                        <Box>
                          <Typography sx={{ fontWeight: 800, color: result.status.color, fontSize: '1rem' }}>
                            {result.roas >= 4 ? 'Your campaign is performing well' : result.roas >= 2 ? 'Your ROAS is acceptable but can improve' : 'Your ROAS is below profitable threshold'}
                          </Typography>
                          <Typography variant="caption" sx={{ color: colors.text.muted }}>
                            {result.roas >= 4 ? 'Maintain your bid strategy and scale what\'s working.' : result.roas >= 2 ? 'Review targeting, ad creatives, and landing page quality.' : 'Pause or restructure underperforming ad sets before scaling.'}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  )}

                  {/* Primary ROAS */}
                  <Card sx={{ borderRadius: 3, border: `1.5px solid ${colors.border.accent}`, boxShadow: 'none', mb: 2 }}>
                    <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                      <Typography variant="overline" sx={{ color: colors.accent.primary, fontWeight: 700, fontSize: '0.68rem', letterSpacing: '0.1em', display: 'block', mb: 2 }}>
                        {mode === 'roas' ? 'Campaign Results' : mode === 'target' ? 'Revenue Target' : 'Budget Required'}
                      </Typography>
                      <Stack divider={<Divider />} spacing={0}>
                        {mode === 'roas' && (
                          <>
                            <Row label="Ad Spend" value={fmtCur(result.sp)} />
                            <Row label="Revenue" value={fmtCur(result.rev)} />
                            <Row label="ROAS" value={fmtX(result.roas)} highlight rawVal={fmt(result.roas)} />
                            <Row label="Profit / Loss" value={fmtCur(result.profit)} color={result.profit >= 0 ? '#16a34a' : '#dc2626'} />
                            <Row label="ROI" value={fmt(result.roiPct) + '%'} color={result.roiPct >= 0 ? '#16a34a' : '#dc2626'} />
                            {result.costPerConv !== null && <Row label="Cost per Conversion" value={fmtCur(result.costPerConv)} />}
                          </>
                        )}
                        {mode === 'target' && (
                          <>
                            <Row label="Ad Spend" value={fmtCur(result.sp)} />
                            <Row label="Target ROAS" value={fmtX(result.roas)} />
                            <Row label="Revenue Needed" value={fmtCur(result.reqRev)} highlight rawVal={fmt(result.reqRev)} />
                            <Row label="Projected Profit" value={fmtCur(result.profit)} color="#16a34a" />
                            <Row label="ROI" value={fmt(result.roiPct) + '%'} color="#16a34a" />
                          </>
                        )}
                        {mode === 'budget' && (
                          <>
                            <Row label="Target Revenue" value={fmtCur(result.tRev)} />
                            <Row label="Target ROAS" value={fmtX(result.roas)} />
                            <Row label="Budget Required" value={fmtCur(result.reqBudget)} highlight rawVal={fmt(result.reqBudget)} />
                            <Row label="Projected Profit" value={fmtCur(result.profit)} color="#16a34a" />
                            <Row label="ROI" value={fmt(result.roiPct) + '%'} color="#16a34a" />
                          </>
                        )}
                      </Stack>
                    </CardContent>
                  </Card>

                  {/* ROAS scale scenarios (mode: roas only) */}
                  {mode === 'roas' && result && (
                    <Card sx={{ borderRadius: 3, border: `1px solid ${colors.border.light}`, boxShadow: 'none' }}>
                      <CardContent sx={{ p: 2.5 }}>
                        <Typography variant="caption" sx={{ color: colors.text.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', mb: 2 }}>
                          What if you scaled spend?
                        </Typography>
                        <Box sx={{ overflowX: 'auto' }}>
                          <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                            <Box component="thead">
                              <Box component="tr" sx={{ backgroundColor: '#f4f4f5' }}>
                                {['Ad Spend', 'Revenue (at same ROAS)', 'Profit'].map((h) => (
                                  <Box key={h} component="th" sx={{ p: '6px 10px', textAlign: 'right', fontWeight: 700, fontSize: '0.7rem', color: colors.text.muted, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: `1.5px solid ${colors.border.medium}`, '&:first-of-type': { textAlign: 'left' } }}>{h}</Box>
                                ))}
                              </Box>
                            </Box>
                            <Box component="tbody">
                              {[0.5, 1, 2, 3, 5].map((mult) => {
                                const spend = result.sp * mult;
                                const rev = spend * result.roas;
                                const profit = rev - spend;
                                const isCurrent = mult === 1;
                                return (
                                  <Box key={mult} component="tr"
                                    sx={{ backgroundColor: isCurrent ? 'rgba(109,40,217,0.04)' : 'transparent', '&:nth-of-type(even)': { backgroundColor: isCurrent ? 'rgba(109,40,217,0.04)' : '#fafafa' } }}>
                                    <Box component="td" sx={{ p: '6px 10px', fontFamily: '"JetBrains Mono", monospace', color: isCurrent ? colors.accent.primary : colors.text.primary, fontWeight: isCurrent ? 700 : 400 }}>
                                      {fmtCur(spend)} {isCurrent && <Chip label="Current" size="small" sx={{ ml: 0.5, height: 16, fontSize: '0.6rem', fontWeight: 700, backgroundColor: colors.accent.primary, color: '#fff' }} />}
                                    </Box>
                                    <Box component="td" sx={{ p: '6px 10px', textAlign: 'right', fontFamily: '"JetBrains Mono", monospace', fontSize: '0.78rem' }}>{fmtCur(rev)}</Box>
                                    <Box component="td" sx={{ p: '6px 10px', textAlign: 'right', fontWeight: 700, fontFamily: '"JetBrains Mono", monospace', fontSize: '0.78rem', color: '#16a34a' }}>{fmtCur(profit)}</Box>
                                  </Box>
                                );
                              })}
                            </Box>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  )}
                </Box>
              </AnimatePresence>
            )}
          </Box>
        </Grid>
      </Grid>

      {/* Explainer */}
      <Box component={motion.div} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} sx={{ mt: { xs: 7, md: 10 } }}>
        <Divider sx={{ mb: { xs: 5, md: 7 } }} />
        <Typography variant="h2" sx={{ fontSize: { xs: '1.4rem', md: '1.8rem' }, fontWeight: 800, color: colors.text.primary, mb: 3, letterSpacing: '-0.02em' }}>ROAS vs ROI — what's the difference?</Typography>
        <Grid container spacing={2.5}>
          {[
            { title: 'ROAS (Return on Ad Spend)', color: '#6d28d9', bg: '#f5f3ff', border: '#ddd6fe', text: 'ROAS = Revenue ÷ Ad Spend. A ROAS of 4x means you earned ₹4 for every ₹1 spent on ads. It measures the gross efficiency of your ad campaign — but does not account for product cost, margins, or overheads.' },
            { title: 'ROI (Return on Investment)', color: '#0369a1', bg: '#f0f9ff', border: '#bae6fd', text: 'ROI = (Profit ÷ Ad Spend) × 100. It accounts for what you actually keep after paying for the ad. A positive ROI means you made more than you spent. A 4x ROAS on a 25% margin product could still be a loss.' },
            { title: 'What ROAS should you target?', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', text: 'Your break-even ROAS = 1 ÷ Gross Margin. If your margin is 40%, you need at least 2.5x ROAS to break even. Aim for 3–5x as a healthy benchmark for most e-commerce and service businesses in India.' },
            { title: 'ROAS and GST', color: '#92400e', bg: '#fffbeb', border: '#fde68a', text: 'When calculating ROAS for GST-registered businesses, use revenue excluding GST (your taxable turnover). Ad platform reported conversions include GST in order value — adjust accordingly to get your true ROAS.' },
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
      </Box>
    </Container>
  );
};

export default RoasCalculator;
