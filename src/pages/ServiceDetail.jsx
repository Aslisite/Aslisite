import { Box, Button, Container, Grid, Typography, Chip, Stack } from '@mui/material';
import ArrowBackImport from '@mui/icons-material/ArrowBack';
import ArrowForwardImport from '@mui/icons-material/ArrowForward';
import { motion } from 'framer-motion';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { colors } from '../theme/theme';
import { SectionBadge } from '../components/common';
import { absoluteUrl } from '../seo/siteMetadata';
import NotFound from './NotFound';

const ArrowBack = ArrowBackImport.default || ArrowBackImport;
const ArrowForward = ArrowForwardImport.default || ArrowForwardImport;

const fadeUpVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: 'easeOut',
      delay,
    },
  }),
};

const serviceData = {
  'web-development': {
    title: 'Web Development',
    badge: 'Performance & Scale',
    subtitle: 'High-performance, custom-coded web applications tailored to grow your business.',
    description:
      'We design and build bespoke web experiences focusing on extreme speed, robust security, and seamless user journeys. By avoiding bloated site builders, we write clean, search-engine-optimized code that loads instantly and scales endlessly.',
    metaDescription:
      'Aslisite builds bespoke, high-performance web applications using modern frameworks like React & Next.js. Fast, secure, and SEO-optimized.',
    benefits: [
      {
        title: 'Blazing Fast Speed',
        desc: 'Optimized build processes, minified assets, and smart routing for near-zero load times.',
      },
      {
        title: 'Responsive Design',
        desc: 'Fluid layouts that look and perform flawlessly across mobile, tablet, and desktop screens.',
      },
      {
        title: 'Modern Tech Stack',
        desc: 'No templates. Built using robust modern languages and tools for longevity.',
      },
    ],
    features: [
      {
        title: 'Custom SPAs & SSR Apps',
        desc: 'Leveraging React and Next.js to build apps that are both user-friendly and highly visible to search engines.',
      },
      {
        title: 'API & Backend Architecture',
        desc: 'Secure, RESTful or GraphQL APIs connecting your frontend to databases or third-party CRM/ERP systems.',
      },
      {
        title: 'Headless CMS Integration',
        desc: 'Manage your content easily with platforms like Strapi, Sanity, or Contentful while keeping the frontend fast.',
      },
      {
        title: 'Performance Audits',
        desc: "Fine-tuning existing websites to pass Google's Core Web Vitals with flying colors.",
      },
    ],
    techStack: [
      'React',
      'Next.js',
      'Node.js',
      'Express',
      'Python',
      'PostgreSQL',
      'MUI',
      'Tailwind CSS',
      'REST APIs',
      'Vercel',
    ],
    process: [
      {
        title: 'Discovery & Audit',
        desc: 'We deep dive into your business workflows, competitors, and technical constraints to establish a clear architectural roadmap.',
      },
      {
        title: 'UI/UX Prototyping',
        desc: 'Creating clean, intuitive high-fidelity wireframes that align layout structure with conversion paths.',
      },
      {
        title: 'Production Engineering',
        desc: 'Writing clean, typed, modular code with version control, building out responsive layouts and fast backend services.',
      },
      {
        title: 'QA & Optimization',
        desc: 'Rigorous cross-browser testing, load auditing, and accessibility optimization prior to deployment.',
      },
      {
        title: 'Launch & Continuous Support',
        desc: 'Going live using zero-downtime platforms with proactive updates, backups, and site maintenance.',
      },
    ],
    ctaText: 'Ready to build something fast?',
  },
  'ecommerce-solutions': {
    title: 'Ecommerce Solutions',
    badge: 'Conversion & Growth',
    subtitle: 'Scalable online stores designed to turn casual browsers into loyal customers.',
    description:
      'We build beautiful, highly secure ecommerce platforms engineered to increase average order value and reduce cart abandonment. From custom headless shopping carts to robust Shopify implementations, we align tech with sales.',
    metaDescription:
      'Custom, secure ecommerce development by Aslisite. From Shopify customization to headless storefronts, we build stores designed for high sales.',
    benefits: [
      {
        title: 'Conversion First',
        desc: 'Optimized checkouts, intuitive navigation, and clean product layouts that encourage buying.',
      },
      {
        title: 'Ultra Secure Checkout',
        desc: 'Bulletproof payment integrations and user data encryption for absolute peace of mind.',
      },
      {
        title: 'Dynamic Inventory',
        desc: 'Automated stock tracking, order notifications, and simple management dashboards.',
      },
    ],
    features: [
      {
        title: 'Custom Shopify Setup',
        desc: 'Tailored Shopify themes and custom liquid developments that bypass standard template limitations.',
      },
      {
        title: 'Headless Commerce',
        desc: 'Blazingly fast frontend storefronts connected to robust backend commerce engines via APIs.',
      },
      {
        title: 'Secure Payment Gateways',
        desc: 'Integration with Stripe, PayPal, Razorpay, Apple Pay, and other regional payment providers.',
      },
      {
        title: 'ERP & Stock Syncing',
        desc: 'Connecting your store directly to shipping handlers, warehouse software, and marketing lists.',
      },
    ],
    techStack: [
      'Shopify Liquid',
      'WooCommerce',
      'Next.js Commerce',
      'GraphQL',
      'Stripe',
      'Razorpay',
      'Node.js',
      'PostgreSQL',
    ],
    process: [
      {
        title: 'Audience & Sales Mapping',
        desc: 'Mapping user journeys from product discovery to single-page checkout to identify bottlenecks.',
      },
      {
        title: 'UX & Interface Design',
        desc: 'Designing modern product catalogs, search overlays, and checkout forms for maximum ease.',
      },
      {
        title: 'Safe System Building',
        desc: 'Developing the commerce workspace, setting up database tables, and coding secure transactional routes.',
      },
      {
        title: 'Gateway Integration',
        desc: 'Hooking up local payment handlers, tax calculators, shipping APIs, and automated order emails.',
      },
      {
        title: 'Beta Trial & Handover',
        desc: 'Simulating high-load shopping rounds, launching the store, and providing comprehensive training to your team.',
      },
    ],
    ctaText: 'Ready to launch your storefront?',
  },
  'custom-software': {
    title: 'Custom Software',
    badge: 'Automation & Operations',
    subtitle: 'Bespoke applications built to automate workflows and scale operational capacity.',
    description:
      'We construct tailormade SaaS platforms, internal management portals, and workflow automation utilities that streamline operations. We replace manual bottlenecks with robust, secure software built around your exact requirements.',
    metaDescription:
      'Streamline operations with custom software built by Aslisite. Tailormade database designs, internal portals, and secure cloud migration.',
    benefits: [
      {
        title: 'Bespoke Workflows',
        desc: 'Designed exactly around the way your company actually works, without unnecessary features.',
      },
      {
        title: 'Enterprise Security',
        desc: 'Role-based access control, secure DB instances, and automatic vulnerability checks.',
      },
      {
        title: 'Cloud Integration',
        desc: 'Migrated and deployed on leading cloud infrastructures for 99.9% uptime.',
      },
    ],
    features: [
      {
        title: 'Internal Business Portals',
        desc: 'Secure employee and client portals that aggregate tasks, reports, and communication in one hub.',
      },
      {
        title: 'Workflow Automation',
        desc: 'Custom scripts and schedulers that handle document processing, notifications, and data updates automatically.',
      },
      {
        title: 'Database Design & Optimization',
        desc: 'Structuring relational or NoSQL systems designed to run lightning-fast queries even under high loads.',
      },
      {
        title: 'API Integration & Migration',
        desc: 'Bridging legacy databases and modern cloud software without data loss or downtime.',
      },
    ],
    techStack: [
      'Python',
      'Node.js',
      'Go',
      'AWS',
      'Google Cloud',
      'Docker',
      'PostgreSQL',
      'MongoDB',
      'REST APIs',
      'JWT Auth',
    ],
    process: [
      {
        title: 'Exhaustive Consultation',
        desc: 'Sitting down with your team to detail manual bottlenecks, data schemas, and role permissions.',
      },
      {
        title: 'Architecture Blueprinting',
        desc: 'Drafting entity-relationship diagrams, API specifications, and choosing optimal hosting services.',
      },
      {
        title: 'Iterative Development',
        desc: 'Writing clean code in modern environments, deploying staged previews for direct client feedback.',
      },
      {
        title: 'Security Auditing',
        desc: 'Performing penetration testing, role verification checks, and implementing automated backup cron jobs.',
      },
      {
        title: 'System Deployment',
        desc: 'Deploying using containerized pipelines, moving live operations, and ensuring zero data loss.',
      },
    ],
    ctaText: 'Ready to automate your operations?',
  },
  'seo-services': {
    title: 'SEO Services',
    badge: 'Rankings & Visibility',
    subtitle: 'Data-driven search engine optimization to capture high-intent organic traffic.',
    description:
      "We don't use gimmicks or empty promises. We perform deep technical audits, semantic keyword mapping, and white-hat authority building to place your business in front of users actively searching for your services.",
    metaDescription:
      'Data-driven SEO services by Aslisite. Rank higher on search engines, boost organic traffic, and optimize conversion funnels.',
    benefits: [
      {
        title: 'High Intent Traffic',
        desc: 'Targets search queries that indicate a user is ready to purchase or book your service.',
      },
      {
        title: 'Long-term Growth',
        desc: 'Organic results continue to pay dividends long after paid ad budgets run dry.',
      },
      {
        title: 'Technical Optimization',
        desc: 'Fixing site structure and speed, which directly impacts search crawl behavior.',
      },
    ],
    features: [
      {
        title: 'Technical SEO Audits',
        desc: 'Finding and resolving crawl blockages, broken links, slow pages, and structured data errors.',
      },
      {
        title: 'Keyword Intelligence',
        desc: 'In-depth mapping of search volume, difficulty, and intent to isolate high-value opportunities.',
      },
      {
        title: 'On-Page Optimization',
        desc: 'Refining meta data, headings, alt tags, and internal link structures for better semantic relevance.',
      },
      {
        title: 'E-E-A-T Content Strategy',
        desc: 'Directing and publishing high-quality, authoritatively researched articles that Google rewards.',
      },
    ],
    techStack: [
      'Google Search Console',
      'Google Analytics 4',
      'Semrush',
      'Ahrefs',
      'Screaming Frog',
      'Schema.org JSON-LD',
    ],
    process: [
      {
        title: 'Site Crawl & Audit',
        desc: 'Running diagnostic software to catalog indexing errors, slow core web vitals, and redirect loops.',
      },
      {
        title: 'Search Intent Analysis',
        desc: 'Researching target keywords, query categorization, and competitor ranking profiles.',
      },
      {
        title: 'On-Page Remapping',
        desc: 'Updating page hierarchies, writing rich schema markup, and optimizing tags across the site.',
      },
      {
        title: 'Content & Authority Building',
        desc: 'Publishing in-depth guides and obtaining relevant domain mentions to build authority.',
      },
      {
        title: 'Performance Reporting',
        desc: 'Providing GA4 and Search Console reports measuring click growth, impressions, and ranking shifts.',
      },
    ],
    ctaText: 'Ready to rank higher on Google?',
  },
};

const ServiceDetail = () => {
  const { slug } = useParams();
  const service = serviceData[slug];

  if (!service) {
    return <NotFound />;
  }

  return (
    <>
      <Helmet>
        <title>{`${service.title} | Aslisite`}</title>
        <meta name="description" content={service.metaDescription} />
        <link rel="canonical" href={absoluteUrl(`/services/${slug}`)} />
        <meta property="og:url" content={absoluteUrl(`/services/${slug}`)} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={`${service.title} | Aslisite`} />
        <meta property="og:description" content={service.metaDescription} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${service.title} | Aslisite`} />
        <meta name="twitter:description" content={service.metaDescription} />
      </Helmet>

      <Box
        sx={{
          backgroundColor: '#08090b',
          position: 'relative',
          overflow: 'hidden',
          pt: { xs: 12, md: 15 },
          pb: { xs: 8, md: 12 },
        }}
      >
        {/* Glow backdrop */}
        <Box
          aria-hidden="true"
          sx={{
            position: 'absolute',
            left: '50%',
            top: '20%',
            width: 'clamp(300px, 45vw, 750px)',
            height: 'clamp(300px, 45vw, 750px)',
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(139, 163, 106, 0.15) 0%, rgba(139, 163, 106, 0.05) 50%, transparent 80%)',
            filter: 'blur(50px)',
            opacity: 0.8,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          {/* Back button */}
          <Box
            component={motion.div}
            initial="hidden"
            animate="visible"
            custom={0}
            variants={fadeUpVariants}
            sx={{ mb: { xs: 4, md: 5 } }}
          >
            <Button
              component={RouterLink}
              to="/#services"
              startIcon={<ArrowBack />}
              sx={{
                color: colors.text.secondary,
                fontWeight: 500,
                fontSize: '0.9rem',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: `1px solid ${colors.border.light}`,
                borderRadius: 2,
                px: 2.2,
                py: 0.9,
                '&:hover': {
                  color: colors.accent.primary,
                  borderColor: colors.border.accent,
                  backgroundColor: 'rgba(139, 163, 106, 0.05)',
                  transform: 'translateX(-4px)',
                },
              }}
            >
              Back to Services
            </Button>
          </Box>

          {/* Hero Header */}
          <Grid container spacing={{ xs: 4, md: 6 }} sx={{ mb: { xs: 6, md: 10 } }}>
            <Grid item xs={12} md={7}>
              <Box
                component={motion.div}
                initial="hidden"
                animate="visible"
                custom={0.08}
                variants={fadeUpVariants}
              >
                <SectionBadge
                  sx={{
                    mb: 2.5,
                    color: colors.accent.primary,
                    borderColor: 'rgba(139, 163, 106, 0.24)',
                    backgroundColor: 'rgba(139, 163, 106, 0.07)',
                  }}
                >
                  {service.badge}
                </SectionBadge>
                <Typography
                  variant="h1"
                  sx={{
                    fontWeight: 800,
                    fontFamily: 'Sora',
                    fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.2rem' },
                    lineHeight: 1.1,
                    mb: 3,
                    color: colors.text.primary,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {service.title}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: colors.text.secondary,
                    fontWeight: 450,
                    lineHeight: 1.6,
                    fontSize: { xs: '1.05rem', md: '1.22rem' },
                    maxWidth: 580,
                  }}
                >
                  {service.subtitle}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={5} sx={{ display: 'flex', alignItems: 'flex-end' }}>
              <Box
                component={motion.div}
                initial="hidden"
                animate="visible"
                custom={0.16}
                variants={fadeUpVariants}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: colors.text.muted,
                    fontSize: '1.02rem',
                    lineHeight: 1.8,
                    mb: 4,
                  }}
                >
                  {service.description}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  component="a"
                  href={`https://wa.me/919495664173?text=Hi%20Aslisite,%20I'm%20interested%20in%20your%20${encodeURIComponent(service.title)}%20services!`}
                  target="_blank"
                  rel="noopener noreferrer"
                  endIcon={<ArrowForward />}
                  sx={{
                    py: 1.6,
                    px: 3.8,
                    fontWeight: 700,
                    background: colors.accent.gradient,
                    color: '#06100d',
                    boxShadow: '0 18px 40px rgba(139, 163, 106, 0.16)',
                  }}
                >
                  Discuss Project
                </Button>
              </Box>
            </Grid>
          </Grid>

          {/* Benefits Grid */}
          <Box
            component={motion.div}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={fadeUpVariants}
            sx={{ mb: { xs: 8, md: 12 } }}
          >
            <Grid container spacing={3}>
              {service.benefits.map((benefit, idx) => (
                <Grid item xs={12} sm={4} key={idx}>
                  <Box
                    sx={{
                      height: '100%',
                      p: 3.5,
                      borderRadius: 3,
                      backgroundColor: 'rgba(255, 255, 255, 0.02)',
                      border: `1px solid ${colors.border.light}`,
                      backdropFilter: 'blur(10px)',
                      transition: 'border-color 0.3s ease, transform 0.3s ease',
                      '&:hover': {
                        borderColor: colors.border.accent,
                        transform: 'translateY(-4px)',
                      },
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: colors.accent.primary,
                        mb: 1.5,
                        fontSize: '1.1rem',
                      }}
                    >
                      {benefit.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: colors.text.secondary,
                        lineHeight: 1.7,
                        fontSize: '0.94rem',
                      }}
                    >
                      {benefit.desc}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Features Detail */}
          <Grid container spacing={{ xs: 6, md: 8 }} sx={{ mb: { xs: 8, md: 12 } }}>
            <Grid item xs={12} md={5}>
              <Box
                component={motion.div}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeUpVariants}
                sx={{ position: 'sticky', top: 100 }}
              >
                <SectionBadge sx={{ mb: 2 }}>Core Features</SectionBadge>
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 700,
                    fontFamily: 'Sora',
                    fontSize: { xs: '2rem', md: '2.8rem' },
                    lineHeight: 1.2,
                    mb: 3,
                    color: colors.text.primary,
                  }}
                >
                  What We Deliver
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: colors.text.secondary,
                    lineHeight: 1.8,
                    fontSize: '1.02rem',
                    mb: 4,
                  }}
                >
                  We compile our skills to develop complete features that fit your business needs.
                  Every component is built cleanly to achieve modern speed and secure scalability.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={7}>
              <Box
                component={motion.div}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={fadeUpVariants}
              >
                <Grid container spacing={3}>
                  {service.features.map((feature, idx) => (
                    <Grid item xs={12} key={idx}>
                      <Box
                        sx={{
                          p: { xs: 3.5, md: 4 },
                          borderRadius: 3.5,
                          border: `1px solid ${colors.border.light}`,
                          backgroundColor: colors.background.card,
                          transition: 'border-color 0.3s ease, transform 0.3s ease',
                          '&:hover': {
                            borderColor: colors.border.accent,
                            transform: 'translateY(-2px)',
                          },
                        }}
                      >
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 750,
                            mb: 1.8,
                            color: colors.text.primary,
                            fontSize: { xs: '1.15rem', md: '1.25rem' },
                          }}
                        >
                          {feature.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: colors.text.secondary,
                            lineHeight: 1.8,
                            fontSize: '0.96rem',
                          }}
                        >
                          {feature.desc}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Grid>
          </Grid>

          {/* Tech Stack Box */}
          <Box
            component={motion.div}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUpVariants}
            sx={{
              p: { xs: 4, md: 6 },
              borderRadius: 4,
              backgroundColor: colors.background.secondary,
              border: `1px solid ${colors.border.light}`,
              mb: { xs: 8, md: 12 },
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 750,
                fontFamily: 'Sora',
                mb: 1.5,
                color: colors.text.primary,
              }}
            >
              Technology Stack & Tools
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: colors.text.secondary,
                mb: 4,
                fontSize: '0.96rem',
              }}
            >
              We choose tools that match the scope of your project, prioritizing long-term support
              and rapid load speeds.
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
              {service.techStack.map((tech) => (
                <Chip
                  key={tech}
                  label={tech}
                  sx={{
                    backgroundColor: 'rgba(139, 163, 106, 0.07)',
                    color: colors.accent.primary,
                    border: '1px solid rgba(139, 163, 106, 0.16)',
                    fontSize: '0.82rem',
                    fontWeight: 650,
                    px: 1.2,
                    py: 2.2,
                    borderRadius: 1.5,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(139, 163, 106, 0.16)',
                      borderColor: colors.accent.primary,
                    },
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* Our Process Section */}
          <Box
            component={motion.div}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={fadeUpVariants}
            sx={{ mb: { xs: 10, md: 15 } }}
          >
            <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 8 } }}>
              <SectionBadge sx={{ mb: 2 }}>Workflow</SectionBadge>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 700,
                  fontFamily: 'Sora',
                  fontSize: { xs: '2rem', md: '2.8rem' },
                  color: colors.text.primary,
                }}
              >
                Our Execution Journey
              </Typography>
            </Box>

            <Stack spacing={4} sx={{ maxWidth: 780, mx: 'auto' }}>
              {service.process.map((step, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: 'flex',
                    gap: { xs: 2.5, md: 4 },
                    alignItems: 'flex-start',
                    p: { xs: 3, md: 3.5 },
                    borderRadius: 3,
                    border: '1px solid rgba(255, 255, 255, 0.03)',
                    backgroundColor: 'rgba(255, 255, 255, 0.01)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      border: `1px solid ${colors.border.light}`,
                      backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    },
                  }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 800,
                      color: colors.accent.primary,
                      opacity: 0.9,
                      fontFamily: 'Sora',
                      minWidth: { xs: 36, md: 48 },
                      lineHeight: 1,
                      fontSize: { xs: '1.8rem', md: '2.5rem' },
                      userSelect: 'none',
                    }}
                  >
                    {String(idx + 1).padStart(2, '0')}
                  </Typography>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 750,
                        mb: 1.2,
                        color: colors.text.primary,
                        fontSize: { xs: '1.05rem', md: '1.15rem' },
                      }}
                    >
                      {step.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: colors.text.secondary,
                        lineHeight: 1.75,
                        fontSize: '0.94rem',
                      }}
                    >
                      {step.desc}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>

          {/* CTA Section */}
          <Box
            component={motion.div}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUpVariants}
            sx={{
              p: { xs: 5, md: 8 },
              borderRadius: 5,
              background: `linear-gradient(135deg, ${colors.background.elevated} 0%, ${colors.background.secondary} 100%)`,
              border: `1px solid ${colors.border.accent}`,
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Soft backdrop glow inside CTA */}
            <Box
              aria-hidden="true"
              sx={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: 380,
                height: 380,
                transform: 'translate(-50%, -50%)',
                background:
                  'radial-gradient(circle, rgba(139, 163, 106, 0.08) 0%, transparent 68%)',
                filter: 'blur(30px)',
                pointerEvents: 'none',
                zIndex: 0,
              }}
            />

            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  mb: 2.5,
                  fontFamily: 'Sora',
                  color: colors.text.primary,
                  fontSize: { xs: '1.8rem', sm: '2.4rem', md: '2.8rem' },
                }}
              >
                {service.ctaText}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: colors.text.secondary,
                  maxWidth: 600,
                  mx: 'auto',
                  mb: 4.5,
                  fontSize: { xs: '0.95rem', md: '1.02rem' },
                  lineHeight: 1.7,
                }}
              >
                Let’s collaborate to build high-performance solutions custom-tailored to your
                business flow. Reach out today for a free project scoping session.
              </Typography>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                justifyContent="center"
                sx={{
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
                  href={`https://wa.me/919495664173?text=Hi%20Aslisite,%20I'm%20interested%20in%20your%20${encodeURIComponent(service.title)}%20services!`}
                  target="_blank"
                  rel="noopener noreferrer"
                  endIcon={<ArrowForward />}
                  sx={{
                    py: 1.8,
                    px: 4.5,
                    fontWeight: 700,
                    background: colors.accent.gradient,
                    color: '#06100d',
                  }}
                >
                  Start the Conversation
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  component={RouterLink}
                  to="/#contact"
                  sx={{
                    py: 1.8,
                    px: 4.5,
                    fontWeight: 700,
                  }}
                >
                  Submit Brief
                </Button>
              </Stack>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default ServiceDetail;
