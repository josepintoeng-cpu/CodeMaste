import React from 'react';
import { RotateCcw } from 'lucide-react';

interface CodeEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  language?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  placeholder = 'Digite seu código aqui...',
}) => {
  // Toolbar de símbolos rápidos para facilidade no teclado mobile
  const mobileSymbols = ['(', ')', '{', '}', ':', '=', '"', "'", ';', '[', ']', '+', '-', '>', '<', '#', '_'];

  const handleInsertSymbol = (sym: string) => {
    onChange(value + sym);
  };

  const lineCount = Math.max(value.split('\n').length, 3);
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-950 overflow-hidden shadow-inner my-3">
      {/* Quick Mobile Keyboard Helper Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-2 py-1.5 flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold px-1.5">
            Símbolos Rápidos:
          </span>
          {mobileSymbols.map(sym => (
            <button
              key={sym}
              type="button"
              onClick={() => handleInsertSymbol(sym)}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 active:bg-emerald-600 active:text-white text-emerald-400 font-mono text-xs font-bold rounded-md transition-colors min-w-[28px] min-h-[28px] flex items-center justify-center"
            >
              {sym}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => onChange('')}
          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-md transition-colors shrink-0"
          title="Limpar código"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Editor Body */}
      <div className="relative flex font-mono text-xs sm:text-sm bg-slate-950 min-h-[120px]">
        {/* Line Numbers */}
        <div className="py-3 px-2 select-none text-right text-slate-600 bg-slate-900/40 border-r border-slate-800/60 font-mono text-xs w-9 shrink-0">
          {lineNumbers.map(n => (
            <div key={n} className="leading-6">
              {n}
            </div>
          ))}
        </div>

        {/* Text Area */}
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          spellCheck={false}
          autoCapitalize="none"
          autoCorrect="off"
          className="w-full p-3 bg-transparent text-emerald-300 font-mono text-xs sm:text-sm focus:outline-none resize-y min-h-[120px] leading-6 placeholder:text-slate-600"
        />
      </div>
    </div>
  );
};
