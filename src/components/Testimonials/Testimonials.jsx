import { useState, useEffect, useRef } from 'react';
import { Box, Container, Grid, Typography, Avatar, Rating } from '@mui/material';
import FormatQuoteImport from '@mui/icons-material/FormatQuote';
import StarImport from '@mui/icons-material/Star';
import { motion } from 'framer-motion';
import { colors } from '../../theme/theme';
import { BlurText, SectionBadge } from '../common';

const FormatQuote = FormatQuoteImport.default || FormatQuoteImport;
const Star = StarImport.default || StarImport;

/* ── animation variants ────────────────────────────────────── */

const fadeUpVariants = {
  hidden: { opacity: 0.35, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: 'easeOut' },
  },
};

const descriptionVariants = {
  hidden: { opacity: 0.35 },
  visible: {
    opacity: 1,
    transition: { duration: 0.65, ease: 'easeOut' },
  },
};

const statsContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

const statVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.65, ease: 'easeOut' },
  },
};

const cardsContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.14, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: 'easeOut' },
  },
};

/* ── data ───────────────────────────────────────────────────── */

const stats = [
  { value: 50, suffix: '+', label: 'Projects Delivered' },
  { value: 98, suffix: '%', label: 'Client Satisfaction' },
  { value: 3, suffix: '+', label: 'Years Experience' },
  { value: 24, suffix: 'hr', label: 'Response Time' },
];

const testimonials = [
  {
    name: 'Rahul Menon',
    role: 'Founder, TechStart Kerala',
    avatar: null,
    rating: 5,
    quote:
      'Aslisite transformed our online presence completely. The website they built is fast, modern, and brings in real leads every week. Their SEO work doubled our organic traffic within three months.',
  },
  {
    name: 'Fathima Zahra',
    role: 'Owner, Zahra Boutique',
    avatar: null,
    rating: 5,
    quote:
      'Our ecommerce store went from an idea to fully operational in just a few weeks. The team understood our brand perfectly and delivered a shopping experience our customers love.',
  },
  {
    name: 'Anoop Kumar',
    role: 'Director, GreenLeaf Exports',
    avatar: null,
    rating: 5,
    quote:
      'Professional, responsive, and truly skilled. The custom software they built for our inventory management saved us hours of manual work daily. Highly recommended for any business.',
  },
];

/* ── animated counter hook ──────────────────────────────────── */

function useCountUp(end, duration = 2000, startOnView = false) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!startOnView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    const current = ref.current;
    if (current) observer.observe(current);

    return () => {
      observer.disconnect();
    };
  }, [startOnView]);

  useEffect(() => {
    if (!hasStarted && startOnView) return;

    let startTime = null;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, hasStarted, startOnView]);

  return { count, ref };
}

/* ── component ──────────────────────────────────────────────── */

const Testimonials = () => {
  return (
    <Box
      component="section"
      id="testimonials"
      tabIndex="-1"
      sx={{
        py: { xs: 6, md: 8 },
        backgroundColor: colors.background.secondary,
        position: 'relative',
        scrollMarginTop: '80px',
        borderBottom: `1px solid ${colors.border.light}`,
        overflow: 'hidden',
      }}
    >
      {/* Decorative gradient glow */}
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 'clamp(400px, 55vw, 900px)',
          height: 'clamp(400px, 55vw, 900px)',
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(168, 85, 247, 0.07) 0%, rgba(168, 85, 247, 0.02) 40%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* ── section header ── */}
        <Box
          component={motion.div}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          sx={{ textAlign: 'center', mb: { xs: 5, md: 8 } }}
        >
          <Box component={motion.div} variants={fadeUpVariants}>
            <SectionBadge>Trusted By Businesses</SectionBadge>
          </Box>
          <Box sx={{ overflow: 'hidden', mb: 2, pb: '0.04em' }}>
            <BlurText
              component="h2"
              text="Results That Speak for Themselves"
              animateBy="words"
              direction="top"
              delay={90}
              stepDuration={0.3}
              highlightWords={['Results']}
              sx={{
                fontSize: { xs: '2.1rem', sm: '2.6rem', md: '3.25rem' },
                fontWeight: 800,
                lineHeight: 1.08,
                color: colors.text.primary,
                textAlign: 'center',
                maxWidth: '760px',
                mx: 'auto',
              }}
            />
          </Box>
          <Typography
            component={motion.p}
            variants={descriptionVariants}
            variant="body1"
            sx={{
              color: colors.text.secondary,
              fontWeight: 450,
              maxWidth: '560px',
              mx: 'auto',
              fontSize: { xs: '1rem', md: '1.08rem' },
              lineHeight: 1.75,
            }}
          >
            Real outcomes from real partnerships. Here&apos;s what businesses say about working with
            Aslisite.
          </Typography>
        </Box>

        {/* ── stats counters ── */}
        <Grid
          component={motion.div}
          container
          spacing={{ xs: 2, md: 4 }}
          variants={statsContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.35 }}
          sx={{ mb: { xs: 6, md: 10 } }}
        >
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <StatCard stat={stat} index={index} />
            </Grid>
          ))}
        </Grid>

        {/* ── testimonial cards ── */}
        <Grid
          component={motion.div}
          container
          spacing={{ xs: 3, md: 4 }}
          variants={cardsContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
        >
          {testimonials.map((item, index) => (
            <Grid item xs={12} md={4} key={index}>
              <TestimonialCard item={item} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

/* ── stat card ──────────────────────────────────────────────── */

const StatCard = ({ stat, index }) => {
  const { count, ref } = useCountUp(stat.value, 1800, true);

  return (
    <Box
      component={motion.div}
      variants={statVariants}
      ref={ref}
      sx={{
        textAlign: 'center',
        p: { xs: 2.5, md: 3.5 },
        borderRadius: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.025)',
        border: `1px solid ${colors.border.light}`,
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          borderColor: colors.border.accent,
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.25)',
        },
      }}
    >
      {/* Large faded index number */}
      <Typography
        aria-hidden="true"
        sx={{
          position: 'absolute',
          top: 8,
          right: 12,
          fontSize: '3rem',
          fontWeight: 800,
          color: 'rgba(245,241,232,0.03)',
          lineHeight: 1,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        {String(index + 1).padStart(2, '0')}
      </Typography>

      <Typography
        sx={{
          fontSize: { xs: '2.2rem', md: '2.8rem' },
          fontWeight: 800,
          background: colors.accent.gradient,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: 1.1,
          mb: 0.5,
        }}
      >
        {count}
        {stat.suffix}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: colors.text.secondary,
          fontWeight: 500,
          fontSize: '0.9rem',
          letterSpacing: '0.02em',
        }}
      >
        {stat.label}
      </Typography>
    </Box>
  );
};

/* ── testimonial card ──────────────────────────────────────── */

const TestimonialCard = ({ item }) => {
  const initials = item.name
    .split(' ')
    .map((n) => n[0])
    .join('');

  return (
    <Box
      component={motion.div}
      variants={cardVariants}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      sx={{
        height: '100%',
        p: { xs: 3, md: 3.5 },
        borderRadius: 3,
        backgroundColor: colors.background.elevated,
        border: `1px solid ${colors.border.light}`,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          borderColor: colors.border.accent,
          boxShadow: '0 18px 40px rgba(0, 0, 0, 0.3)',
          '& .quote-icon': {
            color: colors.accent.primary,
            opacity: 0.25,
          },
        },
      }}
    >
      {/* Quote icon watermark */}
      <FormatQuote
        className="quote-icon"
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          fontSize: 48,
          color: colors.text.muted,
          opacity: 0.1,
          transform: 'scaleX(-1)',
          transition: 'color 0.3s ease, opacity 0.3s ease',
          pointerEvents: 'none',
        }}
      />

      {/* Rating */}
      <Rating
        value={item.rating}
        readOnly
        size="small"
        icon={<Star sx={{ fontSize: 18, color: '#d4a843' }} />}
        emptyIcon={<Star sx={{ fontSize: 18, opacity: 0.2 }} />}
        sx={{ mb: 2 }}
      />

      {/* Quote */}
      <Typography
        variant="body1"
        sx={{
          color: colors.text.secondary,
          lineHeight: 1.85,
          fontSize: '0.96rem',
          fontStyle: 'italic',
          mb: 3,
          flexGrow: 1,
        }}
      >
        &ldquo;{item.quote}&rdquo;
      </Typography>

      {/* Author */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 'auto' }}>
        <Avatar
          src={item.avatar}
          alt={item.name}
          sx={{
            width: 44,
            height: 44,
            background: colors.accent.gradient,
            fontSize: '0.85rem',
            fontWeight: 700,
            color: '#ffffff',
          }}
        >
          {initials}
        </Avatar>
        <Box>
          <Typography
            variant="body2"
            sx={{
              color: colors.text.primary,
              fontWeight: 650,
              fontSize: '0.92rem',
              lineHeight: 1.3,
            }}
          >
            {item.name}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: colors.text.muted,
              fontSize: '0.78rem',
            }}
          >
            {item.role}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Testimonials;
