import { useState, useEffect, useRef } from 'react';
import { Box, Container, Stack, Typography } from '@mui/material';
import { motion, useInView } from 'framer-motion';
import { colors } from '../../theme/theme';

const stats = [
  { value: 50, suffix: '+', label: 'Projects Delivered' },
  { value: 98, suffix: '%', label: 'Client Satisfaction' },
  { value: 3, suffix: '+', label: 'Years Experience' },
  { value: 24, suffix: 'hr', label: 'Response Time' },
];

/* ─── Animated Counter ─── */
const AnimatedCounter = ({ target, suffix, duration = 1.8 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const startTime = performance.now();

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);

      // Ease out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);

      if (current !== start) {
        start = current;
        setCount(current);
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    requestAnimationFrame(step);
  }, [isInView, target, duration]);

  return (
    <Typography
      ref={ref}
      sx={{
        fontSize: { xs: '1.8rem', md: '2.2rem' },
        fontWeight: 800,
        letterSpacing: '-0.03em',
        color: colors.text.primary,
        lineHeight: 1.1,
        fontFamily: '"Space Grotesk", sans-serif',
      }}
    >
      {count}
      {suffix}
    </Typography>
  );
};

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
              <AnimatedCounter target={stat.value} suffix={stat.suffix} />
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
