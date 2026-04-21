import { Box, Button, Container, Stack, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ArrowForwardImport from '@mui/icons-material/ArrowForward';
import PlayArrowImport from '@mui/icons-material/PlayArrow';
import { colors } from '../../theme/theme';

const ArrowForward = ArrowForwardImport.default || ArrowForwardImport;
const PlayArrow = PlayArrowImport.default || PlayArrowImport;

const Hero = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  return (
    <Box
      component="section"
      id="hero"
      tabIndex="-1"
      sx={{
        minHeight: { xs: '100vh', md: 'calc(100vh - 64px)' },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: `linear-gradient(135deg, ${colors.background.primary} 0%, ${colors.background.secondary} 50%, ${colors.background.primary} 100%)`,
        pt: { xs: '80px', md: '64px' },
        pb: { xs: 6, md: 8 },
        scrollMarginTop: '64px',
        borderBottom: `1px solid ${colors.border.light}`,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '-10%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 212, 255, 0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: prefersReducedMotion ? 'none' : 'float 8s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
            '50%': { transform: 'translateY(-30px) rotate(5deg)' },
          },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          right: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: prefersReducedMotion ? 'none' : 'float 10s ease-in-out infinite reverse',
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          opacity: 0.5,
        }}
      />

      <Container
        maxWidth="lg"
        sx={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Box
          sx={{
            maxWidth: { xs: '100%', sm: '700px', md: '800px' },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="overline"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              mb: 3,
              px: 2.5,
              py: 1,
              borderRadius: 2,
              backgroundColor: 'rgba(0, 212, 255, 0.1)',
              color: colors.accent.primary,
              border: '1px solid rgba(0, 212, 255, 0.2)',
              fontSize: { xs: '0.7rem', sm: '0.75rem' },
              letterSpacing: '0.1em',
            }}
          >
            Premium Digital Agency
          </Typography>

          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.25rem', sm: '2.75rem', md: '3.5rem', lg: '4rem' },
              fontWeight: 800,
              lineHeight: 1.15,
              mb: 3,
              color: colors.text.primary,
              textAlign: 'center',
            }}
          >
            We Build{' '}
            <Box
              component="span"
              sx={{
                background: colors.accent.gradient,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Digital Experiences
            </Box>
            <br />
            That Drive Growth
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: colors.text.secondary,
              fontWeight: 400,
              lineHeight: 1.7,
              mb: 4,
              maxWidth: '600px',
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
              textAlign: 'center',
            }}
          >
            Aslisite delivers powerful web development, ecommerce solutions, custom software, and SEO services to help your business grow online and achieve fast results.
          </Typography>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{
              mb: 5,
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
                py: 1.5,
                px: 4,
                fontSize: '1rem',
                fontWeight: 600,
              }}
            >
              Start Your Project
            </Button>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              startIcon={<PlayArrow />}
              sx={{
                py: 1.5,
                px: 4,
                fontSize: '1rem',
                fontWeight: 600,
                color: colors.text.primary,
              }}
            >
              Watch Showreel
            </Button>
          </Stack>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              gap: { xs: 1.5, sm: 3 },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#22c55e',
                  boxShadow: '0 0 10px rgba(34, 197, 94, 0.5)',
                }}
              />
              <Typography variant="body2" sx={{ color: colors.text.muted }}>
                Available for new projects
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: colors.text.muted,
                display: { xs: 'none', sm: 'block' },
              }}
            >
              |
            </Typography>
            <Typography variant="body2" sx={{ color: colors.text.muted }}>
              Trusted by 200+ clients worldwide
            </Typography>
          </Box>
        </Box>
      </Container>

      <Box
        sx={{
          position: 'absolute',
          right: { xs: 16, md: 40 },
          top: '50%',
          transform: 'translateY(-50%)',
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
          zIndex: 10,
          animation: prefersReducedMotion ? 'none' : 'bounce 2s ease-in-out infinite',
          '@keyframes bounce': {
            '0%, 100%': { transform: 'translateY(-50%)' },
            '50%': { transform: 'translateY(calc(-50% + 10px))' },
          },
        }}
      >
        <Typography
          variant="caption"
          sx={{ color: colors.text.muted, textTransform: 'uppercase', letterSpacing: 2 }}
        >
          Scroll
        </Typography>
        <Box
          sx={{
            width: 24,
            height: 40,
            borderRadius: 12,
            border: `2px solid ${colors.border.medium}`,
            display: 'flex',
            justifyContent: 'center',
            pt: 1,
          }}
        >
          <Box
            sx={{
              width: 4,
              height: 8,
              borderRadius: 2,
              backgroundColor: colors.accent.primary,
              animation: prefersReducedMotion ? 'none' : 'scroll 2s ease-in-out infinite',
              '@keyframes scroll': {
                '0%, 100%': { opacity: 1, transform: 'translateY(0)' },
                '50%': { opacity: 0.5, transform: 'translateY(8px)' },
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Hero;
