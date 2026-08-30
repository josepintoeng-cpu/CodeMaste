import { Lesson, TechId } from '../types';

/**
 * Aulas Inaugurais de Introdução e Primeiros Contactos
 * Projetadas para oferecer uma experiência pedagógica imersiva, moderna e muito superior
 * ao ensino tradicional de escolas de tecnologia.
 */
export const FIRST_CONTACT_LESSONS: Record<TechId, Omit<Lesson, 'id' | 'techId' | 'levelId' | 'order'>> = {
  // ==========================================
  // 1. PYTHON
  // ==========================================
  python: {
    title: '1. Introdução & Primeiros Contactos: A Filosofia e Seu Primeiro Script Python',
    description: 'Descubra a elegância do Python, por que ele lidera IA e Engenharia de Dados, e execute seu primeiro código dinâmico com o Zen do Python.',
    estimatedMinutes: 12,
    xpReward: 35,
    theory: [
      {
        title: 'O Que Torna o Python Tão Poderoso?',
        text: 'Python foi criado por Guido van Rossum com um objetivo radical: colocar a legibilidade do código humano em primeiro lugar. Diferente de linguagens cheias de chaves {} e ponto-e-vírgula ;, Python utiliza indentação obrigatória (espaços) para definir blocos. Isso força todo código a ser limpo e compreensível por qualquer desenvolvedor.',
        keyPoints: [
          'Linguagem interpretada de alto nível: seu código é lido e executado linha por linha pelo interpretador Python.',
          'Tipagem dinâmica e forte: variáveis recebem tipos automaticamente, mas tipos incompatíveis não são misturados sem conversão explícita.',
          'Líder absoluta em Inteligência Artificial, Machine Learning, Automação e Backend moderno.',
        ],
        conceptCard: '🐍 Regra de Ouro (Zen do Python): "Simples é melhor que complexo. Legibilidade conta."',
      },
      {
        title: 'Como o Interpretador Funciona por Baixo dos Panos',
        text: 'Quando você executa um script Python (.py), ele é compilado na memória para "Bytecode" (.pyc) e interpretado pela CPython Virtual Machine. Isso combina a velocidade de desenvolvimento rápido com a portabilidade entre Windows, Mac e Linux sem recompilar.',
        keyPoints: [
          'A função print() envia dados para a saída padrão (stdout / console).',
          'Variáveis são criadas no momento da atribuição (ex: nome = "Dev").',
          'F-Strings (f"Texto {variavel}") permitem interpolação de variáveis com extrema clareza e performance.',
        ],
      },
      {
        title: 'O Segredo da Indústria vs O Erro das Escolas Tradicionais',
        text: 'Escolas tradicionais perdem tempo decorando sintaxes obsoletas. Na indústria moderna, você aprende a pensar em dados e transformações: receber uma entrada, processar com funções limpas e produzir resultados úteis com o ecossistema.',
      },
    ],
    codeExample: {
      language: 'python',
      code: `# Bem-vindo ao Python 3!
# Seu primeiro contato prático com tipagem e f-strings

nome_estudante = "Dev Criativo"
curso = "Engenharia de Software com Python"
tecnologias_alvo = ["IA", "FastAPI", "Automação"]

print("========================================")
print(f"🚀 Boas-vindas, {nome_estudante}!")
print(f"📚 Curso: {curso}")
print(f"🎯 Foco de Carreira: {', '.join(tecnologias_alvo)}")
print("========================================")
print("Status: Ambiente Python pronto para execução!")`,
      explanation: 'Utilizamos variáveis, listas e f-strings para imprimir uma mensagem personalizada formatada na tela.',
    },
    simulation: {
      type: 'real_pyodide',
      defaultOutput: `========================================
🚀 Boas-vindas, Dev Criativo!
📚 Curso: Engenharia de Software com Python
🎯 Foco de Carreira: IA, FastAPI, Automação
========================================
Status: Ambiente Python pronto para execução!`,
      description: 'Ambiente interativo Python 3 rodando via Pyodide WebAssembly no navegador.',
    },
    exercise: {
      id: 'ex-first-contact-python',
      prompt: 'No Python moderno, qual é a forma recomendada e mais performática de interpolar variáveis dentro de uma string de texto?',
      type: 'multiple_choice',
      options: [
        'Utilizar f-strings prefixando a string com "f" e inserindo variáveis entre chaves {variavel}',
        'Concatenar tudo com o operador + sem converter tipos numéricos',
        'Usar tags HTML dentro do arquivo .py',
        'Escrever comandos em caixa alta sem aspas',
      ],
      correctAnswer: 'Utilizar f-strings prefixando a string com "f" e inserindo variáveis entre chaves {variavel}',
      hint: 'Pense no prefixo f"Texto {nome}" introduzido no Python 3.6+.',
      explanation: 'As f-strings são a forma padrão e mais limpa de formatar textos no Python 3, combinando velocidade de execução e legibilidade impecável.',
    },
  },

  // ==========================================
  // 2. JAVASCRIPT
  // ==========================================
  javascript: {
    title: '1. Introdução & Primeiros Contactos: A Linguagem da Web e o Motor V8',
    description: 'Compreenda a essência da linguagem que move 99% da web, o Event Loop e execute seu primeiro script moderno com ES6+.',
    estimatedMinutes: 12,
    xpReward: 35,
    theory: [
      {
        title: 'Por Que o JavaScript Conquistou o Mundo?',
        text: 'Criado em apenas 10 dias em 1995 por Brendan Eich, o JavaScript evoluiu de um simples script para navegadores para se tornar a linguagem mais versátil do planeta. Hoje roda no navegador, no servidor (Node.js/Bun), em apps mobile (React Native) e até em robótica.',
        keyPoints: [
          'Linguagem interpretada com compilação JIT (Just-In-Time) ultrarrápida através de motores como o V8 do Chrome.',
          'Baseada no paradigma orientado a eventos (Event-Driven) e não-bloqueante.',
          'Ecossistema gigantesco via NPM (o maior repositório de pacotes de software do mundo).',
        ],
        conceptCard: '⚡ Modelo Mental: O navegador lê HTML para estrutura, CSS para aparência e JavaScript para o cérebro/comportamento dinâmico.',
      },
      {
        title: 'Declaração Moderna: const vs let',
        text: 'Esqueça o antigo "var" ensinado em cursos desatualizados. No JavaScript moderno (ES6+), usamos "const" para valores que não mudam de referência e "let" para variáveis mutáveis com escopo de bloco seguro.',
        keyPoints: [
          'const: garante imutabilidade da referência e evita substituições acidentais.',
          'let: permite reatribuição controlada dentro do bloco {}.',
          'console.log(): instrução fundamental para depuração e inspeção de dados.',
        ],
      },
    ],
    codeExample: {
      language: 'javascript',
      code: `// Primeiro contato com JavaScript Moderno (ES6+)
const plataforma = "Dev Academy";
const desenvolvedor = {
  nome: "Novo Desenvolvedor",
  nivel: "Iniciante Promissor",
  linguagens: ["JavaScript", "TypeScript", "Node.js"]
};

function gerarBoasVindas(user) {
  return \`Olá \${user.nome}! Seja bem-vindo à \${plataforma}. Você dominará: \${user.linguagens.join(', ')}.\`;
}

console.log("=== INICIALIZAÇÃO DO RUNTIME JS ===");
console.log(gerarBoasVindas(desenvolvedor));
console.log("Status: Script executado com sucesso no motor JS!");`,
      explanation: 'Declaração de constantes, objeto estruturado, template literals e função de formatação.',
    },
    simulation: {
      type: 'real_js',
      defaultOutput: `=== INICIALIZAÇÃO DO RUNTIME JS ===\nOlá Novo Desenvolvedor! Seja bem-vindo à Dev Academy. Você dominará: JavaScript, TypeScript, Node.js.\nStatus: Script executado com sucesso no motor JS!`,
      description: 'Execução de JavaScript em tempo real no console.',
    },
    exercise: {
      id: 'ex-first-contact-javascript',
      prompt: 'Qual a diferença crucial entre declarar uma variável com "const" e com "let" no JavaScript moderno?',
      type: 'multiple_choice',
      options: [
        '"const" impede a reatribuição de nova referência, enquanto "let" permite reatribuição com escopo de bloco',
        '"const" só funciona para números e "let" só funciona para texto',
        '"let" torna o código global e perigoso',
        'Não há nenhuma diferença prática entre eles',
      ],
      correctAnswer: '"const" impede a reatribuição de nova referência, enquanto "let" permite reatribuição com escopo de bloco',
      hint: 'Lembre-se da palavra Constant (const).',
      explanation: 'No padrão moderno ES6+, "const" protege seu código contra reatribuições acidentais, enquanto "let" é usado quando o valor precisa mudar intencionalmente.',
    },
  },

  // ==========================================
  // 3. TYPESCRIPT
  // ==========================================
  typescript: {
    title: '1. Introdução & Primeiros Contactos: A Revolução dos Tipos Estáticos',
    description: 'Entenda por que o TypeScript se tornou o padrão absoluto da indústria para aplicações profissionais e crie seu primeiro contrato tipado.',
    estimatedMinutes: 12,
    xpReward: 35,
    theory: [
      {
        title: 'O Que é o TypeScript e Por Que Ele Domina o Mercado?',
        text: 'TypeScript é um superset tipado do JavaScript criado pela Microsoft (liderado por Anders Hejlsberg). Ele adiciona tipos estáticos em tempo de desenvolvimento. Antes de você rodar o código, o compilador (tsc) detecta 90% dos bugs comuns de digitação e tipos errados que quebravam aplicações em produção.',
        keyPoints: [
          'Tipagem estática opcional e gradual: você define contratos claros para funções e objetos.',
          'Compilação limpa para JavaScript puro que roda em qualquer navegador ou servidor.',
          'IntelliSense e autocompletion espetacular no seu editor de código.',
        ],
        conceptCard: '🛡️ Princípio: "Erros detectados em tempo de compilação poupam horas de depuração em produção."',
      },
      {
        title: 'Interfaces e Tipos: Definindo a Estrutura dos Seus Dados',
        text: 'Com a palavra-chave "interface" ou "type", você descreve a anatomia exata que um objeto deve possuir. Se alguém tentar passar dados faltando campos obrigatórios ou com tipos errados, o TypeScript alerta imediatamente.',
      },
    ],
    codeExample: {
      language: 'typescript',
      code: `// Primeiro contato com TypeScript: Definindo um Contrato Seguro
interface UsuarioDev {
  id: number;
  nome: string;
  stack: string[];
  ativo: boolean;
}

function inicializarPerfil(usuario: UsuarioDev): string {
  return \`Dev #\${usuario.id}: \${usuario.nome} (Stack: \${usuario.stack.join(', ')}) - Status: \${usuario.ativo ? 'Pronto para Codar' : 'Offline'}\`;
}

const novoDev: UsuarioDev = {
  id: 101,
  nome: "Ana Engenheira",
  stack: ["TypeScript", "React", "Next.js"],
  ativo: true
};

console.log("=== TYPESCRIPT TYPE-CHECK PASSED ===");
console.log(inicializarPerfil(novoDev));`,
      explanation: 'Definição de uma interface com propriedades tipadas e validação na assinatura da função.',
    },
    simulation: {
      type: 'simulated',
      defaultOutput: `=== TYPESCRIPT TYPE-CHECK PASSED ===\nDev #101: Ana Engenheira (Stack: TypeScript, React, Next.js) - Status: Pronto para Codar`,
      description: 'Validação e execução do compilador TypeScript.',
    },
    exercise: {
      id: 'ex-first-contact-typescript',
      prompt: 'Qual é o principal benefício de utilizar TypeScript em relação ao JavaScript puro em equipes e projetos reais?',
      type: 'multiple_choice',
      options: [
        'Detecção antecipada de bugs de tipo em tempo de desenvolvimento e autocompletion confiável',
        'Fazer a internet carregar mais rápida sem usar conexão de rede',
        'Excluir a necessidade de testes ou navegadores',
        'Impedir o uso de funções ou variáveis',
      ],
      correctAnswer: 'Detecção antecipada de bugs de tipo em tempo de desenvolvimento e autocompletion confiável',
      hint: 'Pense na segurança de tipos e na assistência do editor.',
      explanation: 'O TypeScript previne falhas de tempo de execução como "TypeError: cannot read property of undefined" antes mesmo de enviar o código para produção.',
    },
  },

  // ==========================================
  // 4. REACT
  // ==========================================
  react: {
    title: '1. Introdução & Primeiros Contactos: O Paradigma dos Componentes Reativos',
    description: 'Aprenda o modelo mental declarativo do React, o Virtual DOM e construa seu primeiro componente com JSX e Estado.',
    estimatedMinutes: 14,
    xpReward: 35,
    theory: [
      {
        title: 'A Grande Mudança: Do Imperativo para o Declarativo',
        text: 'No desenvolvimento antigo, você tinha que buscar elementos manualmente no DOM com document.getElementById() e alterar textos um a um. No React (criado pela Meta), você simplesmente declara como a tela deve parecer para um dado "Estado". Quando o estado muda, o React atualiza a interface automaticamente.',
        keyPoints: [
          'Componentes: blocos de construção reutilizáveis e independentes (funções que retornam JSX).',
          'JSX: sintaxe elegante que combina HTML e JavaScript de forma natural.',
          'Virtual DOM & Reconciliation: o React compara a árvore virtual e altera apenas os pixels estritamente necessários no navegador.',
        ],
        conceptCard: '⚛️ Fórmula do React: UI = f(state) — A Interface é uma função direta do Estado da aplicação.',
      },
      {
        title: 'Anatomia de um Componente Funcional',
        text: 'Um componente React moderno é uma função JavaScript pura que recebe propriedades (props) e retorna elementos JSX. O nome do componente sempre deve começar com letra maiúscula (ex: CartaoBoasVindas).',
      },
    ],
    codeExample: {
      language: 'javascript',
      code: `// Primeiro Componente React com JSX Declarativo
function CardApresentacao({ tecnologia, criador, anoLancamento }) {
  return (
    <div className="card-react-inaugural">
      <h2>🚀 Bem-vindo ao Universo {tecnologia}!</h2>
      <p>Criado originalmente pela equipe da <strong>{criador}</strong> em {anoLancamento}.</p>
      <div className="badge-status">
        <span>Status: Componente Renderizado com Sucesso ⚛️</span>
      </div>
    </div>
  );
}

// Renderização conceitual da árvore
console.log("React Element Criado:", CardApresentacao({
  tecnologia: "React 19",
  criador: "Meta",
  anoLancamento: 2013
}));`,
      explanation: 'Declaração de um componente funcional que recebe props desestruturadas e retorna uma árvore JSX estruturada.',
    },
    simulation: {
      type: 'simulated',
      defaultOutput: `React Element Criado: { type: 'div', props: { className: 'card-react-inaugural', children: [...] } }\nRenderização concluída na árvore Virtual DOM!`,
      description: 'Renderizador de Virtual DOM do React.',
    },
    exercise: {
      id: 'ex-first-contact-react',
      prompt: 'Por que todo componente funcional customizado no React deve ter seu nome iniciado com letra MAIÚSCULA (ex: MeuComponente)?',
      type: 'multiple_choice',
      options: [
        'Para que o parser JSX diferencie tags HTML nativas (div, span) de componentes customizados do desenvolvedor',
        'Porque o JavaScript proíbe funções em letras minúsculas',
        'Para deixar o código mais pesado no navegador',
        'Não há motivo, é apenas uma escolha estética opcional',
      ],
      correctAnswer: 'Para que o parser JSX diferencie tags HTML nativas (div, span) de componentes customizados do desenvolvedor',
      hint: 'Pense em como o compilador diferencia <div> de <MeuBotao>.',
      explanation: 'O compilador JSX trata identificadores com inicial minúscula como tags padrão do HTML/DOM e inicial maiúscula como componentes React.',
    },
  },

  // ==========================================
  // 5. NEXT.JS
  // ==========================================
  nextjs: {
    title: '1. Introdução & Primeiros Contactos: A Era Fullstack e o App Router',
    description: 'Compreenda a evolução de SPAs para Server Components, renderização híbrida (SSR/SSG) e crie sua primeira rota moderna no Next.js.',
    estimatedMinutes: 14,
    xpReward: 35,
    theory: [
      {
        title: 'Por Que o Next.js Redefiniu o Ecossistema React?',
        text: 'Tradicionais SPAs React enviam um arquivo HTML quase vazio e toneladas de JavaScript para o navegador do usuário, prejudicando o tempo de carregamento e o SEO. O Next.js (da Vercel) executa componentes no servidor, enviando HTML pronto e hiper-otimizado instantaneamente.',
        keyPoints: [
          'App Router baseado em sistema de pastas (app/page.tsx, app/layout.tsx).',
          'React Server Components (RSC) por padrão: busca dados no banco de dados direto no servidor sem expor chaves.',
          'Otimização automática de imagens, fontes e rotas dinâmicas.',
        ],
        conceptCard: '⚡ Mentalidade Fullstack: Menos JavaScript baixado no cliente, máxima velocidade de renderização e SEO perfeito.',
      },
    ],
    codeExample: {
      language: 'typescript',
      code: `// app/page.tsx - Primeiro Server Component no Next.js App Router
export default async function HomePage() {
  const infoServidor = {
    horario: new Date().toLocaleTimeString('pt-BR'),
    regiao: "Edge Server (São Paulo)",
    status: "Renderizado no Servidor com Zero Bundle Client-Side"
  };

  return (
    <main className="min-h-screen p-8 bg-slate-950 text-white">
      <h1 className="text-3xl font-black text-orange-400">Next.js App Router 🚀</h1>
      <p className="mt-2 text-slate-300">Página inicial gerada com React Server Components.</p>
      
      <div className="mt-6 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <p>🕒 Gerado em: {infoServidor.horario}</p>
        <p>🌐 Localidade: {infoServidor.regiao}</p>
        <p className="text-emerald-400 font-bold mt-2">✓ {infoServidor.status}</p>
      </div>
    </main>
  );
}`,
      explanation: 'Um Server Component assíncrono que renderiza HTML puro no servidor sem custo de JavaScript no navegador.',
    },
    simulation: {
      type: 'simulated',
      defaultOutput: `[Next.js App Router] GET / -> HTTP 200 OK (Server-Side Rendered in 4ms)\nHTML enviado ao cliente com tags e dados pré-renderizados.`,
      description: 'Simulação de execução do servidor Next.js App Router.',
    },
    exercise: {
      id: 'ex-first-contact-nextjs',
      prompt: 'No Next.js com App Router, qual é o comportamento padrão dos componentes dentro da pasta app/?',
      type: 'multiple_choice',
      options: [
        'Eles são React Server Components (executados no servidor) a menos que você adicione "use client"',
        'Eles só rodam no celular e não funcionam na web',
        'Eles exigem jQuery para renderizar',
        'Eles precisam de configuração manual com Webpack para cada arquivo',
      ],
      correctAnswer: 'Eles são React Server Components (executados no servidor) a menos que você adicione "use client"',
      hint: 'Lembre-se da diretiva "use client" quando você precisa de interatividade no navegador.',
      explanation: 'No App Router do Next.js, todo componente é um Server Component por padrão, economizando envio de JavaScript e melhorando a performance drasticamente.',
    },
  },

  // ==========================================
  // 6. HTML5
  // ==========================================
  html: {
    title: '1. Introdução & Primeiros Contactos: A Fundação da Web Semântica',
    description: 'Entenda como o navegador constrói a árvore DOM, por que a semântica importa para SEO e Acessibilidade (a11y) e crie seu primeiro documento HTML5.',
    estimatedMinutes: 10,
    xpReward: 30,
    theory: [
      {
        title: 'A Estrutura Viva da Internet: O DOM',
        text: 'HTML (HyperText Markup Language) não é uma linguagem de programação, mas a linguagem de marcação que estrutura cada pedaço de informação na internet. Quando o navegador baixa seu HTML, ele converte as tags em nós do DOM (Document Object Model), uma árvore viva manipulável.',
        keyPoints: [
          'Tags Semânticas: <header>, <main>, <article>, <section>, <footer> dizem ao Google e leitores de tela o significado de cada conteúdo.',
          'Acessibilidade (a11y): uma web inclusiva permite que pessoas com deficiência visual naveguem perfeitamente usando tecnologias assistivas.',
          'DOCTYPE html: instrução inicial obrigatória que ativa o modo de renderização padrão moderno nos navegadores.',
        ],
        conceptCard: '🏗️ Analogia: O HTML é a planta baixa e as vigas de aço de um edifício.',
      },
    ],
    codeExample: {
      language: 'html',
      code: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Minha Primeira Página Web</title>
</head>
<body>
  <header>
    <h1>🚀 Bem-vindo à Engenharia Web Moderna</h1>
    <p>Construindo páginas semânticas, acessíveis e ultrarrápidas.</p>
  </header>

  <main>
    <article>
      <h2>Fundamentos da Web</h2>
      <p>O HTML estrutura o conteúdo com significado e propósito.</p>
      <button type="button">Começar Minha Jornada</button>
    </article>
  </main>

  <footer>
    <p>&copy; 2026 Dev Academy - Todos os direitos reservados.</p>
  </footer>
</body>
</html>`,
      explanation: 'Documento HTML5 completo e semântico com meta tags essenciais, tags de cabeçalho, conteúdo principal e rodapé.',
    },
    simulation: {
      type: 'simulated',
      defaultOutput: `[HTML Parser] Documento carregado com sucesso!\nÁrvore DOM montada: 1 html, 1 head, 1 body, 3 nós semânticos principais (header, main, footer).`,
      description: 'Renderização e análise da árvore DOM do HTML5.',
    },
    exercise: {
      id: 'ex-first-contact-html',
      prompt: 'Por que desenvolvedores profissionais usam tags semânticas (<main>, <article>, <nav>) em vez de criar tudo com tags <div> genéricas?',
      type: 'multiple_choice',
      options: [
        'Melhora o ranqueamento no Google (SEO), a acessibilidade para leitores de tela e a manutenção do código',
        'Porque navegadores bloqueiam o uso de <div>',
        'Porque tags semânticas diminuem a conta de luz do servidor',
        'Não há vantagem, é apenas uma recomendação estética sem impacto real',
      ],
      correctAnswer: 'Melhora o ranqueamento no Google (SEO), a acessibilidade para leitores de tela e a manutenção do código',
      hint: 'Pense em mecanismos de busca como o Google e em usuários com leitores de tela.',
      explanation: 'A semântica comunica o papel exato de cada bloco para robôs de busca e tecnologias assistivas, elevando o nível profissional do seu código.',
    },
  },

  // ==========================================
  // 7. CSS3
  // ==========================================
  css: {
    title: '1. Introdução & Primeiros Contactos: A Arte do Box Model e Design Moderno',
    description: 'Desvende o segredo do Box Model, especificidade de seletores, Flexbox e dê vida visual ao seu primeiro layout profissional.',
    estimatedMinutes: 12,
    xpReward: 30,
    theory: [
      {
        title: 'O Que é o CSS e Como os Motores Gráficos Renderizam Telas?',
        text: 'CSS (Cascading Style Sheets) transforma estruturas brutas em experiências visuais refinadas. O motor do navegador calcula estilos em cascata, aplica regras de herança e executa as fases de Layout (cálculo de geometria), Paint (desenho de pixels) e Composite (composição com aceleração de GPU).',
        keyPoints: [
          'O Sagrado Box Model: todo elemento é uma caixa composta por Content, Padding (espaçamento interno), Border (borda) e Margin (espaçamento externo).',
          'box-sizing: border-box: a regra indispensável que faz larguras incluírem padding e borda sem estourar o layout.',
          'Flexbox & Grid: os sistemas modernos que eliminaram floats e layouts quebrados.',
        ],
        conceptCard: '🎨 Regra de Ouro: box-sizing: border-box é a primeira linha de todo CSS profissional.',
      },
    ],
    codeExample: {
      language: 'css',
      code: `/* Reset Profissional e Box Model */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  background-color: #0f172a;
  color: #f8fafc;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.card-apresentacao {
  background: linear-gradient(135deg, #1e293b, #0f172a);
  border: 1px solid #334155;
  border-radius: 16px;
  padding: 24px;
  max-width: 400px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
  transition: transform 0.2s ease;
}

.card-apresentacao:hover {
  transform: translateY(-4px);
  border-color: #f97316;
}`,
      explanation: 'CSS moderno com reset seguro de box-sizing, centralização com Flexbox e card com efeitos sutis de hover.',
    },
    simulation: {
      type: 'simulated',
      defaultOutput: `[CSS Engine] 4 regras computadas com sucesso.\nLayout calculado: Flex container centralizado com card de 400px e bordas arredondadas.`,
      description: 'Simulação do motor de renderização CSS.',
    },
    exercise: {
      id: 'ex-first-contact-css',
      prompt: 'Qual é o impacto fundamental de aplicar a regra "box-sizing: border-box" em todos os elementos da página?',
      type: 'multiple_choice',
      options: [
        'Faz com que o padding e a borda fiquem inclusos na largura total (width) especificada, evitando quebras inesperadas de layout',
        'Altera a cor do texto para azul automaticamente',
        'Faz as fontes carregarem mais rápido sem internet',
        'Remove todas as margens do documento',
      ],
      correctAnswer: 'Faz com que o padding e a borda fiquem inclusos na largura total (width) especificada, evitando quebras inesperadas de layout',
      hint: 'Pense em uma caixa de 200px de largura com 20px de padding.',
      explanation: 'Com border-box, um elemento com width: 200px continuará com 200px mesmo se você adicionar 20px de padding e 2px de borda.',
    },
  },

  // ==========================================
  // 8. NODE.JS
  // ==========================================
  nodejs: {
    title: '1. Introdução & Primeiros Contactos: JavaScript no Servidor e o Event Loop',
    description: 'Descubra como Ryan Dahl libertou o JavaScript do navegador criando uma plataforma orientada a eventos, I/O não-bloqueante e crie seu primeiro servidor HTTP.',
    estimatedMinutes: 14,
    xpReward: 35,
    theory: [
      {
        title: 'O Que é o Node.js de Verdade?',
        text: 'Node.js não é uma nova linguagem de programação, mas um ambiente de execução (runtime) construído sobre o motor V8 do Google Chrome e a biblioteca libuv em C++. Ele permite que o JavaScript acesse arquivos locais, portas de rede, bancos de dados e crie servidores de alta concorrência com consumo mínimo de memória.',
        keyPoints: [
          'Arquitetura Single-Threaded Não-Bloqueante: um único processo atende milhares de conexões simultâneas usando o Event Loop.',
          'Módulos Nativos: ferramentas embutidas para HTTP, sistema de arquivos (fs), caminhos (path) e criptografia (crypto).',
          'NPM & Ecossistema de Pacotes: instalação instantânea de frameworks como Express e utilitários.',
        ],
        conceptCard: '⚡ Mentalidade Node.js: "Nunca bloqueie a thread principal. Use funções assíncronas (async/await) para operações de I/O."',
      },
    ],
    codeExample: {
      language: 'javascript',
      code: `// Primeiro Servidor HTTP Nativo em Node.js (Sem dependências externas)
const http = require('http');

const PORT = 3000;
const HOST = '0.0.0.0';

const servidor = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
  
  const resposta = {
    mensagem: "🚀 Servidor Node.js respondendo com sucesso!",
    urlRequisitada: req.url,
    metodo: req.method,
    timestamp: new Date().toISOString()
  };
  
  res.end(JSON.stringify(resposta, null, 2));
});

servidor.listen(PORT, HOST, () => {
  console.log(\`Servidor HTTP ativo e escutando em http://\${HOST}:\${PORT}\`);
});`,
      explanation: 'Criação de um servidor web básico com o módulo nativo http do Node.js.',
    },
    simulation: {
      type: 'simulated',
      defaultOutput: `Servidor HTTP ativo e escutando em http://0.0.0.0:3000\n[HTTP Request] GET /api/status -> 200 OK (Content-Type: application/json)`,
      description: 'Simulação do runtime Node.js com servidor HTTP ativo.',
    },
    exercise: {
      id: 'ex-first-contact-nodejs',
      prompt: 'Como o Node.js consegue lidar com milhares de requisições concorrentes eficientemente usando apenas uma única thread principal de execução?',
      type: 'multiple_choice',
      options: [
        'Através do Event Loop e operações de I/O assíncronas não-bloqueantes delegadas para a biblioteca libuv',
        'Criando uma máquina virtual física separada para cada usuário conectado',
        'Bloqueando a execução de todos os usuários até que o primeiro termine',
        'Executando o código apenas no navegador do cliente',
      ],
      correctAnswer: 'Através do Event Loop e operações de I/O assíncronas não-bloqueantes delegadas para a biblioteca libuv',
      hint: 'Lembre-se do modelo não-bloqueante orientado a eventos do Event Loop.',
      explanation: 'O Node.js delega tarefas pesadas de rede e disco para a libuv em background e processa os retornos através do Event Loop assim que estão prontos.',
    },
  },

  // ==========================================
  // 9. APIS
  // ==========================================
  apis: {
    title: '1. Introdução & Primeiros Contactos: A Linguagem das Comunicações Digitais',
    description: 'Entenda a arquitetura cliente-servidor, métodos HTTP (GET, POST, PUT, DELETE), status codes e construa seu primeiro payload JSON.',
    estimatedMinutes: 12,
    xpReward: 35,
    theory: [
      {
        title: 'O Que é uma API (Application Programming Interface)?',
        text: 'Uma API é a ponte de comunicação que permite que diferentes sistemas conversem entre si de forma padronizada e segura. Quando seu aplicativo de celular consulta o clima, ele faz uma requisição HTTP para uma API, que responde com dados estruturados em formato JSON.',
        keyPoints: [
          'Protocolo HTTP: a base da comunicação web com métodos semânticos (GET para buscar, POST para criar, PUT/PATCH para atualizar, DELETE para remover).',
          'Status Codes: 2xx (Sucesso), 4xx (Erro do Cliente / Não Autorizado), 5xx (Erro do Servidor).',
          'Formato JSON: padrão universal de troca de dados legível por humanos e computadores.',
        ],
        conceptCard: '📡 Modelo Mental: Uma API funciona como o garçom em um restaurante: leva seu pedido à cozinha (servidor) e traz a comida (dados) de volta.',
      },
    ],
    codeExample: {
      language: 'javascript',
      code: `// Estrutura de uma Resposta de API RESTful Padronizada
const respostaApi = {
  status: "success",
  code: 200,
  data: {
    usuarioId: "usr_99812",
    nome: "Carlos Desenvolvedor",
    plano: "Engenheiro Fullstack Pro",
    permissoes: ["read:courses", "write:code", "execute:terminal"]
  },
  meta: {
    tempoExecucaoMs: 14,
    versaoApi: "v1.4.2"
  }
};

console.log("=== RESPOSTA DA API REST /api/v1/perfil ===");
console.log(JSON.stringify(respostaApi, null, 2));`,
      explanation: 'Estruturação de um payload de resposta JSON consistente com metadados de status e dados da entidade.',
    },
    simulation: {
      type: 'simulated',
      defaultOutput: `=== RESPOSTA DA API REST /api/v1/perfil ===\n{\n  "status": "success",\n  "code": 200,\n  "data": {\n    "usuarioId": "usr_99812",\n    "nome": "Carlos Desenvolvedor",\n    "plano": "Engenheiro Fullstack Pro"\n  }\n}`,
      description: 'Simulador de chamadas e respostas HTTP REST.',
    },
    exercise: {
      id: 'ex-first-contact-apis',
      prompt: 'Qual método HTTP deve ser utilizado em uma API RESTful quando o objetivo é BUSCAR informações do servidor sem alterar nenhum dado?',
      type: 'multiple_choice',
      options: [
        'GET',
        'POST',
        'DELETE',
        'DROP',
      ],
      correctAnswer: 'GET',
      hint: 'Pense no verbo inglês "to get" (obter / buscar).',
      explanation: 'O método GET é idempotente e seguro para consulta de recursos sem causar efeitos colaterais ou mutações no banco de dados.',
    },
  },

  // ==========================================
  // 10. PYTHON FASTAPI
  // ==========================================
  python_fastapi: {
    title: '1. Introdução & Primeiros Contactos: APIs Assíncronas de Alta Velocidade',
    description: 'Conheça o framework que uniu tipagem estática com Pydantic, documentação automática com OpenAPI/Swagger e velocidade extrema em Python.',
    estimatedMinutes: 14,
    xpReward: 35,
    theory: [
      {
        title: 'Por Que o FastAPI Superou Frameworks Antigos?',
        text: 'Criado por Sebastián Ramírez, o FastAPI revolucionou o desenvolvimento backend em Python. Ao utilizar as especificações padrão de tipagem do Python (Type Hints), o FastAPI valida entradas automaticamente com Pydantic, gera documentação interativa (/docs) sem você escrever uma única linha a mais e alcança performance comparável a Go e Node.js com o servidor ASGI Uvicorn.',
        keyPoints: [
          'Assíncrono nativo (async/await): gerencia milhares de conexões de I/O em paralelo.',
          'Validação automática de schemas e conversão de tipos de dados com Pydantic.',
          'Documentação interativa Swagger UI gerada automaticamente em tempo real.',
        ],
        conceptCard: '⚡ Regra de Ouro: Tipou o parâmetro, o FastAPI valida a requisição e documenta a rota sozinho.',
      },
    ],
    codeExample: {
      language: 'python',
      code: `# Primeiro Endpoint com FastAPI e Validação Pydantic
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Minha Primeira API FastAPI", version="1.0.0")

class ItemCurso(BaseModel):
    titulo: str
    preco: float
    em_promocao: bool = False

@app.get("/")
def read_root():
    return {"mensagem": "FastAPI rodando com sucesso!", "docs": "/docs"}

@app.post("/cursos/")
def criar_curso(curso: ItemCurso):
    return {"mensagem": "Curso criado com validação completa!", "dados": curso}

print("Instância do FastAPI criada com rotas prontas para o servidor Uvicorn!")`,
      explanation: 'Definição da aplicação FastAPI com rotas GET e POST tipadas com schema Pydantic.',
    },
    simulation: {
      type: 'real_pyodide',
      defaultOutput: `Instância do FastAPI criada com rotas prontas para o servidor Uvicorn!\n[FastAPI] OpenAPI Schema gerado em /openapi.json e Swagger UI em /docs`,
      description: 'Execução do código FastAPI no ambiente interativo.',
    },
    exercise: {
      id: 'ex-first-contact-fastapi',
      prompt: 'O que o FastAPI gera automaticamente a partir das definições de rotas e tipos de dados do seu código?',
      type: 'multiple_choice',
      options: [
        'Documentação interativa completa da API no padrão OpenAPI (Swagger UI em /docs)',
        'Um arquivo executável do Windows para instalação manual',
        'Um template de Photoshop para o designer',
        'Um banco de dados físico no computador do usuário',
      ],
      correctAnswer: 'Documentação interativa completa da API no padrão OpenAPI (Swagger UI em /docs)',
      hint: 'Pense no Swagger UI acessado em /docs.',
      explanation: 'O FastAPI inspeciona seus modelos de tipo e gera instantaneamente a especificação OpenAPI e a interface Swagger UI interativa.',
    },
  },

  // ==========================================
  // 11. JAVA
  // ==========================================
  java: {
    title: '1. Introdução & Primeiros Contactos: A Máquina Virtual (JVM) e Arquitetura Corporativa',
    description: 'Compreenda a filosofia "Write Once, Run Anywhere", o compilador javac, o papel da JVM e crie sua primeira classe corporativa em Java.',
    estimatedMinutes: 14,
    xpReward: 35,
    theory: [
      {
        title: 'A Força Inabalável do Java na Indústria',
        text: 'Java é a espinha dorsal dos maiores bancos, companhias aéreas e gigantes de tecnologia do mundo (Netflix, Amazon, Google). Seu grande trunfo é a JVM (Java Virtual Machine): o código Java é compilado para Bytecode (.class), que é executado com altíssima performance em qualquer sistema operacional.',
        keyPoints: [
          'Orientação a Objetos Pura: tudo é organizado em Classes, Métodos e Objetos com forte encapsulamento.',
          'Garbage Collector avançado: gerenciamento automático de memória seguro que previne vazamentos de memória.',
          'Tipagem estática e verificação rigorosa em tempo de compilação.',
        ],
        conceptCard: '☕ Modelo Mental: O compilador javac gera Bytecode; a JVM compila esse Bytecode para código de máquina nativo em tempo real (JIT).',
      },
    ],
    codeExample: {
      language: 'java',
      code: `// Primeira Classe Executável em Java
public class PrimeiroPrograma {
    public static void main(String[] args) {
        String estudante = "Futuro Engenheiro Java";
        String modulo = "Fundamentos da JVM e OOP";
        int xpInicial = 100;

        System.out.println("========================================");
        System.out.println("☕ Bem-vindo ao Ecossistema Java Enterprise!");
        System.out.println("Aluno: " + estudante);
        System.out.println("Módulo: " + modulo);
        System.out.println("Pontuação Inicial: " + xpInicial + " XP");
        System.out.println("========================================");
        System.out.println("Compilação: Bytecode verificado pela JVM com sucesso!");
    }
}`,
      explanation: 'Estrutura clássica de uma classe pública com o método de entrada estático main.',
    },
    simulation: {
      type: 'simulated',
      defaultOutput: `========================================\n☕ Bem-vindo ao Ecossistema Java Enterprise!\nAluno: Futuro Engenheiro Java\nMódulo: Fundamentos da JVM e OOP\nPontuação Inicial: 100 XP\n========================================\nCompilação: Bytecode verificado pela JVM com sucesso!`,
      description: 'Simulação do compilador javac e execução na JVM.',
    },
    exercise: {
      id: 'ex-first-contact-java',
      prompt: 'Qual é o papel fundamental da JVM (Java Virtual Machine) no ecossistema Java?',
      type: 'multiple_choice',
      options: [
        'Executar o Bytecode compilado (.class) em qualquer sistema operacional sem necessidade de alterar o código-fonte',
        'Apenas formatar textos na tela do computador',
        'Desinstalar programas desnecessários da máquina',
        'Traduzir arquivos em PDF para imagens',
      ],
      correctAnswer: 'Executar o Bytecode compilado (.class) em qualquer sistema operacional sem necessidade de alterar o código-fonte',
      hint: 'Lembre-se do lema: "Write Once, Run Anywhere".',
      explanation: 'A JVM isola o código da máquina física, permitindo que o mesmo Bytecode rode idêntico no Windows, Linux, servidores em nuvem ou dispositivos embarcados.',
    },
  },

  // ==========================================
  // 12. PHP
  // ==========================================
  php: {
    title: '1. Introdução & Primeiros Contactos: O Motor que Move Quase 80% da Web',
    description: 'Compreenda a evolução do PHP 8 moderno, tipagem forte, ciclo de vida de requisições web e execute seu primeiro script dinâmico.',
    estimatedMinutes: 12,
    xpReward: 30,
    theory: [
      {
        title: 'O PHP Moderno: Muito Além dos Mitos Antigos',
        text: 'Criado por Rasmus Lerdorf, o PHP (Hypertext Preprocessor) alimenta plataformas gigantes como WordPress, Wikipedia e sistemas de pagamento globais. O PHP 8+ trouxe melhorias revolucionárias: Compilador JIT, Tipos de União, Atributos nativos e performance equiparável às principais linguagens de backend.',
        keyPoints: [
          'Arquitetura Share-Nothing: cada requisição web inicia e finaliza com estado isolado e limpo, garantindo altíssima resiliência.',
          'Integração nativa com servidores web (Apache, Nginx, PHP-FPM) e bancos de dados SQL.',
          'Frameworks de altíssimo calibre como Laravel e Symfony.',
        ],
        conceptCard: '🐘 Filosofia PHP: Produtividade máxima para entregar sistemas web funcionais em tempo recorde.',
      },
    ],
    codeExample: {
      language: 'php',
      code: `<?php
// Primeiro Script PHP 8 Moderno com Tipagem Estrita
declare(strict_types=1);

class Desenvolvedor {
    public function __construct(
        public string $nome,
        public string $nivel,
        public array $skills
    ) {}

    public function apresentar(): string {
        $habilidades = implode(', ', $this->skills);
        return "Olá, eu sou {$this->nome} ({$this->nivel}). Minhas tecnologias: {$habilidades}.";
    }
}

$dev = new Desenvolvedor(
    nome: "Lucas Silva",
    nivel: "PHP Fullstack",
    skills: ["PHP 8.3", "Laravel", "MySQL", "Docker"]
);

echo "=== PHP RUNTIME INICIADO ===" . PHP_EOL;
echo $dev->apresentar() . PHP_EOL;
echo "Status: Script PHP executado com sucesso no servidor!";`,
      explanation: 'Uso de constructor property promotion e tipagem estrita do PHP 8 moderno.',
    },
    simulation: {
      type: 'simulated',
      defaultOutput: `=== PHP RUNTIME INICIADO ===\nOlá, eu sou Lucas Silva (PHP Fullstack). Minhas tecnologias: PHP 8.3, Laravel, MySQL, Docker.\nStatus: Script PHP executado com sucesso no servidor!`,
      description: 'Ambiente de execução PHP 8 CLI.',
    },
    exercise: {
      id: 'ex-first-contact-php',
      prompt: 'O que a diretiva declare(strict_types=1); faz no início de um arquivo PHP moderno?',
      type: 'multiple_choice',
      options: [
        'Força a checagem estrita de tipos nas chamadas de funções e métodos, evitando coerções implícitas perigosas',
        'Desliga a conexão com o banco de dados',
        'Transforma o código PHP em HTML estático',
        'Apaga variáveis globais após 5 segundos',
      ],
      correctAnswer: 'Força a checagem estrita de tipos nas chamadas de funções e métodos, evitando coerções implícitas perigosas',
      hint: 'Pense em "strict types" (tipagem rigorosa).',
      explanation: 'Com strict_types ativo, o PHP emite um erro de TypeError caso um tipo incompatível seja passado para uma função, garantindo robustez profissional.',
    },
  },

  // ==========================================
  // 13. FLUTTER
  // ==========================================
  flutter: {
    title: '1. Introdução & Primeiros Contactos: O Framework Multiplataforma do Google',
    description: 'Aprenda o conceito "Tudo é um Widget", a linguagem Dart, o motor gráfico de alta fidelidade e crie seu primeiro app móvel.',
    estimatedMinutes: 14,
    xpReward: 35,
    theory: [
      {
        title: 'Por Que o Flutter é o Líder em Apps Multiplataforma?',
        text: 'Criado pelo Google, o Flutter permite compilar um único código-fonte para Android, iOS, Web e Desktop. Diferente de frameworks que usam pontes lentas de JavaScript, o Flutter desenha cada pixel na tela diretamente na GPU com motores ultrarrápidos (Skia / Impeller), atingindo 60 a 120 FPS cravados.',
        keyPoints: [
          'Linguagem Dart: combina compilação JIT para Hot Reload instantâneo e AOT (Ahead-of-Time) para máxima velocidade em produção.',
          'Filosofia "Tudo é um Widget": botões, layouts, cores e animações são widgets combinados em árvore.',
          'Controle total de cada pixel da tela sem depender dos componentes nativos limitados do sistema.',
        ],
        conceptCard: '📱 Modelo Mental: No Flutter, você compõe sua tela como se estivesse montando blocos de Lego perfeitamente encaixados.',
      },
    ],
    codeExample: {
      language: 'dart',
      code: `// Primeiro App Flutter com Árvore de Widgets
import 'package:flutter/material.dart';

void main() {
  runApp(const MeuPrimeiroApp());
}

class MeuPrimeiroApp extends StatelessWidget {
  const MeuPrimeiroApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: Scaffold(
        backgroundColor: const Color(0xFF0F172A),
        appBar: AppBar(
          title: const Text('Flutter Studio Inaugural 🚀'),
          backgroundColor: Colors.deepOrange,
        ),
        body: const Center(
          child: Text(
            'Tudo no Flutter é um Widget!',
            style: TextStyle(fontSize: 20, color: Colors.white, fontWeight: FontWeight.bold),
          ),
        ),
      ),
    );
  }
}`,
      explanation: 'Estrutura básica de um app Flutter com MaterialApp, Scaffold, AppBar e Center.',
    },
    simulation: {
      type: 'simulated',
      defaultOutput: `[Flutter Engine] Compilando árvore de widgets...\nMotor Impeller iniciado (60 FPS).\nApp renderizado com Scaffold e AppBar 'Flutter Studio Inaugural'.`,
      description: 'Simulação do motor de renderização gráfica Flutter.',
    },
    exercise: {
      id: 'ex-first-contact-flutter',
      prompt: 'Qual é o princípio arquitetural fundamental da interface visual no framework Flutter?',
      type: 'multiple_choice',
      options: [
        'Tudo na interface visual é um Widget organizado em uma árvore hierárquica',
        'Cada tela deve ser desenhada obrigatoriamente em arquivos HTML separados',
        'O Flutter não permite customização de botões ou cores',
        'O código precisa ser reescrito do zero para cada marca de celular',
      ],
      correctAnswer: 'Tudo na interface visual é um Widget organizado em uma árvore hierárquica',
      hint: 'Lembre-se do mantra oficial do Flutter: "Everything is a Widget".',
      explanation: 'No Flutter, desde o layout mais básico até textos, paddings e temas são representados como widgets que se aninham para formar a UI.',
    },
  },

  // ==========================================
  // 14. MYSQL
  // ==========================================
  mysql: {
    title: '1. Introdução & Primeiros Contactos: Bancos de Dados Relacionais e a Linguagem SQL',
    description: 'Entenda a integridade de dados (ACID), tabelas, chaves primárias e execute suas primeiras instruções SELECT e INSERT em MySQL.',
    estimatedMinutes: 12,
    xpReward: 30,
    theory: [
      {
        title: 'A Importância Crítica dos Bancos de Dados Relacionais',
        text: 'Aplicações precisam armazenar informações de forma durável, confiável e rápida. O MySQL é o RDBMS (Sistema de Gerenciamento de Banco de Dados Relacional) open-source mais famoso do mundo. Ele organiza dados em Tabelas (com Linhas e Colunas) conectadas por Relacionamentos lógicos.',
        keyPoints: [
          'Linguagem SQL (Structured Query Language): a linguagem padrão declarativa para consultar e manipular dados.',
          'Chave Primária (PRIMARY KEY): identificador exclusivo e imutável para cada linha da tabela.',
          'Garantias ACID (Atomicidade, Consistência, Isolamento e Durabilidade): seus dados nunca ficam corrompidos pela metade.',
        ],
        conceptCard: '💾 Regra de Ouro: Dados sem integridade não valem nada. Sempre use tipos de dados adequados e chaves primárias.',
      },
    ],
    codeExample: {
      language: 'sql',
      code: `-- Criando sua primeira tabela relacional em MySQL
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    nivel VARCHAR(50) DEFAULT 'Iniciante',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserindo registros reais
INSERT INTO usuarios (nome, email, nivel) 
VALUES ('Juliana Mendes', 'juliana@empresa.com', 'Engenheira de Dados');

-- Consultando os registros
SELECT id, nome, email, nivel, criado_em FROM usuarios;`,
      explanation: 'Criação de tabela com chave primária auto-incremento e consulta SELECT.',
    },
    simulation: {
      type: 'sql_mock',
      defaultOutput: `Query OK, 1 row affected (0.02 sec)\n+----+----------------+----------------------+--------------------+---------------------+\n| id | nome           | email                | nivel              | criado_em           |\n+----+----------------+----------------------+--------------------+---------------------+\n|  1 | Juliana Mendes | juliana@empresa.com  | Engenheira de Dados| 2026-08-28 10:00:00 |\n+----+----------------+----------------------+--------------------+---------------------+`,
      description: 'Executor interativo de consultas SQL em MySQL.',
    },
    exercise: {
      id: 'ex-first-contact-mysql',
      prompt: 'Para que serve a cláusula "PRIMARY KEY" em uma coluna de uma tabela de banco de dados relacional?',
      type: 'multiple_choice',
      options: [
        'Garante que cada registro possua um identificador único exclusivo e não nulo na tabela',
        'Faz o banco de dados apagar registros antigos a cada 24 horas',
        'Serve apenas para mudar a cor do texto no painel do banco',
        'Obriga o usuário a digitar senhas com letras maiúsculas',
      ],
      correctAnswer: 'Garante que cada registro possua um identificador único exclusivo e não nulo na tabela',
      hint: 'Pense no conceito de "Identificador Único" (como um CPF ou ID).',
      explanation: 'A PRIMARY KEY assegura a unicidade de cada linha, permitindo buscas ultrarrápidas indexadas e relacionamentos consistentes entre tabelas.',
    },
  },

  // ==========================================
  // 15. POSTGRESQL
  // ==========================================
  postgresql: {
    title: '1. Introdução & Primeiros Contactos: O Banco de Dados Objeto-Relacional Mais Avançado',
    description: 'Descubra por que o PostgreSQL é a escolha unânime de unicórnios e startups modernas, suporte nativo a JSONB, extensões e índices avançados.',
    estimatedMinutes: 14,
    xpReward: 35,
    theory: [
      {
        title: 'O Que Torna o PostgreSQL Tão Especial?',
        text: 'PostgreSQL ("Postgres") é conhecido como o banco de dados open-source mais robusto do mundo. Ele combina o rigor do SQL relacional com a flexibilidade de bancos NoSQL através do suporte nativo ao formato JSONB indexado com GIN, além de suporte a busca vetorial para IA (pgvector) e tipos geoespaciais (PostGIS).',
        keyPoints: [
          'Suporte nativo a tipos complexos: Arrays, JSONB, UUID e Enum customizados.',
          'Conformidade estrita com o padrão ANSI SQL e transações ACID infalíveis.',
          'Extensibilidade lendária: capacidade de instalar plugins como pgvector para buscas semânticas de IA.',
        ],
        conceptCard: '🐘 Postgres Power: Uma única instância de Postgres pode substituir tanto seu banco relacional quanto seu banco de documentos JSON.',
      },
    ],
    codeExample: {
      language: 'sql',
      code: `-- Criando tabela com suporte a UUID nativo e JSONB no PostgreSQL
CREATE TABLE projetos_tech (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(100) NOT NULL,
    configuracoes JSONB NOT NULL,
    tags TEXT[] NOT NULL,
    ativo BOOLEAN DEFAULT true
);

INSERT INTO projetos_tech (nome, configuracoes, tags)
VALUES (
    'Plataforma Dev Next-Gen',
    '{"tema": "dark", "ia_enabled": true, "max_conexoes": 5000}'::jsonb,
    ARRAY['postgresql', 'fastapi', 'react']
);

-- Consultando campo interno do JSONB com operador ->>
SELECT nome, configuracoes->>'tema' AS tema_escolhido, tags FROM projetos_tech;`,
      explanation: 'Utilização de UUID e operadores nativos de JSONB do PostgreSQL.',
    },
    simulation: {
      type: 'sql_mock',
      defaultOutput: `CREATE TABLE\nINSERT 0 1\n          nome          | tema_escolhido |            tags            \n------------------------+----------------+----------------------------\n Plataforma Dev Next-Gen| dark           | {postgresql,fastapi,react}\n(1 row)`,
      description: 'Ambiente de execução SQL no dialeto PostgreSQL.',
    },
    exercise: {
      id: 'ex-first-contact-postgresql',
      prompt: 'Qual é a vantagem do tipo de dado "JSONB" no PostgreSQL em relação a simplesmente guardar texto puro com formato JSON?',
      type: 'multiple_choice',
      options: [
        'O JSONB armazena os dados em formato binário decomposto, permitindo indexação ultrarrápida e buscas internas sem parsing manual',
        'O JSONB apaga automaticamente dados duplicados da memória RAM',
        'O JSONB só aceita números inteiros positivos',
        'Não há diferença de performance entre JSON e texto simples',
      ],
      correctAnswer: 'O JSONB armazena os dados em formato binário decomposto, permitindo indexação ultrarrápida e buscas internas sem parsing manual',
      hint: 'Lembre-se da letra B de "Binary" (Binário Indexado).',
      explanation: 'O tipo JSONB converte o documento para formato binário otimizado, permitindo buscas em propriedades internas em milissegundos com índices GIN.',
    },
  },

  // ==========================================
  // 16. GIT & GITHUB
  // ==========================================
  git: {
    title: '1. Introdução & Primeiros Contactos: O Grafo de Histórico do Git',
    description: 'Entenda como o Git rastreia snapshots (e não apenas diferenças de texto), os 3 estados locais e execute seu primeiro git init e git commit.',
    estimatedMinutes: 12,
    xpReward: 35,
    theory: [
      {
        title: 'Por Que o Git é o Sistema Mais Importante da Sua Carreira?',
        text: 'Criado por Linus Torvalds para gerenciar o código-fonte do Linux, o Git é um sistema de controle de versão distribuído. Ele não salva cópias redundantes de pastas ("projeto_final_v2_agora_vai.zip"), mas sim uma árvore de commits criptográfica (DAG) baseada em hashes SHA, garantindo histórico infinito e trabalho em equipe sem conflitos destrutivos.',
        keyPoints: [
          'Os 3 Estados Vitais: Working Directory (seus arquivos em edição) -> Staging Area (preparação para o snapshot via git add) -> Repository (histórico definitivo via git commit).',
          'Branches (Ramificações): linhas de desenvolvimento isoladas para criar novas features sem quebrar a versão principal (main/master).',
          'GitHub/GitLab: plataformas em nuvem que hospedam repositórios remotos e viabilizam Pull Requests e Code Reviews colaborativas.',
        ],
        conceptCard: '🌳 Mentalidade Git: Um commit é uma foto imutável do seu projeto naquele instante de tempo.',
      },
    ],
    codeExample: {
      language: 'bash',
      code: `# Inicializando seu primeiro repositório e criando o primeiro commit
git init

# Criando um arquivo essencial de documentação
echo "# Meu Projeto Incrível com Git" > README.md

# Movendo o arquivo para a Staging Area (Área de Preparação)
git add README.md

# Criando o Snapshot imutável no histórico com mensagem semântica
git commit -m "feat: commit inicial do projeto e documentação README"

# Verificando o estado do repositório
git status`,
      explanation: 'Comandos fundamentais para inicializar, adicionar arquivos e comitar no Git.',
    },
    simulation: {
      type: 'simulated',
      defaultOutput: `Initialized empty Git repository in /workspace/projeto/.git/\n[main (root-commit) 7a3f91b] feat: commit inicial do projeto e documentação README\n 1 file changed, 1 insertion(+)\n create mode 100644 README.md\nOn branch main\nnothing to commit, working tree clean`,
      description: 'Simulador de comandos de terminal Git.',
    },
    exercise: {
      id: 'ex-first-contact-git',
      prompt: 'Qual é a função do comando "git add <arquivo>" antes de executar o "git commit"?',
      type: 'multiple_choice',
      options: [
        'Mover as alterações selecionadas para a Staging Area (área de preparação) que fará parte do próximo commit',
        'Publicar o código diretamente no GitHub sem pedir permissão',
        'Deletar permanentemente os arquivos modificados',
        'Compilar o código em linguagem de máquina binária',
      ],
      correctAnswer: 'Mover as alterações selecionadas para a Staging Area (área de preparação) que fará parte do próximo commit',
      hint: 'Pense no conceito de "Staging Area" (palco de preparação).',
      explanation: 'O git add permite que você escolha cirurgicamente quais modificações farão parte do próximo snapshot (commit), mantendo o histórico organizado.',
    },
  },

  // ==========================================
  // 17. LINUX & CYBERSECURITY
  // ==========================================
  linux_cyber: {
    title: '1. Introdução & Primeiros Contactos: O Terminal Unix e os Pilares de Cyber',
    description: 'Compreenda a árvore de diretórios POSIX, permissões de arquivos (chmod/chown), pipes e execute seus primeiros comandos essenciais no shell Bash.',
    estimatedMinutes: 14,
    xpReward: 35,
    theory: [
      {
        title: 'O Sistema Operacional da Internet e da Segurança da Informação',
        text: 'Mais de 96% dos servidores em nuvem, contêineres Docker e dispositivos de segurança rodam distribuições Linux (Debian, Ubuntu, Kali, RedHat). No Linux, vigora a filosofia Unix: "Tudo é um arquivo" e "Pequenos programas que fazem uma única coisa com maestria e se conectam através de Pipes (|)".',
        keyPoints: [
          'A Árvore Raiz (/): não existem letras de unidade como C: ou D:. Tudo parte da barra raiz / (ex: /etc para configurações, /var/log para auditoria, /bin para executáveis).',
          'Permissões Unix (rwx): Leitura (Read), Escrita (Write) e Execução (Execute) divididas entre Dono (User), Grupo (Group) e Outros (Others).',
          'Automação via Shell Script (Bash): capacidade de orquestrar tarefas e auditorias com comandos encadeados.',
        ],
        conceptCard: '🐧 Regra de Ouro: Quem domina o terminal Linux ganha superpoderes em infraestrutura, nuvem e cibersegurança.',
      },
    ],
    codeExample: {
      language: 'bash',
      code: `# Comandos essenciais de inspeção de sistema e segurança
# 1. Quem sou eu e onde estou?
whoami && pwd

# 2. Inspecionando o sistema operacional e versão do kernel
uname -a

# 3. Criando diretório seguro e ajustando permissões
mkdir -p /tmp/cyber-lab && cd /tmp/cyber-lab
touch audit.log
chmod 600 audit.log # Apenas o dono pode ler e escrever

# 4. Listando com detalhes de segurança
ls -la audit.log`,
      explanation: 'Comandos de reconhecimento de ambiente, auditoria e restrição de permissões em Linux.',
    },
    simulation: {
      type: 'simulated',
      defaultOutput: `dev-secops\n/home/dev-secops\nLinux cloud-node-01 6.8.0-generic #28-Ubuntu SMP PREEMPT_DYNAMIC x86_64 GNU/Linux\n-rw------- 1 dev-secops dev-secops 0 Aug 28 10:00 audit.log`,
      description: 'Terminal interativo Bash em ambiente Linux.',
    },
    exercise: {
      id: 'ex-first-contact-linux',
      prompt: 'Em um sistema Linux, o que a permissão "chmod 600 arquivo.txt" garante em termos de segurança?',
      type: 'multiple_choice',
      options: [
        'Apenas o proprietário do arquivo tem permissão de leitura e escrita; outros usuários não têm nenhum acesso',
        'Permite que qualquer pessoa na internet edite o arquivo sem senha',
        'Apaga o arquivo imediatamente',
        'Transforma o arquivo em um vírus',
      ],
      correctAnswer: 'Apenas o proprietário do arquivo tem permissão de leitura e escrita; outros usuários não têm nenhum acesso',
      hint: '6 em binário (4 leitura + 2 escrita) para o dono, e 0 para grupo e outros.',
      explanation: 'O modo 600 (rw-------) é o padrão de segurança para chaves SSH e dados confidenciais, restringindo o acesso exclusivamente ao dono.',
    },
  },

  // ==========================================
  // 18. C, REDES & SISTEMAS
  // ==========================================
  c_sys_cyber: {
    title: '1. Introdução & Primeiros Contactos: A Linguagem Mãe e Gestão de Memória',
    description: 'Entenda como o computador enxerga bytes, ponteiros, alocação na Stack vs Heap e escreva seu primeiro programa em C puro.',
    estimatedMinutes: 14,
    xpReward: 35,
    theory: [
      {
        title: 'Por Que o C é a Fundação de Toda a Computação Moderna?',
        text: 'Criado por Dennis Ritchie na Bell Labs, o C foi utilizado para escrever o Linux, o Windows, o interpretador do Python, os motores de bancos de dados e navegadores. O C não esconde nada do desenvolvedor: não existe máquina virtual ou garbage collector. Você tem controle cirúrgico de cada byte e endereço de memória RAM.',
        keyPoints: [
          'Stack (Pilha) vs Heap (Monte): variáveis locais alocadas automaticamente na Stack; memória dinâmica sob demanda no Heap via malloc()/free().',
          'Ponteiros (* e &): variáveis que armazenam o endereço físico de memória de outros dados.',
          'Compilação direta para código binário nativo de máquina com máxima velocidade.',
        ],
        conceptCard: '⚡ Consciência de Hardware: Aprender C transforma programadores comuns em verdadeiros engenheiros de software.',
      },
    ],
    codeExample: {
      language: 'c',
      code: `/* Primeiro Programa em C com Inspeção de Endereços de Memória */
#include <stdio.h>

int main() {
    int valor = 42;
    int *ponteiro = &valor; // Armazena o endereço de memória de 'valor'

    printf("========================================\\n");
    printf("🚀 Bem-vindo ao C de Baixo Nível!\\n");
    printf("Valor da variável: %d\\n", valor);
    printf("Endereço físico na RAM (&valor): %p\\n", (void*)&valor);
    printf("Valor acessado via ponteiro (*ponteiro): %d\\n", *ponteiro);
    printf("========================================\\n");
    
    return 0; // Código de saída 0: Execução perfeita
}`,
      explanation: 'Declaração de variável, operador de endereço (&) e desreferenciação de ponteiro (*).',
    },
    simulation: {
      type: 'simulated',
      defaultOutput: `========================================\n🚀 Bem-vindo ao C de Baixo Nível!\nValor da variável: 42\nEndereço físico na RAM (&valor): 0x7ffd9b2c3a14\nValor acessado via ponteiro (*ponteiro): 42\n========================================\nProcess returned 0 (0x0) execution time: 0.002 s`,
      description: 'Simulação de compilação GCC e execução binária de C.',
    },
    exercise: {
      id: 'ex-first-contact-c',
      prompt: 'Em C, o que o operador "&" faz quando aplicado na frente do nome de uma variável (ex: &variavel)?',
      type: 'multiple_choice',
      options: [
        'Retorna o endereço de memória físico onde aquela variável está armazenada na memória RAM',
        'Soma dois números simultaneamente',
        'Exclui a variável da memória',
        'Converte o texto para letras maiúsculas',
      ],
      correctAnswer: 'Retorna o endereço de memória físico onde aquela variável está armazenada na memória RAM',
      hint: 'Pense no operador "address-of" (endereço de).',
      explanation: 'O operador & obtém o endereço na RAM da variável, o qual pode ser guardado em uma variável especial do tipo ponteiro.',
    },
  },

  // ==========================================
  // 19. CLOUD & DEVOPS
  // ==========================================
  cloud_devops: {
    title: '1. Introdução & Primeiros Contactos: Contêineres, Nuvem e Pipelines CI/CD',
    description: 'Compreenda o fim do "na minha máquina funciona", isolamento com Docker, infraestrutura como código e seu primeiro Dockerfile.',
    estimatedMinutes: 14,
    xpReward: 35,
    theory: [
      {
        title: 'O Que é a Cultura DevOps e Computação em Nuvem?',
        text: 'Antes do DevOps, desenvolvedores criavam o código e jogavam para a equipe de infraestrutura configurar servidores manuais cheios de erros. Com Contêineres (Docker), Nuvem (GCP, AWS) e Pipelines Automatizados de CI/CD (Integração e Entrega Contínua), todo o ambiente é definido como código versionável e reproduzível em qualquer lugar do mundo.',
        keyPoints: [
          'Docker vs Máquinas Virtuais: contêineres compartilham o kernel do host, iniciando em milissegundos com isolamento perfeito de dependências.',
          'Dockerfile: receita declarativa que descreve como empacotar sua aplicação e suas bibliotecas.',
          'CI/CD: automação que testa, compila e faz deploy do código a cada git push sem intervenção manual.',
        ],
        conceptCard: '🐳 Regra de Ouro: Se está dentro de um contêiner Docker, rodará exatamente idêntico no seu notebook e no cluster de produção.',
      },
    ],
    codeExample: {
      language: 'dockerfile',
      code: `# Primeiro Dockerfile Otimizado Multi-Stage
# Etapa 1: Imagem base ultraleve com Node.js
FROM node:20-alpine AS runtime

# Definindo o diretório de trabalho no contêiner
WORKDIR /app

# Copiando manifestos de dependências
COPY package*.json ./

# Instalando dependências em modo de produção
RUN npm ci --only=production

# Copiando o restante do código da aplicação
COPY . .

# Expondo a porta padrão de comunicação
EXPOSE 3000

# Comando de inicialização do contêiner
CMD ["node", "server.js"]`,
      explanation: 'Dockerfile padronizado em camadas para gerar contêineres de alta performance e segurança.',
    },
    simulation: {
      type: 'simulated',
      defaultOutput: `[Docker Engine] Building image app:latest (10/10 layers complete)\nStep 1/7: FROM node:20-alpine\nStep 6/7: EXPOSE 3000\nSuccessfully built image sha256:4b91f0a2c\nContainer app-instance started listening on port 3000.`,
      description: 'Simulação do Docker Build e inicialização de contêiner.',
    },
    exercise: {
      id: 'ex-first-contact-devops',
      prompt: 'Qual é o principal problema do desenvolvimento de software que a tecnologia de Contêineres (Docker) eliminou com sucesso?',
      type: 'multiple_choice',
      options: [
        'O famoso "na minha máquina funciona, mas em produção quebra", garantindo que a aplicação rode idêntica em qualquer ambiente',
        'A necessidade de aprender a programar',
        'A necessidade de ter conexão com a internet',
        'O custo da energia elétrica dos monitores',
      ],
      correctAnswer: 'O famoso "na minha máquina funciona, mas em produção quebra", garantindo que a aplicação rode idêntica em qualquer ambiente',
      hint: 'Pense no isolamento absoluto de dependências e bibliotecas.',
      explanation: 'O Docker empacota o código junto com o runtime, variáveis de ambiente e dependências exatas, eliminando conflitos de ambiente.',
    },
  },

  // ==========================================
  // 20. IA & APLICAÇÕES MODERNAS
  // ==========================================
  ai_apps: {
    title: '1. Introdução & Primeiros Contactos: Engenharia de Prompt, LLMs e APIs de IA',
    description: 'Entenda como os Modelos de Linguagem de Grande Escala funcionam, tokens, embeddings e integre sua primeira chamada à API do Gemini.',
    estimatedMinutes: 14,
    xpReward: 35,
    theory: [
      {
        title: 'A Revolução da Inteligência Artificial Generativa',
        text: 'Modelos como Gemini e GPT não são motores de busca tradicionais, mas redes neurais do tipo Transformer treinadas para prever os próximos "tokens" (pedaços de palavras) mais prováveis com base em um contexto. Como engenheiro de software, você aprende a orquestrar esses modelos via APIs para construir agentes autônomos, sistemas de busca semântica (RAG) e interfaces inteligentes.',
        keyPoints: [
          'Tokens e Janela de Contexto: a unidade básica de processamento e o limite de memória que o modelo enxerga por requisição.',
          'System Prompt & Few-Shot: instrução fundacional que dita o tom, as regras e a persona de resposta da IA.',
          'Structured Outputs (JSON Schema): obrigar o modelo a responder estritamente em JSON tipado para integração com bancos de dados.',
        ],
        conceptCard: '🤖 Princípio da IA: "O modelo é tão bom quanto a clareza e as restrições que você fornece no prompt estruturado."',
      },
    ],
    codeExample: {
      language: 'typescript',
      code: `// Primeira Integração com a API do Google Gen AI (Gemini 2.5)
import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function analisarCodigo(snippet: string) {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: \`Analise o código a seguir e aponte melhorias de segurança:\\n\${snippet}\`,
    config: {
      systemInstruction: 'Você é um arquiteto de software sênior focado em Clean Code e OWASP.',
      temperature: 0.2 // Respostas determinísticas e precisas
    }
  });

  return response.text;
}

console.log("Integração Gemini SDK configurada com sucesso!");`,
      explanation: 'Configuração do cliente oficial @google/genai com system instruction e controle de temperatura.',
    },
    simulation: {
      type: 'simulated',
      defaultOutput: `Integração Gemini SDK configurada com sucesso!\n[Gemini 2.5 Flash] Resposta gerada: "O código foi auditado: Zero vulnerabilidades críticas encontradas."`,
      description: 'Simulação da SDK Google Gen AI com modelo Gemini.',
    },
    exercise: {
      id: 'ex-first-contact-ai',
      prompt: 'Por que definimos uma "Temperature" baixa (ex: 0.1 ou 0.2) ao fazer chamadas a LLMs para tarefas de código ou dados estruturados?',
      type: 'multiple_choice',
      options: [
        'Para tornar as respostas mais determinísticas, precisas e menos propensas a alucinações criativas',
        'Para fazer a placa de vídeo esquentar menos',
        'Para a IA responder em outro idioma',
        'Para desligar o modelo à noite',
      ],
      correctAnswer: 'Para tornar as respostas mais determinísticas, precisas e menos propensas a alucinações criativas',
      hint: 'Temperatura baixa = foco e precisão; temperatura alta = criatividade poética.',
      explanation: 'Temperaturas baixas reduzem a aleatoriedade da amostragem de tokens, ideal para código, matemática e integrações de API.',
    },
  },

  // ==========================================
  // 21. INGLÊS TÉCNICO
  // ==========================================
  english_tech: {
    title: '1. Introdução & Primeiros Contactos: O Idioma Oficial da Engenharia Global',
    description: 'Desmistifique a comunicação internacional em tecnologia, termos essenciais de Pull Requests, Code Reviews e documentações técnicas.',
    estimatedMinutes: 10,
    xpReward: 30,
    theory: [
      {
        title: 'Por Que o Inglês Multiplica seu Salário e Oportunidades por 5x?',
        text: 'As melhores documentações, ferramentas e vagas remotas em moeda forte (Dólar/Euro) são 100% em inglês. Você não precisa falar como um poeta britânico: na engenharia de software global, valoriza-se a comunicação direta, concisa e sem jargões desnecessários (Clear & Concise Technical Communication).',
        keyPoints: [
          'Terminologia de Código: "merge conflict", "edge case", "trade-off", "deprecated", "workaround".',
          'Etiqueta em Code Reviews: sugestões construtivas ("Consider refactoring this loop to prevent memory leak").',
          'Leitura de Logs de Erro: interpretar Stack Traces em inglês em segundos sem medo.',
        ],
        conceptCard: '🌍 Regra de Ouro: O mercado internacional contrata pela capacidade de resolver problemas e comunicar soluções de forma clara.',
      },
    ],
    codeExample: {
      language: 'markdown',
      code: `### Standard Pull Request Description (Template Global)

#### 🚀 Summary of Changes
- Implemented JWT token refresh flow in \`/api/auth\`.
- Added unit tests covering edge cases for expired tokens.
- Fixed minor typo in error message handler.

#### 🔍 How to Test
1. Run \`npm run test:auth\` to verify test coverage.
2. Send a POST request to \`/api/auth/refresh\` with an expired header.

#### 💡 Architectural Trade-offs
- Used Redis cache for token blocklist to keep latency under 5ms.`,
      explanation: 'Exemplo real de uma descrição de Pull Request profissional em inglês técnico.',
    },
    simulation: {
      type: 'simulated',
      defaultOutput: `[GitHub PR Bot] Pull Request #42 passed all automated checks.\nReviewers assigned: @tech-lead-us, @senior-architect.\nStatus: Ready for Global Engineering Review.`,
      description: 'Simulação de fluxo de Code Review internacional.',
    },
    exercise: {
      id: 'ex-first-contact-english',
      prompt: 'No contexto de engenharia de software global, o que significa a expressão "Trade-off"?',
      type: 'multiple_choice',
      options: [
        'A troca de vantagens e desvantagens ao escolher uma tecnologia ou solução (ex: mais velocidade vs maior consumo de memória)',
        'O cancelamento imediato de um contrato de trabalho',
        'Um erro fatal no disco rígido do servidor',
        'Uma reunião de confraternização da equipe',
      ],
      correctAnswer: 'A troca de vantagens e desvantagens ao escolher uma tecnologia ou solução (ex: mais velocidade vs maior consumo de memória)',
      hint: 'Pense em "compromisso de engenharia" entre prós e contras.',
      explanation: 'Na engenharia, não existem soluções perfeitas, apenas trade-offs conscientes: você ganha em um aspecto abrindo mão de outro.',
    },
  },

  // ==========================================
  // 22. UNITY 2D
  // ==========================================
  unity_2d: {
    title: '1. Introdução & Primeiros Contactos: A Engine Líder e o Game Loop',
    description: 'Entenda como jogos funcionam por dentro, a taxa de quadros (FPS), GameObjects, Componentes e seu primeiro Script em C# na Unity.',
    estimatedMinutes: 14,
    xpReward: 35,
    theory: [
      {
        title: 'Como um Motor de Jogos Pensa? O Game Loop',
        text: 'Um jogo é essencialmente uma simulação em tempo real que roda 60 vezes por segundo (60 FPS). Em cada quadro (frame), o Game Loop executa 3 etapas cruciais: 1) Lê as entradas do jogador (Input), 2) Atualiza a lógica de física e posições (Update / FixedUpdate), e 3) Desenha o resultado na tela (Render).',
        keyPoints: [
          'GameObjects & Componentes: tudo no jogo é um objeto de cena equipado com componentes modulares (SpriteRenderer, Collider, Rigidbody2D).',
          'Linguagem C#: a linguagem padrão oficial para criar a inteligência e comportamentos na Unity.',
          'Transform: o componente obrigatório que define a Posição (X, Y), Rotação e Escala de qualquer entidade no mundo 2D.',
        ],
        conceptCard: '🎮 Modelo Mental Unity: Um GameObject é um ator no palco; os componentes e scripts são as habilidades que esse ator possui.',
      },
    ],
    codeExample: {
      language: 'csharp',
      code: `// Primeiro Script de Movimento 2D na Unity em C#
using UnityEngine;

public class JogadorControlador : MonoBehaviour
{
    [Header("Configurações de Movimentação")]
    public float velocidade = 5.0f;

    // Chamado uma vez a cada frame do jogo
    void Update()
    {
        float inputX = Input.GetAxisRaw("Horizontal"); // -1 (Esquerda) a +1 (Direita)
        float inputY = Input.GetAxisRaw("Vertical");   // -1 (Baixo) a +1 (Cima)

        Vector2 direcao = new Vector2(inputX, inputY).normalized;
        transform.Translate(direcao * velocidade * Time.deltaTime);
    }
}`,
      explanation: 'Script MonoBehaviour clássico com normalização de vetor e compensação de taxa de quadros com Time.deltaTime.',
    },
    simulation: {
      type: 'simulated',
      defaultOutput: `[Unity 2D Engine] Scene 'Level_01' carregada.\nJogadorControlador instanciado com velocidade 5.0.\nGame Loop ativo rodando a 60 FPS estáveis.`,
      description: 'Simulador do Game Loop da Unity 2D.',
    },
    exercise: {
      id: 'ex-first-contact-unity2d',
      prompt: 'Por que multiplicamos o movimento do jogador por "Time.deltaTime" no método Update da Unity?',
      type: 'multiple_choice',
      options: [
        'Para garantir que a velocidade do jogo seja constante por segundo, independente se o computador roda a 30, 60 ou 144 FPS',
        'Para fazer o personagem pular mais alto',
        'Para desativar a física da gravidade',
        'Porque a Unity não compila sem essa palavra',
      ],
      correctAnswer: 'Para garantir que a velocidade do jogo seja constante por segundo, independente se o computador roda a 30, 60 ou 144 FPS',
      hint: 'Pense na independência de framerate (taxa de quadros).',
      explanation: 'Time.deltaTime representa a fração de segundo decorrida desde o último frame, equalizando a velocidade em qualquer hardware.',
    },
  },

  // ==========================================
  // 23. UNITY 3D
  // ==========================================
  unity_3d: {
    title: '1. Introdução & Primeiros Contactos: O Espaço Tridimensional e Vetores',
    description: 'Explore as 3 dimensões (X, Y, Z), câmeras com perspectiva, materiais PBR e física com Rigidbody em Unity 3D.',
    estimatedMinutes: 14,
    xpReward: 35,
    theory: [
      {
        title: 'A Transição do 2D para o Espaço 3D Real',
        text: 'No desenvolvimento tridimensional, adicionamos o eixo Z (profundidade). Agora os objetos possuem malhas poligonais (Meshes), materiais que respondem à luz física (PBR - Physically Based Rendering) e colisores 3D com cálculos vetoriais no espaço global e local.',
        keyPoints: [
          'Eixos no Espaço: X (Largura), Y (Altura) e Z (Profundidade/Frente).',
          'Rigidbody 3D: componente que confere massa, gravidade e detecção de forças físicas realistas.',
          'Câmeras 3D: projeção em perspectiva com campo de visão (Field of View / FOV).',
        ],
        conceptCard: '🧊 Vetores 3D: Vector3.forward representa o vetor (0, 0, 1), a direção para onde o objeto está olhando no espaço.',
      },
    ],
    codeExample: {
      language: 'csharp',
      code: `// Primeiro Script de Física 3D na Unity
using UnityEngine;

[RequireComponent(typeof(Rigidbody))]
public class ProjétilFisico3D : MonoBehaviour
{
    public float forcaImpulso = 20.0f;
    private Rigidbody rb;

    void Start()
    {
        rb = GetComponent<Rigidbody>();
        // Aplica impulso instantâneo na direção frontal do objeto (Eixo Z Local)
        rb.AddForce(transform.forward * forcaImpulso, ForceMode.Impulse);
    }
}`,
      explanation: 'Aplicação de força física com Rigidbody 3D usando ForceMode.Impulse.',
    },
    simulation: {
      type: 'simulated',
      defaultOutput: `[Unity 3D Engine] Instanciando ProjétilFisico3D no espaço (X:0, Y:1.5, Z:0).\nForça de impulso 20.0 aplicada com sucesso no vetor frontal.\nSimulação PhysX 3D ativa.`,
      description: 'Simulação do motor de física PhysX 3D.',
    },
    exercise: {
      id: 'ex-first-contact-unity3d',
      prompt: 'Qual componente é OBRIGATÓRIO em um GameObject na Unity 3D para que ele responda à gravidade e colisões físicas com forças reais?',
      type: 'multiple_choice',
      options: [
        'Rigidbody',
        'AudioListener',
        'Lightmap',
        'TextMesh',
      ],
      correctAnswer: 'Rigidbody',
      hint: 'Pense no componente de "Corpo Rígido" da física.',
      explanation: 'O Rigidbody conecta o objeto ao motor de física PhysX, calculando massa, gravidade, inércia e respostas a impactos.',
    },
  },

  // ==========================================
  // 24. UNREAL ENGINE & C++
  // ==========================================
  unreal_cpp: {
    title: '1. Introdução & Primeiros Contactos: A Engine Triple-A Mais Poderosa do Mundo',
    description: 'Conheça o ecossistema da Epic Games, a hierarquia de AActor e UObject, arquitetura de C++ com macros UPROPERTY e Unreal Blueprints.',
    estimatedMinutes: 15,
    xpReward: 35,
    theory: [
      {
        title: 'Por Que a Unreal Engine Lidera a Indústria de Filmes e Jogos AAA?',
        text: 'Utilizada em produções cinematográficas (como The Mandalorian) e jogos de altíssimo orçamento (Fortnite, Cyberpunk em transição), a Unreal Engine 5 oferece tecnologias de ponta como Nanite (geometria micropoligonal ilimitada) e Lumen (iluminação global em tempo real). Seu núcleo é construído em C++ de altíssima performance.',
        keyPoints: [
          'Hierarquia Fundamental: UObject (classe base do ecossistema) -> AActor (qualquer entidade que pode ser colocada no mapa/mundo).',
          'Macros do Unreal Header Tool (UCLASS, UPROPERTY, UFUNCTION): integram o código C++ com a interface gráfica e o editor de Blueprints.',
          'Pawn e Character: atores especializados com suporte a controle do jogador e IA.',
        ],
        conceptCard: '⚔️ Dualidade Unreal: A performance brutal do C++ combinada com a velocidade de prototipagem visual das Blueprints.',
      },
    ],
    codeExample: {
      language: 'cpp',
      code: `// Primeiro Actor em C++ na Unreal Engine 5
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "MeuPrimeiroActor.generated.h"

UCLASS()
class MEUJOGO_API AMeuPrimeiroActor : public AActor
{
    GENERATED_BODY()
    
public:	
    AMeuPrimeiroActor();

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Gameplay")
    float PontosDeVida = 100.0f;

protected:
    virtual void BeginPlay() override;

public:	
    virtual void Tick(float DeltaTime) override;
};`,
      explanation: 'Header (.h) de um AActor profissional na Unreal Engine com macro UPROPERTY para exposição no editor.',
    },
    simulation: {
      type: 'simulated',
      defaultOutput: `[Unreal Engine 5 Engine] Compilando Unreal Header Tool (UHT)...\nUCLASS AMeuPrimeiroActor registrado com sucesso no Reflection System.\nActor pronto para spawn na Scene com 100 PontosDeVida.`,
      description: 'Simulação do Unreal Build Tool e Reflection System.',
    },
    exercise: {
      id: 'ex-first-contact-unreal',
      prompt: 'Na Unreal Engine em C++, qual é a classe base de qualquer objeto que possa ser posicionado ou instanciado dentro de um nível/mundo de jogo?',
      type: 'multiple_choice',
      options: [
        'AActor',
        'UWidget',
        'FVector',
        'USoundWave',
      ],
      correctAnswer: 'AActor',
      hint: 'Começa com a letra A (de Actor).',
      explanation: 'Na Unreal Engine, qualquer objeto que possua coordenadas de transformação e possa existir no mundo de jogo herda direta ou indiretamente de AActor.',
    },
  },

  // ==========================================
  // 25. GODOT ENGINE
  // ==========================================
  godot_engine: {
    title: '1. Introdução & Primeiros Contactos: A Revolução Open-Source dos Nós e Cenas',
    description: 'Descubra a elegância da arquitetura baseada em Árvore de Nós (Nodes), a linguagem GDScript inspirada em Python e crie seu primeiro nó interativo.',
    estimatedMinutes: 12,
    xpReward: 35,
    theory: [
      {
        title: 'A Engine Livre e Amada pela Comunidade Global',
        text: 'Godot é 100% gratuita, open-source e leve (um executável de menos de 100MB que inicia em 2 segundos). Sua arquitetura não usa complexos sistemas de entidades-componentes, mas uma Árvore de Nós (Node Tree) extremamente intuitiva onde tudo é uma Cena instanciável.',
        keyPoints: [
          'Árvore de Nós (Scene Tree): um nó faz uma única coisa (Sprite2D, CollisionShape2D, CharacterBody2D) e nós filhos herdam as transformações do pai.',
          'GDScript: linguagem limpa, tipada e ultrarrápida projetada especificamente para criação de jogos.',
          'Sinais (Signals): sistema desacoplado de eventos do tipo Publish/Subscribe para comunicação segura entre nós.',
        ],
        conceptCard: '🤖 Filosofia Godot: "Cenas dentro de cenas". Um personagem é uma cena, um inimigo é uma cena, e a fase é uma grande cena que reúne todas as outras.',
      },
    ],
    codeExample: {
      language: 'gdscript',
      code: `# Primeiro Script GDScript em Godot 4
extends CharacterBody2D

@export var velocidade: float = 300.0

func _physics_process(delta: float) -> void:
    # Captura a direção do input com os mapeamentos do projeto
    var direcao: Vector2 = Input.get_vector("ui_left", "ui_right", "ui_up", "ui_down")
    
    velocity = direcao * velocidade
    move_and_slide() # Função nativa que calcula física e colisões automaticamente`,
      explanation: 'Script em GDScript 4 com anotação @export e método move_and_slide() para movimentação física.',
    },
    simulation: {
      type: 'simulated',
      defaultOutput: `[Godot 4 Engine] Scene Tree inicializada com nó raiz 'Main'.\nCharacterBody2D instanciado (GDScript compilado em 1ms).\nLoop de física ativo em 60Hz.`,
      description: 'Simulador do runtime Godot 4.',
    },
    exercise: {
      id: 'ex-first-contact-godot',
      prompt: 'Na Godot Engine, qual é a estrutura fundamental utilizada para organizar todos os elementos visuais, lógicos e sonoros de um jogo?',
      type: 'multiple_choice',
      options: [
        'Uma Árvore de Nós (Scene Tree) composta por nós especializados (Nodes)',
        'Um arquivo único de Excel',
        'Apenas código binário sem interface gráfica',
        'Páginas estáticas de HTML',
      ],
      correctAnswer: 'Uma Árvore de Nós (Scene Tree) composta por nós especializados (Nodes)',
      hint: 'Lembre-se do conceito central da Godot: "Nodes and Scenes".',
      explanation: 'Na Godot, todo jogo é construído aninhando nós especializados em uma árvore hierárquica (Scene Tree).',
    },
  },

  // ==========================================
  // 26. JOGOS MULTIPLAYER
  // ==========================================
  game_multiplayer: {
    title: '1. Introdução & Primeiros Contactos: Redes em Tempo Real e Servidor Autoritativo',
    description: 'Entenda a diferença entre TCP e UDP, predição no cliente (Client-Side Prediction), interpolação de lag e a arquitetura de servidores de jogos.',
    estimatedMinutes: 14,
    xpReward: 35,
    theory: [
      {
        title: 'O Desafio Extremo de Conectar Jogadores ao Redor do Planeta',
        text: 'Jogos multiplayer em tempo real (como shooters e battle royales) enfrentam a física da velocidade da luz: um pacote de dados leva milissegundos para viajar entre continentes (Latência / Ping). Para que a experiência seja fluida e justa, usamos a arquitetura de Servidor Autoritativo: o servidor é a fonte única da verdade e os clientes preveem o futuro localmente para esconder o lag.',
        keyPoints: [
          'UDP vs TCP: o UDP não espera confirmações lentas de pacotes, priorizando velocidade máxima para posições em tempo real.',
          'Client-Side Prediction: o jogador vê sua própria ação instantaneamente sem esperar o ping de ida e volta ao servidor.',
          'Anti-Cheat: nunca confie no cliente. Todas as validações críticas (dano, munição, velocidade) são calculadas no servidor.',
        ],
        conceptCard: '🌐 Regra Sagrada: "O Cliente é apenas um terminal burro de exibição. A Verdade Absoluta reside no Servidor Autoritativo."',
      },
    ],
    codeExample: {
      language: 'typescript',
      code: `// Modelo Conceitual de Servidor Autoritativo em Tempo Real
interface PlayerInput {
  playerId: string;
  seqNumber: number;
  inputVector: { x: number; y: number };
  deltaTime: number;
}

class GameServer {
  private playerPositions = new Map<string, { x: number; y: number }>();
  private readonly maxSpeed = 10.0;

  public processInput(input: PlayerInput) {
    const current = this.playerPositions.get(input.playerId) || { x: 0, y: 0 };
    
    // Validação no servidor contra cheats de super-velocidade (Speedhack)
    const moveDistance = Math.hypot(input.inputVector.x, input.inputVector.y) * input.deltaTime;
    if (moveDistance > this.maxSpeed * input.deltaTime * 1.1) {
      console.warn(\`[Anti-Cheat] Movimento suspeito rejeitado para \${input.playerId}\`);
      return current;
    }

    current.x += input.inputVector.x * this.maxSpeed * input.deltaTime;
    current.y += input.inputVector.y * this.maxSpeed * input.deltaTime;
    this.playerPositions.set(input.playerId, current);
    return current;
  }
}

console.log("Servidor Autoritativo pronto para processar inputs a 64 Tickrate!");`,
      explanation: 'Lógica simplificada de servidor autoritativo com validação de inputs e prevenção de speedhack.',
    },
    simulation: {
      type: 'simulated',
      defaultOutput: `Servidor Autoritativo pronto para processar inputs a 64 Tickrate!\n[UDP Socket] Porta 7777 escutando.\nTickrate: 64 updates/segundo sincronizados.`,
      description: 'Simulação de servidor dedicado de jogo multiplayer em tempo real.',
    },
    exercise: {
      id: 'ex-first-contact-multiplayer',
      prompt: 'Por que jogos em tempo real (como CS2 ou Rocket League) adotam o modelo de Servidor Autoritativo em vez de deixar os computadores dos jogadores decidirem os resultados?',
      type: 'multiple_choice',
      options: [
        'Para evitar trapaças (cheats) e garantir um único estado verdadeiro e sincronizado da partida para todos os jogadores',
        'Porque a internet proíbe a comunicação direta entre computadores',
        'Para gastar mais memória no computador do usuário',
        'Não há motivo, é apenas uma escolha arbitrária',
      ],
      correctAnswer: 'Para evitar trapaças (cheats) e garantir um único estado verdadeiro e sincronizado da partida para todos os jogadores',
      hint: 'Pense em segurança, validação de regras e anti-cheat.',
      explanation: 'Se os clientes tivessem autoridade, qualquer usuário mal-intencionado poderia modificar a memória do jogo e alterar sua própria vida ou teletransportar.',
    },
  },

  // ==========================================
  // 27. JOGOS MOBILE
  // ==========================================
  game_mobile_dev: {
    title: '1. Introdução & Primeiros Contactos: Performance Extrema e Controles Touch',
    description: 'Aprenda a otimizar jogos para smartphones, controle térmico, economia de bateria, taxa de Draw Calls e inputs por gestos e toques.',
    estimatedMinutes: 12,
    xpReward: 30,
    theory: [
      {
        title: 'As Regras de Ouro dos Jogos para Celulares',
        text: 'Diferente de PCs com placas de vídeo gigantes e coolers ruidosos, smartphones possuem limitações severas de dissipação de calor (Thermal Throttling) e bateria. Um jogo mobile de sucesso deve otimizar o Atlas de Texturas, reduzir Draw Calls (chamadas de desenho na GPU) e ter controles de toque altamente responsivos.',
        keyPoints: [
          'Draw Calls & Batching: agrupar múltiplos sprites e objetos em um único lote de renderização para poupar a GPU móvel.',
          'Inputs Touch Multi-Toque: suporte a gestos como arrastar, pinça (pinch to zoom) e joystick virtual.',
          'Resoluções Dinâmicas e Proporções de Tela: adaptar a interface perfeitamente para entalhes (Notches) e telas de diferentes fabricantes.',
        ],
        conceptCard: '📱 Mandamento Mobile: 60 FPS com celular frio e bateria duradoura é a marca de um jogo profissional.',
      },
    ],
    codeExample: {
      language: 'csharp',
      code: `// Reconhecimento de Toque Simples e Duplo em Mobile (Unity C#)
using UnityEngine;

public class MobileTouchManager : MonoBehaviour
{
    void Update()
    {
        if (Input.touchCount > 0)
        {
            Touch primeiroToque = Input.GetTouch(0);

            if (primeiroToque.phase == TouchPhase.Began)
            {
                Vector2 posicaoToque = primeiroToque.position;
                Debug.Log($"Toque registrado nas coordenadas de tela: {posicaoToque}");
            }
        }
    }
}`,
      explanation: 'Tratamento nativo de eventos da API de toque móvel (TouchPhase.Began).',
    },
    simulation: {
      type: 'simulated',
      defaultOutput: `[Mobile Engine] Input System configurado para Touchscreen.\nAtlas de texturas compactado em formato ASTC.\nFrame rate travado em 60 FPS com baixo consumo de bateria.`,
      description: 'Simulador de ambiente móvel para jogos Android/iOS.',
    },
    exercise: {
      id: 'ex-first-contact-mobilegames',
      prompt: 'Qual é o principal perigo de não otimizar a quantidade de Draw Calls e texturas pesadas em um jogo para smartphone?',
      type: 'multiple_choice',
      options: [
        'O smartphone aquece rapidamente (Thermal Throttling), consome a bateria em poucos minutos e a taxa de FPS cai bruscamente',
        'O celular desinstala o sistema operacional',
        'A tela do aparelho muda de tamanho fisicamente',
        'O som do jogo para de funcionar para sempre',
      ],
      correctAnswer: 'O smartphone aquece rapidamente (Thermal Throttling), consome a bateria em poucos minutos e a taxa de FPS cai bruscamente',
      hint: 'Pense no aquecimento do aparelho e no consumo de bateria.',
      explanation: 'O calor excessivo força o processador móvel a reduzir seu clock para não queimar (Thermal Throttling), arruinando a experiência do jogador.',
    },
  },

  // ==========================================
  // 28. PUBLICAÇÃO DE JOGOS PC
  // ==========================================
  game_pc_publishing: {
    title: '1. Introdução & Primeiros Contactos: Do Protótipo à Steam e Lançamento Global',
    description: 'Entenda o ciclo completo de publicação de jogos para PC, integração com a Steamworks SDK (Conquistas, Nuvem), empacotamento e marketing.',
    estimatedMinutes: 12,
    xpReward: 30,
    theory: [
      {
        title: 'A Jornada de Lançar um Jogo Comercial no Mercado',
        text: 'Criar o jogo é apenas metade da jornada. Para transformá-lo em um produto de sucesso comercial na Steam ou Epic Games Store, você precisa dominar o Steamworks SDK (para conquistas, salvamento na nuvem Steam Cloud e matchmaking), preparar builds otimizados para Windows, Mac e Steam Deck, e construir sua página de loja para converter Wishlists.',
        keyPoints: [
          'Steamworks SDK: biblioteca em C++ que integra o jogo ao ecossistema da Steam (achievements, cloud saves, estatísticas).',
          'Suporte ao Steam Deck: validação de resolução 1280x800, controles padrão de gamepad e eficiência de energia.',
          'Página da Loja & Wishlists: a métrica número um que determina o alcance algorítmico do seu lançamento.',
        ],
        conceptCard: '🚀 Sucesso Comercial: Wishlists construídas com consistência garantem que a Steam destaque seu jogo na aba de Lançamentos Populares.',
      },
    ],
    codeExample: {
      language: 'cpp',
      code: `// Integração Conceitual com Steamworks SDK em C++
#include "steam/steam_api.h"

void InicializarSteam() {
    if (SteamAPI_RestartAppIfNecessary(480)) { // 480 é o AppID de testes (Spacewar)
        exit(1);
    }

    if (!SteamAPI_Init()) {
        printf("Falha crítica: O cliente da Steam precisa estar aberto!\\n");
        return;
    }

    const char* nomeUsuario = SteamFriends()->GetPersonaName();
    printf("Steamworks conectado! Jogador autenticado: %s\\n", nomeUsuario);
    
    // Desbloqueando a primeira conquista
    SteamUserStats()->SetAchievement("ACH_FIRST_GAME_LAUNCH");
    SteamUserStats()->StoreStats();
}`,
      explanation: 'Inicialização da Steamworks API e disparo de conquista do jogador.',
    },
    simulation: {
      type: 'simulated',
      defaultOutput: `Steamworks conectado! Jogador autenticado: Dev_Gamer_Pro\n[Steam API] Conquista 'ACH_FIRST_GAME_LAUNCH' desbloqueada com sucesso!\nCloud Save sincronizado.`,
      description: 'Simulação do cliente Steamworks SDK.',
    },
    exercise: {
      id: 'ex-first-contact-pcpublishing',
      prompt: 'Qual é a principal função da biblioteca Steamworks SDK ao ser integrada em um jogo para computador?',
      type: 'multiple_choice',
      options: [
        'Conectar o jogo aos recursos da plataforma Steam, como Conquistas (Achievements), Saves na Nuvem e autenticação do jogador',
        'Substituir a placa de vídeo do computador',
        'Impedir que o jogador pause o jogo',
        'Fazer o download automático de outros jogos sem permissão',
      ],
      correctAnswer: 'Conectar o jogo aos recursos da plataforma Steam, como Conquistas (Achievements), Saves na Nuvem e autenticação do jogador',
      hint: 'Pense nos recursos sociais da Steam como Conquistas e Nuvem.',
      explanation: 'A Steamworks SDK é o elo oficial que permite ao jogo interagir com os serviços da Steam de forma segura e padronizada.',
    },
  },

  // ==========================================
  // 29. FUNDAMENTOS DE GAME DESIGN
  // ==========================================
  game_fundamentals: {
    title: '1. Introdução & Primeiros Contactos: Teoria do Flow, Core Loops e GDD',
    description: 'Compreenda a psicologia da diversão, a Teoria do Flow de Csikszentmihalyi, os 4 pilares do Game Design e construa seu primeiro Core Loop.',
    estimatedMinutes: 12,
    xpReward: 30,
    theory: [
      {
        title: 'O Que Faz um Jogo Ser Genuinamente Viciante e Marcante?',
        text: 'Belos gráficos não salvam um jogo com design ruim. O Game Design é a ciência de projetar regras, desafios e feedbacks emocionais para manter o jogador no "Estado de Flow" (a zona psicológica ideal entre o tédio de um jogo fácil demais e a frustração de um jogo punitivo sem sentido).',
        keyPoints: [
          'O Core Loop (Ciclo Principal): a sequência repetitiva de ações que o jogador executa a cada minuto (ex: Explorar -> Coletar Recursos -> Criar Equipamento -> Enfrentar Monstro -> Repetir com mais poder).',
          'Game Design Document (GDD): o documento vivo que serve como bússola de visão para programadores, artistas e compositores.',
          'Feedback & Juice: sons, partículas e respostas táteis que tornam cada interação do jogador prazerosa e impactante.',
        ],
        conceptCard: '🎯 Teoria do Flow: Se a habilidade do jogador cresce, o desafio deve acompanhar harmonicamente essa evolução.',
      },
    ],
    codeExample: {
      language: 'markdown',
      code: `### Estrutura de um Core Loop de Sucesso (Exemplo: RPG de Sobrevivência)

1. **Ação Primária (30 segundos):**
   - Coletar madeira e minérios no mapa enquanto evita predadores.

2. **Recompensa Imediata (2 minutos):**
   - Forjar uma espada melhor na bancada de trabalho.

3. **Desafio Médio (10 minutos):**
   - Entrar em uma masmorra e derrotar o chefe local para desbloquear uma nova área.

4. **Meta de Longo Prazo (Horas):**
   - Construir uma fortaleza impenetrável e zerar a campanha.`,
      explanation: 'Estruturação do Core Loop dividida em micro-ações, recompensas e metas de longo prazo.',
    },
    simulation: {
      type: 'simulated',
      defaultOutput: `[Game Design Validator] Análise de Core Loop concluída:\n- Retenção Projetada: Alta\n- Curva de Dificuldade: Progressiva e balanceada (Flow State garantido).`,
      description: 'Simulação e auditoria de Game Design e balanceamento de Core Loop.',
    },
    exercise: {
      id: 'ex-first-contact-gamedesign',
      prompt: 'Na psicologia dos jogos e no Game Design, o que é o "Estado de Flow"?',
      type: 'multiple_choice',
      options: [
        'O equilíbrio perfeito onde o nível de desafio do jogo acompanha exatamente a evolução da habilidade do jogador, evitando o tédio e a frustração',
        'O momento em que a internet cai durante uma partida online',
        'A velocidade de rotação da câmera no espaço 3D',
        'Um tipo de animação de água no motor gráfico',
      ],
      correctAnswer: 'O equilíbrio perfeito onde o nível de desafio do jogo acompanha exatamente a evolução da habilidade do jogador, evitando o tédio e a frustração',
      hint: 'Pense no equilíbrio entre Habilidade e Dificuldade.',
      explanation: 'O Estado de Flow mantém o jogador imerso e motivado, ajustando os desafios conforme ele ganha maestria nas mecânicas.',
    },
  },

  // ==========================================
  // 30. GRÁFICOS & IA PARA JOGOS
  // ==========================================
  game_graphics_ai: {
    title: '1. Introdução & Primeiros Contactos: Shaders Gráficos e Inteligência de NPCs',
    description: 'Entenda como a GPU processa pixels através de Shaders (HLSL/GLSL), Máquinas de Estados Finitos (FSM) para NPCs e navegação com NavMesh.',
    estimatedMinutes: 14,
    xpReward: 35,
    theory: [
      {
        title: 'A Conexão Entre Computação Gráfica e Inteligência Artificial',
        text: 'Jogos modernos dependem de dois pilares técnicos de elite: 1) Shaders na GPU que calculam reflexos de água, fogo e pós-processamento através de equações matemáticas executadas em milhões de pixels simultaneamente; e 2) Algoritmos de IA (como Máquinas de Estados Finitos e Árvores de Comportamento / Behavior Trees) que fazem os inimigos tomarem decisões táticas realistas.',
        keyPoints: [
          'Vertex Shader vs Fragment/Pixel Shader: o primeiro calcula a posição dos vértices 3D; o segundo calcula a cor final de cada pixel.',
          'Finite State Machine (FSM): modelo mental onde o inimigo só pode estar em um estado por vez (Patrulhar, Perseguir, Atacar, Fugir).',
          'NavMesh & A* Pathfinding: malha de navegação que permite aos inimigos desviarem de paredes e encontrarem o menor caminho até o jogador.',
        ],
        conceptCard: '🧠 IA de Jogos: Não precisa ser uma rede neural pesada; uma máquina de estados bem orquestrada cria a ilusão perfeita de inteligência humana.',
      },
    ],
    codeExample: {
      language: 'csharp',
      code: `// Máquina de Estados Finitos (FSM) Simples e Elegante para Inimigo
using UnityEngine;

public enum EstadoInimigo { Patrulha, Perseguicao, Ataque }

public class InimigoIA : MonoBehaviour
{
    public EstadoInimigo estadoAtual = EstadoInimigo.Patrulha;
    public Transform jogador;
    public float distanciaVisao = 10.0f;
    public float distanciaAtaque = 2.0f;

    void Update()
    {
        float distancia = Vector3.Distance(transform.position, jogador.position);

        switch (estadoAtual)
        {
            case EstadoInimigo.Patrulha:
                if (distancia < distanciaVisao) estadoAtual = EstadoInimigo.Perseguicao;
                break;
            case EstadoInimigo.Perseguicao:
                if (distancia < distanciaAtaque) estadoAtual = EstadoInimigo.Ataque;
                else if (distancia > distanciaVisao * 1.5f) estadoAtual = EstadoInimigo.Patrulha;
                break;
            case EstadoInimigo.Ataque:
                if (distancia > distanciaAtaque) estadoAtual = EstadoInimigo.Perseguicao;
                break;
        }
    }
}`,
      explanation: 'Implementação de uma Máquina de Estados Finitos (FSM) orientada a distâncias de percepção.',
    },
    simulation: {
      type: 'simulated',
      defaultOutput: `[AI System] Inimigo instanciado no estado: PATRULHA.\n[Percepção] Jogador detectado a 8.5m -> Transição de Estado: PERSEGUIÇÃO.\nNavMesh Agent calculando rota com algoritmo A*.`,
      description: 'Simulação do motor de IA e tomada de decisão de NPCs.',
    },
    exercise: {
      id: 'ex-first-contact-graphicsai',
      prompt: 'Qual é o papel principal de uma Máquina de Estados Finitos (FSM) na programação de inteligência artificial de inimigos em jogos?',
      type: 'multiple_choice',
      options: [
        'Organizar o comportamento da IA em estados claros e mutuamente exclusivos (ex: Patrulha, Perseguição, Ataque) com transições bem definidas',
        'Calcular a conta de luz do servidor de jogos',
        'Renderizar sombras dinâmicas na GPU',
        'Fazer o download de músicas na internet',
      ],
      correctAnswer: 'Organizar o comportamento da IA em estados claros e mutuamente exclusivos (ex: Patrulha, Perseguição, Ataque) com transições bem definidas',
      hint: 'Pense em como um NPC decide se deve andar, perseguir ou atacar.',
      explanation: 'A FSM impede comportamentos conflitantes e garante transições lógicas e previsíveis para a inteligência de NPCs.',
    },
  },

  // ==========================================
  // 31. BLENDER 3D
  // ==========================================
  blender_3d: {
    title: '1. Introdução & Primeiros Contactos: A Arte 3D para Motores de Jogos',
    description: 'Entenda a geometria poligonal (Vértices, Arestas, Faces), topologia limpa para jogos (Low Poly), UV Mapping e exportação GLTF/FBX.',
    estimatedMinutes: 14,
    xpReward: 35,
    theory: [
      {
        title: 'O Software 3D Mais Versátil do Mundo',
        text: 'Blender é a suíte 3D open-source líder absoluta para modelagem, escultura digital, texturização PBR, animação e rigging. Na indústria de jogos, o Blender é a ferramenta onde você constrói os modelos que depois são importados e programados em engines como Unity, Unreal e Godot.',
        keyPoints: [
          'A Anatomia da Geometria 3D: Vértices (pontos no espaço), Arestas/Edges (linhas conectando vértices) e Faces (polígonos formados por arestas).',
          'Topologia e Quads: criar polígonos de 4 lados (Quads) garante deformações suaves e sem artefatos gráficos durante as animações.',
          'UV Unwrapping: a técnica matemática de abrir o modelo 3D em um plano 2D para aplicar texturas e materiais detalhados.',
        ],
        conceptCard: '🎨 Regra de Ouro: Modelos para jogos devem ser otimizados (Game-Ready), com contagem equilibrada de polígonos e materiais eficientes.',
      },
    ],
    codeExample: {
      language: 'python',
      code: `# Automação e Scripting Python no Blender 3D (bpy)
import bpy

# Limpando a cena padrão
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

# Criando um Cubo Geométrico Game-Ready
bpy.ops.mesh.primitive_cube_add(size=2.0, location=(0, 0, 1))
cubo = bpy.context.active_object
cubo.name = "Hero_Asset_GameReady"

# Criando e aplicando um material PBR metálico
material = bpy.data.materials.new(name="PBR_Material_Metal")
material.use_nodes = True
bsdf = material.node_tree.nodes.get("Principled BSDF")
if bsdf:
    bsdf.inputs['Base Color'].default_value = (0.9, 0.4, 0.1, 1.0) # Laranja Cyber
    bsdf.inputs['Metallic'].default_value = 0.8
    bsdf.inputs['Roughness'].default_value = 0.2

cubo.data.materials.append(material)
print("Asset 3D criado e texturizado via Blender Python API!")`,
      explanation: 'Script na API oficial do Blender (bpy) para geração automatizada e texturização de assets 3D.',
    },
    simulation: {
      type: 'simulated',
      defaultOutput: `Asset 3D criado e texturizado via Blender Python API!\n[Blender Engine] Objeto 'Hero_Asset_GameReady' gerado com 8 vértices, 12 triângulos e Material PBR Metálico.\nPronto para exportação FBX/glTF para Unity/Unreal/Godot.`,
      description: 'Simulação do pipeline de modelagem e exportação 3D do Blender.',
    },
    exercise: {
      id: 'ex-first-contact-blender',
      prompt: 'Qual é o objetivo fundamental do processo de "UV Unwrapping" (Mapeamento UV) na modelagem 3D para jogos?',
      type: 'multiple_choice',
      options: [
        'Projetar a superfície tridimensional do modelo em um plano 2D para que texturas e pinturas possam ser aplicadas com precisão na malha',
        'Aumentar o peso do arquivo em 10 vezes',
        'Excluir as cores do modelo 3D',
        'Impedir que o modelo seja exportado para engines',
      ],
      correctAnswer: 'Projetar a superfície tridimensional do modelo em um plano 2D para que texturas e pinturas possam ser aplicadas com precisão na malha',
      hint: 'Pense em "descascar" uma laranja e esticar a casca em uma mesa plana.',
      explanation: 'O UV Mapping conecta cada ponto da textura 2D aos polígonos 3D do modelo, permitindo pinturas ricas, mapas de normais e rugosidade.',
    },
  },
};
