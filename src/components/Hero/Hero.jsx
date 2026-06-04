import { Box, Button, Container, Stack, Typography, useMediaQuery } from '@mui/material';
import ArrowForwardImport from '@mui/icons-material/ArrowForward';
import CheckCircleImport from '@mui/icons-material/CheckCircle';
import { motion } from 'framer-motion';
import { colors } from '../../theme/theme';
import { BlurText, SectionBadge } from '../common';

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

  const handlePointerMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    event.currentTarget.style.setProperty('--mx', `${x}%`);
    event.currentTarget.style.setProperty('--my', `${y}%`);
  };

  const handlePointerLeave = (event) => {
    event.currentTarget.style.setProperty('--mx', '50%');
    event.currentTarget.style.setProperty('--my', '38%');
  };

  return (
    <Box
      component="section"
      id="hero"
      tabIndex="-1"
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      sx={{
        minHeight: { xs: 'auto', md: 'calc(100vh - 64px)' },
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#08090b',
        '--mx': '50%',
        '--my': '38%',
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
      }}
    >
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          left: 'var(--mx)',
          top: 'var(--my)',
          width: 'clamp(380px, 52vw, 860px)',
          height: 'clamp(380px, 52vw, 860px)',
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(139, 163, 106, 0.28) 0%, rgba(139, 163, 106, 0.14) 26%, rgba(139, 163, 106, 0.04) 52%, transparent 72%)',
          filter: 'blur(42px)',
          opacity: 0.75,
          mixBlendMode: 'screen',
          pointerEvents: 'none',
          animation: prefersReducedMotion ? 'none' : 'livingGlow 14s ease-in-out infinite',
          '@keyframes livingGlow': {
            '0%, 100%': {
              transform: 'translate(-50%, -50%) scale(0.98)',
              opacity: 0.6,
            },
            '50%': {
              transform: 'translate(-50%, -50%) scale(1.06)',
              opacity: 0.92,
            },
          },
        }}
      />

      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          inset: '-10%',
          background:
            'linear-gradient(135deg, transparent 10%, rgba(245, 241, 232, 0.03) 42%, transparent 62%)',
          transform: 'translate3d(0, 0, 0)',
          opacity: 0.72,
          filter: 'blur(18px)',
          pointerEvents: 'none',
          animation: prefersReducedMotion
            ? 'none'
            : 'fieldDrift 16s ease-in-out infinite alternate',
          '@keyframes fieldDrift': {
            '0%': { transform: 'translate3d(-2%, -1%, 0) scale(1)' },
            '100%': { transform: 'translate3d(2%, 1%, 0) scale(1.04)' },
          },
        }}
      />

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

          <Box
            component={motion.div}
            initial={prefersReducedMotion ? false : 'hidden'}
            animate="visible"
            custom={0.08}
            variants={fadeUpVariants}
            sx={{ width: '100%', display: 'flex', justifyContent: 'center', mb: 3.2 }}
          >
            <BlurText
              component="h1"
              text="Digital systems for serious growth."
              animateBy="words"
              direction="top"
              delay={130}
              stepDuration={0.32}
              sx={{
                color: colors.text.primary,
                fontSize: { xs: '2.45rem', sm: '3.25rem', md: '4.35rem', lg: '5rem' },
                fontWeight: 800,
                lineHeight: 1.02,
                letterSpacing: 0,
                maxWidth: 820,
                textAlign: 'center',
                wordBreak: 'keep-all',
              }}
            />
          </Box>

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
