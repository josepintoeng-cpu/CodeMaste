import { Lesson, Quiz, QuizQuestion, TechId, LevelId } from '../types';
import { TECHNOLOGIES } from './technologies';
import { TECH_CURRICULUM } from './techCurriculum';
import { pythonInicianteLessons, pythonInicianteQuiz } from './python/iniciante';

/**
 * Retorna as aulas para uma dada tecnologia e nível.
 */
export function getLessonsForTechAndLevel(techId: TechId, levelId: LevelId): Lesson[] {
  // Se houver currículo rico estruturado no TECH_CURRICULUM
  const curriculum = TECH_CURRICULUM[techId];
  if (curriculum && curriculum.topicsByLevel && curriculum.topicsByLevel[levelId]) {
    const topics = curriculum.topicsByLevel[levelId];
    if (topics.length > 0) {
      return topics.map((t, idx) => ({
        id: `${techId}-${levelId}-${idx + 1}`,
        techId,
        levelId,
        order: idx + 1,
        title: t.title,
        description: t.desc,
        estimatedMinutes: 10 + idx * 2,
        xpReward: 25 + idx * 5,
        theory: t.theory,
        codeExample: {
          language: t.lang,
          code: t.code,
          explanation: `Exemplo prático de código para ${t.title}`,
        },
        simulation: {
          type: getSimulationType(techId),
          defaultOutput: t.output,
          description: `Simulador e executor de ambiente para ${techId}`,
        },
        exercise: t.exercise,
      }));
    }
  }

  if (techId === 'python' && levelId === 'iniciante') {
    return pythonInicianteLessons;
  }

  // Gerador dinâmico de aulas fallback de alta qualidade para preenchimento progressivo
  return generateFallbackLessons(techId, levelId);
}

/**
 * Retorna o Quiz final para o nível/tecnologia
 */
export function getQuizForTechAndLevel(techId: TechId, levelId: LevelId): Quiz {
  const tech = TECHNOLOGIES.find(t => t.id === techId);
  const techName = tech ? tech.name : techId;

  // Se houver perguntas no TECH_CURRICULUM
  const curriculum = TECH_CURRICULUM[techId];
  if (curriculum && curriculum.quizzesByLevel && curriculum.quizzesByLevel[levelId]) {
    const customQuestions = curriculum.quizzesByLevel[levelId];
    if (customQuestions && customQuestions.length > 0) {
      return {
        id: `quiz-${techId}-${levelId}`,
        techId,
        levelId,
        title: `Quiz Avaliativo: ${techName} (${levelId.toUpperCase()})`,
        xpReward: 50,
        questions: customQuestions,
      };
    }
  }

  if (techId === 'python' && levelId === 'iniciante') {
    return pythonInicianteQuiz;
  }

  const dynamicQuizQuestions: Record<LevelId, QuizQuestion[]> = {
    iniciante: [
      {
        id: `dq-${techId}-ini-1`,
        question: `Em ${techName}, qual é o primeiro passo essencial para garantir estabilidade e previsibilidade de execução?`,
        options: [
          `Declarar e tipar variáveis/estruturas de dados de acordo com os padrões e sintaxe de ${techName}`,
          'Executar o código sem declarar dependências',
          'Deletar os arquivos de configuração do projeto',
          'Ignorar o tratamento de parâmetros',
        ],
        correctIndex: 0,
        explanation: `Respeitar as convenções de inicialização e sintaxe de ${techName} evita erros de runtime em produção.`,
      },
      {
        id: `dq-${techId}-ini-2`,
        question: `Qual a melhor abordagem para modularizar a lógica no nível inicial de ${techName}?`,
        options: [
          'Dividir o código em funções ou componentes com responsabilidade única',
          'Colocar todo o sistema em uma única linha',
          'Não utilizar variáveis',
          'Duplicar blocos de código em vários arquivos',
        ],
        correctIndex: 0,
        explanation: 'Funções de responsabilidade única facilitam manutenção, testes e reaproveitamento.',
      },
    ],
    intermediario: [
      {
        id: `dq-${techId}-int-1`,
        question: `No desenvolvimento intermediário em ${techName}, como deve ser estruturado o tratamento de erros e exceções?`,
        options: [
          'Capturar exceções específicas, registrar logs informativos e fornecer recuperação graciosa',
          'Ocultar todos os erros com blocos vazios',
          'Encerrar o sistema abruptamente sem aviso',
          'Desativar o coletor de erros',
        ],
        correctIndex: 0,
        explanation: 'O tratamento refinado de erros isola falhas locais e preserva a integridade do restante da aplicação.',
      },
    ],
    avancado: [
      {
        id: `dq-${techId}-av-1`,
        question: `Para atingir alta performance e escalabilidade em ${techName}, qual prática arquitetural é recomendada?`,
        options: [
          'Utilizar processamento assíncrono/não-bloqueante, cache inteligente e profiling de recursos',
          'Aumentar o número de loops aninhados',
          'Armazenar todo o estado em variáveis globais mutáveis',
          'Desabilitar índices e compressão',
        ],
        correctIndex: 0,
        explanation: 'Arquiteturas assíncronas aliadas a profiling e caching garantem throughput elevado e baixa latência.',
      },
    ],
    projetos: [
      {
        id: `dq-${techId}-prj-1`,
        question: `Ao finalizar a arquitetura de um projeto completo em ${techName}, qual a etapa final antes do deploy?`,
        options: [
          'Executar a suíte de testes automatizados, build de produção otimizado e validação de segurança',
          'Enviar o código fonte sem compilar',
          'Remover as variáveis de ambiente',
          'Desativar os logs de auditoria',
        ],
        correctIndex: 0,
        explanation: 'O pipeline de testes e build de produção assegura que apenas código validado entre em produção.',
      },
    ],
  };

  return {
    id: `quiz-${techId}-${levelId}`,
    techId,
    levelId,
    title: `Quiz Avaliativo: ${techName} (${levelId.toUpperCase()})`,
    xpReward: 50,
    questions: dynamicQuizQuestions[levelId] || dynamicQuizQuestions.iniciante,
  };
}

/**
 * Gera 5 aulas completas e interativas para os módulos ainda sem arquivo específico
 */
function generateFallbackLessons(techId: TechId, levelId: LevelId): Lesson[] {
  const tech = TECHNOLOGIES.find(t => t.id === techId) || TECHNOLOGIES[0];
  const levelTitle = levelId.charAt(0).toUpperCase() + levelId.slice(1);

  const topicsByLevel: Record<LevelId, { title: string; desc: string; code: string; output: string; lang: string }[]> = {
    iniciante: [
      {
        title: `1. Introdução e Sintaxe de ${tech.name}`,
        desc: `Conheça os primeiros passos e comandos fundamentais em ${tech.name}.`,
        code: getSampleCode(techId, 1),
        output: `[Sucesso] Executando primeiro script em ${tech.name}... Hello World!`,
        lang: getLanguageKey(techId),
      },
      {
        title: `2. Variáveis e Operadores em ${tech.name}`,
        desc: `Aprenda a armazenar valores e realizar manipulação de dados em ${tech.name}.`,
        code: getSampleCode(techId, 2),
        output: `Valor calculado: 100\nStatus: Ativo`,
        lang: getLanguageKey(techId),
      },
      {
        title: `3. Estruturas de Controle e Decisão em ${tech.name}`,
        desc: `Tome decisões lógicas condicionais no seu programa.`,
        code: getSampleCode(techId, 3),
        output: `Condição Verdadeira! Acesso concedido.`,
        lang: getLanguageKey(techId),
      },
      {
        title: `4. Laços de Repetição e Automação em ${tech.name}`,
        desc: `Repita tarefas e processe coleções de informações.`,
        code: getSampleCode(techId, 4),
        output: `Item 1 processado\nItem 2 processado\nItem 3 processado`,
        lang: getLanguageKey(techId),
      },
      {
        title: `5. Funções e Modularização em ${tech.name}`,
        desc: `Crie blocos de código reutilizáveis para organizar seu projeto.`,
        code: getSampleCode(techId, 5),
        output: `Função executada com retorno: 250`,
        lang: getLanguageKey(techId),
      },
    ],
    intermediario: [
      {
        title: `1. Estrutura e Orientação a Objetos em ${tech.name}`,
        desc: `Abstraia entidades do mundo real com classes e estruturas de dados.`,
        code: getSampleCode(techId, 1),
        output: `Instância criada com sucesso. Método executado.`,
        lang: getLanguageKey(techId),
      },
      {
        title: `2. Tratamento de Exceções e Erros em ${tech.name}`,
        desc: `Escreva códigos resilientes preparados para falhas.`,
        code: getSampleCode(techId, 2),
        output: `[Capturado] Tratamento de erro executado com sucesso.`,
        lang: getLanguageKey(techId),
      },
      {
        title: `3. Manipulação de Arquivos e Formatos JSON`,
        desc: `Leia e grave informações no formato padrão de troca de dados.`,
        code: getSampleCode(techId, 3),
        output: `Arquivo lido: {"status": 200, "data": "OK"}`,
        lang: getLanguageKey(techId),
      },
      {
        title: `4. Programação Assíncrona e Eventos`,
        desc: `Gerencie execuções paralelas sem travar sua aplicação.`,
        code: getSampleCode(techId, 4),
        output: `Aguardando resposta...\nDados recebidos!`,
        lang: getLanguageKey(techId),
      },
      {
        title: `5. Bibliotecas e Módulos Essenciais`,
        desc: `Aproveite recursos prontos do ecossistema para acelerar o desenvolvimento.`,
        code: getSampleCode(techId, 5),
        output: `Módulo importado e executado sem erros.`,
        lang: getLanguageKey(techId),
      },
    ],
    avancado: [
      {
        title: `1. Design Patterns e Arquitetura Limpa em ${tech.name}`,
        desc: `Aplique padrões de projeto reconhecidos para código escalável.`,
        code: getSampleCode(techId, 1),
        output: `Padrão de projeto inicializado com sucesso.`,
        lang: getLanguageKey(techId),
      },
      {
        title: `2. Otimização de Performance e Memória`,
        desc: `Reduza consumo de recursos e aumente a velocidade do seu app.`,
        code: getSampleCode(techId, 2),
        output: `Tempo de execução otimizado em 45%.`,
        lang: getLanguageKey(techId),
      },
      {
        title: `3. Integração com APIs e Banco de Dados`,
        desc: `Conecte sua aplicação a serviços de backend e bancos relacionais.`,
        code: getSampleCode(techId, 3),
        output: `Conexão estabelecida com banco de dados remoto.`,
        lang: getLanguageKey(techId),
      },
      {
        title: `4. Testes Automatizados e Cobertura de Código`,
        desc: `Garanta a qualidade do software com testes unitários e de integração.`,
        code: getSampleCode(techId, 4),
        output: `PASS: 12/12 testes executados com sucesso (100% coverage).`,
        lang: getLanguageKey(techId),
      },
      {
        title: `5. Segurança e Boas Práticas Avançadas`,
        desc: `Proteja sua aplicação contra vulnerabilidades comuns.`,
        code: getSampleCode(techId, 5),
        output: `Validação de segurança e sanitização concluídas.`,
        lang: getLanguageKey(techId),
      },
    ],
    projetos: [
      {
        title: `1. Projeto Prático: Gerenciador de Tarefas em ${tech.name}`,
        desc: `Crie um aplicativo completo com funcionalidades CRUD.`,
        code: getSampleCode(techId, 1),
        output: `App Tarefas iniciado!\n[1] Estudar Python\n[2] Fazer exercícios`,
        lang: getLanguageKey(techId),
      },
      {
        title: `2. Projeto Prático: API REST / Módulo de Comunicação`,
        desc: `Desenvolva a estrutura de serviço para troca de dados em tempo real.`,
        code: getSampleCode(techId, 2),
        output: `Servidor ouvindo na porta 3000... GET /api/v1/data 200 OK`,
        lang: getLanguageKey(techId),
      },
      {
        title: `3. Projeto Prático: Dashboard e Relatórios em ${tech.name}`,
        desc: `Processe métricas e exiba painéis visuais interativos.`,
        code: getSampleCode(techId, 3),
        output: `Relatório consolidado: 1.250 vendas no período.`,
        lang: getLanguageKey(techId),
      },
      {
        title: `4. Projeto Final: Sistema Completo e Deploy`,
        desc: `Integre todas as partes do sistema e prepare para empacotamento.`,
        code: getSampleCode(techId, 4),
        output: `Build de produção concluído com sucesso sem erros.`,
        lang: getLanguageKey(techId),
      },
      {
        title: `5. Projeto Bônus: Automação Inteligente`,
        desc: `Automatize rotinas diárias e simplifique fluxos de trabalho.`,
        code: getSampleCode(techId, 5),
        output: `Automação executada em background. 50 arquivos processados.`,
        lang: getLanguageKey(techId),
      },
    ],
  };

  const topics = topicsByLevel[levelId];

  return topics.map((t, idx) => ({
    id: `${techId}-${levelId}-${idx + 1}`,
    techId,
    levelId,
    order: idx + 1,
    title: t.title,
    description: t.desc,
    estimatedMinutes: 10 + idx * 2,
    xpReward: 20 + idx * 5,
    theory: [
      {
        title: `Conceitos de ${tech.name} - ${levelTitle}`,
        text: `Nesta aula sobre ${tech.name}, vamos explorar tópicos essenciais do nível ${levelTitle}. Entender esses conceitos ajudará você a construir soluções eficientes em qualquer plataforma.`,
        keyPoints: [
          `Padrões da linguagem ${tech.name}`,
          `Organização e clareza de código`,
          `Aplicação em projetos do mundo real`,
        ],
        conceptCard: `💡 Dica de Ouro: Sempre teste pequenas partes do seu código antes de criar estruturas muito grandes.`,
      },
    ],
    codeExample: {
      language: t.lang,
      code: t.code,
      explanation: `Exemplo estruturado de ${tech.name} demonstrando o comportamento do código.`,
    },
    simulation: {
      type: getSimulationType(techId),
      defaultOutput: t.output,
      description: `Ambiente de simulação para ${tech.name}.`,
    },
    exercise: generateDynamicExercise(techId, tech.name, levelId, idx, t.title, t.code),
  }));
}

function generateDynamicExercise(
  techId: TechId,
  techName: string,
  levelId: LevelId,
  idx: number,
  topicTitle: string,
  sampleCode: string
) {
  const exercisesByIndex = [
    {
      prompt: `Na aula "${topicTitle}", qual instrução executa a inicialização ou declaração de acordo com as boas práticas de ${techName}?`,
      options: [
        `Declarar variáveis/módulos seguindo as convenções oficiais de nomenclatura e escopo de ${techName}`,
        `Ignorar as tipagens e usar escopo global para tudo`,
        `Omitir parâmetros obrigatórios na assinatura`,
        `Executar código sem inicialização prévia`,
      ],
      correctAnswer: `Declarar variáveis/módulos seguindo as convenções oficiais de nomenclatura e escopo de ${techName}`,
      hint: `Pense na convenção de escopo e clareza de ${techName}.`,
      explanation: `Em ${techName}, a correta inicialização com escopo delimitado evita vazamento de memória e inconsistências de estado.`,
    },
    {
      prompt: `Em relação à manipulação de dados e operadores em ${techName}, qual a garantia necessária ao processar dados de entrada?`,
      options: [
        `Validar e sanitizar tipos para evitar exceções de runtime e inconsistências`,
        `Presumir que todas as entradas estão sempre formatadas corretamente`,
        `Desativar checagens condicionais`,
        `Converter todos os dados para texto sem tratamento`,
      ],
      correctAnswer: `Validar e sanitizar tipos para evitar exceções de runtime e inconsistências`,
      hint: `Validação de tipos e dados antes do processamento.`,
      explanation: `A sanitização e checagem defensiva de tipos assegura resiliência no pipeline de execução.`,
    },
    {
      prompt: `Para estruturar o controle de fluxo e condições nesta etapa de ${techName}, qual é a abordagem recomendada?`,
      options: [
        `Utilizar condicionais explícitas com cláusulas de escape prévio (Guard Clauses)`,
        `Aninhar dezenas de blocos if/else sem limite de profundidade`,
        `Suprimir todos os retornos de erro`,
        `Executar fluxos alternativos sem checagem de precondições`,
      ],
      correctAnswer: `Utilizar condicionais explícitas com cláusulas de escape prévio (Guard Clauses)`,
      hint: `Guard Clauses simplificam o fluxo linear do código.`,
      explanation: `Guard Clauses reduzem a complexidade ciclomática e tornam o código mais legível e fácil de testar.`,
    },
    {
      prompt: `Ao lidar com iterações, loops ou processamento assíncrono em ${techName}, qual o cuidado fundamental com a performance?`,
      options: [
        `Garantir condições de parada seguras e evitar operações bloqueantes de I/O dentro de laços críticos`,
        `Criar loops infinitos sem critério de término`,
        `Multiplicar alocações de memória a cada iteração`,
        `Ignorar o encerramento de conexões abertas`,
      ],
      correctAnswer: `Garantir condições de parada seguras e evitar operações bloqueantes de I/O dentro de laços críticos`,
      hint: `Evitar I/O síncrono e laços sem condição clara de saída.`,
      explanation: `Condições de parada claras e isolamento de I/O em loops evitam consumo excessivo de CPU e travamento de threads.`,
    },
    {
      prompt: `Para finalizar o módulo "${topicTitle}", como você valida a integridade da entrega em ${techName}?`,
      options: [
        `Executar a suíte de testes e validar a compilação/saída sem erros ou warnings`,
        `Publicar o código sem checar a saída do terminal`,
        `Desativar as mensagens de erro do compilador`,
        `Remover os testes unitários antes do deploy`,
      ],
      correctAnswer: `Executar a suíte de testes e validar a compilação/saída sem erros ou warnings`,
      hint: `Validação através de testes e saída de compilação limpa.`,
      explanation: `A compilação com zero warnings e testes cobrindo os casos limite atesta a prontidão para produção.`,
    },
  ];

  const selected = exercisesByIndex[idx % exercisesByIndex.length];
  return {
    id: `ex-${techId}-${levelId}-${idx + 1}`,
    prompt: selected.prompt,
    type: 'multiple_choice' as const,
    options: selected.options,
    correctAnswer: selected.correctAnswer,
    hint: selected.hint,
    explanation: selected.explanation,
  };
}

function getLanguageKey(techId: TechId): string {
  const map: Partial<Record<TechId, string>> = {
    python: 'python',
    javascript: 'javascript',
    html: 'html',
    css: 'css',
    nodejs: 'javascript',
    java: 'java',
    flutter: 'dart',
    php: 'php',
    mysql: 'sql',
    react: 'javascript',
    english_tech: 'text',
    typescript: 'typescript',
    git: 'bash',
    linux_cyber: 'bash',
    nextjs: 'typescript',
    apis: 'typescript',
    postgresql: 'sql',
    python_fastapi: 'python',
    ai_apps: 'typescript',
    c_sys_cyber: 'c',
    cloud_devops: 'yaml',
  };
  return map[techId] || 'javascript';
}

function getSimulationType(techId: TechId): 'real_js' | 'real_html' | 'real_pyodide' | 'simulated' | 'sql_mock' {
  if (techId === 'python') return 'real_pyodide';
  if (techId === 'javascript') return 'real_js';
  if (techId === 'html' || techId === 'css') return 'real_html';
  if (techId === 'mysql') return 'sql_mock';
  return 'simulated';
}

function getSampleCode(techId: TechId, step: number): string {
  switch (techId) {
    case 'python':
      return `# Exemplo Python - Passo ${step}\nnome = "Dev Python"\nprint(f"Olá, {nome}! Passo {step} concluído com sucesso.")`;
    case 'javascript':
    case 'nodejs':
      return `// Exemplo JavaScript / Node.js - Passo ${step}\nconst usuario = "Dev JS";\nconsole.log(\`Bem-vindo \${usuario}! Passo \${step}.\`);`;
    case 'html':
      return `<!-- Exemplo HTML5 -->\n<div class="card">\n  <h2>Título do Card ${step}</h2>\n  <p>Conteúdo estruturado em HTML semântico.</p>\n</div>`;
    case 'css':
      return `/* Exemplo CSS3 */\n.container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  background: #1e293b;\n  color: #f8fafc;\n}`;
    case 'java':
      return `// Exemplo Java OO\npublic class App {\n    public static void main(String[] args) {\n        System.out.println("Executando módulo Java - Passo ${step}");\n    }\n}`;
    case 'flutter':
      return `// Exemplo Flutter / Dart\nimport 'package:flutter/material.dart';\n\nWidget build(BuildContext context) {\n  return Text('Olá Flutter Passo ${step}');\n}`;
    case 'php':
      return `<?php\n// Exemplo PHP\n$usuario = "Dev PHP";\necho "Bem-vindo, " . $usuario . "! Módulo ${step}";\n?>`;
    case 'mysql':
      return `-- Exemplo SQL MySQL\nSELECT * FROM usuarios\nWHERE ativo = 1\nORDER BY id DESC;`;
    default:
      return `// Código de exemplo`;
  }
}
