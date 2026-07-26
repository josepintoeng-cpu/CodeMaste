import React from 'react';
import { Award, CheckCircle, Lock, Flame, Zap, BookOpen } from 'lucide-react';

interface BadgeProps {
  id: string;
  title: string;
  description: string;
  iconName: string;
  isUnlocked: boolean;
}

export const BadgeItem: React.FC<BadgeProps> = ({
  title,
  description,
  iconName,
  isUnlocked,
}) => {
  const getIcon = () => {
    switch (iconName) {
      case 'flame':
        return Flame;
      case 'zap':
        return Zap;
      case 'book':
        return BookOpen;
      default:
        return Award;
    }
  };

  const IconComponent = getIcon();

  return (
    <div
      className={`p-3.5 rounded-2xl border transition-all flex items-center gap-3 ${
        isUnlocked
          ? 'bg-[#1A1A1C] border-orange-500/40 shadow-md'
          : 'bg-[#1A1A1C]/50 border-white/5 opacity-50'
      }`}
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
          isUnlocked
            ? 'bg-orange-500 text-black font-bold shadow-md'
            : 'bg-white/5 text-white/30'
        }`}
      >
        {isUnlocked ? (
          <IconComponent className="w-5 h-5 stroke-[2.2px]" />
        ) : (
          <Lock className="w-4 h-4 text-white/30" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <h4 className="text-xs font-bold text-white truncate">{title}</h4>
          {isUnlocked && <CheckCircle className="w-3.5 h-3.5 text-orange-400 shrink-0" />}
        </div>
        <p className="text-[10px] text-white/50 leading-snug line-clamp-2 mt-0.5">
          {description}
        </p>
      </div>
    </div>
  );
};

