import React from 'react';
import { Hexagon } from 'lucide-react';

const Logo = () => {
  return (
    <div className="relative">
      <Hexagon 
        size={32} 
        className="text-indigo-500 fill-indigo-500/20" 
      />
      <Hexagon 
        size={24} 
        className="absolute top-1 left-1 text-purple-500 fill-purple-500/20" 
      />
    </div>
  );
};

export default Logo;