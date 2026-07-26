import React, { useState } from 'react';
import { Play, RefreshCw, Terminal, CheckCircle2, AlertCircle, Eye } from 'lucide-react';
import { SimulationConfig } from '../types';
import { codeRunnerService, ExecutionResult } from '../services/codeRunnerService';

interface CodeSimulatorProps {
  code: string;
  simulation: SimulationConfig;
  language: string;
}

export const CodeSimulator: React.FC<CodeSimulatorProps> = ({
  code,
  simulation,
  language,
}) => {
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [activeView, setActiveView] = useState<'terminal' | 'preview'>(
    simulation.type === 'real_html' ? 'preview' : 'terminal'
  );

  const handleRun = async () => {
    setIsRunning(true);
    setResult(null);

    // Pequena pausa visual para sensação de compilação/execução
    setTimeout(async () => {
      const res = await codeRunnerService.runCode(code, simulation, language);
      setResult(res);
      setIsRunning(false);
    }, 250);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-md my-4">
      {/* Simulation Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-slate-200 tracking-wide">
            {simulation.type === 'real_html'
              ? 'Preview HTML/CSS'
              : simulation.type === 'simulated'
              ? 'Console (Simulado)'
              : 'Console Interativo'}
          </span>
          {simulation.type === 'simulated' && (
            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-medium">
              Didático
            </span>
          )}
        </div>

        {/* View mode toggle for HTML/CSS */}
        {simulation.type === 'real_html' && (
          <div className="flex bg-slate-800 p-0.5 rounded-lg text-xs">
            <button
              onClick={() => setActiveView('preview')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeView === 'preview'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5 inline mr-1" />
              Resultado
            </button>
            <button
              onClick={() => setActiveView('terminal')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeView === 'terminal'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Log
            </button>
          </div>
        )}

        <button
          onClick={handleRun}
          disabled={isRunning}
          className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 disabled:opacity-50 text-slate-950 font-extrabold text-xs px-3.5 py-1.5 rounded-lg transition-all shadow-sm min-h-[36px]"
        >
          {isRunning ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Executando...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>Executar Código</span>
            </>
          )}
        </button>
      </div>

      {/* Main Console / Preview Area */}
      <div className="p-4 font-mono text-xs sm:text-sm min-h-[100px] bg-slate-950">
        {simulation.type === 'real_html' && activeView === 'preview' ? (
          <div className="rounded-xl border border-slate-800 bg-white min-h-[140px] overflow-hidden p-2">
            <iframe
              title="HTML Live Preview"
              srcDoc={`<!DOCTYPE html><html><head><style>body { font-family: sans-serif; padding: 10px; margin: 0; color: #1e293b; }</style></head><body>${code}</body></html>`}
              className="w-full h-full min-h-[120px] border-0"
              sandbox="allow-scripts"
            />
          </div>
        ) : (
          <div>
            {!result && !isRunning && (
              <div className="text-slate-500 italic py-2 flex items-center gap-2">
                <span>Clique em "Executar Código" para ver o resultado da execução.</span>
              </div>
            )}

            {isRunning && (
              <div className="text-emerald-400 py-2 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Compilando e processando saída...</span>
              </div>
            )}

            {result && !isRunning && (
              <div className="space-y-2">
                {/* Error Banner */}
                {result.error ? (
                  <div className="bg-red-950/40 border border-red-800/80 rounded-xl p-3 text-red-300 font-mono text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block mb-1">Erro de Execução:</span>
                      <pre className="whitespace-pre-wrap">{result.error}</pre>
                    </div>
                  </div>
                ) : (
                  <div className="bg-emerald-950/30 border border-emerald-800/60 rounded-xl p-3 text-emerald-300 font-mono text-xs">
                    <div className="flex items-center justify-between border-b border-emerald-900/60 pb-1.5 mb-2">
                      <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Saída do Terminal:
                      </span>
                      {result.executionTimeMs !== undefined && (
                        <span className="text-[10px] text-slate-400">
                          {result.executionTimeMs}ms
                        </span>
                      )}
                    </div>
                    <pre className="whitespace-pre-wrap text-slate-200 font-mono text-xs leading-relaxed">
                      {result.output}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
