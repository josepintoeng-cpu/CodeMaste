/**
 * Syntax Tokenizer & Highlighter for Lightweight Code Input Components
 * Supports: Python, JavaScript, TypeScript, SQL, C, Bash/Shell, HTML, CSS, Dart, PHP, YAML
 */

export interface CodeToken {
  type: 'keyword' | 'string' | 'comment' | 'number' | 'function' | 'operator' | 'punctuation' | 'type' | 'variable' | 'tag' | 'attribute' | 'text';
  value: string;
}

export interface SyntaxDiagnostic {
  type: 'error' | 'warning' | 'info';
  message: string;
  line?: number;
  column?: number;
}

const KEYWORDS_BY_LANG: Record<string, string[]> = {
  python: [
    'def', 'class', 'import', 'from', 'as', 'return', 'yield', 'if', 'elif', 'else',
    'for', 'while', 'break', 'continue', 'pass', 'try', 'except', 'finally', 'raise',
    'with', 'lambda', 'async', 'await', 'assert', 'del', 'global', 'nonlocal', 'in',
    'is', 'not', 'and', 'or', 'True', 'False', 'None', 'self', 'print', 'len', 'range'
  ],
  javascript: [
    'function', 'const', 'let', 'var', 'return', 'if', 'else', 'for', 'while', 'do',
    'switch', 'case', 'break', 'default', 'continue', 'try', 'catch', 'finally', 'throw',
    'class', 'extends', 'super', 'this', 'new', 'import', 'export', 'from', 'as', 'default',
    'async', 'await', 'yield', 'typeof', 'instanceof', 'null', 'undefined', 'true', 'false',
    'console', 'log', 'document', 'window', 'Math', 'JSON', 'Promise', 'Array', 'Object'
  ],
  typescript: [
    'function', 'const', 'let', 'var', 'return', 'if', 'else', 'for', 'while', 'do',
    'switch', 'case', 'break', 'default', 'continue', 'try', 'catch', 'finally', 'throw',
    'class', 'extends', 'super', 'this', 'new', 'import', 'export', 'from', 'as', 'default',
    'async', 'await', 'yield', 'typeof', 'instanceof', 'null', 'undefined', 'true', 'false',
    'interface', 'type', 'enum', 'namespace', 'implements', 'declare', 'abstract', 'readonly',
    'public', 'private', 'protected', 'override', 'keyof', 'infer', 'any', 'unknown', 'never',
    'void', 'string', 'number', 'boolean', 'symbol', 'console', 'log', 'Promise'
  ],
  sql: [
    'SELECT', 'FROM', 'WHERE', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE',
    'JOIN', 'INNER', 'LEFT', 'RIGHT', 'FULL', 'OUTER', 'ON', 'GROUP', 'BY', 'HAVING',
    'ORDER', 'ASC', 'DESC', 'LIMIT', 'OFFSET', 'UNION', 'ALL', 'CREATE', 'TABLE', 'ALTER',
    'DROP', 'INDEX', 'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES', 'NOT', 'NULL', 'DEFAULT',
    'AND', 'OR', 'IN', 'BETWEEN', 'LIKE', 'IS', 'EXISTS', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX',
    'select', 'from', 'where', 'insert', 'into', 'values', 'update', 'set', 'delete',
    'join', 'inner', 'left', 'right', 'group', 'by', 'order', 'limit'
  ],
  c: [
    '#include', '#define', '#ifdef', '#ifndef', '#endif', 'int', 'char', 'float', 'double',
    'void', 'short', 'long', 'signed', 'unsigned', 'struct', 'union', 'enum', 'typedef',
    'sizeof', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break',
    'continue', 'goto', 'const', 'static', 'extern', 'volatile', 'register', 'NULL',
    'printf', 'scanf', 'malloc', 'free', 'calloc', 'realloc', 'memcpy', 'memset', 'strlen'
  ],
  bash: [
    'echo', 'export', 'alias', 'cd', 'ls', 'mkdir', 'rm', 'cp', 'mv', 'chmod', 'chown',
    'grep', 'sed', 'awk', 'cat', 'curl', 'git', 'docker', 'kubectl', 'sudo', 'if', 'then',
    'else', 'elif', 'fi', 'for', 'in', 'do', 'done', 'while', 'until', 'case', 'esac',
    'function', 'return', 'exit', 'source', 'true', 'false'
  ],
  dart: [
    'void', 'main', 'var', 'final', 'const', 'late', 'dynamic', 'int', 'double', 'String',
    'bool', 'List', 'Map', 'Set', 'class', 'extends', 'with', 'implements', 'abstract',
    'override', 'return', 'if', 'else', 'for', 'while', 'switch', 'case', 'break', 'continue',
    'try', 'catch', 'finally', 'throw', 'async', 'await', 'Future', 'Stream', 'Widget',
    'StatelessWidget', 'StatefulWidget', 'BuildContext', 'super', 'this', 'new', 'null', 'true', 'false'
  ],
  php: [
    'php', 'function', 'class', 'public', 'private', 'protected', 'static', 'return',
    'if', 'else', 'elseif', 'for', 'foreach', 'while', 'do', 'switch', 'case', 'break',
    'continue', 'try', 'catch', 'finally', 'throw', 'new', 'echo', 'print', 'include',
    'require', 'include_once', 'require_once', 'null', 'true', 'false', 'extends', 'implements'
  ],
  yaml: [
    'apiVersion', 'kind', 'metadata', 'spec', 'containers', 'name', 'image', 'ports',
    'containerPort', 'env', 'resources', 'limits', 'requests', 'cpu', 'memory', 'services',
    'volumes', 'volumeMounts', 'labels', 'selector', 'matchLabels', 'template', 'replicas',
    'type', 'ports', 'targetPort', 'nodePort', 'true', 'false', 'null', 'yes', 'no'
  ],
  html: [
    'doctype', 'html', 'head', 'title', 'body', 'header', 'nav', 'main', 'section', 'article',
    'footer', 'div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li',
    'a', 'button', 'input', 'form', 'label', 'textarea', 'select', 'option', 'img', 'table',
    'tr', 'td', 'th', 'thead', 'tbody', 'tfoot', 'script', 'style', 'link', 'meta'
  ],
  css: [
    'color', 'background', 'margin', 'padding', 'border', 'display', 'flex', 'grid',
    'width', 'height', 'font-size', 'font-weight', 'text-align', 'align-items', 'justify-content',
    'position', 'top', 'bottom', 'left', 'right', 'z-index', 'opacity', 'transition', 'transform',
    'cursor', 'overflow', 'border-radius', 'box-shadow', 'gap'
  ]
};

export function tokenizeCode(code: string, language: string = 'javascript'): CodeToken[] {
  const langKey = language.toLowerCase();
  const keywords = KEYWORDS_BY_LANG[langKey] || KEYWORDS_BY_LANG.javascript;
  const keywordSet = new Set(keywords);

  const tokens: CodeToken[] = [];
  let i = 0;
  const len = code.length;

  while (i < len) {
    const char = code[i];

    // Comments
    // Single-line comment: // or # or --
    if (
      (char === '/' && code[i + 1] === '/') ||
      (char === '#' && (langKey === 'python' || langKey === 'bash' || langKey === 'yaml')) ||
      (char === '-' && code[i + 1] === '-' && langKey === 'sql')
    ) {
      let commentEnd = code.indexOf('\n', i);
      if (commentEnd === -1) commentEnd = len;
      tokens.push({ type: 'comment', value: code.slice(i, commentEnd) });
      i = commentEnd;
      continue;
    }

    // Multi-line comment: /* ... */
    if (char === '/' && code[i + 1] === '*') {
      const commentEnd = code.indexOf('*/', i + 2);
      if (commentEnd === -1) {
        tokens.push({ type: 'comment', value: code.slice(i) });
        break;
      } else {
        tokens.push({ type: 'comment', value: code.slice(i, commentEnd + 2) });
        i = commentEnd + 2;
        continue;
      }
    }

    // Strings: ", ', `
    if (char === '"' || char === "'" || char === '`') {
      const quote = char;
      let strEnd = i + 1;
      let escaped = false;
      while (strEnd < len) {
        if (code[strEnd] === '\\') {
          escaped = !escaped;
        } else if (code[strEnd] === quote && !escaped) {
          strEnd++;
          break;
        } else {
          escaped = false;
        }
        strEnd++;
      }
      tokens.push({ type: 'string', value: code.slice(i, strEnd) });
      i = strEnd;
      continue;
    }

    // Numbers: 123, 3.14, 0x12
    if (/\d/.test(char) && (i === 0 || /[\s,([{:+\-*/%=<>!;&|]/.test(code[i - 1]))) {
      let numEnd = i;
      while (numEnd < len && /[\d.a-fA-FxX_]/.test(code[numEnd])) {
        numEnd++;
      }
      tokens.push({ type: 'number', value: code.slice(i, numEnd) });
      i = numEnd;
      continue;
    }

    // Identifiers & Keywords & Function Calls
    if (/[a-zA-Z_$#]/.test(char)) {
      let idEnd = i;
      while (idEnd < len && /[a-zA-Z0-9_$-]/.test(code[idEnd])) {
        idEnd++;
      }
      const word = code.slice(i, idEnd);

      // Check if followed by '(' -> function
      let nextNonWhitespace = idEnd;
      while (nextNonWhitespace < len && /\s/.test(code[nextNonWhitespace])) {
        if (code[nextNonWhitespace] === '\n') break;
        nextNonWhitespace++;
      }

      if (keywordSet.has(word) || keywordSet.has(word.toUpperCase())) {
        tokens.push({ type: 'keyword', value: word });
      } else if (nextNonWhitespace < len && code[nextNonWhitespace] === '(' && !['if', 'for', 'while', 'switch', 'catch'].includes(word)) {
        tokens.push({ type: 'function', value: word });
      } else if (/^[A-Z][a-zA-Z0-9]*$/.test(word) && (langKey === 'typescript' || langKey === 'javascript' || langKey === 'dart' || langKey === 'python')) {
        tokens.push({ type: 'type', value: word });
      } else {
        tokens.push({ type: 'text', value: word });
      }

      i = idEnd;
      continue;
    }

    // Operators and Punctuation
    if (/[{}()[\]]/.test(char)) {
      tokens.push({ type: 'punctuation', value: char });
      i++;
      continue;
    }

    if (/[+\-*/%=<>!&|^~?:;.,]/.test(char)) {
      let opEnd = i;
      while (opEnd < len && /[+\-*/%=<>!&|^~?:;.,]/.test(code[opEnd])) {
        opEnd++;
      }
      tokens.push({ type: 'operator', value: code.slice(i, opEnd) });
      i = opEnd;
      continue;
    }

    // Whitespace / other
    tokens.push({ type: 'text', value: char });
    i++;
  }

  return tokens;
}

export function validateCodeSyntax(code: string, language: string = 'javascript'): SyntaxDiagnostic[] {
  const diagnostics: SyntaxDiagnostic[] = [];
  const lines = code.split('\n');

  if (!code.trim()) {
    return diagnostics;
  }

  // 1. Bracket Matching Stack
  const bracketStack: { char: string; line: number; col: number }[] = [];
  const matchingPairs: Record<string, string> = {
    ')': '(',
    '}': '{',
    ']': '}',
  };
  const openingBrackets = new Set(['(', '{', '[']);
  const closingBrackets = new Set([')', '}', ']']);

  let inString: string | null = null;
  let inMultiComment = false;

  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const lineText = lines[lineIdx];

    for (let colIdx = 0; colIdx < lineText.length; colIdx++) {
      const char = lineText[colIdx];
      const prevChar = colIdx > 0 ? lineText[colIdx - 1] : '';
      const nextChar = colIdx + 1 < lineText.length ? lineText[colIdx + 1] : '';

      // Multi-line comment tracking
      if (!inString) {
        if (!inMultiComment && char === '/' && nextChar === '*') {
          inMultiComment = true;
          colIdx++;
          continue;
        }
        if (inMultiComment && char === '*' && nextChar === '/') {
          inMultiComment = false;
          colIdx++;
          continue;
        }
      }

      if (inMultiComment) continue;

      // Single line comment skip rest of line
      if (!inString) {
        if (
          (char === '/' && nextChar === '/') ||
          (char === '#' && (language === 'python' || language === 'bash' || language === 'yaml')) ||
          (char === '-' && nextChar === '-' && language === 'sql')
        ) {
          break;
        }
      }

      // String handling
      if ((char === '"' || char === "'" || char === '`') && prevChar !== '\\') {
        if (!inString) {
          inString = char;
        } else if (inString === char) {
          inString = null;
        }
        continue;
      }

      if (inString) continue;

      // Check brackets
      if (openingBrackets.has(char)) {
        bracketStack.push({ char, line: lineIdx + 1, col: colIdx + 1 });
      } else if (closingBrackets.has(char)) {
        const expectedOpening = matchingPairs[char];
        if (bracketStack.length === 0) {
          diagnostics.push({
            type: 'error',
            message: `Caractere de fechamento inesperado '${char}' sem abertura correspondente.`,
            line: lineIdx + 1,
            column: colIdx + 1,
          });
        } else {
          const last = bracketStack.pop()!;
          if (last.char !== expectedOpening) {
            diagnostics.push({
              type: 'error',
              message: `Fechamento incorreto '${char}': esperado '${last.char === '(' ? ')' : last.char === '{' ? '}' : ']'}' aberto na linha ${last.line}.`,
              line: lineIdx + 1,
              column: colIdx + 1,
            });
          }
        }
      }
    }

    // Check unclosed string on single-line quotes (", ')
    if (inString && (inString === '"' || inString === "'")) {
      diagnostics.push({
        type: 'warning',
        message: `String não fechada com ${inString} na linha ${lineIdx + 1}.`,
        line: lineIdx + 1,
      });
      inString = null; // Reset for next line
    }
  }

  // Any remaining unclosed brackets in stack
  for (const unclosed of bracketStack) {
    diagnostics.push({
      type: 'warning',
      message: `Abertura '${unclosed.char}' na linha ${unclosed.line} não foi fechada.`,
      line: unclosed.line,
      column: unclosed.col,
    });
  }

  if (inString === '`') {
    diagnostics.push({
      type: 'warning',
      message: 'Template string (crase `) não foi fechada.',
      line: lines.length,
    });
  }

  return diagnostics;
}

export const TOKEN_COLOR_CLASSES: Record<CodeToken['type'], string> = {
  keyword: 'text-amber-400 font-semibold',
  string: 'text-emerald-300',
  comment: 'text-slate-500 italic',
  number: 'text-cyan-300',
  function: 'text-blue-400 font-medium',
  type: 'text-purple-400 font-medium',
  operator: 'text-orange-400',
  punctuation: 'text-slate-300',
  variable: 'text-slate-200',
  tag: 'text-rose-400',
  attribute: 'text-amber-300',
  text: 'text-slate-100',
};
