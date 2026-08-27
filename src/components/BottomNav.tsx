import React from 'react';
import { Home, BookOpen, Award, User } from 'lucide-react';
import { useI18n } from '../i18n';

export type TabType = 'home' | 'courses' | 'progress' | 'profile';

interface BottomNavProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  const { t } = useI18n();

  const tabs = [
    { id: 'home' as TabType, label: t('nav.home'), icon: Home },
    { id: 'courses' as TabType, label: t('nav.courses'), icon: BookOpen },
    { id: 'progress' as TabType, label: t('nav.progress'), icon: Award },
    { id: 'profile' as TabType, label: t('nav.profile'), icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--nav-bg)] border-t border-[var(--border-subtle)] text-[var(--text-muted)] px-3 sm:px-6 md:px-8 pt-2 pb-2 safe-pb shadow-2xl backdrop-blur-xl transition-all duration-200">
      <div className="w-full max-w-4xl md:max-w-5xl lg:max-w-6xl mx-auto flex items-center justify-around sm:justify-center sm:gap-6 md:gap-10">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex sm:flex-row flex-col items-center justify-center gap-1 sm:gap-2 py-1.5 px-3 sm:px-5 min-w-[64px] sm:min-w-[120px] min-h-[44px] rounded-xl touch-btn touch-action-manipulation transition-all duration-200 ${
                isActive
                  ? 'bg-orange-500/15 text-orange-400 font-bold border border-orange-500/30 shadow-sm scale-100 sm:scale-105'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]/60'
              }`}
            >
              <div className={`p-1 rounded-lg ${isActive ? 'bg-orange-500/20' : ''}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.2px] text-orange-400' : 'stroke-[1.8px]'}`} />
              </div>
              <span className="text-[9px] sm:text-xs font-bold uppercase tracking-wider">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};


