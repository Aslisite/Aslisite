import { Box, Container, Grid, Typography, Avatar, Rating, Stack } from '@mui/material';
import FormatQuoteImport from '@mui/icons-material/FormatQuote';
import StarImport from '@mui/icons-material/Star';
import { motion } from 'framer-motion';
import { colors } from '../../theme/theme';
import { SectionBadge } from '../common';

const FormatQuote = FormatQuoteImport.default || FormatQuoteImport;
const Star = StarImport.default || StarImport;

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

const TestimonialCard = ({ item }) => {
  const initials = item.name
    .split(' ')
    .map((n) => n[0])
    .join('');

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      sx={{
        height: '100%',
        p: { xs: 3.5, md: 4 },
        borderRadius: 3,
        backgroundColor: colors.background.primary,
        border: `1px solid ${colors.border.light}`,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease',
        '&:hover': {
          borderColor: colors.border.medium,
          boxShadow: colors.shadow.elevated,
          transform: 'translateY(-2px)',
        },
      }}
    >
      {/* Quote icon */}
      <FormatQuote
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          fontSize: 40,
          color: colors.border.light,
          transform: 'scaleX(-1)',
          pointerEvents: 'none',
        }}
      />

      {/* Rating */}
      <Rating
        value={item.rating}
        readOnly
        size="small"
        icon={<Star sx={{ fontSize: 16, color: '#d97706' }} />}
        emptyIcon={<Star sx={{ fontSize: 16, opacity: 0.2 }} />}
        sx={{ mb: 2.5 }}
      />

      {/* Quote */}
      <Typography
        variant="body2"
        sx={{
          color: colors.text.secondary,
          lineHeight: 1.8,
          fontSize: '0.95rem',
          mb: 3.5,
          flexGrow: 1,
        }}
      >
        &ldquo;{item.quote}&rdquo;
      </Typography>

      {/* Author */}
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 'auto' }}>
        <Avatar
          src={item.avatar}
          alt={item.name}
          sx={{
            width: 40,
            height: 40,
            background: colors.accent.gradient,
            fontSize: '0.8rem',
            fontWeight: 700,
            color: '#ffffff',
          }}
        >
          {initials}
        </Avatar>
        <Box>
          <Typography
            variant="body2"
            sx={{ color: colors.text.primary, fontWeight: 650, fontSize: '0.9rem', lineHeight: 1.3 }}
          >
            {item.name}
          </Typography>
          <Typography variant="caption" sx={{ color: colors.text.muted, fontSize: '0.78rem' }}>
            {item.role}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};

const Testimonials = () => {
  return (
    <Box
      component="section"
      id="testimonials"
      tabIndex="-1"
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: colors.background.secondary,
        position: 'relative',
        scrollMarginTop: '80px',
      }}
    >
      <Container maxWidth="lg">
        {/* Section header */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          sx={{ mb: { xs: 6, md: 8 }, maxWidth: 500 }}
        >
          <Box
            sx={{
              width: 40,
              height: 3,
              borderRadius: 2,
              background: colors.accent.gradient,
              mb: 2.5,
            }}
          />
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              lineHeight: 1.1,
              color: colors.text.primary,
              mb: 2,
            }}
          >
            Don&apos;t take our word for it.
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: colors.text.secondary,
              fontSize: '1.05rem',
              lineHeight: 1.7,
            }}
          >
            Hear from the businesses we&apos;ve helped grow.
          </Typography>
        </Box>

        {/* Testimonial cards */}
        <Grid container spacing={3}>
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

export default Testimonials;
