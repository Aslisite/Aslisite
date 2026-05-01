import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  CircularProgress, 
  Box 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getBlogs } from '../api/blog';
import { colors } from '../theme/theme';
import { SectionBadge } from '../components/common';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
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
  }, []);

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

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Helmet>
        <title>Blog - Aslisite</title>
        <meta name="description" content="Read our latest articles, insights, and updates." />
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
        {blogs.map((blog) => (
          <Grid item key={blog.slug || blog.title} xs={12} sm={6} md={4}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: (theme) => theme.shadows[8],
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                  {blog.title}
                </Typography>
                
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    mb: 2, 
                    flexGrow: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical'
                  }}
                >
                  {blog.metaDesc}
                </Typography>
                
                <Button 
                  variant="outlined" 
                  color="primary"
                  onClick={() => navigate(`/blog/${blog.slug}`)}
                  sx={{ alignSelf: 'flex-start', mt: 'auto' }}
                >
                  Read More
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Blog;
