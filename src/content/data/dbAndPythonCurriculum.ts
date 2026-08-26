import { TechCurriculumData } from '../techCurriculum';

export const DB_PYTHON_CURRICULUM: Record<string, TechCurriculumData> = {
  // =========================================================================
  // POSTGRESQL + ARQUITETURA + SEGURANÇA + TESTES
  // =========================================================================
  postgresql: {
    topicsByLevel: {
      iniciante: [
        {
          title: '1. Modelagem Relacional, Tipos Avançados (JSONB, UUID) e Constraints',
          desc: 'Aprenda DDL moderno, chaves primárias, estrangeiras e integridade referencial rigorosa.',
          theory: [
            {
              title: 'A Solidez do PostgreSQL',
              text: 'O PostgreSQL é o banco de dados relacional open source mais avançado do mundo. Oferece suporte completo a transações ACID, extensões nativas e tipos de dados modernos como UUID e JSONB com indexação GIN.',
              keyPoints: [
                'CREATE TABLE usuarios (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), email VARCHAR(255) UNIQUE NOT NULL);',
                'Tipo JSONB: Armazena JSON binário permitindo consultas e índices sobre propriedades internas.',
                'Foreign Keys com ON DELETE CASCADE / RESTRICT para garantir integridade referencial.',
              ],
            },
          ],
          code: `-- Criação de tabela profissional com UUID e JSONB
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE clientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    metadados JSONB DEFAULT '{}'::jsonb,
    criado_em TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);`,
          output: `CREATE EXTENSION
CREATE TABLE
Table "public.clientes" created successfully with pgcrypto UUID default.`,
          lang: 'sql',
          exercise: {
            id: 'ex-pg-ini-1',
            prompt: 'No PostgreSQL, qual a principal vantagem do tipo de dado `JSONB` em comparação com o `JSON` textual tradicional?',
            type: 'multiple_choice',
            options: [
              'O JSONB é armazenado em formato binário decomposto, permitindo buscas e indexação ultra-rápidas com operadores `@>` e índices GIN',
              'O JSONB é mais lento',
              'O JSONB só aceita números',
              'Não existe tipo JSONB no PostgreSQL',
            ],
            correctAnswer: 'O JSONB é armazenado em formato binário decomposto, permitindo buscas e indexação ultra-rápidas com operadores `@>` e índices GIN',
            hint: 'B de Binary: já parseado e pronto para consultas indexadas.',
            explanation: 'JSONB armazena os dados já analisados e estruturados em binário, possibilitando criação de índices GIN e consultas instantâneas em propriedades aninhadas.',
          },
        },
        {
          title: '2. Consultas Avançadas: JOINs, Subqueries, CTEs (WITH) e Window Functions',
          desc: 'Estruture queries analíticas complexas com Common Table Expressions e funções de janela (ROW_NUMBER, RANK).',
          theory: [
            {
              title: 'CTEs e Window Functions',
              text: 'CTEs (cláusula WITH) tornam queries legíveis e modularizadas. Window Functions realizam cálculos agregados mantendo as linhas individuais sem agrupar com GROUP BY.',
              keyPoints: [
                'WITH vendas_resumo AS (SELECT ... ) SELECT * FROM vendas_resumo;',
                'ROW_NUMBER() OVER (PARTITION BY categoria ORDER BY valor DESC) para ranking.',
              ],
            },
          ],
          code: `-- Query com CTE e Window Function para ranking por categoria
WITH vendas_classificadas AS (
    SELECT 
        vendedor_id,
        categoria,
        total_vendas,
        DENSE_RANK() OVER (PARTITION BY categoria ORDER BY total_vendas DESC) as posicao_ranking
    FROM relatorio_vendas
)
SELECT * FROM vendas_classificadas WHERE posicao_ranking <= 3;`,
          output: `vendedor_id | categoria  | total_vendas | posicao_ranking
------------+------------+--------------+----------------
usr_01      | Cloud      |     45000.00 |               1
usr_09      | Cloud      |     38000.00 |               2
usr_04      | Backend    |     52000.00 |               1`,
          lang: 'sql',
          exercise: {
            id: 'ex-pg-ini-2',
            prompt: 'Qual a finalidade das Window Functions (como `ROW_NUMBER() OVER (...)`) no PostgreSQL?',
            type: 'multiple_choice',
            options: [
              'Executar cálculos analíticos sobre um conjunto de linhas relacionadas sem colapsar as linhas em um único resultado como faz o GROUP BY',
              'Abrir uma nova janela no Windows',
              'Limpar os dados da tabela',
              'Reiniciar o servidor',
            ],
            correctAnswer: 'Executar cálculos analíticos sobre um conjunto de linhas relacionadas sem colapsar as linhas em um único resultado como faz o GROUP BY',
            hint: 'Preserva a identidade de cada registro enquanto calcula agregações contextuais.',
            explanation: 'Window functions computam métricas agregadas (médias móveis, rankings, somas acumuladas) preservando todas as linhas individuais do resultado.',
          },
        },
      ],
      intermediario: [
        {
          title: '1. Otimização de Performance: EXPLAIN ANALYZE e Estratégias de Índices (B-Tree, GIN, GiST)',
          desc: 'Analise planos de execução (Seq Scan vs Index Scan), buffers de memória e elimine gargalos de I/O.',
          theory: [
            {
              title: 'Lendo Planos de Execução',
              text: 'EXPLAIN ANALYZE executa a consulta e relata o tempo real gasto em cada nó do plano. O objetivo é substituir leituras sequenciais em tabelas grandes (Seq Scan) por Index Scan ou Bitmap Index Scan.',
              keyPoints: [
                'B-Tree: Padrão para comparações =, <, >, BETWEEN.',
                'GIN (Generalized Inverted Index): Para campos JSONB, arrays e busca textual (Full Text Search).',
                'Índices Parciais: CREATE INDEX idx ON pedidos (cliente_id) WHERE status = "pendente";',
              ],
            },
          ],
          code: `-- Análise de plano de execução de consulta
EXPLAIN (ANALYZE, BUFFERS)
SELECT id, email, metadados 
FROM clientes 
WHERE metadados @> '{"plano": "enterprise"}';`,
          output: `Bitmap Heap Scan on clientes  (cost=12.30..85.40 rows=25 width=128) (actual time=0.82..1.45 rows=22 loops=1)
  Recheck Cond: (metadados @> '{"plano": "enterprise"}'::jsonb)
  Buffers: shared hit=8
  ->  Bitmap Index Scan on idx_clientes_metadados_gin  (cost=0.00..12.30 rows=25 width=0) (actual time=0.34..0.34 rows=22 loops=1)
Execution Time: 1.62 ms`,
          lang: 'sql',
          exercise: {
            id: 'ex-pg-inter-1',
            prompt: 'Qual tipo de índice no PostgreSQL é ideal para acelerar consultas de busca em campos do tipo JSONB e arrays?',
            type: 'multiple_choice',
            options: ['GIN (Generalized Inverted Index)', 'B-Tree simples', 'Hash Index', 'BRIN'],
            correctAnswer: 'GIN (Generalized Inverted Index)',
            hint: 'Índice Invertido Generalizado.',
            explanation: 'Índices GIN indexam cada chave e valor interno de documentos JSONB e elementos de arrays, permitindo buscas instantâneas com o operador `@>`.',
          },
        },
        {
          title: '2. Segurança Avançada com Row-Level Security (RLS) e Políticas de Acesso',
          desc: 'Isole os dados de cada tenant ou usuário diretamente no motor do banco de dados.',
          theory: [
            {
              title: 'Row-Level Security (RLS)',
              text: 'O RLS garante que, mesmo que a aplicação execute SELECT * FROM documentos, o PostgreSQL só retornará as linhas que o usuário conectado tiver permissão para ver de acordo com a POLICY.',
              keyPoints: [
                'ALTER TABLE documentos ENABLE ROW LEVEL SECURITY;',
                'CREATE POLICY doc_usuario_policy ON documentos USING (usuario_id = current_setting("app.current_user_id")::uuid);',
              ],
            },
          ],
          code: `-- Configuração de RLS corporativo
ALTER TABLE faturas ENABLE ROW LEVEL SECURITY;

CREATE POLICY faturas_isolamento_tenant ON faturas
    FOR ALL
    USING (empresa_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);`,
          output: `ALTER TABLE
CREATE POLICY
Row-Level Security ativo na tabela faturas. Isolamento de dados garantido no nível do banco.`,
          lang: 'sql',
          exercise: {
            id: 'ex-pg-inter-2',
            prompt: 'Qual é o principal benefício de segurança do Row-Level Security (RLS) no PostgreSQL?',
            type: 'multiple_choice',
            options: [
              'Garante que o isolamento de dados entre usuários ou clientes ocorra diretamente no banco de dados, protegendo contra falhas de programação ou esquecimento de cláusulas WHERE no backend',
              'Criptografa o monitor do computador',
              'Apaga logs antigos',
              'Desativa o SQL',
            ],
            correctAnswer: 'Garante que o isolamento de dados entre usuários ou clientes ocorra diretamente no banco de dados, protegendo contra falhas de programação ou esquecimento de cláusulas WHERE no backend',
            hint: 'Defesa em profundidade no próprio banco relacional.',
            explanation: 'Mesmo que o desenvolvedor cometa um erro e execute `SELECT * FROM dados` sem filtro WHERE, o motor do PostgreSQL filtra as linhas com base na política RLS ativa.',
          },
        },
        {
          title: '3. Transações ACID, Níveis de Isolamento e Prevenção de Deadlocks',
          desc: 'Gerencie concorrência com Read Committed, Repeatable Read e Serializable.',
          theory: [
            {
              title: 'Níveis de Isolamento no PostgreSQL',
              text: 'Entenda anomalias como Dirty Reads, Non-Repeatable Reads e Phantom Reads. Use SELECT FOR UPDATE para bloqueio pessimista seguro.',
              keyPoints: [
                'BEGIN; ... COMMIT; / ROLLBACK;',
                'SELECT saldo FROM contas WHERE id = 1 FOR UPDATE; (impede race conditions de saldo negativo)',
              ],
            },
          ],
          code: `-- Transferência bancária segura com bloqueio pessimista
BEGIN;
SELECT saldo FROM contas WHERE id = 101 FOR UPDATE;
UPDATE contas SET saldo = saldo - 500 WHERE id = 101;
UPDATE contas SET saldo = saldo + 500 WHERE id = 102;
INSERT INTO historico_transferencias (origem, destino, valor) VALUES (101, 102, 500);
COMMIT;`,
          output: `BEGIN
UPDATE 1
UPDATE 1
INSERT 0 1
COMMIT [Transação ACID finalizada com sucesso sem condições de corrida]`,
          lang: 'sql',
          exercise: {
            id: 'ex-pg-inter-3',
            prompt: 'Qual cláusula SQL em uma transação bloqueia a linha selecionada para escrita até o fim do commit, prevenindo transferências concorrentes duplicadas?',
            type: 'multiple_choice',
            options: ['FOR UPDATE', 'FOR READ', 'LOCK ALL', 'BLOCK TABLE'],
            correctAnswer: 'FOR UPDATE',
            hint: 'Bloqueio pessimista de linha (Row-Level Locking).',
            explanation: '`SELECT ... FOR UPDATE` adquire um lock exclusivo na linha, forçando outras transações que tentem ler ou alterar a mesma linha a aguardar a conclusão do commit atual.',
          },
        },
      ],
      avancado: [
        {
          title: '1. Testes Automatizados de Banco de Dados com Testcontainers e Migrações Seguras',
          desc: 'Suba instâncias reais de PostgreSQL em containers descartáveis para testes de integração com 100% de fidelidade.',
          theory: [
            {
              title: 'Testes de Integração Confiáveis',
              text: 'Mocks de banco de dados escondem bugs de dialeto e concorrência. Testcontainers inicia um PostgreSQL real em Docker durante a execução dos testes automatizados.',
              keyPoints: ['Testcontainers para Node/Java/Python', 'Migrações sem downtime com ferramentas como Prisma, Drizzle ou Flyway.'],
            },
          ],
          code: `import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { Pool } from 'pg';

describe('Testes de Banco com PostgreSQL Real', () => {
  let container: any;
  let pool: Pool;

  beforeAll(async () => {
    container = await new PostgreSqlContainer('postgres:16-alpine').start();
    pool = new Pool({ connectionString: container.getConnectionUri() });
    await pool.query('CREATE TABLE teste (id serial, nome text)');
  }, 30000);

  afterAll(async () => {
    await pool.end();
    await container.stop();
  });

  test('insere e busca registro com sucesso', async () => {
    await pool.query("INSERT INTO teste (nome) VALUES ('Item Real')");
    const res = await pool.query('SELECT COUNT(*) FROM teste');
    expect(res.rows[0].count).toBe('1');
  });
});`,
          output: `PASS src/db/integracao.test.ts (1 test passed in isolated real Postgres container)`,
          lang: 'typescript',
          exercise: {
            id: 'ex-pg-avanc-1',
            prompt: 'Por que o uso de bibliotecas como Testcontainers é superior ao uso de mocks em testes de integração de banco de dados?',
            type: 'multiple_choice',
            options: [
              'Porque roda uma instância real e idêntica do PostgreSQL em container, validando triggers, índices, dialeto SQL e constraints com 100% de precisão',
              'Porque consome menos internet',
              'Porque substitui o editor de código',
              'Porque não precisa de testes',
            ],
            correctAnswer: 'Porque roda uma instância real e idêntica do PostgreSQL em container, validando triggers, índices, dialeto SQL e constraints com 100% de precisão',
            hint: 'Fidelidade real de ambiente.',
            explanation: 'Testcontainers executa o PostgreSQL oficial, garantindo que queries complexas, extensões e constraints de integridade funcionem exatamente como em produção.',
          },
        },
      ],
      projetos: [
        {
          title: '1. Projeto: Sistema de Auditoria Temporal com Triggers e Histórico Imutável',
          desc: 'Implemente um sistema de trilha de auditoria completa gravando versões anteriores de registros em JSONB.',
          theory: [{ title: 'Trilhas de Auditoria (Audit Trail)', text: 'Gravação imutável de todas as operações INSERT/UPDATE/DELETE.', keyPoints: ['Triggers em PL/pgSQL', 'Armazenamento de OLD e NEW em JSONB'] }],
          code: `-- Trigger de auditoria automática
CREATE OR REPLACE FUNCTION auditar_alteracao() RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO logs_auditoria (tabela, operacao, dados_anteriores, dados_novos, alterado_por)
    VALUES (TG_TABLE_NAME, TG_OP, to_jsonb(OLD), to_jsonb(NEW), current_user);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;`,
          output: `CREATE FUNCTION
[Auditoria]: Trigger ativa. 100% das alterações são gravadas com histórico temporal imutável.`,
          lang: 'sql',
          exercise: {
            id: 'ex-pg-prj-1',
            prompt: 'Em uma função Trigger do PostgreSQL para auditoria, quais variáveis especiais contêm a linha antes e depois da alteração em um UPDATE?',
            type: 'multiple_choice',
            options: ['OLD e NEW', 'BEFORE e AFTER', 'PAST e FUTURE', 'SRC e DST'],
            correctAnswer: 'OLD e NEW',
            hint: 'OLD contém os dados anteriores; NEW contém os novos dados.',
            explanation: 'Em triggers PL/pgSQL, a variável de registro `OLD` armazena a versão da linha antes da modificação e `NEW` a nova versão.',
          },
        },
      ],
    },
    quizzesByLevel: {
      iniciante: [
        {
          id: 'pq-ini-1',
          question: 'Qual a finalidade de uma Foreign Key (Chave Estrangeira) com `ON DELETE RESTRICT`?',
          options: [
            'Impedir que uma linha pai seja excluída caso existam registros filhos associados a ela na outra tabela, preservando a integridade referencial',
            'Apagar o banco de dados',
            'Permitir senhas vazias',
            'Desativar o backup',
          ],
          correctIndex: 0,
          explanation: '`ON DELETE RESTRICT` impede a exclusão acidental de registros que ainda possuem dependências em tabelas filhas.',
        },
      ],
      intermediario: [
        {
          id: 'pq-int-1',
          question: 'O que o comando `EXPLAIN (ANALYZE)` faz no PostgreSQL?',
          options: [
            'Executa a query e exibe o plano de execução real detalhando custos de nós, buffers e tempo em milissegundos',
            'Formata o código SQL',
            'Cria um novo usuário',
            'Exporta os dados em PDF',
          ],
          correctIndex: 0,
          explanation: '`EXPLAIN ANALYZE` é a ferramenta definitiva de diagnóstico de performance de queries no PostgreSQL.',
        },
      ],
      avancado: [
        {
          id: 'pq-av-1',
          question: 'Como o Row-Level Security (RLS) aumenta a segurança em aplicações Multi-Tenant?',
          options: [
            'Forçando o motor do banco a filtrar as linhas retornadas com base na identidade do tenant da sessão, mesmo se a aplicação esquecer de aplicar filtros na consulta',
            'Bloqueando todas as consultas',
            'Desativando a rede',
            'Apagando tabelas antigas',
          ],
          correctIndex: 0,
          explanation: 'O RLS estabelece uma barreira de segurança no nível do banco, impedindo vazamento de dados entre empresas clientes.',
        },
      ],
      projetos: [
        {
          id: 'pq-prj-1',
          question: 'Por que usar Triggers em PL/pgSQL para auditoria é mais confiável do que gravar logs na camada da aplicação?',
          options: [
            'Porque a Trigger é executada dentro da transação do banco em qualquer alteração, inclusive modificações feitas diretamente por ferramentas administrativas de DBA',
            'Porque a aplicação é mais lenta',
            'Porque o banco não tem logs',
            'Não há diferença',
          ],
          correctIndex: 0,
          explanation: 'Triggers garantem auditoria total e infalível, mesmo se alterações forem feitas fora da API principal.',
        },
      ],
    },
  },

  // =========================================================================
  // PYTHON + AUTOMAÇÃO + FASTAPI
  // =========================================================================
  python_fastapi: {
    topicsByLevel: {
      iniciante: [
        {
          title: '1. Fundamentos de FastAPI, Rotas Assíncronas (async/await) e Type Hints',
          desc: 'Construa APIs assíncronas com documentação Swagger automática e alto desempenho.',
          theory: [
            {
              title: 'Por que FastAPI?',
              text: 'FastAPI é um framework moderno e ultrarrápido para Python baseado em Starlette e Pydantic, oferecendo documentação interativa automática e suporte nativo a async/await sobre ASGI (Uvicorn).',
              keyPoints: [
                'from fastapi import FastAPI -> app = FastAPI()',
                '@app.get("/items/{item_id}") async def read_item(...)',
                'Type hints do Python 3.10+ (ex: int, str, list[str]) para validação e auto-complete.',
              ],
            },
          ],
          code: `from fastapi import FastAPI
from datetime import datetime

app = FastAPI(title="Minha API de Alta Performance", version="1.0.0")

@app.get("/api/v1/saudacao/{nome}")
async def obter_saudacao(nome: str, vip: bool = False):
    return {
        "mensagem": f"Olá, {nome}!",
        "status": "Acesso VIP" if vip else "Acesso Padrão",
        "timestamp": datetime.utcnow()
    }`,
          output: `INFO: Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO: Application startup complete. Swagger UI disponível em http://127.0.0.1:8000/docs`,
          lang: 'python',
          exercise: {
            id: 'ex-pyfast-ini-1',
            prompt: 'Qual servidor ASGI de alta performance é o padrão utilizado para executar aplicações FastAPI?',
            type: 'multiple_choice',
            options: ['Uvicorn', 'Apache Tomcat', 'Nginx puro', 'Node.js'],
            correctAnswer: 'Uvicorn',
            hint: 'Servidor ASGI baseado em uvloop e httptools.',
            explanation: 'Uvicorn é o servidor ASGI de alta performance recomendado para executar aplicações assíncronas em FastAPI.',
          },
        },
        {
          title: '2. Validação Estrita de Dados com Modelos Pydantic v2',
          desc: 'Defina esquemas de entrada e saída com BaseModel, Field e validadores customizados.',
          theory: [
            {
              title: 'Pydantic v2',
              text: 'Pydantic cuida da validação e serialização de dados no FastAPI com o motor interno compilado em Rust, garantindo validação quase instantânea.',
              keyPoints: [
                'class UsuarioCreate(BaseModel): nome: str, email: EmailStr, idade: int = Field(ge=18)',
                'Modelos de resposta: response_model=UsuarioResponse para evitar vazamento de campos confidenciais como senhas.',
              ],
            },
          ],
          code: `from pydantic import BaseModel, EmailStr, Field

class UsuarioEntrada(BaseModel):
    nome: str = Field(min_length=3, max_length=50)
    email: EmailStr
    idade: int = Field(ge=18, description="Deve ser maior de idade")

class UsuarioSaida(BaseModel):
    id: int
    nome: str
    email: EmailStr
    ativo: bool = True`,
          output: '[Pydantic v2]: Modelos compilados com validação Rust ultrarrápida.',
          lang: 'python',
          exercise: {
            id: 'ex-pyfast-ini-2',
            prompt: 'No FastAPI, como você impede que o hash da senha de um usuário seja retornado na resposta da API ao cadastrar uma conta?',
            type: 'multiple_choice',
            options: [
              'Definindo um modelo Pydantic de saída no parâmetro `@app.post("/usuarios", response_model=UsuarioPublico)` contendo apenas os campos seguros',
              'Apagando a senha do banco',
              'Desativando o JSON',
              'Não é possível',
            ],
            correctAnswer: 'Definindo um modelo Pydantic de saída no parâmetro `@app.post("/usuarios", response_model=UsuarioPublico)` contendo apenas os campos seguros',
            hint: 'Uso de `response_model` para filtragem declarativa de dados.',
            explanation: 'O `response_model` instrui o FastAPI a serializar e filtrar exclusivamente os campos declarados naquele esquema, descartando dados confidenciais.',
          },
        },
      ],
      intermediario: [
        {
          title: '1. Injeção de Dependências (Depends) e Autenticação OAuth2 / JWT',
          desc: 'Estruture controle de acesso modular e reutilizável com o sistema de Depends() do FastAPI.',
          theory: [
            {
              title: 'Injeção de Dependências no FastAPI',
              text: 'O sistema de Depends() permite compartilhar conexões de banco de dados, validação de tokens JWT e verificação de permissões de forma declarativa em endpoints.',
              keyPoints: [
                'async def get_db(): try: yield db finally: db.close()',
                'async def get_current_user(token: str = Depends(oauth2_scheme)): ...',
              ],
            },
          ],
          code: `from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def obter_usuario_logado(token: str = Depends(oauth2_scheme)):
    if token != "token-secreto-valido":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciais inválidas",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return {"id": 1, "usuario": "admin", "role": "superuser"}` ,
          output: '[Injeção de Dependências]: Autenticação JWT injetada em rotas protegidas.',
          lang: 'python',
          exercise: {
            id: 'ex-pyfast-inter-1',
            prompt: 'Qual função do FastAPI é usada para declarar dependências reutilizáveis (como conexão de banco ou usuário autenticado) em rotas?',
            type: 'multiple_choice',
            options: ['Depends()', 'Inject()', 'Require()', 'Use()'],
            correctAnswer: 'Depends()',
            hint: 'Injeção declarativa nos parâmetros da função.',
            explanation: '`Depends()` é a primitiva central do FastAPI para injeção de dependências modular e hierárquica.',
          },
        },
        {
          title: '2. Automação e Web Scraping com BeautifulSoup, Playwright e AsyncIO',
          desc: 'Colete dados da web, renderize páginas dinâmicas em JavaScript e automatize tarefas repetitivas.',
          theory: [
            {
              title: 'Web Scraping Moderno com Playwright',
              text: 'Playwright permite controlar navegadores Chromium/Firefox headless de forma assíncrona para interagir com SPAs, clicar em botões e extrair dados protegidos por JavaScript.',
              keyPoints: ['async with async_playwright() as p: browser = await p.chromium.launch()', 'page.goto(url), page.query_selector_all()'],
            },
          ],
          code: `import asyncio
from bs4 import BeautifulSoup

html_doc = """
<div class="cotacao">
    <span class="ativo">PETR4</span>
    <span class="preco">R$ 38,50</span>
</div>
"""

soup = BeautifulSoup(html_doc, 'html.parser')
ativo = soup.find('span', class_='ativo').text
preco = soup.find('span', class_='preco').text
print(f"Extraído: {ativo} cotado a {preco}")`,
          output: `Extraído: PETR4 cotado a R$ 38,50 [Automação de extração de dados concluída]`,
          lang: 'python',
          exercise: {
            id: 'ex-pyfast-inter-2',
            prompt: 'Qual biblioteca Python moderna é recomendada para automação de navegadores com suporte a JavaScript dinâmico e execução assíncrona?',
            type: 'multiple_choice',
            options: ['Playwright (ou Selenium)', 'math', 'json', 'sys'],
            correctAnswer: 'Playwright (ou Selenium)',
            hint: 'Ferramenta da Microsoft para automação headless moderna.',
            explanation: 'Playwright gerencia instâncias reais de navegadores headless de forma assíncrona, sendo ideal para páginas SPA complexas.',
          },
        },
      ],
      avancado: [
        {
          title: '1. Tarefas em Segundo Plano (Celery + Redis) e WebSockets em Tempo Real',
          desc: 'Descarregue tarefas pesadas (envio de e-mails, processamento de relatórios) com filas distribuídas.',
          theory: [
            {
              title: 'Background Workers com Celery',
              text: 'Tarefas que demoram mais de 500ms devem ser enviadas para workers em segundo plano com Celery sobre Redis/RabbitMQ, mantendo a API responsiva a 60 req/s.',
              keyPoints: ['@celery.task def processar_relatorio(): ...', 'BackgroundTasks do FastAPI para tarefas leves locais.'],
            },
          ],
          code: `from fastapi import FastAPI, BackgroundTasks

app = FastAPI()

def enviar_email_auditoria(email: str, evento: str):
    # Simula envio assíncrono de e-mail sem travar a resposta da requisição
    print(f"[Worker Background]: E-mail de {evento} enviado para {email}")

@app.post("/notificar")
async def disparar_notificacao(email: str, background_tasks: BackgroundTasks):
    background_tasks.add_task(enviar_email_auditoria, email, "Alerta de Seguranca")
    return {"status": "Notificação agendada com sucesso."}`,
          output: `{"status": "Notificação agendada com sucesso."}
[Worker Background]: E-mail de Alerta de Seguranca enviado para admin@empresa.com`,
          lang: 'python',
          exercise: {
            id: 'ex-pyfast-avanc-1',
            prompt: 'Por que tarefas de longa duração (como processamento de imagens ou envio de e-mails) devem ser executadas em background tasks e não de forma síncrona na rota da API?',
            type: 'multiple_choice',
            options: [
              'Para responder imediatamente ao cliente sem bloquear os threads da API e evitar timeouts na requisição HTTP',
              'Para economizar espaço no HD',
              'Porque o Python não suporta e-mails',
              'Para desligar o servidor',
            ],
            correctAnswer: 'Para responder imediatamente ao cliente sem bloquear os threads da API e evitar timeouts na requisição HTTP',
            hint: 'Não prenda a conexão HTTP do usuário aguardando processamentos demorados.',
            explanation: 'Processar tarefas demoradas em segundo plano garante baixa latência na API e previne gargalos de concorrência.',
          },
        },
      ],
      projetos: [
        {
          title: '1. Projeto: Microsserviço de Processamento Assíncrono com Cache Redis e Docker',
          desc: 'Construa um microsserviço completo com FastAPI, PostgreSQL assíncrono (asyncpg), cache Redis e empacotamento Docker.',
          theory: [{ title: 'Microsserviço de Alta Escala', text: 'Arquitetura com Uvicorn workers e conexões pool no asyncpg.', keyPoints: ['Dockerfile com poetry/uv', 'Redis cache com TTL'] }],
          code: `from fastapi import FastAPI
import asyncpg

app = FastAPI()

@app.get("/metricas")
async def obter_metricas():
    return {"throughput": "15.000 req/s", "latencia_media_ms": 1.8}`,
          output: '[FastAPI Microsserviço]: 15.000 req/s processadas com estabilidade em cluster Docker.',
          lang: 'python',
          exercise: {
            id: 'ex-pyfast-prj-1',
            prompt: 'Qual driver assíncrono de PostgreSQL em Python é conhecido por oferecer a maior velocidade e menor consumo de recursos para FastAPI?',
            type: 'multiple_choice',
            options: ['asyncpg', 'sqlite3', 'csv', 'openpyxl'],
            correctAnswer: 'asyncpg',
            hint: 'Driver assíncrono de altíssima performance para PostgreSQL.',
            explanation: '`asyncpg` é implementado em Cython com comunicação direta via protocolo binário do PostgreSQL, sendo até 5x mais rápido que drivers tradicionais.',
          },
        },
      ],
    },
    quizzesByLevel: {
      iniciante: [
        {
          id: 'pyq-ini-1',
          question: 'O que o FastAPI gera automaticamente a partir dos tipos Pydantic e anotações das rotas?',
          options: [
            'Documentação interativa completa no padrão Swagger UI (/docs) e ReDoc (/redoc)',
            'Um arquivo PDF para impressão',
            'Uma conta no GitHub',
            'Um novo computador virtual',
          ],
          correctIndex: 0,
          explanation: 'FastAPI inspeciona as assinaturas das rotas e gera a especificação OpenAPI e documentação interativa automaticamente.',
        },
      ],
      intermediario: [
        {
          id: 'pyq-int-1',
          question: 'Qual a finalidade do sistema `Depends()` no FastAPI?',
          options: [
            'Permitir injeção de dependências compartilhadas, como autenticação de usuário e sessões de banco de dados, de forma modular e testável',
            'Instalar pacotes pelo terminal',
            'Reiniciar o computador',
            'Apagar dados do banco',
          ],
          correctIndex: 0,
          explanation: 'O `Depends()` centraliza lógicas transversais que precisam ser executadas antes dos endpoints.',
        },
      ],
      avancado: [
        {
          id: 'pyq-av-1',
          question: 'Para que serve a classe `BackgroundTasks` no FastAPI?',
          options: [
            'Executar funções leves em segundo plano após o retorno da resposta HTTP para o cliente, sem travar a interface',
            'Mineração de criptomoedas',
            'Formatação do sistema',
            'Desativação de logs',
          ],
          correctIndex: 0,
          explanation: '`BackgroundTasks` executa operações pós-resposta no mesmo processo ASGI sem atrasar a resposta ao usuário.',
        },
      ],
      projetos: [
        {
          id: 'pyq-prj-1',
          question: 'Qual a combinação recomendada para construir microsserviços Python de altíssimo throughput e baixa latência?',
          options: [
            'FastAPI + Uvicorn + asyncpg + Redis Cache',
            'Python 2.7 + CGI scripts',
            'Flask síncrono com banco em arquivo de texto .txt',
            'Scripts em arquivo .bat',
          ],
          correctIndex: 0,
          explanation: 'A pilha FastAPI assíncrona com asyncpg e cache Redis entrega dezenas de milhares de requisições por segundo.',
        },
      ],
    },
  },
};
