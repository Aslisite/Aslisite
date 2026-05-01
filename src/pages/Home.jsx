import React, { Suspense, useEffect } from 'react';
import { Box } from '@mui/material';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero';

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
