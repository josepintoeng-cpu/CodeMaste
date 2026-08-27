import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, ArrowRight, X, Sparkles, BookOpen, AlertCircle } from 'lucide-react';
import { TechUnlockState } from '../utils/unlockProgression';
import { useI18n } from '../i18n';
import { TechId } from '../types';

interface LockedTechModalProps {
  unlockState: TechUnlockState | null;
  onClose: () => void;
  onGoToTech: (techId: TechId) => void;
}

export const LockedTechModal: React.FC<LockedTechModalProps> = ({
  unlockState,
  onClose,
  onGoToTech,
}) => {
  const { t } = useI18n();

  if (!unlockState) return null;

  const { technology, prevTech, orderNumber, totalTechs } = unlockState;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop com blur suave */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 12 }}
          transition={{ type: 'spring', duration: 0.35, bounce: 0.15 }}
          className="relative w-full max-w-md bg-[var(--bg-card)] border border-orange-500/40 rounded-3xl p-6 shadow-2xl overflow-hidden z-10 space-y-5 text-[var(--text-primary)]"
        >
          {/* Ambient Glow */}
          <div className="absolute -top-16 -right-16 w-36 h-36 bg-orange-500/15 rounded-full blur-2xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-[var(--text-muted)] hover:text-white transition-colors touch-btn"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Lock Header Icon */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 shadow-inner">
              <Lock className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-black tracking-widest text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-md border border-orange-500/20">
                  {t('unlock.techOrder', { current: orderNumber, total: totalTechs })}
                </span>
              </div>
              <h3 className="text-lg font-extrabold text-[var(--text-primary)] leading-tight mt-1">
                {t('unlock.lockedTitle')}
              </h3>
            </div>
          </div>

          {/* Body Description */}
          <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: technology.color }} />
                {technology.name}
              </span>
              <span className="text-[10px] uppercase font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded">
                {t('unlock.locked')}
              </span>
            </div>

            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              {prevTech ? (
                <span>
                  Para desbloquear <strong>{technology.name}</strong>, você precisa primeiro concluir todas as 20 lições de{' '}
                  <strong className="text-orange-400">{prevTech.name}</strong>.
                </span>
              ) : (
                <span>Esta tecnologia faz parte da trilha sequencial de aprendizado.</span>
              )}
            </p>

            {prevTech && (
              <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-orange-300 flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    Requisito: {prevTech.name}
                  </span>
                  <span className="text-[10px] font-mono text-orange-400 font-bold">
                    {t('unlock.unlockCondition')}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            {prevTech && (
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  onClose();
                  onGoToTech(prevTech.id);
                }}
                className="w-full py-3.5 bg-orange-500 hover:bg-orange-400 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 touch-btn"
              >
                <span>{t('unlock.goToPrev', { prevTech: prevTech.name })}</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            )}

            <button
              onClick={onClose}
              className="w-full py-2.5 bg-transparent hover:bg-white/5 text-[var(--text-muted)] hover:text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors touch-btn"
            >
              {t('unlock.understand')}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
