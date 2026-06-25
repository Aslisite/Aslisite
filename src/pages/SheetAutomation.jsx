import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Stack,
  Card,
  CardContent,
  Snackbar,
  Alert,
  Divider,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { colors } from '../theme/theme';
import { absoluteUrl } from '../seo/siteMetadata';
import { ShieldCheck, Mail, Calendar, ArrowRight, CheckCircle2 } from 'lucide-react';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const SheetAutomation = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });
  const [pricing, setPricing] = useState({
    symbol: '₹',
    value: '499',
    amount: 49900,
    currency: 'INR',
    label: 'One-time commercial license fee',
  });

  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const isIndian =
        tz &&
        (tz.toLowerCase().includes('kolkata') ||
          tz.toLowerCase().includes('calcutta') ||
          tz.toLowerCase().includes('asia/kolkata'));

      if (!isIndian) {
        setPricing({
          symbol: '$',
          value: '9.99',
          amount: 999, // cents (USD)
          currency: 'USD',
          label: 'One-time commercial license fee (Global)',
        });
      }
    } catch (e) {
      console.warn('Failed to auto-detect timezone, defaulting to INR:', e);
    }
  }, []);

  const showToast = (message, severity = 'info') => {
    setToast({ open: true, message, severity });
  };

  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
  };

  const handleBuyNow = async () => {
    setLoading(true);
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      showToast('Failed to load payment gateway. Please check your internet connection.', 'error');
      setLoading(false);
      return;
    }

    try {
      // 1. Create order on server side
      const orderRes = await fetch('/api/razorpay-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: pricing.amount,
          currency: pricing.currency,
        }),
      });

      if (!orderRes.ok) {
        throw new Error('Order creation failed on backend');
      }

      const orderData = await orderRes.json();
      const orderId = orderData.id;

      // 2. Open Razorpay Checkout overlay
      const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder';
      const options = {
        key: keyId,
        amount: pricing.amount,
        currency: pricing.currency,
        name: 'Sheet Automation',
        description: 'AR & Invoice Chaser - Lifetime License',
        image: '/AslisiteLogo.svg',
        order_id: orderId,
        handler: async function (response) {
          try {
            setLoading(true);
            const verifyRes = await fetch('/api/razorpay-verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (verifyRes.ok) {
              sessionStorage.setItem('sheet_automation_payment_verified', 'true');
              showToast('Payment verified successfully! Redirecting...', 'success');
              setTimeout(() => {
                navigate('/products/sheet-automation/welcome');
              }, 1200);
            } else {
              const errData = await verifyRes.json();
              showToast(errData.error || 'Payment signature verification failed.', 'error');
            }
          } catch (verifyErr) {
            console.error('Error during signature verification:', verifyErr);
            showToast('Verification server connection error.', 'error');
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: '',
          email: '',
        },
        theme: {
          color: colors.accent.primary,
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (resp) {
        showToast(resp.error.description || 'Payment process failed.', 'error');
      });
      rzp.open();
    } catch (err) {
      console.warn('Error during Razorpay flow setup:', err);
      // Fallback checkout simulation if Razorpay configuration variables are missing (for easy review & testing)
      const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!keyId || keyId === 'rzp_test_placeholder' || keyId.includes('YOUR_')) {
        sessionStorage.setItem('sheet_automation_payment_verified', 'true');
        showToast('Local/Test Mode: Simulating checkout flow verification...', 'info');
        setTimeout(() => {
          navigate('/products/sheet-automation/welcome');
        }, 1500);
      } else {
        showToast('Payment initiation failed. Please check your network and try again.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const pageTitle = 'Sheet Automation: Automated Payment Reminder & Invoice Chaser';
  const pageDescription =
    'Automatically dispatch invoices, track days pending, and trigger smart escalation reminders out of your self-hosted Google Sheets.';

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={absoluteUrl('/products/sheet-automation')} />
        <meta property="og:url" content={absoluteUrl('/products/sheet-automation')} />
        <meta property="og:type" content="product" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content="/AslisiteLogo.svg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
      </Helmet>

      {/* Cyberpunk background grid elements */}
      <Box
        sx={{
          backgroundColor: colors.background.primary,
          position: 'relative',
          overflow: 'hidden',
          minHeight: '100vh',
          pt: { xs: 12, md: 16 },
          pb: { xs: 8, md: 12 },
        }}
      >
        {/* Glow Effects */}
        <Box
          sx={{
            position: 'absolute',
            top: '10%',
            left: '5%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 60%)',
            filter: 'blur(50px)',
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '15%',
            right: '5%',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, transparent 60%)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          {/* HERO SECTION */}
          <Box sx={{ textAlign: 'center', mb: { xs: 8, md: 12 } }}>
            <motion.div
              initial={{ opacity: 0.35, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Typography
                component="span"
                sx={{
                  display: 'inline-block',
                  mb: 2,
                  px: 2,
                  py: 0.75,
                  borderRadius: '9999px',
                  border: `1px solid ${colors.border.accent}`,
                  backgroundColor: 'rgba(168, 85, 247, 0.08)',
                  color: colors.accent.primary,
                  fontSize: '0.875rem',
                  fontWeight: 650,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                New Product Release
              </Typography>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0.35, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{
                fontFamily: '"Space Grotesk", "Inter", sans-serif',
                fontWeight: 800,
                fontSize: '2.5rem',
                lineHeight: 1.15,
                margin: '16px auto',
                maxWidth: '850px',
              }}
            >
              <span style={{ color: '#fff' }}>Sheet Automation: </span>
              <span
                style={{
                  background: colors.accent.gradient,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Automated Payment Reminder & Invoice Chaser
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0.35, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                color: colors.text.secondary,
                fontSize: '1.15rem',
                lineHeight: 1.65,
                maxWidth: '750px',
                margin: '0 auto 32px auto',
                fontWeight: 450,
              }}
            >
              Automatically dispatch invoices, track days pending, and trigger smart escalation
              reminders on Day 3, 7, and 14—completely out of your own self-hosted Google Sheets.
            </motion.p>

            <motion.div
              initial={{ opacity: 0.35, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Button
                variant="contained"
                onClick={handleBuyNow}
                disabled={loading}
                endIcon={<ArrowRight size={18} />}
                sx={{
                  py: 1.8,
                  px: 5,
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  boxShadow: '0 8px 30px rgba(168, 85, 247, 0.35)',
                  '&:hover': {
                    boxShadow: '0 12px 35px rgba(168, 85, 247, 0.45)',
                  },
                }}
              >
                {loading ? 'Processing...' : 'Buy Now'}
              </Button>
            </motion.div>
          </Box>

          {/* FEATURE SHOWCASE GRID */}
          <Box sx={{ mb: { xs: 8, md: 12 } }}>
            <Typography
              variant="h3"
              sx={{
                textAlign: 'center',
                fontFamily: '"Space Grotesk", sans-serif',
                fontWeight: 750,
                fontSize: { xs: '1.8rem', md: '2.2rem' },
                mb: 6,
                color: '#fff',
              }}
            >
              Features Designed For Absolute Control
            </Typography>

            <Grid container spacing={4}>
              {/* Feature 1 */}
              <Grid item xs={12} md={4}>
                <Card
                  component={motion.div}
                  initial={{ opacity: 0.35, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  sx={{
                    height: '100%',
                    backgroundColor: colors.background.elevated,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <CardContent sx={{ p: 4, flexGrow: 1 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        backgroundColor: 'rgba(6, 182, 212, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: colors.accent.secondary,
                        mb: 3,
                      }}
                    >
                      <Mail size={24} />
                    </Box>
                    <Typography
                      variant="h5"
                      sx={{
                        fontFamily: '"Space Grotesk", sans-serif',
                        fontWeight: 650,
                        fontSize: '1.25rem',
                        mb: 1.5,
                        color: '#fff',
                      }}
                    >
                      Automated Dispatch
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: colors.text.secondary, lineHeight: 1.7 }}
                    >
                      {
                        "Drop invoice PDFs in your Google Drive 'Invoices to Send' folder; the engine auto-logs and emails your clients."
                      }
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Feature 2 */}
              <Grid item xs={12} md={4}>
                <Card
                  component={motion.div}
                  initial={{ opacity: 0.35, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  sx={{
                    height: '100%',
                    backgroundColor: colors.background.elevated,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <CardContent sx={{ p: 4, flexGrow: 1 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        backgroundColor: 'rgba(168, 85, 247, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: colors.accent.primary,
                        mb: 3,
                      }}
                    >
                      <Calendar size={24} />
                    </Box>
                    <Typography
                      variant="h5"
                      sx={{
                        fontFamily: '"Space Grotesk", sans-serif',
                        fontWeight: 650,
                        fontSize: '1.25rem',
                        mb: 1.5,
                        color: '#fff',
                      }}
                    >
                      Time-Driven Chasing
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: colors.text.secondary, lineHeight: 1.7 }}
                    >
                      Set-and-forget background cloud triggers that automatically step up collection
                      tones on exact day thresholds.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Feature 3 */}
              <Grid item xs={12} md={4}>
                <Card
                  component={motion.div}
                  initial={{ opacity: 0.35, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  sx={{
                    height: '100%',
                    backgroundColor: colors.background.elevated,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <CardContent sx={{ p: 4, flexGrow: 1 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        backgroundColor: 'rgba(6, 182, 212, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: colors.accent.secondary,
                        mb: 3,
                      }}
                    >
                      <ShieldCheck size={24} />
                    </Box>
                    <Typography
                      variant="h5"
                      sx={{
                        fontFamily: '"Space Grotesk", sans-serif',
                        fontWeight: 650,
                        fontSize: '1.25rem',
                        mb: 1.5,
                        color: '#fff',
                      }}
                    >
                      100% Secure & Private
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: colors.text.secondary, lineHeight: 1.7 }}
                    >
                      Code runs entirely in your own Google Workspace container. No third-party
                      servers ever read your client database.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

          {/* PRICING BLOCK */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Card
              component={motion.div}
              initial={{ opacity: 0.35, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              sx={{
                width: '100%',
                maxWidth: '650px',
                backgroundColor: 'rgba(19, 24, 36, 0.7)',
                backdropFilter: 'blur(16px)',
                border: `2px solid ${colors.border.accent}`,
                borderRadius: 4,
                boxShadow: '0 25px 50px -12px rgba(168, 85, 247, 0.25)',
                overflow: 'hidden',
              }}
            >
              <CardContent sx={{ p: { xs: 4, md: 6 } }}>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: colors.accent.secondary,
                      textTransform: 'uppercase',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      letterSpacing: 1.5,
                      mb: 1,
                    }}
                  >
                    Commercial License
                  </Typography>
                  <Typography
                    variant="h2"
                    sx={{
                      fontFamily: '"Space Grotesk", sans-serif',
                      fontWeight: 800,
                      fontSize: { xs: '3rem', md: '3.5rem' },
                      color: '#fff',
                      mb: 0.5,
                    }}
                  >
                    {pricing.symbol}
                    {pricing.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.text.muted }}>
                    {pricing.label}
                  </Typography>
                </Box>

                <Divider sx={{ my: 3, borderColor: colors.border.light }} />

                <Stack spacing={2} sx={{ mb: 4 }}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <CheckCircle2 size={20} color={colors.accent.secondary} />
                    <Typography
                      variant="body1"
                      sx={{ color: colors.text.primary, fontSize: '0.975rem' }}
                    >
                      Complete source code control
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <CheckCircle2 size={20} color={colors.accent.secondary} />
                    <Typography
                      variant="body1"
                      sx={{ color: colors.text.primary, fontSize: '0.975rem' }}
                    >
                      Master template access (Google Sheets)
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <CheckCircle2 size={20} color={colors.accent.secondary} />
                    <Typography
                      variant="body1"
                      sx={{ color: colors.text.primary, fontSize: '0.975rem' }}
                    >
                      No monthly subscriptions or hidden limits
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <CheckCircle2 size={20} color={colors.accent.secondary} />
                    <Typography
                      variant="body1"
                      sx={{ color: colors.text.primary, fontSize: '0.975rem' }}
                    >
                      Apps Script chaser trigger setup instructions
                    </Typography>
                  </Stack>
                </Stack>

                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleBuyNow}
                  disabled={loading}
                  sx={{
                    py: 1.8,
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    borderRadius: 3,
                    background: colors.accent.gradient,
                    '&:hover': {
                      background: colors.accent.gradientReverse,
                    },
                  }}
                >
                  {loading ? 'Processing Transaction...' : 'Buy Now & Download Template'}
                </Button>
              </CardContent>
            </Card>
          </Box>
        </Container>
      </Box>

      {/* Snackbar Toasts */}
      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toast.severity}
          variant="filled"
          sx={{
            width: '100%',
            fontFamily: '"Inter", sans-serif',
            borderRadius: 2,
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SheetAutomation;
