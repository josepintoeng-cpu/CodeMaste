import React, { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Sparkles, Trophy, CheckCircle2, ArrowRight, Star } from 'lucide-react';
import { useI18n } from '../i18n';

interface Particle {
  id: number;
  x: number;
  y: number;
  scale: number;
  rotate: number;
  color: string;
  shape: 'rect' | 'circle' | 'ribbon' | 'star';
  duration: number;
  delay: number;
}

interface SparkleParticle {
  id: number;
  top: string;
  left: string;
  size: number;
  delay: number;
}

interface CelebrationEffectProps {
  show: boolean;
  xpEarned?: number;
  title?: string;
  subtitle?: string;
  onClose?: () => void;
  autoClose?: boolean;
}

export const CelebrationEffect: React.FC<CelebrationEffectProps> = ({
  show,
  xpEarned,
  title,
  subtitle,
  onClose,
  autoClose = false,
}) => {
  const { t } = useI18n();

  const displayTitle = title || t('celebration.defaultTitle');
  const displaySubtitle = subtitle || t('celebration.defaultSubtitle');

  // Efeito sonoro sintetizado via Web Audio API (agradável e sem dependência externa)
  useEffect(() => {
    if (!show) return;

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      // Fanfarra arpejo maior: C5 (523.25Hz), E5 (659.25Hz), G5 (783.99Hz), C6 (1046.50Hz)
      const notes = [523.25, 659.25, 783.99, 1046.5];
      const startTime = ctx.currentTime + 0.05;

      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime + index * 0.09);

        gain.gain.setValueAtTime(0, startTime + index * 0.09);
        gain.gain.linearRampToValueAtTime(0.18, startTime + index * 0.09 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + index * 0.09 + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime + index * 0.09);
        osc.stop(startTime + index * 0.09 + 0.5);
      });
    } catch {
      // Audio context não suportado ou bloqueado pelo browser
    }
  }, [show]);

  // Auto-fechamento opcional
  useEffect(() => {
    if (show && autoClose && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [show, autoClose, onClose]);

  // Gerar partículas de confete dinâmicas
  const particles = useMemo<Particle[]>(() => {
    const colors = [
      '#F97316', // Orange CodeMaster
      '#FB923C', // Lighter orange
      '#FBBF24', // Amber/Gold
      '#34D399', // Emerald
      '#60A5FA', // Blue
      '#A78BFA', // Purple
      '#F43F5E', // Rose
      '#FFFFFF', // Pure white sparkle
    ];

    const shapes: ('rect' | 'circle' | 'ribbon' | 'star')[] = ['rect', 'circle', 'ribbon', 'star'];

    return Array.from({ length: 48 }, (_, i) => {
      const angle = (Math.random() * Math.PI) + (Math.PI * 0.5); // disparando para cima em arco
      const distance = 180 + Math.random() * 320;
      const x = Math.cos(angle) * distance * (Math.random() > 0.5 ? 1 : -1);
      const y = -140 - Math.random() * 380;

      return {
        id: i,
        x,
        y,
        scale: 0.5 + Math.random() * 0.8,
        rotate: (Math.random() - 0.5) * 1080,
        color: colors[i % colors.length],
        shape: shapes[i % shapes.length],
        duration: 1.8 + Math.random() * 1.2,
        delay: Math.random() * 0.25,
      };
    });
  }, [show]);

  // Partículas de brilho estrelado
  const sparkles = useMemo<SparkleParticle[]>(() => {
    return Array.from({ length: 16 }, (_, i) => ({
      id: i,
      top: `${15 + Math.random() * 70}%`,
      left: `${10 + Math.random() * 80}%`,
      size: 12 + Math.random() * 18,
      delay: 0.1 + Math.random() * 0.5,
    }));
  }, [show]);

  if (!show) return null;

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden pointer-events-auto">
          {/* Backdrop Escuro com Blur Editorial */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Radial Glow de Fundo */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0.8, 1.4, 1.2],
              opacity: [0, 0.4, 0.25],
            }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="absolute w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-orange-600/40 via-amber-500/20 to-transparent blur-3xl pointer-events-none"
          />

          {/* Explosão de Confetes Framer-Motion */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {particles.map(p => (
              <motion.div
                key={p.id}
                initial={{
                  x: 0,
                  y: 50,
                  opacity: 1,
                  scale: 0,
                  rotate: 0,
                }}
                animate={{
                  x: p.x,
                  y: [50, p.y, p.y + 180],
                  opacity: [1, 1, 0],
                  scale: [0, p.scale, p.scale * 0.8],
                  rotate: p.rotate,
                }}
                transition={{
                  duration: p.duration,
                  delay: p.delay,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`absolute shadow-lg ${
                  p.shape === 'circle'
                    ? 'rounded-full w-3.5 h-3.5'
                    : p.shape === 'ribbon'
                    ? 'w-1.5 h-4.5 rounded-sm'
                    : p.shape === 'star'
                    ? 'w-2.5 h-2.5 rotate-45'
                    : 'w-3 h-3 rounded-xs'
                }`}
                style={{ backgroundColor: p.color }}
              />
            ))}

            {/* Estrelas Cintilantes Flutuantes */}
            {sparkles.map(s => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, scale: 0, rotate: -45 }}
                animate={{
                  opacity: [0, 1, 0.8, 0],
                  scale: [0, 1.2, 0.9, 0],
                  rotate: [-45, 45, 90],
                }}
                transition={{
                  duration: 1.5,
                  delay: s.delay,
                  repeat: Infinity,
                  repeatDelay: 0.8,
                }}
                style={{ top: s.top, left: s.left, position: 'absolute' }}
                className="text-amber-300 pointer-events-none drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]"
              >
                <Sparkles style={{ width: s.size, height: s.size }} />
              </motion.div>
            ))}
          </div>

          {/* Card Principal de Celebração e Recompensa Gamificada */}
          <motion.div
            initial={{ opacity: 0, scale: 0.75, y: 30 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{ opacity: 0, scale: 0.85, y: -20 }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 20,
              delay: 0.08,
            }}
            className="relative z-10 w-full max-w-sm bg-[#1A1A1C] border border-orange-500/40 rounded-3xl p-6 text-center space-y-4 shadow-[0_0_50px_rgba(249,115,22,0.25)]"
          >
            {/* Halo Pulsante no Topo */}
            <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
              <motion.div
                animate={{
                  rotate: 360,
                  scale: [1, 1.15, 1],
                }}
                transition={{
                  rotate: { duration: 10, repeat: Infinity, ease: 'linear' },
                  scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                }}
                className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 opacity-30 blur-md"
              />

              <motion.div
                initial={{ rotate: -20, scale: 0.5 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.15 }}
                className="relative w-18 h-18 rounded-2xl bg-gradient-to-br from-orange-500 via-orange-600 to-amber-500 flex items-center justify-center text-black shadow-xl border border-orange-300/40"
              >
                <Trophy className="w-9 h-9 text-black drop-shadow-sm" />
              </motion.div>
            </div>

            {/* Títulos e Feedback */}
            <div className="space-y-1">
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-[10px] uppercase font-black text-orange-400 tracking-widest flex items-center justify-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {t('celebration.unlocked')}
                <Sparkles className="w-3.5 h-3.5" />
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="text-xl font-extrabold text-white tracking-tight font-serif-italic"
              >
                {displayTitle}
              </motion.h3>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xs text-white/60 leading-relaxed px-2"
              >
                {displaySubtitle}
              </motion.p>
            </div>

            {/* Destaque de XP Gamificado com Animação de Pulso */}
            {typeof xpEarned === 'number' && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 18,
                  delay: 0.35,
                }}
                className="bg-gradient-to-r from-orange-950/60 via-black/80 to-orange-950/60 border border-orange-500/40 rounded-2xl p-3.5 flex items-center justify-center gap-3 shadow-inner"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.25, 1],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 0.5,
                  }}
                  className="w-8 h-8 rounded-xl bg-orange-500 text-black flex items-center justify-center font-black shadow-md shrink-0"
                >
                  <Zap className="w-5 h-5 fill-black text-black" />
                </motion.div>

                <div className="text-left">
                  <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider">
                    {t('celebration.rewardAcquired')}
                  </div>
                  <div className="text-lg font-black text-orange-400 tracking-tight flex items-center gap-1.5">
                    <span>+{xpEarned} {t('header.xp')}</span>
                    <span className="text-[10px] font-normal text-white/60 bg-white/10 px-2 py-0.5 rounded-full">
                      {t('celebration.credited')}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Botão de Ação / Continuar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="pt-2"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={onClose}
                className="w-full py-3.5 bg-gradient-to-r from-orange-500 via-orange-400 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer touch-btn"
              >
                <CheckCircle2 className="w-4 h-4 text-black" />
                <span>{t('celebration.continue')}</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
