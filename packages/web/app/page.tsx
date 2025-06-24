'use client';

import { useEffect } from 'react';
import { useNetworkAlert } from '../components/NetworkAlert';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import Stats from '../components/Stats';
import Footer from '../components/Footer';

export default function HomePage() {
  const { checkNetwork } = useNetworkAlert();

  useEffect(() => {
    checkNetwork();
  }, [checkNetwork]);

  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <Stats />
      <Footer />
    </>
  );
} 