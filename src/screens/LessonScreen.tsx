import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Code, Terminal, CheckCircle2, HelpCircle, Lightbulb, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import { Lesson } from '../types';
import { CodeBlock } from '../components/CodeBlock';
import { CodeEditor } from '../components/CodeEditor';
import { CodeSimulator } from '../components/CodeSimulator';
import { ConfettiEffect } from '../components/ConfettiEffect';
import { FooterStamp } from '../components/FooterStamp';
import { validationService } from '../services/validationService';

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
  const [userAnswer, setUserAnswer] = useState<string>(
    lesson.exercise.initialCode || ''
  );

  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<{ isValid: boolean; message: string } | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

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
      <ConfettiEffect show={showConfetti} />

      {/* Top Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2.5 rounded-xl bg-[#1A1A1C] border border-white/10 text-white/70 hover:text-white transition-colors min-w-[42px] min-h-[42px] flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[9px] uppercase font-bold text-orange-500 tracking-widest bg-orange-500/10 px-2 py-0.5 rounded-md border border-orange-500/20">
              {lesson.techId.toUpperCase()} • {lesson.levelId}
            </span>
          </div>
          <h2 className="text-base font-bold text-white truncate mt-1 tracking-tight">
            {lesson.title}
          </h2>
        </div>
      </div>

      {/* SEÇÃO 1: TEORIA */}
      <section className="bg-[#1A1A1C] rounded-2xl p-4 border border-white/10 space-y-3 shadow-md">
        <div className="flex items-center gap-2 text-orange-500 font-bold text-[10px] uppercase tracking-widest">
          <BookOpen className="w-3.5 h-3.5" />
          <span>1. TEORIA E CONCEITO</span>
        </div>

        {lesson.theory.map((item, idx) => (
          <div key={idx} className="space-y-2 text-xs text-white/80 leading-relaxed">
            {item.title && (
              <h3 className="text-sm font-bold text-white tracking-tight">{item.title}</h3>
            )}
            <p>{item.text}</p>

            {item.keyPoints && item.keyPoints.length > 0 && (
              <ul className="list-disc list-inside space-y-1 bg-black/40 p-3 rounded-xl border border-white/5 text-white/80">
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
      </section>

      {/* SEÇÃO 2: EXEMPLO DE CÓDIGO COMENTADO */}
      <section className="bg-[#1A1A1C] rounded-2xl p-4 border border-white/10 space-y-2.5 shadow-md">
        <div className="flex items-center gap-2 text-orange-500 font-bold text-[10px] uppercase tracking-widest">
          <Code className="w-3.5 h-3.5" />
          <span>2. CÓDIGO COMENTADO</span>
        </div>

        <CodeBlock
          code={lesson.codeExample.code}
          language={lesson.codeExample.language}
        />

        <p className="text-[11px] text-white/60 italic bg-black/40 p-2.5 rounded-xl border border-white/5 leading-relaxed">
          💡 {lesson.codeExample.explanation}
        </p>
      </section>

      {/* SEÇÃO 3: EXECUÇÃO E SIMULAÇÃO */}
      <section className="bg-[#1A1A1C] rounded-2xl p-4 border border-white/10 space-y-2.5 shadow-md">
        <div className="flex items-center gap-2 text-orange-500 font-bold text-[10px] uppercase tracking-widest">
          <Terminal className="w-3.5 h-3.5" />
          <span>3. SIMULAÇÃO DE CÓDIGO</span>
        </div>

        <CodeSimulator
          code={lesson.codeExample.code}
          simulation={lesson.simulation}
          language={lesson.codeExample.language}
        />
      </section>

      {/* SEÇÃO 4: EXERCÍCIO PRÁTICO REAL */}
      <section className="bg-[#1A1A1C] rounded-2xl p-4 border border-white/10 space-y-3.5 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-orange-500 font-bold text-[10px] uppercase tracking-widest">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>4. EXERCÍCIO PRÁTICO</span>
          </div>

          <button
            onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-1 text-[10px] font-bold text-orange-400 hover:underline uppercase tracking-wider min-h-[32px]"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>{showHint ? 'Ocultar Dica' : 'Ver Dica'}</span>
          </button>
        </div>

        <p className="text-xs sm:text-sm font-semibold text-white leading-snug">
          {lesson.exercise.prompt}
        </p>

        {showHint && (
          <div className="bg-orange-500/10 border border-orange-500/30 p-3 rounded-xl text-orange-300 text-xs">
            💡 <strong>Dica:</strong> {lesson.exercise.hint}
          </div>
        )}

        {/* SEÇÃO 5: CORREÇÃO AUTOMÁTICA / CAMPO DE RESPOSTA */}
        <div className="pt-2 border-t border-white/10 space-y-3">
          <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
            5. SUA RESPOSTA:
          </div>

          {lesson.exercise.type === 'multiple_choice' ? (
            <div className="space-y-2">
              {lesson.exercise.options?.map((opt, oIdx) => (
                <button
                  key={oIdx}
                  onClick={() => setUserAnswer(opt)}
                  className={`w-full p-3 rounded-xl border text-left text-xs font-medium transition-all min-h-[44px] ${
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
              placeholder="Digite sua solução em código aqui..."
            />
          )}

          <button
            onClick={handleCheckAnswer}
            disabled={isCompleted}
            className="w-full py-3 bg-orange-500 hover:bg-orange-400 active:bg-orange-600 disabled:opacity-60 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 min-h-[48px]"
          >
            <CheckCircle2 className="w-4 h-4 text-black" />
            <span>{isCompleted ? 'Aula Concluída!' : 'Verificar Resposta'}</span>
          </button>
        </div>
      </section>

      {/* SEÇÃO 6: FEEDBACK IMEDIATO */}
      {feedback && (
        <section
          className={`p-4 rounded-2xl border space-y-3 animate-in fade-in duration-300 ${
            feedback.isValid
              ? 'bg-[#1A1A1C] border-orange-500 text-orange-300'
              : 'bg-red-950/40 border-red-500/50 text-red-200'
          }`}
        >
          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider">
            {feedback.isValid ? (
              <>
                <Sparkles className="w-4 h-4 text-orange-400" />
                <span>6. Resposta Correta (+{lesson.xpReward} XP)</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span>6. Tente Novamente (Tentativa {attempts})</span>
              </>
            )}
          </div>

          <p className="text-xs leading-relaxed">{feedback.message}</p>

          {/* Solução comentada liberada na 2ª tentativa incorreta */}
          {!feedback.isValid && attempts >= 2 && (
            <div className="bg-black p-3 rounded-xl border border-red-500/30 text-xs text-white/80 space-y-1">
              <span className="font-bold text-orange-400 block uppercase tracking-wider text-[10px]">
                Solução Recomendada:
              </span>
              <pre className="font-mono text-orange-300 bg-[#1A1A1C] p-2 rounded-lg text-xs overflow-x-auto border border-white/10">
                {lesson.exercise.correctAnswer}
              </pre>
              <p className="text-[10px] text-white/50 mt-1">
                {lesson.exercise.explanation}
              </p>
            </div>
          )}

          {feedback.isValid && (
            <button
              onClick={onNextLesson || onBack}
              className="w-full py-3 bg-white hover:bg-white/90 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 mt-2 min-h-[44px]"
            >
              <span>Ir para a Próxima Aula</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </section>
      )}

      <FooterStamp />
    </div>
  );
};

