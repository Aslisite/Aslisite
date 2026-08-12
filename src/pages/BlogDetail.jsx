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
  LinearProgress,
  IconButton,
  Stack,
  Collapse,
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
import ListAltImport from '@mui/icons-material/ListAlt';
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
const ListAltIcon = ListAltImport.default || ListAltImport;

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
      setScroll((winScroll / height) * 100);
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
          '& .MuiLinearProgress-bar': { background: colors.accent.gradient },
        }}
      />
    </Box>
  );
};

/* Floating Share Bar (left gutter on desktop) */
const FloatingShareBar = ({ url, title }) => (
  <Box
    sx={{
      position: 'sticky',
      top: 120,
      display: { xs: 'none', lg: 'flex' },
      flexDirection: 'column',
      gap: 1.5,
      alignItems: 'center',
    }}
  >
    <Typography
      variant="caption"
      sx={{
        writingMode: 'vertical-rl',
        transform: 'rotate(180deg)',
        color: colors.text.muted,
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        fontSize: '0.62rem',
        mb: 1,
      }}
    >
      Share
    </Typography>
    <IconButton
      size="small"
      component="a"
      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        color: colors.text.muted,
        border: `1px solid ${colors.border.light}`,
        width: 36,
        height: 36,
        '&:hover': { color: colors.accent.secondary, borderColor: colors.accent.secondary },
      }}
    >
      <TwitterIcon sx={{ fontSize: 16 }} />
    </IconButton>
    <IconButton
      size="small"
      component="a"
      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        color: colors.text.muted,
        border: `1px solid ${colors.border.light}`,
        width: 36,
        height: 36,
        '&:hover': { color: '#0077b5', borderColor: '#0077b5' },
      }}
    >
      <LinkedInIcon sx={{ fontSize: 16 }} />
    </IconButton>
    <IconButton
      size="small"
      component="a"
      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        color: colors.text.muted,
        border: `1px solid ${colors.border.light}`,
        width: 36,
        height: 36,
        '&:hover': { color: '#1877f2', borderColor: '#1877f2' },
      }}
    >
      <FacebookIcon sx={{ fontSize: 16 }} />
    </IconButton>
  </Box>
);

/* Collapsible TOC (inline, above content) */
const InlineTOC = ({ items }) => {
  const [open, setOpen] = useState(false);

  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      window.scrollTo({ top: elementRect - bodyRect - offset, behavior: 'smooth' });
    }
    setOpen(false);
  };

  if (!items.length) return null;

  return (
    <Box
      sx={{
        mb: 5,
        border: `1px solid ${colors.border.light}`,
        borderRadius: 3,
        overflow: 'hidden',
        backgroundColor: '#f8fafc',
      }}
    >
      <Box
        onClick={() => setOpen(!open)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          py: 2,
          cursor: 'pointer',
          transition: 'background-color 0.2s ease',
          '&:hover': { backgroundColor: '#f1f5f9' },
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <ListAltIcon sx={{ fontSize: 20, color: colors.accent.primary }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: colors.text.primary }}>
            Table of Contents
          </Typography>
          <Chip
            label={`${items.length} sections`}
            size="small"
            sx={{
              height: 20,
              fontSize: '0.65rem',
              fontWeight: 600,
              bgcolor: '#e2e8f0',
              color: colors.text.muted,
            }}
          />
        </Stack>
        <Typography
          variant="caption"
          sx={{ color: colors.text.muted, fontWeight: 600, userSelect: 'none' }}
        >
          {open ? 'Hide' : 'Show'}
        </Typography>
      </Box>
      <Collapse in={open}>
        <Box sx={{ px: 3, pb: 2.5, pt: 0.5 }}>
          {items.map((item, idx) => (
            <Box
              key={item.id}
              onClick={() => handleScroll(item.id)}
              sx={{
                py: 1,
                pl: item.level === 3 ? 3 : 0,
                cursor: 'pointer',
                borderBottom: idx < items.length - 1 ? `1px solid ${colors.border.light}` : 'none',
                transition: 'color 0.2s ease',
                '&:hover': { color: colors.accent.primary },
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontSize: '0.88rem',
                  fontWeight: item.level === 2 ? 600 : 400,
                  color: 'inherit',
                }}
              >
                {item.text}
              </Typography>
            </Box>
          ))}
        </Box>
      </Collapse>
    </Box>
  );
};

/* CTA Section */
const CTASection = () => (
  <Box
    sx={{
      my: 8,
      p: { xs: 4, md: 6 },
      borderRadius: 4,
      background: colors.accent.primary,
      textAlign: 'center',
      boxShadow: '0 12px 32px rgba(109, 40, 217, 0.12)',
    }}
  >
    <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, color: '#fff' }}>
      Ready to scale your digital presence?
    </Typography>
    <Typography
      variant="body1"
      sx={{ mb: 4, color: 'rgba(255, 255, 255, 0.9)', maxWidth: '550px', mx: 'auto' }}
    >
      Join businesses growing with Aslisite. Let&apos;s discuss your project today.
    </Typography>
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
      <Button
        variant="contained"
        size="large"
        sx={{
          background: '#ffffff',
          color: colors.text.primary,
          fontWeight: 700,
          px: 4,
          boxShadow: 'none',
          '&:hover': { background: '#f1f5f9', boxShadow: 'none' },
        }}
        component="a"
        href="https://wa.me/919495664173"
        target="_blank"
      >
        Get Started Now
      </Button>
      <Button
        variant="outlined"
        size="large"
        sx={{
          borderColor: 'rgba(255, 255, 255, 0.6)',
          color: '#fff',
          fontWeight: 700,
          px: 4,
          '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.15)' },
        }}
        component={RouterLink}
        to="/#contact"
      >
        Contact Us
      </Button>
    </Stack>
  </Box>
);

// --- Main Component ---

const BlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress thickness={4} size={50} sx={{ color: colors.accent.primary }} />
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
        <Typography variant="h2" sx={{ fontWeight: 800, mb: 2 }}>404</Typography>
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
    <Box sx={{ bgcolor: colors.background.primary }}>
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
            mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
            headline: post.title,
            description: post.metaDesc || '',
            image: post.image ? [post.image] : [siteMetadata.logo],
            datePublished: post.date || undefined,
            dateModified: post.updatedAt || post.date || undefined,
            author: { '@type': 'Organization', name: siteMetadata.legalName, url: siteMetadata.baseUrl },
            publisher: {
              '@type': 'Organization',
              name: siteMetadata.legalName,
              logo: { '@type': 'ImageObject', url: siteMetadata.logo },
            },
            articleSection: post.category || 'Digital Strategy',
            wordCount: plainContent ? plainContent.split(/\s+/).length : undefined,
          })}
        </script>
      </Helmet>

      {/* ─── Minimal Hero ─── */}
      <Container maxWidth="md" sx={{ pt: { xs: 12, md: 16 }, pb: { xs: 3, md: 5 } }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/blog')}
          sx={{
            mb: 4,
            color: colors.text.muted,
            fontWeight: 500,
            '&:hover': { color: colors.text.primary },
          }}
        >
          Back to Blog
        </Button>

        <Chip
          label={post.category || 'Digital Strategy'}
          sx={{
            mb: 3,
            bgcolor: 'rgba(124, 58, 237, 0.07)',
            color: colors.accent.primary,
            border: '1px solid rgba(124, 58, 237, 0.15)',
            fontWeight: 700,
            fontSize: '0.72rem',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        />

        <Typography
          variant="h1"
          sx={{
            fontWeight: 800,
            fontSize: { xs: '2rem', sm: '2.6rem', md: '3.2rem' },
            lineHeight: 1.1,
            mb: 3,
            color: colors.text.primary,
            letterSpacing: '-0.02em',
          }}
        >
          {post.title}
        </Typography>

        <Typography
          variant="h6"
          sx={{
            color: colors.text.secondary,
            fontWeight: 400,
            mb: 4,
            lineHeight: 1.6,
            fontSize: { xs: '1rem', md: '1.15rem' },
          }}
        >
          {post.metaDesc}
        </Typography>

        {/* Author + Meta */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 2, sm: 4 }}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          sx={{ mb: 5 }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar sx={{ width: 38, height: 38, bgcolor: colors.accent.primary, fontSize: '0.85rem', fontWeight: 700 }}>
              A
            </Avatar>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 700, color: colors.text.primary, lineHeight: 1.3 }}>
                Aslisite Team
              </Typography>
              <Typography variant="caption" sx={{ color: colors.text.muted }}>Digital Experts</Typography>
            </Box>
          </Stack>

          <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />

          <Stack direction="row" spacing={2.5} sx={{ color: colors.text.muted }}>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <CalendarTodayIcon sx={{ fontSize: 15 }} />
              <Typography variant="caption" sx={{ fontWeight: 500 }}>
                {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <AccessTimeIcon sx={{ fontSize: 15 }} />
              <Typography variant="caption" sx={{ fontWeight: 500 }}>{readTime} min read</Typography>
            </Stack>
          </Stack>
        </Stack>
      </Container>

      {/* ─── Featured Image (breaks out wider) ─── */}
      {post.image && (
        <Container maxWidth="lg" sx={{ mb: { xs: 4, md: 7 } }}>
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
              maxHeight: 520,
              objectFit: 'cover',
              borderRadius: { xs: 2, md: 4 },
              boxShadow: '0 16px 48px rgba(0, 0, 0, 0.08)',
            }}
          />
        </Container>
      )}

      {/* ─── Content Area with Floating Share ─── */}
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', gap: { md: 4, lg: 6 }, justifyContent: 'center' }}>
          {/* Left gutter — floating share */}
          <Box sx={{ width: 48, flexShrink: 0, display: { xs: 'none', lg: 'block' } }}>
            <FloatingShareBar url={canonicalUrl} title={post.title} />
          </Box>

          {/* Main reading column */}
          <Box sx={{ maxWidth: 720, width: '100%', minWidth: 0 }}>
            {/* Inline TOC */}
            <InlineTOC items={tocItems} />

            {/* Article Body */}
            <Box
              sx={{
                typography: 'body1',
                lineHeight: 1.85,
                fontSize: { xs: '1.05rem', md: '1.125rem' },
                color: colors.text.secondary,
                '& > *:first-child': { mt: 0 },
                '& h2': {
                  mt: { xs: 5, md: 7 },
                  mb: 3,
                  fontWeight: 800,
                  fontSize: { xs: '1.6rem', md: '1.85rem' },
                  color: colors.text.primary,
                  scrollMarginTop: '100px',
                  letterSpacing: '-0.01em',
                },
                '& h3': {
                  mt: { xs: 4, md: 5 },
                  mb: 2.5,
                  fontWeight: 700,
                  fontSize: { xs: '1.25rem', md: '1.4rem' },
                  color: colors.text.primary,
                  scrollMarginTop: '100px',
                },
                '& p': { mb: 3.5 },
                '& ul, & ol': { mb: 4, pl: 3 },
                '& li': { mb: 1.5 },
                '& img': {
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: 2,
                  my: 4,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                },
                '& a': {
                  color: colors.accent.primary,
                  textDecoration: 'none',
                  fontWeight: 600,
                  borderBottom: `1px solid rgba(124, 58, 237, 0.3)`,
                  transition: '0.2s',
                  '&:hover': { borderBottomColor: colors.accent.primary },
                },
                '& table': {
                  display: 'block',
                  overflowX: 'auto',
                  maxWidth: '100%',
                  borderCollapse: 'collapse',
                  my: 4,
                  fontSize: '0.9rem',
                  '& th, & td': {
                    border: `1px solid ${colors.border.light}`,
                    px: 2,
                    py: 1.5,
                    textAlign: 'left',
                    verticalAlign: 'top',
                    minWidth: '110px',
                  },
                  '& th': { backgroundColor: '#f8fafc', fontWeight: 700, color: colors.text.primary },
                  '& td': { color: colors.text.secondary },
                  '& tr:hover td': { backgroundColor: '#fafbfc' },
                },
                '& blockquote': {
                  borderLeft: '4px solid',
                  borderColor: colors.accent.primary,
                  pl: 4,
                  ml: 0,
                  my: 6,
                  fontStyle: 'normal',
                  fontSize: '1.2rem',
                  fontWeight: 500,
                  color: colors.text.primary,
                  bgcolor: 'rgba(124, 58, 237, 0.03)',
                  py: 3,
                  pr: 3,
                  borderRadius: '0 12px 12px 0',
                  lineHeight: 1.7,
                },
                '& pre': {
                  backgroundColor: '#1e293b',
                  color: '#e2e8f0',
                  borderRadius: 2,
                  p: 3,
                  overflowX: 'auto',
                  fontSize: '0.88rem',
                  my: 4,
                },
                '& code': {
                  backgroundColor: '#f1f5f9',
                  color: colors.accent.primary,
                  px: 0.8,
                  py: 0.2,
                  borderRadius: 1,
                  fontSize: '0.88em',
                  fontWeight: 500,
                },
                '& pre code': {
                  backgroundColor: 'transparent',
                  color: 'inherit',
                  px: 0,
                  py: 0,
                },
              }}
              dangerouslySetInnerHTML={{ __html: processedHtml }}
            />

            {/* Mobile Share */}
            <Box sx={{ display: { xs: 'flex', lg: 'none' }, gap: 1.5, my: 5, justifyContent: 'center' }}>
              <IconButton
                size="small"
                component="a"
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(canonicalUrl)}&text=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: colors.text.muted, border: `1px solid ${colors.border.light}`, '&:hover': { color: colors.accent.secondary } }}
              >
                <TwitterIcon sx={{ fontSize: 18 }} />
              </IconButton>
              <IconButton
                size="small"
                component="a"
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(canonicalUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: colors.text.muted, border: `1px solid ${colors.border.light}`, '&:hover': { color: '#0077b5' } }}
              >
                <LinkedInIcon sx={{ fontSize: 18 }} />
              </IconButton>
              <IconButton
                size="small"
                component="a"
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(canonicalUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: colors.text.muted, border: `1px solid ${colors.border.light}`, '&:hover': { color: '#1877f2' } }}
              >
                <FacebookIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>

            <Divider sx={{ my: 6, borderColor: colors.border.light }} />

            {/* ─── Prev / Next Navigation ─── */}
            <Grid container spacing={3} sx={{ mb: 6 }}>
              <Grid item xs={12} sm={6}>
                {navigation.prev && (
                  <Box
                    component={RouterLink}
                    to={`/blog/${navigation.prev.slug}`}
                    onClick={() => window.scrollTo(0, 0)}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1.5,
                      p: 3,
                      borderRadius: 3,
                      textDecoration: 'none',
                      border: `1px solid ${colors.border.light}`,
                      transition: '0.3s',
                      height: '100%',
                      '&:hover': {
                        borderColor: colors.accent.primary,
                        boxShadow: '0 8px 24px rgba(124, 58, 237, 0.06)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: colors.text.muted }}>
                      <ChevronLeftIcon sx={{ fontSize: 18 }} />
                      <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Previous
                      </Typography>
                    </Stack>
                    <Typography variant="subtitle2" sx={{ color: colors.text.primary, fontWeight: 600, lineHeight: 1.4 }}>
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
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                      gap: 1.5,
                      p: 3,
                      borderRadius: 3,
                      textDecoration: 'none',
                      border: `1px solid ${colors.border.light}`,
                      transition: '0.3s',
                      height: '100%',
                      '&:hover': {
                        borderColor: colors.accent.primary,
                        boxShadow: '0 8px 24px rgba(124, 58, 237, 0.06)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: colors.text.muted }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Next
                      </Typography>
                      <ChevronRightIcon sx={{ fontSize: 18 }} />
                    </Stack>
                    <Typography variant="subtitle2" sx={{ color: colors.text.primary, fontWeight: 600, textAlign: 'right', lineHeight: 1.4 }}>
                      {navigation.next.title}
                    </Typography>
                  </Box>
                )}
              </Grid>
            </Grid>

            <CTASection />
          </Box>

          {/* Right spacer for symmetry */}
          <Box sx={{ width: 48, flexShrink: 0, display: { xs: 'none', lg: 'block' } }} />
        </Box>
      </Container>

      {/* ─── Related Articles ─── */}
      {allBlogs.length > 1 && (
        <Box
          sx={{
            mt: 4,
            pt: { xs: 6, md: 8 },
            pb: { xs: 6, md: 8 },
            bgcolor: '#f8fafc',
            borderTop: `1px solid ${colors.border.light}`,
          }}
        >
          <Container maxWidth="lg">
            <Typography
              variant="h5"
              component="h2"
              sx={{ fontWeight: 800, mb: 5, textAlign: 'center', color: colors.text.primary }}
            >
              Continue Reading
            </Typography>
            <Grid container spacing={3}>
              {allBlogs
                .filter((b) => b.slug !== slug)
                .slice(0, 3)
                .map((relatedPost) => (
                  <Grid item key={relatedPost.slug} xs={12} sm={6} md={4}>
                    <Card
                      component={RouterLink}
                      to={`/blog/${relatedPost.slug}`}
                      onClick={() => window.scrollTo(0, 0)}
                      sx={{
                        textDecoration: 'none',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 3,
                        overflow: 'hidden',
                        transition: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          transform: 'translateY(-6px)',
                          boxShadow: '0 16px 32px rgba(0, 0, 0, 0.08)',
                          '& .related-img': { transform: 'scale(1.05)' },
                        },
                      }}
                    >
                      <Box sx={{ overflow: 'hidden', aspectRatio: '16/10' }}>
                        {relatedPost.image && (
                          <Box
                            component="img"
                            className="related-img"
                            src={relatedPost.image}
                            alt={relatedPost.title}
                            loading="lazy"
                            referrerPolicy="no-referrer"
                            sx={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              transition: '0.4s',
                            }}
                          />
                        )}
                      </Box>
                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        <Typography
                          variant="caption"
                          sx={{
                            color: colors.accent.primary,
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                            mb: 1,
                            display: 'block',
                          }}
                        >
                          {relatedPost.category || 'Article'}
                        </Typography>
                        <Typography
                          variant="h6"
                          component="h3"
                          sx={{
                            fontWeight: 700,
                            mb: 1.5,
                            lineHeight: 1.35,
                            fontSize: '1.05rem',
                            color: colors.text.primary,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {relatedPost.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: colors.text.secondary,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            lineHeight: 1.6,
                            fontSize: '0.88rem',
                          }}
                        >
                          {relatedPost.metaDesc}
                        </Typography>
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
