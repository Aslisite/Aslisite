import { useState, useCallback } from 'react';
import {
  Box, Container, Typography, TextField, Grid, Card, CardContent,
  Stack, Button, Divider, Alert, Chip, LinearProgress,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import {
  BarChart2, RotateCcw, ArrowLeft, ChevronRight, Info,
  TrendingUp, TrendingDown,
} from 'lucide-react';
import { colors } from '../../theme/theme';
import { absoluteUrl, siteMetadata } from '../../seo/siteMetadata';
import { SectionBadge } from '../../components/common';

/* ─── Helpers ─── */
const fmt = (n, dec = 2) => Number.isFinite(n) ? n.toLocaleString('en-IN', { minimumFractionDigits: dec, maximumFractionDigits: dec }) : '—';
const fmtCur = (n) => Number.isFinite(n) ? '₹ ' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—';
const fmtInt = (n) => Number.isFinite(n) ? Math.ceil(n).toLocaleString('en-IN') : '—';

const InputField = ({ label, value, onChange, placeholder, helper }) => (
  <Box sx={{ mb: 2.5 }}>
    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: colors.text.primary, mb: 0.75 }}>{label}</Typography>
    <TextField fullWidth size="small" placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)}
      inputProps={{ inputMode: 'decimal' }}
      helperText={helper}
      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontFamily: '"JetBrains Mono", monospace', fontWeight: 600 } }} />
  </Box>
);

const ResultCard = ({ label, value, sub, color, bg, border }) => (
  <Card sx={{ borderRadius: 2.5, border: `1.5px solid ${border || colors.border.light}`, backgroundColor: bg || '#fff', boxShadow: 'none' }}>
    <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
      <Typography variant="caption" sx={{ color: colors.text.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', mb: 0.5 }}>{label}</Typography>
      <Typography sx={{ fontWeight: 900, fontSize: '1.4rem', color: color || colors.text.primary, fontFamily: '"JetBrains Mono", monospace', lineHeight: 1.1, letterSpacing: '-0.02em' }}>{value}</Typography>
      {sub && <Typography variant="caption" sx={{ color: colors.text.muted, mt: 0.5, display: 'block' }}>{sub}</Typography>}
    </CardContent>
  </Card>
);

/* ════════════════════
   MAIN
════════════════════ */
const BreakEvenCalculator = () => {
  const [fixedCosts, setFixedCosts] = useState('');
  const [varCostPerUnit, setVarCostPerUnit] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [currentUnits, setCurrentUnits] = useState('');

  const fc = parseFloat(fixedCosts) || 0;
  const vc = parseFloat(varCostPerUnit) || 0;
  const sp = parseFloat(sellingPrice) || 0;
  const cu = parseFloat(currentUnits) || 0;

  const result = useCallback(() => {
    if (!fc || !vc || !sp) return null;
    if (sp <= vc) return { error: 'Selling price must be greater than variable cost per unit.' };

    const contributionMargin = sp - vc;         // per unit
    const contributionMarginRatio = (contributionMargin / sp) * 100;
    const breakEvenUnits = fc / contributionMargin;
    const breakEvenRevenue = breakEvenUnits * sp;

    // If current units provided
    let profitAtCurrentUnits = null;
    let marginOfSafety = null;
    let marginOfSafetyPct = null;
    if (cu > 0) {
      profitAtCurrentUnits = cu * contributionMargin - fc;
      marginOfSafety = cu - breakEvenUnits;
      marginOfSafetyPct = (marginOfSafety / cu) * 100;
    }

    return {
      contributionMargin,
      contributionMarginRatio,
      breakEvenUnits,
      breakEvenRevenue,
      profitAtCurrentUnits,
      marginOfSafety,
      marginOfSafetyPct,
    };
  }, [fc, vc, sp, cu])();

  const handleReset = () => { setFixedCosts(''); setVarCostPerUnit(''); setSellingPrice(''); setCurrentUnits(''); };

  // Scenario table: units at 75%, 100%, 125%, 150% of break-even
  const scenarios = result && !result.error
    ? [0.5, 0.75, 1, 1.25, 1.5, 2].map((mult) => {
        const units = Math.ceil(result.breakEvenUnits * mult);
        const revenue = units * sp;
        const totalCost = fc + units * vc;
        const profit = revenue - totalCost;
        return { units, revenue, totalCost, profit, mult };
      })
    : [];

  const pageTitle = 'Free Break-Even Calculator India | Break-Even Analysis | Aslisite';
  const pageDesc = 'Calculate your break-even point in units and revenue instantly. Free online break-even analysis tool for Indian businesses — find out exactly how many units you need to sell to cover your costs.';

  return (
    <Container maxWidth="lg" className="tool-page-container" sx={{ pt: { xs: 16, md: 16 }, pb: { xs: 8, md: 12 } }}>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={absoluteUrl('/tools/break-even-calculator')} />
        <meta property="og:url" content={absoluteUrl('/tools/break-even-calculator')} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:image" content={siteMetadata.logo} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <script type="application/ld+json">{JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebApplication', '@id': `${absoluteUrl('/tools/break-even-calculator')}#app`, url: absoluteUrl('/tools/break-even-calculator'), name: 'Free Break-Even Calculator — Aslisite', description: pageDesc, applicationCategory: 'FinanceApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' }, publisher: { '@id': `${siteMetadata.baseUrl}/#organization` } })}</script>
      </Helmet>

      {/* Breadcrumb */}
      <Stack direction="row" alignItems="center" gap={0.5} sx={{ mb: 4 }}>
        <Box component={RouterLink} to="/tools" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: colors.text.muted, textDecoration: 'none', fontSize: '0.82rem', fontWeight: 500, '&:hover': { color: colors.accent.primary }, transition: 'color 0.2s' }}>
          <ArrowLeft size={14} />Free Tools
        </Box>
        <ChevronRight size={13} style={{ color: colors.text.muted }} />
        <Typography sx={{ fontSize: '0.82rem', color: colors.text.secondary, fontWeight: 500 }}>Break-Even Calculator</Typography>
      </Stack>

      {/* Header */}
      <Box component={motion.div} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} sx={{ mb: { xs: 5, md: 6 } }}>
        <SectionBadge icon={BarChart2} label="Free Break-Even Analysis Tool" />
        <Typography variant="h1" sx={{ fontSize: { xs: '1.9rem', sm: '2.5rem', md: '2.8rem' }, fontWeight: 800, color: colors.text.primary, mt: 2, mb: 1.5, letterSpacing: '-0.03em' }}>
          Break-Even Calculator
        </Typography>
        <Typography variant="subtitle1" sx={{ color: colors.text.secondary, maxWidth: 560, lineHeight: 1.7 }}>
          Find out exactly how many units you need to sell — and at what revenue — to cover all your costs and start making profit.
        </Typography>
      </Box>

      <Grid container spacing={{ xs: 3, md: 4 }} alignItems="flex-start">
        {/* Input */}
        <Grid item xs={12} md={5}>
          <Card component={motion.div} initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            sx={{ borderRadius: 3, border: `1px solid ${colors.border.light}`, boxShadow: 'none' }}>
            <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
              <InputField label="Total Fixed Costs (₹/month) *" value={fixedCosts} onChange={setFixedCosts} placeholder="e.g. 50000" helper="Rent, salaries, insurance, loan EMIs — costs that don't change with output" />
              <InputField label="Variable Cost per Unit (₹) *" value={varCostPerUnit} onChange={setVarCostPerUnit} placeholder="e.g. 120" helper="Raw materials, packaging, delivery — cost directly tied to each unit" />
              <InputField label="Selling Price per Unit (₹) *" value={sellingPrice} onChange={setSellingPrice} placeholder="e.g. 200" helper="The price at which you sell each unit (excluding GST)" />
              <Divider sx={{ my: 2 }} />
              <InputField label="Current / Planned Units Sold" value={currentUnits} onChange={setCurrentUnits} placeholder="Optional — e.g. 400" helper="To calculate profit and margin of safety at your current volume" />

              <Button variant="outlined" size="small" startIcon={<RotateCcw size={13} />} onClick={handleReset}
                sx={{ borderRadius: 2, fontSize: '0.8rem', fontWeight: 600, textTransform: 'none', borderColor: colors.border.medium, color: colors.text.muted, '&:hover': { borderColor: colors.accent.primary, color: colors.accent.primary } }}>
                Reset
              </Button>
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
                    <BarChart2 size={24} strokeWidth={1.5} />
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: colors.text.primary }}>Enter your cost & price data</Typography>
                  <Typography variant="body2" sx={{ color: colors.text.muted, maxWidth: 280 }}>Your break-even point, contribution margin, and profit scenarios will appear here.</Typography>
                </CardContent>
              </Card>
            ) : result.error ? (
              <Alert severity="error" sx={{ borderRadius: 2 }}>{result.error}</Alert>
            ) : (
              <AnimatePresence mode="wait">
                <Box component={motion.div} key={`${fc}-${vc}-${sp}-${cu}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.28 }}>
                  {/* Primary results */}
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                      <ResultCard label="Break-Even Units" value={fmtInt(result.breakEvenUnits)} sub="units per month to cover costs" color={colors.accent.primary} bg="rgba(109,40,217,0.04)" border={colors.border.accent} />
                    </Grid>
                    <Grid item xs={6}>
                      <ResultCard label="Break-Even Revenue" value={fmtCur(result.breakEvenRevenue)} sub="monthly revenue needed" color={colors.accent.primary} bg="rgba(109,40,217,0.04)" border={colors.border.accent} />
                    </Grid>
                    <Grid item xs={6}>
                      <ResultCard label="Contribution Margin" value={fmtCur(result.contributionMargin)} sub="profit contribution per unit" color="#0369a1" bg="#f0f9ff" border="#bae6fd" />
                    </Grid>
                    <Grid item xs={6}>
                      <ResultCard label="CM Ratio" value={fmt(result.contributionMarginRatio) + '%'} sub="of each ₹ of revenue" color="#0369a1" bg="#f0f9ff" border="#bae6fd" />
                    </Grid>
                    {result.profitAtCurrentUnits !== null && (
                      <>
                        <Grid item xs={6}>
                          <ResultCard
                            label={result.profitAtCurrentUnits >= 0 ? 'Profit at Current Volume' : 'Loss at Current Volume'}
                            value={fmtCur(Math.abs(result.profitAtCurrentUnits))}
                            sub={`at ${fmtInt(cu)} units/month`}
                            color={result.profitAtCurrentUnits >= 0 ? '#16a34a' : '#dc2626'}
                            bg={result.profitAtCurrentUnits >= 0 ? '#f0fdf4' : '#fef2f2'}
                            border={result.profitAtCurrentUnits >= 0 ? '#bbf7d0' : '#fecaca'}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <ResultCard
                            label="Margin of Safety"
                            value={result.marginOfSafety >= 0 ? `${fmtInt(result.marginOfSafety)} units` : `${fmtInt(Math.abs(result.marginOfSafety))} short`}
                            sub={`${fmt(Math.abs(result.marginOfSafetyPct))}% ${result.marginOfSafety >= 0 ? 'above' : 'below'} break-even`}
                            color={result.marginOfSafety >= 0 ? '#16a34a' : '#dc2626'}
                            bg={result.marginOfSafety >= 0 ? '#f0fdf4' : '#fef2f2'}
                            border={result.marginOfSafety >= 0 ? '#bbf7d0' : '#fecaca'}
                          />
                        </Grid>
                      </>
                    )}
                  </Grid>

                  {/* Progress bar to break-even */}
                  {cu > 0 && (
                    <Card sx={{ borderRadius: 3, border: `1px solid ${colors.border.light}`, boxShadow: 'none', mb: 2 }}>
                      <CardContent sx={{ p: 2.5 }}>
                        <Stack direction="row" justifyContent="space-between" mb={1}>
                          <Typography variant="caption" sx={{ color: colors.text.secondary, fontWeight: 600 }}>
                            Current volume vs break-even
                          </Typography>
                          <Typography variant="caption" sx={{ fontWeight: 700, color: cu >= result.breakEvenUnits ? '#16a34a' : '#dc2626' }}>
                            {fmt(Math.min((cu / result.breakEvenUnits) * 100, 100))}%
                          </Typography>
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min((cu / result.breakEvenUnits) * 100, 100)}
                          sx={{
                            height: 8, borderRadius: 4,
                            backgroundColor: colors.border.light,
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: cu >= result.breakEvenUnits ? '#16a34a' : '#f59e0b',
                              borderRadius: 4,
                            },
                          }}
                        />
                        <Typography variant="caption" sx={{ color: colors.text.muted, mt: 1, display: 'block' }}>
                          {cu >= result.breakEvenUnits
                            ? `You are ${fmtInt(cu - result.breakEvenUnits)} units above break-even — you're profitable.`
                            : `You need ${fmtInt(result.breakEvenUnits - cu)} more units to reach break-even.`}
                        </Typography>
                      </CardContent>
                    </Card>
                  )}

                  {/* Scenario table */}
                  <Card sx={{ borderRadius: 3, border: `1px solid ${colors.border.light}`, boxShadow: 'none' }}>
                    <CardContent sx={{ p: 2.5 }}>
                      <Typography variant="caption" sx={{ color: colors.text.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', mb: 2 }}>
                        Profit / Loss Scenarios
                      </Typography>
                      <Box sx={{ overflowX: 'auto' }}>
                        <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                          <Box component="thead">
                            <Box component="tr" sx={{ backgroundColor: '#f4f4f5' }}>
                              {['Units', 'Revenue', 'Total Cost', 'Profit / Loss'].map((h) => (
                                <Box key={h} component="th" sx={{ p: '6px 10px', textAlign: 'right', fontWeight: 700, fontSize: '0.7rem', color: colors.text.muted, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: `1.5px solid ${colors.border.medium}`, '&:first-of-type': { textAlign: 'left' } }}>{h}</Box>
                              ))}
                            </Box>
                          </Box>
                          <Box component="tbody">
                            {scenarios.map(({ units, revenue, totalCost, profit, mult }) => (
                              <Box key={mult} component="tr"
                                sx={{ backgroundColor: mult === 1 ? 'rgba(109,40,217,0.04)' : 'transparent', '&:nth-of-type(even)': { backgroundColor: mult === 1 ? 'rgba(109,40,217,0.04)' : '#fafafa' } }}>
                                <Box component="td" sx={{ p: '6px 10px', fontWeight: mult === 1 ? 700 : 400, color: mult === 1 ? colors.accent.primary : colors.text.primary, fontFamily: '"JetBrains Mono", monospace' }}>
                                  {fmtInt(units)} {mult === 1 && <Chip label="BEP" size="small" sx={{ ml: 0.5, height: 16, fontSize: '0.6rem', fontWeight: 700, backgroundColor: colors.accent.primary, color: '#fff' }} />}
                                </Box>
                                <Box component="td" sx={{ p: '6px 10px', textAlign: 'right', fontFamily: '"JetBrains Mono", monospace', fontSize: '0.78rem' }}>₹{fmt(revenue, 0)}</Box>
                                <Box component="td" sx={{ p: '6px 10px', textAlign: 'right', fontFamily: '"JetBrains Mono", monospace', fontSize: '0.78rem' }}>₹{fmt(totalCost, 0)}</Box>
                                <Box component="td" sx={{ p: '6px 10px', textAlign: 'right', fontWeight: 700, fontFamily: '"JetBrains Mono", monospace', fontSize: '0.78rem', color: profit >= 0 ? '#16a34a' : '#dc2626' }}>
                                  {profit >= 0 ? '+' : ''}₹{fmt(profit, 0)}
                                </Box>
                              </Box>
                            ))}
                          </Box>
                        </Box>
                      </Box>
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
        <Typography variant="h2" sx={{ fontSize: { xs: '1.4rem', md: '1.8rem' }, fontWeight: 800, color: colors.text.primary, mb: 1, letterSpacing: '-0.02em' }}>What is Break-Even Analysis?</Typography>
        <Typography variant="body1" sx={{ color: colors.text.secondary, maxWidth: 680, lineHeight: 1.8, mb: 4 }}>
          Break-even analysis tells you the minimum output needed to cover all costs — the point where total revenue equals total cost and profit is zero. Every unit sold beyond the break-even point is pure profit.
        </Typography>
        <Grid container spacing={2.5}>
          {[
            { label: 'Fixed Costs', desc: 'Costs that don\'t change with production volume — rent, salaries, loan repayments, insurance, software subscriptions.' },
            { label: 'Variable Costs', desc: 'Costs that scale with output — raw materials, packaging, delivery charges, payment gateway fees, commission.' },
            { label: 'Contribution Margin', desc: 'Selling Price minus Variable Cost per unit. Each unit sold contributes this amount toward covering fixed costs and generating profit.' },
            { label: 'Margin of Safety', desc: 'How far your current sales are above the break-even point. A higher margin of safety means your business can absorb a sales drop without going into loss.' },
          ].map((item) => (
            <Grid item xs={12} sm={6} key={item.label}>
              <Card sx={{ height: '100%', borderRadius: 3, border: `1px solid ${colors.border.light}`, boxShadow: 'none' }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: colors.accent.primary, mb: 0.75 }}>{item.label}</Typography>
                  <Typography variant="body2" sx={{ color: colors.text.secondary, fontSize: '0.85rem', lineHeight: 1.7 }}>{item.desc}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default BreakEvenCalculator;
