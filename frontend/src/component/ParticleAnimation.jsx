// ParticleAnimation.js
import React, { useEffect, useRef } from 'react';

const ParticleAnimation = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Set canvas size to match the window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Array to store particle positions
    const particles = [];

    // Function to initialize particles
    function initParticles() {
      for (let i = 0; i < 200; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 5 + 2,
          speedX: Math.random() * 4 - 2,
          speedY: Math.random() * 4 - 2,
          color: `hsl(${Math.random() * 360}, 50%, 50%)`
        });
      }
    }

    // Function to draw particles
    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const particle of particles) {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();

        // Update particle position for animation
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Bounce particles off the walls
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX *= -1;
        }

        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY *= -1;
        }
      }

      requestAnimationFrame(drawParticles);
    }

    // Initialize particles and start the animation
    initParticles();
    drawParticles();

    // Resize canvas when the window is resized
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles.length = 0; // Clear the particles array
      initParticles();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} id="effects"></canvas>;
};

export default ParticleAnimation;
