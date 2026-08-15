import { useState } from 'react';
import emailjs from '@emailjs/browser';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Snackbar,
  TextField,
  Typography,
  Stack,
  IconButton,
} from '@mui/material';
import { motion } from 'framer-motion';
import SendImport from '@mui/icons-material/Send';
import WhatsAppImport from '@mui/icons-material/WhatsApp';
import EmailImport from '@mui/icons-material/Email';
import PhoneImport from '@mui/icons-material/Phone';
import { colors } from '../../theme/theme';
import { SectionBadge } from '../common';

const Send = SendImport.default || SendImport;
const WhatsApp = WhatsAppImport.default || WhatsAppImport;
const Email = EmailImport.default || EmailImport;
const Phone = PhoneImport.default || PhoneImport;

const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay },
  }),
};

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID';
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID';
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY';

const quickActions = [
  {
    icon: WhatsApp,
    label: 'WhatsApp',
    href: 'https://wa.me/919495664173?text=Hi%20Aslisite,%20I%20have%20a%20project%20to%20discuss!',
    color: '#25D366',
    bg: 'rgba(37, 211, 102, 0.08)',
    border: 'rgba(37, 211, 102, 0.2)',
  },
  {
    icon: Email,
    label: 'Email',
    href: 'mailto:info@aslisite.com',
    color: colors.accent.primary,
    bg: 'rgba(124, 58, 237, 0.06)',
    border: 'rgba(124, 58, 237, 0.15)',
  },
  {
    icon: Phone,
    label: 'Call',
    href: 'tel:+919495664173',
    color: '#0891b2',
    bg: 'rgba(8, 145, 178, 0.06)',
    border: 'rgba(8, 145, 178, 0.15)',
  },
];

const inputStyles = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#ffffff',
    borderRadius: 2,
    '& fieldset': { borderColor: colors.border.light },
    '&:hover fieldset': { borderColor: colors.accent.primary },
    '&.Mui-focused fieldset': { borderColor: colors.accent.primary, borderWidth: '1.5px' },
  },
  '& .MuiInputLabel-root': {
    color: colors.text.muted,
    fontSize: '0.9rem',
    '&.Mui-focused': { color: colors.accent.primary },
  },
  '& .MuiOutlinedInput-input': {
    color: colors.text.primary,
    fontSize: '0.95rem',
  },
};

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, e.target, PUBLIC_KEY);
      setSnackbar({
        open: true,
        message: "Message sent! We'll get back to you within 24 hours.",
        severity: 'success',
      });
      setFormData({ name: '', email: '', company: '', message: '' });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to send. Please try again or reach out via WhatsApp.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box
      id="contact"
      component="section"
      tabIndex="-1"
      sx={{
        py: { xs: 8, md: 12 },
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: colors.background.primary,
        scrollMarginTop: '80px',
      }}
    >
      {/* Background gradient accents */}
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          top: '10%',
          right: '-5%',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.04) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          bottom: '5%',
          left: '-8%',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(8, 145, 178, 0.03) 0%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          component={motion.div}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {/* Header */}
          <Box
            component={motion.div}
            custom={0}
            variants={fadeUpVariants}
            sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}
          >
            <SectionBadge
              sx={{
                backgroundColor: 'transparent',
                border: `1.5px solid ${colors.accent.primary}`,
                color: colors.accent.primary,
              }}
            >
              Get In Touch
            </SectionBadge>
            <Typography
              variant="h2"
              sx={{
                color: colors.text.primary,
                fontWeight: 800,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                lineHeight: 1.1,
                mt: 2,
                mb: 2.5,
                letterSpacing: '-0.02em',
              }}
            >
              Let&apos;s start your{' '}
              <Box
                component="span"
                sx={{
                  background: colors.accent.gradient,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                next project
              </Box>
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: colors.text.secondary,
                maxWidth: '520px',
                mx: 'auto',
                lineHeight: 1.7,
                fontSize: { xs: '1rem', md: '1.05rem' },
              }}
            >
              Have an idea or need a quote? Reach out through the form below or pick your preferred channel.
            </Typography>
          </Box>

          {/* Quick contact actions */}
          <Stack
            component={motion.div}
            custom={0.1}
            variants={fadeUpVariants}
            direction="row"
            spacing={2}
            justifyContent="center"
            sx={{ mb: { xs: 5, md: 7 } }}
          >
            {quickActions.map((action) => (
              <Box
                key={action.label}
                component="a"
                href={action.href}
                target={action.label === 'WhatsApp' ? '_blank' : undefined}
                rel={action.label === 'WhatsApp' ? 'noopener noreferrer' : undefined}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: { xs: 2, sm: 2.5 },
                  py: 1.2,
                  borderRadius: 2.5,
                  backgroundColor: action.bg,
                  border: `1px solid ${action.border}`,
                  textDecoration: 'none',
                  transition: 'all 0.25s ease',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: `0 8px 24px ${action.border}`,
                    borderColor: action.color,
                  },
                }}
              >
                <action.icon sx={{ fontSize: 20, color: action.color }} />
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    color: action.color,
                    display: { xs: 'none', sm: 'block' },
                  }}
                >
                  {action.label}
                </Typography>
              </Box>
            ))}
          </Stack>

          {/* Form section */}
          <Box
            component={motion.div}
            custom={0.2}
            variants={fadeUpVariants}
            sx={{
              maxWidth: 720,
              mx: 'auto',
              p: { xs: 3, sm: 4, md: 5 },
              borderRadius: 4,
              backgroundColor: '#f8fafc',
              border: `1px solid ${colors.border.light}`,
              boxShadow: '0 4px 24px rgba(0, 0, 0, 0.03)',
            }}
          >
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    autoComplete="name"
                    variant="outlined"
                    size="medium"
                    sx={inputStyles}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    size="medium"
                    sx={inputStyles}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Company (optional)"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    variant="outlined"
                    size="medium"
                    sx={inputStyles}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Tell us about your project"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    multiline
                    rows={4}
                    variant="outlined"
                    placeholder="What are you building? What's the timeline? Any specific tech requirements?"
                    sx={{
                      ...inputStyles,
                      '& .MuiOutlinedInput-input::placeholder': {
                        color: colors.text.muted,
                        opacity: 0.6,
                        fontSize: '0.88rem',
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }} justifyContent="space-between">
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={loading}
                      endIcon={loading ? <CircularProgress size={18} color="inherit" /> : <Send />}
                      sx={{
                        backgroundColor: colors.accent.primary,
                        color: '#ffffff',
                        fontWeight: 700,
                        px: 4,
                        py: 1.5,
                        fontSize: '0.95rem',
                        textTransform: 'none',
                        borderRadius: 2,
                        boxShadow: '0 4px 16px rgba(124, 58, 237, 0.2)',
                        transition: 'all 0.25s ease',
                        '&:hover': {
                          backgroundColor: colors.accent.primaryHover,
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 24px rgba(124, 58, 237, 0.3)',
                        },
                        '&:disabled': {
                          backgroundColor: '#e4e4e7',
                          color: colors.text.muted,
                          boxShadow: 'none',
                        },
                      }}
                    >
                      {loading ? 'Sending...' : 'Send Message'}
                    </Button>
                    <Typography
                      variant="caption"
                      sx={{
                        color: colors.text.muted,
                        fontSize: '0.78rem',
                        lineHeight: 1.5,
                      }}
                    >
                      We typically respond within 24 hours.
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </Box>

          {/* Bottom info strip */}
          <Stack
            component={motion.div}
            custom={0.3}
            variants={fadeUpVariants}
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 2, sm: 4 }}
            justifyContent="center"
            alignItems="center"
            sx={{ mt: { xs: 5, md: 6 }, color: colors.text.muted }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Email sx={{ fontSize: 16 }} />
              <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                info@aslisite.com
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Phone sx={{ fontSize: 16 }} />
              <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                +91 9495664173
              </Typography>
            </Stack>
            <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
              Peruvallur, Malappuram, Kerala
            </Typography>
          </Stack>
        </Box>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%', fontWeight: 600 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Contact;
