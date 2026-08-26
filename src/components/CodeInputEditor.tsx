import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  RotateCcw,
  Copy,
  Check,
  AlertTriangle,
  CheckCircle2,
  Code2,
  Terminal,
  Sparkles,
  Info,
  Maximize2,
  Minimize2,
  ChevronDown
} from 'lucide-react';
import {
  tokenizeCode,
  validateCodeSyntax,
  TOKEN_COLOR_CLASSES,
  SyntaxDiagnostic
} from '../utils/codeTokenizer';

interface CodeInputEditorProps {
  value: string;
  onChange: (val: string) => void;
  language?: string;
  placeholder?: string;
  initialCode?: string;
  expectedKeywords?: string[];
  expectedAnswer?: string;
  onRun?: () => void;
  disabled?: boolean;
  minLines?: number;
}

export const CodeInputEditor: React.FC<CodeInputEditorProps> = ({
  value,
  onChange,
  language = 'javascript',
  placeholder = 'Escreva sua solução de código aqui...',
  initialCode,
  expectedKeywords = [],
  expectedAnswer,
  onRun,
  disabled = false,
  minLines = 6,
}) => {
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(true);
  const [cursorPos, setCursorPos] = useState<{ line: number; col: number }>({ line: 1, col: 1 });

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  // Sync scroll between textarea and syntax highlight preview
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (preRef.current) {
      preRef.current.scrollTop = e.currentTarget.scrollTop;
      preRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  };

  // Mobile symbols helper
  const quickSymbols = useMemo(() => {
    const lang = language.toLowerCase();
    if (lang === 'python') {
      return ['(', ')', ':', '=', '[', ']', '"', "'", '_', 'def', 'return', 'print', '#', ',', '+', '-'];
    }
    if (lang === 'sql') {
      return ['SELECT', 'FROM', 'WHERE', 'JOIN', 'ON', '(', ')', '=', ',', ';', "'", '*', 'AND', 'OR'];
    }
    if (lang === 'bash' || lang === 'git') {
      return ['git', 'commit', '-m', 'add', 'push', 'status', '"', '$', '|', '>', '&&', ';', '-'];
    }
    if (lang === 'c') {
      return ['(', ')', '{', '}', ';', '*', '&', '->', '=', '"', '#include', 'return', 'printf'];
    }
    return ['(', ')', '{', '}', '=>', '=', ';', '[', ']', '"', "'", '`', ':', '.', ',', '$'];
  }, [language]);

  // Real-time Syntax Tokenization
  const tokens = useMemo(() => {
    return tokenizeCode(value || '', language);
  }, [value, language]);

  // Real-time Syntax Diagnostics (Bracket matching, unclosed strings, etc.)
  const diagnostics = useMemo<SyntaxDiagnostic[]>(() => {
    return validateCodeSyntax(value || '', language);
  }, [value, language]);

  // Keyword / Structure validation for live feedback
  const validationProgress = useMemo(() => {
    if (!expectedKeywords || expectedKeywords.length === 0) return null;
    const lowerVal = value.toLowerCase();
    const matched = expectedKeywords.filter(kw => lowerVal.includes(kw.toLowerCase().trim()));
    return {
      matched: matched.length,
      total: expectedKeywords.length,
      isAllMatched: matched.length === expectedKeywords.length,
      missing: expectedKeywords.filter(kw => !lowerVal.includes(kw.toLowerCase().trim())),
    };
  }, [value, expectedKeywords]);

  // Line calculations
  const lines = useMemo(() => {
    const split = (value || '').split('\n');
    return split.length > 0 ? split : [''];
  }, [value]);

  const displayLinesCount = Math.max(lines.length, minLines);
  const lineNumbers = Array.from({ length: displayLinesCount }, (_, i) => i + 1);

  // Set of lines that have errors or warnings
  const diagnosticLines = useMemo(() => {
    const errors = new Set<number>();
    const warnings = new Set<number>();
    for (const d of diagnostics) {
      if (d.line) {
        if (d.type === 'error') errors.add(d.line);
        else warnings.add(d.line);
      }
    }
    return { errors, warnings };
  }, [diagnostics]);

  // Intercept Tab and Enter for clean IDE behavior
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (disabled) return;

    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const val = textarea.value;

      // Insert 2 spaces
      const updated = val.substring(0, start) + '  ' + val.substring(end);
      onChange(updated);

      // Move cursor
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    } else if (e.key === 'Enter') {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const val = textarea.value;
      const currentLine = val.substring(0, start).split('\n').pop() || '';
      const matchIndent = currentLine.match(/^\s*/);
      const indent = matchIndent ? matchIndent[0] : '';

      // Extra indent if line ends with : or {
      const trimmed = currentLine.trimEnd();
      const extraIndent = (trimmed.endsWith(':') || trimmed.endsWith('{') || trimmed.endsWith('(')) ? '  ' : '';

      if (indent || extraIndent) {
        e.preventDefault();
        const updated = val.substring(0, start) + '\n' + indent + extraIndent + val.substring(start);
        onChange(updated);

        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 1 + indent.length + extraIndent.length;
        }, 0);
      }
    }
  };

  // Update cursor line and column position on selection change
  const updateCursorPosition = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const pos = textarea.selectionStart;
    const linesBefore = textarea.value.substring(0, pos).split('\n');
    const line = linesBefore.length;
    const col = linesBefore[linesBefore.length - 1].length + 1;
    setCursorPos({ line, col });
  };

  // Insert symbol or snippet at current cursor
  const handleInsertSymbol = (sym: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      onChange(value + sym);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const updated = value.substring(0, start) + sym + value.substring(end);
    onChange(updated);

    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + sym.length;
      updateCursorPosition();
    }, 0);
  };

  // Copy code action
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Reset to initial code
  const handleReset = () => {
    if (initialCode !== undefined) {
      onChange(initialCode);
    } else {
      onChange('');
    }
  };

  return (
    <div
      className={`rounded-2xl border border-slate-700/80 bg-slate-950 overflow-hidden shadow-2xl transition-all duration-200 ${
        isFullscreen ? 'fixed inset-4 z-50 flex flex-col' : 'my-3'
      }`}
    >
      {/* Top Header Bar (Monaco / VS Code inspired) */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-3 py-2 flex items-center justify-between gap-2 select-none">
        {/* Left: Window dots + Language Tab */}
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1.5 items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/70 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70 inline-block"></span>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/60 text-xs font-mono text-slate-300">
            <Code2 className="w-3.5 h-3.5 text-orange-400" />
            <span className="font-semibold uppercase tracking-wider text-[10px] text-orange-300">
              {language}
            </span>
          </div>

          {/* Real-time Syntax Health Indicator */}
          {diagnostics.length === 0 && value.trim().length > 0 ? (
            <span className="hidden sm:flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-medium">
              <CheckCircle2 className="w-3 h-3" />
              Sintaxe OK
            </span>
          ) : diagnostics.length > 0 ? (
            <button
              onClick={() => setShowDiagnostics(!showDiagnostics)}
              className="flex items-center gap-1 text-[10px] text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 hover:bg-amber-500/20 transition-colors font-medium"
              title="Clique para ver diagnósticos"
            >
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              <span>{diagnostics.length} {diagnostics.length === 1 ? 'aviso de sintaxe' : 'avisos de sintaxe'}</span>
            </button>
          ) : null}
        </div>

        {/* Right: Quick IDE Actions */}
        <div className="flex items-center gap-1 text-slate-400">
          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors text-xs flex items-center gap-1 px-2"
            title="Copiar código"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline text-[11px]">{copied ? 'Copiado' : 'Copiar'}</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 hover:text-orange-400 hover:bg-slate-800 rounded-lg transition-colors text-xs flex items-center gap-1 px-2"
            title="Restaurar código inicial"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Restaurar</span>
          </button>

          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
            title={isFullscreen ? 'Reduzir editor' : 'Expandir editor'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Quick Mobile / Desktop Symbol Toolbar */}
      <div className="bg-slate-900/60 border-b border-slate-800/80 px-2 py-1.5 flex items-center gap-1 overflow-x-auto no-scrollbar">
        <span className="text-[9px] uppercase font-mono tracking-widest text-slate-500 font-bold px-1 shrink-0">
          Atalhos:
        </span>
        {quickSymbols.map((sym, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleInsertSymbol(sym)}
            disabled={disabled}
            className="px-2 py-0.5 bg-slate-800/90 hover:bg-slate-700 active:bg-orange-500 active:text-black text-slate-200 hover:text-orange-300 font-mono text-xs font-semibold rounded transition-colors shrink-0 border border-slate-700/50 min-h-[26px] min-w-[26px] flex items-center justify-center shadow-xs"
          >
            {sym}
          </button>
        ))}
      </div>

      {/* Main Dual-Layer Code Editor Area */}
      <div className={`relative flex font-mono text-xs sm:text-sm bg-slate-950 ${isFullscreen ? 'flex-1 overflow-hidden' : 'min-h-[140px] max-h-[420px]'}`}>
        {/* Gutter: Line Numbers + Diagnostics Markers */}
        <div className="py-3 px-1 select-none text-right text-slate-600 bg-slate-900/50 border-r border-slate-800/70 font-mono text-xs w-10 shrink-0 flex flex-col">
          {lineNumbers.map((n) => {
            const hasError = diagnosticLines.errors.has(n);
            const hasWarning = diagnosticLines.warnings.has(n);
            const isCurrent = cursorPos.line === n;

            return (
              <div
                key={n}
                className={`leading-6 flex items-center justify-end gap-1 px-1 transition-colors ${
                  isCurrent ? 'text-orange-400 font-bold bg-orange-500/10 rounded-xs' : ''
                }`}
              >
                {hasError ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" title={`Erro na linha ${n}`} />
                ) : hasWarning ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title={`Aviso na linha ${n}`} />
                ) : null}
                <span className="text-[11px]">{n}</span>
              </div>
            );
          })}
        </div>

        {/* Editor Container with Overlay */}
        <div className="relative flex-1 overflow-auto">
          {/* Underlay: Syntax Highlighted Tokens */}
          <pre
            ref={preRef}
            aria-hidden="true"
            className="absolute inset-0 p-3 m-0 font-mono text-xs sm:text-sm leading-6 whitespace-pre-wrap break-words pointer-events-none select-none overflow-hidden"
          >
            {tokens.length === 0 ? (
              <span className="text-slate-600 italic">{placeholder}</span>
            ) : (
              tokens.map((tok, tIdx) => (
                <span key={tIdx} className={TOKEN_COLOR_CLASSES[tok.type] || 'text-slate-200'}>
                  {tok.value}
                </span>
              ))
            )}
          </pre>

          {/* Overlay: Interactive Transparent Textarea with Visible Caret */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              updateCursorPosition();
            }}
            onKeyDown={handleKeyDown}
            onKeyUp={updateCursorPosition}
            onClick={updateCursorPosition}
            onSelect={updateCursorPosition}
            onScroll={handleScroll}
            disabled={disabled}
            placeholder={placeholder}
            spellCheck={false}
            autoCapitalize="none"
            autoCorrect="off"
            className="relative w-full h-full p-3 bg-transparent text-transparent caret-orange-400 font-mono text-xs sm:text-sm focus:outline-none resize-none leading-6 min-h-[140px] whitespace-pre-wrap break-words selection:bg-orange-500/30 selection:text-white"
            style={{
              fontVariantLigatures: 'none',
              tabSize: 2,
            }}
          />
        </div>
      </div>

      {/* Diagnostics / Hints Drawer (Live Validation Feedback) */}
      {showDiagnostics && diagnostics.length > 0 && (
        <div className="bg-amber-950/30 border-t border-amber-500/30 p-2.5 space-y-1.5 text-xs text-amber-200/90 font-mono">
          <div className="flex items-center justify-between text-[11px] font-bold text-amber-400">
            <span className="flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              Verificações de Sintaxe em Tempo Real:
            </span>
            <button
              onClick={() => setShowDiagnostics(false)}
              className="text-amber-400/60 hover:text-amber-300 text-[10px] uppercase tracking-wider"
            >
              Ocultar
            </button>
          </div>
          {diagnostics.map((diag, dIdx) => (
            <div key={dIdx} className="flex items-start gap-1.5 text-[11px] pl-1">
              <span className={`shrink-0 font-bold ${diag.type === 'error' ? 'text-red-400' : 'text-amber-400'}`}>
                {diag.line ? `[L${diag.line}]` : '•'}
              </span>
              <span>{diag.message}</span>
            </div>
          ))}
        </div>
      )}

      {/* Live Keywords / Structure Progress Feedback (if specified) */}
      {validationProgress && validationProgress.total > 0 && (
        <div className="bg-slate-900 border-t border-slate-800 px-3 py-1.5 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-[11px] text-slate-400">
              Estruturas esperadas: <strong className="text-orange-300">{validationProgress.matched}/{validationProgress.total}</strong>
            </span>
          </div>
          {validationProgress.isAllMatched ? (
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
              <Check className="w-3 h-3" />
              Requisitos sintáticos presentes
            </span>
          ) : (
            <span className="text-[10px] text-slate-400 italic">
              Faltando: {validationProgress.missing.join(', ')}
            </span>
          )}
        </div>
      )}

      {/* Bottom Status Bar (VS Code style footer) */}
      <div className="bg-slate-900 border-t border-slate-800 px-3 py-1.5 flex items-center justify-between text-[11px] font-mono text-slate-400 select-none">
        <div className="flex items-center gap-3">
          <span>Lin {cursorPos.line}, Col {cursorPos.col}</span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">{value.length} caracteres</span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">{lines.length} {lines.length === 1 ? 'linha' : 'linhas'}</span>
        </div>

        <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-slate-400">
          <span>UTF-8</span>
          <span>•</span>
          <span className="text-orange-400">{language}</span>
        </div>
      </div>
    </div>
  );
};
