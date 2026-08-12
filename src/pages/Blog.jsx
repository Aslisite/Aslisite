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
  Stack,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AccessTimeImport from '@mui/icons-material/AccessTime';
import CalendarTodayImport from '@mui/icons-material/CalendarToday';
import ArrowForwardImport from '@mui/icons-material/ArrowForward';
import { filterPublishedBlogs, getBlogs } from '../api/blog';
import { colors } from '../theme/theme';
import { SectionBadge } from '../components/common';
import { useInitialData } from '../context/DataContext';
import { absoluteUrl, siteMetadata } from '../seo/siteMetadata';

const CalendarTodayIcon = CalendarTodayImport.default || CalendarTodayImport;
const AccessTimeIcon = AccessTimeImport.default || AccessTimeImport;
const ArrowForward = ArrowForwardImport.default || ArrowForwardImport;

const formatPostDate = (post) => {
  const candidate = post?.updatedAt || post?.date || post?.publishedAt || post?.createdAt;
  const date = new Date(candidate);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const getReadTime = (post) => {
  const plainText = post.content?.replace(/<[^>]*>/g, ' ') || post.metaDesc || '';
  const words = plainText.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
};

/* ─── Featured Hero Card (first post) ─── */
const FeaturedCard = ({ blog }) => {
  const postDate = formatPostDate(blog);
  const readTime = getReadTime(blog);

  return (
    <Card
      component={RouterLink}
      to={`/blog/${blog.slug}`}
      sx={{
        textDecoration: 'none',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        overflow: 'hidden',
        borderRadius: 4,
        mb: { xs: 5, md: 8 },
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 24px 48px rgba(0, 0, 0, 0.1)',
          '& .featured-image': { transform: 'scale(1.03)' },
        },
      }}
    >
      <Box
        sx={{
          width: { xs: '100%', md: '55%' },
          aspectRatio: { xs: '16/9', md: 'auto' },
          minHeight: { md: 360 },
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        {blog.image ? (
          <Box
            component="img"
            className="featured-image"
            src={blog.image}
            alt={blog.title}
            loading="eager"
            referrerPolicy="no-referrer"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        ) : (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              minHeight: 240,
              background: colors.accent.gradient,
              opacity: 0.12,
            }}
          />
        )}
      </Box>

      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          p: { xs: 3.5, md: 5 },
          flex: 1,
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2.5 }}>
          <Chip
            label={blog.category || 'Digital Strategy'}
            size="small"
            sx={{
              bgcolor: 'rgba(124, 58, 237, 0.08)',
              color: colors.accent.primary,
              fontWeight: 700,
              fontSize: '0.68rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              height: '26px',
              border: '1px solid rgba(124, 58, 237, 0.15)',
            }}
          />
          <Chip
            label="Latest"
            size="small"
            sx={{
              background: colors.accent.gradient,
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.62rem',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              height: '22px',
            }}
          />
        </Stack>

        <Typography
          variant="h4"
          component="h2"
          sx={{
            fontWeight: 800,
            fontSize: { xs: '1.5rem', md: '1.85rem' },
            lineHeight: 1.22,
            color: colors.text.primary,
            mb: 2,
          }}
        >
          {blog.title}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: colors.text.secondary,
            lineHeight: 1.7,
            mb: 3,
            fontSize: '1rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {blog.metaDesc}
        </Typography>

        <Stack direction="row" spacing={2.5} alignItems="center" sx={{ color: colors.text.muted, mt: 'auto' }}>
          {postDate && (
            <Stack direction="row" spacing={0.5} alignItems="center">
              <CalendarTodayIcon sx={{ fontSize: '0.85rem' }} />
              <Typography variant="caption" sx={{ fontWeight: 500 }}>{postDate}</Typography>
            </Stack>
          )}
          <Stack direction="row" spacing={0.5} alignItems="center">
            <AccessTimeIcon sx={{ fontSize: '0.85rem' }} />
            <Typography variant="caption" sx={{ fontWeight: 500 }}>{readTime} min read</Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

/* ─── Horizontal Article Card (remaining posts) ─── */
const ArticleCard = ({ blog }) => {
  const postDate = formatPostDate(blog);
  const readTime = getReadTime(blog);

  return (
    <Card
      component={RouterLink}
      to={`/blog/${blog.slug}`}
      sx={{
        textDecoration: 'none',
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        overflow: 'hidden',
        height: '100%',
        borderRadius: 3,
        transition: 'transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 16px 32px rgba(0, 0, 0, 0.07)',
          borderColor: colors.border.accent,
          '& .article-image': { transform: 'scale(1.05)' },
          '& .article-arrow': { transform: 'translateX(4px)', color: colors.accent.primary },
        },
      }}
    >
      <Box
        sx={{
          width: { xs: '100%', sm: 200, md: 240 },
          minHeight: { xs: 140, sm: 'auto' },
          aspectRatio: { xs: '16/8', sm: 'auto' },
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        {blog.image ? (
          <Box
            component="img"
            className="article-image"
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
        ) : (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(8, 145, 178, 0.06) 100%)',
            }}
          />
        )}
      </Box>

      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          p: { xs: 2.5, sm: 3 },
          flex: 1,
          minWidth: 0,
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
          <Chip
            label={blog.category || 'Digital Strategy'}
            size="small"
            sx={{
              bgcolor: '#f1f5f9',
              color: colors.text.secondary,
              fontWeight: 600,
              fontSize: '0.62rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              height: '22px',
            }}
          />
          <Typography variant="caption" sx={{ color: colors.text.muted, fontWeight: 500 }}>
            {readTime} min
          </Typography>
        </Stack>

        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontWeight: 700,
            fontSize: { xs: '1.05rem', sm: '1.1rem' },
            lineHeight: 1.4,
            color: colors.text.primary,
            mb: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {blog.title}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: colors.text.secondary,
            lineHeight: 1.6,
            fontSize: '0.88rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            mb: 2,
          }}
        >
          {blog.metaDesc}
        </Typography>

        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 'auto' }}>
          {postDate && (
            <Typography variant="caption" sx={{ color: colors.text.muted, fontWeight: 500 }}>
              {postDate}
            </Typography>
          )}
          <ArrowForward
            className="article-arrow"
            sx={{
              fontSize: 18,
              color: colors.text.muted,
              transition: 'transform 0.25s ease, color 0.25s ease',
            }}
          />
        </Stack>
      </CardContent>
    </Card>
  );
};

/* ─── Blog Page ─── */
const POSTS_PER_PAGE = 6;

const Blog = () => {
  const initialData = useInitialData();
  const [blogs, setBlogs] = useState(filterPublishedBlogs(initialData?.blogs || []));
  const [loading, setLoading] = useState(!initialData?.blogs);
  const [error, setError] = useState('');
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);

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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Typography color="error" variant="h6">{error}</Typography>
      </Box>
    );
  }

  const [featured, ...allRemaining] = blogs;
  const remaining = allRemaining.slice(0, visibleCount);
  const hasMore = visibleCount < allRemaining.length;
  const totalCount = allRemaining.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + POSTS_PER_PAGE);
  };

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

      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 8 } }}>
        <SectionBadge>Our Blog</SectionBadge>
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            fontWeight: 800,
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
            maxWidth: '580px',
            mx: 'auto',
            fontSize: { xs: '1rem', md: '1.1rem' },
            lineHeight: 1.6,
          }}
        >
          Practical guides on web development, SEO, and digital growth for businesses.
        </Typography>
      </Box>

      {/* Featured Post */}
      {featured && <FeaturedCard blog={featured} />}

      {/* Section Divider */}
      {remaining.length > 0 && (
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
          <Typography
            variant="overline"
            sx={{
              fontWeight: 700,
              color: colors.text.muted,
              letterSpacing: '0.12em',
              fontSize: '0.75rem',
            }}
          >
            All Articles
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: colors.text.muted, fontWeight: 500 }}
          >
            Showing {remaining.length} of {totalCount}
          </Typography>
        </Stack>
      )}

      {/* Remaining Articles — 2-column horizontal cards */}
      <Grid container spacing={3}>
        {remaining.map((blog) => (
          <Grid item key={blog.slug || blog.title} xs={12} md={6}>
            <ArticleCard blog={blog} />
          </Grid>
        ))}
      </Grid>

      {/* Load More */}
      {hasMore && (
        <Box sx={{ textAlign: 'center', mt: { xs: 5, md: 6 } }}>
          <Button
            variant="outlined"
            size="large"
            onClick={handleLoadMore}
            sx={{
              px: 5,
              py: 1.4,
              fontWeight: 700,
              borderRadius: 2.5,
              borderColor: colors.border.medium,
              color: colors.text.primary,
              transition: 'all 0.25s ease',
              '&:hover': {
                borderColor: colors.accent.primary,
                backgroundColor: 'rgba(124, 58, 237, 0.04)',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 16px rgba(124, 58, 237, 0.1)',
              },
            }}
          >
            Load More Articles
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default Blog;
