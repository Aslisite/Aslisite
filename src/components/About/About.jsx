import { Box, Container, Typography } from '@mui/material';
import { colors } from '../../theme/theme';

const About = () => {
  return (
    <Box
      id="about"
      component="section"
      sx={{
        py: { xs: 10, md: 12 },
        backgroundColor: colors.background.primary,
        position: 'relative',
      }}
    >
      <Container maxWidth="md">
        {/* Section Header */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant="overline"
            sx={{
              color: colors.accent.primary,
              fontWeight: 600,
              letterSpacing: 2,
              fontSize: '0.75rem',
              display: 'block',
              mb: 1.5,
            }}
          >
            About Us
          </Typography>
          <Typography
            variant="h3"
            sx={{
              color: colors.text.primary,
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: '1.5rem', md: '2rem' },
            }}
          >
            Crafting Digital Excellence Since 2018
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: colors.text.secondary,
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.7,
              fontSize: '0.95rem',
            }}
          >
            We're a team of passionate designers and developers dedicated to building 
            digital products that drive business growth and transform ideas into reality.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default About;
