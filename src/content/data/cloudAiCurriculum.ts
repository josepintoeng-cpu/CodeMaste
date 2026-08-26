import { TechCurriculumData } from '../techCurriculum';

export const CLOUD_AI_CURRICULUM: Record<string, TechCurriculumData> = {
  // =========================================================================
  // TYPESCRIPT
  // =========================================================================
  typescript: {
    topicsByLevel: {
      iniciante: [
        {
          title: '1. Tipos Primitivos, Type Inference e Interfaces vs Types',
          desc: 'Entenda como o TypeScript adiciona tipagem estática e segurança em tempo de compilação.',
          theory: [
            {
              title: 'TypeScript: JavaScript com Superpoderes',
              text: 'O TypeScript verifica tipos estaticamente durante o desenvolvimento, eliminando erros comuns em tempo de execução como "Cannot read properties of undefined".',
              keyPoints: [
                'Primitivos: string, number, boolean, null, undefined, bigint, symbol.',
                'Type Inference: O compilador infere o tipo automaticamente com base na atribuição inicial.',
                'Interface vs Type: Interfaces são extensíveis por herança (extends); Types suportam Unions (|) e Tuplas.',
              ],
            },
          ],
          code: `// Interfaces e Types fundamentais
interface Usuario {
  id: string;
  nome: string;
  email: string;
  ativo: boolean;
  idade?: number; // Propriedade opcional
}

type StatusTransacao = 'pendente' | 'aprovado' | 'recusado';

const usuario: Usuario = {
  id: 'usr_1',
  nome: 'Dev Sênior',
  email: 'senior@empresa.com',
  ativo: true,
};`,
          output: '[TypeScript]: 0 erros de compilação. Código tipado com segurança estática.',
          lang: 'typescript',
          exercise: {
            id: 'ex-ts-ini-1',
            prompt: 'Como declarar uma propriedade como opcional em uma interface TypeScript?',
            type: 'multiple_choice',
            options: ['Adicionando o caractere `?` após o nome da propriedade (ex: `idade?: number`)', 'Usando `optional idade: number`', 'Declarando como `idade = null`', 'Colocando entre aspas'],
            correctAnswer: 'Adicionando o caractere `?` após o nome da propriedade (ex: `idade?: number`)',
            hint: 'Símbolo de interrogação indica que o valor pode ser do tipo especificado ou undefined.',
            explanation: 'A interrogação `?` marca a propriedade como opcional (tipo `T | undefined`).',
          },
        },
        {
          title: '2. Generics, Funções Genéricas e Restrições de Tipo (extends)',
          desc: 'Crie componentes e funções reutilizáveis e fortemente tipados com parâmetros de tipo <T>.',
          theory: [
            {
              title: 'O poder dos Generics',
              text: 'Generics permitem criar funções e classes que trabalham sobre uma variedade de tipos em vez de um único, preservando a tipagem de retorno.',
              keyPoints: [
                'function primeiroElemento<T>(lista: T[]): T | undefined',
                'Restrição de tipo: <T extends { id: string }>',
              ],
            },
          ],
          code: `// Função genérica com restrição de tipo
interface TemId {
  id: string | number;
}

export function encontrarPorId<T extends TemId>(itens: T[], idBusca: string | number): T | undefined {
  return itens.find(item => item.id === idBusca);
}`,
          output: '[TypeScript Generics]: Função genérica compilada preservando o tipo exato do retorno.',
          lang: 'typescript',
          exercise: {
            id: 'ex-ts-ini-2',
            prompt: 'Para que serve a sintaxe `<T>` em funções TypeScript?',
            type: 'multiple_choice',
            options: [
              'Definir um Tipo Genérico (Generic) que permite que a função receba e retorne tipos dinâmicos mantendo a tipagem estrita',
              'Criar uma tag HTML',
              'Definir uma variável temporária',
              'Executar a função 10 vezes',
            ],
            correctAnswer: 'Definir um Tipo Genérico (Generic) que permite que a função receba e retorne tipos dinâmicos mantendo a tipagem estrita',
            hint: 'Permite reutilização com preservação de tipo.',
            explanation: 'Generics atuam como "variáveis para tipos", permitindo criar código reutilizável e com verificação completa de tipos.',
          },
        },
      ],
      intermediario: [
        {
          title: '1. Utility Types Avançados: Partial, Required, Pick, Omit e Record',
          desc: 'Transforme e derive tipos complexos sem duplicar código.',
          theory: [
            {
              title: 'Utility Types Nativos',
              text: 'O TypeScript fornece utilitários globais para manipulação de tipos existentes.',
              keyPoints: [
                'Partial<T>: Torna todas as propriedades opcionais.',
                'Pick<T, "nome" | "email">: Seleciona um subconjunto de propriedades.',
                'Omit<T, "senha">: Remove propriedades confidenciais.',
                'Record<string, Usuario>: Dicionário chave-valor tipado.',
              ],
            },
          ],
          code: `interface Produto {
  id: string;
  nome: string;
  preco: number;
  descricao: string;
  estoque: number;
}

// Cria DTO para atualização parcial de produto
type AtualizarProdutoDTO = Partial<Omit<Produto, 'id'>>;

const atualizacao: AtualizarProdutoDTO = {
  preco: 99.90, // Apenas preco fornecido, 100% tipado
};`,
          output: '[TypeScript Utility Types]: Tipos derivados com sucesso sem duplicação de interfaces.',
          lang: 'typescript',
          exercise: {
            id: 'ex-ts-inter-1',
            prompt: 'Qual Utility Type nativo do TypeScript cria um novo tipo a partir de `T`, excluindo as chaves especificadas?',
            type: 'multiple_choice',
            options: ['Omit<T, Keys>', 'Pick<T, Keys>', 'Exclude<T, U>', 'Remove<T, Keys>'],
            correctAnswer: 'Omit<T, Keys>',
            hint: 'Omite (descarta) as propriedades especificadas.',
            explanation: '`Omit<T, K>` constrói um tipo pegando todas as propriedades de `T` e removendo as chaves especificadas em `K`.',
          },
        },
        {
          title: '2. Discriminated Unions e Type Narrowing com Type Guards',
          desc: 'Elimine erros em tempo de execução com uniões discriminadas e predicados de tipo customizados (is).',
          theory: [
            {
              title: 'Discriminated Unions',
              text: 'Uma Discriminated Union usa uma propriedade literal comum (ex: `kind: "sucesso" | "erro"`) para permitir que o compilador faça narrow automático em blocos if ou switch.',
              keyPoints: [
                'type Resposta = { status: "sucesso"; data: string } | { status: "erro"; erro: string };',
                'Type Guard: function isString(val: unknown): val is string { return typeof val === "string"; }',
              ],
            },
          ],
          code: `type ResultadoApi = 
  | { status: 'sucesso'; dados: { token: string } }
  | { status: 'falha'; mensagemErro: string; codigo: number };

function processar(resposta: ResultadoApi) {
  if (resposta.status === 'sucesso') {
    console.log('Token recebido:', resposta.dados.token); // TypeScript sabe que dados existe aqui!
  } else {
    console.error('Erro:', resposta.mensagemErro); // TypeScript sabe que mensagemErro existe aqui!
  }
}`,
          output: '[Discriminated Unions]: Checagem exaustiva de tipos validada sem necessidade de cast perigoso.',
          lang: 'typescript',
          exercise: {
            id: 'ex-ts-inter-2',
            prompt: 'Qual é a vantagem do padrão "Discriminated Union" no TypeScript?',
            type: 'multiple_choice',
            options: [
              'Permite ao compilador inferir com 100% de certeza as propriedades disponíveis dentro de cada ramo condicional baseado em um campo identificador comum',
              'Acelera a internet',
              'Elimina a necessidade de variáveis',
              'Converte código para Assembly',
            ],
            correctAnswer: 'Permite ao compilador inferir com 100% de certeza as propriedades disponíveis dentro de cada ramo condicional baseado em um campo identificador comum',
            hint: 'Afina o tipo automaticamente dentro de ifs e switches.',
            explanation: 'Com uma propriedade discriminante (ex: `type` ou `status`), o TypeScript realiza Type Narrowing eliminando acessos a propriedades inexistentes.',
          },
        },
      ],
      avancado: [
        {
          title: '1. Tipagem Avançada: Conditional Types, Mapped Types e Template Literal Types',
          desc: 'Construa bibliotecas tipadas com tipos condicionais (infer), tipos mapeados e template literals.',
          theory: [
            {
              title: 'Mapeamento e Inferência Profunda',
              text: 'Conditional types funcionam como ternários em nível de tipo: `T extends U ? X : Y`. O operador `infer` extrai tipos internos de Promises e funções.',
              keyPoints: [
                'type UnpackPromise<T> = T extends Promise<infer U> ? U : T;',
                'Template Literals: type Evento = `on${"Click" | "Hover"}`;',
              ],
            },
          ],
          code: `// Extração avançada do tipo de retorno de Promises
type DesembrulharPromise<T> = T extends Promise<infer R> ? R : T;

type Exemplo = DesembrulharPromise<Promise<{ id: number; nome: string }>>;
// Exemplo é inferido exatamente como { id: number; nome: string }`,
          output: '[TypeScript Metaprogramming]: Conditional type avaliado com sucesso via operador infer.',
          lang: 'typescript',
          exercise: {
            id: 'ex-ts-avanc-1',
            prompt: 'Qual palavra-chave dentro de um Conditional Type no TypeScript é utilizada para inferir e extrair uma variável de tipo desconhecida dentro de uma estrutura?',
            type: 'multiple_choice',
            options: ['infer', 'extract', 'typeof', 'keyof'],
            correctAnswer: 'infer',
            hint: 'Usado em expressões como `T extends (...args: any[]) => infer R ? R : any`.',
            explanation: '`infer` permite capturar um tipo dinâmico dentro de uma checagem de tipo condicional.',
          },
        },
      ],
      projetos: [
        {
          title: '1. Projeto: Criação de Biblioteca NPM Fortemente Tipada com TSConfig Strict',
          desc: 'Configure tsconfig.json com "strict: true", "noUncheckedIndexedAccess" e gere arquivos .d.ts.',
          theory: [{ title: 'Strict Type System', text: 'Configuração com 0 concessões de segurança de tipo.', keyPoints: ['"declaration": true', '"strict": true', '"moduleResolution": "bundler"'] }],
          code: `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "declaration": true,
    "outDir": "./dist"
  }
}`,
          output: '[TS Build]: Arquivos .js e .d.ts gerados sem erros com modo estrito 100% ativo.',
          lang: 'json',
          exercise: {
            id: 'ex-ts-prj-1',
            prompt: 'Qual flag no `tsconfig.json` força o compilador TypeScript a tratar acessos a índices de arrays ou objetos como `T | undefined` em vez de apenas `T`?',
            type: 'multiple_choice',
            options: ['noUncheckedIndexedAccess: true', 'strict: false', 'allowJs: true', 'skipLibCheck: false'],
            correctAnswer: 'noUncheckedIndexedAccess: true',
            hint: 'Impede bugs ao acessar itens fora dos limites de um array (ex: array[100]).',
            explanation: '`noUncheckedIndexedAccess` adiciona `undefined` a acessos indexados, forçando o desenvolvedor a verificar se o elemento realmente existe antes de usá-lo.',
          },
        },
      ],
    },
    quizzesByLevel: {
      iniciante: [
        {
          id: 'tq-ini-1',
          question: 'Qual é o tipo no TypeScript que representa um valor que pode ser de qualquer tipo, mas exige que você faça uma checagem de tipo antes de utilizá-lo (sendo muito mais seguro que `any`)?',
          options: ['unknown', 'any', 'void', 'never'],
          correctIndex: 0,
          explanation: '`unknown` é o tipo seguro do TypeScript; ao contrário de `any`, ele não permite invocar métodos sem verificação de tipo prévia.',
        },
      ],
      intermediario: [
        {
          id: 'tq-int-1',
          question: 'O que o Utility Type `Record<K, T>` faz?',
          options: [
            'Constrói um tipo de objeto cujas chaves de propriedades são do tipo K e os valores são do tipo T',
            'Grava o áudio do usuário',
            'Apaga as propriedades',
            'Converte números em texto',
          ],
          correctIndex: 0,
          explanation: '`Record<K, T>` é o padrão para tipar mapas, dicionários e tabelas hash chave-valor.',
        },
      ],
      avancado: [
        {
          id: 'tq-av-1',
          question: 'Qual o tipo no TypeScript que representa um valor que NUNCA ocorre (como o retorno de uma função que sempre lança exceção ou entra em loop infinito)?',
          options: ['never', 'null', 'undefined', 'void'],
          correctIndex: 0,
          explanation: '`never` representa o tipo vazio / conjunto vazio, utilizado para exaustividade em switch cases e funções sem retorno.',
        },
      ],
      projetos: [
        {
          id: 'tq-prj-1',
          question: 'Por que a flag `"strict": true` é indispensável no `tsconfig.json` em projetos profissionais?',
          options: [
            'Ela ativa todas as checagens estritas de tipo, incluindo `strictNullChecks` e `noImplicitAny`, prevenindo 90% dos erros clássicos de runtime do JavaScript',
            'Ela acelera o download da internet',
            'Ela remove a necessidade de testes',
            'Ela desativa o TypeScript',
          ],
          correctIndex: 0,
          explanation: 'O modo `strict` ativa o conjunto completo de verificações de segurança do compilador TypeScript.',
        },
      ],
    },
  },

  // =========================================================================
  // IA + APIS DE IA + APLICAÇÕES INTELIGENTES
  // =========================================================================
  ai_apps: {
    topicsByLevel: {
      iniciante: [
        {
          title: '1. Fundamentos de LLMs, Tokens, Context Window e Integração com SDKs (Gemini / OpenAI)',
          desc: 'Entenda como modelos de linguagem geram texto probabilístico e faça sua primeira chamada de API de IA.',
          theory: [
            {
              title: 'A Revolução dos LLMs',
              text: 'Modelos de Linguagem Grande (LLMs) como Gemini e GPT são redes neurais treinadas para prever os próximos tokens mais prováveis. A Janela de Contexto (Context Window) define o limite de tokens que o modelo consegue processar simultaneamente.',
              keyPoints: [
                'Token: Unidade básica de texto (~4 caracteres ou 0.75 palavras).',
                'Temperatura (0.0 a 1.0): 0.0 para respostas determinísticas/código; 0.8+ para criatividade.',
                'System Instructions: Define a persona, tom e regras de segurança.',
              ],
            },
          ],
          code: `import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function gerarAnaliseCodigo(codigo: string) {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: \`Analise o código abaixo e identifique vulnerabilidades de segurança:\n\n\${codigo}\`,
    config: {
      temperature: 0.1, // Baixa temperatura para precisão técnica
      systemInstruction: 'Você é um auditor sênior de segurança de software (AppSec).',
    },
  });

  console.log(response.text);
}`,
          output: `[Gemini AI]: Análise concluída: 0 vulnerabilidades críticas detectadas no trecho examinado.`,
          lang: 'typescript',
          exercise: {
            id: 'ex-ai-ini-1',
            prompt: 'Ao solicitar a um LLM a geração de código ou análise de segurança matemática rigorosa, qual configuração de temperatura é recomendada?',
            type: 'multiple_choice',
            options: ['Temperatura baixa (próxima de 0.0 a 0.2)', 'Temperatura máxima (2.0)', 'Temperatura aleatória', 'Temperatura negativa'],
            correctAnswer: 'Temperatura baixa (próxima de 0.0 a 0.2)',
            hint: 'Temperaturas baixas minimizam a aleatoriedade e focam nos tokens de maior probabilidade.',
            explanation: 'Valores baixos de temperatura forçam o modelo a ser determinístico, consistente e factual, ideal para código e respostas estruturadas.',
          },
        },
        {
          title: '2. Engenharia de Prompts: Few-Shot Prompting, Chain-of-Thought (CoT) e Structured Outputs',
          desc: 'Escreva prompts de alta precisão com exemplos, raciocínio passo a passo e respostas JSON estruturadas.',
          theory: [
            {
              title: 'Técnicas de Engenharia de Prompts',
              text: 'Few-Shot fornece exemplos de entrada/saída no prompt. Chain-of-Thought instrui o modelo a "pensar passo a passo" antes de responder, aumentando drasticamente a acurácia em problemas lógicos.',
              keyPoints: [
                'Few-shot: Exemplo 1 -> Resposta 1, Exemplo 2 -> Resposta 2.',
                'Chain-of-Thought: "Vamos analisar o problema passo a passo antes de concluir: ..."',
                'response_mime_type: "application/json" com response_schema para garantir JSON válido.',
              ],
            },
          ],
          code: `// Resposta estruturada garantida com JSON Schema
const schemaResposta = {
  type: 'OBJECT',
  properties: {
    seguro: { type: 'BOOLEAN' },
    scoreRisco: { type: 'NUMBER' },
    recomendacao: { type: 'STRING' },
  },
  required: ['seguro', 'scoreRisco', 'recomendacao'],
};`,
          output: `{"seguro": true, "scoreRisco": 1.5, "recomendacao": "Código em conformidade com OWASP Top 10"}`,
          lang: 'json',
          exercise: {
            id: 'ex-ai-ini-2',
            prompt: 'Qual técnica de prompting orienta o modelo de IA a decompor um problema complexo e explicitar seu raciocínio intermediário antes de dar a resposta final?',
            type: 'multiple_choice',
            options: ['Chain-of-Thought (Cadeia de Pensamento)', 'Zero-Shot', 'Random Prompting', 'Brute Force'],
            correctAnswer: 'Chain-of-Thought (Cadeia de Pensamento)',
            hint: 'Pensamento encadeado passo a passo.',
            explanation: 'Chain-of-Thought (CoT) melhora o desempenho em tarefas complexas de raciocínio permitindo que o modelo gere passos intermediários de computação.',
          },
        },
      ],
      intermediario: [
        {
          title: '1. Embeddings, Bancos Vetoriais e RAG (Retrieval-Augmented Generation)',
          desc: 'Conecte modelos de IA aos seus documentos internos com busca semântica em bancos vetoriais (Pinecone / pgvector / Qdrant).',
          theory: [
            {
              title: 'Arquitetura RAG',
              text: 'Modelos têm limites de conhecimento e sofrem alucinações. O RAG divide documentos em chunks, gera vetores numéricos (embeddings), busca os trechos mais similares via similaridade de cosseno e os injeta no prompt como contexto.',
              keyPoints: [
                'Embeddings: Vetores de alta dimensão (ex: 768 ou 1536 dimensões) que capturam o significado semântico.',
                'Similaridade de Cosseno: Mede a proximidade semântica entre a pergunta do usuário e os trechos de documentos.',
                'pgvector no PostgreSQL: CREATE EXTENSION vector; para buscas vetoriais integradas.',
              ],
            },
          ],
          code: `import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function gerarEmbedding(texto: string) {
  const result = await ai.models.embedContent({
    model: 'text-embedding-004',
    contents: texto,
  });
  return result.embedding.values; // Array de floats representando o vetor
}`,
          output: '[Embedding]: Vetor de 768 dimensões gerado: [-0.023, 0.089, -0.012, 0.045, ...] pronto para busca vetorial.',
          lang: 'typescript',
          exercise: {
            id: 'ex-ai-inter-1',
            prompt: 'Qual é o papel do padrão RAG (Retrieval-Augmented Generation) em aplicações corporativas de IA?',
            type: 'multiple_choice',
            options: [
              'Recuperar trechos relevantes de documentos internos da empresa via busca vetorial e fornecê-los como contexto no prompt para o LLM responder sem alucinar',
              'Treinar um novo modelo do zero',
              'Substituir a internet',
              'Traduzir imagens para áudio',
            ],
            correctAnswer: 'Recuperar trechos relevantes de documentos internos da empresa via busca vetorial e fornecê-los como contexto no prompt para o LLM responder sem alucinar',
            hint: 'Busca semântica + Geração de resposta contextualizada.',
            explanation: 'RAG combina recuperação de informações em bancos vetoriais com a capacidade de síntese do LLM, garantindo respostas baseadas em fatos atualizados da empresa.',
          },
        },
        {
          title: '2. Function Calling e Tool Use: Conectando IAs a Bancos e APIs Externas',
          desc: 'Permita que o modelo de IA tome decisões, chame funções de código e consulte APIs em tempo real.',
          theory: [
            {
              title: 'Como o Function Calling Funciona',
              text: 'Você declara ferramentas com nome, descrição e parâmetros. O LLM avalia a pergunta do usuário, decide se precisa chamar uma ferramenta e retorna um objeto JSON com os argumentos exatos para seu código executar.',
              keyPoints: [
                'Declaração de tools: functions declaradas no config.',
                'O modelo NÃO executa a função diretamente por segurança; ele retorna o ToolCall para seu backend rodar e devolver o resultado.',
              ],
            },
          ],
          code: `// Declaração de Tool para o modelo consultar saldo
const consultarSaldoTool = {
  name: 'consultarSaldo',
  description: 'Retorna o saldo bancário atual da conta do cliente',
  parameters: {
    type: 'OBJECT',
    properties: {
      contaId: { type: 'STRING', description: 'Número da conta' },
    },
    required: ['contaId'],
  },
};`,
          output: '[Function Calling]: LLM solicitou chamada da tool consultarSaldo com argumentos {"contaId": "10023-X"}.',
          lang: 'typescript',
          exercise: {
            id: 'ex-ai-inter-2',
            prompt: 'Em uma arquitetura de Function Calling / Tool Use, quem executa fisicamente a função no banco ou API?',
            type: 'multiple_choice',
            options: [
              'O código do seu servidor backend (a IA apenas decide qual função chamar e gera os argumentos corretos)',
              'O próprio modelo de linguagem dentro da rede neural',
              'O navegador do usuário',
              'Ninguém',
            ],
            correctAnswer: 'O código do seu servidor backend (a IA apenas decide qual função chamar e gera os argumentos corretos)',
            hint: 'A IA atua como o cérebro que decide a chamada, mas seu backend mantém o controle seguro da execução.',
            explanation: 'O modelo retorna a intenção e os parâmetros em JSON; sua aplicação executa a lógica no backend e envia a resposta de volta ao modelo.',
          },
        },
      ],
      avancado: [
        {
          title: '1. Agentes Autônomos, LangGraph e Workflows Multi-Agente',
          desc: 'Orquestre equipes de agentes especializados com planejamento, reflexão e memória.',
          theory: [
            {
              title: 'Arquitetura Multi-Agente',
              text: 'Sistemas com múltiplos agentes dividem tarefas complexas entre especialistas: Agente Pesquisador, Agente Redator, Agente Crítico/Revisor.',
              keyPoints: ['State Graphs com ciclos de feedback', 'Memória de curto e longo prazo'],
            },
          ],
          code: `// Orquestração de agentes
interface EstadoAgente {
  objetivo: string;
  pesquisa: string;
  rascunho: string;
  aprovado: boolean;
}`,
          output: '[Multi-Agent Workflow]: Agente Pesquisador -> Agente Redator -> Agente Auditor [Aprovado].',
          lang: 'typescript',
          exercise: {
            id: 'ex-ai-avanc-1',
            prompt: 'Qual a principal vantagem de uma arquitetura Multi-Agente em relação a um único prompt gigante?',
            type: 'multiple_choice',
            options: [
              'Permite dividir problemas complexos em subtarefas com personas especializadas, validações intermediárias e ciclos de revisão mútua',
              'Usa menos memória RAM',
              'Não precisa de internet',
              'É mais fácil de desenhar',
            ],
            correctAnswer: 'Permite dividir problemas complexos em subtarefas com personas especializadas, validações intermediárias e ciclos de revisão mútua',
            hint: 'Divisão de responsabilidades e auto-correção.',
            explanation: 'Sistemas multi-agentes aumentam a taxa de sucesso ao isolar responsabilidades e adicionar etapas explícitas de validação e refinamento.',
          },
        },
      ],
      projetos: [
        {
          title: '1. Projeto: Assistente RAG Completo com Streaming de Respostas e Citações',
          desc: 'Desenvolva uma aplicação corporativa com chat em streaming, upload de PDFs e citações de fontes.',
          theory: [{ title: 'Chat em Streaming', text: 'Streaming token a token para UI instantânea.', keyPoints: ['Server-Sent Events (SSE)', 'Citação de páginas de documentos'] }],
          code: `// Streaming de resposta token a token
async function streamChat(mensagem: string, onChunk: (texto: string) => void) {
  const chat = ai.chats.create({ model: 'gemini-2.5-flash' });
  const result = await chat.sendMessageStream({ message: mensagem });
  for await (const chunk of result) {
    onChunk(chunk.text);
  }
}`,
          output: '[Streaming]: 450 tokens transmitidos em tempo real para a interface com latência inicial de 210ms.',
          lang: 'typescript',
          exercise: {
            id: 'ex-ai-prj-1',
            prompt: 'Por que o streaming de respostas (token por token) é a melhor prática de UX em chats com IA?',
            type: 'multiple_choice',
            options: [
              'Porque reduz o tempo de percepção de espera (Time to First Token) exibindo o texto imediatamente enquanto a resposta é gerada',
              'Porque consome menos tokens',
              'Porque traduz o texto automaticamente',
              'Porque desativa o CSS',
            ],
            correctAnswer: 'Porque reduz o tempo de percepção de espera (Time to First Token) exibindo o texto imediatamente enquanto a resposta é gerada',
            hint: 'UX responsiva e sensação de interação em tempo real.',
            explanation: 'O streaming entrega os primeiros tokens em frações de segundo, proporcionando uma experiência fluida para o usuário.',
          },
        },
      ],
    },
    quizzesByLevel: {
      iniciante: [
        {
          id: 'aiq-ini-1',
          question: 'O que é a "Janela de Contexto" (Context Window) de um modelo de linguagem?',
          options: [
            'O número máximo de tokens (entrada + histórico + saída) que o modelo consegue processar em uma única requisição',
            'O tamanho da tela do computador',
            'O tempo que o modelo demora para ligar',
            'O número de usuários logados',
          ],
          correctIndex: 0,
          explanation: 'A Context Window define a quantidade total de informação que o modelo consegue "lembrar" e analisar simultaneamente.',
        },
      ],
      intermediario: [
        {
          id: 'aiq-int-1',
          question: 'Em um sistema RAG, o que são "Embeddings"?',
          options: [
            'Representações vetoriais numéricas de textos em um espaço multidimensional onde conceitos com significados semelhantes ficam próximos geometricamente',
            'Imagens compactadas em JPEG',
            'Senhas criptografadas',
            'Arquivos de áudio',
          ],
          correctIndex: 0,
          explanation: 'Embeddings capturam a semântica de frases em coordenadas matemáticas para permitir busca por significado.',
        },
      ],
      avancado: [
        {
          id: 'aiq-av-1',
          question: 'Qual é o risco de segurança conhecido como "Prompt Injection"?',
          options: [
            'Quando uma entrada maliciosa do usuário manipula as instruções de sistema originais do modelo, forçando-o a desobedecer suas regras de segurança ou vazar dados confidenciais',
            'Quando a tomada de força do servidor queima',
            'Quando o cabo de rede quebra',
            'Um erro de sintaxe HTML',
          ],
          correctIndex: 0,
          explanation: 'Prompt Injection é a vulnerabilidade #1 do OWASP for LLMs, onde texto não confiável altera o comportamento pretendido do modelo.',
        },
      ],
      projetos: [
        {
          id: 'aiq-prj-1',
          question: 'Como garantir que a resposta de um LLM seja um JSON 100% válido para integração com sistemas legados?',
          options: [
            'Utilizando os recursos nativos de Structured Outputs / Response Schema da API do modelo',
            'Pedindo "por favor responda em JSON" e torcendo para dar certo',
            'Aumentando a temperatura para 2.0',
            'Desligando o modelo',
          ],
          correctIndex: 0,
          explanation: 'Structured Outputs forçam o motor do modelo a gerar saídas estritamente compatíveis com o JSON Schema fornecido.',
        },
      ],
    },
  },

  // =========================================================================
  // GO → RUST → CLOUD & DEVOPS
  // =========================================================================
  cloud_devops: {
    topicsByLevel: {
      iniciante: [
        {
          title: '1. Fundamentos de Go: Concorrência com Goroutines e Channels',
          desc: 'Aprenda a linguagem do Kubernetes e Docker com concorrência leve e tipagem estática.',
          theory: [
            {
              title: 'Concorrência Leve em Go',
              text: 'Goroutines são threads gerenciadas pelo runtime do Go que consomem apenas 2KB de memória (contra 1MB de threads do SO). Channels sincronizam a comunicação sem locks manuais.',
              keyPoints: ['go minhaFuncao(): Dispara goroutine.', 'ch := make(chan int) -> ch <- 42 -> valor := <-ch'],
            },
          ],
          code: `package main

import (
	"fmt"
	"time"
)

func processarWorker(id int, ch chan string) {
	time.Sleep(100 * time.Millisecond)
	ch <- fmt.Sprintf("Worker #%d finalizado com sucesso", id)
}

func main() {
	ch := make(chan string, 3)
	for i := 1; i <= 3; i++ {
		go processarWorker(i, ch)
	}

	for i := 1; i <= 3; i++ {
		fmt.Println(<-ch)
	}
}`,
          output: `Worker #1 finalizado com sucesso
Worker #2 finalizado com sucesso
Worker #3 finalizado com sucesso [Concorrência Go com Channels executada]`,
          lang: 'go',
          exercise: {
            id: 'ex-godev-ini-1',
            prompt: 'Qual palavra-chave da linguagem Go é utilizada para iniciar a execução concorrente de uma função em uma nova Goroutine leve?',
            type: 'multiple_choice',
            options: ['go', 'async', 'spawn', 'thread'],
            correctAnswer: 'go',
            hint: 'Apenas 2 letras.',
            explanation: 'A palavra-chave `go` inicia a função imediatamente em uma Goroutine gerenciada pelo runtime do Go.',
          },
        },
        {
          title: '2. Fundamentos de Rust: O Borrow Checker, Ownership e Lifetimes',
          desc: 'Compreenda como o Rust garante 100% de segurança de memória sem Garbage Collector.',
          theory: [
            {
              title: 'Ownership e Borrowing em Rust',
              text: 'O sistema de Ownership do Rust elimina vulnerabilidades como Use-After-Free e Data Races em tempo de compilação sem custo de runtime.',
              keyPoints: [
                'Cada valor em Rust tem um único dono (Owner).',
                'Quando o dono sai de escopo, a memória é liberada automaticamente (Drop).',
                'Regra de Referências: Ou você tem MÚLTIPLAS referências imutáveis (&T) OU UMA ÚNICA referência mutável (&mut T).',
              ],
            },
          ],
          code: `fn main() {
    let mut mensagem = String::from("Segurança em Rust");
    
    // Empréstimo mutável (&mut)
    adicionar_sufixo(&mut mensagem);
    
    println!("Mensagem final: {}", mensagem);
}

fn adicionar_sufixo(texto: &mut String) {
    texto.push_str(" [Memory Safe]");
}`,
          output: `Mensagem final: Segurança em Rust [Memory Safe] (Compilado pelo Borrow Checker com zero overhead)`,
          lang: 'rust',
          exercise: {
            id: 'ex-godev-ini-2',
            prompt: 'Como o Rust elimina vulnerabilidades de corrupção de memória (como vazamentos e Use-After-Free) sem utilizar um Garbage Collector?',
            type: 'multiple_choice',
            options: [
              'Através do sistema de Ownership e Borrow Checker verificado em tempo de compilação',
              'Desativando a memória RAM',
              'Transformando o código em Python',
              'Usando servidores especiais',
            ],
            correctAnswer: 'Através do sistema de Ownership e Borrow Checker verificado em tempo de compilação',
            hint: 'Regras rigorosas de posse e empréstimo checadas pelo compilador rustc.',
            explanation: 'O compilador do Rust rastreia a vida útil de cada alocação e insere as liberações de memória automaticamente sem necessidade de GC.',
          },
        },
      ],
      intermediario: [
        {
          title: '1. Docker: Multi-Stage Builds, Segurança de Containers e Otimização de Imagens',
          desc: 'Crie containers de produção mínimos com Alpine/Distroless e execute como usuário sem privilégios (non-root).',
          theory: [
            {
              title: 'Multi-Stage Builds',
              text: 'O padrão Multi-Stage usa um estágio de compilação pesado com SDKs e copia apenas o binário final para uma imagem vazia (scratch/distroless), reduzindo vulnerabilidades em 95%.',
              keyPoints: ['FROM golang:alpine AS builder -> FROM gcr.io/distroless/static', 'USER nonroot:nonroot'],
            },
          ],
          code: `# Dockerfile Multi-Stage ultra-seguro
FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -ldflags="-s -w" -o /servidor .

FROM gcr.io/distroless/static:nonroot
WORKDIR /
COPY --from=builder /servidor /servidor
USER nonroot:nonroot
EXPOSE 8080
ENTRYPOINT ["/servidor"]`,
          output: `[Docker Multi-stage]: Imagem gerada com 12MB. 0 vulnerabilidades no Trivy scanner.`,
          lang: 'dockerfile',
          exercise: {
            id: 'ex-godev-inter-1',
            prompt: 'Por que a diretiva `USER nonroot:nonroot` é uma boa prática fundamental em Dockerfiles de produção?',
            type: 'multiple_choice',
            options: [
              'Impede que processos dentro do container rodem com privilégios de root, mitigando ataques de Container Escape',
              'Acelera o download da imagem',
              'Compacta os arquivos em ZIP',
              'Desativa o firewall',
            ],
            correctAnswer: 'Impede que processos dentro do container rodem com privilégios de root, mitigando ataques de Container Escape',
            hint: 'Princípio do Menor Privilégio em containers.',
            explanation: 'Rodar como usuário não-root impede que um atacante que consiga explorar a aplicação obtenha privilégios de root no host hospedeiro.',
          },
        },
        {
          title: '2. Kubernetes: Pods, Deployments, Services, Ingress e Probes',
          desc: 'Orquestre clusters de containers com auto-healing, rolling updates e health checks (liveness/readiness).',
          theory: [
            {
              title: 'Arquitetura Kubernetes (K8s)',
              text: 'Kubernetes gerencia containers distribuídos. Deployments garantem que N réplicas estejam sempre ativas com auto-restart em caso de falha.',
              keyPoints: [
                'Liveness Probe: Reinicia pods travados.',
                'Readiness Probe: Só envia tráfego quando o pod estiver pronto para receber conexões.',
                'ClusterIP, NodePort, LoadBalancer e Ingress Controllers.',
              ],
            },
          ],
          code: `# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api-backend
  template:
    metadata:
      labels:
        app: api-backend
    spec:
      containers:
      - name: api
        image: empresa/api:v1.0.0
        ports:
        - containerPort: 8080
        resources:
          limits:
            cpu: "500m"
            memory: "256Mi"`,
          output: `deployment.apps/api-backend created
[K8s Cluster]: 3 pods criados e distribuídos nos nós com auto-healing ativo.`,
          lang: 'yaml',
          exercise: {
            id: 'ex-godev-inter-2',
            prompt: 'No Kubernetes, qual tipo de probe monitora a aplicação para saber se ela travou e deve ser reiniciada pelo kubelet?',
            type: 'multiple_choice',
            options: ['Liveness Probe', 'Readiness Probe', 'Startup Probe', 'Network Probe'],
            correctAnswer: 'Liveness Probe',
            hint: 'Checa a "vivacidade" da aplicação.',
            explanation: 'A Liveness Probe detecta impasses e situações de deadlock, reiniciando o container automaticamente.',
          },
        },
      ],
      avancado: [
        {
          title: '1. Observabilidade Cloud-Native: OpenTelemetry, Prometheus e Grafana',
          desc: 'Colete métricas, logs estruturados e distributed tracing em microsserviços distribuídos.',
          theory: [
            {
              title: 'Os Três Pilares da Observabilidade',
              text: 'Métricas (Prometheus), Logs (Loki) e Tracing Distribuído (Jaeger/Tempo) com OpenTelemetry permitem rastrear uma requisição passando por 15 microsserviços com span IDs únicos.',
              keyPoints: ['Histogramas de latência (p95, p99)', 'PromQL para alertas automáticos'],
            },
          ],
          code: `# Exemplo de métrica Prometheus em Go
import "github.com/prometheus/client_golang/prometheus"

var totalRequisicoes = prometheus.NewCounterVec(
	prometheus.CounterOpts{
		Name: "http_requisicoes_total",
		Help: "Total de requisições HTTP recebidas",
	},
	[]string{"metodo", "status"},
)`,
          output: '[OpenTelemetry]: Métricas exportadas para Prometheus na rota /metrics a cada 15s.',
          lang: 'go',
          exercise: {
            id: 'ex-godev-avanc-1',
            prompt: 'Em observabilidade, o que a métrica de "Latência p99" (99th percentile) representa?',
            type: 'multiple_choice',
            options: [
              'O tempo de resposta experimentado pelos 1% dos usuários mais lentos do sistema, revelando os piores gargalos que a média oculta',
              'O número de servidores ligados',
              'O preço da nuvem',
              'A porcentagem de bateria do servidor',
            ],
            correctAnswer: 'O tempo de resposta experimentado pelos 1% dos usuários mais lentos do sistema, revelando os piores gargalos que a média oculta',
            hint: 'Percentis altos expõem o pior cenário da experiência do usuário.',
            explanation: 'Médias aritméticas escondem picos de lentidão; o percentil p99 revela o tempo real de resposta para os 1% dos usuários mais afetados por gargalos.',
          },
        },
      ],
      projetos: [
        {
          title: '1. Projeto: Pipeline GitOps Completo com ArgoCD e Kubernetes',
          desc: 'Implemente entrega contínua declarativa onde o estado do repositório Git é sincronizado automaticamente com o cluster.',
          theory: [{ title: 'GitOps com ArgoCD', text: 'Git como única fonte de verdade da infraestrutura.', keyPoints: ['Auto-sync', 'Rollbacks automáticos'] }],
          code: `apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: app-producao
spec:
  project: default
  source:
    repoURL: 'https://github.com/empresa/gitops-infra.git'
    targetRevision: HEAD
    path: k8s/prod
  destination:
    server: 'https://kubernetes.default.svc'`,
          output: '[ArgoCD]: Estado do cluster sincronizado com o commit git em 4.2 segundos. 100% Synced.',
          lang: 'yaml',
          exercise: {
            id: 'ex-godev-prj-1',
            prompt: 'Qual é o princípio fundamental da metodologia GitOps?',
            type: 'multiple_choice',
            options: [
              'O repositório Git é a única fonte de verdade para a declaração de toda a infraestrutura e estado das aplicações no cluster',
              'Não usar Git',
              'Fazer deploys manuais por SSH',
              'Desativar o Docker',
            ],
            correctAnswer: 'O repositório Git é a única fonte de verdade para a declaração de toda a infraestrutura e estado das aplicações no cluster',
            hint: 'Infraestrutura como Código declarativa e versionada no Git.',
            explanation: 'No GitOps, qualquer alteração na infraestrutura é feita via Pull Request no Git, sendo sincronizada automaticamente por agentes como o ArgoCD.',
          },
        },
      ],
    },
    quizzesByLevel: {
      iniciante: [
        {
          id: 'cdq-ini-1',
          question: 'Qual a principal vantagem das Goroutines da linguagem Go sobre threads tradicionais do sistema operacional?',
          options: [
            'São extremamente leves, consumindo apenas 2KB de memória inicial e permitindo criar centenas de milhares de goroutines simultâneas',
            'Elas não usam CPU',
            'Elas funcionam sem energia elétrica',
            'Elas desligam o computador',
          ],
          correctIndex: 0,
          explanation: 'As Goroutines são multiplexadas sobre um número menor de threads do SO pelo runtime do Go, proporcionando escalabilidade massiva.',
        },
      ],
      intermediario: [
        {
          id: 'cdq-int-1',
          question: 'Qual a principal motivação para utilizar imagens Docker "Distroless" em produção?',
          options: [
            'Eliminar ferramentas de shell (bash, curl, apt) e pacotes desnecessários, reduzindo drasticamente a superfície de ataque para invasores',
            'Deixar a imagem colorida',
            'Permitir senhas vazias',
            'Aumentar o tamanho do arquivo',
          ],
          correctIndex: 0,
          explanation: 'Imagens distroless contêm apenas a aplicação e suas dependências de runtime, sem shells ou gerenciadores de pacotes que possam ser explorados.',
        },
      ],
      avancado: [
        {
          id: 'cdq-av-1',
          question: 'Em tracing distribuído (OpenTelemetry), o que é um "Span"?',
          options: [
            'Uma unidade de trabalho nomeada e cronometrada que representa uma operação contínua dentro de uma transação (como uma consulta SQL ou chamada HTTP)',
            'O tamanho do cabo de rede',
            'O nome do computador',
            'Um erro de JavaScript',
          ],
          correctIndex: 0,
          explanation: 'Spans compõem a árvore de um Trace, medindo o tempo gasto em cada etapa do processamento de uma requisição distribuída.',
        },
      ],
      projetos: [
        {
          id: 'cdq-prj-1',
          question: 'Como o padrão GitOps lida com alterações manuais não autorizadas feitas diretamente no cluster Kubernetes por um operador?',
          options: [
            'O controlador GitOps (ex: ArgoCD) detecta a divergência (OutOfSync) e reverte o cluster automaticamente de volta para o estado declarado no repositório Git',
            'Ele apaga o repositório',
            'Ele aceita a mudança silenciosamente',
            'Ele desinstala o Kubernetes',
          ],
          correctIndex: 0,
          explanation: 'Agentes GitOps operam em loop de reconciliação contínua, revertendo qualquer alteração manual que não tenha sido aprovada via commit no Git.',
        },
      ],
    },
  },

  // =========================================================================
  // INGLÊS TÉCNICO PARA DEVS & SEGURANÇA
  // =========================================================================
  english_tech: {
    topicsByLevel: {
      iniciante: [
        {
          title: '1. Vocabulário Fundamental de Engenharia: Terminologia de Código e Sintaxe',
          desc: 'Domine termos universais da programação: statement, assignment, scope, payload, deprecated e boilerplate.',
          theory: [
            {
              title: 'O Inglês como Língua Materna da Tecnologia',
              text: '95% da documentação oficial, RFCs e debates de código são em inglês. Entender a terminologia exata evita mal-entendidos e acelera a resolução de bugs.',
              keyPoints: [
                'Deprecated: Recurso obsoleto que será removido em versões futuras.',
                'Boilerplate: Código repetitivo necessário para configurar um módulo.',
                'Refactor: Reestruturar o código interno sem alterar seu comportamento externo.',
                'Payload: O corpo principal de dados transmitido em uma requisição.',
              ],
            },
          ],
          code: `// Common English Code Documentation & Comments
/**
 * Retrieves the user profile by unique identifier.
 * @param userId - The unique UUID of the account owner.
 * @returns A promise that resolves to the sanitized user profile.
 * @throws {NotFoundError} If the requested record does not exist.
 * @deprecated Use \`fetchUserProfileV2\` instead.
 */
async function getUserProfile(userId: string) {
  // TODO: Refactor legacy authentication check
  return db.users.findUnique({ where: { id: userId } });
}`,
          output: `[Technical Glossary]: Terminologias essenciais de documentação e anotações JSDoc/TSDoc dominadas.`,
          lang: 'typescript',
          exercise: {
            id: 'ex-eng-ini-1',
            prompt: 'O que o termo técnico "Deprecated" significa quando encontrado em uma biblioteca ou documentação oficial em inglês?',
            type: 'multiple_choice',
            options: [
              'Que o recurso se tornou obsoleto/descontinuado e será removido em versões futuras, sendo recomendada sua substituição',
              'Que o código está com vírus',
              'Que a função é a mais rápida de todas',
              'Que o arquivo é gratuito',
            ],
            correctAnswer: 'Que o recurso se tornou obsoleto/descontinuado e será removido em versões futuras, sendo recomendada sua substituição',
            hint: 'Indica obsolescência programada de APIs.',
            explanation: '"Deprecated" alerta os desenvolvedores para migrarem para alternativas modernas antes que o método seja excluído do pacote.',
          },
        },
        {
          title: '2. Leitura de Mensagens de Erro e Stack Traces em Inglês',
          desc: 'Decodifique rapidamente mensagens críticas: NullPointerException, OutOfMemory, Connection Refused, Timeout e Uncaught TypeError.',
          theory: [
            {
              title: 'Anatomia de um Stack Trace',
              text: 'Saber ler o erro em inglês da raiz para o topo identifica o arquivo e linha do bug em 5 segundos.',
              keyPoints: [
                '"Cannot read properties of undefined (reading "length")"',
                '"Connection refused": O serviço remoto não está escutando na porta solicitada.',
                '"Request timed out": O servidor não respondeu dentro da janela limite de tempo.',
              ],
            },
          ],
          code: `// Erro real de console decodificado
Uncaught TypeError: Cannot destructure property 'token' of 'response.data' as it is undefined.
    at handleLogin (src/auth/login.ts:42:15)
    at HTMLButtonElement.dispatch (node_modules/react-dom/client.js:120)

// Significado: response.data veio vazio/undefined, impedindo a extração de { token }.`,
          output: `[Análise]: Causa raiz identificada na linha 42 de login.ts.`,
          lang: 'text',
          exercise: {
            id: 'ex-eng-ini-2',
            prompt: 'O que a mensagem de erro "Connection Refused on port 5432" significa em inglês?',
            type: 'multiple_choice',
            options: [
              'Que a tentativa de conexão na porta 5432 foi recusada porque o serviço (ex: PostgreSQL) não está ativo ou o firewall bloqueou',
              'Que a internet caiu no mundo inteiro',
              'Que o monitor do computador desligou',
              'Que a senha está correta',
            ],
            correctAnswer: 'Que a tentativa de conexão na porta 5432 foi recusada porque o serviço (ex: PostgreSQL) não está ativo ou o firewall bloqueou',
            hint: 'A porta de destino rejeitou ativamente o pacote TCP SYN.',
            explanation: '"Connection Refused" ocorre quando nenhum processo está ouvindo na porta informada ou um firewall local rejeitou ativamente o handshake.',
          },
        },
      ],
      intermediario: [
        {
          title: '1. Comunicação em Pull Requests e Code Reviews em Equipes Internacionais',
          desc: 'Escreva descrições profissionais de PRs, dê feedbacks construtivos (Nit, LGTM, Blocker) e responda revisões com clareza.',
          theory: [
            {
              title: 'Padrões de Comunicação em Code Reviews',
              text: 'Convenções globais como Conventional Comments facilitam o tom e a prioridade das revisões em equipes globais.',
              keyPoints: [
                'LGTM: "Looks Good To Me" (Aprovado).',
                'Nit (Nitpick): Sugestão menor de estilo/polimento que não bloqueia o merge.',
                'Blocker / Issue: Problema crítico (bug, falha de segurança) que DEVE ser corrigido antes do merge.',
                'Phrasing: "Could we consider caching this query to avoid high database load?"',
              ],
            },
          ],
          code: `## Pull Request Description
### Summary
This PR implements rate limiting on the \`/api/v1/auth/login\` endpoint to mitigate brute-force attacks.

### Changes Made
- Added Redis token-bucket middleware with a threshold of 5 attempts per 15 minutes.
- Included comprehensive unit and integration tests covering edge cases.

### Review Checklist
- [x] Unit tests pass locally (\`npm test\`)
- [x] Security linting passed with 0 vulnerabilities
- [x] Documentation updated in OpenAPI schema`,
          output: `[Code Review]: PR submetido com padrão profissional internacional pronto para aprovação.`,
          lang: 'markdown',
          exercise: {
            id: 'ex-eng-inter-1',
            prompt: 'Em um Code Review no GitHub, o que significa a sigla "LGTM" deixada por um engenheiro sênior?',
            type: 'multiple_choice',
            options: [
              '"Looks Good To Me" (O código está ótimo na minha opinião, aprovado para merge)',
              '"Let\'s Go To Meeting"',
              '"Log Google Telemetry Metrics"',
              '"Line Gaps Too Massive"',
            ],
            correctAnswer: '"Looks Good To Me" (O código está ótimo na minha opinião, aprovado para merge)',
            hint: 'Acrônimo universal de aprovação em equipes de desenvolvimento.',
            explanation: '"LGTM" é a expressão padrão da indústria de software em inglês para indicar que o revisor examinou o código e concorda com o merge.',
          },
        },
        {
          title: '2. Leitura de RFCs, Normas OWASP e Advisories de Segurança (CVEs)',
          desc: 'Compreenda boletins de vulnerabilidades da NIST, CWEs, CVSS vectors e termos como Threat Actor, Exploit PoC e Zero-Day.',
          theory: [
            {
              title: 'Inglês para Cibersegurança',
              text: 'Boletins de vulnerabilidade (CVEs) descrevem o vetor de ataque, impacto e mitigação em linguagem técnica formal padronizada.',
              keyPoints: [
                'Zero-Day: Vulnerabilidade desconhecida pelo fabricante e sem patch disponível.',
                'Proof of Concept (PoC): Código demonstrativo de exploração.',
                'Vulnerability Advisory: Alerta oficial de segurança emitido por fornecedores.',
              ],
            },
          ],
          code: `CVE-2024-XXXX: Remote Code Execution (RCE) in LibFoo
Severity: CRITICAL (CVSS 9.8)
Vector: CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H

Description:
A heap-based buffer overflow flaw was found in LibFoo versions prior to 2.4.1. 
An unauthenticated remote attacker could exploit this vulnerability by sending 
a crafted network packet, resulting in arbitrary code execution with root privileges.

Remediation:
Upgrade to version 2.4.1 or apply vendor mitigation patch immediately.`,
          output: `[Security Advisory]: CVE traduzido e interpretado com identificação do plano de ação corretivo.`,
          lang: 'text',
          exercise: {
            id: 'ex-eng-inter-2',
            prompt: 'Em boletins de segurança de software em inglês, o que a sigla "RCE" significa?',
            type: 'multiple_choice',
            options: [
              'Remote Code Execution (Execução Remota de Código)',
              'Read Cable Ethernet',
              'Random Character Encoding',
              'Reset CPU Engine',
            ],
            correctAnswer: 'Remote Code Execution (Execução Remota de Código)',
            hint: 'Uma das vulnerabilidades mais críticas da computação.',
            explanation: 'RCE é a capacidade de um invasor executar comandos ou código arbitrário em um servidor alvo remotamente através da rede.',
          },
        },
      ],
      avancado: [
        {
          title: '1. Inglês para Entrevistas Técnicas Internacionais (System Design e Live Coding)',
          desc: 'Articule trade-offs, complexidade Big-O e decisões de arquitetura com naturalidade e vocabulário assertivo.',
          theory: [
            {
              title: 'Vocabulário de System Design',
              text: 'Em entrevistas globais (Google, Meta, Startups do Vale do Silício), o segredo é comunicar trade-offs: Throughput vs Latency, Consistency vs Availability (Teorema CAP), Horizontal vs Vertical Scaling.',
              keyPoints: [
                '"The trade-off here is between strong consistency and low write latency."',
                '"To mitigate single points of failure (SPOF), we can introduce active-passive replicas."',
                '"This approach operates in O(N log N) time complexity and O(1) auxiliary space."',
              ],
            },
          ],
          code: `// Frases de alto impacto para entrevistas técnicas
"Let's break down the functional requirements before jumping into the architecture."
"To handle traffic spikes, we can decouple the ingestion pipeline using a distributed message queue."
"Since read traffic significantly outweighs write volume, implementing a Redis read-through cache makes sense."`,
          output: `[System Design]: Argumentação de trade-offs de alta performance estruturada em inglês fluente.`,
          lang: 'text',
          exercise: {
            id: 'ex-eng-avanc-1',
            prompt: 'Em discussões de arquitetura e System Design em inglês, o que a sigla "SPOF" representa?',
            type: 'multiple_choice',
            options: [
              'Single Point of Failure (Ponto Único de Falha)',
              'Server Power On Function',
              'Standard Protocol Output File',
              'Secure Password Online Format',
            ],
            correctAnswer: 'Single Point of Failure (Ponto Único de Falha)',
            hint: 'Um componente cuja falha derruba todo o sistema.',
            explanation: 'SPOF é qualquer parte da arquitetura que, se falhar, interrompe o funcionamento de todo o sistema.',
          },
        },
      ],
      projetos: [
        {
          title: '1. Projeto: Escrita de Architecture Decision Record (ADR) Profissional em Inglês',
          desc: 'Redija um documento formal de decisão arquitetural justificando a escolha de uma stack tecnológica.',
          theory: [{ title: 'Architecture Decision Records (ADRs)', text: 'Padrão ouro corporativo para documentar decisões técnicas irreversíveis.', keyPoints: ['Title, Context, Decision, Consequences', 'Linguagem técnica assertiva'] }],
          code: `# ADR-004: Adoption of PostgreSQL with Row-Level Security for Multi-Tenancy

## Status: ACCEPTED
## Context
We require robust data isolation across enterprise tenants while keeping operational complexity low.

## Decision
We will leverage PostgreSQL 16 native Row-Level Security (RLS) policies coupled with connection pooling.

## Consequences
- Positive: Guaranteed database-level isolation preventing cross-tenant data leaks.
- Positive: Reduced backend query complexity.
- Negative: Requires careful indexing on tenant_id foreign keys to prevent sequential scans.`,
          output: `[ADR]: Documento arquitetural corporativo finalizado em conformidade com padrões de engenharia globais.`,
          lang: 'markdown',
          exercise: {
            id: 'ex-eng-prj-1',
            prompt: 'Qual é o objetivo principal de um documento ADR (Architecture Decision Record) em equipes internacionais de engenharia de software?',
            type: 'multiple_choice',
            options: [
              'Registrar formalmente o contexto, as opções avaliadas, os trade-offs e a decisão arquitetural tomada para futuras gerações de engenheiros',
              'Guardar senhas de banco de dados',
              'Cobrar faturas de clientes',
              'Fazer backup do código-fonte',
            ],
            correctAnswer: 'Registrar formalmente o contexto, as opções avaliadas, os trade-offs e a decisão arquitetural tomada para futuras gerações de engenheiros',
            hint: 'Memória técnica e justificativa de engenharia.',
            explanation: 'ADRs capturam a justificativa de escolhas arquiteturais críticas, evitando que decisões sejam revertidas no futuro sem a compreensão dos trade-offs originais.',
          },
        },
      ],
    },
    quizzesByLevel: {
      iniciante: [
        {
          id: 'eq-ini-1',
          question: 'O que o termo "Refactoring" (Refatoração) significa em engenharia de software em inglês?',
          options: [
            'Melhorar a estrutura interna, legibilidade e manutenibilidade do código sem alterar seu comportamento observável externo',
            'Reescrever o programa em outra língua falada',
            'Apagar o código e começar do zero',
            'Formatar o disco rígido',
          ],
          correctIndex: 0,
          explanation: 'Refatorar é otimizar o design e a clareza do código preservando 100% de sua funcionalidade existente.',
        },
      ],
      intermediario: [
        {
          id: 'eq-int-1',
          question: 'Em segurança da informação, o que define uma vulnerabilidade "Zero-Day"?',
          options: [
            'Uma falha de segurança recém-descoberta que ainda não possui correção oficial lançada pelo fabricante (0 dias de proteção)',
            'Um vírus que só funciona à meia-noite',
            'Um computador sem relógio',
            'Um antivírus gratuito',
          ],
          correctIndex: 0,
          explanation: 'Zero-day significa que os desenvolvedores tiveram zero dias para criar e distribuir um patch desde que a falha se tornou conhecida ou explorada.',
        },
      ],
      avancado: [
        {
          id: 'eq-av-1',
          question: 'Em discussões de escalabilidade em inglês, qual a diferença entre "Vertical Scaling" (Scale Up) e "Horizontal Scaling" (Scale Out)?',
          options: [
            'Vertical Scaling adiciona mais CPU/RAM à mesma máquina; Horizontal Scaling adiciona mais nós/servidores em paralelo ao cluster',
            'Vertical é para celular e Horizontal para TV',
            'Vertical é grátis e Horizontal é pago',
            'Não há diferença',
          ],
          correctIndex: 0,
          explanation: 'Scale Up melhora o poder de uma única máquina física; Scale Out distribui a carga por dezenas de instâncias menores.',
        },
      ],
      projetos: [
        {
          id: 'eq-prj-1',
          question: 'Por que o uso de "Conventional Comments" (como `nit:`, `suggestion:`, `blocker:`) melhora as interações em equipes globais assíncronas?',
          options: [
            'Porque explicita a intenção e a severidade do comentário com clareza, evitando que sugestões cosméticas sejam interpretadas como impedimentos de merge',
            'Porque é uma regra da ONU',
            'Porque traduz código para binário',
            'Para economizar caracteres',
          ],
          correctIndex: 0,
          explanation: 'Comentários convencionais eliminam ambiguidades de tom em comunicação internacional assíncrona por texto.',
        },
      ],
    },
  },
};
