import React from 'react';
import { Flame, Zap, Moon, Sun, ShieldCheck } from 'lucide-react';
import { UserProgress } from '../types';

interface HeaderProps {
  progress: UserProgress;
  onToggleTheme: () => void;
  onProfileClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  progress,
  onToggleTheme,
  onProfileClick,
}) => {
  const isDark = progress.theme === 'dark';

  return (
    <header className="sticky top-0 z-40 bg-[var(--header-bg)] backdrop-blur-md border-b border-[var(--border-subtle)] text-[var(--text-primary)] px-4 py-3 shadow-sm transition-colors duration-200">
      <div className="max-w-md md:max-w-4xl mx-auto flex items-center justify-between">
        {/* Logo & User Title */}
        <div className="flex items-center gap-2.5 cursor-pointer touch-btn" onClick={onProfileClick}>
          <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-500 border border-orange-500/30 flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-orange-500" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-orange-500 tracking-wider leading-tight">
              CODEMASTER v1.0
            </div>
            <h1 className="text-sm font-bold tracking-tight text-[var(--text-primary)] leading-tight flex items-center gap-1.5">
              <span>{progress.userName}</span>
            </h1>
          </div>
        </div>

        {/* Gamification Stats: Streak & XP & Theme Toggle */}
        <div className="flex items-center gap-2">
          {/* Sequência / Streak */}
          <div
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs font-bold text-[var(--text-primary)]"
            title="Sequência de Dias Ativos"
          >
            <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500 animate-pulse" />
            <span>🔥 {progress.streak}</span>
          </div>

          {/* Pontos de Experiência / XP */}
          <div
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-bold"
            title="Pontos de Experiência"
          >
            <Zap className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
            <span>{progress.xp} XP</span>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--bg-surface)] hover:bg-[var(--border-strong)] border border-[var(--border-subtle)] text-xs font-medium text-[var(--text-primary)] transition-all touch-btn"
            title={`Tema: ${isDark ? 'Escuro (Ativado)' : 'Claro (Ativado)'}`}
          >
            {isDark ? (
              <>
                <Moon className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
                <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline">Escuro</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline">Claro</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};


