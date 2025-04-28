// src/components/common/CosmicJourney.jsx
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const CosmicJourney = ({ currentStep = 0, totalSteps = 10 }) => {
  const canvasRef = useRef(null);
  const journeyProgress = currentStep / totalSteps;
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    
    // Set canvas to full screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Create starfield particles
    const createParticles = () => {
      particles = [];
      const particleCount = Math.floor(canvas.width * canvas.height / 6000); // Increased particle count
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 1,
          speed: Math.random() * 0.2 + 0.1,
          brightness: Math.random() * 0.5 + 0.5,
          color: getStarColor()
        });
      }
      
      // Add some larger brighter stars
      for (let i = 0; i < particleCount / 8; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 2,
          speed: Math.random() * 0.1 + 0.05,
          brightness: Math.random() * 0.3 + 0.7,
          color: getStarColor(),
          pulse: Math.random() * 0.1
        });
      }
      
      // Add energy path particles across the entire screen
      const pathParticleCount = Math.floor(canvas.width / 3); // More particles
      
      for (let i = 0; i < pathParticleCount; i++) {
        const xPos = Math.random() * canvas.width;
        const yPos = Math.random() * canvas.height;
        
        // Particles are now distributed across the entire screen
        const distFromCenter = Math.min(
          Math.abs(xPos - canvas.width / 2) / (canvas.width / 2),
          Math.abs(yPos - canvas.height / 2) / (canvas.height / 2)
        );
        
        // Particles closer to center are brighter and faster
        const centerFactor = 1 - Math.min(1, distFromCenter);
        
        particles.push({
          x: xPos,
          y: yPos,
          size: Math.random() * 4 * centerFactor + 1,
          speed: (Math.random() * 0.5 + 0.5) * centerFactor,
          brightness: centerFactor * 0.8 + 0.2,
          color: getEnergyColor(centerFactor),
          isPath: true,
          centerFactor,
          angle: Math.random() * Math.PI * 2 // Random direction
        });
      }
    };
    
    const getStarColor = () => {
      const colors = [
        '255, 255, 255', // White
        '240, 248, 255', // Alice Blue
        '230, 230, 250', // Lavender
        '224, 255, 255', // Light Cyan
        '215, 236, 255'  // Very Light Blue
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    };
    
    const getEnergyColor = (factor) => {
      // Interpolate between colors based on the journey progress
      const progressColors = [
        [75, 143, 213],   // Blue
        [91, 192, 190],   // Teal
        [120, 214, 114],  // Green
        [147, 112, 219],  // Purple
        [255, 165, 0]     // Orange
      ];
      
      const colorIndex = Math.min(
        progressColors.length - 2,
        Math.floor(journeyProgress * (progressColors.length - 1))
      );
      
      const nextColorWeight = (journeyProgress * (progressColors.length - 1)) % 1;
      const thisColorWeight = 1 - nextColorWeight;
      
      const thisColor = progressColors[colorIndex];
      const nextColor = progressColors[colorIndex + 1];
      
      const r = Math.floor(thisColor[0] * thisColorWeight + nextColor[0] * nextColorWeight);
      const g = Math.floor(thisColor[1] * thisColorWeight + nextColor[1] * nextColorWeight);
      const b = Math.floor(thisColor[2] * thisColorWeight + nextColor[2] * nextColorWeight);
      
      return `${r}, ${g}, ${b}`;
    };
    
    // Render animation
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and render particles
      particles.forEach(particle => {
        // Update position
        if (particle.isPath) {
          // Path particles have a more complex movement pattern
          if (!particle.angle) {
            particle.angle = Math.random() * Math.PI * 2;
          }
          
          // Move in the direction of the angle with slight oscillation
          particle.x += Math.cos(particle.angle + Math.sin(Date.now() * 0.001) * 0.2) * particle.speed;
          particle.y += Math.sin(particle.angle + Math.sin(Date.now() * 0.001) * 0.2) * particle.speed;
          
          // Wrap around screen edges
          if (particle.x < 0) particle.x = canvas.width;
          if (particle.x > canvas.width) particle.x = 0;
          if (particle.y < 0) particle.y = canvas.height;
          if (particle.y > canvas.height) particle.y = 0;
        } else {
          // Regular stars move up slowly
          particle.y -= particle.speed;
          
          // Wrap around screen
          if (particle.y < 0) {
            particle.y = canvas.height;
            particle.x = Math.random() * canvas.width;
          }
        }
        
        // Pulse effect for some particles
        let size = particle.size;
        if (particle.pulse) {
          size += Math.sin(Date.now() * 0.004) * particle.pulse * particle.size;
        }
        
        // Draw particle
        const alpha = particle.isPath ? 
          particle.brightness * (0.3 + 0.7 * particle.centerFactor) : 
          particle.brightness;
          
        ctx.globalAlpha = alpha;
        ctx.fillStyle = `rgba(${particle.color}, ${alpha})`;
        
        if (particle.isPath && particle.centerFactor > 0.7) {
          // For path particles near the center, add a glow effect
          ctx.shadowBlur = 10 * particle.centerFactor;
          ctx.shadowColor = `rgba(${particle.color}, 0.7)`;
        } else {
          ctx.shadowBlur = 0;
        }
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
        ctx.fill();
      });
      
      // Render cosmic path/stream (semi-transparent light path)
      ctx.globalAlpha = 0.2;
      ctx.globalCompositeOperation = 'lighter';
      
      // Add more ambient light paths around the screen
      for (let i = 0; i < 5; i++) {
        const gradient = ctx.createRadialGradient(
          canvas.width * (0.3 + 0.4 * Math.sin(Date.now() * 0.0001 + i)),
          canvas.height * (0.3 + 0.4 * Math.cos(Date.now() * 0.0001 + i)),
          0,
          canvas.width * (0.3 + 0.4 * Math.sin(Date.now() * 0.0001 + i)),
          canvas.height * (0.3 + 0.4 * Math.cos(Date.now() * 0.0001 + i)),
          canvas.width * 0.3
        );
        
        gradient.addColorStop(0, `rgba(${getEnergyColor(1)}, ${0.03 + journeyProgress * 0.04})`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      ctx.globalCompositeOperation = 'source-over';
      
      animationFrameId = window.requestAnimationFrame(render);
    };
    
    // Initialize particles and start animation
    createParticles();
    render();
    
    // Clean up
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [journeyProgress, totalSteps]);
  
  return <JourneyCanvas ref={canvasRef} />;
};

const JourneyCanvas = styled.canvas`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
`;

export default CosmicJourney;
