import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, CheckCircle2, AlertCircle, Award, RefreshCw, Zap } from 'lucide-react';
import { Quiz } from '../types';
import { ConfettiEffect } from '../components/ConfettiEffect';
import { FooterStamp } from '../components/FooterStamp';
import { fadeInUp, cardVariant } from '../utils/animations';

interface QuizScreenProps {
  quiz: Quiz;
  onBack: () => void;
  onCompleteQuiz: (score: number, passed: boolean, xpReward: number) => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({
  quiz,
  onBack,
  onCompleteQuiz,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const question = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  const handleSelectOption = (idx: number) => {
    if (!isSubmitted) {
      setSelectedOption(idx);
    }
  };

  const handleConfirmAnswer = () => {
    if (selectedOption === null) return;

    const newAnswers = [...userAnswers, selectedOption];
    setUserAnswers(newAnswers);
    setIsSubmitted(true);
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      // Finaliza o quiz
      const correctCount = userAnswers.reduce((acc, ans, i) => {
        return ans === quiz.questions[i].correctIndex ? acc + 1 : acc;
      }, 0);

      const score = Math.round((correctCount / quiz.questions.length) * 100);
      const passed = score >= 60;

      if (passed) {
        setShowConfetti(true);
      }

      onCompleteQuiz(score, passed, quiz.xpReward);
      setShowResult(true);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    }
  };

  const correctCount = userAnswers.reduce((acc, ans, i) => {
    return ans === quiz.questions[i].correctIndex ? acc + 1 : acc;
  }, 0);
  const score = Math.round((correctCount / quiz.questions.length) * 100);
  const passed = score >= 60;

  return (
    <div className="pb-28 pt-4 px-4 max-w-md md:max-w-2xl mx-auto space-y-5">
      <ConfettiEffect
        show={showConfetti}
        xpEarned={passed ? quiz.xpReward : undefined}
        title="Quiz Concluído!"
        subtitle={`Você atingiu ${score}% de acerto no desafio ${quiz.title}!`}
        onClose={() => setShowConfetti(false)}
      />

      {/* Top Header */}
      <motion.div variants={fadeInUp} initial="initial" animate="animate" className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2.5 rounded-xl bg-[#1A1A1C] border border-white/10 text-white/70 hover:text-white transition-colors min-w-[42px] min-h-[42px] flex items-center justify-center touch-btn"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div>
          <span className="text-[9px] uppercase font-bold text-orange-500 tracking-widest">
            {quiz.techId.toUpperCase()} • {quiz.levelId}
          </span>
          <h2 className="text-base font-bold text-white tracking-tight">{quiz.title}</h2>
        </div>
      </motion.div>

      {!showResult ? (
        <div className="space-y-4">
          {/* Progress Bar */}
          <motion.div variants={fadeInUp} initial="initial" animate="animate" className="space-y-1">
            <div className="flex justify-between text-[11px] text-white/50 font-bold uppercase tracking-wider">
              <span>
                Questão {currentQuestionIndex + 1} de {quiz.questions.length}
              </span>
              <span className="text-orange-400">
                {Math.round(
                  ((currentQuestionIndex + 1) / quiz.questions.length) * 100
                )}
                %
              </span>
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-orange-500 h-full rounded-full transition-all duration-300"
                style={{
                  width: `${
                    ((currentQuestionIndex + 1) / quiz.questions.length) * 100
                  }%`,
                }}
              />
            </div>
          </motion.div>

          {/* Question Card com AnimatePresence */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              exit="exit"
              className="p-5 rounded-2xl bg-[#1A1A1C] border border-white/10 space-y-4 shadow-md"
            >
              <h3 className="text-sm sm:text-base font-bold text-white leading-snug tracking-tight">
                {question.question}
              </h3>

              {/* Options */}
              <div className="space-y-2">
                {question.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === question.correctIndex;

                  let btnStyle = 'bg-black/40 border-white/10 text-white/80';
                  if (isSubmitted) {
                    if (isCorrect) {
                      btnStyle = 'bg-orange-500/20 border-orange-500 text-orange-300 font-bold';
                    } else if (isSelected) {
                      btnStyle = 'bg-red-950/80 border-red-500 text-red-200 font-bold';
                    }
                  } else if (isSelected) {
                    btnStyle = 'bg-orange-500/20 border-orange-500 text-orange-300 font-bold';
                  }

                  return (
                    <motion.button
                      key={idx}
                      whileTap={!isSubmitted ? { scale: 0.98 } : {}}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isSubmitted}
                      className={`w-full p-3.5 rounded-xl border text-left text-xs font-medium transition-all min-h-[48px] flex items-center justify-between touch-btn ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {isSubmitted && isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
                      )}
                      {isSubmitted && isSelected && !isCorrect && (
                        <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Explanation after submission */}
              {isSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-black/50 rounded-xl border border-white/10 text-xs text-white/80 space-y-1"
                >
                  <span className="font-bold text-orange-400 block uppercase tracking-wider text-[10px]">Explicação:</span>
                  <p>{question.explanation}</p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Action Button */}
          {!isSubmitted ? (
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleConfirmAnswer}
              disabled={selectedOption === null}
              className="w-full py-3.5 bg-orange-500 hover:bg-orange-400 active:bg-orange-600 disabled:opacity-50 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-md min-h-[48px] touch-btn"
            >
              Confirmar Resposta
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleNextQuestion}
              className="w-full py-3.5 bg-white hover:bg-white/90 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-md min-h-[48px] touch-btn"
            >
              {isLastQuestion ? 'Ver Resultado do Quiz' : 'Próxima Questão'}
            </motion.button>
          )}
        </div>
      ) : (
        /* Result Summary Card */
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="p-6 rounded-3xl bg-[#1A1A1C] border border-white/10 text-center space-y-4 shadow-xl"
        >
          <div
            className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center font-bold shadow-xl ${
              passed
                ? 'bg-orange-500 text-black shadow-orange-500/20'
                : 'bg-red-500 text-white shadow-red-500/20'
            }`}
          >
            <Award className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              {passed ? 'Quiz Concluído com Sucesso! 🎉' : 'Precisa de Mais Estudo 📚'}
            </h3>
            <p className="text-xs text-white/50 mt-1">
              Você acertou {correctCount} de {quiz.questions.length} questões ({score}%).
            </p>
          </div>

          {passed && (
            <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-300 font-extrabold text-xs">
              <Zap className="w-4 h-4 fill-orange-400 text-orange-400" />
              <span>+{quiz.xpReward} XP Recompensa Bônus Ganha!</span>
            </div>
          )}

          <div className="pt-2">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={onBack}
              className="w-full py-3.5 bg-orange-500 hover:bg-orange-400 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-md min-h-[44px] touch-btn"
            >
              Voltar às Aulas
            </motion.button>
          </div>
        </motion.div>
      )}

      <FooterStamp />
    </div>
  );
};

