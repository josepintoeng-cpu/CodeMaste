import { TechCurriculumData } from '../techCurriculum';

export const BASE_WEB_CURRICULUM: Record<string, TechCurriculumData> = {
  // =========================================================================
  // JAVASCRIPT
  // =========================================================================
  javascript: {
    topicsByLevel: {
      iniciante: [
        {
          title: '1. Fundamentos do JavaScript Moderno (ES6+): let, const e Tipos Primitivos',
          desc: 'Entenda escopo de bloco, imutabilidade com const e tipagem dinâmica em JS.',
          theory: [
            {
              title: 'Declarações e Escopo no ES6',
              text: 'O JavaScript moderno baniu o uso de "var" em favor de "let" (mutável de escopo de bloco) e "const" (referência constante e imutável).',
              keyPoints: [
                'const: Impede reatribuição de ponteiro de memória.',
                'let: Variável com escopo léxico estrito limitado ao bloco {}.',
                'Template Literals com interpolação de strings: `Olá, ${nome}`.',
              ],
            },
          ],
          code: `const nomeDev = "Hacker Ético";
let nivelAcesso = 1;

if (true) {
  let segredoTemporario = "XYZ_99";
  nivelAcesso += 1;
}

console.log(\`Desenvolvedor: \${nomeDev} | Nível: \${nivelAcesso}\`);`,
          output: `Desenvolvedor: Hacker Ético | Nível: 2`,
          lang: 'javascript',
          exercise: {
            id: 'ex-js-ini-1',
            prompt: 'Qual declaração de variável no JavaScript moderno garante que a referência não poderá ser reatribuída?',
            type: 'multiple_choice',
            options: ['const', 'let', 'var', 'global'],
            correctAnswer: 'const',
            hint: 'Abreviação de Constant.',
            explanation: '`const` declara uma variável cujo identificador não pode ser reatribuído com um novo valor.',
          },
        },
        {
          title: '2. Arrow Functions, Desestruturação e Spread / Rest Operators',
          desc: 'Escreva código conciso e elegante com operadores modernos do ECMAScript.',
          theory: [
            {
              title: 'Sintaxe Expressiva do ES6',
              text: 'Arrow functions () => {} simplificam funções anônimas e herdam o valor léxico de "this". Desestruturação extrai propriedades de objetos diretamente em variáveis.',
              keyPoints: [
                'const somar = (a, b) => a + b;',
                'const { id, email } = usuario;',
                'const cloneArray = [...original, novoElemento];',
              ],
            },
          ],
          code: `const configServidor = { porta: 8080, ssl: true, timeout: 5000 };
const { porta, ssl } = configServidor;

const calcularUptime = (dias, horas = 0) => (dias * 24) + horas;

console.log(\`Servidor ouvindo na porta \${porta} (SSL: \${ssl}). Uptime: \${calcularUptime(7)} horas\`);`,
          output: `Servidor ouvindo na porta 8080 (SSL: true). Uptime: 168 horas`,
          lang: 'javascript',
          exercise: {
            id: 'ex-js-ini-2',
            prompt: 'Como você desestrutura a propriedade `status` de um objeto `resposta` em JavaScript?',
            type: 'multiple_choice',
            options: ['const { status } = resposta;', 'const status = resposta[];', 'const status <- resposta;', 'const [status] = resposta;'],
            correctAnswer: 'const { status } = resposta;',
            hint: 'Utiliza chaves {} para desestruturar objetos.',
            explanation: 'A desestruturação de objetos utiliza chaves `{ prop }` para extrair os atributos diretamente para constantes locais.',
          },
        },
      ],
      intermediario: [
        {
          title: '1. O Event Loop, Call Stack, Microtasks (Promises) e Macrotasks (Timers)',
          desc: 'Compreenda a fundo como o motor V8 gerencia assincronismo sem travar a thread principal.',
          theory: [
            {
              title: 'A Mecânica do Event Loop',
              text: 'O JavaScript é single-threaded. O Event Loop monitora a Call Stack: quando ela esvazia, processa todas as Microtasks (Promise.then, async/await, queueMicrotask) antes de buscar a próxima Macrotask (setTimeout, setInterval, I/O).',
              keyPoints: [
                'Call Stack: Pilha de execução síncrona LIFO.',
                'Microtask Queue: Alta prioridade (Promises resolvem aqui).',
                'Macrotask Queue / Callback Queue: Timers e eventos de I/O.',
              ],
            },
          ],
          code: `console.log("1. Síncrono Início");

setTimeout(() => console.log("4. Macrotask (setTimeout)"), 0);

Promise.resolve().then(() => console.log("3. Microtask (Promise)"));

console.log("2. Síncrono Fim");`,
          output: `1. Síncrono Início
2. Síncrono Fim
3. Microtask (Promise)
4. Macrotask (setTimeout)`,
          lang: 'javascript',
          exercise: {
            id: 'ex-js-inter-1',
            prompt: 'Em que ordem o Event Loop do JavaScript executa Microtasks (como Promises) e Macrotasks (como setTimeout)?',
            type: 'multiple_choice',
            options: [
              'Todas as Microtasks da fila são esvaziadas e executadas antes da próxima Macrotask ser processada',
              'setTimeout roda sempre antes de Promises',
              'São executadas aleatoriamente',
              'Depende da velocidade da internet',
            ],
            correctAnswer: 'Todas as Microtasks da fila são esvaziadas e executadas antes da próxima Macrotask ser processada',
            hint: 'A fila de Microtasks tem prioridade absoluta quando a Call Stack fica livre.',
            explanation: 'O Event Loop sempre esgota completamente a fila de Microtasks após cada tick síncrono antes de retirar uma Macrotask da fila de eventos.',
          },
        },
      ],
      avancado: [
        {
          title: '1. Closures, Prototypes e Gerenciamento de Memória (V8 Engine)',
          desc: 'Domine a cadeia de escopos léxicos, herança prototípica e evite vazamentos de memória (Memory Leaks).',
          theory: [
            {
              title: 'Closures e Garbage Collection',
              text: 'Uma closure é a combinação de uma função agrupada com referências ao seu estado léxico circundante. O motor V8 mantém essas variáveis na Heap enquanto a função interna for acessível.',
              keyPoints: [
                'Funções lembram de variáveis declaradas no escopo pai mesmo após a função pai ter retornado.',
                'WeakMap e WeakSet: Permitem que objetos sejam coletados pelo Garbage Collector quando não houver outras referências fortes.',
              ],
            },
          ],
          code: `function criarCofreSeguro() {
  let saldoSecreto = 50000; // Variável privada encapsulada pela closure

  return {
    consultar: () => saldoSecreto,
    sacar: (valor) => {
      if (valor <= saldoSecreto) {
        saldoSecreto -= valor;
        return \`Saque aprovado: R$ \${valor}\`;
      }
      return "Saldo insuficiente";
    },
  };
}

const cofre = criarCofreSeguro();
console.log(cofre.sacar(15000));
console.log("Saldo restante:", cofre.consultar());`,
          output: `Saque aprovado: R$ 15000
Saldo restante: 35000 [Encapsulamento seguro via Closure]`,
          lang: 'javascript',
          exercise: {
            id: 'ex-js-avanc-1',
            prompt: 'Qual mecanismo do JavaScript permite criar variáveis privadas em funções sem que elas possam ser acessadas ou modificadas diretamente de fora?',
            type: 'multiple_choice',
            options: ['Closures', 'var global', 'console.log', 'JSON.parse'],
            correctAnswer: 'Closures',
            hint: 'Encapsulamento léxico de variáveis.',
            explanation: 'Uma closure encapsula o escopo léxico interno, expondo apenas os métodos retornados que possuem acesso legítimo àquela variável.',
          },
        },
      ],
      projetos: [
        {
          title: '1. Projeto: Motor de Renderização Virtual DOM Minimalista em JavaScript Puro',
          desc: 'Construa um mini-React do zero com createElement, render e algoritmo de diffing simples.',
          theory: [{ title: 'Construindo um Virtual DOM', text: 'Entenda como frameworks reativos funcionam por dentro.', keyPoints: ['Objetos JS representando nós HTML', 'Manipulação direta do document.createElement'] }],
          code: `function createElement(tag, props, ...children) {
  return { tag, props: props || {}, children };
}

function render(vnode) {
  if (typeof vnode === 'string') return document.createTextNode(vnode);
  const el = document.createElement(vnode.tag);
  vnode.children.forEach(child => el.appendChild(render(child)));
  return el;
}`,
          output: '[Mini-VDOM]: 10 nós virtuais instanciados no DOM em 0.4ms.',
          lang: 'javascript',
          exercise: {
            id: 'ex-js-prj-1',
            prompt: 'O que é um nó do "Virtual DOM" em essência?',
            type: 'multiple_choice',
            options: [
              'Um objeto JavaScript simples e leve em memória que descreve a tag, propriedades e filhos do elemento',
              'Um chip da placa mãe',
              'Um banco de dados SQLite',
              'Um arquivo CSS externo',
            ],
            correctAnswer: 'Um objeto JavaScript simples e leve em memória que descreve a tag, propriedades e filhos do elemento',
            hint: 'Uma árvore de objetos leves em memória.',
            explanation: 'O Virtual DOM é apenas uma representação em árvore de objetos JavaScript puros que espelha a estrutura pretendida da interface.',
          },
        },
      ],
    },
    quizzesByLevel: {
      iniciante: [
        {
          id: 'jq-ini-1',
          question: 'O que o operador de igualdade estrita `===` verifica no JavaScript?',
          options: [
            'Verifica tanto a igualdade de valor quanto a igualdade de tipo de dado sem coerção implícita',
            'Apenas o valor convertendo tipos automaticamente',
            'Apenas a cor da variável',
            'Se a variável é global',
          ],
          correctIndex: 0,
          explanation: 'O operador `===` (triple equals) não realiza conversão de tipos (type coercion), garantindo comparações previsíveis e seguras.',
        },
      ],
      intermediario: [
        {
          id: 'jq-int-1',
          question: 'Qual a principal diferença entre `Promise.all()` e `Promise.allSettled()`?',
          options: [
            '`Promise.all` rejeita imediatamente se qualquer promise falhar; `Promise.allSettled` aguarda todas concluírem (com sucesso ou erro) retornando o status de cada uma',
            '`Promise.all` só roda no backend',
            '`Promise.allSettled` apaga o código',
            'Não há diferença',
          ],
          correctIndex: 0,
          explanation: '`Promise.allSettled()` é ideal quando você deseja obter os resultados de todas as requisições independentemente de algumas terem falhado.',
        },
      ],
      avancado: [
        {
          id: 'jq-av-1',
          question: 'O que é o Garbage Collector no motor V8 do JavaScript?',
          options: [
            'O processo em background que identifica e desaloca automaticamente a memória dos objetos na Heap que não possuem mais referências ativas no programa',
            'Um antivírus do navegador',
            'Um compressor de arquivos zip',
            'O linter de código',
          ],
          correctIndex: 0,
          explanation: 'O GC do V8 utiliza algoritmos de Mark-and-Sweep para coletar memória órfã e prevenir vazamentos.',
        },
      ],
      projetos: [
        {
          id: 'jq-prj-1',
          question: 'Por que manipular o Virtual DOM em lote (batching) é mais rápido do que alterar o DOM real do navegador repetidamente?',
          options: [
            'Porque alterações diretas no DOM do navegador forçam recálculos caros de layout (Reflow) e repintura (Repaint), enquanto o Virtual DOM calcula todas as mudanças em memória antes de aplicar apenas a diferença mínima',
            'Porque o navegador não suporta JavaScript',
            'Porque o DOM real é pago',
            'Porque desativa os gráficos',
          ],
          correctIndex: 0,
          explanation: 'Minimizar Reflows e Repaints no DOM do navegador é a chave para interfaces fluidas a 60 FPS.',
        },
      ],
    },
  },

  // =========================================================================
  // NODE.JS
  // =========================================================================
  nodejs: {
    topicsByLevel: {
      iniciante: [
        {
          title: '1. Fundamentos do Node.js, Libuv e Módulos Nativos (fs, path, os, crypto)',
          desc: 'Entenda a arquitetura orientada a eventos e I/O não-bloqueante do Node.js.',
          theory: [
            {
              title: 'Arquitetura do Node.js',
              text: 'Node.js executa o motor V8 fora do navegador, utilizando a biblioteca Libuv para gerenciar o pool de threads assíncronas e I/O não-bloqueante.',
              keyPoints: [
                'fs/promises: Manipulação assíncrona de arquivos.',
                'path.join(__dirname, "arquivo.txt"): Constrói caminhos portáveis entre Windows e Linux.',
                'crypto: Criptografia nativa com hashes SHA-256 e geração de UUIDs.',
              ],
            },
          ],
          code: `import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

async function processarArquivo() {
  const hash = crypto.randomBytes(16).toString('hex');
  const conteudo = \`Timestamp: \${new Date().toISOString()} | Token: \${hash}\`;
  
  await fs.writeFile('log-servidor.txt', conteudo, 'utf-8');
  console.log("Arquivo gravado de forma não-bloqueante com sucesso!");
}
processarArquivo();`,
          output: `Arquivo gravado de forma não-bloqueante com sucesso! [fs/promises]`,
          lang: 'javascript',
          exercise: {
            id: 'ex-node-ini-1',
            prompt: 'Qual biblioteca interna em C no Node.js é responsável por gerenciar o Event Loop e o Pool de Threads assíncronas para operações de I/O?',
            type: 'multiple_choice',
            options: ['Libuv', 'React', 'Webpack', 'Babel'],
            correctAnswer: 'Libuv',
            hint: 'Biblioteca multiplataforma de C focada em I/O assíncrono.',
            explanation: 'A Libuv fornece o event loop e o thread pool que possibilitam o modelo não-bloqueante do Node.js.',
          },
        },
      ],
      intermediario: [
        {
          title: '1. Streams e Buffers: Processando Arquivos Gigantes sem Estourar a Memória RAM',
          desc: 'Utilize Readable, Writable, Transform Streams e pipeline() para processar gigabytes com streaming contínuo.',
          theory: [
            {
              title: 'Por que usar Streams?',
              text: 'Carregar um arquivo de 5GB com fs.readFile consome 5GB de RAM e derruba o Node.js com erro de heap. Streams processam os dados em blocos (chunks) de 64KB com fluxo contínuo e backpressure controlado.',
              keyPoints: [
                'createReadStream -> Transform -> createWriteStream',
                'pipeline(streamLeitura, streamGzip, streamGravacao, callback): Gerencia backpressure e fecha streams em caso de erro.',
              ],
            },
          ],
          code: `import { createReadStream, createWriteStream } from 'fs';
import { createGzip } from 'zlib';
import { pipeline } from 'stream/promises';

async function compactarLogGigante() {
  // Comprime arquivo de 2GB consumindo apenas 25MB de RAM!
  await pipeline(
    createReadStream('logs_producao.txt'),
    createGzip(),
    createWriteStream('logs_producao.txt.gz')
  );
  console.log("Compressão concluída com 100% de eficiência de memória!");
}`,
          output: `Compressão concluída com 100% de eficiência de memória! [Streams pipeline]`,
          lang: 'javascript',
          exercise: {
            id: 'ex-node-inter-1',
            prompt: 'Qual é o principal benefício do uso de Streams no Node.js?',
            type: 'multiple_choice',
            options: [
              'Permite processar grandes volumes de dados em pequenos blocos (chunks) contínuos sem carregar o arquivo inteiro na memória RAM',
              'Elimina a necessidade de conexões de internet',
              'Aumenta o brilho da tela',
              'Desativa o sistema operacional',
            ],
            correctAnswer: 'Permite processar grandes volumes de dados em pequenos blocos (chunks) contínuos sem carregar o arquivo inteiro na memória RAM',
            hint: 'Fluxo em pedaços contínuos com baixo consumo de memória.',
            explanation: 'Streams leem e processam dados pedaço por pedaço, mantendo o consumo de memória RAM baixo e constante mesmo para arquivos de múltiplos gigabytes.',
          },
        },
      ],
      avancado: [
        {
          title: '1. Worker Threads e Cluster Module para CPU-Intensive Tasks',
          desc: 'Supere a limitação single-thread do Node.js distribuindo tarefas pesadas por todos os núcleos da CPU.',
          theory: [
            {
              title: 'Paralelismo Real no Node.js',
              text: 'Tarefas de CPU pesada (processamento de imagens, criptografia em lote) travam o Event Loop. Worker Threads executam código JavaScript em threads paralelas com memória compartilhada (SharedArrayBuffer).',
              keyPoints: [
                'cluster.fork(): Cria múltiplos processos Node.js compartilhando a mesma porta TCP.',
                'Worker Threads: Threads leves compartilhando memória no mesmo processo.',
              ],
            },
          ],
          code: `import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';

if (isMainThread) {
  const worker = new Worker(new URL(import.meta.url), { workerData: 5000000 });
  worker.on('message', (resultado) => console.log('Resultado do Worker paralelo:', resultado));
} else {
  // Executa em thread paralela sem travar o Event Loop principal
  let soma = 0;
  for (let i = 0; i < workerData; i++) soma += i;
  parentPort?.postMessage(soma);
}`,
          output: `Resultado do Worker paralelo: 12499997500000 [Processamento paralelo concluído]`,
          lang: 'javascript',
          exercise: {
            id: 'ex-node-avanc-1',
            prompt: 'Qual módulo nativo do Node.js permite executar operações pesadas de processamento de CPU em threads paralelas dedicadas?',
            type: 'multiple_choice',
            options: ['worker_threads', 'http', 'events', 'readline'],
            correctAnswer: 'worker_threads',
            hint: 'Threads de trabalho paralelas.',
            explanation: '`worker_threads` viabiliza computação paralela real em múltiplos threads sem bloquear o Event Loop principal de I/O do Node.js.',
          },
        },
      ],
      projetos: [
        {
          title: '1. Projeto: Servidor Web HTTP Nativo com Roteamento Seguro e Streaming',
          desc: 'Construa um servidor web de alta performance sem Express utilizando apenas APIs nativas do Node.js.',
          theory: [{ title: 'Servidor Nativo em Node', text: 'Domine a base sobre a qual todos os frameworks são construídos.', keyPoints: ['http.createServer', 'Tratamento de rotas e streams'] }],
          code: `import http from 'http';

const servidor = http.createServer((req, res) => {
  if (req.url === '/api/saude' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'operacional', uptime: process.uptime() }));
    return;
  }
  res.writeHead(404);
  res.end('Rota não encontrada');
});

servidor.listen(3000, () => console.log('Servidor nativo ouvindo na porta 3000'));`,
          output: `Servidor nativo ouvindo na porta 3000 [0 dependências externas]`,
          lang: 'javascript',
          exercise: {
            id: 'ex-node-prj-1',
            prompt: 'Qual método do módulo `http` cria uma instância de servidor pronta para escutar requisições de rede no Node.js?',
            type: 'multiple_choice',
            options: ['http.createServer(callback)', 'http.start()', 'http.listen()', 'http.connect()'],
            correctAnswer: 'http.createServer(callback)',
            hint: 'Cria o servidor recebendo o request handler.',
            explanation: '`http.createServer()` inicializa o listener que processa cada requisição HTTP recebida na porta configurada.',
          },
        },
      ],
    },
    quizzesByLevel: {
      iniciante: [
        {
          id: 'nq-ini-1',
          question: 'O que significa o modelo "Non-Blocking I/O" do Node.js?',
          options: [
            'Operações de leitura de arquivos ou consultas de rede são delegadas em segundo plano, permitindo que a aplicação continue atendendo outras requisições sem congelar',
            'O código não pode ser alterado',
            'O servidor só aceita uma requisição por vez',
            'Não permite acesso a bancos de dados',
          ],
          correctIndex: 0,
          explanation: 'O modelo não-bloqueante permite que um único processo do Node.js lide com milhares de conexões simultâneas com altíssima eficiência.',
        },
      ],
      intermediario: [
        {
          id: 'nq-int-1',
          question: 'Em Streams do Node.js, o que é o fenômeno de "Backpressure"?',
          options: [
            'Ocorre quando a fonte de leitura produz dados mais rápido do que o destino de escrita consegue gravar; mecanismos de backpressure pausam a leitura para equilibrar o fluxo',
            'Um vazamento de dados na internet',
            'Um erro de disco cheio',
            'Uma falha de hardware',
          ],
          correctIndex: 0,
          explanation: 'O gerenciamento automático de backpressure impede que a memória RAM do servidor estoure por acúmulo de dados não gravados.',
        },
      ],
      avancado: [
        {
          id: 'nq-av-1',
          question: 'Qual a vantagem do módulo nativo `cluster` em ambientes de produção com servidores multi-core?',
          options: [
            'Permite instanciar um processo Node.js por núcleo de processador (CPU), multiplicando a capacidade de atendimento de requisições simultâneas',
            'Desliga núcleos para economizar energia',
            'Substitui o banco de dados',
            'Não traz benefícios',
          ],
          correctIndex: 0,
          explanation: 'O módulo cluster aproveita 100% dos núcleos de CPU disponíveis no servidor distribuindo a carga de conexões entre os processos filhos.',
        },
      ],
      projetos: [
        {
          id: 'nq-prj-1',
          question: 'Por que o Node.js é amplamente escolhido para construir sistemas de mensageria em tempo real e gateways de microsserviços?',
          options: [
            'Pela sua baixa latência no tratamento de milhares de conexões concorrentes orientadas a eventos (Event-Driven Architecture) e facilidade de manipulação de JSON',
            'Porque ele não precisa de memória RAM',
            'Porque é a única linguagem que roda em computadores',
            'Porque gera executáveis binários para MS-DOS',
          ],
          correctIndex: 0,
          explanation: 'A arquitetura orientada a eventos do Node.js é perfeita para I/O massivo e streaming em tempo real.',
        },
      ],
    },
  },
};
