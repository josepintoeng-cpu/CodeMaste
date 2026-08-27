import { TechCurriculumData } from '../techCurriculum';

export const GAME_SPECIALIZATION_CURRICULUM: Record<string, TechCurriculumData> = {
  // =========================================================================
  // FUNDAMENTOS: MATEMÁTICA, FÍSICA & ALGORITMOS PARA JOGOS
  // =========================================================================
  game_fundamentals: {
    topicsByLevel: {
      iniciante: [
        {
          title: '1. Álgebra Linear para Jogos: Vetores, Magnitude, Normalização & Distâncias',
          desc: 'Domine a matemática vetorial que move todos os jogos: coordenadas cartesianas, soma vetorial e distância Euclidiana.',
          theory: [
            {
              title: 'Vetores: O Tijolo Fundamental dos Jogos',
              text: 'Um vetor representa magnitude (comprimento) e direção. A normalização de um vetor reduz seu comprimento para exatamente 1.0 (vetor unitário), permitindo multiplicar por qualquer velocidade escalar sem distorções de diagonal.',
              keyPoints: [
                'Normalização: `v.normalized = v / v.magnitude` (evita o clássico "andar mais rápido na diagonal").',
                'Magnitude vs SqrMagnitude: `Vector3.SqrMagnitude` evita calcular a raiz quadrada (Math.sqrt), sendo 10x mais rápido para checagens de proximidade.',
                'Subtração Vetorial (Destino - Origem): Retorna o vetor que aponta da origem para o destino.',
              ],
            },
          ],
          code: `// Cálculo otimizado de distância sem raiz quadrada em C# / C++
public static bool IsTargetInRange(Vector3 myPos, Vector3 targetPos, float range)
{
    Vector3 direction = targetPos - myPos;
    // sqrMagnitude é muito mais rápido que Vector3.Distance!
    return direction.sqrMagnitude <= (range * range);
}`,
          output: '[Game Math]: Vetor [3.0, 4.0] normalizado para [0.6, 0.8]. Magnitude calculada: 5.0.',
          lang: 'csharp',
          exercise: {
            id: 'ex-math-ini-1',
            prompt: 'Por que devemos usar "sqrMagnitude" (distância ao quadrado) em vez de "Distance" ao verificar o alcance de centenas de inimigos em cada quadro?',
            type: 'multiple_choice',
            options: [
              'Porque evita a operação de raiz quadrada (Square Root), que é matematicamente cara para a CPU',
              'Porque a distância comum não funciona em 3D',
              'Porque sqrMagnitude deixa o jogo em câmera lenta',
              'Porque o computador só aceita números pares',
            ],
            correctAnswer: 'Porque evita a operação de raiz quadrada (Square Root), que é matematicamente cara para a CPU',
            hint: 'Comparar A² <= B² produz o mesmo resultado lógico que A <= B sem calcular raízes.',
            explanation: 'Calcular a raiz quadrada exige muitos ciclos de CPU. Comparar a magnitude ao quadrado com o raio ao quadrado elimina esse cálculo pesado.',
          },
        },
        {
          title: '2. Produto Escalar (Dot Product) & Ângulos de Visão (Field of View)',
          desc: 'Descubra se um inimigo está na frente ou atrás do jogador e calcule campos de visão com Vector3.Dot.',
          theory: [
            {
              title: 'O Poder do Produto Escalar (Dot Product)',
              text: 'O produto escalar entre dois vetores normalizados A e B é igual ao cosseno do ângulo entre eles: Dot(A, B) = cos(θ). Se o resultado for 1.0, estão na mesma direção; se for 0.0, são perpendiculares (90º); se for negativo, o alvo está atrás!',
              keyPoints: [
                'Dot > 0: Objeto está na frente.',
                'Dot < 0: Objeto está atrás.',
                'Checagem de Cone de Visão (FOV): `if (Vector3.Dot(enemyForward, toPlayerDir) > Mathf.Cos(fovAngle / 2)) CanSee();`',
              ],
            },
          ],
          code: `// Checagem de Campo de Visão (FOV Cone)
public bool IsPlayerInFieldOfView(Transform enemy, Transform player, float fovDegrees)
{
    Vector3 toPlayer = (player.position - enemy.position).normalized;
    float dot = Vector3.Dot(enemy.forward, toPlayer);
    float threshold = Mathf.Cos((fovDegrees / 2f) * Mathf.Deg2Rad);

    return dot >= threshold;
}`,
          output: '[Game Math]: Dot Product = 0.866 (cos 30º). Alvo dentro do cone de visão de 90º!',
          lang: 'csharp',
          exercise: {
            id: 'ex-math-ini-2',
            prompt: 'Se o Produto Escalar (Dot Product) entre a direção para onde o inimigo olha e o vetor que aponta para o jogador for MENOR QUE ZERO, o que isso significa?',
            type: 'multiple_choice',
            options: [
              'O jogador está atrás do inimigo (ângulo maior que 90 graus)',
              'O jogador está exatamente na frente',
              'O jogador está invisível',
              'O inimigo foi derrotado',
            ],
            correctAnswer: 'O jogador está atrás do inimigo (ângulo maior que 90 graus)',
            hint: 'O cosseno de ângulos obtusos (entre 90º e 180º) é negativo.',
            explanation: 'Um Dot Product negativo indica que os dois vetores apontam para direções opostas, confirmando que o alvo está nas costas do agente.',
          },
        },
      ],
      intermediario: [
        {
          title: '3. Produto Vetorial (Cross Product) & Normais de Superfície',
          desc: 'Calcule vetores perpendiculares, normais de planos e saiba se um alvo está à esquerda ou à direita.',
          theory: [
            {
              title: 'Produto Vetorial (Cross Product)',
              text: 'O Produto Vetorial de dois vetores A e B em 3D resulta em um terceiro vetor perpendicular a ambos (Regra da Mão Direita). É essencial para calcular as normais de polígonos e saber para qual lado um veículo ou câmera deve girar.',
              keyPoints: [
                'Vector3.Cross(A, B): Vetor normal ortogonal.',
                'Determinação de Lado (Esquerda vs Direita): O sinal do eixo Y do Cross Product indica se o alvo está à esquerda ou à direita.',
              ],
            },
          ],
          code: `// Descobre se o alvo está à esquerda ou à direita
public float GetSteeringDirection(Transform vehicle, Vector3 targetPosition)
{
    Vector3 toTarget = (targetPosition - vehicle.position).normalized;
    Vector3 cross = Vector3.Cross(vehicle.forward, toTarget);

    // Se cross.y > 0 -> Alvo está à DIREITA; se cross.y < 0 -> Alvo está à ESQUERDA
    return cross.y;
}`,
          output: '[Game Math]: Cross Product Y = -0.42. Alvo localizado à ESQUERDA do veículo.',
          lang: 'csharp',
          exercise: {
            id: 'ex-math-med-1',
            prompt: 'O que o Produto Vetorial (Cross Product) entre dois vetores 3D retorna?',
            type: 'multiple_choice',
            options: [
              'Um terceiro vetor tridimensional perpendicular (em 90 graus) a ambos os vetores de entrada',
              'Um único número escalar',
              'Uma cor em formato RGB',
              'O dobro da velocidade',
            ],
            correctAnswer: 'Um terceiro vetor tridimensional perpendicular (em 90 graus) a ambos os vetores de entrada',
            hint: 'Segue a regra da mão direita no espaço tridimensional.',
            explanation: 'O Cross Product gera um vetor ortogonal a ambos os vetores, sendo a base do cálculo de normais de faces e torque de rotação física.',
          },
        },
        {
          title: '4. Algoritmo A* (A-Star Pathfinding) & Heurísticas de Distância',
          desc: 'Implemente o algoritmo de busca de caminhos mais famoso dos jogos com nós abertos, fechados e custo f = g + h.',
          theory: [
            {
              title: 'O Algoritmo A*',
              text: 'O A* encontra o caminho mais curto e eficiente em grafos ou grades. Ele avalia cada nó usando a equação `f(n) = g(n) + h(n)`, onde `g(n)` é o custo real percorrido desde a origem e `h(n)` é a heurística estimada (Manhattan ou Euclidiana) até o destino.',
              keyPoints: [
                'Open Set (Fila de Prioridade / Min-Heap): Nós a serem explorados com menor valor de f.',
                'Closed Set (Hash Set): Nós já visitados e avaliados.',
                'Heurística de Manhattan: Ideal para grades com movimento em 4 direções (`|x1 - x2| + |y1 - y2|`).',
              ],
            },
          ],
          code: `// Estrutura de Nó do A*
public class PathNode
{
    public int x, y;
    public int gCost; // Distância do início
    public int hCost; // Heurística até o final
    public int FCost => gCost + hCost;
    public PathNode parent;
}`,
          output: '[A* Pathfinding]: Rota calculada em grade 100x100. 34 nós percorridos em 0.8ms.',
          lang: 'csharp',
          exercise: {
            id: 'ex-math-med-2',
            prompt: 'Na fórmula do algoritmo A* (f = g + h), o que o valor "h" representa?',
            type: 'multiple_choice',
            options: [
              'A heurística (estimativa da distância do nó atual até o destino final)',
              'A altura do pulo do personagem',
              'O tempo decorrido em horas',
              'A quantidade de vida restante do jogador',
            ],
            correctAnswer: 'A heurística (estimativa da distância do nó atual até o destino final)',
            hint: 'A letra "h" vem de Heuristic.',
            explanation: 'A heurística guia o algoritmo em direção ao alvo, impedindo que ele explore direções opostas sem necessidade.',
          },
        },
      ],
      avancado: [
        {
          title: '5. Estruturas Espaciais: Quadtrees, Octrees & Particionamento Espacial',
          desc: 'Otimize colisões e busca de proximidade dividindo o mundo em árvores espaciais 2D (Quadtree) e 3D (Octree).',
          theory: [
            {
              title: 'Particionamento Espacial (Spatial Partitioning)',
              text: 'Verificar colisão de N objetos contra todos os outros leva tempo quadrático O(N²). Com Quadtrees (2D) ou Octrees (3D), o espaço é dividido recursivamente em 4 ou 8 quadrantes, reduzindo as checagens para O(N log N).',
              keyPoints: [
                'Quadtree: Cada nó possui 4 filhos (Noroeste, Nordeste, Sudoeste, Sudeste).',
                'Octree: Cada nó 3D divide o cubo em 8 sub-cubos.',
                'Frustum Culling Acelerado: Descarta galhos inteiros da árvore que não cruzam com a câmera.',
              ],
            },
          ],
          code: `// Resumo de nó de Quadtree
public class QuadtreeNode
{
    private const int CAPACITY = 8;
    private Rect bounds;
    private List<GameObject> objects = new();
    private QuadtreeNode[] children; // 4 quadrantes

    public void Insert(GameObject obj)
    {
        // Se ultrapassar a capacidade, subdivide em 4 quadrantes
    }
}`,
          output: '[Spatial Tree]: Octree construída com 10.000 entidades. Testes de colisão reduzidos em 98.4%.',
          lang: 'csharp',
          exercise: {
            id: 'ex-math-adv-1',
            prompt: 'Por que o uso de Quadtrees ou Octrees é indispensável em jogos com milhares de entidades simultâneas?',
            type: 'multiple_choice',
            options: [
              'Reduz a complexidade de verificação de colisões e proximidade de O(N²) para O(N log N), testando apenas objetos no mesmo setor espacial',
              'Aumenta a qualidade das texturas',
              'Permite gravar partidas em vídeo',
              'Desliga os cálculos de física',
            ],
            correctAnswer: 'Reduz a complexidade de verificação de colisões e proximidade de O(N²) para O(N log N), testando apenas objetos no mesmo setor espacial',
            hint: 'Evita comparar cada objeto com todos os outros do mapa inteiro.',
            explanation: 'O particionamento espacial agrupa objetos vizinhos, permitindo ignorar instantaneamente qualquer entidade que esteja em outros quadrantes distantes.',
          },
        },
      ],
      projetos: [
        {
          title: '6. Projeto: Motor de Física 2D Simples do Zero (AABB, Círculos & Impulso)',
          desc: 'Construa uma engine de física 2D do zero em C# com detecção de colisão AABB-AABB, Círculo-Círculo e resolução de impulso.',
          theory: [
            {
              title: 'Matemática da Resolução de Colisão por Impulso',
              text: 'Quando dois corpos colidem com massas m1 e m2 e coeficiente de restituição e (elasticidade), calculamos o impulso escalar J ao longo da normal de contato para ajustar instantaneamente as velocidades lineares.',
              keyPoints: [
                'AABB (Axis-Aligned Bounding Box): `overlapX = min(a.maxX, b.maxX) - max(a.minX, b.minX) > 0`.',
                'Resolução Posicional: Afasta os corpos pela profundidade de penetração (Penetration Depth) para evitar afundamentos.',
              ],
            },
          ],
          code: `// Resolução de Impulso Físico entre 2 corpos
public void ResolveCollision(RigidBody2D a, RigidBody2D b, Vector2 normal, float restitution)
{
    Vector2 relativeVelocity = b.velocity - a.velocity;
    float velocityAlongNormal = Vector2.Dot(relativeVelocity, normal);

    if (velocityAlongNormal > 0) return; // Corpos já estão se afastando

    float invMassA = a.isStatic ? 0f : 1f / a.mass;
    float invMassB = b.isStatic ? 0f : 1f / b.mass;

    float impulseScalar = -(1f + restitution) * velocityAlongNormal / (invMassA + invMassB);
    Vector2 impulse = impulseScalar * normal;

    a.velocity -= invMassA * impulse;
    b.velocity += invMassB * impulse;
}`,
          output: '[Physics Core]: Colisão elástica resolvida com sucesso. Impulso J = 14.2 N*s aplicado.',
          lang: 'csharp',
          exercise: {
            id: 'ex-math-proj-1',
            prompt: 'Em um motor de física, o que a verificação AABB (Axis-Aligned Bounding Box) faz?',
            type: 'multiple_choice',
            options: [
              'Testa sobreposição entre retângulos cujos lados são perfeitamente paralelos aos eixos coordenados X e Y',
              'Calcula o peso de objetos em água',
              'Gera partículas de fumaça',
              'Desenha sombras na tela',
            ],
            correctAnswer: 'Testa sobreposição entre retângulos cujos lados são perfeitamente paralelos aos eixos coordenados X e Y',
            hint: 'AABB é o teste de colisão retangular mais rápido existente na computação.',
            explanation: 'AABB compara os mínimos e máximos dos eixos X e Y com simples comparações numéricas (`<` e `>`), oferecendo verificação instantânea.',
          },
        },
      ],
    },
    quizzesByLevel: {
      iniciante: [
        {
          id: 'q-fund-ini-1',
          question: 'Qual é o resultado de normalizar um vetor no espaço tridimensional?',
          options: [
            'Um vetor com a mesma direção, mas com magnitude (comprimento) exatamente igual a 1.0',
            'Um vetor de valor zero',
            'Um número inteiro',
            'Uma rotação de 180 graus',
          ],
          correctIndex: 0,
          explanation: 'A normalização transforma qualquer vetor não-nulo em um vetor unitário de magnitude 1.',
        },
      ],
      intermediario: [
        {
          id: 'q-fund-med-1',
          question: 'Em que tipo de busca o algoritmo A* se destaca?',
          options: [
            'Encontrar o caminho mais curto e eficiente entre dois pontos em uma grade ou grafo ponderado',
            'Pesquisar palavras em um dicionário',
            'Ordenar uma lista de números',
            'Compactar arquivos de imagem',
          ],
          correctIndex: 0,
          explanation: 'O A* é o padrão mundial para navegação de NPCs e pathfinding em jogos eletrônicos.',
        },
      ],
      avancado: [
        {
          id: 'q-fund-adv-1',
          question: 'Qual é a diferença entre uma Quadtree e uma Octree?',
          options: [
            'A Quadtree divide o espaço 2D em 4 quadrantes; a Octree divide o espaço 3D em 8 sub-cubos',
            'A Quadtree é para áudio e a Octree para vídeo',
            'Não há diferença de dimensões',
            'Octree funciona apenas em computadores de 8 bits',
          ],
          correctIndex: 0,
          explanation: 'Quadtrees são estruturas de particionamento bidimensionais e Octrees são tridimensionais.',
        },
      ],
      projetos: [
        {
          id: 'q-fund-proj-1',
          question: 'Como a resolução posicional evita que corpos rígidos afundem uns nos outros após uma colisão?',
          options: [
            'Empurrando os corpos para fora na direção da normal de contato pela distância exata da penetração',
            'Apagando um dos corpos',
            'Aumentando a gravidade para o infinito',
            'Desligando a colisão',
          ],
          correctIndex: 0,
          explanation: 'A correção de penetração física separa geometrias sobrepostas antes do próximo cálculo de velocidade.',
        },
      ],
    },
  },

  // =========================================================================
  // ESPECIALIZAÇÃO: GAME AI, SHADERS & OTIMIZAÇÃO
  // =========================================================================
  game_graphics_ai: {
    topicsByLevel: {
      iniciante: [
        {
          title: '1. O Pipeline Gráfico: Vertex Shader, Rasterização & Fragment/Pixel Shader',
          desc: 'Compreenda como modelos 3D se transformam em pixels iluminados na tela através do pipeline programável da GPU.',
          theory: [
            {
              title: 'A Jornada do Vértice ao Pixel',
              text: 'O pipeline gráfico recebe vértices tridimensionais (Vertex Shader), projeta no espaço de recorte da tela (MVP Matrix: Model-View-Projection), recorta triângulos fora da visão (Clipping), rasteriza em fragmentos de pixels e calcula cores/luzes no Fragment/Pixel Shader.',
              keyPoints: [
                'Vertex Shader: Modifica posições de vértices, coordenadas UV e normais.',
                'Rasterizador: Converte triângulos geométricos em pixels discretos na tela.',
                'Fragment/Pixel Shader: Executa cálculos de textura, iluminação, reflexos e sombras para cada pixel.',
              ],
            },
          ],
          code: `// Shader simples HLSL de cor com iluminação difusa
struct VertexInput {
    float4 position : POSITION;
    float3 normal : NORMAL;
};

struct VertexOutput {
    float4 clipPos : SV_POSITION;
    float3 worldNormal : TEXCOORD0;
};

// Fragment Shader
float4 FragMain(VertexOutput input) : SV_Target {
    float3 lightDir = normalize(float3(0.5, 1.0, -0.5));
    float diff = max(0.0, dot(input.worldNormal, lightDir));
    return float4(diff * float3(0.2, 0.6, 1.0), 1.0);
}`,
          output: '[HLSL Compiler]: Vertex e Fragment Shaders compilados com sucesso. 12 instruções GPU.',
          lang: 'csharp',
          exercise: {
            id: 'ex-gfx-ini-1',
            prompt: 'Em que estágio do pipeline gráfico da GPU são calculadas as cores, reflexos e sombras finais de cada pixel na tela?',
            type: 'multiple_choice',
            options: ['Fragment / Pixel Shader', 'Vertex Shader', 'Input Assembler', 'Tessellation'],
            correctAnswer: 'Fragment / Pixel Shader',
            hint: 'O estágio que atua sobre fragmentos de pixels antes do teste de profundidade.',
            explanation: 'O Fragment Shader processa a cor e iluminação de cada pixel resultante da rasterização.',
          },
        },
      ],
      intermediario: [
        {
          title: '2. Arquiteturas Avançadas de IA: Behavior Trees, GOAP & Utility AI',
          desc: 'Vá além de FSMs: aprenda Goal-Oriented Action Planning (GOAP) e Utility AI baseada em curvas de desejo.',
          theory: [
            {
              title: 'GOAP e Utility AI para IAs Emergentes',
              text: 'Enquanto FSMs e Behavior Trees seguem caminhos pré-definidos, o GOAP (Goal-Oriented Action Planning) formula planos em tempo real usando busca A* em estados do mundo. A Utility AI pontua ações concorrentes usando curvas matemáticas (Response Curves), permitindo que o NPC decida organicamente entre comer, lutar ou fugir.',
              keyPoints: [
                'GOAP: Ações possuem pré-condições e efeitos (ex: Ação "Atirar" exige "Arma Carregada").',
                'Utility Curves: Avalia fome, vida e perigo para escolher a ação com maior pontuação de utilidade.',
              ],
            },
          ],
          code: `// Conceito de Utility AI em C#
public class UtilityDecisionMaker
{
    public Action ChooseBestAction(float healthPercent, float distanceToEnemy, int ammo)
    {
        float scoreAttack = (ammo > 0 ? 0.8f : 0f) * (distanceToEnemy < 15f ? 1f : 0.4f);
        float scoreHeal = (1f - healthPercent) * 1.2f; // Prioriza cura se vida estiver baixa
        float scoreFlee = (1f - healthPercent) * (distanceToEnemy < 5f ? 1.5f : 0.2f);

        if (scoreHeal > scoreAttack && scoreHeal > scoreFlee) return Action.Heal;
        if (scoreFlee > scoreAttack) return Action.Flee;
        return Action.Attack;
    }
}`,
          output: '[Utility AI]: Pontuações calculadas: [Ataque: 0.32, Cura: 0.96, Fuga: 0.44] -> Ação: HEAL selecionada.',
          lang: 'csharp',
          exercise: {
            id: 'ex-gfx-med-1',
            prompt: 'O que diferencia a "Utility AI" das máquinas de estados rígidas convencionais?',
            type: 'multiple_choice',
            options: [
              'A Utility AI avalia o contexto através de curvas matemáticas e pontuações de utilidade, permitindo comportamentos dinâmicos e emergentes',
              'Ela desativa a inteligência dos inimigos',
              'Funciona apenas com conexão de internet',
              'Ocupa 100% da placa de vídeo',
            ],
            correctAnswer: 'A Utility AI avalia o contexto através de curvas matemáticas e pontuações de utilidade, permitindo comportamentos dinâmicos e emergentes',
            hint: 'Permite que o NPC tome decisões graduais em vez de regras rígidas de "se/então".',
            explanation: 'Com Utility AI, os agentes pesam múltiplos fatores e escolhem a ação com maior retorno para a situação momentânea.',
          },
        },
      ],
      avancado: [
        {
          title: '3. Otimização Extrema de Performance: Draw Calls, Frame Pacing & Memory Leaks',
          desc: 'Elimine micro-congelamentos de quadros (Jank), gerencie orçamentos de Draw Calls e memória de VRAM.',
          theory: [
            {
              title: 'Frame Pacing e Orçamento de Renderização',
              text: 'Para manter 60 FPS consistentes, cada quadro tem exatamente 16.6ms de orçamento total de tempo. Para 144 FPS, o orçamento cai para 6.9ms. Variações bruscas no tempo de quadro (Frame Pacing irregular) geram sensação de travamento mesmo que a média de FPS pareça alta.',
              keyPoints: [
                'Draw Call Budget: Mantenha abaixo de 1.000 para PC intermediário e abaixo de 150 para mobile.',
                'Overdraw: Evite empilhar múltiplos planos transparentes sem teste de profundidade.',
                'Garbage Collector Spikes: Elimine `new` dentro de funções Update e FixedUpdate.',
              ],
            },
          ],
          code: `// Resumo de auditoria de Frame Pacing
// Orçamento de 60 FPS: 16.66ms
// - Game Logic (Scripts): 3.5ms
// - Physics Step: 2.0ms
// - Render / Culling: 2.5ms
// - GPU BasePass & Lights: 6.0ms
// - Post-Processing: 1.5ms
// Total: 15.5ms (Margem de segurança mantida!)`,
          output: '[Frame Pacing]: 60.0 FPS travado. 0 spikes detectados nos últimos 3.600 frames.',
          lang: 'csharp',
          exercise: {
            id: 'ex-gfx-adv-1',
            prompt: 'Qual é o tempo máximo disponível em milissegundos por quadro para que um jogo rode a 60 FPS perfeitamente fluidos?',
            type: 'multiple_choice',
            options: ['16.6 milissegundos (1000ms / 60)', '33.3 milissegundos', '100 milissegundos', '1 milissegundo'],
            correctAnswer: '16.6 milissegundos (1000ms / 60)',
            hint: 'Divida 1 segundo (1000 milissegundos) pela quantidade de quadros desejados.',
            explanation: '1000ms / 60 frames = 16.66ms por frame. Se o processamento de CPU e GPU somados ultrapassarem esse valor, ocorrerá uma queda de FPS.',
          },
        },
      ],
      projetos: [
        {
          title: '4. Projeto: Renderizador de Terreno Volumétrico & Shader de Água PBR com Refração',
          desc: 'Desenvolva um shader de água com ondas de Gerstner, profundidade por Depth Buffer e reflexos de Fresnel.',
          theory: [
            {
              title: 'Física da Água em Shaders (Gerstner Waves & Fresnel)',
              text: 'Ondas realistas combinam múltiplas ondas de Gerstner deslocando os vértices em X, Y e Z. O cálculo de Fresnel reflete mais o céu quando visto de ângulo raso e revela o fundo da água quando visto de cima.',
              keyPoints: [
                'Gerstner Waves: Desloca vértices em cristas afiadas e vales largos.',
                'Depth Fade: Mede a diferença entre a profundidade da água e o fundo do oceano para clarear as margens.',
              ],
            },
          ],
          code: `// Exemplo de Equação de Fresnel em HLSL
float ComputeFresnel(float3 normal, float3 viewDir, float power)
{
    return pow(1.0 - saturate(dot(normal, viewDir)), power);
}`,
          output: '[Water Shader]: Água com 4 ondas de Gerstner, Refração com Depth Buffer e espuma nas margens ativa.',
          lang: 'csharp',
          exercise: {
            id: 'ex-gfx-proj-1',
            prompt: 'O que o efeito de Fresnel faz na simulação visual de água em jogos 3D?',
            type: 'multiple_choice',
            options: [
              'Faz a água parecer transparente quando olhada de cima para baixo, e altamente reflexiva e espelhada quando olhada de um ângulo raso no horizonte',
              'Aumenta a velocidade do barco',
              'Faz os peixes nadarem mais rápido',
              'Apaga o sol',
            ],
            correctAnswer: 'Faz a água parecer transparente quando olhada de cima para baixo, e altamente reflexiva e espelhada quando olhada de um ângulo raso no horizonte',
            hint: 'Fenômeno físico real da reflexão da luz em superfícies dielétricas.',
            explanation: 'O efeito de Fresnel ajusta o percentual de reflexão baseado no ângulo de incidência do olhar em relação à normal da superfície.',
          },
        },
      ],
    },
    quizzesByLevel: {
      iniciante: [
        {
          id: 'q-spec-ini-1',
          question: 'Qual é a principal responsabilidade do Vertex Shader no hardware gráfico?',
          options: [
            'Transformar e projetar as coordenadas dos vértices 3D do modelo para o espaço de recorte da tela',
            'Tocar músicas do jogo',
            'Salvar arquivos no disco',
            'Traduzir o jogo para outros idiomas',
          ],
          correctIndex: 0,
          explanation: 'O Vertex Shader manipula e posiciona cada vértice tridimensional da geometria na tela.',
        },
      ],
      intermediario: [
        {
          id: 'q-spec-med-1',
          question: 'Em que consiste o Goal-Oriented Action Planning (GOAP) em jogos?',
          options: [
            'Um sistema onde o NPC formula dinamicamente um plano de passos encadeados para atingir um objetivo específico',
            'Um tipo de controle de videogame',
            'Uma linguagem de script antiga',
            'Um modelo 3D de arma',
          ],
          correctIndex: 0,
          explanation: 'O GOAP resolve ações conectando pré-condições e efeitos para alcançar um estado desejado de forma autônoma.',
        },
      ],
      avancado: [
        {
          id: 'q-spec-adv-1',
          question: 'Para manter uma taxa de 60 FPS sem engasgos, qual é o limite de tempo por frame?',
          options: ['16.6 milissegundos', '50.0 milissegundos', '100.0 milissegundos', '1.0 segundo'],
          correctIndex: 0,
          explanation: 'Cada quadro precisa completar todos os cálculos e renderização dentro da janela de 16.6ms.',
        },
      ],
      projetos: [
        {
          id: 'q-spec-proj-1',
          question: 'Por que ondas de Gerstner produzem um visual aquático mais realista que funções de seno simples?',
          options: [
            'Porque deslocam vértices horizontal e verticalmente, gerando cristas empinadas e vales largos realistas',
            'Porque são invisíveis',
            'Porque usam menos memória que um número',
            'Porque congelam a água no inverno',
          ],
          correctIndex: 0,
          explanation: 'A matemática de Gerstner replica a dinâmica do movimento circular da água na natureza.',
        },
      ],
    },
  },

  // =========================================================================
  // BLENDER 3D PARA GAME DEV (Modelagem, UVs, Rigging, Animação & Exportação)
  // =========================================================================
  blender_3d: {
    topicsByLevel: {
      iniciante: [
        {
          title: '1. Fundamentos do Blender 3D: Navegação, Modificadores & Modelagem Low-Poly',
          desc: 'Domine atalhos essenciais (G, R, S, E, I, Ctrl+R), topologia limpa com Quads e modificadores Mirror e Bevel.',
          theory: [
            {
              title: 'Modelagem 3D voltada para Games',
              text: 'Em jogos, modelos 3D devem ter topologia limpa formada prioritariamente por polígonos de 4 lados (Quads) para deformação suave em animações. Atalhos como Extrude (E), Inset (I) e Loop Cut (Ctrl+R) aceleram a criação de armas, veículos e cenários.',
              keyPoints: [
                'Apply Transforms (Ctrl+A): Sempre aplique Escala e Rotação para evitar distorções de física na engine.',
                'Modificador Mirror: Modela personagens simétricos com metade do esforço.',
                'Origem do Objeto (Set Origin): Define o ponto pivô de rotação e encaixe na mão do personagem.',
              ],
            },
          ],
          code: `// Resumo de atalhos fundamentais no Blender
// Tab: Alterna Modo Objeto / Modo Edição
// E: Extrude (Extrusão de faces e arestas)
// I: Inset (Inserção de face interna)
// Ctrl + R: Loop Cut (Corte de malha contínuo)
// Ctrl + A -> Apply All Transforms: Reseta Escala para [1, 1, 1]`,
          output: '[Blender 3D]: Modelo "SciFi_Crate" modelado com 240 triângulos. Escala [1,1,1] aplicada.',
          lang: 'csharp',
          exercise: {
            id: 'ex-blend-ini-1',
            prompt: 'No Blender, por que é fundamental aplicar as transformações (Ctrl+A -> Apply Scale) antes de exportar um modelo para a Unity, Unreal ou Godot?',
            type: 'multiple_choice',
            options: [
              'Para que a escala da malha seja padronizada em (1, 1, 1), evitando problemas de física deformada e animações esticadas na game engine',
              'Para alterar a cor do modelo',
              'Para apagar os vértices',
              'Para desligar o teclado',
            ],
            correctAnswer: 'Para que a escala da malha seja padronizada em (1, 1, 1), evitando problemas de física deformada e animações esticadas na game engine',
            hint: 'Se a escala for diferente de 1, a engine multiplicará a física e colisores de forma errada.',
            explanation: 'Aplicar a escala grava as dimensões reais na malha, garantindo que o modelo mantenha proporções perfeitas na engine.',
          },
        },
      ],
      intermediario: [
        {
          title: '2. UV Unwrapping & Texturização PBR no Blender',
          desc: 'Marque costuras (Mark Seam), abra mapas UV sem distorções e pinte texturas PBR no Texture Paint / Shader Editor.',
          theory: [
            {
              title: 'Mapeamento UV e Densidade Texel',
              text: 'O UV Unwrapping é o processo de "descascar" um modelo 3D em um plano 2D como uma folha de papel. Costuras (Seams) devem ser escondidas em áreas pouco visíveis (parte interna das pernas, axilas) para não exibir emendas no jogo.',
              keyPoints: [
                'Texel Density: Manter a resolução de pixels por metro constante em todos os objetos para que uma textura não pareça borrada ao lado de outra nítida.',
                'UV Packing: Agrupa todas as ilhas de UV otimizando o espaço da imagem de textura (0 a 1).',
              ],
            },
          ],
          code: `// Resumo de Shader Nodes no Blender
// Image Texture (Albedo) -> Principled BSDF (Base Color)
// Image Texture (Roughness - Non-Color) -> Principled BSDF (Roughness)
// Image Texture (Normal Map - Non-Color) -> Normal Map Node -> Principled BSDF (Normal)`,
          output: '[UV Editor]: Mapa UV aberto com 88% de aproveitamento de área. Texel Density: 512 px/m.',
          lang: 'csharp',
          exercise: {
            id: 'ex-blend-med-1',
            prompt: 'No Shader Editor do Blender, qual espaço de cor (Color Space) deve ser selecionado para mapas de Normal, Rugosidade (Roughness) e Metálico?',
            type: 'multiple_choice',
            options: ['Non-Color', 'sRGB', 'Filmic Log', 'Adobe RGB'],
            correctAnswer: 'Non-Color',
            hint: 'Mapas que contêm dados matemáticos de relevo e reflexo não devem sofrer correção gama de cores sRGB.',
            explanation: 'Non-Color informa ao renderizador que os bytes da textura representam valores numéricos diretos (vetores e percentuais), e não cores visuais para os olhos humanos.',
          },
        },
      ],
      avancado: [
        {
          title: '3. Rigging com Armatures, Weight Painting & Animações para Jogos',
          desc: 'Crie esqueletos com ossos (Bones), pinte pesos de vértices (Weight Paint) e anime ciclos de Idle, Walk, Run e Attack.',
          theory: [
            {
              title: 'Esqueletos e Animação no Blender',
              text: 'Um Armature é composto por ossos conectados. O Weight Paint define com qual intensidade cada osso influencia os vértices da malha (Vermelho = 100% de influência, Azul = 0%). O NLA Editor (Non-Linear Animation) organiza os clipes de animação em Actions exportáveis.',
              keyPoints: [
                'IK (Inverse Kinematics): Permite controlar o pé e fazer toda a perna e joelho dobrarem naturalmente.',
                'Loop de Corrida (Run Cycle): O primeiro e o último quadro devem ser perfeitamente idênticos para looping contínuo.',
              ],
            },
          ],
          code: `// Estrutura de Actions de Animação para exportação
// - Hero_Action_Idle (Quadros 1 a 60 - 60 FPS)
// - Hero_Action_Walk (Quadros 1 a 30)
// - Hero_Action_Run (Quadros 1 a 20)
// - Hero_Action_Attack (Quadros 1 a 25)`,
          output: '[Blender Rig]: Esqueleto com 34 ossos configurado. 4 Actions de animação criadas no NLA Editor.',
          lang: 'csharp',
          exercise: {
            id: 'ex-blend-adv-1',
            prompt: 'O que o modo "Weight Paint" do Blender faz no processo de Rigging de personagens 3D?',
            type: 'multiple_choice',
            options: [
              'Pinta gradientes de cores na malha para definir o percentual de influência que cada osso do esqueleto exerce sobre os vértices ao se mover',
              'Pesa o personagem em quilogramas',
              'Altera a cor da roupa do personagem',
              'Apaga o esqueleto',
            ],
            correctAnswer: 'Pinta gradientes de cores na malha para definir o percentual de influência que cada osso do esqueleto exerce sobre os vértices ao se mover',
            hint: 'Cores quentes (vermelho) indicam controle total; cores frias (azul) indicam zero movimento.',
            explanation: 'Weight Painting ajusta a deformação da pele do modelo para que braços e pernas dobrem de forma orgânica sem esticar partes vizinhas indevidamente.',
          },
        },
      ],
      projetos: [
        {
          title: '4. Pipeline de Exportação FBX / glTF para Unity, Unreal & Godot',
          desc: 'Configure o exportador do Blender para entrega perfeita: animações em Actions, eixos compatíveis e materiais embutidos.',
          theory: [
            {
              title: 'Exportação Profissional para Engines',
              text: 'Ao exportar FBX: selecione apenas objetos selecionados (Selected Objects), marque `Apply Transform`, inclua Armature + Mesh e exporte as Actions de animação no NLA Strip. Para Godot e WebGL, o formato glTF 2.0 (.glb) é o padrão mais leve e fiel.',
              keyPoints: [
                'glTF / GLB: Padrão aberto focado em transmissão rápida e PBR nativo.',
                'FBX: Padrão da indústria compatível com Unity e Unreal.',
              ],
            },
          ],
          code: `// Resumo de opções de exportação FBX
// File -> Export -> FBX
// - Limit to: Selected Objects [Mesh, Armature]
// - Apply Scalings: FBX All
// - Forward: -Z Forward / Up: Y Up
// - Armature: Only Deform Bones = True
// - Bake Animation: All Actions = True`,
          output: '[Blender Export]: "Hero_Rigged.fbx" exportado com 4 animações prontas para Unity/Unreal.',
          lang: 'csharp',
          exercise: {
            id: 'ex-blend-proj-1',
            prompt: 'Qual é o formato de arquivo 3D aberto e moderno altamente recomendado para o motor Godot Engine e aplicações Web 3D?',
            type: 'multiple_choice',
            options: ['glTF / GLB', 'TXT', 'DOCX', 'BMP'],
            correctAnswer: 'glTF / GLB',
            hint: 'Conhecido como o "JPEG do 3D".',
            explanation: 'O glTF 2.0 armazena geometria, materiais PBR e animações em um padrão aberto ultraleve e compatível nativamente com o Godot e WebGL.',
          },
        },
      ],
    },
    quizzesByLevel: {
      iniciante: [
        {
          id: 'q-blend-ini-1',
          question: 'No Blender, qual atalho realiza a Extrusão (Extrude) de uma face selecionada?',
          options: ['Tecla E', 'Tecla G', 'Tecla R', 'Tecla S'],
          correctIndex: 0,
          explanation: 'A tecla E executa a extrusão puxando novas geometrias a partir de faces ou arestas.',
        },
      ],
      intermediario: [
        {
          id: 'q-blend-med-1',
          question: 'O que o processo de UV Unwrapping faz em um modelo tridimensional?',
          options: [
            'Projeta e desdobra as faces 3D do modelo em uma superfície plana 2D para permitir a pintura de texturas',
            'Desliga a iluminação da cena',
            'Apaga todos os materiais',
            'Aumenta o volume do som',
          ],
          correctIndex: 0,
          explanation: 'O mapa UV mapeia cada ponto 3D na malha para coordenadas (U, V) em uma imagem 2D.',
        },
      ],
      avancado: [
        {
          id: 'q-blend-adv-1',
          question: 'Qual recurso do Blender permite animar clipes independentes como Andar, Correr e Atacar para exportação em jogos?',
          options: ['NLA Editor e Actions', 'Calculadora de física', 'Painel de áudio', 'Renderizador de vídeo AVI'],
          correctIndex: 0,
          explanation: 'Actions guardam trilhas de animações individuais que as engines de jogos reconhecem como Animation Clips.',
        },
      ],
      projetos: [
        {
          id: 'q-blend-proj-1',
          question: 'Qual formato de exportação é amplamente conhecido como o padrão aberto e leve para modelos 3D na Web e no Godot?',
          options: ['glTF / GLB', 'AVI', 'MP3', 'PSD'],
          correctIndex: 0,
          explanation: 'glTF é o formato de transmissão 3D padrão do consórcio Khronos Group.',
        },
      ],
    },
  },
};
