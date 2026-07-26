import React, { useState } from 'react';
import { Search, Terminal, Code, Layout, Palette, Server, Coffee, Smartphone, Globe, Database, ChevronRight } from 'lucide-react';
import { TECHNOLOGIES } from '../content/technologies';
import { TechId, UserProgress } from '../types';
import { FooterStamp } from '../components/FooterStamp';

interface CursosScreenProps {
  progress: UserProgress;
  onSelectTech: (techId: TechId) => void;
}

export const CursosScreen: React.FC<CursosScreenProps> = ({ progress, onSelectTech }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  const categories = ['Todos', 'Frontend', 'Backend', 'Mobile', 'Banco de Dados', 'Linguagens'];

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

  const filteredTechs = TECHNOLOGIES.filter(tech => {
    const matchesSearch =
      tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tech.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'Todos' || tech.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="pb-24 pt-4 px-4 max-w-md md:max-w-2xl mx-auto space-y-5">
      {/* Editorial Header */}
      <div>
        <div className="text-[10px] uppercase font-bold text-orange-500 tracking-widest">
          CATÁLOGO OFICIAL
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          Cursos & Módulos (9 Stacks)
        </h2>
        <p className="text-xs text-white/50">
          Domine as 9 linguagens mais requisitadas com exemplos práticos.
        </p>
      </div>

      {/* Busca */}
      <div className="relative">
        <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Buscar tecnologia (ex: Python, MySQL, Flutter)..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1A1A1C] border border-white/10 text-white placeholder:text-white/30 text-xs focus:outline-none focus:border-orange-500/80 transition-colors"
        />
      </div>

      {/* Categorias Filtro */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors min-h-[36px] ${
              selectedCategory === cat
                ? 'bg-orange-500 text-black font-extrabold shadow-sm'
                : 'bg-[#1A1A1C] text-white/50 hover:text-white border border-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Lista de Cursos */}
      <div className="space-y-3">
        {filteredTechs.map(tech => {
          const abbrev = getTechAbbrev(tech.id);
          const completedCount = Object.keys(progress.completedLessons).filter(id =>
            id.startsWith(tech.id)
          ).length;

          return (
            <div
              key={tech.id}
              onClick={() => onSelectTech(tech.id)}
              className="p-4 rounded-2xl bg-[#1A1A1C] hover:bg-[#222226] border border-white/10 hover:border-white/20 transition-all cursor-pointer flex items-center justify-between gap-3 active:scale-[0.98] shadow-md"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-inner"
                  style={{ backgroundColor: `${tech.color}20`, color: tech.color, border: `1px solid ${tech.color}40` }}
                >
                  {abbrev}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white truncate">
                      {tech.name}
                    </h3>
                    <span
                      className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shrink-0"
                      style={{ backgroundColor: `${tech.color}15`, color: tech.color, border: `1px solid ${tech.color}30` }}
                    >
                      {tech.category}
                    </span>
                  </div>
                  <p className="text-xs text-white/50 line-clamp-1 mt-0.5">
                    {tech.description}
                  </p>
                  <span className="text-[10px] text-orange-400 font-bold block mt-1 uppercase tracking-wider">
                    {completedCount} de 20 Aulas Concluídas
                  </span>
                </div>
              </div>

              <ChevronRight className="w-5 h-5 text-white/30 shrink-0" />
            </div>
          );
        })}

        {filteredTechs.length === 0 && (
          <div className="text-center py-10 bg-[#1A1A1C] rounded-2xl border border-white/10 p-6">
            <p className="text-sm font-bold text-white">Nenhuma tecnologia encontrada</p>
            <p className="text-xs text-white/40 mt-1">Tente buscar por outro termo.</p>
          </div>
        )}
      </div>

      <FooterStamp />
    </div>
  );
};

