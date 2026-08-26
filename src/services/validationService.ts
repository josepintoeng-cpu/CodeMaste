import { Exercise } from '../types';

export interface ValidationResult {
  isValid: boolean;
  message: string;
  hint?: string;
  actualOutput?: string;
}

/**
 * Remove comentários de qualquer linguagem (Python, JS, TS, SQL, HTML, C, etc.)
 */
function stripComments(code: string, _language?: string): string {
  if (!code) return '';
  return code
    // Remove blocos de comentário /* ... */ e <!-- ... -->
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .split('\n')
    .map(line => {
      // Remove linhas inteiras ou finais de linha com //, # ou --
      let l = line.trim();
      if (l.startsWith('#') || l.startsWith('//') || l.startsWith('--')) {
        return '';
      }
      // Remove comentários inline //
      l = line.replace(/(^|\s+)\/\/.*$/, '');
      // Remove comentários inline # (quando fora de strings comuns)
      l = l.replace(/(^|\s+)#(?![0-9a-fA-F]{3,6}\b).*$/, '');
      // Remove comentários inline --
      l = l.replace(/(^|\s+)--.*$/, '');
      return l;
    })
    .filter(Boolean)
    .join('\n')
    .trim();
}

/**
 * Normaliza o código para comparação sintática flexível e tolerante
 */
function normalizeCode(rawCode: string, lang?: string): string {
  if (!rawCode) return '';
  let code = stripComments(rawCode, lang);

  // 1. Normalizar aspas simples, duplas e crases para aspas duplas padrão
  code = code.replace(/['"`](.*?)['"`]/g, '"$1"');

  // 2. Normalizar pontos e vírgulas finais e quebras de linha
  code = code.replace(/;(?=\s*$|\s*\n)/gm, '');

  // 3. Normalizar espaços ao redor de operadores e delimitadores
  code = code
    .replace(/\s*([=><!+\-*/%,:;(){}[\]])\s*/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();

  // 4. Se for SQL, normalizar palavras-chave para MAIÚSCULAS
  const isSql =
    lang?.toLowerCase().includes('sql') ||
    /\b(select|insert|update|delete|create table|alter table|from|where|join)\b/i.test(code);

  if (isSql) {
    code = code.replace(
      /\b(select|from|where|insert|into|values|update|set|delete|create|table|drop|alter|add|group|by|order|asc|desc|join|left|right|inner|outer|on|as|having|distinct|limit|offset|count|sum|avg|max|min|and|or|not|null|is|in|like|between|primary|key|foreign|references|default|unique|cascade)\b/gi,
      m => m.toUpperCase()
    );
  }

  // 5. Normalizar tags HTML para minúsculas
  const isHtml = lang?.toLowerCase().includes('html') || code.includes('<') && code.includes('>');
  if (isHtml) {
    code = code.replace(/<\/?([a-zA-Z0-9-]+)(\s+[^>]*)?>/gi, (match) => match.toLowerCase());
  }

  return code;
}

/**
 * Normaliza saída de console/terminal para comparação
 */
function normalizeOutput(output: string): string {
  if (!output) return '';
  return output
    .replace(/\r\n/g, '\n')
    .replace(/\s+/g, ' ')
    .replace(/["']/g, '"')
    .trim()
    .toLowerCase();
}

/**
 * Service de validação de exercícios práticos com inteligência adaptativa para todos os cursos
 */
export const validationService = {
  validateExercise(
    exercise: Exercise,
    userAnswer: string,
    actualOutput?: string,
    language?: string
  ): ValidationResult {
    const cleanUserAnswer = userAnswer.trim();

    if (!cleanUserAnswer) {
      return {
        isValid: false,
        message: 'Por favor, digite sua resposta ou código antes de verificar.',
      };
    }

    // 1. Múltipla Escolha
    if (exercise.type === 'multiple_choice') {
      const cleanExpected = (exercise.correctAnswer || '').trim().toLowerCase();
      const cleanUser = cleanUserAnswer.toLowerCase();

      const isCorrect =
        cleanUser === cleanExpected ||
        cleanUser.includes(cleanExpected) ||
        cleanExpected.includes(cleanUser);

      return {
        isValid: isCorrect,
        message: isCorrect
          ? 'Excelente! Resposta correta.'
          : 'Opção incorreta. Releia a questão e tente novamente.',
        hint: isCorrect ? undefined : exercise.hint,
      };
    }

    // 2. Exercícios Práticos de Código (code_write, code_completion, etc.)
    return this.validateCodeAnswer(exercise, cleanUserAnswer, actualOutput, language);
  },

  validateCodeAnswer(
    exercise: Exercise,
    userCode: string,
    actualOutput?: string,
    language?: string
  ): ValidationResult {
    const expected = (exercise.correctAnswer || '').trim();
    const cleanUserCode = stripComments(userCode, language);

    // Se o usuário não escreveu código após os comentários
    if (!cleanUserCode && userCode.trim()) {
      return {
        isValid: false,
        message: 'Escreva a sua solução de código abaixo do comentário.',
        hint: exercise.hint,
      };
    }

    // -------------------------------------------------------------
    // Regra A: Validação por REGEX explícito
    // -------------------------------------------------------------
    if (expected.startsWith('REGEX:')) {
      const pattern = expected.replace('REGEX:', '');
      try {
        const regex = new RegExp(pattern, 'i');
        if (regex.test(userCode) || regex.test(cleanUserCode)) {
          return {
            isValid: true,
            message: 'Muito bem! Seu código foi validado com sucesso.',
            actualOutput,
          };
        }
      } catch {
        // Fallback se regex falhar
      }
    }

    // -------------------------------------------------------------
    // Regra B: Validação por alternativas separadas por '|' ou '||'
    // Ex: "let total = 0 | const total = 0 | var total = 0"
    // -------------------------------------------------------------
    if (expected.includes('|')) {
      const alternatives = expected
        .split(/\|\||\|/)
        .map(s => s.trim())
        .filter(Boolean);

      const normUser = normalizeCode(userCode, language);

      const anyMatch = alternatives.some(alt => {
        const normAlt = normalizeCode(alt, language);
        return normUser === normAlt || normUser.includes(normAlt);
      });

      if (anyMatch) {
        return {
          isValid: true,
          message: 'Parabéns! Seu código atende perfeitamente ao requisito.',
          actualOutput,
        };
      }
    }

    // -------------------------------------------------------------
    // Regra C: Comparação Normalizada Estrutural (Espaços, Aspas, Semicolons, Comentários)
    // -------------------------------------------------------------
    const normUser = normalizeCode(userCode, language);
    const normExpected = normalizeCode(expected, language);

    if (normUser === normExpected) {
      return {
        isValid: true,
        message: 'Excelente! Código correto e bem estruturado.',
        actualOutput,
      };
    }

    // -------------------------------------------------------------
    // Regra D: Contém a estrutura esperada como subconjunto (caso o aluno adicione prints/helpers)
    // -------------------------------------------------------------
    if (normUser.includes(normExpected) || (normExpected.length > 5 && normUser.startsWith(normExpected))) {
      return {
        isValid: true,
        message: 'Muito bem! A lógica esperada está presente no seu código.',
        actualOutput,
      };
    }

    // -------------------------------------------------------------
    // Regra E: Verificação por Saída Real ou Simulada do Código
    // -------------------------------------------------------------
    if (exercise.expectedOutput && actualOutput) {
      const nActual = normalizeOutput(actualOutput);
      const nExp = normalizeOutput(exercise.expectedOutput);

      if (nActual === nExp || nActual.includes(nExp) || (nExp.length > 2 && nActual.endsWith(nExp))) {
        return {
          isValid: true,
          message: 'Ótimo! O resultado gerado pelo seu código confere com a saída esperada.',
          actualOutput,
        };
      }
    }

    // -------------------------------------------------------------
    // Regra F: Verificação de Linhas e Declarações Individuais
    // (ex: aluno inverteu a ordem de linhas ou declarou variáveis equivalentes)
    // -------------------------------------------------------------
    const expectedLines = expected
      .split('\n')
      .map(l => normalizeCode(l, language))
      .filter(l => l.length > 0);

    if (expectedLines.length > 1) {
      const allLinesPresent = expectedLines.every(expLine => normUser.includes(expLine));
      if (allLinesPresent) {
        return {
          isValid: true,
          message: 'Parabéns! Todas as instruções requeridas foram implementadas.',
          actualOutput,
        };
      }
    }

    // -------------------------------------------------------------
    // Regra G: Tolerância para variáveis (let vs const vs var, aspas simples vs duplas)
    // -------------------------------------------------------------
    const relaxedUser = normUser.replace(/\b(let|const|var)\b/g, 'var');
    const relaxedExpected = normExpected.replace(/\b(let|const|var)\b/g, 'var');
    if (relaxedUser === relaxedExpected || relaxedUser.includes(relaxedExpected)) {
      return {
        isValid: true,
        message: 'Correto! Declaração de variável aceita com sucesso.',
        actualOutput,
      };
    }

    return {
      isValid: false,
      message: 'O código ainda não atinge o resultado esperado. Confira a sintaxe.',
      hint: exercise.hint,
      actualOutput,
    };
  },
};

