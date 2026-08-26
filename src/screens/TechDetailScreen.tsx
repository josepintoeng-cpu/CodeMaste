import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, CheckCircle2, Lock, Play, HelpCircle, Clock, Zap } from 'lucide-react';
import { TechId, LevelId, UserProgress } from '../types';
import { TECHNOLOGIES } from '../content/technologies';
import { getLessonsForTechAndLevel } from '../content';
import { FooterStamp } from '../components/FooterStamp';
import { fadeInUp, staggerContainer, cardVariant } from '../utils/animations';
import { useI18n } from '../i18n';

interface TechDetailScreenProps {
  techId: TechId;
  initialLevelId?: LevelId;
  progress: UserProgress;
  onBack: () => void;
  onStartLesson: (lessonId: string, levelId: LevelId) => void;
  onStartQuiz: (levelId: LevelId) => void;
}

export const TechDetailScreen: React.FC<TechDetailScreenProps> = ({
  techId,
  initialLevelId = 'iniciante',
  progress,
  onBack,
  onStartLesson,
  onStartQuiz,
}) => {
  const { t, language } = useI18n();
  const [activeLevel, setActiveLevel] = useState<LevelId>(initialLevelId);

  const tech = TECHNOLOGIES.find(t => t.id === techId) || TECHNOLOGIES[0];

  const levels: { id: LevelId; title: string; label: string }[] = [
    { id: 'iniciante', title: language === 'pt' ? '01. INICIANTE' : '01. BEGINNER', label: t('techDetail.levelIniciante') },
    { id: 'intermediario', title: language === 'pt' ? '02. INTERMEDIÁRIO' : '02. INTERMEDIATE', label: t('techDetail.levelIntermediario') },
    { id: 'avancado', title: language === 'pt' ? '03. AVANÇADO' : '03. ADVANCED', label: t('techDetail.levelAvancado') },
    { id: 'projetos', title: language === 'pt' ? '04. PROJETOS' : '04. PROJECTS', label: t('techDetail.levelProjetos') },
  ];

  const lessons = getLessonsForTechAndLevel(techId, activeLevel);

  // Calcula progresso do nível ativo
  const completedInActiveLevel = lessons.filter(l => progress.completedLessons[l.id]).length;
  const totalInActiveLevel = lessons.length;
  const levelPct = Math.round((completedInActiveLevel / totalInActiveLevel) * 100);

  return (
    <div className="pb-24 pt-4 px-4 max-w-md md:max-w-2xl mx-auto space-y-5">
      {/* Top bar de navegação */}
      <motion.div variants={fadeInUp} initial="initial" animate="animate" className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors min-w-[42px] min-h-[42px] flex items-center justify-center touch-btn"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shadow-md"
            style={{ backgroundColor: `${tech.color}20`, border: `1px solid ${tech.color}40`, color: tech.color }}
          >
            {tech.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="text-[9px] font-bold uppercase tracking-widest text-orange-500">
              {t('techDetail.modules')}
            </div>
            <h2 className="text-base font-bold text-[var(--text-primary)] tracking-tight leading-tight">
              {tech.name}
            </h2>
          </div>
        </div>
      </motion.div>

      {/* Submenu Tabs de Níveis */}
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-[var(--bg-card)] p-1.5 rounded-2xl border border-[var(--border-subtle)]"
      >
        {levels.map(lvl => {
          const isActive = activeLevel === lvl.id;
          return (
            <motion.button
              key={lvl.id}
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveLevel(lvl.id)}
              className={`py-2 px-2 rounded-xl text-[10px] font-bold tracking-wider transition-all text-center min-h-[38px] flex items-center justify-center uppercase touch-btn ${
                isActive
                  ? 'bg-orange-500 text-black font-black shadow-md'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5'
              }`}
            >
              {lvl.title}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Resumo do Nível Ativo */}
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] flex items-center justify-between"
      >
        <div>
          <span className="text-[9px] text-[var(--text-muted)] font-bold uppercase tracking-widest block">
            {t('techDetail.levelProgress')}
          </span>
          <span className="text-xs font-bold text-[var(--text-primary)] mt-0.5 block">
            {t('techDetail.completedCount', { done: completedInActiveLevel, total: totalInActiveLevel })}
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-16 bg-white/10 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-orange-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${levelPct}%` }}
            />
          </div>
          <span className="text-xs font-bold text-orange-400">{levelPct}%</span>
        </div>
      </motion.div>

      {/* Trilha de Aulas do Nível com Stagger */}
      <div className="space-y-2.5">
        <h3 className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
          {t('techDetail.availableLessons')}
        </h3>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeLevel}
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-2.5"
          >
            {lessons.map((lesson, index) => {
              const isDone = Boolean(progress.completedLessons[lesson.id]);
              const isUnlocked = index === 0 || Boolean(progress.completedLessons[lessons[index - 1]?.id]);

              return (
                <motion.div
                  key={lesson.id}
                  variants={cardVariant}
                  whileHover={isUnlocked ? { y: -2, transition: { duration: 0.15 } } : {}}
                  whileTap={isUnlocked ? { scale: 0.98 } : {}}
                  onClick={() => isUnlocked && onStartLesson(lesson.id, activeLevel)}
                  className={`p-4 rounded-2xl border transition-colors flex items-center justify-between gap-3 ${
                    isDone
                      ? 'bg-[var(--bg-card)] border-orange-500/40'
                      : isUnlocked
                      ? 'bg-[var(--bg-card)] hover:bg-[var(--bg-surface)] border-[var(--border-subtle)] hover:border-[var(--border-strong)] cursor-pointer'
                      : 'bg-[var(--bg-surface)] border-white/5 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Ícone de Status */}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs ${
                        isDone
                          ? 'bg-orange-500 text-black shadow-md'
                          : isUnlocked
                          ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30'
                          : 'bg-white/5 text-white/30 border border-white/5'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-black" />
                      ) : isUnlocked ? (
                        <Play className="w-3.5 h-3.5 fill-orange-400 ml-0.5" />
                      ) : (
                        <Lock className="w-3.5 h-3.5" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-[var(--text-primary)] truncate">
                        {lesson.title}
                      </h4>
                      <p className="text-[11px] text-[var(--text-muted)] line-clamp-1 mt-0.5">
                        {lesson.description}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-[10px] text-[var(--text-muted)] font-medium">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[var(--text-muted)]" />
                          {lesson.estimatedMinutes} min
                        </span>
                        <span className="flex items-center gap-1 text-orange-400 font-bold">
                          <Zap className="w-3 h-3 text-orange-400" />
                          +{lesson.xpReward} XP
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Banner de Quiz do Nível */}
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        className="p-4 rounded-2xl bg-[var(--bg-card)] border border-orange-500/30 flex items-center justify-between gap-3 mt-6 shadow-md"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 border border-orange-500/30">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[var(--text-primary)]">
              {t('techDetail.quizTitle')}
            </h4>
            <p className="text-[10px] text-[var(--text-muted)]">
              {t('techDetail.quizDesc')}
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onStartQuiz(activeLevel)}
          className="px-3 py-2 bg-orange-500 hover:bg-orange-400 text-black font-extrabold text-[11px] uppercase tracking-wider rounded-xl transition-colors shrink-0 shadow-md min-h-[36px] touch-btn"
        >
          {t('techDetail.startQuiz')}
        </motion.button>
      </motion.div>

      <FooterStamp />
    </div>
  );
};


