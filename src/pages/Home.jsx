import React, { Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import Hero from '../components/Hero';
import TrustStrip from '../components/TrustStrip';
import { absoluteUrl, siteMetadata, websiteSchema } from '../seo/siteMetadata';

const Services = React.lazy(() => import('../components/Services'));
const Product = React.lazy(() => import('../components/Product'));
const LatestInsights = React.lazy(() => import('../components/LatestInsights'));
const Testimonials = React.lazy(() => import('../components/Testimonials'));
const FAQ = React.lazy(() => import('../components/FAQ'));
const Contact = React.lazy(() => import('../components/Contact'));

const Home = () => {
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
      <TrustStrip />
      <Suspense fallback={null}>
        <Services />
        <Product />
        <Testimonials />
        <LatestInsights />
        <FAQ />
        <Contact />
      </Suspense>
    </>
  );
};

export default Home;
