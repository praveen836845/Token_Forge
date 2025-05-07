import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { gsap } from "gsap";
import { Menu, X, Wallet, ChevronDown } from "lucide-react";
import Logo from "./Logo";
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Get current wallet account from Sui
  const account = useCurrentAccount();

  // Animation for header elements
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".nav-item", {
        y: -20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: "power2.out",
        delay: 0.2,
      });

      gsap.from(".logo-container", {
        opacity: 0,
        x: -20,
        duration: 0.8,
        ease: "power2.out",
      });

      gsap.from(".wallet-btn", {
        opacity: 0,
        x: 20,
        duration: 0.8,
        ease: "power2.out",
      });
    }, headerRef);

    return () => ctx.revert();
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Format wallet address for display
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-black/80 backdrop-blur-lg py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Left: Logo + Name + Nav */}
          <div className="flex items-center gap-10">
            <Link to="/" className="flex items-center">
              <Logo />
              <span className="ml-2 text-xl font-bold gradient-text">
                TokenForge
              </span>
            </Link>
            {/* Desktop Navigation beside logo/name */}
            <nav className="flex gap-6 items-center">
              
              <Link
                to="/create"
                className="nav-item !text-white hover:!text-white transition"
                style={{ opacity: 1, transform: "none" }}
              >
                Create Token
              </Link>
              <Link
                to="/learn"
                className="nav-item !text-white hover:!text-white transition"
                style={{ opacity: 1, transform: "none" }}
              >
                Learn
              </Link>
              {account && (
                <Link
                  to="/dashboard"
                  className="nav-item !text-white hover:!text-white transition"
                  style={{ opacity: 1, transform: "none" }}
                >
                  Dashboard
                </Link>
              )}
            </nav>
          </div>

          {/* Right: Wallet Connect Button */}
          <div className="hidden md:block">
            <ConnectButton
              connectText={
                <div className="flex items-center">
                  <Wallet size={16} className="mr-2" />
                  Connect Wallet
                </div>
              }
              connectedText={
                <div className="flex items-center">
                  <Wallet size={16} className="mr-2" />
                  {account ? formatAddress(account.address) : "Connected"}
                </div>
              }
              className={`wallet-btn flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                account
                  ? "bg-green-600/20 text-green-400 border border-green-500/30"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              }`}
            />
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden flex items-center absolute top-0 right-0 h-full pr-4">
        <button
          className="flex items-center text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-lg">
          <div className="pt-2 pb-4 px-4 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 text-white hover:bg-white/10 rounded-md"
            >
              Home
            </Link>
            <Link
              to="/create"
              className="block px-3 py-2 text-white hover:bg-white/10 rounded-md"
            >
              Create Token
            </Link>
            <Link
              to="/learn"
              className="block px-3 py-2 text-white hover:bg-white/10 rounded-md"
            >
              Learn
            </Link>
            {account && (
              <Link
                to="/dashboard"
                className="block px-3 py-2 text-white hover:bg-white/10 rounded-md"
              >
                Dashboard
              </Link>
            )}
            <div className="mt-3">
              <ConnectButton
                connectText={
                  <div className="flex items-center justify-center w-full">
                    <Wallet size={16} className="mr-2" />
                    Connect Wallet
                  </div>
                }
                connectedText={
                  <div className="flex items-center justify-center w-full">
                    <Wallet size={16} className="mr-2" />
                    {account ? formatAddress(account.address) : "Connected"}
                  </div>
                }
                className={`w-full flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium ${
                  account
                    ? "bg-green-600/20 text-green-400 border border-green-500/30"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
