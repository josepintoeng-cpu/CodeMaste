import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, CheckCircle2, Trophy, Sparkles } from 'lucide-react';
import { TechMasteryInfo } from '../utils/mastery';
import { useI18n } from '../i18n';

interface TechMasteryIndicatorProps {
  mastery: TechMasteryInfo;
  color?: string;
  variant?: 'card' | 'compact' | 'circular';
}

export const TechMasteryIndicator: React.FC<TechMasteryIndicatorProps> = ({
  mastery,
  color = '#f97316',
  variant = 'card',
}) => {
  const { t, language } = useI18n();
  const { percentage, completedLessons, totalLessons, passedQuizzes, totalQuizzes, tier } = mastery;

  const tierLabel = useMemoTierLabel(tier.label, language);

  if (variant === 'circular') {
    const size = 44;
    const strokeWidth = 3.5;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90 transform">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-white/10"
          />
          {/* Progress fill */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute text-[10px] font-extrabold tracking-tight text-[var(--text-primary)]">
          {percentage}%
        </span>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2">
        <div className="w-16 sm:w-24 h-2 bg-white/10 rounded-full overflow-hidden relative">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
          />
        </div>
        <span className="text-xs font-black" style={{ color }}>
          {percentage}%
        </span>
      </div>
    );
  }

  // Variant 'card': Detalhado para o card de curso em CursosScreen
  return (
    <div className="space-y-2 mt-3 pt-3 border-t border-[var(--border-subtle)]">
      {/* Header do Domínio */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)]">
            {t('courses.masteryLabel')}
          </span>
          {percentage === 100 && (
            <span className="flex items-center gap-0.5 text-[9px] font-black text-amber-400 uppercase bg-amber-500/15 px-1.5 py-0.2 rounded border border-amber-500/30 animate-pulse">
              <Sparkles className="w-2.5 h-2.5" />
              {t('courses.mastered')}
            </span>
          )}
        </div>

        {/* Badge do Nível / Tier de Domínio */}
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${tier.bgClass}`}>
          <span>{tier.icon}</span>
          <span>{tierLabel}</span>
          <span className="font-extrabold ml-0.5">({percentage}%)</span>
        </span>
      </div>

      {/* Barra de Progresso Segmentada e Glow */}
      <div className="space-y-1">
        <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/5 relative">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="h-full rounded-full shadow-sm relative overflow-hidden"
            style={{
              backgroundColor: color,
              boxShadow: percentage > 0 ? `0 0 10px ${color}80` : 'none',
            }}
          >
            {/* Efeito de brilho em movimento se tiver progresso */}
            {percentage > 0 && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            )}
          </motion.div>
        </div>
      </div>

      {/* Sub-estatísticas: Aulas e Quizzes */}
      <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] font-medium pt-0.5">
        <div className="flex items-center gap-1.5">
          <span className="flex items-center gap-1">
            <BookOpen className="w-3 h-3 text-[var(--text-muted)]" />
            <span>{t('courses.lessons')}:</span>
            <strong className="text-[var(--text-primary)] font-bold">
              {completedLessons}/{totalLessons}
            </strong>
          </span>
          {completedLessons === totalLessons && totalLessons > 0 && (
            <CheckCircle2 className="w-3 h-3 text-emerald-400 inline" />
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="flex items-center gap-1">
            <Trophy className="w-3 h-3 text-amber-400" />
            <span>{t('courses.quizzes')}:</span>
            <strong className="text-[var(--text-primary)] font-bold">
              {passedQuizzes}/{totalQuizzes}
            </strong>
          </span>
          {passedQuizzes === totalQuizzes && totalQuizzes > 0 && (
            <CheckCircle2 className="w-3 h-3 text-emerald-400 inline" />
          )}
        </div>
      </div>
    </div>
  );
};

function useMemoTierLabel(label: string, lang: string) {
  if (lang === 'pt') return label;
  switch (label) {
    case 'Iniciante':
      return 'Beginner';
    case 'Praticante':
      return 'Practitioner';
    case 'Proficiente':
      return 'Proficient';
    case 'Especialista':
      return 'Specialist';
    case 'Mestre':
      return 'Master';
    default:
      return label;
  }
}

