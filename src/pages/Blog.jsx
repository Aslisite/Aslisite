import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Box,
  Chip,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AccessTimeImport from '@mui/icons-material/AccessTime';
import CalendarTodayImport from '@mui/icons-material/CalendarToday';
import { filterPublishedBlogs, getBlogs } from '../api/blog';
import { colors } from '../theme/theme';
import { SectionBadge } from '../components/common';
import { useInitialData } from '../context/DataContext';
import { absoluteUrl, siteMetadata } from '../seo/siteMetadata';

const CalendarTodayIcon = CalendarTodayImport.default || CalendarTodayImport;
const AccessTimeIcon = AccessTimeImport.default || AccessTimeImport;

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

const getReadTime = (post) => {
  const plainText = post.content?.replace(/<[^>]*>/g, ' ') || post.metaDesc || '';
  const words = plainText.trim().split(/\s+/).filter(Boolean).length;

  return Math.max(1, Math.ceil(words / 200));
};

const Blog = () => {
  const initialData = useInitialData();
  const [blogs, setBlogs] = useState(filterPublishedBlogs(initialData?.blogs || []));
  const [loading, setLoading] = useState(!initialData?.blogs);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData?.blogs) return;

    const fetchBlogs = async () => {
      try {
        const data = await getBlogs();
        setBlogs(data);
      } catch (err) {
        setError('Failed to load blog posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [initialData]);

  if (loading) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}
      >
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ pt: { xs: 12, md: 16 }, pb: 8 }}>
      <Helmet>
        <title>Blog - Aslisite</title>
        <meta
          name="description"
          content="Read the latest articles from Aslisite on web development, SEO strategy, ecommerce solutions, and digital growth tips for businesses in Kerala and beyond."
        />
        <link rel="canonical" href={absoluteUrl('/blog')} />
        <meta property="og:url" content={absoluteUrl('/blog')} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Blog - Aslisite" />
        <meta
          property="og:description"
          content="Read the latest articles from Aslisite on web development, SEO strategy, ecommerce solutions, and digital growth tips for businesses in Kerala and beyond."
        />
        <meta property="og:image" content={siteMetadata.logo} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Blog - Aslisite" />
        <meta
          name="twitter:description"
          content="Read the latest articles from Aslisite on web development, SEO strategy, ecommerce solutions, and digital growth tips for businesses in Kerala and beyond."
        />
        <meta name="twitter:image" content={siteMetadata.logo} />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Blog',
            '@id': `${absoluteUrl('/blog')}#blog`,
            url: absoluteUrl('/blog'),
            name: 'Aslisite Blog',
            description:
              'Read the latest articles from Aslisite on web development, SEO strategy, ecommerce solutions, and digital growth tips for businesses in Kerala and beyond.',
          })}
        </script>
      </Helmet>

      <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 10 } }}>
        <SectionBadge>Our Blog</SectionBadge>
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            fontWeight: 700,
            mb: 2,
            color: colors.text.primary,
          }}
        >
          Insights &{' '}
          <Box
            component="span"
            sx={{
              background: colors.accent.gradient,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Updates
          </Box>
        </Typography>
        <Typography
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
          Read our latest articles, insights, and updates to stay ahead.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {blogs.map((blog) => {
          const postDate = formatPostDate(blog);
          const readTime = getReadTime(blog);

          return (
            <Grid item key={blog.slug || blog.title} xs={12} sm={6} md={4}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  '&:hover': {
                    '& .blog-card-image': {
                      transform: 'scale(1.06)',
                    },
                    '& .blog-card-overlay': {
                      opacity: 0.15,
                    },
                    '& .blog-card-read-link': {
                      opacity: 1,
                      transform: 'translateY(0)',
                    },
                  },
                }}
              >
                <Box
                  component={RouterLink}
                  to={`/blog/${blog.slug}`}
                  sx={{
                    display: 'block',
                    aspectRatio: '16/10',
                    overflow: 'hidden',
                    position: 'relative',
                    background: colors.accent.gradient,
                  }}
                >
                  {blog.image ? (
                    <>
                      <Box
                        component="img"
                        className="blog-card-image"
                        src={blog.image}
                        alt={blog.title}
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
                        className="blog-card-overlay"
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
                        background:
                          'linear-gradient(135deg, rgba(168, 85, 247, 0.24) 0%, rgba(245, 241, 232, 0.08) 100%)',
                      }}
                    />
                  )}
                </Box>

                <CardContent
                  sx={{
                    p: 3.5,
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
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
                      label={blog.category || 'Digital Strategy'}
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
                    to={`/blog/${blog.slug}`}
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
                    {blog.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: colors.text.secondary,
                      mb: 3,
                      lineHeight: 1.72,
                      fontSize: '0.96rem',
                      flexGrow: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {blog.metaDesc}
                  </Typography>

                  <Button
                    className="blog-card-read-link"
                    component={RouterLink}
                    to={`/blog/${blog.slug}`}
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
                        color: colors.text.primary,
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
    </Container>
  );
};

export default Blog;
