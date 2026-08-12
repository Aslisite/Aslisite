import { useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Container,
  Typography,
} from '@mui/material';
import * as ExpandMoreImport from '@mui/icons-material/ExpandMore';
import { AnimatePresence, motion } from 'framer-motion';
import { colors } from '../../theme/theme';
import { BlurText, SectionBadge } from '../common';

const ExpandMore = ExpandMoreImport.default || ExpandMoreImport;

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

const descriptionVariants = {
  hidden: { opacity: 0.35 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.65,
      ease: 'easeOut',
    },
  },
};

const faqListVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.08,
    },
  },
};

const faqItemVariants = {
  hidden: { opacity: 0.35, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: 'easeOut',
    },
  },
};

const answerFadeVariants = {
  hidden: { opacity: 0, y: -6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: { duration: 0.2, ease: 'easeIn' },
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
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (_event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box
      component="section"
      id="faq"
      tabIndex="-1"
      sx={{
        py: { xs: 6, md: 8 },
        backgroundColor: colors.background.primary,
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
          viewport={{ once: true, amount: 0.3 }}
        >
          <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 8 }, maxWidth: '760px', mx: 'auto' }}>
            <Box component={motion.div} variants={fadeUpVariants}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '1.95rem', sm: '2.35rem', md: '2.8rem' },
                  lineHeight: 1.15,
                  color: colors.text.primary,
                  mb: 2,
                  letterSpacing: '-0.03em',
                }}
              >
                Questions? We&apos;ve got{' '}
                <Box
                  component="span"
                  sx={{
                    textDecoration: 'underline',
                    textDecorationColor: colors.accent.primary,
                    textUnderlineOffset: '6px',
                    textDecorationThickness: '3px',
                  }}
                >
                  answers.
                </Box>
              </Typography>
            </Box>
            <Typography
              component={motion.p}
              variants={descriptionVariants}
              variant="body1"
              sx={{
                color: colors.text.secondary,
                fontWeight: 450,
                lineHeight: 1.8,
                fontSize: { xs: '0.98rem', md: '1.06rem' },
                maxWidth: '620px',
                mx: 'auto',
              }}
            >
              Common questions from businesses considering web development, ecommerce, and SEO services.
            </Typography>
          </Box>

          {/* Accordion Stack */}
          <Box
            component={motion.div}
            variants={faqListVariants}
            sx={{ maxWidth: '850px', mx: 'auto' }}
          >
            {faqs.map((item, index) => {
              const panelId = `faq-panel-${index}`;
              const isActive = expanded === panelId;

              return (
                <Box component={motion.div} variants={faqItemVariants} key={item.question}>
                  <Accordion
                    expanded={isActive}
                    onChange={handleChange(panelId)}
                    disableGutters
                    elevation={0}
                    square={false}
                    sx={{
                      backgroundColor: colors.background.elevated,
                      border: `1px solid ${colors.border.light}`,
                      borderLeft: isActive
                        ? `3px solid ${colors.accent.primary}`
                        : `3px solid transparent`,
                      borderRadius: '12px !important',
                      mb: 1.5,
                      overflow: 'hidden',
                      transition:
                        'border-color 0.3s ease, box-shadow 0.3s ease, transform 0.25s ease',
                      '&:before': { display: 'none' },
                      '&:hover': {
                        borderColor: isActive ? colors.border.light : colors.border.accent,
                        boxShadow: isActive ? 'none' : `0 4px 20px rgba(0, 0, 0, 0.06)`,
                        transform: isActive ? 'none' : 'translateY(-2px)',
                      },
                      '&.Mui-expanded': {
                        my: 0,
                        mb: 1.5,
                      },
                    }}
                  >
                    <AccordionSummary
                      expandIcon={
                        <ExpandMore
                          sx={{
                            color: isActive ? colors.accent.primary : colors.text.muted,
                            transition: 'color 0.3s ease, transform 0.3s ease',
                          }}
                        />
                      }
                      sx={{
                        px: { xs: 2.5, md: 3.5 },
                        py: { xs: 1, md: 1.5 },
                        minHeight: 'unset',
                        '& .MuiAccordionSummary-content': {
                          my: 1.5,
                          alignItems: 'center',
                          gap: { xs: 1.5, md: 2 },
                        },
                      }}
                    >
                      {/* Numbered index */}
                      <Typography
                        component="span"
                        sx={{
                          fontFamily: '"Space Grotesk", "Inter", sans-serif',
                          fontSize: { xs: '0.82rem', md: '0.88rem' },
                          fontWeight: 600,
                          color: isActive ? colors.accent.primary : colors.text.muted,
                          minWidth: '28px',
                          transition: 'color 0.3s ease',
                          userSelect: 'none',
                        }}
                      >
                        {String(index + 1).padStart(2, '0')}
                      </Typography>

                      <Typography
                        variant="h3"
                        sx={{
                          fontSize: { xs: '1rem', md: '1.08rem' },
                          fontWeight: 620,
                          color: isActive ? colors.text.primary : colors.text.secondary,
                          lineHeight: 1.5,
                          transition: 'color 0.3s ease',
                        }}
                      >
                        {item.question}
                      </Typography>
                    </AccordionSummary>

                    <AccordionDetails
                      sx={{
                        px: { xs: 2.5, md: 3.5 },
                        pt: 0,
                        pb: { xs: 2.5, md: 3 },
                        // Offset for the numbered index column
                        pl: { xs: `calc(20px + 28px)`, md: `calc(28px + 28px)` },
                      }}
                    >
                      <AnimatePresence mode="wait">
                        {isActive && (
                          <motion.div
                            key={panelId}
                            variants={answerFadeVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                          >
                            <Typography
                              variant="body1"
                              sx={{
                                color: colors.text.secondary,
                                lineHeight: 1.85,
                                fontSize: '0.96rem',
                              }}
                            >
                              {item.answer}
                            </Typography>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </AccordionDetails>
                  </Accordion>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default FAQ;
