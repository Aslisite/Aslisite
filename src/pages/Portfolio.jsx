import { useMemo, useState } from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
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
// WordPress mShots generates screenshots of public pages. These are fetched by the
// visitor's browser and can fail for protected or unavailable deployments.
const screenshotUrl = (url) => `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=960&h=600`;

function ProjectThumbnail({ project }) {
  const [failed, setFailed] = useState(false);
  return (
    <Box sx={{ height: { xs: 225, sm: 290 }, bgcolor: project.tint, position: 'relative', overflow: 'hidden' }}>
      {!failed && (
        <Box component="img" src={screenshotUrl(project.url)} alt={`Preview of ${project.title} concept website`}
          loading="lazy" referrerPolicy="no-referrer" onError={() => setFailed(true)}
          sx={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }} />
      )}
      {failed && (
        <Box sx={{ height: '100%', p: 4, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <Typography sx={{ fontSize: 13, fontWeight: 700, letterSpacing: '.12em' }}>ASLISITE / CONCEPT {project.number}</Typography>
          <Box><MonitorSmartphone size={28} aria-hidden="true" /><Typography sx={{ mt: 1, fontWeight: 750, fontSize: { xs: '1.8rem', md: '2.3rem' }, letterSpacing: '-.05em' }}>{project.title}</Typography></Box>
          <Typography variant="caption">Preview unavailable — open the live demo below</Typography>
        </Box>
      )}
    </Box>
  );
}

const categories = ['All projects', ...new Set(projects.map((project) => project.category))];

export default function Portfolio() {
  const [active, setActive] = useState('All projects');
  const visible = useMemo(() => active === 'All projects' ? projects : projects.filter((project) => project.category === active), [active]);

  return (
    <>
      <Helmet>
        <title>Our Work | Website Concept Demos | Aslisite Technologies</title>
        <meta name="description" content="Explore eight original website concept demonstrations by Aslisite Technologies, from e-commerce and hospitality to healthcare, education and architecture." />
        <link rel="canonical" href="https://aslisite.com/portfolio" />
      </Helmet>
      <Box sx={{ bgcolor: '#fff', overflow: 'hidden' }}>
        <Container maxWidth="lg" sx={{ pt: { xs: 14, sm: 15, md: 16 }, pb: { xs: 3, md: 4 } }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.25, color: colors.accent.primary, mb: { xs: 2.5, md: 3 }, px: 1.75, py: 0.9, borderRadius: '999px', bgcolor: '#f4efff', border: '1px solid #e8dcff' }}>
            <Layers3 size={17} aria-hidden="true" />
            <Typography variant="overline" sx={{ fontWeight: 800, letterSpacing: '.12em', fontSize: { xs: '0.7rem', md: '0.75rem' }, lineHeight: 1.4 }}>Concept websites</Typography>
          </Box>
          <Typography component="h1" sx={{ fontFamily: '"Space Grotesk", "Inter", sans-serif', fontWeight: 800, fontSize: { xs: 'clamp(2.9rem, 9vw, 4.5rem)', sm: 'clamp(4rem, 7.2vw, 5.8rem)', md: 'clamp(4.5rem, 6.2vw, 6.5rem)' }, letterSpacing: '-.065em', lineHeight: 1.08, maxWidth: 950 }}>
            Explore <Box component="span" sx={{ color: colors.accent.primary, display: 'inline-block' }}>Our Work.</Box>
          </Typography>
          <Typography sx={{ mt: { xs: 2.5, md: 3 }, maxWidth: 640, fontSize: { xs: '1.05rem', md: '1.2rem' }, color: colors.text.secondary, lineHeight: 1.8 }}>
            Discover original digital experiences across industries, designed to show what is possible for your business.
          </Typography>
        </Container>
        <Box sx={{ bgcolor: '#fafafa', borderTop: '1px solid #eee', borderBottom: '1px solid #eee' }}>
          <Container maxWidth="lg" sx={{ pt: { xs: 4, md: 5 }, pb: { xs: 6, md: 9 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 3, flexWrap: 'wrap', alignItems: 'end', mb: 4 }}>
              <Box>
                <Typography variant="overline" sx={{ color: colors.accent.primary, fontWeight: 700 }}>Selected concepts</Typography>
                <Typography component="h2" sx={{ fontFamily: '"Space Grotesk", "Inter", sans-serif', fontSize: { xs: '2rem', md: '3rem' }, fontWeight: 750, letterSpacing: '-.045em' }}>A showcase of possibilities.</Typography>
              </Box>
              <Typography variant="body2" sx={{ color: colors.text.secondary, maxWidth: 370 }}>These are original portfolio concepts, not commissioned client projects. Explore each live experience.</Typography>
            </Box>
            <Box role="group" aria-label="Filter portfolio by category" sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 5 }}>
              {categories.map((category) => <Button key={category} onClick={() => setActive(category)} aria-pressed={active === category} variant={active === category ? 'contained' : 'outlined'} size="small" sx={{ borderRadius: 8, px: 2.3, py: 1, boxShadow: 'none', borderColor: '#e4e4e7', bgcolor: active === category ? colors.accent.primary : '#fff', color: active === category ? '#fff' : '#52525b', '&:hover': { bgcolor: active === category ? colors.accent.primaryHover : '#f4f4f5' } }}>{category}</Button>)}
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' }, gap: { xs: 3, md: 4 } }}>
              {visible.map((project) => (
                <Box component="article" key={project.url} sx={{ bgcolor: '#fff', border: '1px solid #eaeaea', borderRadius: '20px', overflow: 'hidden', transition: 'transform .25s ease, box-shadow .25s ease', '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 18px 55px rgba(24,24,27,.09)' } }}>
                  <ProjectThumbnail project={project} />
                  <Box sx={{ p: { xs: 3, md: 3.5 } }}>
                    <Typography variant="overline" sx={{ color: colors.accent.primary, fontWeight: 750 }}>{project.category} · {project.tag}</Typography>
                    <Typography sx={{ mt: 1, mb: 3, color: colors.text.secondary, lineHeight: 1.75, minHeight: { md: 58 } }}>{project.description}</Typography>
                    <Button component="a" href={project.url} target="_blank" rel="noopener noreferrer" endIcon={<ArrowUpRight size={18} />} variant="outlined" sx={{ borderRadius: 2, borderColor: colors.border.medium, fontWeight: 700 }} aria-label={`Visit live demo: ${project.title} (opens in a new tab)`}>Visit live demo</Button>
                  </Box>
                </Box>
              ))}
            </Box>
            <Typography variant="caption" sx={{ display: 'block', mt: 4, color: colors.text.secondary }}>Website previews are generated from publicly accessible demos by an external screenshot service. Some previews may be unavailable; live demo links remain accessible.</Typography>
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
