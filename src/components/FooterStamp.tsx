import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const FooterStamp: React.FC = () => {
  return (
    <footer className="pt-8 pb-6 text-center select-none">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1A1A1C] border border-white/10 text-white/60 hover:text-white transition-colors shadow-sm max-w-full">
        <ShieldCheck className="w-3.5 h-3.5 text-orange-500 shrink-0" />
        <span className="text-[11px] font-sans tracking-wide">
          Desenvolvido pelo <strong className="text-white font-semibold">Eng. José Alfredo Pinto</strong>, CEO da <span className="text-orange-400 font-bold">DevMentor</span>
        </span>
      </div>
    </footer>
  );
};

