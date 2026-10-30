import { useMemo, useState } from 'react';
import { Box, Button, Chip, Container, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { ArrowUpRight, ArrowRight, Layers3, MonitorSmartphone } from 'lucide-react';
import { colors } from '../theme/theme';

const projects = [
  { title: 'Fashion E-commerce', category: 'E-commerce', tag: 'Digital storefront', url: 'https://ecommerce-eight-ochre-48.vercel.app/', description: 'A contemporary shopping experience with product discovery and polished storefront interactions.', tint: '#ede9fe', number: '01' },
  { title: 'Corporate Website', category: 'Corporate', tag: 'Business presence', url: 'https://corporate-beta-eight.vercel.app/', description: 'A professional digital presence built around services, credibility and clear communication.', tint: '#dbeafe', number: '02' },
  { title: 'Restaurant', category: 'Hospitality', tag: 'Dining experience', url: 'https://restaurant-beta-navy-52.vercel.app/', description: 'An immersive restaurant concept showcasing menus, atmosphere and dining experiences.', tint: '#ffedd5', number: '03' },
  { title: 'Luxury Resort', category: 'Hospitality', tag: 'Resort & stays', url: 'https://resort-theta-coral.vercel.app/', description: 'A destination-led hospitality experience designed to make every stay feel exceptional.', tint: '#ccfbf1', number: '04' },
  { title: 'Multispecialty Clinic', category: 'Healthcare', tag: 'Healthcare experience', url: 'https://clinic-sable-gamma.vercel.app/', description: 'An approachable healthcare concept emphasizing clarity, services and patient journeys.', tint: '#dbeafe', number: '05' },
  { title: 'Creative Portfolio', category: 'Creative', tag: 'Selected work', url: 'https://portfolio-mauve-five-ywhjnytkxg.vercel.app/', description: 'An editorial showcase focused on visual storytelling and thoughtful presentation.', tint: '#fce7f3', number: '06' },
  { title: 'Education Platform', category: 'Education', tag: 'Learning experience', url: 'https://education-gamma-one.vercel.app/', description: 'A modern learning platform concept with course discovery and engaging education interfaces.', tint: '#fef3c7', number: '07' },
  { title: 'Luxury Architecture Studio', category: 'Creative', tag: 'Architecture & design', url: 'https://studio-liart-seven.vercel.app/', description: 'An art-directed architecture studio concept with immersive project storytelling.', tint: '#e7e5e4', number: '08' },
];
const categories = ['All projects', ...new Set(projects.map((project) => project.category))];

export default function Portfolio() {
  const [active, setActive] = useState('All projects');
  const visible = useMemo(() => active === 'All projects' ? projects : projects.filter((project) => project.category === active), [active]);

  return (
    <>
      <Helmet>
        <title>Portfolio & Website Concept Demos | Aslisite Technologies</title>
        <meta name="description" content="Explore eight original website concept demonstrations by Aslisite Technologies, from e-commerce and hospitality to healthcare, education and architecture." />
        <link rel="canonical" href="https://aslisite.com/portfolio" />
      </Helmet>
      <Box sx={{ bgcolor: '#fff', overflow: 'hidden' }}>
        <Container maxWidth="lg" sx={{ pt: { xs: 9, md: 14 }, pb: { xs: 7, md: 11 } }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, color: colors.accent.primary, mb: 3 }}>
            <Layers3 size={17} aria-hidden="true" />
            <Typography variant="overline" sx={{ fontWeight: 750, letterSpacing: '.16em' }}>Selected digital concepts</Typography>
          </Box>
          <Typography component="h1" sx={{ fontFamily: '"Space Grotesk", "Inter", sans-serif', fontWeight: 800, fontSize: { xs: 'clamp(3rem, 11vw, 5rem)', md: 'clamp(4.5rem, 7.8vw, 7.5rem)' }, letterSpacing: '-.065em', lineHeight: 1.03, maxWidth: 920 }}>
            Ideas made <Box component="span" sx={{ color: colors.accent.primary }}>interactive.</Box>
          </Typography>
          <Typography sx={{ mt: 3, maxWidth: 640, fontSize: { xs: '1.05rem', md: '1.2rem' }, color: colors.text.secondary, lineHeight: 1.8 }}>
            Explore a curated collection of website concepts across industries. Each one is a demonstration of the experiences we can design and build.
          </Typography>
          <Box sx={{ mt: 4, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <Chip label="8 concept demos" sx={{ bgcolor: '#f4f0ff', color: colors.accent.primary, fontWeight: 700 }} />
            <Chip label="Live interactive websites" variant="outlined" sx={{ fontWeight: 600 }} />
          </Box>
        </Container>
        <Box sx={{ bgcolor: '#fafafa', borderTop: '1px solid #eee', borderBottom: '1px solid #eee' }}>
          <Container maxWidth="lg" sx={{ py: { xs: 6, md: 9 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 3, flexWrap: 'wrap', alignItems: 'end', mb: 4 }}>
              <Box>
                <Typography variant="overline" sx={{ color: colors.accent.primary, fontWeight: 700 }}>Explore our work</Typography>
                <Typography component="h2" sx={{ fontFamily: '"Space Grotesk", "Inter", sans-serif', fontSize: { xs: '2rem', md: '3rem' }, fontWeight: 750, letterSpacing: '-.045em' }}>Built to inspire.</Typography>
              </Box>
              <Typography variant="body2" sx={{ color: colors.text.secondary, maxWidth: 370 }}>These are original portfolio concepts, not commissioned client projects. Explore each live experience.</Typography>
            </Box>
            <Box role="group" aria-label="Filter portfolio by category" sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 5 }}>
              {categories.map((category) => <Button key={category} onClick={() => setActive(category)} aria-pressed={active === category} variant={active === category ? 'contained' : 'outlined'} size="small" sx={{ borderRadius: 8, px: 2.3, py: 1, boxShadow: 'none', borderColor: '#e4e4e7', bgcolor: active === category ? colors.accent.primary : '#fff', color: active === category ? '#fff' : '#52525b', '&:hover': { bgcolor: active === category ? colors.accent.primaryHover : '#f4f4f5' } }}>{category}</Button>)}
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' }, gap: { xs: 3, md: 4 } }}>
              {visible.map((project) => (
                <Box component="article" key={project.url} sx={{ bgcolor: '#fff', border: '1px solid #eaeaea', borderRadius: '20px', overflow: 'hidden', transition: 'transform .25s ease, box-shadow .25s ease', '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 18px 55px rgba(24,24,27,.09)' } }}>
                  <Box sx={{ height: { xs: 225, sm: 290 }, bgcolor: project.tint, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', p: { xs: 3, md: 4 }, overflow: 'hidden' }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 700, letterSpacing: '.12em', color: '#3f3f46' }}>ASLISITE / CONCEPT {project.number}</Typography>
                    <Box sx={{ position: 'absolute', right: '-9%', bottom: '-34%', width: '70%', height: '105%', borderRadius: '24px', transform: 'rotate(-13deg)', bgcolor: 'rgba(255,255,255,.55)', border: '1px solid rgba(255,255,255,.7)', boxShadow: '-18px -18px 50px rgba(0,0,0,.035)' }} />
                    <Box sx={{ zIndex: 1 }}>
                      <MonitorSmartphone size={28} strokeWidth={1.5} aria-hidden="true" />
                      <Typography sx={{ mt: 1.5, fontFamily: '"Space Grotesk", "Inter", sans-serif', fontWeight: 750, fontSize: { xs: '2rem', md: '2.5rem' }, letterSpacing: '-.05em', lineHeight: 1.1, maxWidth: '75%' }}>{project.title}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ p: { xs: 3, md: 3.5 } }}>
                    <Typography variant="overline" sx={{ color: colors.accent.primary, fontWeight: 750 }}>{project.category} · {project.tag}</Typography>
                    <Typography sx={{ mt: 1, mb: 3, color: colors.text.secondary, lineHeight: 1.75, minHeight: { md: 58 } }}>{project.description}</Typography>
                    <Button component="a" href={project.url} target="_blank" rel="noopener noreferrer" endIcon={<ArrowUpRight size={18} />} variant="outlined" sx={{ borderRadius: 2, borderColor: colors.border.medium, fontWeight: 700 }} aria-label={`Visit live demo: ${project.title} (opens in a new tab)`}>Visit live demo</Button>
                  </Box>
                </Box>
              ))}
            </Box>
            <Typography variant="caption" sx={{ display: 'block', mt: 4, color: colors.text.secondary }}>Visual panels are original category illustrations, not screenshots of the linked websites. Demo availability depends on external hosting.</Typography>
          </Container>
        </Box>
        <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 }, textAlign: 'center' }}>
          <Typography variant="overline" sx={{ color: colors.accent.primary, fontWeight: 750 }}>Your project could be next</Typography>
          <Typography component="h2" sx={{ fontFamily: '"Space Grotesk", "Inter", sans-serif', fontSize: { xs: '2.4rem', md: '4rem' }, fontWeight: 800, letterSpacing: '-.055em', my: 2 }}>Let's build something remarkable.</Typography>
          <Typography sx={{ maxWidth: 530, mx: 'auto', color: colors.text.secondary, mb: 4 }}>From a first idea to a complete digital experience, we help businesses bring their vision online.</Typography>
          <Button component="a" href="/#contact" variant="contained" endIcon={<ArrowRight size={19} />} sx={{ px: 4, py: 1.6 }}>Start a project</Button>
        </Container>
      </Box>
    </>
  );
}
