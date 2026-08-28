import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, CheckCircle2, Lock, Play, HelpCircle, Clock, Zap, AlertTriangle, ArrowRight } from 'lucide-react';
import { TechId, LevelId, UserProgress } from '../types';
import { TECHNOLOGIES } from '../content/technologies';
import { getLessonsForTechAndLevel } from '../content';
import { getTechUnlockState } from '../utils/unlockProgression';
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
  onSelectTech?: (techId: TechId) => void;
}

export const TechDetailScreen: React.FC<TechDetailScreenProps> = ({
  techId,
  initialLevelId = 'iniciante',
  progress,
  onBack,
  onStartLesson,
  onStartQuiz,
  onSelectTech,
}) => {
  const { t, language } = useI18n();
  const [activeLevel, setActiveLevel] = useState<LevelId>(initialLevelId);

  const tech = TECHNOLOGIES.find(t => t.id === techId) || TECHNOLOGIES[0];
  const unlockState = getTechUnlockState(techId, progress);

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
    <div className="relative pb-28 pt-4 px-3.5 sm:px-6 md:px-8 max-w-7xl mx-auto space-y-6">
      {/* Top bar de navegação */}
      <motion.div variants={fadeInUp} initial="initial" animate="animate" className="flex items-center gap-3.5">
        <button
          onClick={onBack}
          className="p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-orange-500/40 transition-colors min-w-[42px] min-h-[42px] flex items-center justify-center touch-btn shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center font-black text-sm shadow-md"
            style={{ backgroundColor: `${tech.color}20`, border: `1px solid ${tech.color}40`, color: tech.color }}
          >
            {tech.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-orange-500">
              {t('techDetail.modules')}
            </div>
            <h2 className="text-base sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight leading-tight">
              {tech.name}
            </h2>
          </div>
        </div>
      </motion.div>

      {/* Banner de Bloqueio se a tecnologia for bloqueada */}
      {!unlockState.isUnlocked && unlockState.prevTech && (
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md"
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30 mt-0.5 sm:mt-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-amber-300">
                {t('unlock.techLockedModalTitle')}
              </h4>
              <p className="text-[11px] sm:text-xs text-[var(--text-muted)] mt-0.5">
                {t('unlock.completePrevFirst', { prevTech: unlockState.prevTech.name, currentTech: tech.name })}
              </p>
            </div>
          </div>

          {onSelectTech && (
            <button
              onClick={() => onSelectTech(unlockState.prevTech!.id)}
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-sm shrink-0 touch-btn"
            >
              <span>{t('unlock.goToPrevTech', { prevTech: unlockState.prevTech.name })}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </motion.div>
      )}

      {/* Submenu Tabs de Níveis */}
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[var(--bg-card)] p-2 rounded-2xl border border-[var(--border-subtle)] shadow-sm"
      >
        {levels.map(lvl => {
          const isActive = activeLevel === lvl.id;
          return (
            <motion.button
              key={lvl.id}
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveLevel(lvl.id)}
              className={`py-2.5 px-3 rounded-xl text-[10px] sm:text-xs font-bold tracking-wider transition-all text-center min-h-[40px] flex items-center justify-center uppercase touch-btn ${
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

      {/* Resumo do Nível Ativo & Banner de Quiz em Grid no Desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Resumo do Nível Ativo */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] flex items-center justify-between shadow-sm"
        >
          <div>
            <span className="text-[9px] sm:text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest block">
              {t('techDetail.levelProgress')}
            </span>
            <span className="text-xs sm:text-sm font-bold text-[var(--text-primary)] mt-0.5 block">
              {t('techDetail.completedCount', { done: completedInActiveLevel, total: totalInActiveLevel })}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-20 sm:w-28 bg-white/10 h-2 rounded-full overflow-hidden">
              <div
                className="bg-orange-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${levelPct}%` }}
              />
            </div>
            <span className="text-xs sm:text-sm font-black text-orange-400">{levelPct}%</span>
          </div>
        </motion.div>

        {/* Banner de Quiz do Nível */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[var(--bg-card)] to-[var(--bg-surface)] border border-orange-500/30 flex items-center justify-between gap-3 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 border border-orange-500/30">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[var(--text-primary)]">
                {t('techDetail.quizTitle')}
              </h4>
              <p className="text-[10px] sm:text-xs text-[var(--text-muted)]">
                {t('techDetail.quizDesc')}
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onStartQuiz(activeLevel)}
            className="px-3.5 py-2 sm:px-4 sm:py-2.5 bg-orange-500 hover:bg-orange-400 text-black font-black text-[11px] sm:text-xs uppercase tracking-wider rounded-xl transition-colors shrink-0 shadow-md min-h-[38px] touch-btn"
          >
            {t('techDetail.startQuiz')}
          </motion.button>
        </motion.div>
      </div>

      {/* Trilha de Aulas do Nível em Grid Responsivo Multi-Coluna (1 col mobile, 2 cols tablet, 3 cols desktop) */}
      <div className="space-y-3">
        <h3 className="text-[10px] sm:text-xs font-black text-[var(--text-muted)] uppercase tracking-widest">
          {t('techDetail.availableLessons')}
        </h3>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeLevel}
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            exit="exit"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
          >
            {lessons.map((lesson, index) => {
              const isDone = Boolean(progress.completedLessons[lesson.id]);
              const isUnlocked = index === 0 || Boolean(progress.completedLessons[lessons[index - 1]?.id]);

              return (
                <motion.div
                  key={lesson.id}
                  variants={cardVariant}
                  whileHover={isUnlocked ? { y: -3, transition: { duration: 0.15 } } : {}}
                  whileTap={isUnlocked ? { scale: 0.98 } : {}}
                  onClick={() => isUnlocked && onStartLesson(lesson.id, activeLevel)}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col justify-between gap-3 shadow-sm ${
                    isDone
                      ? 'bg-[var(--bg-card)] border-orange-500/40'
                      : isUnlocked
                      ? 'bg-[var(--bg-card)] hover:bg-[var(--bg-surface)] border-[var(--border-subtle)] hover:border-orange-500/30 cursor-pointer'
                      : 'bg-[var(--bg-surface)] border-white/5 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    {/* Ícone de Status */}
                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs ${
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
                        <Play className="w-4 h-4 fill-orange-400 ml-0.5" />
                      ) : (
                        <Lock className="w-4 h-4" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs sm:text-sm font-bold text-[var(--text-primary)] truncate">
                        {lesson.title}
                      </h4>
                      <p className="text-[11px] sm:text-xs text-[var(--text-muted)] line-clamp-2 mt-0.5 leading-relaxed">
                        {lesson.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)] text-[10px] sm:text-[11px] text-[var(--text-muted)] font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                      {lesson.estimatedMinutes} min
                    </span>
                    <span className="flex items-center gap-1 text-orange-400 font-bold bg-orange-500/10 px-2 py-0.5 rounded-md border border-orange-500/20">
                      <Zap className="w-3 h-3 text-orange-400" />
                      +{lesson.xpReward} XP
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      <FooterStamp />
    </div>
  );
};


