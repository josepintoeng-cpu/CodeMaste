import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Clock,
  ShieldCheck,
  FileCheck2,
  Cpu,
  Sparkles,
  Zap,
  CheckCircle2,
  Lock,
  ArrowRight,
  RefreshCw,
  Award,
  AlertCircle
} from 'lucide-react';
import { TechId, ExamAttempt, UserProgress } from '../types';
import { TECHNOLOGIES } from '../content/technologies';
import { storageService } from '../services/storageService';

interface ExamEmbargoScreenProps {
  techId: TechId;
  attempt: ExamAttempt;
  progress: UserProgress;
  onResultsReady: () => void;
  onBackToCourses: () => void;
}

export const ExamEmbargoScreen: React.FC<ExamEmbargoScreenProps> = ({
  techId,
  attempt,
  progress,
  onResultsReady,
  onBackToCourses,
}) => {
  const tech = TECHNOLOGIES.find(t => t.id === techId) || TECHNOLOGIES[0];

  // Calcula tempo restante para a divulgação oficial (30 minutos a partir de submittedAt)
  const calculateRemainingSeconds = () => {
    if (!attempt.resultsReleaseAt) return 0;
    const target = new Date(attempt.resultsReleaseAt).getTime();
    const now = Date.now();
    return Math.max(0, Math.floor((target - now) / 1000));
  };

  const [remainingSeconds, setRemainingSeconds] = useState<number>(calculateRemainingSeconds());
  const [isSimulatingFastForward, setIsSimulatingFastForward] = useState<boolean>(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = calculateRemainingSeconds();
      setRemainingSeconds(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        handleRelease();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [attempt.resultsReleaseAt]);

  const formatCountdown = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRelease = () => {
    storageService.releaseExamResults(techId);
    onResultsReady();
  };

  const handleFastForward = () => {
    setIsSimulatingFastForward(true);
    setTimeout(() => {
      handleRelease();
    }, 600);
  };

  const progressPercentage = Math.min(
    100,
    Math.max(0, Math.round(((30 * 60 - remainingSeconds) / (30 * 60)) * 100))
  );

  return (
    <div id="exam-embargo-screen" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 font-sans">
      <div className="max-w-2xl w-full mx-auto space-y-6">
        
        {/* Card Principal da Câmara de Avaliação */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden"
        >
          {/* Luz ambiente de fundo */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Auditoria & Correção Rigorosa</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
              Divulgação de Notas Oficiais
            </h1>
            <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
              As notas do Exame de Passagem de <strong className="text-slate-200">{tech.name}</strong> são submetidas a correção minuciosa antes da liberação oficial após 30 minutos.
            </p>
          </div>

          {/* Contador Regressivo Central de 30 Minutos */}
          <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-6 text-center space-y-3 shadow-inner">
            <div className="text-xs uppercase font-mono tracking-widest text-slate-400">
              Tempo Restante para Divulgação
            </div>
            <div
              id="embargo-countdown"
              className="text-4xl sm:text-5xl font-black font-mono tracking-wider text-amber-400 flex items-center justify-center gap-3"
            >
              <Clock className="w-8 h-8 text-amber-500 animate-pulse" />
              <span>{formatCountdown(remainingSeconds)}</span>
            </div>

            {/* Barra de Progresso dos 30 minutos */}
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mt-3">
              <div
                className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full transition-all duration-1000"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-400 flex justify-between font-mono">
              <span>00:00 (Submissão)</span>
              <span>{progressPercentage}% auditado</span>
              <span>30:00 (Boletim Oficial)</span>
            </div>
          </div>

          {/* Dados do Protocolo */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950/60 p-4 rounded-xl border border-slate-800/60">
            <div>
              <span className="text-slate-400 block">Aluno Avaliado:</span>
              <span className="font-semibold text-slate-200">{progress.userName || 'Dev Aprendiz'}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Tecnologia:</span>
              <span className="font-semibold text-amber-400">{tech.name}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Caderno de Prova:</span>
              <span className="font-semibold text-slate-200">80 Questões (60 Teo + 20 Prát)</span>
            </div>
            <div>
              <span className="text-slate-400 block">Critério de Aprovação:</span>
              <span className="font-semibold text-emerald-400">Nota 20 / 20 Valores</span>
            </div>
          </div>

          {/* Etapas de Correção */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Fluxo de Auditoria Técnica
            </h3>
            
            <div className="space-y-2 text-xs">
              <div className="flex items-center space-x-3 p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="text-slate-300">1. Submissão do protocolo gravada e assinada com sucesso.</span>
              </div>
              <div className="flex items-center space-x-3 p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <Cpu className="w-4 h-4 text-amber-400 flex-shrink-0 animate-spin" />
                <span className="text-slate-300">2. Correção estrita dos 60 itens teóricos e 20 exercícios práticos.</span>
              </div>
              <div className="flex items-center space-x-3 p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <Award className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="text-slate-400">3. Emissão da nota final (0 a 20 valores) e homologação de desbloqueio.</span>
              </div>
            </div>
          </div>

          {/* Ações */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              id="btn-fast-forward-results"
              onClick={handleFastForward}
              disabled={isSimulatingFastForward}
              className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 disabled:opacity-50"
            >
              <Zap className="w-4 h-4" />
              <span>{isSimulatingFastForward ? 'Homologando Notas...' : 'Divulgar Imediatamente (Avanço Rápido)'}</span>
            </button>
            <button
              id="btn-back-to-courses"
              onClick={onBackToCourses}
              className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
            >
              Voltar aos Cursos
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
