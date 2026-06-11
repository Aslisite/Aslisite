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

const shinyGradientStyle = {
  background: colors.accent.brandGradient,
  backgroundSize: '200% auto',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  animation: 'shine 6s linear infinite',
  '@keyframes shine': {
    '0%': { backgroundPosition: '200% center' },
    '100%': { backgroundPosition: '-200% center' },
  },
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
    { label: 'Our Product', href: '/#product' },
    { label: 'Reviews', href: '/#testimonials' },
    { label: 'FAQ', href: '/#faq' },
    { label: 'Contact', href: '/#contact' },
  ],
};

const socialLinks = [
  { icon: LinkedIn, href: 'https://www.linkedin.com/company/aslisite', label: 'LinkedIn' },
  { icon: Facebook, href: 'https://www.facebook.com/aslisite', label: 'Facebook' },
  { icon: Instagram, href: 'https://www.instagram.com/aslisite_', label: 'Instagram' },
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
          viewport={{ once: false, amount: 0.2 }}
        >
          <Grid container spacing={{ xs: 4, md: 6 }}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Typography
                  component={motion.h2}
                  variants={fadeInVariants}
                  variant="h5"
                  sx={{
                    ...shinyGradientStyle,
                    fontFamily: '"Poppins", "Sora", sans-serif',
                    fontWeight: 900,
                    letterSpacing: '0.05em',
                    mb: 2,
                  }}
                >
                  Aslisite
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
                            backgroundColor: 'rgba(168, 85, 247, 0.1)',
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

            <Grid item xs={12} md={8}>
              <Grid
                component={motion.div}
                container
                spacing={{ xs: 3, md: 4 }}
                variants={columnsContainerVariants}
              >
                <Grid item xs={6} sm={4} component={motion.div} variants={columnVariants}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      color: colors.text.primary,
                      mb: 2,
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                      fontSize: '0.75rem',
                      textAlign: { xs: 'center', sm: 'left' },
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
                      alignItems: { xs: 'center', sm: 'flex-start' },
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
                </Grid>

                <Grid item xs={6} sm={4} component={motion.div} variants={columnVariants}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      color: colors.text.primary,
                      mb: 2,
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                      fontSize: '0.75rem',
                      textAlign: { xs: 'center', sm: 'left' },
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
                      alignItems: { xs: 'center', sm: 'flex-start' },
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
                </Grid>

                <Grid item xs={12} sm={4} component={motion.div} variants={columnVariants}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      color: colors.text.primary,
                      mb: 2,
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                      fontSize: '0.75rem',
                      textAlign: { xs: 'center', sm: 'left' },
                    }}
                  >
                    Get In Touch
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                      alignItems: { xs: 'center', sm: 'flex-start' },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Mail sx={{ fontSize: 18, color: colors.accent.primary }} />
                      <Link
                        href="mailto:info@aslisite.com"
                        underline="none"
                        sx={{
                          color: colors.text.muted,
                          fontSize: '0.875rem',
                          '&:hover': {
                            color: colors.accent.primary,
                          },
                        }}
                      >
                        info@aslisite.com
                      </Link>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <WhatsApp sx={{ fontSize: 18, color: colors.accent.primary }} />
                      <Link
                        href="https://wa.me/919495664173?text=Hi%20Aslisite,%20I'm%20interested%20in%20starting%20a%20project!"
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="none"
                        sx={{
                          color: colors.text.muted,
                          fontSize: '0.875rem',
                          '&:hover': {
                            color: colors.accent.primary,
                          },
                        }}
                      >
                        91 9495664173
                      </Link>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                      <LocationOn sx={{ fontSize: 18, color: colors.accent.primary, mt: 0.25 }} />
                      <Typography
                        variant="body2"
                        sx={{
                          color: colors.text.muted,
                          fontSize: '0.875rem',
                          lineHeight: 1.6,
                          textAlign: { xs: 'center', sm: 'left' },
                        }}
                      >
                        Aslisite Technologies
                        <br />
                        Peruvallur
                        <br />
                        Malappuram, Kerala
                        <br />
                        India, 676317
                        <br />
                        <Box
                          component="span"
                          sx={{ fontSize: '0.75rem', color: colors.text.muted }}
                        >
                          GSTIN: 32CYTPP2009K1Z5
                        </Box>
                      </Typography>
                    </Box>
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
              Copyright 2023 Aslisite. All rights reserved. |{' '}
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
