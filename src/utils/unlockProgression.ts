import { TechId, LevelId, UserProgress, Technology, Lesson } from '../types';
import { TECHNOLOGIES } from '../content/technologies';
import { getLessonsForTechAndLevel } from '../content';

const LEVELS: LevelId[] = ['iniciante', 'intermediario', 'avancado', 'projetos'];

export interface TechUnlockState {
  techId: TechId;
  technology: Technology;
  isUnlocked: boolean;
  isCompleted: boolean;
  completedLessons: number;
  totalLessons: number;
  progressPct: number;
  isExamUnlocked: boolean;
  examPassed: boolean;
  examScore: number; // 0 a 20 valores
  isExamUnderReview: boolean;
  examResultsReleaseAt?: string;
  examAttemptsCount: number;
  prevTech?: Technology;
  nextTech?: Technology;
  orderNumber: number; // 1-indexed (e.g. 1 to 31)
  totalTechs: number;
}

/**
 * Calcula a quantidade de aulas concluídas e totais para uma dada tecnologia.
 */
export function getTechLessonCount(
  techId: TechId,
  progress: UserProgress
): { completed: number; total: number; isCompleted: boolean } {
  let total = 0;
  let completed = 0;

  for (const level of LEVELS) {
    const lessons = getLessonsForTechAndLevel(techId, level);
    total += lessons.length;
    for (const l of lessons) {
      if (progress.completedLessons && progress.completedLessons[l.id]) {
        completed++;
      }
    }
  }

  if (total === 0) total = 20;

  return {
    completed,
    total,
    isCompleted: total > 0 && completed >= total,
  };
}

/**
 * Retorna os dados de exame para uma tecnologia.
 */
export function getTechExamStatus(techId: TechId, progress: UserProgress) {
  const examInfo = progress.courseExams?.[techId];
  const passed = examInfo?.passed === true && examInfo?.highestScore === 20;
  const score = examInfo?.highestScore || 0;
  const attempts = examInfo?.attemptsCount || 0;
  const lastAttempt = examInfo?.lastAttempt;
  
  // Verifica se está sob embargo de 30 minutos
  let isUnderReview = false;
  let releaseAt: string | undefined = undefined;

  if (lastAttempt && lastAttempt.status === 'under_review' && lastAttempt.resultsReleaseAt) {
    const releaseTime = new Date(lastAttempt.resultsReleaseAt).getTime();
    if (Date.now() < releaseTime) {
      isUnderReview = true;
      releaseAt = lastAttempt.resultsReleaseAt;
    }
  }

  return {
    passed,
    score,
    attempts,
    lastAttempt,
    isUnderReview,
    releaseAt,
  };
}

/**
 * Verifica se uma tecnologia específica está desbloqueada para o usuário.
 * Regra: A primeira tecnologia (índice 0) está sempre desbloqueada.
 * Cada tecnologia subsequente só desbloqueia quando a imediatamente anterior
 * tiver 100% de suas aulas concluídas E tiver sido APROVADA no Exame de Passagem
 * com nota máxima de 20 de 20 valores.
 */
export function isTechUnlocked(techId: TechId, progress: UserProgress): boolean {
  const index = TECHNOLOGIES.findIndex(t => t.id === techId);
  if (index <= 0) return true; // Primeira tecnologia (Python) sempre liberada

  const prevTech = TECHNOLOGIES[index - 1];
  const { isCompleted } = getTechLessonCount(prevTech.id, progress);
  const { passed } = getTechExamStatus(prevTech.id, progress);

  return isCompleted && passed;
}

/**
 * Retorna os detalhes de desbloqueio de uma tecnologia.
 */
export function getTechUnlockState(techId: TechId, progress: UserProgress): TechUnlockState {
  const index = TECHNOLOGIES.findIndex(t => t.id === techId);
  const safeIndex = index >= 0 ? index : 0;
  const tech = TECHNOLOGIES[safeIndex];
  const totalTechs = TECHNOLOGIES.length;

  const { completed, total, isCompleted } = getTechLessonCount(tech.id, progress);
  const progressPct = total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;
  const examStatus = getTechExamStatus(tech.id, progress);

  // A primeira está sempre desbloqueada.
  // As seguintes dependem da conclusão E aprovação no exame (20/20) da anterior.
  let isUnlocked = safeIndex === 0;
  let prevTech: Technology | undefined = undefined;

  if (safeIndex > 0) {
    prevTech = TECHNOLOGIES[safeIndex - 1];
    const prevCount = getTechLessonCount(prevTech.id, progress);
    const prevExam = getTechExamStatus(prevTech.id, progress);
    isUnlocked = prevCount.isCompleted && prevExam.passed;
  }

  const nextTech = safeIndex < totalTechs - 1 ? TECHNOLOGIES[safeIndex + 1] : undefined;

  return {
    techId: tech.id,
    technology: tech,
    isUnlocked,
    isCompleted,
    completedLessons: completed,
    totalLessons: total,
    progressPct,
    isExamUnlocked: isCompleted,
    examPassed: examStatus.passed,
    examScore: examStatus.score,
    isExamUnderReview: examStatus.isUnderReview,
    examResultsReleaseAt: examStatus.releaseAt,
    examAttemptsCount: examStatus.attempts,
    prevTech,
    nextTech,
    orderNumber: safeIndex + 1,
    totalTechs,
  };
}

/**
 * Retorna um mapa com os estados de desbloqueio de todas as tecnologias.
 */
export function getAllTechUnlockStates(progress: UserProgress): Map<TechId, TechUnlockState> {
  const map = new Map<TechId, TechUnlockState>();
  let previousTechWasCompletedAndPassed = true; // Para o índice 0

  TECHNOLOGIES.forEach((tech, index) => {
    const { completed, total, isCompleted } = getTechLessonCount(tech.id, progress);
    const progressPct = total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;
    const examStatus = getTechExamStatus(tech.id, progress);

    const isUnlocked = index === 0 || previousTechWasCompletedAndPassed;
    const prevTech = index > 0 ? TECHNOLOGIES[index - 1] : undefined;
    const nextTech = index < TECHNOLOGIES.length - 1 ? TECHNOLOGIES[index + 1] : undefined;

    map.set(tech.id, {
      techId: tech.id,
      technology: tech,
      isUnlocked,
      isCompleted,
      completedLessons: completed,
      totalLessons: total,
      progressPct,
      isExamUnlocked: isCompleted,
      examPassed: examStatus.passed,
      examScore: examStatus.score,
      isExamUnderReview: examStatus.isUnderReview,
      examResultsReleaseAt: examStatus.releaseAt,
      examAttemptsCount: examStatus.attempts,
      prevTech,
      nextTech,
      orderNumber: index + 1,
      totalTechs: TECHNOLOGIES.length,
    });

    // A próxima só desbloqueia se esta estiver concluída COM NOTA 20 NO EXAME DE PASSAGEM
    previousTechWasCompletedAndPassed = isCompleted && examStatus.passed;
  });

  return map;
}

/**
 * Encontra a tecnologia atualmente ativa (a primeira desbloqueada que ainda não foi concluída)
 * ou a última desbloqueada se todas foram concluídas.
 */
export function getCurrentActiveTech(progress: UserProgress): Technology {
  const states = getAllTechUnlockStates(progress);
  for (const tech of TECHNOLOGIES) {
    const state = states.get(tech.id);
    if (state && state.isUnlocked && !state.isCompleted) {
      return tech;
    }
  }
  // Se completou todas, retorna a última
  return TECHNOLOGIES[0];
}

/**
 * Encontra a próxima aula recomendada a ser feita pelo usuário na trilha sequencial.
 */
export function getNextRecommendedLesson(progress: UserProgress): {
  tech: Technology;
  levelId: LevelId;
  lesson: Lesson;
} | null {
  const currentTech = getCurrentActiveTech(progress);
  
  for (const levelId of LEVELS) {
    const lessons = getLessonsForTechAndLevel(currentTech.id, levelId);
    for (const lesson of lessons) {
      if (!progress.completedLessons[lesson.id]) {
        return {
          tech: currentTech,
          levelId,
          lesson,
        };
      }
    }
  }

  return null;
}
