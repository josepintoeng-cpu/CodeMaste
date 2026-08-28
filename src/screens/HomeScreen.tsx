import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Play,
  ChevronRight,
  Terminal,
  Code,
  Code2,
  Atom,
  Layers,
  Layout,
  Palette,
  Server,
  Network,
  Zap,
  Coffee,
  Globe,
  Smartphone,
  Database,
  HardDrive,
  ShieldAlert,
  Cpu,
  Cloud,
  Sparkles,
  GitBranch,
  BookMarked,
  Gamepad2,
  Box,
  Lock,
  CheckCircle2,
} from 'lucide-react';
import { UserProgress, TechId, LevelId } from '../types';
import { TECHNOLOGIES } from '../content/technologies';
import { FooterStamp } from '../components/FooterStamp';
import { StreakCounter } from '../components/StreakCounter';
import { LockedTechModal } from '../components/LockedTechModal';
import {
  getAllTechUnlockStates,
  getNextRecommendedLesson,
  TechUnlockState,
} from '../utils/unlockProgression';
import { fadeInUp, staggerContainer, cardVariant, floatingVariant } from '../utils/animations';
import { useI18n } from '../i18n';

interface HomeScreenProps {
  progress: UserProgress;
  onSelectTech: (techId: TechId, levelId?: LevelId) => void;
  onNavigateTab: (tab: 'courses' | 'progress' | 'profile') => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  progress,
  onSelectTech,
  onNavigateTab,
}) => {
  const { t, language } = useI18n();
  const [selectedLockedTech, setSelectedLockedTech] = useState<TechUnlockState | null>(null);

  // Mapeamento de ícones do lucide-react para os cards
  const getTechIcon = (iconName: string) => {
    switch (iconName) {
      case 'Terminal': return Terminal;
      case 'Code': return Code;
      case 'Code2': return Code2;
      case 'Atom': return Atom;
      case 'Layers': return Layers;
      case 'Layout': return Layout;
      case 'Palette': return Palette;
      case 'Server': return Server;
      case 'Network': return Network;
      case 'Zap': return Zap;
      case 'Coffee': return Coffee;
      case 'Globe': return Globe;
      case 'Smartphone': return Smartphone;
      case 'Database': return Database;
      case 'HardDrive': return HardDrive;
      case 'ShieldAlert': return ShieldAlert;
      case 'Cpu': return Cpu;
      case 'Cloud': return Cloud;
      case 'Sparkles': return Sparkles;
      case 'GitBranch': return GitBranch;
      case 'BookMarked': return BookMarked;
      case 'Gamepad2': return Gamepad2;
      case 'Box': return Box;
      default: return Code;
    }
  };

  const getTechAbbrev = (techId: TechId) => {
    switch (techId) {
      case 'python': return 'Py';
      case 'javascript': return 'JS';
      case 'typescript': return 'TS';
      case 'react': return 'Re';
      case 'nextjs': return 'Nx';
      case 'html': return 'H5';
      case 'css': return 'C3';
      case 'nodejs': return 'Nd';
      case 'apis': return 'API';
      case 'python_fastapi': return 'FA';
      case 'java': return 'Jv';
      case 'php': return 'PH';
      case 'flutter': return 'Fl';
      case 'postgresql': return 'PG';
      case 'mysql': return 'SQ';
      case 'linux_cyber': return 'Lx';
      case 'c_sys_cyber': return 'C';
      case 'cloud_devops': return 'Dk';
      case 'ai_apps': return 'IA';
      case 'git': return 'Git';
      case 'english_tech': return 'En';
      case 'unity_2d': return 'U2D';
      case 'unity_3d': return 'U3D';
      case 'unreal_cpp': return 'UE5';
      case 'godot_engine': return 'GD';
      case 'game_multiplayer': return 'Net';
      case 'game_mobile_dev': return 'Mob';
      case 'game_pc_publishing': return 'Stm';
      case 'game_fundamentals': return 'Mat';
      case 'game_graphics_ai': return 'AI';
      case 'blender_3d': return '3D';
      default: return 'Code';
    }
  };

  // Calcula progresso total e por tecnologia
  const totalCompleted = Object.keys(progress.completedLessons).length;
  const todayKey = new Date().toISOString().split('T')[0];
  const completedToday = (progress.lessonDates || []).includes(todayKey);
  const streak = progress.streak || 0;

  // Estados de desbloqueio sequencial
  const unlockStates = useMemo(() => getAllTechUnlockStates(progress), [progress]);
  const nextLessonData = useMemo(() => getNextRecommendedLesson(progress), [progress]);

  const unlockedCount = useMemo(() => {
    let count = 0;
    unlockStates.forEach(s => {
      if (s.isUnlocked) count++;
    });
    return count;
  }, [unlockStates]);

  const handleTechClick = (techId: TechId) => {
    const state = unlockStates.get(techId);
    if (state && !state.isUnlocked) {
      setSelectedLockedTech(state);
    } else {
      onSelectTech(techId);
    }
  };

  return (
    <div className="relative pb-28 pt-4 px-3.5 sm:px-6 md:px-8 max-w-7xl mx-auto space-y-6 overflow-hidden">
      {/* Ambient Floating Glow Elements */}
      <div className="absolute top-10 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-orange-500/8 rounded-full blur-3xl pointer-events-none -z-10 animate-float-slow" />
      <div className="absolute top-1/2 right-10 w-64 sm:w-80 h-64 sm:h-80 bg-amber-500/6 rounded-full blur-3xl pointer-events-none -z-10 animate-float-dynamic" />

      {/* Editorial Header Greeting & Meta Banner */}
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        className="space-y-4"
      >
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div>
            <div className="text-[var(--text-muted)] text-[10px] sm:text-xs uppercase tracking-widest font-bold flex items-center gap-1.5">
              <span>{t('home.welcomeBack')}</span>
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[var(--text-primary)] flex items-center gap-2">
              <span>{progress.userName}</span>
            </h2>
          </div>
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigateTab('progress')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border cursor-pointer transition-all touch-btn shadow-sm ${
              completedToday
                ? 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                : streak > 0
                ? 'bg-[var(--bg-surface)] text-orange-400 border-[var(--border-subtle)]'
                : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border-[var(--border-subtle)]'
            }`}
            title={t('streak.tooltipTitle')}
          >
            <span>🔥 {streak} {streak === 1 ? (language === 'pt' ? 'dia' : 'day') : (language === 'pt' ? 'dias' : 'days')}</span>
          </motion.div>
        </div>

        {/* Componente de Streak Diário (Sequência de Estudos) */}
        <StreakCounter
          progress={progress}
          variant="card"
          onNavigateToStudy={() => {
            if (nextLessonData) {
              onSelectTech(nextLessonData.tech.id, nextLessonData.levelId);
            } else {
              onSelectTech('python', 'iniciante');
            }
          }}
        />

        {/* Quick Resume Card Dinâmico com a Próxima Aula Sequencial */}
        <motion.button
          whileHover={{ y: -3, scale: 1.005 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            if (nextLessonData) {
              onSelectTech(nextLessonData.tech.id, nextLessonData.levelId);
            } else {
              onSelectTech('python', 'iniciante');
            }
          }}
          className="w-full bg-[var(--bg-surface)] hover:bg-[var(--bg-card)] text-[var(--text-primary)] p-4 sm:p-5 rounded-2xl flex items-center justify-between border border-[var(--border-subtle)] hover:border-orange-500/30 transition-all shadow-sm group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-orange-500/20 border border-orange-500/30 text-orange-500 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-orange-500/25 transition-all">
              <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-orange-500 text-orange-500 ml-0.5" />
            </div>
            <div className="text-left">
              <span className="text-[9px] sm:text-[10px] text-orange-400 font-bold uppercase tracking-widest block">
                {t('home.continueLearning')}
              </span>
              <span className="text-xs sm:text-sm font-bold text-[var(--text-primary)] block">
                {nextLessonData ? (
                  `${nextLessonData.tech.name}: ${nextLessonData.lesson.title}`
                ) : (
                  `Python: 1. ${language === 'pt' ? 'Olá Mundo e Variáveis' : 'Hello World & Variables'}`
                )}
              </span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[var(--text-muted)] group-hover:text-orange-400 group-hover:translate-x-1 transition-all shrink-0" />
        </motion.button>
      </motion.div>

      {/* Grid das Tecnologias Adaptado Dinamicamente para Qualquer Resolução */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm uppercase tracking-widest text-[var(--text-muted)] font-bold">
                {t('home.technologies')}
              </h3>
              <span className="text-[10px] font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full">
                {unlockedCount} / {TECHNOLOGIES.length} {t('unlock.unlocked')}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-[var(--text-muted)] mt-0.5">
              {t('unlock.journeySubtitle')}
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('courses')}
            className="text-xs sm:text-sm text-orange-400 font-bold hover:underline flex items-center uppercase tracking-wider touch-btn"
          >
            {t('home.viewAll')}
          </button>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4"
        >
          {TECHNOLOGIES.map(tech => {
            const abbrev = getTechAbbrev(tech.id);
            const unlockState = unlockStates.get(tech.id);
            const isUnlocked = unlockState?.isUnlocked ?? false;
            const isCompleted = unlockState?.isCompleted ?? false;
            const count = unlockState?.completedLessons ?? 0;
            const pct = unlockState?.progressPct ?? 0;

            return (
              <motion.div
                key={tech.id}
                variants={cardVariant}
                whileHover={isUnlocked ? { y: -4, scale: 1.02, transition: { duration: 0.2 } } : { scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleTechClick(tech.id)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group shadow-md ${
                  !isUnlocked
                    ? 'bg-[var(--bg-surface)]/60 border-white/5 opacity-70 hover:opacity-90 hover:border-amber-500/40'
                    : isCompleted
                    ? 'bg-[var(--bg-card)] border-emerald-500/40 hover:border-emerald-500/60'
                    : 'bg-[var(--bg-card)] hover:bg-[var(--bg-surface)] border-[var(--border-subtle)] hover:border-[var(--border-strong)]'
                }`}
              >
                {/* Tech Header Icon + Badge */}
                <div className="flex justify-between items-start mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black shadow-inner relative"
                    style={{
                      backgroundColor: isUnlocked ? `${tech.color}20` : 'rgba(255,255,255,0.05)',
                      color: isUnlocked ? tech.color : 'var(--text-muted)',
                      border: `1px solid ${isUnlocked ? `${tech.color}40` : 'rgba(255,255,255,0.1)'}`,
                    }}
                  >
                    {abbrev}
                    {!isUnlocked && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-500/90 text-black flex items-center justify-center shadow-sm">
                        <Lock className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </div>

                  {isCompleted ? (
                    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {t('unlock.completed')}
                    </span>
                  ) : !isUnlocked ? (
                    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      {t('unlock.locked')}
                    </span>
                  ) : (
                    <span
                      className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
                      style={{ backgroundColor: `${tech.color}15`, color: tech.color, border: `1px solid ${tech.color}30` }}
                    >
                      {tech.badge}
                    </span>
                  )}
                </div>

                <div className="text-xs sm:text-sm font-bold text-[var(--text-primary)] mb-0.5">{tech.name}</div>
                <div className="text-[10px] sm:text-[11px] text-[var(--text-muted)] mb-2 truncate">{tech.category}</div>

                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mt-3">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: isUnlocked ? (isCompleted ? '#10B981' : tech.color) : 'rgba(255,255,255,0.2)',
                    }}
                  />
                </div>
                <div className="flex justify-between items-center text-[9px] sm:text-[10px] text-[var(--text-muted)] mt-1.5 font-medium">
                  <span>{count}/20 {t('home.lessonsCount')}</span>
                  <span style={{ color: isUnlocked ? (isCompleted ? '#10B981' : tech.color) : 'var(--text-muted)' }} className="font-bold">
                    {pct}%
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Editorial Stats Resumo com Floating Hover */}
      <motion.div
        variants={fadeInUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        whileHover={{ y: -2 }}
        className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl p-5 sm:p-7 grid grid-cols-3 gap-2 text-center shadow-lg"
      >
        <div>
          <div className="text-3xl sm:text-4xl lg:text-5xl font-serif-italic text-[var(--text-primary)] font-light">{totalCompleted}</div>
          <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mt-1">{t('home.lessonsDone')}</div>
        </div>
        <div className="border-x border-[var(--border-subtle)] px-2">
          <div className="text-3xl sm:text-4xl lg:text-5xl font-serif-italic text-orange-400 font-light">{progress.xp}</div>
          <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mt-1">{t('home.totalXp')}</div>
        </div>
        <div>
          <div className="text-3xl sm:text-4xl lg:text-5xl font-serif-italic text-[var(--text-primary)] font-light">{progress.streak}d</div>
          <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mt-1">{t('home.streakStat')}</div>
        </div>
      </motion.div>

      {/* Modal de Tecnologia Bloqueada */}
      <LockedTechModal
        unlockState={selectedLockedTech}
        onClose={() => setSelectedLockedTech(null)}
        onGoToTech={(techId) => {
          setSelectedLockedTech(null);
          onSelectTech(techId);
        }}
      />

      {/* Signature Stamp */}
      <FooterStamp />
    </div>
  );
};



