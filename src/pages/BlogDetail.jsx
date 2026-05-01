import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  CircularProgress, 
  Box,
  Button
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getBlogs } from '../api/blog';

const BlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const blogs = await getBlogs();
        const foundPost = blogs.find((b) => b.slug === slug);
        if (foundPost) {
          setPost(foundPost);
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
  }, [slug]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !post) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Typography color="error" variant="h5" gutterBottom>{error || 'Post not found'}</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/blog')} sx={{ mt: 2 }}>
          Back to Blog
        </Button>
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Helmet>
        <title>{post.metaTitle || post.title}</title>
        <meta name="description" content={post.metaDesc || ''} />
      </Helmet>

      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate('/blog')}
        sx={{ mb: 4 }}
        color="inherit"
      >
        Back to Blog
      </Button>

      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        {post.title}
      </Typography>

      {post.date && (
        <Typography variant="subtitle1" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
          {new Date(post.date).toLocaleDateString()}
        </Typography>
      )}

      {post.image && (
        <Box 
          component="img"
          src={post.image}
          alt={post.title}
          sx={{
            width: '100%',
            height: 'auto',
            maxHeight: '500px',
            objectFit: 'cover',
            borderRadius: 2,
            mb: 4,
            boxShadow: (theme) => theme.shadows[4]
          }}
        />
      )}

      <Box 
        sx={{ 
          typography: 'body1',
          lineHeight: 1.8,
          '& img': { maxWidth: '100%', height: 'auto', borderRadius: 2, my: 2 },
          '& h1, & h2, & h3, & h4, & h5, & h6': { mt: 4, mb: 2, fontWeight: 600 },
          '& p': { mb: 2 },
          '& a': { color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } },
          '& blockquote': {
            borderLeft: '4px solid',
            borderColor: 'primary.main',
            pl: 2,
            ml: 0,
            my: 2,
            fontStyle: 'italic',
            color: 'text.secondary'
          }
        }}
        dangerouslySetInnerHTML={{ __html: post.content }} 
      />
    </Container>
  );
};

export default BlogDetail;
