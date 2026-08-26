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
  | 'english_tech';

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
  | 'Carreira & Inglês';

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
  type: 'COMPLETE_LESSON' | 'COMPLETE_QUIZ' | 'UPDATE_PROFILE' | 'THEME_CHANGE' | 'RESET_PROGRESS';
  payload: Record<string, unknown>;
  timestamp: string;
}

export interface UserProgress {
  userId: string;
  userName: string;
  completedLessons: Record<string, boolean>; // lessonId -> true
  completedQuizzes: Record<string, { score: number; passed: boolean }>; // quizId -> stats
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
