import React from 'react';
import { Home, BookOpen, Award, User } from 'lucide-react';

export type TabType = 'home' | 'courses' | 'progress' | 'profile';

interface BottomNavProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  const tabs = [
    { id: 'home' as TabType, label: 'Início', icon: Home },
    { id: 'courses' as TabType, label: 'Cursos', icon: BookOpen },
    { id: 'progress' as TabType, label: 'Status', icon: Award },
    { id: 'profile' as TabType, label: 'Perfil', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--nav-bg)] border-t border-[var(--border-subtle)] text-[var(--text-muted)] px-4 pt-2.5 safe-pb shadow-2xl backdrop-blur-xl transition-colors duration-200">
      <div className="max-w-md md:max-w-2xl mx-auto flex items-center justify-around">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 min-w-[64px] min-h-[44px] rounded-lg touch-btn touch-action-manipulation transition-all duration-200 ${
                isActive
                  ? 'text-orange-500 font-bold scale-105'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <div className={`p-1 rounded-md mb-0.5 ${isActive ? 'bg-orange-500/10 border border-orange-500/20' : ''}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.2px] text-orange-500' : 'stroke-[1.8px]'}`} />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-wider">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

