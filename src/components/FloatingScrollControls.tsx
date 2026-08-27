import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import { useScrollDirection } from '../hooks/useScrollDirection';

interface FloatingScrollControlsProps {
  hasBottomNav?: boolean;
}

export const FloatingScrollControls: React.FC<FloatingScrollControlsProps> = ({
  hasBottomNav = true,
}) => {
  const { isScrolled, scrollProgress, scrollDirection } = useScrollDirection(15);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {/* Barra de Progresso Flutuante no Topo */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2.5px] z-50 pointer-events-none origin-left bg-gradient-to-r from-orange-600 via-orange-400 to-amber-400 shadow-[0_0_8px_rgba(249,115,22,0.6)]"
        style={{ scaleX: scrollProgress }}
        initial={{ scaleX: 0 }}
      />

      {/* Botão Flutuante de Retorno ao Topo com Micro-animação Dinâmica */}
      <AnimatePresence>
        {isScrolled && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{
              opacity: 1,
              y: scrollDirection === 'down' ? 6 : 0,
              scale: 1,
            }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 320, damping: 24 }}
            className={`fixed right-4 z-40 ${
              hasBottomNav ? 'bottom-20 sm:bottom-22' : 'bottom-6'
            }`}
          >
            <motion.button
              whileHover={{ scale: 1.12, y: -3 }}
              whileTap={{ scale: 0.9 }}
              animate={{
                y: [0, -4, 0],
              }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
              }}
              onClick={scrollToTop}
              className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[var(--bg-card)] border border-orange-500/40 text-orange-400 shadow-xl shadow-orange-500/20 backdrop-blur-md flex items-center justify-center touch-btn group overflow-hidden"
              title="Voltar ao topo"
            >
              {/* Circular Progress Stroke */}
              <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 44 44">
                <circle
                  cx="22"
                  cy="22"
                  r="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="opacity-15 text-[var(--border-strong)]"
                />
                <circle
                  cx="22"
                  cy="22"
                  r="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeDasharray="113.1"
                  strokeDashoffset={113.1 * (1 - scrollProgress)}
                  className="text-orange-500 transition-all duration-75 ease-out"
                />
              </svg>

              <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 group-hover:text-orange-300 stroke-[2.5] relative z-10 transition-transform group-hover:-translate-y-0.5" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
