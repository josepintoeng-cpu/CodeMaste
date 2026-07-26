import { Exercise } from '../types';

export interface ValidationResult {
  isValid: boolean;
  message: string;
  hint?: string;
}

/**
 * Service de validação de exercícios práticos por regras/regex e comparação
 */
export const validationService = {
  validateExercise(
    exercise: Exercise,
    userAnswer: string,
    actualOutput?: string
  ): ValidationResult {
    const cleanUserAnswer = userAnswer.trim();

    if (!cleanUserAnswer) {
      return {
        isValid: false,
        message: 'Por favor, digite sua resposta ou escolha uma opção antes de verificar.',
      };
    }

    if (exercise.type === 'multiple_choice') {
      const isCorrect = cleanUserAnswer === exercise.correctAnswer;
      return {
        isValid: isCorrect,
        message: isCorrect
          ? 'Excelente! Resposta correta.'
          : 'Opção incorreta. Releia a questão e tente novamente.',
        hint: isCorrect ? undefined : exercise.hint,
      };
    }

    // Para exercícios de código (code_write ou code_completion)
    return this.validateCodeAnswer(exercise, cleanUserAnswer, actualOutput);
  },

  validateCodeAnswer(
    exercise: Exercise,
    userCode: string,
    actualOutput?: string
  ): ValidationResult {
    const expected = exercise.correctAnswer.trim();

    // 1. Comparação exata sem espaços redundantes
    const normalize = (str: string) => str.replace(/\s+/g, ' ').replace(/["']/g, '"').trim();

    if (normalize(userCode) === normalize(expected)) {
      return {
        isValid: true,
        message: 'Parabéns! Seu código atende perfeitamente ao requisito.',
      };
    }

    // 2. Validação por regex se o exercício definir um padrão
    if (expected.startsWith('REGEX:')) {
      const regexPattern = new RegExp(expected.replace('REGEX:', ''), 'i');
      if (regexPattern.test(userCode)) {
        return {
          isValid: true,
          message: 'Muito bem! Código validado com sucesso.',
        };
      }
    }

    // 3. Validação por saída esperada se definida
    if (exercise.expectedOutput && actualOutput) {
      const normActual = actualOutput.trim();
      const normExpected = exercise.expectedOutput.trim();

      if (normActual.includes(normExpected)) {
        return {
          isValid: true,
          message: 'Ótimo! O resultado gerado pelo seu código confere com a saída esperada.',
        };
      }
    }

    // 4. Verificação de palavras-chave parciais exigidas
    const keywords = expected.split('|');
    const allKeywordsPresent = keywords.every(kw => userCode.includes(kw.trim()));

    if (allKeywordsPresent && keywords.length > 1) {
      return {
        isValid: true,
        message: 'Código correto! Todas as estruturas necessárias foram identificadas.',
      };
    }

    return {
      isValid: false,
      message: 'O código ainda não atinge o resultado esperado. Confira a sintaxe.',
      hint: exercise.hint,
    };
  }
};
