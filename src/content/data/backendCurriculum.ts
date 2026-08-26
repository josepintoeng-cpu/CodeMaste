import { TechCurriculumData } from '../techCurriculum';

export const BACKEND_CURRICULUM: Record<string, TechCurriculumData> = {
  // =========================================================================
  // NEXT.JS FULLSTACK
  // =========================================================================
  nextjs: {
    topicsByLevel: {
      iniciante: [
        {
          title: '1. App Router, Estrutura de Pastas e Layouts Aninhados',
          desc: 'Entenda a arquitetura moderna do Next.js baseada em pastas (app directory), page.tsx, layout.tsx e loading.tsx.',
          theory: [
            {
              title: 'A Revolução do App Router',
              text: 'No Next.js com App Router, a estrutura de pastas define as rotas da URL. Arquivos especiais (page, layout, loading, error, not-found) gerenciam a renderização com suporte nativo a React Server Components.',
              keyPoints: [
                'app/page.tsx: Rota raiz (/)',
                'app/dashboard/page.tsx: Rota /dashboard',
                'layout.tsx: Componente que preserva estado e não re-renderiza entre navegações.',
                'loading.tsx: Fallback de Suspense automático enquanto os dados carregam.',
              ],
            },
          ],
          code: `// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-zinc-950 text-zinc-100 font-sans">
        <nav className="p-4 border-b border-zinc-800 font-bold">Minha Plataforma Next.js</nav>
        <main className="p-8">{children}</main>
      </body>
    </html>
  );
}`,
          output: '[Next.js]: Rota raiz / montada com RootLayout e renderização no servidor.',
          lang: 'typescript',
          exercise: {
            id: 'ex-next-ini-1',
            prompt: 'No Next.js App Router, qual arquivo especial é responsável por definir a interface de uma rota específica acessível no navegador?',
            type: 'multiple_choice',
            options: ['page.tsx', 'index.html', 'route.ts', 'screen.tsx'],
            correctAnswer: 'page.tsx',
            hint: 'É o arquivo renderizado publicamente quando o usuário acessa aquele segmento de URL.',
            explanation: '`page.tsx` torna o segmento de pasta publicamente acessível como uma rota de página.',
          },
        },
        {
          title: '2. Server Components vs Client Components ("use client")',
          desc: 'Saiba quando rodar código no servidor com zero JS bundle e quando adicionar interatividade no cliente.',
          theory: [
            {
              title: 'Server por Padrão',
              text: 'No App Router, todos os componentes dentro de /app são Server Components por padrão. Para usar useState, useEffect ou event handlers (onClick), você deve adicionar a diretiva "use client" na primeira linha.',
              keyPoints: [
                'Server Component: Acesso a banco de dados, chaves de API secretas, performance instantânea.',
                'Client Component ("use client"): Event listeners, hooks de estado e APIs do navegador.',
              ],
            },
          ],
          code: `'use client';
import { useState } from 'react';

export function BotaoCurtir() {
  const [curtidas, setCurtidas] = useState(0);
  return (
    <button 
      onClick={() => setCurtidas(c => c + 1)}
      className="px-4 py-2 bg-pink-600 text-white rounded-lg font-bold"
    >
      Curtir ❤️ ({curtidas})
    </button>
  );
}`,
          output: '[Next.js Client Component]: Hidratado no navegador com interatividade ativa.',
          lang: 'typescript',
          exercise: {
            id: 'ex-next-ini-2',
            prompt: 'Qual diretiva deve ser colocada no topo de um arquivo no Next.js para permitir o uso de hooks como `useState` e eventos de clique?',
            type: 'multiple_choice',
            options: ["'use client'", "'use server'", "'client side'", "'enable hooks'"],
            correctAnswer: "'use client'",
            hint: 'Delimita a fronteira de hidratação do cliente.',
            explanation: "'use client' marca o limite onde o React deve empacotar o código para execução no navegador.",
          },
        },
        {
          title: '3. Data Fetching no Servidor e Estratégias de Cache',
          desc: 'Busque dados diretamente em Server Components usando async/await com cache e revalidação.',
          theory: [
            {
              title: 'Fetch Estendido no Next.js',
              text: 'O Next.js estende o fetch nativo para permitir controle granular de cache e revalidação estática ou dinâmica.',
              keyPoints: [
                'fetch(url, { cache: "force-cache" }): SSG (estático).',
                'fetch(url, { cache: "no-store" }): SSR (dinâmico a cada requisição).',
                'fetch(url, { next: { revalidate: 3600 } }): ISR (revalida a cada 1 hora).',
              ],
            },
          ],
          code: `// Server Component com Fetch
async function getProdutos() {
  const res = await fetch('https://api.loja.com/produtos', {
    next: { revalidate: 60 }, // Revalidação a cada 60 segundos (ISR)
  });
  return res.json();
}

export default async function PaginaCatalogo() {
  const produtos = await getProdutos();
  return (
    <div className="grid grid-cols-3 gap-4">
      {produtos.map((p: any) => <div key={p.id}>{p.nome} - R$ {p.preco}</div>)}
    </div>
  );
}`,
          output: '[Next.js Server]: Dados buscados em 12ms no servidor com cache ISR ativo.',
          lang: 'typescript',
          exercise: {
            id: 'ex-next-ini-3',
            prompt: 'Qual configuração no `fetch()` do Next.js ativa o padrão ISR (Incremental Static Regeneration), atualizando a página em background a cada N segundos?',
            type: 'multiple_choice',
            options: ['{ next: { revalidate: 60 } }', '{ cache: "no-cache" }', '{ ssr: true }', '{ timer: 60 }'],
            correctAnswer: '{ next: { revalidate: 60 } }',
            hint: 'Propriedade revalidate dentro do objeto `next`.',
            explanation: '`next: { revalidate: N }` armazena a página em cache e a regenera em segundo plano após N segundos da última requisição.',
          },
        },
        {
          title: '4. Otimização de Imagens e Fontes (<Image> & next/font)',
          desc: 'Elimine Cumulative Layout Shift (CLS) e sirva imagens WebP/AVIF compactadas automaticamente.',
          theory: [
            {
              title: 'Core Web Vitals no Next.js',
              text: 'O componente next/image redimensiona imagens sob demanda para a resolução da tela do usuário e aplica lazy loading automático.',
              keyPoints: [
                '<Image src="/hero.png" width={800} height={600} alt="Hero" priority />',
                'next/font: Carrega fontes do Google Fonts no momento do build sem requisições externas.',
              ],
            },
          ],
          code: `import Image from 'next/image';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export function BannerHero() {
  return (
    <section className={inter.className}>
      <Image 
        src="/banner.jpg" 
        alt="Banner Promocional" 
        width={1200} 
        height={400} 
        priority 
        className="rounded-2xl shadow-xl"
      />
    </section>
  );
}`,
          output: '[Next.js]: Imagem servida em formato AVIF moderno com lazy loading otimizado.',
          lang: 'typescript',
          exercise: {
            id: 'ex-next-ini-4',
            prompt: 'Qual propriedade no componente `<Image />` do Next.js deve ser utilizada na imagem principal (LCP) da página para desativar o lazy loading e carregá-la imediatamente?',
            type: 'multiple_choice',
            options: ['priority', 'lazy={false}', 'immediate', 'preload'],
            correctAnswer: 'priority',
            hint: 'Informa ao navegador que a imagem é prioritária para a pontuação de LCP.',
            explanation: 'A prop `priority` adiciona a tag `<link rel="preload">` no HTML, melhorando o Largest Contentful Paint (LCP).',
          },
        },
        {
          title: '5. Rotas Dinâmicas, Params e Route Handlers (app/api)',
          desc: 'Crie rotas com slugs dinâmicos ([id], [...slug]) e endpoints de backend REST em route.ts.',
          theory: [
            {
              title: 'Rotas Dinâmicas & Route Handlers',
              text: 'Pastas com colchetes [id] capturam parâmetros da URL. Arquivos route.ts exportam funções nomeadas GET, POST, PUT, DELETE para criar APIs REST.',
              keyPoints: [
                'app/blog/[slug]/page.tsx: Captura params.slug.',
                'app/api/usuarios/route.ts: export async function GET(req: Request) { ... }',
                'NextResponse.json({ data }, { status: 200 })',
              ],
            },
          ],
          code: `// app/api/status/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    ambiente: process.env.NODE_ENV,
  });
}`,
          output: `HTTP/1.1 200 OK
Content-Type: application/json
{"status":"online","timestamp":"2026-08-25T19:00:00.000Z","ambiente":"production"}`,
          lang: 'typescript',
          exercise: {
            id: 'ex-next-ini-5',
            prompt: 'Qual é o nome obrigatório do arquivo para criar um endpoint de API REST no App Router do Next.js?',
            type: 'multiple_choice',
            options: ['route.ts (ou route.js)', 'api.ts', 'server.ts', 'endpoint.ts'],
            correctAnswer: 'route.ts (ou route.js)',
            hint: 'Substituiu a antiga pasta pages/api.',
            explanation: '`route.ts` é a convenção do App Router para criar Route Handlers que respondem com JSON/dados a métodos HTTP.',
          },
        },
      ],
      intermediario: [
          {
            title: '1. Server Actions e Mutação de Dados',
            desc: 'Execute funções assíncronas no servidor diretamente a partir de formulários sem criar rotas de API manuais.',
            theory: [
              {
                title: 'O que são Server Actions?',
                text: 'Server Actions são funções assíncronas com a diretiva "use server" que podem ser chamadas em tags <form action={minhaAction}> ou em eventos onClick, cuidando de serialização e revalidação de rotas (revalidatePath).',
                keyPoints: [
                  'async function criarUsuario(formData: FormData) { "use server"; ... }',
                  'revalidatePath("/usuarios"): Atualiza o cache do servidor instantaneamente.',
                  'useActionState / useFormStatus para feedbacks de loading e erro.',
                ],
              },
            ],
            code: `// app/actions/usuarios.ts
'use server';
import { revalidatePath } from 'next/cache';
import db from '@/lib/db';

export async function criarUsuarioAction(formData: FormData) {
  const nome = formData.get('nome') as string;
  const email = formData.get('email') as string;

  await db.usuario.create({ data: { nome, email } });
  revalidatePath('/usuarios');
}`,
            output: '[Server Action]: Dados inseridos no banco. Cache de /usuarios revalidado.',
            lang: 'typescript',
            exercise: {
              id: 'ex-next-inter-1',
              prompt: 'Qual função do Next.js é chamada dentro de uma Server Action para purgar o cache do servidor e recarregar os dados na tela do usuário?',
              type: 'multiple_choice',
              options: ['revalidatePath(caminho)', 'refreshCache()', 'reloadPage()', 'clearServer()'],
              correctAnswer: 'revalidatePath(caminho)',
              hint: 'Invalida o cache do caminho especificado.',
              explanation: '`revalidatePath()` sinaliza ao Next.js para purgar o cache daquela rota e enviar o novo HTML/RSC atualizado.',
            },
          },
          {
            title: '2. Middleware, Edge Runtime e Proteção de Rotas com Auth',
            desc: 'Intercepte requisições antes que cheguem aos componentes para autenticação, geolocalização e redirecionamento.',
            theory: [
              {
                title: 'O poder do middleware.ts',
                text: 'O arquivo middleware.ts na raiz roda no Edge Runtime em milissegundos antes de qualquer rota ser processada.',
                keyPoints: [
                  'matcher: [ "/dashboard/:path*", "/admin/:path*" ]',
                  'Leitura e validação de cookies JWT.',
                  'NextResponse.redirect(new URL("/login", req.url))',
                ],
              },
            ],
            code: `// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;

  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};`,
            output: '[Middleware Edge]: Rota /dashboard protegida. Redirecionamento 307 para /login se sem token.',
            lang: 'typescript',
            exercise: {
              id: 'ex-next-inter-2',
              prompt: 'Onde o arquivo `middleware.ts` deve ser posicionado no projeto Next.js?',
              type: 'multiple_choice',
              options: ['Na raiz do projeto (no mesmo nível de `app/` ou `src/`)', 'Dentro de app/api/', 'Na pasta node_modules', 'Dentro do package.json'],
              correctAnswer: 'Na raiz do projeto (no mesmo nível de `app/` ou `src/`)',
              hint: 'Arquivo de configuração global de interceptação.',
              explanation: 'O middleware deve ficar na raiz do projeto (ou dentro de `src/`) para que o Next.js intercepte todas as rotas correspondentes ao matcher.',
            },
          },
          {
            title: '3. Streaming e Suspense com Parallel Routes e Intercepting Routes',
            desc: 'Crie modais acessíveis na URL (@modal) e renderização progressiva ultra-rápida.',
            theory: [
              {
                title: 'Rotas Paralelas e Interceptadas',
                text: 'Parallel Routes (@slot) renderizam múltiplos painéis independentes simultaneamente. Intercepting Routes ((..)foto/[id]) abrem detalhes em um modal sobre a página atual enquanto mantêm a URL compartilhável.',
                keyPoints: ['app/@modal/(.)foto/[id]/page.tsx', 'Suspense boundaries granulares'],
              },
            ],
            code: `// app/feed/@modal/(.)foto/[id]/page.tsx
export default function ModalFoto({ params }: { params: { id: string } }) {
  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <h2>Foto #{params.id}</h2>
        <p>Visualização em modal interceptado sobre o feed.</p>
      </div>
    </div>
  );
}`,
            output: '[Intercepting Route]: Modal aberto sobre o feed preservando contexto e URL dinâmica.',
            lang: 'typescript',
            exercise: {
              id: 'ex-next-inter-3',
              prompt: 'Qual convenção de pasta é utilizada para criar uma Parallel Route (rota paralela) no Next.js?',
              type: 'multiple_choice',
              options: ['Pastas com @ (ex: @analytics, @modal)', 'Pastas com _ (ex: _components)', 'Pastas com $', 'Pastas com #'],
              correctAnswer: 'Pastas com @ (ex: @analytics, @modal)',
              hint: 'Slots nomeados passados como props no layout.',
              explanation: 'Pastas com `@nome` viram slots passados diretamente como props para o `layout.tsx` pai (ex: `{ children, analytics, modal }`).',
            },
          },
          {
            title: '4. Otimização de SEO, Metadados Dinâmicos e OpenGraph (OG Images)',
            desc: 'Gere metadados estáticos e dinâmicos com generateMetadata() e imagens Open Graph automatizadas.',
            theory: [
              {
                title: 'SEO Moderno no Next.js',
                text: 'A Metadata API permite configurar title, description, tags canonical, Twitter Cards e OpenGraph com tipagem estrita.',
                keyPoints: [
                  'export async function generateMetadata({ params }): Promise<Metadata>',
                  'ImageResponse do @vercel/og para gerar imagens sociais dinâmicas em JSX.',
                ],
              },
            ],
            code: `import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const produto = await getProduto(params.id);
  return {
    title: \`\${produto.nome} | Minha Loja\`,
    description: produto.resumo,
    openGraph: {
      title: produto.nome,
      images: [{ url: produto.imagemUrl }],
    },
  };
}`,
            output: '[SEO]: Metadados Open Graph dinâmicos injetados no <head> com sucesso.',
            lang: 'typescript',
            exercise: {
              id: 'ex-next-inter-4',
              prompt: 'Qual função especial exportada em um `page.tsx` permite gerar metadados de SEO (título, descrição, OG) dinamicamente baseados nos dados da requisição?',
              type: 'multiple_choice',
              options: ['generateMetadata()', 'getSEO()', 'setHead()', 'meta()'],
              correctAnswer: 'generateMetadata()',
              hint: 'Retorna um objeto tipado `Metadata`.',
              explanation: '`generateMetadata` busca dados assíncronos e retorna a estrutura de metadados que o Next.js injeta no `<head>` do HTML gerado.',
            },
          },
          {
            title: '5. Autenticação Moderna com Auth.js (NextAuth v5)',
            desc: 'Implemente login social (OAuth com Google, GitHub), JWTs criptografados e sessões seguras.',
            theory: [
              {
                title: 'Auth.js v5 no App Router',
                text: 'A biblioteca padrão para autenticação no Next.js com suporte completo a Server Components, Server Actions e Edge Middleware.',
                keyPoints: [
                  'auth() helper para obter a sessão diretamente no servidor: const session = await auth();',
                  'Proteção com callbacks JWT e Session.',
                ],
              },
            ],
            code: `// auth.ts
import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  pages: { signIn: '/login' },
});`,
            output: '[Auth.js]: Provedor GitHub configurado com sessões JWT seguras.',
            lang: 'typescript',
            exercise: {
              id: 'ex-next-inter-5',
              prompt: 'Como você recupera a sessão do usuário logado dentro de um React Server Component no Next.js com Auth.js v5?',
              type: 'multiple_choice',
              options: ['const session = await auth();', 'useSession()', 'getCookies()', 'req.session'],
              correctAnswer: 'const session = await auth();',
              hint: 'Chamada assíncrona direta no servidor sem hooks de cliente.',
              explanation: 'A função `auth()` lê os cabeçalhos e cookies da requisição e retorna a sessão do usuário sem exigir a hidratação de hooks de cliente.',
            },
          },
        ],
        avancado: [
          {
            title: '1. Otimização de Performance, Turbopack e Standalone Output',
            desc: 'Gere builds Docker ultraleves com output: "standalone" e compile a aplicação em segundos com Turbopack.',
            theory: [
              {
                title: 'Produção e Empacotamento Docker',
                text: 'A flag output: "standalone" empacota apenas os arquivos estritamente necessários do node_modules, reduzindo a imagem Docker de 1GB para menos de 80MB.',
                keyPoints: ['next.config.js -> output: "standalone"', 'Multi-stage Dockerfile para Next.js'],
              },
            ],
            code: `// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    optimizePackageImports: ['lucide-react', 'lodash'],
  },
};
export default nextConfig;`,
            output: '[Build Standalone]: Imagem Docker otimizada gerada (78MB de tamanho total).',
            lang: 'javascript',
            exercise: {
              id: 'ex-next-avanc-1',
              prompt: 'Qual configuração no `next.config.js` é recomendada para criar imagens Docker compactas contendo apenas as dependências utilizadas?',
              type: 'multiple_choice',
              options: ["output: 'standalone'", "target: 'server'", "compress: false", "mode: 'docker'"],
              correctAnswer: "output: 'standalone'",
              hint: 'Cria uma pasta .next/standalone pronta para rodar apenas com `node server.js`.',
              explanation: "`output: 'standalone'` rastreia os imports do código e copia apenas os módulos essenciais, minimizando o tamanho final dos containers.",
            },
          },
        ],
        projetos: [
          {
            title: '1. Projeto: Plataforma de Conteúdo com ISR e CMS Headless',
            desc: 'Construa um portal de notícias de alta escala com revalidação estática sob demanda via Webhook.',
            theory: [{ title: 'On-Demand Revalidation', text: 'Revalidação instantânea de páginas estáticas via revalidateTag().', keyPoints: ['revalidateTag("artigos")', 'Webhooks de CMS'] }],
            code: `// app/api/revalidate/route.ts
import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-revalidate-secret');
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Token invalido' }, { status: 401 });
  }
  revalidateTag('artigos');
  return NextResponse.json({ revalidated: true, now: Date.now() });
}`,
            output: '[Next.js ISR]: Tag "artigos" purgada. Próxima requisição servirá o HTML atualizado do CMS.',
            lang: 'typescript',
            exercise: {
              id: 'ex-next-prj-1',
              prompt: 'Qual função é usada para revalidar sob demanda todos os dados associados a uma tag de cache específica?',
              type: 'multiple_choice',
              options: ['revalidateTag(tag)', 'clearTag()', 'purgeCache()', 'rebuild()'],
              correctAnswer: 'revalidateTag(tag)',
              hint: 'Invalida dados cacheados com `{ next: { tags: [tag] } }`.',
              explanation: '`revalidateTag()` invalida seletivamente apenas as entradas do cache associadas àquela tag sem afetar o restante do site.',
            },
          },
        ],
      },
      quizzesByLevel: {
        iniciante: [
          {
            id: 'nq-ini-1',
            question: 'No Next.js App Router, por que um Server Component não pode usar `useEffect`?',
            options: [
              'Porque Server Components rodam exclusivamente no servidor (onde não existe DOM ou ciclo de vida de navegador)',
              'Porque o Next.js não suporta React',
              'Porque precisa de uma licença paga',
              'Porque o useEffect foi removido do JavaScript',
            ],
            correctIndex: 0,
            explanation: 'Hooks de ciclo de vida e estado só funcionam no navegador em componentes declarados com "use client".',
          },
        ],
        intermediario: [
          {
            id: 'nq-int-1',
            question: 'O que a Server Action com a diretiva `"use server"` permite fazer?',
            options: [
              'Executar código seguro no backend chamado diretamente a partir de formulários ou componentes React sem criar endpoints REST manuais',
              'Subir o site para a nuvem',
              'Criar um novo banco de dados no computador',
              'Formatar arquivos de texto',
            ],
            correctIndex: 0,
            explanation: 'Server Actions executam mutations no servidor com total segurança de credenciais e revalidação de cache integrada.',
          },
        ],
        avancado: [
          {
            id: 'nq-av-1',
            question: 'Para que serve o arquivo `middleware.ts` no Next.js?',
            options: [
              'Interceptar todas as requisições no Edge antes da renderização para validação de autenticação, redirecionamentos e headers de segurança',
              'Armazenar imagens da galeria',
              'Salvar senhas no banco de dados',
              'Criar gráficos no dashboard',
            ],
            correctIndex: 0,
            explanation: 'O middleware permite processar requisições em alta velocidade na borda da rede antes que cheguem às páginas ou APIs.',
          },
        ],
        projetos: [
          {
            id: 'nq-prj-1',
            question: 'Qual é o benefício do On-Demand Revalidation com `revalidateTag` em relação a revalidação por tempo fixo?',
            options: [
              'O site permanece 100% estático e ultra-rápido até que o conteúdo seja editado no CMS, quando um webhook aciona a revalidação imediata',
              'O servidor gasta mais processamento',
              'As imagens ficam em preto e branco',
              'Os usuários precisam atualizar a página duas vezes',
            ],
            correctIndex: 0,
            explanation: 'A revalidação sob demanda combina a velocidade máxima de páginas estáticas em CDN com a atualização instantânea no momento exato da publicação.',
          },
        ],
      },
    },

  // =========================================================================
  // APIS REST & GRAPHQL + SEGURANÇA (OWASP)
  // =========================================================================
  apis: {
    topicsByLevel: {
      iniciante: [
        {
          title: '1. Fundamentos do Protocolo HTTP/1.1 e HTTP/2: Métodos, Headers e Status Codes',
          desc: 'Domine a semântica REST: GET, POST, PUT, PATCH, DELETE e a taxonomia de códigos 2xx, 3xx, 4xx, 5xx.',
          theory: [
            {
              title: 'A Arquitetura RESTful',
              text: 'REST (Representational State Transfer) utiliza os verbos HTTP para expressar ações sobre recursos nomeados por substantivos plurais (ex: /api/v1/usuarios).',
              keyPoints: [
                'Idempotência: GET, PUT, DELETE são idempotentes (múltiplas chamadas geram o mesmo resultado). POST não é.',
                '200 OK, 201 Created, 204 No Content',
                '400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 429 Too Many Requests',
                '500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable',
              ],
            },
          ],
          code: `// Resposta padronizada de API REST
{
  "status": "success",
  "statusCode": 201,
  "data": {
    "id": "usr_99812",
    "nome": "Dev Lead",
    "email": "lead@tech.io",
    "criadoEm": "2026-08-25T19:30:00.000Z"
  },
  "links": {
    "self": "/api/v1/usuarios/usr_99812"
  }
}`,
          output: `HTTP/1.1 201 Created
Location: /api/v1/usuarios/usr_99812
Content-Type: application/json; charset=utf-8`,
          lang: 'json',
          exercise: {
            id: 'ex-api-ini-1',
            prompt: 'Qual código de status HTTP deve ser retornado por uma API ao criar um novo recurso no banco com sucesso?',
            type: 'multiple_choice',
            options: ['201 Created', '200 OK', '204 No Content', '302 Found'],
            correctAnswer: '201 Created',
            hint: 'Indica que a requisição foi bem sucedida e resultou na criação de um novo registro.',
            explanation: '201 Created é o status semântico padrão para operações POST que persistem uma nova entidade.',
          },
        },
        {
          title: '2. Autenticação com JSON Web Tokens (JWT) e Anatomia do Token',
          desc: 'Compreenda os 3 segmentos do JWT (Header, Payload, Signature) e assinatura HMAC-SHA256 / RSA.',
          theory: [
            {
              title: 'Como o JWT Funciona',
              text: 'Um JWT é um token stateless codificado em Base64URL separado por pontos: [Header].[Payload].[Signature]. O payload contém claims públicas e a assinatura impede adulteração.',
              keyPoints: [
                'Header: Algoritmo de criptografia (ex: {"alg": "HS256", "typ": "JWT"}).',
                'Payload: Dados do usuário (ex: sub, exp, role). NUNCA coloque senhas aqui!',
                'Signature: HMACSHA256(base64Url(header) + "." + base64Url(payload), segredo).',
              ],
              conceptCard: '⚠️ Alerta de Segurança: O payload do JWT é apenas codificado em Base64, NÃO criptografado. Qualquer um pode decodificar e ler seu conteúdo.',
            },
          ],
          code: `import jwt from 'jsonwebtoken';

const SEGREDO = process.env.JWT_SECRET!;

// Gerar token com expiração curta de 15 minutos
export function gerarAccessToken(usuarioId: string, role: string) {
  return jwt.sign(
    { sub: usuarioId, role },
    SEGREDO,
    { expiresIn: '15m', algorithm: 'HS256' }
  );
}`,
          output: '[JWT]: Token assinado gerado: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3JfMSJ9... (15m exp)',
          lang: 'typescript',
          exercise: {
            id: 'ex-api-ini-2',
            prompt: 'O payload de um token JWT padrão é criptografado por padrão?',
            type: 'multiple_choice',
            options: [
              'Não, ele é apenas codificado em Base64URL e pode ser facilmente lido por qualquer pessoa; por isso dados sensíveis como senhas nunca devem ser colocados no payload',
              'Sim, é criptografado com chave militar quântica',
              'Sim, ninguém consegue ver os dados',
              'O JWT não possui payload',
            ],
            correctAnswer: 'Não, ele é apenas codificado em Base64URL e pode ser facilmente lido por qualquer pessoa; por isso dados sensíveis como senhas nunca devem ser colocados no payload',
            hint: 'A assinatura garante a integridade, não o sigilo.',
            explanation: 'JWT padrão (JWS) apenas assina os dados para garantir que não foram alterados; para confidencialidade seria necessário JWE (JSON Web Encryption).',
          },
        },
        {
          title: '3. Validação de Esquemas e Sanitização com Zod e DTOs',
          desc: 'Proteja suas APIs contra injeção de dados maliciosos e campos inesperados.',
          theory: [
            {
              title: 'Validação no Ponto de Entrada',
              text: 'Toda requisição externa deve ser tratada como hostil. Bibliotecas como Zod validam tipos, tamanhos e formatos antes que o controller processe os dados.',
              keyPoints: [
                'z.object({ email: z.string().email(), senha: z.string().min(8) })',
                'Strip de propriedades desconhecidas para evitar Mass Assignment.',
              ],
            },
          ],
          code: `import { z } from 'zod';

export const CriarContaSchema = z.object({
  nome: z.string().min(3).max(50),
  email: z.string().email(),
  senha: z.string().min(8).regex(/[A-Z]/, 'Precisa de maiúscula'),
  idade: z.number().int().min(18),
});

export type CriarContaDTO = z.infer<typeof CriarContaSchema>;`,
          output: '[Zod Validator]: Esquema compilado. Validação e sanitização automáticas ativas.',
          lang: 'typescript',
          exercise: {
            id: 'ex-api-ini-3',
            prompt: 'Qual vulnerabilidade ocorre quando uma API aceita todos os campos do body sem filtro e um atacante envia `"isAdmin": true` no JSON de cadastro?',
            type: 'multiple_choice',
            options: ['Mass Assignment (Atribuição em Massa Indevida)', 'Cross-Site Scripting (XSS)', 'Buffer Overflow', 'DNS Spoofing'],
            correctAnswer: 'Mass Assignment (Atribuição em Massa Indevida)',
            hint: 'Ocorre quando o ORM grava propriedades não autorizadas diretamente no modelo.',
            explanation: 'Mass Assignment acontece quando campos privilegiados enviados no JSON são gravados no banco sem validação por um DTO estrito.',
          },
        },
        {
          title: '4. Documentação Interativa com OpenAPI / Swagger',
          desc: 'Gere contratos de API padronizados e documentação interativa com Swagger UI.',
          theory: [
            {
              title: 'O Padrão OpenAPI 3.0',
              text: 'A especificação OpenAPI define formalmente endpoints, parâmetros, respostas e autenticações, permitindo geração automática de SDKs clientes (Orval, RTK Query).',
              keyPoints: ['Paths, Schemas, SecuritySchemes BearerAuth', 'Geração de clientes TypeScript automáticos'],
            },
          ],
          code: `/**
 * @openapi
 * /api/v1/usuarios:
 *   get:
 *     summary: Lista todos os usuários
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista retornada com sucesso
 */`,
          output: '[Swagger UI]: Documentação interativa disponível em /api/docs.',
          lang: 'javascript',
          exercise: {
            id: 'ex-api-ini-4',
            prompt: 'Qual a principal vantagem de manter a documentação da sua API no padrão OpenAPI / Swagger?',
            type: 'multiple_choice',
            options: [
              'Permite testar requisições em uma interface visual e gerar clientes tipados automaticamente para Frontend e Mobile',
              'Aumenta o limite de upload do servidor',
              'Substitui o banco de dados',
              'Elimina a necessidade de código no backend',
            ],
            correctAnswer: 'Permite testar requisições em uma interface visual e gerar clientes tipados automaticamente para Frontend e Mobile',
            hint: 'Serve como contrato formal entre equipes de backend e frontend.',
            explanation: 'OpenAPI é o padrão global para descrever APIs REST, facilitando testes, documentação e geração de código de integração.',
          },
        },
        {
          title: '5. Rate Limiting, Throttling e Proteção contra DoS',
          desc: 'Limite o número de requisições por IP/Token usando o algoritmo Token Bucket no Redis.',
          theory: [
            {
              title: 'Prevenção de Abuso',
              text: 'Rate limiting protege os servidores contra ataques de negação de serviço e testes de força bruta de credenciais.',
              keyPoints: [
                'Headers padrão: X-RateLimit-Limit, X-RateLimit-Remaining, Retry-After',
                'Status 429 Too Many Requests ao exceder a cota.',
              ],
            },
          ],
          code: `import rateLimit from 'express-rate-limit';

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5,                   // Máximo de 5 tentativas de login por IP
  message: { erro: 'Muitas tentativas. Bloqueado por 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});`,
          output: `HTTP/1.1 429 Too Many Requests
Retry-After: 900
Content-Type: application/json
{"erro":"Muitas tentativas. Bloqueado por 15 minutos."}`,
          lang: 'typescript',
          exercise: {
            id: 'ex-api-ini-5',
            prompt: 'Qual código de status HTTP deve ser retornado por um middleware de Rate Limiting quando o cliente ultrapassa o limite de requisições permitidas?',
            type: 'multiple_choice',
            options: ['429 Too Many Requests', '404 Not Found', '500 Server Error', '403 Forbidden'],
            correctAnswer: '429 Too Many Requests',
            hint: 'Código semântico para excesso de requisições.',
            explanation: '429 Too Many Requests informa que o cliente excedeu o rate limit e deve aguardar antes de tentar novamente.',
          },
        },
      ],
      intermediario: [
          {
            title: '1. OWASP API Security Top 10: BOLA / IDOR e BFLA',
            desc: 'Detecte e corrija vulnerabilidades críticas de autorização no nível de objeto (Broken Object Level Authorization).',
            theory: [
              {
                title: 'BOLA (Broken Object Level Authorization)',
                text: 'BOLA (antigo IDOR) é a vulnerabilidade #1 em APIs. Ocorre quando o usuário altera o ID na URL (ex: GET /faturas/102) e o backend entrega a fatura de outro usuário sem checar se aquele ID pertence a ele.',
                keyPoints: [
                  'Sempre validar: WHERE id = :id AND usuario_id = :sessionUserId',
                  'Nunca confiar apenas no ID fornecido pelo cliente.',
                  'Usar UUIDs v4 ou ULIDs em vez de IDs sequenciais (1, 2, 3).',
                ],
              },
            ],
            code: `// Código SEGURO contra BOLA / IDOR
export async function buscarFatura(faturaId: string, usuarioAutenticadoId: string) {
  const fatura = await db.fatura.findFirst({
    where: {
      id: faturaId,
      usuarioId: usuarioAutenticadoId, // VERIFICAÇÃO DE PROPRIEDADE OBRIGATÓRIA!
    },
  });

  if (!fatura) {
    throw new NotFoundError('Fatura não encontrada ou acesso não autorizado');
  }
  return fatura;
}`,
            output: '[Segurança API]: Consulta validada com vínculo estrito de propriedade do usuário.',
            lang: 'typescript',
            exercise: {
              id: 'ex-api-inter-1',
              prompt: 'Como mitigar a vulnerabilidade BOLA (Broken Object Level Authorization / IDOR) em consultas a recursos por ID?',
              type: 'multiple_choice',
              options: [
                'Sempre verificar no banco de dados se o recurso solicitado pertence ao ID do usuário autenticado no token da sessão atual',
                'Ocultar a URL',
                'Remover o banco de dados',
                'Tornar todos os dados públicos',
              ],
              correctAnswer: 'Sempre verificar no banco de dados se o recurso solicitado pertence ao ID do usuário autenticado no token da sessão atual',
              hint: 'Validação de escopo de posse em nível de objeto.',
              explanation: 'A aplicação deve sempre validar se o usuário autenticado na sessão possui permissão de leitura sobre o registro específico solicitado.',
            },
          },
          {
            title: '2. GraphQL: Schemas, Queries, Mutations, Resolvers e Prevenção de Query Depth DoS',
            desc: 'Construa APIs flexíveis com Apollo Server / Yoga e proteja contra ataques de consultas recursivas infinitas.',
            theory: [
              {
                title: 'GraphQL & Segurança',
                text: 'GraphQL permite ao cliente solicitar exatamente os campos necessários. Porém, consultas recursivas profundas (ex: autor -> posts -> autor -> posts) podem derrubar o servidor.',
                keyPoints: [
                  'type Query { usuario(id: ID!): Usuario }',
                  'type Mutation { criarPost(input: PostInput!): Post }',
                  'graphql-depth-limit: Limita a profundidade máxima das queries a 4 ou 5 níveis.',
                ],
              },
            ],
            code: `import { createYoga, createSchema } from 'graphql-yoga';

const schema = createSchema({
  typeDefs: \`
    type Query {
      status: String!
      me: Usuario
    }
    type Usuario {
      id: ID!
      nome: String!
      email: String!
    }
  \`,
  resolvers: {
    Query: {
      status: () => 'API GraphQL Operacional',
      me: (_, __, ctx) => ctx.usuario,
    },
  },
});`,
            output: '[GraphQL Yoga]: Schema compilado com proteção de Depth Limit e Type Safety.',
            lang: 'typescript',
            exercise: {
              id: 'ex-api-inter-2',
              prompt: 'Qual risco de segurança é específico de APIs GraphQL devido à flexibilidade de seleção de campos encadeados?',
              type: 'multiple_choice',
              options: [
                'Ataques de Negação de Serviço (DoS) através de consultas com profundidade excessiva (Query Depth Abuse) ou queries recursivas infinitas',
                'Erros de compilação CSS',
                'Vazamento de cabos de rede',
                'Desativação do monitor do servidor',
              ],
              correctAnswer: 'Ataques de Negação de Serviço (DoS) através de consultas com profundidade excessiva (Query Depth Abuse) ou queries recursivas infinitas',
              hint: 'O cliente pode enviar queries com dezenas de níveis aninhados consumindo 100% da CPU.',
              explanation: 'Em GraphQL, atacantes podem criar queries recursivas maliciosas; a defesa consiste em aplicar validadores de complexidade (Query Complexity) e limite de profundidade (Depth Limit).',
            },
          },
          {
            title: '3. Headers de Segurança HTTP (Helmet): CSP, HSTS, CORS e X-Content-Type-Options',
            desc: 'Configure cabeçalhos de proteção contra XSS, Clickjacking, MIME-sniffing e configure CORS seguro.',
            theory: [
              {
                title: 'Hardening de Cabeçalhos HTTP',
                text: 'Configurar cabeçalhos de segurança instrui o navegador a aplicar políticas restritivas de execução.',
                keyPoints: [
                  'Content-Security-Policy (CSP): Restringe de onde scripts e estilos podem ser carregados.',
                  'Strict-Transport-Security (HSTS): Força HTTPS exclusivo por 1 ano.',
                  'Access-Control-Allow-Origin: Configuração restrita sem usar wildcard (* com credenciais).',
                ],
              },
            ],
            code: `import helmet from 'helmet';
import cors from 'cors';
import express from 'express';

const app = express();

app.use(helmet({
  contentSecurityPolicy: true,
  crossOriginEmbedderPolicy: true,
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
}));

app.use(cors({
  origin: ['https://app.empresa.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));`,
            output: `[Security Headers]: CSP, HSTS, X-Frame-Options DENY e CORS restrito ativos.`,
            lang: 'typescript',
            exercise: {
              id: 'ex-api-inter-3',
              prompt: 'Qual cabeçalho HTTP de segurança força o navegador a se comunicar com o domínio exclusivamente através de conexões criptografadas HTTPS?',
              type: 'multiple_choice',
              options: ['Strict-Transport-Security (HSTS)', 'X-Powered-By', 'Cache-Control', 'Set-Cookie'],
              correctAnswer: 'Strict-Transport-Security (HSTS)',
              hint: 'HTTP Strict Transport Security.',
              explanation: 'O header HSTS previne ataques de SSL Stripping e Man-in-the-Middle ao proibir conexões HTTP não encriptadas para o domínio.',
            },
          },
        ],
        avancado: [
          {
            title: '1. Arquitetura de Microsserviços e gRPC com Protocol Buffers (Protobuf)',
            desc: 'Comunicação binária ultrarrápida entre serviços de backend com gRPC sobre HTTP/2.',
            theory: [
              {
                title: 'Por que gRPC?',
                text: 'O gRPC utiliza serialização binária com Protocol Buffers em vez de JSON textual, reduzindo a latência de rede em até 7x e o uso de CPU entre microsserviços.',
                keyPoints: ['service PagamentoService { rpc Processar (PagamentoRequest) returns (PagamentoResponse); }', 'Streaming bidirecional'],
              },
            ],
            code: `// proto/pagamento.proto
syntax = "proto3";

package pagamentos;

message PagamentoRequest {
  string usuario_id = 1;
  double valor = 2;
  string moeda = 3;
}

message PagamentoResponse {
  string transacao_id = 1;
  bool sucesso = 2;
}`,
            output: '[Protobuf]: Contrato binário compilado. Stubs gRPC gerados para Node.js, Go e Python.',
            lang: 'protobuf',
            exercise: {
              id: 'ex-api-avanc-1',
              prompt: 'Qual protocolo de transporte de rede e formato de serialização o gRPC utiliza para garantir alto desempenho?',
              type: 'multiple_choice',
              options: ['HTTP/2 com serialização binária Protocol Buffers (Protobuf)', 'HTTP/1.0 com XML', 'FTP com texto puro', 'WebRTC com JPEG'],
              correctAnswer: 'HTTP/2 com serialização binária Protocol Buffers (Protobuf)',
              hint: 'Multiplexação de conexões HTTP/2 e payloads binários compactos.',
              explanation: 'gRPC aproveita multiplexação de streams e compressão de headers do HTTP/2 com a eficiência binária de structs Protobuf.',
            },
          },
        ],
        projetos: [
          {
            title: '1. Projeto: API Gateway com Autenticação OAuth2 / JWT e Rate Limit no Redis',
            desc: 'Construa um gateway reverso que centraliza autenticação, métricas e roteamento de microsserviços.',
            theory: [{ title: 'API Gateway Pattern', text: 'Ponto único de entrada para clientes externos com terminação TLS.', keyPoints: ['Roteamento dinâmico', 'Rate limit distribuído'] }],
            code: `// Gateway Handler
export async function rotearRequisicao(req: Request) {
  const token = req.headers.get('authorization');
  const usuario = await validarJwtToken(token);
  await checarRateLimitRedis(usuario.id);
  return fetch('http://microsservico-pedidos/pedidos', { ...req });
}`,
            output: '[API Gateway]: 10.000 req/s processadas com latência média de 3ms.',
            lang: 'typescript',
            exercise: {
              id: 'ex-api-prj-1',
              prompt: 'Por que o Redis é amplamente utilizado como backend de armazenamento para Rate Limiting em gateways corporativos?',
              type: 'multiple_choice',
              options: ['Porque é um banco in-memory com operações atômicas em microssegundos (INCR, EXPIRE)', 'Porque roda em HTML', 'Porque não precisa de memória', 'Porque traduz texto para áudio'],
              correctAnswer: 'Porque é um banco in-memory com operações atômicas em microssegundos (INCR, EXPIRE)',
              hint: 'Operações atômicas ultra-rápidas na memória RAM.',
              explanation: 'O comando INCR do Redis é atômico e executa em submilisegundos, evitando race conditions em contadores de requisições concorrentes.',
            },
          },
        ],
      },
      quizzesByLevel: {
        iniciante: [
          {
            id: 'aq-ini-1',
            question: 'O que significa um método HTTP ser "Idempotente"?',
            options: [
              'Executar a mesma requisição uma ou múltiplas vezes consecutivas produz o mesmo efeito final no estado do servidor (ex: GET, PUT, DELETE)',
              'O método só pode ser chamado uma vez por ano',
              'O método não aceita parâmetros',
              'O método converte texto em binário',
            ],
            correctIndex: 0,
            explanation: 'Idempotência garante que retentativas de rede (retries) em caso de falha de conexão não dupliquem operações no banco.',
          },
        ],
        intermediario: [
          {
            id: 'aq-int-1',
            question: 'Qual é a principal recomendação da OWASP para mitigar o ataque de Broken Object Level Authorization (BOLA)?',
            options: [
              'Garantir que todas as consultas ao banco validem explicitamente se o objeto requisitado pertence ao ID do usuário autenticado na sessão',
              'Desativar o protocolo HTTPS',
              'Usar senhas de apenas 3 dígitos',
              'Ocultar as tabelas do banco',
            ],
            correctIndex: 0,
            explanation: 'A validação contextual de posse impede que um usuário acesse registros de terceiros manipulando IDs de requisição.',
          },
        ],
        avancado: [
          {
            id: 'aq-av-1',
            question: 'Como o gRPC consegue ser significativamente mais rápido que APIs REST JSON tradicionais?',
            options: [
              'Pela utilização de Protocol Buffers (serialização binária compacta) sobre multiplexação de streams do protocolo HTTP/2',
              'Porque ele não usa placas de rede',
              'Porque ele roda em computadores quânticos',
              'Porque não faz validação de dados',
            ],
            correctIndex: 0,
            explanation: 'A serialização binária reduz o tamanho do payload e dispensa o parsing de texto JSON, enquanto o HTTP/2 elimina o custo de novos handshakes TCP.',
          },
        ],
        projetos: [
          {
            id: 'aq-prj-1',
            question: 'Qual a responsabilidade primária de um API Gateway em uma arquitetura de microsserviços?',
            options: [
              'Atuar como ponto único de entrada para autenticação centralizada, rate limiting, logging de métricas e roteamento de chamadas para serviços internos',
              'Renderizar componentes React no navegador do usuário',
              'Armazenar backups em fita magnética',
              'Desligar os servidores à noite',
            ],
            correctIndex: 0,
            explanation: 'O Gateway isola os microsserviços internos do tráfego público, padronizando a segurança e políticas de acesso.',
          },
        ],
      },
    },
  };
