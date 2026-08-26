import { TechId, UserProgress, LevelId } from '../types';
import { TECHNOLOGIES } from '../content/technologies';
import { getLessonsForTechAndLevel } from '../content';

export interface TechMasteryInfo {
  techId: TechId;
  completedLessons: number;
  totalLessons: number;
  passedQuizzes: number;
  totalQuizzes: number;
  percentage: number;
  tier: {
    label: string;
    icon: string;
    color: string;
    bgClass: string;
    isMax: boolean;
  };
}

const LEVELS: LevelId[] = ['iniciante', 'intermediario', 'avancado', 'projetos'];

/**
 * Calcula a porcentagem de domínio (mastery percentage) de uma tecnologia específica
 * considerando tanto as lições completadas quanto os quizzes aprovados.
 */
export function calculateTechMastery(techId: TechId, progress: UserProgress): TechMasteryInfo {
  // Total de lições e lições completadas
  let totalLessons = 0;
  let completedLessons = 0;

  LEVELS.forEach(level => {
    const lessons = getLessonsForTechAndLevel(techId, level);
    totalLessons += lessons.length;
    lessons.forEach(l => {
      if (progress.completedLessons && progress.completedLessons[l.id]) {
        completedLessons++;
      }
    });
  });

  // Total de quizzes e quizzes aprovados
  const totalQuizzes = LEVELS.length; // 4 quizzes por tecnologia
  let passedQuizzes = 0;

  LEVELS.forEach(level => {
    const quizId = `quiz-${techId}-${level}`;
    const quizResult = progress.completedQuizzes?.[quizId];
    if (quizResult && quizResult.passed) {
      passedQuizzes++;
    }
  });

  // Peso: 70% lições práticas + 30% quizzes avaliativos
  const lessonScore = totalLessons > 0 ? (completedLessons / totalLessons) * 70 : 0;
  const quizScore = totalQuizzes > 0 ? (passedQuizzes / totalQuizzes) * 30 : 0;
  const percentage = Math.min(100, Math.round(lessonScore + quizScore));

  let tier = {
    label: 'Não Iniciado',
    icon: '⚪',
    color: '#71717a',
    bgClass: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
    isMax: false,
  };

  if (percentage === 100) {
    tier = {
      label: 'Mestre da Stack',
      icon: '👑',
      color: '#fbbf24',
      bgClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm',
      isMax: true,
    };
  } else if (percentage >= 75) {
    tier = {
      label: 'Especialista',
      icon: '🚀',
      color: '#f97316',
      bgClass: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
      isMax: false,
    };
  } else if (percentage >= 50) {
    tier = {
      label: 'Praticante',
      icon: '⚡',
      color: '#38bdf8',
      bgClass: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
      isMax: false,
    };
  } else if (percentage >= 25) {
    tier = {
      label: 'Aprendiz',
      icon: '📖',
      color: '#34d399',
      bgClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      isMax: false,
    };
  } else if (percentage > 0) {
    tier = {
      label: 'Iniciado',
      icon: '🌱',
      color: '#a1a1aa',
      bgClass: 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30',
      isMax: false,
    };
  }

  return {
    techId,
    completedLessons,
    totalLessons: totalLessons || 20,
    passedQuizzes,
    totalQuizzes,
    percentage,
    tier,
  };
}

/**
 * Calcula o domínio global somando todas as 9 tecnologias
 */
export function calculateOverallCatalogMastery(progress: UserProgress): {
  averageMastery: number;
  masteredCount: number;
  totalTechs: number;
  totalCompletedLessons: number;
  totalPassedQuizzes: number;
} {
  const allMasteries = TECHNOLOGIES.map(t => calculateTechMastery(t.id, progress));
  const totalPercentage = allMasteries.reduce((sum, item) => sum + item.percentage, 0);
  const averageMastery = Math.round(totalPercentage / TECHNOLOGIES.length);
  const masteredCount = allMasteries.filter(m => m.percentage === 100).length;
  const totalCompletedLessons = allMasteries.reduce((sum, item) => sum + item.completedLessons, 0);
  const totalPassedQuizzes = allMasteries.reduce((sum, item) => sum + item.passedQuizzes, 0);

  return {
    averageMastery,
    masteredCount,
    totalTechs: TECHNOLOGIES.length,
    totalCompletedLessons,
    totalPassedQuizzes,
  };
}
