import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  element: HTMLDivElement;
}

const ParticlesBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const particles: Particle[] = [];
    const particleCount = window.innerWidth < 768 ? 30 : 60;
    
    const colors = [
      'rgba(124, 58, 237, 0.5)',   // Purple
      'rgba(99, 102, 241, 0.5)',   // Indigo
      'rgba(16, 185, 129, 0.5)',   // Green
      'rgba(217, 70, 239, 0.5)',   // Pink
    ];
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
      const size = Math.random() * 5 + 2;
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      const speedX = (Math.random() - 0.5) * 0.3;
      const speedY = (Math.random() - 0.5) * 0.3;
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      const element = document.createElement('div');
      element.style.position = 'absolute';
      element.style.width = `${size}px`;
      element.style.height = `${size}px`;
      element.style.borderRadius = '50%';
      element.style.background = color;
      element.style.boxShadow = `0 0 ${size * 2}px ${color}`;
      element.style.left = `${x}px`;
      element.style.top = `${y}px`;
      
      container.appendChild(element);
      
      particles.push({
        x, y, size, speedX, speedY, color, element
      });
    }
    
    particlesRef.current = particles;
    
    // Animation loop
    const animate = () => {
      particles.forEach(particle => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Bounce off edges
        if (particle.x < 0 || particle.x > window.innerWidth) {
          particle.speedX *= -1;
        }
        
        if (particle.y < 0 || particle.y > window.innerHeight) {
          particle.speedY *= -1;
        }
        
        // Update position
        particle.element.style.left = `${particle.x}px`;
        particle.element.style.top = `${particle.y}px`;
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Mouse interaction effect
    const handleMouseMove = (e: MouseEvent) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      
      particles.forEach(particle => {
        // Calculate distance
        const dx = mouseX - particle.x;
        const dy = mouseY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          // Repel particles
          const angle = Math.atan2(dy, dx);
          const force = (100 - distance) / 1500;
          
          particle.speedX -= Math.cos(angle) * force;
          particle.speedY -= Math.sin(angle) * force;
        }
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      // Clean up particles
      particles.forEach(particle => {
        if (particle.element.parentNode) {
          particle.element.parentNode.removeChild(particle.element);
        }
      });
    };
  }, []);
  
  return (
    <div 
      ref={containerRef} 
      className="particles-container"
      aria-hidden="true"
    />
  );
};

export default ParticlesBackground;