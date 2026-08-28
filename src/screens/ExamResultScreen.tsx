import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Award,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Check,
  X,
  FileText,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShieldCheck,
  Code2
} from 'lucide-react';
import { TechId, ExamAttempt, UserProgress } from '../types';
import { TECHNOLOGIES } from '../content/technologies';
import { generateCourseExam } from '../content/exams';
import { getTechUnlockState } from '../utils/unlockProgression';
import { storageService } from '../services/storageService';

interface ExamResultScreenProps {
  techId: TechId;
  attempt: ExamAttempt;
  progress: UserProgress;
  onRetakeExam: () => void;
  onGoToNextTech: (nextTechId: TechId) => void;
  onBackToCourse: () => void;
}

export const ExamResultScreen: React.FC<ExamResultScreenProps> = ({
  techId,
  attempt,
  progress,
  onRetakeExam,
  onGoToNextTech,
  onBackToCourse,
}) => {
  const tech = useMemo(() => TECHNOLOGIES.find(t => t.id === techId) || TECHNOLOGIES[0], [techId]);
  const exam = useMemo(() => generateCourseExam(techId), [techId]);
  const unlockState = useMemo(() => getTechUnlockState(techId, progress), [techId, progress]);
  const nextTech = unlockState.nextTech;

  const [filter, setFilter] = useState<'all' | 'wrong' | 'correct' | 'theory' | 'practical'>('all');
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  const isPassed = !attempt.timedOut && attempt.scoreOutOf20 === 20 && attempt.totalCorrect === 80;

  const formatTimeSpent = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getQuestionStatus = (qId: string, qType: 'theory' | 'practical', correctIdx?: number, expectedKeywords?: string[]) => {
    const ans = attempt.answers[qId];
    if (attempt.timedOut) return false;

    if (qType === 'theory') {
      return typeof ans === 'number' && ans === correctIdx;
    } else {
      if (typeof ans === 'string' && ans.trim().length >= 15) {
        let valid = true;
        if (expectedKeywords) {
          for (const kw of expectedKeywords) {
            if (!ans.toLowerCase().includes(kw.toLowerCase())) {
              valid = false;
              break;
            }
          }
        }
        return valid;
      }
      return false;
    }
  };

  const filteredQuestions = useMemo(() => {
    return exam.questions.filter(q => {
      const isCorrect = getQuestionStatus(q.id, q.type, q.correctIndex, q.expectedKeywords);
      if (filter === 'wrong') return !isCorrect;
      if (filter === 'correct') return isCorrect;
      if (filter === 'theory') return q.type === 'theory';
      if (filter === 'practical') return q.type === 'practical';
      return true;
    });
  }, [exam.questions, filter, attempt]);

  const handleRetake = () => {
    storageService.resetCourseExam(techId);
    onRetakeExam();
  };

  return (
    <div id="exam-result-screen" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl w-full mx-auto space-y-8">
        
        {/* BOLETIM OFICIAL CABEÇALHO */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`border rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden ${
            isPassed
              ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-950/40 border-emerald-500/50'
              : 'bg-gradient-to-b from-slate-900 via-slate-900 to-rose-950/40 border-rose-500/50'
          }`}
        >
          {/* Luz de fundo de status */}
          <div className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none ${
            isPassed ? 'bg-emerald-500/10' : 'bg-rose-500/10'
          }`} />

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            
            {/* Título & Identificação */}
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-slate-800 border border-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-slate-300">Boletim Oficial de Avaliação</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-100">
                Exame de Passagem: {tech.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Aluno: <strong className="text-slate-200">{progress.userName || 'Dev Aprendiz'}</strong> • 80 Itens Avaliados (60 Teóricos + 20 Práticos)
              </p>
            </div>

            {/* NOTA FINAL EM VALORES (0 a 20) */}
            <div className="flex-shrink-0 text-center md:text-right bg-slate-950/80 border border-slate-800 p-4 rounded-2xl shadow-inner">
              <span className="text-[11px] uppercase font-mono tracking-widest text-slate-400 block mb-1">
                Nota Final Oficial
              </span>
              <div className={`text-4xl sm:text-5xl font-black font-mono tracking-tight ${
                isPassed ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {attempt.scoreOutOf20.toFixed(1)} <span className="text-lg font-normal text-slate-500">/ 20.0</span>
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider mt-1 block">
                {isPassed ? (
                  <span className="text-emerald-400 flex items-center justify-center md:justify-end gap-1">
                    <CheckCircle2 className="w-4 h-4" /> APROVADO COM DISTINÇÃO
                  </span>
                ) : (
                  <span className="text-rose-400 flex items-center justify-center md:justify-end gap-1">
                    <XCircle className="w-4 h-4" /> REPROVADO NO EXAME
                  </span>
                )}
              </span>
            </div>
          </div>

          {/* PAINEL DE RESULTADO E CRITÉRIO */}
          <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/50">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Teoria (60)</span>
              <span className="text-base font-bold font-mono text-slate-200">{attempt.theoryCorrect} / 60</span>
            </div>
            <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/50">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Prática (20)</span>
              <span className="text-base font-bold font-mono text-slate-200">{attempt.practicalCorrect} / 20</span>
            </div>
            <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/50">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Total de Acertos</span>
              <span className="text-base font-bold font-mono text-slate-200">{attempt.totalCorrect} / 80</span>
            </div>
            <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/50">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Tempo Gasto</span>
              <span className="text-base font-bold font-mono text-slate-200">{formatTimeSpent(attempt.timeSpentSeconds)}</span>
            </div>
          </div>

          {/* MENSAGEM DE IMPACTO NO DESBLOQUEIO */}
          <div className="mt-6">
            {isPassed ? (
              <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-600/60 space-y-2">
                <div className="flex items-center space-x-2 text-emerald-300 font-bold text-sm">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span>PARABÉNS! Domínio Absoluto Comprovado (+500 XP)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Você atingiu a pontuação máxima exigida de <strong>20 de 20 valores</strong>. O próximo curso da trilha ({nextTech ? nextTech.name : 'Todas as formações concluídas'}) foi desbloqueado com sucesso!
                </p>
                {nextTech && (
                  <div className="pt-2">
                    <button
                      id="btn-advance-next-tech"
                      onClick={() => onGoToNextTech(nextTech.id)}
                      className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg transition-transform active:scale-95"
                    >
                      <span>Avançar para {nextTech.name}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-700/60 space-y-3">
                <div className="flex items-center space-x-2 text-rose-300 font-bold text-sm">
                  <AlertTriangle className="w-5 h-5 text-rose-400" />
                  <span>Critério Rigoroso de Passagem Não Atingido</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Para garantir excelência profissional, o desbloqueio do próximo curso requer a nota máxima de <strong>20 de 20 valores (80 acertos em 80 itens)</strong>. Como a nota obtida foi <strong>{attempt.scoreOutOf20.toFixed(1)} valores</strong>, você precisa revisar o conteúdo das aulas e refazer o exame de passagem.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    id="btn-retake-exam-now"
                    onClick={handleRetake}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Tentar Novo Exame de Passagem</span>
                  </button>
                  <button
                    id="btn-review-lessons"
                    onClick={onBackToCourse}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
                  >
                    Revisar as 20 Aulas de {tech.name}
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* GABARITO & AUDITORIA DETALHADA DAS 80 QUESTÕES */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold text-slate-100">Gabarito e Revisão Técnica (80 Itens)</h2>
            </div>

            {/* Filtros do Gabarito */}
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                  filter === 'all' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Todas (80)
              </button>
              <button
                onClick={() => setFilter('wrong')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                  filter === 'wrong' ? 'bg-rose-600 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Incorretas ({80 - attempt.totalCorrect})
              </button>
              <button
                onClick={() => setFilter('correct')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                  filter === 'correct' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Corretas ({attempt.totalCorrect})
              </button>
              <button
                onClick={() => setFilter('theory')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                  filter === 'theory' ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Teoria (1-60)
              </button>
              <button
                onClick={() => setFilter('practical')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                  filter === 'practical' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Prática (61-80)
              </button>
            </div>
          </div>

          {/* Lista de Questões no Gabarito */}
          <div className="space-y-3">
            {filteredQuestions.map(q => {
              const isCorrect = getQuestionStatus(q.id, q.type, q.correctIndex, q.expectedKeywords);
              const userAns = attempt.answers[q.id];
              const isExpanded = expandedQuestion === q.id;

              return (
                <div
                  key={q.id}
                  id={`review-question-${q.number}`}
                  className={`bg-slate-900 border rounded-2xl p-4 transition-all ${
                    isCorrect ? 'border-slate-800' : 'border-rose-900/60 bg-rose-950/10'
                  }`}
                >
                  <div
                    onClick={() => setExpandedQuestion(isExpanded ? null : q.id)}
                    className="flex items-start justify-between gap-3 cursor-pointer"
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono text-xs font-bold flex-shrink-0 mt-0.5 ${
                        isCorrect
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-rose-950 text-rose-400 border border-rose-800'
                      }`}>
                        {q.number}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                            q.type === 'theory' ? 'bg-indigo-950 text-indigo-300' : 'bg-emerald-950 text-emerald-300'
                          }`}>
                            {q.type === 'theory' ? 'Teoria' : 'Prática'}
                          </span>
                          <span className="text-xs text-slate-400 font-semibold">{q.topic}</span>
                        </div>
                        <p className="text-xs sm:text-sm font-medium text-slate-200 line-clamp-2">
                          {q.question.split('\n')[0]}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 flex-shrink-0">
                      {isCorrect ? (
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                          <Check className="w-4 h-4" /> Correto
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-rose-400 flex items-center gap-1">
                          <X className="w-4 h-4" /> Incorreto
                        </span>
                      )}
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </div>
                  </div>

                  {/* Detalhes expandidos */}
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 pt-4 border-t border-slate-800 space-y-3 text-xs"
                    >
                      <p className="text-slate-300 whitespace-pre-line leading-relaxed">{q.question}</p>

                      {/* Opções Teóricas */}
                      {q.type === 'theory' && q.options && (
                        <div className="space-y-1.5 pl-2">
                          {q.options.map((opt, optIdx) => {
                            const isUserChoice = userAns === optIdx;
                            const isCorrectChoice = q.correctIndex === optIdx;

                            return (
                              <div
                                key={optIdx}
                                className={`p-2.5 rounded-lg flex items-start space-x-2 border ${
                                  isCorrectChoice
                                    ? 'bg-emerald-950/60 border-emerald-700 text-emerald-200 font-semibold'
                                    : isUserChoice
                                    ? 'bg-rose-950/60 border-rose-700 text-rose-200'
                                    : 'bg-slate-950/40 border-slate-800/80 text-slate-400'
                                }`}
                              >
                                <span className="font-mono font-bold">{String.fromCharCode(65 + optIdx)})</span>
                                <span className="flex-1">{opt}</span>
                                {isCorrectChoice && <Check className="w-4 h-4 text-emerald-400" />}
                                {isUserChoice && !isCorrectChoice && <X className="w-4 h-4 text-rose-400" />}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Resposta Prática de Código */}
                      {q.type === 'practical' && (
                        <div className="space-y-2">
                          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs text-slate-300">
                            <span className="text-slate-400 block mb-1 font-sans font-bold">Código Submetido pelo Aluno:</span>
                            <pre className="overflow-x-auto">{(userAns as string) || '// Nenhum código foi escrito'}</pre>
                          </div>
                          {q.correctSnippet && (
                            <div className="bg-emerald-950/30 p-3 rounded-xl border border-emerald-800/60 font-mono text-xs text-emerald-300">
                              <span className="text-emerald-400 block mb-1 font-sans font-bold">Solução Técnica de Referência:</span>
                              <pre className="overflow-x-auto">{q.correctSnippet}</pre>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Justificativa Técnica */}
                      {q.explanation && (
                        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-300">
                          <strong className="text-amber-400 block mb-1">Fundamento Técnico & Justificativa:</strong>
                          <p className="leading-relaxed">{q.explanation}</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer com Ações */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800">
          <button
            onClick={onBackToCourse}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            Voltar para o Painel do Curso
          </button>

          {!isPassed && (
            <button
              onClick={handleRetake}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg transition-transform active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Refazer Exame de Passagem</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
