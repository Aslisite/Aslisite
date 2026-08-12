import { Box, Container, Stack, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { colors } from '../../theme/theme';

const stats = [
  { value: '50+', label: 'Projects Delivered' },
  { value: '98%', label: 'Client Satisfaction' },
  { value: '3+', label: 'Years Experience' },
  { value: '24hr', label: 'Response Time' },
];

const TrustStrip = () => {
  return (
    <Box
      component="section"
      aria-label="Company statistics"
      sx={{
        py: { xs: 4, md: 5 },
        backgroundColor: colors.background.secondary,
        borderTop: `1px solid ${colors.border.light}`,
        borderBottom: `1px solid ${colors.border.light}`,
      }}
    >
      <Container maxWidth="lg">
        <Stack
          component={motion.div}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          direction={{ xs: 'row', sm: 'row' }}
          spacing={{ xs: 0, sm: 0 }}
          justifyContent="space-between"
          alignItems="center"
          sx={{ flexWrap: { xs: 'wrap', sm: 'nowrap' } }}
          divider={
            <Box
              sx={{
                width: '1px',
                height: '40px',
                backgroundColor: colors.border.medium,
                display: { xs: 'none', sm: 'block' },
              }}
            />
          }
        >
          {stats.map((stat) => (
            <Box key={stat.label} sx={{ textAlign: 'center', flex: { xs: '0 0 50%', sm: 1 }, py: { xs: 1.5, sm: 0 } }}>
              <Typography
                sx={{
                  fontSize: { xs: '1.8rem', md: '2.2rem' },
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  color: colors.text.primary,
                  lineHeight: 1.1,
                  fontFamily: '"Space Grotesk", sans-serif',
                }}
              >
                {stat.value}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: colors.text.muted,
                  fontWeight: 500,
                  fontSize: '0.8rem',
                  mt: 0.5,
                  display: 'block',
                }}
              >
                {stat.label}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Container>
    </Box>
  );
};

export default TrustStrip;
