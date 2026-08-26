import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Shield, Moon, Sun, Download, Upload, RotateCcw, Smartphone, Check, AlertTriangle, X, Cloud, CloudOff, RefreshCw, Wifi, WifiOff, CheckCircle2, Globe, Info, Sparkles, ChevronRight } from 'lucide-react';
import { UserProgress, SyncStatus } from '../types';
import { storageService } from '../services/storageService';
import { FooterStamp } from '../components/FooterStamp';
import { fadeInUp, modalVariant, backdropVariant } from '../utils/animations';
import { useI18n } from '../i18n';

interface ProfileScreenProps {
  progress: UserProgress;
  syncStatus?: SyncStatus;
  onUpdateName: (name: string) => void;
  onToggleTheme: () => void;
  onExportData: () => void;
  onImportData: (jsonStr: string) => boolean;
  onResetProgress: () => void;
  onOpenWelcome?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  progress,
  syncStatus,
  onUpdateName,
  onToggleTheme,
  onExportData,
  onImportData,
  onResetProgress,
  onOpenWelcome,
}) => {
  const { t, language, setLanguage } = useI18n();
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(progress.userName);
  const [importJson, setImportJson] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showMobileModal, setShowMobileModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isManualSyncing, setIsManualSyncing] = useState(false);

  const handleSaveName = () => {
    if (nameInput.trim()) {
      onUpdateName(nameInput.trim());
      setIsEditingName(false);
      showToast(language === 'pt' ? 'Nome atualizado com sucesso!' : 'Name updated successfully!');
    }
  };

  const handleManualSync = async () => {
    setIsManualSyncing(true);
    const result = await storageService.syncNow();
    setIsManualSyncing(false);
    showToast(result.message);
  };

  const handleDoImport = () => {
    const ok = onImportData(importJson);
    if (ok) {
      setShowImportModal(false);
      setImportJson('');
      showToast(language === 'pt' ? 'Dados de progresso importados com êxito!' : 'Progress data imported successfully!');
    } else {
      alert(language === 'pt' ? 'Arquivo ou formato JSON inválido.' : 'Invalid JSON file or format.');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Patente do programador baseada em XP
  const getRankTitle = (xp: number) => {
    if (xp >= 1000) {
      return {
        title: language === 'pt' ? 'Mestre da Programação 👑' : 'Programming Master 👑',
        color: 'text-amber-400'
      };
    }
    if (xp >= 500) {
      return {
        title: language === 'pt' ? 'Desenvolvedor Pleno 🚀' : 'Mid-Level Developer 🚀',
        color: 'text-orange-400'
      };
    }
    if (xp >= 200) {
      return {
        title: language === 'pt' ? 'Desenvolvedor Júnior 💻' : 'Junior Developer 💻',
        color: 'text-blue-400'
      };
    }
    return {
      title: language === 'pt' ? 'Iniciante Curioso 🌱' : 'Curious Beginner 🌱',
      color: 'text-emerald-400'
    };
  };

  const rank = getRankTitle(progress.xp);

  const formatLastSync = (isoString?: string | null) => {
    if (!isoString) return language === 'pt' ? 'Nunca sincronizado' : 'Never synced';
    try {
      const d = new Date(isoString);
      return language === 'pt'
        ? `Hoje às ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
        : `Today at ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } catch {
      return language === 'pt' ? 'Recentemente' : 'Recently';
    }
  };

  return (
    <div className="pb-24 pt-4 px-4 max-w-md md:max-w-2xl mx-auto space-y-5">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-orange-500 text-black font-extrabold text-xs px-4 py-2 rounded-full shadow-2xl flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Profile Card */}
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-center space-y-3 relative overflow-hidden shadow-xl"
      >
        <div className="w-20 h-20 rounded-2xl bg-orange-500/20 text-orange-500 border border-orange-500/30 mx-auto flex items-center justify-center font-black text-2xl shadow-xl">
          <Shield className="w-10 h-10 text-orange-500" />
        </div>

        <div>
          {isEditingName ? (
            <div className="flex items-center justify-center gap-2 max-w-xs mx-auto">
              <input
                type="text"
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-black border border-white/20 text-white text-sm font-bold focus:outline-none focus:border-orange-500 w-full"
              />
              <button
                onClick={handleSaveName}
                className="px-3.5 py-1.5 bg-orange-500 text-black font-extrabold text-xs rounded-xl uppercase tracking-wider touch-btn"
              >
                {t('profile.save')}
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">{progress.userName}</h2>
              <button
                onClick={() => setIsEditingName(true)}
                className="text-[11px] text-orange-400 font-bold hover:underline uppercase tracking-wider touch-btn"
              >
                {t('profile.edit')}
              </button>
            </div>
          )}

          <span className={`text-xs font-bold block mt-1 uppercase tracking-wider ${rank.color}`}>
            {rank.title}
          </span>
        </div>
      </motion.div>

      {/* Opções de Configuração */}
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-3 shadow-md"
      >
        <h3 className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
          {t('profile.platformSettings')}
        </h3>

        {/* Idioma / Language */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500 shrink-0">
              <Globe className="w-4 h-4 text-orange-500" />
            </div>
            <div>
              <span className="text-xs font-bold text-[var(--text-primary)] block">
                {t('profile.languageOption')}
              </span>
              <span className="text-[10px] text-[var(--text-muted)] font-medium">
                {language === 'pt' ? 'Português (Brasil)' : 'English (US)'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-[var(--bg-card)] p-1 rounded-xl border border-[var(--border-subtle)]">
            <button
              onClick={() => setLanguage('pt')}
              className={`px-2.5 py-1 text-[11px] font-extrabold rounded-lg transition-all ${
                language === 'pt'
                  ? 'bg-orange-500 text-black shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              PT
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 text-[11px] font-extrabold rounded-lg transition-all ${
                language === 'en'
                  ? 'bg-orange-500 text-black shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              EN
            </button>
          </div>
        </div>

        {/* Alternar Tema */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500 shrink-0">
              {progress.theme === 'dark' ? (
                <Moon className="w-4 h-4 fill-orange-500" />
              ) : (
                <Sun className="w-4 h-4 fill-orange-500" />
              )}
            </div>
            <div>
              <span className="text-xs font-bold text-[var(--text-primary)] block">
                {t('profile.darkMode')}
              </span>
              <span className="text-[10px] text-[var(--text-muted)] font-medium">
                {progress.theme === 'dark' ? t('profile.darkModeOn') : t('profile.darkModeOff')}
              </span>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onToggleTheme}
            className={`px-3 py-1.5 text-[11px] font-bold rounded-xl transition-all touch-btn min-h-[38px] flex items-center gap-2 border ${
              progress.theme === 'dark'
                ? 'bg-orange-500 text-black border-orange-400 shadow-sm'
                : 'bg-[var(--bg-card)] text-[var(--text-primary)] border-[var(--border-strong)]'
            }`}
            title={`Alternar Tema (Atualmente: ${progress.theme === 'dark' ? 'Ativado' : 'Desativado'})`}
          >
            <span className="uppercase tracking-wider">
              {progress.theme === 'dark' ? t('profile.enabled') : t('profile.disabled')}
            </span>
            <div className={`w-7 h-4 rounded-full transition-colors relative p-0.5 ${progress.theme === 'dark' ? 'bg-black/40' : 'bg-slate-300'}`}>
              <div className={`w-3 h-3 rounded-full transition-transform ${progress.theme === 'dark' ? 'translate-x-3 bg-white' : 'translate-x-0 bg-slate-600'}`} />
            </div>
          </motion.button>
        </div>

        {/* Empacotamento Mobile / PWA */}
        <div
          onClick={() => setShowMobileModal(true)}
          className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5 cursor-pointer hover:border-white/20 transition-colors touch-btn"
        >
          <div className="flex items-center gap-2.5">
            <Smartphone className="w-4 h-4 text-orange-400" />
            <div>
              <span className="text-xs font-bold text-[var(--text-primary)] block">{t('profile.exportMobile')}</span>
              <span className="text-[10px] text-[var(--text-muted)]">{t('profile.exportMobileSubtitle')}</span>
            </div>
          </div>
        </div>

        {/* Apresentação do Projeto & Desenvolvedor */}
        {onOpenWelcome && (
          <div
            onClick={onOpenWelcome}
            className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent border border-orange-500/30 cursor-pointer hover:border-orange-500/50 transition-all touch-btn"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-orange-400 block">{t('welcome.navAbout')}</span>
                <span className="text-[10px] text-[var(--text-muted)]">
                  {language === 'pt' ? 'Finalidade, metodologia e criador' : 'Purpose, methodology & developer'}
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-orange-400" />
          </div>
        )}
      </motion.div>

      {/* Sincronização Inteligente & Persistência Offline */}
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-3 shadow-md"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest flex items-center gap-1.5">
            <Cloud className="w-3.5 h-3.5 text-orange-500" />
            <span>{t('profile.backgroundSync')}</span>
          </h3>
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
              syncStatus && !syncStatus.isOnline
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : syncStatus?.isSyncing
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            }`}
          >
            {syncStatus && !syncStatus.isOnline ? (
              <>
                <WifiOff className="w-3 h-3" />
                <span>Offline</span>
              </>
            ) : (
              <>
                <Wifi className="w-3 h-3" />
                <span>Online</span>
              </>
            )}
          </span>
        </div>

        {/* Detalhes de Conectividade e Fila */}
        <div className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--text-muted)]">{t('profile.cloudStatus')}</span>
            <span className="font-bold text-[var(--text-primary)] flex items-center gap-1">
              {syncStatus?.isSyncing ? (
                <>
                  <RefreshCw className="w-3 h-3 text-blue-400 animate-spin" />
                  <span className="text-blue-400">{t('profile.syncingQueue')}</span>
                </>
              ) : syncStatus && syncStatus.pendingCount > 0 ? (
                <span className="text-orange-400 font-bold">
                  {syncStatus.pendingCount} {language === 'pt' ? 'ação(ões) pendente(s)' : 'pending action(s)'}
                </span>
              ) : (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {t('profile.fullySynced')}
                </span>
              )}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--text-muted)]">{t('profile.lastSync')}</span>
            <span className="font-medium text-[var(--text-primary)]">
              {formatLastSync(progress.lastSyncedAt || syncStatus?.lastSyncedAt)}
            </span>
          </div>

          <div className="pt-2 border-t border-[var(--border-subtle)] text-[11px] text-[var(--text-muted)] leading-relaxed flex items-start gap-1.5">
            <Shield className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
            <span>
              {language === 'pt'
                ? 'Suporte offline ativo: você pode concluir aulas e quizzes mesmo sem internet. Os dados ficam salvos localmente e serão sincronizados automaticamente assim que a conexão for reestabelecida.'
                : 'Active offline support: you can complete lessons and quizzes even without internet. Data is saved locally and will sync automatically once connection is restored.'}
            </span>
          </div>
        </div>

        {/* Botão de Sincronização Manual */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleManualSync}
          disabled={isManualSyncing}
          className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-orange-500/10 via-orange-500/20 to-orange-500/10 hover:bg-orange-500/30 border border-orange-500/30 rounded-xl text-xs font-bold text-orange-400 uppercase tracking-wider transition-all disabled:opacity-50 touch-btn"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isManualSyncing ? 'animate-spin' : ''}`} />
          <span>{isManualSyncing ? t('profile.syncingData') : t('profile.syncNow')}</span>
        </motion.button>
      </motion.div>

      {/* Gerenciamento de Dados */}
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-3 shadow-md"
      >
        <h3 className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
          {t('profile.backupData')}
        </h3>

        <div className="grid grid-cols-2 gap-2">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onExportData}
            className="flex items-center justify-center gap-2 p-3 bg-black/40 hover:bg-black/80 border border-white/10 hover:border-white/20 rounded-xl text-xs font-bold text-[var(--text-primary)] transition-colors min-h-[44px] uppercase tracking-wider touch-btn"
          >
            <Download className="w-4 h-4 text-orange-400" />
            <span>{t('profile.exportJson')}</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowImportModal(true)}
            className="flex items-center justify-center gap-2 p-3 bg-black/40 hover:bg-black/80 border border-white/10 hover:border-white/20 rounded-xl text-xs font-bold text-[var(--text-primary)] transition-colors min-h-[44px] uppercase tracking-wider touch-btn"
          >
            <Upload className="w-4 h-4 text-orange-400" />
            <span>{t('profile.importJson')}</span>
          </motion.button>
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowResetModal(true)}
          className="w-full flex items-center justify-center gap-2 p-3 bg-red-950/30 hover:bg-red-900/40 border border-red-500/30 rounded-xl text-xs font-bold text-red-400 transition-colors min-h-[44px] uppercase tracking-wider touch-btn"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{t('profile.resetAllProgress')}</span>
        </motion.button>
      </motion.div>

      {/* Modal Importar JSON */}
      <AnimatePresence>
        {showImportModal && (
          <motion.div
            variants={backdropVariant}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              variants={modalVariant}
              initial="initial"
              animate="animate"
              exit="exit"
              className="bg-[#1A1A1C] border border-white/10 rounded-2xl p-5 max-w-sm w-full space-y-3"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-white">Importar Backup de Progresso</h3>
                <button onClick={() => setShowImportModal(false)} className="touch-btn">
                  <X className="w-5 h-5 text-white/40" />
                </button>
              </div>
              <p className="text-xs text-white/50">Cole o conteúdo do seu arquivo JSON exportado abaixo:</p>
              <textarea
                value={importJson}
                onChange={e => setImportJson(e.target.value)}
                placeholder='{"userId": "...", "xp": 100, ...}'
                className="w-full h-28 bg-black border border-white/10 p-3 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-orange-500"
              />
              <button
                onClick={handleDoImport}
                className="w-full py-2.5 bg-orange-500 text-black font-extrabold text-xs rounded-xl uppercase tracking-wider touch-btn"
              >
                Restaurar Dados
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Confirmar Reset */}
      <AnimatePresence>
        {showResetModal && (
          <motion.div
            variants={backdropVariant}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              variants={modalVariant}
              initial="initial"
              animate="animate"
              exit="exit"
              className="bg-[#1A1A1C] border border-white/10 rounded-2xl p-5 max-w-sm w-full space-y-3 text-center"
            >
              <AlertTriangle className="w-10 h-10 text-red-500 mx-auto" />
              <h3 className="text-sm font-bold text-white">Tem certeza absoluta?</h3>
              <p className="text-xs text-white/50">
                Isso apagará permanentemente todo o seu XP, conquistas e progresso de aulas salvas no localStorage.
              </p>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowResetModal(false)}
                  className="flex-1 py-2.5 bg-white/10 text-white font-bold text-xs rounded-xl uppercase tracking-wider touch-btn"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    onResetProgress();
                    setShowResetModal(false);
                    showToast(language === 'pt' ? 'Progresso resetado com sucesso!' : 'Progress reset successfully!');
                  }}
                  className="flex-1 py-2.5 bg-red-600 text-white font-bold text-xs rounded-xl uppercase tracking-wider touch-btn"
                >
                  Resetar Tudo
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Guia Mobile / Capacitor */}
      <AnimatePresence>
        {showMobileModal && (
          <motion.div
            variants={backdropVariant}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              variants={modalVariant}
              initial="initial"
              animate="animate"
              exit="exit"
              className="bg-[#1A1A1C] border border-white/10 rounded-2xl p-5 max-w-md w-full space-y-3 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-orange-400" />
                  Guia de Empacotamento Mobile (Capacitor)
                </h3>
                <button onClick={() => setShowMobileModal(false)} className="touch-btn">
                  <X className="w-5 h-5 text-white/40" />
                </button>
              </div>

              <div className="text-xs text-white/80 space-y-2 leading-relaxed">
                <p>Este app foi construído de forma 100% mobile-first para rodar como <strong>PWA</strong> ou ser empacotado como app nativo Android/iOS via <strong>Capacitor</strong>.</p>
                
                <div className="bg-black p-3 rounded-xl border border-white/10 font-mono text-[11px] space-y-1.5 text-orange-400">
                  <div># 1. Exportar e instalar Capacitor</div>
                  <div>npm install @capacitor/core @capacitor/cli</div>
                  <div># 2. Inicializar configuração mobile</div>
                  <div>npx cap init CodeMaster com.codemaster.app</div>
                  <div># 3. Gerar build web de produção</div>
                  <div>npm run build</div>
                  <div># 4. Adicionar plataforma Android</div>
                  <div>npx cap add android</div>
                  <div># 5. Abrir no Android Studio</div>
                  <div>npx cap open android</div>
                </div>

                <p className="text-white/40 text-[11px]">Consulte o arquivo README.md no projeto para detalhes completos.</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <FooterStamp />
    </div>
  );
};


