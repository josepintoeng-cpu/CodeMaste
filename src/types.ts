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
  | 'mysql';

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
  category: 'Frontend' | 'Backend' | 'Mobile' | 'Banco de Dados' | 'Linguagens';
}

export interface UserProgress {
  userId: string;
  userName: string;
  completedLessons: Record<string, boolean>; // lessonId -> true
  completedQuizzes: Record<string, { score: number; passed: boolean }>; // quizId -> stats
  xp: number;
  streak: number;
  lastAccess: string; // ISO String
  theme: 'dark' | 'light';
  favoriteTechs: TechId[];
  unlockedBadges: string[];
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
