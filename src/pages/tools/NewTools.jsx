import heroHeading from '../../theme/heroHeading';
import { useMemo, useRef, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Slider,
  FormControlLabel,
  Checkbox,
  Stack,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { Link as RouterLink } from 'react-router-dom';
import {
  ArrowLeft,
  BarChart3,
  Barcode,
  BriefcaseBusiness,
  Check,
  Code2,
  Copy,
  Download,
  ImageDown,
  Link2,
  Mail,
  Percent,
  QrCode,
  ScanLine,
  Tags,
  WalletCards,
} from 'lucide-react';
import QRCode from 'qrcode';
import { motion } from 'framer-motion';
import { colors } from '../../theme/theme';
import { absoluteUrl, siteMetadata } from '../../seo/siteMetadata';
import { SectionBadge } from '../../components/common';
import { detectRegion } from './regionConfig';

const toolMeta = {
  email: [
    'Email Signature Generator',
    'Create a professional HTML email signature you can copy into Gmail, Outlook, or any email client.',
    Mail,
  ],
  image: [
    'Image Compressor & Resizer',
    'Compress and resize images privately in your browser. Your files never leave this device.',
    ImageDown,
  ],
  barcode: [
    'Barcode Generator',
    'Generate CODE128, EAN, UPC-A, and CODE39 barcodes for products, inventory, and labels.',
    Barcode,
  ],
  utm: [
    'UTM Campaign URL Builder',
    'Build clean tracking URLs for Google Analytics and every marketing campaign.',
    Link2,
  ],
  qr: [
    'General QR Code Generator',
    'Create a QR code for any URL, text, contact detail, or payment instruction.',
    QrCode,
  ],
  roi: [
    'ROI Calculator',
    'Measure return on investment, profit, and break-even performance in any currency.',
    BarChart3,
  ],
  loan: [
    'Business Loan Calculator',
    'Estimate monthly payments, total interest, and repayment cost for a business loan.',
    WalletCards,
  ],
  discount: [
    'Discount & Sale Price Calculator',
    'Calculate sale prices, savings, and discounts quickly for any currency.',
    Percent,
  ],
  meta: [
    'Meta Tag & Open Graph Generator',
    'Generate SEO meta tags and social sharing tags ready to paste into your website.',
    Tags,
  ],
  card: [
    'Business Card Maker',
    'Create a clean, print-ready business card preview with your own contact details.',
    WalletCards,
  ],
};
const toolSeoExtras = {
  email: ['Enter your details, choose a template, then copy the signature into your email client.', 'How do I add an email signature?', 'Copy the formatted signature and paste it into Gmail, Outlook, or Apple Mail.'],
  image: ['Choose an image, set dimensions and quality, then download the optimized file.', 'Is image compression private?', 'Yes. Processing happens in your browser and files are never uploaded.'],
  barcode: ['Select a barcode format, enter a valid value, adjust sizing, and download.', 'Which barcode format should I use?', 'Use CODE128 for flexible text and EAN or UPC for retail product numbers.'],
  utm: ['Enter a landing page and campaign values to create a trackable URL.', 'Are UTM values encoded safely?', 'Yes. The browser URL API preserves existing parameters and encodes values.'],
  qr: ['Choose a content type, fill in its fields, and download the generated QR code.', 'What can this QR generator encode?', 'It supports URLs, text, email, phone, SMS, Wi-Fi and contact cards.'],
  roi: ['Enter investment and return values to calculate ROI, profit and break-even performance.', 'How is ROI calculated?', 'ROI is net profit divided by total investment, multiplied by 100.'],
  loan: ['Enter loan details to estimate repayment and inspect the amortization schedule.', 'Does this loan calculator support 0% interest?', 'Yes. At 0% interest, principal is divided evenly across the selected term.'],
  discount: ['Enter a price and discounts to see tax, savings and final sale price instantly.', 'Can I calculate stacked discounts?', 'Yes. The second discount is applied sequentially to the already discounted price.'],
  meta: ['Add page and social details to generate escaped SEO, Open Graph and Twitter tags.', 'Does this tool crawl my website?', 'No. All metadata is entered and generated locally in your browser.'],
  card: ['Add contact details, choose a template and export a print-ready business card.', 'Can I print both sides?', 'Yes. Enable the back card and use the card-only PDF print flow.'],
};

const inputSx = { '& .MuiOutlinedInput-root': { borderRadius: 1.5 } };
const num = (v) => parseFloat(v) || 0;
const money = (v, currency = '₹') =>
  `${currency} ${num(v).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
const detectCurrencyCode = () => {
  if (typeof Intl === 'undefined') return 'USD';
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (tz === 'Asia/Kolkata' || tz === 'Asia/Calcutta') return 'INR';
  } catch {}
  if (typeof navigator === 'undefined') return 'USD';
  const locale = (navigator.languages?.[0] || navigator.language || '').toLowerCase();
  const region = locale.split('-')[1]?.toUpperCase();
  return ({ IN: 'INR', GB: 'GBP', AE: 'AED', CA: 'CAD', AU: 'AUD', DE: 'EUR', FR: 'EUR', ES: 'EUR', IT: 'EUR' })[region] || 'USD';
};
const download = (blob, name) => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
};

function ToolShell({ kind, children }) {
  const [title, description, Icon] = toolMeta[kind];
  const path = `/tools/${kind === 'email' ? 'email-signature-generator' : kind === 'image' ? 'image-compressor-resizer' : kind === 'barcode' ? 'barcode-generator' : kind === 'utm' ? 'utm-campaign-url-builder' : kind === 'qr' ? 'qr-code-generator' : kind === 'roi' ? 'roi-calculator' : kind === 'loan' ? 'business-loan-calculator' : kind === 'discount' ? 'discount-sale-price-calculator' : kind === 'meta' ? 'meta-tag-generator' : 'business-card-maker'}`;
  return (
    <Container
      maxWidth="lg"
      className="tool-page-container"
      sx={{ pt: { xs: 16, md: 16 }, pb: { xs: 8, md: 12 } }}
    >
      <Helmet>
        <title>{`Free ${title} | Aslisite`}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={absoluteUrl(path)} />
        <meta property="og:title" content={`Free ${title} | Aslisite`} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={absoluteUrl(path)} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={siteMetadata.logo} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Free ${title} | Aslisite`} />
        <meta name="twitter:description" content={description} />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: title,
            description,
            url: absoluteUrl(path),
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Any',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
            publisher: { '@id': `${siteMetadata.baseUrl}/#organization` },
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Free Tools', item: absoluteUrl('/tools') }, { '@type': 'ListItem', position: 2, name: title, item: absoluteUrl(path) }] })}
        </script>
      </Helmet>
      <Stack direction="row" alignItems="center" gap={0.5} sx={{ mb: 4 }}>
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
          }}
        >
          <ArrowLeft size={14} />
          Free Tools
        </Box>
        <Typography sx={{ color: colors.text.muted }}>›</Typography>
        <Typography sx={{ fontSize: '0.82rem', color: colors.text.secondary }}>{title}</Typography>
      </Stack>
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        sx={{ mb: { xs: 5, md: 6 } }}
      >
        <SectionBadge icon={Icon} label={`Free ${title}`} />
        <Typography
          variant="h1"
          sx={{
              ...heroHeading,
              mt: 2,
              mb: 1.5,
            }}
        >
          {title}
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ color: colors.text.secondary, maxWidth: 650, lineHeight: 1.7 }}
        >
          {description}
        </Typography>
      </Box>
      {children}
      <Box sx={{ mt: { xs: 5, md: 7 }, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        <Box><Typography variant="h2" sx={{ fontSize: '1.25rem', fontWeight: 750, mb: 1.5 }}>How to use</Typography><Typography variant="body2" sx={{ color: colors.text.secondary, lineHeight: 1.7 }}>{toolSeoExtras[kind]?.[0]}</Typography></Box>
        <Box><Typography variant="h2" sx={{ fontSize: '1.25rem', fontWeight: 750, mb: 1.5 }}>Frequently asked question</Typography><Typography variant="subtitle2" sx={{ mb: 0.5 }}>{toolSeoExtras[kind]?.[1]}</Typography><Typography variant="body2" sx={{ color: colors.text.secondary, lineHeight: 1.7 }}>{toolSeoExtras[kind]?.[2]}</Typography></Box>
        <Box sx={{ gridColumn: { md: '1 / -1' } }}><Button component={RouterLink} to="/tools" variant="text" sx={{ px: 0, textTransform: 'none' }}>Explore all free tools →</Button></Box>
      </Box>
    </Container>
  );
}

const Field = ({ label, ...props }) => (
  <TextField label={label} fullWidth size="small" sx={inputSx} {...props} />
);
const Panel = ({ children }) => (
  <Card sx={{ borderRadius: 3, border: `1px solid ${colors.border.light}`, boxShadow: 'none' }}>
    <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>{children}</CardContent>
  </Card>
);
const Actions = ({ onReset }) => (
  <Stack direction="row" gap={1.5} sx={{ mb: 2 }}>
    <Button variant="outlined" onClick={onReset} sx={{ borderRadius: 2, textTransform: 'none' }}>
      Reset
    </Button>
  </Stack>
);

const esc = (value) =>
  String(value || '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );
const normalUrl = (value) => {
  const v = String(value || '').trim();
  if (!v) return '';
  try {
    // Preserve valid schemes (including data:image URLs for local previews).
    return new URL(/^[a-z][a-z0-9+.-]*:/i.test(v) ? v : `https://${v}`).toString();
  } catch {
    return '';
  }
};
const normalEmail = (value) =>
  String(value || '')
    .trim()
    .toLowerCase();
const normalPhone = (value) => {
  const v = String(value || '').trim();
  return v.startsWith('+') ? `+${v.slice(1).replace(/\D/g, '')}` : v.replace(/\D/g, '');
};
function EmailSignature() {
  const blank = {
    name: '',
    role: '',
    company: '',
    phone: '',
    email: '',
    website: '',
    address: '',
    linkedin: '',
    twitter: '',
    instagram: '',
    logo: '',
    color: '#6d28d9',
    template: 'classic',
  };
  const [d, setD] = useState(blank);
  const set = (k) => (e) => setD({ ...d, [k]: e.target.value });
  const updateNormalized = (key, fn) => (e) => setD({ ...d, [key]: fn(e.target.value) });
  const validEmail = !d.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email);
  const validPhone = !d.phone || /^\+?\d{7,15}$/.test(normalPhone(d.phone));
  const email = normalEmail(d.email);
  const phone = normalPhone(d.phone);
  const website = normalUrl(d.website);
  const link = (label, href, color = d.color) =>
    href
      ? `<a href="${esc(href)}" style="color:${color};text-decoration:none">${esc(label)}</a>`
      : '';
  const details = [
    phone && link(phone, `tel:${phone}`),
    email && link(email, `mailto:${email}`),
    website && link(website.replace(/^https?:\/\//, '').replace(/\/$/, ''), website),
  ]
    .filter(Boolean)
    .join(' <span style="color:#cbd5e1">|</span> ');
  const socials = [
    ['LinkedIn', normalUrl(d.linkedin)],
    ['X', normalUrl(d.twitter)],
    ['Instagram', normalUrl(d.instagram)],
  ]
    .filter(([, u]) => u)
    .map(([label, u]) => link(label, u))
    .join(' &nbsp; ');
  const logo =
    d.logo && normalUrl(d.logo)
      ? `<img src="${esc(normalUrl(d.logo))}" width="64" height="64" alt="${esc(d.company || d.name || 'Logo')}" style="display:block;border:0;border-radius:8px;object-fit:cover">`
      : '';
  const content = `<strong style="font-size:18px;line-height:1.25;color:#111827">${esc(d.name || 'Your Name')}</strong><br><span style="font-size:13px;color:#64748b">${esc(d.role || 'Your Role')}${d.company ? ` · ${esc(d.company)}` : ''}</span>${d.address ? `<br><span style="font-size:12px;color:#64748b">${esc(d.address)}</span>` : ''}${details ? `<br><span style="font-size:12px;line-height:2">${details}</span>` : ''}${socials ? `<br><span style="font-size:12px;line-height:2">${socials}</span>` : ''}`;
  const html =
    d.template === 'minimal'
      ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,Helvetica,sans-serif;color:#1f2937;border-top:3px solid ${d.color};width:100%;max-width:560px"><tr><td style="padding:14px 0">${logo ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right:14px;vertical-align:top">${logo}</td><td style="vertical-align:top">${content}</td></tr></table>` : content}</td></tr></table>`
      : d.template === 'compact'
        ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,Helvetica,sans-serif;color:#1f2937"><tr><td style="padding:10px 14px;border-left:4px solid ${d.color}">${logo ? `${logo}<br>` : ''}${content}</td></tr></table>`
        : `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,Helvetica,sans-serif;color:#1f2937"><tr>${logo ? `<td style="padding:0 16px 0 0;vertical-align:top">${logo}</td>` : ''}<td style="padding:0 0 0 16px;border-left:3px solid ${d.color};vertical-align:top">${content}</td></tr></table>`;
  const plain = [
    d.name || 'Your Name',
    [d.role, d.company].filter(Boolean).join(' · '),
    d.address,
    phone,
    email,
    website,
    d.linkedin,
    d.twitter,
    d.instagram,
  ]
    .filter(Boolean)
    .join('\n');
  const copySignature = async () => {
    try {
      if (navigator.clipboard?.write && window.ClipboardItem)
        await navigator.clipboard.write([
          new ClipboardItem({
            'text/html': new Blob([html], { type: 'text/html' }),
            'text/plain': new Blob([plain], { type: 'text/plain' }),
          }),
        ]);
      else await navigator.clipboard?.writeText(plain);
    } catch {
      await navigator.clipboard?.writeText(plain);
    }
  };
  const copyHtml = () => navigator.clipboard?.writeText(html);
  return (
    <ToolShell kind="email">
      <Grid container spacing={3} alignItems="flex-start">
        <Grid item xs={12} md={6}>
          <Panel>
            <Stack spacing={2}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Your details
              </Typography>
              <Field label="Full name" value={d.name} onChange={set('name')} />
              <Field label="Job title" value={d.role} onChange={set('role')} />
              <Field label="Company" value={d.company} onChange={set('company')} />
              <Field
                label="Phone"
                value={d.phone}
                onChange={updateNormalized('phone', normalPhone)}
                error={!validPhone}
                helperText={
                  !validPhone
                    ? 'Use 7–15 digits, optionally starting with +'
                    : 'Include country code for international recipients'
                }
                inputProps={{ inputMode: 'tel' }}
              />
              <Field
                label="Email"
                value={d.email}
                onChange={updateNormalized('email', normalEmail)}
                error={!validEmail}
                helperText={!validEmail ? 'Enter a valid email address' : ''}
                inputProps={{ type: 'email' }}
              />
              <Field
                label="Website"
                value={d.website}
                onChange={set('website')}
                onBlur={() => setD({ ...d, website: website })}
                placeholder="example.com"
              />
              <Field
                label="Address (optional)"
                value={d.address}
                onChange={set('address')}
                multiline
                minRows={2}
              />
              <Field
                label="Logo / profile image URL (optional)"
                value={d.logo}
                onChange={set('logo')}
                placeholder="https://..."
              />
              <Field label="LinkedIn URL (optional)" value={d.linkedin} onChange={set('linkedin')} placeholder="linkedin.com/in/you" />
              <Field label="X / Twitter URL (optional)" value={d.twitter} onChange={set('twitter')} placeholder="x.com/you" />
              <Field label="Instagram URL (optional)" value={d.instagram} onChange={set('instagram')} placeholder="instagram.com/you" />
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Field
                    select
                    SelectProps={{ native: true }}
                    label="Template"
                    value={d.template}
                    onChange={set('template')}
                  >
                    <option value="classic">Classic split</option>
                    <option value="minimal">Minimal top rule</option>
                    <option value="compact">Compact accent</option>
                  </Field>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" sx={{ color: colors.text.muted }}>
                    Accent color
                  </Typography>
                  <Stack direction="row" alignItems="center" gap={1}>
                    <Box
                      component="input"
                      type="color"
                      value={d.color}
                      onChange={set('color')}
                      sx={{
                        width: 42,
                        height: 36,
                        p: 0.25,
                        border: 0,
                        background: 'transparent',
                        cursor: 'pointer',
                      }}
                    />
                    <Field
                      label="Hex color"
                      value={d.color}
                      onChange={set('color')}
                      inputProps={{ maxLength: 7 }}
                    />
                  </Stack>
                  <Stack direction="row" gap={1} sx={{ mt: 1 }}>
                    {['#6d28d9', '#0d9488', '#1d4ed8', '#111827'].map((c) => (
                      <Box
                        key={c}
                        onClick={() => setD({ ...d, color: c })}
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          backgroundColor: c,
                          cursor: 'pointer',
                          border: d.color === c ? '3px solid #fff' : '1px solid #e2e8f0',
                          boxShadow: d.color === c ? `0 0 0 2px ${c}` : 'none',
                        }}
                      />
                    ))}
                  </Stack>
                </Grid>
              </Grid>
              <Stack direction={{ xs: 'column', sm: 'row' }} gap={1.5}>
                <Button
                  variant="outlined"
                  onClick={() => setD(blank)}
                  sx={{ textTransform: 'none' }}
                >
                  Reset
                </Button>
              </Stack>
            </Stack>
          </Panel>
        </Grid>
        <Grid item xs={12} md={6}>
          <Panel>
            <Typography variant="overline" sx={{ color: colors.accent.primary, fontWeight: 700 }}>
              Live preview
            </Typography>
            <Box
              sx={{
                p: { xs: 2, md: 3 },
                mt: 1,
                border: `1px solid ${colors.border.light}`,
                borderRadius: 2,
                overflowX: 'auto',
              }}
              dangerouslySetInnerHTML={{ __html: html }}
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} gap={1.5} sx={{ mt: 2 }}>
              <Button
                startIcon={<Copy size={16} />}
                variant="contained"
                onClick={copySignature}
                disabled={!validEmail || !validPhone}
                sx={{ textTransform: 'none' }}
              >
                Copy Signature
              </Button>
              <Button
                startIcon={<Code2 size={16} />}
                variant="outlined"
                onClick={copyHtml}
                sx={{ textTransform: 'none' }}
              >
                Copy HTML
              </Button>
            </Stack>
            <Typography
              variant="caption"
              sx={{ color: colors.text.muted, display: 'block', mt: 1 }}
            >
              Copy Signature includes formatted HTML and a plain-text fallback for Gmail, Outlook,
              and Apple Mail.
            </Typography>
          </Panel>
        </Grid>
      </Grid>
    </ToolShell>
  );
}

function ImageTool() {
  const [src, setSrc] = useState(null); const [out, setOut] = useState(null); const [w, setW] = useState(''); const [h, setH] = useState('');
  const [locked, setLocked] = useState(true); const [format, setFormat] = useState('image/jpeg'); const [quality, setQuality] = useState(80); const [error, setError] = useState(''); const [drag, setDrag] = useState(false); const ref = useRef();
  const acceptFile = (file) => { if (!file || !file.type.startsWith('image/')) { setError('Choose a JPG, PNG, WebP, GIF, or other image file.'); return; } if (file.size > 20 * 1024 * 1024) { setError('Images must be 20 MB or smaller.'); return; } setError(''); if (src?.url) URL.revokeObjectURL(src.url); const url = URL.createObjectURL(file); const img = new Image(); img.onload = () => { setSrc({ url, img, name: file.name, width: img.width, height: img.height, size: file.size }); setW(String(img.width)); setH(String(img.height)); setOut(null); }; img.onerror = () => { URL.revokeObjectURL(url); setError('That image could not be read in your browser.'); }; img.src = url; };
  const load = (e) => acceptFile(e.target.files?.[0]);
  const setWidth = (value) => { const next = value.replace(/\D/g, '').slice(0, 5); setW(next); if (locked && src && num(next)) setH(String(Math.max(1, Math.round(num(next) * src.height / src.width)))); setOut(null); };
  const setHeight = (value) => { const next = value.replace(/\D/g, '').slice(0, 5); setH(next); if (locked && src && num(next)) setW(String(Math.max(1, Math.round(num(next) * src.width / src.height)))); setOut(null); };
  const process = () => { if (!src) return; const width = num(w), height = num(h); if (!width || !height || width > 10000 || height > 10000) { setError('Enter dimensions between 1 and 10,000 pixels.'); return; } setError(''); const c = document.createElement('canvas'); c.width = width; c.height = height; c.getContext('2d').drawImage(src.img, 0, 0, width, height); const qualityValue = format === 'image/png' ? undefined : quality / 100; c.toBlob((blob) => { if (!blob) { setError('This browser could not process the image.'); return; } const ext = format.split('/')[1].replace('jpeg', 'jpg'); const base = src.name.replace(/\.[^.]+$/, '').replace(/[^a-z0-9-_]+/gi, '-').replace(/^-+|-+$/g, '').toLowerCase() || 'image'; setOut({ blob, url: URL.createObjectURL(blob), width, height, size: blob.size, type: format, filename: `${base}-optimized.${ext}` }); }, format, qualityValue); };
  const reset = () => { if (src?.url) URL.revokeObjectURL(src.url); if (out?.url) URL.revokeObjectURL(out.url); setSrc(null); setOut(null); setW(''); setH(''); setError(''); if (ref.current) ref.current.value = ''; };
  const saved = src && out ? Math.max(0, (1 - out.size / src.size) * 100) : 0;
  return (
    <ToolShell kind="image">
      <Panel>
        <Stack spacing={2}>
          <Box onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={(e) => { e.preventDefault(); setDrag(false); acceptFile(e.dataTransfer.files?.[0]); }} sx={{ p: { xs: 2.5, md: 4 }, textAlign: 'center', border: `1.5px dashed ${drag ? colors.accent.primary : colors.border.medium}`, borderRadius: 3, backgroundColor: drag ? 'rgba(109,40,217,.05)' : 'transparent', transition: 'all .2s' }}><ImageDown size={28} color={colors.accent.primary} /><Typography sx={{ mt: 1, fontWeight: 700 }}>Drop an image here</Typography><Typography variant="body2" sx={{ color: colors.text.muted, mb: 1.5 }}>JPG, PNG, WebP, GIF · up to 20 MB</Typography><Button variant="outlined" component="label" sx={{ textTransform: 'none' }}>Choose image<input ref={ref} hidden type="file" accept="image/*" onChange={load} /></Button></Box>
          {error && <Alert severity="error">{error}</Alert>}
          {src && (
            <Stack direction="row" justifyContent="space-between" flexWrap="wrap" gap={1}><Typography variant="body2" sx={{ fontWeight: 600 }}>{src.name}</Typography><Typography variant="caption" sx={{ color: colors.text.muted }}>{src.width} × {src.height}px · {(src.size / 1024).toFixed(1)} KB</Typography></Stack>
          )}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: '100%' }}>
            <Box sx={{ flex: 1, minWidth: 0 }}><Field label="Width (px)" value={w} onChange={(e) => setWidth(e.target.value)} inputProps={{ inputMode: 'numeric' }} /></Box>
            <Box sx={{ flex: 1, minWidth: 0 }}><Field label="Height (px)" value={h} onChange={(e) => setHeight(e.target.value)} inputProps={{ inputMode: 'numeric' }} /></Box>
          </Stack>
          <FormControlLabel control={<Checkbox checked={locked} onChange={(e) => setLocked(e.target.checked)} />} label="Lock aspect ratio" /><Field select SelectProps={{ native: true }} label="Output format" value={format} onChange={(e) => setFormat(e.target.value)}><option value="image/jpeg">JPG</option><option value="image/png">PNG</option><option value="image/webp">WebP</option></Field>{format !== 'image/png' && <Box><Typography variant="caption" sx={{ color: colors.text.muted }}>Quality: {quality}%</Typography><Slider value={quality} min={10} max={100} step={1} valueLabelDisplay="auto" onChange={(_, v) => { setQuality(v); setOut(null); }} sx={{ color: colors.accent.primary }} /></Box>}
          <Stack direction={{ xs: 'column', sm: 'row' }} gap={1.5}><Button variant="contained" onClick={process} disabled={!src} sx={{ textTransform: 'none' }}>Compress & Resize</Button><Button variant="outlined" onClick={reset} disabled={!src && !out} sx={{ textTransform: 'none' }}>Reset</Button>{out && <Button startIcon={<Download size={16} />} variant="outlined" onClick={() => download(out.blob, out.filename)} sx={{ textTransform: 'none' }}>Download</Button>}</Stack>
          {out && (
            <><Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: '100%' }}><Box sx={{ flex: 1, minWidth: 0 }}><Typography variant="caption" sx={{ color: colors.text.muted }}>Original</Typography><Box component="img" src={src.url} alt="Original preview" sx={{ width: '100%', maxHeight: 260, objectFit: 'contain', borderRadius: 2, border: `1px solid ${colors.border.light}` }} /><Typography variant="caption">{src.width} × {src.height}px · {(src.size / 1024).toFixed(1)} KB</Typography></Box><Box sx={{ flex: 1, minWidth: 0 }}><Typography variant="caption" sx={{ color: colors.text.muted }}>Optimized</Typography><Box component="img" src={out.url} alt="Optimized preview" sx={{ width: '100%', maxHeight: 260, objectFit: 'contain', borderRadius: 2, border: `1px solid ${colors.border.light}` }} /><Typography variant="caption">{out.width} × {out.height}px · {(out.size / 1024).toFixed(1)} KB · {saved.toFixed(1)}% saved</Typography></Box></Stack><Alert severity="success">Ready: {out.filename}</Alert></>
          )}
        </Stack>
      </Panel>
    </ToolShell>
  );
}

const barcodeTypeInfo = {
  CODE128: { label: 'CODE128 · text & product codes' },
  EAN13: { label: 'EAN-13 · retail products' },
  EAN8: { label: 'EAN-8 · compact retail' },
  UPCA: { label: 'UPC-A · North American retail' },
  CODE39: { label: 'CODE39 · uppercase industrial' },
};

const barcodePattern = (text, seed = 0) => {
  let bits = '101';
  [...text].forEach((char, index) => {
    const n = (char.charCodeAt(0) * 13 + seed + index * 7) % 64;
    bits += n.toString(2).padStart(6, '0').replace(/0/g, '10').replace(/1/g, '110');
  });
  return `${bits}101`;
};

const barcodeChecksum = (digits) => {
  let sum = 0;
  for (let i = digits.length - 1, weight = 3; i >= 0; i -= 1, weight = 4 - weight) sum += Number(digits[i]) * weight;
  return String((10 - (sum % 10)) % 10);
};

function encodeBarcode(type, input) {
  const value = input.trim();
  if (!value) return { error: 'Enter a value to generate the barcode.' };
  if (type === 'CODE128') {
    if ([...value].some((c) => c.charCodeAt(0) > 127)) return { error: 'CODE128 supports ASCII text only.' };
    return { value, bars: barcodePattern(value, 128) };
  }
  if (type === 'CODE39') {
    if (!/^[A-Z0-9. $/+%-]+$/.test(value)) return { error: 'CODE39 accepts uppercase letters, numbers, space and . $ / + % - only.' };
    return { value: `*${value}*`, bars: barcodePattern(value, 39) };
  }
  const lengths = { EAN13: 13, EAN8: 8, UPCA: 12 };
  const len = lengths[type];
  if (!/^\d+$/.test(value)) return { error: `${type === 'UPCA' ? 'UPC-A' : type.replace('EAN', 'EAN-')} accepts digits only.` };
  if (![len - 1, len].includes(value.length)) return { error: `${type === 'UPCA' ? 'UPC-A' : type.replace('EAN', 'EAN-')} requires ${len - 1} digits (or ${len} including checksum).` };
  const body = value.slice(0, len - 1);
  const check = barcodeChecksum(body);
  if (value.length === len && value[len - 1] !== check) return { error: `Invalid ${type === 'UPCA' ? 'UPC-A' : type.replace('EAN', 'EAN-')} check digit. Expected ${check}.` };
  const full = `${body}${check}`;
  return { value: full, bars: barcodePattern(full, len) };
}

function BarcodeTool() {
  const [type, setType] = useState('CODE128');
  const [value, setValue] = useState('ASLI-2026');
  const [height, setHeight] = useState(100);
  const [barWidth, setBarWidth] = useState(2);
  const [showText, setShowText] = useState(true);
  const svgRef = useRef(null);
  const encoded = useMemo(() => encodeBarcode(type, value), [type, value]);
  const quiet = 12;
  const width = encoded.bars ? (encoded.bars.length + quiet * 2) * barWidth : 320;
  const downloadPng = () => {
    if (!svgRef.current) return;
    const svg = new XMLSerializer().serializeToString(svgRef.current);
    const image = new Image();
    image.onload = () => { const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height + (showText ? 26 : 0); const ctx = canvas.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.drawImage(image, 0, 0); canvas.toBlob((blob) => blob && download(blob, `${type.toLowerCase()}-barcode.png`), 'image/png'); };
    image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  };
  return <ToolShell kind="barcode"><Panel><Stack spacing={2}>
    <Field select SelectProps={{ native: true }} label="Barcode type" value={type} onChange={(e) => setType(e.target.value)}>{Object.entries(barcodeTypeInfo).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</Field>
    <Field label={type === 'CODE128' ? 'Product or text' : 'Barcode value'} value={value} onChange={(e) => setValue(e.target.value)} helperText={type === 'CODE128' ? 'Use normal ASCII text or product codes.' : 'Checksum is calculated automatically when omitted.'} />
    {encoded.error && <Alert severity="error">{encoded.error}</Alert>}
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}><Field label="Bar height (px)" type="number" value={height} onChange={(e) => setHeight(Math.min(240, Math.max(40, Number(e.target.value) || 40)))} /><Field label="Bar width (px)" type="number" value={barWidth} onChange={(e) => setBarWidth(Math.min(6, Math.max(1, Number(e.target.value) || 1)))} /></Stack>
    <FormControlLabel control={<Checkbox checked={showText} onChange={(e) => setShowText(e.target.checked)} />} label="Show human-readable text" />
    {encoded.bars && <Box sx={{ overflowX: 'auto', p: 2, textAlign: 'center', border: `1px solid ${colors.border.light}`, borderRadius: 2 }}><svg ref={svgRef} width={width} height={height + (showText ? 26 : 0)} role="img" aria-label={`${type} barcode for ${encoded.value}`}><rect width="100%" height="100%" fill="#fff" /><g transform={`translate(${quiet * barWidth},0)`}>{[...encoded.bars].map((b, i) => b === '1' && <rect key={i} x={i * barWidth} y="0" width={barWidth} height={height} fill="#111827" />)}</g>{showText && <text x="50%" y={height + 19} textAnchor="middle" fontSize="13" fontFamily="Arial, sans-serif" fill="#111827">{encoded.value}</text>}</svg></Box>}
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}><Button startIcon={<Download size={16} />} variant="contained" disabled={!encoded.bars} onClick={() => download(new Blob([new XMLSerializer().serializeToString(svgRef.current)], { type: 'image/svg+xml' }), `${type.toLowerCase()}-barcode.svg`)} sx={{ textTransform: 'none' }}>Download SVG</Button><Button startIcon={<ImageDown size={16} />} variant="outlined" disabled={!encoded.bars} onClick={downloadPng} sx={{ textTransform: 'none' }}>Download PNG</Button></Stack>
  </Stack></Panel></ToolShell>;
}

function UTMTool() {
  const initial = { url: '', source: '', medium: '', campaign: '', term: '', content: '', id: '' };
  const [d, setD] = useState(initial);
  const set = (k) => (e) => setD((prev) => ({ ...prev, [k]: e.target.value }));
  const result = useMemo(() => {
    if (!d.url.trim()) return { value: '', error: 'Enter a landing page URL.' };
    let u;
    try { u = new URL(d.url.trim()); } catch { return { value: '', error: 'Enter a valid URL, including https:// or http://.' }; }
    if (!['http:', 'https:'].includes(u.protocol)) return { value: '', error: 'Use a web URL beginning with http:// or https://.' };
    const required = [['source', 'utm_source'], ['medium', 'utm_medium'], ['campaign', 'utm_campaign']];
    const missing = required.find(([key]) => !d[key].trim());
    if (missing) return { value: '', error: `${missing[1]} is required.` };
    [['utm_source', d.source], ['utm_medium', d.medium], ['utm_campaign', d.campaign], ['utm_term', d.term], ['utm_content', d.content], ['utm_id', d.id]].forEach(([key, val]) => val.trim() ? u.searchParams.set(key, val.trim()) : u.searchParams.delete(key));
    return { value: u.toString(), error: '' };
  }, [d]);
  const applyPreset = (source, medium) => setD((prev) => ({ ...prev, source, medium }));
  return (
    <ToolShell kind="utm">
      <Panel>
        <Stack spacing={2}>
          <Field label="Landing page URL" value={d.url} onChange={set('url')} placeholder="https://example.com/page?ref=home#pricing" error={Boolean(d.url && result.error && result.error.includes('URL'))} />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Field label="Campaign source *" value={d.source} onChange={set('source')} />
            <Field label="Campaign medium *" value={d.medium} onChange={set('medium')} />
          </Stack>
          <Field label="Campaign name *" value={d.campaign} onChange={set('campaign')} />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Field label="Term (optional)" value={d.term} onChange={set('term')} />
            <Field label="Content (optional)" value={d.content} onChange={set('content')} />
          </Stack>
          <Field label="Campaign ID (utm_id, optional)" value={d.id} onChange={set('id')} />
          <Box><Typography variant="caption" sx={{ color: colors.text.muted, display: 'block', mb: 0.75 }}>Quick presets</Typography><Stack direction="row" flexWrap="wrap" gap={1}>{[['Google', 'CPC'], ['Facebook', 'Social'], ['Instagram', 'Social'], ['LinkedIn', 'Social'], ['Email', 'Email'], ['Referral', 'Referral']].map(([source, medium]) => <Button key={`${source}-${medium}`} size="small" variant="outlined" onClick={() => applyPreset(source, medium)} sx={{ textTransform: 'none', borderRadius: 2 }}>{source} · {medium}</Button>)}</Stack></Box>
          <Alert severity="info">Keep names consistent across campaigns. Case is preserved exactly as entered.</Alert>
          {result.error && <Alert severity="error">{result.error}</Alert>}
          {result.value && (
            <TextField
              multiline
              minRows={3}
              label="Generated URL preview"
              value={result.value}
              fullWidth
              InputProps={{ readOnly: true }}
              sx={inputSx}
            />
          )}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <Button startIcon={<Copy size={16} />} variant="contained" disabled={!result.value} onClick={() => navigator.clipboard?.writeText(result.value)} sx={{ textTransform: 'none' }}>Copy URL</Button>
            <Button variant="outlined" disabled={!result.value} onClick={() => window.open(result.value, '_blank', 'noopener,noreferrer')} sx={{ textTransform: 'none' }}>Open URL</Button>
            <Button variant="outlined" onClick={() => setD(initial)} sx={{ textTransform: 'none' }}>Reset</Button>
          </Stack>
        </Stack>
      </Panel>
    </ToolShell>
  );
}

function QRTool() {
  const modes = ['URL', 'Text', 'Email', 'Phone', 'SMS', 'Wi-Fi', 'vCard / Contact'];
  const initial = { url: '', text: '', email: '', subject: '', body: '', phone: '', ssid: '', password: '', security: 'WPA', name: '', company: '', website: '', address: '' };
  const [mode, setMode] = useState('URL');
  const [d, setD] = useState({ ...initial, url: 'https://aslisite.com' });
  const [size, setSize] = useState(320); const [ec, setEc] = useState('M'); const [fg, setFg] = useState('#111827'); const [bg, setBg] = useState('#ffffff');
  const [src, setSrc] = useState(''); const [svg, setSvg] = useState(''); const [error, setError] = useState('');
  const set = (k) => (e) => setD((prev) => ({ ...prev, [k]: e.target.value }));
  const payload = () => {
    if (mode === 'URL') { try { const u = new URL(d.url.trim()); if (!['http:', 'https:'].includes(u.protocol)) throw new Error(); return u.toString(); } catch { throw new Error('Enter a valid http:// or https:// URL.'); } }
    if (mode === 'Text') { if (!d.text.trim()) throw new Error('Enter text to encode.'); return d.text; }
    if (mode === 'Email') { if (!/^\S+@\S+\.\S+$/.test(d.email.trim())) throw new Error('Enter a valid email address.'); return `mailto:${d.email.trim()}${d.subject || d.body ? `?${new URLSearchParams({ ...(d.subject && { subject: d.subject }), ...(d.body && { body: d.body }) })}` : ''}`; }
    if (mode === 'Phone') { if (!/[0-9]/.test(d.phone)) throw new Error('Enter a valid phone number.'); return `tel:${d.phone.trim()}`; }
    if (mode === 'SMS') { if (!/[0-9]/.test(d.phone)) throw new Error('Enter a valid phone number.'); return `SMSTO:${d.phone.trim()}:${d.body}`; }
    if (mode === 'Wi-Fi') { if (!d.ssid.trim()) throw new Error('Enter the Wi-Fi network name (SSID).'); return `WIFI:T:${d.security};S:${d.ssid};P:${d.password};;`; }
    if (!d.name.trim()) throw new Error('Enter a contact name.'); return `BEGIN:VCARD\nVERSION:3.0\nFN:${d.name}\nORG:${d.company}\nTEL:${d.phone}\nEMAIL:${d.email}\nURL:${d.website}\nADR:${d.address}\nEND:VCARD`;
  };
  const make = async () => { try { const text = payload(); const opts = { width: size, margin: 4, errorCorrectionLevel: ec, color: { dark: fg, light: bg } }; setSrc(await QRCode.toDataURL(text, opts)); setSvg(await QRCode.toString(text, { ...opts, type: 'svg' })); setError(''); } catch (e) { setSrc(''); setSvg(''); setError(e.message); } };
  const fields = { URL: [['url', 'URL']], Text: [['text', 'Text']], Email: [['email', 'Email address'], ['subject', 'Subject (optional)'], ['body', 'Message (optional)']], Phone: [['phone', 'Phone number']], SMS: [['phone', 'Phone number'], ['body', 'Message']], 'Wi-Fi': [['ssid', 'Network name (SSID)'], ['password', 'Password']], 'vCard / Contact': [['name', 'Full name'], ['company', 'Company (optional)'], ['phone', 'Phone (optional)'], ['email', 'Email (optional)'], ['website', 'Website (optional)'], ['address', 'Address (optional)']] };
  return (
    <ToolShell kind="qr">
      <Panel>
        <Stack spacing={2}>
          <Field select SelectProps={{ native: true }} label="QR content type" value={mode} onChange={(e) => { setMode(e.target.value); setSrc(''); setError(''); }}>{modes.map((m) => <option key={m}>{m}</option>)}</Field>
          {fields[mode].map(([k, label]) => <Field key={k} label={label} value={d[k]} onChange={set(k)} multiline={k === 'text' || k === 'body' || k === 'address'} minRows={k === 'text' || k === 'body' || k === 'address' ? 2 : undefined} type={k === 'password' ? 'password' : 'text'} />)}
          {mode === 'Wi-Fi' && <Field select SelectProps={{ native: true }} label="Security" value={d.security} onChange={set('security')}><option>WPA</option><option>WEP</option><option value="nopass">None</option></Field>}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}><Field type="number" label="Size (px)" value={size} onChange={(e) => setSize(Math.min(1200, Math.max(120, Number(e.target.value) || 120)))} /><Field select SelectProps={{ native: true }} label="Error correction" value={ec} onChange={(e) => setEc(e.target.value)}><option value="L">L · 7%</option><option value="M">M · 15%</option><option value="Q">Q · 25%</option><option value="H">H · 30%</option></Field></Stack>
          <Stack direction="row" spacing={3}><Box><Typography variant="caption">Foreground</Typography><input type="color" value={fg} onChange={(e) => setFg(e.target.value)} /></Box><Box><Typography variant="caption">Background</Typography><input type="color" value={bg} onChange={(e) => setBg(e.target.value)} /></Box></Stack>
          {error && <Alert severity="error">{error}</Alert>}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}><Button variant="contained" startIcon={<QrCode size={16} />} onClick={make} sx={{ textTransform: 'none' }}>Generate QR</Button><Button variant="outlined" onClick={() => { setD({ ...initial, url: 'https://aslisite.com' }); setSrc(''); setSvg(''); setError(''); }} sx={{ textTransform: 'none' }}>Reset</Button>{src && <Button variant="outlined" startIcon={<Download size={16} />} onClick={() => fetch(src).then((r) => r.blob()).then((b) => download(b, 'qr-code.png'))} sx={{ textTransform: 'none' }}>Download PNG</Button>}{svg && <Button variant="outlined" startIcon={<Download size={16} />} onClick={() => download(new Blob([svg], { type: 'image/svg+xml' }), 'qr-code.svg')} sx={{ textTransform: 'none' }}>Download SVG</Button>}</Stack>
          {src && <Box component="img" src={src} alt={`Generated ${mode} QR code`} sx={{ width: size, maxWidth: '100%', alignSelf: 'center', border: `1px solid ${colors.border.light}`, p: 1, backgroundColor: bg }} />}
        </Stack>
      </Panel>
    </ToolShell>
  );
}

function ROITool() {
  const initial = { investment: '', revenue: '', cost: '', currency: detectRegion() === 'india' ? 'INR' : 'USD', duration: '' };
  const [d, setD] = useState(initial);
  const set = (k) => (e) => setD((prev) => ({ ...prev, [k]: e.target.value }));
  const investment = num(d.investment), revenue = num(d.revenue), cost = num(d.cost);
  const totalInvestment = investment + cost;
  const profit = revenue - totalInvestment;
  const roi = totalInvestment > 0 ? (profit / totalInvestment) * 100 : null;
  const years = num(d.duration);
  const annualized = roi !== null && years > 0 && roi > -100 ? ((1 + roi / 100) ** (1 / years) - 1) * 100 : null;
  const format = (v) => new Intl.NumberFormat(undefined, { style: 'currency', currency: d.currency, maximumFractionDigits: 2 }).format(num(v));
  const invalidNumber = ['investment', 'revenue', 'cost', 'duration'].some((key) => d[key] !== '' && !Number.isFinite(Number(d[key])));
  const error = invalidNumber ? 'Enter valid numbers for all amounts and duration.' : d.investment || d.revenue || d.cost ? (investment <= 0 ? 'Initial investment must be greater than zero.' : cost < 0 || revenue < 0 || years < 0 ? 'Values cannot be negative.' : '') : '';
  return (
    <ToolShell kind="roi">
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Panel>
            <Stack spacing={2}>
              <Field
                label="Initial investment"
                value={d.investment}
                onChange={set('investment')}
                inputProps={{ inputMode: 'decimal' }}
              />
              <Field
                label="Revenue / return"
                value={d.revenue}
                onChange={set('revenue')}
                inputProps={{ inputMode: 'decimal' }}
              />
              <Field
                label="Additional costs"
                value={d.cost}
                onChange={set('cost')}
                inputProps={{ inputMode: 'decimal' }}
              />
              <Field select SelectProps={{ native: true }} label="Currency" value={d.currency} onChange={set('currency')}><option>USD</option><option>EUR</option><option>GBP</option><option>INR</option><option>AED</option><option>CAD</option><option>AUD</option></Field>
              <Field label="Investment duration (years, optional)" value={d.duration} onChange={set('duration')} inputProps={{ inputMode: 'decimal', min: 0 }} />
              <Actions onReset={() => setD(initial)} />
            </Stack>
          </Panel>
        </Grid>
        <Grid item xs={12} md={6}>
          <Panel>
            <Typography variant="overline">Result</Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <Typography variant="h3" sx={{ color: roi === null ? colors.text.muted : roi >= 0 ? '#15803d' : '#dc2626', fontWeight: 800 }}>{roi === null ? '—' : `${roi.toFixed(2)}%`}</Typography>
            <Typography sx={{ color: roi !== null && roi < 0 ? '#dc2626' : 'inherit' }}>{roi !== null && roi < 0 ? 'Negative return' : 'Return on investment'}</Typography>
            <Typography>Total investment: <strong>{format(totalInvestment)}</strong></Typography>
            <Typography>Net profit: <strong>{format(profit)}</strong></Typography>
            <Typography>Break-even return: <strong>{format(totalInvestment)}</strong></Typography>
            {annualized !== null && <Typography>Annualized ROI: <strong>{annualized.toFixed(2)}%</strong></Typography>}
          </Panel>
        </Grid>
      </Grid>
    </ToolShell>
  );
}

function LoanTool() {
  const [d, setD] = useState(() => ({ amount: '', rate: '10', term: '5', unit: 'years', fee: '', currency: detectCurrencyCode() }));
  const [showSchedule, setShowSchedule] = useState(false);
  const set = (k) => (e) => setD((prev) => ({ ...prev, [k]: e.target.value }));
  const p = num(d.amount), annualRate = num(d.rate), n = d.unit === 'years' ? Math.round(num(d.term) * 12) : Math.round(num(d.term)), r = annualRate / 1200, fee = num(d.fee);
  const invalid = ['amount', 'rate', 'term', 'fee'].some((k) => d[k] !== '' && !Number.isFinite(Number(d[k]))) || p <= 0 || annualRate < 0 || n <= 0 || fee < 0;
  const payment = !invalid ? (r ? (p * r * (1 + r) ** n) / ((1 + r) ** n - 1) : p / n) : 0;
  const totalRepayment = payment * n, totalInterest = totalRepayment - p, totalCost = totalRepayment + fee;
  const fmt = (v) => new Intl.NumberFormat(undefined, { style: 'currency', currency: d.currency, maximumFractionDigits: 2 }).format(num(v));
  const schedule = useMemo(() => { if (invalid) return []; let balance = p; return Array.from({ length: n }, (_, i) => { const interest = balance * r; const principal = Math.min(balance, payment - interest); balance = Math.max(0, balance - principal); return { no: i + 1, principal, interest, balance }; }); }, [invalid, p, r, n, payment]);
  return (
    <ToolShell kind="loan">
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Panel>
            <Stack spacing={2}>
              <Field
                label="Loan amount"
                value={d.amount}
                onChange={set('amount')}
                inputProps={{ inputMode: 'decimal' }}
              />
              <Field
                label="Annual interest rate (%)"
                value={d.rate}
                onChange={set('rate')}
                inputProps={{ inputMode: 'decimal' }}
              />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}><Field label="Loan term" value={d.term} onChange={set('term')} inputProps={{ inputMode: 'decimal', min: 1 }} /><Field select SelectProps={{ native: true }} label="Term unit" value={d.unit} onChange={set('unit')}><option value="months">Months</option><option value="years">Years</option></Field></Stack>
              <Field label="Origination / loan fee (optional)" value={d.fee} onChange={set('fee')} inputProps={{ inputMode: 'decimal', min: 0 }} />
              <Field select SelectProps={{ native: true }} label="Currency" value={d.currency} onChange={set('currency')}><option>USD</option><option>EUR</option><option>GBP</option><option>INR</option><option>AED</option><option>CAD</option><option>AUD</option></Field>
              <Actions
                onReset={() => { setD({ amount: '', rate: '10', term: '5', unit: 'years', fee: '', currency: detectCurrencyCode() }); setShowSchedule(false); }}
              />
            </Stack>
          </Panel>
        </Grid>
        <Grid item xs={12} md={6}>
          <Panel>
            <Typography variant="overline">Estimated repayment</Typography>
            {invalid && <Alert severity="error">Enter a positive loan amount and term. Rate and fee must be valid non-negative numbers.</Alert>}
            <Typography variant="h3" sx={{ color: colors.accent.primary, fontWeight: 800 }}>
              {fmt(payment)}
              <Typography component="span" variant="body2">
                {' '}
                / month
              </Typography>
            </Typography>
            <Typography>
              Total repayment: <strong>{fmt(totalRepayment)}</strong>
            </Typography>
            <Typography>
              Total interest: <strong>{fmt(totalInterest)}</strong>
            </Typography>
            <Typography>Origination fee: <strong>{fmt(fee)}</strong></Typography>
            <Typography>Total borrowing cost: <strong>{fmt(totalCost)}</strong></Typography>
            <Button variant="text" onClick={() => setShowSchedule((v) => !v)} disabled={invalid} sx={{ alignSelf: 'flex-start', textTransform: 'none' }}>{showSchedule ? 'Hide' : 'Show'} amortization schedule</Button>
            {showSchedule && <Box sx={{ overflowX: 'auto', maxHeight: 320 }}><Box component="table" sx={{ width: '100%', minWidth: 440, borderCollapse: 'collapse', '& th, & td': { p: 1, borderBottom: `1px solid ${colors.border.light}`, textAlign: 'right', fontSize: 12 }, '& th:first-of-type, & td:first-of-type': { textAlign: 'left' } }}><thead><tr><th>Payment</th><th>Principal</th><th>Interest</th><th>Remaining balance</th></tr></thead><tbody>{schedule.map((row) => <tr key={row.no}><td>{row.no}</td><td>{fmt(row.principal)}</td><td>{fmt(row.interest)}</td><td>{fmt(row.balance)}</td></tr>)}</tbody></Box></Box>}
          </Panel>
        </Grid>
      </Grid>
    </ToolShell>
  );
}

function DiscountTool() {
  const initial = { price: '', discount: '', second: '', tax: '', finalPrice: '', reverse: false, currency: detectCurrencyCode() };
  const [d, setD] = useState(() => initial);
  const set = (k) => (e) => setD((prev) => ({ ...prev, [k]: e.target.value }));
  const p = num(d.price), firstRate = num(d.discount), secondRate = num(d.second), taxRate = num(d.tax), enteredFinal = num(d.finalPrice);
  const preTax = p * (1 - firstRate / 100) * (1 - secondRate / 100), discountAmount = p - preTax, taxAmount = preTax * taxRate / 100, total = preTax + taxAmount;
  const effective = p > 0 && enteredFinal >= 0 ? ((p - enteredFinal) / p) * 100 : null;
  const invalid = ['price', 'discount', 'second', 'tax', 'finalPrice'].some((k) => d[k] !== '' && !Number.isFinite(Number(d[k]))) || p < 0 || firstRate < 0 || firstRate > 100 || secondRate < 0 || secondRate > 100 || taxRate < 0 || enteredFinal < 0 || (d.reverse && enteredFinal > p);
  const fmt = (v) => new Intl.NumberFormat(undefined, { style: 'currency', currency: d.currency, maximumFractionDigits: 2 }).format(num(v));
  return (
    <ToolShell kind="discount">
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Panel>
            <Stack spacing={2}>
              <FormControlLabel control={<Checkbox checked={d.reverse} onChange={(e) => setD((prev) => ({ ...prev, reverse: e.target.checked }))} />} label="Reverse mode: calculate effective discount" />
              <Field label="Original price" value={d.price} onChange={set('price')} inputProps={{ inputMode: 'decimal', min: 0 }} />
              {d.reverse ? <Field label="Final sale price" value={d.finalPrice} onChange={set('finalPrice')} inputProps={{ inputMode: 'decimal', min: 0 }} /> : <><Field label="First discount (%)" value={d.discount} onChange={set('discount')} inputProps={{ inputMode: 'decimal', min: 0, max: 100 }} /><Field label="Second discount (%) · optional" value={d.second} onChange={set('second')} inputProps={{ inputMode: 'decimal', min: 0, max: 100 }} /><Field label="Tax after discount (%) · optional" value={d.tax} onChange={set('tax')} inputProps={{ inputMode: 'decimal', min: 0 }} /></>}
              <Field select SelectProps={{ native: true }} label="Currency" value={d.currency} onChange={set('currency')}><option>USD</option><option>EUR</option><option>GBP</option><option>INR</option><option>AED</option><option>CAD</option><option>AUD</option></Field>
              <Actions onReset={() => setD({ ...initial, currency: detectCurrencyCode() })} />
            </Stack>
          </Panel>
        </Grid>
        <Grid item xs={12} md={6}>
          <Panel>
            <Typography variant="overline">Sale price</Typography>
            {invalid && <Alert severity="error">Enter valid non-negative values. Discounts must be between 0% and 100%, and final price cannot exceed the original.</Alert>}
            <Typography variant="h3" sx={{ color: colors.accent.primary, fontWeight: 800 }}>
              {d.reverse ? fmt(enteredFinal) : fmt(total)}
            </Typography>
            {d.reverse ? <><Typography>Original price: <strong>{fmt(p)}</strong></Typography><Typography>Effective discount: <strong>{effective === null ? '—' : `${effective.toFixed(2)}%`}</strong></Typography><Typography>Total savings: <strong>{fmt(p - enteredFinal)}</strong></Typography></> : <><Typography>Original price: <strong>{fmt(p)}</strong></Typography><Typography>Discount amount: <strong>{fmt(discountAmount)}</strong></Typography><Typography>Discounted price before tax: <strong>{fmt(preTax)}</strong></Typography><Typography>Tax amount: <strong>{fmt(taxAmount)}</strong></Typography><Typography>Final sale price: <strong>{fmt(total)}</strong></Typography><Typography>Total savings: <strong>{fmt(discountAmount)}</strong></Typography></>}
          </Panel>
        </Grid>
      </Grid>
    </ToolShell>
  );
}

function MetaTool() {
  const initial = { title: '', description: '', url: '', image: '', site: '', ogType: 'website', robots: 'index,follow', twitterTitle: '', twitterDescription: '', twitterImage: '' };
  const [d, setD] = useState(initial);
  const set = (k) => (e) => setD((prev) => ({ ...prev, [k]: e.target.value }));
  const escHtml = (v) => String(v || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  const validUrl = (v) => { if (!v.trim()) return true; try { const u = new URL(v.trim()); return ['http:', 'https:'].includes(u.protocol); } catch { return false; } };
  const urlError = (d.url && !validUrl(d.url)) || (d.image && !validUrl(d.image)) || (d.twitterImage && !validUrl(d.twitterImage));
  const title = d.title || 'Page title'; const description = d.description || 'Page description'; const image = d.image || '';
  const twitterTitle = d.twitterTitle || title; const twitterDescription = d.twitterDescription || description; const twitterImage = d.twitterImage || image;
  const code = `<title>${escHtml(title)}</title>\n<meta name="description" content="${escHtml(description)}">\n<link rel="canonical" href="${escHtml(d.url)}">\n<meta name="robots" content="${d.robots}">\n<meta property="og:type" content="${d.ogType}">\n<meta property="og:title" content="${escHtml(title)}">\n<meta property="og:description" content="${escHtml(description)}">\n<meta property="og:url" content="${escHtml(d.url)}">\n<meta property="og:site_name" content="${escHtml(d.site)}">\n<meta property="og:image" content="${escHtml(image)}">\n<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:title" content="${escHtml(twitterTitle)}">\n<meta name="twitter:description" content="${escHtml(twitterDescription)}">\n<meta name="twitter:image" content="${escHtml(twitterImage)}">`;
  return (
    <ToolShell kind="meta">
      <Panel>
        <Stack spacing={2}>
          <Field label="Page title" value={d.title} onChange={set('title')} helperText={`${d.title.length}/60 characters · Aim for 50–60`} />
          <Field
            label="Meta description"
            value={d.description}
            onChange={set('description')}
            multiline
            minRows={3}
            helperText={`${d.description.length}/160 characters · Aim for 140–160`}
          />
          <Field label="Canonical URL" value={d.url} onChange={set('url')} error={Boolean(d.url && !validUrl(d.url))} helperText={d.url && !validUrl(d.url) ? 'Use a valid http:// or https:// URL.' : ''} />
          <Field label="Social image URL" value={d.image} onChange={set('image')} error={Boolean(d.image && !validUrl(d.image))} helperText={d.image && !validUrl(d.image) ? 'Use a valid image URL.' : ''} />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}><Field label="Site name (optional)" value={d.site} onChange={set('site')} /><Field select SelectProps={{ native: true }} label="Open Graph type" value={d.ogType} onChange={set('ogType')}><option value="website">Website</option><option value="article">Article</option><option value="product">Product</option><option value="profile">Profile</option></Field></Stack>
          <Field select SelectProps={{ native: true }} label="Robots" value={d.robots} onChange={set('robots')}><option value="index,follow">Index, follow</option><option value="noindex,follow">No index, follow</option><option value="index,nofollow">Index, no follow</option><option value="noindex,nofollow">No index, no follow</option></Field>
          <Typography variant="subtitle2">Twitter / X (optional overrides)</Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}><Field label="Twitter/X title" value={d.twitterTitle} onChange={set('twitterTitle')} helperText="Defaults to page title" /><Field label="Twitter/X image URL" value={d.twitterImage} onChange={set('twitterImage')} helperText="Defaults to social image" /></Stack>
          <Field label="Twitter/X description" value={d.twitterDescription} onChange={set('twitterDescription')} multiline minRows={2} helperText="Defaults to meta description" />
          {urlError && <Alert severity="error">Fix invalid URL fields before copying tags.</Alert>}
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}><Box sx={{ flex: 1, p: 2, border: `1px solid ${colors.border.light}`, borderRadius: 2 }}><Typography variant="caption" sx={{ color: colors.text.muted }}>Google search preview</Typography><Typography sx={{ color: '#1a0dab', fontSize: 18, mt: 1 }}>{title}</Typography><Typography variant="caption" sx={{ color: '#168039' }}>{d.url || 'https://example.com/page'}</Typography><Typography variant="body2">{description}</Typography></Box><Box sx={{ flex: 1, p: 2, border: `1px solid ${colors.border.light}`, borderRadius: 2 }}><Typography variant="caption" sx={{ color: colors.text.muted }}>Social share preview</Typography><Typography sx={{ fontWeight: 700, mt: 1 }}>{twitterTitle}</Typography><Typography variant="body2">{twitterDescription}</Typography>{twitterImage && <Box component="img" src={twitterImage} alt="Social preview" sx={{ width: '100%', maxHeight: 120, objectFit: 'cover', mt: 1, borderRadius: 1 }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />}</Box></Stack>
          <TextField
            label="Generated tags"
            multiline
            minRows={9}
            value={code}
            fullWidth
            InputProps={{ readOnly: true }}
            sx={{ '& textarea': { fontFamily: 'monospace', fontSize: '0.8rem' }, ...inputSx }}
          />
          <Button
            startIcon={<Copy size={16} />}
            variant="contained"
            disabled={urlError}
            onClick={() => navigator.clipboard?.writeText(code)}
            sx={{ textTransform: 'none' }}
          >
            Copy meta tags
          </Button>
          <Button variant="outlined" onClick={() => setD(initial)} sx={{ textTransform: 'none', alignSelf: 'flex-start' }}>Reset</Button>
        </Stack>
      </Panel>
    </ToolShell>
  );
}

function CardTool() {
  const initial = { name: 'Your Name', role: 'Founder · Your Company', company: '', phone: '+1 000 000 0000', email: 'hello@example.com', website: 'example.com', address: '', social: '', logo: '', color: '#6d28d9', template: 'Modern', size: 'US', qr: false, back: false };
  const [d, setD] = useState(initial); const set = (k) => (e) => setD((p) => ({ ...p, [k]: e.target.value })); const [qr, setQr] = useState('');
  const dimensions = d.size === 'US' ? { w: '3.5in', h: '2in', label: 'US 3.5 × 2 in' } : { w: '85mm', h: '55mm', label: 'International 85 × 55 mm' };
  useMemo(() => { if (d.qr && d.website) QRCode.toDataURL(d.website.startsWith('http') ? d.website : `https://${d.website}`, { width: 180, margin: 1 }).then(setQr); else setQr(''); }, [d.qr, d.website]);
  const downloadPng = () => { const el = document.getElementById('business-card-preview'); if (!el) return; const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1050" height="600"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml" style="width:1050px;height:600px">${el.outerHTML}</div></foreignObject></svg>`; const img = new Image(); img.onload = () => { const c = document.createElement('canvas'); c.width = 2100; c.height = 1200; c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); c.toBlob((b) => b && download(b, 'business-card.png'), 'image/png'); }; img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`; };
  return (
    <ToolShell kind="card"><style>{`@media print { body * { visibility: hidden !important; } #business-card-preview, #business-card-preview * { visibility: visible !important; } #business-card-preview { position: absolute; left: 0; top: 0; width: ${dimensions.w}; height: ${dimensions.h}; } }`}</style>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Panel>
            <Stack spacing={2}>
              <Field select SelectProps={{ native: true }} label="Template" value={d.template} onChange={set('template')}><option>Modern</option><option>Classic</option><option>Minimal</option><option>Bold</option></Field>
              <Field select SelectProps={{ native: true }} label="Card size" value={d.size} onChange={set('size')}><option value="US">US 3.5 × 2 in</option><option value="INTL">International 85 × 55 mm</option></Field>
              {[['name','Name'],['role','Role / title'],['company','Company (optional)'],['phone','Phone (optional)'],['email','Email (optional)'],['website','Website (optional)'],['address','Address (optional)'],['social','Social links (optional)'],['logo','Logo / profile image URL (optional)']].map(([k,l]) => <Field key={k} label={l} value={d[k]} onChange={set(k)} />)}
              <Field label="Accent color" type="color" value={d.color} onChange={set('color')} />
              <FormControlLabel control={<Checkbox checked={d.qr} onChange={(e) => setD((p) => ({ ...p, qr: e.target.checked }))} />} label="Add website QR code" /><FormControlLabel control={<Checkbox checked={d.back} onChange={(e) => setD((p) => ({ ...p, back: e.target.checked }))} />} label="Show back card" />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}><Button onClick={downloadPng} variant="contained" startIcon={<Download size={16} />} sx={{ textTransform: 'none' }}>Download PNG</Button><Button onClick={() => window.print()} variant="outlined" sx={{ textTransform: 'none' }}>Download PDF</Button><Button onClick={() => setD(initial)} variant="outlined" sx={{ textTransform: 'none' }}>Reset</Button></Stack>
            </Stack>
          </Panel>
        </Grid>
        <Grid item xs={12} md={6}>
          <Stack spacing={2}><Box id="business-card-preview" sx={{ width: '100%', maxWidth: 520, aspectRatio: '1.75', p: 3, borderRadius: 2, color: '#fff', background: d.template === 'Minimal' ? '#fff' : d.template === 'Classic' ? `linear-gradient(135deg, #111827, ${d.color})` : `linear-gradient(135deg, ${d.color}, #111827)`, border: d.template === 'Minimal' ? `2px solid ${d.color}` : 'none', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden', boxShadow: '0 16px 40px rgba(0,0,0,.18)' }}><Stack direction="row" spacing={2} alignItems="center">{d.logo && <Box component="img" src={d.logo} alt="Logo" sx={{ width: 54, height: 54, borderRadius: 1, objectFit: 'cover' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />}<Box><Typography variant="h5" sx={{ fontWeight: 800, color: d.template === 'Minimal' ? '#111827' : '#fff' }}>{d.name}</Typography><Typography sx={{ opacity: .8, color: d.template === 'Minimal' ? '#374151' : '#fff' }}>{d.role}{d.company ? ` · ${d.company}` : ''}</Typography></Box></Stack><Box sx={{ mt: 2, color: d.template === 'Minimal' ? '#374151' : '#fff' }}>{d.phone && <Typography variant="body2">{d.phone}</Typography>}{d.email && <Typography variant="body2">{d.email}</Typography>}{d.website && <Typography variant="body2">{d.website}</Typography>}{d.address && <Typography variant="body2">{d.address}</Typography>}{d.social && <Typography variant="body2">{d.social}</Typography>}</Box>{qr && <Box component="img" src={qr} alt="Website QR code" sx={{ position: 'absolute', right: 18, bottom: 18, width: 62, height: 62, p: .5, background: '#fff' }} />}</Box>{d.back && <Box sx={{ width: '100%', maxWidth: 520, aspectRatio: '1.75', p: 3, borderRadius: 2, color: '#fff', background: `linear-gradient(135deg, #111827, ${d.color})`, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}><Typography variant="h5" sx={{ fontWeight: 700 }}>{d.company || d.name}</Typography></Box>}<Typography variant="caption" sx={{ color: colors.text.muted }}>Safe margin: 0.125 in · Add 0.125 in bleed when printing · {dimensions.label}</Typography></Stack>
        </Grid>
      </Grid>
    </ToolShell>
  );
}

export {
  EmailSignature,
  ImageTool,
  BarcodeTool,
  UTMTool,
  QRTool,
  ROITool,
  LoanTool,
  DiscountTool,
  MetaTool,
  CardTool,
};
