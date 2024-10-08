"use client";

import React, { useEffect, useRef, useState } from "react";

function useMousePosition() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleMouseMove = (event) => {
        setMousePosition({ x: event.clientX, y: event.clientY });
      };

      window.addEventListener("mousemove", handleMouseMove);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
      };
    }
  }, []);

  return mousePosition;
}

function hexToRgb(hex) {
  hex = hex.replace("#", "");
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
}

const Particles = ({ className = "", quantity = 125, ease = 50, color = "#ffffff" }) => {
  const canvasRef = useRef(null);
  const context = useRef(null);
  const mousePosition = useMousePosition();
  const [dpr, setDpr] = useState(1);  // Keep only this declaration
  const particles = useRef([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDpr(window.devicePixelRatio || 1);

      const canvas = canvasRef.current;
      if (canvas) {
        context.current = canvas.getContext("2d");
      }

      initCanvas();
      createParticles();
      animate();

      window.addEventListener("resize", initCanvas);

      return () => {
        window.removeEventListener("resize", initCanvas);
      };
    }
  }, [color]);

  const initCanvas = () => {
    if (canvasRef.current && context.current && typeof window !== 'undefined') {
      const canvas = canvasRef.current;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      context.current.scale(dpr, dpr);
    }
  };

  const createParticles = () => {
    if (typeof window !== 'undefined') {
      particles.current = [];
      for (let i = 0; i < quantity; i++) {
        particles.current.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 3 + 0.5, // Size between 0.5 and 3.5
          speedX: Math.random() * 0.75 - 0.375, // Speed between -0.375 and 0.375
          speedY: Math.random() * 0.75 - 0.375, // Speed between -0.375 and 0.375
          color: hexToRgb(color),
        });
      }
    }
  };

  const drawParticles = () => {
    if (!context.current || typeof window === 'undefined') return;

    context.current.clearRect(0, 0, window.innerWidth * dpr, window.innerHeight * dpr);

    particles.current.forEach((particle) => {
      context.current.beginPath();
      context.current.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.current.fillStyle = `rgba(${particle.color[0]}, ${particle.color[1]}, ${particle.color[2]}, 0.5)`; // Adjusted opacity
      context.current.fill();
      context.current.closePath();

      // Update particle position
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      // Wrap around screen edges
      if (particle.x < 0) particle.x = window.innerWidth;
      if (particle.x > window.innerWidth) particle.x = 0;
      if (particle.y < 0) particle.y = window.innerHeight;
      if (particle.y > window.innerHeight) particle.y = 0;
    });
  };

  const animate = () => {
    drawParticles();
    if (typeof window !== 'undefined') {
      window.requestAnimationFrame(animate);
    }
  };

  return <canvas ref={canvasRef} className={`${className} w-full h-full pointer-events-none absolute inset-0 z-0`} />;
};

export default Particles;
