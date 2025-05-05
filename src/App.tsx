import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Layout from './components/Layout';
import Home from './pages/Home';
import CreateToken from './pages/CreateToken';
import Dashboard from './pages/Dashboard';
import Explore from './pages/Explore';
import Learn from './pages/Learn';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

function App() {
  useEffect(() => {
    // Initialize any global GSAP animations here
    gsap.to("body", { 
      duration: 0, 
      css: { visibility: "visible" } 
    });
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="create" element={<CreateToken />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="explore" element={<Explore />} />
        <Route path="learn" element={<Learn />} />
      </Route>
    </Routes>
  );
}

export default App;