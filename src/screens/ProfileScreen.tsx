import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Shield, Moon, Sun, Download, Upload, RotateCcw, Smartphone, Check, AlertTriangle, X, Cloud, CloudOff, RefreshCw, Wifi, WifiOff, CheckCircle2 } from 'lucide-react';
import { UserProgress, SyncStatus } from '../types';
import { storageService } from '../services/storageService';
import { FooterStamp } from '../components/FooterStamp';
import { fadeInUp, modalVariant, backdropVariant } from '../utils/animations';

interface ProfileScreenProps {
  progress: UserProgress;
  syncStatus?: SyncStatus;
  onUpdateName: (name: string) => void;
  onToggleTheme: () => void;
  onExportData: () => void;
  onImportData: (jsonStr: string) => boolean;
  onResetProgress: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  progress,
  syncStatus,
  onUpdateName,
  onToggleTheme,
  onExportData,
  onImportData,
  onResetProgress,
}) => {
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
      showToast('Nome atualizado com sucesso!');
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
      showToast('Dados de progresso importados com êxito!');
    } else {
      alert('Arquivo ou formato JSON inválido.');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Patente do programador baseada em XP
  const getRankTitle = (xp: number) => {
    if (xp >= 1000) return { title: 'Mestre da Programação 👑', color: 'text-amber-400' };
    if (xp >= 500) return { title: 'Desenvolvedor Pleno 🚀', color: 'text-orange-400' };
    if (xp >= 200) return { title: 'Desenvolvedor Júnior 💻', color: 'text-blue-400' };
    return { title: 'Iniciante Curioso 🌱', color: 'text-emerald-400' };
  };

  const rank = getRankTitle(progress.xp);

  const formatLastSync = (isoString?: string | null) => {
    if (!isoString) return 'Nunca sincronizado';
    try {
      const d = new Date(isoString);
      return `Hoje às ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } catch {
      return 'Recentemente';
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
        className="p-6 rounded-3xl bg-[#1A1A1C] border border-white/10 text-center space-y-3 relative overflow-hidden shadow-xl"
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
                Salvar
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">{progress.userName}</h2>
              <button
                onClick={() => setIsEditingName(true)}
                className="text-[11px] text-orange-400 font-bold hover:underline uppercase tracking-wider touch-btn"
              >
                Editar
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
          CONFIGURAÇÕES DA PLATAFORMA
        </h3>

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
                Tema Escuro (Dark Mode)
              </span>
              <span className="text-[10px] text-[var(--text-muted)] font-medium">
                {progress.theme === 'dark' ? 'Ativado — Estética escura editorial' : 'Desativado — Modo Claro ativo'}
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
              {progress.theme === 'dark' ? 'Ativado' : 'Desativado'}
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
              <span className="text-xs font-bold text-white block">Exportar para App Mobile (Capacitor)</span>
              <span className="text-[10px] text-white/40">Instruções para gerar APK Android / iOS</span>
            </div>
          </div>
        </div>
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
            <span>SINCRONIZAÇÃO EM SEGUNDO PLANO</span>
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
            <span className="text-[var(--text-muted)]">Status da Nuvem:</span>
            <span className="font-bold text-[var(--text-primary)] flex items-center gap-1">
              {syncStatus?.isSyncing ? (
                <>
                  <RefreshCw className="w-3 h-3 text-blue-400 animate-spin" />
                  <span className="text-blue-400">Sincronizando fila...</span>
                </>
              ) : syncStatus && syncStatus.pendingCount > 0 ? (
                <span className="text-orange-400 font-bold">
                  {syncStatus.pendingCount} ação(ões) pendente(s)
                </span>
              ) : (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Totalmente Sincronizado
                </span>
              )}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--text-muted)]">Última Sincronização:</span>
            <span className="font-medium text-[var(--text-primary)]">
              {formatLastSync(progress.lastSyncedAt || syncStatus?.lastSyncedAt)}
            </span>
          </div>

          <div className="pt-2 border-t border-[var(--border-subtle)] text-[11px] text-[var(--text-muted)] leading-relaxed flex items-start gap-1.5">
            <Shield className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
            <span>
              Suporte offline ativo: você pode concluir aulas e quizzes mesmo sem internet. Os dados ficam salvos localmente e serão sincronizados automaticamente assim que a conexão for reestabelecida.
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
          <span>{isManualSyncing ? 'Sincronizando Dados...' : 'Sincronizar Agora'}</span>
        </motion.button>
      </motion.div>

      {/* Gerenciamento de Dados */}
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        className="p-4 rounded-2xl bg-[#1A1A1C] border border-white/10 space-y-3 shadow-md"
      >
        <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
          BACKUP & DADOS
        </h3>

        <div className="grid grid-cols-2 gap-2">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onExportData}
            className="flex items-center justify-center gap-2 p-3 bg-black/40 hover:bg-black/80 border border-white/10 hover:border-white/20 rounded-xl text-xs font-bold text-white transition-colors min-h-[44px] uppercase tracking-wider touch-btn"
          >
            <Download className="w-4 h-4 text-orange-400" />
            <span>Exportar JSON</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowImportModal(true)}
            className="flex items-center justify-center gap-2 p-3 bg-black/40 hover:bg-black/80 border border-white/10 hover:border-white/20 rounded-xl text-xs font-bold text-white transition-colors min-h-[44px] uppercase tracking-wider touch-btn"
          >
            <Upload className="w-4 h-4 text-orange-400" />
            <span>Importar JSON</span>
          </motion.button>
        </div>

        {/* Editorial Action Button */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onExportData}
          className="w-full py-3.5 border border-white/20 font-bold text-xs uppercase tracking-widest text-white hover:bg-white hover:text-black transition-colors rounded-xl shadow-sm touch-btn"
        >
          Exportar Relatório de Certificados
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowResetModal(true)}
          className="w-full mt-2 flex items-center justify-center gap-2 p-3 bg-red-950/30 hover:bg-red-900/40 border border-red-500/30 rounded-xl text-xs font-bold text-red-400 transition-colors min-h-[44px] uppercase tracking-wider touch-btn"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Resetar Todo o Progresso</span>
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
                    showToast('Progresso resetado com sucesso!');
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

