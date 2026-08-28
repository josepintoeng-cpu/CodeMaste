import { TechCurriculumData } from '../techCurriculum';

export const ENTERPRISE_MOBILE_CURRICULUM: Record<'python' | 'java' | 'php' | 'flutter' | 'mysql', TechCurriculumData> = {
  // =========================================================================
  // PYTHON COMPLETO (INICIANTE, INTERMEDIÁRIO, AVANÇADO, PROJETOS)
  // =========================================================================
  python: {
    topicsByLevel: {
      iniciante: [
        {
          title: '1. Sintaxe Essencial, Variáveis e Tipos Primitivos em Python',
          desc: 'Aprenda a exibir dados com print(), declarar variáveis e manipular str, int, float e bool.',
          theory: [
            {
              title: 'A Filosofia do Python',
              text: 'Python enfatiza legibilidade e simplicidade ("Readability counts"). Não utiliza chaves {} ou ponto e vírgula, utilizando indentação estrita (4 espaços) para delimitar blocos.',
              keyPoints: [
                'print(f"Olá {nome}") para interpolação de strings formatadas (f-strings).',
                'Tipagem dinâmica: o tipo é inferido automaticamente no momento da atribuição.',
                'type(dado) verifica o tipo primitivo da variável.',
              ],
              conceptCard: '💡 F-Strings: Use sempre f"Texto {variavel}" para código limpo e moderno em Python 3.6+.',
            },
          ],
          code: `# Fundamentos do Python
nome = "Dev Python"
xp_atual = 150
ativo = True
nivel = 1.5

print(f"Usuário: {nome} | XP: {xp_atual} | Status: {ativo}")`,
          output: `Usuário: Dev Python | XP: 150 | Status: True`,
          lang: 'python',
          exercise: {
            id: 'ex-py-ini-1',
            prompt: 'Como formatar uma string em Python moderno inserindo o valor de uma variável `pontos = 100` diretamente no texto?',
            type: 'multiple_choice',
            options: ['f"Total de pontos: {pontos}"', '"Total de pontos: $pontos"', '"Total de pontos: " + pontos', 'format("pontos")'],
            correctAnswer: 'f"Total de pontos: {pontos}"',
            hint: 'Utiliza a letra f antes das aspas e chaves para a variável.',
            explanation: 'As f-strings (format strings) prefixadas com `f"..."` avaliam expressões dentro de chaves `{}` diretamente.',
          },
        },
        {
          title: '2. Estruturas Condicionais: if, elif e else com Operadores Lógicos',
          desc: 'Tome decisões no fluxo do programa usando and, or, not e comparações relacionais.',
          theory: [
            {
              title: 'Controle de Fluxo e Indentação',
              text: 'A indentação em Python é sintática e obrigatória. As palavras-chave if, elif e else controlam a execução condicional.',
              keyPoints: [
                'Dois pontos (:) no final da linha iniciam um novo bloco de código.',
                'Operadores lógicos são literais em inglês: and, or, not (em vez de &&, ||, !).',
              ],
            },
          ],
          code: `idade = 20
possui_cnh = True

if idade >= 18 and possui_cnh:
    print("Acesso para conduzir veículos liberado.")
elif idade >= 18 and not possui_cnh:
    print("Idade permitida, mas CNH necessária.")
else:
    print("Acesso não permitido para menores de idade.")`,
          output: `Acesso para conduzir veículos liberado.`,
          lang: 'python',
          exercise: {
            id: 'ex-py-ini-2',
            prompt: 'Qual operador lógico em Python equivale ao "E" lógico para checar se duas condições são verdadeiras?',
            type: 'multiple_choice',
            options: ['and', '&&', '&', 'AND_LOGIC'],
            correctAnswer: 'and',
            hint: 'Palavra em inglês para "e".',
            explanation: 'Python adota a palavra-chave legível `and` para conjunção lógica.',
          },
        },
        {
          title: '3. Coleções: Listas, Tuplas, Dicionários e Métodos de Manipulação',
          desc: 'Manipule estruturas de dados essenciais: listas mutáveis, tuplas imutáveis e dicts chave-valor.',
          theory: [
            {
              title: 'Estruturas de Dados Nativas',
              text: 'Listas [] são mutáveis e ordenadas; Tuplas () são imutáveis; Dicionários {} associam chaves únicas a valores em alta velocidade.',
              keyPoints: [
                'lista.append(item): Adiciona elemento ao final.',
                'dicionario["chave"]: Acessa o valor associado.',
                'dicionario.get("chave", default): Acesso seguro sem risco de KeyError.',
              ],
            },
          ],
          code: `# Dicionário e Lista em ação
aluno = {
    "nome": "Beatriz",
    "notas": [8.5, 9.0, 10.0],
    "matriculado": True
}

aluno["notas"].append(9.5)
media = sum(aluno["notas"]) / len(aluno["notas"])
print(f"Média calculada de {aluno['nome']}: {media:.2f}")`,
          output: `Média calculada de Beatriz: 9.25`,
          lang: 'python',
          exercise: {
            id: 'ex-py-ini-3',
            prompt: 'Qual estrutura nativa do Python armazena pares de chave e valor delimitada por chaves `{}`?',
            type: 'multiple_choice',
            options: ['Dicionário (dict)', 'Lista (list)', 'Tupla (tuple)', 'Conjunto (set)'],
            correctAnswer: 'Dicionário (dict)',
            hint: 'Permite buscar dados por chaves nomeadas como {"id": 1}.',
            explanation: 'O dicionário (`dict`) em Python é uma tabela hash de pares chave-valor de alta performance.',
          },
        },
        {
          title: '4. Laços de Repetição: for in, while e Compreensão de Listas (List Comprehension)',
          desc: 'Itere sobre coleções, utilize range(), break, continue e list comprehensions concisas.',
          theory: [
            {
              title: 'Iteração Pythônica',
              text: 'O laço for in itera diretamente sobre os elementos de qualquer sequência (sem necessidade de contador i manual). List Comprehensions oferecem uma forma elegante e rápida de transformar coleções.',
              keyPoints: [
                'for item in lista: print(item)',
                '[x * 2 for x in numeros if x > 0]: List comprehension em uma linha.',
                'range(inicio, fim, passo): Gera sequências numéricas sob demanda.',
              ],
            },
          ],
          code: `# List Comprehension para filtrar e transformar
numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
quadrados_pares = [n ** 2 for n in numeros if n % 2 == 0]

print(f"Quadrados dos números pares: {quadrados_pares}")`,
          output: `Quadrados dos números pares: [4, 16, 36, 64, 100]`,
          lang: 'python',
          exercise: {
            id: 'ex-py-ini-4',
            prompt: 'Como criar rapidamente em Python uma lista contendo os números de 0 a 4 utilizando a função `range`?',
            type: 'multiple_choice',
            options: ['list(range(5))', 'range[0:5]', 'new Array(5)', 'make_list(0..4)'],
            correctAnswer: 'list(range(5))',
            hint: 'A função range(5) vai de 0 até 4 (limite superior exclusivo).',
            explanation: '`range(5)` gera os números 0, 1, 2, 3, 4 e `list()` converte o gerador em uma lista de valores.',
          },
        },
        {
          title: '5. Funções, *args, **kwargs e Tratamento de Exceções (try/except)',
          desc: 'Modularize seu código com def, retornos múltiplos, parâmetros variáveis e captura segura de erros.',
          theory: [
            {
              title: 'Funções e Tratamento de Erros',
              text: 'Funções são definidas com "def". Python suporta parâmetros com valores padrão, desempacotamento flexível (*args, **kwargs) e tratamento resiliente de falhas com try, except, else e finally.',
              keyPoints: [
                'def calcular_salario(base, bonus=0): return base + bonus',
                'try / except ValueError as e / finally para fechamento de conexões.',
              ],
            },
          ],
          code: `def dividir(a, b):
    try:
        resultado = a / b
    except ZeroDivisionError:
        return "Erro: Divisão por zero não é permitida!"
    except TypeError:
        return "Erro: Os parâmetros devem ser numéricos!"
    else:
        return f"Resultado: {resultado}"

print(dividir(10, 2))
print(dividir(10, 0))`,
          output: `Resultado: 5.0\nErro: Divisão por zero não é permitida!`,
          lang: 'python',
          exercise: {
            id: 'ex-py-ini-5',
            prompt: 'Qual bloco de código em Python captura e trata uma exceção para evitar que o script seja interrompido?',
            type: 'multiple_choice',
            options: ['try / except', 'try / catch', 'begin / rescue', 'do / error'],
            correctAnswer: 'try / except',
            hint: 'Em Python usa-se a palavra except em vez de catch.',
            explanation: 'A estrutura `try / except` intercepta exceções em tempo de execução de forma controlada.',
          },
        },
      ],
      intermediario: [
        {
          title: '1. Programação Orientada a Objetos (POO): Classes, __init__, self e Herança',
          desc: 'Construa modelos de dados sólidos com encapsulamento, métodos mágicos (__str__, __repr__) e herança.',
          theory: [
            {
              title: 'POO em Python',
              text: 'Classes em Python definem o método construtor __init__. O primeiro parâmetro "self" referencia explicitamente a instância atual do objeto.',
              keyPoints: [
                'class ContaBancaria: def __init__(self, titular): self.titular = titular',
                'Herança: class ContaPoupanca(ContaBancaria): super().__init__(titular)',
                '@property para getters e setters elegantes.',
              ],
            },
          ],
          code: `class Servidor:
    def __init__(self, ip: str, porta: int = 8080):
        self.ip = ip
        self.porta = porta
        self.ativo = False

    def iniciar(self):
        self.ativo = True
        return f"Servidor rodando em {self.ip}:{self.porta}"

srv = Servidor("192.168.1.100")
print(srv.iniciar())`,
          output: `Servidor rodando em 192.168.1.100:8080`,
          lang: 'python',
          exercise: {
            id: 'ex-py-inter-1',
            prompt: 'Qual é o nome do método construtor padrão executado ao instanciar uma nova classe em Python?',
            type: 'multiple_choice',
            options: ['__init__', '__construct__', 'constructor()', 'def new()'],
            correctAnswer: '__init__',
            hint: 'Método especial com dois underscores antes e depois de init.',
            explanation: '`__init__` é o método inicializador que recebe a instância recém-criada (`self`) e seus argumentos.',
          },
        },
        {
          title: '2. Decorators (@decorator) e Geradores com yield',
          desc: 'Estenda o comportamento de funções sem alterá-las e economize memória com iteradores preguiçosos.',
          theory: [
            {
              title: 'Metaprogramação com Decorators',
              text: 'Decorators são funções de ordem superior que recebem uma função e retornam uma versão enriquecida (usado para logs, autenticação, cronometragem). Geradores com "yield" transmitem dados sob demanda.',
              keyPoints: [
                'yield retorna valores progressivamente sem carregar tudo na RAM.',
                '@meu_decorador decora a função abaixo dele.',
              ],
            },
          ],
          code: `def log_execucao(funcao):
    def wrapper(*args, **kwargs):
        print(f"[LOG] Executando {funcao.__name__}...")
        resultado = funcao(*args, **kwargs)
        print(f"[LOG] Concluído.")
        return resultado
    return wrapper

@log_execucao
def processar_pedido(id_pedido):
    return f"Pedido #{id_pedido} faturado com sucesso."

print(processar_pedido(4501))`,
          output: `[LOG] Executando processar_pedido...\n[LOG] Concluído.\nPedido #4501 faturado com sucesso.`,
          lang: 'python',
          exercise: {
            id: 'ex-py-inter-2',
            prompt: 'Qual palavra-chave transforma uma função comum do Python em uma função geradora (generator) que produz valores sob demanda?',
            type: 'multiple_choice',
            options: ['yield', 'generate', 'return_stream', 'emit'],
            correctAnswer: 'yield',
            hint: 'Pausa a execução da função mantendo o estado da pilha.',
            explanation: '`yield` suspende a função e retorna o valor ao iterador, economizando memória em conjuntos massivos de dados.',
          },
        },
      ],
      avancado: [
        {
          title: '1. Concorrência Assíncrona com asyncio, async/await e Tasks',
          desc: 'Execute milhares de requisições e operações de I/O em paralelo sem bloqueio de thread.',
          theory: [
            {
              title: 'AsyncIO em Python',
              text: 'O módulo asyncio gerencia um event loop de alta performance, permitindo que corrotinas async def cedam a execução com await durante operações de rede ou disco.',
              keyPoints: [
                'async def minha_tarefa(): await asyncio.sleep(1)',
                'asyncio.gather(*tarefas): Executa múltiplas corrotinas simultaneamente.',
              ],
            },
          ],
          code: `import asyncio

async def consultar_servico(nome: str, delay: int):
    await asyncio.sleep(delay)
    return f"Resposta de {nome} concluída em {delay}s"

async def main():
    respostas = await asyncio.gather(
        consultar_servico("API Pagamentos", 1),
        consultar_servico("API Estoque", 1)
    )
    for r in respostas:
        print(r)

# Execução assíncrona
asyncio.run(main())`,
          output: `Resposta de API Pagamentos concluída em 1s\nResposta de API Estoque concluída em 1s`,
          lang: 'python',
          exercise: {
            id: 'ex-py-avanc-1',
            prompt: 'Qual função do módulo `asyncio` executa múltiplas corrotinas assíncronas em paralelo e aguarda a conclusão de todas?',
            type: 'multiple_choice',
            options: ['asyncio.gather()', 'asyncio.parallel_run()', 'asyncio.join_all()', 'asyncio.dispatch()'],
            correctAnswer: 'asyncio.gather()',
            hint: 'Significa "reunir" / agrupar as tarefas assíncronas.',
            explanation: '`asyncio.gather(*corrotinas)` agenda todas as tarefas concorrentemente no event loop e devolve os resultados agrupados.',
          },
        },
      ],
      projetos: [
        {
          title: '1. Projeto: Web Scraper Automatizado & Pipeline de Extração de Dados',
          desc: 'Construa um robô de extração de dados com BeautifulSoup/Requests e exportação para JSON e CSV.',
          theory: [{ title: 'Projeto Prático', text: 'Pipeline de extração, tratamento e persistência.', keyPoints: ['Web Scraping', 'Sanitização de dados', 'Exportação'] }],
          code: `import json

dados_coletados = [
    {"produto": "Teclado Mecânico RGB", "preco": 320.0, "estoque": 15},
    {"produto": "Mouse Óptico 16000 DPI", "preco": 180.0, "estoque": 42},
]

# Exportando para JSON formatado
json_export = json.dumps(dados_coletados, indent=2, ensure_ascii=False)
print("Pipeline de Extração Concluído:\n" + json_export)`,
          output: `Pipeline de Extração Concluído:\n[\n  {\n    "produto": "Teclado Mecânico RGB",\n    "preco": 320.0,\n    "estoque": 15\n  },\n  {\n    "produto": "Mouse Óptico 16000 DPI",\n    "preco": 180.0,\n    "estoque": 42\n  }\n]`,
          lang: 'python',
          exercise: {
            id: 'ex-py-prj-1',
            prompt: 'Qual biblioteca nativa do Python é utilizada para serializar dicionários e listas em texto formatado JSON?',
            type: 'multiple_choice',
            options: ['json (json.dumps / json.loads)', 'parser_json', 'jsonify', 'serial_text'],
            correctAnswer: 'json (json.dumps / json.loads)',
            hint: 'Módulo nativo padrão com nome de 4 letras.',
            explanation: 'O módulo nativo `json` com `json.dumps()` converte objetos Python em strings JSON e `json.loads()` realiza o parse inverso.',
          },
        },
      ],
    },
    quizzesByLevel: {
      iniciante: [
        {
          id: 'py-q-ini-1',
          question: 'Em Python, como se calcula o resto de uma divisão inteira?',
          options: ['Operador % (módulo)', 'Operador //', 'Operador **', 'Operador rem()'],
          correctIndex: 0,
          explanation: 'O operador `%` retorna o resto da divisão (ex: 10 % 3 resulta em 1).',
        },
      ],
      intermediario: [
        {
          id: 'py-q-int-1',
          question: 'O que o gerenciador de contexto `with open(...) as f:` garante ao manipular arquivos?',
          options: [
            'Garante que o arquivo será fechado automaticamente mesmo se ocorrer um erro ou exceção durante a leitura/escrita',
            'Criptografa o arquivo no disco',
            'Envia o arquivo por e-mail',
            'Deleta o arquivo após o uso',
          ],
          correctIndex: 0,
          explanation: 'O protocolo de context manager chama `__exit__` e fecha o descritor de arquivo com segurança.',
        },
      ],
      avancado: [
        {
          id: 'py-q-av-1',
          question: 'O que é o GIL (Global Interpreter Lock) no CPython?',
          options: [
            'Um mecanismo de sincronização que permite que apenas uma thread nativa execute bytecode Python por vez no processo',
            'Um antivírus interno',
            'Um compilador de hardware',
            'Uma licença de software',
          ],
          correctIndex: 0,
          explanation: 'O GIL simplifica o gerenciamento de memória no CPython permitindo execução segura de threads para I/O-bound tasks.',
        },
      ],
      projetos: [
        {
          id: 'py-q-prj-1',
          question: 'Qual ferramenta de ambiente virtual é padrão no Python para isolar dependências de projetos?',
          options: ['venv (python -m venv env)', 'npm', 'gradle', 'composer'],
          correctIndex: 0,
          explanation: '`venv` cria ambientes isolados com interpretador e bibliotecas exclusivas do projeto.',
        },
      ],
    },
  },

  // =========================================================================
  // JAVA ENTERPRISE & SPRING BOOT
  // =========================================================================
  java: {
    topicsByLevel: {
      iniciante: [
        {
          title: '1. Sintaxe Java, Tipagem Forte e Método main()',
          desc: 'Entenda a JVM, declaração estrita de tipos, classes públicas e System.out.println().',
          theory: [
            {
              title: 'A Plataforma Java (JVM)',
              text: 'Java compila código-fonte (.java) em Bytecode (.class) executado em qualquer sistema operacional através da Java Virtual Machine (Write Once, Run Anywhere).',
              keyPoints: [
                'public static void main(String[] args) é o ponto de entrada da aplicação.',
                'Tipagem estática: tipos primitivos (int, double, boolean) e objetos de referência (String).',
                'Toda instrução deve terminar com ponto e vírgula (;).',
              ],
            },
          ],
          code: `public class Main {
    public static void main(String[] args) {
        String dev = "Engenheiro Java";
        int nivel = 1;
        boolean ativo = true;

        System.out.println("Bem-vindo, " + dev + "! Nível: " + nivel + " | Status: " + ativo);
    }
}`,
          output: `Bem-vindo, Engenheiro Java! Nível: 1 | Status: true`,
          lang: 'java',
          exercise: {
            id: 'ex-java-ini-1',
            prompt: 'Qual é a assinatura correta do método de entrada de execução em uma aplicação Java?',
            type: 'multiple_choice',
            options: [
              'public static void main(String[] args)',
              'public void start(args)',
              'function main()',
              'static main(String args)',
            ],
            correctAnswer: 'public static void main(String[] args)',
            hint: 'Método público, estático, sem retorno (void) que recebe array de Strings.',
            explanation: 'A JVM busca especificamente por `public static void main(String[] args)` para inicializar o programa.',
          },
        },
      ],
      intermediario: [
        {
          title: '1. Collections Framework (List, Set, Map) e Generics',
          desc: 'Gerencie coleções com ArrayList, HashSet, HashMap e streams funcionais em Java.',
          theory: [
            {
              title: 'Java Collections & Streams',
              text: 'List preserva ordem; Set não permite duplicatas; Map mapeia chaves a valores. A Stream API (Java 8+) viabiliza manipulação declarativa com filter, map e collect.',
              keyPoints: [
                'List<String> nomes = new ArrayList<>();',
                'Map<String, Integer> idades = new HashMap<>();',
                'lista.stream().filter(n -> n.startsWith("A")).toList();',
              ],
            },
          ],
          code: `import java.util.*;

public class ExemploCollections {
    public static void main(String[] args) {
        List<String> techs = Arrays.asList("Java", "Spring", "Kafka", "Docker");
        
        techs.stream()
             .filter(t -> t.startsWith("K") || t.startsWith("S"))
             .forEach(t -> System.out.println("Tecnologia selecionada: " + t));
    }
}`,
          output: `Tecnologia selecionada: Spring\nTecnologia selecionada: Kafka`,
          lang: 'java',
          exercise: {
            id: 'ex-java-inter-1',
            prompt: 'Qual interface da Java Collections Framework garante que nenhum elemento duplicado será armazenado?',
            type: 'multiple_choice',
            options: ['Set (ex: HashSet)', 'List (ex: ArrayList)', 'Queue (ex: LinkedList)', 'Vector'],
            correctAnswer: 'Set (ex: HashSet)',
            hint: 'Conjunto matemático sem repetições.',
            explanation: 'A interface `Set` proíbe duplicatas, baseando-se nos métodos `equals()` e `hashCode()` dos objetos.',
          },
        },
      ],
      avancado: [
        {
          title: '1. Injeção de Dependências e REST com Spring Boot',
          desc: 'Desenvolva endpoints REST corporativos com @RestController, @Service e @Autowired.',
          theory: [
            {
              title: 'O Ecossistema Spring Boot',
              text: 'Spring Boot fornece autoconfiguração e injeção de dependências (IoC/DI) simplificada, embutindo servidores como Tomcat para deploy rápido.',
              keyPoints: [
                '@RestController e @GetMapping("/api/usuarios")',
                '@Autowired ou injeção via construtor (recomendada)',
                '@Entity e Spring Data JPA para persistência de dados.',
              ],
            },
          ],
          code: `// Exemplo Controller REST Spring Boot
@RestController
@RequestMapping("/api/v1/status")
public class StatusController {

    @GetMapping
    public Map<String, Object> obterStatus() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "OPERACIONAL");
        response.put("jvm_version", System.getProperty("java.version"));
        return response;
    }
}`,
          output: `[Spring Boot]: Mapeamento GET /api/v1/status ativo em Tomcat porta 8080.`,
          lang: 'java',
          exercise: {
            id: 'ex-java-avanc-1',
            prompt: 'Qual anotação do Spring Boot combina `@Controller` e `@ResponseBody` para construir endpoints que retornam JSON diretamente?',
            type: 'multiple_choice',
            options: ['@RestController', '@Service', '@Component', '@Repository'],
            correctAnswer: '@RestController',
            hint: 'Controlador para APIs REST.',
            explanation: '`@RestController` instrui o framework a serializar as respostas automaticamente em formato JSON.',
          },
        },
      ],
      projetos: [
        {
          title: '1. Projeto: Microsserviço de Gestão Bancária com Spring Boot e JPA',
          desc: 'Implemente uma API completa com operações de depósito, transferência ACID e validações.',
          theory: [{ title: 'Projeto Prático', text: 'Arquitetura em camadas (Controller, Service, Repository).', keyPoints: ['Transações @Transactional', 'Validações DTO', 'Clean Architecture'] }],
          code: `public class ContaService {
    public void transferir(Conta origem, Conta destino, double valor) {
        if (origem.getSaldo() < valor) {
            throw new SaldoInsuficienteException("Saldo indisponível");
        }
        origem.debitar(valor);
        destino.creditar(valor);
        System.out.println("Transferência de R$ " + valor + " concluída com sucesso.");
    }
}`,
          output: `Transferência de R$ 500.0 concluída com sucesso. [ACID OK]`,
          lang: 'java',
          exercise: {
            id: 'ex-java-prj-1',
            prompt: 'Qual anotação do Spring garante que todos os passos de uma transferência bancária ocorram em uma única transação atômica (Rollback em caso de falha)?',
            type: 'multiple_choice',
            options: ['@Transactional', '@Async', '@Autowired', '@Entity'],
            correctAnswer: '@Transactional',
            hint: 'Controla transações de banco de dados.',
            explanation: '`@Transactional` abre uma transação no banco e faz rollback automático caso ocorra qualquer RuntimeException.',
          },
        },
      ],
    },
    quizzesByLevel: {
      iniciante: [
        {
          id: 'jq-ini-1',
          question: 'Em Java, qual a diferença entre os tipos primitivos (como int) e seus Wrappers (como Integer)?',
          options: [
            'Tipos primitivos guardam o valor diretamente na memória de forma ultrarrápida; Wrappers são objetos com métodos auxiliares que aceitam null',
            'Não existe diferença',
            'Wrappers são mais rápidos que primitivos',
            'Primitivos só existem no JavaScript',
          ],
          correctIndex: 0,
          explanation: 'Wrappers (Integer, Double, Boolean) encapsulam primitivos como objetos, permitindo uso em coleções genéricas.',
        },
      ],
      intermediario: [
        {
          id: 'jq-int-1',
          question: 'Qual o papel do Garbage Collector (GC) na Máquina Virtual Java (JVM)?',
          options: [
            'Identificar e liberar automaticamente a memória ocupada por objetos que não possuem mais referências ativas no programa',
            'Compilar o código em C++',
            'Reiniciar o servidor',
            'Formatar o disco rígido',
          ],
          correctIndex: 0,
          explanation: 'O Garbage Collector rastreia o grafo de objetos na Heap e desaloca aqueles inalcançáveis.',
        },
      ],
      avancado: [
        {
          id: 'jq-av-1',
          question: 'O que significa o princípio de Inversão de Controle (IoC) no ecossistema Spring?',
          options: [
            'O framework assume a responsabilidade de instanciar e injetar as dependências das classes em vez de criá-las com new',
            'Inverter a ordem das linhas de código',
            'Desligar o banco de dados',
            'Usar código sem métodos',
          ],
          correctIndex: 0,
          explanation: 'IoC delega o ciclo de vida e instanciação dos objetos (Beans) ao container do Spring.',
        },
      ],
      projetos: [
        {
          id: 'jq-prj-1',
          question: 'Qual arquivo de build do Maven contém todas as dependências e plugins de um projeto Java?',
          options: ['pom.xml', 'build.gradle', 'package.json', 'settings.json'],
          correctIndex: 0,
          explanation: 'O arquivo `pom.xml` (Project Object Model) centraliza dependências, versões e plugins do Maven.',
        },
      ],
    },
  },

  // =========================================================================
  // PHP MODERNO & LARAVEL
  // =========================================================================
  php: {
    topicsByLevel: {
      iniciante: [
        {
          title: '1. Sintaxe do PHP 8+, Variáveis e Tipos Escalares',
          desc: 'Aprenda tags <?php ?>, interpolação de strings, tipos com tipagem estrita e arrays associativos.',
          theory: [
            {
              title: 'O Novo PHP Moderno',
              text: 'O PHP 8+ é uma linguagem moderna com JIT compiler, tipagem estrita (declare(strict_types=1)), named arguments e match expressions.',
              keyPoints: [
                'Variáveis sempre iniciam com o caractere cifrão: $nomeVariavel.',
                'Arrays associativos: $usuario = ["nome" => "Dev", "ativo" => true];',
                'Operador Null Coalescing: $valor = $config ?? "padrao";',
              ],
            },
          ],
          code: `<?php
declare(strict_types=1);

$desenvolvedor = "Especialista PHP";
$versao = 8.3;
$ativo = true;

echo "Ambiente: {$desenvolvedor} | PHP Versão: {$versao} | Status: " . ($ativo ? 'Online' : 'Offline');
?>`,
          output: `Ambiente: Especialista PHP | PHP Versão: 8.3 | Status: Online`,
          lang: 'php',
          exercise: {
            id: 'ex-php-ini-1',
            prompt: 'Em PHP, qual caractere obrigatório deve preceder o nome de qualquer variável?',
            type: 'multiple_choice',
            options: ['$', '@', '#', '&'],
            correctAnswer: '$',
            hint: 'Símbolo do cifrão.',
            explanation: 'Todas as variáveis em PHP iniciam obrigatoriamente com o caractere `$`.',
          },
        },
      ],
      intermediario: [
        {
          title: '1. Programação Orientada a Objetos, Namespaces e PDO para Banco de Dados',
          desc: 'Estruture classes modernas com promoção de propriedades no construtor e conexões PDO seguras.',
          theory: [
            {
              title: 'PDO e Injeção SQL',
              text: 'PDO (PHP Data Objects) com Prepared Statements elimina vulnerabilidades de SQL Injection vinculando parâmetros com execute([:id => $id]).',
              keyPoints: [
                'Constructor Property Promotion: public function __construct(public string $nome) {}',
                'PDO::prepare() e bindValue() para segurança.',
              ],
            },
          ],
          code: `<?php
class Usuario {
    public function __construct(
        public readonly int $id,
        public string $nome,
        public string $email
    ) {}

    public function resumo(): string {
        return "Usuário #{$this->id}: {$this->nome} <{$this->email}>";
    }
}

$user = new Usuario(1, "Carlos Souza", "carlos@exemplo.com");
echo $user->resumo();
?>`,
          output: `Usuário #1: Carlos Souza <carlos@exemplo.com>`,
          lang: 'php',
          exercise: {
            id: 'ex-php-inter-1',
            prompt: 'Qual extensão nativa do PHP é o padrão seguro da indústria para conectar a bancos de dados relacionais via Prepared Statements?',
            type: 'multiple_choice',
            options: ['PDO (PHP Data Objects)', 'mysql_query', 'db_connect', 'SQLNative'],
            correctAnswer: 'PDO (PHP Data Objects)',
            hint: 'Abreviação de PHP Data Objects.',
            explanation: 'PDO oferece uma camada de abstração segura com suporte a Prepared Statements contra ataques de SQL Injection.',
          },
        },
      ],
      avancado: [
        {
          title: '1. Framework Laravel: Rotas, Eloquent ORM e Middlewares',
          desc: 'Desenvolva aplicações corporativas com o framework PHP mais adotado do mundo.',
          theory: [
            {
              title: 'A Elegância do Laravel',
              text: 'Laravel adota o padrão MVC com o poderoso Eloquent ORM (Active Record), migrações de banco, filas (Queues) e sistema de autenticação pronto.',
              keyPoints: [
                'Route::get("/api/produtos", [ProdutoController::class, "index"]);',
                'User::where("ativo", true)->with("pedidos")->get();',
              ],
            },
          ],
          code: `<?php
// Exemplo Rota e Consulta Eloquent no Laravel
Route::get('/api/usuarios-ativos', function () {
    return response()->json([
        'sucesso' => true,
        'dados' => [
            ['id' => 1, 'nome' => 'Ana Silva', 'perfil' => 'admin'],
            ['id' => 2, 'nome' => 'Bruno Lima', 'perfil' => 'dev']
        ]
    ]);
});`,
          output: `[Laravel Router]: GET /api/usuarios-ativos registrado com resposta JSON 200 OK.`,
          lang: 'php',
          exercise: {
            id: 'ex-php-avanc-1',
            prompt: 'Qual é o nome do ORM (Object-Relational Mapping) nativo e expressivo do framework Laravel?',
            type: 'multiple_choice',
            options: ['Eloquent ORM', 'Doctrine', 'Hibernate', 'Prisma'],
            correctAnswer: 'Eloquent ORM',
            hint: 'Famoso pela sintaxe Modelo::where()->get().',
            explanation: 'O Eloquent é o ORM padrão do Laravel, implementando o padrão Active Record de forma intuitiva.',
          },
        },
      ],
      projetos: [
        {
          title: '1. Projeto: API REST Completa com Autenticação e Sanitização em PHP',
          desc: 'Construa um backend seguro com JSON responses, validação de cabeçalhos e tratamento de CORS.',
          theory: [{ title: 'Projeto Prático', text: 'Criação de API pura modular sem frameworks.', keyPoints: ['header("Content-Type: application/json")', 'Tratamento HTTP', 'Sanitização'] }],
          code: `<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");

$dados = [
    "status" => 200,
    "mensagem" => "API operacional",
    "timestamp" => time()
];

echo json_encode($dados, JSON_PRETTY_PRINT);
?>`,
          output: `{\n    "status": 200,\n    "mensagem": "API operacional",\n    "timestamp": 1724836000\n}`,
          lang: 'php',
          exercise: {
            id: 'ex-php-prj-1',
            prompt: 'Qual função nativa do PHP serializa um array em uma string no formato JSON?',
            type: 'multiple_choice',
            options: ['json_encode($dados)', 'json_decode($dados)', 'serialize_json($dados)', 'to_json($dados)'],
            correctAnswer: 'json_encode($dados)',
            hint: 'Encode transforma array em JSON; decode faz o contrário.',
            explanation: '`json_encode()` transforma estruturas de dados do PHP em representação textual JSON.',
          },
        },
      ],
    },
    quizzesByLevel: {
      iniciante: [
        {
          id: 'php-q-ini-1',
          question: 'Qual operador em PHP é utilizado para concatenar duas strings?',
          options: ['Ponto (.)', 'Mais (+)', 'E comercial (&)', 'Vírgula (,)'],
          correctIndex: 0,
          explanation: 'Em PHP, a concatenação de strings é realizada exclusivamente pelo operador de ponto (`.`).',
        },
      ],
      intermediario: [
        {
          id: 'php-q-int-1',
          question: 'O que o gerenciador de pacotes Composer faz no ecossistema PHP?',
          options: [
            'Gerencia dependências, bibliotecas externas e autoloading de classes baseado no padrão PSR-4',
            'Compila o PHP em código de máquina',
            'É um editor de texto',
            'É o banco de dados do PHP',
          ],
          correctIndex: 0,
          explanation: 'O Composer é o gerenciador de dependências oficial do ecossistema PHP moderno.',
        },
      ],
      avancado: [
        {
          id: 'php-q-av-1',
          question: 'Qual utilitário de linha de comando é o coração do desenvolvimento no Laravel para criar controllers, migrations e rodar o servidor?',
          options: ['Artisan (php artisan)', 'Composer', 'npm', 'Vite'],
          correctIndex: 0,
          explanation: 'O CLI Artisan (`php artisan make:controller`, etc.) é a ferramenta de produtividade central do Laravel.',
        },
      ],
      projetos: [
        {
          id: 'php-q-prj-1',
          question: 'Qual superglobal do PHP armazena os dados enviados via formulários com método POST?',
          options: ['$_POST', '$_GET', '$_REQUEST', '$_SERVER'],
          correctIndex: 0,
          explanation: '`$_POST` é o array associativo contendo as variáveis enviadas no corpo da requisição HTTP POST.',
        },
      ],
    },
  },

  // =========================================================================
  // FLUTTER & DART MOBILE
  // =========================================================================
  flutter: {
    topicsByLevel: {
      iniciante: [
        {
          title: '1. Fundamentos de Dart e Árvore de Widgets (StatelessWidget)',
          desc: 'Entenda como o Flutter constrói UIs multiplataforma compiladas nativamente.',
          theory: [
            {
              title: 'Tudo no Flutter é um Widget',
              text: 'O Flutter renderiza interfaces pixel por pixel usando seu próprio motor gráfico (Impeller / Skia). StatelessWidget representa interfaces puras e imutáveis.',
              keyPoints: [
                'void main() => runApp(const MeuApp());',
                'Scaffold fornece a estrutura visual padrão (AppBar, Body, FloatingActionButton).',
                'Widgets como Column, Row, Container e Text compõem a hierarquia.',
              ],
            },
          ],
          code: `import 'package:flutter/material.dart';

class CardBemVindo extends StatelessWidget {
  final String nome;
  const CardBemVindo({super.key, required this.nome});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16.0),
      decoration: BoxDecoration(
        color: Colors.indigo,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Text(
        'Olá, $nome! Bem-vindo ao Flutter.',
        style: const TextStyle(color: Colors.white, fontSize: 18),
      ),
    );
  }
}`,
          output: `[Flutter Engine]: Widget CardBemVindo compilado e posicionado na RenderTree.`,
          lang: 'dart',
          exercise: {
            id: 'ex-flt-ini-1',
            prompt: 'Qual tipo de Widget no Flutter é utilizado para construir interfaces imutáveis que não necessitam gerenciar estado reativo interno?',
            type: 'multiple_choice',
            options: ['StatelessWidget', 'StatefulWidget', 'InheritedWidget', 'StateModel'],
            correctAnswer: 'StatelessWidget',
            hint: 'Widget "sem estado" mutável.',
            explanation: '`StatelessWidget` é o bloco de construção básico para UIs estáticas ou cujas propriedades são controladas exclusivamente por seus pais.',
          },
        },
      ],
      intermediario: [
        {
          title: '1. StatefulWidget, setState() e Gerenciamento de Estado Reativo',
          desc: 'Crie componentes interativos com ciclo de vida (initState, dispose) e re-renderização com setState.',
          theory: [
            {
              title: 'Estado Reativo no Flutter',
              text: 'StatefulWidget mantém um objeto State separado que sobrevive a reconstruções da árvore de widgets, disparando repaint ao chamar setState().',
              keyPoints: [
                'setState(() { _contador++; }); avisa ao framework para reconstruir o build.',
                'dispose() cancela listeners, controllers e timers ao fechar a tela.',
              ],
            },
          ],
          code: `class ContadorApp extends StatefulWidget {
  const ContadorApp({super.key});
  @override
  State<ContadorApp> createState() => _ContadorAppState();
}

class _ContadorAppState extends State<ContadorApp> {
  int _pontos = 0;

  void _incrementar() {
    setState(() => _pontos += 10);
  }

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: _incrementar,
      child: Text('Pontos: $_pontos'),
    );
  }
}`,
          output: `[Flutter State]: _pontos = 10 -> Frame desenhado a 120 FPS via Impeller.`,
          lang: 'dart',
          exercise: {
            id: 'ex-flt-inter-1',
            prompt: 'Qual método dentro de uma classe State notifica o Flutter de que o estado interno mudou e a interface deve ser redesenhada?',
            type: 'multiple_choice',
            options: ['setState(() { ... })', 'refreshUI()', 'updateState()', 'notifyListeners()'],
            correctAnswer: 'setState(() { ... })',
            hint: 'Método padrão de StatefulWidget.',
            explanation: '`setState()` agenda uma nova chamada ao método `build()` do widget para atualizar a visualização.',
          },
        },
      ],
      avancado: [
        {
          title: '1. Consumo de APIs Assíncronas com FutureBuilder e Provider / BLoC',
          desc: 'Carregue dados remotos em JSON com http/dio exibindo spinners de carregamento e tratamento de erro.',
          theory: [
            {
              title: 'Assincronismo com FutureBuilder',
              text: 'FutureBuilder escuta um Future<T> e reconstrói seu snapshot conforme a conexão transita de ConnectionState.waiting para ConnectionState.done.',
              keyPoints: [
                'snapshot.hasData e snapshot.hasError',
                'CircularProgressIndicator() durante o loading.',
              ],
            },
          ],
          code: `FutureBuilder<List<String>>(
  future: buscarCategorias(),
  builder: (context, snapshot) {
    if (snapshot.connectionState == ConnectionState.waiting) {
      return const Center(child: CircularProgressIndicator());
    }
    if (snapshot.hasError) {
      return Text('Erro: \${snapshot.error}');
    }
    return ListView(
      children: snapshot.data!.map((cat) => ListTile(title: Text(cat))).toList(),
    );
  },
)`,
          output: `[Flutter Async]: FutureBuilder resolvido com dados remotos exibidos em ListView fluida.`,
          lang: 'dart',
          exercise: {
            id: 'ex-flt-avanc-1',
            prompt: 'Qual widget nativo do Flutter é ideal para construir interfaces que dependem do resultado futuro de uma requisição assíncrona?',
            type: 'multiple_choice',
            options: ['FutureBuilder', 'StreamWrapper', 'AsyncContainer', 'HttpWidget'],
            correctAnswer: 'FutureBuilder',
            hint: 'Constrói a UI com base em um Future.',
            explanation: '`FutureBuilder` lida de forma declarativa com os estados de espera, erro e dados recebidos de uma promessa assíncrona.',
          },
        },
      ],
      projetos: [
        {
          title: '1. Projeto: Aplicativo Mobile Multiplataforma com Navegação e Armazenamento',
          desc: 'Desenvolva um app completo para Android e iOS com Navigator 2.0 / GoRouter e persistência local.',
          theory: [{ title: 'Projeto Prático', text: 'Rotas, temas dinâmicos e persistência com SharedPreferences.', keyPoints: ['GoRouter', 'Dark/Light Theme', 'Armazenamento'] }],
          code: `// Configuração de Rotas com GoRouter
final GoRouter _router = GoRouter(
  routes: [
    GoRoute(path: '/', builder: (context, state) => const HomeScreen()),
    GoRoute(path: '/detalhes/:id', builder: (context, state) => DetalhesScreen(id: state.pathParameters['id']!)),
  ],
);`,
          output: `[Flutter Build]: App empacotado para Android (APK/AAB) e iOS (IPA) com 0 erros de layout.`,
          lang: 'dart',
          exercise: {
            id: 'ex-flt-prj-1',
            prompt: 'Qual arquivo de configuração em um projeto Flutter declara metadados, versões, dependências e assets visuais?',
            type: 'multiple_choice',
            options: ['pubspec.yaml', 'package.json', 'flutter.config', 'AndroidManifest.xml'],
            correctAnswer: 'pubspec.yaml',
            hint: 'Arquivo YAML de gerenciamento do repositório Pub.',
            explanation: '`pubspec.yaml` é o arquivo central que define dependências e recursos do projeto Flutter.',
          },
        },
      ],
    },
    quizzesByLevel: {
      iniciante: [
        {
          id: 'flt-q-ini-1',
          question: 'O que o recurso de "Hot Reload" do Flutter permite aos desenvolvedores durante a criação do app?',
          options: [
            'Injetar alterações no código-fonte diretamente na VM em execução em menos de 1 segundo sem perder o estado da tela',
            'Reiniciar o smartphone',
            'Apagar o aplicativo do dispositivo',
            'Publicar o app na loja automaticamente',
          ],
          correctIndex: 0,
          explanation: 'O Hot Reload acelera o ciclo de desenvolvimento preservando o estado do aplicativo enquanto o código é editado.',
        },
      ],
      intermediario: [
        {
          id: 'flt-q-int-1',
          question: 'Em Dart/Flutter, qual o significado do recurso de "Sound Null Safety"?',
          options: [
            'O sistema de tipos do compilador garante em tempo de compilação que variáveis não anuláveis nunca conterão null, evitando erros de NullPointerException em produção',
            'Um equalizador de áudio para músicas',
            'Desativação da internet',
            'Remoção de botões',
          ],
          correctIndex: 0,
          explanation: 'O Sound Null Safety do Dart impede travamentos por valores nulos inesperados.',
        },
      ],
      avancado: [
        {
          id: 'flt-q-av-1',
          question: 'Qual o papel do motor gráfico Impeller no Flutter moderno?',
          options: [
            'Pré-compilar shaders para eliminar completamente os engasgos visuais (jank) nas animações do aplicativo',
            'Conectar ao banco de dados',
            'Traduzir o app para vários idiomas',
            'Criar ícones na tela',
          ],
          correctIndex: 0,
          explanation: 'O Impeller elimina o "shader compilation jank" garantindo fluidez a 60/120 FPS.',
        },
      ],
      projetos: [
        {
          id: 'flt-q-prj-1',
          question: 'Qual widget é recomendado para exibir listas muito longas com reciclagem de itens e consumo eficiente de memória no Flutter?',
          options: ['ListView.builder', 'SingleChildScrollView', 'Column', 'Wrap'],
          correctIndex: 0,
          explanation: '`ListView.builder` instancia sob demanda apenas os itens atualmente visíveis na tela.',
        },
      ],
    },
  },

  // =========================================================================
  // MYSQL RELACIONAL
  // =========================================================================
  mysql: {
    topicsByLevel: {
      iniciante: [
        {
          title: '1. Fundamentos SQL: CREATE TABLE, INSERT, SELECT e WHERE',
          desc: 'Aprenda DDL e DML básicos, tipos de colunas (INT, VARCHAR, DATE) e filtros com WHERE.',
          theory: [
            {
              title: 'Modelagem e Consultas Relacionais',
              text: 'O MySQL organiza dados em tabelas com linhas e colunas. O comando SELECT recupera registros e WHERE filtra apenas as linhas desejadas.',
              keyPoints: [
                'PRIMARY KEY com AUTO_INCREMENT gera identificadores sequenciais únicos.',
                'WHERE idade >= 18 AND status = "ativo"',
                'ORDER BY nome ASC / DESC ordena o resultado.',
              ],
            },
          ],
          code: `CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    ativo TINYINT DEFAULT 1
);

INSERT INTO clientes (nome, email) VALUES 
('Mariana Costa', 'mariana@exemplo.com'),
('Rodrigo Alves', 'rodrigo@exemplo.com');

SELECT * FROM clientes WHERE ativo = 1;`,
          output: `+----+---------------+----------------------+-------+
| ID | NOME          | EMAIL                | ATIVO |
+----+---------------+----------------------+-------+
| 1  | Mariana Costa | mariana@exemplo.com  | 1     |
| 2  | Rodrigo Alves | rodrigo@exemplo.com  | 1     |
+----+---------------+----------------------+-------+
(2 rows in set)`,
          lang: 'sql',
          exercise: {
            id: 'ex-sql-ini-1',
            prompt: 'Qual cláusula SQL é utilizada para filtrar registros retornando apenas aqueles que atendem a um critério específico?',
            type: 'multiple_choice',
            options: ['WHERE', 'HAVING', 'GROUP BY', 'FILTER'],
            correctAnswer: 'WHERE',
            hint: 'Significa "onde" em inglês.',
            explanation: 'A cláusula `WHERE` aplica predicados de filtro linha a linha antes de qualquer agrupamento.',
          },
        },
      ],
      intermediario: [
        {
          title: '1. Relacionamentos com INNER JOIN, LEFT JOIN e Chaves Estrangeiras (FK)',
          desc: 'Conecte tabelas relacionais com integridade referencial e consulte dados combinados.',
          theory: [
            {
              title: 'A Arte dos JOINs',
              text: 'INNER JOIN retorna registros com correspondência em ambas as tabelas; LEFT JOIN preserva todas as linhas da tabela da esquerda mesmo sem correspondência na direita.',
              keyPoints: [
                'FOREIGN KEY (cliente_id) REFERENCES clientes(id)',
                'GROUP BY e funções agregadas: COUNT(), SUM(), AVG(), MAX(), MIN().',
              ],
            },
          ],
          code: `SELECT 
    c.nome AS cliente,
    COUNT(p.id) AS total_pedidos,
    SUM(p.valor) AS valor_total
FROM clientes c
INNER JOIN pedidos p ON c.id = p.cliente_id
GROUP BY c.id, c.nome
ORDER BY valor_total DESC;`,
          output: `+---------------+---------------+-------------+
| CLIENTE       | TOTAL_PEDIDOS | VALOR_TOTAL |
+---------------+---------------+-------------+
| Mariana Costa | 4             | 1850.00     |
| Rodrigo Alves | 2             | 420.50      |
+---------------+---------------+-------------+
(2 rows in set)`,
          lang: 'sql',
          exercise: {
            id: 'ex-sql-inter-1',
            prompt: 'Qual tipo de JOIN retorna apenas os registros que possuem correspondência exata em ambas as tabelas?',
            type: 'multiple_choice',
            options: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL OUTER JOIN'],
            correctAnswer: 'INNER JOIN',
            hint: 'Apenas a interseção comum das duas tabelas.',
            explanation: '`INNER JOIN` seleciona apenas as linhas que satisfazem a condição de junção (`ON`) em ambos os lados.',
          },
        },
      ],
      avancado: [
        {
          title: '1. Índices (B-Tree), EXPLAIN e Transações ACID (START TRANSACTION)',
          desc: 'Otimize consultas com índices e execute transações seguras com COMMIT e ROLLBACK.',
          theory: [
            {
              title: 'Otimização e Concorrência',
              text: 'Índices B-Tree aceleram buscas de O(N) para O(log N). O comando EXPLAIN exibe o plano de execução para diagnosticar Full Table Scans indesejados.',
              keyPoints: [
                'CREATE INDEX idx_clientes_email ON clientes(email);',
                'START TRANSACTION; ... COMMIT; ou ROLLBACK;',
              ],
            },
          ],
          code: `EXPLAIN SELECT * FROM clientes WHERE email = 'mariana@exemplo.com';

-- Transação Atômica Segura
START TRANSACTION;
UPDATE contas SET saldo = saldo - 100 WHERE id = 1;
UPDATE contas SET saldo = saldo + 100 WHERE id = 2;
COMMIT;`,
          output: `+----+-------------+----------+-------+---------------+--------------------+---------+-------+------+-------+
| id | select_type | table    | type  | possible_keys | key                | key_len | ref   | rows | Extra |
+----+-------------+----------+-------+---------------+--------------------+---------+-------+------+-------+
| 1  | SIMPLE      | clientes | const | idx_email     | idx_clientes_email | 602     | const | 1    | NULL  |
+----+-------------+----------+-------+---------------+--------------------+---------+-------+------+-------+
Query OK, 0 rows affected (Commit realizado com sucesso).`,
          lang: 'sql',
          exercise: {
            id: 'ex-sql-avanc-1',
            prompt: 'Qual comando SQL desfaz todas as alterações realizadas dentro de uma transação ativa antes que sejam gravadas definitivamente no banco?',
            type: 'multiple_choice',
            options: ['ROLLBACK', 'COMMIT', 'UNDO', 'CANCEL'],
            correctAnswer: 'ROLLBACK',
            hint: 'Reverte as alterações para o estado inicial.',
            explanation: '`ROLLBACK` desfaz todas as instruções DML executadas na transação corrente mantendo a consistência dos dados.',
          },
        },
      ],
      projetos: [
        {
          title: '1. Projeto: Esquema Completo de E-Commerce com Trigger e Views',
          desc: 'Projete um banco relacional escalável com controle de estoque automático e relatórios analíticos.',
          theory: [{ title: 'Projeto Prático', text: 'Modelagem completa com produtos, pedidos, itens e triggers.', keyPoints: ['Triggers para auditoria', 'Views analíticas', 'Integridade referencial'] }],
          code: `CREATE TRIGGER after_item_pedido_insert
AFTER INSERT ON itens_pedidos
FOR EACH ROW
BEGIN
    UPDATE produtos 
    SET estoque = estoque - NEW.quantidade 
    WHERE id = NEW.produto_id;
END;`,
          output: `Query OK, 0 rows affected (Trigger after_item_pedido_insert criado com sucesso).`,
          lang: 'sql',
          exercise: {
            id: 'ex-sql-prj-1',
            prompt: 'Em um Trigger do MySQL, qual palavra-chave especial acessa os valores da nova linha que está sendo inserida?',
            type: 'multiple_choice',
            options: ['NEW.coluna', 'OLD.coluna', 'CURRENT.coluna', 'INPUT.coluna'],
            correctAnswer: 'NEW.coluna',
            hint: 'Refere-se ao novo registro inserido ou atualizado.',
            explanation: '`NEW.coluna` dá acesso aos dados que estão entrando na tabela em eventos de INSERT e UPDATE.',
          },
        },
      ],
    },
    quizzesByLevel: {
      iniciante: [
        {
          id: 'sql-q-ini-1',
          question: 'Qual comando DML é utilizado para remover registros de uma tabela no SQL?',
          options: ['DELETE FROM tabela WHERE ...', 'REMOVE tabela', 'DROP TABLE', 'ERASE tabela'],
          correctIndex: 0,
          explanation: '`DELETE FROM` remove linhas específicas filtradas pela cláusula WHERE.',
        },
      ],
      intermediario: [
        {
          id: 'sql-q-int-1',
          question: 'Qual a diferença entre a cláusula WHERE e a cláusula HAVING no SQL?',
          options: [
            'WHERE filtra linhas individuais antes do agrupamento; HAVING filtra grupos de linhas após o GROUP BY',
            'Não existe diferença',
            'WHERE só funciona com números',
            'HAVING só funciona com textos',
          ],
          correctIndex: 0,
          explanation: '`HAVING` é aplicado exclusivamente sobre o resultado agregado do `GROUP BY`.',
        },
      ],
      avancado: [
        {
          id: 'sql-q-av-1',
          question: 'Qual motor de armazenamento (Storage Engine) padrão do MySQL suporta transações ACID e chaves estrangeiras?',
          options: ['InnoDB', 'MyISAM', 'Memory', 'CSV'],
          correctIndex: 0,
          explanation: '`InnoDB` é a engine padrão do MySQL fornecendo transações ACID, row-level locking e integridade referencial.',
        },
      ],
      projetos: [
        {
          id: 'sql-q-prj-1',
          question: 'O que é uma VIEW no banco de dados relacional?',
          options: [
            'Uma tabela virtual baseada no resultado de uma consulta SELECT que pode ser consultada como se fosse uma tabela real',
            'Uma imagem salva no disco',
            'Um backup do servidor',
            'Um monitor de vídeo',
          ],
          correctIndex: 0,
          explanation: 'Uma VIEW armazena uma query com nome no catálogo, simplificando consultas complexas e restringindo visualização de colunas.',
        },
      ],
    },
  },
};
