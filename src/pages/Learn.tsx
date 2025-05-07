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
                TokenForge is an online tool to create and deploy your own fungible tokens (Coins) on the Sui blockchain using the Move language. Easily launch your custom tokens and manage them directly on Sui’s high-performance, object-based network.
                </p>
              </div>
              
              <div className="faq-item">
                <h3 className="font-semibold text-lg mb-3">What is an ERC-20 Token?</h3>
                <p className="text-white/70">
  Sui Coins are fungible tokens built using the Sui framework’s Coin standard. Unlike traditional blockchains that use mappings to track balances, Sui represents each coin as an object directly owned by a wallet address. This design enables unique features such as parallel execution, object composability, and enhanced security.{' '}
  <a href="https://blog.sui.io/create-token-erc-20-versus-coin/" target="_blank" rel="noopener noreferrer" className="underline text-white">
    Learn more about Sui Coins
  </a>
</p>

              </div>
              
              <div className="faq-item">
                <h3 className="font-semibold text-lg mb-3">How is Sui different from Ethereum or BNB Chain? </h3>
                <p className="text-white/70">
  On Sui, tokens are not managed by smart contract mappings. Instead, each Coin is an object that resides in your wallet. This object-centric model enables fast, secure, and flexible token operations—such as splitting, merging, and transferring—without requiring global state updates or approvals.{' '}
  <a
    href="https://blog.sui.io/create-token-erc-20-versus-coin/"
    target="_blank"
    rel="noopener noreferrer"
    className="underline text-white"
  >
    Read about Sui’s unique data model
  </a>
</p>

              </div>
              
              <div className="faq-item">
                <h3 className="font-semibold text-lg mb-3">What is Fixed Supply Token?</h3>
                <p className="text-white/70">
                A Fixed Supply Coin on Sui means the total supply is created at launch and cannot be increased or decreased later. All coins are minted during initialization and distributed as desired.
                </p>
              </div>
              
              <div className="faq-item">
                <h3 className="font-semibold text-lg mb-3">What is Capped Supply Token?</h3>
                <p className="text-white/70">
                A Capped Supply Coin allows you to mint new coins up to a predefined maximum cap. You can increase the supply over time, but never exceed the cap set during creation.
                </p>
              </div>
              
              <div className="faq-item">
                <h3 className="font-semibold text-lg mb-3">What is Unlimited Supply Token?</h3>
                <p className="text-white/70">
                An Unlimited Supply Coin lets you mint or burn coins at any time, with no maximum cap. This is useful for tokens that need flexible supply management.
                </p>
              </div>
              
              <div className="faq-item">
                <h3 className="font-semibold text-lg mb-3">What is a TreasuryCap?</h3>
                <p className="text-white/70">
  On Sui, the authority to mint new coins is controlled by a special object called a <strong>TreasuryCap</strong>. Only the holder of the TreasuryCap can mint or burn coins for a given token type. The TreasuryCap can also be transferred or destroyed to renounce minting rights.{` `}
  <a
    href="https://blog.sui.io/create-token-erc-20-versus-coin/"
    target="_blank"
    rel="noopener noreferrer"
    className="underline text-white"
  >
    More on TreasuryCap and minting
  </a>
</p>

              </div>
              
              <div className="faq-item">
                <h3 className="font-semibold text-lg mb-3">Can I add transaction fees or taxes to my Sui Coin? </h3>
                <p className="text-white/70">
                Sui’s Move language allows you to program custom logic, including transaction fees, taxes, or reward mechanisms. You can define how coins behave on transfer, including deductions or redistributions, by customizing your Move module.
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
              <a
    href="https://blog.sui.io/create-token-erc-20-versus-coin/"
    target="_blank"
    rel="noopener noreferrer"
    className="text-indigo-400 hover:text-indigo-300 transition flex items-center font-medium mt-2"
  >
    Explore Basics
    <ArrowRight size={16} className="ml-2" />
  </a>
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
              Dive into Move module structures, Sui Coin standards, and advanced token features.
              </p>
              <a
    href="https://docs.sui.io/standards/coin"
    target="_blank"
    rel="noopener noreferrer"
    className="text-indigo-400 hover:text-indigo-300 transition flex items-center font-medium mt-2"
  >
    View Guides
    <ArrowRight size={16} className="ml-2" />
  </a>

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
              Discover tips and strategies for successful token creation, distribution, and management on Sui.
              </p>
              <a
    href="https://docs.sui.io/standards"
    target="_blank"
    rel="noopener noreferrer"
    className="text-indigo-400 hover:text-indigo-300 transition flex items-center font-medium mt-2"
  >
    Learn More
    <ArrowRight size={16} className="ml-2" />
  </a>
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