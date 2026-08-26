import React from 'react';
import { motion } from 'motion/react';
import { Play, ChevronRight, Terminal, Code, Layout, Palette, Server, Coffee, Smartphone, Globe, Database } from 'lucide-react';
import { UserProgress, TechId, LevelId } from '../types';
import { TECHNOLOGIES } from '../content/technologies';
import { FooterStamp } from '../components/FooterStamp';
import { fadeInUp, staggerContainer, cardVariant } from '../utils/animations';

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
  // Mapeamento de ícones do lucide-react para os cards
  const getTechIcon = (iconName: string) => {
    switch (iconName) {
      case 'Terminal': return Terminal;
      case 'Code': return Code;
      case 'Layout': return Layout;
      case 'Palette': return Palette;
      case 'Server': return Server;
      case 'Coffee': return Coffee;
      case 'Smartphone': return Smartphone;
      case 'Globe': return Globe;
      case 'Database': return Database;
      default: return Code;
    }
  };

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

  // Calcula progresso total e por tecnologia
  const totalCompleted = Object.keys(progress.completedLessons).length;
  const todayKey = new Date().toISOString().split('T')[0];
  const completedToday = (progress.lessonDates || []).includes(todayKey);
  const streak = progress.streak || 0;

  const getTechProgress = (techId: TechId) => {
    const completedForTech = Object.keys(progress.completedLessons).filter(id =>
      id.startsWith(techId)
    ).length;
    // Base de 20 aulas por tecnologia
    const pct = Math.min(Math.round((completedForTech / 20) * 100), 100);
    return { count: completedForTech, pct };
  };

  return (
    <div className="pb-24 pt-4 px-4 max-w-md md:max-w-2xl mx-auto space-y-6">
      {/* Editorial Header Greeting & Meta Banner */}
      <motion.div variants={fadeInUp} initial="initial" animate="animate" className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-[var(--text-muted)] text-[10px] uppercase tracking-widest font-bold">
              BEM-VINDO DE VOLTA
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] flex items-center gap-2">
              <span>{progress.userName}</span>
            </h2>
          </div>
          <div
            onClick={() => onNavigateTab('progress')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border cursor-pointer transition-all touch-btn ${
              completedToday
                ? 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                : streak > 0
                ? 'bg-[var(--bg-surface)] text-orange-400 border-[var(--border-subtle)]'
                : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border-[var(--border-subtle)]'
            }`}
            title="Ver detalhes da Sequência Diária no Progresso"
          >
            <span>🔥 {streak} {streak === 1 ? 'dia' : 'dias'}</span>
          </div>
        </div>

        {/* Daily Progress Banner (Matching Editorial Theme) */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
          className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 p-5 rounded-2xl flex justify-between items-center shadow-xl relative overflow-hidden text-white"
        >
          <div className="space-y-1 z-10">
            <div className="text-[10px] uppercase font-bold text-white/80 tracking-widest">
              SEQUÊNCIA & META DIÁRIA
            </div>
            <div className="text-base font-bold text-white">
              {completedToday ? 'Meta diária concluída! 🔥' : 'Mantenha sua sequência ativa'}
            </div>
            <p className="text-[11px] text-white/90 leading-tight">
              {completedToday
                ? `Você manteve seu fogo aceso por ${streak} ${streak === 1 ? 'dia consecutivo' : 'dias consecutivos'}!`
                : streak > 0
                ? `Complete 1 aula hoje para não perder sua sequência de ${streak} dias!`
                : 'Complete sua 1ª aula hoje para acender seu fogo de sequência diária!'}
            </p>
          </div>
          <div className="w-12 h-12 border-4 border-white/30 rounded-full flex flex-col items-center justify-center text-[10px] font-black text-white relative shrink-0 z-10 bg-black/25 backdrop-blur-sm">
            <span>{completedToday ? '100%' : '0%'}</span>
          </div>
          <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
        </motion.div>

        {/* Quick Resume Card */}
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectTech('python', 'iniciante')}
          className="w-full bg-[#1A1A1C] hover:bg-[#222226] text-white p-3.5 rounded-2xl flex items-center justify-between border border-white/10 transition-colors shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-500/30 text-orange-500 flex items-center justify-center shrink-0">
              <Play className="w-4 h-4 fill-orange-500 text-orange-500 ml-0.5" />
            </div>
            <div className="text-left">
              <span className="text-[9px] text-orange-400 font-bold uppercase tracking-widest block">
                CONTINUAR APRENDENDO
              </span>
              <span className="text-xs font-bold text-white block">
                Python: 1. Olá Mundo e Variáveis
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-white/40 shrink-0" />
        </motion.button>
      </motion.div>

      {/* Grid das 9 Tecnologias */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xs uppercase tracking-widest text-white/40 font-bold">
              TECNOLOGIAS (9 CURSOS)
            </h3>
            <p className="text-[11px] text-white/60">
              Aprenda interativamente do zero ao avançado.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('courses')}
            className="text-xs text-orange-400 font-bold hover:underline flex items-center uppercase tracking-wider touch-btn"
          >
            Ver Todos
          </button>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-2 gap-3"
        >
          {TECHNOLOGIES.map(tech => {
            const Icon = getTechIcon(tech.iconName);
            const abbrev = getTechAbbrev(tech.id);
            const { count, pct } = getTechProgress(tech.id);

            return (
              <motion.div
                key={tech.id}
                variants={cardVariant}
                whileHover={{ y: -3, transition: { duration: 0.18 } }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectTech(tech.id)}
                className="bg-[#1A1A1C] hover:bg-[#222226] p-4 rounded-2xl border border-white/10 hover:border-white/25 transition-colors cursor-pointer relative overflow-hidden group shadow-md"
              >
                {/* Tech Header Icon + Badge */}
                <div className="flex justify-between items-start mb-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shadow-inner"
                    style={{ backgroundColor: `${tech.color}20`, color: tech.color, border: `1px solid ${tech.color}40` }}
                  >
                    {abbrev}
                  </div>
                  <span
                    className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
                    style={{ backgroundColor: `${tech.color}15`, color: tech.color, border: `1px solid ${tech.color}30` }}
                  >
                    {tech.badge}
                  </span>
                </div>

                <div className="text-xs font-bold text-white mb-0.5">{tech.name}</div>
                <div className="text-[10px] text-white/50 mb-2 truncate">{tech.category}</div>

                {/* Progress Bar */}
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-3">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: tech.color }}
                  />
                </div>
                <div className="flex justify-between items-center text-[9px] text-white/40 mt-1.5 font-medium">
                  <span>{count}/20 aulas</span>
                  <span style={{ color: tech.color }}>{pct}%</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Editorial Stats Resumo */}
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        className="bg-[#1A1A1C] border border-white/10 rounded-2xl p-5 grid grid-cols-3 gap-2 text-center shadow-lg"
      >
        <div>
          <div className="text-3xl font-serif-italic text-white font-light">{totalCompleted}</div>
          <div className="text-[9px] font-bold uppercase tracking-widest text-white/40 mt-1">Aulas Feitas</div>
        </div>
        <div className="border-x border-white/10 px-2">
          <div className="text-3xl font-serif-italic text-orange-400 font-light">{progress.xp}</div>
          <div className="text-[9px] font-bold uppercase tracking-widest text-white/40 mt-1">XP Total</div>
        </div>
        <div>
          <div className="text-3xl font-serif-italic text-white font-light">{progress.streak}d</div>
          <div className="text-[9px] font-bold uppercase tracking-widest text-white/40 mt-1">Sequência</div>
        </div>
      </motion.div>

      {/* Signature Stamp */}
      <FooterStamp />
    </div>
  );
};

