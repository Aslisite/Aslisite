import { Box, Container, Typography, useTheme, useMediaQuery, List, ListItem, ListItemIcon, ListItemText, Stack, Button, Grid } from '@mui/material';
import { colors } from '../../theme/theme';
import { ReceiptLong, AccountBalance, TrendingUp, Speed, ArrowForward } from '@mui/icons-material';

const features = [
  { icon: <ReceiptLong />, text: 'Easy Invoice Creation' },
  { icon: <AccountBalance />, text: 'GST-Ready Billing' },
  { icon: <TrendingUp />, text: 'Expense & Payment Tracking' },
  { icon: <Speed />, text: 'Simple Dashboard Insights' }
];

const Stats = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      component="section"
      id="stats"
      tabIndex="-1"
      sx={{
        pt: { xs: 6, md: 8 },
        pb: { xs: 6, md: 8 },
        backgroundColor: colors.background.primary,
        position: 'relative',
        overflow: 'hidden',
        scrollMarginTop: '80px',
        borderBottom: `1px solid ${colors.border.light}`,
      }}
    >
      {/* Background Gradient */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          right: '0%', // Moved towards the image side
          transform: 'translate(20%, -50%)',
          width: '800px',
          height: '800px',
          background: `radial-gradient(circle, rgba(0, 212, 255, 0.08) 0%, transparent 60%)`,
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }}
      />
      
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Section Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 }, maxWidth: '900px', mx: 'auto' }}>
          <Typography
            variant="overline"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              mb: 2,
              px: 2.5,
              py: 1,
              borderRadius: 2,
              backgroundColor: 'rgba(0, 212, 255, 0.1)',
              color: colors.accent.primary,
              border: `1px solid rgba(0, 212, 255, 0.2)`,
              fontSize: { xs: '0.7rem', sm: '0.75rem' },
              letterSpacing: '0.1em',
              fontWeight: 600,
            }}
          >
            Our Product
          </Typography>
          
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
              fontWeight: 800,
              mb: 2,
              color: colors.text.primary,
              lineHeight: 1.2
            }}
          >
            AsliBooks – Smart Invoicing & GST Solution for Growing Businesses
          </Typography>
          
          <Typography
            variant="h6"
            sx={{
              color: colors.text.secondary,
              fontWeight: 400,
              fontSize: { xs: '1rem', md: '1.125rem' },
              lineHeight: 1.6,
            }}
          >
            Simplify billing, manage GST, and track your business finances — all in one place.
          </Typography>
        </Box>

        <Grid container spacing={{ xs: 6, md: 3 }} alignItems="center">
          
          {/* Left Column: Content */}
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <List sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {features.map((feature, idx) => (
                <ListItem 
                  key={idx} 
                  disablePadding 
                  sx={{
                    transition: 'transform 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <ListItemIcon sx={{ color: colors.accent.primary, minWidth: 40 }}>
                    {feature.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={feature.text} 
                    primaryTypographyProps={{ 
                      fontSize: '1rem', 
                      fontWeight: 500, 
                      color: colors.text.primary 
                    }} 
                  />
                </ListItem>
              ))}
            </List>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 1 }}>
              <Button
                variant="contained"
                size="large"
                component="a"
                href="https://www.aslibooks.com/"
                target="_blank"
                rel="noopener noreferrer"
                endIcon={<ArrowForward />}
                sx={{
                  py: 1.5,
                  px: 4,
                  fontSize: '1rem',
                  fontWeight: 600,
                  background: colors.accent.gradient,
                  borderRadius: 2,
                  boxShadow: '0 4px 20px rgba(0, 212, 255, 0.3)',
                  transition: 'background 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease',
                  '&:hover': {
                    background: colors.accent.gradient,
                    boxShadow: '0 6px 28px rgba(0, 212, 255, 0.45)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Try AsliBooks
              </Button>
            </Stack>
          </Grid>

          {/* Right Column: Visual Mockup */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                position: 'relative',
                display: 'flex',
                justifyContent: { xs: 'center', md: 'flex-start' },
                alignItems: 'center',
                perspective: '1000px',
              }}
            >
              {/* Decorative Blur Effect Base Frame */}
              <Box 
                 sx={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: { xs: '100%', md: '600px' },
                    borderRadius: 2,
                    overflow: 'hidden',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: `1px solid rgba(255, 255, 255, 0.1)`,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    transform: { xs: 'none', md: 'rotateY(-5deg) rotateX(2deg)' },
                    transition: 'transform 0.5s ease',
                    '&:hover': {
                      transform: { xs: 'none', md: 'rotateY(0deg) rotateX(0deg)' },
                    }
                 }}
              >
                {/* Top Window Actions (fake dot buttons) */}
                <Box sx={{ display: 'flex', gap: 1, px: 2, py: 1.5, borderBottom: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(255, 255, 255, 0.01)' }}>
                   <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#ff5f56' }} />
                   <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#ffbd2e' }} />
                   <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#27c93f' }} />
                </Box>
                
                {/* Image Wrapper */}
                <Box 
                  sx={{ 
                    bgcolor: '#0f172a' 
                  }}
                >
                   <Box
                     component="img"
                     src="/aslibooks-dashboard.png"
                     alt="AsliBooks Dashboard Mockup"
                     sx={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                        opacity: 0.9,
                     }}
                   />
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Trust Badges Line */}
        <Box
          sx={{
            mt: { xs: 6, md: 8 },
            pt: { xs: 3, md: 4 },
            borderTop: `1px solid ${colors.border.light}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography 
            variant="subtitle2" 
            sx={{ 
              color: colors.text.muted,
              letterSpacing: 1,
              fontWeight: 500,
              fontSize: { xs: '0.8rem', md: '0.9rem' }
            }}
          >
            Built for small businesses, freelancers, and startups
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Stats;
