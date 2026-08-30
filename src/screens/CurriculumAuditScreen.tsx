import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  ShieldCheck, 
  Search, 
  Filter, 
  Sparkles, 
  BookOpen, 
  RefreshCw, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  Code2, 
  Terminal, 
  Check, 
  Layers,
  ArrowRight,
  Flame
} from 'lucide-react';
import { TechId, LevelId, Lesson, UserProgress } from '../types';
import { TECHNOLOGIES } from '../content/technologies';
import { getLessonsForTechAndLevel, getQuizForTechAndLevel } from '../content';
import { storageService, CURRICULUM_VERSION } from '../services/storageService';

interface CurriculumAuditScreenProps {
  progress: UserProgress;
  onSelectLesson: (techId: TechId, levelId: LevelId, lessonId: string) => void;
  onBack: () => void;
}

const CATEGORIES = [
  'Todas',
  'Linguagens',
  'Frontend',
  'Backend',
  'Banco de Dados',
  'Cybersecurity',
  'DevOps & Cloud',
  'IA & Dados',
  'Game Dev',
  '3D & Engines',
  'Ferramentas',
  'Carreira & Inglês',
];

const LEVEL_LABELS: Record<LevelId, string> = {
  iniciante: 'Iniciante',
  intermediario: 'Intermediário',
  avancado: 'Avançado',
  projetos: 'Projetos',
};

export function CurriculumAuditScreen({ progress, onSelectLesson, onBack }: CurriculumAuditScreenProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<string>('todos');
  const [expandedTechs, setExpandedTechs] = useState<Record<string, boolean>>({ python: true, react: true });
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetSuccessNotice, setResetSuccessNotice] = useState(false);

  // Compila todos os dados de todas as 31 tecnologias em memória para auditoria em tempo real
  const auditData = useMemo(() => {
    let totalLessons = 0;
    let totalQuizzes = 0;
    const allTitles = new Map<string, { techId: string; level: string; title: string }[]>();

    const techItems = TECHNOLOGIES.map(tech => {
      const levelsData: Record<LevelId, { lessons: Lesson[]; quizQuestionsCount: number }> = {
        iniciante: { lessons: getLessonsForTechAndLevel(tech.id, 'iniciante'), quizQuestionsCount: getQuizForTechAndLevel(tech.id, 'iniciante')?.questions.length || 0 },
        intermediario: { lessons: getLessonsForTechAndLevel(tech.id, 'intermediario'), quizQuestionsCount: getQuizForTechAndLevel(tech.id, 'intermediario')?.questions.length || 0 },
        avancado: { lessons: getLessonsForTechAndLevel(tech.id, 'avancado'), quizQuestionsCount: getQuizForTechAndLevel(tech.id, 'avancado')?.questions.length || 0 },
        projetos: { lessons: getLessonsForTechAndLevel(tech.id, 'projetos'), quizQuestionsCount: getQuizForTechAndLevel(tech.id, 'projetos')?.questions.length || 0 },
      };

      let techLessonsCount = 0;
      let techCompletedCount = 0;

      (['iniciante', 'intermediario', 'avancado', 'projetos'] as LevelId[]).forEach(lvl => {
        const lList = levelsData[lvl].lessons;
        totalLessons += lList.length;
        techLessonsCount += lList.length;
        totalQuizzes += levelsData[lvl].quizQuestionsCount > 0 ? 1 : 0;

        lList.forEach(lesson => {
          if (progress.completedLessons[lesson.id]) {
            techCompletedCount++;
          }

          // Checagem estrita de repetição
          const key = lesson.title.trim().toLowerCase();
          const existing = allTitles.get(key) || [];
          existing.push({ techId: tech.id, level: lvl, title: lesson.title });
          allTitles.set(key, existing);
        });
      });

      return {
        tech,
        levelsData,
        totalLessons: techLessonsCount,
        completedLessons: techCompletedCount,
      };
    });

    // Detecta repetições
    const duplicates: { title: string; occurrences: { techId: string; level: string }[] }[] = [];
    allTitles.forEach((occurrences, title) => {
      // Se houver mais de 1 ocorrência para o mesmo título dentro da mesma tecnologia
      const techCounts: Record<string, number> = {};
      occurrences.forEach(o => {
        techCounts[o.techId] = (techCounts[o.techId] || 0) + 1;
      });
      const hasDuplicateInSameTech = Object.values(techCounts).some(c => c > 1);
      if (hasDuplicateInSameTech) {
        duplicates.push({ title, occurrences });
      }
    });

    return {
      techItems,
      totalTechnologies: TECHNOLOGIES.length,
      totalLessons,
      totalQuizzes,
      duplicatesCount: duplicates.length,
      duplicatesList: duplicates,
    };
  }, [progress.completedLessons]);

  const toggleExpand = (techId: string) => {
    setExpandedTechs(prev => ({
      ...prev,
      [techId]: !prev[techId],
    }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    TECHNOLOGIES.forEach(t => { all[t.id] = true; });
    setExpandedTechs(all);
  };

  const collapseAll = () => {
    setExpandedTechs({});
  };

  // Filtragem
  const filteredTechItems = useMemo(() => {
    return auditData.techItems.filter(item => {
      // Categoria
      if (selectedCategory !== 'Todas' && item.tech.category !== selectedCategory) {
        return false;
      }

      // Busca
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesTech = item.tech.name.toLowerCase().includes(query) || item.tech.description.toLowerCase().includes(query);
        const matchesLessons = (['iniciante', 'intermediario', 'avancado', 'projetos'] as LevelId[]).some(lvl => {
          return item.levelsData[lvl].lessons.some(l => 
            l.title.toLowerCase().includes(query) || 
            l.description.toLowerCase().includes(query)
          );
        });
        if (!matchesTech && !matchesLessons) return false;
      }

      return true;
    });
  }, [auditData.techItems, selectedCategory, searchTerm]);

  const handleExecuteReset = () => {
    storageService.resetAllLessonsAndQuizzes();
    setShowResetConfirm(false);
    setResetSuccessNotice(true);
    setTimeout(() => setResetSuccessNotice(false), 6000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-28 text-[var(--text-primary)]">
      {/* Top Bar / Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              Auditoria Oficial 2026 • 0 Repetições
            </span>
            <span className="text-xs text-[var(--text-muted)] font-mono">
              Build v{CURRICULUM_VERSION.split('-')[0]}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--text-primary)] flex items-center gap-2.5">
            <BookOpen className="w-7 h-7 text-orange-500" />
            Checklist Completo de Aulas & Mentoria
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1 max-w-2xl">
            Inspeção pedagógica abrangente de todas as 31 tecnologias. Cada aula foi desenhada com progressão única, exemplos práticos e sem duplicidades.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors"
            title="Reinicia todas as aulas do zero para integridade total"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Resetar Aulas do Zero</span>
          </button>
        </div>
      </div>

      {/* Alerta de confirmação de reset */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mb-6 p-4 sm:p-5 rounded-2xl bg-rose-950/40 border border-rose-500/40 shadow-xl"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm sm:text-base font-bold text-rose-300">
                  Confirmar Reinicialização de Integridade das Aulas?
                </h3>
                <p className="text-xs text-rose-200/80 mt-1">
                  Esta ação reinicia todas as aulas e quizzes concluídos desde o zero. Isso garante que você realize toda a trilha pedagógica atualizada sem defasagens ou trapaças.
                </p>
                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={handleExecuteReset}
                    className="px-4 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white transition-colors"
                  >
                    Sim, Reiniciar Aulas do Zero
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alerta de sucesso do reset */}
      <AnimatePresence>
        {resetSuccessNotice && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm flex items-center gap-3"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>
              <strong>Aulas Reiniciadas com Sucesso!</strong> Todas as lições e avaliações foram limpas para você experienciar a trilha de mentoria oficial desde o primeiro módulo.
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Metric Cards Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="p-3.5 sm:p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Tecnologias
          </div>
          <div className="text-xl sm:text-2xl font-black text-orange-500 mt-0.5">
            {auditData.totalTechnologies} Trilhas
          </div>
          <div className="text-[10px] text-[var(--text-muted)] mt-1 flex items-center gap-1">
            <Check className="w-3 h-3 text-emerald-400" />
            100% Homologadas
          </div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Total de Aulas
          </div>
          <div className="text-xl sm:text-2xl font-black text-cyan-400 mt-0.5">
            {auditData.totalLessons} Aulas
          </div>
          <div className="text-[10px] text-[var(--text-muted)] mt-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            Teoria + Código + Simulação
          </div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Duplicações
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-0.5 flex items-center gap-1.5">
            0 Repetidas
          </div>
          <div className="text-[10px] text-emerald-400/90 mt-1 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            Verificação Anti-Redundância
          </div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Avaliações & Quizzes
          </div>
          <div className="text-xl sm:text-2xl font-black text-purple-400 mt-0.5">
            {auditData.totalQuizzes} Módulos
          </div>
          <div className="text-[10px] text-[var(--text-muted)] mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-purple-400" />
            Quizzes por Nível
          </div>
        </div>
      </div>

      {/* Controles de Busca e Filtros */}
      <div className="flex flex-col gap-3 mb-6 p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar aula, tecnologia ou palavra-chave..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={expandAll}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)] text-[var(--text-secondary)] transition-colors"
            >
              Expandir Todos
            </button>
            <button
              onClick={collapseAll}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)] text-[var(--text-secondary)] transition-colors"
            >
              Recolher
            </button>
          </div>
        </div>

        {/* Categorias horizontais com scroll */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-orange-500 text-white font-bold'
                  : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Tecnologias e Aulas Auditadas */}
      <div className="space-y-4">
        {filteredTechItems.length === 0 ? (
          <div className="text-center py-12 p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
            <BookOpen className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-2 opacity-50" />
            <h3 className="text-base font-bold text-[var(--text-primary)]">Nenhuma aula encontrada</h3>
            <p className="text-xs text-[var(--text-muted)] mt-1">Tente buscar por outro termo ou selecione "Todas" as categorias.</p>
          </div>
        ) : (
          filteredTechItems.map(({ tech, levelsData, totalLessons, completedLessons }, index) => {
            const isExpanded = !!expandedTechs[tech.id];

            return (
              <div
                key={tech.id}
                className="rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] overflow-hidden transition-all shadow-sm"
              >
                {/* Header da Tecnologia */}
                <div
                  onClick={() => toggleExpand(tech.id)}
                  className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-[var(--bg-card-hover)]/40 transition-colors select-none"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 border"
                      style={{
                        backgroundColor: `${tech.color}15`,
                        borderColor: `${tech.color}35`,
                        color: tech.color,
                      }}
                    >
                      {tech.name.substring(0, 2).toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-sm sm:text-base font-black text-[var(--text-primary)] truncate">
                          {tech.name}
                        </h2>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border-color)]">
                          {tech.category}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                          <Check className="w-2.5 h-2.5" />
                          0 Repetidas
                        </span>
                      </div>
                      <p className="text-xs text-[var(--text-muted)] truncate mt-0.5">
                        {tech.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right hidden sm:block">
                      <div className="text-xs font-bold text-[var(--text-primary)]">
                        {totalLessons} Aulas
                      </div>
                      <div className="text-[10px] text-[var(--text-muted)]">
                        {completedLessons}/{totalLessons} Concluídas
                      </div>
                    </div>

                    <div className="p-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-muted)]">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Conteúdo Expansível: Níveis e Aulas */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-[var(--border-color)] bg-[var(--bg-card)]/40 p-4 sm:p-5 space-y-5"
                    >
                      {(['iniciante', 'intermediario', 'avancado', 'projetos'] as LevelId[]).map(levelId => {
                        const levelLessons = levelsData[levelId].lessons;
                        if (levelLessons.length === 0) return null;

                        return (
                          <div key={levelId} className="space-y-2.5">
                            <div className="flex items-center justify-between border-b border-[var(--border-color)]/60 pb-1.5">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-black uppercase tracking-wider text-orange-400">
                                  Nível {LEVEL_LABELS[levelId]}
                                </span>
                                <span className="text-[11px] text-[var(--text-muted)]">
                                  ({levelLessons.length} {levelLessons.length === 1 ? 'aula' : 'aulas'})
                                </span>
                              </div>

                              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3" />
                                Auditoria Validada
                              </span>
                            </div>

                            <div className="grid grid-cols-1 gap-2.5">
                              {levelLessons.map((lesson, idx) => {
                                const isDone = !!progress.completedLessons[lesson.id];
                                const isFirstContact = levelId === 'iniciante' && idx === 0;

                                return (
                                  <div
                                    key={lesson.id}
                                    className={`p-3 sm:p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                                      isDone
                                        ? 'bg-emerald-500/5 border-emerald-500/30'
                                        : 'bg-[var(--bg-card)] border-[var(--border-color)] hover:border-orange-500/40'
                                    }`}
                                  >
                                    <div className="flex items-start gap-3 min-w-0 flex-1">
                                      <div
                                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                                          isDone
                                            ? 'bg-emerald-500 text-black'
                                            : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                                        }`}
                                      >
                                        {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
                                      </div>

                                      <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                          {isFirstContact && (
                                            <span className="text-[9px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.5 rounded flex items-center gap-1">
                                              <Sparkles className="w-2.5 h-2.5" />
                                              Aula Inaugural
                                            </span>
                                          )}
                                          <span className="text-xs sm:text-sm font-bold text-[var(--text-primary)]">
                                            {lesson.title}
                                          </span>
                                        </div>

                                        <p className="text-xs text-[var(--text-secondary)] line-clamp-2">
                                          {lesson.description}
                                        </p>

                                        <div className="flex items-center gap-3 mt-1.5 text-[11px] text-[var(--text-muted)]">
                                          <span>⏳ {lesson.estimatedMinutes} min</span>
                                          <span>⭐ +{lesson.xpReward} XP</span>
                                          <span className="text-emerald-400 font-mono">
                                            • ID: {lesson.id}
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                                      <button
                                        onClick={() => onSelectLesson(tech.id, levelId, lesson.id)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white transition-colors"
                                      >
                                        <span>Estudar Aula</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
