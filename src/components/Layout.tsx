import React, { useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { gsap } from 'gsap';
import Header from './Header';
import Footer from './Footer';
import ParticlesBackground from './ParticlesBackground';

const Layout = () => {
  const layoutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize page transition animations
    const ctx = gsap.context(() => {
      gsap.from('.layout-container', {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out'
      });
    }, layoutRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={layoutRef} className="min-h-screen flex flex-col">
      <ParticlesBackground />
      <Header />
      <main className="layout-container flex-grow px-4 sm:px-6 lg:px-8 z-10 relative">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;