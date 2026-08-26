import { TechCurriculumData } from '../techCurriculum';

export const GIT_CURRICULUM: TechCurriculumData = {
  topicsByLevel: {
    iniciante: [
      {
        title: '1. Fundamentos do Git: Os Três Estados (Working Tree, Staging, Repository)',
        desc: 'Compreenda a arquitetura interna do Git com objetos imutáveis, hashes SHA-1/SHA-256 e áreas de trabalho.',
        theory: [
          {
            title: 'Como o Git Funciona por Baixo dos Panos',
            text: 'O Git é um sistema de controle de versão distribuído que grava snapshots (fotos) do seu projeto como árvores de objetos (blobs, trees, commits) indexadas por hashes criptográficos imutáveis.',
            keyPoints: [
              'Working Directory: Seus arquivos locais sendo editados.',
              'Staging Area (Index): Área de preparação onde você escolhe exatamente o que entrará no próximo commit (git add).',
              'Git Repository: Banco de objetos permanente no diretório .git contendo os commits.',
            ],
            conceptCard: '💡 Regra de Ouro: Um commit deve representar uma única unidade lógica e atômica de mudança com uma mensagem clara.',
          },
        ],
        code: `# Inicializar repositório e configurar identidade global
git init
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"

# Ciclo básico de trabalho
git add src/App.tsx
git commit -m "feat: adiciona componente de autenticação"
git status`,
        output: `On branch main
nothing to commit, working tree clean
[main (root-commit) a1b2c3d] feat: adiciona componente de autenticação
 1 file changed, 45 insertions(+)`,
        lang: 'bash',
        exercise: {
          id: 'ex-git-ini-1',
          prompt: 'Qual área do Git armazena os arquivos preparados que farão parte do próximo commit após executar `git add`?',
          type: 'multiple_choice',
          options: ['Staging Area (Index)', 'Working Directory', 'Remote Server', 'Trash Bin'],
          correctAnswer: 'Staging Area (Index)',
          hint: 'Área intermediária de preparação.',
          explanation: 'A Staging Area (ou Index) é o local onde as alterações selecionadas são agrupadas antes de serem gravadas permanentemente pelo git commit.',
        },
      },
      {
        title: '2. Histórico de Versões, Logs Formatados e Diferenças com git diff',
        desc: 'Inspecione alterações linha a linha e navegue pelo histórico com graph e oneline.',
        theory: [
          {
            title: 'Visualizando Histórico de Forma Profissional',
            text: 'O comando git log combinado com flags de formatação permite inspecionar a árvore genealógica de branches, merges e tags.',
            keyPoints: [
              'git log --oneline --graph --all: Visão gráfica compacta de todos os ramos.',
              'git diff: Mostra alterações no working directory ainda não adicionadas ao stage.',
              'git diff --staged: Mostra o que está no stage pronto para ser commitado.',
            ],
          },
        ],
        code: `# Inspecionar histórico com visualização gráfica em árvore
git log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit`,
        output: `* 7f9a12c - (HEAD -> main, origin/main) feat: adiciona dashboard (2 hours ago) <Dev Senior>
* 3b4c5d6 - fix: corrige timeout de conexao (1 day ago) <Dev Junior>
* 1a2b3c4 - Initial commit (3 days ago) <Dev Lead>`,
        lang: 'bash',
        exercise: {
          id: 'ex-git-ini-2',
          prompt: 'Qual comando compara as alterações que estão no Working Directory com a Staging Area antes de dar `git add`?',
          type: 'multiple_choice',
          options: ['git diff', 'git log', 'git push', 'git branch'],
          correctAnswer: 'git diff',
          hint: 'Mostra as diferenças linha por linha com + (verde) e - (vermelho).',
          explanation: '`git diff` exibe as diferenças não preparadas (unstaged changes) entre o diretório de trabalho e o índice.',
        },
      },
      {
        title: '3. Ramificações (Branches), Checkout e Switch',
        desc: 'Crie linhas de desenvolvimento isoladas para novas features e correções rápidas.',
        theory: [
          {
            title: 'O que é uma Branch no Git?',
            text: 'Uma branch no Git é simplesmente um ponteiro móvel e leve (apenas 41 bytes) que aponta para um commit específico.',
            keyPoints: [
              'git branch nova-feature: Cria uma nova branch.',
              'git switch nova-feature (ou git checkout -b): Troca para a branch.',
              'git branch -d nome: Deleta uma branch já mesclada.',
            ],
          },
        ],
        code: `# Criar e alternar para uma nova branch de feature
git switch -c feat/autenticacao-jwt
# Realizar alterações e commitar
git add .
git commit -m "feat(auth): implementa geracao de token JWT"
git switch main`,
        output: `Switched to a new branch 'feat/autenticacao-jwt'
[feat/autenticacao-jwt 8d9e0f1] feat(auth): implementa geracao de token JWT
Switched to branch 'main'`,
        lang: 'bash',
        exercise: {
          id: 'ex-git-ini-3',
          prompt: 'Qual comando moderno do Git é recomendado para criar e trocar para uma nova branch simultaneamente?',
          type: 'multiple_choice',
          options: ['git switch -c nome-da-branch', 'git commit -b', 'git clone --new', 'git stash'],
          correctAnswer: 'git switch -c nome-da-branch',
          hint: 'O subcomando `switch` substitui a sobrecarga histórica de checkout com a flag -c (create).',
          explanation: '`git switch -c <nome>` cria a nova branch e move o ponteiro HEAD para ela imediatamente.',
        },
      },
      {
        title: '4. Integração com Repositórios Remotos (GitHub, GitLab) e Chaves SSH',
        desc: 'Configure origens remotas, sincronize código com git push e git pull e use autenticação segura.',
        theory: [
          {
            title: 'Repositórios Remotos & Segurança SSH',
            text: 'Conectar repositórios remotos permite backup na nuvem e colaboração em equipe via chaves SSH Ed25519.',
            keyPoints: [
              'git remote add origin git@github.com:usuario/repo.git',
              'git push -u origin main: Envia commits e define upstream.',
              'git fetch vs git pull: Fetch baixa os objetos; Pull baixa e faz merge imediato.',
            ],
          },
        ],
        code: `# Configurar repositório remoto e enviar branch principal
git remote add origin git@github.com:empresa/app-core.git
git branch -M main
git push -u origin main`,
        output: `Enumerating objects: 15, done.
Writing objects: 100% (15/15), 4.2 KiB | 4.2 MiB/s, done.
To github.com:empresa/app-core.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.`,
        lang: 'bash',
        exercise: {
          id: 'ex-git-ini-4',
          prompt: 'Qual a diferença entre `git fetch` e `git pull`?',
          type: 'multiple_choice',
          options: [
            '`git fetch` apenas faz o download das atualizações do servidor remoto sem alterar seus arquivos locais; `git pull` faz o fetch e executa o merge automaticamente no seu branch atual',
            '`git fetch` apaga o repositório',
            '`git pull` envia arquivos para o GitHub',
            'Não há diferença',
          ],
          correctAnswer: '`git fetch` apenas faz o download das atualizações do servidor remoto sem alterar seus arquivos locais; `git pull` faz o fetch e executa o merge automaticamente no seu branch atual',
          hint: '`git pull` é equivalente a `git fetch` seguido de `git merge`.',
          explanation: 'O fetch é uma operação segura que inspeciona o que mudou no servidor sem riscos de conflitos imediatos na sua área de trabalho.',
        },
      },
      {
        title: '5. Ignorando Arquivos com .gitignore e Remoção Segura de Dados Sensíveis',
        desc: 'Proteja credenciais, arquivos .env e diretórios pesados como node_modules do repositório.',
        theory: [
          {
            title: 'A Importância Crítica do .gitignore',
            text: 'Arquivos de configuração local, chaves de API secretas e dependências compiladas NUNCA devem ser commitados no Git.',
            keyPoints: [
              '.env, .env.local: Bloqueia vazamento de senhas e tokens.',
              'node_modules/, dist/, target/: Evita poluir o histórico com gigabytes de binários.',
              'git rm --cached arquivo: Remove do controle de versão mantendo o arquivo no disco local.',
            ],
          },
        ],
        code: `# Exemplo de .gitignore profissional para Web/Node/Cyber
node_modules/
dist/
.env
.env.*
!.env.example
*.log
.DS_Store
id_rsa*`,
        output: `[Gitignore]: 8 regras ativas. Arquivos confidenciais protegidos contra commits acidentais.`,
        lang: 'bash',
        exercise: {
          id: 'ex-git-ini-5',
          prompt: 'Se você commitou um arquivo `.env` com senhas por engano, qual comando o remove do repositório Git mantendo o arquivo intacto no seu computador?',
          type: 'multiple_choice',
          options: ['git rm --cached .env', 'rm -rf .env', 'git delete .env', 'git reset --hard'],
          correctAnswer: 'git rm --cached .env',
          hint: 'Remove da Staging Area (cache) sem deletar o arquivo do sistema de arquivos.',
          explanation: '`git rm --cached` diz ao Git para parar de rastrear o arquivo, mas não exclui o arquivo da sua máquina.',
        },
      },
    ],
    intermediario: [
        {
          title: '1. Estratégias de Branching: GitFlow vs Trunk-Based Development',
          desc: 'Adote fluxos de trabalho profissionais para equipes de alta velocidade e releases seguras.',
          theory: [
            {
              title: 'Modelos de Ramificação',
              text: 'GitFlow utiliza branches de longa duração (main, develop, release, feature). Trunk-Based utiliza merges frequentes e diários direto na main com Feature Flags.',
              keyPoints: [
                'GitFlow: Bom para softwares com ciclos de releases formais e versionamento semântico.',
                'Trunk-Based: Padrão ouro em DevOps e CI/CD moderno para evitar "Merge Hell".',
              ],
            },
          ],
          code: `# Fluxo Trunk-Based com branches de vida curta (short-lived)
git switch main
git pull --rebase
git switch -c fix/login-validation
# Trabalho rápido de 2 horas -> Commit -> Push -> Pull Request
git push origin fix/login-validation`,
          output: `[Trunk-Based]: Branch de curta duração criada e enviada para code review.`,
          lang: 'bash',
          exercise: {
            id: 'ex-git-inter-1',
            prompt: 'No modelo Trunk-Based Development, qual é a boa prática recomendada para as branches de feature?',
            type: 'multiple_choice',
            options: [
              'Terem vida muito curta (menos de 1 ou 2 dias) e serem integradas frequentemente à branch principal',
              'Ficarem abertas por 6 meses sem atualizar',
              'Nunca serem integradas à main',
              'Terem mais de 50 desenvolvedores commitando na mesma branch de feature',
            ],
            correctAnswer: 'Terem vida muito curta (menos de 1 ou 2 dias) e serem integradas frequentemente à branch principal',
            hint: 'Promove integração contínua (CI) e evita conflitos gigantescos.',
            explanation: 'Branches curtas reduzem a divergência de código, facilitando testes e deploys rápidos.',
          },
        },
        {
          title: '2. Rebase vs Merge: Mantendo um Histórico Linear e Limpo',
          desc: 'Aprenda quando usar git merge (preserva contexto) e quando usar git rebase (histórico linear sem merge commits).',
          theory: [
            {
              title: 'Rebase vs Merge',
              text: 'O Merge cria um novo commit com 2 pais combinando as branches. O Rebase "rebobina" seus commits locais, aplica as novidades da main na base e "reaplica" seus commits no topo.',
              keyPoints: [
                'git rebase main: Reaplica seus commits no topo da main.',
                'Regra de Ouro do Rebase: NUNCA faça rebase em branches públicas compartilhadas!',
              ],
            },
          ],
          code: `# Atualizando branch de feature com a main de forma linear
git switch feat/nova-tela
git fetch origin
git rebase origin/main
# Se houver conflito: resolva -> git add . -> git rebase --continue`,
          output: `First, rewinding head to replay your work on top of it...
Applying: feat: adiciona layout base
Applying: feat: adiciona filtros de busca
Successfully rebased and updated refs/heads/feat/nova-tela.`,
          lang: 'bash',
          exercise: {
            id: 'ex-git-inter-2',
            prompt: 'Por que a "Regra de Ouro do Rebase" proíbe fazer `git rebase` em branches públicas que outros desenvolvedores estão utilizando?',
            type: 'multiple_choice',
            options: [
              'Porque o rebase reescreve os hashes de commits existentes, quebrando o histórico e forçando conflitos para toda a equipe',
              'Porque o Git bloqueia rebases na internet',
              'Porque consome muita banda de internet',
              'Porque apaga as senhas do GitHub',
            ],
            correctAnswer: 'Porque o rebase reescreve os hashes de commits existentes, quebrando o histórico e forçando conflitos para toda a equipe',
            hint: 'Reescrever histórico público causa divergência forçada para quem já baixou os commits antigos.',
            explanation: 'Rebase cria novos hashes para os mesmos commits; se outros desenvolvedores basearem seu trabalho nos commits antigos, a sincronização se tornará caótica.',
          },
        },
        {
          title: '3. Resolução Profissional de Conflitos de Merge',
          desc: 'Identifique marcadores <<<<<<< HEAD, ======= e >>>>>>> e use ferramentas de 3-way merge.',
          theory: [
            {
              title: 'Anatomia de um Conflito',
              text: 'Um conflito ocorre quando duas pessoas alteram a mesma linha do mesmo arquivo em momentos diferentes.',
              keyPoints: [
                'HEAD: Versão na sua branch atual.',
                'Incoming Change: Versão vindo da branch que está sendo incorporada.',
                'git status mostra "both modified" nos arquivos em conflito.',
              ],
            },
          ],
          code: `# Arquivo em conflito com marcadores do Git:
<<<<<<< HEAD
const API_URL = "https://api.producao.com/v2";
=======
const API_URL = "https://api-stage.empresa.internal/v2";
>>>>>>> feat/novo-endpoint

# Após editar e escolher a linha correta:
git add src/config.ts
git merge --continue`,
          output: `[Merge Concluído]: Conflito resolvido em src/config.ts. Commit de merge gravado.`,
          lang: 'bash',
          exercise: {
            id: 'ex-git-inter-3',
            prompt: 'Nos marcadores de conflito do Git, o que o bloco entre `<<<<<<< HEAD` e `=======` representa?',
            type: 'multiple_choice',
            options: [
              'O código presente na branch atual em que você está trabalhando',
              'O código do servidor remoto que está sendo mesclado',
              'Um erro de sintaxe do computador',
              'Código deletado',
            ],
            correctAnswer: 'O código presente na branch atual em que você está trabalhando',
            hint: 'HEAD aponta para o seu estado local atual.',
            explanation: 'O trecho inicial mostra o estado atual do seu ponteiro HEAD, enquanto a parte inferior (após =======) mostra as alterações da branch que está sendo integrada.',
          },
        },
        {
          title: '4. Salvando Trabalho Temporário com Git Stash',
          desc: 'Guarde alterações inacabadas para trocar de branch rapidamente sem poluir o histórico com commits falsos.',
          theory: [
            {
              title: 'A Pilha do Git Stash',
              text: 'O stash grava seu working directory e staging area em uma pilha e limpa sua área de trabalho para permitir troca de branch instantânea.',
              keyPoints: [
                'git stash push -m "wip: filtros": Salva com mensagem descritiva.',
                'git stash list: Lista todos os stashes guardados.',
                'git stash pop: Restaura o último stash e o remove da pilha.',
              ],
            },
          ],
          code: `# Guardar alterações temporárias para corrigir bug urgente na main
git stash push -m "WIP: logica de pagamento"
git switch main
# Aplica hotfix...
git commit -m "fix: corrige vazamento de conexao"
git push origin main
# Volta para a branch e recupera o trabalho
git switch feat/pagamentos
git stash pop`,
          output: `Saved working directory and index state WIP on feat/pagamentos: WIP: logica de pagamento
Switched to branch 'main'
[main 4f5e6d7] fix: corrige vazamento de conexao
Switched to branch 'feat/pagamentos'
Auto-merging src/pagamento.ts
Dropped refs/stash@{0} (1a2b3c4...)`,
          lang: 'bash',
          exercise: {
            id: 'ex-git-inter-4',
            prompt: 'Qual comando recupera as alterações guardadas no stash e ao mesmo tempo as remove da pilha do stash?',
            type: 'multiple_choice',
            options: ['git stash pop', 'git stash apply', 'git stash drop', 'git stash clear'],
            correctAnswer: 'git stash pop',
            hint: 'Pop desempilha o elemento.',
            explanation: '`git stash pop` aplica as modificações salvas e descarta a entrada da lista de stashes; `apply` aplica mas mantém na pilha.',
          },
        },
        {
          title: '5. Cherry-Pick e Revert: Pinçando Commits Específicos e Desfazendo Ações',
          desc: 'Copie um único commit de outra branch ou reverta um commit em produção com segurança.',
          theory: [
            {
              title: 'Cherry-pick e Git Revert',
              text: '`git cherry-pick <hash>` aplica o diff de um commit específico na sua branch atual. `git revert <hash>` cria um novo commit com o efeito inverso para anular uma mudança em produção sem reescrever o histórico.',
              keyPoints: [
                'git cherry-pick 7f9a12c: Traz uma correção pontual.',
                'git revert HEAD: Desfaz o último commit criando um novo commit seguro.',
              ],
            },
          ],
          code: `# Pinçar um hotfix crítico da branch de desenvolvimento para a de produção
git switch main
git cherry-pick 4a8b12c
# Reverter um commit problemático sem quebrar o histórico
git revert 9c3d4e5 -m "Reverte commit que causava lentidao na API"`,
          output: `[main 5e6f7a8] fix: corrige vulnerabilidade de autenticacao (cherry picked from commit 4a8b12c)
[main 6b7c8d9] Reverte commit que causava lentidao na API`,
          lang: 'bash',
          exercise: {
            id: 'ex-git-inter-5',
            prompt: 'Por que o comando `git revert` é preferível a `git reset --hard` para desfazer um commit que já foi enviado para a branch `main` no GitHub?',
            type: 'multiple_choice',
            options: [
              'Porque o `git revert` cria um novo commit que anula as mudanças sem reescrever o histórico compartilhado da equipe',
              'Porque o `git revert` é mais rápido',
              'Porque o `git reset` formata o computador',
              'Porque o GitHub não aceita commits',
            ],
            correctAnswer: 'Porque o `git revert` cria um novo commit que anula as mudanças sem reescrever o histórico compartilhado da equipe',
            hint: 'Histórico compartilhado deve ser sempre "append-only".',
            explanation: '`git revert` mantém a integridade do histórico público adicionando um commit corretivo, evitando que outros colaboradores tenham problemas com force push.',
          },
        },
      ],
      avancado: [
          {
            title: '1. Rebase Interativo (git rebase -i): Squash, Fixup, Reword e Drop',
            desc: 'Organize e limpe seus commits antes de abrir Pull Requests de padrão sênior.',
            theory: [
              {
                title: 'A Arte do Rebase Interativo',
                text: 'O rebase interativo permite reescrever o histórico local antes de publicar o PR: juntar 10 commits de teste em um só (squash/fixup), reordenar ou alterar mensagens.',
                keyPoints: [
                  'pick: Mantém o commit.',
                  'reword: Mantém o commit mas edita a mensagem.',
                  'squash / fixup: Funde o commit no commit anterior.',
                  'drop: Deleta o commit do histórico.',
                ],
              },
            ],
            code: `# Iniciar rebase interativo dos ultimos 4 commits
git rebase -i HEAD~4

# Script no editor:
# pick a1b2c3d feat(core): implementa modulo base
# fixup b2c3d4e wip: ajuste de sintaxe
# fixup c3d4e5f fix: typo no teste
# reword d4e5f6a feat(api): conecta endpoints`,
            output: `[Rebase Interativo]: 4 commits consolidados em 2 commits semânticos atômicos e limpos.`,
            lang: 'bash',
            exercise: {
              id: 'ex-git-avanc-1',
              prompt: 'No `git rebase -i`, qual comando funde o commit selecionado no anterior descartando a mensagem do commit atual (ideal para commits do tipo "fix typo" ou "ajuste")?',
              type: 'multiple_choice',
              options: ['fixup (f)', 'drop (d)', 'edit (e)', 'break (b)'],
              correctAnswer: 'fixup (f)',
              hint: 'Combina as mudanças e descarta a mensagem do commit redundante.',
              explanation: '`fixup` funciona como o `squash`, mas ignora a mensagem do commit mesclado, mantendo apenas a mensagem do commit principal.',
            },
          },
          {
            title: '2. Automação CI/CD com GitHub Actions: Workflows, Matrix e Secrets',
            desc: 'Crie pipelines automatizados de lint, testes unitários e deploy a cada push.',
            theory: [
              {
                title: 'GitHub Actions Workflows',
                text: 'Pipelines declarativos em arquivos YAML (.github/workflows/ci.yml) que rodam em runners isolados do GitHub a cada evento do repositório.',
                keyPoints: [
                  'Triggers: on: [push, pull_request].',
                  'Jobs com matriz de execução (Node 18, 20, 22).',
                  'Secrets seguros: ${{ secrets.DEPLOY_TOKEN }}.',
                ],
              },
            ],
            code: `# .github/workflows/ci.yml
name: CI Pipeline
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run lint
      - run: npm test`,
            output: `[GitHub Actions]: Workflow 'CI Pipeline' acionado.
✔ Job test: Lint OK, 42 Testes Unitários Aprovados (0 erros).`,
            lang: 'yaml',
            exercise: {
              id: 'ex-git-avanc-2',
              prompt: 'Onde devem ser salvos os arquivos de configuração de pipelines de CI/CD do GitHub Actions em um repositório?',
              type: 'multiple_choice',
              options: [
                'No diretório `.github/workflows/*.yml`',
                'No arquivo package.json',
                'Na raiz do C:\\',
                'No .gitignore',
              ],
              correctAnswer: 'No diretório `.github/workflows/*.yml`',
              hint: 'Diretório oculto padrão do GitHub para workflows.',
              explanation: 'O GitHub varre automaticamente a pasta `.github/workflows/` em busca de arquivos YAML que definem os gatilhos e etapas de automação.',
            },
          },
          {
            title: '3. Assinatura Criptográfica de Commits com Chaves GPG/SSH',
            desc: 'Garanta a autenticidade e evite falsificação de autoria com o badge "Verified" no GitHub.',
            theory: [
              {
                title: 'Por que Assinar Commits?',
                text: 'Por padrão, qualquer pessoa pode configurar qualquer nome e e-mail no git config e fingir ser outra pessoa. Assinar commits com chaves GPG ou SSH privadas garante criptograficamente a autoria.',
                keyPoints: [
                  'gpg --gen-key: Cria par de chaves assimétricas.',
                  'git config --global user.signingkey <KEY_ID>',
                  'git commit -S -m "mensagem": Assina digitalmente o hash do commit.',
                ],
              },
            ],
            code: `# Configurar assinatura de commits com chave SSH moderna
git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/id_ed25519.pub
git config --global commit.gpgsign true
git commit -m "feat(security): commit assinado com chave criptografica"` ,
            output: `[main 1a2b3c4] feat(security): commit assinado com chave criptografica
 1 file changed, 10 insertions(+)
 gpg: Signature made with ED25519 key [VERIFIED]`,
            lang: 'bash',
            exercise: {
              id: 'ex-git-avanc-3',
              prompt: 'Qual flag do comando `git commit` força a assinatura criptográfica do commit com sua chave privada cadastrada?',
              type: 'multiple_choice',
              options: ['-S (maiúsculo)', '-v', '-a', '-m'],
              correctAnswer: '-S (maiúsculo)',
              hint: 'Sign commit.',
              explanation: 'A flag `-S` instrui o Git a gerar uma assinatura criptográfica do commit usando a chave configurada no GPG/SSH.',
            },
          },
          {
            title: '4. Git Bisect e Debugging de Regressões de Código',
            desc: 'Encontre o commit exato que introduziu um bug em milhares de commits usando busca binária automatizada.',
            theory: [
              {
                title: 'Busca Binária com Git Bisect',
                text: 'O Git Bisect divide o histórico de commits pela metade a cada passo (O(log n)), permitindo encontrar a linha de código culpada por um bug entre 10.000 commits em menos de 13 tentativas.',
                keyPoints: [
                  'git bisect start',
                  'git bisect bad (versão atual quebrada)',
                  'git bisect good v1.0.0 (versão passada funcional)',
                  'git bisect run ./test.sh (automação 100% automática)',
                ],
              },
            ],
            code: `# Busca binária automatizada com script de teste
git bisect start
git bisect bad HEAD
git bisect good v2.1.0
git bisect run npm test`,
            output: `Bisecting: 16 revisions left to test after this (roughly 4 steps)
[commit 7f3a91c] is the first bad commit
Author: Dev <dev@empresa.com>
Date:   Wed Aug 20 14:30:00 2026 -0300
    fix: altera formato de serializacao JSON (Causador da regressao)`,
            lang: 'bash',
            exercise: {
              id: 'ex-git-avanc-4',
              prompt: 'Qual algoritmo de busca o `git bisect` utiliza para encontrar o commit exato que introduziu um bug?',
              type: 'multiple_choice',
              options: [
                'Busca Binária (Binary Search - O(log N))',
                'Busca Linear de um em um',
                'Tentativa aleatória',
                'Bubble Sort',
              ],
              correctAnswer: 'Busca Binária (Binary Search - O(log N))',
              hint: 'Divide o espaço de busca na metade a cada verificação.',
              explanation: 'O bisect divide o intervalo de commits no meio a cada iteração, testando se aquele ponto é "good" ou "bad" para isolar o culpado no menor número de passos possível.',
            },
          },
          {
            title: '5. Git Hooks Profissionais e Automação Local com Husky e Lint-Staged',
            desc: 'Impeça commits com erros de tipagem, falhas de lint ou segredos vazados no cliente.',
            theory: [
              {
                title: 'Git Client Hooks',
                text: 'Hooks são scripts executados automaticamente em eventos do ciclo de vida do Git (pre-commit, commit-msg, pre-push).',
                keyPoints: [
                  'pre-commit: Roda linters e testes rápidos apenas nos arquivos alterados.',
                  'commit-msg: Valida padrões Conventional Commits (feat:, fix:, chore:).',
                  'pre-push: Roda suíte de testes completa antes de enviar ao remoto.',
                ],
              },
            ],
            code: `# Configuração de Pre-commit Hook com Husky e Lint-Staged
# .husky/pre-commit
npx lint-staged

# package.json
# "lint-staged": {
#   "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
#   "*.{json,md}": ["prettier --write"]
# }`,
            output: `✔ Preparing lint-staged...
✔ Running tasks for staged files...
✔ Applying modifications to stage...
[pre-commit]: 0 erros de lint. Commit aprovado e registrado.`,
            lang: 'bash',
            exercise: {
              id: 'ex-git-avanc-5',
              prompt: 'Em qual momento o hook `pre-commit` do Git é disparado?',
              type: 'multiple_choice',
              options: [
                'Imediatamente após o comando `git commit` ser chamado e antes de a mensagem do commit ser gravada',
                'Depois que o código já está no servidor GitHub',
                'Ao ligar o computador',
                'Ao fechar o editor de código',
              ],
              correctAnswer: 'Imediatamente após o comando `git commit` ser chamado e antes de a mensagem do commit ser gravada',
              hint: 'Se o script do hook retornar código diferente de 0, o commit é cancelado.',
              explanation: 'O `pre-commit` roda antes do commit ser efetivado; se algum teste ou lint falhar, ele aborta a operação sem criar o commit.',
            },
          },
        ],
        projetos: [
          {
            title: '1. Projeto: Pipeline Completo de Release e SemVer Automatizado',
            desc: 'Configure Semantic Release para gerar tags, changelogs e releases no GitHub automaticamente.',
            theory: [{ title: 'Semantic Versioning', text: 'Versionamento semântico MAJOR.MINOR.PATCH baseado em Conventional Commits.', keyPoints: ['feat -> MINOR', 'fix -> PATCH', 'BREAKING CHANGE -> MAJOR'] }],
            code: `# Configuração do Semantic Release
{
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    "@semantic-release/github"
  ]
}`,
            output: `[Semantic Release]: Versao v2.4.1 gerada com CHANGELOG.md atualizado automaticamente.`,
            lang: 'json',
            exercise: {
              id: 'ex-git-prj-1',
              prompt: 'No versionamento semântico (SemVer: X.Y.Z), o que um commit com mensagem `fix: corrige falha de segurança` incrementa?',
              type: 'multiple_choice',
              options: ['PATCH (o terceiro dígito Z: v1.0.1)', 'MAJOR (o primeiro dígito X: v2.0.0)', 'MINOR (o segundo dígito Y: v1.1.0)', 'Nenhum número'],
              correctAnswer: 'PATCH (o terceiro dígito Z: v1.0.1)',
              hint: 'Correção de bug retrocompatível.',
              explanation: 'Por convenção SemVer, correções de bugs sem quebra de compatibilidade incrementam a versão PATCH.',
            },
          },
          {
            title: '2. Projeto: Recuperação Forense de Repositório com Git Reflog e Git Fsck',
            desc: 'Recupere commits e branches deletadas acidentalmente após um git reset --hard destrutivo.',
            theory: [{ title: 'A Rede de Segurança: Git Reflog', text: 'O Git nunca apaga commits imediatamente; o reflog registra cada movimento do ponteiro HEAD por 30 a 90 dias.', keyPoints: ['git reflog', 'git checkout -b recuperada HEAD@{2}'] }],
            code: `# Recuperar commit perdido apos git reset --hard
git reflog
# Localizar o hash anterior: 3c4d5e6 HEAD@{1}: commit: logica importante
git switch -c branch-recuperada 3c4d5e6`,
            output: `Switched to a new branch 'branch-recuperada'
[Recuperação]: 100% do código restaurado com sucesso através do Reflog.`,
            lang: 'bash',
            exercise: {
              id: 'ex-git-prj-2',
              prompt: 'Qual comando do Git lista o histórico completo de movimentações locais do ponteiro HEAD, permitindo recuperar commits perdidos?',
              type: 'multiple_choice',
              options: ['git reflog', 'git delete', 'git clear', 'git push --force'],
              correctAnswer: 'git reflog',
              hint: 'Reference Log.',
              explanation: 'O `git reflog` mantém um diário de todas as referências para onde o HEAD já apontou, sendo a ferramenta definitiva de resgate contra comandos destrutivos.',
            },
          },
          {
            title: '3. Projeto: Auditoria de Segurança de Repositório e Varredura de Segredos com Gitleaks',
            desc: 'Escaneie todo o histórico de commits em busca de chaves privadas, tokens AWS e senhas vazadas.',
            theory: [{ title: 'Secret Scanning', text: 'Prevenção de vazamento de credenciais na nuvem.', keyPoints: ['gitleaks detect --verbose', 'Remoção com git-filter-repo'] }],
            code: `# Execução de scanner Gitleaks no repositório
gitleaks detect --source . --verbose --report-path leaks-report.json`,
            output: `[Gitleaks]: 0 segredos detectados no histórico de commits. Repositório 100% seguro.`,
            lang: 'bash',
            exercise: {
              id: 'ex-git-prj-3',
              prompt: 'Por que simplesmente deletar um arquivo de senha no commit seguinte NÃO remove a senha do repositório Git?',
              type: 'multiple_choice',
              options: [
                'Porque o Git mantém o histórico completo de todos os commits anteriores, permitindo que qualquer pessoa veja a senha visualizando o commit passado',
                'Porque o GitHub não atualiza arquivos',
                'Porque a senha fica gravada na BIOS do computador',
                'Porque o Git bloqueia edições',
              ],
              correctAnswer: 'Porque o Git mantém o histórico completo de todos os commits anteriores, permitindo que qualquer pessoa veja a senha visualizando o commit passado',
              hint: 'O Git é imutável: o commit passado ainda existe no banco de objetos.',
              explanation: 'Para remover um segredo de verdade, é necessário reescrever o histórico (ex: com git-filter-repo ou BFG Repo-Cleaner) e revogar a credencial imediatamente.',
            },
          },
          {
            title: '4. Projeto: Arquitetura Monorepo com Git Submodules e Workspaces',
            desc: 'Gerencie múltiplos projetos e bibliotecas compartilhadas com submódulos sincronizados.',
            theory: [{ title: 'Git Submodules', text: 'Permite manter um repositório Git como subdiretório de outro repositório.', keyPoints: ['git submodule add <url>', 'git submodule update --init --recursive'] }],
            code: `# Adicionar submódulo de componentes compartilhados
git submodule add git@github.com:empresa/ui-kit.git packages/ui-kit
git submodule update --init --recursive`,
            output: `Submodule 'packages/ui-kit' (git@github.com:empresa/ui-kit.git) registered for path 'packages/ui-kit'
Cloning into 'packages/ui-kit'... done.`,
            lang: 'bash',
            exercise: {
              id: 'ex-git-prj-4',
              prompt: 'Ao clonar um repositório que possui Git Submodules, qual flag do `git clone` baixa automaticamente os submódulos?',
              type: 'multiple_choice',
              options: ['--recurse-submodules', '--all', '--fast', '--depth=1'],
              correctAnswer: '--recurse-submodules',
              hint: 'Inicializa recursivamente todos os sub-repositórios.',
              explanation: '`git clone --recurse-submodules` clona o repositório principal e já inicializa e baixa todos os submódulos configurados.',
            },
          },
          {
            title: '5. Projeto Final: Criação de Git Action Customizada em Docker/TypeScript',
            desc: 'Desenvolva uma GitHub Action personalizada empacotada em container para automação de segurança.',
            theory: [{ title: 'Custom Actions', text: 'Crie ações reutilizáveis para o marketplace do GitHub.', keyPoints: ['action.yml metadados', '@actions/core e @actions/github'] }],
            code: `# action.yml
name: 'Security Header Checker'
description: 'Valida cabeçalhos de segurança em APIs'
runs:
  using: 'node20'
  main: 'dist/index.js'`,
            output: `[Action Publicada]: Custom GitHub Action pronta para uso em qualquer pipeline corporativo.`,
            lang: 'yaml',
            exercise: {
              id: 'ex-git-prj-5',
              prompt: 'Qual arquivo de manifesto é obrigatório na raiz de um repositório para definir uma Custom GitHub Action?',
              type: 'multiple_choice',
              options: ['action.yml (ou action.yaml)', 'github.json', 'action.config.js', 'docker-compose.yml'],
              correctAnswer: 'action.yml (ou action.yaml)',
              hint: 'Arquivo de manifesto padrão que define inputs, outputs e o runtime de execução.',
              explanation: 'O `action.yml` contém a especificação da ação, incluindo nome, descrição, parâmetros de entrada/saída e se ela executa via Node.js ou Docker.',
            },
          },
        ],
      },
      quizzesByLevel: {
        iniciante: [
          {
            id: 'gq-ini-1',
            question: 'Qual comando exibe o status dos arquivos modificados, staged e untracked na sua área de trabalho?',
            options: ['git status', 'git show', 'git config', 'git branch'],
            correctIndex: 0,
            explanation: '`git status` resume o estado do diretório de trabalho e da staging area.',
          },
        ],
        intermediario: [
          {
            id: 'gq-int-1',
            question: 'O que o comando `git stash` faz?',
            options: [
              'Salva temporariamente o trabalho não commitado em uma pilha interna e limpa a área de trabalho para permitir trocar de branch com segurança',
              'Apaga o repositório',
              'Envia o código para o GitHub',
              'Deleta todos os branches',
            ],
            correctIndex: 0,
            explanation: 'O stash armazena alterações incompletas na pilha para você poder retomar o trabalho mais tarde.',
          },
        ],
        avancado: [
          {
            id: 'gq-av-1',
            question: 'No `git rebase -i`, qual subcomando permite mesclar múltiplos commits em um único commit?',
            options: ['squash (ou fixup)', 'drop', 'edit', 'reword'],
            correctIndex: 0,
            explanation: 'squash e fixup combinam o commit com o anterior, reduzindo a poluição no histórico.',
          },
        ],
        projetos: [
          {
            id: 'gq-prj-1',
            question: 'Qual ferramenta é essencial para inspecionar o histórico e resgatar commits perdidos após um reset acidental?',
            options: ['git reflog', 'git push', 'git branch -D', 'git clean -fd'],
            correctIndex: 0,
            explanation: 'O reflog mantém o histórico cronológico de cada posição do ponteiro HEAD.',
          },
        ],
      },
    };
