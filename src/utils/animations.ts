import { Variants } from 'motion/react';

// Transição suave fadeInUp editorial
export const fadeInUp: Variants = {
  initial: {
    opacity: 0,
    y: 16,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.32,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: {
      duration: 0.18,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// Transição com stagger para grids e listas de cards
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.02,
    },
  },
};

// Variação para cada card individual dentro de uma lista com stagger
export const cardVariant: Variants = {
  initial: {
    opacity: 0,
    y: 14,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.28,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// Animação Flutuante Contínua (Floating Bobbing Effect)
export const floatingVariant: Variants = {
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 3.8,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut',
    },
  },
};

// Animação Flutuante com Leve Rotação (Slow Dynamic Float)
export const floatingSlowRotate: Variants = {
  animate: {
    y: [0, -10, 0],
    rotate: [0, 1.5, -1.5, 0],
    transition: {
      duration: 5,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut',
    },
  },
};

// Variação para elementos que flutuam ao entrar no viewport no scroll
export const scrollFloatReveal: Variants = {
  initial: {
    opacity: 0,
    y: 28,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// Variação para modais e popups
export const modalVariant: Variants = {
  initial: {
    opacity: 0,
    scale: 0.95,
    y: 10,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.24,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: {
      duration: 0.18,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// Variação para overlay backdrop
export const backdropVariant: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

