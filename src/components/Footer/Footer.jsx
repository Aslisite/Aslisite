import { Box, Container, Divider, Grid, IconButton, Link, Typography } from '@mui/material';
import FacebookImport from '@mui/icons-material/Facebook';
import InstagramImport from '@mui/icons-material/Instagram';
import LinkedInImport from '@mui/icons-material/LinkedIn';
import LocationOnImport from '@mui/icons-material/LocationOn';
import MailImport from '@mui/icons-material/Mail';
import WhatsAppImport from '@mui/icons-material/WhatsApp';
import { motion } from 'framer-motion';
import { colors } from '../../theme/theme';
import { Link as RouterLink } from 'react-router-dom';

const brandNameStyle = {
  fontFamily: '"Space Grotesk", "Inter", sans-serif',
};

const Facebook = FacebookImport.default || FacebookImport;
const Instagram = InstagramImport.default || InstagramImport;
const LinkedIn = LinkedInImport.default || LinkedInImport;
const LocationOn = LocationOnImport.default || LocationOnImport;
const Mail = MailImport.default || MailImport;
const WhatsApp = WhatsAppImport.default || WhatsAppImport;

const fadeInVariants = {
  hidden: { opacity: 0.35 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.65,
      ease: 'easeOut',
    },
  },
};

const revealUpVariants = {
  hidden: { opacity: 0.35, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: 'easeOut',
    },
  },
};

const columnsContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.18,
    },
  },
};

const columnVariants = {
  hidden: { opacity: 0.35, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: 'easeOut',
    },
  },
};

const copyrightVariants = {
  hidden: { opacity: 0.35 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.65,
      ease: 'easeOut',
      delay: 0.55,
    },
  },
};

const navigation = {
  services: [
    { label: 'Web Development', href: '/services/web-development' },
    { label: 'Ecommerce Solutions', href: '/services/ecommerce-solutions' },
    { label: 'Custom Software', href: '/services/custom-software' },
    { label: 'SEO Services', href: '/services/seo-services' },
  ],
  quickLinks: [
    { label: 'Home', href: '/#hero' },
    { label: 'AsliBooks', href: '/#aslibooks' },
    { label: 'Reviews', href: '/#testimonials' },
    { label: 'FAQ', href: '/#faq' },
    { label: 'Contact', href: '/#contact' },
  ],
  freeTools: [
    { label: 'GST Calculator', href: '/tools/gst-calculator' },
    { label: 'Invoice Generator', href: '/tools/invoice-generator' },
    { label: 'Quotation Generator', href: '/tools/quotation-generator' },
    { label: 'WhatsApp Link & QR', href: '/tools/whatsapp-link-generator' },
    { label: 'Receipt Generator', href: '/tools/receipt-generator' },
    { label: 'Profit Margin Calculator', href: '/tools/profit-margin-calculator' },
    { label: 'UPI QR Generator', href: '/tools/upi-qr-generator' },
    { label: 'Break-Even Calculator', href: '/tools/break-even-calculator' },
    { label: 'Purchase Order Generator', href: '/tools/purchase-order-generator' },
    { label: 'ROAS Calculator', href: '/tools/roas-calculator' },
    { label: 'Email Signature Generator', href: '/tools/email-signature-generator' },
    { label: 'Image Compressor & Resizer', href: '/tools/image-compressor-resizer' },
    { label: 'Barcode Generator', href: '/tools/barcode-generator' },
    { label: 'UTM Campaign URL Builder', href: '/tools/utm-campaign-url-builder' },
    { label: 'General QR Code Generator', href: '/tools/qr-code-generator' },
    { label: 'ROI Calculator', href: '/tools/roi-calculator' },
    { label: 'Business Loan Calculator', href: '/tools/business-loan-calculator' },
    { label: 'Discount & Sale Price Calculator', href: '/tools/discount-sale-price-calculator' },
    { label: 'Meta Tag Generator', href: '/tools/meta-tag-generator' },
    { label: 'Business Card Maker', href: '/tools/business-card-maker' },
  ],
};

const socialLinks = [
  { icon: LinkedIn, href: 'https://www.linkedin.com/company/aslisite', label: 'LinkedIn' },
  { icon: Facebook, href: 'https://www.facebook.com/aslisite', label: 'Facebook' },
  { icon: Instagram, href: 'https://www.instagram.com/aslisite_', label: 'Instagram' },
];

const contactLinks = [
  {
    icon: WhatsApp,
    label: '+91 94956 64173',
    href: 'https://wa.me/919495664173?text=Hi%20Aslisite,%20I%27d%20like%20to%20start%20a%20project.',
  },
  { icon: Mail, label: 'info@aslisite.com', href: 'mailto:info@aslisite.com' },
  { icon: LocationOn, label: 'Kerala, India', href: '/#contact' },
];

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: colors.background.primary,
        borderTop: `1px solid ${colors.border.light}`,
        pt: { xs: 6, md: 10 },
        pb: { xs: 4, md: 6 },
      }}
    >
      <Container maxWidth="lg">
        <Box
          component={motion.div}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <Grid container spacing={{ xs: 4, md: 4 }}>
            {/* Brand column */}
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Typography
                  component={motion.h2}
                  variants={fadeInVariants}
                  variant="h5"
                  sx={{
                    ...brandNameStyle,
                    fontWeight: 800,
                    color: colors.text.primary,
                    mb: 2,
                  }}
                >
                  Aslisite<span style={{ color: colors.accent.primary }}>.</span>
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: colors.text.secondary,
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    mb: 2,
                  }}
                >
                  Aslisite Technologies
                </Typography>
                <Typography
                  component={motion.p}
                  variants={revealUpVariants}
                  variant="body2"
                  sx={{
                    color: colors.text.secondary,
                    lineHeight: 1.8,
                    maxWidth: '300px',
                    mb: 3,
                    mx: { xs: 'auto', md: 0 },
                  }}
                >
                  Premium digital agency crafting exceptional web experiences that drive business
                  growth and transform ideas into reality.
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    gap: 1,
                    justifyContent: { xs: 'center', md: 'flex-start' },
                  }}
                >
                  {socialLinks.map((social, index) => {
                    const IconComponent = social.icon;
                    return (
                      <IconButton
                        key={index}
                        href={social.href}
                        aria-label={social.label}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="small"
                        sx={{
                          color: colors.text.muted,
                          border: `1px solid ${colors.border.light}`,
                          borderRadius: 2,
                          '&:hover': {
                            color: colors.accent.primary,
                            borderColor: colors.accent.primary,
                            backgroundColor: 'rgba(124, 58, 237, 0.08)',
                          },
                        }}
                      >
                        <IconComponent fontSize="small" />
                      </IconButton>
                    );
                  })}
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={9}>
              <Grid
                component={motion.div}
                container
                spacing={{ xs: 3, md: 3 }}
                alignItems="flex-start"
                variants={columnsContainerVariants}
              >
                <Grid item xs={6} sm={6} md={3} component={motion.div} variants={columnVariants}>
                  <Box sx={{ pl: { xs: '16px', sm: 0 } }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 600,
                        color: colors.text.primary,
                        mb: 2,
                        textTransform: 'uppercase',
                        letterSpacing: 1,
                        fontSize: '0.75rem',
                        textAlign: 'left',
                      }}
                    >
                      Services
                    </Typography>
                    <Box
                      component="nav"
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1.5,
                        alignItems: 'flex-start',
                      }}
                    >
                      {navigation.services.map((item, index) => (
                        <Link
                          key={index}
                          component={RouterLink}
                          to={item.href}
                          underline="none"
                          sx={{
                            color: colors.text.muted,
                            fontSize: '0.875rem',
                            transition: 'color 0.2s ease',
                            '&:hover': {
                              color: colors.accent.primary,
                            },
                          }}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={6} sm={6} md={3} component={motion.div} variants={columnVariants}>
                  <Box sx={{ pl: { xs: '16px', sm: 0 } }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 600,
                        color: colors.text.primary,
                        mb: 2,
                        textTransform: 'uppercase',
                        letterSpacing: 1,
                        fontSize: '0.75rem',
                        textAlign: 'left',
                      }}
                    >
                      Quick Links
                    </Typography>
                    <Box
                      component="nav"
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1.5,
                        alignItems: 'flex-start',
                      }}
                    >
                      {navigation.quickLinks.map((item, index) => (
                        <Link
                          key={index}
                          component={RouterLink}
                          to={item.href}
                          underline="none"
                          sx={{
                            color: colors.text.muted,
                            fontSize: '0.875rem',
                            transition: 'color 0.2s ease',
                            '&:hover': {
                              color: colors.accent.primary,
                            },
                          }}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </Box>
                  </Box>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={3}
                  component={motion.div}
                  variants={columnVariants}
                >
                  <Box sx={{ pl: { xs: '16px', sm: 0 } }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 600,
                        color: colors.text.primary,
                        mb: 2,
                        textTransform: 'uppercase',
                        letterSpacing: 1,
                        fontSize: '0.75rem',
                        textAlign: 'left',
                      }}
                    >
                      Free Tools
                    </Typography>
                    <Box
                      component="nav"
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                        columnGap: { xs: 2, sm: 3 },
                        rowGap: { xs: 1.25, sm: 1.5 },
                        alignItems: 'flex-start',
                      }}
                    >
                      {navigation.freeTools.slice(0, 6).map((item, index) => (
                        <Link
                          key={index}
                          component={RouterLink}
                          to={item.href}
                          underline="none"
                          sx={{
                            color: colors.text.muted,
                            fontSize: { xs: '0.78rem', sm: '0.875rem' },
                            transition: 'color 0.2s ease',
                            '&:hover': {
                              color: colors.accent.primary,
                            },
                          }}
                        >
                          {item.label}
                        </Link>
                      ))}
                      <Link
                        component={RouterLink}
                        to="/tools"
                        underline="none"
                        sx={{
                          gridColumn: '1 / -1',
                          color: colors.accent.primary,
                          fontSize: { xs: '0.78rem', sm: '0.875rem' },
                          fontWeight: 700,
                          transition: 'color 0.2s ease',
                          '&:hover': { color: colors.accent.primaryHover },
                        }}
                      >
                        View All Tools →
                      </Link>
                    </Box>
                  </Box>
                </Grid>

                <Grid
                  item
                  md={3}
                  component={motion.div}
                  variants={columnVariants}
                  sx={{ display: { xs: 'none', md: 'block' } }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      color: colors.text.primary,
                      mb: 2,
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                      fontSize: '0.75rem',
                      textAlign: 'left',
                    }}
                  >
                    Start a Project
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.6 }}>
                    {contactLinks.map((item) => {
                      const IconComponent = item.icon;

                      return (
                        <Link
                          key={item.label}
                          component={item.href.startsWith('/') ? RouterLink : 'a'}
                          to={item.href.startsWith('/') ? item.href : undefined}
                          href={item.href.startsWith('/') ? undefined : item.href}
                          target={item.href.startsWith('http') ? '_blank' : undefined}
                          rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                          underline="none"
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.2,
                            color: colors.text.muted,
                            fontSize: '0.875rem',
                            lineHeight: 1.5,
                            transition: 'color 0.2s ease, transform 0.2s ease',
                            '&:hover': {
                              color: colors.accent.primary,
                              transform: 'translateX(2px)',
                            },
                          }}
                        >
                          <IconComponent sx={{ fontSize: 18, flexShrink: 0 }} />
                          {item.label}
                        </Link>
                      );
                    })}
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Divider
            sx={{
              my: { xs: 4, md: 6 },
              borderColor: colors.border.light,
            }}
          />

          <Box
            component={motion.div}
            variants={copyrightVariants}
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
              textAlign: 'center',
            }}
          >
            <Typography variant="caption" sx={{ color: colors.text.muted }}>
              Copyright 2026 Aslisite Technologies. All rights reserved. |{' '}
              <Link
                component={RouterLink}
                to="/privacy-policy"
                sx={{
                  color: 'inherit',
                  textDecoration: 'none',
                  '&:hover': { color: colors.accent.primary },
                }}
              >
                Privacy Policy
              </Link>
            </Typography>
            <Typography variant="caption" sx={{ color: colors.text.muted }}>
              Web development, ecommerce, UI/UX, and SEO services in Kerala
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
