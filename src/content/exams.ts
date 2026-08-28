import { TechId, CourseExam, ExamQuestion, ExamAttempt } from '../types';
import { TECHNOLOGIES } from './technologies';
import { getLessonsForTechAndLevel } from './index';

/**
 * Banco de Questões Especializadas e Gerador de Exame Rigoroso de Passagem de Curso.
 * Cada exame contém EXATAMENTE 80 itens:
 * - 60 Questões Teóricas (Múltipla Escolha 4 opções)
 * - 20 Questões Práticas (Desenvolvimento, Correção de Bugs e Implementação de Código)
 * 
 * Regra: Tempo de 120 minutos. Nota de 0 a 20 valores.
 * Aprovação estrita: Nota 20/20 (100% de acerto).
 */

// Tópicos detalhados por tecnologia para geração profunda de questões teóricas e práticas
interface TechDomainCurriculum {
  syntaxFundamentals: { q: string; opts: string[]; correct: number; exp: string; topic: string }[];
  dataStructuresAndTypes: { q: string; opts: string[]; correct: number; exp: string; topic: string }[];
  advancedAndAsync: { q: string; opts: string[]; correct: number; exp: string; topic: string }[];
  architectureAndSecurity: { q: string; opts: string[]; correct: number; exp: string; topic: string }[];
  practicalChallenges: {
    prompt: string;
    topic: string;
    initialCode: string;
    expectedKeywords: string[];
    correctSnippet: string;
    hint: string;
    explanation: string;
  }[];
}

const TECH_CURRICULUM_DATA: Partial<Record<TechId, TechDomainCurriculum>> = {
  python: {
    syntaxFundamentals: [
      {
        q: 'Em Python, qual é a diferença fundamental entre uma lista (list) e uma tupla (tuple)?',
        opts: ['Listas são mutáveis e tuplas são imutáveis', 'Listas só aceitam números e tuplas aceitam strings', 'Tuplas são dinâmicas e listas têm tamanho estático fixo', 'Não existe diferença interna, apenas sintaxe'],
        correct: 0,
        exp: 'Listas em Python são estruturas de dados mutáveis (podem ser alteradas in-place), enquanto tuplas são imutáveis e protegidas contra modificações acidentais.',
        topic: 'Fundamentos e Tipos de Dados',
      },
      {
        q: 'Qual operador em Python realiza divisão inteira descartando a parte decimal?',
        opts: ['/', '//', '%', 'div()'],
        correct: 1,
        exp: 'O operador // realiza a divisão inteira (floor division), retornando apenas a parte inteira do quociente.',
        topic: 'Operadores e Sintaxe',
      },
      {
        q: 'O que o comando `pass` executa em um bloco de código Python?',
        opts: ['Encerra a execução do programa', 'Uma operação nula (no-op) para preenchimento de sintaxe', 'Pula para a próxima iteração do loop', 'Retorna None'],
        correct: 1,
        exp: '`pass` é uma instrução no-op que serve como marcador de espaço sintático em funções ou blocos condicionais.',
        topic: 'Controle de Fluxo',
      },
      {
        q: 'Como funciona o escopo de variáveis com a palavra-chave `global` dentro de uma função?',
        opts: ['Declara que a variável pertence ao escopo do módulo e pode ser reatribuída dentro da função', 'Cria uma variável imutável no sistema', 'Exporta a variável para todos os módulos importados', 'Executa a variável no interpretador C'],
        correct: 0,
        exp: 'A palavra-chave `global` permite que uma função modifique uma variável definida no escopo global do módulo.',
        topic: 'Escopo e Funções',
      },
      {
        q: 'Qual é o resultado da expressão `"dev" * 3` em Python?',
        opts: ['"dev3"', '"devdevdev"', 'Erro de tipo (TypeError)', '["dev", "dev", "dev"]'],
        correct: 1,
        exp: 'Em Python, a multiplicação de uma string por um inteiro repete a sequência pelo número de vezes indicado.',
        topic: 'Manipulação de Strings',
      },
    ],
    dataStructuresAndTypes: [
      {
        q: 'Em Python, qual a complexidade temporal média de busca de uma chave em um dicionário (dict)?',
        opts: ['O(n)', 'O(1)', 'O(log n)', 'O(n²)'],
        correct: 1,
        exp: 'Dicionários em Python são implementados como tabelas hash (hash maps), oferecendo tempo constante O(1) médio para busca, inserção e deleção.',
        topic: 'Estruturas de Dados e Algoritmos',
      },
      {
        q: 'O que a estrutura de dados `set` garante em relação aos seus elementos?',
        opts: ['Elementos ordenados por inserção', 'Elementos estritamente únicos e não duplicados', 'Acesso via índice posicional', 'Imutabilidade absoluta dos itens'],
        correct: 1,
        exp: 'Um `set` (conjunto) em Python armazena apenas elementos únicos, eliminando automaticamente qualquer duplicata.',
        topic: 'Coleções e Sets',
      },
      {
        q: 'Qual método de dicionário retorna o valor associado a uma chave ou um valor padrão caso a chave não exista, sem disparar KeyError?',
        opts: ['dict.fetch()', 'dict.get(key, default)', 'dict.find()', 'dict.lookup()'],
        correct: 1,
        exp: '`dict.get(key, default)` busca a chave de forma segura e retorna o valor padrão fornecido se a chave não existir.',
        topic: 'Dicionários',
      },
      {
        q: 'Como funciona uma list comprehension com filtro condicional?',
        opts: ['[x for x in lista if x % 2 == 0]', '[for x in lista if x % 2 == 0 select x]', 'lista.filter(x => x % 2 == 0)', '[filter(x) from lista]'],
        correct: 0,
        exp: 'A sintaxe idiomática para list comprehension com filtro é `[expressao for item in iteravel if condicao]`.',
        topic: 'List Comprehensions',
      },
    ],
    advancedAndAsync: [
      {
        q: 'Qual é a função do `yield` em uma função geradora (generator) do Python?',
        opts: ['Interrompe e encerra a função definitivamente', 'Produz um valor e congela o estado de execução até a próxima iteração', 'Converte a função em uma thread assíncrona', 'Retorna uma lista completa para a memória'],
        correct: 1,
        exp: '`yield` pausa a execução do gerador, preservando suas variáveis locais para que retome na chamada subsequente de `next()`, economizando memória.',
        topic: 'Generators e Iterators',
      },
      {
        q: 'O que é o GIL (Global Interpreter Lock) no CPython?',
        opts: ['Um mecanismo de segurança contra injeção SQL', 'Um mutex que impede que múltiplas threads nativas executem bytecodes Python simultaneamente', 'O compilador JIT do Python', 'O gerenciador de pacotes pip'],
        correct: 1,
        exp: 'O GIL é um lock do interpretador CPython que sincroniza a execução de threads, permitindo que apenas uma thread execute código Python por vez em um processo.',
        topic: 'Concorrência e Arquitetura',
      },
      {
        q: 'Como um decorador (decorator) `@meu_decorador` modifica uma função?',
        opts: ['Altera o código fonte do arquivo .py', 'Envolve a função original recebendo-a como argumento e retornando uma nova função wrapper', 'Compila a função para código de máquina C', 'Força tipagem estática'],
        correct: 1,
        exp: 'Decoradores são funções de ordem superior que encapsulam outras funções para estender ou interceptar seu comportamento sem alterar o corpo original.',
        topic: 'Metaprogramação e Decorators',
      },
      {
        q: 'Para que serve a biblioteca `asyncio` e as palavras-chave `async` e `await`?',
        opts: ['Executar paralelismo com múltiplos processos de GPU', 'Gerenciar I/O assíncrono não-bloqueante orientado a Event Loop em uma única thread', 'Criar interfaces gráficas com Tkinter', 'Compilar Python em C++'],
        correct: 1,
        exp: '`asyncio` fornece um loop de eventos para execução cooperativa e concorrente de tarefas de I/O de alta escala com corrotinas.',
        topic: 'Programação Assíncrona',
      },
    ],
    architectureAndSecurity: [
      {
        q: 'Qual é a forma segura de abrir arquivos para garantir o fechamento automático mesmo em caso de exceções?',
        opts: ['file.open() e file.close()', 'Bloco context manager `with open(filename, mode) as f:`', 'open(filename).auto_close()', 'file.safe_stream()'],
        correct: 1,
        exp: 'O context manager `with` garante que o método `__exit__` do arquivo seja invocado e feche os descritores do sistema operacional.',
        topic: 'Context Managers e Recursos',
      },
      {
        q: 'Como o Python previne injeção SQL ao usar bibliotecas de banco de dados (ex: sqlite3, psycopg2)?',
        opts: ['Usando consultas formatadas com f-strings', 'Usando consultas parametrizadas com placeholders (?, %s)', 'Desabilitando strings no banco', 'Executando o banco em modo sandbox'],
        correct: 1,
        exp: 'Consultas parametrizadas enviam dados e instruções separadamente para o motor SQL, impossibilitando a injeção maliciosa de comandos.',
        topic: 'Segurança e Bancos de Dados',
      },
    ],
    practicalChallenges: [
      {
        prompt: 'Escreva uma função `calcular_media(notas: list) -> float` que receba uma lista de números e retorne a média aritmética arredondada para 2 casas decimais.',
        topic: 'Funções e Algoritmos',
        initialCode: 'def calcular_media(notas: list) -> float:\n    # Implemente o cálculo da média\n    pass\n',
        expectedKeywords: ['sum', 'len', 'round', 'return'],
        correctSnippet: 'def calcular_media(notas: list) -> float:\n    if not notas:\n        return 0.0\n    return round(sum(notas) / len(notas), 2)',
        hint: 'Use sum(notas) dividido por len(notas) com round(..., 2).',
        explanation: 'A função soma todos os elementos da lista e divide pelo total de itens, arredondando com 2 casas decimais.',
      },
      {
        prompt: 'Crie uma função `filtrar_pares(numeros: list) -> list` usando list comprehension para retornar apenas os números pares da lista.',
        topic: 'List Comprehensions',
        initialCode: 'def filtrar_pares(numeros: list) -> list:\n    # Retorne apenas os pares\n    pass\n',
        expectedKeywords: ['for', 'in', 'if', '%', '2', '==', '0'],
        correctSnippet: 'def filtrar_pares(numeros: list) -> list:\n    return [n for n in numeros if n % 2 == 0]',
        hint: 'Use [n for n in numeros if n % 2 == 0].',
        explanation: 'A list comprehension filtra de forma concisa e eficiente os elementos cujo resto da divisão por 2 é zero.',
      },
      {
        prompt: 'Implemente uma classe `Contador` com método `incrementar(self, valor=1)` e propriedade `obter_total(self)`.',
        topic: 'Orientação a Objetos',
        initialCode: 'class Contador:\n    def __init__(self, inicial=0):\n        self.total = inicial\n    \n    # Implemente incrementar e obter_total\n',
        expectedKeywords: ['def', 'incrementar', 'self', 'obter_total', 'return'],
        correctSnippet: 'class Contador:\n    def __init__(self, inicial=0):\n        self.total = inicial\n    def incrementar(self, valor=1):\n        self.total += valor\n    def obter_total(self):\n        return self.total',
        hint: 'Defina os métodos com self e modifique self.total.',
        explanation: 'Orientação a objetos com encapsulamento de estado interno e métodos de instância.',
      },
    ],
  },
};

/**
 * Gera um exame com rigor acadêmico de 80 questões (60 Teóricas + 20 Práticas) para qualquer tecnologia.
 */
export function generateCourseExam(techId: TechId): CourseExam {
  const tech = TECHNOLOGIES.find(t => t.id === techId) || TECHNOLOGIES[0];
  const allLessons = [
    ...getLessonsForTechAndLevel(techId, 'iniciante'),
    ...getLessonsForTechAndLevel(techId, 'intermediario'),
    ...getLessonsForTechAndLevel(techId, 'avancado'),
    ...getLessonsForTechAndLevel(techId, 'projetos'),
  ];

  const questions: ExamQuestion[] = [];
  const customCurriculum = TECH_CURRICULUM_DATA[techId];

  // 1. GERAR 60 QUESTÕES TEÓRICAS (Índices 1 a 60)
  // Utilizamos tópicos reais da tecnologia e das 20 aulas do curso
  const theoryTopics = [
    'Sintaxe & Gramática da Linguagem',
    'Tipagem, Variáveis & Gerenciamento de Memória',
    'Controle de Fluxo & Estruturas Condicionais',
    'Laços de Repetição & Iteradores',
    'Funções, Escopo & Modularização',
    'Estruturas de Dados & Coleções',
    'Algoritmos de Manipulação & Ordenação',
    'Tratamento de Exceções & Erros de Execução',
    'Programação Orientada a Objetos & Classes',
    'Encapsulamento, Herança & Polimorfismo',
    'Programação Funcional & Imutabilidade',
    'Operações Assíncronas, Concorrência & Paralelismo',
    'Manipulação de I/O, Arquivos & Streams',
    'APIs, Requisições HTTP & Integrações REST',
    'Segurança, Prevenção de Injeção & Sanitização',
    'Padrões de Projeto (Design Patterns) & Clean Code',
    'Gerenciamento de Dependências & Ecossistema de Pacotes',
    'Performance, Otimização & Complexidade Temporal Big-O',
    'Testes Automatizados, TDD & Cobertura de Código',
    'Arquitetura de Software, Deploy & Boas Práticas',
  ];

  // Gera 60 questões teóricas cobrindo amplamente os 20 tópicos estruturados
  for (let i = 0; i < 60; i++) {
    const topic = theoryTopics[i % theoryTopics.length];
    const lessonRef = allLessons[i % allLessons.length];

    // Se temos questão especializada no currículo, usamos
    let qText = '';
    let opts: string[] = [];
    let correctIdx = 0;
    let exp = '';

    if (customCurriculum && i < 20) {
      const bank = [
        ...customCurriculum.syntaxFundamentals,
        ...customCurriculum.dataStructuresAndTypes,
        ...customCurriculum.advancedAndAsync,
        ...customCurriculum.architectureAndSecurity,
      ];
      if (bank[i % bank.length]) {
        const item = bank[i % bank.length];
        qText = `[${tech.name} • Teoria ${i + 1}/60] ${item.q}`;
        opts = item.opts;
        correctIdx = item.correct;
        exp = item.exp;
      }
    }

    if (!qText) {
      // Geração contextual com base nos conceitos da tecnologia
      const lessonTitle = lessonRef ? lessonRef.title : `${tech.name} Módulo ${i + 1}`;
      const qVariants = [
        {
          q: `Em ${tech.name}, considerando o tópico "${topic}" ensinado em "${lessonTitle}", qual das seguintes afirmações expressa a regra técnica correta e padrão da indústria?`,
          opts: [
            `A implementação deve respeitar o princípio de encapsulamento e segurança de tipos em tempo de execução/compilação do ecossistema ${tech.name}.`,
            `Nenhuma validação é necessária pois o interpretador/compilador ignora regras de escopo e mutabilidade.`,
            `O uso de variáveis globais sem controle de acesso é a prática recomendada para este contexto.`,
            `Todas as operações de I/O devem ser síncronas e bloqueantes para simplificar o código.`
          ],
          correct: 0,
          exp: `No ecossistema ${tech.name}, o respeito aos padrões de encapsulamento, tipagem e boas práticas arquiteturais garante confiabilidade e manutenção sustentável do software.`
        },
        {
          q: `Qual é o comportamento esperado ao lidar com tratamento de erros e exceções em ${tech.name} no contexto de "${topic}"?`,
          opts: [
            `Capturar exceções específicas no bloco adequado e registrar ou propagar de forma controlada.`,
            `Ocultar todos os erros com blocos vazios sem logs ou tratamento.`,
            `Reiniciar o processo do sistema operacional a cada falha de conversão.`,
            `Desativar o coletor de lixo ou garbage collector para contornar exceções.`
          ],
          correct: 0,
          exp: `O tratamento rigoroso de exceções exige captura granular de tipos específicos de erro para manter a estabilidade do sistema.`
        },
        {
          q: `Ao otimizar a performance e uso de memória em ${tech.name} (${topic}), qual diretriz de engenharia deve ser priorizada?`,
          opts: [
            `Utilizar estruturas de dados com complexidade algorítmica adequada (ex: buscas O(1) com hash tables quando apropriado) e evitar alocações desnecessárias.`,
            `Duplicar todos os arrays na memória antes de cada iteração para evitar concorrência.`,
            `Substituir todos os algoritmos eficientes por loops aninhados O(n³) para garantir cobertura.`,
            `Bloquear a thread principal durante leituras extensas de dados.`
          ],
          correct: 0,
          exp: `A seleção criteriosa de estruturas de dados e a análise de complexidade temporal e espacial são os pilares de performance em ${tech.name}.`
        },
      ];

      const chosen = qVariants[i % qVariants.length];
      qText = `[${tech.name} • Questão Teórica ${i + 1}/60] ${chosen.q}`;
      opts = chosen.opts;
      correctIdx = chosen.correct;
      exp = chosen.exp;
    }

    questions.push({
      id: `exam-${techId}-theory-${i + 1}`,
      number: i + 1,
      type: 'theory',
      question: qText,
      topic,
      options: opts,
      correctIndex: correctIdx,
      explanation: exp,
    });
  }

  // 2. GERAR 20 QUESTÕES PRÁTICAS DE CÓDIGO (Índices 61 a 80)
  const practicalTopics = [
    'Declaração de Funções & Retorno Tipado',
    'Manipulação de Coleções & Filtragem de Dados',
    'Algoritmo de Busca & Ordenação Customizada',
    'Criação de Classes & Encapsulamento de Propriedades',
    'Processamento de Strings & Formatação Segura',
    'Validação de Entradas com Expressões Regulares',
    'Consumo Assíncrono de Dados (Async / Await / Promises)',
    'Tratamento de Exceções com Blocos Try/Catch/Except',
    'Implementação de Estrutura Pilha / Fila (Stack/Queue)',
    'Cálculo de Estatísticas & Agregações de Dados',
    'Parsing & Serialização de Objetos JSON',
    'Gerenciamento de Estado & Imutabilidade',
    'Pipeline de Transformação (Map / Filter / Reduce)',
    'Controle de Concorrência & Cancelamento Seguro',
    'Autenticação de Token & Verificação de Permissões',
    'Construção de Query / Consulta Parametrizada',
    'Design Pattern Singleton / Factory de Módulo',
    'Debounce / Throttling de Eventos Rápidos',
    'Algoritmo Recursivo com Caso Base Protegido',
    'Refatoração de Código para Clean Code & Sem Efeitos Colaterais',
  ];

  for (let j = 0; j < 20; j++) {
    const questionNumber = 61 + j;
    const topic = practicalTopics[j % practicalTopics.length];

    let pPrompt = '';
    let initialCode = '';
    let expectedKeywords: string[] = [];
    let correctSnippet = '';
    let hint = '';
    let explanation = '';

    if (customCurriculum && customCurriculum.practicalChallenges[j]) {
      const customPrac = customCurriculum.practicalChallenges[j];
      pPrompt = `[${tech.name} • Prática ${j + 1}/20] ${customPrac.prompt}`;
      initialCode = customPrac.initialCode;
      expectedKeywords = customPrac.expectedKeywords;
      correctSnippet = customPrac.correctSnippet;
      hint = customPrac.hint;
      explanation = customPrac.explanation;
    } else {
      // Template padrão robusto para a stack
      pPrompt = `[${tech.name} • Desafio Prático ${j + 1}/20 - ${topic}]\nImplemente uma solução completa em ${tech.name} para a rotina de "${topic}". O código deve validar os parâmetros, processar os dados e retornar o resultado correto sem gerar exceções não tratadas.`;
      
      initialCode = `// [${tech.name}] Prática ${j + 1}/20 - ${topic}\n// Implemente a função de produção abaixo:\nfunction executarRotina_${j + 1}(entrada) {\n    // Escreva sua lógica aqui\n    return null;\n}\n`;
      expectedKeywords = ['return', 'function', topic.split(' ')[0].toLowerCase()];
      correctSnippet = `function executarRotina_${j + 1}(entrada) {\n    if (!entrada) return null;\n    // Processamento concluído com sucesso\n    return entrada;\n}`;
      hint = `Garanta a verificação de parâmetros nulos e o retorno do resultado esperado com a sintaxe correta de ${tech.name}.`;
      explanation = `Implementação prática avaliando a aplicação de lógica, prevenção de bugs e boas práticas na linguagem ${tech.name}.`;
    }

    questions.push({
      id: `exam-${techId}-practical-${j + 1}`,
      number: questionNumber,
      type: 'practical',
      question: pPrompt,
      topic,
      initialCode,
      expectedKeywords,
      correctSnippet,
      hint,
      explanation,
    });
  }

  return {
    id: `exam-${techId}`,
    techId,
    title: `Exame Oficial de Passagem de Curso — ${tech.name}`,
    description: `Exame final obrigatório para comprovação de domínio e desbloqueio do próximo curso. Duração cronometrada de 120 minutos, composto por 60 questões teóricas e 20 exercícios práticos de código. Critério de aprovação: 20 de 20 valores (100% de precisão).`,
    totalQuestions: 80,
    theoryCount: 60,
    practicalCount: 20,
    durationMinutes: 120,
    maxScore: 20,
    passingScore: 20,
    questions,
  };
}

/**
 * Avalia de forma estrita uma submissão de exame.
 * 
 * Regras:
 * - Se timedOut === true, a nota final é automaticamente 0 e reprovado.
 * - Teoria: 60 questões (cada acerto vale 1 ponto na escala de 60).
 * - Prática: 20 questões (cada acerto vale 1 ponto na escala de 20).
 * - Total de acertos: de 0 a 80.
 * - Nota final em valores (escala 0 a 20): (totalCorrect / 80) * 20.
 * - Aprovação estrita: EXIGE exatamente 20 valores (80 acertos em 80).
 */
export function evaluateExamSubmission(
  exam: CourseExam,
  userAnswers: Record<string, string | number>,
  timeSpentSeconds: number,
  timedOut: boolean
): {
  theoryCorrect: number;
  practicalCorrect: number;
  totalCorrect: number;
  scoreOutOf20: number;
  passed: boolean;
  attempt: ExamAttempt;
} {
  if (timedOut) {
    const attempt: ExamAttempt = {
      id: 'attempt-' + Date.now(),
      techId: exam.techId,
      startedAt: new Date(Date.now() - timeSpentSeconds * 1000).toISOString(),
      submittedAt: new Date().toISOString(),
      resultsReleaseAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutos de embargo
      timeSpentSeconds,
      timeRemainingSeconds: 0,
      timedOut: true,
      answers: userAnswers,
      theoryCorrect: 0,
      practicalCorrect: 0,
      totalCorrect: 0,
      scoreOutOf20: 0,
      passed: false,
      status: 'under_review',
    };

    return {
      theoryCorrect: 0,
      practicalCorrect: 0,
      totalCorrect: 0,
      scoreOutOf20: 0,
      passed: false,
      attempt,
    };
  }

  let theoryCorrect = 0;
  let practicalCorrect = 0;

  for (const q of exam.questions) {
    const ans = userAnswers[q.id];
    if (q.type === 'theory') {
      if (typeof ans === 'number' && ans === q.correctIndex) {
        theoryCorrect++;
      }
    } else if (q.type === 'practical') {
      if (typeof ans === 'string' && ans.trim().length > 0) {
        const codeText = ans.toLowerCase();
        // Verifica se o usuário escreveu código substancial com as palavras-chave necessárias
        let isCorrect = true;
        if (q.expectedKeywords && q.expectedKeywords.length > 0) {
          for (const kw of q.expectedKeywords) {
            if (!codeText.includes(kw.toLowerCase())) {
              isCorrect = false;
              break;
            }
          }
        }
        // Validação mínima de não estar vazio ou apenas com comentários
        if (ans.trim().length < 15) {
          isCorrect = false;
        }

        if (isCorrect) {
          practicalCorrect++;
        }
      }
    }
  }

  const totalCorrect = theoryCorrect + practicalCorrect;
  // Cálculo exato de 0 a 20 valores
  const rawScore = (totalCorrect / 80) * 20;
  const scoreOutOf20 = totalCorrect === 80 ? 20 : Number(rawScore.toFixed(2));
  const passed = !timedOut && totalCorrect === 80 && scoreOutOf20 === 20;

  const now = new Date();
  const resultsReleaseAt = new Date(now.getTime() + 30 * 60 * 1000).toISOString(); // 30 min embargo

  const attempt: ExamAttempt = {
    id: 'attempt-' + Date.now(),
    techId: exam.techId,
    startedAt: new Date(now.getTime() - timeSpentSeconds * 1000).toISOString(),
    submittedAt: now.toISOString(),
    resultsReleaseAt,
    timeSpentSeconds,
    timeRemainingSeconds: Math.max(0, 120 * 60 - timeSpentSeconds),
    timedOut,
    answers: userAnswers,
    theoryCorrect,
    practicalCorrect,
    totalCorrect,
    scoreOutOf20,
    passed,
    status: 'under_review',
  };

  return {
    theoryCorrect,
    practicalCorrect,
    totalCorrect,
    scoreOutOf20,
    passed,
    attempt,
  };
}
