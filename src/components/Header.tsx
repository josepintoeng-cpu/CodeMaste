import React from 'react';
import { ArrowLeft, Zap, Moon, Sun, ShieldCheck, Cloud, CloudOff, RefreshCw, Globe } from 'lucide-react';
import { motion } from 'motion/react';
import { UserProgress, SyncStatus } from '../types';
import { StreakCounter } from './StreakCounter';
import { useI18n } from '../i18n';

interface HeaderProps {
  progress: UserProgress;
  syncStatus?: SyncStatus;
  onToggleTheme: () => void;
  onProfileClick: () => void;
  onNavigateToStudy?: () => void;
  onBack?: () => void;
  backLabel?: string;
}

export const Header: React.FC<HeaderProps> = ({
  progress,
  syncStatus,
  onToggleTheme,
  onProfileClick,
  onNavigateToStudy,
  onBack,
  backLabel,
}) => {
  const isDark = progress.theme === 'dark';
  const { t, language, toggleLanguage } = useI18n();

  return (
    <header className="sticky top-0 z-40 bg-[var(--header-bg)] backdrop-blur-md border-b border-[var(--border-subtle)] text-[var(--text-primary)] px-3 sm:px-4 py-2.5 sm:py-3 shadow-sm transition-colors duration-200">
      <div className="max-w-md md:max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* Left Section: Back Button or Logo & User Title */}
        <div className="flex items-center gap-2 min-w-0">
          {onBack ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.94 }}
              onClick={onBack}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/15 hover:bg-orange-500/25 active:bg-orange-500/30 text-orange-400 border border-orange-500/30 text-xs font-black transition-all touch-btn shadow-sm shrink-0"
              title={backLabel || t('nav.back')}
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
              <span className="text-[11px] uppercase tracking-wider font-extrabold">
                {backLabel || t('nav.back')}
              </span>
            </motion.button>
          ) : (
            <div className="flex items-center gap-2 cursor-pointer touch-btn" onClick={onProfileClick}>
              <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-500 border border-orange-500/30 flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                <ShieldCheck className="w-4 h-4 text-orange-500" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase font-bold text-orange-500 tracking-wider leading-tight flex items-center gap-1.5">
                  <span className="truncate">{t('app.name')} {t('app.version')}</span>
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
                <h1 className="text-sm font-bold tracking-tight text-[var(--text-primary)] leading-tight truncate">
                  {progress.userName}
                </h1>
              </div>
            </div>
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
          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-bold"
            title={t('header.xpTitle')}
          >
            <Zap className="w-3.5 h-3.5 fill-orange-500 text-orange-500 shrink-0" />
            <span>{progress.xp}</span>
          </div>

          {/* Quick Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-2 py-1 rounded-full bg-[var(--bg-surface)] hover:bg-[var(--border-strong)] border border-[var(--border-subtle)] text-xs font-bold text-[var(--text-primary)] transition-all touch-btn"
            title={language === 'pt' ? 'Switch to English' : 'Mudar para Português'}
          >
            <Globe className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {language === 'pt' ? 'PT' : 'EN'}
            </span>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="flex items-center justify-center p-1.5 rounded-full bg-[var(--bg-surface)] hover:bg-[var(--border-strong)] border border-[var(--border-subtle)] text-xs font-medium text-[var(--text-primary)] transition-all touch-btn min-w-[32px] min-h-[32px]"
            title={isDark ? t('header.themeDarkActive') : t('header.themeLightActive')}
          >
            {isDark ? (
              <Moon className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
            ) : (
              <Sun className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};


