import { Box, Container, Typography, Link, Grid, IconButton, Divider, useTheme, useMediaQuery } from '@mui/material';
import { Twitter, LinkedIn, Facebook, Instagram, Mail, WhatsApp, LocationOn } from '@mui/icons-material';
import { colors } from '../../theme/theme';

const navigation = {
  services: [
    { label: 'Web Development', href: '#services' },
    { label: 'Ecommerce Solutions', href: '#services' },
    { label: 'Custom Software', href: '#services' },
    { label: 'SEO Services', href: '#services' },
  ],
  company: [
    { label: 'Our Team', href: '#team' },
    { label: 'Careers', href: '#careers' },
    { label: 'Contact', href: '#contact' },
  ],
  resources: [
    { label: 'Blog', href: '#blog' },
    { label: 'Case Studies', href: '#cases' },
    { label: 'Documentation', href: '#docs' },
    { label: 'Support', href: '#support' },
  ],
};

const socialLinks = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: LinkedIn, href: 'https://www.linkedin.com/company/aslisite', label: 'LinkedIn' },
  { icon: Facebook, href: 'https://www.facebook.com/aslisite', label: 'Facebook' },
  { icon: Instagram, href: 'https://www.instagram.com/aslisite_', label: 'Instagram' },
];

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: colors.background.secondary,
        borderTop: `1px solid ${colors.border.light}`,
        pt: { xs: 6, md: 10 },
        pb: { xs: 4, md: 6 },
      }}
    >
      <Container maxWidth="lg">
        {/* Main Footer Content */}
        <Grid container spacing={{ xs: 4, md: 6 }}>
          {/* Brand Column */}
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  background: colors.accent.gradient,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 2,
                }}
              >
                Aslisite
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: colors.text.secondary,
                  lineHeight: 1.8,
                  maxWidth: '300px',
                  mb: 3,
                  mx: { xs: 'auto', md: 0 },
                }}
              >
                Premium digital agency crafting exceptional web experiences that drive business growth and transform ideas into reality.
              </Typography>

              {/* Social Links */}
              <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <IconButton
                      key={index}
                      href={social.href}
                      aria-label={social.label}
                      size="small"
                      sx={{
                        color: colors.text.muted,
                        border: `1px solid ${colors.border.light}`,
                        borderRadius: 2,
                        '&:hover': {
                          color: colors.accent.primary,
                          borderColor: colors.accent.primary,
                          backgroundColor: 'rgba(0, 212, 255, 0.1)',
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

          {/* Navigation Columns */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={{ xs: 3, md: 4 }}>
              {/* Services */}
              <Grid item xs={6} sm={4}>
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
                      href={item.href}
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

              {/* Company */}
              <Grid item xs={6} sm={4}>
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
                  Company
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
                  {navigation.company.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
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

              {/* Contact */}
              <Grid item xs={12} sm={4}>
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
                  Contact
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
                      sx={{ color: colors.text.muted, fontSize: '0.875rem', lineHeight: 1.6 }}
                    >
                      Aslisite Technologies<br />
                      Peruvallur<br />
                      Malappuram, Kerala<br />
                      India, 676317<br />
                      <Box component="span" sx={{ fontSize: '0.75rem', color: colors.text.muted }}>GSTIN: 32CYTPP2009K1Z5</Box>
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Divider */}
        <Divider
          sx={{
            my: { xs: 4, md: 6 },
            borderColor: colors.border.light,
          }}
        />

        {/* Bottom Bar */}
        <Box
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
            © {currentYear} Aslisite. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link
              href="#privacy"
              underline="none"
              sx={{
                color: colors.text.muted,
                fontSize: '0.75rem',
                '&:hover': {
                  color: colors.accent.primary,
                },
              }}
            >
              Privacy Policy
            </Link>
            <Link
              href="#terms"
              underline="none"
              sx={{
                color: colors.text.muted,
                fontSize: '0.75rem',
                '&:hover': {
                  color: colors.accent.primary,
                },
              }}
            >
              Terms of Service
            </Link>
            <Link
              href="#cookies"
              underline="none"
              sx={{
                color: colors.text.muted,
                fontSize: '0.75rem',
                '&:hover': {
                  color: colors.accent.primary,
                },
              }}
            >
              Cookie Policy
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
