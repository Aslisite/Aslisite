import { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
  LinearProgress,
  IconButton,
  Stack,
} from '@mui/material';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ArrowBackImport from '@mui/icons-material/ArrowBack';
import AccessTimeImport from '@mui/icons-material/AccessTime';
import CalendarTodayImport from '@mui/icons-material/CalendarToday';
import LinkedInImport from '@mui/icons-material/LinkedIn';
import TwitterImport from '@mui/icons-material/Twitter';
import FacebookImport from '@mui/icons-material/Facebook';
import ChevronLeftImport from '@mui/icons-material/ChevronLeft';
import ChevronRightImport from '@mui/icons-material/ChevronRight';
import { filterPublishedBlogs, getBlogs } from '../api/blog';
import { useInitialData } from '../context/DataContext';
import { colors } from '../theme/theme';
import { absoluteUrl, siteMetadata } from '../seo/siteMetadata';

const ArrowBackIcon = ArrowBackImport.default || ArrowBackImport;
const AccessTimeIcon = AccessTimeImport.default || AccessTimeImport;
const CalendarTodayIcon = CalendarTodayImport.default || CalendarTodayImport;
const LinkedInIcon = LinkedInImport.default || LinkedInImport;
const TwitterIcon = TwitterImport.default || TwitterImport;
const FacebookIcon = FacebookImport.default || FacebookImport;
const ChevronLeftIcon = ChevronLeftImport.default || ChevronLeftImport;
const ChevronRightIcon = ChevronRightImport.default || ChevronRightImport;

// --- Helpers ---

const calculateReadTime = (content = '') => {
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  return Math.ceil(words / 225);
};

const extractTOC = (content = '') => {
  const regex = /<h([23])[^>]*>(.*?)<\/h\1>/g;
  const items = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    const level = parseInt(match[1]);
    const text = match[2].replace(/<[^>]*>/g, '');
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
    items.push({ level, text, id });
  }
  return items;
};

const processContent = (content = '') => {
  // Inject IDs into headings for TOC linking
  return content.replace(/<h([23])([^>]*)>(.*?)<\/h\1>/g, (match, level, attrs, text) => {
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
    return `<h${level}${attrs} id="${id}">${text}</h${level}>`;
  });
};

// --- Sub-components ---

const ReadingProgressBar = () => {
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScroll(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 2000 }}>
      <LinearProgress
        variant="determinate"
        value={scroll}
        sx={{
          height: 3,
          backgroundColor: 'transparent',
          '& .MuiLinearProgress-bar': {
            background: colors.accent.gradient,
          },
        }}
      />
    </Box>
  );
};

const CTASection = ({ type = 'bottom' }) => {
  const isMid = type === 'mid';
  return (
    <Box
      sx={{
        my: isMid ? 6 : 10,
        p: { xs: 4, md: 6 },
        borderRadius: 4,
        background: isMid
          ? `linear-gradient(135deg, ${colors.background.card} 0%, rgba(0, 212, 255, 0.05) 100%)`
          : colors.accent.gradient,
        border: '1px solid',
        borderColor: isMid ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
        textAlign: 'center',
        boxShadow: isMid ? 'none' : '0 20px 40px rgba(0, 212, 255, 0.2)',
      }}
    >
      <Typography
        variant={isMid ? 'h5' : 'h3'}
        sx={{
          fontWeight: 800,
          mb: 2,
          color: isMid ? '#fff' : '#fff',
        }}
      >
        {isMid
          ? 'Want a professional website for your business?'
          : 'Ready to scale your digital presence?'}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          mb: 4,
          color: isMid ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.9)',
          maxWidth: '600px',
          mx: 'auto',
        }}
      >
        {isMid
          ? 'Our experts at Aslisite can help you build a high-conversion website tailored to your needs.'
          : "Join hundreds of successful businesses growing with Aslisite. Let's discuss your project today."}
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
        <Button
          variant="contained"
          size="large"
          sx={{
            bgcolor: isMid ? '#00d4ff' : '#fff',
            color: isMid ? '#0a0a0f' : '#0a0a0f',
            fontWeight: 700,
            px: 4,
            '&:hover': { bgcolor: isMid ? '#fff' : 'rgba(255, 255, 255, 0.9)' },
          }}
          component="a"
          href="https://wa.me/919495664173"
          target="_blank"
        >
          {isMid ? 'Get Free Consultation' : 'Get Started Now'}
        </Button>
        {!isMid && (
          <Button
            variant="outlined"
            size="large"
            sx={{
              borderColor: '#fff',
              color: '#fff',
              fontWeight: 700,
              px: 4,
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.8)',
                bgcolor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
            component={RouterLink}
            to="/#contact"
          >
            Contact Us
          </Button>
        )}
      </Stack>
    </Box>
  );
};

const TableOfContents = ({ items, url, title }) => {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -70% 0px' },
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  if (!items.length) return null;

  return (
    <Box sx={{ position: 'sticky', top: 100 }}>
      <Typography
        variant="overline"
        sx={{ fontWeight: 700, color: 'rgba(255, 255, 255, 0.5)', mb: 2, display: 'block' }}
      >
        In this article
      </Typography>
      <List sx={{ p: 0 }}>
        {items.map((item) => (
          <ListItem
            key={item.id}
            button
            onClick={() => handleScroll(item.id)}
            sx={{
              p: 0,
              mb: 1.5,
              borderLeft: '2px solid',
              borderColor: activeId === item.id ? '#00d4ff' : 'transparent',
              pl: item.level === 3 ? 4 : 2,
              '&:hover': { bgcolor: 'transparent', borderColor: 'rgba(0, 212, 255, 0.5)' },
            }}
          >
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{
                sx: {
                  fontSize: '0.9rem',
                  fontWeight: activeId === item.id ? 700 : 500,
                  color: activeId === item.id ? '#fff' : 'rgba(255, 255, 255, 0.6)',
                  transition: '0.2s',
                },
              }}
            />
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.08)' }} />

      <Typography
        variant="overline"
        sx={{ fontWeight: 700, color: 'rgba(255, 255, 255, 0.5)', mb: 2, display: 'block' }}
      >
        Share Article
      </Typography>
      <Stack direction="row" spacing={1}>
        <IconButton
          size="small"
          component="a"
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ color: 'rgba(255, 255, 255, 0.6)', '&:hover': { color: '#00d4ff' } }}
        >
          <TwitterIcon />
        </IconButton>
        <IconButton
          size="small"
          component="a"
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ color: 'rgba(255, 255, 255, 0.6)', '&:hover': { color: '#0077b5' } }}
        >
          <LinkedInIcon />
        </IconButton>
        <IconButton
          size="small"
          component="a"
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ color: 'rgba(255, 255, 255, 0.6)', '&:hover': { color: '#1877f2' } }}
        >
          <FacebookIcon />
        </IconButton>
      </Stack>
    </Box>
  );
};

// --- Main Component ---

const BlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const initialData = useInitialData();
  const initialBlogs = filterPublishedBlogs(initialData?.blogs || []);
  const initialPost = initialBlogs.find((b) => b.slug === slug);

  const [allBlogs, setAllBlogs] = useState(initialBlogs);
  const [post, setPost] = useState(initialPost || null);
  const [loading, setLoading] = useState(!initialData?.blogs);
  const [error, setError] = useState(initialData?.blogs && !initialPost ? 'Post not found' : '');

  useEffect(() => {
    if (initialData?.blogs) {
      const foundPost = initialData.blogs.find((b) => b.slug === slug);
      if (foundPost) {
        setPost(foundPost);
        setAllBlogs(initialData.blogs);
        setError('');
      } else {
        setError('Post not found');
      }
      setLoading(false);
      return;
    }

    const fetchPost = async () => {
      try {
        const blogs = await getBlogs();
        setAllBlogs(blogs);
        const foundPost = blogs.find((b) => b.slug === slug);
        if (foundPost) {
          setPost(foundPost);
          setError('');
        } else {
          setError('Post not found');
        }
      } catch (err) {
        setError('Failed to load the blog post. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug, initialData]);

  const tocItems = useMemo(() => extractTOC(post?.content), [post]);
  const processedHtml = useMemo(() => processContent(post?.content), [post]);
  const readTime = useMemo(() => calculateReadTime(post?.content), [post]);
  const canonicalUrl = absoluteUrl(`/blog/${slug}`);
  const plainContent = useMemo(
    () =>
      post?.content
        ?.replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim() || '',
    [post],
  );

  // Prev/Next Navigation
  const navigation = useMemo(() => {
    if (!post || !allBlogs.length) return { prev: null, next: null };
    const currentIndex = allBlogs.findIndex((b) => b.slug === slug);
    return {
      prev: currentIndex > 0 ? allBlogs[currentIndex - 1] : null,
      next: currentIndex < allBlogs.length - 1 ? allBlogs[currentIndex + 1] : null,
    };
  }, [post, allBlogs, slug]);

  if (loading) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}
      >
        <CircularProgress thickness={4} size={50} sx={{ color: '#00d4ff' }} />
      </Box>
    );
  }

  if (error || !post) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
          textAlign: 'center',
        }}
      >
        <Typography variant="h2" sx={{ fontWeight: 800, mb: 2 }}>
          404
        </Typography>
        <Typography color="error" variant="h5" gutterBottom>
          {error || 'Post not found'}
        </Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/blog')}
          sx={{ mt: 4, borderRadius: 2, px: 4 }}
        >
          Back to Articles
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#0a0a0f' }}>
      <ReadingProgressBar />
      <Helmet>
        <title>{post.metaTitle || `${post.title} | Aslisite Blog`}</title>
        <meta name="description" content={post.metaDesc || ''} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.metaTitle || post.title} />
        <meta property="og:description" content={post.metaDesc} />
        {post.image && <meta property="og:image" content={post.image} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.metaTitle || post.title} />
        <meta name="twitter:description" content={post.metaDesc || ''} />
        <meta name="twitter:image" content={post.image || siteMetadata.logo} />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': canonicalUrl,
            },
            headline: post.title,
            description: post.metaDesc || '',
            image: post.image ? [post.image] : [siteMetadata.logo],
            datePublished: post.date || undefined,
            dateModified: post.updatedAt || post.date || undefined,
            author: {
              '@type': 'Organization',
              name: siteMetadata.legalName,
              url: siteMetadata.baseUrl,
            },
            publisher: {
              '@type': 'Organization',
              name: siteMetadata.legalName,
              logo: {
                '@type': 'ImageObject',
                url: siteMetadata.logo,
              },
            },
            articleSection: post.category || 'Digital Strategy',
            wordCount: plainContent ? plainContent.split(/\s+/).length : undefined,
          })}
        </script>
      </Helmet>

      {/* Hero Section */}
      <Box
        sx={{
          pt: { xs: 10, md: 16 },
          pb: { xs: 6, md: 10 },
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <Container maxWidth="lg">
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/blog')}
            sx={{
              mb: { xs: 4, md: 6 },
              color: 'rgba(255, 255, 255, 0.6)',
              '&:hover': { color: '#fff' },
            }}
          >
            Back to Blog
          </Button>

          <Grid container spacing={{ xs: 3, md: 6 }}>
            <Grid item xs={12} lg={11}>
              <Chip
                label={post.category || 'Digital Strategy'}
                sx={{
                  mb: 3,
                  bgcolor: 'rgba(168, 85, 247, 0.12)',
                  color: colors.accent.primary,
                  border: `1px solid ${colors.border.accent}`,
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                }}
              />
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '2.15rem', sm: '2.6rem', md: '3.35rem' },
                  lineHeight: 1.08,
                  mb: 3,
                  maxWidth: '1120px',
                  background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {post.title}
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontWeight: 400,
                  mb: 5,
                  maxWidth: '880px',
                  lineHeight: 1.6,
                }}
              >
                {post.metaDesc}
              </Typography>

              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={{ xs: 3, sm: 5 }}
                alignItems={{ xs: 'flex-start', sm: 'center' }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar sx={{ width: 40, height: 40, bgcolor: '#7c3aed', fontWeight: 700 }}>
                    A
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      Aslisite Team
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                      Digital Experts
                    </Typography>
                  </Box>
                </Stack>

                <Stack
                  direction="row"
                  spacing={3}
                  flexWrap="wrap"
                  sx={{ color: 'rgba(255, 255, 255, 0.5)', rowGap: 1 }}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CalendarTodayIcon sx={{ fontSize: 16 }} />
                    <Typography variant="body2">
                      {new Date(post.date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <AccessTimeIcon sx={{ fontSize: 16 }} />
                    <Typography variant="body2">{readTime} min read</Typography>
                  </Stack>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Main Content Area */}
      <Container maxWidth="lg" sx={{ mt: { xs: 4, md: 8 } }}>
        <Grid container spacing={{ xs: 4, md: 8 }}>
          {/* Main Column */}
          <Grid item xs={12} md={8}>
            {post.image && (
              <Box
                component="img"
                src={post.image}
                alt={post.title}
                loading="eager"
                fetchPriority="high"
                referrerPolicy="no-referrer"
                sx={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '600px',
                  objectFit: 'cover',
                  borderRadius: { xs: 2, md: 3 },
                  mb: { xs: 3, md: 6 },
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                }}
              />
            )}

            <Box
              sx={{
                typography: 'body1',
                lineHeight: 1.8,
                fontSize: { xs: '1.05rem', md: '1.125rem' },
                color: 'rgba(255, 255, 255, 0.85)',
                '& > *:first-child': {
                  mt: 0,
                },
                '& h2': {
                  mt: { xs: 5, md: 8 },
                  mb: 4,
                  fontWeight: 800,
                  fontSize: '2rem',
                  color: '#fff',
                  scrollMarginTop: '100px',
                },
                '& h3': {
                  mt: { xs: 4, md: 6 },
                  mb: 3,
                  fontWeight: 700,
                  fontSize: '1.5rem',
                  color: '#fff',
                  scrollMarginTop: '100px',
                },
                '& p': { mb: 3 },
                '& ul, & ol': { mb: 4, pl: 3 },
                '& li': { mb: 1.5 },
                '& img': { maxWidth: '100%', height: 'auto', borderRadius: 2, my: 4 },
                '& a': {
                  color: '#00d4ff',
                  textDecoration: 'none',
                  fontWeight: 600,
                  borderBottom: '1px solid transparent',
                  transition: '0.2s',
                  '&:hover': { borderBottomColor: '#00d4ff' },
                },
                '& blockquote': {
                  borderLeft: '4px solid',
                  borderColor: '#7c3aed',
                  pl: 4,
                  ml: 0,
                  my: 6,
                  fontStyle: 'italic',
                  fontSize: '1.25rem',
                  color: '#fff',
                  bgcolor: 'rgba(124, 58, 237, 0.05)',
                  py: 4,
                  borderRadius: '0 16px 16px 0',
                },
              }}
              dangerouslySetInnerHTML={{ __html: processedHtml }}
            />

            {/* Bottom Section */}
            <Divider sx={{ my: { xs: 5, md: 8 }, borderColor: 'rgba(255, 255, 255, 0.08)' }} />

            {/* Article Navigation */}
            <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: { xs: 6, md: 10 } }}>
              <Grid item xs={12} sm={6}>
                {navigation.prev && (
                  <Box
                    component={RouterLink}
                    to={`/blog/${navigation.prev.slug}`}
                    onClick={() => window.scrollTo(0, 0)}
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                      textDecoration: 'none',
                      bgcolor: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      transition: '0.3s',
                      '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)', borderColor: '#00d4ff' },
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ color: 'rgba(255, 255, 255, 0.4)' }}
                    >
                      <ChevronLeftIcon fontSize="small" />
                      <Typography variant="overline" sx={{ fontWeight: 700 }}>
                        Previous Article
                      </Typography>
                    </Stack>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: '#fff',
                        fontWeight: 600,
                        lineClamp: 1,
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 1,
                      }}
                    >
                      {navigation.prev.title}
                    </Typography>
                  </Box>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                {navigation.next && (
                  <Box
                    component={RouterLink}
                    to={`/blog/${navigation.next.slug}`}
                    onClick={() => window.scrollTo(0, 0)}
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                      gap: 1,
                      textDecoration: 'none',
                      bgcolor: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      transition: '0.3s',
                      '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)', borderColor: '#00d4ff' },
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ color: 'rgba(255, 255, 255, 0.4)' }}
                    >
                      <Typography variant="overline" sx={{ fontWeight: 700 }}>
                        Next Article
                      </Typography>
                      <ChevronRightIcon fontSize="small" />
                    </Stack>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: '#fff',
                        fontWeight: 600,
                        textAlign: 'right',
                        lineClamp: 1,
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 1,
                      }}
                    >
                      {navigation.next.title}
                    </Typography>
                  </Box>
                )}
              </Grid>
            </Grid>

            <CTASection type="bottom" />
          </Grid>

          {/* Sidebar */}
          {!isMobile && (
            <Grid item md={4}>
              <TableOfContents items={tocItems} url={canonicalUrl} title={post.title} />
            </Grid>
          )}
        </Grid>
      </Container>

      {/* Related Articles Section */}
      {allBlogs.length > 1 && (
        <Box
          sx={{
            mt: 2,
            pt: { xs: 6, md: 10 },
            pb: { xs: 6, md: 10 },
            bgcolor: 'rgba(255, 255, 255, 0.02)',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          <Container maxWidth="lg">
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              sx={{ fontWeight: 800, mb: 6, textAlign: 'center' }}
            >
              Recommended for you
            </Typography>
            <Grid container spacing={4}>
              {allBlogs
                .filter((b) => b.slug !== slug)
                .slice(0, 3)
                .map((relatedPost) => (
                  <Grid item key={relatedPost.slug} xs={12} sm={6} md={4}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        bgcolor: '#111118',
                        borderRadius: 3,
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        transition: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          transform: 'translateY(-12px)',
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
                        },
                      }}
                    >
                      <Box sx={{ overflow: 'hidden' }}>
                        {relatedPost.image && (
                          <Box
                            component="img"
                            src={relatedPost.image}
                            alt={relatedPost.title}
                            loading="lazy"
                            referrerPolicy="no-referrer"
                            sx={{
                              width: '100%',
                              height: '200px',
                              objectFit: 'cover',
                              transition: '0.3s',
                              '.MuiCard-root:hover &': { transform: 'scale(1.05)' },
                            }}
                          />
                        )}
                      </Box>
                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        <Typography
                          variant="caption"
                          sx={{
                            color: '#00d4ff',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            mb: 1,
                            display: 'block',
                          }}
                        >
                          Article
                        </Typography>
                        <Typography
                          variant="h6"
                          component="h3"
                          sx={{ fontWeight: 700, mb: 2, lineHeight: 1.4 }}
                        >
                          {relatedPost.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            lineHeight: 1.6,
                          }}
                        >
                          {relatedPost.metaDesc}
                        </Typography>
                        <Button
                          component={RouterLink}
                          to={`/blog/${relatedPost.slug}`}
                          onClick={() => window.scrollTo(0, 0)}
                          sx={{
                            mt: 3,
                            p: { xs: '12px 16px', md: 0 },
                            ml: { xs: '-16px', md: 0 },
                            minHeight: { xs: '48px', md: 'auto' },
                            display: 'inline-flex',
                            alignItems: 'center',
                            fontWeight: 700,
                            color: '#00d4ff',
                            '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' },
                          }}
                        >
                          Read Article -&gt;
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
            </Grid>
          </Container>
        </Box>
      )}
    </Box>
  );
};

export default BlogDetail;
