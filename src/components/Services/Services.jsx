import { Box, Card, CardContent, Container, Grid, Typography } from '@mui/material';
import CodeImport from '@mui/icons-material/Code';
import ShoppingCartImport from '@mui/icons-material/ShoppingCart';
import BuildImport from '@mui/icons-material/Build';
import TrendingUpImport from '@mui/icons-material/TrendingUp';
import { motion } from 'framer-motion';
import { colors } from '../../theme/theme';
import { BlurText, SectionBadge } from '../common';

const Code = CodeImport.default || CodeImport;
const ShoppingCart = ShoppingCartImport.default || ShoppingCartImport;
const Build = BuildImport.default || BuildImport;
const TrendingUp = TrendingUpImport.default || TrendingUpImport;

const fadeUpVariants = {
  hidden: { opacity: 0.35, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: 'easeOut',
    },
  },
};

const cardsContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0.35, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: 'easeOut',
    },
  },
};

const services = [
  {
    icon: Code,
    title: 'Web Development',
    description:
      'Custom web applications built with cutting-edge technologies. From responsive websites to complex enterprise solutions.',
    features: ['React & Next.js', 'Node.js & Python', 'API Development', 'E-commerce'],
  },
  {
    icon: ShoppingCart,
    title: 'Ecommerce Solutions',
    description:
      'Scalable online stores with secure payment gateways, inventory management, and seamless user experience.',
    features: [
      'Shopify & WooCommerce',
      'Payment Integration',
      'Inventory Management',
      'Mobile Responsive',
    ],
  },
  {
    icon: Build,
    title: 'Custom Software',
    description:
      'Tailor-made software solutions designed to address your unique business challenges and streamline operations.',
    features: ['Enterprise Apps', 'Database Solutions', 'API Integration', 'Cloud Migration'],
  },
  {
    icon: TrendingUp,
    title: 'SEO Services',
    description:
      'Data-driven SEO strategies to boost your search rankings, drive organic traffic, and maximize conversions.',
    features: ['On-Page SEO', 'Link Building', 'Content Strategy', 'Analytics & Reporting'],
  },
];

const Services = () => {
  return (
    <Box
      component="section"
      id="services"
      tabIndex="-1"
      sx={{
        py: { xs: 6, md: 8 },
        backgroundColor: colors.background.secondary,
        position: 'relative',
        scrollMarginTop: '80px',
        borderBottom: `1px solid ${colors.border.light}`,
      }}
    >
      {/* Background Accent */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: `linear-gradient(90deg, transparent, ${colors.accent.primary}, transparent)`,
          opacity: 0.3,
        }}
      />

      <Container maxWidth="lg">
        {/* Section Header */}
        <Box
          component={motion.div}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.35 }}
          sx={{ textAlign: 'center', mb: { xs: 6, md: 10 } }}
        >
          <Box component={motion.div} variants={fadeUpVariants}>
            <SectionBadge>Our Services</SectionBadge>
          </Box>
          <BlurText
            component="h2"
            text="Solutions That Transform"
            animateBy="words"
            direction="top"
            delay={110}
            stepDuration={0.32}
            sx={{
              fontSize: { xs: '2.15rem', sm: '2.75rem', md: '3.35rem' },
              fontWeight: 800,
              lineHeight: 1.05,
              mb: 2,
              color: colors.text.primary,
              textAlign: 'center',
              maxWidth: '760px',
              mx: 'auto',
            }}
          />
          <Typography
            component={motion.p}
            variants={fadeUpVariants}
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
            Comprehensive digital services tailored to accelerate your business growth
          </Typography>
        </Box>

        {/* Services Grid */}
        <Grid
          component={motion.div}
          container
          spacing={{ xs: 3, md: 4 }}
          variants={cardsContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
        >
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Grid item xs={12} sm={6} lg={3} key={index}>
                <Card
                  component={motion.div}
                  variants={cardVariants}
                  sx={{
                    height: '100%',
                    backgroundColor: colors.background.card,
                    border: `1px solid ${colors.border.light}`,
                    borderRadius: 3,
                    transition:
                      'transform 0.28s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.28s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      borderColor: colors.border.accent,
                      boxShadow: '0 18px 36px rgba(0, 0, 0, 0.34)',
                      '& .service-icon': {
                        transform: 'scale(1.06)',
                        color: colors.accent.primary,
                      },
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      p: { xs: 3, md: 4 },
                      display: 'flex',
                      flexDirection: 'column',
                      flexGrow: 1,
                    }}
                  >
                    {/* Icon */}
                    <Box
                      className="service-icon"
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        backgroundColor: 'rgba(139, 163, 106, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3,
                        transition: 'all 0.3s ease',
                        color: colors.accent.primary,
                      }}
                    >
                      <IconComponent sx={{ fontSize: 28 }} />
                    </Box>

                    {/* Title */}
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        mb: 2,
                        color: colors.text.primary,
                        fontSize: { xs: '1.1rem', md: '1.22rem' },
                        lineHeight: 1.25,
                      }}
                    >
                      {service.title}
                    </Typography>

                    {/* Description */}
                    <Typography
                      variant="body2"
                      sx={{
                        color: colors.text.secondary,
                        mb: 3,
                        lineHeight: 1.8,
                        fontSize: '0.95rem',
                        flexGrow: 1,
                      }}
                    >
                      {service.description}
                    </Typography>

                    {/* Features */}
                    <Box
                      sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 1,
                        mt: 'auto',
                      }}
                    >
                      {service.features.map((feature, idx) => (
                        <Box
                          key={idx}
                          sx={{
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 1,
                            backgroundColor: colors.background.elevated,
                            border: `1px solid ${colors.border.light}`,
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              color: colors.text.muted,
                              fontSize: '0.72rem',
                              letterSpacing: '0.04em',
                              textTransform: 'uppercase',
                            }}
                          >
                            {feature}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
};

export default Services;
