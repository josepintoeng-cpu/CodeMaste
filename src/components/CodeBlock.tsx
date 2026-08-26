import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { tokenizeCode, TOKEN_COLOR_CLASSES } from '../utils/codeTokenizer';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'javascript', title }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.trim().split('\n');

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-inner my-3 text-slate-200">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
          </div>
          <span className="text-xs font-mono font-medium text-slate-400 ml-1 uppercase tracking-wider">
            {title || language}
          </span>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 bg-slate-800/60 hover:bg-slate-800 px-2.5 py-1 rounded-lg transition-colors min-h-[32px]"
          title="Copiar código"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">Copiado!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copiar</span>
            </>
          )}
        </button>
      </div>

      {/* Code body with line numbers & syntax highlighting */}
      <div className="p-4 font-mono text-xs sm:text-sm overflow-x-auto leading-relaxed">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, idx) => {
              const tokens = tokenizeCode(line, language);
              return (
                <tr key={idx} className="hover:bg-slate-900/50">
                  <td className="pr-4 select-none text-right text-slate-600 w-8 text-xs align-top">
                    {idx + 1}
                  </td>
                  <td className="whitespace-pre font-mono align-top">
                    {tokens.length === 0 ? (
                      <span className="text-slate-500">&nbsp;</span>
                    ) : (
                      tokens.map((tok, tIdx) => (
                        <span key={tIdx} className={TOKEN_COLOR_CLASSES[tok.type] || 'text-slate-200'}>
                          {tok.value}
                        </span>
                      ))
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
