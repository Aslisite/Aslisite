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
  Skeleton,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayImport from '@mui/icons-material/CalendarToday';
import { colors } from '../../theme/theme';
import { BlurText, SectionBadge } from '../common';
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

const SkeletonCard = () => (
  <Grid item xs={12} sm={6} md={4}>
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: colors.background.card,
        border: `1px solid ${colors.border.light}`,
        borderRadius: 3,
      }}
    >
      <Skeleton
        variant="rectangular"
        sx={{
          aspectRatio: '16/10',
          width: '100%',
          height: 200,
          bgcolor: 'rgba(245,241,232,0.06)',
        }}
      />
      <CardContent sx={{ p: 3.5, flexGrow: 1 }}>
        <Skeleton
          variant="text"
          sx={{ bgcolor: 'rgba(245,241,232,0.06)', width: '40%', mb: 2, fontSize: '0.7rem' }}
        />
        <Skeleton
          variant="text"
          sx={{ bgcolor: 'rgba(245,241,232,0.06)', width: '80%', mb: 1, fontSize: '1.18rem' }}
        />
        <Skeleton
          variant="text"
          sx={{ bgcolor: 'rgba(245,241,232,0.06)', width: '100%', mb: 0.5 }}
        />
        <Skeleton
          variant="text"
          sx={{ bgcolor: 'rgba(245,241,232,0.06)', width: '100%', mb: 0.5 }}
        />
        <Skeleton variant="text" sx={{ bgcolor: 'rgba(245,241,232,0.06)', width: '30%', mt: 2 }} />
      </CardContent>
    </Card>
  </Grid>
);

const LatestInsights = () => {
  const initialData = useInitialData();
  const [blogs, setBlogs] = useState(filterPublishedBlogs(initialData?.blogs || []).slice(0, 3));
  const [loading, setLoading] = useState(!initialData?.blogs);

  useEffect(() => {
    if (initialData?.blogs) {
      setLoading(false);
      return;
    }

    const fetchBlogs = async () => {
      try {
        const data = await getBlogs();
        setBlogs(data.slice(0, 3));
      } catch (err) {
        console.error('Failed to load blog posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [initialData]);

  const showSkeletons = loading && blogs.length === 0;

  if (!loading && (!blogs || blogs.length === 0)) return null;

  return (
    <Box
      component="section"
      id="insights"
      tabIndex="-1"
      sx={{
        py: { xs: 8, md: 10 },
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
          viewport={{ once: false, amount: 0.25 }}
        >
          <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
            <Box component={motion.div} variants={fadeUpVariants}>
              <SectionBadge>Recent Insights</SectionBadge>
            </Box>
            <BlurText
              component="h2"
              text="Latest from Our Blog"
              animateBy="words"
              direction="top"
              delay={110}
              stepDuration={0.32}
              highlightWords={['Blog']}
              sx={{
                fontSize: { xs: '2rem', sm: '2.45rem', md: '2.85rem' },
                fontWeight: 800,
                lineHeight: 1.12,
                mb: 2,
                color: colors.text.primary,
                textAlign: 'center',
                maxWidth: '640px',
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
                maxWidth: '540px',
                mx: 'auto',
                fontSize: { xs: '0.98rem', md: '1.06rem' },
                lineHeight: 1.78,
              }}
            >
              Stay updated with the latest digital trends, development strategies, and SEO growth
              hacks
            </Typography>
          </Box>

          <Grid component={motion.div} container spacing={4} variants={cardsContainerVariants}>
            {showSkeletons
              ? [0, 1, 2].map((i) => <SkeletonCard key={i} />)
              : blogs.map((post) => {
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
                          overflow: 'hidden',
                          transition:
                            'transform 0.28s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.28s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
                          '&:hover': {
                            transform: 'translateY(-6px)',
                            borderColor: colors.border.accent,
                            boxShadow: '0 18px 36px rgba(0, 0, 0, 0.34)',
                            '& .insights-card-image': {
                              transform: 'scale(1.06)',
                            },
                            '& .insights-card-overlay': {
                              opacity: 0.15,
                            },
                            '& .insights-card-read-link': {
                              opacity: 1,
                              transform: 'translateY(0)',
                            },
                          },
                        }}
                      >
                        <Box
                          component={RouterLink}
                          to={`/blog/${post.slug}`}
                          sx={{
                            overflow: 'hidden',
                            display: 'block',
                            aspectRatio: '16/10',
                            position: 'relative',
                          }}
                        >
                          {post.image ? (
                            <>
                              <Box
                                component="img"
                                className="insights-card-image"
                                src={post.image}
                                alt={post.title}
                                loading="lazy"
                                referrerPolicy="no-referrer"
                                sx={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                  transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                }}
                              />
                              <Box
                                className="insights-card-overlay"
                                sx={{
                                  position: 'absolute',
                                  inset: 0,
                                  background:
                                    'linear-gradient(to top, rgba(11,13,16,0.55) 0%, transparent 60%)',
                                  transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                  opacity: 0.45,
                                  pointerEvents: 'none',
                                }}
                              />
                            </>
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
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              flexWrap: 'wrap',
                              gap: 1.5,
                              mb: 2,
                            }}
                          >
                            <Chip
                              label={post.category || 'Digital Strategy'}
                              size="small"
                              sx={{
                                bgcolor: 'rgba(245, 241, 232, 0.05)',
                                color: colors.text.secondary,
                                fontWeight: 600,
                                fontSize: '0.7rem',
                                letterSpacing: '0.08em',
                                textTransform: 'uppercase',
                                display: 'inline-flex',
                                alignItems: 'center',
                                height: '24px',
                              }}
                            />
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                color: colors.text.muted,
                              }}
                            >
                              {postDate && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <CalendarTodayIcon sx={{ fontSize: '0.85rem' }} />
                                  <Typography variant="caption" sx={{ lineHeight: 1 }}>
                                    {postDate}
                                  </Typography>
                                </Box>
                              )}
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <AccessTimeIcon sx={{ fontSize: '0.85rem' }} />
                                <Typography variant="caption" sx={{ lineHeight: 1 }}>
                                  {readTime} min
                                </Typography>
                              </Box>
                            </Box>
                          </Box>

                          <Typography
                            variant="h5"
                            component={RouterLink}
                            to={`/blog/${post.slug}`}
                            sx={{
                              fontWeight: 700,
                              fontSize: '1.18rem',
                              lineHeight: 1.45,
                              color: colors.text.primary,
                              textDecoration: 'none',
                              mb: 1.5,
                              overflow: { xs: 'visible', md: 'hidden' },
                              textOverflow: { xs: 'clip', md: 'ellipsis' },
                              display: { xs: 'block', md: '-webkit-box' },
                              WebkitLineClamp: { xs: 'none', md: 2 },
                              WebkitBoxOrient: { xs: 'none', md: 'vertical' },
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
                              lineHeight: 1.72,
                              fontSize: '0.96rem',
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
                            className="insights-card-read-link"
                            component={RouterLink}
                            to={`/blog/${post.slug}`}
                            sx={{
                              mt: 'auto',
                              p: { xs: '12px 16px', md: 0 },
                              ml: { xs: '-16px', md: 0 },
                              minHeight: { xs: '48px', md: 'auto' },
                              display: 'inline-flex',
                              alignItems: 'center',
                              fontWeight: 600,
                              fontSize: '0.92rem',
                              color: colors.accent.primary,
                              alignSelf: 'flex-start',
                              opacity: { xs: 0.85, md: 0.6 },
                              transform: { xs: 'none', md: 'translateY(6px)' },
                              transition:
                                'color 0.2s ease, transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.35s ease',
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
              borderColor: 'rgba(245, 241, 232, 0.16)',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: colors.accent.primary,
                backgroundColor: 'rgba(168, 85, 247, 0.05)',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 20px rgba(168, 85, 247, 0.15)',
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
