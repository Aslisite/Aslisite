import { useState } from 'react';
import { Box, Button, Container, Stack, Typography, useMediaQuery } from '@mui/material';
import ArrowForwardImport from '@mui/icons-material/ArrowForward';
import CheckCircleImport from '@mui/icons-material/CheckCircle';
import ChevronRightImport from '@mui/icons-material/ChevronRight';
import { motion } from 'framer-motion';
import { colors } from '../../theme/theme';
import { BlurText, SectionBadge } from '../common';
import { Sparkles } from 'lucide-react';

const ArrowForward = ArrowForwardImport.default || ArrowForwardImport;
const CheckCircle = CheckCircleImport.default || CheckCircleImport;
const ChevronRight = ChevronRightImport.default || ChevronRightImport;

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

// Stagger animation for individual pipeline steps
const stepContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.36,
    },
  },
};

const stepItemVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.52,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const connectorVariants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.36,
      ease: 'easeOut',
    },
  },
};

const systemSteps = ['Strategy', 'Website', 'SEO', 'Conversion'];

const pulseAnimation = {
  '@keyframes heroPulse': {
    '0%, 100%': { opacity: 1 },
    '50%': { opacity: 0.5 },
  },
};

const pingAnimation = {
  '@keyframes heroPing': {
    '0%': { transform: 'scale(1)', opacity: 1 },
    '75%, 100%': { transform: 'scale(2)', opacity: 0 },
  },
};

const spinAnimation = {
  '@keyframes heroSpin': {
    to: { transform: 'rotate(360deg)' },
  },
};

const Hero = () => {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handlePointerMove = (e) => {
    const { clientX, clientY } = e;
    const x = (clientX - window.innerWidth / 2) / 25;
    const y = (clientY - window.innerHeight / 2) / 25;
    setMousePosition({ x, y });
  };

  const handlePointerLeave = () => {
    setMousePosition({ x: 0, y: 0 });
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
        backgroundColor: '#0c0f17',
        pt: { xs: 13, md: 14 },
        pb: { xs: 7, md: 10 },
        scrollMarginTop: '64px',
        borderBottom: `1px solid ${colors.border.light}`,
        ...pulseAnimation,
        ...pingAnimation,
        ...spinAnimation,
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
      {/* Dynamic Glowing Mesh Background influenced by mouse position */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          transition: 'transform 500ms ease-out',
          zIndex: 0,
          transform: `translate3d(${mousePosition.x}px, ${mousePosition.y}px, 0)`,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '25%',
            left: '25%',
            width: 450,
            height: 450,
            bgcolor: 'rgba(147, 51, 234, 0.1)',
            filter: 'blur(130px)',
            borderRadius: '50%',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '33.333%',
            right: '25%',
            width: 380,
            height: 380,
            bgcolor: 'rgba(8, 145, 178, 0.1)',
            filter: 'blur(130px)',
            borderRadius: '50%',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 40,
            left: '33.333%',
            width: 300,
            height: 300,
            bgcolor: 'rgba(236, 72, 153, 0.05)',
            filter: 'blur(100px)',
            borderRadius: '50%',
          }}
        />
      </Box>

      {/* High-quality SVG vector grid constellation */}
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: '100%',
          pointerEvents: 'none',
          opacity: 0.2,
          zIndex: 0,
        }}
      >
        <Box
          component="svg"
          sx={{ width: '100%', height: '100%' }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="grad-1" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#0c0f17" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Constellation line connections */}
          <line
            x1="10%"
            y1="15%"
            x2="25%"
            y2="30%"
            stroke="#a855f7"
            strokeWidth="0.5"
            strokeDasharray="4 4"
          />
          <line x1="25%" y1="30%" x2="40%" y2="20%" stroke="#a855f7" strokeWidth="0.5" />
          <line
            x1="40%"
            y1="20%"
            x2="55%"
            y2="35%"
            stroke="#06b6d4"
            strokeWidth="0.5"
            strokeDasharray="2 2"
          />
          <line x1="55%" y1="35%" x2="70%" y2="15%" stroke="#a855f7" strokeWidth="0.5" />
          <line x1="70%" y1="15%" x2="85%" y2="25%" stroke="#06b6d4" strokeWidth="0.5" />

          {/* Node pulse loops */}
          <circle
            cx="10%"
            cy="15%"
            r="3"
            fill="#a855f7"
            style={{
              transformOrigin: '10% 15%',
              animation: prefersReducedMotion
                ? 'none'
                : 'heroPing 3s cubic-bezier(0, 0, 0.2, 1) infinite',
            }}
          />
          <circle cx="25%" cy="30%" r="4" fill="#06b6d4" />
          <circle cx="40%" cy="20%" r="3" fill="#a855f7" />
          <circle
            cx="55%"
            cy="35%"
            r="5"
            fill="#f59e0b"
            style={{
              animation: prefersReducedMotion
                ? 'none'
                : 'heroPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }}
          />
          <circle cx="70%" cy="15%" r="4" fill="#a855f7" />
          <circle
            cx="85%"
            cy="25%"
            r="3"
            fill="#06b6d4"
            style={{
              transformOrigin: '85% 25%',
              animation: prefersReducedMotion
                ? 'none'
                : 'heroPing 4s cubic-bezier(0, 0, 0.2, 1) infinite',
            }}
          />
        </Box>
      </Box>

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
                borderColor: 'rgba(168, 85, 247, 0.24)',
                backgroundColor: 'rgba(168, 85, 247, 0.07)',
                gap: 1,
              }}
            >
              <Sparkles
                size={14}
                color="#c084fc"
                style={{
                  animation: prefersReducedMotion ? 'none' : 'heroSpin 4s linear infinite',
                }}
              />
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
              highlightWords={['serious', 'growth']}
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
                background: 'linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)',
                color: '#ffffff',
                boxShadow: '0 18px 40px rgba(168, 85, 247, 0.2)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #c084fc 0%, #22d3ee 100%)',
                  boxShadow: '0 18px 40px rgba(168, 85, 247, 0.35)',
                },
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
                '&:hover': {
                  borderColor: '#06b6d4',
                  boxShadow: '0 0 15px rgba(6, 182, 212, 0.16)',
                },
              }}
            >
              View Services
            </Button>
          </Stack>

          {/* System Steps Pipeline */}
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
              component={motion.div}
              initial={prefersReducedMotion ? false : 'hidden'}
              animate="visible"
              variants={stepContainerVariants}
              sx={{
                // Desktop (sm+): horizontal flex pipeline
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'stretch', sm: 'center' },
                justifyContent: { sm: 'center' },
                gap: { xs: 0, sm: 0 },
                position: 'relative',
              }}
            >
              {systemSteps.map((step, index) => (
                <Box
                  key={step}
                  sx={{
                    display: 'contents',
                  }}
                >
                  {/* Step item */}
                  <Box
                    component={motion.div}
                    variants={stepItemVariants}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      px: { xs: 1.5, sm: 1.5 },
                      py: 1.3,
                      minHeight: 48,
                      borderRadius: 1.5,
                      border: '1px solid',
                      borderColor: index === 0 ? 'rgba(168, 85, 247, 0.15)' : 'transparent',
                      color: index === 0 ? colors.accent.primary : colors.text.secondary,
                      backgroundColor:
                        index === 0 ? 'rgba(168, 85, 247, 0.08)' : 'rgba(255, 255, 255, 0.035)',
                      // Desktop: allow items to flex evenly
                      flex: { sm: '1 1 0' },
                      justifyContent: { xs: 'flex-start', sm: 'center' },
                      position: 'relative',
                      zIndex: 1,
                      mb: { xs: 0.5, sm: 0 },
                      '&:last-of-type': {
                        mb: 0,
                      },
                      transition:
                        'background-color 0.22s ease, color 0.22s ease, border-color 0.22s ease, transform 0.22s ease',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        color: index === 0 ? colors.accent.secondary : colors.accent.primary,
                        backgroundColor:
                          index === 0 ? 'rgba(6, 182, 212, 0.08)' : 'rgba(168, 85, 247, 0.08)',
                        borderColor:
                          index === 0 ? 'rgba(6, 182, 212, 0.25)' : 'rgba(168, 85, 247, 0.25)',
                      },
                    }}
                  >
                    <CheckCircle sx={{ fontSize: 17 }} />
                    <Typography sx={{ fontSize: '0.86rem', fontWeight: 700 }}>{step}</Typography>
                  </Box>

                  {/* Desktop chevron connector (between steps, not after the last) */}
                  {index < systemSteps.length - 1 && (
                    <Box
                      component={motion.div}
                      variants={connectorVariants}
                      aria-hidden="true"
                      sx={{
                        // Hide on mobile, show on desktop
                        display: { xs: 'none', sm: 'flex' },
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        px: 0.25,
                      }}
                    >
                      <ChevronRight
                        sx={{
                          fontSize: 18,
                          color: colors.text.muted,
                          opacity: 0.6,
                        }}
                      />
                    </Box>
                  )}
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
