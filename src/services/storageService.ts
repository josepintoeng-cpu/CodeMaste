import { UserProgress, TechId, LevelId } from '../types';

const STORAGE_KEY = 'codemaster_user_progress_v1';

const INITIAL_PROGRESS: UserProgress = {
  userId: 'user-' + Math.random().toString(36).substring(2, 9),
  userName: 'Dev Aprendiz',
  completedLessons: {},
  completedQuizzes: {},
  xp: 0,
  streak: 1,
  lastAccess: new Date().toISOString(),
  theme: 'dark',
  favoriteTechs: ['python', 'javascript', 'html'],
  unlockedBadges: ['primeiros_passos'],
};

/**
 * Service de persistência em localStorage preparado para futura migração para Firebase / Supabase
 */
export const storageService = {
  /**
   * Obtém os dados do usuário, atualizando a sequência de dias (streak) caso necessário.
   */
  getUserProgress(): UserProgress {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        this.saveUserProgress(INITIAL_PROGRESS);
        return INITIAL_PROGRESS;
      }

      const progress: UserProgress = JSON.parse(data);
      
      // Atualiza o streak baseado na data de último acesso
      const updatedProgress = this.checkAndUpdateStreak(progress);
      return updatedProgress;
    } catch (e) {
      console.error('Erro ao ler localStorage:', e);
      return INITIAL_PROGRESS;
    }
  },

  /**
   * Salva os dados do usuário no localStorage
   */
  saveUserProgress(progress: UserProgress): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error('Erro ao salvar no localStorage:', e);
    }
  },

  /**
   * Marca uma aula como concluída e adiciona XP
   */
  completeLesson(lessonId: string, xpReward: number): UserProgress {
    const progress = this.getUserProgress();
    
    if (!progress.completedLessons[lessonId]) {
      progress.completedLessons[lessonId] = true;
      progress.xp += xpReward;
      
      // Verifica novos badges desbloqueados
      progress.unlockedBadges = this.evaluateBadges(progress);
      
      this.saveUserProgress(progress);
    }
    
    return progress;
  },

  /**
   * Registra a conclusão de um Quiz
   */
  completeQuiz(quizId: string, score: number, passed: boolean, xpReward: number): UserProgress {
    const progress = this.getUserProgress();
    const existing = progress.completedQuizzes[quizId];

    if (!existing || (!existing.passed && passed)) {
      progress.completedQuizzes[quizId] = { score, passed };
      if (passed) {
        progress.xp += xpReward;
      }
      progress.unlockedBadges = this.evaluateBadges(progress);
      this.saveUserProgress(progress);
    }

    return progress;
  },

  /**
   * Atualiza o nome do perfil do usuário
   */
  updateUserName(name: string): UserProgress {
    const progress = this.getUserProgress();
    progress.userName = name;
    this.saveUserProgress(progress);
    return progress;
  },

  /**
   * Alterna o tema (dark / light)
   */
  setTheme(theme: 'dark' | 'light'): UserProgress {
    const progress = this.getUserProgress();
    progress.theme = theme;
    this.saveUserProgress(progress);
    return progress;
  },

  /**
   * Alterna tecnologia nos favoritos
   */
  toggleFavoriteTech(techId: TechId): UserProgress {
    const progress = this.getUserProgress();
    if (progress.favoriteTechs.includes(techId)) {
      progress.favoriteTechs = progress.favoriteTechs.filter(t => t !== techId);
    } else {
      progress.favoriteTechs.push(techId);
    }
    this.saveUserProgress(progress);
    return progress;
  },

  /**
   * Reseta o progresso para o estado inicial
   */
  resetProgress(): UserProgress {
    const reset = {
      ...INITIAL_PROGRESS,
      userId: 'user-' + Math.random().toString(36).substring(2, 9),
      lastAccess: new Date().toISOString(),
    };
    this.saveUserProgress(reset);
    return reset;
  },

  /**
   * Exporta os dados do usuário para arquivo JSON
   */
  exportDataJSON(): string {
    const progress = this.getUserProgress();
    return JSON.stringify(progress, null, 2);
  },

  /**
   * Importa dados a partir de uma string JSON
   */
  importDataJSON(jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed && typeof parsed.xp === 'number' && parsed.completedLessons) {
        this.saveUserProgress(parsed);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  /**
   * Lógica interna de verificação da sequência de dias consecutivos
   */
  checkAndUpdateStreak(progress: UserProgress): UserProgress {
    const now = new Date();
    const lastAccessDate = new Date(progress.lastAccess);

    const isSameDay =
      now.getFullYear() === lastAccessDate.getFullYear() &&
      now.getMonth() === lastAccessDate.getMonth() &&
      now.getDate() === lastAccessDate.getDate();

    if (isSameDay) {
      return progress;
    }

    // Calcula diferença em dias (zerando horas para comparar datas)
    const todayZero = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const lastZero = new Date(lastAccessDate.getFullYear(), lastAccessDate.getMonth(), lastAccessDate.getDate());
    const diffDays = Math.round((todayZero.getTime() - lastZero.getTime()) / (1000 * 3600 * 24));

    if (diffDays === 1) {
      // Acessou no dia seguinte! Aumenta o streak
      progress.streak += 1;
    } else if (diffDays > 1) {
      // Perdeu um dia, reseta para 1
      progress.streak = 1;
    }

    progress.lastAccess = now.toISOString();
    this.saveUserProgress(progress);
    return progress;
  },

  /**
   * Avalia selos / conquistas do aluno
   */
  evaluateBadges(progress: UserProgress): string[] {
    const badges = new Set<string>(progress.unlockedBadges || ['primeiros_passos']);

    const lessonCount = Object.keys(progress.completedLessons).length;
    if (lessonCount >= 1) badges.add('primeira_aula');
    if (lessonCount >= 5) badges.add('dedicado_5');
    if (lessonCount >= 15) badges.add('mestre_15');

    if (progress.xp >= 100) badges.add('xp_100');
    if (progress.xp >= 500) badges.add('xp_500');
    if (progress.xp >= 1000) badges.add('xp_1000');

    if (progress.streak >= 3) badges.add('streak_3');
    if (progress.streak >= 7) badges.add('streak_7');

    return Array.from(badges);
  }
};
