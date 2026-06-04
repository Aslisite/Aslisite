import { Box, Button, Container, Stack, Typography, useMediaQuery } from '@mui/material';
import ArrowForwardImport from '@mui/icons-material/ArrowForward';
import CheckCircleImport from '@mui/icons-material/CheckCircle';
import { motion } from 'framer-motion';
import { colors } from '../../theme/theme';
import { SectionBadge } from '../common';

const ArrowForward = ArrowForwardImport.default || ArrowForwardImport;
const CheckCircle = CheckCircleImport.default || CheckCircleImport;

const fadeUpVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.72,
      ease: 'easeOut',
      delay,
    },
  }),
};

const systemSteps = ['Strategy', 'Website', 'SEO', 'Conversion'];

const Hero = () => {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  return (
    <Box
      component="section"
      id="hero"
      tabIndex="-1"
      sx={{
        minHeight: { xs: 'auto', md: 'calc(100vh - 64px)' },
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#08090b',
        pt: { xs: 13, md: 14 },
        pb: { xs: 7, md: 10 },
        scrollMarginTop: '64px',
        borderBottom: `1px solid ${colors.border.light}`,
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.045) 1px, transparent 1px)
          `,
          backgroundSize: '88px 88px',
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.9), transparent 76%)',
          opacity: 0.45,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          left: '50%',
          top: '18%',
          width: { xs: 280, md: 520 },
          height: { xs: 280, md: 520 },
          transform: 'translateX(-50%)',
          background: 'radial-gradient(circle, rgba(139, 163, 106, 0.13), transparent 68%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            maxWidth: 930,
            mx: 'auto',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box
            component={motion.div}
            initial={prefersReducedMotion ? false : 'hidden'}
            animate="visible"
            custom={0}
            variants={fadeUpVariants}
          >
            <SectionBadge
              sx={{
                mb: 3,
                color: colors.accent.primary,
                borderColor: 'rgba(139, 163, 106, 0.24)',
                backgroundColor: 'rgba(139, 163, 106, 0.07)',
              }}
            >
              Digital Growth Studio
            </SectionBadge>
          </Box>

          <Typography
            component={motion.h1}
            initial={prefersReducedMotion ? false : 'hidden'}
            animate="visible"
            custom={0.08}
            variants={fadeUpVariants}
            variant="h1"
            sx={{
              color: colors.text.primary,
              fontSize: { xs: '2.45rem', sm: '3.25rem', md: '4.35rem', lg: '5rem' },
              fontWeight: 800,
              lineHeight: 1.02,
              letterSpacing: 0,
              maxWidth: 820,
              mb: 3.2,
            }}
          >
            Digital systems for serious growth.
          </Typography>

          <Typography
            component={motion.p}
            initial={prefersReducedMotion ? false : 'hidden'}
            animate="visible"
            custom={0.18}
            variants={fadeUpVariants}
            variant="h6"
            sx={{
              color: colors.text.secondary,
              fontWeight: 400,
              lineHeight: 1.72,
              maxWidth: 620,
              mb: 4.5,
              fontSize: { xs: '1rem', md: '1.1rem' },
              letterSpacing: 0,
            }}
          >
            Aslisite builds websites, ecommerce, software and SEO foundations that bring better
            traffic, better leads and better business flow.
          </Typography>

          <Stack
            component={motion.div}
            initial={prefersReducedMotion ? false : 'hidden'}
            animate="visible"
            custom={0.28}
            variants={fadeUpVariants}
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{
              mb: { xs: 5, md: 6 },
              width: { xs: '100%', sm: 'auto' },
              '& .MuiButton-root': {
                width: { xs: '100%', sm: 'auto' },
              },
            }}
          >
            <Button
              variant="contained"
              color="primary"
              size="large"
              component="a"
              href="https://wa.me/919495664173?text=Hi%20Aslisite,%20I'm%20interested%20in%20starting%20a%20project!"
              target="_blank"
              rel="noopener noreferrer"
              endIcon={<ArrowForward />}
              sx={{
                py: 1.55,
                px: 4,
                fontSize: '1rem',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #8ba36a 0%, #c8d2b0 100%)',
                color: '#06100d',
                boxShadow: '0 18px 40px rgba(139, 163, 106, 0.2)',
              }}
            >
              Start a Project
            </Button>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              href="#services"
              sx={{
                py: 1.55,
                px: 4,
                fontSize: '1rem',
                fontWeight: 700,
                color: colors.text.primary,
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.13)',
                boxShadow: 'none',
              }}
            >
              View Services
            </Button>
          </Stack>

          <Box
            component={motion.div}
            initial={prefersReducedMotion ? false : 'hidden'}
            animate="visible"
            custom={0.36}
            variants={fadeUpVariants}
            sx={{
              width: '100%',
              maxWidth: 760,
              p: { xs: 1.5, sm: 2 },
              borderRadius: 2,
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backgroundColor: 'rgba(255, 255, 255, 0.035)',
              backdropFilter: 'blur(14px)',
            }}
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(4, minmax(0, 1fr))',
                },
                gap: 1,
              }}
            >
              {systemSteps.map((step, index) => (
                <Box
                  key={step}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: { xs: 'flex-start', sm: 'center' },
                    gap: 1,
                    px: 1.5,
                    py: 1.3,
                    minHeight: 48,
                    borderRadius: 1.5,
                    color: index === 0 ? colors.accent.primary : colors.text.secondary,
                    backgroundColor:
                      index === 0 ? 'rgba(139, 163, 106, 0.08)' : 'rgba(255, 255, 255, 0.035)',
                  }}
                >
                  <CheckCircle sx={{ fontSize: 17 }} />
                  <Typography sx={{ fontSize: '0.86rem', fontWeight: 700 }}>{step}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Hero;
