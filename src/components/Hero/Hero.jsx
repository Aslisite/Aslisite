import { useRef } from 'react';
import { Box, Button, Container, Stack, Typography, useMediaQuery } from '@mui/material';
import ArrowForwardImport from '@mui/icons-material/ArrowForward';
import { motion } from 'framer-motion';
import { colors } from '../../theme/theme';
import { SectionBadge } from '../common';
import { Sparkles } from 'lucide-react';

const ArrowForward = ArrowForwardImport.default || ArrowForwardImport;

const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay },
  }),
};

const Hero = () => {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const glowRef = useRef(null);

  const handlePointerMove = (e) => {
    if (glowRef.current) {
      const x = (e.clientX - window.innerWidth / 2) / 30;
      const y = (e.clientY - window.innerHeight / 2) / 30;
      glowRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }
  };

  const handlePointerLeave = () => {
    if (glowRef.current) {
      glowRef.current.style.transform = 'translate3d(0px, 0px, 0)';
    }
  };

  return (
    <Box
      component="section"
      id="hero"
      tabIndex="-1"
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      sx={{
        minHeight: { xs: 'auto', md: '100vh' },
        display: 'flex',
        alignItems: { xs: 'flex-start', md: 'center' },
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: colors.background.primary,
        pt: { xs: 14, md: 16 },
        pb: { xs: 8, md: 10 },
        scrollMarginTop: '64px',
      }}
    >
      {/* Subtle background glow */}
      <Box
        ref={glowRef}
        sx={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          transition: 'transform 600ms ease-out',
          zIndex: 0,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '20%',
            left: '15%',
            width: 500,
            height: 500,
            bgcolor: 'rgba(109, 40, 217, 0.04)',
            filter: 'blur(120px)',
            borderRadius: '50%',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '20%',
            right: '15%',
            width: 400,
            height: 400,
            bgcolor: 'rgba(13, 148, 136, 0.04)',
            filter: 'blur(120px)',
            borderRadius: '50%',
          }}
        />
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            maxWidth: 860,
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
                gap: 1,
                backgroundColor: 'rgba(13, 148, 136, 0.08)',
                color: colors.accent.secondary,
                borderColor: 'rgba(13, 148, 136, 0.2)',
              }}
            >
              <Sparkles size={13} color={colors.accent.secondary} />
              Digital Growth Studio
            </SectionBadge>
          </Box>

          <Typography
            component={motion.h1}
            initial={prefersReducedMotion ? false : 'hidden'}
            animate="visible"
            custom={0.08}
            variants={fadeUpVariants}
            sx={{
              color: colors.text.primary,
              fontSize: { xs: '2.5rem', sm: '3.8rem', md: '4.8rem', lg: '5.5rem' },
              fontWeight: 800,
              lineHeight: 1.0,
              letterSpacing: '-0.04em',
              mb: 3,
              fontFamily: '"Space Grotesk", "Inter", sans-serif',
            }}
          >
            Build digital systems
            <br />
            <Box
              component="span"
              sx={{
                background: colors.accent.gradient,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              that grow revenue.
            </Box>
          </Typography>

          <Typography
            component={motion.p}
            initial={prefersReducedMotion ? false : 'hidden'}
            animate="visible"
            custom={0.16}
            variants={fadeUpVariants}
            sx={{
              color: colors.text.secondary,
              fontWeight: 420,
              lineHeight: 1.7,
              maxWidth: 560,
              mb: 5,
              fontSize: { xs: '1.05rem', md: '1.15rem' },
            }}
          >
            We design and build websites, ecommerce platforms, and SEO foundations that
            turn visitors into customers and traffic into revenue.
          </Typography>

          <Stack
            component={motion.div}
            initial={prefersReducedMotion ? false : 'hidden'}
            animate="visible"
            custom={0.24}
            variants={fadeUpVariants}
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{
              width: { xs: '100%', sm: 'auto' },
              '& .MuiButton-root': { width: { xs: '100%', sm: 'auto' } },
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
              sx={{ py: 1.7, px: 4.5, fontSize: '1rem', fontWeight: 700, borderRadius: 2.5 }}
            >
              Start a Project
            </Button>
            <Button
              variant="outlined"
              size="large"
              href="#services"
              sx={{
                py: 1.6,
                px: 4,
                fontSize: '0.95rem',
                fontWeight: 600,
                borderRadius: 2.5,
                borderColor: colors.border.medium,
                color: colors.text.secondary,
              }}
            >
              View Services
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Hero;
