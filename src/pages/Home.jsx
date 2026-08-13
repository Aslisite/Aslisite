import React from 'react';
import { Helmet } from 'react-helmet-async';
import Hero from '../components/Hero';
import TrustStrip from '../components/TrustStrip';
import Services from '../components/Services';
import Product from '../components/Product';
import LatestInsights from '../components/LatestInsights';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import Contact from '../components/Contact';
import { absoluteUrl, siteMetadata, websiteSchema } from '../seo/siteMetadata';

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
      <Services />
      <Product />
      <Testimonials />
      <LatestInsights />
      <FAQ />
      <Contact />
    </>
  );
};

export default Home;
