import { Box, Container, Typography, useTheme, useMediaQuery } from '@mui/material';
import { colors } from '../../theme/theme';

const stats = [
  {
    value: '200+',
    label: 'Projects Delivered',
    description: 'Successfully launched digital products',
  },
  {
    value: '98%',
    label: 'Client Satisfaction',
    description: 'Average client rating across projects',
  },
  {
    value: '$2.5M+',
    label: 'Revenue Generated',
    description: 'For our clients in 2024',
  },
  {
    value: '15+',
    label: 'Years Experience',
    description: 'Building digital solutions',
  },
];

const Stats = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      component="section"
      id="stats"
      sx={{
        pt: { xs: 8, md: 10 },
        pb: { xs: 4, md: 6 },
        backgroundColor: colors.background.primary,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Gradient */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '800px',
          height: '400px',
          background: `radial-gradient(ellipse, rgba(0, 212, 255, 0.08) 0%, transparent 70%)`,
          filter: 'blur(40px)',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Section Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
          <Typography
            variant="overline"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              mb: 2,
              px: 2.5,
              py: 1,
              borderRadius: 2,
              backgroundColor: 'rgba(0, 212, 255, 0.1)',
              color: colors.accent.primary,
              border: `1px solid rgba(0, 212, 255, 0.2)`,
              fontSize: { xs: '0.7rem', sm: '0.75rem' },
              letterSpacing: '0.1em',
            }}
          >
            AsliBooks Success Metrics
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              fontWeight: 700,
              mb: 2,
              color: colors.text.primary,
            }}
          >
            Numbers That{' '}
            <Box
              component="span"
              sx={{
                background: colors.accent.gradient,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Speak
            </Box>
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: colors.text.secondary,
              fontWeight: 400,
              maxWidth: '600px',
              mx: 'auto',
              fontSize: { xs: '1rem', md: '1.125rem' },
              lineHeight: 1.6,
            }}
          >
            Our track record demonstrates consistent delivery of exceptional results
          </Typography>
        </Box>

        {/* Stats Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)',
            },
            gap: { xs: 3, md: 4 },
          }}
        >
          {stats.map((stat, index) => (
            <Box
              key={index}
              sx={{
                textAlign: 'center',
                p: { xs: 2.5, md: 4 },
                borderRadius: 3,
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: `1px solid ${colors.border.light}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  borderColor: colors.border.medium,
                  transform: 'translateY(-4px)',
                },
              }}
            >
              {/* Value */}
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                  fontWeight: 800,
                  background: colors.accent.gradient,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </Typography>

              {/* Label */}
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: colors.text.primary,
                  mb: 0.5,
                  fontSize: { xs: '0.9rem', md: '1rem' },
                }}
              >
                {stat.label}
              </Typography>

              {/* Description */}
              <Typography
                variant="body2"
                sx={{
                  color: colors.text.muted,
                  fontSize: '0.8rem',
                }}
              >
                {stat.description}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Trust Badges */}
        <Box
          sx={{
            mt: { xs: 4, md: 6 },
            pt: { xs: 3, md: 4 },
            borderTop: `1px solid ${colors.border.light}`,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'center',
            gap: { xs: 2, md: 4 },
          }}
        >
          <Typography variant="body2" sx={{ color: colors.text.muted }}>
            Trusted by innovative companies worldwide
          </Typography>
          <Box
            sx={{
              display: 'flex',
              gap: { xs: 3, md: 5 },
              opacity: 0.5,
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {['TechCorp', 'InnovateCo', 'DigitalFirst', 'CloudScale'].map((company, idx) => (
              <Typography
                key={idx}
                variant="subtitle2"
                sx={{
                  color: colors.text.secondary,
                  fontWeight: 600,
                  letterSpacing: 1,
                  fontSize: { xs: '0.75rem', md: '0.875rem' },
                }}
              >
                {company}
              </Typography>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Stats;
