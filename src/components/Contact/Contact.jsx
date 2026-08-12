import { useState } from 'react';
import emailjs from '@emailjs/browser';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import { motion } from 'framer-motion';
import BusinessImport from '@mui/icons-material/Business';
import EmailImport from '@mui/icons-material/Email';
import LocationOnImport from '@mui/icons-material/LocationOn';
import PhoneImport from '@mui/icons-material/Phone';
import SendImport from '@mui/icons-material/Send';
import { colors } from '../../theme/theme';

const Business = BusinessImport.default || BusinessImport;
const Email = EmailImport.default || EmailImport;
const LocationOn = LocationOnImport.default || LocationOnImport;
const Phone = PhoneImport.default || PhoneImport;
const Send = SendImport.default || SendImport;

const fadeUpVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

const descriptionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

const leftPanelVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
      delay: 0.1,
    },
  },
};

const rightPanelVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
      delay: 0.15,
    },
  },
};

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID';
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID';
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY';

const contactInfo = [
  {
    icon: Email,
    label: 'Email Us',
    value: 'info@aslisite.com',
    href: 'mailto:info@aslisite.com',
  },
  {
    icon: Phone,
    label: 'Call Us',
    value: '91 9495664173',
    href: 'tel:+919495664173',
  },
  {
    icon: LocationOn,
    label: 'Visit Us',
    value: 'Aslisite Technologies, Peruvallur, Malappuram, Kerala, India 676317',
    href: null,
  },
  {
    icon: Business,
    label: 'Business Hours',
    value: 'Mon - Fri: 9:00 AM - 6:00 PM IST',
    href: null,
  },
];

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
        message: "Thank you for your message! We'll get back to you within 24 hours.",
        severity: 'success',
      });
      setFormData({ name: '', email: '', company: '', message: '' });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to send message. Please try again or email us directly.',
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
        py: { xs: 6, md: 8 },
        backgroundColor: colors.background.elevated,
        position: 'relative',
        scrollMarginTop: '80px',
      }}
    >
      <Container maxWidth="lg">
        <Box
          component={motion.div}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 10 } }}>
            <Typography
              component={motion.div}
              variants={fadeUpVariants}
              variant="overline"
              sx={{
                color: colors.accent.primary,
                fontWeight: 700,
                fontSize: '0.75rem',
                letterSpacing: '0.08em',
                mb: 2,
                display: 'block',
              }}
            >
              Get In Touch
            </Typography>
            <Typography
              component={motion.h2}
              variants={fadeUpVariants}
              sx={{
                color: colors.text.primary,
                fontWeight: 800,
                fontSize: { xs: '2.1rem', sm: '2.55rem', md: '3.15rem' },
                lineHeight: 1.08,
                textAlign: 'center',
                maxWidth: '720px',
                mx: 'auto',
                mb: 3,
                letterSpacing: '-0.03em',
                fontFamily: '"Space Grotesk", "Inter", sans-serif',
              }}
            >
              Let&apos;s build something{' '}
              <Box
                component="span"
                sx={{
                  background: colors.accent.gradient,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                amazing together.
              </Box>
            </Typography>
            <Typography
              component={motion.p}
              variants={descriptionVariants}
              variant="body1"
              sx={{
                color: colors.text.secondary,
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.82,
                fontSize: { xs: '0.98rem', md: '1.06rem' },
                fontWeight: 450,
              }}
            >
              Ready to transform your digital presence? We&apos;d love to hear about your project.
              Reach out and let&apos;s start the conversation.
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 4, md: 6 }}>
            <Grid item xs={12} md={5} component={motion.div} variants={leftPanelVariants}>
              <Box sx={{ height: '100%' }}>
                <Typography
                  variant="h4"
                  sx={{
                    color: colors.text.primary,
                    fontWeight: 700,
                    mb: 4,
                    fontSize: { xs: '1.15rem', md: '1.35rem' },
                    letterSpacing: '0.01em',
                  }}
                >
                  Contact Information
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {contactInfo.map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <Box
                        key={index}
                        component={item.href ? 'a' : 'div'}
                        href={item.href || undefined}
                        sx={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 2,
                          p: 1.4,
                          mx: -1.4,
                          borderRadius: 2,
                          textDecoration: 'none',
                          border: '1px solid transparent',
                          backgroundColor: 'rgba(0, 0, 0, 0)',
                          transition:
                            'background-color 0.22s ease, border-color 0.22s ease, transform 0.22s ease',
                          ...(item.href
                            ? {
                                cursor: 'pointer',
                                '&:hover': {
                                  backgroundColor: '#f8fafc',
                                  borderColor: colors.border.light,
                                  transform: 'translateX(2px)',
                                },
                              }
                            : {}),
                          '&:hover .contact-icon-chip': {
                            color: colors.accent.primary,
                            borderColor: 'rgba(124, 58, 237, 0.3)',
                            backgroundColor: 'rgba(124, 58, 237, 0.06)',
                            boxShadow: '0 10px 28px rgba(124, 58, 237, 0.1)',
                            transform: 'translateY(-2px)',
                          },
                        }}
                      >
                        <Box
                          className="contact-icon-chip"
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            color: colors.accent.secondary,
                            backgroundColor: '#f8fafc',
                            border: `1px solid ${colors.border.light}`,
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)',
                            backdropFilter: 'blur(10px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            transition:
                              'background-color 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease, color 0.22s ease, transform 0.22s ease',
                          }}
                        >
                          <IconComponent sx={{ fontSize: 22, color: 'currentColor' }} />
                        </Box>
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{
                              color: colors.text.muted,
                              mb: 0.5,
                              fontWeight: 700,
                              fontSize: '0.72rem',
                              letterSpacing: '0.08em',
                              textTransform: 'uppercase',
                            }}
                          >
                            {item.label}
                          </Typography>
                          {item.href ? (
                            <Typography
                              sx={{
                                color: colors.text.primary,
                                fontSize: '0.98rem',
                                lineHeight: 1.6,
                              }}
                            >
                              {item.value}
                            </Typography>
                          ) : (
                            <Typography
                              sx={{
                                color: colors.text.primary,
                                fontSize: '0.98rem',
                                lineHeight: 1.6,
                              }}
                            >
                              {item.value}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    );
                  })}
                </Box>

                <Paper
                  elevation={0}
                  sx={{
                    mt: 4,
                    height: 200,
                    backgroundColor: colors.background.secondary,
                    border: `1px solid ${colors.border.light}`,
                    borderRadius: 3,
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  <Box
                    component="iframe"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.5!2d76.1!3d11.05!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sPeruvallur%2C+Malappuram%2C+Kerala!5e0!3m2!1sen!2sin!4v1700000000000"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen=""
                    title="Aslisite Technologies Location - Peruvallur, Malappuram, Kerala"
                    sx={{
                      width: '100%',
                      height: '100%',
                      border: 'none',
                      filter: 'none',
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background:
                        'linear-gradient(to top, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.4) 60%, transparent 100%)',
                      px: 2,
                      py: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <LocationOn
                      sx={{
                        fontSize: 18,
                        color: colors.accent.primary,
                        flexShrink: 0,
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        color: colors.text.secondary,
                        fontSize: '0.75rem',
                        lineHeight: 1.4,
                      }}
                    >
                      Peruvallur, Malappuram, Kerala, India 676317
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            </Grid>

            <Grid item xs={12} md={7} component={motion.div} variants={rightPanelVariants}>
              <Paper
                elevation={0}
                component="form"
                onSubmit={handleSubmit}
                sx={{
                  p: { xs: 3, md: 4 },
                  backgroundColor: colors.background.secondary,
                  border: `1px solid ${colors.border.light}`,
                  borderRadius: 3,
                  height: '100%',
                  margin: { xs: '0 auto', md: 0 },
                  maxWidth: { xs: '480px', sm: '600px', md: '100%' },
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    color: colors.text.primary,
                    fontWeight: 700,
                    mb: 4,
                    fontSize: { xs: '1.15rem', md: '1.35rem' },
                    letterSpacing: '0.01em',
                  }}
                >
                  Send Us a Message
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Your Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      autoComplete="name"
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: colors.background.secondary,
                          '& fieldset': {
                            borderColor: colors.border.light,
                          },
                          '&:hover fieldset': {
                            borderColor: colors.accent.primary,
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: colors.accent.primary,
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: colors.text.muted,
                          '&.Mui-focused': {
                            color: colors.accent.primary,
                          },
                        },
                        '& .MuiOutlinedInput-input': {
                          color: colors.text.primary,
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      name="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: colors.background.secondary,
                          '& fieldset': {
                            borderColor: colors.border.light,
                          },
                          '&:hover fieldset': {
                            borderColor: colors.accent.primary,
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: colors.accent.primary,
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: colors.text.muted,
                          '&.Mui-focused': {
                            color: colors.accent.primary,
                          },
                        },
                        '& .MuiOutlinedInput-input': {
                          color: colors.text.primary,
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Company (Optional)"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: colors.background.secondary,
                          '& fieldset': {
                            borderColor: colors.border.light,
                          },
                          '&:hover fieldset': {
                            borderColor: colors.accent.primary,
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: colors.accent.primary,
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: colors.text.muted,
                          '&.Mui-focused': {
                            color: colors.accent.primary,
                          },
                        },
                        '& .MuiOutlinedInput-input': {
                          color: colors.text.primary,
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Your Message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      multiline
                      rows={5}
                      variant="outlined"
                      placeholder="Tell us about your project, goals, and timeline..."
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: colors.background.secondary,
                          '& fieldset': {
                            borderColor: colors.border.light,
                          },
                          '&:hover fieldset': {
                            borderColor: colors.accent.primary,
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: colors.accent.primary,
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: colors.text.muted,
                          '&.Mui-focused': {
                            color: colors.accent.primary,
                          },
                        },
                        '& .MuiOutlinedInput-input': {
                          color: colors.text.primary,
                        },
                        '& .MuiOutlinedInput-input::placeholder': {
                          color: colors.text.muted,
                          opacity: 0.7,
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={loading}
                      endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send />}
                      sx={{
                        backgroundColor: colors.accent.primary,
                        color: '#ffffff',
                        fontWeight: 700,
                        px: 4,
                        py: 1.5,
                        fontSize: '1rem',
                        textTransform: 'none',
                        boxShadow: '0 2px 8px rgba(109, 40, 217, 0.15)',
                        '&:hover': {
                          backgroundColor: colors.accent.primaryHover,
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 14px rgba(109, 40, 217, 0.22)',
                        },
                        transition: 'all 0.2s ease',
                        '&:disabled': {
                          backgroundColor: '#e4e4e7',
                          color: colors.text.muted,
                          boxShadow: 'none',
                        },
                      }}
                    >
                      {loading ? 'Sending...' : 'Send Message'}
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{
            width: '100%',
            backgroundColor: colors.background.elevated,
            color: colors.text.primary,
            border: `1px solid ${colors.accent.primary}`,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Contact;
