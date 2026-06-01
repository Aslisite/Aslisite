import { Box, Container, Grid, Paper, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { colors } from '../../theme/theme';
import { SectionBadge } from '../common';

const fadeUpVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: 'easeOut',
    },
  },
};

const headingRevealVariants = {
  hidden: { y: '100%' },
  visible: {
    y: 0,
    transition: {
      duration: 0.7,
      ease: 'easeOut',
    },
  },
};

const descriptionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.65,
      ease: 'easeOut',
    },
  },
};

const faqGridVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.08,
    },
  },
};

const faqItemVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: 'easeOut',
    },
  },
};

const faqs = [
  {
    question: 'What services does Aslisite offer?',
    answer:
      'Aslisite provides web development, ecommerce development, custom software, UI/UX design, and SEO services for businesses that want to grow online with a stronger digital presence.',
  },
  {
    question: 'Do you work with businesses only in Kerala?',
    answer:
      'We are based in Malappuram, Kerala, and work with businesses across Kerala as well as clients in other parts of India and abroad. Our process is remote-friendly and built for clear communication.',
  },
  {
    question: 'Can you help improve an existing website instead of building a new one?',
    answer:
      'Yes. We can redesign, optimize, and improve existing websites for better speed, user experience, lead generation, and search visibility without always needing a complete rebuild.',
  },
  {
    question: 'How long does a typical website project take?',
    answer:
      'Project timelines depend on scope, content, and integrations, but most business website projects move from planning to launch within a few weeks once requirements are clear and content is ready.',
  },
  {
    question: 'Do you provide SEO along with website development?',
    answer:
      'Yes. We build websites with SEO fundamentals in mind and also offer ongoing SEO support focused on on-page improvements, technical fixes, content strategy, and organic visibility.',
  },
  {
    question: 'Which kinds of businesses do you work with?',
    answer:
      'We work with startups, small businesses, service companies, local brands, and growing teams that need high-quality websites, ecommerce platforms, or digital systems that support business growth.',
  },
];

const FAQ = () => {
  return (
    <Box
      component="section"
      id="faq"
      tabIndex="-1"
      sx={{
        py: { xs: 6, md: 8 },
        backgroundColor: colors.background.secondary,
        position: 'relative',
        scrollMarginTop: '80px',
        borderBottom: `1px solid ${colors.border.light}`,
      }}
    >
      <Container maxWidth="lg">
        <Box
          component={motion.div}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
        >
          <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 8 }, maxWidth: '760px', mx: 'auto' }}>
            <Box component={motion.div} variants={fadeUpVariants}>
              <SectionBadge>FAQ</SectionBadge>
            </Box>
            <Box sx={{ overflow: 'hidden', mb: 2, pb: '0.04em' }}>
              <Typography
                component={motion.h2}
                variants={headingRevealVariants}
                variant="h2"
                sx={{
                  fontSize: { xs: '2rem', sm: '2.4rem', md: '3rem' },
                  fontWeight: 700,
                  color: colors.text.primary,
                }}
              >
                Questions Businesses Ask Before Hiring a Web & SEO Agency
              </Typography>
            </Box>
            <Typography
              component={motion.p}
              variants={descriptionVariants}
              variant="h6"
              sx={{
                color: colors.text.secondary,
                fontWeight: 400,
                lineHeight: 1.7,
                fontSize: { xs: '1rem', md: '1.1rem' },
              }}
            >
              A quick overview of how Aslisite helps businesses in Kerala and beyond with web
              development, ecommerce, design, and SEO.
            </Typography>
          </Box>

          <Grid component={motion.div} container spacing={3} variants={faqGridVariants}>
            {faqs.map((item) => (
              <Grid item xs={12} md={6} key={item.question}>
                <Paper
                  component={motion.div}
                  variants={faqItemVariants}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  elevation={0}
                  sx={{
                    height: '100%',
                    p: { xs: 3, md: 3.5 },
                    backgroundColor: colors.background.primary,
                    border: `1px solid ${colors.border.light}`,
                    borderRadius: 3,
                  }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      fontSize: { xs: '1.05rem', md: '1.15rem' },
                      fontWeight: 600,
                      color: colors.text.primary,
                      mb: 1.5,
                      lineHeight: 1.4,
                    }}
                  >
                    {item.question}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: colors.text.secondary,
                      lineHeight: 1.8,
                      fontSize: '0.98rem',
                    }}
                  >
                    {item.answer}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default FAQ;
