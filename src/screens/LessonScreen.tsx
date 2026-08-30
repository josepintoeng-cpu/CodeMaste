import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  BookOpen,
  Code,
  Terminal,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  Sparkles,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Maximize2,
  Minimize2,
  X,
  Zap,
} from 'lucide-react';
import { Lesson } from '../types';
import { CodeBlock } from '../components/CodeBlock';
import { CodeEditor } from '../components/CodeEditor';
import { CodeSimulator } from '../components/CodeSimulator';
import { ConfettiEffect } from '../components/ConfettiEffect';
import { FooterStamp } from '../components/FooterStamp';
import { validationService } from '../services/validationService';
import { codeRunnerService, ExecutionResult } from '../services/codeRunnerService';
import { ExerciseOutputConsole } from '../components/ExerciseOutputConsole';
import { fadeInUp } from '../utils/animations';
import { useI18n } from '../i18n';

interface LessonScreenProps {
  lesson: Lesson;
  onBack: () => void;
  onComplete: (xpReward: number) => void;
  onNextLesson?: () => void;
}

export const LessonScreen: React.FC<LessonScreenProps> = ({
  lesson,
  onBack,
  onComplete,
  onNextLesson,
}) => {
  const { t } = useI18n();
  const [userAnswer, setUserAnswer] = useState<string>(
    lesson.exercise.initialCode || ''
  );

  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<{ isValid: boolean; message: string } | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Estado de Compilação & Execução do Exercício
  const [exerciseResult, setExerciseResult] = useState<ExecutionResult | null>(null);
  const [isExerciseRunning, setIsExerciseRunning] = useState(false);

  // Estado do Modo Zen (Distraction-Free Focus Mode)
  const [isZenMode, setIsZenMode] = useState(false);
  const [showZenTheory, setShowZenTheory] = useState(false);

  // Escuta tecla ESC para sair do Modo Zen
  useEffect(() => {
    if (!isZenMode) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showZenTheory) {
          setShowZenTheory(false);
        } else {
          setIsZenMode(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isZenMode, showZenTheory]);

  // Extração inteligente de palavras-chave esperadas para feedback de validação em tempo real
  const expectedKeywords = useMemo(() => {
    if (!lesson.exercise.correctAnswer) return [];
    const ans = lesson.exercise.correctAnswer;
    if (ans.startsWith('REGEX:')) return [];
    if (ans.includes('|')) {
      return ans.split('|').map(s => s.trim()).filter(Boolean);
    }
    const tokens = ans.match(/[a-zA-Z_$#][a-zA-Z0-9_$#-]*|[=><!+*/]{1,3}/g) || [];
    const unique = Array.from(new Set<string>(tokens)).filter((tk: string) => tk.length >= 2 && !['para', 'com', 'que', 'uma', 'como'].includes(tk.toLowerCase()));
    return unique.slice(0, 4);
  }, [lesson.exercise.correctAnswer]);

  const exerciseLanguage = useMemo(() => {
    return lesson.codeExample?.language || lesson.techId || 'javascript';
  }, [lesson.codeExample?.language, lesson.techId]);

  const handleCheckAnswer = async () => {
    setIsValidating(true);
    setIsExerciseRunning(true);
    setAttempts(prev => prev + 1);

    let actualOutput = '';
    let execRes: ExecutionResult | null = null;

    try {
      const codeToRun = userAnswer.trim() || lesson.exercise.initialCode || '';
      execRes = await codeRunnerService.runCode(
        codeToRun,
        lesson.simulation,
        exerciseLanguage
      );
      if (execRes) {
        if (!execRes.error && execRes.output) {
          actualOutput = execRes.output;
        }
        setExerciseResult(execRes);
      }
    } catch (err: any) {
      execRes = {
        output: '',
        error: err?.message || 'Erro durante a execução do código.',
        isSimulated: false,
      };
      setExerciseResult(execRes);
    } finally {
      setIsExerciseRunning(false);
    }

    const result = validationService.validateExercise(
      lesson.exercise,
      userAnswer,
      actualOutput,
      exerciseLanguage
    );

    setFeedback({ isValid: result.isValid, message: result.message });
    setIsValidating(false);

    if (result.isValid) {
      setIsCompleted(true);
      setShowConfetti(true);
      onComplete(lesson.xpReward);
    }
  };

  const handleReRunExercise = async () => {
    if (!userAnswer) return;
    setIsExerciseRunning(true);
    try {
      const res = await codeRunnerService.runCode(
        userAnswer,
        lesson.simulation,
        exerciseLanguage
      );
      setExerciseResult(res);
    } finally {
      setIsExerciseRunning(false);
    }
  };

  return (
    <div className="relative pb-28 pt-4 px-3.5 sm:px-6 md:px-8 max-w-7xl mx-auto space-y-6">
      <ConfettiEffect
        show={showConfetti}
        xpEarned={lesson.xpReward}
        title={t('lesson.confettiTitle')}
        subtitle={t('lesson.confettiSubtitle', { title: lesson.title })}
        onClose={() => setShowConfetti(false)}
      />

      {/* Top Header com Botão do Modo Zen */}
      <motion.div variants={fadeInUp} initial="initial" animate="animate" className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <button
            onClick={onBack}
            className="p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-orange-500/40 transition-colors min-w-[42px] min-h-[42px] flex items-center justify-center touch-btn shadow-sm shrink-0"
            title={t('nav.back')}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[9px] sm:text-[10px] uppercase font-black text-orange-500 tracking-widest bg-orange-500/10 px-2.5 py-0.5 rounded-md border border-orange-500/20">
                {lesson.techId.toUpperCase()} • {lesson.levelId}
              </span>
              {lesson.order === 1 && lesson.levelId === 'iniciante' && (
                <span className="text-[9px] sm:text-[10px] uppercase font-black text-emerald-400 tracking-widest bg-emerald-500/15 px-2.5 py-0.5 rounded-md border border-emerald-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  <span>Aula Inaugural • Primeiro Contato</span>
                </span>
              )}
            </div>
            <h2 className="text-base sm:text-xl font-bold text-[var(--text-primary)] truncate mt-1 tracking-tight">
              {lesson.title}
            </h2>
          </div>
        </div>

        {/* Botão de Ativação do Modo Zen */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsZenMode(true)}
          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-orange-500/15 hover:bg-orange-500/25 active:bg-orange-500/35 text-orange-400 border border-orange-500/35 text-xs font-bold transition-all touch-btn shadow-sm group shrink-0"
          title={t('lesson.zenModeDesc')}
        >
          <Sparkles className="w-4 h-4 text-orange-400 group-hover:rotate-12 transition-transform" />
          <span className="font-extrabold tracking-wide uppercase text-[11px] sm:text-xs">
            {t('lesson.zenMode')}
          </span>
          <Maximize2 className="w-3.5 h-3.5 opacity-70 hidden xs:inline" />
        </motion.button>
      </motion.div>

      {/* MODO ZEN (DISTRACTION-FREE FULLSCREEN OVERLAY) */}
      <AnimatePresence>
        {isZenMode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 overflow-y-auto bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col justify-between"
          >
            {/* Zen Mode Navigation Bar */}
            <div className="sticky top-0 z-20 backdrop-blur-xl bg-[var(--bg-primary)]/90 border-b border-[var(--border-subtle)] px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsZenMode(false)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-orange-500/40 text-[var(--text-muted)] hover:text-[var(--text-primary)] text-xs font-bold transition-colors touch-btn"
                  title={t('lesson.exitZenMode')}
                >
                  <Minimize2 className="w-4 h-4 text-orange-400" />
                  <span className="hidden sm:inline font-extrabold">{t('lesson.exitZenMode')}</span>
                  <span className="text-[10px] text-[var(--text-muted)] px-1 py-0.5 rounded bg-black/40 border border-white/10 font-mono">
                    ESC
                  </span>
                </button>

                <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-black uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t('lesson.zenModeTitle')}</span>
                </div>
              </div>

              {/* Central Title */}
              <div className="text-center truncate max-w-md hidden sm:block">
                <div className="text-[10px] font-mono uppercase text-orange-400 tracking-wider">
                  {lesson.techId.toUpperCase()} • +{lesson.xpReward} XP
                </div>
                <div className="text-sm font-bold text-[var(--text-primary)] truncate">
                  {lesson.title}
                </div>
              </div>

              {/* Right Controls: Theory Drawer Toggle & Hint */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowZenTheory(!showZenTheory)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors touch-btn ${
                    showZenTheory
                      ? 'bg-orange-500/20 border-orange-500 text-orange-300'
                      : 'bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-orange-400" />
                  <span className="hidden sm:inline">
                    {showZenTheory ? t('lesson.zenHideTheory') : t('lesson.zenToggleTheory')}
                  </span>
                </button>
              </div>
            </div>

            {/* Zen Main Content Container */}
            <div className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-6 space-y-5">
              {/* Exercise Card with Maximum Legibility */}
              <div className="bg-[var(--bg-card)] rounded-2xl p-4 sm:p-6 border border-orange-500/30 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-orange-500 font-bold text-xs uppercase tracking-widest">
                    <HelpCircle className="w-4 h-4" />
                    <span>{t('lesson.section4Exercise')}</span>
                  </div>

                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="flex items-center gap-1 text-xs font-bold text-orange-400 hover:underline uppercase tracking-wider"
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>{showHint ? t('lesson.hideHint') : t('lesson.showHint')}</span>
                  </button>
                </div>

                <p className="text-sm sm:text-base font-bold text-[var(--text-primary)] leading-relaxed">
                  {lesson.exercise.prompt}
                </p>

                {showHint && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-orange-500/10 border border-orange-500/30 p-3.5 rounded-xl text-orange-300 text-xs sm:text-sm"
                  >
                    💡 <strong>{t('lesson.hint')}:</strong> {lesson.exercise.hint}
                  </motion.div>
                )}
              </div>

              {/* Code Editor Section */}
              <div className="bg-[var(--bg-card)] rounded-2xl p-4 sm:p-6 border border-[var(--border-subtle)] shadow-xl space-y-4">
                <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-bold uppercase tracking-wider">
                  <span className="flex items-center gap-2 text-orange-400">
                    <Code className="w-4 h-4" />
                    {t('lesson.section5Answer')}
                  </span>
                  <span className="font-mono text-[10px] text-white/50 bg-black/40 px-2 py-0.5 rounded">
                    {exerciseLanguage.toUpperCase()}
                  </span>
                </div>

                {lesson.exercise.type === 'multiple_choice' ? (
                  <div className="space-y-2.5">
                    {lesson.exercise.options?.map((opt, oIdx) => (
                      <button
                        key={oIdx}
                        onClick={() => setUserAnswer(opt)}
                        className={`w-full p-4 rounded-xl border text-left text-sm font-medium transition-all min-h-[48px] touch-btn ${
                          userAnswer === opt
                            ? 'bg-orange-500/20 border-orange-500 text-orange-300 font-bold ring-1 ring-orange-500'
                            : 'bg-black/40 border-white/10 text-white/70 hover:border-white/20'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                ) : (
                  <CodeEditor
                    value={userAnswer}
                    onChange={val => setUserAnswer(val)}
                    placeholder={t('lesson.editorPlaceholder')}
                    language={exerciseLanguage}
                    initialCode={lesson.exercise.initialCode}
                    expectedKeywords={expectedKeywords}
                    expectedAnswer={lesson.exercise.correctAnswer}
                    disabled={isCompleted}
                  />
                )}

                {/* Validation and Action Button */}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckAnswer}
                  disabled={isCompleted || isValidating}
                  className="w-full py-4 bg-orange-500 hover:bg-orange-400 active:bg-orange-600 disabled:opacity-60 text-black font-black text-sm uppercase tracking-wider rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2 min-h-[50px] touch-btn"
                >
                  {isValidating || isExerciseRunning ? (
                    <>
                      <RefreshCw className="w-4 h-4 text-black animate-spin" />
                      <span>{t('lesson.checking')}</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-black" />
                      <span>{isCompleted ? t('lesson.lessonCompleted') : t('lesson.checkAnswer')}</span>
                    </>
                  )}
                </motion.button>

                {/* Console de Compilação e Execução do Exercício (Modo Zen) */}
                <ExerciseOutputConsole
                  codeOrCommand={userAnswer}
                  result={exerciseResult}
                  isLoading={isExerciseRunning}
                  language={exerciseLanguage}
                  simulationType={lesson.simulation?.type}
                  onReRun={handleReRunExercise}
                />
              </div>

              {/* Feedback and Progress */}
              {feedback && (
                <motion.section
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 sm:p-6 rounded-2xl border space-y-3 ${
                    feedback.isValid
                      ? 'bg-[var(--bg-card)] border-orange-500 text-orange-300 shadow-xl'
                      : 'bg-red-950/40 border-red-500/50 text-red-200'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-sm uppercase tracking-wider">
                    {feedback.isValid ? (
                      <>
                        <Sparkles className="w-4 h-4 text-orange-400" />
                        <span>{t('lesson.correctAnswer', { xp: lesson.xpReward })}</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-red-400" />
                        <span>{t('lesson.tryAgain', { attempts })}</span>
                      </>
                    )}
                  </div>

                  <p className="text-sm leading-relaxed">{feedback.message}</p>

                  {!feedback.isValid && attempts >= 2 && (
                    <div className="bg-black p-4 rounded-xl border border-red-500/30 text-sm text-white/80 space-y-1">
                      <span className="font-bold text-orange-400 block uppercase tracking-wider text-xs">
                        {t('lesson.recommendedSolution')}
                      </span>
                      <pre className="font-mono text-orange-300 bg-[var(--bg-card)] p-3 rounded-lg text-sm overflow-x-auto border border-white/10">
                        {lesson.exercise.correctAnswer}
                      </pre>
                      <p className="text-xs text-[var(--text-muted)] mt-1">
                        {lesson.exercise.explanation}
                      </p>
                    </div>
                  )}

                  {feedback.isValid && (
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setIsZenMode(false);
                        if (onNextLesson) onNextLesson();
                        else onBack();
                      }}
                      className="w-full py-4 bg-white hover:bg-white/90 text-black font-extrabold text-sm uppercase tracking-wider rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2 mt-2 min-h-[48px] touch-btn"
                    >
                      <span>{t('lesson.nextLesson')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  )}
                </motion.section>
              )}
            </div>

            {/* Zen Mode Side Theory Drawer / Overlay */}
            <AnimatePresence>
              {showZenTheory && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end"
                  onClick={() => setShowZenTheory(false)}
                >
                  <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="w-full max-w-lg bg-[var(--bg-primary)] border-l border-[var(--border-subtle)] h-full overflow-y-auto p-5 sm:p-6 space-y-5 shadow-2xl"
                    onClick={e => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                      <div className="flex items-center gap-2 text-orange-500 font-bold text-xs uppercase tracking-wider">
                        <BookOpen className="w-4 h-4" />
                        <span>{t('lesson.section1Theory')}</span>
                      </div>
                      <button
                        onClick={() => setShowZenTheory(false)}
                        className="p-2 rounded-xl bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {lesson.theory.map((item, idx) => (
                      <div key={idx} className="space-y-2 text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed">
                        {item.title && (
                          <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)] tracking-tight">{item.title}</h3>
                        )}
                        <p className="text-[var(--text-muted)]">{item.text}</p>

                        {item.keyPoints && item.keyPoints.length > 0 && (
                          <ul className="list-disc list-inside space-y-1 bg-black/40 p-3.5 rounded-xl border border-white/5 text-[var(--text-muted)] text-xs sm:text-sm">
                            {item.keyPoints.map((point, pIdx) => (
                              <li key={pIdx}>{point}</li>
                            ))}
                          </ul>
                        )}

                        {item.conceptCard && (
                          <div className="bg-orange-500/10 border border-orange-500/30 p-3.5 rounded-xl text-orange-300 text-xs sm:text-sm font-medium">
                            {item.conceptCard}
                          </div>
                        )}
                      </div>
                    ))}

                    <div className="space-y-3 pt-3 border-t border-[var(--border-subtle)]">
                      <div className="flex items-center gap-2 text-orange-500 font-bold text-xs uppercase tracking-wider">
                        <Code className="w-4 h-4" />
                        <span>{t('lesson.section2Code')}</span>
                      </div>
                      <CodeBlock
                        code={lesson.codeExample.code}
                        language={lesson.codeExample.language}
                      />
                      <p className="text-xs text-[var(--text-muted)] italic bg-black/40 p-3 rounded-xl border border-white/5 leading-relaxed">
                        💡 {lesson.codeExample.explanation}
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Standard Studio Layout: Left (Theory & Example) + Right (Simulation, Editor & Feedback) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        {/* Left Column */}
        <div className="lg:col-span-6 space-y-5">
          {/* SEÇÃO 1: TEORIA */}
          <motion.section variants={fadeInUp} initial="initial" animate="animate" className="bg-[var(--bg-card)] rounded-2xl p-4 sm:p-5 border border-[var(--border-subtle)] space-y-3 shadow-md">
            <div className="flex items-center gap-2 text-orange-500 font-bold text-[10px] sm:text-xs uppercase tracking-widest">
              <BookOpen className="w-4 h-4" />
              <span>{t('lesson.section1Theory')}</span>
            </div>

            {lesson.theory.map((item, idx) => (
              <div key={idx} className="space-y-2 text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed">
                {item.title && (
                  <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)] tracking-tight">{item.title}</h3>
                )}
                <p className="text-[var(--text-muted)]">{item.text}</p>

                {item.keyPoints && item.keyPoints.length > 0 && (
                  <ul className="list-disc list-inside space-y-1 bg-black/40 p-3.5 rounded-xl border border-white/5 text-[var(--text-muted)] text-xs sm:text-sm">
                    {item.keyPoints.map((point, pIdx) => (
                      <li key={pIdx}>{point}</li>
                    ))}
                  </ul>
                )}

                {item.conceptCard && (
                  <div className="bg-orange-500/10 border border-orange-500/30 p-3.5 rounded-xl text-orange-300 text-xs sm:text-sm font-medium">
                    {item.conceptCard}
                  </div>
                )}
              </div>
            ))}
          </motion.section>

          {/* SEÇÃO 2: EXEMPLO DE CÓDIGO COMENTADO */}
          <motion.section variants={fadeInUp} initial="initial" animate="animate" className="bg-[var(--bg-card)] rounded-2xl p-4 sm:p-5 border border-[var(--border-subtle)] space-y-3 shadow-md">
            <div className="flex items-center gap-2 text-orange-500 font-bold text-[10px] sm:text-xs uppercase tracking-widest">
              <Code className="w-4 h-4" />
              <span>{t('lesson.section2Code')}</span>
            </div>

            <CodeBlock
              code={lesson.codeExample.code}
              language={lesson.codeExample.language}
            />

            <p className="text-[11px] sm:text-xs text-[var(--text-muted)] italic bg-black/40 p-3 rounded-xl border border-white/5 leading-relaxed">
              💡 {lesson.codeExample.explanation}
            </p>
          </motion.section>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-6 space-y-5">
          {/* SEÇÃO 3: EXECUÇÃO E SIMULAÇÃO */}
          <motion.section variants={fadeInUp} initial="initial" animate="animate" className="bg-[var(--bg-card)] rounded-2xl p-4 sm:p-5 border border-[var(--border-subtle)] space-y-3 shadow-md">
            <div className="flex items-center gap-2 text-orange-500 font-bold text-[10px] sm:text-xs uppercase tracking-widest">
              <Terminal className="w-4 h-4" />
              <span>{t('lesson.section3Simulation')}</span>
            </div>

            <CodeSimulator
              code={lesson.codeExample.code}
              simulation={lesson.simulation}
              language={lesson.codeExample.language}
            />
          </motion.section>

          {/* SEÇÃO 4: EXERCÍCIO PRÁTICO REAL */}
          <motion.section variants={fadeInUp} initial="initial" animate="animate" className="bg-[var(--bg-card)] rounded-2xl p-4 sm:p-5 border border-[var(--border-subtle)] space-y-4 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-orange-500 font-bold text-[10px] sm:text-xs uppercase tracking-widest">
                <HelpCircle className="w-4 h-4" />
                <span>{t('lesson.section4Exercise')}</span>
              </div>

              <button
                onClick={() => setShowHint(!showHint)}
                className="flex items-center gap-1 text-[10px] sm:text-xs font-bold text-orange-400 hover:underline uppercase tracking-wider min-h-[32px] touch-btn"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>{showHint ? t('lesson.hideHint') : t('lesson.showHint')}</span>
              </button>
            </div>

            <p className="text-xs sm:text-sm font-semibold text-[var(--text-primary)] leading-snug">
              {lesson.exercise.prompt}
            </p>

            {showHint && (
              <div className="bg-orange-500/10 border border-orange-500/30 p-3.5 rounded-xl text-orange-300 text-xs sm:text-sm">
                💡 <strong>{t('lesson.hint')}:</strong> {lesson.exercise.hint}
              </div>
            )}

            {/* SEÇÃO 5: CORREÇÃO AUTOMÁTICA / CAMPO DE RESPOSTA */}
            <div className="pt-2 border-t border-[var(--border-subtle)] space-y-3">
              <div className="text-[10px] sm:text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">
                {t('lesson.section5Answer')}
              </div>

              {lesson.exercise.type === 'multiple_choice' ? (
                <div className="space-y-2">
                  {lesson.exercise.options?.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      onClick={() => setUserAnswer(opt)}
                      className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all min-h-[44px] touch-btn ${
                        userAnswer === opt
                          ? 'bg-orange-500/20 border-orange-500 text-orange-300 font-bold'
                          : 'bg-black/40 border-white/10 text-white/70 hover:border-white/20'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              ) : (
                <CodeEditor
                  value={userAnswer}
                  onChange={val => setUserAnswer(val)}
                  placeholder={t('lesson.editorPlaceholder')}
                  language={exerciseLanguage}
                  initialCode={lesson.exercise.initialCode}
                  expectedKeywords={expectedKeywords}
                  expectedAnswer={lesson.exercise.correctAnswer}
                  disabled={isCompleted}
                />
              )}

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleCheckAnswer}
                disabled={isCompleted || isValidating}
                className="w-full py-3.5 bg-orange-500 hover:bg-orange-400 active:bg-orange-600 disabled:opacity-60 text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-colors shadow-md flex items-center justify-center gap-2 min-h-[48px] touch-btn"
              >
                {isValidating || isExerciseRunning ? (
                  <>
                    <RefreshCw className="w-4 h-4 text-black animate-spin" />
                    <span>{t('lesson.checking') || 'Verificando...'}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-black" />
                    <span>{isCompleted ? t('lesson.lessonCompleted') : t('lesson.checkAnswer')}</span>
                  </>
                )}
              </motion.button>

              {/* Console de Compilação e Execução do Exercício */}
              <ExerciseOutputConsole
                codeOrCommand={userAnswer}
                result={exerciseResult}
                isLoading={isExerciseRunning}
                language={exerciseLanguage}
                simulationType={lesson.simulation?.type}
                onReRun={handleReRunExercise}
              />
            </div>
          </motion.section>

          {/* SEÇÃO 6: FEEDBACK IMEDIATO */}
          {feedback && (
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 sm:p-5 rounded-2xl border space-y-3 ${
                feedback.isValid
                  ? 'bg-[var(--bg-card)] border-orange-500 text-orange-300'
                  : 'bg-red-950/40 border-red-500/50 text-red-200'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-xs sm:text-sm uppercase tracking-wider">
                {feedback.isValid ? (
                  <>
                    <Sparkles className="w-4 h-4 text-orange-400" />
                    <span>{t('lesson.correctAnswer', { xp: lesson.xpReward })}</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span>{t('lesson.tryAgain', { attempts })}</span>
                  </>
                )}
              </div>

              <p className="text-xs sm:text-sm leading-relaxed">{feedback.message}</p>

              {/* Solução comentada liberada na 2ª tentativa incorreta */}
              {!feedback.isValid && attempts >= 2 && (
                <div className="bg-black p-3.5 rounded-xl border border-red-500/30 text-xs sm:text-sm text-white/80 space-y-1">
                  <span className="font-bold text-orange-400 block uppercase tracking-wider text-[10px] sm:text-xs">
                    {t('lesson.recommendedSolution')}
                  </span>
                  <pre className="font-mono text-orange-300 bg-[var(--bg-card)] p-2.5 rounded-lg text-xs sm:text-sm overflow-x-auto border border-white/10">
                    {lesson.exercise.correctAnswer}
                  </pre>
                  <p className="text-[10px] sm:text-xs text-[var(--text-muted)] mt-1">
                    {lesson.exercise.explanation}
                  </p>
                </div>
              )}

              {feedback.isValid && (
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={onNextLesson || onBack}
                  className="w-full py-3.5 bg-white hover:bg-white/90 text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2 mt-2 min-h-[44px] touch-btn"
                >
                  <span>{t('lesson.nextLesson')}</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              )}
            </motion.section>
          )}
        </div>
      </div>

      <FooterStamp />
    </div>
  );
};



