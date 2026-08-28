import { TechId, LevelId, TheorySection, CodeExample, SimulationConfig, Exercise, QuizQuestion } from '../types';
import { CYBER_CURRICULUM } from './data/cyberCurriculum';
import { C_SYS_CYBER_CURRICULUM } from './data/cSysCyber';
import { GIT_CURRICULUM } from './data/gitCurriculum';
import { BACKEND_CURRICULUM } from './data/backendCurriculum';
import { DB_PYTHON_CURRICULUM } from './data/dbAndPythonCurriculum';
import { CLOUD_AI_CURRICULUM } from './data/cloudAiCurriculum';
import { BASE_WEB_CURRICULUM } from './data/baseWebCurriculum';
import { GAME_DEV_CURRICULUM } from './data/gameDevCurriculum';
import { GAME_3D_UNREAL_CURRICULUM } from './data/game3dUnrealCurriculum';
import { GAME_ENGINES_MULTIPLAYER_CURRICULUM } from './data/gameEnginesMultiplayerCurriculum';
import { GAME_SPECIALIZATION_CURRICULUM } from './data/gameSpecializationCurriculum';
import { HTML_CSS_CURRICULUM } from './data/htmlCssCurriculum';
import { ENTERPRISE_MOBILE_CURRICULUM } from './data/enterpriseAndMobileCurriculum';

export interface TechCurriculumData {
  topicsByLevel: Record<
    LevelId,
    {
      title: string;
      desc: string;
      theory: TheorySection[];
      code: string;
      output: string;
      lang: string;
      exercise: Exercise;
    }[]
  >;
  quizzesByLevel: Record<LevelId, QuizQuestion[]>;
}

export const TECH_CURRICULUM: Partial<Record<TechId, TechCurriculumData>> = {
  // Game Development & 3D Engines
  unity_2d: GAME_DEV_CURRICULUM.unity_2d,
  unity_3d: GAME_3D_UNREAL_CURRICULUM.unity_3d,
  unreal_cpp: GAME_3D_UNREAL_CURRICULUM.unreal_cpp,
  godot_engine: GAME_ENGINES_MULTIPLAYER_CURRICULUM.godot_engine,
  game_multiplayer: GAME_ENGINES_MULTIPLAYER_CURRICULUM.game_multiplayer,
  game_mobile_dev: GAME_ENGINES_MULTIPLAYER_CURRICULUM.game_mobile_dev,
  game_pc_publishing: GAME_ENGINES_MULTIPLAYER_CURRICULUM.game_pc_publishing,
  game_fundamentals: GAME_SPECIALIZATION_CURRICULUM.game_fundamentals,
  game_graphics_ai: GAME_SPECIALIZATION_CURRICULUM.game_graphics_ai,
  blender_3d: GAME_SPECIALIZATION_CURRICULUM.blender_3d,
  // Linux & Ethical Hacking
  linux_cyber: CYBER_CURRICULUM.linux_cyber,
  // C, Redes, Sistemas Operacionais & Cyber
  c_sys_cyber: C_SYS_CYBER_CURRICULUM,
  // Git & GitHub
  git: GIT_CURRICULUM,
  // Next.js & APIs
  nextjs: BACKEND_CURRICULUM.nextjs,
  apis: BACKEND_CURRICULUM.apis,
  // PostgreSQL & Python FastAPI
  postgresql: DB_PYTHON_CURRICULUM.postgresql,
  python_fastapi: DB_PYTHON_CURRICULUM.python_fastapi,
  // TypeScript, IA Apps, Cloud & DevOps, English Tech
  typescript: CLOUD_AI_CURRICULUM.typescript,
  ai_apps: CLOUD_AI_CURRICULUM.ai_apps,
  cloud_devops: CLOUD_AI_CURRICULUM.cloud_devops,
  english_tech: CLOUD_AI_CURRICULUM.english_tech,
  // Base Web & Systems
  javascript: BASE_WEB_CURRICULUM.javascript,
  nodejs: BASE_WEB_CURRICULUM.nodejs,
  // HTML5 & CSS3
  html: HTML_CSS_CURRICULUM.html,
  css: HTML_CSS_CURRICULUM.css,
  // Python, Java, PHP, Flutter, MySQL
  python: ENTERPRISE_MOBILE_CURRICULUM.python,
  java: ENTERPRISE_MOBILE_CURRICULUM.java,
  php: ENTERPRISE_MOBILE_CURRICULUM.php,
  flutter: ENTERPRISE_MOBILE_CURRICULUM.flutter,
  mysql: ENTERPRISE_MOBILE_CURRICULUM.mysql,
  // ==========================================
  // REACT
  // ==========================================
  react: {
    topicsByLevel: {
      iniciante: [
        {
          title: '1. Fundamentos de Componentes e JSX',
          desc: 'Entenda como o React cria árvores virtuais e renderiza elementos na tela com JSX.',
          theory: [
            {
              title: 'O que é JSX e Virtual DOM?',
              text: 'JSX é uma extensão de sintaxe para JavaScript que se assemelha ao HTML. O React compila JSX em chamadas React.createElement(), criando uma representação leve da interface na memória (Virtual DOM) para calcular alterações com máxima eficiência (Reconciliation).',
              keyPoints: [
                'Componentes funcionais são funções puras que retornam JSX.',
                'Todo componente deve retornar um único elemento raiz ou React Fragment (<>...</>).',
                'Tags e atributos JSX usam camelCase (ex: className, onClick, htmlFor).',
              ],
              conceptCard: '💡 Regra de Ouro: Componentes React devem sempre começar com letra maiúscula (ex: MeuBotao).',
            },
          ],
          code: `import React from 'react';

export function CardBoasVindas({ nome, nivel }) {
  return (
    <div className="card-react">
      <h2>Olá, {nome}! 🚀</h2>
      <p>Nível atual: <strong>{nivel}</strong></p>
      <button onClick={() => console.log('Iniciando jornada!')}>
        Começar Curso
      </button>
    </div>
  );
}`,
          output: '[React DOM]: CardBoasVindas montado no root com props { nome: "Dev", nivel: "Iniciante" }',
          lang: 'javascript',
          exercise: {
            id: 'ex-react-iniciante-1',
            prompt: 'Em React, qual atributo é utilizado no JSX para definir classes CSS em elementos HTML?',
            type: 'multiple_choice',
            options: ['class', 'className', 'classList', 'styleClass'],
            correctAnswer: 'className',
            hint: 'Como "class" é palavra reservada do JavaScript, o JSX utiliza um nome alternativo em camelCase.',
            explanation: 'O JSX utiliza className para evitar conflito com a palavra-chave reservada "class" do JavaScript.',
          },
        },
        {
          title: '2. Estado com useState & Imutabilidade',
          desc: 'Aprenda a gerenciar estados reativos e disparar re-renderizações controladas.',
          theory: [
            {
              title: 'Como o useState funciona?',
              text: 'O hook useState declara uma variável de estado que persiste entre renderizações. O React rastreia o setter e agenda uma nova renderização quando o valor muda. Nunca altere o estado diretamente: sempre forneça um novo valor ou use a função de atualização.',
              keyPoints: [
                'const [valor, setValor] = useState(inicial);',
                'Imutabilidade: em arrays/objetos, sempre crie cópias com spread operator (...obj).',
                'Use setters funcionais quando o novo estado depender do anterior: setContador(prev => prev + 1).',
              ],
              conceptCard: '⚠️ Atenção: Modificar state.prop = 123 não notifica o React e não causará re-render.',
            },
          ],
          code: `import React, { useState } from 'react';

export function ContadorInterativo() {
  const [contador, setContador] = useState(0);

  const incrementar = () => {
    setContador(prev => prev + 1);
  };

  return (
    <div>
      <p>Cliques: {contador}</p>
      <button onClick={incrementar}>Incrementar +1</button>
    </div>
  );
}`,
          output: '[Estado]: contador = 1 -> Re-renderizando ContadorInterativo',
          lang: 'javascript',
          exercise: {
            id: 'ex-react-iniciante-2',
            prompt: 'Qual a maneira correta de atualizar um array no estado com useState em React?',
            type: 'multiple_choice',
            options: [
              'itens.push(novoItem); setItens(itens);',
              'setItens([...itens, novoItem]);',
              'itens[itens.length] = novoItem;',
              'setItens(itens.push(novoItem));',
            ],
            correctAnswer: 'setItens([...itens, novoItem]);',
            hint: 'Lembre-se do princípio da imutabilidade: crie um novo array contendo os itens antigos e o novo.',
            explanation: 'Criar um novo array usando o spread operator (...itens) garante que a referência de memória mude e o React execute o ciclo de renderização.',
          },
        },
        {
          title: '3. Efeitos Colaterais com useEffect',
          desc: 'Sincronize componentes com APIs externas, timers, listeners e DOM.',
          theory: [
            {
              title: 'O ciclo do useEffect',
              text: 'O useEffect permite executar efeitos colaterais após o componente ser desenhado na tela. O array de dependências define quando o efeito é reexecutado, e a função de limpeza (cleanup) evita vazamentos de memória (memory leaks).',
              keyPoints: [
                'Sem array: executa em toda renderização.',
                'Array vazio []: executa apenas na montagem inicial (mount).',
                '[depA, depB]: executa quando depA ou depB mudarem.',
                'Função de retorno () => cleanup: limpa timers, subscriptions e conexões.',
              ],
              conceptCard: '🧹 Cleanup: Sempre desinscreva websockets ou remova event listeners na função de retorno do useEffect.',
            },
          ],
          code: `import React, { useState, useEffect } from 'react';

export function RelogioDigital() {
  const [hora, setHora] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setHora(new Date().toLocaleTimeString());
    }, 1000);

    // Cleanup ao desmontar
    return () => clearInterval(timer);
  }, []);

  return <div>Hora atual: {hora}</div>;
}`,
          output: '[useEffect]: Timer ativo. Cleanup registrado para desmontagem.',
          lang: 'javascript',
          exercise: {
            id: 'ex-react-iniciante-3',
            prompt: 'Como fazer um useEffect executar apenas uma vez, quando o componente é montado?',
            type: 'multiple_choice',
            options: [
              'Omitindo o segundo argumento do useEffect',
              'Passando um array de dependências vazio [] como segundo argumento',
              'Passando [null] no array de dependências',
              'Chamando useEffect.once()',
            ],
            correctAnswer: 'Passando um array de dependências vazio [] como segundo argumento',
            hint: 'Sem dependências para vigiar, o efeito só é disparado no ciclo inicial.',
            explanation: 'Um array vazio [] informa ao React que o efeito não depende de nenhuma prop ou estado, executando apenas no mount e seu cleanup no unmount.',
          },
        },
        {
          title: '4. Renderização Condicional e Listas com Keys',
          desc: 'Renderize elementos com ternários, curto-circuito && e iterações mapeadas (.map).',
          theory: [
            {
              title: 'Keys e Renderização Dinâmica',
              text: 'Ao iterar arrays com .map(), cada elemento deve ter uma prop key única e estável (como um ID de banco). Isso permite ao algoritmo de reconciliação saber exatamente quais itens foram inseridos, removidos ou reordenados sem recriar toda a árvore.',
              keyPoints: [
                'Curto-circuito: {estaLogado && <Dashboard />}',
                'Ternário: {carregando ? <Spinner /> : <Conteudo />}',
                'Nunca use o índice do array como key se a lista for mutável ou reordenável.',
              ],
            },
          ],
          code: `export function ListaTarefas({ tarefas, carregando }) {
  if (carregando) return <p>Carregando dados...</p>;

  return (
    <ul>
      {tarefas.map(item => (
        <li key={item.id} className={item.feita ? 'feita' : 'pendente'}>
          {item.titulo}
        </li>
      ))}
    </ul>
  );
}`,
          output: '[ListaTarefas]: 3 itens renderizados com keys estáveis [1, 2, 3]',
          lang: 'javascript',
          exercise: {
            id: 'ex-react-iniciante-4',
            prompt: 'Por que não é recomendado usar o índice do loop (index) como key em listas dinâmicas no React?',
            type: 'multiple_choice',
            options: [
              'Porque o React gera um erro fatal de compilação',
              'Porque ao reordenar ou remover itens, os índices mudam, causando bugs de estado e perda de performance',
              'Porque o índice ocupa muita memória RAM',
              'Porque o CSS não funciona em elementos com key numérica',
            ],
            correctAnswer: 'Porque ao reordenar ou remover itens, os índices mudam, causando bugs de estado e perda de performance',
            hint: 'A key precisa ser estável entre renderizações para rastrear a identidade real do dado.',
            explanation: 'Usar índices como keys faz com que o React confunda elementos quando a ordem muda ou itens são filtrados, mantendo o estado de inputs associados ao índice errado.',
          },
        },
        {
          title: '5. Formulários Controlados e Custom Hooks',
          desc: 'Gerencie inputs com estado bidirecional e encapsule lógicas reutilizáveis.',
          theory: [
            {
              title: 'Inputs Controlados & Hooks Personalizados',
              text: 'Em componentes controlados, o valor do input é derivado do state do React e atualizado via evento onChange. Para reutilizar lógicas (ex: requisições, formulários), criamos Custom Hooks — funções que iniciam com "use" e combinam outros hooks.',
              keyPoints: [
                'Input controlado: value={texto} onChange={e => setTexto(e.target.value)}',
                'Custom hooks: useFetch, useDebounce, useLocalStorage, useAuth.',
                'Permitem separar regra de negócio da apresentação de interface.',
              ],
            },
          ],
          code: `import { useState } from 'react';

// Custom Hook para gerenciar campos de input
function useCampo(valorInicial = '') {
  const [valor, setValor] = useState(valorInicial);
  const onChange = e => setValor(e.target.value);
  return { valor, onChange, reset: () => setValor('') };
}

export function FormLogin() {
  const email = useCampo('');
  return (
    <input type="email" value={email.valor} onChange={email.onChange} placeholder="seu@email.com" />
  );
}`,
          output: '[FormLogin]: Input controlado conectado ao hook useCampo com sucesso.',
          lang: 'javascript',
          exercise: {
            id: 'ex-react-iniciante-5',
            prompt: 'Qual é a principal convenção obrigatória para criar um Custom Hook em React?',
            type: 'multiple_choice',
            options: [
              'O nome da função deve começar com o prefixo "use" (ex: useForm)',
              'A função deve herdar de React.Component',
              'Deve retornar obrigatoriamente um elemento JSX',
              'Precisa ser registrado no package.json',
            ],
            correctAnswer: 'O nome da função deve começar com o prefixo "use" (ex: useForm)',
            hint: 'O linter do React usa esse prefixo para aplicar as Regras dos Hooks.',
            explanation: 'O prefixo "use" permite que o linter e o motor do React verifiquem se as regras de hooks (como não chamar hooks dentro de condicionais) estão sendo respeitadas.',
          },
        },
      ],
      intermediario: [
          {
            title: '1. Otimização com useMemo e useCallback',
            desc: 'Evite cálculos caros e recriação desnecessária de funções.',
            theory: [
              {
                title: 'Memoização no React',
                text: 'useMemo memoriza o resultado de uma operação computacional cara. useCallback memoriza a referência de uma função para evitar re-render de componentes filhos encapsulados com React.memo.',
                keyPoints: [
                  'useMemo(() => operacaoPesada(dados), [dados]);',
                  'useCallback((id) => deletarItem(id), [dependencias]);',
                  'React.memo(ComponenteFilho): pula re-renders se as props forem idênticas.',
                ],
              },
            ],
            code: `import { useMemo, useCallback } from 'react';

export function DashboardNumerico({ listaNumeros, onFiltrar }) {
  // Evita re-calcular a soma em renders que não alteram a lista
  const somaTotal = useMemo(() => {
    return listaNumeros.reduce((acc, n) => acc + n, 0);
  }, [listaNumeros]);

  const handleClique = useCallback(() => {
    onFiltrar(somaTotal);
  }, [somaTotal, onFiltrar]);

  return <button onClick={handleClique}>Total: {somaTotal}</button>;
}`,
            output: '[useMemo/useCallback]: Memória otimizada. Total calculado sem re-execução desnecessária.',
            lang: 'javascript',
            exercise: {
              id: 'ex-react-inter-1',
              prompt: 'Qual a diferença fundamental entre useMemo e useCallback?',
              type: 'multiple_choice',
              options: [
                'useMemo memoriza um valor computado; useCallback memoriza a referência de uma função',
                'useMemo só funciona no servidor e useCallback no cliente',
                'useMemo é para requisições HTTP e useCallback para formulários',
                'Não há diferença, são sinônimos',
              ],
              correctAnswer: 'useMemo memoriza um valor computado; useCallback memoriza a referência de uma função',
              hint: 'Pense em "memoizar valor" vs "memoizar callback de função".',
              explanation: 'useMemo retorna o resultado da execução da função passada, enquanto useCallback retorna a própria função sem executá-la imediatamente.',
            },
          },
          {
            title: '2. Gerenciamento Global com Context API e useReducer',
            desc: 'Compartilhe estado através da árvore sem prop drilling.',
            theory: [
              {
                title: 'Context API + Reducer Pattern',
                text: 'A Context API permite fornecer dados para qualquer componente da árvore sem passar props manualmente em cada nível. Combinada com useReducer, fornece uma arquitetura previsível similar ao Redux com dispatch de ações tipadas.',
                keyPoints: [
                  'const TemaContext = createContext();',
                  '<TemaContext.Provider value={{ tema, toggleTema }}>',
                  'const { tema } = useContext(TemaContext);',
                ],
              },
            ],
            code: `import React, { createContext, useContext, useReducer } from 'react';

const AuthContext = createContext();

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN': return { user: action.payload, logado: true };
    case 'LOGOUT': return { user: null, logado: false };
    default: return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, { user: null, logado: false });
  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}`,
            output: '[Context API]: AuthProvider inicializado com sucesso.',
            lang: 'javascript',
            exercise: {
              id: 'ex-react-inter-2',
              prompt: 'Qual é o problema resolvido pela Context API no React?',
              type: 'multiple_choice',
              options: [
                'Prop Drilling (passar props por múltiplos níveis intermediários desnecessariamente)',
                'Erros de sintaxe no JSX',
                'Compilação de código TypeScript',
                'Segurança contra SQL Injection',
              ],
              correctAnswer: 'Prop Drilling (passar props por múltiplos níveis intermediários desnecessariamente)',
              hint: 'Ocorre quando você precisa passar dados de um avô para um bisneto.',
              explanation: 'A Context API elimina o Prop Drilling fornecendo um canal de transmissão direta entre o Provider e qualquer Consumer descendente.',
            },
          },
          {
            title: '3. Gerenciamento com Zustand e React Query / TanStack',
            desc: 'Domine estados locais e cache de dados de servidores modernos.',
            theory: [
              {
                title: 'Estado de Cliente vs Estado de Servidor',
                text: 'Bibliotecas modernas separam estado de cliente (UI, modal aberto, tema) com Zustand ou Redux Toolkit de estado de servidor (cache de API, revalidação, loading, retry) com TanStack Query.',
                keyPoints: [
                  'Zustand: store ultra-leve sem boilerplate e com selectors atômicos.',
                  'TanStack Query: useQuery({ queryKey, queryFn }) com auto-cache e deduplicação.',
                ],
              },
            ],
            code: `// Exemplo Store com Zustand
import { create } from 'zustand';

export const useCartStore = create((set) => ({
  itens: [],
  adicionarItem: (item) => set((state) => ({ itens: [...state.itens, item] })),
  limparCarrinho: () => set({ itens: [] }),
}));`,
            output: '[Zustand]: Store de carrinho criada com actions atômicas.',
            lang: 'javascript',
            exercise: {
              id: 'ex-react-inter-3',
              prompt: 'Por que o TanStack Query (React Query) é preferido para dados de API em vez de useEffect simples?',
              type: 'multiple_choice',
              options: [
                'Ele gerencia cache automático, background refetch, deduplicação e estados de loading/error prontos',
                'Ele substitui o banco de dados SQL',
                'Ele compila o código em C++',
                'Ele impede o usuário de desligar o navegador',
              ],
              correctAnswer: 'Ele gerencia cache automático, background refetch, deduplicação e estados de loading/error prontos',
              hint: 'Pense em todas as rotinas repetitivas de requisições de rede.',
              explanation: 'TanStack Query cuida de stale-while-revalidate, sincronização de abas, retry em caso de falha de rede e paginação de forma declarativa.',
            },
          },
          {
            title: '4. Referências com useRef e Manipulação de DOM',
            desc: 'Acesse nós do DOM diretamente e guarde valores mutáveis sem disparar re-render.',
            theory: [
              {
                title: 'Os dois usos do useRef',
                text: 'useRef retorna um objeto { current: valor }. Alterar .current não dispara re-render. É ideal para armazenar IDs de timers, valores anteriores ou obter referências diretas a inputs para foco/scroll.',
                keyPoints: [
                  'const inputRef = useRef(null); -> <input ref={inputRef} />',
                  'inputRef.current.focus();',
                  'Guardar estado que não precisa aparecer visualmente na interface.',
                ],
              },
            ],
            code: `import { useRef } from 'react';

export function InputComFoco() {
  const inputRef = useRef(null);

  const focarCampo = () => {
    inputRef.current?.focus();
  };

  return (
    <div>
      <input ref={inputRef} type="text" placeholder="Digite seu código" />
      <button onClick={focarCampo}>Focar Input</button>
    </div>
  );
}`,
            output: '[useRef]: Referência de DOM conectada. Foco imperativo acionado.',
            lang: 'javascript',
            exercise: {
              id: 'ex-react-inter-4',
              prompt: 'O que acontece quando você altera a propriedade `.current` de um `useRef`?',
              type: 'multiple_choice',
              options: [
                'O valor é atualizado imediatamente sem causar uma nova renderização do componente',
                'O componente é forçado a recarregar a página',
                'Gera um erro de concorrência',
                'Reseta todos os useState do componente',
              ],
              correctAnswer: 'O valor é atualizado imediatamente sem causar uma nova renderização do componente',
              hint: 'useRef é como uma "caixa" mutável persistente entre renders.',
              explanation: 'Ao contrário do setState, alterar ref.current não agenda nem dispara ciclos de renderização do React.',
            },
          },
          {
            title: '5. Error Boundaries e Tratamento de Erros de UI',
            desc: 'Isole erros de renderização e exiba interfaces de recuperação amigáveis.',
            theory: [
              {
                title: 'Error Boundaries',
                text: 'Error Boundaries são componentes especiais que capturam erros de JavaScript em qualquer lugar de sua árvore de componentes filhos, registram esses erros e mostram uma UI de fallback em vez de quebrar a página inteira.',
                keyPoints: [
                  'Capturam erros durante a renderização, métodos de ciclo de vida e construtores.',
                  'Não capturam erros em event handlers (use try/catch neles).',
                  'Podem ser combinados com react-error-boundary.',
                ],
              },
            ],
            code: `import { Component } from 'react';

export class ErrorBoundary extends Component {
  state = { temErro: false, erroMsg: '' };

  static getDerivedStateFromError(error) {
    return { temErro: true, erroMsg: error.message };
  }

  componentDidCatch(error, info) {
    console.error('Falha capturada:', error, info);
  }

  render() {
    if (this.state.temErro) {
      return <div className="alerta-erro">Algo deu errado: {this.state.erroMsg}</div>;
    }
    return this.props.children;
  }
}`,
            output: '[ErrorBoundary]: Monitorando árvore de componentes contra crashes.',
            lang: 'javascript',
            exercise: {
              id: 'ex-react-inter-5',
              prompt: 'Qual método estático é utilizado em uma classe Error Boundary para atualizar o estado após um erro?',
              type: 'multiple_choice',
              options: [
                'static getDerivedStateFromError(error)',
                'static onComponentCrash()',
                'static handleCatchError()',
                'static resetState()',
              ],
              correctAnswer: 'static getDerivedStateFromError(error)',
              hint: 'É um método do ciclo de vida que retorna o novo objeto de state.',
              explanation: 'getDerivedStateFromError recebe o erro lançado e retorna o novo estado (ex: { hasError: true }) para que a UI de fallback seja renderizada.',
            },
          },
        ],
        avancado: [
          {
            title: '1. React Server Components (RSC) e Streaming',
            desc: 'Execute componentes no servidor sem enviar JavaScript para o bundle do cliente.',
            theory: [
              {
                title: 'A Nova Era: Server vs Client Components',
                text: 'React Server Components (RSC) executam exclusivamente no servidor e enviam JSON estruturado para o cliente com 0kb de bundle JS. Já os Client Components ("use client") cuidam da interatividade, hooks e eventos de navegador.',
                keyPoints: [
                  'Server Components: acesso direto a bancos de dados, chaves de API secretas e arquivos.',
                  'Client Components: marcados com "use client" no topo para usar useState/useEffect.',
                  'Streaming com <Suspense>: renderiza partes da página progressivamente.',
                ],
              },
            ],
            code: `// Server Component (RSC)
import db from '@/lib/db';
import { Suspense } from 'react';

async function ListaUsuarios() {
  const usuarios = await db.query('SELECT id, nome FROM usuarios LIMIT 10');
  return (
    <ul>
      {usuarios.map(u => <li key={u.id}>{u.nome}</li>)}
    </ul>
  );
}

export default function PaginaPainel() {
  return (
    <div>
      <h1>Painel Administrativo</h1>
      <Suspense fallback={<p>Carregando usuários do banco...</p>}>
        <ListaUsuarios />
      </Suspense>
    </div>
  );
}`,
            output: '[RSC]: Componente executado no servidor. 0 bytes de JS de dependências enviados.',
            lang: 'javascript',
            exercise: {
              id: 'ex-react-avanc-1',
              prompt: 'Qual é uma das principais vantagens dos React Server Components (RSC)?',
              type: 'multiple_choice',
              options: [
                'Redução drástica do tamanho do bundle JavaScript do cliente e acesso direto a recursos de backend com segurança',
                'Eliminação de todo o CSS da aplicação',
                'Eles não precisam de servidor para rodar',
                'Fazem o React rodar dentro de microcontroladores Arduino',
              ],
              correctAnswer: 'Redução drástica do tamanho do bundle JavaScript do cliente e acesso direto a recursos de backend com segurança',
              hint: 'Pense em dependências pesadas que não precisam ser baixadas pelo usuário.',
              explanation: 'Como o código do Server Component roda no servidor, suas dependências e dados sensíveis nunca são transmitidos ao navegador, reduzindo o tempo de carregamento inicial (TBT/LCP).',
            },
          },
          {
            title: '2. Concorrência com useTransition e useDeferredValue',
            desc: 'Mantenha a interface responsiva durante atualizações de estado pesadas.',
            theory: [
              {
                title: 'Concorrência no React',
                text: 'O React pode interromper e priorizar atualizações de interface. useTransition marca uma atualização de estado como "não urgente", garantindo que digitações no teclado ou cliques continuem fluidos.',
                keyPoints: [
                  'const [isPending, startTransition] = useTransition();',
                  'startTransition(() => { setFiltroPesquisaPesada(input); });',
                  'useDeferredValue(valor): cria uma versão adiada de um valor para adiar re-renders caros.',
                ],
              },
            ],
            code: `import { useState, useTransition } from 'react';

export function BuscaComTransicao() {
  const [termo, setTermo] = useState('');
  const [resultado, setResultado] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleInput = (e) => {
    // Atualização urgente: reflete a digitação imediatamente no input
    setTermo(e.target.value);

    // Atualização não urgente: processa o filtro pesado sem travar o teclado
    startTransition(() => {
      setResultado(e.target.value);
    });
  };

  return (
    <div>
      <input value={termo} onChange={handleInput} />
      {isPending && <span>Filtrando dados...</span>}
    </div>
  );
}`,
            output: '[useTransition]: UI responsiva a 60 FPS com renderização prioritária.',
            lang: 'javascript',
            exercise: {
              id: 'ex-react-avanc-2',
              prompt: 'Quando você deve usar `useTransition` no React?',
              type: 'multiple_choice',
              options: [
                'Para marcar uma transição de estado como não-urgente, evitando que operações lentas travem o input do usuário',
                'Para fazer transições CSS em 3D',
                'Para mudar de rota no React Router',
                'Para criptografar senhas no cliente',
              ],
              correctAnswer: 'Para marcar uma transição de estado como não-urgente, evitando que operações lentas travem o input do usuário',
              hint: 'Permite que atualizações prioritárias (como digitar em um input) passem na frente.',
              explanation: 'useTransition permite ao motor do React manter o thread principal responsivo para eventos críticos enquanto processa renderizações pesadas em background.',
            },
          },
          {
            title: '3. Testes Automatizados com Vitest & React Testing Library',
            desc: 'Escreva testes comportamentais confiáveis baseados na perspectiva do usuário.',
            theory: [
              {
                title: 'Filosofia da React Testing Library',
                text: '"Quanto mais seus testes se assemelharem à forma como seu software é usado, mais confiança eles podem lhe dar." Teste comportamento (cliques, textos acessíveis, formulários) e não detalhes de implementação interna.',
                keyPoints: [
                  'Queries acessíveis: screen.getByRole("button", { name: /enviar/i }), getByLabelText.',
                  'userEvent.click(botao) para simular interação real.',
                  'Mock de APIs com MSW (Mock Service Worker).',
                ],
              },
            ],
            code: `import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Contador } from './Contador';
import { test, expect } from 'vitest';

test('incrementa o contador ao clicar no botão', async () => {
  render(<Contador />);
  const botao = screen.getByRole('button', { name: /incrementar/i });
  
  await userEvent.click(botao);
  
  expect(screen.getByText(/total: 1/i)).toBeInTheDocument();
});`,
            output: 'PASS src/Contador.test.tsx (1 test passed, 100% assertions)',
            lang: 'javascript',
            exercise: {
              id: 'ex-react-avanc-3',
              prompt: 'Qual das seguintes queries é a mais recomendada pela React Testing Library por promover acessibilidade?',
              type: 'multiple_choice',
              options: [
                'getByRole (ex: screen.getByRole("button", { name: "Salvar" }))',
                'getByTestId',
                'container.querySelector(".btn-classe")',
                'getByClassName',
              ],
              correctAnswer: 'getByRole (ex: screen.getByRole("button", { name: "Salvar" }))',
              hint: 'Reflete como leitores de tela e usuários reais encontram os elementos.',
              explanation: 'getByRole busca elementos por suas roles semânticas e acessíveis (ARIA), garantindo que a aplicação funcione tanto para usuários comuns quanto com tecnologias assistivas.',
            },
          },
          {
            title: '4. Profiling, Memoization e Web Vitals (INP/LCP)',
            desc: 'Analise re-renderizações com o React DevTools Profiler e reduza o INP.',
            theory: [
              {
                title: 'Diagnosticando Gargalos de Render',
                text: 'O React Profiler mede o custo de renderização de cada componente. Foque em diminuir o Interaction to Next Paint (INP) quebrando componentes gigantes em partes isoladas com estados atômicos.',
                keyPoints: [
                  'Identifique re-renders em cascata.',
                  'Evite passar objetos ou arrays anônimos inline em props de filhos pesados.',
                  'Virtualização de listas longas com @tanstack/react-virtual.',
                ],
              },
            ],
            code: `// Virtualização para listas com 10.000+ itens
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

export function ListaGigante({ itens }) {
  const parentRef = useRef(null);
  const rowVirtualizer = useVirtualizer({
    count: itens.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
  });

  return (
    <div ref={parentRef} style={{ height: '400px', overflow: 'auto' }}>
      <div style={{ height: \`\${rowVirtualizer.getTotalSize()}px\`, position: 'relative' }}>
        {rowVirtualizer.getVirtualItems().map((virtualRow) => (
          <div key={virtualRow.index} style={{ position: 'absolute', top: 0, transform: \`translateY(\${virtualRow.start}px)\` }}>
            {itens[virtualRow.index].nome}
          </div>
        ))}
      </div>
    </div>
  );
}`,
            output: '[Profiler]: 10.000 itens renderizados virtualmente mantendo 15 nós de DOM ativos.',
            lang: 'javascript',
            exercise: {
              id: 'ex-react-avanc-4',
              prompt: 'O que a técnica de "Virtualização de Listas" (Windowing) faz para melhorar a performance de telas com milhares de registros?',
              type: 'multiple_choice',
              options: [
                'Renderiza no DOM apenas os itens que estão visíveis na área de scroll do viewport atual',
                'Transforma a lista em uma imagem estática PNG',
                'Salva a lista no servidor antes de renderizar',
                'Desativa o CSS para os itens da lista',
              ],
              correctAnswer: 'Renderiza no DOM apenas os itens que estão visíveis na área de scroll do viewport atual',
              hint: 'Apenas uma fração dos elementos existe fisicamente no DOM a cada momento.',
              explanation: 'A virtualização renderiza apenas os 10-20 itens que cabem na tela visível, reciclando os nós do DOM no scroll e impedindo que milhares de nós travem a memória do navegador.',
            },
          },
          {
            title: '5. Arquitetura de Design System e Componentes Headless',
            desc: 'Crie componentes acessíveis com Radix UI / Headless UI e Tailwind CSS.',
            theory: [
              {
                title: 'Componentes Headless & Composição',
                text: 'Componentes headless fornecem toda a lógica de acessibilidade (ARIA, foco, navegação por teclado) sem impor estilos CSS. Isso permite estilizar livremente com Tailwind CSS via padrão de composição Slot (ex: asChild).',
                keyPoints: [
                  'Separação de Acessibilidade (Radix UI) e Estilização (Tailwind / CSS Modules).',
                  'Composição flexível via Compound Components (<Dialog.Root>, <Dialog.Trigger>, <Dialog.Content>).',
                  'Utilitário cn() com clsx e tailwind-merge para mesclar classes sem conflitos.',
                ],
              },
            ],
            code: `import * as Dialog from '@radix-ui/react-dialog';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function ModalConfirmacao({ aberto, onFechar, onConfirmar }) {
  return (
    <Dialog.Root open={aberto} onOpenChange={onFechar}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
          <Dialog.Title className="text-lg font-bold text-white">Confirmar Ação</Dialog.Title>
          <Dialog.Description className="text-sm text-zinc-400 mt-2">Deseja prosseguir?</Dialog.Description>
          <button onClick={onConfirmar} className="mt-4 px-4 py-2 bg-orange-500 rounded-lg font-bold">Confirmar</button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}`,
            output: '[Design System]: Modal acessível com gerenciamento de foco e navegação via ESC.',
            lang: 'javascript',
            exercise: {
              id: 'ex-react-avanc-5',
              prompt: 'Qual a principal vantagem de usar bibliotecas de componentes "Headless" (como Radix UI ou Headless UI)?',
              type: 'multiple_choice',
              options: [
                'Elas garantem conformidade total com padrões de acessibilidade (WAI-ARIA) e teclado sem bloquear a customização visual',
                'Elas não utilizam JavaScript',
                'Elas não precisam de React para funcionar',
                'Elas aumentam o tamanho do arquivo final',
              ],
              correctAnswer: 'Elas garantem conformidade total com padrões de acessibilidade (WAI-ARIA) e teclado sem bloquear a customização visual',
              hint: 'Pense em acessibilidade pronta + liberdade total de CSS.',
              explanation: 'Componentes headless entregam as regras de acessibilidade e gerenciamento de foco, permitindo que a equipe aplique o design system da empresa com total liberdade.',
            },
          },
        ],
        projetos: [
          {
            title: '1. Projeto: Dashboard Analítico em Tempo Real',
            desc: 'Desenvolva um painel completo com gráficos interativos, filtros por data e websocket.',
            theory: [
              {
                title: 'Arquitetura de Dashboards',
                text: 'Integre bibliotecas de visualização como Recharts, gerenciamento de estado com Zustand e streaming de dados com WebSocket para exibir métricas com alto desempenho.',
                keyPoints: ['Layout responsivo em grid com Tailwind', 'Atualização em tempo real de KPIs'],
              },
            ],
            code: `// Dashboard de métricas financeiras
export function KpiCard({ titulo, valor, variacao, positivo }) {
  return (
    <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-md">
      <span className="text-xs uppercase text-zinc-400 font-bold">{titulo}</span>
      <div className="text-2xl font-black text-white mt-1">{valor}</div>
      <span className={positivo ? 'text-emerald-400 text-xs' : 'text-red-400 text-xs'}>
        {variacao} vs mês anterior
      </span>
    </div>
  );
}`,
            output: '[Projeto]: Dashboard montado com 4 KPIs e gráficos de linha em tempo real.',
            lang: 'javascript',
            exercise: {
              id: 'ex-react-proj-1',
              prompt: 'Qual hook do React é ideal para conectar e escutar mensagens de um WebSocket ao montar o dashboard?',
              type: 'multiple_choice',
              options: [
                'useEffect com função de cleanup para chamar socket.close()',
                'useLayoutEffect sem dependências',
                'useMemo',
                'useId',
              ],
              correctAnswer: 'useEffect com função de cleanup para chamar socket.close()',
              hint: 'Efeito colateral que precisa ser desconectado ao sair da tela.',
              explanation: 'useEffect permite inicializar a conexão no mount e desconectar com socket.close() no retorno de limpeza, prevenindo conexões zumbis.',
            },
          },
          {
            title: '2. Projeto: E-Commerce Completo com Carrinho Persistente',
            desc: 'Monte uma loja virtual com catálogo, busca com debounce, carrinho e checkout.',
            theory: [
              {
                title: 'Fluxo de E-commerce',
                text: 'Crie uma experiência fluida com persistência no LocalStorage, cálculo de frete e validação de formulários com Zod e React Hook Form.',
                keyPoints: ['Debounce de busca', 'Persistência de carrinho', 'Validação de checkout com Zod'],
              },
            ],
            code: `import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useLojaStore = create(
  persist(
    (set, get) => ({
      carrinho: [],
      adicionar: (prod) => set({ carrinho: [...get().carrinho, prod] }),
      remover: (id) => set({ carrinho: get().carrinho.filter(p => p.id !== id) }),
      total: () => get().carrinho.reduce((acc, p) => acc + p.preco, 0),
    }),
    { name: 'loja-carrinho-storage' }
  )
);`,
            output: '[Projeto]: Loja virtual com persistência de carrinho em LocalStorage ativa.',
            lang: 'javascript',
            exercise: {
              id: 'ex-react-proj-2',
              prompt: 'Por que o debounce é essencial na barra de busca de produtos de um e-commerce?',
              type: 'multiple_choice',
              options: [
                'Ele atrasa a requisição até que o usuário pare de digitar por alguns milissegundos, evitando centenas de chamadas desnecessárias à API',
                'Ele limpa o carrinho de compras',
                'Ele traduz a busca para inglês',
                'Ele impede o uso de caracteres especiais',
              ],
              correctAnswer: 'Ele atrasa a requisição até que o usuário pare de digitar por alguns milissegundos, evitando centenas de chamadas desnecessárias à API',
              hint: 'Evita disparar 1 requisição para cada letra digitada.',
              explanation: 'O debounce aguarda uma pausa (ex: 300ms) na digitação antes de disparar o filtro, economizando banda e processamento do servidor.',
            },
          },
          {
            title: '3. Projeto: Clone do Trello / Kanban Drag-and-Drop',
            desc: 'Implemente um quadro Kanban interativo com @hello-pangea/dnd e reordenação.',
            theory: [
              {
                title: 'Drag and Drop em React',
                text: 'Gerencie colunas, cartões arrastáveis e sincronização com backend em tempo real utilizando identificadores únicos de posição.',
                keyPoints: ['Colunas dinâmicas', 'Feedback visual de arraste', 'Persistência de posições'],
              },
            ],
            code: `// Estrutura de reordenação de colunas
export function reordenarLista(lista, indiceOrigem, indiceDestino) {
  const resultado = Array.from(lista);
  const [removido] = resultado.splice(indiceOrigem, 1);
  resultado.splice(indiceDestino, 0, removido);
  return resultado;
}`,
            output: '[Projeto]: Quadro Kanban com colunas A Fazer, Em Progresso e Concluído pronto.',
            lang: 'javascript',
            exercise: {
              id: 'ex-react-proj-3',
              prompt: 'Em um sistema Kanban com Drag-and-Drop, o que é fundamental para evitar bugs visuais durante o arraste de cards?',
              type: 'multiple_choice',
              options: [
                'Cada item arrastável deve possuir um ID único e imutável passado para a prop key e draggableId',
                'Usar apenas elementos <table>',
                'Desativar o JavaScript no navegador',
                'Usar imagens estáticas',
              ],
              correctAnswer: 'Cada item arrastável deve possuir um ID único e imutável passado para a prop key e draggableId',
              hint: 'O motor de física do dnd precisa saber a identidade exata do nó.',
              explanation: 'Identificadores únicos garantem que a biblioteca de DnD calcule as posições de transformação CSS corretas durante a movimentação.',
            },
          },
          {
            title: '4. Projeto: Plataforma SaaS com Autenticação e Multi-Tenancy',
            desc: 'Construa uma aplicação SaaS com rotas protegidas, permissões de usuário e temas.',
            theory: [
              {
                title: 'Estrutura de Aplicações Corporativas',
                text: 'Estruture guards de rotas, interceptores HTTP com Axios/Fetch para refresh de JWT token automático e controle de acesso baseado em papéis (RBAC).',
                keyPoints: ['Rotas protegidas com ProtectedRoute', 'Refresh token automático', 'RBAC (Admin, Membro, Convidado)'],
              },
            ],
            code: `// Route Guard em React
import { Navigate, Outlet } from 'react-router-dom';

export function RotaProtegida({ estaAutenticado, roleUsuario, roleObrigatoria }) {
  if (!estaAutenticado) return <Navigate to="/login" replace />;
  if (roleObrigatoria && roleUsuario !== roleObrigatoria) return <Navigate to="/sem-permissao" replace />;
  
  return <Outlet />;
}`,
            output: '[Projeto]: Guard de rotas RBAC configurado com redirecionamento de segurança.',
            lang: 'javascript',
            exercise: {
              id: 'ex-react-proj-4',
              prompt: 'Qual a função do atributo `replace` no componente `<Navigate to="/login" replace />`?',
              type: 'multiple_choice',
              options: [
                'Substitui a entrada atual no histórico de navegação, impedindo o usuário de voltar para a página restrita clicando no botão "Voltar"',
                'Recarrega a página do zero',
                'Apaga os cookies do navegador',
                'Substitui o código-fonte da página',
              ],
              correctAnswer: 'Substitui a entrada atual no histórico de navegação, impedindo o usuário de voltar para a página restrita clicando no botão "Voltar"',
              hint: 'Evita loops de redirecionamento no botão "Voltar" do navegador.',
              explanation: 'Usar `replace` substitui o item atual no histórico do navegador em vez de empilhar um novo, prevenindo que o usuário volte para a rota protegida.',
            },
          },
          {
            title: '5. Projeto Final: Aplicativo Web PWA Offline-First',
            desc: 'Transforme o app React em um PWA instalável com Service Worker e cache inteligente.',
            theory: [
              {
                title: 'Offline-First com Workbox e IndexedDB',
                text: 'Crie uma experiência mobile de primeira classe com manifest.json, suporte a instalação na tela inicial e sincronização em segundo plano via Background Sync API.',
                keyPoints: ['Service Workers com Workbox', 'Armazenamento estruturado no IndexedDB', 'Badge de status offline'],
              },
            ],
            code: `// Registro de Service Worker para PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(reg => {
      console.log('PWA Service Worker registrado com escopo:', reg.scope);
    });
  });
}`,
            output: '[Projeto]: PWA registrado. App pronto para instalação e cache offline.',
            lang: 'javascript',
            exercise: {
              id: 'ex-react-proj-5',
              prompt: 'Qual arquivo de configuração é obrigatório para permitir que uma aplicação web seja instalável como PWA em smartphones?',
              type: 'multiple_choice',
              options: [
                'manifest.json (Web App Manifest)',
                'package.json',
                'tsconfig.json',
                '.gitignore',
              ],
              correctAnswer: 'manifest.json (Web App Manifest)',
              hint: 'Define o nome, ícones, cores de tema e modo de exibição do aplicativo.',
              explanation: 'O manifest.json fornece metadados fundamentais (nome, ícones de diferentes resoluções, display: standalone, theme_color) que os navegadores exigem para habilitar a instalação.',
            },
          },
        ],
      },
      quizzesByLevel: {
        iniciante: [
          {
            id: 'rq-ini-1',
            question: 'O que o React faz durante a fase de "Reconciliation"?',
            options: [
              'Compara a árvore do Virtual DOM anterior com a nova para aplicar apenas as alterações necessárias no DOM real',
              'Traduz JavaScript para Python',
              'Executa consultas SQL no banco de dados',
              'Cria um novo arquivo HTML no disco',
            ],
            correctIndex: 0,
            explanation: 'O algoritmo de Reconciliação (Diffing) compara o Virtual DOM antigo e o novo para minimizar atualizações lentas no DOM real.',
          },
          {
            id: 'rq-ini-2',
            question: 'Qual é a regra fundamental dos Hooks no React?',
            options: [
              'Devem ser chamados apenas no nível superior do componente (nunca dentro de loops, condições ou funções aninhadas)',
              'Devem ser chamados apenas dentro de tags <style>',
              'Podem ser chamados em qualquer arquivo de texto',
              'Devem ser declarados no final do componente',
            ],
            correctIndex: 0,
            explanation: 'Chamar hooks no nível superior garante que o React preserve a ordem exata de execução dos estados em todas as renderizações.',
          },
        ],
        intermediario: [
          {
            id: 'rq-int-1',
            question: 'Como você evita re-renderizações desnecessárias em um componente filho estático?',
            options: [
              'Envolvendo o componente filho com React.memo e garantindo que funções passadas como props usem useCallback',
              'Colocando todo o código dentro de um laço while',
              'Chamando useState dentro de um if',
              'Usando apenas variáveis globais',
            ],
            correctIndex: 0,
            explanation: 'React.memo memoriza o componente e pula a renderização caso as props não tenham sofrido alteração por igualdade rasa.',
          },
        ],
        avancado: [
          {
            id: 'rq-av-1',
            question: 'Qual é a principal diferença entre Server Components e Client Components no modelo moderno do React?',
            options: [
              'Server Components rodam apenas no servidor e não adicionam peso ao bundle JS do cliente; Client Components suportam interatividade, hooks e eventos',
              'Server Components não podem usar banco de dados',
              'Client Components não podem usar CSS',
              'Não há diferença técnica',
            ],
            correctIndex: 0,
            explanation: 'Server Components executam no servidor para ler dados diretamente sem expor segredos ou inflar o bundle JS enviado para o navegador.',
          },
        ],
        projetos: [
          {
            id: 'rq-prj-1',
            question: 'Qual estratégia de cache de Service Worker é ideal para recursos estáticos (CSS, JS, Imagens) em um app React PWA?',
            options: [
              'Cache First (Cache falling back to network)',
              'Network Only',
              'No-Store',
              'Delete Cache on Request',
            ],
            correctIndex: 0,
            explanation: 'Para assets com hashes no nome gerados pelo build, a estratégia Cache First entrega velocidade instantânea consumindo direto do cache.',
          },
        ],
      },
    },
};
