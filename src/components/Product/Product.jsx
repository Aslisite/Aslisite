import {
  Box,
  Button,
  Chip,
  Container,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { motion } from 'framer-motion';
import { colors } from '../../theme/theme';
import ReceiptLongImport from '@mui/icons-material/ReceiptLong';
import AccountBalanceImport from '@mui/icons-material/AccountBalance';
import TrendingUpImport from '@mui/icons-material/TrendingUp';
import SpeedImport from '@mui/icons-material/Speed';
import ArrowForwardImport from '@mui/icons-material/ArrowForward';

const ReceiptLong = ReceiptLongImport.default || ReceiptLongImport;
const AccountBalance = AccountBalanceImport.default || AccountBalanceImport;
const TrendingUp = TrendingUpImport.default || TrendingUpImport;
const Speed = SpeedImport.default || SpeedImport;
const ArrowForward = ArrowForwardImport.default || ArrowForwardImport;

const fadeUpVariants = {
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

const leftColumnVariants = {
  hidden: { opacity: 0.35, x: -28 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.75,
      ease: 'easeOut',
    },
  },
};

const rightColumnVariants = {
  hidden: { opacity: 0.35, x: 28 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.75,
      ease: 'easeOut',
    },
  },
};

const featureListVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.11,
      delayChildren: 0.08,
    },
  },
};

const featureItemVariants = {
  hidden: { opacity: 0.35, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: 'easeOut',
    },
  },
};

const ctaVariants = {
  hidden: { opacity: 0.35, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: 'easeOut',
      delay: 0.45,
    },
  },
};

const features = [
  { icon: <ReceiptLong />, text: 'Easy Invoice Creation' },
  { icon: <AccountBalance />, text: 'GST-Ready Billing' },
  { icon: <TrendingUp />, text: 'Expense & Payment Tracking' },
  { icon: <Speed />, text: 'Simple Dashboard Insights' },
];

const Product = () => {
  return (
    <Box
      component="section"
      id="aslibooks"
      tabIndex="-1"
      sx={{
        pt: { xs: 6, md: 8 },
        pb: { xs: 6, md: 8 },
        backgroundColor: colors.background.elevated,
        position: 'relative',
        overflow: 'hidden',
        scrollMarginTop: '80px',
        borderBottom: `1px solid ${colors.border.light}`,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          right: '0%',
          transform: 'translate(20%, -50%)',
          width: '800px',
          height: '800px',
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.06) 0%, transparent 60%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          component={motion.div}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 }, maxWidth: '900px', mx: 'auto' }}>
            <Box component={motion.div} variants={fadeUpVariants}>
              <Chip
                label="Product Spotlight"
                size="small"
                sx={{
                  mb: 2.5,
                  height: 28,
                  fontWeight: 700,
                  fontSize: '0.7rem',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  background: colors.accent.gradient,
                  color: '#fff',
                }}
              />
            </Box>

            <Typography
              component={motion.h2}
              variants={fadeUpVariants}
              sx={{
                fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.6rem' },
                fontWeight: 800,
                mb: 2,
                color: colors.text.primary,
                lineHeight: 1.14,
                textAlign: 'center',
                maxWidth: '780px',
                mx: 'auto',
                letterSpacing: '-0.02em',
                fontFamily: '"Space Grotesk", "Inter", sans-serif',
              }}
            >
              <Box
                component="span"
                sx={{
                  background: colors.accent.gradient,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                AsliBooks
              </Box>
              {' '}— Smart Invoicing & GST for Growing Businesses
            </Typography>

            <Typography
              component={motion.p}
              variants={fadeUpVariants}
              variant="body1"
              sx={{
                color: colors.text.secondary,
                fontWeight: 450,
                fontSize: { xs: '0.98rem', md: '1.06rem' },
                lineHeight: 1.75,
                maxWidth: '600px',
                mx: 'auto',
              }}
            >
              Simplify billing, manage GST, and track your business finances - all in one place.
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 6, md: 5 }} alignItems="center" justifyContent="center">
            <Grid
              item
              xs={12}
              md={5}
              component={motion.div}
              variants={leftColumnVariants}
              sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
            >
              <List
                component={motion.ul}
                variants={featureListVariants}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  mx: { xs: 'auto', md: 0 },
                  width: { xs: 'fit-content', md: '100%' },
                  alignItems: 'flex-start',
                }}
              >
                {features.map((feature, idx) => (
                  <ListItem
                    component={motion.li}
                    key={idx}
                    variants={featureItemVariants}
                    disablePadding
                    sx={{
                      transition: 'transform 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: colors.accent.primary, minWidth: 40 }}>
                      {feature.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={feature.text}
                      primaryTypographyProps={{
                        fontSize: '0.98rem',
                        fontWeight: 600,
                        color: colors.text.primary,
                        lineHeight: 1.4,
                      }}
                    />
                  </ListItem>
                ))}
              </List>

              <Box component={motion.div} variants={ctaVariants} sx={{ mt: 1 }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    component="a"
                    href="https://www.aslibooks.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    endIcon={<ArrowForward />}
                    sx={{
                      py: 1.5,
                      px: 4,
                      fontSize: '1rem',
                      fontWeight: 600,
                      background: colors.accent.gradient,
                      borderRadius: 2,
                      boxShadow: '0 4px 20px rgba(124, 58, 237, 0.2)',
                      transition: 'background 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease',
                      '&:hover': {
                        background: colors.accent.gradient,
                        boxShadow: '0 6px 28px rgba(124, 58, 237, 0.28)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    Try AsliBooks
                  </Button>
                </Stack>
              </Box>
            </Grid>

            <Grid item xs={12} md={5} component={motion.div} variants={rightColumnVariants}>
              <Box
                sx={{
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  perspective: '1000px',
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: { xs: '100%', md: '640px' },
                    borderRadius: 2,
                    overflow: 'hidden',
                    background: '#f8fafc',
                    border: `1px solid ${colors.border.light}`,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(10px)',
                    transform: { xs: 'none', md: 'rotateY(-5deg) rotateX(2deg)' },
                    transition: 'transform 0.5s ease',
                    '&:hover': {
                      transform: { xs: 'none', md: 'rotateY(0deg) rotateX(0deg)' },
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 1,
                      px: 2,
                      py: 1.5,
                      borderBottom: `1px solid ${colors.border.light}`,
                      backgroundColor: '#f1f5f9',
                    }}
                  >
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        backgroundColor: '#ff5f56',
                      }}
                    />
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        backgroundColor: '#ffbd2e',
                      }}
                    />
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        backgroundColor: '#27c93f',
                      }}
                    />
                  </Box>

                  <Box
                    sx={{
                      bgcolor: colors.background.secondary,
                    }}
                  >
                    <Box
                      component="img"
                      src="/aslibooks-vector-dashboard.svg"
                      alt="AsliBooks Dashboard"
                      sx={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                        opacity: 0.9,
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box
          sx={{
            mt: { xs: 6, md: 8 },
            pt: { xs: 3, md: 4 },
            borderTop: `1px solid ${colors.border.light}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              color: colors.text.muted,
              letterSpacing: '0.12em',
              fontWeight: 600,
              fontSize: { xs: '0.72rem', md: '0.8rem' },
            }}
          >
            Built for small businesses, freelancers, and startups
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Product;
