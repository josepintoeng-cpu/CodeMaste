import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronRight, Award, Trophy, BookOpen, Sparkles, Filter } from 'lucide-react';
import { TECHNOLOGIES } from '../content/technologies';
import { TechId, UserProgress } from '../types';
import { calculateTechMastery, calculateOverallCatalogMastery } from '../utils/mastery';
import { TechMasteryIndicator } from '../components/TechMasteryIndicator';
import { FooterStamp } from '../components/FooterStamp';
import { fadeInUp, staggerContainer, cardVariant } from '../utils/animations';

interface CursosScreenProps {
  progress: UserProgress;
  onSelectTech: (techId: TechId) => void;
}

export const CursosScreen: React.FC<CursosScreenProps> = ({ progress, onSelectTech }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [statusFilter, setStatusFilter] = useState<'all' | 'in_progress' | 'mastered' | 'unstarted'>('all');

  const categories = ['Todos', 'Frontend', 'Backend', 'Mobile', 'Banco de Dados', 'Linguagens'];

  const getTechAbbrev = (techId: TechId) => {
    switch (techId) {
      case 'python': return 'Py';
      case 'javascript': return 'JS';
      case 'java': return 'Jv';
      case 'flutter': return 'Fl';
      case 'css': return 'CS';
      case 'html': return 'HT';
      case 'php': return 'PH';
      case 'nodejs': return 'Nd';
      case 'mysql': return 'SQ';
      default: return 'Code';
    }
  };

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

  const filteredTechs = TECHNOLOGIES.filter(tech => {
    const matchesSearch =
      tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tech.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'Todos' || tech.category === selectedCategory;

    const mastery = techMasteryMap.get(tech.id);
    const pct = mastery?.percentage || 0;

    let matchesStatus = true;
    if (statusFilter === 'in_progress') {
      matchesStatus = pct > 0 && pct < 100;
    } else if (statusFilter === 'mastered') {
      matchesStatus = pct === 100;
    } else if (statusFilter === 'unstarted') {
      matchesStatus = pct === 0;
    }

    return matchesSearch && matchesCat && matchesStatus;
  });

  return (
    <div className="pb-24 pt-4 px-4 max-w-md md:max-w-2xl mx-auto space-y-5">
      {/* Editorial Header */}
      <motion.div variants={fadeInUp} initial="initial" animate="animate">
        <div className="text-[10px] uppercase font-bold text-orange-500 tracking-widest">
          CATÁLOGO OFICIAL & DOMÍNIO
        </div>
        <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">
          Cursos & Mestria (9 Stacks)
        </h2>
        <p className="text-xs text-[var(--text-muted)]">
          Acompanhe sua porcentagem de domínio em cada tecnologia com base em aulas e quizzes.
        </p>
      </motion.div>

      {/* Card de Visão Geral do Domínio Global */}
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        className="p-5 rounded-2xl bg-gradient-to-br from-[var(--bg-card)] via-[var(--bg-surface)] to-[var(--bg-card)] border border-[var(--border-subtle)] shadow-lg space-y-4 relative overflow-hidden"
      >
        {/* Glow decorativo */}
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center font-black">
              <Award className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block">
                Progresso Global
              </span>
              <h3 className="text-sm font-extrabold text-[var(--text-primary)]">
                Domínio Geral do Catálogo
              </h3>
            </div>
          </div>

          <div className="text-right">
            <span className="text-2xl font-black tracking-tight text-orange-400">
              {catalogStats.averageMastery}%
            </span>
            <span className="text-[9px] uppercase font-bold text-[var(--text-muted)] block">
              Média Geral
            </span>
          </div>
        </div>

        {/* Barra de progresso global */}
        <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${catalogStats.averageMastery}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-400"
          />
        </div>

        {/* Estatísticas resumidas em 3 colunas */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[var(--border-subtle)] text-center">
          <div className="p-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
            <span className="text-[9px] text-[var(--text-muted)] uppercase font-bold block">Aulas</span>
            <span className="text-xs font-black text-[var(--text-primary)]">
              {catalogStats.totalCompletedLessons}/180
            </span>
          </div>

          <div className="p-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
            <span className="text-[9px] text-[var(--text-muted)] uppercase font-bold block">Quizzes</span>
            <span className="text-xs font-black text-[var(--text-primary)]">
              {catalogStats.totalPassedQuizzes}/36
            </span>
          </div>

          <div className="p-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
            <span className="text-[9px] text-[var(--text-muted)] uppercase font-bold block">Mestrias</span>
            <span className="text-xs font-black text-amber-400 flex items-center justify-center gap-1">
              <Trophy className="w-3 h-3" />
              {catalogStats.masteredCount}/9
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
            placeholder="Buscar tecnologia (ex: Python, MySQL, Flutter)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-xs focus:outline-none focus:border-orange-500/80 transition-colors"
          />
        </div>

        {/* Filtro Rápido por Status de Domínio */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px]">
          <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] flex items-center gap-1 pl-1 shrink-0">
            <Filter className="w-3 h-3" /> Status:
          </span>
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all whitespace-nowrap touch-btn ${
              statusFilter === 'all'
                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] bg-[var(--bg-surface)] border border-[var(--border-subtle)]'
            }`}
          >
            Todas ({TECHNOLOGIES.length})
          </button>

          <button
            onClick={() => setStatusFilter('in_progress')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all whitespace-nowrap touch-btn ${
              statusFilter === 'in_progress'
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] bg-[var(--bg-surface)] border border-[var(--border-subtle)]'
            }`}
          >
            ⚡ Em Curso
          </button>

          <button
            onClick={() => setStatusFilter('mastered')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all whitespace-nowrap touch-btn ${
              statusFilter === 'mastered'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] bg-[var(--bg-surface)] border border-[var(--border-subtle)]'
            }`}
          >
            👑 Mestres (100%)
          </button>

          <button
            onClick={() => setStatusFilter('unstarted')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all whitespace-nowrap touch-btn ${
              statusFilter === 'unstarted'
                ? 'bg-zinc-500/20 text-zinc-300 border border-zinc-500/40'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] bg-[var(--bg-surface)] border border-[var(--border-subtle)]'
            }`}
          >
            ⚪ Não Iniciadas
          </button>
        </div>

        {/* Categorias Filtro */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map(cat => (
            <motion.button
              key={cat}
              whileTap={{ scale: 0.96 }}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors min-h-[36px] touch-btn ${
                selectedCategory === cat
                  ? 'bg-orange-500 text-black font-extrabold shadow-sm'
                  : 'bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
              }`}
            >
              {cat}
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

            return (
              <motion.div
                key={tech.id}
                layout
                variants={cardVariant}
                initial="initial"
                animate="animate"
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
                whileHover={{ y: -2, transition: { duration: 0.15 } }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectTech(tech.id)}
                className="p-4 rounded-2xl bg-[var(--bg-card)] hover:bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] transition-all cursor-pointer shadow-md relative overflow-hidden"
              >
                {/* Linha Principal: Ícone, Título, Badge de Categoria e Indicador Circular */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 shadow-inner"
                      style={{
                        backgroundColor: `${tech.color}18`,
                        color: tech.color,
                        border: `1.5px solid ${tech.color}40`,
                      }}
                    >
                      {abbrev}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-extrabold text-[var(--text-primary)] truncate">
                          {tech.name}
                        </h3>
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
                      </div>
                      <p className="text-xs text-[var(--text-muted)] line-clamp-1 mt-0.5">
                        {tech.description}
                      </p>
                    </div>
                  </div>

                  {/* Indicador Circular de Mestria no topo direito */}
                  <div className="flex items-center gap-2 shrink-0">
                    <TechMasteryIndicator
                      mastery={mastery}
                      color={tech.color}
                      variant="circular"
                    />
                    <ChevronRight className="w-5 h-5 text-[var(--text-muted)] shrink-0" />
                  </div>
                </div>

                {/* Representação Visual Detalhada de Domínio (Mastery Bar, Tier, Aulas e Quizzes) */}
                <TechMasteryIndicator
                  mastery={mastery}
                  color={tech.color}
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
            <p className="text-sm font-bold text-[var(--text-primary)]">Nenhuma tecnologia encontrada</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Tente ajustar os filtros de categoria ou termo de busca.
            </p>
          </motion.div>
        )}
      </motion.div>

      <FooterStamp />
    </div>
  );
};
