import React, { useEffect, useRef } from 'react';

interface InteractiveBackgroundProps {
  /**
   * Color of the particles.
   * @default 'rgba(255, 255, 255, 0.5)'
   */
  particleColor?: string;
  /**
   * Color of the connecting lines.
   * @default 'rgba(255, 255, 255, 0.2)'
   */
  lineColor?: string;
  particleCount?: number;
  cursorRadius?: number;
}

const InteractiveBackground: React.FC<InteractiveBackgroundProps> = ({
  particleColor = 'rgba(255, 255, 255, 0.8)',
  lineColor = 'rgba(255, 255, 255, 0.15)',
  particleCount = 100,
  cursorRadius = 150,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  const mouseRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];

    class Particle {
      x: number;
      y: number;
      directionX: number;
      directionY: number;
      size: number;
      color: string;

      constructor(x: number, y: number, directionX: number, directionY: number, size: number, color: string) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      update() {
        // Wall collision
        if (this.x > canvas!.width || this.x < 0) {
          this.directionX = -this.directionX;
        }
        if (this.y > canvas!.height || this.y < 0) {
          this.directionY = -this.directionY;
        }

        // Mouse interaction
        const mouse = mouseRef.current;
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // If particle is within mouse radius, move it away (antigravity effect)
          if (distance < cursorRadius) {
            // Calculate angle and force
            const angle = Math.atan2(dy, dx);
            const forceDirectionX = Math.cos(angle);
            const forceDirectionY = Math.sin(angle);
            const force = (cursorRadius - distance) / cursorRadius;
            const directionX = forceDirectionX * force * 5; // Strength multiplier
            const directionY = forceDirectionY * force * 5;

            // Push away
            this.x -= directionX;
            this.y -= directionY;
          } else {
            // Return to normal movement if outside radius
             if (this.x !== this.x + this.directionX) {
                this.x += this.directionX;
                this.y += this.directionY;
             }
          }
        } else {
             // Standard movement
            this.x += this.directionX;
            this.y += this.directionY;
        }
        
        // Redraw
        this.draw();
      }
    }

    const init = () => {
      particles = [];
      const numberOfParticles = (canvas.width * canvas.height) / 9000; // Responsive count based on area
      
      // Override or stick to a responsive calculation? 
      // User asked for particleCount prop, let's use it or calculation.
      // Let's use the explicit count but scaled slightly if needed.
      // Actually, let's just use the prop to be deterministic or a logic:
      const count = window.innerWidth < 768 ? particleCount / 2 : particleCount;

      for (let i = 0; i < count; i++) {
        const size = (Math.random() * 2) + 1;
        const x = Math.random() * (canvas.width - size * 2) + size * 2;
        const y = Math.random() * (canvas.height - size * 2) + size * 2;
        const directionX = (Math.random() * 2) - 1; // Speed vector X
        const directionY = (Math.random() * 2) - 1; // Speed vector Y
        const color = particleColor;

        particles.push(new Particle(x, y, directionX, directionY, size, color));
      }
    };

    const connect = () => {
        let opacityValue = 1;
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                const dx = particles[a].x - particles[b].x;
                const dy = particles[a].y - particles[b].y;
                const distance = dx * dx + dy * dy;

                if (distance < 20000) {
                    opacityValue = 1 - (distance / 20000);
                    // Use lineColor but inject opacity? 
                    // Assuming lineColor is rgba, we might need to parse it or just use a default white with varying opacity.
                    // Simple approach: strokeStyle
                    // If lineColor is passed as rgba or hex, opacity manipulation is tricky without parsing.
                    // Let's assume standard white-ish for now or use the prop if provided but fixed opacity?
                    // The user said "create a 'web' or 'constellation' effect that fluctuates".
                    // Typically we modify globalAlpha or use rgba with dynamic alpha.
                    
                    ctx.globalAlpha = opacityValue > 0 ? opacityValue : 0;
                    ctx.strokeStyle = lineColor;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                }
            }
            // Optional: Connect to mouse as well for "web" effect from cursor
            const mouse = mouseRef.current;
            if (mouse.x !== null && mouse.y !== null) {
                const dx = particles[a].x - mouse.x;
                const dy = particles[a].y - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < cursorRadius) {
                    ctx.globalAlpha = (1 - distance / cursorRadius);
                    ctx.strokeStyle = lineColor;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                }
            }
        }
    }

    const animate = () => {
      requestRef.current = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
      }
      connect();
    };

    const handleResize = () => {
      // Set canvas size to match parent
      if (containerRef.current) {
        canvas.width = containerRef.current.clientWidth;
        canvas.height = containerRef.current.clientHeight;
      } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
      init();
    };

    const handleMouseMove = (e: MouseEvent) => {
        // Adjust for canvas position if needed, but since it's fixed/absolute to screen/hero:
        const rect = canvas.getBoundingClientRect();
        mouseRef.current.x = e.clientX - rect.left;
        mouseRef.current.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
        mouseRef.current.x = null;
        mouseRef.current.y = null;
    }

    // Initial setup
    handleResize();
    animate();

    // Listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseLeave);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseLeave);
    };
  }, [particleColor, lineColor, particleCount, cursorRadius]);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <canvas 
        ref={canvasRef} 
        className="block bg-transparent"
      />
    </div>
  );
};

export default InteractiveBackground;
