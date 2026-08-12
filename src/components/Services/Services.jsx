import { Box, Container, Grid, Typography, Stack, Chip } from '@mui/material';
import CodeImport from '@mui/icons-material/Code';
import ShoppingCartImport from '@mui/icons-material/ShoppingCart';
import BuildImport from '@mui/icons-material/Build';
import TrendingUpImport from '@mui/icons-material/TrendingUp';
import ArrowForwardImport from '@mui/icons-material/ArrowForward';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { colors } from '../../theme/theme';
import { SectionBadge } from '../common';

const Code = CodeImport.default || CodeImport;
const ShoppingCart = ShoppingCartImport.default || ShoppingCartImport;
const Build = BuildImport.default || BuildImport;
const TrendingUp = TrendingUpImport.default || TrendingUpImport;
const ArrowForward = ArrowForwardImport.default || ArrowForwardImport;

const services = [
  {
    icon: Code,
    title: 'Web Development',
    description:
      'Tailor-made web systems built using modern frameworks. From responsive websites to high-performance web apps — we write clean, search-engine-optimized code that loads instantly and scales endlessly.',
    features: ['React & Next.js', 'Node & Express', 'MongoDB', 'REST APIs'],
    slug: 'web-development',
  },
  {
    icon: ShoppingCart,
    title: 'Ecommerce Solutions',
    description:
      'Scalable online stores with secure checkout portals, product catalog syncs, and seamless buying experiences. We build platforms engineered to increase average order value and reduce cart abandonment.',
    features: ['WooCommerce & Custom', 'Payment Integration', 'Inventory Sync', 'Mobile-First'],
    slug: 'ecommerce-solutions',
  },
  {
    icon: Build,
    title: 'Custom Software',
    description:
      'Bespoke digital platforms engineered to automate manual business processes and improve operational efficiency. We replace bottlenecks with robust, secure software built around your exact requirements.',
    features: ['MERN Stack Apps', 'JWT Auth & APIs', 'Cloud Migration', 'Database Design'],
    slug: 'custom-software',
  },
  {
    icon: TrendingUp,
    title: 'SEO Services',
    description:
      'Data-driven SEO roadmaps built to increase organic search positions, capture high-intent traffic, and raise conversions. Technical audits, keyword intelligence, and authority building included.',
    features: ['On-Page SEO', 'Technical Audits', 'Content Strategy', 'Link Building'],
    slug: 'seo-services',
  },
];

const Services = () => {
  return (
    <Box
      component="section"
      id="services"
      tabIndex="-1"
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: colors.background.primary,
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
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          sx={{ textAlign: 'center', mb: { xs: 6, md: 8 }, maxWidth: 640, mx: 'auto' }}
        >
          <SectionBadge
            sx={{
              mb: 2.5,
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
              color: colors.text.secondary,
              borderColor: colors.border.medium,
            }}
          >
            Our Services
          </SectionBadge>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '2.2rem', md: '3rem' },
              lineHeight: 1.08,
              mb: 2.5,
              color: colors.text.primary,
            }}
          >
            Everything you need to{' '}
            <Box component="span" sx={{ color: colors.accent.primary }}>
              win online.
            </Box>
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: colors.text.secondary,
              lineHeight: 1.75,
              fontSize: '1.05rem',
            }}
          >
            Four core capabilities, one team. From first pixel to first customer — we handle it all.
          </Typography>
        </Box>

        {/* Service cards — 2x2 grid */}
        <Grid container spacing={3}>
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Grid item xs={12} sm={6} key={service.slug}>
                <Box
                  component={motion.div}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.06 }}
                  sx={{ height: '100%' }}
                >
                  <Box
                    component={Link}
                    to={`/services/${service.slug}`}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      p: { xs: 3, md: 3.5 },
                      borderRadius: 3,
                      textDecoration: 'none',
                      border: `1px solid ${colors.border.light}`,
                      backgroundColor: colors.background.primary,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: colors.border.accent,
                        boxShadow: colors.shadow.elevated,
                        transform: 'translateY(-3px)',
                        '& .service-arrow': {
                          transform: 'translateX(4px)',
                          color: colors.accent.primary,
                        },
                        '& .service-icon-box': {
                          backgroundColor: 'rgba(109, 40, 217, 0.1)',
                        },
                      },
                    }}
                  >
                    {/* Icon + Title row */}
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                      <Box
                        className="service-icon-box"
                        sx={{
                          width: 46,
                          height: 46,
                          borderRadius: 2.5,
                          backgroundColor: colors.background.secondary,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          transition: 'background-color 0.2s ease',
                        }}
                      >
                        <IconComponent sx={{ fontSize: 22, color: colors.accent.primary }} />
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: colors.text.primary,
                          fontSize: '1.1rem',
                          flex: 1,
                        }}
                      >
                        {service.title}
                      </Typography>
                      <ArrowForward
                        className="service-arrow"
                        sx={{
                          fontSize: 18,
                          color: colors.text.muted,
                          transition: 'all 0.2s ease',
                          flexShrink: 0,
                          display: { xs: 'none', sm: 'block' },
                        }}
                      />
                    </Stack>

                    {/* Description */}
                    <Typography
                      variant="body2"
                      sx={{
                        color: colors.text.secondary,
                        lineHeight: 1.75,
                        fontSize: '0.92rem',
                        mb: 2.5,
                        flex: 1,
                      }}
                    >
                      {service.description}
                    </Typography>

                    {/* Tech tags */}
                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
                      {service.features.map((feature) => (
                        <Chip
                          key={feature}
                          label={feature}
                          size="small"
                          sx={{
                            height: 26,
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            letterSpacing: '0.02em',
                            backgroundColor: colors.background.secondary,
                            color: colors.text.secondary,
                            border: `1px solid ${colors.border.light}`,
                          }}
                        />
                      ))}
                    </Stack>
                  </Box>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
};

export default Services;
