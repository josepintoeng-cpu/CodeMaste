import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { useI18n } from '../i18n';

export const FooterStamp: React.FC = () => {
  const { t } = useI18n();

  return (
    <footer className="pt-8 pb-6 text-center select-none">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors shadow-sm max-w-full">
        <ShieldCheck className="w-3.5 h-3.5 text-orange-500 shrink-0" />
        <span className="text-[11px] font-sans tracking-wide">
          {t('footer.devBy')} <strong className="text-[var(--text-primary)] font-semibold">{t('footer.author')}</strong>, {t('footer.ceo')} <span className="text-orange-400 font-bold">{t('footer.company')}</span>
        </span>
      </div>
    </footer>
  );
};


