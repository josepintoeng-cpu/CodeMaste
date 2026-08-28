import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronRight, Award, Trophy, BookOpen, Sparkles, Filter, Lock, CheckCircle2 } from 'lucide-react';
import { TECHNOLOGIES } from '../content/technologies';
import { TechId, UserProgress } from '../types';
import { calculateTechMastery, calculateOverallCatalogMastery } from '../utils/mastery';
import { TechMasteryIndicator } from '../components/TechMasteryIndicator';
import { LockedTechModal } from '../components/LockedTechModal';
import { getAllTechUnlockStates, TechUnlockState } from '../utils/unlockProgression';
import { FooterStamp } from '../components/FooterStamp';
import { fadeInUp, staggerContainer, cardVariant } from '../utils/animations';
import { useI18n } from '../i18n';

interface CursosScreenProps {
  progress: UserProgress;
  onSelectTech: (techId: TechId) => void;
}

export const CursosScreen: React.FC<CursosScreenProps> = ({ progress, onSelectTech }) => {
  const { t, language } = useI18n();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unlocked' | 'locked' | 'in_progress' | 'mastered' | 'unstarted'>('all');
  const [selectedLockedTech, setSelectedLockedTech] = useState<TechUnlockState | null>(null);

  const categoryOptions = [
    { key: 'all', label: t('courses.catAll'), rawCat: 'Todos' },
    { key: 'game_dev', label: t('courses.catGameDev'), rawCat: 'Game Dev' },
    { key: '3d_engines', label: t('courses.cat3DEngines'), rawCat: '3D & Engines' },
    { key: 'frontend', label: t('courses.catFrontend'), rawCat: 'Frontend' },
    { key: 'backend', label: t('courses.catBackend'), rawCat: 'Backend' },
    { key: 'mobile', label: t('courses.catMobile'), rawCat: 'Mobile' },
    { key: 'database', label: t('courses.catDatabase'), rawCat: 'Banco de Dados' },
    { key: 'languages', label: t('courses.catLanguages'), rawCat: 'Linguagens' },
    { key: 'cybersecurity', label: t('courses.catCybersecurity'), rawCat: 'Cybersecurity' },
    { key: 'devops', label: t('courses.catDevOps'), rawCat: 'DevOps & Cloud' },
    { key: 'ai', label: t('courses.catAI'), rawCat: 'IA & Dados' },
    { key: 'tools', label: t('courses.catTools'), rawCat: 'Ferramentas' },
    { key: 'career', label: t('courses.catCareer'), rawCat: 'Carreira & Inglês' },
  ];

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

  // Estados de desbloqueio sequencial
  const unlockStates = useMemo(() => getAllTechUnlockStates(progress), [progress]);

  const unlockedCount = useMemo(() => {
    let count = 0;
    unlockStates.forEach(s => {
      if (s.isUnlocked) count++;
    });
    return count;
  }, [unlockStates]);

  // Calcula o panorama global de domínio
  const catalogStats = useMemo(() => {
    return calculateOverallCatalogMastery(progress);
  }, [progress]);

  // Pré-calcula a mestria de todas as tecnologias
  const techMasteryMap = useMemo(() => {
    const map = new Map<TechId, ReturnType<typeof calculateTechMastery>>();
    TECHNOLOGIES.forEach(tech => {
      map.set(tech.id, calculateTechMastery(tech.id, progress));
    });
    return map;
  }, [progress]);

  const activeCategory = categoryOptions.find(c => c.key === selectedCategoryKey) || categoryOptions[0];

  const filteredTechs = TECHNOLOGIES.filter(tech => {
    const matchesSearch =
      tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tech.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = activeCategory.rawCat === 'Todos' || tech.category === activeCategory.rawCat;

    const mastery = techMasteryMap.get(tech.id);
    const pct = mastery?.percentage || 0;
    const unlockState = unlockStates.get(tech.id);
    const isUnlocked = unlockState?.isUnlocked ?? false;

    let matchesStatus = true;
    if (statusFilter === 'unlocked') {
      matchesStatus = isUnlocked;
    } else if (statusFilter === 'locked') {
      matchesStatus = !isUnlocked;
    } else if (statusFilter === 'in_progress') {
      matchesStatus = isUnlocked && pct > 0 && pct < 100;
    } else if (statusFilter === 'mastered') {
      matchesStatus = isUnlocked && pct === 100;
    } else if (statusFilter === 'unstarted') {
      matchesStatus = isUnlocked && pct === 0;
    }

    return matchesSearch && matchesCat && matchesStatus;
  });

  const handleTechClick = (techId: TechId) => {
    const unlockState = unlockStates.get(techId);
    if (unlockState && !unlockState.isUnlocked) {
      setSelectedLockedTech(unlockState);
    } else {
      onSelectTech(techId);
    }
  };

  return (
    <div className="relative pb-28 pt-4 px-3.5 sm:px-6 md:px-8 max-w-7xl mx-auto space-y-6 overflow-hidden">
      {/* Ambient Floating Glow Orbs */}
      <div className="absolute top-10 right-10 w-72 sm:w-96 h-72 sm:h-96 bg-orange-500/6 rounded-full blur-3xl pointer-events-none -z-10 animate-float-slow" />
      <div className="absolute top-1/2 left-5 w-64 sm:w-80 h-64 sm:h-80 bg-amber-500/6 rounded-full blur-3xl pointer-events-none -z-10 animate-float-dynamic" />

      {/* Editorial Header */}
      <motion.div variants={fadeInUp} initial="initial" animate="animate">
        <div className="text-[10px] sm:text-xs uppercase font-bold text-orange-500 tracking-widest flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-orange-400" />
          <span>{t('courses.badge')}</span>
        </div>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
          {t('courses.title')}
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-muted)]">
          {t('courses.subtitle')}
        </p>
      </motion.div>

      {/* Card de Visão Geral do Domínio Global */}
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        whileHover={{ y: -2 }}
        className="p-5 sm:p-7 rounded-2xl bg-gradient-to-br from-[var(--bg-card)] via-[var(--bg-surface)] to-[var(--bg-card)] border border-[var(--border-subtle)] shadow-lg space-y-4 relative overflow-hidden"
      >
        {/* Glow decorativo */}
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center font-black">
              <Award className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />
            </div>
            <div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] block">
                {t('courses.globalProgress')}
              </span>
              <h3 className="text-sm sm:text-base font-extrabold text-[var(--text-primary)]">
                {t('courses.overallMastery')}
              </h3>
            </div>
          </div>

          <div className="text-right">
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-orange-400">
              {catalogStats.averageMastery}%
            </span>
            <span className="text-[9px] sm:text-[10px] uppercase font-bold text-[var(--text-muted)] block">
              {t('courses.overallAvg')}
            </span>
          </div>
        </div>

        {/* Barra de progresso global */}
        <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${catalogStats.averageMastery}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-400"
          />
        </div>

        {/* Estatísticas resumidas em 3 colunas */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-2 border-t border-[var(--border-subtle)] text-center">
          <div className="p-2 sm:p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
            <span className="text-[9px] sm:text-[10px] text-[var(--text-muted)] uppercase font-bold block">{t('courses.lessons')}</span>
            <span className="text-xs sm:text-sm font-black text-[var(--text-primary)]">
              {catalogStats.totalCompletedLessons}/{catalogStats.totalTechs * 20}
            </span>
          </div>

          <div className="p-2 sm:p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
            <span className="text-[9px] sm:text-[10px] text-[var(--text-muted)] uppercase font-bold block">{t('courses.quizzes')}</span>
            <span className="text-xs sm:text-sm font-black text-[var(--text-primary)]">
              {catalogStats.totalPassedQuizzes}/{catalogStats.totalTechs * 4}
            </span>
          </div>

          <div className="p-2 sm:p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
            <span className="text-[9px] sm:text-[10px] text-[var(--text-muted)] uppercase font-bold block">{t('courses.masteries')}</span>
            <span className="text-xs sm:text-sm font-black text-amber-400 flex items-center justify-center gap-1">
              <Trophy className="w-3.5 h-3.5" />
              {catalogStats.masteredCount}/{catalogStats.totalTechs}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Barra de Busca & Filtros */}
      <motion.div variants={fadeInUp} initial="initial" animate="animate" className="space-y-2.5">
        <div className="relative">
          <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder={t('courses.searchPlaceholder')}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-xs focus:outline-none focus:border-orange-500/80 transition-colors"
          />
        </div>

        {/* Filtro Rápido por Status de Domínio */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px]">
          <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] flex items-center gap-1 pl-1 shrink-0">
            <Filter className="w-3 h-3" /> {t('courses.statusFilter')}:
          </span>
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all whitespace-nowrap touch-btn ${
              statusFilter === 'all'
                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] bg-[var(--bg-surface)] border border-[var(--border-subtle)]'
            }`}
          >
            {t('courses.filterAll')} ({TECHNOLOGIES.length})
          </button>

          <button
            onClick={() => setStatusFilter('unlocked')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all whitespace-nowrap touch-btn ${
              statusFilter === 'unlocked'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] bg-[var(--bg-surface)] border border-[var(--border-subtle)]'
            }`}
          >
            {t('unlock.unlocked')} ({unlockedCount})
          </button>

          <button
            onClick={() => setStatusFilter('locked')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all whitespace-nowrap touch-btn ${
              statusFilter === 'locked'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] bg-[var(--bg-surface)] border border-[var(--border-subtle)]'
            }`}
          >
            {t('unlock.locked')} ({TECHNOLOGIES.length - unlockedCount})
          </button>

          <button
            onClick={() => setStatusFilter('in_progress')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all whitespace-nowrap touch-btn ${
              statusFilter === 'in_progress'
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] bg-[var(--bg-surface)] border border-[var(--border-subtle)]'
            }`}
          >
            {t('courses.filterInProgress')}
          </button>

          <button
            onClick={() => setStatusFilter('mastered')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all whitespace-nowrap touch-btn ${
              statusFilter === 'mastered'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] bg-[var(--bg-surface)] border border-[var(--border-subtle)]'
            }`}
          >
            {t('courses.filterMastered')}
          </button>

          <button
            onClick={() => setStatusFilter('unstarted')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all whitespace-nowrap touch-btn ${
              statusFilter === 'unstarted'
                ? 'bg-zinc-500/20 text-zinc-300 border border-zinc-500/40'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] bg-[var(--bg-surface)] border border-[var(--border-subtle)]'
            }`}
          >
            {t('courses.filterUnstarted')}
          </button>
        </div>

        {/* Categorias Filtro */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categoryOptions.map(cat => (
            <motion.button
              key={cat.key}
              whileTap={{ scale: 0.96 }}
              onClick={() => setSelectedCategoryKey(cat.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors min-h-[36px] touch-btn ${
                selectedCategoryKey === cat.key
                  ? 'bg-orange-500 text-black font-extrabold shadow-sm'
                  : 'bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
              }`}
            >
              {cat.label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Lista de Cursos com Stagger & Visualização de Domínio */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-3"
      >
        <AnimatePresence mode="popLayout">
          {filteredTechs.map(tech => {
            const abbrev = getTechAbbrev(tech.id);
            const mastery = techMasteryMap.get(tech.id) || calculateTechMastery(tech.id, progress);
            const unlockState = unlockStates.get(tech.id);
            const isUnlocked = unlockState?.isUnlocked ?? false;

            return (
              <motion.div
                key={tech.id}
                layout
                variants={cardVariant}
                initial="initial"
                animate="animate"
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
                whileHover={isUnlocked ? { y: -2, transition: { duration: 0.15 } } : { scale: 1.005 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleTechClick(tech.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-md relative overflow-hidden ${
                  !isUnlocked
                    ? 'bg-[var(--bg-surface)]/60 border-white/5 opacity-75 hover:opacity-90 hover:border-amber-500/40'
                    : 'bg-[var(--bg-card)] hover:bg-[var(--bg-surface)] border-[var(--border-subtle)] hover:border-[var(--border-strong)]'
                }`}
              >
                {/* Linha Principal: Ícone, Título, Badge de Categoria e Indicador Circular */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 shadow-inner relative"
                      style={{
                        backgroundColor: isUnlocked ? `${tech.color}18` : 'rgba(255,255,255,0.05)',
                        color: isUnlocked ? tech.color : 'var(--text-muted)',
                        border: `1.5px solid ${isUnlocked ? `${tech.color}40` : 'rgba(255,255,255,0.1)'}`,
                      }}
                    >
                      {abbrev}
                      {!isUnlocked && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-500/90 text-black flex items-center justify-center shadow-sm">
                          <Lock className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-extrabold text-[var(--text-primary)] truncate">
                          {tech.name}
                        </h3>
                        {!isUnlocked ? (
                          <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1 shrink-0">
                            <Lock className="w-2.5 h-2.5" />
                            {t('unlock.locked')}
                          </span>
                        ) : unlockState?.examPassed ? (
                          <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 shrink-0">
                            <Award className="w-2.5 h-2.5 text-amber-400" />
                            Exame 20/20 Aprovado
                          </span>
                        ) : unlockState?.isExamUnderReview ? (
                          <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1 shrink-0 animate-pulse">
                            ⏳ Prova em Correção (30m)
                          </span>
                        ) : unlockState?.isExamUnlocked && unlockState?.examAttemptsCount > 0 ? (
                          <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-rose-500/15 text-rose-300 border border-rose-500/30 flex items-center gap-1 shrink-0">
                            Exame: {unlockState.examScore.toFixed(1)}/20 (Repetir)
                          </span>
                        ) : unlockState?.isExamUnlocked ? (
                          <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1 shrink-0">
                            ⚡ Exame de Passagem Pronto
                          </span>
                        ) : (
                          <span
                            className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shrink-0"
                            style={{
                              backgroundColor: `${tech.color}15`,
                              color: tech.color,
                              border: `1px solid ${tech.color}30`,
                            }}
                          >
                            {tech.category}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[var(--text-muted)] line-clamp-1 mt-0.5">
                        {!isUnlocked && unlockState?.prevTech ? (
                          <span className="text-amber-400/90 font-medium">
                            {t('unlock.completePrevFirst', { prevTech: unlockState.prevTech.name, currentTech: tech.name })}
                          </span>
                        ) : (
                          tech.description
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Indicador Circular de Mestria no topo direito */}
                  <div className="flex items-center gap-2 shrink-0">
                    <TechMasteryIndicator
                      mastery={mastery}
                      color={isUnlocked ? tech.color : '#71717A'}
                      variant="circular"
                    />
                    <ChevronRight className="w-5 h-5 text-[var(--text-muted)] shrink-0" />
                  </div>
                </div>

                {/* Representação Visual Detalhada de Domínio (Mastery Bar, Tier, Aulas e Quizzes) */}
                <TechMasteryIndicator
                  mastery={mastery}
                  color={isUnlocked ? tech.color : '#71717A'}
                  variant="card"
                />
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredTechs.length === 0 && (
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="text-center py-10 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-subtle)] p-6"
          >
            <p className="text-sm font-bold text-[var(--text-primary)]">{t('courses.notFound')}</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              {t('courses.notFoundDesc')}
            </p>
          </motion.div>
        )}
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

      <FooterStamp />
    </div>
  );
};

