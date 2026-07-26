import React from 'react';
import { motion } from 'motion/react';

interface ConfettiEffectProps {
  show: boolean;
}

export const ConfettiEffect: React.FC<ConfettiEffectProps> = ({ show }) => {
  if (!show) return null;

  const particles = Array.from({ length: 30 });
  const colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#10b981'];

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden flex items-center justify-center">
      {particles.map((_, i) => {
        const color = colors[i % colors.length];
        const randomX = (Math.random() - 0.5) * 350;
        const randomY = -200 - Math.random() * 300;
        const rotate = Math.random() * 720;
        const scale = 0.6 + Math.random() * 0.8;

        return (
          <motion.div
            key={i}
            initial={{ x: 0, y: 0, opacity: 1, scale, rotate: 0 }}
            animate={{
              x: randomX,
              y: randomY,
              opacity: 0,
              rotate: rotate,
            }}
            transition={{
              duration: 1.5 + Math.random(),
              ease: 'easeOut',
            }}
            className="absolute w-3 h-3 rounded-sm shadow-md"
            style={{ backgroundColor: color }}
          />
        );
      })}
    </div>
  );
};
