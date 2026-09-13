import { Box, Container, Grid, Typography, Card, CardContent, Chip, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  Calculator,
  FileText,
  ClipboardList,
  MessageCircle,
  Receipt,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { colors } from '../../theme/theme';
import { absoluteUrl, siteMetadata } from '../../seo/siteMetadata';
import { SectionBadge } from '../../components/common';

const tools = [
  {
    icon: Calculator,
    label: 'GST Calculator',
    href: '/tools/gst-calculator',
    description:
      'Calculate GST-inclusive and GST-exclusive prices instantly. Supports all GST 2.0 slabs — 0%, 5%, 18%, and 40%.',
    badge: 'GST 2.0 Updated',
    badgeColor: colors.accent.primary,
    featured: true,
  },
  {
    icon: FileText,
    label: 'Invoice Generator',
    href: '/tools/invoice-generator',
    description:
      'Create professional GST invoices with your business details, line items, and tax breakdown. Download or print instantly.',
    badge: 'Free',
    badgeColor: colors.accent.secondary,
  },
  {
    icon: ClipboardList,
    label: 'Quotation Generator',
    href: '/tools/quotation-generator',
    description:
      'Generate clean, professional quotations for clients. Add validity dates, item descriptions, and GST amounts.',
    badge: 'Free',
    badgeColor: colors.accent.secondary,
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp Link & QR Generator',
    href: '/tools/whatsapp-link-generator',
    description:
      'Create a direct WhatsApp chat link with a pre-filled message and a scannable QR code for your business.',
    badge: 'Free',
    badgeColor: colors.accent.secondary,
  },
  {
    icon: Receipt,
    label: 'Receipt Generator',
    href: '/tools/receipt-generator',
    description:
      'Generate simple payment receipts with item details, amount paid, and payment method. Print or save as PDF.',
    badge: 'Free',
    badgeColor: colors.accent.secondary,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut', delay: i * 0.08 },
  }),
};

const ToolCard = ({ tool, index }) => {
  const Icon = tool.icon;
  return (
    <Grid item xs={12} sm={6} md={tool.featured ? 12 : 6} lg={tool.featured ? 6 : 3}>
      <Box
        component={motion.div}
        custom={index}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        sx={{ height: '100%' }}
      >
        <Card
          component={RouterLink}
          to={tool.href}
          sx={{
            height: '100%',
            textDecoration: 'none',
            display: 'flex',
            flexDirection: 'column',
            border: tool.featured
              ? `1.5px solid ${colors.border.accent}`
              : `1px solid ${colors.border.light}`,
            borderRadius: 3,
            transition: 'all 0.25s ease',
            '&:hover': {
              borderColor: colors.accent.primary,
              boxShadow: '0 12px 36px rgba(109,40,217,0.10)',
              transform: 'translateY(-4px)',
              '& .tool-arrow': { transform: 'translateX(4px)', opacity: 1 },
            },
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: tool.featured ? 4 : 3 }, flexGrow: 1 }}>
            <Stack direction="row" alignItems="flex-start" justifyContent="space-between" mb={2}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(109,40,217,0.07)',
                  color: colors.accent.primary,
                  flexShrink: 0,
                }}
              >
                <Icon size={22} strokeWidth={1.8} />
              </Box>
              {tool.badge && (
                <Chip
                  label={tool.badge}
                  size="small"
                  sx={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    letterSpacing: '0.03em',
                    backgroundColor: `${tool.badgeColor}14`,
                    color: tool.badgeColor,
                    border: `1px solid ${tool.badgeColor}30`,
                    borderRadius: 1,
                    height: 22,
                  }}
                />
              )}
            </Stack>

            <Stack direction="row" alignItems="center" gap={1} mb={1}>
              <Typography
                variant="h6"
                sx={{
                  color: colors.text.primary,
                  fontWeight: 700,
                  fontSize: tool.featured ? '1.15rem' : '1rem',
                  lineHeight: 1.3,
                }}
              >
                {tool.label}
              </Typography>
              <ArrowRight
                className="tool-arrow"
                size={16}
                style={{
                  color: colors.accent.primary,
                  opacity: 0,
                  transition: 'transform 0.2s ease, opacity 0.2s ease',
                  flexShrink: 0,
                }}
              />
            </Stack>

            <Typography
              variant="body2"
              sx={{
                color: colors.text.secondary,
                lineHeight: 1.7,
                fontSize: '0.875rem',
              }}
            >
              {tool.description}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Grid>
  );
};

const ToolsHub = () => {
  const pageTitle = 'Free Business Tools | GST Calculator, Invoice Generator & More | Aslisite';
  const pageDesc =
    'Free online business tools for Indian SMBs — GST Calculator (GST 2.0 updated), Invoice Generator, Quotation Generator, WhatsApp Link Generator, and Receipt Generator. No login required.';

  return (
    <Container maxWidth="lg" className="tool-page-container" sx={{ pt: { xs: 16, md: 16 }, pb: { xs: 8, md: 12 } }}>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={absoluteUrl('/tools')} />
        <meta property="og:url" content={absoluteUrl('/tools')} />
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
            '@type': 'WebPage',
            '@id': `${absoluteUrl('/tools')}#webpage`,
            url: absoluteUrl('/tools'),
            name: pageTitle,
            description: pageDesc,
            isPartOf: { '@id': `${siteMetadata.baseUrl}/#website` },
            publisher: { '@id': `${siteMetadata.baseUrl}/#organization` },
          })}
        </script>
      </Helmet>

      {/* Header */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}
      >
        <SectionBadge icon={Sparkles} label="100% Free · No Login · No Ads" />
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '2rem', sm: '2.6rem', md: '3rem' },
            fontWeight: 800,
            color: colors.text.primary,
            mt: 2,
            mb: 2,
            letterSpacing: '-0.03em',
          }}
        >
          Free Business Tools
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            color: colors.text.secondary,
            maxWidth: 560,
            mx: 'auto',
            fontSize: { xs: '1rem', md: '1.1rem' },
            lineHeight: 1.7,
          }}
        >
          Practical tools built for Indian SMBs. Calculate GST, generate invoices, create
          quotations, and more — all free, right in your browser.
        </Typography>
      </Box>

      {/* Tools Grid */}
      <Grid container spacing={3}>
        {tools.map((tool, i) => (
          <ToolCard key={tool.href} tool={tool} index={i} />
        ))}
      </Grid>

      {/* Bottom note */}
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        sx={{
          mt: { xs: 8, md: 10 },
          p: { xs: 3, md: 4 },
          borderRadius: 3,
          background: 'linear-gradient(135deg, rgba(109,40,217,0.04) 0%, rgba(13,148,136,0.04) 100%)',
          border: `1px solid ${colors.border.light}`,
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" sx={{ color: colors.text.secondary, lineHeight: 1.8 }}>
          All tools are 100% browser-based and free to use. No account, login, or payment required.
          Your data never leaves your device.
          <br />
          Built by{' '}
          <Box
            component={RouterLink}
            to="/"
            sx={{ color: colors.accent.primary, fontWeight: 600, textDecoration: 'none' }}
          >
            Aslisite
          </Box>
          {' '}— Kerala's trusted web and digital agency.
        </Typography>
      </Box>
    </Container>
  );
};

export default ToolsHub;
