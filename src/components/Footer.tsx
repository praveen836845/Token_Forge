import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Github, Linkedin, MessageCircle } from 'lucide-react';
import Logo from './Logo';

const Footer = () => {
  return (
    <footer className="relative z-10 pt-20 pb-10 bg-gradient-to-b from-transparent to-black/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo and about */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-5">
              <Logo />
              <span className="ml-2 text-xl font-bold gradient-text">TokenForge</span>
            </div>
            <p className="text-white/70 text-sm mb-5">
              Build, create, and deploy your custom tokens on multiple blockchains 
              with our simple and powerful platform.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white/70 hover:text-white transition">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-white/70 hover:text-white transition">
                <Github size={18} />
              </a>
              <a href="#" className="text-white/70 hover:text-white transition">
                <Linkedin size={18} />
              </a>
              <a href="#" className="text-white/70 hover:text-white transition">
                <MessageCircle size={18} />
              </a>
            </div>
          </div>
          
          {/* Quick links */}
          <div className="md:col-span-1">
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-white/70 hover:text-white transition">Home</Link></li>
              <li><Link to="/create" className="text-white/70 hover:text-white transition">Create Token</Link></li>
              <li><Link to="/explore" className="text-white/70 hover:text-white transition">Explore Tokens</Link></li>
              <li><Link to="/learn" className="text-white/70 hover:text-white transition">Learn</Link></li>
              <li><Link to="/dashboard" className="text-white/70 hover:text-white transition">Dashboard</Link></li>
            </ul>
          </div>
          
          {/* Resources */}
          <div className="md:col-span-1">
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-white/70 hover:text-white transition">Documentation</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition">API Reference</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition">Blockchain Guides</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition">Token Standards</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition">Community Forum</a></li>
            </ul>
          </div>
          
          {/* Legal */}
          <div className="md:col-span-1">
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-white/70 hover:text-white transition">Terms of Service</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition">Cookie Policy</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition">Risk Disclosures</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm text-white/50">
          <p>© {new Date().getFullYear()} TokenForge. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;