import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Menu as MenuIcon, Close as CloseIcon } from '@mui/icons-material';
import { colors } from '../../theme/theme';

const navItems = [
  { label: 'Services', href: '#services' },
  { label: 'Stats', href: '#stats' },
  { label: 'Contact', href: '#contact' },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ height: '100%', backgroundColor: colors.background.primary }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          borderBottom: `1px solid ${colors.border.light}`,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 800,
            background: colors.accent.gradient,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Aslisite
        </Typography>
        <IconButton onClick={handleDrawerToggle} sx={{ color: colors.text.primary }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List sx={{ pt: 2 }}>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              component="a"
              href={item.href}
              onClick={handleDrawerToggle}
              sx={{
                py: 2,
                px: 3,
                '&:hover': {
                  backgroundColor: 'rgba(0, 212, 255, 0.1)',
                },
              }}
            >
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  sx: { color: colors.text.secondary, fontWeight: 500 },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem sx={{ px: 3, pt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ py: 1.5 }}
          >
            Get Started
          </Button>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <Box
        component="header"
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: scrolled ? 'rgba(10, 10, 15, 0.95)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? `1px solid ${colors.border.light}` : 'none',
          transition: 'all 0.3s ease',
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              py: { xs: 2, md: 2.5 },
            }}
          >
            {/* Logo */}
            <Typography
              variant="h6"
              component="a"
              href="#"
              sx={{
                fontWeight: 800,
                background: colors.accent.gradient,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textDecoration: 'none',
                fontSize: { xs: '1.25rem', md: '1.5rem' },
              }}
            >
              Aslisite
            </Typography>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Box component="nav" sx={{ display: 'flex', gap: 3 }}>
                  {navItems.map((item) => (
                    <Typography
                      key={item.label}
                      component="a"
                      href={item.href}
                      sx={{
                        color: colors.text.secondary,
                        textDecoration: 'none',
                        fontWeight: 500,
                        fontSize: '0.9375rem',
                        transition: 'color 0.2s ease',
                        '&:hover': {
                          color: colors.accent.primary,
                        },
                      }}
                    >
                      {item.label}
                    </Typography>
                  ))}
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  size="medium"
                  sx={{ py: 1, px: 3 }}
                >
                  Get Started
                </Button>
              </Box>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                onClick={handleDrawerToggle}
                sx={{
                  color: colors.text.primary,
                  border: `1px solid ${colors.border.light}`,
                  borderRadius: 2,
                }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Container>
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
            backgroundColor: colors.background.primary,
            borderLeft: `1px solid ${colors.border.light}`,
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;
