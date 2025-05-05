import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Search, Filter, ArrowUpRight, ArrowDownRight, ChevronRight, TrendingUp } from 'lucide-react';

const Explore = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!pageRef.current) return;
    
    const ctx = gsap.context(() => {
      gsap.from('.page-title', {
        y: -20,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out'
      });
      
      gsap.from('.search-container', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        delay: 0.2,
        ease: 'power2.out'
      });
      
      gsap.from('.explore-card', {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        delay: 0.4,
        ease: 'power2.out'
      });
      
      gsap.from('.token-item', {
        x: -20,
        opacity: 0,
        stagger: 0.05,
        duration: 0.5,
        delay: 0.6,
        ease: 'power2.out'
      });
    }, pageRef);
    
    return () => ctx.revert();
  }, []);
  
  return (
    <div ref={pageRef} className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="page-title text-3xl md:text-4xl font-bold mb-2">Explore Tokens</h1>
        <p className="text-white/70 mb-8">
          Discover and explore tokens created with TokenForge
        </p>
        
        {/* Search and filters */}
        <div className="search-container glass-card p-6 mb-10">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search size={18} className="absolute left-3 top-3 text-white/50" />
              <input
                type="text"
                placeholder="Search tokens by name or address"
                className="form-input pl-10"
              />
            </div>
            
            <div className="flex gap-4">
              <select className="form-input bg-white/5 px-4 py-3">
                <option value="">All Networks</option>
                <option value="ethereum">Ethereum</option>
                <option value="bsc">Binance Smart Chain</option>
                <option value="polygon">Polygon</option>
                <option value="avalanche">Avalanche</option>
              </select>
              
              <button className="btn-secondary flex items-center">
                <Filter size={18} className="mr-2" />
                Filters
              </button>
            </div>
          </div>
        </div>
        
        {/* Trending tokens */}
        <div className="explore-card glass-card p-6 mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold flex items-center">
              <TrendingUp size={20} className="mr-2 text-indigo-400" />
              Trending Tokens
            </h2>
            <button className="text-sm text-indigo-400 hover:text-indigo-300 transition flex items-center">
              View All <ChevronRight size={16} />
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-white/50 text-sm border-b border-white/10">
                  <th className="pb-3 pl-2">#</th>
                  <th className="pb-3">Token</th>
                  <th className="pb-3">Price</th>
                  <th className="pb-3">24h Change</th>
                  <th className="pb-3">7d Change</th>
                  <th className="pb-3">Market Cap</th>
                  <th className="pb-3">Holders</th>
                </tr>
              </thead>
              <tbody>
                {/* Token 1 */}
                <tr className="token-item border-b border-white/5 hover:bg-white/5 transition">
                  <td className="py-4 px-2">1</td>
                  <td className="py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium mr-3">D</div>
                      <div>
                        <div className="font-medium">DigiDollar</div>
                        <div className="text-white/50 text-sm">DDOL</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">$1.02</td>
                  <td className="py-4">
                    <span className="flex items-center text-green-400">
                      <ArrowUpRight size={16} className="mr-1" />
                      5.6%
                    </span>
                  </td>
                  <td className="py-4">
                    <span className="flex items-center text-green-400">
                      <ArrowUpRight size={16} className="mr-1" />
                      12.3%
                    </span>
                  </td>
                  <td className="py-4">$10.2M</td>
                  <td className="py-4">1,543</td>
                </tr>
                
                {/* Token 2 */}
                <tr className="token-item border-b border-white/5 hover:bg-white/5 transition">
                  <td className="py-4 px-2">2</td>
                  <td className="py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-medium mr-3">M</div>
                      <div>
                        <div className="font-medium">MetaVerse Token</div>
                        <div className="text-white/50 text-sm">META</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">$0.85</td>
                  <td className="py-4">
                    <span className="flex items-center text-green-400">
                      <ArrowUpRight size={16} className="mr-1" />
                      3.2%
                    </span>
                  </td>
                  <td className="py-4">
                    <span className="flex items-center text-green-400">
                      <ArrowUpRight size={16} className="mr-1" />
                      8.7%
                    </span>
                  </td>
                  <td className="py-4">$8.5M</td>
                  <td className="py-4">2,189</td>
                </tr>
                
                {/* Token 3 */}
                <tr className="token-item border-b border-white/5 hover:bg-white/5 transition">
                  <td className="py-4 px-2">3</td>
                  <td className="py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-pink-600 flex items-center justify-center text-white font-medium mr-3">G</div>
                      <div>
                        <div className="font-medium">GameFi Token</div>
                        <div className="text-white/50 text-sm">GAME</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">$2.41</td>
                  <td className="py-4">
                    <span className="flex items-center text-red-400">
                      <ArrowDownRight size={16} className="mr-1" />
                      1.8%
                    </span>
                  </td>
                  <td className="py-4">
                    <span className="flex items-center text-green-400">
                      <ArrowUpRight size={16} className="mr-1" />
                      15.2%
                    </span>
                  </td>
                  <td className="py-4">$24.1M</td>
                  <td className="py-4">4,732</td>
                </tr>
                
                {/* Token 4 */}
                <tr className="token-item border-b border-white/5 hover:bg-white/5 transition">
                  <td className="py-4 px-2">4</td>
                  <td className="py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-medium mr-3">E</div>
                      <div>
                        <div className="font-medium">EcoChain</div>
                        <div className="text-white/50 text-sm">ECO</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">$0.32</td>
                  <td className="py-4">
                    <span className="flex items-center text-green-400">
                      <ArrowUpRight size={16} className="mr-1" />
                      7.4%
                    </span>
                  </td>
                  <td className="py-4">
                    <span className="flex items-center text-green-400">
                      <ArrowUpRight size={16} className="mr-1" />
                      23.8%
                    </span>
                  </td>
                  <td className="py-4">$3.2M</td>
                  <td className="py-4">876</td>
                </tr>
                
                {/* Token 5 */}
                <tr className="token-item hover:bg-white/5 transition">
                  <td className="py-4 px-2">5</td>
                  <td className="py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium mr-3">D</div>
                      <div>
                        <div className="font-medium">DeFi Protocol</div>
                        <div className="text-white/50 text-sm">DEFI</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">$5.18</td>
                  <td className="py-4">
                    <span className="flex items-center text-red-400">
                      <ArrowDownRight size={16} className="mr-1" />
                      2.3%
                    </span>
                  </td>
                  <td className="py-4">
                    <span className="flex items-center text-green-400">
                      <ArrowUpRight size={16} className="mr-1" />
                      6.1%
                    </span>
                  </td>
                  <td className="py-4">$51.8M</td>
                  <td className="py-4">3,421</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Recently Added */}
        <div className="explore-card glass-card p-6 mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Recently Added</h2>
            <button className="text-sm text-indigo-400 hover:text-indigo-300 transition flex items-center">
              View All <ChevronRight size={16} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Token Card 1 */}
            <div className="token-item bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition">
              <div className="p-5 border-b border-white/10">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium mr-3">N</div>
                  <div>
                    <div className="font-medium">NextGen Protocol</div>
                    <div className="text-white/50 text-sm">NGP</div>
                  </div>
                </div>
              </div>
              
              <div className="p-5">
                <div className="flex justify-between mb-2">
                  <div className="text-white/50 text-sm">Network</div>
                  <div className="text-sm">Ethereum</div>
                </div>
                
                <div className="flex justify-between mb-2">
                  <div className="text-white/50 text-sm">Initial Supply</div>
                  <div className="text-sm">10,000,000</div>
                </div>
                
                <div className="flex justify-between">
                  <div className="text-white/50 text-sm">Created</div>
                  <div className="text-sm">2 days ago</div>
                </div>
              </div>
            </div>
            
            {/* Token Card 2 */}
            <div className="token-item bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition">
              <div className="p-5 border-b border-white/10">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-pink-600 flex items-center justify-center text-white font-medium mr-3">A</div>
                  <div>
                    <div className="font-medium">Art NFT Token</div>
                    <div className="text-white/50 text-sm">ANFT</div>
                  </div>
                </div>
              </div>
              
              <div className="p-5">
                <div className="flex justify-between mb-2">
                  <div className="text-white/50 text-sm">Network</div>
                  <div className="text-sm">Polygon</div>
                </div>
                
                <div className="flex justify-between mb-2">
                  <div className="text-white/50 text-sm">Initial Supply</div>
                  <div className="text-sm">5,000,000</div>
                </div>
                
                <div className="flex justify-between">
                  <div className="text-white/50 text-sm">Created</div>
                  <div className="text-sm">3 days ago</div>
                </div>
              </div>
            </div>
            
            {/* Token Card 3 */}
            <div className="token-item bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition">
              <div className="p-5 border-b border-white/10">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-medium mr-3">S</div>
                  <div>
                    <div className="font-medium">Smart City Token</div>
                    <div className="text-white/50 text-sm">CITY</div>
                  </div>
                </div>
              </div>
              
              <div className="p-5">
                <div className="flex justify-between mb-2">
                  <div className="text-white/50 text-sm">Network</div>
                  <div className="text-sm">Avalanche</div>
                </div>
                
                <div className="flex justify-between mb-2">
                  <div className="text-white/50 text-sm">Initial Supply</div>
                  <div className="text-sm">50,000,000</div>
                </div>
                
                <div className="flex justify-between">
                  <div className="text-white/50 text-sm">Created</div>
                  <div className="text-sm">5 days ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;