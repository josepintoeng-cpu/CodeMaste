import { Lesson, Quiz } from '../../types';

export const pythonInicianteLessons: Lesson[] = [
  {
    id: 'py-ini-1',
    techId: 'python',
    levelId: 'iniciante',
    order: 1,
    title: '1. Olá, Mundo e Variáveis em Python',
    description: 'Aprenda a exibir mensagens na tela, criar variáveis para guardar dados e entender os tipos básicos.',
    estimatedMinutes: 8,
    xpReward: 20,
    theory: [
      {
        title: 'O que é Python?',
        text: 'Python é uma linguagem de programação conhecida por sua sintaxe limpa, simples e muito parecida com o inglês falado. Ela é usada pelo Google, NASA, Netflix e em inteligência artificial.',
        keyPoints: [
          'Sintaxe clara e legível',
          'Não necessita de ponto e vírgula ao final das linhas',
          'A função print() exibe valores na tela',
        ],
        conceptCard: '💡 Variável é um "espaço na memória" com um nome onde guardamos informações (números, textos, booleanos).',
      },
      {
        title: 'Criando Variáveis e Tipos de Dados',
        text: 'Em Python você não precisa declarar o tipo explicitamente. O próprio interpretador identifica:',
        keyPoints: [
          'str (Texto/String): entre aspas -> nome = "Ana"',
          'int (Número Inteiro): idade = 25',
          'float (Número Decimal): altura = 1.75',
          'bool (Booleano): ativo = True ou False',
        ],
      },
    ],
    codeExample: {
      language: 'python',
      code: `# Exibindo texto na tela
print("Olá, bem-vindo ao Python!")

# Criando variáveis
nome = "Carlos"
idade = 28
altura = 1.82
dev = True

# Imprimindo variáveis intercaladas
print("Nome:", nome)
print("Idade:", idade)
print("É desenvolvedor?", dev)`,
      explanation: 'No exemplo acima usamos print() para mostrar mensagens e criamos 4 variáveis com tipos diferentes.',
    },
    simulation: {
      type: 'real_pyodide',
      defaultOutput: `Olá, bem-vindo ao Python!
Nome: Carlos
Idade: 28
É desenvolvedor? True`,
      description: 'Execução de código Python em tempo real.',
    },
    exercise: {
      id: 'ex-py-ini-1',
      prompt: 'Crie uma variável chamada nome com o valor "Lucas" e exiba usando a função print(nome):',
      type: 'code_write',
      initialCode: '# Escreva seu código abaixo\n',
      correctAnswer: 'nome = "Lucas"\nprint(nome)',
      expectedOutput: 'Lucas',
      hint: 'Crie nome = "Lucas" na primeira linha e print(nome) na segunda linha.',
      explanation: 'Para definir uma variável do tipo string usam-se aspas duplas ou simples e depois a função print().',
    },
  },

  {
    id: 'py-ini-2',
    techId: 'python',
    levelId: 'iniciante',
    order: 2,
    title: '2. Operações Matemáticas e Entrada de Dados',
    description: 'Faça cálculos matemáticos em Python e receba valores digitados pelo usuário.',
    estimatedMinutes: 10,
    xpReward: 25,
    theory: [
      {
        title: 'Operadores Aritméticos',
        text: 'Python permite realizar operações matemáticas simples e avançadas com operadores intuitivos:',
        keyPoints: [
          '+ (Soma) e - (Subtração)',
          '* (Multiplicação) e / (Divisão)',
          '// (Divisão Inteira) e % (Resto da Divisão)',
          '** (Exponenciação / Potência)',
        ],
      },
      {
        title: 'Recebendo Dados com input()',
        text: 'A função input() pausa o programa e aguarda o usuário digitar um valor. Nota: o input() sempre retorna o dado como texto (str). Para números, converta com int() ou float().',
      },
    ],
    codeExample: {
      language: 'python',
      code: `# Calculando a média de duas notas
nota1 = 8.5
nota2 = 9.5
media = (nota1 + nota2) / 2

print("Sua média é:", media)

# Convertendo string para int
idade_str = "20"
idade_num = int(idade_str)
print("Ano que vem você terá:", idade_num + 1)`,
      explanation: 'Usamos parênteses para priorizar a soma antes da divisão e int() para converter texto em número.',
    },
    simulation: {
      type: 'real_pyodide',
      defaultOutput: `Sua média é: 9.0
Ano que vem você terá: 21`,
      description: 'Simulação de cálculo aritmético e conversão de tipos em Python.',
    },
    exercise: {
      id: 'ex-py-ini-2',
      prompt: 'Qual operador em Python é usado para calcular o RESTO de uma divisão (módulo)?',
      type: 'multiple_choice',
      options: ['/', '%', '//', '**'],
      correctAnswer: '%',
      hint: 'Pense no símbolo de porcentagem.',
      explanation: 'O operador % (módulo) retorna o resto da divisão. Exemplo: 10 % 3 resulta em 1.',
    },
  },

  {
    id: 'py-ini-3',
    techId: 'python',
    levelId: 'iniciante',
    order: 3,
    title: '3. Tomadas de Decisão com if, elif e else',
    description: 'Aprenda a controlar o fluxo do seu programa usando estruturas condicionais e indentação.',
    estimatedMinutes: 12,
    xpReward: 30,
    theory: [
      {
        title: 'Estruturas Condicionais',
        text: 'Permitem que seu código tome caminhos diferentes dependendo se uma condição é verdadeira (True) ou falsa (False).',
        keyPoints: [
          'if (se): executa se a condição for verdadeira',
          'elif (senão se): testa uma nova condição alternativa',
          'else (senão): executa quando nenhuma condição anterior for satisfeita',
        ],
        conceptCard: '⚠️ ATENÇÃO: Em Python a indentação (4 espaços) é OBRIGATÓRIA para definir blocos de código!',
      },
    ],
    codeExample: {
      language: 'python',
      code: `nota = 7.5

if nota >= 7.0:
    print("Aprovado! Parabéns!")
elif nota >= 5.0:
    print("Em recuperação. Estude mais!")
else:
    print("Reprovado. Tente no próximo semestre.")`,
      explanation: 'Observe os dois pontos (:) no final do if/elif/else e os 4 espaços de recuo nas linhas internas.',
    },
    simulation: {
      type: 'real_pyodide',
      defaultOutput: 'Aprovado! Parabéns!',
      description: 'Avaliação da estrutura condicional em execução.',
    },
    exercise: {
      id: 'ex-py-ini-3',
      prompt: 'Complete o código para verificar se a variável idade é maior ou igual a 18:',
      type: 'code_write',
      initialCode: 'idade = 20\n# Escreva a condicional if abaixo\n',
      correctAnswer: 'if idade >= 18:\n    print("Maior de idade")',
      expectedOutput: 'Maior de idade',
      hint: 'Use if idade >= 18: e não esqueça dos dois pontos (:) e da indentação.',
      explanation: 'O operador >= verifica se o valor da esquerda é maior ou igual ao da direita.',
    },
  },

  {
    id: 'py-ini-4',
    techId: 'python',
    levelId: 'iniciante',
    order: 4,
    title: '4. Repetições com Laços for e while',
    description: 'Automatize tarefas repetitivas executando blocos de código múltiplas vezes com loops.',
    estimatedMinutes: 12,
    xpReward: 30,
    theory: [
      {
        title: 'O Laço for com range()',
        text: 'O for é ideal para iterar sobre uma sequência conhecida de itens ou gerar contagens com a função range().',
        keyPoints: [
          'range(5): gera números de 0 a 4',
          'range(1, 6): gera números de 1 a 5',
          'for item in sequencia: itera item por item',
        ],
      },
      {
        title: 'O Laço while',
        text: 'O while continua repetindo enquanto a condição for True. Cuidado para não criar loops infinitos!',
      },
    ],
    codeExample: {
      language: 'python',
      code: `# Contando de 1 a 5 com for
print("--- Contagem com FOR ---")
for i in range(1, 6):
    print("Número:", i)

# Contagem regressiva com while
print("\\n--- Contagem com WHILE ---")
contador = 3
while contador > 0:
    print("Contador:", contador)
    contador -= 1
print("Fogo! 🚀")`,
      explanation: 'O range(1, 6) vai até 5 (o limite superior é exclusivo). O contador -= 1 diminui o valor a cada volta.',
    },
    simulation: {
      type: 'real_pyodide',
      defaultOutput: `--- Contagem com FOR ---
Número: 1
Número: 2
Número: 3
Número: 4
Número: 5

--- Contagem com WHILE ---
Contador: 3
Contador: 2
Contador: 1
Fogo! 🚀`,
      description: 'Execução de laços de repetição.',
    },
    exercise: {
      id: 'ex-py-ini-4',
      prompt: 'Como fazer um loop for para imprimir os números de 0 a 2 usando range()?',
      type: 'multiple_choice',
      options: [
        'for i in range(3): print(i)',
        'for i in range(2): print(i)',
        'while i <= 2: print(i)',
        'repeat(3): print(i)'
      ],
      correctAnswer: 'for i in range(3): print(i)',
      hint: 'Lembre-se que range(N) vai de 0 até N-1.',
      explanation: 'range(3) gera a sequência 0, 1 e 2.',
    },
  },

  {
    id: 'py-ini-5',
    techId: 'python',
    levelId: 'iniciante',
    order: 5,
    title: '5. Coleções de Dados: Listas e Dicionários',
    description: 'Armazene múltiplos valores em uma única variável usando listas ordenadas e dicionários chave-valor.',
    estimatedMinutes: 15,
    xpReward: 35,
    theory: [
      {
        title: 'Listas [ ]',
        text: 'Listas são coleções ordenadas e mutáveis. O primeiro elemento está sempre no índice 0.',
        keyPoints: [
          'frutas = ["maçã", "banana", "uva"]',
          'frutas.append("laranja"): adiciona item ao final',
          'len(frutas): retorna o tamanho da lista',
        ],
      },
      {
        title: 'Dicionários { }',
        text: 'Dicionários armazenam pares de Chave: Valor. Ideais para representar objetos complexos como usuários ou produtos.',
        conceptCard: 'ex: aluno = {"nome": "Beatriz", "nota": 9.8}',
      },
    ],
    codeExample: {
      language: 'python',
      code: `# Trabalhando com Lista
linguagens = ["Python", "JavaScript", "Java"]
linguagens.append("C++")

print("Primeira linguagem:", linguagens[0])
print("Total de linguagens:", len(linguagens))

# Trabalhando com Dicionário
pessoa = {
    "nome": "Amanda",
    "cargo": "Desenvolvedora Python",
    "experiencia_anos": 3
}

print("Dev:", pessoa["nome"])
print("Cargo:", pessoa["cargo"])`,
      explanation: 'Acessamos listas por índice numérico [0] e dicionários pelo nome da chave ["nome"].',
    },
    simulation: {
      type: 'real_pyodide',
      defaultOutput: `Primeira linguagem: Python
Total de linguagens: 4
Dev: Amanda
Cargo: Desenvolvedora Python`,
      description: 'Manipulação de listas e dicionários em Python.',
    },
    exercise: {
      id: 'ex-py-ini-5',
      prompt: 'Crie uma lista chamada numeros contendo 10 e 20, e adicione o número 30 usando o método append():',
      type: 'code_write',
      initialCode: 'numeros = [10, 20]\n# Adicione o numero 30 abaixo\n',
      correctAnswer: 'numeros = [10, 20]\nnumeros.append(30)',
      expectedOutput: '[10, 20, 30]',
      hint: 'Use a sintaxe: numeros.append(30)',
      explanation: 'O método .append() insere o novo elemento no final da lista existente.',
    },
  },
];

export const pythonInicianteQuiz: Quiz = {
  id: 'quiz-py-iniciante',
  techId: 'python',
  levelId: 'iniciante',
  title: 'Quiz Final: Python Iniciante',
  xpReward: 50,
  questions: [
    {
      id: 'q1',
      question: 'Qual é a função usada em Python para exibir mensagens no console?',
      options: ['echo()', 'console.log()', 'print()', 'System.out.println()'],
      correctIndex: 2,
      explanation: 'A função print() é o comando nativo em Python para saída de dados.',
    },
    {
      id: 'q2',
      question: 'Como se define um bloco de código interno (como dentro de um if ou loop) em Python?',
      options: ['Com chaves { }', 'Com indentação (espaços)', 'Com a palavra begin/end', 'Com parênteses ( )'],
      correctIndex: 1,
      explanation: 'Python utiliza a indentação obrigatória (geralmente 4 espaços) para determinar o escopo de blocos.',
    },
    {
      id: 'q3',
      question: 'Qual é o tipo de dado da variável x = "123"?',
      options: ['int (inteiro)', 'float (decimal)', 'str (string / texto)', 'bool (booleano)'],
      correctIndex: 2,
      explanation: 'Valores delimitados por aspas são sempre interpretados como texto (string / str).',
    },
    {
      id: 'q4',
      question: 'O que o comando len([1, 2, 3, 4]) retorna?',
      options: ['1', '3', '4', 'Erro'],
      correctIndex: 2,
      explanation: 'A função len() retorna a quantidade total de elementos em uma coleção.',
    },
  ],
};
