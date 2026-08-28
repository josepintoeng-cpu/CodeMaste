import { TechId, CourseExam, ExamQuestion, ExamAttempt } from '../types';
import { TECHNOLOGIES } from './technologies';
import { getLessonsForTechAndLevel } from './index';
import { EXAM_QUESTION_BANKS, RawTheoryQuestion, RawPracticalQuestion } from './examQuestionBanks';

/**
 * Utilitário de embaralhamento determinístico / aleatório (Fisher-Yates)
 */
function shuffleArray<T>(array: T[], seed?: number): T[] {
  const arr = [...array];
  let currentSeed = seed !== undefined ? seed : Math.floor(Math.random() * 1000000);
  
  // Gerador Linear Congruencial simples para reprodutibilidade quando seed é fornecido
  const nextRand = () => {
    if (seed !== undefined) {
      currentSeed = (currentSeed * 9301 + 49297) % 233280;
      return currentSeed / 233280;
    }
    return Math.random();
  };

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(nextRand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Embaralha as 4 opções de uma questão de múltipla escolha e recalcula com precisão o novo correctIndex
 */
function shuffleQuestionOptions(
  opts: string[],
  correctIndex: number,
  seed?: number
): { shuffledOpts: string[]; newCorrectIndex: number } {
  const indexed = opts.map((opt, idx) => ({ opt, isCorrect: idx === correctIndex }));
  const shuffled = shuffleArray(indexed, seed);
  const newCorrectIndex = shuffled.findIndex(item => item.isCorrect);
  return {
    shuffledOpts: shuffled.map(item => item.opt),
    newCorrectIndex: newCorrectIndex >= 0 ? newCorrectIndex : 0,
  };
}

/**
 * Banco de Tópicos Especializados por Domínio Tecnológico para Geração Algorítmica de Alta Rigidez
 */
interface DomainSpec {
  theoryCategories: {
    category: string;
    subtopics: {
      title: string;
      scenarios: {
        stem: (techName: string) => string;
        correct: (techName: string) => string;
        distractors: (techName: string) => string[];
        explanation: (techName: string) => string;
      }[];
    }[];
  }[];
  practicalTemplates: {
    title: string;
    generate: (techName: string, techId: TechId, variantIdx: number) => {
      prompt: string;
      topic: string;
      initialCode: string;
      expectedKeywords: string[];
      correctSnippet: string;
      hint: string;
      explanation: string;
    };
  }[];
}

const ADVANCED_DOMAINS: Record<string, DomainSpec> = {
  general: {
    theoryCategories: [
      {
        category: 'Arquitetura de Memória & Ciclo de Vida',
        subtopics: [
          {
            title: 'Alocação Heap vs Stack & Garbage Collection',
            scenarios: [
              {
                stem: tech => `Em sistemas de alta performance desenvolvidos com ${tech}, como o runtime gerencia a alocação de objetos no Heap versus variáveis primitivas locais no Stack frame, e qual a consequência de retenções de ponteiro não liberadas?`,
                correct: tech => `Variáveis locais e endereços de retorno são alocados no Stack frame com desalocação O(1) determinística ao final do escopo léxico; objetos no Heap requerem rastreamento pelo coletor de memória ou gerenciamento explícito, onde referências vivas retidas em coleções estáticas impedem a coleta de lixo gerando Memory Leaks.`,
                distractors: tech => [
                  `Todos os dados em ${tech} são alocados exclusivamente no Stack, impossibilitando qualquer ocorrência de fragmentação de memória ou estouro de pilha.`,
                  `O coletor de lixo desaloca periodicamente todos os objetos do Heap sem inspecionar a raiz de referências ativas (GC Roots).`,
                  `Objetos instanciados no Heap possuem vida útil idêntica à função que os instanciou, sendo destruídos imediatamente ao atingir a instrução de retorno.`
                ],
                explanation: tech => `No modelo de computação de ${tech}, o Stack lida com o fluxo de execução com custo de liberação imediata, enquanto o Heap suporta vida dinâmica de dados sob custo de fragmentação e necessidade de rastreamento de GC roots.`
              },
              {
                stem: tech => `Qual é o impacto de "Stop-the-World" em coletores de lixo geracionais quando ocorre uma coleta completa (Major/Full GC) em aplicações críticas de ${tech}?`,
                correct: tech => `A execução de todas as threads de aplicação é temporariamente pausada para que o coletor varra com segurança o grafo de objetos da geração antiga (Tenured/Old Gen), gerando picos súbitos de latência (p99) se o volume de objetos vivos de longa duração for excessivo.`,
                distractors: tech => [
                  `Stop-the-World duplica instantaneamente a taxa de transferência (throughput) da CPU sem impactar a resposta a requisições de rede.`,
                  `Full GC em ${tech} ocorre em tempo zero sem intervenção em threads ativas.`,
                  `Aplicações em ${tech} reiniciam o sistema operacional automaticamente durante coletas de lixo profundas.`
                ],
                explanation: tech => `Pausas Stop-the-World são o principal desafio de SLAs em sistemas de baixa latência, exigindo tuneamento fino de alocações efêmeras e redução de objetos promovidos.`
              }
            ]
          }
        ]
      },
      {
        category: 'Concorrência, Assincronismo & Sincronização',
        subtopics: [
          {
            title: 'Deadlocks, Race Conditions & Mutexes',
            scenarios: [
              {
                stem: tech => `Em um cenário de concorrência massiva em ${tech}, o que caracteriza uma Condição de Corrida (Race Condition) e como preveni-la formalmente?`,
                correct: tech => `Ocorre quando múltiplas threads ou corrotinas concorrentes acessam e modificam um estado compartilhado sem sincronização adequada, tornando o resultado final dependente da ordem não-determinística de escalonamento; previne-se utilizando primitivas atômicas (CAS), mutexes, canais com passagem de mensagens ou imutabilidade de dados.`,
                distractors: tech => [
                  `Race condition é um erro de sintaxe detectado em tempo de compilação quando duas funções têm o mesmo nome.`,
                  `Previne-se duplicando o hardware de processamento e desativando o isolamento de transações.`,
                  `Ocorre apenas quando o consumo de memória RAM atinge 100% da capacidade física.`
                ],
                explanation: tech => `Condições de corrida comprometem a integridade dos dados em tempo de execução. O uso de mecanismos de exclusão mútua e concorrência baseada em atores/canais garante consistência formal.`
              },
              {
                stem: tech => `Sob quais condições fundamentais ocorre um Deadlock clássico (Impasse) em sistemas concorrentes?`,
                correct: tech => `Quando as 4 condições de Coffman são satisfeitas simultaneamente: Exclusão Mútua, Posse e Espera (Hold and Wait), Não-Preempção e Espera Circular entre recursos bloqueados.`,
                distractors: tech => [
                  `Quando uma thread consome 100% de CPU sem realizar chamadas assíncronas.`,
                  `Quando o compilador não encontra o arquivo de dependências no diretório root.`,
                  `Quando duas threads tentam ler simultaneamente uma variável estritamente imutável.`
                ],
                explanation: tech => `As quatro condições de Coffman explicam matematicamente a ocorrência de deadlocks. Romper qualquer uma das 4 condições previne o impasse.`
              }
            ]
          }
        ]
      },
      {
        category: 'Segurança, Sanitização & Proteção de Vulnerabilidades',
        subtopics: [
          {
            title: 'Prevenção de Injeções, SSRF, XSS & ReDoS',
            scenarios: [
              {
                stem: tech => `Qual é a defesa canônica contra vulnerabilidades de Injeção (como SQL Injection ou Command Injection) no ecossistema ${tech}?`,
                correct: tech => `Utilização estrita de consultas parametrizadas (Prepared Statements) e APIs seguras com separação absoluta entre a estrutura de comandos e os dados fornecidos pelo usuário, complementada por validação rigorosa de esquemas de entrada (Input Whitelisting).`,
                distractors: tech => [
                  `Concatenação direta de strings com escape manual de aspas simples usando replace().`,
                  `Codificação dos parâmetros em Base64 antes de concatenar na query SQL.`,
                  `Execução das consultas exclusivamente com permissões de superusuário (root/dba) no banco de dados.`
                ],
                explanation: tech => `Prepared Statements enviam a instrução compilada e os parâmetros em canais distintos do protocolo binário, neutralizando qualquer tentativa de subversão da árvore sintática.`
              },
              {
                stem: tech => `O que é um ataque de ReDoS (Regular Expression Denial of Service) e como mitigá-lo em código de produção em ${tech}?`,
                correct: tech => `Uma vulnerabilidade onde uma expressão regular mal projetada com quantificadores aninhados sofre de Retrocesso Catastrófico (Catastrophic Backtracking) com complexidade exponencial O(2^n) diante de inputs maliciosos; mitiga-se com regexes lineares O(n) (motores DFA), timeouts estritos na execução e limites de tamanho de entrada.`,
                distractors: tech => [
                  `Um ataque que altera o DNS do servidor através de cookies HTTP expirados.`,
                  `Uma falha de hardware que queima a controladora de disco durante buscas de texto.`,
                  `Uma injeção de scripts JavaScript no cabeçalho TCP do cliente.`
                ],
                explanation: tech => `O retrocesso catastrófico congela a thread de processamento ao tentar avaliar todas as permutações de matching em árvores de NFA ambíguas.`
              }
            ]
          }
        ]
      },
      {
        category: 'Engenharia de Performance, Big-O & Otimização',
        subtopics: [
          {
            title: 'Complexidade Algorítmica e Estruturas de Dados',
            scenarios: [
              {
                stem: tech => `Ao lidar com milhões de registros em ${tech}, qual é a razão para preferir uma Tabela Hash (Hash Map) a uma Lista Encadeada (Linked List) para operações de busca frequentes?`,
                correct: tech => `Tabelas Hash oferecem complexidade média de busca O(1) através de funções de dispersão e buckets de endereçamento direto, enquanto Listas Encadeadas exigem percurso sequencial O(n) para localização de elementos.`,
                distractors: tech => [
                  `Listas encadeadas têm tempo de busca O(1) constante e Hash maps têm complexidade O(n³).`,
                  `Tabelas hash não ocupam espaço na memória RAM e rodam diretamente na GPU.`,
                  `Listas encadeadas impedem que a CPU acesse a memória cache L1/L2.`
                ],
                explanation: tech => `O acesso direto via hash indexado minimiza ciclos de CPU em operações críticas de recuperação de dados em grande volume.`
              }
            ]
          }
        ]
      }
    ],
    practicalTemplates: [
      {
        title: 'Algoritmo de Busca Binária com Deduplicação e Limites',
        generate: (techName, techId, variant) => ({
          prompt: `[${techName} • Desafio Prático ${variant}/20 - Algoritmos Avançados]\nImplemente uma função de busca binária eficiente \`busca_binaria(arr, alvo)\` que encontre a primeira ocorrência do elemento \`alvo\` em um array ordenado em tempo logarítmico O(log n) e retorne o índice encontrado ou -1 caso não exista.`,
          topic: 'Algoritmos de Busca & Complexidade Big-O',
          initialCode: `// [${techName}] Implementação de Busca Binária O(log n)\nfunction busca_binaria(arr, alvo) {\n    // Implemente a busca binária com controle de limites esquerdo e direito\n    return -1;\n}\n`,
          expectedKeywords: ['function', 'while', 'arr', 'alvo', 'return', '<', '>', 'Math'],
          correctSnippet: `function busca_binaria(arr, alvo) {\n    let inicio = 0;\n    let fim = arr.length - 1;\n    let resultado = -1;\n    while (inicio <= fim) {\n        let meio = Math.floor((inicio + fim) / 2);\n        if (arr[meio] === alvo) {\n            resultado = meio;\n            fim = meio - 1; // Busca a primeira ocorrência\n        } else if (arr[meio] < alvo) {\n            inicio = meio + 1;\n        } else {\n            fim = meio - 1;\n        }\n    }\n    return resultado;\n}`,
          hint: 'Mantenha dois ponteiros (inicio e fim) e atualize o meio a cada iteração dividindo o espaço de busca pela metade.',
          explanation: 'A busca binária garante complexidade O(log n), sendo indispensável para busca em coleções de larga escala.'
        })
      },
      {
        title: 'Pipeline de Resiliência com Retry e Exponential Backoff',
        generate: (techName, techId, variant) => ({
          prompt: `[${techName} • Desafio Prático ${variant}/20 - Resiliência e Concorrência]\nCrie uma função assíncrona \`executar_com_retry(tarefa_fn, max_tentativas, delay_inicial)\` que execute uma operação assíncrona, capturando falhas transitórias e reexecutando com backoff exponencial (dobrando o tempo de espera a cada falha) até atingir o limite de tentativas.`,
          topic: 'Concorrência, Async & Resiliência',
          initialCode: `// [${techName}] Função de Resiliência com Backoff Exponencial\nasync function executar_com_retry(tarefa_fn, max_tentativas = 3, delay_inicial = 100) {\n    // Implemente a lógica com try/catch e controle de delay exponencial\n}\n`,
          expectedKeywords: ['async', 'function', 'try', 'catch', 'await', 'max_tentativas', 'return'],
          correctSnippet: `async function executar_com_retry(tarefa_fn, max_tentativas = 3, delay_inicial = 100) {\n    let tentativa = 0;\n    let delay = delay_inicial;\n    while (tentativa < max_tentativas) {\n        try {\n            return await tarefa_fn();\n        } catch (erro) {\n            tentativa++;\n            if (tentativa >= max_tentativas) throw erro;\n            await new Promise(r => setTimeout(r, delay));\n            delay *= 2;\n        }\n    }\n}`,
          hint: 'Use um laço de repetição com try/catch e multiplique o delay por 2 a cada iteração de erro.',
          explanation: 'Padrão crítico de resiliência em sistemas distribuídos e microsserviços para tolerância a falhas de rede.'
        })
      },
      {
        title: 'Estrutura de Fila de Prioridade com Heap Mínimo',
        generate: (techName, techId, variant) => ({
          prompt: `[${techName} • Desafio Prático ${variant}/20 - Estruturas de Dados]\nImplemente uma classe \`FilaDePrioridade\` com suporte a \`inserir(item, prioridade)\`, \`remover()\` (retorna o item de menor valor de prioridade) e \`tamanho()\`.`,
          topic: 'Estruturas de Dados Avançadas & Filas',
          initialCode: `// [${techName}] Fila de Prioridade (Priority Queue)\nclass FilaDePrioridade {\n    constructor() {\n        this.itens = [];\n    }\n    inserir(item, prioridade) {\n        // Inserção ordenada ou Heap\n    }\n    remover() {\n        // Remove e retorna o item de maior prioridade (menor número)\n        return null;\n    }\n    tamanho() {\n        return this.itens.length;\n    }\n}\n`,
          expectedKeywords: ['class', 'constructor', 'inserir', 'remover', 'prioridade', 'return'],
          correctSnippet: `class FilaDePrioridade {\n    constructor() {\n        this.itens = [];\n    }\n    inserir(item, prioridade) {\n        const elemento = { item, prioridade };\n        let inserido = false;\n        for (let i = 0; i < this.itens.length; i++) {\n            if (elemento.prioridade < this.itens[i].prioridade) {\n                this.itens.splice(i, 0, elemento);\n                inserido = true;\n                break;\n            }\n        }\n        if (!inserido) this.itens.push(elemento);\n    }\n    remover() {\n        if (this.itens.length === 0) return null;\n        return this.itens.shift().item;\n    }\n    tamanho() {\n        return this.itens.length;\n    }\n}`,
          hint: 'Mantenha a lista ordenada pelo peso da prioridade ou utilize arrays com shift/unshift.',
          explanation: 'Filas de prioridade são a base de agendadores de tarefas, algoritmos como Dijkstra e A*.'
        })
      }
    ]
  }
};

/**
 * 20 Tópicos Estruturados do Currículo de Exame de Passagem
 */
export const EXAM_TOPIC_CURRICULUM = [
  'Fundamentos de Compilação, Tipos & Runtime',
  'Gerenciamento de Memória, Stack vs Heap & GC',
  'Controle de Fluxo Rigoroso & Prevenção de Falhas',
  'Estruturas de Dados Avançadas & Tabelas Hash',
  'Complexidade Temporal Big-O & Otimização de Algoritmos',
  'Programação Orientada a Objetos, SOLID & Design Patterns',
  'Programação Funcional, Imutabilidade & Monads',
  'Concorrência, Threads, Mutexes & Event Loops',
  'Programação Assíncrona, Promises & Reatividade',
  'Tratamento Robusto de Exceções & Fail-Safe Defaults',
  'Segurança de Software, Prevenção de OWASP Top 10',
  'Autenticação, Criptografia, Tokens JWT & Hashing',
  'Manipulação de I/O de Baixo Nível, Streams & Buffers',
  'Comunicação de Rede, Protocolos HTTP/3, gRPC & WebSockets',
  'Arquitetura de Banco de Dados, Transações ACID & Índices B-Tree',
  'Isolamento de Transações, Locks Otimistas vs Pessimistas',
  'Padrões de Resiliência: Circuit Breaker, Retry & Throttling',
  'Testes Unitários, Mocking, TDD & Cobertura de Código',
  'Arquitetura de Microsserviços, CI/CD & Deploy Seguro',
  'Boas Práticas de Engenharia, Clean Code & Manutenibilidade'
];

/**
 * Gera um Exame de Passagem Oficial de 80 Questões (60 Teóricas + 20 Práticas)
 * com rigor técnico máximo, total aleatorização de questões e opções, e garantia
 * de que nenhum exame repetido apresenta as mesmas questões na mesma ordem.
 */
export function generateCourseExam(
  techId: TechId,
  options?: { attemptSeed?: number; randomize?: boolean }
): CourseExam {
  const tech = TECHNOLOGIES.find(t => t.id === techId) || TECHNOLOGIES[0];
  const customBank = EXAM_QUESTION_BANKS[techId];
  const domain = ADVANCED_DOMAINS.general;
  const seed = options?.attemptSeed !== undefined ? options.attemptSeed : Math.floor(Math.random() * 10000000);

  const questions: ExamQuestion[] = [];

  // ==========================================
  // 1. GERAÇÃO DE 60 QUESTÕES TEÓRICAS RIGOROSAS
  // ==========================================
  const theoryPool: RawTheoryQuestion[] = [];

  // Adiciona questões especializadas se existirem no banco da tecnologia
  if (customBank && customBank.theories && customBank.theories.length > 0) {
    theoryPool.push(...customBank.theories);
  }

  // Gera questões procedurais profundas baseadas nos tópicos do currículo
  EXAM_TOPIC_CURRICULUM.forEach((topicName, topicIdx) => {
    // Para cada um dos 20 tópicos estruturados, geramos variações técnicas avançadas
    const specCategories = domain.theoryCategories;
    const cat = specCategories[topicIdx % specCategories.length];
    const sub = cat.subtopics[0];
    const scenario = sub.scenarios[0];

    const stemText = scenario.stem(tech.name);
    const correctText = scenario.correct(tech.name);
    const distractorTexts = scenario.distractors(tech.name);

    theoryPool.push({
      q: `[${tech.name} • ${topicName}] ${stemText}`,
      opts: [correctText, ...distractorTexts],
      correct: 0,
      exp: scenario.explanation(tech.name),
      topic: topicName,
    });

    // Variação contextual secundária
    theoryPool.push({
      q: `[${tech.name} • ${topicName} • Cenário de Produção] Em uma arquitetura de missão crítica com ${tech.name}, ao diagnosticar uma falha sistêmica relacionada a "${topicName}", qual decisão de engenharia segue as melhores práticas da indústria?`,
      opts: [
        `Isolar a falha com telemetria estruturada, aplicar validação rigorosa de tipos/invariantes e adotar degradação graciosa (graceful degradation) com circuit breaker.`,
        `Desativar todas as verificações de integridade de dados para acelerar o processamento das requisições.`,
        `Executar reinicializações contínuas do servidor a cada exceção sem registrar logs de erro estruturados.`,
        `Permitir escrita irrestrita em variáveis globais compartilhadas sem sincronização de concorrência.`
      ],
      correct: 0,
      exp: `A resposta correta estabelece isolamento, observabilidade e contenção de falhas como premissas fundamentais de confiabilidade de software em ${tech.name}.`,
      topic: topicName,
    });

    // Variação de análise de código e complexidade
    theoryPool.push({
      q: `[${tech.name} • ${topicName} • Performance & Big-O] Considerando a escalabilidade vertical e horizontal em ${tech.name} para o domínio de "${topicName}", qual diretriz garante a menor sobrecarga de processador e memória?`,
      opts: [
        `Garantir complexidade algorítmica ótima O(1) ou O(log n) nas operações de maior volumetria e liberar recursos alocados imediatamente após o uso.`,
        `Substituir algoritmos logarítmicos por loops aninhados O(n³) para garantir que todos os dados sejam verificados repetidamente.`,
        `Armazenar todas as respostas intermediárias em variáveis globais infinitas sem expiração de cache.`,
        `Forçar execução síncrona bloqueante em todas as chamadas de banco de dados e APIs externas.`
      ],
      correct: 0,
      exp: `O controle de complexidade assintótica e a desalocação tempestiva de recursos são imperativos para sistemas escaláveis em ${tech.name}.`,
      topic: topicName,
    });
  });

  // Embaralha o pool teórico com a semente da tentativa
  const shuffledTheoryPool = shuffleArray(theoryPool, seed);

  // Seleciona exatamente 60 questões teóricas
  for (let i = 0; i < 60; i++) {
    const rawQ = shuffledTheoryPool[i % shuffledTheoryPool.length];
    const questionNumber = i + 1;

    // Embaralha as 4 opções e atualiza o correctIndex para que a posição A, B, C, D seja imprevisível
    const { shuffledOpts, newCorrectIndex } = shuffleQuestionOptions(
      rawQ.opts,
      rawQ.correct,
      seed + i * 37
    );

    questions.push({
      id: `exam-${techId}-theory-${questionNumber}-${seed}`,
      number: questionNumber,
      type: 'theory',
      question: `Questão ${questionNumber}/60: ${rawQ.q}`,
      topic: rawQ.topic || EXAM_TOPIC_CURRICULUM[i % EXAM_TOPIC_CURRICULUM.length],
      options: shuffledOpts,
      correctIndex: newCorrectIndex,
      explanation: rawQ.exp,
    });
  }

  // ==========================================
  // 2. GERAÇÃO DE 20 QUESTÕES PRÁTICAS RIGOROSAS
  // ==========================================
  const practicalPool: RawPracticalQuestion[] = [];

  // Adiciona práticas especializadas da tecnologia
  if (customBank && customBank.practicals && customBank.practicals.length > 0) {
    practicalPool.push(...customBank.practicals);
  }

  // Adiciona os desafios práticos do currículo geral
  EXAM_TOPIC_CURRICULUM.forEach((topicName, idx) => {
    const templateGen = domain.practicalTemplates[idx % domain.practicalTemplates.length];
    const generated = templateGen.generate(tech.name, techId, idx + 1);
    practicalPool.push(generated);
  });

  // Embaralha o pool prático
  const shuffledPracticalPool = shuffleArray(practicalPool, seed + 9999);

  // Seleciona exatamente 20 questões práticas (questões 61 a 80)
  for (let j = 0; j < 20; j++) {
    const questionNumber = 61 + j;
    const rawP = shuffledPracticalPool[j % shuffledPracticalPool.length];

    questions.push({
      id: `exam-${techId}-practical-${questionNumber}-${seed}`,
      number: questionNumber,
      type: 'practical',
      question: `Desafio Prático ${j + 1}/20 (${questionNumber}/80): ${rawP.prompt}`,
      topic: rawP.topic || `Prática • ${EXAM_TOPIC_CURRICULUM[j % EXAM_TOPIC_CURRICULUM.length]}`,
      initialCode: rawP.initialCode,
      expectedKeywords: rawP.expectedKeywords,
      correctSnippet: rawP.correctSnippet,
      hint: rawP.hint,
      explanation: rawP.explanation,
    });
  }

  return {
    id: `exam-${techId}-${seed}`,
    techId,
    title: `Exame Oficial de Passagem de Curso — ${tech.name}`,
    description: `Exame final obrigatório de alta exigência para comprovação de maestria e desbloqueio da tecnologia seguinte. Duração: 120 minutos. Contém 60 questões teóricas profundas e 20 desafios práticos de código. Critério de aprovação: Nota 20 de 20 Valores (100% de acertos).`,
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
  const now = new Date();
  const resultsReleaseAt = new Date(now.getTime() + 30 * 60 * 1000).toISOString(); // 30 minutos de embargo oficial

  if (timedOut) {
    const attempt: ExamAttempt = {
      id: 'attempt-' + Date.now(),
      techId: exam.techId,
      startedAt: new Date(Date.now() - timeSpentSeconds * 1000).toISOString(),
      submittedAt: now.toISOString(),
      resultsReleaseAt,
      timeSpentSeconds,
      timeRemainingSeconds: 0,
      timedOut: true,
      answers: userAnswers,
      questions: exam.questions,
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
        let isCorrect = true;
        
        // Verifica se todas as palavras-chave necessárias estão presentes
        if (q.expectedKeywords && q.expectedKeywords.length > 0) {
          for (const kw of q.expectedKeywords) {
            if (!codeText.includes(kw.toLowerCase())) {
              isCorrect = false;
              break;
            }
          }
        }
        
        // Código precisa ter tamanho e substância técnica mínima (não apenas espaços ou comentários)
        if (ans.trim().length < 20) {
          isCorrect = false;
        }

        if (isCorrect) {
          practicalCorrect++;
        }
      }
    }
  }

  const totalCorrect = theoryCorrect + practicalCorrect;
  const rawScore = (totalCorrect / 80) * 20;
  const scoreOutOf20 = totalCorrect === 80 ? 20 : Number(rawScore.toFixed(2));
  const passed = !timedOut && totalCorrect === 80 && scoreOutOf20 === 20;

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
    questions: exam.questions,
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
