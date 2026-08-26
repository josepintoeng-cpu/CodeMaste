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
          <span>+{data.xp} XP ganho</span>
        </div>
      </div>
    );
  }
  return null;
};

export const ProgressScreen: React.FC<ProgressScreenProps> = ({ progress, onNavigateToStudy }) => {
  const totalCompletedLessons = Object.keys(progress.completedLessons).length;

  // Processa os últimos 7 dias de atividade (XP ganho)
  const last7DaysData = useMemo(() => {
    const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
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
  }, [progress.dailyXpHistory, progress.xp]);

  const totalWeekXp = useMemo(() => {
    return last7DaysData.reduce((acc, curr) => acc + curr.xp, 0);
  }, [last7DaysData]);

  const bestDay = useMemo(() => {
    return last7DaysData.reduce((max, curr) => (curr.xp > max.xp ? curr : max), last7DaysData[0]);
  }, [last7DaysData]);

  const allBadges = [
    {
      id: 'primeiros_passos',
      title: 'Primeiros Passos',
      description: 'Iniciou sua jornada no CodeMaster.',
      iconName: 'zap',
      isUnlocked: true,
    },
    {
      id: 'primeira_aula',
      title: 'Primeira Aula Concluída',
      description: 'Concluiu sua 1ª aula com sucesso.',
      iconName: 'book',
      isUnlocked: totalCompletedLessons >= 1,
    },
    {
      id: 'dedicado_5',
      title: 'Dedicado (5 Aulas)',
      description: 'Completou 5 aulas na plataforma.',
      iconName: 'book',
      isUnlocked: totalCompletedLessons >= 5,
    },
    {
      id: 'mestre_15',
      title: 'Mestre da Prática (15 Aulas)',
      description: 'Superou a marca de 15 aulas.',
      iconName: 'award',
      isUnlocked: totalCompletedLessons >= 15,
    },
    {
      id: 'xp_100',
      title: '100 XP Acumulados',
      description: 'Conquistou seus primeiros 100 pontos.',
      iconName: 'zap',
      isUnlocked: progress.xp >= 100,
    },
    {
      id: 'streak_3',
      title: 'Tríade de Fogo (3 Dias)',
      description: 'Manteve 3 dias seguidos de estudo.',
      iconName: 'flame',
      isUnlocked: progress.streak >= 3,
    },
    {
      id: 'streak_7',
      title: 'Chama Semanal (7 Dias)',
      description: 'Manteve 7 dias consecutivos de aulas completadas.',
      iconName: 'flame',
      isUnlocked: (progress.streak >= 7) || ((progress.longestStreak || 0) >= 7),
    },
  ];

  return (
    <div className="pb-24 pt-4 px-4 max-w-md md:max-w-2xl mx-auto space-y-6">
      {/* Top Title */}
      <motion.div variants={fadeInUp} initial="initial" animate="animate">
        <div className="text-[10px] uppercase font-bold text-orange-500 tracking-widest">
          ESTATÍSTICAS ATUAIS
        </div>
        <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">
          Status & Conquistas
        </h2>
        <p className="text-xs text-[var(--text-muted)]">
          Acompanhe o seu desempenho diário e sequência de estudos consecutivos.
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
          <div className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-muted)] mt-1">XP Total</div>
        </motion.div>

        <motion.div variants={cardVariant} className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-center shadow-md">
          <div className="text-3xl sm:text-4xl font-serif-italic text-[var(--text-primary)] font-light">{progress.streak}d</div>
          <div className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-muted)] mt-1">Sequência</div>
        </motion.div>

        <motion.div variants={cardVariant} className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-center shadow-md">
          <div className="text-3xl sm:text-4xl font-serif-italic text-[var(--text-primary)] font-light">{totalCompletedLessons}</div>
          <div className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-muted)] mt-1">Aulas Feitas</div>
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
                ATIVIDADE DIÁRIA
              </div>
              <h3 className="text-sm font-bold text-[var(--text-primary)] tracking-tight">
                XP ganho nos últimos 7 dias
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
              <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block font-bold">Média Diária</span>
              <span className="font-extrabold text-[var(--text-primary)]">{Math.round(totalWeekXp / 7)} XP / dia</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block font-bold">Melhor Dia</span>
              <span className="font-extrabold text-[var(--text-primary)]">
                {bestDay.xp > 0 ? `${bestDay.day} (+${bestDay.xp} XP)` : 'Em progresso'}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Editorial Citação Motivacional */}
      <motion.div variants={fadeInUp} initial="initial" animate="animate" className="p-4 rounded-2xl bg-[#1A1A1C] border border-white/10 shadow-sm">
        <div className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2">
          INSIGHT DIÁRIO
        </div>
        <div className="text-xs italic text-white/70 font-serif leading-relaxed">
          "A persistência na prática de código transforma sintaxe em maestria. Mantenha sua sequência ativa hoje."
        </div>
      </motion.div>

      {/* Progresso por Tecnologia */}
      <motion.div variants={fadeInUp} initial="initial" animate="animate" className="p-4 rounded-2xl bg-[#1A1A1C] border border-white/10 space-y-3.5 shadow-md">
        <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
          <BarChart2 className="w-4 h-4 text-orange-500" />
          <span>Progresso por Tecnologia</span>
        </div>

        <div className="space-y-3">
          {TECHNOLOGIES.map(tech => {
            const completedCount = Object.keys(progress.completedLessons).filter(id =>
              id.startsWith(tech.id)
            ).length;
            const pct = Math.min(Math.round((completedCount / 20) * 100), 100);

            return (
              <div key={tech.id} className="space-y-1">
                <div className="flex justify-between text-xs text-white font-medium">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: tech.color }} />
                    <span className="font-bold">{tech.name}</span>
                  </span>
                  <span className="text-white/40 text-[11px]">{completedCount} aulas ({pct}%)</span>
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
          <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-orange-400" />
            CONQUISTAS DESBLOQUEADAS
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

