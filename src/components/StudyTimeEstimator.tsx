import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Clock,
  Sparkles,
  Zap,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Info,
  Target,
  Brain,
  Layers,
  Award
} from 'lucide-react';
import { UserProgress, LevelId, TechId } from '../types';
import { TECHNOLOGIES } from '../content/technologies';
import { getLessonsForTechAndLevel } from '../content';
import { useI18n } from '../i18n';

interface StudyTimeEstimatorProps {
  progress: UserProgress;
  onNavigateToStudy?: () => void;
}

interface LevelDifficultyData {
  id: LevelId;
  labelPt: string;
  labelEn: string;
  badgePt: string;
  badgeEn: string;
  baseMinutes: number;
  dots: number; // 1 to 4 dots
  color: string;
  bgRgba: string;
  borderRgba: string;
  textClass: string;
  descriptionPt: string;
  descriptionEn: string;
}

const DIFFICULTY_CONFIG: Record<LevelId, LevelDifficultyData> = {
  iniciante: {
    id: 'iniciante',
    labelPt: 'Iniciante',
    labelEn: 'Beginner',
    badgePt: 'Fundamentos',
    badgeEn: 'Fundamentals',
    baseMinutes: 10,
    dots: 1,
    color: '#22c55e',
    bgRgba: 'rgba(34, 197, 94, 0.12)',
    borderRgba: 'rgba(34, 197, 94, 0.35)',
    textClass: 'text-emerald-400',
    descriptionPt: 'Conceitos base, sintaxe essencial e primeiros scripts guiados (~10 min/aula).',
    descriptionEn: 'Core concepts, essential syntax and first guided scripts (~10 min/lesson).',
  },
  intermediario: {
    id: 'intermediario',
    labelPt: 'Intermediário',
    labelEn: 'Intermediate',
    badgePt: 'Prática Aplicada',
    badgeEn: 'Applied Practice',
    baseMinutes: 18,
    dots: 2,
    color: '#eab308',
    bgRgba: 'rgba(234, 179, 8, 0.12)',
    borderRgba: 'rgba(234, 179, 8, 0.35)',
    textClass: 'text-amber-400',
    descriptionPt: 'Padrões de projeto, consumo de APIs, I/O e lógica estruturada (~18 min/aula).',
    descriptionEn: 'Design patterns, API consumption, I/O and structured logic (~18 min/lesson).',
  },
  avancado: {
    id: 'avancado',
    labelPt: 'Avançado',
    labelEn: 'Advanced',
    badgePt: 'Arquitetura',
    badgeEn: 'Architecture',
    baseMinutes: 30,
    dots: 3,
    color: '#f97316',
    bgRgba: 'rgba(249, 115, 22, 0.12)',
    borderRgba: 'rgba(249, 115, 22, 0.35)',
    textClass: 'text-orange-400',
    descriptionPt: 'Arquitetura limpa, segurança, concorrência e engenharia profunda (~30 min/aula).',
    descriptionEn: 'Clean architecture, security, concurrency and deep engineering (~30 min/lesson).',
  },
  projetos: {
    id: 'projetos',
    labelPt: 'Projetos',
    labelEn: 'Projects',
    badgePt: 'Mão na Massa',
    badgeEn: 'Hands-on',
    baseMinutes: 60,
    dots: 4,
    color: '#a855f7',
    bgRgba: 'rgba(168, 85, 247, 0.12)',
    borderRgba: 'rgba(168, 85, 247, 0.35)',
    textClass: 'text-purple-400',
    descriptionPt: 'Aplicações completas de ponta a ponta com simulação de produção (~60 min/projeto).',
    descriptionEn: 'Full end-to-end applications simulating production environments (~60 min/project).',
  },
};

export const StudyTimeEstimator: React.FC<StudyTimeEstimatorProps> = ({
  progress,
  onNavigateToStudy,
}) => {
  const { t, language } = useI18n();
  const [showExplanation, setShowExplanation] = useState(false);

  // Mapa com todas as lições registradas no currículo para lookup com alta precisão
  const lessonCatalog = useMemo(() => {
    const catalog = new Map<string, { levelId: LevelId; estimatedMinutes: number; techId: TechId }>();
    const allLevels: LevelId[] = ['iniciante', 'intermediario', 'avancado', 'projetos'];

    for (const tech of TECHNOLOGIES) {
      for (const level of allLevels) {
        try {
          const lessons = getLessonsForTechAndLevel(tech.id, level);
          for (const l of lessons) {
            catalog.set(l.id, {
              levelId: l.levelId || level,
              estimatedMinutes: l.estimatedMinutes || DIFFICULTY_CONFIG[level].baseMinutes,
              techId: l.techId || tech.id,
            });
          }
        } catch {
          // ignore any individual course lookup err
        }
      }
    }
    return catalog;
  }, []);

  // Cálculo detalhado com base nas lições concluídas e níveis de dificuldade
  const stats = useMemo(() => {
    const completedLessonIds = Object.keys(progress.completedLessons || {});

    const levelCounts: Record<LevelId, number> = {
      iniciante: 0,
      intermediario: 0,
      avancado: 0,
      projetos: 0,
    };

    const levelMinutes: Record<LevelId, number> = {
      iniciante: 0,
      intermediario: 0,
      avancado: 0,
      projetos: 0,
    };

    let totalMinutes = 0;

    for (const lessonId of completedLessonIds) {
      const knownLesson = lessonCatalog.get(lessonId);

      let level: LevelId = 'iniciante';
      let minutes = DIFFICULTY_CONFIG.iniciante.baseMinutes;

      if (knownLesson) {
        level = knownLesson.levelId;
        minutes = knownLesson.estimatedMinutes || DIFFICULTY_CONFIG[level].baseMinutes;
      } else {
        // Detecção heurística caso o ID venha de formato dinâmico/legado
        const idLower = lessonId.toLowerCase();
        if (idLower.includes('proj') || idLower.includes('projeto')) {
          level = 'projetos';
          minutes = DIFFICULTY_CONFIG.projetos.baseMinutes;
        } else if (idLower.includes('avan') || idLower.includes('adv')) {
          level = 'avancado';
          minutes = DIFFICULTY_CONFIG.avancado.baseMinutes;
        } else if (idLower.includes('inter') || idLower.includes('med')) {
          level = 'intermediario';
          minutes = DIFFICULTY_CONFIG.intermediario.baseMinutes;
        } else {
          level = 'iniciante';
          minutes = DIFFICULTY_CONFIG.iniciante.baseMinutes;
        }
      }

      levelCounts[level] += 1;
      levelMinutes[level] += minutes;
      totalMinutes += minutes;
    }

    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;
    const completedCount = completedLessonIds.length;
    const pomodoroBlocks = Math.round(totalMinutes / 25);
    const avgMinutesPerLesson = completedCount > 0 ? Math.round(totalMinutes / completedCount) : 0;

    // Próximo marco de horas
    const getNextMilestoneHours = (mins: number) => {
      const hrs = mins / 60;
      if (language === 'pt') {
        if (hrs < 1) return { targetHours: 1, remainingMins: 60 - mins, label: '1ª Hora de Código' };
        if (hrs < 3) return { targetHours: 3, remainingMins: 180 - mins, label: '3 Horas de Dedicação' };
        if (hrs < 5) return { targetHours: 5, remainingMins: 300 - mins, label: '5 Horas de Estudo' };
        if (hrs < 10) return { targetHours: 10, remainingMins: 600 - mins, label: '10 Horas (Foco Sólido)' };
        if (hrs < 25) return { targetHours: 25, remainingMins: 1500 - mins, label: '25 Horas (Imersão Pro)' };
        if (hrs < 50) return { targetHours: 50, remainingMins: 3000 - mins, label: '50 Horas (Alta Maestria)' };
        return { targetHours: Math.ceil(hrs / 25) * 25, remainingMins: (Math.ceil(hrs / 25) * 25 * 60) - mins, label: 'Super Especialista' };
      } else {
        if (hrs < 1) return { targetHours: 1, remainingMins: 60 - mins, label: '1st Hour of Code' };
        if (hrs < 3) return { targetHours: 3, remainingMins: 180 - mins, label: '3 Hours of Study' };
        if (hrs < 5) return { targetHours: 5, remainingMins: 300 - mins, label: '5 Hours Dedication' };
        if (hrs < 10) return { targetHours: 10, remainingMins: 600 - mins, label: '10 Hours (Solid Focus)' };
        if (hrs < 25) return { targetHours: 25, remainingMins: 1500 - mins, label: '25 Hours (Pro Immersion)' };
        if (hrs < 50) return { targetHours: 50, remainingMins: 3000 - mins, label: '50 Hours (High Mastery)' };
        return { targetHours: Math.ceil(hrs / 25) * 25, remainingMins: (Math.ceil(hrs / 25) * 25 * 60) - mins, label: 'Super Specialist' };
      }
    };

    const nextMilestone = getNextMilestoneHours(totalMinutes);

    // Nível de Foco e Estágio
    const getFocusStage = (mins: number) => {
      if (language === 'pt') {
        if (mins === 0) return { title: 'Iniciando Jornada', badge: 'Primeiros Passos', icon: Sparkles };
        if (mins < 60) return { title: 'Aquecimento Cognitivo', badge: 'Fase Inicial', icon: Brain };
        if (mins < 180) return { title: 'Ritmo em Construção', badge: 'Constante', icon: TrendingUp };
        if (mins < 600) return { title: 'Foco & Consistência', badge: 'Dedicado', icon: Zap };
        if (mins < 1500) return { title: 'Imersão Aprofundada', badge: 'Avançado', icon: Layers };
        return { title: 'Maestria Consagrada', badge: 'Mestre Sênior', icon: Award };
      } else {
        if (mins === 0) return { title: 'Starting Journey', badge: 'First Steps', icon: Sparkles };
        if (mins < 60) return { title: 'Cognitive Warmup', badge: 'Early Phase', icon: Brain };
        if (mins < 180) return { title: 'Building Rhythm', badge: 'Consistent', icon: TrendingUp };
        if (mins < 600) return { title: 'Focus & Dedication', badge: 'Dedicated', icon: Zap };
        if (mins < 1500) return { title: 'Deep Immersion', badge: 'Advanced', icon: Layers };
        return { title: 'Recognized Mastery', badge: 'Senior Master', icon: Award };
      }
    };

    const focusStage = getFocusStage(totalMinutes);

    return {
      totalMinutes,
      totalHours,
      remainingMinutes,
      completedCount,
      pomodoroBlocks,
      avgMinutesPerLesson,
      levelCounts,
      levelMinutes,
      nextMilestone,
      focusStage,
    };
  }, [progress.completedLessons, lessonCatalog, language]);

  const allLevels: LevelId[] = ['iniciante', 'intermediario', 'avancado', 'projetos'];

  // Formatação de string do tempo
  const formattedTimeString = useMemo(() => {
    if (stats.totalMinutes === 0) return '0 min';
    if (stats.totalHours === 0) return `${stats.totalMinutes} min`;
    if (stats.remainingMinutes === 0) return `${stats.totalHours}h`;
    return `${stats.totalHours}h ${stats.remainingMinutes}min`;
  }, [stats.totalHours, stats.remainingMinutes, stats.totalMinutes]);

  return (
    <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-4 shadow-md">
      {/* Header com Ícone e Título */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center shadow-inner">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-widest flex items-center gap-1">
              <span>{t('studyTime.badge')}</span>
            </div>
            <h3 className="text-sm font-bold text-[var(--text-primary)] tracking-tight">
              {t('studyTime.title')}
            </h3>
          </div>
        </div>

        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-all border border-transparent hover:border-[var(--border-subtle)]"
          title={t('studyTime.howCalculated')}
          aria-label={t('studyTime.howCalculated')}
        >
          <Info className="w-4 h-4" />
        </button>
      </div>

      {/* Hero Display Principal de Tempo */}
      <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] relative overflow-hidden">
        {/* Glow de fundo sutil */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-serif-italic font-light text-orange-400">
                {formattedTimeString}
              </span>
              <span className="text-xs font-semibold text-[var(--text-muted)]">
                {t('studyTime.invested')}
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              {t('studyTime.calculated', { count: stats.completedCount })}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <div className="px-2.5 py-1.5 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-bold flex items-center gap-1.5 shadow-sm">
              <stats.focusStage.icon className="w-3.5 h-3.5" />
              <span>{stats.focusStage.badge}</span>
            </div>
          </div>
        </div>

        {/* Barra de Distribuição Visual Proporcional por Dificuldade */}
        {stats.totalMinutes > 0 && (
          <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] space-y-2">
            <div className="flex justify-between text-[11px] font-bold text-[var(--text-muted)]">
              <span>{t('studyTime.distribution')}</span>
              <span>{t('studyTime.weighted')}</span>
            </div>

            <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden flex p-0.5 border border-white/5">
              {allLevels.map((lvl) => {
                const mins = stats.levelMinutes[lvl];
                if (mins === 0) return null;
                const pct = ((mins / stats.totalMinutes) * 100);
                const conf = DIFFICULTY_CONFIG[lvl];
                const label = language === 'pt' ? conf.labelPt : conf.labelEn;

                return (
                  <div
                    key={lvl}
                    style={{
                      width: `${pct}%`,
                      backgroundColor: conf.color,
                    }}
                    className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-500"
                    title={`${label}: ${mins} min (${Math.round(pct)}%)`}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Grid com os 4 Níveis de Dificuldade */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {allLevels.map((lvl) => {
          const conf = DIFFICULTY_CONFIG[lvl];
          const count = stats.levelCounts[lvl];
          const mins = stats.levelMinutes[lvl];
          const hours = Math.floor(mins / 60);
          const remMins = mins % 60;
          const formattedLvlTime = hours > 0 ? `${hours}h ${remMins > 0 ? `${remMins}m` : ''}` : `${mins}m`;
          const label = language === 'pt' ? conf.labelPt : conf.labelEn;

          return (
            <div
              key={lvl}
              className="p-3 rounded-xl border transition-all flex flex-col justify-between"
              style={{
                backgroundColor: conf.bgRgba,
                borderColor: conf.borderRgba,
              }}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-extrabold uppercase tracking-wider ${conf.textClass}`}>
                  {label}
                </span>
                {/* Indicador de pontos de dificuldade (1 a 4) */}
                <div className="flex items-center gap-0.5" title={`Dificuldade ${conf.dots}/4`}>
                  {Array.from({ length: 4 }).map((_, dotIdx) => (
                    <span
                      key={dotIdx}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        backgroundColor: dotIdx < conf.dots ? conf.color : 'rgba(255, 255, 255, 0.15)',
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="my-2">
                <div className="text-xl font-bold text-[var(--text-primary)]">
                  {formattedLvlTime}
                </div>
                <div className="text-[10px] text-[var(--text-muted)] font-medium">
                  {t('studyTime.completedLessons', { count })}
                </div>
              </div>

              <div className="text-[9px] text-[var(--text-muted)] border-t border-white/5 pt-1.5 flex justify-between items-center">
                <span>{t('studyTime.avgWeight')}</span>
                <span className="font-bold text-[var(--text-primary)]">{t('studyTime.minPerLesson', { minutes: conf.baseMinutes })}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Indicadores Complementares de Produtividade */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-1">
        {/* Média por aula */}
        <div className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <Brain className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[9px] text-[var(--text-muted)] uppercase tracking-wider block font-bold">
              {t('studyTime.avgPerLesson')}
            </span>
            <span className="font-extrabold text-[var(--text-primary)]">
              {stats.completedCount > 0 ? t('studyTime.minPerLesson', { minutes: stats.avgMinutesPerLesson }) : '0 min'}
            </span>
          </div>
        </div>

        {/* Blocos de foco Pomodoro */}
        <div className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center justify-center shrink-0">
            <Target className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[9px] text-[var(--text-muted)] uppercase tracking-wider block font-bold">
              {t('studyTime.focusBlocks')}
            </span>
            <span className="font-extrabold text-[var(--text-primary)]">
              {t('studyTime.pomodoroSessions', { count: stats.pomodoroBlocks })}
            </span>
          </div>
        </div>

        {/* Próxima Meta */}
        <div className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[9px] text-[var(--text-muted)] uppercase tracking-wider block font-bold">
              {t('studyTime.nextMilestone')}
            </span>
            <span className="font-extrabold text-[var(--text-primary)]">
              {stats.nextMilestone.remainingMins > 0 ? t('studyTime.remainingMins', { count: stats.nextMilestone.remainingMins }) : t('studyTime.achieved')}
            </span>
          </div>
        </div>
      </div>

      {/* Painel Explicativo Expansível sobre a Fórmula de Cálculo */}
      <AnimatePresence>
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-orange-500/30 text-xs space-y-2.5">
              <div className="flex items-center justify-between font-bold text-orange-400 text-xs">
                <span className="flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" />
                  {t('studyTime.howCalculated')}
                </span>
                <button
                  onClick={() => setShowExplanation(false)}
                  className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-[11px]"
                >
                  {t('studyTime.close')}
                </button>
              </div>

              <p className="text-[var(--text-muted)] text-[11px] leading-relaxed">
                {t('studyTime.calcExplanation')}
              </p>

              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between p-1.5 rounded-lg bg-black/20">
                  <span className="font-bold text-emerald-400">● {language === 'pt' ? 'Iniciante' : 'Beginner'}</span>
                  <span className="text-[var(--text-muted)]">{language === 'pt' ? '8 a 15 minutos (Média: 10 min)' : '8 to 15 minutes (Avg: 10 min)'}</span>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded-lg bg-black/20">
                  <span className="font-bold text-amber-400">●● {language === 'pt' ? 'Intermediário' : 'Intermediate'}</span>
                  <span className="text-[var(--text-muted)]">{language === 'pt' ? '15 a 25 minutos (Média: 18 min)' : '15 to 25 minutes (Avg: 18 min)'}</span>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded-lg bg-black/20">
                  <span className="font-bold text-orange-400">●●● {language === 'pt' ? 'Avançado' : 'Advanced'}</span>
                  <span className="text-[var(--text-muted)]">{language === 'pt' ? '25 a 45 minutos (Média: 30 min)' : '25 to 45 minutes (Avg: 30 min)'}</span>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded-lg bg-black/20">
                  <span className="font-bold text-purple-400">●●●● {language === 'pt' ? 'Projetos Práticos' : 'Hands-on Projects'}</span>
                  <span className="text-[var(--text-muted)]">{language === 'pt' ? '45 a 90 minutos (Média: 60 min)' : '45 to 90 minutes (Avg: 60 min)'}</span>
                </div>
              </div>

              <div className="text-[10px] text-[var(--text-muted)] italic pt-1 border-t border-[var(--border-subtle)]">
                {t('studyTime.formula')}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Estado Vazio ou Chamada de Ação se 0 lições */}
      {stats.completedCount === 0 && onNavigateToStudy && (
        <div className="pt-2">
          <button
            onClick={onNavigateToStudy}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 hover:opacity-90 active:scale-[0.98] transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>{t('studyTime.startFirst')}</span>
          </button>
        </div>
      )}
    </div>
  );
};

