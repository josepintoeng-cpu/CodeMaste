import { UserProgress, TechId, SyncStatus, SyncQueueItem } from '../types';

const STORAGE_KEY = 'codemaster_user_progress_v1';
const SYNC_QUEUE_KEY = 'codemaster_sync_queue_v1';
const REMOTE_SNAPSHOT_KEY = 'codemaster_remote_cloud_snapshot_v1';

const getTodayKey = () => new Date().toISOString().split('T')[0];

const INITIAL_PROGRESS: UserProgress = {
  userId: 'user-' + Math.random().toString(36).substring(2, 9),
  userName: 'Dev Aprendiz',
  completedLessons: {},
  completedQuizzes: {},
  xp: 0,
  streak: 0,
  longestStreak: 0,
  lastAccess: new Date().toISOString(),
  lastLessonDate: undefined,
  lessonDates: [],
  theme: 'dark',
  language: 'pt',
  favoriteTechs: ['python', 'javascript', 'html'],
  unlockedBadges: ['primeiros_passos'],
  dailyXpHistory: {},
  lastSyncedAt: new Date().toISOString(),
};

type SyncStatusListener = (status: SyncStatus) => void;
type ProgressListener = (progress: UserProgress) => void;

class StorageEngine {
  private syncListeners: Set<SyncStatusListener> = new Set();
  private progressListeners: Set<ProgressListener> = new Set();
  private isSyncing = false;
  private syncTimeout: ReturnType<typeof setTimeout> | null = null;
  private isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.handleNetworkChange(true));
      window.addEventListener('offline', () => this.handleNetworkChange(false));

      // Sincronização entre abas abertas
      window.addEventListener('storage', (event) => {
        if (event.key === STORAGE_KEY && event.newValue) {
          try {
            const updated = JSON.parse(event.newValue);
            this.notifyProgress(updated);
          } catch {
            // ignore
          }
        }
      });

      // Auto-tentativa de sincronização inicial se houver itens pendentes
      setTimeout(() => {
        if (this.isOnline && this.getPendingQueue().length > 0) {
          this.triggerBackgroundSync();
        }
      }, 1500);
    }
  }

  private handleNetworkChange(online: boolean) {
    this.isOnline = online;
    this.notifySync();
    if (online) {
      this.triggerBackgroundSync(200);
    }
  }

  public subscribeSync(listener: SyncStatusListener): () => void {
    this.syncListeners.add(listener);
    listener(this.getSyncStatus());
    return () => this.syncListeners.delete(listener);
  }

  public subscribeProgress(listener: ProgressListener): () => void {
    this.progressListeners.add(listener);
    return () => this.progressListeners.delete(listener);
  }

  private notifySync() {
    const status = this.getSyncStatus();
    this.syncListeners.forEach(listener => {
      try {
        listener(status);
      } catch (err) {
        console.error('Erro no listener de sync:', err);
      }
    });
  }

  private notifyProgress(progress: UserProgress) {
    this.progressListeners.forEach(listener => {
      try {
        listener(progress);
      } catch (err) {
        console.error('Erro no listener de progresso:', err);
      }
    });
  }

  public getSyncStatus(): SyncStatus {
    const pending = this.getPendingQueue();
    const progress = this.getUserProgress();
    
    let statusType: SyncStatus['status'] = 'synced';
    if (!this.isOnline) {
      statusType = 'offline';
    } else if (this.isSyncing) {
      statusType = 'syncing';
    } else if (pending.length > 0) {
      statusType = 'pending';
    }

    return {
      isOnline: this.isOnline,
      isSyncing: this.isSyncing,
      pendingCount: pending.length,
      lastSyncedAt: progress.lastSyncedAt || null,
      status: statusType,
    };
  }

  private getPendingQueue(): SyncQueueItem[] {
    try {
      const queueStr = localStorage.getItem(SYNC_QUEUE_KEY);
      return queueStr ? JSON.parse(queueStr) : [];
    } catch {
      return [];
    }
  }

  private savePendingQueue(queue: SyncQueueItem[]): void {
    try {
      localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
      this.notifySync();
    } catch (e) {
      console.error('Erro ao salvar fila de sincronização:', e);
    }
  }

  private addToSyncQueue(type: SyncQueueItem['type'], payload: Record<string, unknown>): void {
    const queue = this.getPendingQueue();
    const newItem: SyncQueueItem = {
      id: 'sync-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      type,
      payload,
      timestamp: new Date().toISOString(),
    };
    queue.push(newItem);
    this.savePendingQueue(queue);

    if (this.isOnline) {
      this.triggerBackgroundSync();
    }
  }

  public triggerBackgroundSync(delayMs = 600): void {
    if (this.syncTimeout) {
      clearTimeout(this.syncTimeout);
    }

    this.syncTimeout = setTimeout(() => {
      this.processSyncQueue();
    }, delayMs);
  }

  /**
   * Processa a fila de operações e sincroniza com a nuvem/snapshot remoto
   */
  public async processSyncQueue(): Promise<boolean> {
    if (!this.isOnline || this.isSyncing) {
      return false;
    }

    const queue = this.getPendingQueue();
    if (queue.length === 0) {
      return true;
    }

    this.isSyncing = true;
    this.notifySync();

    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      const localProgress = this.getUserProgress();
      const remoteSnapshotStr = localStorage.getItem(REMOTE_SNAPSHOT_KEY);
      let mergedProgress = { ...localProgress };

      if (remoteSnapshotStr) {
        try {
          const remoteProgress: UserProgress = JSON.parse(remoteSnapshotStr);
          mergedProgress = {
            ...localProgress,
            xp: Math.max(localProgress.xp, remoteProgress.xp),
            streak: Math.max(localProgress.streak, remoteProgress.streak),
            longestStreak: Math.max(localProgress.longestStreak || 0, remoteProgress.longestStreak || 0),
            completedLessons: {
              ...remoteProgress.completedLessons,
              ...localProgress.completedLessons,
            },
            completedQuizzes: {
              ...remoteProgress.completedQuizzes,
              ...localProgress.completedQuizzes,
            },
            lessonDates: Array.from(new Set([
              ...(remoteProgress.lessonDates || []),
              ...(localProgress.lessonDates || []),
            ])),
            unlockedBadges: Array.from(new Set([
              ...(remoteProgress.unlockedBadges || []),
              ...(localProgress.unlockedBadges || []),
            ])),
            dailyXpHistory: {
              ...(remoteProgress.dailyXpHistory || {}),
              ...(localProgress.dailyXpHistory || {}),
            },
          };
        } catch {
          // ignore
        }
      }

      const nowIso = new Date().toISOString();
      mergedProgress.lastSyncedAt = nowIso;

      localStorage.setItem(REMOTE_SNAPSHOT_KEY, JSON.stringify(mergedProgress));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedProgress));
      this.savePendingQueue([]);

      this.isSyncing = false;
      this.notifySync();
      this.notifyProgress(mergedProgress);

      return true;
    } catch (error) {
      console.error('Falha na sincronização em segundo plano:', error);
      this.isSyncing = false;
      this.notifySync();
      return false;
    }
  }

  public async syncNow(): Promise<{ success: boolean; message: string }> {
    if (!this.isOnline) {
      return {
        success: false,
        message: 'Você está offline. Os dados serão sincronizados assim que a conexão voltar.',
      };
    }

    this.isSyncing = true;
    this.notifySync();

    try {
      const current = this.getUserProgress();
      current.lastSyncedAt = new Date().toISOString();
      this.saveUserProgress(current);

      await new Promise(resolve => setTimeout(resolve, 900));

      localStorage.setItem(REMOTE_SNAPSHOT_KEY, JSON.stringify(current));
      this.savePendingQueue([]);

      this.isSyncing = false;
      this.notifySync();
      this.notifyProgress(current);

      return {
        success: true,
        message: 'Progresso sincronizado com a nuvem com sucesso!',
      };
    } catch {
      this.isSyncing = false;
      this.notifySync();
      return {
        success: false,
        message: 'Erro ao sincronizar dados. Tentaremos novamente em segundo plano.',
      };
    }
  }

  /**
   * Obtém os dados do usuário, recalculando o streak baseado no histórico de lições
   */
  public getUserProgress(): UserProgress {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        this.saveUserProgress(INITIAL_PROGRESS);
        return INITIAL_PROGRESS;
      }

      const progress: UserProgress = JSON.parse(data);
      const updatedProgress = this.checkAndUpdateStreak(progress);
      return updatedProgress;
    } catch (e) {
      console.error('Erro ao ler localStorage:', e);
      return INITIAL_PROGRESS;
    }
  }

  public saveUserProgress(progress: UserProgress): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      this.notifyProgress(progress);
    } catch (e) {
      console.error('Erro ao salvar no localStorage:', e);
    }
  }

  /**
   * Marca uma aula como concluída, atualiza datas de estudo e recalcula a sequência diária (streak)
   */
  public completeLesson(lessonId: string, xpReward: number): UserProgress {
    const progress = this.getUserProgress();
    const todayKey = getTodayKey();

    if (!progress.completedLessons[lessonId]) {
      progress.completedLessons[lessonId] = true;
      progress.xp += xpReward;

      // Registra data da lição no histórico de streak
      const currentDates = new Set(progress.lessonDates || []);
      currentDates.add(todayKey);
      progress.lessonDates = Array.from(currentDates);
      progress.lastLessonDate = todayKey;

      // Registra XP diário
      progress.dailyXpHistory = progress.dailyXpHistory || {};
      progress.dailyXpHistory[todayKey] = (progress.dailyXpHistory[todayKey] || 0) + xpReward;

      // Recalcula a sequência consecutiva de dias
      this.recalculateStreak(progress);

      // Avalia conquistas desbloqueadas
      progress.unlockedBadges = this.evaluateBadges(progress);

      this.saveUserProgress(progress);
      this.addToSyncQueue('COMPLETE_LESSON', { lessonId, xpReward, date: todayKey });
    }

    return progress;
  }

  public completeQuiz(quizId: string, score: number, passed: boolean, xpReward: number): UserProgress {
    const progress = this.getUserProgress();
    const existing = progress.completedQuizzes[quizId];
    const todayKey = getTodayKey();

    if (!existing || (!existing.passed && passed)) {
      progress.completedQuizzes[quizId] = { score, passed };
      if (passed) {
        progress.xp += xpReward;

        progress.dailyXpHistory = progress.dailyXpHistory || {};
        progress.dailyXpHistory[todayKey] = (progress.dailyXpHistory[todayKey] || 0) + xpReward;

        // Quizzes aprovados também contam como atividade de estudo diária
        const currentDates = new Set(progress.lessonDates || []);
        currentDates.add(todayKey);
        progress.lessonDates = Array.from(currentDates);
        progress.lastLessonDate = todayKey;
        this.recalculateStreak(progress);
      }
      progress.unlockedBadges = this.evaluateBadges(progress);
      this.saveUserProgress(progress);
      this.addToSyncQueue('COMPLETE_QUIZ', { quizId, score, passed, xpReward });
    }

    return progress;
  }

  public updateUserName(name: string): UserProgress {
    const progress = this.getUserProgress();
    progress.userName = name;
    this.saveUserProgress(progress);
    this.addToSyncQueue('UPDATE_PROFILE', { userName: name });
    return progress;
  }

  public setTheme(theme: 'dark' | 'light'): UserProgress {
    const progress = this.getUserProgress();
    progress.theme = theme;
    this.saveUserProgress(progress);
    this.addToSyncQueue('THEME_CHANGE', { theme });
    return progress;
  }

  public setLanguage(language: 'pt' | 'en'): UserProgress {
    const progress = this.getUserProgress();
    progress.language = language;
    this.saveUserProgress(progress);
    this.addToSyncQueue('UPDATE_PROFILE', { language });
    return progress;
  }

  public toggleFavoriteTech(techId: TechId): UserProgress {
    const progress = this.getUserProgress();
    if (progress.favoriteTechs.includes(techId)) {
      progress.favoriteTechs = progress.favoriteTechs.filter(t => t !== techId);
    } else {
      progress.favoriteTechs.push(techId);
    }
    this.saveUserProgress(progress);
    this.addToSyncQueue('UPDATE_PROFILE', { favoriteTechs: progress.favoriteTechs });
    return progress;
  }

  public resetProgress(): UserProgress {
    const reset: UserProgress = {
      ...INITIAL_PROGRESS,
      userId: 'user-' + Math.random().toString(36).substring(2, 9),
      lastAccess: new Date().toISOString(),
      lastSyncedAt: new Date().toISOString(),
      lessonDates: [],
      streak: 0,
      longestStreak: 0,
    };
    this.saveUserProgress(reset);
    localStorage.removeItem(SYNC_QUEUE_KEY);
    localStorage.removeItem(REMOTE_SNAPSHOT_KEY);
    this.notifySync();
    return reset;
  }

  public exportDataJSON(): string {
    const progress = this.getUserProgress();
    return JSON.stringify(progress, null, 2);
  }

  public importDataJSON(jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed && typeof parsed.xp === 'number' && parsed.completedLessons) {
        parsed.lastSyncedAt = new Date().toISOString();
        this.recalculateStreak(parsed);
        this.saveUserProgress(parsed);
        this.addToSyncQueue('UPDATE_PROFILE', { imported: true });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  /**
   * Recalcula a sequência consecutiva de dias (streak) com base nas datas de lições completadas
   */
  public recalculateStreak(progress: UserProgress): void {
    const datesSet = new Set(progress.lessonDates || []);

    // Se o usuário tem lições completadas mas a lista de datas está vazia (dados legados), migra para hoje
    if (datesSet.size === 0 && Object.keys(progress.completedLessons || {}).length > 0) {
      const todayKey = getTodayKey();
      datesSet.add(todayKey);
      progress.lessonDates = [todayKey];
    }

    if (datesSet.size === 0) {
      progress.streak = 0;
      progress.longestStreak = progress.longestStreak || 0;
      return;
    }

    const today = new Date();
    const todayKey = getTodayKey();

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayKey = yesterday.toISOString().split('T')[0];

    const completedToday = datesSet.has(todayKey);
    const completedYesterday = datesSet.has(yesterdayKey);

    let streak = 0;
    if (completedToday) {
      streak = 1;
      let checkDate = new Date(today);
      while (true) {
        checkDate.setDate(checkDate.getDate() - 1);
        const checkKey = checkDate.toISOString().split('T')[0];
        if (datesSet.has(checkKey)) {
          streak++;
        } else {
          break;
        }
      }
    } else if (completedYesterday) {
      // Ontem foi completado, sequência mantida à espera da aula de hoje!
      streak = 1;
      let checkDate = new Date(yesterday);
      while (true) {
        checkDate.setDate(checkDate.getDate() - 1);
        const checkKey = checkDate.toISOString().split('T')[0];
        if (datesSet.has(checkKey)) {
          streak++;
        } else {
          break;
        }
      }
    } else {
      // Mais de 1 dia sem lição completa: sequência resetada para 0
      streak = 0;
    }

    progress.streak = streak;
    progress.longestStreak = Math.max(progress.longestStreak || 0, streak);
  }

  /**
   * Verifica e atualiza status da sequência no carregamento diário
   */
  public checkAndUpdateStreak(progress: UserProgress): UserProgress {
    this.recalculateStreak(progress);
    progress.lastAccess = new Date().toISOString();
    return progress;
  }

  /**
   * Avalia selos / conquistas do aluno
   */
  public evaluateBadges(progress: UserProgress): string[] {
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
}

export const storageService = new StorageEngine();
