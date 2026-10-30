import heroHeading from '../../theme/heroHeading';
import { useState, useEffect } from 'react';
import {
  Box, Container, Typography, TextField, Grid, Card, CardContent,
  Stack, Button, Divider, Chip, Alert, Tooltip, IconButton,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import {
  QrCode, Copy, Check, RotateCcw, ArrowLeft,
  ChevronRight, Smartphone, Download,
} from 'lucide-react';
import { colors } from '../../theme/theme';
import { absoluteUrl, siteMetadata } from '../../seo/siteMetadata';
import { SectionBadge } from '../../components/common';

import QRCode from 'qrcode';

/* ─── UPI deep-link builder ─── */
const buildUpiUrl = ({ upiId, name, amount, note }) => {
  if (!upiId) return '';
  const params = new URLSearchParams();
  params.set('pa', upiId.trim());
  if (name.trim()) params.set('pn', name.trim());
  if (amount && parseFloat(amount) > 0) params.set('am', parseFloat(amount).toFixed(2));
  if (note.trim()) params.set('tn', note.trim());
  params.set('cu', 'INR');
  return `upi://pay?${params.toString()}`;
};

/* ─── QR image component — uses qrcode npm package, no CDN ─── */
const QRCanvas = ({ text, size = 220 }) => {
  const [dataUrl, setDataUrl] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!text) { setDataUrl(''); return; }
    setError(false);
    QRCode.toDataURL(text, {
      width: size,
      margin: 2,
      color: { dark: '#18181b', light: '#ffffff' },
      errorCorrectionLevel: 'M',
    })
      .then(setDataUrl)
      .catch(() => setError(true));
  }, [text, size]);

  if (error) return (
    <Box sx={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px dashed ${colors.border.medium}`, borderRadius: 2, backgroundColor: '#fafafa' }}>
      <Typography variant="caption" sx={{ color: colors.text.muted, textAlign: 'center', px: 2 }}>QR unavailable</Typography>
    </Box>
  );

  return (
    <Box sx={{ borderRadius: 2, overflow: 'hidden', border: `1px solid ${colors.border.light}`, display: 'inline-flex' }}>
      {dataUrl
        ? <img src={dataUrl} width={size} height={size} alt="UPI Payment QR Code" style={{ display: 'block' }} />
        : <Box sx={{ width: size, height: size, backgroundColor: '#f4f4f5' }} />
      }
    </Box>
  );
};

/* ─── Copy button ─── */
const CopyBtn = ({ text, label = 'Copy' }) => {
  const [copied, setCopied] = useState(false);
  return (
    <Button size="small" variant="outlined" startIcon={copied ? <Check size={13} /> : <Copy size={13} />} onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1800); }}
      sx={{ borderRadius: 1.5, fontWeight: 600, fontSize: '0.75rem', textTransform: 'none', borderColor: copied ? '#16a34a' : colors.border.medium, color: copied ? '#16a34a' : colors.text.secondary, '&:hover': { borderColor: colors.accent.primary, color: colors.accent.primary } }}>
      {copied ? 'Copied!' : label}
    </Button>
  );
};

/* ════════════════════
   MAIN
════════════════════ */
const UpiQrGenerator = () => {
  const [upiId, setUpiId] = useState('');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [upiError, setUpiError] = useState('');
  const [showQr, setShowQr] = useState(false);

  const upiUrl = buildUpiUrl({ upiId, name, amount, note });
  const hasUrl = !!upiUrl;

  const validateUpi = (val) => {
    setUpiId(val);
    if (!val) { setUpiError(''); return; }
    if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/.test(val.trim())) {
      setUpiError('Enter a valid UPI ID (e.g. name@upi, phone@paytm)');
    } else { setUpiError(''); }
  };

  const handleReset = () => { setUpiId(''); setName(''); setAmount(''); setNote(''); setUpiError(''); setShowQr(false); };

  const handleDownload = () => {
    const img = document.querySelector('#upi-qr-area img');
    if (!img) return;
    const link = document.createElement('a');
    link.download = `upi-qr-${upiId || 'payment'}.png`;
    link.href = img.src;
    link.click();
  };

  const pageTitle = 'Free UPI QR Code Generator | UPI Payment QR | Aslisite';
  const pageDesc = 'Generate a UPI payment QR code for your business instantly. Add your UPI ID, business name, and optional amount. Free, no login, works with all UPI apps — PhonePe, GPay, Paytm, BHIM.';

  return (
    <Container maxWidth="lg" className="tool-page-container" sx={{ pt: { xs: 16, md: 16 }, pb: { xs: 8, md: 12 } }}>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={absoluteUrl('/tools/upi-qr-generator')} />
        <meta property="og:url" content={absoluteUrl('/tools/upi-qr-generator')} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:image" content={siteMetadata.logo} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <script type="application/ld+json">{JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebApplication', '@id': `${absoluteUrl('/tools/upi-qr-generator')}#app`, url: absoluteUrl('/tools/upi-qr-generator'), name: 'Free UPI QR Code Generator — Aslisite', description: pageDesc, applicationCategory: 'FinanceApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' }, publisher: { '@id': `${siteMetadata.baseUrl}/#organization` } })}</script>
      </Helmet>

      {/* Breadcrumb */}
      <Stack direction="row" alignItems="center" gap={0.5} sx={{ mb: 4 }}>
        <Box component={RouterLink} to="/tools" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: colors.text.muted, textDecoration: 'none', fontSize: '0.82rem', fontWeight: 500, '&:hover': { color: colors.accent.primary }, transition: 'color 0.2s' }}>
          <ArrowLeft size={14} />Free Tools
        </Box>
        <ChevronRight size={13} style={{ color: colors.text.muted }} />
        <Typography sx={{ fontSize: '0.82rem', color: colors.text.secondary, fontWeight: 500 }}>UPI QR Generator</Typography>
      </Stack>

      {/* Header */}
      <Box component={motion.div} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} sx={{ mb: { xs: 5, md: 6 } }}>
        <SectionBadge icon={QrCode} label="Free UPI Payment QR Tool" />
        <Typography variant="h1" sx={{
              ...heroHeading,
              color: colors.text.primary,
              mt: 2,
              mb: 1.5,
            }}>
          UPI QR Payment Generator
        </Typography>
        <Typography variant="subtitle1" sx={{ color: colors.text.secondary, maxWidth: 560, lineHeight: 1.7 }}>
          Create a UPI payment QR code for your shop, counter, or website. Works with PhonePe, GPay, Paytm, BHIM, and all UPI apps.
        </Typography>
      </Box>

      <Grid container spacing={{ xs: 3, md: 4 }} alignItems="flex-start">
        {/* Input */}
        <Grid item xs={12} md={6}>
          <Card component={motion.div} initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            sx={{ borderRadius: 3, border: `1px solid ${colors.border.light}`, boxShadow: 'none' }}>
            <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: colors.text.primary, mb: 1 }}>UPI ID *</Typography>
                  <TextField fullWidth size="small" placeholder="e.g. 9495664173@upi or name@paytm"
                    value={upiId} onChange={(e) => validateUpi(e.target.value)}
                    error={!!upiError} helperText={upiError || 'Your registered UPI Virtual Payment Address (VPA)'}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontFamily: '"JetBrains Mono", monospace' } }} />
                </Box>

                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: colors.text.primary, mb: 1 }}>Business / Payee Name</Typography>
                  <TextField fullWidth size="small" placeholder="e.g. Aslisite Technologies"
                    value={name} onChange={(e) => setName(e.target.value)}
                    helperText="Appears in the payment app when the QR is scanned"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }} />
                </Box>

                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: colors.text.primary, mb: 1 }}>Fixed Amount (₹) <Chip label="Optional" size="small" sx={{ height: 18, fontSize: '0.65rem', fontWeight: 600, ml: 0.5, backgroundColor: colors.background.secondary }} /></Typography>
                  <TextField fullWidth size="small" placeholder="Leave blank for any amount"
                    value={amount} onChange={(e) => setAmount(e.target.value)}
                    inputProps={{ inputMode: 'decimal' }}
                    helperText="Set a fixed amount to pre-fill in the payment app"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontFamily: '"JetBrains Mono", monospace' } }} />
                </Box>

                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: colors.text.primary, mb: 1 }}>Payment Note <Chip label="Optional" size="small" sx={{ height: 18, fontSize: '0.65rem', fontWeight: 600, ml: 0.5, backgroundColor: colors.background.secondary }} /></Typography>
                  <TextField fullWidth size="small" placeholder="e.g. Invoice #INV-001"
                    value={note} onChange={(e) => setNote(e.target.value)}
                    inputProps={{ maxLength: 50 }}
                    helperText="Short description shown in transaction history"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }} />
                </Box>

                <Stack direction="row" gap={1.5} flexWrap="wrap">
                  <Button variant="contained" disabled={!hasUrl || !!upiError} onClick={() => setShowQr(true)}
                    sx={{ borderRadius: 2, fontWeight: 700, background: colors.accent.primary, color: '#fff', textTransform: 'none', '&:hover': { background: colors.accent.primaryHover } }}>
                    Generate QR Code
                  </Button>
                  <Button variant="outlined" size="small" startIcon={<RotateCcw size={13} />} onClick={handleReset}
                    sx={{ borderRadius: 2, fontWeight: 600, fontSize: '0.8rem', textTransform: 'none', borderColor: colors.border.medium, color: colors.text.muted, '&:hover': { borderColor: colors.accent.primary, color: colors.accent.primary } }}>
                    Reset
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Output */}
        <Grid item xs={12} md={6}>
          <Box component={motion.div} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
            {!hasUrl || !showQr ? (
              <Card sx={{ borderRadius: 3, border: `1px dashed ${colors.border.medium}`, boxShadow: 'none', backgroundColor: '#fafafa' }}>
                <CardContent sx={{ p: { xs: 4, md: 5 }, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ width: 52, height: 52, borderRadius: 3, backgroundColor: 'rgba(109,40,217,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.accent.primary }}>
                    <QrCode size={24} strokeWidth={1.5} />
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: colors.text.primary }}>Enter your UPI ID</Typography>
                  <Typography variant="body2" sx={{ color: colors.text.muted, maxWidth: 260 }}>Your UPI payment QR code will appear here.</Typography>
                </CardContent>
              </Card>
            ) : (
              <AnimatePresence mode="wait">
                <Box component={motion.div} key={upiUrl} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  {/* QR card */}
                  <Card sx={{ borderRadius: 3, border: `1.5px solid #86efac`, backgroundColor: '#f0fdf4', boxShadow: 'none', mb: 2 }}>
                    <CardContent sx={{ p: { xs: 2.5, md: 3 }, textAlign: 'center' }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="overline" sx={{ color: '#16a34a', fontWeight: 700, fontSize: '0.68rem', letterSpacing: '0.1em' }}>UPI Payment QR</Typography>
                        <Chip label="Scan to Pay" size="small" sx={{ backgroundColor: '#dcfce7', color: '#16a34a', fontWeight: 700, fontSize: '0.68rem', height: 20 }} />
                      </Stack>

                      <Box id="upi-qr-area" sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                        <QRCanvas text={upiUrl} size={220} />
                      </Box>

                      {name && (
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: colors.text.primary, mb: 0.25 }}>{name}</Typography>
                      )}
                      <Typography sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.82rem', color: colors.text.secondary, mb: amount ? 0.5 : 0 }}>{upiId}</Typography>
                      {amount && parseFloat(amount) > 0 && (
                        <Chip label={`₹ ${parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`} sx={{ mt: 0.5, backgroundColor: '#16a34a', color: '#fff', fontWeight: 800, fontFamily: '"JetBrains Mono", monospace' }} />
                      )}

                      <Stack direction="row" gap={1.5} justifyContent="center" mt={2.5} flexWrap="wrap">
                        <Button size="small" variant="contained" startIcon={<Download size={13} />} onClick={handleDownload}
                          sx={{ borderRadius: 1.5, fontWeight: 700, fontSize: '0.75rem', textTransform: 'none', backgroundColor: '#16a34a', '&:hover': { backgroundColor: '#15803d' } }}>
                          Download PNG
                        </Button>
                        <CopyBtn text={upiUrl} label="Copy UPI URL" />
                      </Stack>
                    </CardContent>
                  </Card>

                  {/* UPI URL */}
                  <Card sx={{ borderRadius: 3, border: `1px solid ${colors.border.light}`, boxShadow: 'none', mb: 2 }}>
                    <CardContent sx={{ p: 2.5 }}>
                      <Typography variant="caption" sx={{ color: colors.text.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', mb: 1 }}>UPI Deep Link</Typography>
                      <Box sx={{ p: 1.5, borderRadius: 1.5, backgroundColor: '#18181b', fontFamily: '"JetBrains Mono", monospace', fontSize: '0.72rem', color: '#a3e635', wordBreak: 'break-all', lineHeight: 1.6, mb: 1.5 }}>
                        {upiUrl}
                      </Box>
                      <CopyBtn text={upiUrl} label="Copy Deep Link" />
                    </CardContent>
                  </Card>

                  {/* Test on mobile note */}
                  <Alert severity="info" icon={<Smartphone size={14} />}
                    sx={{ borderRadius: 2, backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', '& .MuiAlert-icon': { color: '#0369a1' } }}>
                    <Typography variant="caption" sx={{ color: colors.text.secondary, lineHeight: 1.6 }}>
                      <strong>Test it:</strong> Scan this QR with any UPI app on your phone to verify it opens correctly before printing.
                    </Typography>
                  </Alert>
                </Box>
              </AnimatePresence>
            )}
          </Box>
        </Grid>
      </Grid>

      {/* Info section */}
      <Box component={motion.div} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} sx={{ mt: { xs: 7, md: 10 } }}>
        <Divider sx={{ mb: { xs: 5, md: 7 } }} />
        <Typography variant="h2" sx={{ fontSize: { xs: '1.4rem', md: '1.8rem' }, fontWeight: 800, color: colors.text.primary, mb: 3, letterSpacing: '-0.02em' }}>
          How to use your UPI QR code
        </Typography>
        <Grid container spacing={2.5}>
          {[
            { icon: '🖨️', title: 'Print at your counter', text: 'Download the QR and print it at A5 or A6 size. Place it at your billing counter so customers can pay instantly without sharing phone numbers.' },
            { icon: '🌐', title: 'Add to your website', text: 'Embed the QR image on your website\'s contact or payment page. Online customers can open their UPI app, scan, and pay without any payment gateway fees.' },
            { icon: '📋', title: 'Add to invoices', text: 'Include the QR code in your PDF invoices generated from our Invoice Generator. Clients can scan and pay directly from the invoice.' },
            { icon: '💳', title: 'Business cards & flyers', text: 'Add the QR to your visiting card or promotional flyer. Anyone can scan and pay or save your UPI ID for future transactions.' },
          ].map((tip) => (
            <Grid item xs={12} sm={6} key={tip.title}>
              <Card sx={{ height: '100%', borderRadius: 3, border: `1px solid ${colors.border.light}`, boxShadow: 'none' }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography sx={{ fontSize: '1.5rem', mb: 1 }}>{tip.icon}</Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: colors.text.primary, mb: 0.75 }}>{tip.title}</Typography>
                  <Typography variant="body2" sx={{ color: colors.text.secondary, fontSize: '0.83rem', lineHeight: 1.65 }}>{tip.text}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Alert severity="info" sx={{ mt: 4, borderRadius: 2, backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', '& .MuiAlert-icon': { color: '#0369a1' } }}>
          <Typography variant="caption" sx={{ color: colors.text.secondary, lineHeight: 1.6 }}>
            <strong>Privacy:</strong> Your UPI ID and name are stored only in your browser while you use this tool. Nothing is sent to any server. The QR code is generated entirely on your device using the standard UPI deep-link format.
          </Typography>
        </Alert>
      </Box>
    </Container>
  );
};

export default UpiQrGenerator;
