/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { UserProgress, TechId, LevelId, Lesson, SyncStatus } from './types';
import { storageService } from './services/storageService';
import { useI18n } from './i18n';
import { Header } from './components/Header';
import { BottomNav, TabType } from './components/BottomNav';
import { HomeScreen } from './screens/HomeScreen';
import { CursosScreen } from './screens/CursosScreen';
import { TechDetailScreen } from './screens/TechDetailScreen';
import { LessonScreen } from './screens/LessonScreen';
import { QuizScreen } from './screens/QuizScreen';
import { ProgressScreen } from './screens/ProgressScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { WelcomeScreen } from './screens/WelcomeScreen';
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
          setActiveTab('home');
        },
        headerBackLabel: t('nav.home') || 'Início',
      };
    }
    return {
      headerBackAction: undefined,
      headerBackLabel: undefined,
    };
  }, [activeLesson, activeQuizLevel, selectedTechId, activeTab, t]);

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
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans antialiased transition-colors duration-250 selection:bg-orange-500 selection:text-black">
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
          {/* Se uma aula estiver ativa */}
          {activeLesson ? (
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
      {!activeLesson && !activeQuizLevel && (
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
