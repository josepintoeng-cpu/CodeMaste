import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Sparkles, CheckCircle2, BookOpen, ArrowRight } from 'lucide-react';
import { CURRICULUM_VERSION } from '../services/storageService';

interface CurriculumUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAudit: () => void;
}

export function CurriculumUpdateModal({ isOpen, onClose, onOpenAudit }: CurriculumUpdateModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-lg rounded-3xl bg-[var(--bg-secondary)] border border-orange-500/40 p-6 sm:p-7 shadow-2xl relative overflow-hidden"
        >
          {/* Fundo decorativo sutil */}
          <div className="absolute -right-16 -top-16 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <Sparkles className="w-3 h-3" />
                Mentoria & Integridade Oficial
              </div>
              <h2 className="text-lg sm:text-xl font-black text-[var(--text-primary)] mt-0.5">
                Currículo Atualizado & Aulas Sincronizadas
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
            O ecossistema pedagógico foi atualizado com <strong>novos conteúdos práticos</strong>, aulas inaugurais com console em tempo real e verificação de <strong>0 repetições</strong> nas 31 tecnologias.
          </p>

          <div className="p-3.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-2 mb-6 text-xs">
            <div className="flex items-start gap-2 text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Anti-Trapaça & Integridade:</strong> As lições foram reiniciadas desde o zero para que você domine todas as novidades na ordem correta.</span>
            </div>
            <div className="flex items-start gap-2 text-[var(--text-secondary)]">
              <BookOpen className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <span><strong>Versão Ativa:</strong> Build de Conteúdo <code className="font-mono text-orange-400">v{CURRICULUM_VERSION}</code> auditada.</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5">
            <button
              onClick={() => {
                onClose();
                onOpenAudit();
              }}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
            >
              <span>Ver Checklist de Aulas</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="w-full sm:w-auto py-3 px-5 rounded-xl text-xs font-semibold bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)] text-[var(--text-secondary)] transition-colors"
            >
              Entendido, Começar
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
