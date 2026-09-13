import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  InputBase,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import CloseIconImport from '@mui/icons-material/Close';
import KeyboardArrowDownIconImport from '@mui/icons-material/KeyboardArrowDown';
import MenuIconImport from '@mui/icons-material/Menu';
import SearchIconImport from '@mui/icons-material/Search';
import WhatsAppIconImport from '@mui/icons-material/WhatsApp';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Code, ShoppingCart, Settings, TrendingUp, Sparkles, Zap, Calculator, FileText, ClipboardList, MessageCircle, Receipt, Wrench, QrCode, BarChart2 } from 'lucide-react';
import { colors } from '../../theme/theme';

const CloseIcon = CloseIconImport.default || CloseIconImport;
const KeyboardArrowDownIcon = KeyboardArrowDownIconImport.default || KeyboardArrowDownIconImport;
const MenuIcon = MenuIconImport.default || MenuIconImport;
const SearchIcon = SearchIconImport.default || SearchIconImport;
const WhatsAppIcon = WhatsAppIconImport.default || WhatsAppIconImport;

const navItems = [
  { label: 'Services', href: '/#services', hasDropdown: true, dropdownKey: 'services' },
  { label: 'Products', href: '/#aslibooks', hasDropdown: true, dropdownKey: 'products' },
  { label: 'Reviews', href: '/#testimonials' },
  { label: 'Blog', href: '/blog' },
  { label: 'Tools', href: '/tools', hasDropdown: true, dropdownKey: 'tools' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'Contact', href: '/#contact' },
];

const serviceItems = [
  { label: 'Web Development', href: '/services/web-development', description: 'Custom high-performance web apps', icon: Code },
  { label: 'Ecommerce Solutions', href: '/services/ecommerce-solutions', description: 'Scalable online stores that convert', icon: ShoppingCart },
  { label: 'Custom Software', href: '/services/custom-software', description: 'Workflow automation & portals', icon: Settings },
  { label: 'SEO Services', href: '/services/seo-services', description: 'Data-driven organic growth', icon: TrendingUp },
];

const productItems = [
  { label: 'AsliBooks', href: '/#aslibooks', description: 'Smart Invoicing & GST Solution', icon: Sparkles },
  { label: 'Sheet Automation', href: '/products/sheet-automation', description: 'Free Payment Reminder script', icon: Zap },
];

const toolItems = [
  { label: 'GST Calculator', href: '/tools/gst-calculator', description: 'GST 2.0 slabs — 0%, 5%, 18%, 40%', icon: Calculator },
  { label: 'Invoice Generator', href: '/tools/invoice-generator', description: 'Free GST tax invoices', icon: FileText },
  { label: 'Quotation Generator', href: '/tools/quotation-generator', description: 'Professional quotes with validity', icon: ClipboardList },
  { label: 'WhatsApp Link & QR', href: '/tools/whatsapp-link-generator', description: 'Chat link + scannable QR code', icon: MessageCircle },
  { label: 'Receipt Generator', href: '/tools/receipt-generator', description: 'Payment receipts in seconds', icon: Receipt },
  { label: 'Profit Margin Calculator', href: '/tools/profit-margin-calculator', description: 'Margin, markup & selling price', icon: TrendingUp },
  { label: 'UPI QR Generator', href: '/tools/upi-qr-generator', description: 'UPI payment QR for your business', icon: QrCode },
  { label: 'Break-Even Calculator', href: '/tools/break-even-calculator', description: 'Units & revenue to cover costs', icon: BarChart2 },
  { label: 'Purchase Order Generator', href: '/tools/purchase-order-generator', description: 'Professional POs with delivery dates', icon: ShoppingCart },
  { label: 'ROAS Calculator', href: '/tools/roas-calculator', description: 'Return on ad spend for any platform', icon: Zap },
];

/* ─── Announcement Bar ─── */
const AnnouncementBar = ({ onDismiss }) => (
  <Box
    className="no-print"
    sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1001,
      background: `linear-gradient(90deg, ${colors.accent.primary} 0%, #4f46e5 100%)`,
      py: 0.8,
      px: 2,
      textAlign: 'center',
    }}
  >
    <Container maxWidth="xl" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Typography
        component={Link}
        to="/products/sheet-automation"
        sx={{
          color: '#fff',
          fontSize: '0.8rem',
          fontWeight: 600,
          textDecoration: 'none',
          letterSpacing: '0.02em',
          '&:hover': { textDecoration: 'underline' },
        }}
      >
        New: Free Payment Reminder Automation Tool &rarr;
      </Typography>
      <IconButton
        onClick={onDismiss}
        aria-label="Dismiss announcement"
        sx={{
          position: 'absolute',
          right: 8,
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'rgba(255,255,255,0.7)',
          p: 0.5,
          '&:hover': { color: '#fff' },
        }}
      >
        <CloseIcon sx={{ fontSize: 16 }} />
      </IconButton>
    </Container>
  </Box>
);

/* ─── Helper: check if a nav item is active ─── */
const isNavItemActive = (item, pathname, hash) => {
  const fullPath = pathname + hash;
  if (item.href === '/blog' && pathname.startsWith('/blog')) return true;
  if (item.href.startsWith('/#') && pathname === '/') {
    return hash === item.href.replace('/', '');
  }
  if (!item.href.startsWith('/#') && item.href === pathname) return true;
  // Check if any dropdown children match
  if (item.dropdownKey === 'services') {
    return serviceItems.some((s) => pathname === s.href);
  }
  if (item.dropdownKey === 'products') {
    return productItems.some((p) => pathname === p.href);
  }
  if (item.dropdownKey === 'tools') {
    return pathname.startsWith('/tools');
  }
  return false;
};

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState(null);
  const [safeAreaTop, setSafeAreaTop] = useState('0px');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentHash, setCurrentHash] = useState(location.hash);

  const isHomePage = location.pathname === '/';
  const isTransparent = isHomePage && !isScrolled;

  // Track hash changes for active link highlighting
  useEffect(() => {
    setCurrentHash(location.hash);
  }, [location]);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('announcement-dismissed');
    if (dismissed) setShowAnnouncement(false);
  }, []);

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

  const handleDismissAnnouncement = useCallback(() => {
    setShowAnnouncement(false);
    sessionStorage.setItem('announcement-dismissed', 'true');
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/blog?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
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
        {navItems.map((item) => {
          const active = isNavItemActive(item, location.pathname, currentHash);
          return (
            <Box key={item.label}>
              {item.hasDropdown ? (
                <Box sx={{ width: '100%' }}>
                  <ListItemButton
                    onClick={() => setMobileOpenDropdown(mobileOpenDropdown === item.dropdownKey ? null : item.dropdownKey)}
                    sx={{
                      py: 2.5,
                      px: 3,
                      borderRadius: 2,
                      backgroundColor: active ? 'rgba(124, 58, 237, 0.04)' : 'transparent',
                      transition: 'background-color 0.2s ease',
                      '&:hover': { backgroundColor: '#f1f5f9' },
                    }}
                  >
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        sx: {
                          color: active ? colors.accent.primary : colors.text.primary,
                          fontWeight: 600,
                          fontSize: '1.25rem',
                        },
                      }}
                    />
                    <KeyboardArrowDownIcon
                      sx={{
                        color: colors.text.muted,
                        fontSize: 20,
                        transform: mobileOpenDropdown === item.dropdownKey ? 'rotate(180deg)' : 'rotate(0)',
                        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    />
                  </ListItemButton>
                  {mobileOpenDropdown === item.dropdownKey && (
                    <Box sx={{ pl: 3, animation: 'fadeIn 0.2s ease' }}>
                      {(item.dropdownKey === 'services' ? serviceItems : item.dropdownKey === 'tools' ? toolItems : productItems).map((dropItem) => (
                        <Box
                          key={dropItem.label}
                          component={Link}
                          to={dropItem.href}
                          onClick={() => {
                            handleDrawerToggle();
                            setMobileOpenDropdown(null);
                          }}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            py: 1.5,
                            px: 3,
                            textDecoration: 'none',
                            color: location.pathname === dropItem.href ? colors.accent.primary : colors.text.secondary,
                            transition: 'color 0.2s ease',
                            '&:hover': { color: colors.accent.primary },
                          }}
                        >
                          <dropItem.icon size={16} />
                          <Typography
                            sx={{
                              fontFamily: '"Inter", sans-serif',
                              fontWeight: 500,
                              fontSize: '1rem',
                              color: 'inherit',
                            }}
                          >
                            {dropItem.label}
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
                    backgroundColor: active ? 'rgba(124, 58, 237, 0.04)' : 'transparent',
                    transition: 'all 0.2s ease',
                    '&:hover': { backgroundColor: '#f1f5f9' },
                  }}
                >
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      sx: {
                        color: active ? colors.accent.primary : colors.text.primary,
                        fontWeight: 600,
                        fontSize: '1.25rem',
                      },
                    }}
                  />
                </ListItemButton>
              )}
            </Box>
          );
        })}
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
            background: colors.accent.primary,
            borderRadius: 2.5,
            boxShadow: '0 2px 8px rgba(109, 40, 217, 0.15)',
            transition: 'background 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease',
            '&:hover': {
              background: colors.accent.primaryHover,
              boxShadow: '0 4px 14px rgba(109, 40, 217, 0.22)',
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
      {/* ─── Announcement Bar ─── */}
      {showAnnouncement && <AnnouncementBar onDismiss={handleDismissAnnouncement} />}

      {/* ─── Main Header ─── */}
      <Box
        component="header"
        style={{ paddingTop: safeAreaTop }}
        sx={{
          position: 'fixed',
          top: showAnnouncement ? 36 : 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: isTransparent ? 'transparent' : colors.background.navbar,
          backdropFilter: isTransparent ? 'blur(0px)' : 'blur(12px)',
          WebkitBackdropFilter: isTransparent ? 'blur(0px)' : 'blur(12px)',
          borderBottom: `1px solid ${isTransparent ? 'transparent' : colors.border.light}`,
          boxShadow: isTransparent
            ? 'none'
            : '0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
          transition:
            'top 0.3s ease, background-color 0.28s ease, border-color 0.28s ease, box-shadow 0.28s ease, backdrop-filter 0.28s ease',
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
            {/* Logo with hover animation (#6) */}
            <Box
              component={Link}
              to="/#hero"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                textDecoration: 'none',
                transition: 'transform 0.25s ease',
                '&:hover': {
                  transform: 'scale(1.04)',
                },
                '&:hover img': {
                  filter: 'drop-shadow(0 2px 8px rgba(124, 58, 237, 0.3))',
                },
              }}
            >
              <Box
                component="img"
                src="/AslisiteLogo.svg"
                alt="Aslisite"
                sx={{
                  width: 36,
                  height: 36,
                  transition: 'filter 0.25s ease',
                }}
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
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 3 }}>
              <Box component="nav" sx={{ display: 'flex', gap: 3 }}>
                {navItems.map((item) => {
                  const active = isNavItemActive(item, location.pathname, currentHash);
                  return (
                    <Box
                      key={item.label}
                      sx={{ position: 'relative', py: 1 }}
                      onMouseEnter={() => item.hasDropdown && setOpenDropdown(item.dropdownKey)}
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
                              color: active ? colors.accent.primary : '#334155',
                              textDecoration: 'none',
                              fontWeight: 600,
                              fontSize: '0.9375rem',
                              transition: 'color 0.25s ease',
                              '&:hover': { color: colors.accent.primary },
                            }}
                          >
                            {item.label}
                          </Typography>
                          <KeyboardArrowDownIcon
                            sx={{
                              fontSize: '1rem',
                              color: active ? colors.accent.primary : colors.text.muted,
                              transform: openDropdown === item.dropdownKey ? 'rotate(180deg)' : 'rotate(0)',
                              transition: 'transform 0.2s ease',
                            }}
                          />
                          {/* Active indicator */}
                          {active && (
                            <Box
                              sx={{
                                position: 'absolute',
                                bottom: 0,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: 20,
                                height: 2,
                                borderRadius: 1,
                                background: colors.accent.primary,
                              }}
                            />
                          )}
                        </Box>
                      ) : (
                        <>
                          <Typography
                            component={Link}
                            to={item.href}
                            sx={{
                              color: active ? colors.accent.primary : '#334155',
                              textDecoration: 'none',
                              fontWeight: 600,
                              fontSize: '0.9375rem',
                              transition: 'color 0.25s ease',
                              '&:hover': { color: colors.accent.primary },
                            }}
                          >
                            {item.label}
                          </Typography>
                          {/* Active indicator */}
                          {active && (
                            <Box
                              sx={{
                                position: 'absolute',
                                bottom: 0,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: 20,
                                height: 2,
                                borderRadius: 1,
                                background: colors.accent.primary,
                              }}
                            />
                          )}
                        </>
                      )}

                      {/* ─── Mega Menu for Services (#3) ─── */}
                      {item.dropdownKey === 'services' && openDropdown === 'services' && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: '100%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            mt: 0.5,
                            pt: 1.5,
                            pb: 1.5,
                            px: 2,
                            minWidth: 420,
                            backgroundColor: '#ffffff',
                            border: `1px solid ${colors.border.light}`,
                            borderRadius: 3,
                            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.12)',
                            zIndex: 1001,
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: 0.5,
                          }}
                        >
                          {serviceItems.map((svc) => (
                            <Box
                              key={svc.label}
                              component={Link}
                              to={svc.href}
                              onClick={() => setOpenDropdown(null)}
                              sx={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 1.5,
                                px: 2,
                                py: 1.5,
                                borderRadius: 2,
                                textDecoration: 'none',
                                transition: 'background-color 0.2s ease',
                                '&:hover': { backgroundColor: '#f8fafc' },
                              }}
                            >
                              <Box
                                sx={{
                                  mt: 0.3,
                                  width: 32,
                                  height: 32,
                                  borderRadius: 1.5,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  backgroundColor: 'rgba(124, 58, 237, 0.06)',
                                  color: colors.accent.primary,
                                  flexShrink: 0,
                                }}
                              >
                                <svc.icon size={16} />
                              </Box>
                              <Box>
                                <Typography
                                  sx={{
                                    color: colors.text.primary,
                                    fontFamily: '"Inter", sans-serif',
                                    fontWeight: 600,
                                    fontSize: '0.85rem',
                                    lineHeight: 1.3,
                                  }}
                                >
                                  {svc.label}
                                </Typography>
                                <Typography
                                  sx={{
                                    color: colors.text.secondary,
                                    fontFamily: '"Inter", sans-serif',
                                    fontSize: '0.72rem',
                                    mt: 0.3,
                                    lineHeight: 1.4,
                                  }}
                                >
                                  {svc.description}
                                </Typography>
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      )}

                      {/* Products dropdown (standard) */}
                      {item.dropdownKey === 'products' && openDropdown === 'products' && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            mt: 0.5,
                            pt: 1,
                            py: 1,
                            px: 1,
                            minWidth: 240,
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
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                px: 2,
                                py: 1.25,
                                borderRadius: 1,
                                textDecoration: 'none',
                                '&:hover': { backgroundColor: '#f8fafc' },
                              }}
                            >
                              <Box sx={{ color: colors.accent.primary, display: 'flex' }}>
                                <product.icon size={16} />
                              </Box>
                              <Box>
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
                                    fontSize: '0.72rem',
                                    mt: 0.2,
                                  }}
                                >
                                  {product.description}
                                </Typography>
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      )}

                      {/* Tools dropdown */}
                      {item.dropdownKey === 'tools' && openDropdown === 'tools' && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: '100%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            mt: 0.5,
                            pt: 1,
                            pb: 1,
                            px: 1,
                            minWidth: 280,
                            backgroundColor: '#ffffff',
                            border: `1px solid ${colors.border.light}`,
                            borderRadius: 2,
                            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                            zIndex: 1001,
                          }}
                        >
                          {/* Header link to hub */}
                          <Box
                            component={Link}
                            to="/tools"
                            onClick={() => setOpenDropdown(null)}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              px: 2,
                              py: 1,
                              mb: 0.5,
                              borderRadius: 1,
                              textDecoration: 'none',
                              borderBottom: `1px solid ${colors.border.light}`,
                              '&:hover': { backgroundColor: '#f8fafc' },
                            }}
                          >
                            <Wrench size={13} style={{ color: colors.accent.primary }} />
                            <Typography
                              sx={{
                                color: colors.accent.primary,
                                fontFamily: '"Inter", sans-serif',
                                fontWeight: 700,
                                fontSize: '0.78rem',
                                letterSpacing: '0.02em',
                              }}
                            >
                              All Free Tools →
                            </Typography>
                          </Box>
                          {toolItems.map((tool) => (
                            <Box
                              key={tool.label}
                              component={Link}
                              to={tool.href}
                              onClick={() => setOpenDropdown(null)}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                px: 2,
                                py: 1.1,
                                borderRadius: 1,
                                textDecoration: 'none',
                                '&:hover': { backgroundColor: '#f8fafc' },
                              }}
                            >
                              <Box sx={{ color: colors.accent.primary, display: 'flex', flexShrink: 0 }}>
                                <tool.icon size={15} />
                              </Box>
                              <Box>
                                <Typography
                                  sx={{
                                    color: colors.text.primary,
                                    fontFamily: '"Inter", sans-serif',
                                    fontWeight: 500,
                                    fontSize: '0.845rem',
                                    lineHeight: 1.3,
                                  }}
                                >
                                  {tool.label}
                                </Typography>
                                <Typography
                                  sx={{
                                    color: colors.text.muted,
                                    fontFamily: '"Inter", sans-serif',
                                    fontSize: '0.7rem',
                                    mt: 0.15,
                                  }}
                                >
                                  {tool.description}
                                </Typography>
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      )}
                    </Box>
                  );
                })}
              </Box>

              {/* Search icon (#4) */}
              <IconButton
                aria-label="Search blog"
                onClick={() => setSearchOpen(!searchOpen)}
                sx={{
                  color: colors.text.muted,
                  width: 36,
                  height: 36,
                  transition: 'color 0.2s ease',
                  '&:hover': { color: colors.accent.primary },
                }}
              >
                <SearchIcon sx={{ fontSize: 20 }} />
              </IconButton>

              {/* WhatsApp quick action (#5) */}
              <IconButton
                aria-label="Chat on WhatsApp"
                component="a"
                href="https://wa.me/919495664173"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: '#25D366',
                  width: 36,
                  height: 36,
                  transition: 'transform 0.2s ease',
                  '&:hover': { transform: 'scale(1.12)' },
                }}
              >
                <WhatsAppIcon sx={{ fontSize: 20 }} />
              </IconButton>

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
                  background: colors.accent.primary,
                  borderRadius: 2,
                  boxShadow: '0 2px 8px rgba(109, 40, 217, 0.15)',
                  '&:hover': {
                    background: colors.accent.primaryHover,
                    boxShadow: '0 4px 14px rgba(109, 40, 217, 0.22)',
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

        {/* ─── Search Bar (slides open below nav) (#4) ─── */}
        {searchOpen && (
          <Box
            sx={{
              borderTop: `1px solid ${colors.border.light}`,
              backgroundColor: '#ffffff',
              py: 1.5,
              px: 2,
            }}
          >
            <Container maxWidth="sm">
              <Box
                component="form"
                onSubmit={handleSearchSubmit}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  border: `1px solid ${colors.border.light}`,
                  borderRadius: 2,
                  px: 2,
                  py: 0.5,
                  backgroundColor: '#f8fafc',
                  transition: 'border-color 0.2s ease',
                  '&:focus-within': { borderColor: colors.accent.primary },
                }}
              >
                <SearchIcon sx={{ fontSize: 20, color: colors.text.muted }} />
                <InputBase
                  placeholder="Search blog articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  sx={{
                    flex: 1,
                    fontSize: '0.9rem',
                    fontFamily: '"Inter", sans-serif',
                  }}
                  inputProps={{ 'aria-label': 'Search blog articles' }}
                />
                <IconButton
                  size="small"
                  onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                  sx={{ color: colors.text.muted }}
                >
                  <CloseIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Box>
            </Container>
          </Box>
        )}
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
