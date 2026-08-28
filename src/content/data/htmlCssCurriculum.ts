import { TechCurriculumData } from '../techCurriculum';

export const HTML_CSS_CURRICULUM: Record<'html' | 'css', TechCurriculumData> = {
  // =========================================================================
  // HTML5 SEMÂNTICO & MODERNO
  // =========================================================================
  html: {
    topicsByLevel: {
      iniciante: [
        {
          title: '1. Estrutura Básica do HTML5 e Tags Semânticas',
          desc: 'Aprenda a estruturar documentos web semânticos com doctype, header, nav, main, article, section e footer.',
          theory: [
            {
              title: 'O que é HTML Semântico?',
              text: 'HTML semântico utiliza tags que descrevem o significado do conteúdo para o navegador, leitores de tela e robôs de busca (SEO). Em vez de usar apenas <div> e <span>, utilizamos elementos que expressam a hierarquia e o propósito do documento.',
              keyPoints: [
                '<!DOCTYPE html> declara a versão moderna do HTML5.',
                '<main> define o conteúdo principal único da página.',
                '<header>, <nav>, <section>, <article> e <footer> estruturam o fluxo.',
                '<meta charset="UTF-8"> garante suporte a caracteres internacionais e acentuação.',
              ],
              conceptCard: '💡 SEO & Acessibilidade: Páginas semânticas são melhor indexadas pelo Google e lidas perfeitamente por leitores de tela para deficientes visuais.',
            },
          ],
          code: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Portal Semântico</title>
</head>
<body>
  <header>
    <h1>TechMaster Studio</h1>
    <nav>
      <a href="#cursos">Cursos</a>
      <a href="#sobre">Sobre</a>
    </nav>
  </header>
  <main>
    <article>
      <h2>Boas-Vindas ao Curso</h2>
      <p>Aprenda desenvolvimento web moderno do zero.</p>
    </article>
  </main>
  <footer>
    <p>&copy; 2026 TechMaster. Todos os direitos reservados.</p>
  </footer>
</body>
</html>`,
          output: `[HTML DOM]: Documento parseado com sucesso. Árvore semântica: header > nav, main > article, footer.`,
          lang: 'html',
          exercise: {
            id: 'ex-html-ini-1',
            prompt: 'Qual elemento semântico do HTML5 representa o bloco de conteúdo principal e exclusivo de uma página da web?',
            type: 'multiple_choice',
            options: ['<main>', '<section>', '<article>', '<div>'],
            correctAnswer: '<main>',
            hint: 'É a tag que envolve o conteúdo único e principal do documento.',
            explanation: 'A tag <main> deve conter o conteúdo central único da página, não devendo ser repetida no mesmo documento.',
          },
        },
        {
          title: '2. Textos, Listas Ordenadas/Não-Ordenadas e Links',
          desc: 'Formate parágrafos, ênfases, listas numeradas, com marcadores e hyperlinks externos e âncoras.',
          theory: [
            {
              title: 'Hierarquia de Títulos e Listas',
              text: 'A hierarquia de títulos vai de <h1> (mais importante) até <h6>. Listas são estruturadas com <ul> para marcadores e <ol> para números sequenciais, contendo elementos <li>.',
              keyPoints: [
                'Use apenas um <h1> por página para clareza estrutural e SEO.',
                '<a href="URL" target="_blank" rel="noopener noreferrer"> para links externos seguros.',
                '<strong> para ênfase importante e <em> para ênfase contextual.',
              ],
            },
          ],
          code: `<section>
  <h2>Etapas de Aprendizado</h2>
  <ol>
    <li>Dominar HTML5 semântico</li>
    <li>Estilizar com CSS3 e Tailwind</li>
    <li>Programar lógica com JavaScript moderno</li>
  </ol>
  <p>Visite a <a href="https://developer.mozilla.org" target="_blank" rel="noopener noreferrer">MDN Web Docs</a> para documentação oficial.</p>
</section>`,
          output: `[HTML Render]: Lista ordenada com 3 itens e link seguro rel="noopener noreferrer" renderizados.`,
          lang: 'html',
          exercise: {
            id: 'ex-html-ini-2',
            prompt: 'Para criar uma lista sequencial numerada (1, 2, 3...) em HTML5, qual tag contêiner deve ser utilizada?',
            type: 'multiple_choice',
            options: ['<ol>', '<ul>', '<dl>', '<list>'],
            correctAnswer: '<ol>',
            hint: 'Significa "Ordered List".',
            explanation: '<ol> cria listas ordenadas (numeradas), enquanto <ul> cria listas não ordenadas com marcadores circulares.',
          },
        },
        {
          title: '3. Imagens Responsivas, Mídias e Atributos de Acessibilidade (alt)',
          desc: 'Insira imagens com atributo alt descritivo, figure, figcaption, áudio e vídeo nativos.',
          theory: [
            {
              title: 'Mídias com Acessibilidade (A11y)',
              text: 'Toda imagem informativa deve possuir o atributo alt com descrição do seu conteúdo. Para figuras legendadas, a combinação de <figure> e <figcaption> é o padrão semântico.',
              keyPoints: [
                '<img src="foto.jpg" alt="Descrição precisa" loading="lazy" />',
                'loading="lazy" adia o carregamento de imagens fora da tela inicial para acelerar o site.',
                '<video controls> e <audio controls> para reprodução nativa sem plugins.',
              ],
            },
          ],
          code: `<figure>
  <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97" 
       alt="Desenvolvedor trabalhando em notebook com código na tela" 
       width="600" 
       height="400" 
       loading="lazy" />
  <figcaption>Ambiente profissional de codificação web.</figcaption>
</figure>`,
          output: `[HTML Media]: Imagem com carregamento preguiçoso (lazy) e legenda semântica pronta.`,
          lang: 'html',
          exercise: {
            id: 'ex-html-ini-3',
            prompt: 'Qual atributo é indispensável na tag <img> para fornecer texto alternativo a leitores de tela e mecanismos de busca?',
            type: 'multiple_choice',
            options: ['alt', 'title', 'src', 'caption'],
            correctAnswer: 'alt',
            hint: 'Abreviação de "alternative text".',
            explanation: 'O atributo `alt` é fundamental para a acessibilidade na web, sendo lido por softwares de tecnologia assistiva.',
          },
        },
        {
          title: '4. Formulários: Inputs, Labels, Selects e Validação HTML5',
          desc: 'Construa formulários interativos acessíveis com validação de tipos (email, password, number, tel, date).',
          theory: [
            {
              title: 'Associação de Labels e Inputs',
              text: 'Todo campo de entrada de dados precisa estar associado a uma <label> usando os atributos "for" e "id". Isso amplia a área de clique e garante leitura correta por tecnologias assistivas.',
              keyPoints: [
                '<label for="email">E-mail:</label> <input id="email" type="email" required />',
                'Atributos: required, pattern, minlength, maxlength, placeholder.',
                'Botão de submissão com <button type="submit">.',
              ],
            },
          ],
          code: `<form action="/api/cadastro" method="POST">
  <div>
    <label for="campo-nome">Nome Completo:</label>
    <input type="text" id="campo-nome" name="nome" required minlength="3" placeholder="Seu nome" />
  </div>
  <div>
    <label for="campo-email">E-mail Profissional:</label>
    <input type="email" id="campo-email" name="email" required placeholder="dev@exemplo.com" />
  </div>
  <button type="submit">Cadastrar Aluno</button>
</form>`,
          output: `[HTML Form]: Formulário validado com inputs associados a labels via atributos for/id.`,
          lang: 'html',
          exercise: {
            id: 'ex-html-ini-4',
            prompt: 'Como associar corretamente uma tag <label> ao seu respectivo <input id="senha">?',
            type: 'multiple_choice',
            options: [
              '<label for="senha">',
              '<label to="senha">',
              '<label link="senha">',
              '<label target="senha">',
            ],
            correctAnswer: '<label for="senha">',
            hint: 'O atributo na label recebe o mesmo valor do atributo id do input.',
            explanation: 'O atributo `for` na label deve coincidir exatamente com o atributo `id` do input correspondente.',
          },
        },
        {
          title: '5. Tabelas Semânticas: thead, tbody, tfoot, th com scope',
          desc: 'Organize dados tabulares com cabeçalhos acessíveis, linhas, colunas e resumo de totais.',
          theory: [
            {
              title: 'Estruturação de Dados Tabulares',
              text: 'Tabelas devem ser usadas estritamente para dados tabulares (nunca para layout visual). As seções <thead>, <tbody> e <tfoot> delimitam a estrutura de dados.',
              keyPoints: [
                '<th> define células de cabeçalho com atributo scope="col" ou scope="row".',
                '<caption> insere o título descritivo da tabela.',
                '<tr> agrupa células em linhas e <td> contém dados regulares.',
              ],
            },
          ],
          code: `<table>
  <caption>Relatório de Conclusão de Módulos</caption>
  <thead>
    <tr>
      <th scope="col">Módulo</th>
      <th scope="col">Horas</th>
      <th scope="col">Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>HTML5 & Semântica</td>
      <td>10h</td>
      <td>Concluído</td>
    </tr>
    <tr>
      <td>CSS3 Moderno</td>
      <td>15h</td>
      <td>Em Progresso</td>
    </tr>
  </tbody>
</table>`,
          output: `[HTML Table]: Tabela estruturada com 1 caption, 1 thead, 1 tbody e escopos th válidos.`,
          lang: 'html',
          exercise: {
            id: 'ex-html-ini-5',
            prompt: 'Qual atributo da tag <th> especifica se o cabeçalho se refere a uma coluna ou a uma linha da tabela?',
            type: 'multiple_choice',
            options: ['scope="col" ou scope="row"', 'type="header"', 'role="title"', 'align="center"'],
            correctAnswer: 'scope="col" ou scope="row"',
            hint: 'Define o escopo de leitura para acessibilidade.',
            explanation: 'O atributo `scope` (`col` ou `row`) informa a leitores de tela a orientação dos dados associados àquele cabeçalho.',
          },
        },
      ],
      intermediario: [
        {
          title: '1. Otimização de Performance: picture, srcset e sizes',
          desc: 'Sirva imagens em formatos modernos (AVIF, WebP) com resoluções adaptadas a cada densidade de tela.',
          theory: [
            {
              title: 'Imagens Responsivas com <picture>',
              text: 'O elemento <picture> permite que o navegador selecione o melhor formato de imagem e resolução com base em media queries e densidade de pixels (DPI), economizando até 80% de banda.',
              keyPoints: [
                '<source type="image/avif" srcset="foto.avif">',
                '<source type="image/webp" srcset="foto.webp">',
                '<img src="foto.jpg" alt="..." fallback obrigatório>',
              ],
            },
          ],
          code: `<picture>
  <source type="image/avif" srcset="hero-large.avif 1200w, hero-small.avif 600w" sizes="(max-width: 768px) 100vw, 1200px">
  <source type="image/webp" srcset="hero-large.webp 1200w, hero-small.webp 600w" sizes="(max-width: 768px) 100vw, 1200px">
  <img src="hero-fallback.jpg" alt="Banner do Curso Web" width="1200" height="600" loading="eager">
</picture>`,
          output: `[HTML Picture]: Negociação de formatos AVIF/WebP ativa com fallback JPEG.`,
          lang: 'html',
          exercise: {
            id: 'ex-html-inter-1',
            prompt: 'Qual elemento HTML permite definir múltiplas fontes de imagem com formatos de próxima geração (AVIF/WebP) e media queries?',
            type: 'multiple_choice',
            options: ['<picture>', '<canvas>', '<figure>', '<embed>'],
            correctAnswer: '<picture>',
            hint: 'Contêiner que agrupa elementos <source> e uma tag <img> de fallback.',
            explanation: 'O elemento <picture> oferece controle declarativo total sobre quais recursos de imagem o navegador deve requisitar.',
          },
        },
        {
          title: '2. Meta Tags Avançadas, Open Graph e Twitter Cards para SEO',
          desc: 'Configure o cabeçalho <head> para compartilhamento perfeito em WhatsApp, Twitter, LinkedIn e Google.',
          theory: [
            {
              title: 'Protocolo Open Graph (OG)',
              text: 'Meta tags Open Graph definem como as páginas aparecem quando compartilhadas em redes sociais e apps de mensagens.',
              keyPoints: [
                '<meta property="og:title" content="...">',
                '<meta property="og:description" content="...">',
                '<meta property="og:image" content="URL_ABSOLUTA">',
                '<meta name="twitter:card" content="summary_large_image">',
              ],
            },
          ],
          code: `<head>
  <meta property="og:title" content="Aprenda Programação do Zero | TechMaster">
  <meta property="og:description" content="Plataforma de cursos interativos com execução de código em tempo real.">
  <meta property="og:image" content="https://exemplo.com/assets/og-banner.png">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary_large_image">
</head>`,
          output: `[HTML Head]: Metadados Open Graph e Twitter Cards configurados para rich previews.`,
          lang: 'html',
          exercise: {
            id: 'ex-html-inter-2',
            prompt: 'Qual protocolo de meta tags é amplamente utilizado por WhatsApp, Facebook e LinkedIn para gerar miniaturas enriquecidas?',
            type: 'multiple_choice',
            options: ['Open Graph (og:*)', 'RSS Feed', 'WebSockets', 'GraphQL'],
            correctAnswer: 'Open Graph (og:*)',
            hint: 'Iniciado com as letras og:.',
            explanation: 'O protocolo Open Graph padroniza a extração de títulos, descrições e banners por plataformas sociais.',
          },
        },
        {
          title: '3. Acessibilidade WAI-ARIA: Roles, aria-expanded e aria-live',
          desc: 'Torne componentes interativos como modais, accordions e alertas acessíveis a todos.',
          theory: [
            {
              title: 'WAI-ARIA (Accessible Rich Internet Applications)',
              text: 'Atributos ARIA comunicam estados e comportamentos dinâmicos a leitores de tela quando os elementos HTML nativos não são suficientes.',
              keyPoints: [
                'aria-expanded="true/false" para menus dropdown e gavetas retráteis.',
                'aria-live="polite" anuncia mudanças dinâmicas no DOM sem interromper a fala do usuário.',
                'role="dialog" e aria-modal="true" para modais em foco.',
              ],
            },
          ],
          code: `<div role="dialog" aria-labelledby="titulo-modal" aria-modal="true" class="modal">
  <h2 id="titulo-modal">Confirmar Exclusão</h2>
  <p>Esta ação não pode ser desfeita.</p>
  <div aria-live="polite" id="status-alerta" class="sr-only"></div>
  <button type="button">Cancelar</button>
  <button type="button">Confirmar</button>
</div>`,
          output: `[WAI-ARIA]: Diálogo modal acessível com aria-modal="true" e live-region declarada.`,
          lang: 'html',
          exercise: {
            id: 'ex-html-inter-3',
            prompt: 'Qual atributo ARIA informa a leitores de tela que uma área dinâmica da página sofreu atualização sem interromper o fluxo atual do usuário?',
            type: 'multiple_choice',
            options: ['aria-live="polite"', 'aria-hidden="true"', 'aria-disabled="true"', 'aria-atomic="false"'],
            correctAnswer: 'aria-live="polite"',
            hint: 'Gera anúncios em tom educado ("polite") após a fala atual terminar.',
            explanation: '`aria-live="polite"` agenda a leitura das alterações na região assim que o sintetizador de voz concluir a frase corrente.',
          },
        },
        {
          title: '4. SVGs Inline e Gráficos Vetoriais Nativos',
          desc: 'Manipule caminhos vetoriais com <svg>, <path>, <circle> e estilização direta com CSS.',
          theory: [
            {
              title: 'Gráficos Vetoriais Escaláveis',
              text: 'SVGs declarados inline no HTML não realizam requisições HTTP adicionais e podem ter suas cores e animações controladas diretamente por classes CSS.',
              keyPoints: [
                'viewBox="0 0 24 24" define o sistema de coordenadas virtuais escaláveis.',
                '<path d="..." fill="currentColor" /> herda a cor do texto do elemento pai.',
              ],
            },
          ],
          code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
</svg>`,
          output: `[SVG Engine]: Vetor renderizado com coordenadas escaláveis e stroke="currentColor".`,
          lang: 'html',
          exercise: {
            id: 'ex-html-inter-4',
            prompt: 'Qual atributo de um elemento <svg> define a caixa delimitadora e o sistema de proporções e coordenadas do desenho?',
            type: 'multiple_choice',
            options: ['viewBox', 'aspectRatio', 'coordinateMap', 'bounds'],
            correctAnswer: 'viewBox',
            hint: 'Composto por "min-x min-y width height".',
            explanation: '`viewBox` estabelece o sistema de coordenadas relativas que permite que o SVG escale perfeitamente sem perder nitidez.',
          },
        },
        {
          title: '5. Elementos de Diálogo Nativos: <dialog> e showModal()',
          desc: 'Crie caixas de diálogo modais nativas com captura de foco, tecla ESC e backdrop nativo.',
          theory: [
            {
              title: 'A Revolução do <dialog>',
              text: 'O elemento <dialog> nativo do HTML5 substitui bibliotecas pesadas de modal. Ao chamar elemento.showModal(), o navegador ativa a camada top-layer, bloqueia a interação com o resto da página e gerencia a tecla ESC.',
              keyPoints: [
                'dialogElement.showModal() abre com backdrop escurecido.',
                '::backdrop permite estilizar o fundo borrado ou escuro com CSS.',
                '<form method="dialog"> fecha a modal ao clicar no botão sem recarregar a página.',
              ],
            },
          ],
          code: `<dialog id="meu-modal">
  <form method="dialog">
    <h2>Configurações do Perfil</h2>
    <p>Ajuste suas preferências de notificação.</p>
    <button value="cancel">Fechar</button>
    <button value="save" class="btn-salvar">Salvar</button>
  </form>
</dialog>`,
          output: `[HTML Dialog]: Modal nativa registrada no top-layer com suporte a fechamento por formulário dialog.`,
          lang: 'html',
          exercise: {
            id: 'ex-html-inter-5',
            prompt: 'Qual método JavaScript abre o elemento <dialog> no modo modal com foco isolado e backdrop ativo?',
            type: 'multiple_choice',
            options: ['dialog.showModal()', 'dialog.open()', 'dialog.display()', 'dialog.show()'],
            correctAnswer: 'dialog.showModal()',
            hint: 'Abre no modo modal (não confundir com show() não-modal).',
            explanation: '`showModal()` coloca a caixa de diálogo no topo do navegador (top-layer) e bloqueia as interações com os elementos de fundo.',
          },
        },
      ],
      avancado: [
        {
          title: '1. Web Components: Custom Elements, Shadow DOM e <template>',
          desc: 'Crie componentes HTML nativos, reutilizáveis e encapsulados sem necessidade de frameworks.',
          theory: [
            {
              title: 'Web Components Nativos',
              text: 'Web Components é um conjunto de padrões da W3C formado por Custom Elements (classes customizadas estendendo HTMLElement), Shadow DOM (isolamento de estilos) e <template>.',
              keyPoints: [
                'customElements.define("card-usuario", CardUsuario);',
                'this.attachShadow({ mode: "open" }) isola o CSS para não vazar para o documento.',
                '<slot> permite transclusão e inserção de conteúdo dinâmico do consumidor.',
              ],
            },
          ],
          code: `class CartaoDev extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = \`
      <style>
        .box { padding: 16px; border-radius: 12px; background: #0f172a; color: #38bdf8; font-family: sans-serif; }
      </style>
      <div class="box">
        <slot name="nome">Nome Padrão</slot>
        <p>Desenvolvedor Web Autônomo</p>
      </div>
    \`;
  }
}
customElements.define('cartao-dev', CartaoDev);`,
          output: `[Web Components]: Elemento customizado <cartao-dev> registrado com Shadow DOM encapsulado.`,
          lang: 'html',
          exercise: {
            id: 'ex-html-avanc-1',
            prompt: 'Qual mecanismo dos Web Components garante que os estilos CSS definidos dentro do componente não vazem para o resto da página?',
            type: 'multiple_choice',
            options: ['Shadow DOM', 'Virtual DOM', 'Service Worker', 'Strict Mode'],
            correctAnswer: 'Shadow DOM',
            hint: 'DOM das Sombras com árvore encapsulada.',
            explanation: 'O Shadow DOM encapsula a árvore de nós e o CSS do componente, impedindo que regras de estilo externas interfiram nele ou que suas regras vazem.',
          },
        },
        {
          title: '2. Canvas API 2D e Renderização Gráfica em Tempo Real',
          desc: 'Desenhe formas, partículas, gráficos estatísticos e animações a 60 FPS com a tag <canvas>.',
          theory: [
            {
              title: 'A Tela do Canvas',
              text: 'A tag <canvas> fornece uma superfície bitmap manipulada diretamente por JavaScript através do contexto 2D ou WebGL.',
              keyPoints: [
                'const ctx = canvas.getContext("2d");',
                'ctx.fillStyle = "#f97316"; ctx.fillRect(0, 0, 100, 100);',
                'requestAnimationFrame() cria laços de animação fluidos e sincronizados com a taxa de atualização do monitor.',
              ],
            },
          ],
          code: `<canvas id="meuCanvas" width="400" height="200"></canvas>
<script>
  const canvas = document.getElementById('meuCanvas');
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  ctx.arc(200, 100, 50, 0, Math.PI * 2);
  ctx.fill();
</script>`,
          output: `[Canvas 2D]: Círculo verde renderizado no buffer de pixels em (200, 100) com raio 50.`,
          lang: 'html',
          exercise: {
            id: 'ex-html-avanc-2',
            prompt: 'Qual método do elemento <canvas> obtém o objeto de desenho para manipular gráficos em 2D?',
            type: 'multiple_choice',
            options: ['canvas.getContext("2d")', 'canvas.getDrawEngine()', 'canvas.create2D()', 'canvas.render()'],
            correctAnswer: 'canvas.getContext("2d")',
            hint: 'Retorna o CanvasRenderingContext2D.',
            explanation: '`getContext("2d")` retorna a interface com todos os métodos de desenho (fillRect, arc, stroke, lineTo) do HTML Canvas.',
          },
        },
      ],
      projetos: [
        {
          title: '1. Projeto: Landing Page Semântica de Alta Performance com A11y 100/100',
          desc: 'Construa uma página completa estruturada em HTML5 semântico com nota máxima no Google Lighthouse.',
          theory: [{ title: 'Projeto Prático', text: 'Estruturação completa semântica, metatags, links e acessibilidade.', keyPoints: ['Semântica rigorosa', 'Lighthouse 100', 'Mobile ready'] }],
          code: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lumina Studio | Soluções Web</title>
</head>
<body>
  <header>
    <a href="#conteudo-principal" class="sr-only">Pular para o conteúdo</a>
    <nav aria-label="Navegação Principal">
      <ul>
        <li><a href="#solucoes">Soluções</a></li>
        <li><a href="#contato">Contato</a></li>
      </ul>
    </nav>
  </header>
  <main id="conteudo-principal">
    <section id="solucoes">
      <h1>Transformamos Ideias em Código de Alta Performance</h1>
      <p>Sistemas modernos com foco em usabilidade e velocidade.</p>
    </section>
  </main>
</body>
</html>`,
          output: `[Build]: Landing Page validada com 0 erros W3C e acessibilidade nível AAA.`,
          lang: 'html',
          exercise: {
            id: 'ex-html-prj-1',
            prompt: 'Por que o link "Pular para o conteúdo principal" (Skip Link) no topo do documento é uma boa prática de acessibilidade?',
            type: 'multiple_choice',
            options: [
              'Permite que usuários de navegadores por teclado e leitores de tela pulem cabeçalhos e menus repetitivos indo direto ao conteúdo',
              'Acelera a velocidade da internet',
              'Desativa o CSS da página',
              'Oculta propagandas no navegador',
            ],
            correctAnswer: 'Permite que usuários de navegadores por teclado e leitores de tela pulem cabeçalhos e menus repetitivos indo direto ao conteúdo',
            hint: 'Facilita a navegação de quem usa a tecla TAB.',
            explanation: 'Skip Links evitam que usuários que navegam exclusivamente via teclado precisem tabular por dezenas de itens de menu a cada nova página acessada.',
          },
        },
      ],
    },
    quizzesByLevel: {
      iniciante: [
        {
          id: 'hq-ini-1',
          question: 'Qual a tag correta no HTML5 para representar um artigo ou postagem independente e reutilizável?',
          options: ['<article>', '<section>', '<div>', '<aside>'],
          correctIndex: 0,
          explanation: '<article> é ideal para posts de blog, notícias ou comentários independentes.',
        },
        {
          id: 'hq-ini-2',
          question: 'Para vincular um arquivo de estilo CSS externo ao HTML, qual elemento é utilizado dentro da tag <head>?',
          options: ['<link rel="stylesheet" href="style.css">', '<style src="style.css">', '<script href="style.css">', '<css link="style.css">'],
          correctIndex: 0,
          explanation: '<link rel="stylesheet"> conecta folhas de estilo externas ao documento HTML.',
        },
      ],
      intermediario: [
        {
          id: 'hq-int-1',
          question: 'Qual a função do atributo `loading="lazy"` em imagens e iframes?',
          options: [
            'Adiar o carregamento do recurso até que o usuário role a página próximo a ele, economizando memória e dados',
            'Aplicar um efeito visual de desfoque',
            'Diminuir o tamanho físico da imagem',
            'Exibir uma barra de progresso',
          ],
          correctIndex: 0,
          explanation: 'O Lazy Loading nativo do navegador reduz drasticamente o tempo de carregamento inicial (LCP) da página.',
        },
      ],
      avancado: [
        {
          id: 'hq-av-1',
          question: 'Como um Web Component customizado é registrado globalmente no navegador?',
          options: [
            'customElements.define("meu-componente", MinhaClasse)',
            'document.register("meu-componente")',
            'window.createComponent("meu-componente")',
            'HTML.define("meu-componente")',
          ],
          correctIndex: 0,
          explanation: '`customElements.define()` associa uma tag com hífen a uma classe derivada de HTMLElement.',
        },
      ],
      projetos: [
        {
          id: 'hq-prj-1',
          question: 'Qual tag semântica deve envolver links secundários ou blocos de navegação em uma página web?',
          options: ['<nav>', '<menu>', '<header>', '<aside>'],
          correctIndex: 0,
          explanation: '<nav> comunica explicitamente que o bloco contém links para navegação no site ou documento.',
        },
      ],
    },
  },

  // =========================================================================
  // CSS3, FLEXBOX, GRID & TAILWIND
  // =========================================================================
  css: {
    topicsByLevel: {
      iniciante: [
        {
          title: '1. Modelo de Caixa (Box Model): Margin, Border, Padding e Content',
          desc: 'Domine a base da renderização de elementos e box-sizing: border-box.',
          theory: [
            {
              title: 'O CSS Box Model',
              text: 'Todo elemento HTML é interpretado como uma caixa retangular composta por 4 camadas: Conteúdo (Content), Espaçamento interno (Padding), Borda (Border) e Margem externa (Margin).',
              keyPoints: [
                'box-sizing: border-box faz com que padding e borda sejam incluídos na largura total calculada.',
                'margin: 0 auto centraliza horizontalmente elementos de bloco com largura definida.',
                'Display: block, inline e inline-block controlam o fluxo de quebra de linha.',
              ],
              conceptCard: '💡 Regra de Ouro: Sempre declare `*, *::before, *::after { box-sizing: border-box; }` no reset CSS do seu projeto.',
            },
          ],
          code: `/* Reset moderno com Box Sizing */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.cartao-produto {
  width: 320px;
  padding: 24px;
  border: 2px solid #3b82f6;
  margin: 16px auto;
  border-radius: 12px;
  background-color: #1e293b;
  color: #ffffff;
}`,
          output: `[CSS Engine]: Caixa com largura exata de 320px renderizada com border-box e margin auto.`,
          lang: 'css',
          exercise: {
            id: 'ex-css-ini-1',
            prompt: 'Qual propriedade CSS garante que o padding e a borda não aumentem a largura total especificada para o elemento?',
            type: 'multiple_choice',
            options: ['box-sizing: border-box;', 'display: flex;', 'overflow: hidden;', 'margin: 0;'],
            correctAnswer: 'box-sizing: border-box;',
            hint: 'Ajusta o cálculo da caixa na borda.',
            explanation: '`box-sizing: border-box` inclui o padding e a border na largura e altura totais do elemento.',
          },
        },
        {
          title: '2. Flexbox: Eixos (Main Axis vs Cross Axis), Justify e Align',
          desc: 'Alinhe e distribua espaços entre elementos em uma dimensão com facilidade.',
          theory: [
            {
              title: 'Fundamentos do Flexbox',
              text: 'Flexbox é um sistema de layout unidimensional. O contêiner com display: flex define o eixo principal (flex-direction: row ou column), permitindo controlar o alinhamento com justify-content e align-items.',
              keyPoints: [
                'justify-content: alinha itens no eixo principal (center, space-between, flex-start).',
                'align-items: alinha itens no eixo transversal (center, stretch, flex-end).',
                'gap: 16px cria espaçamento uniforme entre os filhos sem precisar de margens.',
              ],
            },
          ],
          code: `.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 16px 32px;
  background: #0f172a;
}

.nav-links {
  display: flex;
  gap: 16px;
  list-style: none;
}`,
          output: `[Flexbox Engine]: Itens distribuídos nos extremos com alinhamento vertical perfeito no centro.`,
          lang: 'css',
          exercise: {
            id: 'ex-css-ini-2',
            prompt: 'Para centralizar perfeitamente um elemento filho na horizontal e na vertical usando Flexbox no pai, quais propriedades devem ser aplicadas?',
            type: 'multiple_choice',
            options: [
              'display: flex; justify-content: center; align-items: center;',
              'display: block; margin: auto;',
              'float: center; text-align: center;',
              'position: fixed; top: 0;',
            ],
            correctAnswer: 'display: flex; justify-content: center; align-items: center;',
            hint: 'Combinação de flex com alinhamento nos dois eixos.',
            explanation: 'No Flexbox com flex-direction padrão (row), `justify-content: center` centraliza no eixo X e `align-items: center` no eixo Y.',
          },
        },
      ],
      intermediario: [
        {
          title: '1. CSS Grid Layout: grid-template-columns, fr e auto-fit',
          desc: 'Crie layouts bidimensionais complexos e grids responsivos com repeat(auto-fit, minmax()).',
          theory: [
            {
              title: 'O Poder do CSS Grid',
              text: 'CSS Grid trabalha com linhas e colunas simultaneamente. A unidade fr (fração do espaço livre) e a função minmax() criam grades que se adaptam a qualquer tela sem media queries.',
              keyPoints: [
                'grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));',
                'grid-template-areas: nomeia regiões visuais como "header header" e "main sidebar".',
                'gap: 24px define o espaçamento entre células.',
              ],
            },
          ],
          code: `.galeria-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
  padding: 24px;
}

.item-card {
  background: #1e293b;
  border-radius: 12px;
  padding: 20px;
}`,
          output: `[CSS Grid]: Layout responsivo adaptativo com colunas de no mínimo 260px distribuídas em 1fr.`,
          lang: 'css',
          exercise: {
            id: 'ex-css-inter-1',
            prompt: 'Qual fórmula de CSS Grid cria um grid 100% responsivo que quebra colunas automaticamente sem necessidade de @media queries?',
            type: 'multiple_choice',
            options: [
              'grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));',
              'grid-template-columns: 25% 25% 25% 25%;',
              'display: flex; flex-wrap: nowrap;',
              'grid-template-rows: repeat(4, 1fr);',
            ],
            correctAnswer: 'grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));',
            hint: 'Usa repeat com auto-fit e minmax.',
            explanation: '`repeat(auto-fit, minmax(250px, 1fr))` preenche o espaço disponível criando tantas colunas de pelo menos 250px quantas couberem na tela.',
          },
        },
      ],
      avancado: [
        {
          title: '1. Animações CSS com @keyframes e Variáveis CSS (Custom Properties)',
          desc: 'Crie animações fluidas a 60fps usando transform, opacity e design tokens dinâmicos com CSS Variables.',
          theory: [
            {
              title: 'Variáveis e Animações com GPU',
              text: 'Custom Properties (--primary-color) permitem temas dinâmicos em tempo de execução. Para animações com aceleração de hardware, anime apenas `transform` e `opacity`.',
              keyPoints: [
                ':root { --cor-destaque: #f97316; --anim-tempo: 300ms; }',
                'var(--cor-destaque)',
                '@keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } }',
              ],
            },
          ],
          code: `:root {
  --primary-color: #f97316;
  --bg-dark: #090d16;
}

@keyframes pulseGlow {
  0% { transform: scale(1); box-shadow: 0 0 0 rgba(249, 115, 22, 0); }
  50% { transform: scale(1.03); box-shadow: 0 0 20px rgba(249, 115, 22, 0.4); }
  100% { transform: scale(1); box-shadow: 0 0 0 rgba(249, 115, 22, 0); }
}

.btn-destaque {
  background: var(--primary-color);
  animation: pulseGlow 2s infinite ease-in-out;
}`,
          output: `[CSS Animation]: Animação pulseGlow compilada com aceleração de GPU ativa em transform e shadow.`,
          lang: 'css',
          exercise: {
            id: 'ex-css-avanc-1',
            prompt: 'Quais são as duas propriedades CSS que os navegadores conseguem animar com aceleração direta da GPU sem causar reflow (recalculo de layout)?',
            type: 'multiple_choice',
            options: ['transform e opacity', 'width e height', 'top e left', 'margin e padding'],
            correctAnswer: 'transform e opacity',
            hint: 'Não afetam a geometria dos outros elementos ao redor.',
            explanation: '`transform` e `opacity` são processadas na camada de composição da GPU, garantindo 60 quadros por segundo sem reflows caros.',
          },
        },
      ],
      projetos: [
        {
          title: '1. Projeto: Design System Completo com Tema Claro/Escuro via Data Attributes',
          desc: 'Desenvolva um sistema de tokens de design com suporte a Dark Mode instantâneo e tipografia matemática.',
          theory: [{ title: 'Design System', text: 'Tokens de cores, tipografia e tema dinâmico.', keyPoints: ['Tokens CSS', 'Dark Mode nativo', 'Responsividade'] }],
          code: `[data-theme="light"] {
  --bg-surface: #f8fafc;
  --text-main: #0f172a;
  --accent: #2563eb;
}

[data-theme="dark"] {
  --bg-surface: #0b0f19;
  --text-main: #f1f5f9;
  --accent: #38bdf8;
}

body {
  background-color: var(--bg-surface);
  color: var(--text-main);
  transition: background-color 200ms ease;
}`,
          output: `[Design System]: Tokens de tema claro e escuro alternáveis dinamicamente via data-theme.`,
          lang: 'css',
          exercise: {
            id: 'ex-css-prj-1',
            prompt: 'Como declarar e consumir uma variável CSS nativa (Custom Property)?',
            type: 'multiple_choice',
            options: [
              'Declaração: `--minha-cor: #f00;` | Consumo: `color: var(--minha-cor);`',
              'Declaração: `$minha-cor: #f00;` | Consumo: `color: $minha-cor;`',
              'Declaração: `@minha-cor: #f00;` | Consumo: `color: @minha-cor;`',
              'Declaração: `let minhaCor = #f00;` | Consumo: `color: minhaCor;`',
            ],
            correctAnswer: 'Declaração: `--minha-cor: #f00;` | Consumo: `color: var(--minha-cor);`',
            hint: 'Inicia com dois traços (--) e é consumida com a função var().',
            explanation: 'Variáveis nativas do CSS devem começar com `--` e seu valor é recuperado através da função `var(--nome)`.',
          },
        },
      ],
    },
    quizzesByLevel: {
      iniciante: [
        {
          id: 'cq-ini-1',
          question: 'No CSS Flexbox, qual propriedade altera a direção do eixo principal para vertical?',
          options: ['flex-direction: column;', 'flex-direction: vertical;', 'flex-align: column;', 'orientation: vertical;'],
          correctIndex: 0,
          explanation: '`flex-direction: column` empilha os elementos verticalmente no eixo Y.',
        },
      ],
      intermediario: [
        {
          id: 'cq-int-1',
          question: 'O que a propriedade `gap: 20px;` faz quando aplicada a um contêiner Flexbox ou Grid?',
          options: [
            'Adiciona 20px de espaçamento entre os itens filhos sem adicionar margem externa nas bordas do contêiner',
            'Define a largura da borda do contêiner',
            'Diminui a fonte em 20px',
            'Cria um espaço invisível fora da página',
          ],
          correctIndex: 0,
          explanation: '`gap` cria espaço exclusivamente entre os elementos filhos, dispensando truques com margins negativas.',
        },
      ],
      avancado: [
        {
          id: 'cq-av-1',
          question: 'Qual seletor CSS tem maior especificidade?',
          options: ['#identificador (ID)', '.classe (Class)', 'tag (Elemento)', '* (Universal)'],
          correctIndex: 0,
          explanation: 'IDs (#id) possuem especificidade 0-1-0-0, superando classes (.classe: 0-0-1-0) e elementos (tag: 0-0-0-1).',
        },
      ],
      projetos: [
        {
          id: 'cq-prj-1',
          question: 'Qual media query do CSS detecta se o usuário configurou o sistema operacional para o modo escuro?',
          options: [
            '@media (prefers-color-scheme: dark)',
            '@media (dark-mode: active)',
            '@media (theme: dark)',
            '@media (screen: black)',
          ],
          correctIndex: 0,
          explanation: '`prefers-color-scheme: dark` permite adaptar automaticamente o CSS às preferências do sistema operacional.',
        },
      ],
    },
  },
};
