/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TechId =
  | 'python'
  | 'java'
  | 'javascript'
  | 'flutter'
  | 'css'
  | 'html'
  | 'php'
  | 'nodejs'
  | 'mysql'
  | 'react'
  | 'typescript'
  | 'nextjs'
  | 'git'
  | 'linux_cyber'
  | 'apis'
  | 'postgresql'
  | 'python_fastapi'
  | 'ai_apps'
  | 'c_sys_cyber'
  | 'cloud_devops'
  | 'english_tech'
  | 'unity_2d'
  | 'unity_3d'
  | 'unreal_cpp'
  | 'godot_engine'
  | 'game_multiplayer'
  | 'game_mobile_dev'
  | 'game_pc_publishing'
  | 'game_fundamentals'
  | 'game_graphics_ai'
  | 'blender_3d';

export type TechCategory =
  | 'Frontend'
  | 'Backend'
  | 'Mobile'
  | 'Banco de Dados'
  | 'Linguagens'
  | 'Cybersecurity'
  | 'DevOps & Cloud'
  | 'IA & Dados'
  | 'Ferramentas'
  | 'Carreira & Inglês'
  | 'Game Dev'
  | '3D & Engines';

export type LevelId = 'iniciante' | 'intermediario' | 'avancado' | 'projetos';

export type ExerciseType = 'multiple_choice' | 'code_completion' | 'code_write';

export interface Exercise {
  id: string;
  prompt: string;
  type: ExerciseType;
  options?: string[]; // Para múltipla escolha
  correctAnswer: string; // Para validação (texto ou regex pattern)
  initialCode?: string;
  expectedOutput?: string;
  hint: string;
  explanation: string;
}

export interface TheorySection {
  title?: string;
  text: string;
  keyPoints?: string[];
  conceptCard?: string;
}

export interface CodeExample {
  language: string;
  code: string;
  explanation: string;
}

export interface SimulationConfig {
  type: 'real_js' | 'real_html' | 'real_pyodide' | 'simulated' | 'sql_mock';
  defaultOutput?: string;
  description?: string;
  htmlContent?: string;
  cssContent?: string;
  jsContent?: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  techId: TechId;
  levelId: LevelId;
  order: number;
  estimatedMinutes: number;
  theory: TheorySection[];
  codeExample: CodeExample;
  simulation: SimulationConfig;
  exercise: Exercise;
  xpReward: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  techId: TechId;
  levelId: LevelId;
  title: string;
  questions: QuizQuestion[];
  xpReward: number;
}

// --- EXAME DE PASSAGEM DE CURSO (120 MINUTOS, 60 TEÓRICAS + 20 PRÁTICAS, NOTA 20/20) ---
export type ExamQuestionType = 'theory' | 'practical';

export interface ExamQuestion {
  id: string;
  number: number; // 1 a 80
  type: ExamQuestionType;
  question: string;
  topic: string;
  options?: string[]; // Para teóricas (4 opções)
  correctIndex?: number; // Para teóricas (0 a 3)
  initialCode?: string; // Para práticas
  expectedKeywords?: string[]; // Palavras-chave necessárias
  correctSnippet?: string; // Código de referência correto
  hint?: string;
  explanation: string;
}

export interface CourseExam {
  id: string;
  techId: TechId;
  title: string;
  description: string;
  totalQuestions: number; // 80
  theoryCount: number; // 60
  practicalCount: number; // 20
  durationMinutes: number; // 120
  maxScore: number; // 20 valores
  passingScore: number; // 20 valores estritos
  questions: ExamQuestion[];
}

export interface ExamAttempt {
  id: string;
  techId: TechId;
  startedAt: string; // ISO string
  submittedAt?: string; // ISO string
  resultsReleaseAt?: string; // ISO string (submittedAt + 30 min)
  timeSpentSeconds: number;
  timeRemainingSeconds: number;
  timedOut: boolean;
  answers: Record<string, string | number>; // questionId -> index ou código digitado
  questions?: ExamQuestion[]; // Questões geradas aleatoriamente específicas desta tentativa
  theoryCorrect: number; // de 60
  practicalCorrect: number; // de 20
  totalCorrect: number; // de 80
  scoreOutOf20: number; // de 0 a 20 valores com precisão decimal
  passed: boolean; // estritamente scoreOutOf20 === 20
  status: 'in_progress' | 'under_review' | 'released';
}

export interface Technology {
  id: TechId;
  name: string;
  description: string;
  iconName: string;
  color: string;
  bgGradient: string;
  badge: string;
  category: TechCategory;
}

export interface SyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  pendingCount: number;
  lastSyncedAt: string | null;
  status: 'synced' | 'syncing' | 'offline' | 'pending';
}

export interface SyncQueueItem {
  id: string;
  type: 'COMPLETE_LESSON' | 'COMPLETE_QUIZ' | 'SUBMIT_EXAM' | 'RELEASE_EXAM' | 'UPDATE_PROFILE' | 'THEME_CHANGE' | 'RESET_PROGRESS';
  payload: Record<string, unknown>;
  timestamp: string;
}

export interface UserProgress {
  userId: string;
  userName: string;
  completedLessons: Record<string, boolean>; // lessonId -> true
  completedQuizzes: Record<string, { score: number; passed: boolean }>; // quizId -> stats
  courseExams: Record<string, {
    passed: boolean;
    highestScore: number; // 0 a 20 valores
    attemptsCount: number;
    lastAttempt?: ExamAttempt;
    passedAt?: string;
  }>;
  activeExamAttempt?: ExamAttempt | null;
  xp: number;
  streak: number;
  longestStreak?: number;
  lastAccess: string; // ISO String
  lastLessonDate?: string; // YYYY-MM-DD
  lessonDates?: string[]; // YYYY-MM-DD array of days with at least 1 completed lesson
  theme: 'dark' | 'light';
  language?: 'pt' | 'en';
  favoriteTechs: TechId[];
  unlockedBadges: string[];
  dailyXpHistory?: Record<string, number>; // date YYYY-MM-DD -> XP ganho
  lastSyncedAt?: string;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  requiredXp?: number;
  requiredLessons?: number;
  requiredStreak?: number;
}
