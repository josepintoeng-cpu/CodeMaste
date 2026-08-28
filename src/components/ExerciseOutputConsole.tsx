import React, { useState } from 'react';
import { Terminal, CheckCircle2, AlertCircle, RefreshCw, Eye, Code, Play } from 'lucide-react';
import { ExecutionResult } from '../services/codeRunnerService';

interface ExerciseOutputConsoleProps {
  codeOrCommand: string;
  result: ExecutionResult | null;
  isLoading: boolean;
  language: string;
  simulationType?: string;
  onReRun?: () => void;
}

export const ExerciseOutputConsole: React.FC<ExerciseOutputConsoleProps> = ({
  codeOrCommand,
  result,
  isLoading,
  language,
  simulationType = 'simulated',
  onReRun,
}) => {
  const [activeTab, setActiveTab] = useState<'terminal' | 'preview'>(
    language === 'html' || language === 'css' ? 'preview' : 'terminal'
  );

  if (!result && !isLoading) {
    return null;
  }

  const isHtml = language === 'html' || language === 'css';

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl my-3 transition-all">
      {/* Console Header */}
      <div className="flex items-center justify-between px-3.5 sm:px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-black text-slate-200 uppercase tracking-wider">
            Compilação & Execução do Exercício
          </span>
          <span className="text-[10px] bg-slate-800 text-orange-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-slate-700">
            {language}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* HTML Toggle Tab */}
          {isHtml && (
            <div className="flex bg-slate-800/80 p-0.5 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 ${
                  activeTab === 'preview'
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Visualizar</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('terminal')}
                className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 ${
                  activeTab === 'terminal'
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>Log</span>
              </button>
            </div>
          )}

          {onReRun && (
            <button
              type="button"
              onClick={onReRun}
              disabled={isLoading}
              className="flex items-center gap-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg transition-colors border border-slate-700 font-semibold disabled:opacity-50"
              title="Re-executar código"
            >
              <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Re-executar</span>
            </button>
          )}
        </div>
      </div>

      {/* Execution Body */}
      <div className="p-3.5 sm:p-4 bg-slate-950 font-mono text-xs sm:text-sm">
        {isLoading ? (
          <div className="flex items-center gap-2.5 text-emerald-400 py-3">
            <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
            <span className="font-sans font-medium text-xs sm:text-sm">
              Processando e compilando código/comando em tempo real...
            </span>
          </div>
        ) : result ? (
          <div>
            {result.error ? (
              <div className="bg-red-950/40 border border-red-800/80 rounded-xl p-3.5 text-red-300 space-y-1">
                <div className="flex items-center gap-2 font-bold text-red-400 text-xs uppercase tracking-wider">
                  <AlertCircle className="w-4 h-4" />
                  <span>Erro de Compilação / Execução (Exit Code: 1)</span>
                </div>
                <pre className="whitespace-pre-wrap font-mono text-xs text-red-200 mt-1 leading-relaxed">
                  {result.error}
                </pre>
              </div>
            ) : (
              <div>
                {isHtml && activeTab === 'preview' ? (
                  <div className="rounded-xl border border-slate-800 bg-white overflow-hidden p-2 min-h-[120px]">
                    <iframe
                      title="Preview do Exercício"
                      srcDoc={`<!DOCTYPE html><html><head><style>body { font-family: system-ui, sans-serif; padding: 12px; margin: 0; color: #0f172a; }</style></head><body>${codeOrCommand}</body></html>`}
                      className="w-full h-full min-h-[100px] border-0"
                      sandbox="allow-scripts"
                    />
                  </div>
                ) : (
                  <div className="bg-slate-900/90 border border-emerald-500/30 rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px] uppercase tracking-wider">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Compilado com Sucesso (Exit Code: 0)</span>
                      </div>
                      {result.executionTimeMs !== undefined && (
                        <span className="text-[10px] text-slate-400 font-mono">
                          {result.executionTimeMs} ms
                        </span>
                      )}
                    </div>
                    <pre className="whitespace-pre-wrap font-mono text-xs sm:text-sm text-slate-100 leading-relaxed overflow-x-auto">
                      {result.output}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};
