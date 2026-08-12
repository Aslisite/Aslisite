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
import { Link, useLocation } from 'react-router-dom';
import { colors } from '../../theme/theme';

const brandNameStyle = {
  fontFamily: '"Space Grotesk", "Inter", sans-serif',
  color: colors.text.primary,
  fontWeight: 800,
  display: 'inline',
};

const BrandName = ({ fontSize = '1.25rem' }) => (
  <span style={{ ...brandNameStyle, fontSize }}>
    Aslisite
    <span style={{ color: colors.accent.primary }}>.</span>
  </span>
);

const CloseIcon = CloseIconImport.default || CloseIconImport;
const KeyboardArrowDownIcon = KeyboardArrowDownIconImport.default || KeyboardArrowDownIconImport;
const MenuIcon = MenuIconImport.default || MenuIconImport;

const navItems = [
  { label: 'Services', href: '/#services' },
  { label: 'Products', href: '/#aslibooks', hasDropdown: true },
  { label: 'Reviews', href: '/#testimonials' },
  { label: 'Blog', href: '/blog' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'Contact', href: '/#contact' },
];

const productItems = [
  { label: 'AsliBooks', href: '/#aslibooks', description: 'Smart Invoicing & GST Solution' },
  {
    label: 'Sheet Automation',
    href: '/products/sheet-automation',
    description: 'Free Payment Reminder script',
  },
];

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileOpenProducts, setMobileOpenProducts] = useState(false);
  const [safeAreaTop, setSafeAreaTop] = useState('0px');
  const [isScrolled, setIsScrolled] = useState(false);
  const isHomePage = location.pathname === '/';
  const isTransparent = isHomePage && !isScrolled;

  useEffect(() => {
    const el = document.createElement('div');
    el.style.position = 'fixed';
    el.style.top = '0';
    el.style.paddingTop = 'env(safe-area-inset-top, 0px)';
    el.style.visibility = 'hidden';
    el.style.pointerEvents = 'none';
    document.body.appendChild(el);
    const value = getComputedStyle(el).paddingTop;
    document.body.removeChild(el);
    if (value && value !== '0px') {
      setSafeAreaTop(value);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        backgroundColor: '#ffffff',
        backdropFilter: 'blur(12px)',
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
              fontFamily: '"Space Grotesk", "Inter", sans-serif',
              fontWeight: 800,
              fontSize: '1.25rem',
              color: colors.text.primary,
            }}
          >
            Aslisite<span style={{ color: colors.accent.primary }}>.</span>
          </Typography>
        </Box>
        <IconButton
          onClick={handleDrawerToggle}
          sx={{
            width: 48,
            height: 48,
            color: colors.text.primary,
            backgroundColor: '#f1f5f9',
            borderRadius: 2,
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: '#e2e8f0',
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
                      backgroundColor: '#f1f5f9',
                    },
                  }}
                >
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      sx: {
                        color: colors.text.primary,
                        fontWeight: 600,
                        fontSize: '1.25rem',
                      },
                    }}
                  />
                  <KeyboardArrowDownIcon
                    sx={{
                      color: colors.text.muted,
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
                        component={Link}
                        to={product.href}
                        onClick={() => {
                          handleDrawerToggle();
                          setMobileOpenProducts(false);
                        }}
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
                        <Typography
                          sx={{
                            fontFamily: '"Inter", sans-serif',
                            fontWeight: 500,
                            fontSize: '1rem',
                            color: 'inherit',
                          }}
                        >
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
                    backgroundColor: '#f1f5f9',
                  },
                }}
              >
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    sx: {
                      color: colors.text.primary,
                      fontWeight: 600,
                      fontSize: '1.25rem',
                    },
                  }}
                />
              </ListItemButton>
            )}
          </Box>
        ))}
      </List>

      {/* Divider */}
      <Box sx={{ mx: 3, borderBottom: `1px solid ${colors.border.light}` }} />

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
            fontFamily: '"Inter", sans-serif',
            fontWeight: 600,
            background: colors.accent.gradient,
            borderRadius: 2.5,
            boxShadow: '0 4px 20px rgba(124, 58, 237, 0.2)',
            transition: 'background 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease',
            '&:hover': {
              background: colors.accent.gradient,
              boxShadow: '0 6px 28px rgba(124, 58, 237, 0.3)',
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
        style={{ paddingTop: safeAreaTop }}
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: isTransparent ? 'transparent' : colors.background.navbar,
          backdropFilter: isTransparent ? 'blur(0px)' : 'blur(12px)',
          WebkitBackdropFilter: isTransparent ? 'blur(0px)' : 'blur(12px)',
          borderBottom: `1px solid ${
            isTransparent ? 'transparent' : colors.border.light
          }`,
          boxShadow: isTransparent
            ? 'none'
            : '0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
          transition:
            'background-color 0.28s ease, border-color 0.28s ease, box-shadow 0.28s ease, backdrop-filter 0.28s ease',
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              py: isTransparent ? 2.5 : 1.75,
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
                sx={{ width: 36, height: 36 }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontFamily: '"Space Grotesk", "Inter", sans-serif',
                  color: colors.text.primary,
                  fontWeight: 800,
                  fontSize: { xs: '1.25rem', md: '1.5rem' },
                  display: { xs: 'none', md: 'block' },
                }}
              >
                Aslisite<span style={{ color: colors.accent.primary }}>.</span>
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
                            color: '#334155',
                            textDecoration: 'none',
                            fontWeight: 600,
                            fontSize: '0.9375rem',
                            transition: 'color 0.25s ease',
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
                            color: colors.text.muted,
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
                          color: '#334155',
                          textDecoration: 'none',
                          fontWeight: 600,
                          fontSize: '0.9375rem',
                          transition: 'color 0.25s ease',
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
                          backgroundColor: '#ffffff',
                          border: `1px solid ${colors.border.light}`,
                          borderRadius: 2,
                          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                          zIndex: 1001,
                        }}
                      >
                        {productItems.map((product) => (
                          <Box
                            key={product.label}
                            component={Link}
                            to={product.href}
                            onClick={() => setOpenDropdown(null)}
                            sx={{
                              display: 'block',
                              px: 2,
                              py: 1.25,
                              borderRadius: 1,
                              textDecoration: 'none',
                              '&:hover': {
                                backgroundColor: '#f8fafc',
                              },
                            }}
                          >
                            <Typography
                              sx={{
                                color: colors.text.primary,
                                fontFamily: '"Inter", sans-serif',
                                fontWeight: 500,
                                fontSize: '0.875rem',
                              }}
                            >
                              {product.label}
                            </Typography>
                            <Typography
                              sx={{
                                color: colors.text.secondary,
                                fontFamily: '"Inter", sans-serif',
                                fontSize: '0.75rem',
                                mt: 0.25,
                              }}
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
                sx={{
                  py: 1,
                  px: 3,
                  color: '#ffffff',
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 700,
                  background: colors.accent.gradient,
                  borderRadius: 2,
                  boxShadow: '0 4px 15px rgba(124, 58, 237, 0.2)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #6d28d9 0%, #0e7490 100%)',
                    boxShadow: '0 6px 20px rgba(124, 58, 237, 0.28)',
                  },
                }}
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
                color: colors.text.secondary,
                backgroundColor: '#f8fafc',
                border: `1px solid ${colors.border.light}`,
                borderRadius: 2,
                '&:hover': {
                  color: colors.text.primary,
                  backgroundColor: '#f1f5f9',
                },
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
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(4px)',
          },
          '& .MuiDrawer-paper': {
            width: '100%',
            maxWidth: 320,
            backgroundColor: 'transparent',
            boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;
