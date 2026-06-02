import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  Button,
  Chip,
  Stack,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayImport from '@mui/icons-material/CalendarToday';
import { colors } from '../../theme/theme';
import { SectionBadge } from '../common';
import { useInitialData } from '../../context/DataContext';
import { filterPublishedBlogs, getBlogs } from '../../api/blog';

const CalendarTodayIcon = CalendarTodayImport.default || CalendarTodayImport;

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

const formatPostDate = (post) => {
  const candidate = post?.updatedAt || post?.date || post?.publishedAt || post?.createdAt;
  const date = new Date(candidate);

  if (Number.isNaN(date.getTime())) return '';

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const LatestInsights = () => {
  const initialData = useInitialData();
  const [blogs, setBlogs] = useState(filterPublishedBlogs(initialData?.blogs || []).slice(0, 3));

  useEffect(() => {
    if (initialData?.blogs) return;

    const fetchBlogs = async () => {
      try {
        const data = await getBlogs();
        setBlogs(data.slice(0, 3));
      } catch (err) {
        console.error('Failed to load blog posts:', err);
      }
    };

    fetchBlogs();
  }, [initialData]);

  if (!blogs || blogs.length === 0) return null;

  return (
    <Box
      component="section"
      id="insights"
      tabIndex="-1"
      sx={{
        py: { xs: 8, md: 10 },
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
          viewport={{ once: false, amount: 0.25 }}
        >
          <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
            <Box component={motion.div} variants={fadeUpVariants}>
              <SectionBadge>Recent Insights</SectionBadge>
            </Box>
            <Typography
              component={motion.h2}
              variants={fadeUpVariants}
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                fontWeight: 700,
                mb: 2,
                color: colors.text.primary,
              }}
            >
              Latest from Our{' '}
              <Box
                component="span"
                sx={{
                  background: colors.accent.gradient,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Blog
              </Box>
            </Typography>
            <Typography
              component={motion.p}
              variants={fadeUpVariants}
              variant="h6"
              sx={{
                color: colors.text.secondary,
                fontWeight: 400,
                maxWidth: '600px',
                mx: 'auto',
                fontSize: { xs: '1rem', md: '1.125rem' },
                lineHeight: 1.6,
              }}
            >
              Stay updated with the latest digital trends, development strategies, and SEO growth
              hacks
            </Typography>
          </Box>

          <Grid component={motion.div} container spacing={4} variants={cardsContainerVariants}>
            {blogs.map((post) => {
              // Estimate reading time if not present
              const plainText = post.content?.replace(/<[^>]*>/g, ' ') || '';
              const words = plainText.trim().split(/\s+/).length || 0;
              const readTime = Math.max(1, Math.ceil(words / 200));
              const postDate = formatPostDate(post);

              return (
                <Grid item xs={12} sm={6} md={4} key={post.slug}>
                  <Card
                    component={motion.div}
                    variants={cardVariants}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      backgroundColor: colors.background.card,
                      border: `1px solid ${colors.border.light}`,
                      borderRadius: 3,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        transform: 'translateY(-10px)',
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
                      },
                    }}
                  >
                    <Box
                      component={RouterLink}
                      to={`/blog/${post.slug}`}
                      sx={{ overflow: 'hidden', display: 'block', aspectRatio: '16/10' }}
                    >
                      {post.image ? (
                        <Box
                          component="img"
                          src={post.image}
                          alt={post.title}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.5s ease',
                            '&:hover': { transform: 'scale(1.05)' },
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: '100%',
                            height: '100%',
                            background: colors.accent.gradient,
                            opacity: 0.15,
                          }}
                        />
                      )}
                    </Box>

                    <CardContent
                      sx={{
                        p: 3.5,
                        display: 'flex',
                        flexDirection: 'column',
                        flexGrow: 1,
                      }}
                    >
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ mb: 2 }}
                      >
                        <Chip
                          label={post.category || 'Digital Strategy'}
                          size="small"
                          sx={{
                            bgcolor: 'rgba(0, 212, 255, 0.08)',
                            color: colors.accent.primary,
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            textTransform: 'uppercase',
                          }}
                        />
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          flexWrap="wrap"
                          justifyContent="flex-end"
                          sx={{ color: colors.text.muted, rowGap: 0.5 }}
                        >
                          {postDate && (
                            <Stack direction="row" spacing={0.5} alignItems="center">
                              <CalendarTodayIcon sx={{ fontSize: '0.85rem' }} />
                              <Typography variant="caption">{postDate}</Typography>
                            </Stack>
                          )}
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <AccessTimeIcon sx={{ fontSize: '0.85rem' }} />
                            <Typography variant="caption">{readTime} min</Typography>
                          </Stack>
                        </Stack>
                      </Stack>

                      <Typography
                        variant="h5"
                        component={RouterLink}
                        to={`/blog/${post.slug}`}
                        sx={{
                          fontWeight: 700,
                          fontSize: '1.25rem',
                          lineHeight: 1.4,
                          color: colors.text.primary,
                          textDecoration: 'none',
                          mb: 1.5,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          transition: 'color 0.2s ease',
                          '&:hover': {
                            color: colors.accent.primary,
                          },
                        }}
                      >
                        {post.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          color: colors.text.secondary,
                          mb: 3,
                          lineHeight: 1.6,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {post.metaDesc}
                      </Typography>

                      <Button
                        component={RouterLink}
                        to={`/blog/${post.slug}`}
                        sx={{
                          mt: 'auto',
                          p: 0,
                          fontWeight: 700,
                          color: colors.accent.primary,
                          alignSelf: 'flex-start',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            bgcolor: 'transparent',
                            color: '#fff',
                            transform: 'translateX(4px)',
                          },
                        }}
                      >
                        Read Article &rarr;
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>

        {/* View All Button */}
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button
            component={RouterLink}
            to="/blog"
            variant="outlined"
            size="large"
            sx={{
              px: 4,
              py: 1.25,
              fontWeight: 700,
              borderRadius: 2.5,
              color: '#fff',
              borderColor: 'rgba(255, 255, 255, 0.15)',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: colors.accent.primary,
                backgroundColor: 'rgba(0, 212, 255, 0.05)',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 20px rgba(0, 212, 255, 0.15)',
              },
            }}
          >
            View All Articles
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default LatestInsights;
