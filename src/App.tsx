/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { UserProgress, TechId, LevelId, Lesson, SyncStatus, ExamAttempt } from './types';
import { storageService } from './services/storageService';
import { useI18n } from './i18n';
import { Header } from './components/Header';
import { BottomNav, TabType } from './components/BottomNav';
import { HomeScreen } from './screens/HomeScreen';
import { CursosScreen } from './screens/CursosScreen';
import { TechDetailScreen } from './screens/TechDetailScreen';
import { LessonScreen } from './screens/LessonScreen';
import { QuizScreen } from './screens/QuizScreen';
import { ExamScreen } from './screens/ExamScreen';
import { ExamEmbargoScreen } from './screens/ExamEmbargoScreen';
import { ExamResultScreen } from './screens/ExamResultScreen';
import { ProgressScreen } from './screens/ProgressScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { FloatingScrollControls } from './components/FloatingScrollControls';
import { getLessonsForTechAndLevel, getQuizForTechAndLevel } from './content';
import { fadeInUp } from './utils/animations';

export default function App() {
  const { t } = useI18n();
  const [progress, setProgress] = useState<UserProgress>(() =>
    storageService.getUserProgress()
  );

  const [syncStatus, setSyncStatus] = useState<SyncStatus>(() =>
    storageService.getSyncStatus()
  );

  // Estado da Página de Apresentação / Introdução (Welcome Screen)
  const [showWelcome, setShowWelcome] = useState<boolean>(() =>
    !storageService.hasSeenIntro()
  );

  // Inscrição em tempo real para sincronização e progresso em segundo plano
  useEffect(() => {
    const unsubSync = storageService.subscribeSync(status => {
      setSyncStatus({ ...status });
    });

    const unsubProgress = storageService.subscribeProgress(newProg => {
      setProgress({ ...newProg });
    });

    return () => {
      unsubSync();
      unsubProgress();
    };
  }, []);

  // Tab Navegação Principal
  const [activeTab, setActiveTab] = useState<TabType>('home');

  // Estado de Rotas de Subtela
  const [selectedTechId, setSelectedTechId] = useState<TechId | null>(null);
  const [selectedLevelId, setSelectedLevelId] = useState<LevelId>('iniciante');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [activeQuizLevel, setActiveQuizLevel] = useState<LevelId | null>(null);
  const [activeExamTechId, setActiveExamTechId] = useState<TechId | null>(null);
  const [activeEmbargoTechId, setActiveEmbargoTechId] = useState<TechId | null>(null);
  const [activeResultTechId, setActiveResultTechId] = useState<TechId | null>(null);

  // Aplica classe Dark ou Light no body / root HTML conforme preferência do usuário
  useEffect(() => {
    const root = document.documentElement;
    if (progress.theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [progress.theme]);

  // Handler para alternar tema
  const handleToggleTheme = () => {
    const nextTheme = progress.theme === 'dark' ? 'light' : 'dark';
    const updated = storageService.setTheme(nextTheme);
    setProgress({ ...updated });
  };

  // Handler para selecionar tecnologia e nível
  const handleSelectTech = (techId: TechId, levelId: LevelId = 'iniciante') => {
    setSelectedTechId(techId);
    setSelectedLevelId(levelId);
    setActiveLesson(null);
    setActiveQuizLevel(null);
  };

  // Handler para iniciar aula
  const handleStartLesson = (lessonId: string, levelId: LevelId) => {
    if (!selectedTechId) return;
    const lessons = getLessonsForTechAndLevel(selectedTechId, levelId);
    const lesson = lessons.find(l => l.id === lessonId);
    if (lesson) {
      setActiveLesson(lesson);
      setSelectedLevelId(levelId);
    }
  };

  // Handler para concluir aula
  const handleCompleteLesson = (xpReward: number) => {
    if (!activeLesson) return;
    const updated = storageService.completeLesson(activeLesson.id, xpReward);
    setProgress({ ...updated });
  };

  // Handler para ir para próxima aula
  const handleNextLesson = () => {
    if (!selectedTechId || !activeLesson) return;
    const currentLessons = getLessonsForTechAndLevel(selectedTechId, selectedLevelId);
    const currentIndex = currentLessons.findIndex(l => l.id === activeLesson.id);

    if (currentIndex >= 0 && currentIndex < currentLessons.length - 1) {
      setActiveLesson(currentLessons[currentIndex + 1]);
    } else {
      setActiveLesson(null);
    }
  };

  // Handler para iniciar Quiz
  const handleStartQuiz = (levelId: LevelId) => {
    setActiveQuizLevel(levelId);
    setActiveLesson(null);
  };

  // Handler para concluir Quiz
  const handleCompleteQuiz = (score: number, passed: boolean, xpReward: number) => {
    if (!selectedTechId || !activeQuizLevel) return;
    const quiz = getQuizForTechAndLevel(selectedTechId, activeQuizLevel);
    const updated = storageService.completeQuiz(quiz.id, score, passed, xpReward);
    setProgress({ ...updated });
  };

  // Handlers do Exame de Passagem de Curso
  const handleStartExam = (techId: TechId) => {
    setActiveExamTechId(techId);
    setActiveLesson(null);
    setActiveQuizLevel(null);
    setActiveEmbargoTechId(null);
    setActiveResultTechId(null);
  };

  const handleExamSubmit = (attempt: ExamAttempt) => {
    setActiveExamTechId(null);
    // Se o resultado estiver sob embargo de 30min, abre a câmara de avaliação/embargo
    if (attempt.resultsReleaseAt && new Date(attempt.resultsReleaseAt).getTime() > Date.now()) {
      setActiveEmbargoTechId(attempt.techId);
    } else {
      setActiveResultTechId(attempt.techId);
    }
  };

  const handleViewExamEmbargo = (techId: TechId) => {
    setActiveEmbargoTechId(techId);
    setActiveExamTechId(null);
    setActiveResultTechId(null);
    setActiveLesson(null);
    setActiveQuizLevel(null);
  };

  const handleEmbargoResultsReady = (techId: TechId) => {
    storageService.releaseExamResults(techId);
    setActiveEmbargoTechId(null);
    setActiveResultTechId(techId);
  };

  const handleViewExamResults = (techId: TechId) => {
    setActiveResultTechId(techId);
    setActiveExamTechId(null);
    setActiveEmbargoTechId(null);
    setActiveLesson(null);
    setActiveQuizLevel(null);
  };

  const handleRetakeExam = (techId: TechId) => {
    storageService.resetCourseExam(techId);
    setActiveResultTechId(null);
    setActiveEmbargoTechId(null);
    setActiveExamTechId(techId);
  };

  const handleGoToNextTech = (nextTechId: TechId) => {
    setActiveResultTechId(null);
    setActiveEmbargoTechId(null);
    setActiveExamTechId(null);
    setSelectedTechId(nextTechId);
    setSelectedLevelId('iniciante');
  };

  // Handler para entrar no aplicativo a partir da tela de boas-vindas / introdução
  const handleEnterApp = () => {
    storageService.setSeenIntro(true);
    setShowWelcome(false);
  };

  // Handler para resetar progresso
  const handleResetProgress = () => {
    const reset = storageService.resetProgress();
    storageService.setSeenIntro(false);
    setProgress({ ...reset });
    setSelectedTechId(null);
    setActiveLesson(null);
    setActiveQuizLevel(null);
    setActiveExamTechId(null);
    setActiveEmbargoTechId(null);
    setActiveResultTechId(null);
    setShowWelcome(true);
  };

  // Handler para exportar JSON
  const handleExportData = () => {
    const dataStr = storageService.exportDataJSON();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `codemaster_progress_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Handler para importar JSON
  const handleImportData = (jsonStr: string): boolean => {
    const ok = storageService.importDataJSON(jsonStr);
    if (ok) {
      setProgress(storageService.getUserProgress());
    }
    return ok;
  };

  // Compute Header Back Button action and label dynamically
  const { headerBackAction, headerBackLabel } = useMemo(() => {
    if (activeExamTechId) {
      return {
        headerBackAction: () => {
          if (window.confirm('Tem certeza que deseja sair do exame em andamento? O tempo continuará contando.')) {
            setActiveExamTechId(null);
          }
        },
        headerBackLabel: 'Voltar ao Curso',
      };
    }
    if (activeEmbargoTechId) {
      return {
        headerBackAction: () => setActiveEmbargoTechId(null),
        headerBackLabel: 'Voltar',
      };
    }
    if (activeResultTechId) {
      return {
        headerBackAction: () => setActiveResultTechId(null),
        headerBackLabel: 'Voltar',
      };
    }
    if (activeLesson) {
      return {
        headerBackAction: () => setActiveLesson(null),
        headerBackLabel: t('nav.backToCourse') || 'Voltar',
      };
    }
    if (activeQuizLevel) {
      return {
        headerBackAction: () => setActiveQuizLevel(null),
        headerBackLabel: t('nav.backToCourse') || 'Voltar',
      };
    }
    if (selectedTechId) {
      return {
        headerBackAction: () => setSelectedTechId(null),
        headerBackLabel: t('nav.backToCourses') || 'Cursos',
      };
    }
    if (activeTab !== 'home') {
      return {
        headerBackAction: () => {
          setSelectedTechId(null);
          setActiveLesson(null);
          setActiveQuizLevel(null);
          setActiveExamTechId(null);
          setActiveEmbargoTechId(null);
          setActiveResultTechId(null);
          setActiveTab('home');
        },
        headerBackLabel: t('nav.home') || 'Início',
      };
    }
    return {
      headerBackAction: undefined,
      headerBackLabel: undefined,
    };
  }, [activeExamTechId, activeEmbargoTechId, activeResultTechId, activeLesson, activeQuizLevel, selectedTechId, activeTab, t]);

  // Se a tela de boas-vindas / introdução estiver ativa, exibe a página de introdução
  if (showWelcome) {
    return (
      <WelcomeScreen
        onEnterApp={handleEnterApp}
        onToggleTheme={handleToggleTheme}
        isDark={progress.theme === 'dark'}
      />
    );
  }

  return (
    <div className="relative min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans antialiased transition-colors duration-250 selection:bg-orange-500 selection:text-black">
      {/* Floating Scroll Indicator and Back-to-Top Control */}
      <FloatingScrollControls />

      {/* Header Fixo no Topo com Botão Dinâmico de Voltar */}
      <Header
        progress={progress}
        syncStatus={syncStatus}
        onToggleTheme={handleToggleTheme}
        onBack={headerBackAction}
        backLabel={headerBackLabel}
        onOpenWelcome={() => setShowWelcome(true)}
        onProfileClick={() => {
          setSelectedTechId(null);
          setActiveLesson(null);
          setActiveQuizLevel(null);
          setActiveTab('profile');
        }}
        onNavigateToStudy={() => {
          setSelectedTechId(null);
          setActiveLesson(null);
          setActiveQuizLevel(null);
          setActiveTab('courses');
        }}
      />

      {/* Renderização de Conteúdo Principal / Telas com Animação Suave */}
      <main>
        <AnimatePresence mode="wait">
          {/* Se um exame estiver ativo */}
          {activeExamTechId ? (
            <motion.div
              key={`exam-${activeExamTechId}`}
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <ExamScreen
                techId={activeExamTechId}
                progress={progress}
                onExit={() => setActiveExamTechId(null)}
                onSubmit={handleExamSubmit}
              />
            </motion.div>
          ) : activeEmbargoTechId && progress.courseExams?.[activeEmbargoTechId] ? (
            /* Se um exame estiver na câmara de auditoria/embargo de 30min */
            <motion.div
              key={`embargo-${activeEmbargoTechId}`}
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <ExamEmbargoScreen
                techId={activeEmbargoTechId}
                attempt={progress.courseExams[activeEmbargoTechId]!.attempts.slice(-1)[0]}
                progress={progress}
                onResultsReady={() => handleEmbargoResultsReady(activeEmbargoTechId)}
                onBackToCourses={() => {
                  setActiveEmbargoTechId(null);
                  setSelectedTechId(activeEmbargoTechId);
                }}
              />
            </motion.div>
          ) : activeResultTechId && progress.courseExams?.[activeResultTechId] ? (
            /* Se estiver visualizando o boletim oficial/gabarito de um exame */
            <motion.div
              key={`results-${activeResultTechId}`}
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <ExamResultScreen
                techId={activeResultTechId}
                attempt={progress.courseExams[activeResultTechId]!.attempts.slice(-1)[0]}
                progress={progress}
                onRetakeExam={() => handleRetakeExam(activeResultTechId)}
                onGoToNextTech={handleGoToNextTech}
                onBackToCourse={() => {
                  setActiveResultTechId(null);
                  setSelectedTechId(activeResultTechId);
                }}
              />
            </motion.div>
          ) : activeLesson ? (
            /* Se uma aula estiver ativa */
            <motion.div
              key={`lesson-${activeLesson.id}`}
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <LessonScreen
                lesson={activeLesson}
                onBack={() => setActiveLesson(null)}
                onComplete={handleCompleteLesson}
                onNextLesson={handleNextLesson}
              />
            </motion.div>
          ) : activeQuizLevel && selectedTechId ? (
            /* Se um quiz estiver ativo */
            <motion.div
              key={`quiz-${selectedTechId}-${activeQuizLevel}`}
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <QuizScreen
                quiz={getQuizForTechAndLevel(selectedTechId, activeQuizLevel)}
                onBack={() => setActiveQuizLevel(null)}
                onCompleteQuiz={handleCompleteQuiz}
              />
            </motion.div>
          ) : selectedTechId ? (
            /* Submenu da tecnologia selecionada */
            <motion.div
              key={`tech-${selectedTechId}`}
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <TechDetailScreen
                techId={selectedTechId}
                initialLevelId={selectedLevelId}
                progress={progress}
                onBack={() => setSelectedTechId(null)}
                onStartLesson={handleStartLesson}
                onStartQuiz={handleStartQuiz}
                onSelectTech={handleSelectTech}
                onStartExam={handleStartExam}
                onViewExamResults={handleViewExamResults}
                onViewExamEmbargo={handleViewExamEmbargo}
              />
            </motion.div>
          ) : (
            /* Navegação por Tab */
            <motion.div
              key={`tab-${activeTab}`}
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {activeTab === 'home' && (
                <HomeScreen
                  progress={progress}
                  onSelectTech={handleSelectTech}
                  onNavigateTab={tab => setActiveTab(tab)}
                />
              )}

              {activeTab === 'courses' && (
                <CursosScreen
                  progress={progress}
                  onSelectTech={handleSelectTech}
                />
              )}

              {activeTab === 'progress' && (
                <ProgressScreen
                  progress={progress}
                  onNavigateToStudy={() => {
                    setSelectedTechId(null);
                    setActiveLesson(null);
                    setActiveQuizLevel(null);
                    setActiveTab('courses');
                  }}
                />
              )}

              {activeTab === 'profile' && (
                <ProfileScreen
                  progress={progress}
                  syncStatus={syncStatus}
                  onUpdateName={name => {
                    const updated = storageService.updateUserName(name);
                    setProgress({ ...updated });
                  }}
                  onToggleTheme={handleToggleTheme}
                  onExportData={handleExportData}
                  onImportData={handleImportData}
                  onResetProgress={handleResetProgress}
                  onOpenWelcome={() => setShowWelcome(true)}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation Fixo (Início, Cursos, Progresso, Perfil) */}
      {!activeLesson && !activeQuizLevel && !activeExamTechId && !activeEmbargoTechId && !activeResultTechId && (
        <BottomNav
          activeTab={activeTab}
          onSelectTab={tab => {
            setSelectedTechId(null);
            setActiveTab(tab);
          }}
        />
      )}
    </div>
  );
}
