import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, CheckCircle2, AlertCircle, Trophy, Calendar, Sparkles, X } from 'lucide-react';
import { UserProgress } from '../types';
import { useI18n } from '../i18n';

interface StreakCounterProps {
  progress: UserProgress;
  variant?: 'compact' | 'card';
  onNavigateToStudy?: () => void;
}

export const StreakCounter: React.FC<StreakCounterProps> = ({
  progress,
  variant = 'compact',
  onNavigateToStudy,
}) => {
  const { t, language } = useI18n();
  const [showTooltip, setShowTooltip] = useState(false);

  const streak = progress.streak || 0;
  const longestStreak = progress.longestStreak || streak;
  const lessonDates = new Set(progress.lessonDates || []);

  const today = new Date();
  const todayKey = today.toISOString().split('T')[0];
  const isCompletedToday = lessonDates.has(todayKey);

  const dateLocale = language === 'pt' ? 'pt-BR' : 'en-US';

  // Calcula os últimos 7 dias para o calendário semanal
  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    // Dias de 6 dias atrás até hoje (ou semana atual de Seg a Dom)
    d.setDate(today.getDate() - (6 - i));
    const key = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString(dateLocale, { weekday: 'short' }).replace('.', '').toUpperCase();
    const isToday = key === todayKey;
    const isPast = d < today && !isToday;
    const hasCompleted = lessonDates.has(key);

    return {
      dateKey: key,
      dayName: dayName.slice(0, 3),
      dayNumber: d.getDate(),
      isToday,
      isPast,
      hasCompleted,
    };
  });

  // Próximo marco de conquista de streak
  const getNextMilestone = (current: number) => {
    if (language === 'pt') {
      if (current < 3) return { target: 3, label: '3 dias seguidos (Faísca Inicial)' };
      if (current < 7) return { target: 7, label: '7 dias seguidos (Chama Ardente)' };
      if (current < 14) return { target: 14, label: '14 dias seguidos (Mestre Constante)' };
      if (current < 30) return { target: 30, label: '30 dias seguidos (Lenda do Código)' };
      return { target: current + 10, label: `${current + 10} dias seguidos` };
    } else {
      if (current < 3) return { target: 3, label: '3 days streak (Initial Spark)' };
      if (current < 7) return { target: 7, label: '7 days streak (Blazing Flame)' };
      if (current < 14) return { target: 14, label: '14 days streak (Constant Master)' };
      if (current < 30) return { target: 30, label: '30 days streak (Code Legend)' };
      return { target: current + 10, label: `${current + 10} days streak` };
    }
  };

  const nextMilestone = getNextMilestone(streak);

  if (variant === 'compact') {
    return (
      <div className="relative shrink-0">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowTooltip(!showTooltip)}
          className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-full text-xs font-bold transition-all border touch-btn ${
            isCompletedToday
              ? 'bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-orange-400 border-orange-500/40 shadow-sm'
              : streak > 0
              ? 'bg-[var(--bg-surface)] text-orange-400 border-orange-500/30'
              : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border-[var(--border-subtle)]'
          }`}
          title={t('streak.tooltipTitle')}
        >
          <motion.div
            animate={
              isCompletedToday
                ? { scale: [1, 1.25, 1], rotate: [-2, 2, -2] }
                : streak > 0
                ? { scale: [1, 1.1, 1] }
                : {}
            }
            transition={{ repeat: Infinity, duration: isCompletedToday ? 1.8 : 2.5 }}
          >
            <Flame
              className={`w-3.5 h-3.5 ${
                isCompletedToday
                  ? 'fill-orange-500 text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]'
                  : streak > 0
                  ? 'fill-orange-400 text-orange-400'
                  : 'text-zinc-500'
              }`}
            />
          </motion.div>
          <span className="font-extrabold text-[11px] sm:text-xs">{streak}</span>
          <span className="hidden sm:inline text-[11px] font-medium opacity-90">
            {streak === 1 ? (language === 'pt' ? 'dia' : 'day') : (language === 'pt' ? 'dias' : 'days')}
          </span>
          {isCompletedToday ? (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          ) : (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping shrink-0" />
          )}
        </motion.button>

        {/* Tooltip Popover ao tocar no cabeçalho */}
        <AnimatePresence>
          {showTooltip && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowTooltip(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                className="absolute right-0 mt-2 z-50 w-72 p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-strong)] text-[var(--text-primary)] shadow-2xl space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center">
                      <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider">{t('streak.tooltipTitle')}</h4>
                      <p className="text-[10px] text-[var(--text-muted)]">{t('streak.consecutiveDays')}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowTooltip(false)}
                    className="text-[var(--text-muted)] hover:text-white p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[var(--text-muted)]">{t('streak.currentFlame')}:</span>
                    <span className="font-extrabold text-orange-400 flex items-center gap-1">
                      <Flame className="w-3 h-3 fill-orange-500" />
                      {streak} {streak === 1 ? (language === 'pt' ? 'dia consecutivo' : 'consecutive day') : (language === 'pt' ? 'dias consecutivos' : 'consecutive days')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[var(--text-muted)]">{t('streak.todayStatus')}:</span>
                    {isCompletedToday ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                        <CheckCircle2 className="w-3 h-3" />
                        {t('streak.completedBadge')}
                      </span>
                    ) : (
                      <span className="text-amber-400 font-bold flex items-center gap-1 text-[11px]">
                        <AlertCircle className="w-3 h-3" />
                        {t('streak.pendingBadge')}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                  {isCompletedToday
                    ? t('streak.completedDesc')
                    : t('streak.pendingDesc')}
                </p>

                {onNavigateToStudy && !isCompletedToday && (
                  <button
                    onClick={() => {
                      setShowTooltip(false);
                      onNavigateToStudy();
                    }}
                    className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-black font-bold text-xs rounded-xl uppercase tracking-wider transition-colors touch-btn"
                  >
                    {t('streak.studyNow')}
                  </button>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Card Completo para a Tela de Progresso (ProgressScreen)
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-md space-y-4 relative overflow-hidden"
    >
      {/* Glow de fundo decorativo */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header do Card de Sequência */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500/20 via-amber-500/10 to-transparent border border-orange-500/30 flex items-center justify-center shadow-inner">
            <motion.div
              animate={{
                scale: isCompletedToday ? [1, 1.2, 1] : [1, 1.08, 1],
                rotate: isCompletedToday ? [-3, 3, -3] : [0, 0, 0],
              }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Flame className="w-6 h-6 fill-orange-500 text-orange-500 drop-shadow-[0_0_12px_rgba(249,115,22,0.6)]" />
            </motion.div>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-orange-500 flex items-center gap-1.5">
              <span>{t('streak.cardTitle')}</span>
              <Sparkles className="w-3 h-3 text-amber-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
                {streak}
              </span>
              <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                {streak === 1 ? t('streak.consecutiveDays_one') : t('streak.consecutiveDays')}
              </span>
            </div>
          </div>
        </div>

        {/* Badge Recorde */}
        <div className="text-right">
          <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
            {t('streak.record')}
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-amber-400">
            <Trophy className="w-3.5 h-3.5" />
            <span>{longestStreak} {longestStreak === 1 ? (language === 'pt' ? 'dia' : 'day') : (language === 'pt' ? 'dias' : 'days')}</span>
          </div>
        </div>
      </div>

      {/* Status da Meta Diária */}
      <div
        className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
          isCompletedToday
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            : 'bg-orange-500/10 border-orange-500/20 text-orange-400'
        }`}
      >
        <div className="flex items-center gap-2">
          {isCompletedToday ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 animate-pulse" />
          )}
          <span className="font-semibold text-[11px] sm:text-xs">
            {isCompletedToday
              ? t('streak.todayGoalDone')
              : t('streak.todayGoalPending')}
          </span>
        </div>

        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-black/20 shrink-0 ml-2">
          {isCompletedToday ? t('streak.active') : t('streak.pending')}
        </span>
      </div>

      {/* Grade dos Últimos 7 Dias (Semana) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-orange-500" />
            {t('streak.last7days')}
          </span>
          <span>{t('streak.activeDays', { count: lessonDates.size })}</span>
        </div>

        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {weekDays.map(day => (
            <div
              key={day.dateKey}
              className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all text-center ${
                day.hasCompleted
                  ? 'bg-orange-500/15 border-orange-500/40 text-orange-400 shadow-sm'
                  : day.isToday
                  ? 'bg-[var(--bg-surface)] border-amber-500/50 text-[var(--text-primary)] ring-1 ring-amber-500/30'
                  : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-muted)] opacity-60'
              }`}
            >
              <span className="text-[9px] font-bold uppercase">{day.dayName}</span>
              <div className="my-1">
                {day.hasCompleted ? (
                  <Flame className="w-4 h-4 fill-orange-500 text-orange-500 mx-auto" />
                ) : (
                  <div
                    className={`w-2 h-2 rounded-full mx-auto ${
                      day.isToday ? 'bg-amber-400 animate-pulse' : 'bg-zinc-600'
                    }`}
                  />
                )}
              </div>
              <span className="text-[10px] font-semibold">{day.dayNumber}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Próxima Conquista de Streak */}
      <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs">
        <span className="text-[11px] text-[var(--text-muted)]">
          {t('streak.nextMilestone')}: <strong className="text-[var(--text-primary)]">{nextMilestone.label}</strong>
        </span>
        <span className="text-[10px] font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">
          {t('streak.daysRemaining', { count: Math.max(0, nextMilestone.target - streak) })}
        </span>
      </div>
    </motion.div>
  );
};

