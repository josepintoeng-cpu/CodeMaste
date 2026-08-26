import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, BookOpen, Code, Terminal, CheckCircle2, HelpCircle, Lightbulb, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import { Lesson } from '../types';
import { CodeBlock } from '../components/CodeBlock';
import { CodeEditor } from '../components/CodeEditor';
import { CodeSimulator } from '../components/CodeSimulator';
import { ConfettiEffect } from '../components/ConfettiEffect';
import { FooterStamp } from '../components/FooterStamp';
import { validationService } from '../services/validationService';
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
  const { t, language } = useI18n();
  const [userAnswer, setUserAnswer] = useState<string>(
    lesson.exercise.initialCode || ''
  );

  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<{ isValid: boolean; message: string } | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Extração inteligente de palavras-chave esperadas para feedback de validação em tempo real
  const expectedKeywords = useMemo(() => {
    if (!lesson.exercise.correctAnswer) return [];
    const ans = lesson.exercise.correctAnswer;
    if (ans.startsWith('REGEX:')) return [];
    if (ans.includes('|')) {
      return ans.split('|').map(s => s.trim()).filter(Boolean);
    }
    const tokens = ans.match(/[a-zA-Z_$#][a-zA-Z0-9_$#-]*|[=><!+*/]{1,3}/g) || [];
    const unique = Array.from(new Set<string>(tokens)).filter((t: string) => t.length >= 2 && !['para', 'com', 'que', 'uma', 'como'].includes(t.toLowerCase()));
    return unique.slice(0, 4);
  }, [lesson.exercise.correctAnswer]);

  const exerciseLanguage = useMemo(() => {
    return lesson.codeExample?.language || lesson.techId || 'javascript';
  }, [lesson.codeExample?.language, lesson.techId]);

  const handleCheckAnswer = () => {
    setAttempts(prev => prev + 1);

    const result = validationService.validateExercise(
      lesson.exercise,
      userAnswer,
      ''
    );

    setFeedback({ isValid: result.isValid, message: result.message });

    if (result.isValid) {
      setIsCompleted(true);
      setShowConfetti(true);
      onComplete(lesson.xpReward);
    }
  };

  return (
    <div className="pb-28 pt-4 px-4 max-w-md md:max-w-2xl mx-auto space-y-5">
      <ConfettiEffect
        show={showConfetti}
        xpEarned={lesson.xpReward}
        title={t('lesson.confettiTitle')}
        subtitle={t('lesson.confettiSubtitle', { title: lesson.title })}
        onClose={() => setShowConfetti(false)}
      />

      {/* Top Header */}
      <motion.div variants={fadeInUp} initial="initial" animate="animate" className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors min-w-[42px] min-h-[42px] flex items-center justify-center touch-btn"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[9px] uppercase font-bold text-orange-500 tracking-widest bg-orange-500/10 px-2 py-0.5 rounded-md border border-orange-500/20">
              {lesson.techId.toUpperCase()} • {lesson.levelId}
            </span>
          </div>
          <h2 className="text-base font-bold text-[var(--text-primary)] truncate mt-1 tracking-tight">
            {lesson.title}
          </h2>
        </div>
      </motion.div>

      {/* SEÇÃO 1: TEORIA */}
      <motion.section variants={fadeInUp} initial="initial" animate="animate" className="bg-[var(--bg-card)] rounded-2xl p-4 border border-[var(--border-subtle)] space-y-3 shadow-md">
        <div className="flex items-center gap-2 text-orange-500 font-bold text-[10px] uppercase tracking-widest">
          <BookOpen className="w-3.5 h-3.5" />
          <span>{t('lesson.section1Theory')}</span>
        </div>

        {lesson.theory.map((item, idx) => (
          <div key={idx} className="space-y-2 text-xs text-[var(--text-primary)] leading-relaxed">
            {item.title && (
              <h3 className="text-sm font-bold text-[var(--text-primary)] tracking-tight">{item.title}</h3>
            )}
            <p className="text-[var(--text-muted)]">{item.text}</p>

            {item.keyPoints && item.keyPoints.length > 0 && (
              <ul className="list-disc list-inside space-y-1 bg-black/40 p-3 rounded-xl border border-white/5 text-[var(--text-muted)]">
                {item.keyPoints.map((point, pIdx) => (
                  <li key={pIdx}>{point}</li>
                ))}
              </ul>
            )}

            {item.conceptCard && (
              <div className="bg-orange-500/10 border border-orange-500/30 p-3 rounded-xl text-orange-300 text-xs font-medium">
                {item.conceptCard}
              </div>
            )}
          </div>
        ))}
      </motion.section>

      {/* SEÇÃO 2: EXEMPLO DE CÓDIGO COMENTADO */}
      <motion.section variants={fadeInUp} initial="initial" animate="animate" className="bg-[var(--bg-card)] rounded-2xl p-4 border border-[var(--border-subtle)] space-y-2.5 shadow-md">
        <div className="flex items-center gap-2 text-orange-500 font-bold text-[10px] uppercase tracking-widest">
          <Code className="w-3.5 h-3.5" />
          <span>{t('lesson.section2Code')}</span>
        </div>

        <CodeBlock
          code={lesson.codeExample.code}
          language={lesson.codeExample.language}
        />

        <p className="text-[11px] text-[var(--text-muted)] italic bg-black/40 p-2.5 rounded-xl border border-white/5 leading-relaxed">
          💡 {lesson.codeExample.explanation}
        </p>
      </motion.section>

      {/* SEÇÃO 3: EXECUÇÃO E SIMULAÇÃO */}
      <motion.section variants={fadeInUp} initial="initial" animate="animate" className="bg-[var(--bg-card)] rounded-2xl p-4 border border-[var(--border-subtle)] space-y-2.5 shadow-md">
        <div className="flex items-center gap-2 text-orange-500 font-bold text-[10px] uppercase tracking-widest">
          <Terminal className="w-3.5 h-3.5" />
          <span>{t('lesson.section3Simulation')}</span>
        </div>

        <CodeSimulator
          code={lesson.codeExample.code}
          simulation={lesson.simulation}
          language={lesson.codeExample.language}
        />
      </motion.section>

      {/* SEÇÃO 4: EXERCÍCIO PRÁTICO REAL */}
      <motion.section variants={fadeInUp} initial="initial" animate="animate" className="bg-[var(--bg-card)] rounded-2xl p-4 border border-[var(--border-subtle)] space-y-3.5 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-orange-500 font-bold text-[10px] uppercase tracking-widest">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{t('lesson.section4Exercise')}</span>
          </div>

          <button
            onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-1 text-[10px] font-bold text-orange-400 hover:underline uppercase tracking-wider min-h-[32px] touch-btn"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>{showHint ? t('lesson.hideHint') : t('lesson.showHint')}</span>
          </button>
        </div>

        <p className="text-xs sm:text-sm font-semibold text-[var(--text-primary)] leading-snug">
          {lesson.exercise.prompt}
        </p>

        {showHint && (
          <div className="bg-orange-500/10 border border-orange-500/30 p-3 rounded-xl text-orange-300 text-xs">
            💡 <strong>{t('lesson.hint')}:</strong> {lesson.exercise.hint}
          </div>
        )}

        {/* SEÇÃO 5: CORREÇÃO AUTOMÁTICA / CAMPO DE RESPOSTA */}
        <div className="pt-2 border-t border-[var(--border-subtle)] space-y-3">
          <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
            {t('lesson.section5Answer')}
          </div>

          {lesson.exercise.type === 'multiple_choice' ? (
            <div className="space-y-2">
              {lesson.exercise.options?.map((opt, oIdx) => (
                <button
                  key={oIdx}
                  onClick={() => setUserAnswer(opt)}
                  className={`w-full p-3 rounded-xl border text-left text-xs font-medium transition-all min-h-[44px] touch-btn ${
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
            disabled={isCompleted}
            className="w-full py-3 bg-orange-500 hover:bg-orange-400 active:bg-orange-600 disabled:opacity-60 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-md flex items-center justify-center gap-2 min-h-[48px] touch-btn"
          >
            <CheckCircle2 className="w-4 h-4 text-black" />
            <span>{isCompleted ? t('lesson.lessonCompleted') : t('lesson.checkAnswer')}</span>
          </motion.button>
        </div>
      </motion.section>

      {/* SEÇÃO 6: FEEDBACK IMEDIATO */}
      {feedback && (
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-2xl border space-y-3 ${
            feedback.isValid
              ? 'bg-[var(--bg-card)] border-orange-500 text-orange-300'
              : 'bg-red-950/40 border-red-500/50 text-red-200'
          }`}
        >
          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider">
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

          <p className="text-xs leading-relaxed">{feedback.message}</p>

          {/* Solução comentada liberada na 2ª tentativa incorreta */}
          {!feedback.isValid && attempts >= 2 && (
            <div className="bg-black p-3 rounded-xl border border-red-500/30 text-xs text-white/80 space-y-1">
              <span className="font-bold text-orange-400 block uppercase tracking-wider text-[10px]">
                {t('lesson.recommendedSolution')}
              </span>
              <pre className="font-mono text-orange-300 bg-[var(--bg-card)] p-2 rounded-lg text-xs overflow-x-auto border border-white/10">
                {lesson.exercise.correctAnswer}
              </pre>
              <p className="text-[10px] text-[var(--text-muted)] mt-1">
                {lesson.exercise.explanation}
              </p>
            </div>
          )}

          {feedback.isValid && (
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={onNextLesson || onBack}
              className="w-full py-3 bg-white hover:bg-white/90 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2 mt-2 min-h-[44px] touch-btn"
            >
              <span>{t('lesson.nextLesson')}</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          )}
        </motion.section>
      )}

      <FooterStamp />
    </div>
  );
};


