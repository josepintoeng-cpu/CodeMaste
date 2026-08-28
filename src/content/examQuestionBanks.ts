import { TechId } from '../types';

export interface RawTheoryQuestion {
  q: string;
  opts: string[];
  correct: number;
  exp: string;
  topic: string;
}

export interface RawPracticalQuestion {
  prompt: string;
  topic: string;
  initialCode: string;
  expectedKeywords: string[];
  correctSnippet: string;
  hint: string;
  explanation: string;
}

export interface TechQuestionPool {
  theories: RawTheoryQuestion[];
  practicals: RawPracticalQuestion[];
}

export const EXAM_QUESTION_BANKS: Partial<Record<TechId, TechQuestionPool>> = {
  python: {
    theories: [
      {
        q: 'Considere o GIL (Global Interpreter Lock) no CPython e o modelo de memória de objetos PyObject. Qual das seguintes afirmações descreve com exatidão técnica as implicações de concorrência e desempenho em workloads multithreaded com CPU-bound versus I/O-bound?',
        opts: [
          'Em tarefas CPU-bound, múltiplas threads em Python competem pelo mesmo lock do interpretador, gerando overhead de context switching e degradando a taxa de vazão real sem paralelismo em múltiplos núcleos físicos; para CPU-bound deve-se usar multiprocessing ou C-extensions liberando o GIL via Py_BEGIN_ALLOW_THREADS.',
          'O GIL foi totalmente desativado a partir do Python 3.8, permitindo que todas as threads nativas do sistema operacional executem simultaneamente sem bloqueio de mutex.',
          'Em tarefas I/O-bound, o GIL impede a liberação do lock durante chamadas de sistema (syscalls), forçando o desenvolvedor a usar exclusivamente subprocessos pesados para requisições HTTP.',
          'O GIL converte automaticamente chamadas síncronas em corrotinas assíncronas do asyncio sem intervenção do desenvolvedor.'
        ],
        correct: 0,
        exp: 'O GIL é um mutex que sincroniza a execução do interpretador CPython garantindo thread-safety na contagem de referências. Para I/O-bound, o interpretador libera o GIL durante syscalls; para CPU-bound, as threads se canibalizam disputando o lock, sendo imperativo o uso de múltiplos processos (multiprocessing).'
        , topic: 'CPython Internals & Concorrência'
      },
      {
        q: 'O que ocorre quando se utiliza um valor padrão mutável (como lista ou dicionário) na assinatura de uma função `def func(dados=[]):` em Python?',
        opts: [
          'O objeto padrão é instanciado apenas uma vez quando a função é definida em tempo de carregamento do módulo, fazendo com que mutações posteriores persistam entre chamadas subsequentes.',
          'O Python cria uma cópia profunda (deepcopy) do objeto a cada invocação da função para garantir isolamento.',
          'O interpretador lança imediatamente um erro de sintaxe `MutableDefaultArgError` durante o parse do código.',
          'O valor mutável é alocado no stack frame temporário e destruído automaticamente ao término da função.'
        ],
        correct: 0,
        exp: 'Argumentos padrão em Python são avaliados uma única vez na definição da função (`__defaults__`). Se mutáveis, todas as invocações sem o argumento compartilham a mesmíssima referência de memória.'
        , topic: 'Modelo de Execução & Funções'
      },
      {
        q: 'Qual é a diferença fundamental entre `__new__` e `__init__` no ciclo de vida de instanciação de objetos em classes Python?',
        opts: [
          '`__new__` é o construtor estático responsável por alocar e retornar a nova instância do objeto na memória heap, enquanto `__init__` é o inicializador que recebe a instância já criada (`self`) para configurar seus atributos.',
          '`__init__` aloca a memória em C e `__new__` é executado exclusivamente na destruição do objeto pelo Garbage Collector.',
          '`__new__` é executado apenas quando a classe herda de `type` (metaclasses), enquanto `__init__` é para classes comuns.',
          '`__init__` pode retornar qualquer tipo de dado arbitrário, enquanto `__new__` obrigatoriamente deve retornar None.'
        ],
        correct: 0,
        exp: '`__new__` é o método especial que cria e retorna a instância na memória (método estático). Se retornar uma instância da classe, o Python em seguida invoca `__init__(self, ...)` para inicializar o estado.'
        , topic: 'POO Avançada & Metaprogramação'
      },
      {
        q: 'Como o algoritmo MRO (Method Resolution Order) C3 Linearization resolve herança múltipla com o clássico problema do diamante em Python 3?',
        opts: [
          'Garante monotonicity (ordem de precedência local) e herança determinística, impedindo que classes base apareçam antes de suas derivadas e levantando TypeError se a hierarquia for inconsistente.',
          'Aplica busca em profundidade pura (DFS) da esquerda para a direita, ignorando repetições de classes base.',
          'Executa sempre a classe que foi declarada por último na lista de imports do arquivo.',
          'Permite herança ambígua e resolve conflitos invocando todos os métodos homônimos em paralelo.'
        ],
        correct: 0,
        exp: 'O C3 Linearization computa a ordem de resolução preservando a ordem local de pais e a consistência monotonicamente entre subclasses.'
        , topic: 'MRO & Herança Múltipla'
      },
      {
        q: 'Em relação ao gerenciador de contexto (Context Manager) e ao protocolo `__enter__` / `__exit__`, como deve ser tratado o retorno de `__exit__(self, exc_type, exc_val, exc_tb)` caso se deseje suprimir uma exceção levantada dentro do bloco `with`?',
        opts: [
          '`__exit__` deve retornar um valor avaliado como True (ex: `return True`), sinalizando ao interpretador para engolir a exceção e continuar o fluxo normal.',
          '`__exit__` deve invocar `sys.exit(0)` explicitamente.',
          '`__exit__` deve retornar `None` ou `False` para ocultar o traceback.',
          '`__exit__` deve relançar a exceção com a instrução `raise exc_val`.'
        ],
        correct: 0,
        exp: 'Se `__exit__` retornar um valor booleano True, o Python suprime a exceção que ocorreu no bloco `with`. Se retornar False ou None, a exceção é propagada normalmente.'
        , topic: 'Context Managers & Exceções'
      },
      {
        q: 'No módulo `asyncio`, qual é o risco arquitetural crítico de invocar uma função síncrona bloqueante pesada de CPU ou I/O dentro de uma corrotina executada no Event Loop principal?',
        opts: [
          'A chamada bloqueia a thread única do Event Loop, congelando todas as demais corrotinas e conexões concorrentes; deve-se delegar a execução para `asyncio.to_thread` ou `loop.run_in_executor`.',
          'O asyncio encerra o processo imediatamente emitindo `LoopTerminatedSignal`.',
          'O interpretador cria automaticamente uma thread em background para cada chamada síncrona sem afetar a latência.',
          'A função síncrona é convertida em bytecode assíncrono durante a compilação JIT do Python.'
        ],
        correct: 0,
        exp: 'O loop de eventos do asyncio roda em uma única thread cooperativa. Operações bloqueantes síncronas impedem o avanço das outras corrotinas até que o bloco retorne.'
        , topic: 'Asyncio & Concorrência'
      },
      {
        q: 'Como funcionam os slots (`__slots__`) em classes Python e qual é a principal vantagem em sistemas de alta escala?',
        opts: [
          'Substituem o dicionário dinâmico `__dict__` por um array de tamanho fixo para atributos de instância, reduzindo substancialmente o footprint de memória RAM e acelerando o acesso aos atributos.',
          'Permitem salvar o código da classe diretamente em memória SSD flash.',
          'Transformam a classe em uma função assíncrona pura sem estado.',
          'Impedem a criação de instâncias fora do módulo de declaração.'
        ],
        correct: 0,
        exp: '`__slots__` evita a criação do dicionário de atributos `__dict__` em cada instância, economizando grande volume de memória quando milhões de objetos são instanciados.'
        , topic: 'Otimização de Memória & CPython'
      },
      {
        q: 'Qual é o mecanismo do garbage collector de geração cíclica (Cyclic Garbage Collector) do CPython para resolver referências circulares?',
        opts: [
          'Utiliza contagem de referências como mecanismo primário (liberação imediata em refcount=0) e três gerações (Gen 0, 1, 2) inspecionando ponteiros de objetos contêineres para detectar e limpar ciclos inacessíveis.',
          'Executa varredura Stop-the-World a cada 100 milissegundos descartando qualquer objeto com mais de 2 referências.',
          'O Python não possui coletor cíclico, dependendo exclusivamente da destruição de variáveis globais.',
          'Converte referências circulares em ponteiros nulos (null pointers) no kernel do sistema operacional.'
        ],
        correct: 0,
        exp: 'CPython combina contagem de referências com um coletor geracional baseado em 3 gerações para rastrear ciclos de referências entre listas, dicionários e instâncias.'
        , topic: 'Memory Management & GC'
      },
      {
        q: 'O que caracteriza uma metaclasse em Python e quando ela é instanciada?',
        opts: [
          'Uma metaclasse é a "classe de uma classe" (comumente herdando de `type`), cujo método `__new__` é executado no momento da definição da classe para interceptar, validar ou transformar sua criação.',
          'É uma classe decoradora que só pode ser instanciada no método `main`.',
          'É um arquivo binário `.pyc` compilado com otimizações de C.',
          'É uma classe estática sem suporte a métodos ou herança.'
        ],
        correct: 0,
        exp: 'Em Python, classes são objetos de primeira classe instanciados por metaclasses (por padrão `type`). Custom metaclasses permitem metaprogramação profunda.'
        , topic: 'Metaclasses & Tipos'
      },
      {
        q: 'Em Python, como o decorador `@functools.wraps(func)` preserva os metadados da função original embrulhada por um wrapper?',
        opts: [
          'Copia atributos como `__name__`, `__doc__`, `__annotations__` e `__module__` da função original para a função wrapper, evitando perda de introspecção e documentação.',
          'Compila o wrapper para código binário nativo.',
          'Impede que a função seja executada mais de uma vez em cache memoizado.',
          'Substitui o bytecode da função por uma chamada CFFI.'
        ],
        correct: 0,
        exp: '`@wraps` atualiza o wrapper para refletir os metadados intrínsecos da função original, essencial para documentação, depuradores e frameworks web.'
        , topic: 'Decorators & Functools'
      }
    ],
    practicals: [
      {
        prompt: 'Implemente uma classe `LRUCache` em Python com capacidade máxima `capacity`. A classe deve ter métodos `get(key: int) -> int` (retorna o valor ou -1 se inexistente, marcando o item como mais recentemente usado) e `put(key: int, value: int) -> None` (insere/atualiza e descarta o item menos recentemente usado se atingir a capacidade). Complexidade deve ser O(1).',
        topic: 'Estruturas de Dados Avançadas',
        initialCode: 'class LRUCache:\n    def __init__(self, capacity: int):\n        # Inicialize as estruturas de dados (ex: OrderedDict ou HashMap + DoublyLinkedList)\n        self.capacity = capacity\n\n    def get(self, key: int) -> int:\n        # Implemente busca O(1) e atualização de recência\n        return -1\n\n    def put(self, key: int, value: int) -> None:\n        # Implemente inserção O(1) e evicção do menos recente\n        pass\n',
        expectedKeywords: ['class', 'def', '__init__', 'get', 'put', 'capacity', 'return'],
        correctSnippet: 'from collections import OrderedDict\n\nclass LRUCache:\n    def __init__(self, capacity: int):\n        self.capacity = capacity\n        self.cache = OrderedDict()\n\n    def get(self, key: int) -> int:\n        if key not in self.cache:\n            return -1\n        self.cache.move_to_end(key)\n        return self.cache[key]\n\n    def put(self, key: int, value: int) -> None:\n        if key in self.cache:\n            self.cache.move_to_end(key)\n        self.cache[key] = value\n        if len(self.cache) > self.capacity:\n            self.cache.popitem(last=False)',
        hint: 'Use collections.OrderedDict com move_to_end(key) e popitem(last=False) para manter complexidade O(1) rigorosa.',
        explanation: 'Implementação de cache com política Least Recently Used (LRU) garantindo tempo constante O(1) para operações de leitura e escrita.'
      },
      {
        prompt: 'Implemente um decorador `@retry(max_tentativas: int, excecao_alvo: tuple)` com suporte a argumentos que capture apenas as exceções especificadas em `excecao_alvo` e tente executar a função novamente até `max_tentativas` antes de relançar a exceção original.',
        topic: 'Metaprogramação & Decorators',
        initialCode: 'import functools\n\ndef retry(max_tentativas: int = 3, excecao_alvo: tuple = (Exception,)):\n    # Implemente o decorator com closure e functools.wraps\n    def decorator(func):\n        # Implemente o wrapper\n        pass\n    return decorator\n',
        expectedKeywords: ['def', 'decorator', 'wrapper', 'wraps', 'try', 'except', 'max_tentativas', 'return'],
        correctSnippet: 'import functools\n\ndef retry(max_tentativas: int = 3, excecao_alvo: tuple = (Exception,)):\n    def decorator(func):\n        @functools.wraps(func)\n        def wrapper(*args, **kwargs):\n            tentativas = 0\n            while tentativas < max_tentativas:\n                try:\n                    return func(*args, **kwargs)\n                except excecao_alvo as e:\n                    tentativas += 1\n                    if tentativas >= max_tentativas:\n                        raise e\n        return wrapper\n    return decorator',
        hint: 'Use @functools.wraps(func) no wrapper e um loop while/for capturando a tupla de exceções com controle de tentativas.',
        explanation: 'Padrão decorator de resiliência amplamente utilizado em microsserviços e chamadas de rede.'
      },
      {
        prompt: 'Implemente uma função assíncrona `buscar_dados_concorrentes(urls: list, max_concorrencia: int) -> list` usando `asyncio.Semaphore` e `asyncio.gather` para limitar o número de requisições paralelas simultâneas.',
        topic: 'Programação Assíncrona',
        initialCode: 'import asyncio\n\nasync def buscar_dados_concorrentes(urls: list, max_concorrencia: int = 5) -> list:\n    # Implemente controle de semáforo com asyncio\n    pass\n',
        expectedKeywords: ['async', 'def', 'asyncio', 'Semaphore', 'gather', 'await', 'return'],
        correctSnippet: 'import asyncio\n\nasync def buscar_dados_concorrentes(urls: list, max_concorrencia: int = 5) -> list:\n    semaforo = asyncio.Semaphore(max_concorrencia)\n    \n    async def tarefa_protegida(url):\n        async with semaforo:\n            # Simulação de fetch assíncrono\n            await asyncio.sleep(0.01)\n            return f"Resultado de {url}"\n            \n    tarefas = [tarefa_protegida(url) for url in urls]\n    return await asyncio.gather(*tarefas)',
        hint: 'Crie um Semaphore(max_concorrencia) e envolva cada chamada assíncrona dentro de "async with semaforo:".',
        explanation: 'O semáforo assíncrono impede sobrecarga em servidores de terceiros e exaustão de descritores de sockets no OS.'
      }
    ]
  },

  javascript: {
    theories: [
      {
        q: 'Qual é a ordem exata de resolução de prioridades na fila de tarefas (Task Queue / Macrotasks) versus fila de microtarefas (Microtask Queue) no Event Loop do V8?',
        opts: [
          'Após cada macrotask (como timers ou I/O), o motor esvazia COMPLETAMENTE a Microtask Queue (incluindo Promises `.then`, `queueMicrotask` e MutationObservers) antes de processar a próxima macrotask da fila ou renderizar frames.',
          'Macrotasks e Microtasks têm a mesmíssima prioridade e são executadas estritamente em ordem FIFO em uma única fila universal.',
          'Microtasks são executadas apenas quando a thread principal estiver ociosa há mais de 1000 milissegundos.',
          'Macrotasks sempre interrompem microtasks em execução para garantir baixa latência em requisições de rede.'
        ],
        correct: 0,
        exp: 'O Event Loop do JavaScript processa a pilha de chamadas síncronas, e assim que a pilha fica vazia, esvazia toda a fila de microtarefas antes de puxar a próxima macrotask.'
        , topic: 'Event Loop & V8 Engine'
      },
      {
        q: 'Como funciona o protótipo (`prototype chain`) e o método `Object.create(proto)` em JavaScript puro?',
        opts: [
          '`Object.create(proto)` instancia um novo objeto cujo ponteiro interno `[[Prototype]]` aponta diretamente para o objeto `proto` passado como argumento, permitindo delegação de propriedades em tempo de execução sem invocar um construtor.',
          '`Object.create` clona fisicamente todas as propriedades do objeto original em novos endereços de memória RAM.',
          '`Object.create` congela o objeto impedindo qualquer adição de métodos ou propriedades.',
          '`Object.create` é um método obsoleto substituído exclusivamente por classes ES6.'
        ],
        correct: 0,
        exp: 'A herança prototípica em JS é baseada em delegação. Se uma propriedade não for encontrada no objeto próprio, a engine percorre a cadeia `[[Prototype]]` até encontrar ou atingir `null`.'
        , topic: 'Prototype Chain & Herança'
      },
      {
        q: 'O que caracteriza um Memory Leak provocado por "Closures Acidentais" em aplicações JavaScript de longa execução (Node.js ou SPAs)?',
        opts: [
          'Uma closure interna retém referência a variáveis do escopo léxico externo (mesmo que não utilizadas diretamente por ela) porque funções declaradas no mesmo escopo compartilham o mesmo objeto de contexto léxico (Lexical Environment), impedindo o Garbage Collector (Mark-and-Sweep) de desalocá-las.',
          'Closures nunca causam memory leak porque o motor V8 compila todo o escopo léxico em registradores de CPU imutáveis.',
          'O memory leak ocorre apenas se a palavra-chave `var` for utilizada em loops `while`.',
          'Closures deletam automaticamente objetos da memória global sem aviso prévio.'
        ],
        correct: 0,
        exp: 'No V8, closures no mesmo escopo compartilham o objeto de contexto de ativação. Se uma closure de longa duração (ex: listener de evento) persistir, ela mantém vivo todo o contexto do escopo pai.'
        , topic: 'Closures & Memory Management'
      },
      {
        q: 'Qual é a diferença de comportamento entre `WeakMap` / `WeakSet` e `Map` / `Set` padrão no JavaScript?',
        opts: [
          'Chaves em `WeakMap` e valores em `WeakSet` devem ser estritamente objetos (ou símbolos não registrados) e são mantidos com referências fracas (weak references), permitindo que o Garbage Collector os colete se não houver outras referências fortes no programa, o que inviabiliza iteração e a propriedade `.size`.',
          '`WeakMap` aceita chaves primitivas como strings e números, enquanto `Map` aceita apenas objetos.',
          '`WeakMap` grava os dados em disco local ao invés da memória RAM.',
          '`WeakSet` permite elementos duplicados e ordenação por data de criação.'
        ],
        correct: 0,
        exp: 'Coleções fracas (WeakMap/WeakSet) não previnem a coleta de lixo de suas chaves, prevenindo memory leaks em caches ou metadados de elementos DOM.'
        , topic: 'Estruturas de Dados ES6+'
      }
    ],
    practicals: [
      {
        prompt: 'Implemente uma função de `debounce(fn, delay)` profissional em JavaScript que retorne uma função com método `.cancel()` anexado para abortar execuções pendentes e preserve o contexto (`this`) e argumentos corretos.',
        topic: 'Closures & Timers',
        initialCode: 'function debounce(fn, delay) {\n    // Implemente debounce com suporte a .cancel()\n    function debounced(...args) {\n        // ...\n    }\n    debounced.cancel = function() {\n        // ...\n    };\n    return debounced;\n}\n',
        expectedKeywords: ['function', 'setTimeout', 'clearTimeout', 'debounced', 'cancel', 'return'],
        correctSnippet: 'function debounce(fn, delay) {\n    let timerId = null;\n    function debounced(...args) {\n        const context = this;\n        if (timerId) clearTimeout(timerId);\n        timerId = setTimeout(() => {\n            fn.apply(context, args);\n            timerId = null;\n        }, delay);\n    }\n    debounced.cancel = function() {\n        if (timerId) {\n            clearTimeout(timerId);\n            timerId = null;\n        }\n    };\n    return debounced;\n}',
        hint: 'Armazene o ID do timer em closure e anexe o método cancel na função retornada invocando clearTimeout.',
        explanation: 'Padrão essencial para controle de taxa de disparo em interfaces e buscas em tempo real.'
      },
      {
        prompt: 'Implemente uma função `deepClone(obj)` em JavaScript puro que suporte objetos aninhados, arrays, datas (`Date`), expressões regulares (`RegExp`) e lide com referências circulares utilizando `WeakMap`.',
        topic: 'Manipulação de Objetos & Algoritmos',
        initialCode: 'function deepClone(obj, hash = new WeakMap()) {\n    // Implemente clonagem profunda com detecção de ciclos\n    return obj;\n}\n',
        expectedKeywords: ['function', 'deepClone', 'WeakMap', 'typeof', 'return'],
        correctSnippet: 'function deepClone(obj, hash = new WeakMap()) {\n    if (obj === null || typeof obj !== "object") return obj;\n    if (obj instanceof Date) return new Date(obj.getTime());\n    if (obj instanceof RegExp) return new RegExp(obj.source, obj.flags);\n    if (hash.has(obj)) return hash.get(obj);\n    const clone = Array.isArray(obj) ? [] : Object.create(Object.getPrototypeOf(obj));\n    hash.set(obj, clone);\n    for (const key of Reflect.ownKeys(obj)) {\n        clone[key] = deepClone(obj[key], hash);\n    }\n    return clone;\n}',
        hint: 'Verifique tipos primitivos, instâncias especiais e use hash.set / hash.get com WeakMap para prevenir recursão infinita em ciclos.',
        explanation: 'Algoritmo canônico de clonagem de estado seguro em runtime JS sem perda de protótipo.'
      }
    ]
  },

  typescript: {
    theories: [
      {
        q: 'O que são "Distributive Conditional Types" no sistema de tipos do TypeScript e sob qual condição a distribuição ocorre?',
        opts: [
          'Quando um tipo condicional `T extends U ? X : Y` é aplicado a um tipo de parâmetro genérico `T` nu (unwrapped) que é uma união (ex: `A | B`), a operação se distribui sobre cada membro individual da união: `(A extends U ? X : Y) | (B extends U ? X : Y)`.',
          'São tipos que convertem automaticamente objetos em arrays distribuídos na memória.',
          'Ocorrem apenas quando `strictNullChecks` está desabilitado no `tsconfig.json`.',
          'Distribuição de tipos ocorre apenas em interfaces, nunca em type aliases.'
        ],
        correct: 0,
        exp: 'Tipos condicionais distribuem sobre uniões quando o argumento de tipo genérico não está encapsulado em tupla (ex: `[T] extends [U]`).'
        , topic: 'Type System Avançado'
      },
      {
        q: 'Qual é a diferença entre a palavra-chave `infer` e `keyof` em tipos utilitários avançados do TypeScript?',
        opts: [
          '`infer` declara uma variável de tipo a ser deduzida dinamicamente dentro da cláusula `extends` de um tipo condicional, enquanto `keyof` produz uma união de tipos literais de todas as chaves públicas conhecidas de um tipo.',
          '`infer` extrai chaves de objetos em tempo de execução e `keyof` compila para JavaScript nativo.',
          '`infer` é exclusivo para interfaces e `keyof` para classes abstratas.',
          '`keyof` infere o tipo de retorno de uma Promise assíncrona.'
        ],
        correct: 0,
        exp: '`infer R` permite capturar partes de tipos complexos (ex: desempacotar o tipo resolvido de uma Promise ou os parâmetros de uma função).'
        , topic: 'Type Inference & Utility Types'
      },
      {
        q: 'O que caracteriza a invariância, covariância e contravariância nos parâmetros de funções no TypeScript sob a flag `--strictFunctionTypes`?',
        opts: [
          'Parâmetros de função são verificados contravariantemente (subtipos mais amplos/gerais são permitidos onde tipos mais específicos eram esperados na assinatura receptora), prevenindo chamadas inválidas com argumentos ausentes.',
          'Todos os parâmetros de funções são sempre covariantes sem exceção.',
          'O TypeScript não suporta verificação de variância em funções.',
          'Contravariância significa que métodos retornam sempre void.'
        ],
        correct: 0,
        exp: 'Com strictFunctionTypes habilitado, os tipos de argumentos de funções comportam-se de forma contravariante, garantindo segurança de tipos matematicamente correta.'
        , topic: 'Teoria dos Tipos & Variância'
      }
    ],
    practicals: [
      {
        prompt: 'Crie um tipo utilitário avançado `DeepReadonly<T>` em TypeScript que transforme recursivamente todas as propriedades de um objeto e de seus objetos aninhados e arrays em `readonly`.',
        topic: 'Mapped Types & Recursão de Tipos',
        initialCode: 'type DeepReadonly<T> = {\n    // Implemente a transformação recursiva de tipo\n};\n',
        expectedKeywords: ['type', 'DeepReadonly', 'keyof', 'readonly'],
        correctSnippet: 'type DeepReadonly<T> = T extends Function | boolean | number | string | null | undefined\n    ? T\n    : T extends Array<infer U>\n    ? ReadonlyArray<DeepReadonly<U>>\n    : { readonly [K in keyof T]: DeepReadonly<T[K]> };',
        hint: 'Use tipos condicionais para verificar tipos primitivos, arrays com infer, e mapped type com readonly [K in keyof T].',
        explanation: 'Tipo utilitário recursivo fundamental para bibliotecas de imutabilidade estrita em TypeScript.'
      }
    ]
  },

  react: {
    theories: [
      {
        q: 'No modelo de concorrência do React 18 e arquitetura Fiber, como o reconciliador gerencia interrupções de renderização com `useTransition`?',
        opts: [
          'O React atribui prioridade mais baixa de "transição" às atualizações embrulhadas em `startTransition`, permitindo que o Fiber divida o trabalho de reconciliação em pedaços e ceda a thread principal para eventos de alta prioridade do usuário (como cliques e digitação).',
          'O React executa a árvore de componentes em Web Workers separados no navegador.',
          'O `useTransition` renderiza o componente no servidor Node.js e envia via WebSocket.',
          'O `useTransition` congela o estado do componente permanentemente.'
        ],
        correct: 0,
        exp: 'O React Concurrent Mode permite renderização pausável e interruptível graças à estrutura de dados Fiber em lista duplamente encadeada com agendamento cooperativo.'
        , topic: 'React 18 & Concurrent Features'
      },
      {
        q: 'Qual é a causa raiz do problema de "Stale Closures" em hooks do React (`useEffect`, `useCallback`) e como resolvê-lo de forma canônica?',
        opts: [
          'A closure da função de efeito captura o valor do estado no momento em que a função foi criada; se as dependências não forem declaradas no array de dependências, chamadas futuras da closure continuam lendo o valor antigo (stale). Resolve-se incluindo as variáveis no array de dependências ou usando o padrão de atualização funcional `setState(prev => ...)`.',
          'Stale closures são causadas por falha no coletor de lixo do navegador.',
          'Ocorre apenas se o componente for exportado como default.',
          'Resolve-se convertendo todos os componentes para componentes de classe.'
        ],
        correct: 0,
        exp: 'Stale closures ocorrem quando uma função mantém referência a um snapshot antigo de variáveis léxicas de renderizações anteriores.'
        , topic: 'Hooks & Ciclo de Vida'
      }
    ],
    practicals: [
      {
        prompt: 'Implemente um custom hook `usePrevious<T>(value: T): T | undefined` no React que armazene e retorne o valor da renderização anterior utilizando `useRef` e `useEffect`.',
        topic: 'Custom Hooks & Refs',
        initialCode: 'import { useRef, useEffect } from "react";\n\nexport function usePrevious<T>(value: T): T | undefined {\n    // Implemente o hook\n    return undefined;\n}\n',
        expectedKeywords: ['useRef', 'useEffect', 'return', 'current'],
        correctSnippet: 'import { useRef, useEffect } from "react";\n\nexport function usePrevious<T>(value: T): T | undefined {\n    const ref = useRef<T | undefined>(undefined);\n    useEffect(() => {\n        ref.current = value;\n    }, [value]);\n    return ref.current;\n}',
        hint: 'useEffect roda após a renderização ter sido commitada no DOM, permitindo que o retorno do hook seja o valor anterior antes da atualização do ref.',
        explanation: 'Padrão idiomático de hooks para comparação de valores anteriores sem disparar re-render.'
      }
    ]
  },

  mysql: {
    theories: [
      {
        q: 'Em bancos de dados relacionais e no padrão ANSI/ISO SQL, qual nível de isolamento de transação previne simultaneamente Dirty Reads, Non-Repeatable Reads e Phantom Reads?',
        opts: [
          'Serializable (Serializável), que garante que o resultado concorrente de múltiplas transações seja indistinguível de uma execução estritamente sequencial.',
          'Read Committed.',
          'Repeatable Read.',
          'Read Uncommitted.'
        ],
        correct: 0,
        exp: 'Serializable é o nível de isolamento mais alto do padrão ACID, prevenindo leituras sujas, não repetíveis e leituras fantasmas (através de locks de intervalo ou serializable snapshot isolation).'
        , topic: 'ACID & Níveis de Isolamento'
      },
      {
        q: 'Qual é a diferença estrutural entre um índice B-Tree (Balanced Tree) e um índice Hash em bancos de dados relacionais (PostgreSQL/MySQL)?',
        opts: [
          'Índices B-Tree mantêm dados ordenados, suportando eficientemente consultas de intervalo (`BETWEEN`, `>`, `<`), ordenações (`ORDER BY`) e correspondência de prefixo (`LIKE "abc%"`), enquanto índices Hash suportam exclusivamente operações de igualdade estrita (`=`) com complexidade O(1).',
          'Índices Hash são os únicos que suportam ordenação e busca por faixa.',
          'Índices B-Tree não podem ser usados em chaves primárias numéricas.',
          'Índices B-Tree são armazenados em texto plano sem balanceamento de nós.'
        ],
        correct: 0,
        exp: 'B-Trees mantêm chaves ordenadas permitindo travessias rápidas em intervalos de dados, enquanto Hash indexes mapeiam hash buckets apenas para comparações exatas.'
        , topic: 'Indexação & Query Optimization'
      }
    ],
    practicals: [
      {
        prompt: 'Escreva uma consulta SQL utilizando CTE recursiva (`WITH RECURSIVE`) para calcular a hierarquia de funcionários (`id`, `nome`, `gestor_id`, `nivel`) a partir do CEO (`gestor_id IS NULL`) até todos os subordinados.',
        topic: 'CTEs Recursivas & Grafos em SQL',
        initialCode: '-- Escreva a consulta SQL com WITH RECURSIVE\nWITH RECURSIVE hierarquia AS (\n    -- Caso base: CEO\n    \n    UNION ALL\n    \n    -- Passo recursivo\n    \n)\nSELECT * FROM hierarquia;\n',
        expectedKeywords: ['WITH', 'RECURSIVE', 'UNION', 'ALL', 'SELECT', 'FROM', 'JOIN'],
        correctSnippet: 'WITH RECURSIVE hierarquia AS (\n    SELECT id, nome, gestor_id, 1 AS nivel\n    FROM funcionarios\n    WHERE gestor_id IS NULL\n    UNION ALL\n    SELECT f.id, f.nome, f.gestor_id, h.nivel + 1\n    FROM funcionarios f\n    INNER JOIN hierarquia h ON f.gestor_id = h.id\n)\nSELECT id, nome, gestor_id, nivel FROM hierarquia ORDER BY nivel, nome;',
        hint: 'Defina a âncora (gestor_id IS NULL com nivel 1) e o passo recursivo unindo a tabela com a própria CTE no campo gestor_id.',
        explanation: 'Uso de Common Table Expressions recursivas para navegação em estruturas de árvores e grafos no SQL moderno.'
      }
    ]
  },
  postgresql: {
    theories: [
      {
        q: 'No PostgreSQL, como o mecanismo MVCC (Multi-Version Concurrency Control) implementa controle de concorrência sem locks de leitura bloqueando escrita?',
        opts: [
          'Cada transação enxerga um snapshot imutável dos dados baseado em identificadores xmin/xmax em cada tupla física, criando novas versões de tuplas em UPDATEs e delegando a limpeza de tuplas mortas (dead tuples) ao VACUUM.',
          'O PostgreSQL bloqueia toda a tabela em operações de SELECT.',
          'O PostgreSQL armazena todas as alterações na memória RAM e só persiste em disco após desligar o servidor.',
          'O MVCC impede a criação de mais de uma transação por segundo.'
        ],
        correct: 0,
        exp: 'O MVCC do Postgres usa tuplas versionadas com xmin/xmax e Transaction IDs para garantir isolamento de leitura sem bloquear escritas.'
        , topic: 'PostgreSQL MVCC & VACUUM'
      }
    ],
    practicals: [
      {
        prompt: 'Escreva uma consulta SQL PostgreSQL com Window Function (`ROW_NUMBER() OVER (...)`) para particionar vendas por departamento e obter apenas a maior venda de cada departamento.',
        topic: 'Window Functions em SQL',
        initialCode: '-- Escreva a consulta com ROW_NUMBER() e CTE\nWITH vendas_ranqueadas AS (\n    SELECT id, departamento, valor,\n           ROW_NUMBER() OVER (PARTITION BY departamento ORDER BY valor DESC) as rank\n    FROM vendas\n)\nSELECT * FROM vendas_ranqueadas WHERE rank = 1;\n',
        expectedKeywords: ['ROW_NUMBER', 'OVER', 'PARTITION', 'BY', 'ORDER', 'DESC', 'SELECT'],
        correctSnippet: 'WITH vendas_ranqueadas AS (\n    SELECT id, departamento, valor,\n           ROW_NUMBER() OVER (PARTITION BY departamento ORDER BY valor DESC) as rank\n    FROM vendas\n)\nSELECT id, departamento, valor FROM vendas_ranqueadas WHERE rank = 1;',
        hint: 'Use ROW_NUMBER() OVER (PARTITION BY departamento ORDER BY valor DESC) filtrando rank = 1 na query externa.',
        explanation: 'Funções de janela permitem agregações e rankings sem colapsar as linhas do resultado.'
      }
    ]
  }
};
