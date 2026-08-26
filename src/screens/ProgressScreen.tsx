import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Award, Flame, Zap, CheckCircle2, Trophy, BarChart2, Calendar, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { UserProgress } from '../types';
import { TECHNOLOGIES } from '../content/technologies';
import { BadgeItem } from '../components/Badge';
import { StreakCounter } from '../components/StreakCounter';
import { StudyTimeEstimator } from '../components/StudyTimeEstimator';
import { FooterStamp } from '../components/FooterStamp';
import { fadeInUp, staggerContainer, cardVariant } from '../utils/animations';
import { useI18n } from '../i18n';

interface ProgressScreenProps {
  progress: UserProgress;
  onNavigateToStudy?: () => void;
}

interface TooltipPayloadItem {
  payload: {
    dateKey: string;
    day: string;
    dateFormatted: string;
    xp: number;
    isToday: boolean;
  };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#121214] border border-orange-500/40 p-2.5 rounded-xl shadow-2xl text-xs space-y-1 z-50">
        <div className="text-[10px] text-white/50 font-bold uppercase tracking-wider">
          {data.day} • {data.dateFormatted} {data.isToday && '(Hoje)'}
        </div>
        <div className="text-orange-400 font-extrabold flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 fill-orange-400" />
          <span>+{data.xp} XP</span>
        </div>
      </div>
    );
  }
  return null;
};

export const ProgressScreen: React.FC<ProgressScreenProps> = ({ progress, onNavigateToStudy }) => {
  const { t, language } = useI18n();
  const totalCompletedLessons = Object.keys(progress.completedLessons).length;

  // Processa os últimos 7 dias de atividade (XP ganho)
  const last7DaysData = useMemo(() => {
    const daysOfWeek = language === 'pt'
      ? ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
      : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = language === 'pt'
      ? ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const today = new Date();
    const result = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateKey = d.toISOString().split('T')[0];
      const dayName = daysOfWeek[d.getDay()];
      const dayFormatted = `${d.getDate()} ${months[d.getMonth()]}`;

      let xp = progress.dailyXpHistory?.[dateKey] || 0;

      // Fallback se o usuário já possui XP mas o histórico diário foi recém-criado
      if (i === 0 && xp === 0 && (!progress.dailyXpHistory || Object.keys(progress.dailyXpHistory).length === 0) && progress.xp > 0) {
        xp = progress.xp;
      }

      result.push({
        dateKey,
        day: dayName,
        dateFormatted: dayFormatted,
        xp,
        isToday: i === 0,
      });
    }
    return result;
  }, [progress.dailyXpHistory, progress.xp, language]);

  const totalWeekXp = useMemo(() => {
    return last7DaysData.reduce((acc, curr) => acc + curr.xp, 0);
  }, [last7DaysData]);

  const bestDay = useMemo(() => {
    return last7DaysData.reduce((max, curr) => (curr.xp > max.xp ? curr : max), last7DaysData[0]);
  }, [last7DaysData]);

  const allBadges = useMemo(() => [
    {
      id: 'primeiros_passos',
      title: language === 'pt' ? 'Primeiros Passos' : 'First Steps',
      description: language === 'pt' ? 'Iniciou sua jornada no CodeMaster.' : 'Started your journey on CodeMaster.',
      iconName: 'zap',
      isUnlocked: true,
    },
    {
      id: 'primeira_aula',
      title: language === 'pt' ? 'Primeira Aula Concluída' : 'First Lesson Completed',
      description: language === 'pt' ? 'Concluiu sua 1ª aula com sucesso.' : 'Successfully completed your 1st lesson.',
      iconName: 'book',
      isUnlocked: totalCompletedLessons >= 1,
    },
    {
      id: 'dedicado_5',
      title: language === 'pt' ? 'Dedicado (5 Aulas)' : 'Dedicated (5 Lessons)',
      description: language === 'pt' ? 'Completou 5 aulas na plataforma.' : 'Completed 5 lessons on the platform.',
      iconName: 'book',
      isUnlocked: totalCompletedLessons >= 5,
    },
    {
      id: 'mestre_15',
      title: language === 'pt' ? 'Mestre da Prática (15 Aulas)' : 'Practice Master (15 Lessons)',
      description: language === 'pt' ? 'Superou a marca de 15 aulas.' : 'Passed the 15 lessons milestone.',
      iconName: 'award',
      isUnlocked: totalCompletedLessons >= 15,
    },
    {
      id: 'xp_100',
      title: language === 'pt' ? '100 XP Acumulados' : '100 XP Accumulated',
      description: language === 'pt' ? 'Conquistou seus primeiros 100 pontos.' : 'Earned your first 100 points.',
      iconName: 'zap',
      isUnlocked: progress.xp >= 100,
    },
    {
      id: 'streak_3',
      title: language === 'pt' ? 'Tríade de Fogo (3 Dias)' : 'Fire Triad (3 Days)',
      description: language === 'pt' ? 'Manteve 3 dias seguidos de estudo.' : 'Kept 3 consecutive study days.',
      iconName: 'flame',
      isUnlocked: progress.streak >= 3,
    },
    {
      id: 'streak_7',
      title: language === 'pt' ? 'Chama Semanal (7 Dias)' : 'Weekly Flame (7 Days)',
      description: language === 'pt' ? 'Manteve 7 dias consecutivos de aulas completadas.' : 'Kept 7 consecutive days of completed lessons.',
      iconName: 'flame',
      isUnlocked: (progress.streak >= 7) || ((progress.longestStreak || 0) >= 7),
    },
  ], [language, totalCompletedLessons, progress.xp, progress.streak, progress.longestStreak]);

  return (
    <div className="pb-24 pt-4 px-4 max-w-md md:max-w-2xl mx-auto space-y-6">
      {/* Top Title */}
      <motion.div variants={fadeInUp} initial="initial" animate="animate">
        <div className="text-[10px] uppercase font-bold text-orange-500 tracking-widest">
          {t('progress.badge')}
        </div>
        <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">
          {t('progress.title')}
        </h2>
        <p className="text-xs text-[var(--text-muted)]">
          {t('progress.subtitle')}
        </p>
      </motion.div>

      {/* Elemento de Sequência Diária (Streak Counter Completo) */}
      <StreakCounter
        progress={progress}
        variant="card"
        onNavigateToStudy={onNavigateToStudy}
      />

      {/* Overview Cards */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-3 gap-3"
      >
        <motion.div variants={cardVariant} className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-center shadow-md">
          <div className="text-3xl sm:text-4xl font-serif-italic text-orange-400 font-light">{progress.xp}</div>
          <div className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-muted)] mt-1">{t('home.totalXp')}</div>
        </motion.div>

        <motion.div variants={cardVariant} className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-center shadow-md">
          <div className="text-3xl sm:text-4xl font-serif-italic text-[var(--text-primary)] font-light">{progress.streak}d</div>
          <div className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-muted)] mt-1">{t('home.streakStat')}</div>
        </motion.div>

        <motion.div variants={cardVariant} className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-center shadow-md">
          <div className="text-3xl sm:text-4xl font-serif-italic text-[var(--text-primary)] font-light">{totalCompletedLessons}</div>
          <div className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-muted)] mt-1">{t('home.lessonsDone')}</div>
        </motion.div>
      </motion.div>

      {/* Componente de Tempo Total de Estudo Estimado */}
      <motion.div variants={fadeInUp} initial="initial" animate="animate">
        <StudyTimeEstimator
          progress={progress}
          onNavigateToStudy={onNavigateToStudy}
        />
      </motion.div>

      {/* Gráfico Recharts: Atividade Diária (Últimos 7 Dias) */}
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-4 shadow-md"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-widest">
                {t('progress.dailyActivityBadge')}
              </div>
              <h3 className="text-sm font-bold text-[var(--text-primary)] tracking-tight">
                {t('progress.dailyActivityTitle')}
              </h3>
            </div>
          </div>

          <div className="px-2.5 py-1 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-black flex items-center gap-1">
            <Zap className="w-3 h-3 fill-orange-400" />
            <span>+{totalWeekXp} XP</span>
          </div>
        </div>

        {/* Recharts BarChart Container */}
        <div className="w-full h-44 pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={last7DaysData} margin={{ top: 12, right: 6, left: -24, bottom: 0 }}>
              <XAxis
                dataKey="day"
                stroke="#71717A"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#27272A' }}
              />
              <YAxis
                stroke="#71717A"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: 'rgba(255, 255, 255, 0.04)', radius: 6 }}
              />
              <Bar dataKey="xp" radius={[6, 6, 0, 0]} maxBarSize={34}>
                {last7DaysData.map(entry => (
                  <Cell
                    key={entry.dateKey}
                    fill={
                      entry.isToday
                        ? '#F97316'
                        : entry.xp > 0
                        ? '#FB923C'
                        : '#27272A'
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Resumo da Semana */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[var(--border-subtle)] text-xs">
          <div className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-orange-400 shrink-0" />
            <div>
              <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block font-bold">{t('progress.dailyAvg')}</span>
              <span className="font-extrabold text-[var(--text-primary)]">{Math.round(totalWeekXp / 7)} XP / {language === 'pt' ? 'dia' : 'day'}</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block font-bold">{t('progress.bestDay')}</span>
              <span className="font-extrabold text-[var(--text-primary)]">
                {bestDay.xp > 0 ? `${bestDay.day} (+${bestDay.xp} XP)` : t('progress.inProgress')}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Editorial Citação Motivacional */}
      <motion.div variants={fadeInUp} initial="initial" animate="animate" className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-sm">
        <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2">
          {t('progress.dailyInsightBadge')}
        </div>
        <div className="text-xs italic text-[var(--text-muted)] font-serif leading-relaxed">
          {t('progress.dailyQuote')}
        </div>
      </motion.div>

      {/* Progresso por Tecnologia */}
      <motion.div variants={fadeInUp} initial="initial" animate="animate" className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-3.5 shadow-md">
        <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
          <BarChart2 className="w-4 h-4 text-orange-500" />
          <span>{t('progress.techProgressTitle')}</span>
        </div>

        <div className="space-y-3">
          {TECHNOLOGIES.map(tech => {
            const completedCount = Object.keys(progress.completedLessons).filter(id =>
              id.startsWith(tech.id)
            ).length;
            const pct = Math.min(Math.round((completedCount / 20) * 100), 100);

            return (
              <div key={tech.id} className="space-y-1">
                <div className="flex justify-between text-xs text-[var(--text-primary)] font-medium">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: tech.color }} />
                    <span className="font-bold">{tech.name}</span>
                  </span>
                  <span className="text-[var(--text-muted)] text-[11px]">{completedCount} {t('home.lessonsCount')} ({pct}%)</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: tech.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Conquistas / Badges */}
      <motion.div variants={fadeInUp} initial="initial" animate="animate" className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-orange-400" />
            {t('progress.unlockedBadges')}
          </h3>
          <span className="text-xs font-bold text-orange-400">
            {allBadges.filter(b => b.isUnlocked).length} / {allBadges.length}
          </span>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 sm:grid-cols-2 gap-2.5"
        >
          {allBadges.map(badge => (
            <motion.div key={badge.id} variants={cardVariant}>
              <BadgeItem {...badge} />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <FooterStamp />
    </div>
  );
};


