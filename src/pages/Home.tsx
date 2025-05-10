import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ArrowRight, Zap, Shield, BarChart3, Layers } from 'lucide-react';

const Home = () => {
  const homeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!homeRef.current) return;

    const ctx = gsap.context(() => {
      // Hero section animations
      gsap.from('.hero-title', {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      });

      gsap.from('.hero-subtitle', {
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        ease: 'power3.out'
      });

      gsap.from('.hero-cta', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        delay: 0.6,
        ease: 'power3.out'
      });

      // Features section animations
      gsap.from('.feature-card', {
        y: 50,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.features-section',
          start: 'top 80%'
        }
      });

      // Networks section
      gsap.from('.network-logo', {
        scale: 0.8,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: '.networks-section',
          start: 'top 85%'
        }
      });

      // Stats animation
      gsap.from('.stat-item', {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        scrollTrigger: {
          trigger: '.stats-section',
          start: 'top 80%'
        }
      });
    }, homeRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={homeRef} className="pt-24">
      {/* Hero Section */}
      <section className="py-20 md:py-32 text-center relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="hero-title text-4xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="gradient-text">Create & Launch</span> Your Own Token <br />In Minutes
          </h1>
          <p className="hero-subtitle text-xl md:text-2xl text-white/80 mb-10 max-w-3xl mx-auto">
            The easiest way to create, deploy and manage custom tokens on Sui blockchains with no coding required.
          </p>
          <div className="hero-cta flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/create" className="btn-primary">
              Create Your Token <ArrowRight size={18} className="ml-2 inline" />
            </Link>
            <Link to="/learn" className="btn-secondary">
              Learn How It Works
            </Link>
          </div>
        </div>

        {/* Animated background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-600/20 blur-[100px] -z-10" />
      </section>

      {/* Features Section */}
      <section className="features-section py-20 bg-black/30 backdrop-blur-lg relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 gradient-text">
            Why Choose TokenForge
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="feature-card glass-card p-6 sm:p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 opacity-10 transform -translate-y-4 translate-x-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700">
                <Zap size={100} />
              </div>
              <div className="relative z-10">
                <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-indigo-600/20 text-indigo-400">
                  <Zap size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-3">Fast Deployment</h3>
                <p className="text-white/70 mb-4">
                  Create and deploy your token in under 5 minutes without writing a single line of code.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="feature-card glass-card p-6 sm:p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 opacity-10 transform -translate-y-4 translate-x-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700">
                <Shield size={100} />
              </div>
              <div className="relative z-10">
                <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-purple-600/20 text-purple-400">
                  <Shield size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-3">Secure & Audited</h3>
                <p className="text-white/70 mb-4">
                  Our smart contracts are thoroughly audited and follow industry best practices for maximum security.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="feature-card glass-card p-6 sm:p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 opacity-10 transform -translate-y-4 translate-x-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700">
                <BarChart3 size={100} />
              </div>
              <div className="relative z-10">
                <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-emerald-600/20 text-emerald-400">
                  <BarChart3 size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-3">Token Analytics</h3>
                <p className="text-white/70 mb-4">
                  Track your token performance with real-time analytics, price charts, and holder statistics.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="feature-card glass-card p-6 sm:p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 opacity-10 transform -translate-y-4 translate-x-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700">
                <Layers size={100} />
              </div>
              <div className="relative z-10">
                <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-pink-600/20 text-pink-400">
                  <Layers size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-3">Built for Sui </h3>
                <p className="text-white/70 mb-4">
                Launch secure Sui tokens in minutes—no code, real-time analytics, and native performance.


</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Networks */}
      <section className="networks-section py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-16">Supported Networks</h2>

          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {/* Network logos - these would be actual images in a real project */}
            <div className="network-logo w-16 h-16 flex items-center justify-center bg-white/10 rounded-full p-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">ETH </div>
            </div>

            <div className="network-logo w-16 h-16 flex items-center justify-center bg-white/10 rounded-full p-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 flex items-center justify-center text-white font-bold">BSC</div>
            </div>

            <div className="network-logo w-16 h-16 flex items-center justify-center bg-white/10 rounded-full p-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-purple-700 flex items-center justify-center text-white font-bold">MATIC</div>
            </div>

            <div className="network-logo relative w-16 h-16 flex items-center justify-center bg-white/10 rounded-full p-3 group">
              {/* Glowing outer ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500 to-pink-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              {/* Animated inner circle */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-pink-600 bg-[length:200%_100%] animate-gradient-shine flex items-center justify-center text-white font-bold shadow-[0_0_15px_2px_rgba(255,65,108,0.5)]">
                SUI
              </div>
            </div>


            <div className="network-logo w-16 h-16 flex items-center justify-center bg-white/10 rounded-full p-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold">ALGO</div>
            </div>

            <div className="network-logo w-16 h-16 flex items-center justify-center bg-white/10 rounded-full p-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-cyan-500 flex items-center justify-center text-white font-bold">SOL</div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="stats-section py-20 bg-black/30 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="stat-item text-center">
              <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">1K+</div>
              <p className="text-white/70">Tokens Created</p>
            </div>

            <div className="stat-item text-center">
              <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">1</div>
              <p className="text-white/70">Supported Countries</p>
            </div>

            <div className="stat-item text-center">
              <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">1</div>
              <p className="text-white/70">Blockchain Networks</p>
            </div>

            <div className="stat-item text-center">
              <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">99.9%</div>
              <p className="text-white/70">Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="glass-card overflow-hidden p-8 md:p-12 rounded-3xl relative">
            {/* Background gradient */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/20 to-purple-600/20 -z-10"></div>

            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Launch Your Token?</h2>
              <p className="text-xl text-white/80 mb-8">
                Join thousands of creators who have successfully launched their tokens with TokenForge.
              </p>
              <Link to="/create" className="btn-primary text-lg">
                Get Started Now <ArrowRight size={20} className="ml-2 inline" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;