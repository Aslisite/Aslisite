import { useState, useEffect, useRef } from 'react';
import {
  Box, Container, Typography, TextField, Grid, Card, CardContent,
  Stack, Button, IconButton, Divider, Chip, Tooltip, Alert,
  ToggleButton, ToggleButtonGroup,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import {
  MessageCircle, Copy, Check, RotateCcw, ExternalLink,
  ArrowLeft, ChevronRight, QrCode, Smartphone, Globe,
} from 'lucide-react';
import { colors } from '../../theme/theme';
import { absoluteUrl, siteMetadata } from '../../seo/siteMetadata';
import { SectionBadge } from '../../components/common';

/* ─── QR Code renderer (pure canvas, no library needed) ─── */
/* We use the native QR generation via a data URL approach.
   For a lightweight in-browser QR, we dynamically load the
   qrcode.js CDN script only when needed. */

/* ─── Helpers ─── */
const sanitizePhone = (val) => val.replace(/[^\d+]/g, '');

const buildLink = (phone, message, type) => {
  const cleaned = phone.replace(/\D/g, '');
  if (!cleaned) return '';
  const encoded = encodeURIComponent(message);
  if (type === 'api') return `https://api.whatsapp.com/send?phone=${cleaned}&text=${encoded}`;
  return `https://wa.me/${cleaned}${message ? `?text=${encoded}` : ''}`;
};

/* ─── QR canvas component ─── */
const QRCanvas = ({ text, size = 200 }) => {
  const canvasRef = useRef(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!text) return;
    setError(false);

    const draw = () => {
      if (typeof window.QRCode === 'undefined') {
        setError(true);
        return;
      }
      const canvas = canvasRef.current;
      if (!canvas) return;
      try {
        window.QRCode.toCanvas(canvas, text, {
          width: size,
          margin: 2,
          color: { dark: '#18181b', light: '#ffffff' },
          errorCorrectionLevel: 'M',
        });
      } catch {
        setError(true);
      }
    };

    if (typeof window.QRCode !== 'undefined') {
      draw();
      return;
    }

    // Lazy-load qrcode.js from CDN
    const existing = document.getElementById('qrcode-script');
    if (existing) {
      existing.addEventListener('load', draw);
      return;
    }
    const script = document.createElement('script');
    script.id = 'qrcode-script';
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
    script.onload = draw;
    script.onerror = () => setError(true);
    document.head.appendChild(script);
  }, [text, size]);

  if (error) {
    return (
      <Box sx={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px dashed ${colors.border.medium}`, borderRadius: 2, backgroundColor: '#fafafa' }}>
        <Typography variant="caption" sx={{ color: colors.text.muted, textAlign: 'center', px: 2 }}>
          QR unavailable — check your connection
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ borderRadius: 2, overflow: 'hidden', border: `1px solid ${colors.border.light}`, display: 'inline-flex' }}>
      <canvas ref={canvasRef} width={size} height={size} aria-label="WhatsApp QR Code" />
    </Box>
  );
};

/* ─── Copy button ─── */
const CopyBtn = ({ text, label = 'Copy' }) => {
  const [copied, setCopied] = useState(false);
  const handle = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };
  return (
    <Button size="small" variant="outlined" startIcon={copied ? <Check size={13} /> : <Copy size={13} />}
      onClick={handle}
      sx={{
        borderRadius: 1.5, fontWeight: 600, fontSize: '0.75rem', textTransform: 'none',
        borderColor: copied ? '#16a34a' : colors.border.medium,
        color: copied ? '#16a34a' : colors.text.secondary,
        '&:hover': { borderColor: colors.accent.primary, color: colors.accent.primary },
        transition: 'all 0.2s',
      }}
    >
      {copied ? 'Copied!' : label}
    </Button>
  );
};

/* ════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════ */
const WhatsAppLinkGenerator = () => {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [linkType, setLinkType] = useState('wa'); // 'wa' | 'api'
  const [showQR, setShowQR] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  const generatedLink = buildLink(phone, message, linkType);
  const hasLink = !!generatedLink;

  const handlePhone = (e) => {
    const val = e.target.value;
    setPhone(val);
    const cleaned = val.replace(/\D/g, '');
    if (val && (cleaned.length < 7 || cleaned.length > 15)) {
      setPhoneError('Enter a valid phone number with country code (e.g. 919495664173)');
    } else {
      setPhoneError('');
    }
  };

  const handleReset = () => {
    setPhone('');
    setMessage('');
    setLinkType('wa');
    setShowQR(false);
    setPhoneError('');
  };

  /* Template messages */
  const templates = [
    { label: 'Hello', text: 'Hi! I came across your business and would like to know more.' },
    { label: 'Inquiry', text: 'Hello, I would like to inquire about your products/services.' },
    { label: 'Quote', text: 'Hi, can you please share a quotation for the following requirements?' },
    { label: 'Support', text: 'Hi, I need help with my recent order/service.' },
    { label: 'Appointment', text: 'Hi, I would like to book an appointment. Please let me know your availability.' },
  ];

  const charCount = message.length;
  const charLimit = 4096; // WhatsApp URL safe limit

  const pageTitle = 'Free WhatsApp Link & QR Code Generator | Business Chat Link | Aslisite';
  const pageDesc =
    'Generate a direct WhatsApp chat link with a pre-filled message and a scannable QR code for your business. Free, instant, no login required.';

  return (
    <Container maxWidth="lg" className="tool-page-container" sx={{ pt: { xs: 16, md: 16 }, pb: { xs: 8, md: 12 } }}>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={absoluteUrl('/tools/whatsapp-link-generator')} />
        <meta property="og:url" content={absoluteUrl('/tools/whatsapp-link-generator')} />
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
            '@id': `${absoluteUrl('/tools/whatsapp-link-generator')}#app`,
            url: absoluteUrl('/tools/whatsapp-link-generator'),
            name: 'Free WhatsApp Link & QR Generator — Aslisite',
            description: pageDesc,
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Any',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
            publisher: { '@id': `${siteMetadata.baseUrl}/#organization` },
          })}
        </script>
      </Helmet>

      {/* Breadcrumb */}
      <Stack direction="row" alignItems="center" gap={0.5} sx={{ mb: 4 }}>
        <Box component={RouterLink} to="/tools" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: colors.text.muted, textDecoration: 'none', fontSize: '0.82rem', fontWeight: 500, '&:hover': { color: colors.accent.primary }, transition: 'color 0.2s' }}>
          <ArrowLeft size={14} />Free Tools
        </Box>
        <ChevronRight size={13} style={{ color: colors.text.muted }} />
        <Typography sx={{ fontSize: '0.82rem', color: colors.text.secondary, fontWeight: 500 }}>WhatsApp Link & QR Generator</Typography>
      </Stack>

      {/* Header */}
      <Box component={motion.div} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} sx={{ mb: { xs: 5, md: 6 } }}>
        <SectionBadge icon={QrCode} label="Chat Link + QR Code · Free · Instant" />
        <Typography variant="h1" sx={{ fontSize: { xs: '1.9rem', sm: '2.5rem', md: '2.8rem' }, fontWeight: 800, color: colors.text.primary, mt: 2, mb: 1.5, letterSpacing: '-0.03em' }}>
          WhatsApp Link & QR Generator
        </Typography>
        <Typography variant="subtitle1" sx={{ color: colors.text.secondary, maxWidth: 560, lineHeight: 1.7 }}>
          Create a direct wa.me chat link with a pre-filled message and a scannable QR code for
          your website, business card, or storefront.
        </Typography>
      </Box>

      <Grid container spacing={3} alignItems="flex-start">
        {/* ── Input column ── */}
        <Grid item xs={12} md={6}>
          <Card
            component={motion.div}
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            sx={{ borderRadius: 3, border: `1px solid ${colors.border.light}`, boxShadow: 'none' }}
          >
            <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
              {/* Phone */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: colors.text.primary, mb: 1 }}>
                  WhatsApp Number *
                </Typography>
                <TextField
                  fullWidth size="small" placeholder="e.g. 919495664173"
                  value={phone} onChange={handlePhone} error={!!phoneError} helperText={phoneError || 'Include country code without + or spaces (e.g. 91 for India)'}
                  inputProps={{ inputMode: 'tel', 'aria-label': 'WhatsApp phone number' }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontFamily: '"JetBrains Mono", monospace', fontWeight: 600 } }}
                />
              </Box>

              {/* Pre-filled message */}
              <Box sx={{ mb: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: colors.text.primary }}>
                    Pre-filled Message (optional)
                  </Typography>
                  <Typography variant="caption" sx={{ color: charCount > charLimit * 0.9 ? '#dc2626' : colors.text.muted }}>
                    {charCount}/{charLimit}
                  </Typography>
                </Stack>
                <TextField
                  fullWidth multiline rows={4} size="small"
                  placeholder="Type a message that opens pre-filled in WhatsApp..."
                  value={message} onChange={(e) => setMessage(e.target.value)}
                  inputProps={{ maxLength: charLimit, 'aria-label': 'Pre-filled message' }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                />

                {/* Templates */}
                <Box sx={{ mt: 1.5 }}>
                  <Typography variant="caption" sx={{ color: colors.text.muted, fontWeight: 600, mr: 1 }}>Quick templates:</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mt: 0.75 }}>
                    {templates.map((t) => (
                      <Chip
                        key={t.label}
                        label={t.label}
                        size="small"
                        onClick={() => setMessage(t.text)}
                        sx={{
                          fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer',
                          backgroundColor: message === t.text ? `${colors.accent.primary}14` : colors.background.secondary,
                          color: message === t.text ? colors.accent.primary : colors.text.secondary,
                          border: `1px solid ${message === t.text ? `${colors.accent.primary}30` : colors.border.light}`,
                          '&:hover': { backgroundColor: `${colors.accent.primary}10`, color: colors.accent.primary },
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Box>

              {/* Link type */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: colors.text.primary, mb: 1.5 }}>
                  Link Format
                </Typography>
                <ToggleButtonGroup value={linkType} exclusive onChange={(_, v) => v && setLinkType(v)} fullWidth size="small" aria-label="Link type">
                  <ToggleButton value="wa" aria-label="wa.me link"
                    sx={{
                      borderRadius: '10px !important', border: `1px solid ${colors.border.medium} !important`,
                      py: 1.1, fontWeight: 600, fontSize: '0.8rem', textTransform: 'none', gap: 0.8,
                      '&.Mui-selected': { backgroundColor: '#25D366', color: '#fff', borderColor: '#25D366 !important', '&:hover': { backgroundColor: '#1ebc5a' } },
                      '&:not(.Mui-selected):hover': { backgroundColor: '#f0fdf4' },
                    }}>
                    <Smartphone size={14} />
                    wa.me (Mobile)
                  </ToggleButton>
                  <ToggleButton value="api" aria-label="api.whatsapp.com link"
                    sx={{
                      borderRadius: '10px !important', border: `1px solid ${colors.border.medium} !important`,
                      py: 1.1, fontWeight: 600, fontSize: '0.8rem', textTransform: 'none', gap: 0.8,
                      '&.Mui-selected': { backgroundColor: '#25D366', color: '#fff', borderColor: '#25D366 !important', '&:hover': { backgroundColor: '#1ebc5a' } },
                      '&:not(.Mui-selected):hover': { backgroundColor: '#f0fdf4' },
                    }}>
                    <Globe size={14} />
                    api.whatsapp.com
                  </ToggleButton>
                </ToggleButtonGroup>
                <Typography variant="caption" sx={{ color: colors.text.muted, mt: 0.8, display: 'block' }}>
                  {linkType === 'wa'
                    ? 'wa.me — recommended for buttons, bio links, and QR codes'
                    : 'api.whatsapp.com — preferred for WhatsApp Business integrations'}
                </Typography>
              </Box>

              <Button variant="outlined" startIcon={<RotateCcw size={14} />} onClick={handleReset} size="small"
                sx={{ borderRadius: 2, fontWeight: 600, fontSize: '0.8rem', textTransform: 'none', borderColor: colors.border.medium, color: colors.text.muted, '&:hover': { borderColor: colors.accent.primary, color: colors.accent.primary } }}>
                Reset
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* ── Output column ── */}
        <Grid item xs={12} md={6}>
          <Box
            component={motion.div}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            {/* Empty state */}
            {!hasLink && (
              <Card sx={{ borderRadius: 3, border: `1px dashed ${colors.border.medium}`, boxShadow: 'none', backgroundColor: '#fafafa' }}>
                <CardContent sx={{ p: { xs: 4, md: 5 }, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ width: 56, height: 56, borderRadius: 3, backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#25D366' }}>
                    <MessageCircle size={26} strokeWidth={1.5} />
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: colors.text.primary }}>Enter a phone number</Typography>
                  <Typography variant="body2" sx={{ color: colors.text.muted, maxWidth: 260 }}>
                    Your WhatsApp chat link and QR code will appear here.
                  </Typography>
                </CardContent>
              </Card>
            )}

            {/* Generated output */}
            <AnimatePresence mode="wait">
              {hasLink && (
                <Box
                  component={motion.div}
                  key={generatedLink}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Link card */}
                  <Card sx={{ borderRadius: 3, border: `1.5px solid #86efac`, backgroundColor: '#f0fdf4', boxShadow: 'none', mb: 2 }}>
                    <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
                        <Typography variant="overline" sx={{ color: '#16a34a', fontWeight: 700, fontSize: '0.68rem', letterSpacing: '0.1em' }}>
                          Your WhatsApp Link
                        </Typography>
                        <Chip label="Ready" size="small" sx={{ backgroundColor: '#dcfce7', color: '#16a34a', fontWeight: 700, fontSize: '0.68rem', height: 20 }} />
                      </Stack>

                      {/* Link display */}
                      <Box
                        sx={{
                          p: 1.5, borderRadius: 1.5, backgroundColor: 'rgba(255,255,255,0.8)',
                          border: `1px solid #86efac`, mb: 2, overflowX: 'auto',
                          fontFamily: '"JetBrains Mono", monospace', fontSize: '0.78rem',
                          color: colors.text.primary, wordBreak: 'break-all', lineHeight: 1.6,
                        }}
                      >
                        {generatedLink}
                      </Box>

                      <Stack direction="row" gap={1} flexWrap="wrap">
                        <CopyBtn text={generatedLink} label="Copy Link" />
                        <Button
                          size="small" variant="contained" startIcon={<ExternalLink size={13} />}
                          href={generatedLink} target="_blank" rel="noopener noreferrer"
                          sx={{ borderRadius: 1.5, fontWeight: 600, fontSize: '0.75rem', textTransform: 'none', backgroundColor: '#25D366', color: '#fff', boxShadow: 'none', '&:hover': { backgroundColor: '#1ebc5a' } }}
                        >
                          Test Link
                        </Button>
                        <Button
                          size="small" variant="outlined" startIcon={showQR ? <ChevronRight size={13} style={{ transform: 'rotate(90deg)' }} /> : <QrCode size={13} />}
                          onClick={() => setShowQR(!showQR)}
                          sx={{ borderRadius: 1.5, fontWeight: 600, fontSize: '0.75rem', textTransform: 'none', borderColor: '#86efac', color: '#16a34a', '&:hover': { borderColor: '#16a34a', backgroundColor: 'rgba(22,163,74,0.06)' } }}
                        >
                          {showQR ? 'Hide QR' : 'Show QR'}
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>

                  {/* QR Code card */}
                  <AnimatePresence>
                    {showQR && (
                      <Card
                        component={motion.div}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        sx={{ borderRadius: 3, border: `1px solid ${colors.border.light}`, boxShadow: 'none', mb: 2, overflow: 'hidden' }}
                      >
                        <CardContent sx={{ p: { xs: 2.5, md: 3 }, textAlign: 'center' }}>
                          <Typography variant="overline" sx={{ color: colors.text.muted, fontWeight: 700, fontSize: '0.68rem', letterSpacing: '0.1em', display: 'block', mb: 2 }}>
                            Scan to Open WhatsApp
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                            <QRCanvas text={generatedLink} size={200} />
                          </Box>
                          <Typography variant="caption" sx={{ color: colors.text.muted, display: 'block' }}>
                            Right-click the QR code → "Save image" to download it
                          </Typography>
                          <Typography variant="caption" sx={{ color: colors.text.muted, display: 'block', mt: 0.5 }}>
                            Or use <strong>Ctrl+P</strong> to print the page with the QR code
                          </Typography>
                        </CardContent>
                      </Card>
                    )}
                  </AnimatePresence>

                  {/* Preview card */}
                  {message && (
                    <Card sx={{ borderRadius: 3, border: `1px solid ${colors.border.light}`, boxShadow: 'none', mb: 2 }}>
                      <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
                        <Typography variant="caption" sx={{ color: colors.text.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', mb: 1.5 }}>
                          Message Preview
                        </Typography>
                        <Box
                          sx={{
                            display: 'inline-block', maxWidth: '85%',
                            p: '10px 14px', borderRadius: '4px 16px 16px 16px',
                            backgroundColor: '#dcfce7', border: '1px solid #86efac',
                          }}
                        >
                          <Typography variant="body2" sx={{ color: '#14532d', lineHeight: 1.6, fontSize: '0.875rem', whiteSpace: 'pre-wrap' }}>
                            {message}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  )}

                  {/* Embed snippet */}
                  <Card sx={{ borderRadius: 3, border: `1px solid ${colors.border.light}`, boxShadow: 'none' }}>
                    <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
                        <Typography variant="caption" sx={{ color: colors.text.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          HTML Button Snippet
                        </Typography>
                        <CopyBtn
                          text={`<a href="${generatedLink}" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:8px;background:#25D366;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600;">Chat on WhatsApp</a>`}
                          label="Copy HTML"
                        />
                      </Stack>
                      <Box
                        component="pre"
                        sx={{
                          p: 1.5, borderRadius: 1.5, backgroundColor: '#18181b',
                          color: '#a3e635', fontSize: '0.72rem', overflowX: 'auto',
                          whiteSpace: 'pre-wrap', wordBreak: 'break-all', lineHeight: 1.6, m: 0,
                          fontFamily: '"JetBrains Mono", monospace',
                        }}
                      >
                        {`<a href="${generatedLink}"\n   target="_blank"\n   rel="noopener noreferrer">\n  Chat on WhatsApp\n</a>`}
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              )}
            </AnimatePresence>
          </Box>
        </Grid>
      </Grid>

      {/* Tips section */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        sx={{ mt: { xs: 7, md: 10 } }}
      >
        <Divider sx={{ mb: { xs: 6, md: 8 } }} />
        <Typography variant="h2" sx={{ fontSize: { xs: '1.4rem', md: '1.8rem' }, fontWeight: 800, color: colors.text.primary, mb: 4, letterSpacing: '-0.03em' }}>
          How to use your WhatsApp link
        </Typography>
        <Grid container spacing={2.5}>
          {[
            { icon: Globe, title: 'Add to your website', desc: 'Use the HTML snippet to add a "Chat on WhatsApp" button to your website. Visitors can reach you in one click.' },
            { icon: QrCode, title: 'Print on business cards', desc: 'Download the QR code and print it on business cards, brochures, or your storefront so customers can scan and chat instantly.' },
            { icon: Smartphone, title: 'Share in your bio', desc: 'Paste your wa.me link in your Instagram bio, LinkedIn profile, or any social media to make it easy for clients to reach you.' },
            { icon: MessageCircle, title: 'Use in email signatures', desc: 'Add the link to your email signature. A pre-filled message saves your clients from having to type a greeting.' },
          ].map((tip) => (
            <Grid item xs={12} sm={6} md={3} key={tip.title}>
              <Card sx={{ height: '100%', borderRadius: 3, border: `1px solid ${colors.border.light}`, boxShadow: 'none' }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ width: 40, height: 40, borderRadius: 2, backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#25D366', mb: 2 }}>
                    <tip.icon size={20} strokeWidth={1.8} />
                  </Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: colors.text.primary, mb: 0.75 }}>{tip.title}</Typography>
                  <Typography variant="body2" sx={{ color: colors.text.secondary, fontSize: '0.82rem', lineHeight: 1.65 }}>{tip.desc}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Alert severity="info" sx={{ mt: 4, borderRadius: 2, backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', '& .MuiAlert-icon': { color: '#0369a1' } }}>
          <Typography variant="caption" sx={{ color: colors.text.secondary, lineHeight: 1.6 }}>
            <strong>Privacy note:</strong> This tool runs entirely in your browser. Your phone number and message are never stored on any server. The generated link is a standard WhatsApp URL that opens the chat app directly.
          </Typography>
        </Alert>
      </Box>
    </Container>
  );
};

export default WhatsAppLinkGenerator;
