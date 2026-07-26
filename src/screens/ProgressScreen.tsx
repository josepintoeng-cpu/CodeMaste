import React from 'react';
import { Award, Flame, Zap, CheckCircle2, Trophy, BarChart2 } from 'lucide-react';
import { UserProgress } from '../types';
import { TECHNOLOGIES } from '../content/technologies';
import { BadgeItem } from '../components/Badge';
import { FooterStamp } from '../components/FooterStamp';

interface ProgressScreenProps {
  progress: UserProgress;
}

export const ProgressScreen: React.FC<ProgressScreenProps> = ({ progress }) => {
  const totalCompletedLessons = Object.keys(progress.completedLessons).length;

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
  ];

  return (
    <div className="pb-24 pt-4 px-4 max-w-md md:max-w-2xl mx-auto space-y-6">
      {/* Top Title */}
      <div>
        <div className="text-[10px] uppercase font-bold text-orange-500 tracking-widest">
          ESTATÍSTICAS ATUAIS
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          Status & Conquistas
        </h2>
        <p className="text-xs text-white/50">
          Acompanhe o seu desempenho detalhado em cada módulo.
        </p>
      </div>

      {/* Overview Cards (Large Serif Italic Numbers matching Editorial Theme) */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-[#1A1A1C] border border-white/10 text-center shadow-md">
          <div className="text-3xl sm:text-4xl font-serif-italic text-orange-400 font-light">{progress.xp}</div>
          <div className="text-[9px] font-bold uppercase tracking-widest text-white/40 mt-1">XP Total</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#1A1A1C] border border-white/10 text-center shadow-md">
          <div className="text-3xl sm:text-4xl font-serif-italic text-white font-light">{progress.streak}d</div>
          <div className="text-[9px] font-bold uppercase tracking-widest text-white/40 mt-1">Sequência</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#1A1A1C] border border-white/10 text-center shadow-md">
          <div className="text-3xl sm:text-4xl font-serif-italic text-white font-light">{totalCompletedLessons}</div>
          <div className="text-[9px] font-bold uppercase tracking-widest text-white/40 mt-1">Aulas Feitas</div>
        </div>
      </div>

      {/* Editorial Citação Motivacional */}
      <div className="p-4 rounded-2xl bg-[#1A1A1C] border border-white/10">
        <div className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2">
          INSIGHT DIÁRIO
        </div>
        <div className="text-xs italic text-white/70 font-serif leading-relaxed">
          "A persistência na prática de código transforma sintaxe em maestria. Mantenha sua sequência ativa hoje."
        </div>
      </div>

      {/* Progresso por Tecnologia */}
      <div className="p-4 rounded-2xl bg-[#1A1A1C] border border-white/10 space-y-3.5 shadow-md">
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
      </div>

      {/* Conquistas / Badges */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-orange-400" />
            CONQUISTAS DESBLOQUEADAS
          </h3>
          <span className="text-xs font-bold text-orange-400">
            {allBadges.filter(b => b.isUnlocked).length} / {allBadges.length}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {allBadges.map(badge => (
            <BadgeItem key={badge.id} {...badge} />
          ))}
        </div>
      </div>

      <FooterStamp />
    </div>
  );
};

