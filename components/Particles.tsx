import React, { useMemo } from 'react';

type ParticleType = 'spark' | 'note';

interface ParticleProps {
  count: number;
  type: ParticleType;
}

interface ParticleStyle {
  left: string;
  animationDuration: string;
  animationDelay: string;
  opacity: number;
  scale: number;
}

export const Particles: React.FC<ParticleProps> = ({ count, type }) => {
  // Generate static random data for particles to prevent re-render flickers
  const particles = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const isSpark = type === 'spark';
      const duration = isSpark 
        ? 3 + Math.random() * 5 // Sparks: 3-8s
        : 6 + Math.random() * 8; // Notes: 6-14s (slower)
      
      const delay = Math.random() * 10; // 0-10s start delay
      const left = Math.random() * 100; // 0-100% width position

      return {
        id: i,
        left: `${left}%`,
        animationDuration: `${duration}s`,
        animationDelay: `-${delay}s`, // Negative delay to start animation mid-cycle
        opacity: isSpark ? 0.3 + Math.random() * 0.5 : 0.1 + Math.random() * 0.3,
        scale: isSpark ? 0.5 + Math.random() : 0.8 + Math.random() * 0.5,
      } as ParticleStyle & { id: number };
    });
  }, [count, type]);

  const notes = ['♪', '♫', '♩', '♬', '♭', '♮'];

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className={`absolute bottom-0 text-white ${type === 'spark' ? 'rounded-full bg-ember blur-[1px]' : 'font-serif'}`}
          style={{
            left: p.left,
            width: type === 'spark' ? `${p.scale * 3}px` : 'auto',
            height: type === 'spark' ? `${p.scale * 3}px` : 'auto',
            opacity: p.opacity,
            fontSize: type === 'note' ? `${p.scale * 1.5}rem` : undefined,
            color: type === 'note' ? 'rgba(255,255,255,0.4)' : undefined,
            // Inline animation composition
            animation: `rise ${p.animationDuration} linear infinite, sway ${parseFloat(p.animationDuration) / 2}s ease-in-out infinite alternate`,
            animationDelay: p.animationDelay,
            willChange: 'transform, opacity',
          }}
        >
          {type === 'note' ? notes[p.id % notes.length] : ''}
        </div>
      ))}
    </div>
  );
};