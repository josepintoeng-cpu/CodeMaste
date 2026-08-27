import React from 'react';
import { ArrowLeft, Zap, Moon, Sun, ShieldCheck, Cloud, CloudOff, RefreshCw, Globe, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { UserProgress, SyncStatus } from '../types';
import { StreakCounter } from './StreakCounter';
import { useScrollDirection } from '../hooks/useScrollDirection';
import { useI18n } from '../i18n';

interface HeaderProps {
  progress: UserProgress;
  syncStatus?: SyncStatus;
  onToggleTheme: () => void;
  onProfileClick: () => void;
  onOpenWelcome?: () => void;
  onNavigateToStudy?: () => void;
  onBack?: () => void;
  backLabel?: string;
}

export const Header: React.FC<HeaderProps> = ({
  progress,
  syncStatus,
  onToggleTheme,
  onProfileClick,
  onOpenWelcome,
  onNavigateToStudy,
  onBack,
  backLabel,
}) => {
  const isDark = progress.theme === 'dark';
  const { t, language, toggleLanguage } = useI18n();
  const { isScrolled, scrollDirection } = useScrollDirection(10);

  return (
    <header
      className={`sticky top-0 z-40 text-[var(--text-primary)] px-3 sm:px-5 md:px-8 py-2.5 sm:py-3 transition-all duration-300 ${
        isScrolled
          ? 'bg-[var(--header-bg)] backdrop-blur-xl border-b border-[var(--border-subtle)] shadow-lg shadow-black/10 translate-y-0'
          : 'bg-[var(--bg-primary)] border-b border-transparent shadow-none'
      }`}
    >
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Left Section: Back Button or Logo & User Title */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1 sm:flex-initial">
          {onBack ? (
            <motion.button
              whileHover={{ scale: 1.03, x: -2 }}
              whileTap={{ scale: 0.94 }}
              onClick={onBack}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/15 hover:bg-orange-500/25 active:bg-orange-500/30 text-orange-400 border border-orange-500/30 text-xs font-black transition-all touch-btn shadow-sm shrink-0"
              title={backLabel || t('nav.back')}
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
              <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-extrabold">
                {backLabel || t('nav.back')}
              </span>
            </motion.button>
          ) : (
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-2.5 cursor-pointer touch-btn min-w-0 group"
              onClick={onProfileClick}
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/10 text-orange-400 border border-orange-500/30 flex items-center justify-center font-bold text-xs shrink-0 shadow-sm group-hover:border-orange-500/50 group-hover:shadow-orange-500/10 transition-all">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
              </div>
              <div className="min-w-0 overflow-hidden">
                <div className="text-[9px] sm:text-[10px] uppercase font-black text-orange-500 tracking-wider leading-none flex items-center gap-1.5 mb-0.5">
                  <span className="truncate">{t('app.name')}</span>
                  <span className="text-[9px] opacity-70 font-mono hidden xs:inline">{t('app.version')}</span>
                  {/* Status de Sincronização Inteligente */}
                  {syncStatus && (
                    <span
                      className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[9px] font-bold ${
                        !syncStatus.isOnline
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : syncStatus.isSyncing
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : syncStatus.pendingCount > 0
                          ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}
                      title={
                        !syncStatus.isOnline
                          ? t('sync.offlineDesc')
                          : syncStatus.isSyncing
                          ? t('sync.syncingDesc')
                          : syncStatus.pendingCount > 0
                          ? t('sync.pendingDesc', { count: syncStatus.pendingCount })
                          : t('sync.syncedDesc')
                      }
                    >
                      {!syncStatus.isOnline ? (
                        <>
                          <CloudOff className="w-2.5 h-2.5" />
                          <span className="hidden sm:inline">{t('sync.offline')}</span>
                        </>
                      ) : syncStatus.isSyncing ? (
                        <>
                          <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                          <span className="hidden sm:inline">{t('sync.syncing')}</span>
                        </>
                      ) : (
                        <>
                          <Cloud className="w-2.5 h-2.5" />
                          <span className="hidden sm:inline">{t('sync.synced')}</span>
                        </>
                      )}
                    </span>
                  )}
                </div>
                <h1 className="text-xs sm:text-sm font-extrabold tracking-tight text-[var(--text-primary)] leading-tight truncate">
                  {progress.userName || 'Dev Aprendiz'}
                </h1>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Section Gamification Stats: Streak & XP & Language & Theme Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Elemento Streak Counter Diário */}
          <StreakCounter
            progress={progress}
            variant="compact"
            onNavigateToStudy={onNavigateToStudy}
          />

          {/* Pontos de Experiência / XP */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/25 text-orange-400 text-xs font-black shadow-sm"
            title={t('header.xpTitle')}
          >
            <Zap className="w-3.5 h-3.5 fill-orange-400 text-orange-400 shrink-0" />
            <span className="text-[11px] sm:text-xs">{progress.xp}</span>
          </motion.div>

          {/* Apresentação & Sobre o Projeto */}
          {onOpenWelcome && (
            <motion.button
              whileHover={{ scale: 1.1, rotate: 12 }}
              whileTap={{ scale: 0.9 }}
              onClick={onOpenWelcome}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--bg-surface)] hover:bg-[var(--border-strong)] border border-[var(--border-subtle)] text-xs font-medium text-[var(--text-primary)] transition-all touch-btn shadow-sm shrink-0"
              title={t('welcome.navAbout')}
            >
              <Sparkles className="w-4 h-4 text-orange-400" />
            </motion.button>
          )}

          {/* Quick Language Toggle */}
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.92 }}
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-2 py-1 rounded-full bg-[var(--bg-surface)] hover:bg-[var(--border-strong)] border border-[var(--border-subtle)] text-xs font-bold text-[var(--text-primary)] transition-all touch-btn shadow-sm"
            title={language === 'pt' ? 'Switch to English' : 'Mudar para Português'}
          >
            <Globe className="w-3.5 h-3.5 text-orange-400 shrink-0" />
            <span className="text-[10px] font-black uppercase tracking-wider">
              {language === 'pt' ? 'PT' : 'EN'}
            </span>
          </motion.button>

          {/* Theme Toggle Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onToggleTheme}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--bg-surface)] hover:bg-[var(--border-strong)] border border-[var(--border-subtle)] text-xs font-medium text-[var(--text-primary)] transition-all touch-btn shadow-sm shrink-0"
            title={isDark ? t('header.themeDarkActive') : t('header.themeLightActive')}
          >
            {isDark ? (
              <Moon className="w-4 h-4 text-orange-400 fill-orange-400" />
            ) : (
              <Sun className="w-4 h-4 text-orange-500 fill-orange-500" />
            )}
          </motion.button>
        </div>
      </div>
    </header>
  );
};



