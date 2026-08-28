import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
  HelpCircle,
  Code2,
  BookOpen,
  ArrowLeft,
  ArrowRight,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  RefreshCw,
  Play,
  FileCheck,
  Check,
  X,
  ListOrdered,
  Eye,
  Info
} from 'lucide-react';
import { TechId, CourseExam, ExamQuestion, UserProgress, ExamAttempt } from '../types';
import { TECHNOLOGIES } from '../content/technologies';
import { generateCourseExam, evaluateExamSubmission } from '../content/exams';
import { storageService } from '../services/storageService';
import { useI18n } from '../i18n';

interface ExamScreenProps {
  techId: TechId;
  progress: UserProgress;
  onFinishExam: (attempt: ExamAttempt) => void;
  onExit: () => void;
}

export const ExamScreen: React.FC<ExamScreenProps> = ({
  techId,
  progress,
  onFinishExam,
  onExit,
}) => {
  const { t } = useI18n();
  const tech = useMemo(() => TECHNOLOGIES.find(t => t.id === techId) || TECHNOLOGIES[0], [techId]);
  const exam: CourseExam = useMemo(() => generateCourseExam(techId), [techId]);

  // Carrega respostas salvas ou inicia novo exame
  const existingActive = progress.activeExamAttempt?.techId === techId ? progress.activeExamAttempt : null;

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>(
    existingActive?.answers || {}
  );
  
  // 120 minutos = 7200 segundos
  const INITIAL_SECONDS = 120 * 60;
  const [timeRemaining, setTimeRemaining] = useState<number>(
    existingActive?.timeRemainingSeconds ?? INITIAL_SECONDS
  );
  const [isTimedOut, setIsTimedOut] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'theory' | 'practical' | 'answered' | 'pending'>('all');
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [showQuestionGrid, setShowQuestionGrid] = useState<boolean>(false);
  const [practiceTestStatus, setPracticeTestStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Contagem regressiva de 120 minutos
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setIsTimedOut(true);
          handleAutoSubmitOnTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Salva o progresso ativo no localStorage a cada alteração
  useEffect(() => {
    const timeSpent = INITIAL_SECONDS - timeRemaining;
    const currentAttempt: ExamAttempt = {
      id: existingActive?.id || 'attempt-' + Date.now(),
      techId,
      startedAt: existingActive?.startedAt || new Date(Date.now() - timeSpent * 1000).toISOString(),
      timeSpentSeconds: timeSpent,
      timeRemainingSeconds: timeRemaining,
      timedOut: isTimedOut,
      answers,
      theoryCorrect: 0,
      practicalCorrect: 0,
      totalCorrect: 0,
      scoreOutOf20: 0,
      passed: false,
      status: 'in_progress',
    };
    storageService.saveActiveExamAttempt(currentAttempt);
  }, [answers, timeRemaining, isTimedOut, techId]);

  const currentQuestion: ExamQuestion | undefined = exam.questions[currentIndex];

  // Formatação do relógio HH:MM:SS
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Questões filtradas para exibição no navegador
  const filteredQuestions = useMemo(() => {
    return exam.questions.filter((q, idx) => {
      const isAnswered = answers[q.id] !== undefined && answers[q.id] !== '';
      if (activeFilter === 'theory') return q.type === 'theory';
      if (activeFilter === 'practical') return q.type === 'practical';
      if (activeFilter === 'answered') return isAnswered;
      if (activeFilter === 'pending') return !isAnswered;
      return true;
    });
  }, [exam.questions, activeFilter, answers]);

  const totalAnswered = useMemo(() => {
    return Object.values(answers).filter(val => val !== undefined && val !== '').length;
  }, [answers]);

  const answeredPercentage = Math.round((totalAnswered / exam.totalQuestions) * 100);

  const handleSelectTheoryAnswer = (optionIdx: number) => {
    if (!currentQuestion) return;
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: optionIdx,
    }));
  };

  const handleCodeChange = (newCode: string) => {
    if (!currentQuestion) return;
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: newCode,
    }));
    setPracticeTestStatus('idle');
  };

  const handleResetCode = () => {
    if (!currentQuestion || currentQuestion.type !== 'practical') return;
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: currentQuestion.initialCode || '',
    }));
    setPracticeTestStatus('idle');
  };

  const handleValidatePracticeCode = () => {
    if (!currentQuestion || currentQuestion.type !== 'practical') return;
    const code = (answers[currentQuestion.id] as string) || '';
    if (code.trim().length < 15) {
      setPracticeTestStatus('invalid');
      return;
    }
    let valid = true;
    if (currentQuestion.expectedKeywords) {
      for (const kw of currentQuestion.expectedKeywords) {
        if (!code.toLowerCase().includes(kw.toLowerCase())) {
          valid = false;
          break;
        }
      }
    }
    setPracticeTestStatus(valid ? 'valid' : 'invalid');
  };

  const handleAutoSubmitOnTimeout = () => {
    const timeSpent = INITIAL_SECONDS;
    const { attempt } = evaluateExamSubmission(exam, answers, timeSpent, true);
    storageService.submitExamAttempt(attempt);
    onFinishExam(attempt);
  };

  const handleManualSubmit = () => {
    const timeSpent = INITIAL_SECONDS - timeRemaining;
    const { attempt } = evaluateExamSubmission(exam, answers, timeSpent, false);
    storageService.submitExamAttempt(attempt);
    onFinishExam(attempt);
  };

  const isCurrentAnswered = currentQuestion ? answers[currentQuestion.id] !== undefined && answers[currentQuestion.id] !== '' : false;

  // Cor do temporizador: Alerta vermelho quando faltam menos de 10 minutos
  const isUrgent = timeRemaining < 10 * 60;
  const isCritical = timeRemaining < 3 * 60;

  return (
    <div id="exam-screen" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Header com Cronômetro Oficial e Barra de Progresso */}
      <header id="exam-header" className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 py-3 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Info do Curso */}
          <div className="flex items-center space-x-3">
            <button
              id="btn-exam-exit"
              onClick={() => setShowExitConfirm(true)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Pausar ou Sair"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className={`w-3 h-8 rounded-full ${tech.color || 'bg-amber-500'}`} />
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-semibold">
                  Exame de Passagem Oficial
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                  80 Questões • 20 Valores
                </span>
              </div>
              <h1 className="text-base font-bold text-slate-100 flex items-center gap-2">
                {tech.name}
                <span className="text-xs text-slate-400 font-normal hidden sm:inline">
                  (60 Teóricas + 20 Práticas)
                </span>
              </h1>
            </div>
          </div>

          {/* Cronômetro Central Rigoroso */}
          <div className="flex items-center space-x-4">
            <div
              id="exam-timer-display"
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl border font-mono text-base font-bold transition-all ${
                isCritical
                  ? 'bg-rose-950/80 border-rose-500 text-rose-300 animate-pulse shadow-lg shadow-rose-950/50'
                  : isUrgent
                  ? 'bg-amber-950/80 border-amber-500 text-amber-300'
                  : 'bg-slate-900 border-slate-700 text-emerald-400'
              }`}
            >
              <Clock className={`w-5 h-5 ${isCritical ? 'text-rose-400 animate-spin' : isUrgent ? 'text-amber-400' : 'text-emerald-400'}`} />
              <div className="flex flex-col items-start leading-none">
                <span className="text-[10px] uppercase font-sans tracking-wider text-slate-400">Tempo Restante</span>
                <span className="text-lg tracking-wider">{formatTime(timeRemaining)}</span>
              </div>
            </div>

            {/* Botão Submeter Exame */}
            <button
              id="btn-open-submit-modal"
              onClick={() => setShowSubmitModal(true)}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md transition-all active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Finalizar & Submeter</span>
            </button>
          </div>
        </div>

        {/* Barra de Progresso de Respostas */}
        <div className="max-w-7xl mx-auto mt-2 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-2 flex-1 mr-4">
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-amber-400 h-full transition-all duration-300 rounded-full"
                style={{ width: `${answeredPercentage}%` }}
              />
            </div>
          </div>
          <div className="font-mono text-slate-300 whitespace-nowrap">
            <span className="font-bold text-amber-400">{totalAnswered}</span> de 80 respondidas ({answeredPercentage}%)
          </div>
        </div>
      </header>

      {/* Alerta de Tempo Crítico */}
      {isUrgent && (
        <div className="bg-rose-900/60 border-b border-rose-700/80 px-4 py-2 text-center text-xs font-semibold text-rose-200 flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-300" />
          <span>Atenção: Menos de 10 minutos restantes! Ao esgotar o tempo, o exame será submetido e reprovado automaticamente se não atingir 20/20.</span>
        </div>
      )}

      {/* Corpo Principal: Navegação de Questões + Área de Resposta */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Coluna Esquerda: Navegador de Questões (1 a 80) */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex flex-col h-full max-h-[750px]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <ListOrdered className="w-4 h-4 text-amber-400" />
                <h2 className="text-sm font-bold text-slate-200">Navegador de Questões</h2>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                Total: 80
              </span>
            </div>

            {/* Filtros de Navegação */}
            <div className="flex flex-wrap gap-1 mb-3">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  activeFilter === 'all' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Todas (80)
              </button>
              <button
                onClick={() => setActiveFilter('theory')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  activeFilter === 'theory' ? 'bg-indigo-500 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Teoria (1-60)
              </button>
              <button
                onClick={() => setActiveFilter('practical')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  activeFilter === 'practical' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Prática (61-80)
              </button>
              <button
                onClick={() => setActiveFilter('pending')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  activeFilter === 'pending' ? 'bg-rose-500 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Pendentes ({80 - totalAnswered})
              </button>
            </div>

            {/* Grade com os 80 botões de questão */}
            <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-5 gap-1.5 auto-rows-max">
              {filteredQuestions.map((q) => {
                const originalIndex = exam.questions.findIndex(item => item.id === q.id);
                const isAnswered = answers[q.id] !== undefined && answers[q.id] !== '';
                const isCurrent = originalIndex === currentIndex;

                return (
                  <button
                    key={q.id}
                    id={`btn-nav-question-${q.number}`}
                    onClick={() => {
                      setCurrentIndex(originalIndex);
                      setShowHint(false);
                      setPracticeTestStatus('idle');
                    }}
                    className={`h-9 rounded-lg text-xs font-mono font-bold flex items-center justify-center transition-all relative ${
                      isCurrent
                        ? 'ring-2 ring-amber-400 bg-amber-500/20 text-amber-300 scale-105 z-10'
                        : isAnswered
                        ? 'bg-emerald-950/70 border border-emerald-500/60 text-emerald-300 hover:bg-emerald-900/80'
                        : 'bg-slate-800/80 border border-slate-700/60 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                    }`}
                    title={`Questão ${q.number} (${q.type === 'theory' ? 'Teoria' : 'Prática'})`}
                  >
                    <span>{q.number}</span>
                    {q.type === 'practical' && (
                      <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    )}
                    {isAnswered && (
                      <Check className="w-2.5 h-2.5 absolute bottom-0.5 right-0.5 text-emerald-400" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legenda */}
            <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center space-x-1">
                <div className="w-2.5 h-2.5 rounded bg-emerald-500" />
                <span>Respondida</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2.5 h-2.5 rounded bg-slate-700" />
                <span>Pendente</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Prática</span>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna Direita: Questão Ativa (Teoria ou Prática) */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          {currentQuestion && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col min-h-[500px]">
              
              {/* Header da Questão */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-800">
                <div className="flex items-center space-x-3">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-slate-800 border border-slate-700 text-amber-400">
                    Questão {currentQuestion.number} de 80
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    currentQuestion.type === 'theory' ? 'bg-indigo-950 border border-indigo-700 text-indigo-300' : 'bg-emerald-950 border border-emerald-700 text-emerald-300'
                  }`}>
                    {currentQuestion.type === 'theory' ? '📖 Item Teórico' : '⚡ Desafio Prático'}
                  </span>
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  Peso: <span className="text-slate-200 font-semibold">0.25 val</span> (Total: 20 val)
                </div>
              </div>

              {/* Tópico & Enunciado */}
              <div className="mt-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span>{currentQuestion.topic}</span>
                </div>
                <div className="text-base sm:text-lg font-medium text-slate-100 leading-relaxed whitespace-pre-line">
                  {currentQuestion.question}
                </div>
              </div>

              {/* ÁREA DE RESPOSTA TEÓRICA (4 Opções de Múltipla Escolha) */}
              {currentQuestion.type === 'theory' && currentQuestion.options && (
                <div className="mt-6 space-y-3 flex-1">
                  {currentQuestion.options.map((opt, optIdx) => {
                    const isSelected = answers[currentQuestion.id] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        id={`btn-option-${currentQuestion.number}-${optIdx}`}
                        onClick={() => handleSelectTheoryAnswer(optIdx)}
                        className={`w-full text-left p-4 rounded-xl border transition-all flex items-start space-x-3 ${
                          isSelected
                            ? 'bg-amber-500/15 border-amber-500 text-amber-100 shadow-md shadow-amber-950/30'
                            : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 mt-0.5 ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-slate-700 text-slate-300'
                        }`}>
                          {String.fromCharCode(65 + optIdx)}
                        </div>
                        <span className="text-sm sm:text-base leading-relaxed">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* ÁREA DE RESPOSTA PRÁTICA (Editor de Código e Validação) */}
              {currentQuestion.type === 'practical' && (
                <div className="mt-6 space-y-3 flex-1 flex flex-col">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center space-x-2">
                      <Code2 className="w-4 h-4 text-emerald-400" />
                      <span className="font-semibold text-slate-300">Editor de Código de Produção:</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleResetCode}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 transition-colors"
                        title="Restaurar código inicial do exercício"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Restaurar Template</span>
                      </button>
                    </div>
                  </div>

                  {/* Campo de Código Monospaced */}
                  <div className="relative flex-1 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 font-mono text-sm shadow-inner flex flex-col">
                    <div className="bg-slate-900 px-3 py-1.5 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
                      <span>{tech.name} Snippet • UTF-8</span>
                      <span>Linhas: {((answers[currentQuestion.id] as string) || currentQuestion.initialCode || '').split('\n').length}</span>
                    </div>
                    <textarea
                      id={`textarea-code-${currentQuestion.number}`}
                      value={(answers[currentQuestion.id] as string) !== undefined ? (answers[currentQuestion.id] as string) : (currentQuestion.initialCode || '')}
                      onChange={(e) => handleCodeChange(e.target.value)}
                      rows={10}
                      className="w-full flex-1 p-3 bg-transparent text-emerald-300 focus:outline-none resize-none font-mono text-sm leading-relaxed"
                      placeholder="// Digite ou complete o código solicitado aqui..."
                      spellCheck={false}
                    />
                  </div>

                  {/* Validação de Sintaxe & Teste Rápido */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                    <button
                      onClick={handleValidatePracticeCode}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-colors"
                    >
                      <Play className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Testar Validação de Conformidade</span>
                    </button>

                    {practiceTestStatus === 'valid' && (
                      <div className="flex items-center space-x-1.5 text-xs text-emerald-400 font-semibold bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-800">
                        <Check className="w-4 h-4" />
                        <span>Estrutura e palavras-chave de código detectadas com sucesso!</span>
                      </div>
                    )}

                    {practiceTestStatus === 'invalid' && (
                      <div className="flex items-center space-x-1.5 text-xs text-rose-400 font-semibold bg-rose-950/60 px-3 py-1.5 rounded-lg border border-rose-800">
                        <X className="w-4 h-4" />
                        <span>Código incompleto ou faltando elementos essenciais da rotina.</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Botão de Dica Rigorosa */}
              {currentQuestion.hint && (
                <div className="mt-4">
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="text-xs text-slate-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>{showHint ? 'Ocultar Diretriz Técnica' : 'Consultar Diretriz Técnica do Item'}</span>
                  </button>
                  {showHint && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-2 p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300 leading-relaxed"
                    >
                      💡 <span className="font-semibold text-amber-400">Diretriz:</span> {currentQuestion.hint}
                    </motion.div>
                  )}
                </div>
              )}

              {/* Footer da Questão: Botões Anterior / Próxima */}
              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  id="btn-prev-question"
                  onClick={() => {
                    if (currentIndex > 0) {
                      setCurrentIndex(currentIndex - 1);
                      setShowHint(false);
                      setPracticeTestStatus('idle');
                    }
                  }}
                  disabled={currentIndex === 0}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Anterior</span>
                </button>

                <div className="text-xs text-slate-400 font-mono">
                  {isCurrentAnswered ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Respondida
                    </span>
                  ) : (
                    <span className="text-amber-400 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> Resposta Pendente
                    </span>
                  )}
                </div>

                <button
                  id="btn-next-question"
                  onClick={() => {
                    if (currentIndex < exam.totalQuestions - 1) {
                      setCurrentIndex(currentIndex + 1);
                      setShowHint(false);
                      setPracticeTestStatus('idle');
                    }
                  }}
                  disabled={currentIndex === exam.totalQuestions - 1}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <span>Próxima</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal de Confirmação de Submissão */}
      <AnimatePresence>
        {showSubmitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center space-x-3 text-amber-400">
                <FileCheck className="w-7 h-7" />
                <h3 className="text-lg font-bold text-slate-100">Submeter Exame Oficial de Passagem</h3>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span>Total de Questões Respondidas:</span>
                  <span className="font-bold text-amber-400">{totalAnswered} de 80</span>
                </div>
                <div className="flex justify-between">
                  <span>Questões Teóricas:</span>
                  <span className="font-bold text-slate-200">60 itens</span>
                </div>
                <div className="flex justify-between">
                  <span>Exercícios Práticos de Código:</span>
                  <span className="font-bold text-slate-200">20 itens</span>
                </div>
                <div className="flex justify-between">
                  <span>Critério de Aprovação Exigido:</span>
                  <span className="font-bold text-emerald-400">Nota 20 / 20 Valores (100%)</span>
                </div>
                <div className="flex justify-between">
                  <span>Tempo Restante no Cronômetro:</span>
                  <span className="font-mono text-slate-200">{formatTime(timeRemaining)}</span>
                </div>
              </div>

              {totalAnswered < 80 && (
                <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-xs text-rose-300 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span>Atenção: Existem {80 - totalAnswered} questões não respondidas!</span>
                  </div>
                  <p>Como a aprovação exige nota máxima de 20 valores (80 acertos), submeter com questões pendentes resultará em reprovação.</p>
                </div>
              )}

              <div className="p-3 rounded-xl bg-indigo-950/60 border border-indigo-800 text-xs text-indigo-300 leading-relaxed">
                ℹ️ <span className="font-semibold">Período de Embargo:</span> Conforme as regras oficiais, após a submissão, a prova entra em processo de correção e auditoria estrita. As notas oficiais serão divulgadas após 30 minutos.
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                >
                  Continuar Respondendo
                </button>
                <button
                  id="btn-confirm-submit-exam"
                  onClick={handleManualSubmit}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition-all"
                >
                  Confirmar Submissão
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal de Confirmação de Saída */}
      <AnimatePresence>
        {showExitConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center space-x-3 text-rose-400">
                <ShieldAlert className="w-6 h-6" />
                <h3 className="text-base font-bold text-slate-100">Sair do Exame Cronometrado?</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Suas respostas preenchidas e o tempo restante estão salvos. Você poderá retomar este exame enquanto houver tempo hábil.
              </p>
              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  onClick={() => setShowExitConfirm(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Permanecer no Exame
                </button>
                <button
                  id="btn-confirm-exit-exam"
                  onClick={onExit}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                >
                  Sair para o Painel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
