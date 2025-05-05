import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';
import { BookOpen, Code, Clock, ArrowRight, Info, Shield, Lightbulb, ChevronRight } from 'lucide-react';

const Learn = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!pageRef.current) return;
    
    const ctx = gsap.context(() => {
      // Animate heading
      gsap.from('.learn-title', {
        y: -30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      });
      
      // Animate cards with stagger
      gsap.from('.learn-card', {
        y: 50,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        delay: 0.3,
        ease: 'power2.out'
      });
      
      // Animate guides section
      gsap.from('.guides-title', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        delay: 0.6,
        ease: 'power2.out'
      });
      
      gsap.from('.guide-item', {
        x: -30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.5,
        delay: 0.8,
        ease: 'power2.out'
      });
      
      // Animate FAQ section
      gsap.from('.faq-title', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        delay: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.faq-section',
          start: 'top 80%'
        }
      });
      
      gsap.from('.faq-item', {
        y: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.5,
        delay: 1.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.faq-section',
          start: 'top 80%'
        }
      });
    }, pageRef);
    
    return () => ctx.revert();
  }, []);
  
  return (
    <div ref={pageRef} className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="learn-title text-3xl md:text-4xl font-bold mb-2 text-center">Learn About Tokens</h1>
        <p className="text-white/70 mb-12 text-center max-w-3xl mx-auto">
          Discover everything you need to know about creating, managing, and optimizing your crypto tokens.
        </p>
        
        {/* FAQ Section */}
        <div className="faq-section mb-16">
          <h2 className="faq-title text-3xl font-bold mb-8 text-center">You have questions, we have answers.</h2>
          <p className="text-white/70 mb-12 text-center max-w-3xl mx-auto">
            We're here to answer any question you may have, and here is a curated list of most commonly asked questions. Feel free to ask more!
          </p>
          
          <div className="glass-card p-8">
            <div className="space-y-8">
              <div className="faq-item">
                <h3 className="font-semibold text-lg mb-3">What is TokenForge?</h3>
                <p className="text-white/70">
                  TokenForge is an online tool to create and deploy your own ERC20 and BEP20 Tokens on many different blockchains such as Ethereum, BNB Smart Chain and more.
                </p>
              </div>
              
              <div className="faq-item">
                <h3 className="font-semibold text-lg mb-3">What is an ERC-20 Token?</h3>
                <p className="text-white/70">
                  ERC-20 tokens are blockchain-based assets. ERC-20 Tokens are Smart Contracts running on the Ethereum blockchain. They can be sent and received like any other crypto. ERC-20 Standard provides specifications on how these assets must be sent, received and stored.
                </p>
              </div>
              
              <div className="faq-item">
                <h3 className="font-semibold text-lg mb-3">What is a BEP-20 Token?</h3>
                <p className="text-white/70">
                  BEP-20 tokens are blockchain-based assets. BEP-20 Tokens are Smart Contracts running on the BNB Smart Chain. They can be sent and received like any other crypto. BEP-20 Standard provides specifications on how these assets must be sent, received and stored.
                </p>
              </div>
              
              <div className="faq-item">
                <h3 className="font-semibold text-lg mb-3">What is Fixed Supply Token?</h3>
                <p className="text-white/70">
                  The entire token supply of the Token be generated during deploy and will be sent to Token Owner wallet. You can't increase or reduce the supply later.
                </p>
              </div>
              
              <div className="faq-item">
                <h3 className="font-semibold text-lg mb-3">What is Capped Supply Token?</h3>
                <p className="text-white/70">
                  When you create the token, an initial supply of the tokens will be sent to the owners wallet. You can increase or decrease the supply of the token up to Total Supply of the Token. You won't be able to generate more tokens than the defined supply cap.
                </p>
              </div>
              
              <div className="faq-item">
                <h3 className="font-semibold text-lg mb-3">What is Unlimited Supply Token?</h3>
                <p className="text-white/70">
                  When you create the token, an initial supply of the tokens will be sent to the owners wallet. You can later increase or decrease the supply of the token without any limits.
                </p>
              </div>
              
              <div className="faq-item">
                <h3 className="font-semibold text-lg mb-3">What is Single Owner Token?</h3>
                <p className="text-white/70">
                  A Single Owner Token means that only one address (the owner) has control over the token's administrative functions like minting new tokens or changing parameters.
                </p>
              </div>
              
              <div className="faq-item">
                <h3 className="font-semibold text-lg mb-3">What is a Taxable Token?</h3>
                <p className="text-white/70">
                  A Taxable Token includes a mechanism where a percentage of each transaction is automatically deducted and can be redistributed to holders, sent to a marketing wallet, or used for other purposes defined in the smart contract.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Topic Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Card 1 */}
          <div className="learn-card glass-card p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 opacity-10 transform -translate-y-4 translate-x-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700">
              <BookOpen size={100} />
            </div>
            <div className="relative z-10">
              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-indigo-600/20 text-indigo-400">
                <BookOpen size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Token Basics</h3>
              <p className="text-white/70 mb-6">
                Learn the fundamentals of blockchain tokens, including types, standards, and use cases.
              </p>
              <Link to="#" className="text-indigo-400 hover:text-indigo-300 transition flex items-center text-sm font-medium">
                Explore Basics <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>
          </div>
          
          {/* Card 2 */}
          <div className="learn-card glass-card p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 opacity-10 transform -translate-y-4 translate-x-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700">
              <Code size={100} />
            </div>
            <div className="relative z-10">
              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-purple-600/20 text-purple-400">
                <Code size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Technical Guides</h3>
              <p className="text-white/70 mb-6">
                Dive into smart contract structures, token standards, and advanced token features.
              </p>
              <Link to="#" className="text-indigo-400 hover:text-indigo-300 transition flex items-center text-sm font-medium">
                View Guides <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>
          </div>
          
          {/* Card 3 */}
          <div className="learn-card glass-card p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 opacity-10 transform -translate-y-4 translate-x-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700">
              <Lightbulb size={100} />
            </div>
            <div className="relative z-10">
              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-emerald-600/20 text-emerald-400">
                <Lightbulb size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Best Practices</h3>
              <p className="text-white/70 mb-6">
                Discover tips and strategies for successful token creation, distribution, and management.
              </p>
              <Link to="#" className="text-indigo-400 hover:text-indigo-300 transition flex items-center text-sm font-medium">
                Learn More <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="glass-card p-8 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Create Your Token?</h2>
          <p className="text-white/80 mb-6 max-w-2xl mx-auto">
            Apply what you've learned and launch your custom token with our easy-to-use platform.
          </p>
          <Link to="/create" className="btn-primary inline-flex items-center">
            Create Token Now <ArrowRight size={18} className="ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Learn;