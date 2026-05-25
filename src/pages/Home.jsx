import React, { Suspense, useEffect } from 'react';
import { Box } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Hero from '../components/Hero';
import { absoluteUrl, siteMetadata, websiteSchema } from '../seo/siteMetadata';

const Services = React.lazy(() => import('../components/Services'));
const Product = React.lazy(() => import('../components/Product'));
const FAQ = React.lazy(() => import('../components/FAQ'));
const Contact = React.lazy(() => import('../components/Contact'));

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.slice(1);
      const element = document.getElementById(targetId);

      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        // Poll for the lazy-loaded element
        const interval = setInterval(() => {
          const lazyElement = document.getElementById(targetId);
          if (lazyElement) {
            lazyElement.scrollIntoView({ behavior: 'smooth' });
            clearInterval(interval);
          }
        }, 100);

        // Stop polling after 2 seconds
        setTimeout(() => clearInterval(interval), 2000);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);

  return (
    <>
      <Helmet>
        <title>Aslisite | Web Development & SEO Agency in Kerala</title>
        <meta name="description" content={siteMetadata.description} />
        <link rel="canonical" href={absoluteUrl('/')} />
        <meta property="og:url" content={absoluteUrl('/')} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Aslisite | Web Development & SEO Agency in Kerala" />
        <meta property="og:description" content={siteMetadata.description} />
        <meta property="og:image" content={siteMetadata.logo} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Aslisite | Web Development & SEO Agency in Kerala" />
        <meta name="twitter:description" content={siteMetadata.description} />
        <meta name="twitter:image" content={siteMetadata.logo} />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [websiteSchema],
          })}
        </script>
      </Helmet>
      <Hero />
      <Suspense fallback={<Box sx={{ minHeight: '100vh' }} />}>
        <Services />
        <Product />
        <FAQ />
        <Contact />
      </Suspense>
    </>
  );
};

export default Home;
