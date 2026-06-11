import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import CloseIconImport from '@mui/icons-material/Close';
import KeyboardArrowDownIconImport from '@mui/icons-material/KeyboardArrowDown';
import MenuIconImport from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import { colors } from '../../theme/theme';

const CloseIcon = CloseIconImport.default || CloseIconImport;
const KeyboardArrowDownIcon = KeyboardArrowDownIconImport.default || KeyboardArrowDownIconImport;
const MenuIcon = MenuIconImport.default || MenuIconImport;

const navItems = [
  { label: 'Services', href: '/#services' },
  { label: 'Our Product', href: '/#product' },
  { label: 'Reviews', href: '/#testimonials' },
  { label: 'Blog', href: '/blog' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'Contact', href: '/#contact' },
];

const productItems = [
  { label: 'Aslibooks', href: 'https://www.aslibooks.com/', description: 'Invoice Software' },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileOpenProducts, setMobileOpenProducts] = useState(false);

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
    <Box
      sx={{
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(10, 10, 15, 0.95)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        flexDirection: 'column',
        '@keyframes fadeIn': {
          from: { opacity: 0, transform: 'translateY(-10px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      {/* Header with Logo and Close */}
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, pt: 3 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            component="img"
            src="/AslisiteLogo.svg"
            alt="Aslisite"
            sx={{ width: 36, height: 36 }}
          />
          <Typography
            sx={{
              fontFamily: '"Sora", "Inter", sans-serif',
              fontWeight: 800,
              fontSize: '1.25rem',
              background: colors.accent.brandGradient,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Aslisite
          </Typography>
        </Box>
        <IconButton
          onClick={handleDrawerToggle}
          sx={{
            width: 48,
            height: 48,
            color: colors.text.primary,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 2,
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              transform: 'scale(1.05)',
            },
          }}
        >
          <CloseIcon sx={{ fontSize: 24 }} />
        </IconButton>
      </Box>

      {/* Menu Items */}
      <List sx={{ flex: 1, px: 3, pt: 2 }}>
        {navItems.map((item) => (
          <Box key={item.label}>
            {item.hasDropdown ? (
              <Box sx={{ width: '100%' }}>
                <ListItemButton
                  onClick={() => setMobileOpenProducts(!mobileOpenProducts)}
                  sx={{
                    py: 2.5,
                    px: 3,
                    borderRadius: 2,
                    transition: 'background-color 0.2s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    },
                  }}
                >
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      sx: { color: colors.text.primary, fontWeight: 500, fontSize: '1.25rem' },
                    }}
                  />
                  <KeyboardArrowDownIcon
                    sx={{
                      color: colors.accent.primary,
                      fontSize: 20,
                      transform: mobileOpenProducts ? 'rotate(180deg)' : 'rotate(0)',
                      transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  />
                </ListItemButton>
                {mobileOpenProducts && (
                  <Box sx={{ pl: 3, animation: 'fadeIn 0.2s ease' }}>
                    {productItems.map((product) => (
                      <Box
                        key={product.label}
                        component="a"
                        href={product.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleDrawerToggle}
                        sx={{
                          display: 'block',
                          py: 1.5,
                          px: 3,
                          textDecoration: 'none',
                          color: colors.text.secondary,
                          transition: 'color 0.2s ease',
                          '&:hover': {
                            color: colors.accent.primary,
                          },
                        }}
                      >
                        <Typography sx={{ fontWeight: 500, fontSize: '1rem', color: 'inherit' }}>
                          {product.label}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            ) : (
              <ListItemButton
                component={Link}
                to={item.href}
                onClick={handleDrawerToggle}
                sx={{
                  py: 2.5,
                  px: 3,
                  borderRadius: 2,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  },
                }}
              >
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    sx: { color: colors.text.primary, fontWeight: 500, fontSize: '1.25rem' },
                  }}
                />
              </ListItemButton>
            )}
          </Box>
        ))}
      </List>

      {/* Divider */}
      <Box sx={{ mx: 3, borderBottom: `1px solid ${colors.border.light}`, opacity: 0.5 }} />

      {/* Footer Button */}
      <Box sx={{ p: 3 }}>
        <Button
          variant="contained"
          fullWidth
          size="large"
          component="a"
          href="https://wa.me/919495664173?text=Hi%20Aslisite,%20I'm%20interested%20in%20starting%20a%20project!"
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleDrawerToggle}
          sx={{
            py: 2.2,
            fontSize: '1.1rem',
            fontWeight: 600,
            background: colors.accent.gradient,
            borderRadius: 2.5,
            boxShadow: '0 4px 20px rgba(0, 212, 255, 0.3), 0 0 30px rgba(0, 212, 255, 0.15)',
            transition: 'background 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease',
            '&:hover': {
              background: colors.accent.gradient,
              boxShadow: '0 6px 28px rgba(0, 212, 255, 0.45), 0 0 40px rgba(0, 212, 255, 0.2)',
              transform: 'translateY(-2px)',
            },
          }}
        >
          Get Started
        </Button>
      </Box>
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
          transition:
            'background-color 0.3s ease, backdrop-filter 0.3s ease, border-bottom 0.3s ease',
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
            <Box
              component={Link}
              to="/#hero"
              sx={{ display: 'flex', alignItems: 'center', gap: 1.5, textDecoration: 'none' }}
            >
              <Box
                component="img"
                src="/AslisiteLogo.svg"
                alt="Aslisite"
                sx={{ width: { xs: 32, md: 40 }, height: { xs: 32, md: 40 } }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  background: colors.accent.brandGradient,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: { xs: '1.25rem', md: '1.5rem' },
                }}
              >
                Aslisite
              </Typography>
            </Box>

            {/* Desktop Navigation */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 4 }}>
              <Box component="nav" sx={{ display: 'flex', gap: 3 }}>
                {navItems.map((item) => (
                  <Box
                    key={item.label}
                    sx={{ position: 'relative', py: 1 }}
                    onMouseEnter={() => item.hasDropdown && setOpenDropdown('products')}
                    onMouseLeave={() => item.hasDropdown && setOpenDropdown(null)}
                  >
                    {item.hasDropdown ? (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          cursor: 'pointer',
                        }}
                      >
                        <Typography
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
                        <KeyboardArrowDownIcon
                          sx={{
                            fontSize: '1rem',
                            color: colors.text.secondary,
                            transform: openDropdown === 'products' ? 'rotate(180deg)' : 'rotate(0)',
                            transition: 'transform 0.2s ease',
                          }}
                        />
                      </Box>
                    ) : (
                      <Typography
                        component={Link}
                        to={item.href}
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
                    )}
                    {item.hasDropdown && openDropdown === 'products' && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          mt: 0.5,
                          pt: 1,
                          py: 1,
                          px: 1,
                          minWidth: 220,
                          backgroundColor: colors.background.primary,
                          border: `1px solid ${colors.border.light}`,
                          borderRadius: 2,
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                          zIndex: 1001,
                        }}
                      >
                        {productItems.map((product) => (
                          <Box
                            key={product.label}
                            component="a"
                            href={product.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                              display: 'block',
                              px: 2,
                              py: 1.25,
                              borderRadius: 1,
                              textDecoration: 'none',
                              '&:hover': {
                                backgroundColor: 'rgba(0, 212, 255, 0.1)',
                              },
                            }}
                          >
                            <Typography
                              sx={{
                                color: colors.text.primary,
                                fontWeight: 500,
                                fontSize: '0.875rem',
                              }}
                            >
                              {product.label}
                            </Typography>
                            <Typography
                              sx={{ color: colors.text.secondary, fontSize: '0.75rem', mt: 0.25 }}
                            >
                              {product.description}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>
              <Button
                variant="contained"
                color="primary"
                size="medium"
                component="a"
                href="https://wa.me/919495664173?text=Hi%20Aslisite,%20I'm%20interested%20in%20starting%20a%20project!"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ py: 1, px: 3 }}
              >
                Get Started
              </Button>
            </Box>

            {/* Mobile Menu Button */}
            <IconButton
              aria-label="Open menu"
              onClick={handleDrawerToggle}
              sx={{
                display: { xs: 'inline-flex', md: 'none' },
                color: colors.text.primary,
                border: `1px solid ${colors.border.light}`,
                borderRadius: 2,
              }}
            >
              <MenuIcon />
            </IconButton>
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
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
          },
          '& .MuiDrawer-paper': {
            width: '100%',
            maxWidth: 320,
            backgroundColor: 'transparent',
            boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.5)',
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;
