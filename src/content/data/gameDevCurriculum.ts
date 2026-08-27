import { TechCurriculumData } from '../techCurriculum';

export const GAME_DEV_CURRICULUM: Record<string, TechCurriculumData> = {
  // =========================================================================
  // C# → UNITY → JOGOS 2D (Pong, Flappy Bird, Platformer, Top-Down, RPG 2D)
  // =========================================================================
  csharp_unity_2d: {
    topicsByLevel: {
      iniciante: [
        {
          title: '1. C# & Ciclo de Vida do Unity (MonoBehaviour & Input)',
          desc: 'Domine os métodos de ciclo de vida (Awake, Start, Update, FixedUpdate) e o novo Input System.',
          theory: [
            {
              title: 'Arquitetura do MonoBehaviour no Unity',
              text: 'Scripts em Unity herdam de MonoBehaviour, integrando-se ao loop da engine. Awake executa na instanciação, Start antes do primeiro frame, Update a cada quadro renderizado (variável) e FixedUpdate em passos de física regulares (padrão 50Hz / 0.02s).',
              keyPoints: [
                'Time.deltaTime: Multiplicador essencial no Update para garantir que a movimentação independa da taxa de FPS.',
                'FixedUpdate: Todo cálculo de Rigidbody2D e física DEVE ser executado aqui para estabilidade de colisão.',
                'SerializeField: Expõe variáveis privadas no Inspector do Unity sem quebrar o encapsulamento em C#.',
              ],
              conceptCard: '🎮 Regra de Ouro da Física 2D: Nunca mova um Rigidbody2D alterando transform.position diretamente no Update; utilize velocity ou AddForce no FixedUpdate.',
            },
          ],
          code: `using UnityEngine;
using UnityEngine.InputSystem;

public class PlayerController2D : MonoBehaviour
{
    [Header("Configurações de Movimento")]
    [SerializeField] private float moveSpeed = 8f;
    [SerializeField] private Rigidbody2D rb;

    private Vector2 moveInput;

    private void Awake()
    {
        if (rb == null) rb = GetComponent<Rigidbody2D>();
    }

    public void OnMove(InputValue value)
    {
        moveInput = value.Get<Vector2>();
    }

    private void FixedUpdate()
    {
        // Movimentação física estável multiplicando pela velocidade
        rb.velocity = new Vector2(moveInput.x * moveSpeed, rb.velocity.y);
    }
}`,
          output: '[Unity Console]: PlayerController2D inicializado com sucesso. Rigidbody2D vinculado (Modo Dynamic, GravityScale = 3).',
          lang: 'csharp',
          exercise: {
            id: 'ex-unity2d-ini-1',
            prompt: 'Qual método do MonoBehaviour no Unity deve ser utilizado para aplicar forças ou alterar velocidades em um Rigidbody2D?',
            type: 'multiple_choice',
            options: ['FixedUpdate()', 'Update()', 'LateUpdate()', 'Awake()'],
            correctAnswer: 'FixedUpdate()',
            hint: 'É o método chamado em intervalos de tempo fixos sincronizados com o motor de física.',
            explanation: 'FixedUpdate() roda em intervalos fixos (Time.fixedDeltaTime), garantindo que simulações de física ocorram sem discrepâncias causadas por quedas de FPS.',
          },
        },
        {
          title: '2. Colisões 2D, Triggers e Física Elástica',
          desc: 'Diferencie OnCollisionEnter2D e OnTriggerEnter2D com Physics Material 2D.',
          theory: [
            {
              title: 'Colisores Sólidos vs Triggers Interativos',
              text: 'Um Collider 2D com IsTrigger = false impede a passagem física de objetos e dispara OnCollisionEnter2D. Quando IsTrigger = true, ele atua como uma zona de detecção invisível (moedas, checkpoints, lava), disparando OnTriggerEnter2D.',
              keyPoints: [
                'Pelo menos um dos objetos em colisão DEVE possuir um componente Rigidbody2D.',
                'Physics Material 2D: Define atrito (Friction = 0) e elasticidade (Bounciness = 1.0) para mecânicas de rebote.',
                'LayerMask e Collision Matrix: Permite desabilitar colisões desnecessárias entre camadas (ex: tiros do player não colidem com o próprio player).',
              ],
            },
          ],
          code: `using UnityEngine;

public class CoinTrigger : MonoBehaviour
{
    [SerializeField] private int coinValue = 10;
    [SerializeField] private AudioClip collectSfx;

    private void OnTriggerEnter2D(Collider2D other)
    {
        if (other.CompareTag("Player"))
        {
            GameManager.Instance.AddScore(coinValue);
            AudioSource.PlayClipAtPoint(collectSfx, transform.position);
            Destroy(gameObject);
        }
    }
}`,
          output: '[Physics2D]: Trigger detectado com tag "Player". Moeda coletada (+10 Pontos).',
          lang: 'csharp',
          exercise: {
            id: 'ex-unity2d-ini-2',
            prompt: 'Para que um item coletável (como uma moeda) seja atravessado pelo jogador e dispare um evento sem bloquear o movimento, o que deve estar marcado no Collider2D?',
            type: 'multiple_choice',
            options: ['Is Trigger = true', 'Is Kinematic = true', 'Freeze Rotation = true', 'Simulated = false'],
            correctAnswer: 'Is Trigger = true',
            hint: 'A propriedade converte o colisor em uma zona de disparo de eventos.',
            explanation: 'Marcar Is Trigger faz com que o colisor detecte a sobreposição através de OnTriggerEnter2D sem exercer resistência física ou empurrar o personagem.',
          },
        },
        {
          title: '3. Criação do Jogo 1: Pong 2D Completo',
          desc: 'Desenvolva um clone completo de Pong com física de rebote, raquetes do jogador, IA e placar.',
          theory: [
            {
              title: 'Arquitetura do Pong 2D',
              text: 'O Pong utiliza uma bola com PhysicsMaterial2D (Bounciness = 1, Friction = 0), duas raquetes com Rigidbody2D Kinematic e paredes superiores/inferiores sólidas, além de triggers laterais de gol.',
              keyPoints: [
                'Ângulo de Rebote Dinâmico: Calcular a diferença de Y entre o centro da raquete e o impacto da bola para direcionar o ângulo do tiro.',
                'IA da Raquete Inimiga: Interpolação suave (Mathf.MoveTowards / Vector2.Lerp) seguindo o Y da bola com velocidade limitada.',
                'Game Loop: Reset da bola ao centro e incremento do placar via Eventos.',
              ],
            },
          ],
          code: `using UnityEngine;

public class PongBall : MonoBehaviour
{
    [SerializeField] private float initialSpeed = 10f;
    [SerializeField] private Rigidbody2D rb;

    private void Start()
    {
        LaunchBall();
    }

    public void LaunchBall()
    {
        transform.position = Vector2.zero;
        float xDirection = Random.value < 0.5f ? -1f : 1f;
        float yDirection = Random.Range(-0.5f, 0.5f);
        rb.velocity = new Vector2(xDirection, yDirection).normalized * initialSpeed;
    }

    private void OnCollisionEnter2D(Collision2D collision)
    {
        if (collision.gameObject.CompareTag("Paddle"))
        {
            // Calcula o ponto relativo de impacto na raquete para alterar o ângulo
            float paddleY = collision.transform.position.y;
            float contactY = transform.position.y;
            float paddleHeight = collision.collider.bounds.size.y;
            float normalizedDifference = (contactY - paddleY) / (paddleHeight / 2f);

            float xDir = rb.velocity.x > 0 ? 1f : -1f;
            rb.velocity = new Vector2(xDir, normalizedDifference).normalized * (initialSpeed * 1.05f);
        }
    }
}`,
          output: '[Pong Engine]: Partida iniciada. Bola lançada com vetor [8.5, 3.2]. Placar: 0 x 0.',
          lang: 'csharp',
          exercise: {
            id: 'ex-unity2d-ini-3',
            prompt: 'No Pong, por que o Physics Material 2D da bola deve ter Friction = 0 e Bounciness = 1?',
            type: 'multiple_choice',
            options: [
              'Para que a bola nunca perca energia ou velocidade ao rebater nas paredes e raquetes',
              'Para que a bola caia com a força da gravidade',
              'Para que ela pare imediatamente ao colidir',
              'Para alterar a cor da bola dinamicamente',
            ],
            correctAnswer: 'Para que a bola nunca perca energia ou velocidade ao rebater nas paredes e raquetes',
            hint: 'Bounciness = 1 representa uma colisão perfeitamente elástica.',
            explanation: 'Bounciness = 1 garante 100% de conservação de energia cinética no rebote e Friction = 0 evita atrito que diminuiria a velocidade da bola.',
          },
        },
        {
          title: '4. Criação do Jogo 2: Flappy Bird 2D',
          desc: 'Construa mecânicas de Flap com impulso vertical, rotação angular suave e gerador de obstáculos.',
          theory: [
            {
              title: 'Mecânicas Centrais do Flappy Bird',
              text: 'O pássaro é submetido a uma gravidade constante para baixo. Cada toque/clique aplica uma velocidade vertical imediata no eixo Y. Obstáculos (canos) se movem para a esquerda e são reciclados via Object Pooling.',
              keyPoints: [
                'Impulso Imediato: Redefinir rb.velocity = Vector2.up * jumpForce para ignorar qualquer velocidade de queda prévia.',
                'Rotação Dinâmica: Inclinar o sprite para cima ao bater as asas e inclinar para baixo conforme a velocidade Y fica negativa.',
                'Spawner com Altura Randômica: Instanciar prefabs de canos com Random.Range(minY, maxY).',
              ],
            },
          ],
          code: `using UnityEngine;

public class FlappyBirdController : MonoBehaviour
{
    [SerializeField] private float flapStrength = 7f;
    [SerializeField] private Rigidbody2D rb;
    [SerializeField] private float tiltAngle = 30f;

    private void Update()
    {
        if (Input.GetMouseButtonDown(0) || Input.GetKeyDown(KeyCode.Space))
        {
            Flap();
        }

        // Rotação suave baseada na velocidade vertical
        float targetAngle = Mathf.Clamp(rb.velocity.y * 5f, -90f, tiltAngle);
        transform.rotation = Quaternion.Euler(0, 0, targetAngle);
    }

    private void Flap()
    {
        rb.velocity = Vector2.up * flapStrength;
    }

    private void OnCollisionEnter2D(Collision2D collision)
    {
        GameManager.Instance.GameOver();
    }
}`,
          output: '[Flappy Engine]: Flap executado! Vetor Y = 7.0. Rotação ajustada para 30º.',
          lang: 'csharp',
          exercise: {
            id: 'ex-unity2d-ini-4',
            prompt: 'No Flappy Bird, por que redefinir "rb.velocity = Vector2.up * flapStrength" é melhor do que "rb.AddForce(Vector2.up * flapStrength)"?',
            type: 'multiple_choice',
            options: [
              'Porque garante uma resposta instantânea e altura de pulo consistente, mesmo se o pássaro estiver caindo rápido',
              'Porque AddForce não funciona em 2D',
              'Porque economiza memória RAM no celular',
              'Porque o Rigidbody2D não aceita forças verticais',
            ],
            correctAnswer: 'Porque garante uma resposta instantânea e altura de pulo consistente, mesmo se o pássaro estiver caindo rápido',
            hint: 'Atribuir a velocidade anula o vetor de queda acumulado, dando o efeito clássico de toque rápido.',
            explanation: 'Ao resetar a velocidade diretamente, o impulso para cima sempre atinge a mesma magnitude, proporcionando o controle clássico e preciso do Flappy Bird.',
          },
        },
        {
          title: '5. Animações 2D & Animator Controller com Sprite Sheets',
          desc: 'Configure estados de animação (Idle, Run, Jump, Fall) com Blend Trees e parâmetros booleanos/floats.',
          theory: [
            {
              title: 'Pipeline de Animação 2D no Unity',
              text: 'O Sprite Editor permite fatiar (Slice) sprite sheets em quadros individuais. O Animator Controller gerencia a máquina de estados (FSM) de animação com transições acionadas por parâmetros de velocidade (Speed float, isGrounded bool, isAttacking trigger).',
              keyPoints: [
                'Has Exit Time: Deve ser DESMARCADO para transições instantâneas (ex: começar a correr ou pular no exato momento do input).',
                'Transition Duration: Em jogos 2D com pixel art, deve ser ajustado para 0 para evitar blending borrado de sprites.',
                'Sprite Renderer FlipX vs transform.localScale.x = -1: Inverter a escala inverte também os colliders filhos e pontos de disparo de armas.',
              ],
            },
          ],
          code: `using UnityEngine;

public class PlayerAnimation2D : MonoBehaviour
{
    [SerializeField] private Animator animator;
    [SerializeField] private Rigidbody2D rb;
    [SerializeField] private SpriteRenderer spriteRenderer;

    private static readonly int SpeedHash = Animator.StringToHash("Speed");
    private static readonly int IsGroundedHash = Animator.StringToHash("IsGrounded");

    public void UpdateAnimation(bool isGrounded)
    {
        float horizontalSpeed = Mathf.Abs(rb.velocity.x);
        animator.SetFloat(SpeedHash, horizontalSpeed);
        animator.SetBool(IsGroundedHash, isGrounded);

        // Vira o sprite na direção do movimento
        if (rb.velocity.x > 0.1f) spriteRenderer.flipX = false;
        else if (rb.velocity.x < -0.1f) spriteRenderer.flipX = true;
    }
}`,
          output: '[Animator]: Estado transicionado: Idle -> Run. Speed = 6.4, IsGrounded = true.',
          lang: 'csharp',
          exercise: {
            id: 'ex-unity2d-ini-5',
            prompt: 'Em jogos 2D com Pixel Art no Unity, por que a "Transition Duration" entre estados de animação no Animator costuma ser definida como 0?',
            type: 'multiple_choice',
            options: [
              'Para que a troca de animação ocorra de forma nítida e instantânea sem interpolar/mesclar sprites',
              'Para economizar espaço no disco',
              'Porque o Unity não permite transições maiores que zero em 2D',
              'Para acelerar a taxa de quadros (FPS) da física',
            ],
            correctAnswer: 'Para que a troca de animação ocorra de forma nítida e instantânea sem interpolar/mesclar sprites',
            hint: 'Sprites 2D são imagens estáticas por quadro e não possuem ossos 3D para interpolação suave.',
            explanation: 'Duração 0 evita que o Unity tente realizar cross-fade entre duas texturas de pixel art, mantendo a animação quadro a quadro tradicional.',
          },
        },
      ],
      intermediario: [
        {
          title: '6. Criação do Jogo 3: Platformer 2D (Pulo Duplo, Coyote Time & Raycast)',
          desc: 'Implemente movimentação com física sólida, verificação de solo com Raycast/Overlaps, Jump Buffering e Coyote Time.',
          theory: [
            {
              title: 'Técnicas de Game Feel para Plataforma',
              text: 'Bons jogos de plataforma utilizam truques perceptivos: Coyote Time (permitir pular frações de segundo após sair da borda de uma plataforma) e Jump Buffering (registrar o botão de pulo pressionado pouco antes de encostar no chão).',
              keyPoints: [
                'Ground Check com Physics2D.OverlapCircle: Mais robusto do que OnCollisionStay2D para evitar falsos negativos em quinas.',
                'Coyote Time (0.15s): Temporizador que diminui no ar, permitindo pulos justos.',
                'Gravidade Variável: Aumentar a gravidade quando o jogador solta o botão de pulo para pulos curtos controláveis.',
              ],
            },
          ],
          code: `using UnityEngine;

public class AdvancedPlatformerController : MonoBehaviour
{
    [SerializeField] private Rigidbody2D rb;
    [SerializeField] private Transform groundCheck;
    [SerializeField] private LayerMask groundLayer;
    [SerializeField] private float jumpForce = 14f;
    [SerializeField] private float fallMultiplier = 2.5f;
    [SerializeField] private float lowJumpMultiplier = 2f;

    private float coyoteTimeCounter;
    private float jumpBufferCounter;
    private const float COYOTE_TIME = 0.15f;
    private const float JUMP_BUFFER = 0.12f;

    private void Update()
    {
        bool isGrounded = Physics2D.OverlapCircle(groundCheck.position, 0.2f, groundLayer);

        if (isGrounded) coyoteTimeCounter = COYOTE_TIME;
        else coyoteTimeCounter -= Time.deltaTime;

        if (Input.GetButtonDown("Jump")) jumpBufferCounter = JUMP_BUFFER;
        else jumpBufferCounter -= Time.deltaTime;

        // Pulo com Buffer e Coyote Time
        if (jumpBufferCounter > 0f && coyoteTimeCounter > 0f)
        {
            rb.velocity = new Vector2(rb.velocity.x, jumpForce);
            jumpBufferCounter = 0f;
        }

        // Pulo variável (pulo curto ao soltar o botão cedo)
        if (rb.velocity.y < 0)
            rb.velocity += Vector2.up * (Physics2D.gravity.y * (fallMultiplier - 1) * Time.deltaTime);
        else if (rb.velocity.y > 0 && !Input.GetButton("Jump"))
            rb.velocity += Vector2.up * (Physics2D.gravity.y * (lowJumpMultiplier - 1) * Time.deltaTime);
    }
}`,
          output: '[Platformer Engine]: Pulo responsivo executado com Coyote Time (0.11s restante). FallMultiplier ativo.',
          lang: 'csharp',
          exercise: {
            id: 'ex-unity2d-med-1',
            prompt: 'O que é "Coyote Time" no desenvolvimento de jogos de plataforma?',
            type: 'multiple_choice',
            options: [
              'Uma tolerância de tempo em que o jogador ainda pode pular logo após ter saído da borda de uma plataforma',
              'Um poder especial que transforma o personagem em um coiote',
              'O tempo que leva para o jogo carregar o cenário',
              'Um bug de física onde o personagem cai infinitamente',
            ],
            correctAnswer: 'Uma tolerância de tempo em que o jogador ainda pode pular logo após ter saído da borda de uma plataforma',
            hint: 'Inspirado no desenho do Papa-Léguas (Coyote) que fica parado no ar antes de cair.',
            explanation: 'Coyote Time é uma técnica essencial de Game Feel que evita a frustração do jogador de apertar o pulo milissegundos após pisar em falso na beirada.',
          },
        },
        {
          title: '7. Tilemaps, Rule Tiles e Colisores Compostos (2D Grid)',
          desc: 'Construa fases complexas rapidamente com auto-tiling, Rule Tiles e CompositeCollider2D.',
          theory: [
            {
              title: 'Arquitetura de Grid e Tilemaps no Unity',
              text: 'O sistema de Tilemap permite desenhar cenários inteiros usando uma paleta de tiles. Com Rule Tiles, o Unity calcula automaticamente as bordas, cantos e transições de terrenos com base nos blocos adjacentes.',
              keyPoints: [
                'Tilemap Collider 2D + Composite Collider 2D: Une centenas de colliders individuais de cada tile em uma única malha de colisão contínua.',
                'Used by Composite: Deve ser marcado no TilemapCollider2D para evitar que o personagem "engasgue" em quinas invisíveis entre blocos.',
                'Camadas de Ordenação (Sorting Layers): Organize planos de fundo (Background), cenário (Midground), personagens (Player) e primeiro plano (Foreground).',
              ],
            },
          ],
          code: `// Exemplo conceitual de Rule Tile e montagem de grid programático
using UnityEngine;
using UnityEngine.Tilemaps;

public class LevelGenerator2D : MonoBehaviour
{
    [SerializeField] private Tilemap groundTilemap;
    [SerializeField] private TileBase groundRuleTile;

    public void GeneratePlatform(int startX, int startY, int width)
    {
        for (int x = 0; x < width; x++)
        {
            Vector3Int position = new Vector3Int(startX + x, startY, 0);
            groundTilemap.SetTile(position, groundRuleTile);
        }
        // O Rule Tile calcula automaticamente bordas esquerda, centro e direita!
    }
}`,
          output: '[Tilemap Generator]: 120 tiles gerados. Composite Collider 2D gerou 1 única malha suave de colisão.',
          lang: 'csharp',
          exercise: {
            id: 'ex-unity2d-med-2',
            prompt: 'Por que é recomendado usar um "Composite Collider 2D" junto com o "Tilemap Collider 2D"?',
            type: 'multiple_choice',
            options: [
              'Para unir as colisões de todos os tiles em uma única geometria contínua, melhorando o desempenho e evitando travamentos em frestas',
              'Para deixar os tiles invisíveis',
              'Para aplicar gravidade nos blocos de pedra',
              'Para impedir o uso de texturas',
            ],
            correctAnswer: 'Para unir as colisões de todos os tiles em uma única geometria contínua, melhorando o desempenho e evitando travamentos em frestas',
            hint: 'Evita costuras ou micro-frestas entre tiles adjacentes que travam o personagem ao correr.',
            explanation: 'O Composite Collider 2D mescla as caixas de colisão individuais em polígonos contínuos, reduzindo cálculos de física e eliminando atritos nas junções dos tiles.',
          },
        },
        {
          title: '8. Criação do Jogo 4: Top-Down Shooter (Mira no Mouse & Object Pooling)',
          desc: 'Desenvolva mira em 360º com mouse/stick, disparo de projéteis e pool de objetos de alta performance.',
          theory: [
            {
              title: 'Mecânica Top-Down e Object Pooling',
              text: 'Em jogos de tiro rápido, instanciar e destruir centenas de balas por segundo causa picos de Garbage Collector (GC) e travamentos. O Object Pooling pré-aloca uma fila de balas reutilizáveis, apenas ativando e desativando GameObjects.',
              keyPoints: [
                'Ângulo de Mira: Mathf.Atan2(deltaY, deltaX) * Mathf.Rad2Deg calcula o ângulo Z exato para orientar a arma até o cursor do mouse.',
                'Camera.main.ScreenToWorldPoint: Converte a posição do ponteiro na tela de pixels para as coordenadas no mundo 2D.',
                'UnityEngine.Pool (IObjectPool<T>): Estrutura nativa do Unity 2021+ para gerenciar pools thread-safe e otimizados.',
              ],
            },
          ],
          code: `using UnityEngine;
using UnityEngine.Pool;

public class TopDownWeapon : MonoBehaviour
{
    [SerializeField] private Bullet2D bulletPrefab;
    [SerializeField] private Transform firePoint;
    [SerializeField] private float fireRate = 0.1f;

    private IObjectPool<Bullet2D> bulletPool;
    private float nextFireTime;

    private void Awake()
    {
        bulletPool = new ObjectPool<Bullet2D>(
            createFunc: () => {
                Bullet2D b = Instantiate(bulletPrefab);
                b.SetPool(bulletPool);
                return b;
            },
            actionOnGet: (b) => b.gameObject.SetActive(true),
            actionOnRelease: (b) => b.gameObject.SetActive(false),
            actionOnDestroy: (b) => Destroy(b.gameObject),
            defaultCapacity: 30,
            maxSize: 100
        );
    }

    private void Update()
    {
        // Rotaciona em direção ao mouse
        Vector3 mousePos = Camera.main.ScreenToWorldPoint(Input.mousePosition);
        Vector2 aimDirection = (mousePos - transform.position).normalized;
        float angle = Mathf.Atan2(aimDirection.y, aimDirection.x) * Mathf.Rad2Deg;
        transform.rotation = Quaternion.Euler(0, 0, angle);

        if (Input.GetMouseButton(0) && Time.time >= nextFireTime)
        {
            nextFireTime = Time.time + fireRate;
            Shoot(aimDirection);
        }
    }

    private void Shoot(Vector2 direction)
    {
        Bullet2D bullet = bulletPool.Get();
        bullet.transform.position = firePoint.position;
        bullet.Launch(direction);
    }
}`,
          output: '[Weapon System]: Arma orientada para (45.2º). Bala disparada da pool [Ativas: 3, Inativas: 27]. 0 bytes de GC alocados.',
          lang: 'csharp',
          exercise: {
            id: 'ex-unity2d-med-3',
            prompt: 'Qual é o principal benefício de usar "Object Pooling" para projéteis e efeitos em vez de "Instantiate()" e "Destroy()"?',
            type: 'multiple_choice',
            options: [
              'Elimina a sobrecarga de alocação de memória e pausas do Garbage Collector (GC), mantendo os 60+ FPS estáveis',
              'Permite que os projéteis atravessem paredes',
              'Aumenta o dano causado pelos tiros',
              'Gera iluminação automática na tela',
            ],
            correctAnswer: 'Elimina a sobrecarga de alocação de memória e pausas do Garbage Collector (GC), mantendo os 60+ FPS estáveis',
            hint: 'Instanciar e destruir objetos repetidamente gera lixo na memória RAM da engine.',
            explanation: 'Reutilizar objetos de uma lista pré-alocada evita que a CPU precise criar e desalocar blocos de memória em tempo de execução, prevenindo micro-travamentos (stutters).',
          },
        },
        {
          title: '9. UI Dinâmica, HUD com TextMeshPro & Barra de Vida Suave',
          desc: 'Construa Canvas responsivo com âncoras corretas, sliders de HP animados com Mathf.Lerp e eventos desemparelhados.',
          theory: [
            {
              title: 'Arquitetura de UI Profissional com Unity UI / TextMeshPro',
              text: 'A UI do jogo deve responder a diferentes resoluções e proporções (16:9, 21:9, 18:9 mobile). O Canvas Scaler (Scale With Screen Size) com âncoras (Anchors) adequadas mantém menus e barras de vida nos cantos corretos.',
              keyPoints: [
                'Canvas Scaler (Match Width/Height): Configure Match = 0.5 para equilibrar cortes verticais e horizontais.',
                'Desacoplamento por Eventos: A barra de vida escuta eventos `OnHealthChanged` do Player em vez de fazer polling no `Update()`.',
                'Interpolação de Dano (Chip Away Effect): Uma barra vermelha rápida com uma barra branca atrás que desliza suavemente com Lerp para indicar impacto visual.',
              ],
            },
          ],
          code: `using UnityEngine;
using UnityEngine.UI;
using TMPro;

public class HealthBarHUD : MonoBehaviour
{
    [SerializeField] private Slider healthSlider;
    [SerializeField] private Slider easeHealthSlider;
    [SerializeField] private TextMeshProUGUI healthText;
    [SerializeField] private float lerpSpeed = 0.05f;

    private float currentHealth;
    private float maxHealth;

    public void Initialize(float max)
    {
        maxHealth = max;
        currentHealth = max;
        healthSlider.maxValue = max;
        easeHealthSlider.maxValue = max;
        UpdateUIImmediate();
    }

    public void OnHealthChanged(float newHealth)
    {
        currentHealth = Mathf.Clamp(newHealth, 0, maxHealth);
        healthSlider.value = currentHealth;
        healthText.text = $"{Mathf.CeilToInt(currentHealth)} / {maxHealth}";
    }

    private void Update()
    {
        // Animação suave da barra de fundo (efeito de rastro de dano)
        if (easeHealthSlider.value != healthSlider.value)
        {
            easeHealthSlider.value = Mathf.Lerp(easeHealthSlider.value, healthSlider.value, lerpSpeed);
        }
    }

    private void UpdateUIImmediate()
    {
        healthSlider.value = currentHealth;
        easeHealthSlider.value = currentHealth;
        healthText.text = $"{currentHealth} / {maxHealth}";
    }
}`,
          output: '[UI HUD]: Vida atualizada para 75/100. Barra secundária animando suavemente via Lerp.',
          lang: 'csharp',
          exercise: {
            id: 'ex-unity2d-med-4',
            prompt: 'No Unity Canvas, por que é uma boa prática atualizar a UI por meio de eventos (como OnHealthChanged) em vez de ler o valor do Player todo frame no Update()?',
            type: 'multiple_choice',
            options: [
              'Economiza ciclos de CPU desnecessários e desemparelha o código da UI da lógica de gameplay',
              'Porque o Unity proíbe usar Update em scripts de UI',
              'Para que a interface fique em 3D',
              'Para diminuir a resolução das fontes',
            ],
            correctAnswer: 'Economiza ciclos de CPU desnecessários e desemparelha o código da UI da lógica de gameplay',
            hint: 'A UI só precisa processar alterações quando o valor realmente mudar.',
            explanation: 'Atualização orientada a eventos (Event-Driven) elimina checagens repetitivas 60+ vezes por segundo, tornando o código limpo, modular e de alto desempenho.',
          },
        },
        {
          title: '10. Cinemachine 2D, Screen Shake e Áudio Espacial',
          desc: 'Adicione Game Feel com câmera inteligente Cinemachine Virtual Camera, ruído Perlin para tremores e AudioMixer.',
          theory: [
            {
              title: 'Game Feel: Cinemachine & Screen Shake',
              text: 'A Cinemachine permite criar câmeras dinâmicas que seguem o jogador com zonas mortas (Dead Zone), damping (suavidade de rastreamento) e confinamento dentro do mapa (Cinemachine Confiner 2D). Com impulsos de ruído, geramos Screen Shake realista em explosões.',
              keyPoints: [
                'Cinemachine Impulse Source / Listener: Sistema modular para disparar tremores de tela sem acoplamento direto com a câmera.',
                'AudioMixer: Separe canais de Master, BGM, SFX e Voice com controle de volume em decibéis (dB) e efeitos como Reverb ou Lowpass.',
              ],
            },
          ],
          code: `using UnityEngine;
using Cinemachine;

public class CameraShakeManager : MonoBehaviour
{
    public static CameraShakeManager Instance { get; private set; }

    [SerializeField] private CinemachineImpulseSource impulseSource;

    private void Awake()
    {
        if (Instance == null) Instance = this;
        else Destroy(gameObject);
    }

    public void ShakeCamera(float force = 1f)
    {
        impulseSource.GenerateImpulse(Vector3.one * force);
    }
}`,
          output: '[Cinemachine]: Impulso de Screen Shake gerado (magnitude: 1.5). Câmera interpolada suavemente.',
          lang: 'csharp',
          exercise: {
            id: 'ex-unity2d-med-5',
            prompt: 'Qual componente da Cinemachine no Unity é utilizado para impedir que a câmera mostre áreas fora dos limites desenhados da fase?',
            type: 'multiple_choice',
            options: ['Cinemachine Confiner 2D', 'Cinemachine Tracked Dolly', 'Cinemachine Brain', 'Cinemachine Clear Shot'],
            correctAnswer: 'Cinemachine Confiner 2D',
            hint: 'O nome significa "confinador" e recebe um PolygonCollider2D ou CompositeCollider2D.',
            explanation: 'O Cinemachine Confiner 2D limita a posição da câmera para que a visão nunca ultrapasse os contornos do colisor do mapa.',
          },
        },
      ],
      avancado: [
        {
          title: '11. Criação do Jogo 5: RPG 2D (ScriptableObjects & Inventário)',
          desc: 'Projete sistemas de itens modulares, inventários em grade com arrastar/soltar e consumíveis.',
          theory: [
            {
              title: 'ScriptableObjects: O Coração dos Dados em Jogos',
              text: 'ScriptableObjects são contêineres de dados independentes de GameObjects na cena. Permitem criar bancos de dados de itens, armas, inimigos e magias que não consomem memória desnecessária por instância.',
              keyPoints: [
                'ItemData (ScriptableObject): Armazena ID, Nome, Ícone Sprite, Preço, Atributos e tipo de uso.',
                'Inventory System: Uma lista de `InventorySlot` contendo referência ao ItemData e quantidade acumulada (Stack).',
                'Event-Driven Inventory: A UI redesenha os slots apenas quando itens são adicionados, removidos ou movidos.',
              ],
            },
          ],
          code: `using UnityEngine;

[CreateAssetMenu(fileName = "NovoItem", menuName = "RPG/Item")]
public class ItemDataSO : ScriptableObject
{
    public string id;
    public string itemName;
    [TextArea] public string description;
    public Sprite icon;
    public int maxStack = 99;
    public ItemType type;

    public virtual void Use(GameObject player)
    {
        Debug.Log($"Item {itemName} utilizado!");
    }
}

public enum ItemType { Consumivel, Equipamento, Material, Chave }`,
          output: '[ScriptableObject]: Item "Pocao_Cura_Maior" instanciado como asset compartilhado em memória.',
          lang: 'csharp',
          exercise: {
            id: 'ex-unity2d-adv-1',
            prompt: 'Qual é a principal vantagem de usar ScriptableObjects para definir itens de RPG no Unity?',
            type: 'multiple_choice',
            options: [
              'Os dados ficam salvos em assets reutilizáveis no projeto e não precisam ficar atrelados a GameObjects na cena',
              'Eles aumentam a resolução dos sprites',
              'ScriptableObjects impedem que o jogador tome dano',
              'Eles substituem o motor de física do Unity',
            ],
            correctAnswer: 'Os dados ficam salvos em assets reutilizáveis no projeto e não precisam ficar atrelados a GameObjects na cena',
            hint: 'Permite gerenciar bancos de dados inteiros de itens direto no editor.',
            explanation: 'ScriptableObjects armazenam grandes volumes de dados compartilhados sem duplicar informações entre instâncias na cena, economizando memória e facilitando o balanceamento.',
          },
        },
        {
          title: '12. Sistema de Diálogos com Árvore de Decisão & Parsing de Texto',
          desc: 'Construa diálogos com efeito de máquina de escrever (Typewriter), ramificação de escolhas e eventos disparados por NPCs.',
          theory: [
            {
              title: 'Estruturação de Diálogos Não-Lineares',
              text: 'Um sistema de diálogo robusto permite nós com falas de personagens, retratos, áudio de fala e respostas com múltiplos caminhos que desbloqueiam quests ou iniciam batalhas.',
              keyPoints: [
                'Efeito Typewriter com Coroutine: Itera sobre os caracteres da string com delay de segundos (ex: 0.03s) com som de bip sutil.',
                'Árvore de Diálogo: Cada nó possui uma lista de `ChoiceData` apontando para o próximo ID de diálogo.',
              ],
            },
          ],
          code: `using System.Collections;
using UnityEngine;
using TMPro;

public class TypewriterDialogue : MonoBehaviour
{
    [SerializeField] private TextMeshProUGUI dialogueText;
    [SerializeField] private float typingSpeed = 0.03f;
    private Coroutine typingCoroutine;

    public void ShowSentence(string sentence)
    {
        if (typingCoroutine != null) StopCoroutine(typingCoroutine);
        typingCoroutine = StartCoroutine(TypeSentenceRoutine(sentence));
    }

    private IEnumerator TypeSentenceRoutine(string sentence)
    {
        dialogueText.text = "";
        foreach (char letter in sentence)
        {
            dialogueText.text += letter;
            yield return new WaitForSeconds(typingSpeed);
        }
    }
}`,
          output: '[Dialogue System]: Exibindo linha de fala do NPC com typewriter suave. 42 caracteres impressos.',
          lang: 'csharp',
          exercise: {
            id: 'ex-unity2d-adv-2',
            prompt: 'No Unity, por que utilizamos Coroutines (IEnumerator) para criar efeitos como a digitação de texto letra por letra (Typewriter)?',
            type: 'multiple_choice',
            options: [
              'Porque Coroutines permitem pausar a execução por um determinado tempo (yield return new WaitForSeconds) sem travar a thread principal do jogo',
              'Porque strings não podem ser lidas no Update',
              'Porque o Unity exige Coroutines para renderizar fontes',
              'Para impedir que o jogador feche a caixa de diálogo',
            ],
            correctAnswer: 'Porque Coroutines permitem pausar a execução por um determinado tempo (yield return new WaitForSeconds) sem travar a thread principal do jogo',
            hint: 'A instrução yield pausa a rotina e retorna o controle para a engine até o tempo expirar.',
            explanation: 'Coroutines são essenciais para ações assíncronas temporizadas sem congelar a taxa de quadros (framerate) da aplicação.',
          },
        },
        {
          title: '13. IA Inimiga 2D: Máquina de Estados Fita (FSM) & Perseguição',
          desc: 'Desenvolva IAs inimigas com estados de Patrulha, Alerta, Perseguição, Ataque e Fuga.',
          theory: [
            {
              title: 'Finite State Machine (FSM) para Jogos',
              text: 'Uma FSM organiza o comportamento de inimigos em estados discretos e isolados. Cada estado implementa métodos `Enter()`, `Update()`, `FixedUpdate()` e `Exit()`, eliminando códigos gigantes cheios de `if/else` aninhados.',
              keyPoints: [
                'Estado Idle / Patrol: Inimigo patrulha waypoints predeterminados ou caminha em linha reta até encontrar uma parede.',
                'Transição para Chase: Raycast ou OverlapCircle detecta o jogador dentro do campo de visão (Line of Sight).',
                'Estado Attack: Para o movimento, inicia a animação de telegrafar golpe, aplica dano na área e entra em Cooldown.',
              ],
            },
          ],
          code: `using UnityEngine;

public interface IEnemyState
{
    void Enter(EnemyController2D enemy);
    void Update(EnemyController2D enemy);
    void Exit(EnemyController2D enemy);
}

public class PatrolState : IEnemyState
{
    public void Enter(EnemyController2D enemy) { enemy.PlayAnimation("Patrol"); }
    public void Update(EnemyController2D enemy)
    {
        enemy.MoveAlongWaypoints();
        if (enemy.CanSeePlayer())
        {
            enemy.ChangeState(new ChaseState());
        }
    }
    public void Exit(EnemyController2D enemy) { }
}

public class ChaseState : IEnemyState
{
    public void Enter(EnemyController2D enemy) { enemy.PlayAnimation("Run"); }
    public void Update(EnemyController2D enemy)
    {
        enemy.ChasePlayer();
        if (enemy.IsInAttackRange())
        {
            enemy.ChangeState(new AttackState());
        }
    }
    public void Exit(EnemyController2D enemy) { }
}`,
          output: '[AI FSM]: Inimigo detectou jogador! Transição de estado: PatrolState -> ChaseState.',
          lang: 'csharp',
          exercise: {
            id: 'ex-unity2d-adv-3',
            prompt: 'Qual é o principal benefício arquitetural de usar o padrão Finite State Machine (FSM) com classes/interfaces para IAs de inimigos?',
            type: 'multiple_choice',
            options: [
              'Isola a lógica de cada comportamento em classes dedicadas, tornando o código modular, legível e fácil de expandir com novos estados',
              'Faz com que o inimigo cause o dobro de dano',
              'Garante que o inimigo fique imune a física',
              'Elimina a necessidade de colisores no jogo',
            ],
            correctAnswer: 'Isola a lógica de cada comportamento em classes dedicadas, tornando o código modular, legível e fácil de expandir com novos estados',
            hint: 'Evita métodos com centenas de "if" e variáveis booleanas confusas.',
            explanation: 'Com FSM baseada em classes, cada estado é independente, com regras claras de entrada, execução e transição, facilitando a adição de chefes e inimigos complexos.',
          },
        },
        {
          title: '14. Save / Load Seguro com JSON, Binário e Criptografia AES',
          desc: 'Persista progresso de jogo, inventários e posições usando JSON serializado e criptografia contra manipulação.',
          theory: [
            {
              title: 'Persistência de Dados em Jogos',
              text: 'Evite salvar dados complexos no PlayerPrefs (que é destinado apenas a configurações como volume e resolução). Use serialização JSON ou binária gravada em `Application.persistentDataPath`, aplicando uma camada de criptografia AES para evitar edições indevidas por parte dos jogadores.',
              keyPoints: [
                'Application.persistentDataPath: Diretório seguro e com permissão de escrita multiplataforma (Windows, Mac, Android, iOS).',
                'JsonUtility / Newtonsoft.Json: Serializa estruturas de dados em texto estruturado.',
                'Criptografia Simétrica (AES): Converte o JSON em bytes ilegíveis via chave secreta.',
              ],
            },
          ],
          code: `using System.IO;
using System.Text;
using System.Security.Cryptography;
using UnityEngine;

[System.Serializable]
public class GameSaveData
{
    public int currentLevel;
    public int playerCoins;
    public float[] playerPosition;
    public string[] unlockedAbilities;
}

public static class SaveSystem
{
    private static readonly string SavePath = Path.Combine(Application.persistentDataPath, "savedata.dat");
    private static readonly byte[] Key = Encoding.UTF8.GetBytes("G4m3S3cr3tK3y2026"); // 16 bytes

    public static void Save(GameSaveData data)
    {
        string json = JsonUtility.ToJson(data, true);
        byte[] encryptedBytes = Encrypt(json);
        File.WriteAllBytes(SavePath, encryptedBytes);
        Debug.Log($"Jogo salvo com sucesso em: {SavePath}");
    }

    private static byte[] Encrypt(string plainText)
    {
        using Aes aes = Aes.Create();
        aes.Key = Key;
        aes.IV = new byte[16];
        using var encryptor = aes.CreateEncryptor();
        byte[] inputBytes = Encoding.UTF8.GetBytes(plainText);
        return encryptor.TransformFinalBlock(inputBytes, 0, inputBytes.Length);
    }
}`,
          output: '[SaveSystem]: GameSaveData criptografado e salvo em persistentDataPath (142 bytes).',
          lang: 'csharp',
          exercise: {
            id: 'ex-unity2d-adv-4',
            prompt: 'Por que dados de progresso e inventário não devem ser salvos no "PlayerPrefs" em jogos comerciais?',
            type: 'multiple_choice',
            options: [
              'Porque PlayerPrefs é armazenado em texto claro no registro do sistema ou arquivos simples, sendo fácil de ser adulterado e limitado em tamanho',
              'Porque PlayerPrefs apaga os dados a cada reinício',
              'Porque o Unity descontinuou o PlayerPrefs',
              'Porque PlayerPrefs não aceita números inteiros',
            ],
            correctAnswer: 'Porque PlayerPrefs é armazenado em texto claro no registro do sistema ou arquivos simples, sendo fácil de ser adulterado e limitado em tamanho',
            hint: 'PlayerPrefs foi projetado apenas para preferências leves do usuário como volume de áudio e brilho.',
            explanation: 'PlayerPrefs grava no Windows Registry ou SharedPreferences no Android sem qualquer segurança, permitindo que usuários alterem valores como dinheiro e vida facilmente.',
          },
        },
        {
          title: '15. Otimização 2D: Sprite Atlasing, Batching & Garbage Collection',
          desc: 'Reduza Draw Calls, agrupe texturas em Sprite Atlases e elimine alocações no loop principal.',
          theory: [
            {
              title: 'Otimização Extrema de Performance 2D',
              text: 'Cada textura desenhada individualmente pode exigir um novo Draw Call para a GPU. Ao compactar múltiplos sprites em um único Sprite Atlas, o Unity desenha todo o cenário e personagens em um único lote (Dynamic/Static Batching).',
              keyPoints: [
                'Sprite Atlas: Reduz drasticamente Draw Calls de 300+ para menos de 10 na GPU.',
                'Evite `FindObjectOfType` e `GetComponent` no Update: Faça o cache de todas as referências no Awake/Start.',
                'NonAlloc Physics APIs: Utilize `Physics2D.OverlapCircleNonAlloc` passando um array reutilizável para gerar 0 bytes de lixo GC.',
              ],
            },
          ],
          code: `using UnityEngine;

public class HighPerformanceSensor2D : MonoBehaviour
{
    private readonly Collider2D[] resultsBuffer = new Collider2D[10];
    [SerializeField] private LayerMask targetLayer;

    private void FixedUpdate()
    {
        // 0 Bytes de GC alocados por chamada!
        int hitCount = Physics2D.OverlapCircleNonAlloc(transform.position, 3f, resultsBuffer, targetLayer);

        for (int i = 0; i < hitCount; i++)
        {
            Collider2D target = resultsBuffer[i];
            // Processa colisão de alta performance
        }
    }
}`,
          output: '[Profiler]: 0B GC / Frame. Draw Calls reduzidos de 148 para 6 com Sprite Atlas ativo.',
          lang: 'csharp',
          exercise: {
            id: 'ex-unity2d-adv-5',
            prompt: 'Qual método de física 2D deve ser priorizado em loops de alta frequência para evitar alocações de memória no Garbage Collector?',
            type: 'multiple_choice',
            options: ['Physics2D.OverlapCircleNonAlloc()', 'Physics2D.OverlapCircleAll()', 'Physics2D.RaycastAll()', 'GameObject.FindGameObjectsWithTag()'],
            correctAnswer: 'Physics2D.OverlapCircleNonAlloc()',
            hint: 'Métodos com o sufixo "NonAlloc" utilizam um buffer de array pré-existente.',
            explanation: 'Métodos NonAlloc preenchem um array pré-alocado passado por parâmetro sem criar novos arrays na memória Heap, eliminando quedas de desempenho por coleta de lixo.',
          },
        },
      ],
      projetos: [
        {
          title: '16. Boss Fight Épico 2D: Padrões de Ataque, Telegrafos e Fases',
          desc: 'Construa uma batalha contra chefão com 3 fases dinâmicas, telegrafia visual de golpes e barra de vida superior.',
          theory: [
            {
              title: 'Design de Boss Fights Memoráveis',
              text: 'Uma batalha justa e empolgante exige sinais visuais claros (Telegraphing) antes de ataques devastadores, permitindo que o jogador aprenda e reaja aos padrões.',
              keyPoints: [
                'Fase 1 (100%-60% HP): Ataques básicos e projéteis lentos.',
                'Fase 2 (60%-25% HP): Enrage mode, movimentação mais rápida e lasers telegrafados.',
                'Fase 3 (25%-0% HP): Chuva de meteoros, arena reduzida e ataques combinados.',
              ],
            },
          ],
          code: `// Estrutura de Máquina de Fases do Boss
public class BossEncounter : MonoBehaviour
{
    [SerializeField] private float maxHealth = 1000f;
    private float currentHealth;

    public void TakeDamage(float amount)
    {
        currentHealth -= amount;
        float healthPercent = currentHealth / maxHealth;

        if (healthPercent <= 0.25f) EnterPhaseThree();
        else if (healthPercent <= 0.60f) EnterPhaseTwo();
    }

    private void EnterPhaseTwo()
    {
        // Altera cor do Boss, aumenta velocidade e adiciona ataque giratório
    }

    private void EnterPhaseThree()
    {
        // Trilha sonora épica de clímax, spawn de minions e arena em chamas
    }
}`,
          output: '[Boss Encounter]: Boss atingiu 58% de HP. Transição para FASE 2 acionada!',
          lang: 'csharp',
          exercise: {
            id: 'ex-unity2d-proj-1',
            prompt: 'Em Game Design, qual é a função do "Telegraphing" nos ataques de um Boss?',
            type: 'multiple_choice',
            options: [
              'Fornecer uma animação ou efeito visual prévio que avisa o jogador onde e quando o golpe ocorrerá, permitindo desvio habilidoso',
              'Enviar uma mensagem de texto para o celular do jogador',
              'Fazer o Boss se curar',
              'Reduzir a resolução gráfica do jogo',
            ],
            correctAnswer: 'Fornecer uma animação ou efeito visual prévio que avisa o jogador onde e quando o golpe ocorrerá, permitindo desvio habilidoso',
            hint: 'Garante que o combate seja desafiador por habilidade, e não injusto por ataques instantâneos imprevisíveis.',
            explanation: 'O telegrafo dá pistas claras para o jogador reagir no tempo certo, criando uma sensação gratificante de maestria.',
          },
        },
        {
          title: '17. Roguelite 2D: Geração Procedural de Masmorras (BSP & Salas)',
          desc: 'Gere masmorras aleatórias usando Binary Space Partitioning (BSP), corredores conectados e spawn de salas.',
          theory: [
            {
              title: 'Geração Procedural de Cenários (PCG)',
              text: 'Algoritmos de BSP dividem um retângulo de mapa repetidamente em sub-espaços menores, gerando salas aleatórias dentro de cada divisão e interligando-as com corredores em L.',
              keyPoints: [
                'Semente Aleatória (Seed): Permite recriar exatamente o mesmo layout de mapa compartilhando um código numérico.',
                'Garantia de Navegabilidade: Algoritmo de inundação (Flood Fill) para validar se a sala inicial tem caminho até a saída.',
              ],
            },
          ],
          code: `using System.Collections.Generic;
using UnityEngine;

public class DungeonBSPGenerator
{
    public class RoomNode
    {
        public RectInt area;
        public RectInt? room;
        public RoomNode left, right;

        public RoomNode(RectInt area) => this.area = area;
    }

    public void GenerateDungeon(int width, int height, int minRoomSize)
    {
        RoomNode root = new RoomNode(new RectInt(0, 0, width, height));
        SplitArea(root, minRoomSize);
        // Cria salas e conecta portas com corredores
    }

    private void SplitArea(RoomNode node, int minSize)
    {
        if (node.area.width > minSize * 2 || node.area.height > minSize * 2)
        {
            // Divide horizontal ou verticalmente de forma randômica
        }
    }
}`,
          output: '[Dungeon Generator]: Masmorra gerada com 14 salas interconectadas. Seed: 849201.',
          lang: 'csharp',
          exercise: {
            id: 'ex-unity2d-proj-2',
            prompt: 'Por que o uso de uma "Seed" (semente) é fundamental em jogos Roguelite procedurais?',
            type: 'multiple_choice',
            options: [
              'Permite reproduzir deterministicamente a mesma fase aleatória para testes, replays e competições diárias (Daily Runs)',
              'Faz as plantas do jogo crescerem',
              'Ocupa menos espaço na placa de vídeo',
              'Substitui o motor de renderização',
            ],
            correctAnswer: 'Permite reproduzir deterministicamente a mesma fase aleatória para testes, replays e competições diárias (Daily Runs)',
            hint: 'A semente inicializa o gerador de números pseudo-aleatórios.',
            explanation: 'Com a mesma Seed, toda a sequência de números pseudo-aleatórios se repete de forma idêntica, permitindo reproduzir a mesma fase e comparar pontuações entre jogadores.',
          },
        },
        {
          title: '18. Sistema de Conquistas (Achievements) e Desafios Locais',
          desc: 'Construa um gestor de conquistas com notificações animadas na tela e progresso acumulativo.',
          theory: [
            {
              title: 'Gamificação & Retenção de Jogadores',
              text: 'Sistemas de conquistas incentivam o jogador a explorar mecânicas secundárias, rejogar fases e buscar maestria total.',
              keyPoints: [
                'Tipos de Conquistas: Instantâneas (ex: Derrotar o primeiro boss) e Acumulativas (ex: Coletar 1000 moedas).',
                'Popup Banner: Animação suave deslizando do topo da tela com som característico de recompensa.',
              ],
            },
          ],
          code: `using System;
using System.Collections.Generic;
using UnityEngine;

[Serializable]
public class Achievement
{
    public string id;
    public string title;
    public string description;
    public bool isUnlocked;
    public int targetProgress;
    public int currentProgress;
}

public class AchievementManager : MonoBehaviour
{
    [SerializeField] private List<Achievement> achievements = new();

    public void AddProgress(string id, int amount = 1)
    {
        var ach = achievements.Find(a => a.id == id);
        if (ach != null && !ach.isUnlocked)
        {
            ach.currentProgress += amount;
            if (ach.currentProgress >= ach.targetProgress)
            {
                ach.isUnlocked = true;
                TriggerNotification(ach);
            }
        }
    }

    private void TriggerNotification(Achievement ach)
    {
        Debug.Log($"🏆 CONQUISTA DESBLOQUEADA: {ach.title} - {ach.description}");
    }
}`,
          output: '[Achievements]: 🏆 Conquista "Mestre das Espadas" desbloqueada! Popup exibido na UI.',
          lang: 'csharp',
          exercise: {
            id: 'ex-unity2d-proj-3',
            prompt: 'Como estruturar uma conquista cumulativa (ex: Derrotar 50 inimigos) de forma escalável?',
            type: 'multiple_choice',
            options: [
              'Registrando o progresso atual (currentProgress) e disparando o desbloqueio quando atingir a meta (targetProgress)',
              'Criando 50 variáveis booleanas separadas',
              'Reiniciando o jogo a cada inimigo',
              'Gravando um arquivo de vídeo do abate',
            ],
            correctAnswer: 'Registrando o progresso atual (currentProgress) e disparando o desbloqueio quando atingir a meta (targetProgress)',
            hint: 'Um contador numérico simples comparado ao objetivo.',
            explanation: 'Controlar o progresso atual em relação ao valor alvo permite mostrar barras parciais de conclusão (ex: 35/50) e disparar o evento no momento do cumprimento.',
          },
        },
        {
          title: '19. Juice & Game Feel: Partículas, Flash on Hit & Slow-Motion',
          desc: 'Adicione polimento profissional aos impactos: flash branco em inimigos, congelamento de frames e partículas ricas.',
          theory: [
            {
              title: 'O Conceito de "Juice" em Game Design',
              text: '"Juice" é o retorno audiovisual exagerado e prazeroso para cada ação do jogador. Sem alterar as regras básicas da física, o Juice transforma um jogo sem graça em uma experiência satisfatória e magnética.',
              keyPoints: [
                'Hit Stop / Frame Freeze: Pausar o Time.timeScale em 0 por 0.05s no momento do impacto de um golpe forte.',
                'Flash on Hit: Trocar o material do sprite para um shader totalmente branco por 0.1s para comunicar que o dano foi recebido.',
                'Squash and Stretch: Deformar levemente a escala do personagem ao pular e aterrissar.',
              ],
            },
          ],
          code: `using System.Collections;
using UnityEngine;

public class ImpactJuiceEffect : MonoBehaviour
{
    [SerializeField] private SpriteRenderer sr;
    [SerializeField] private Material whiteFlashMaterial;
    private Material defaultMaterial;

    private void Awake() => defaultMaterial = sr.material;

    public void TriggerHitJuice(float freezeDuration = 0.06f)
    {
        StartCoroutine(HitStopRoutine(freezeDuration));
        StartCoroutine(FlashRoutine());
    }

    private IEnumerator HitStopRoutine(float duration)
    {
        Time.timeScale = 0f;
        yield return new WaitForSecondsRealtime(duration);
        Time.timeScale = 1f;
    }

    private IEnumerator FlashRoutine()
    {
        sr.material = whiteFlashMaterial;
        yield return new WaitForSeconds(0.08f);
        sr.material = defaultMaterial;
    }
}`,
          output: '[Juice FX]: Impacto registrado! HitStop de 0.05s aplicado e Flash Material ativado.',
          lang: 'csharp',
          exercise: {
            id: 'ex-unity2d-proj-4',
            prompt: 'Ao implementar um congelamento de tela por impacto (Hit Stop), por que devemos usar "WaitForSecondsRealtime" na Coroutine em vez de "WaitForSeconds"?',
            type: 'multiple_choice',
            options: [
              'Porque com Time.timeScale = 0 o WaitForSeconds comum ficaria pausado para sempre e nunca continuaria a execução',
              'Porque WaitForSecondsRealtime tem melhor qualidade gráfica',
              'Porque o Unity não aceita números decimais no WaitForSeconds',
              'Para desligar o som do jogo',
            ],
            correctAnswer: 'Porque com Time.timeScale = 0 o WaitForSeconds comum ficaria pausado para sempre e nunca continuaria a execução',
            hint: 'WaitForSeconds depende do tempo do jogo (Time.timeScale), enquanto Realtime usa o relógio real do computador.',
            explanation: 'Quando Time.timeScale é 0, o tempo da simulação do jogo congela. Apenas WaitForSecondsRealtime continua contando usando o relógio real do sistema para restaurar a velocidade.',
          },
        },
        {
          title: '20. Build Final, Otimização de Assets e Exportação Multiplataforma',
          desc: 'Configure Player Settings, Splash Screen, ícones, compressão de texturas e exportação para PC (Windows) e WebGL.',
          theory: [
            {
              title: 'Pipeline de Entrega e Build Final',
              text: 'A preparação de uma build comercial exige configurar o nome da empresa, ícones em múltiplas resoluções, compressão de áudio (Vorbis com Load in Background), compressão de texturas (ASTC / Crunch) e remoção de logs de Debug desnecessários.',
              keyPoints: [
                'IL2CPP vs Mono: IL2CPP compila C# para C++ nativo, oferecendo desempenho muito superior e maior proteção contra engenharia reversa.',
                'Stripping Level: Remove código não utilizado do engine para reduzir drasticamente o tamanho do arquivo executável.',
              ],
            },
          ],
          code: `// Exemplo de build script automatizado em C#
#if UNITY_EDITOR
using UnityEditor;
using UnityEditor.Build.Reporting;

public class BuildPipelineManager
{
    [MenuItem("Build/Export Windows 64-bit")]
    public static void BuildWindows()
    {
        BuildPlayerOptions options = new BuildPlayerOptions
        {
            scenes = new[] { "Assets/Scenes/MainMenu.unity", "Assets/Scenes/GameLevel.unity" },
            locationPathName = "Builds/Windows/MeuJogo2D.exe",
            target = BuildTarget.StandaloneWindows64,
            options = BuildOptions.None
        };

        BuildReport report = BuildPipeline.BuildPlayer(options);
        Debug.Log($"Resultado da Build: {report.summary.result} ({report.summary.totalSize / 1024 / 1024} MB)");
    }
}
#endif`,
          output: '[Build Pipeline]: StandaloneWindows64 gerado com sucesso em Builds/Windows/MeuJogo2D.exe (48 MB).',
          lang: 'csharp',
          exercise: {
            id: 'ex-unity2d-proj-5',
            prompt: 'Qual compilador do Unity converte o código C# em C++ nativo para gerar builds mais rápidas e protegidas?',
            type: 'multiple_choice',
            options: ['IL2CPP', 'Mono JIT', 'Roslyn Classic', 'Babel JS'],
            correctAnswer: 'IL2CPP',
            hint: 'Significa Intermediate Language to C++.',
            explanation: 'IL2CPP converte o bytecode IL gerado pelo C# em código C++ altamente otimizado e compila nativamente para a plataforma de destino.',
          },
        },
      ],
    },
    quizzesByLevel: {
      iniciante: [
        {
          id: 'q-u2d-ini-1',
          question: 'Em que método do ciclo de vida MonoBehaviour do Unity devemos colocar cálculos de física e movimentação com Rigidbody2D?',
          options: ['FixedUpdate()', 'Update()', 'Awake()', 'LateUpdate()'],
          correctIndex: 0,
          explanation: 'FixedUpdate() roda em intervalos fixos e sincronizados com a taxa de atualização do motor de física 2D.',
        },
        {
          id: 'q-u2d-ini-2',
          question: 'O que o multiplicador Time.deltaTime garante quando usado no método Update()?',
          options: [
            'Que a movimentação ocorra na mesma velocidade real independente de o jogo rodar a 30, 60 ou 144 FPS',
            'Que a gravidade seja desligada',
            'Que o sprite fique transparente',
            'Que o áudio toque mais alto',
          ],
          correctIndex: 0,
          explanation: 'Time.deltaTime representa a fração de segundo decorrida desde o último quadro, tornando o movimento independente da taxa de quadros.',
        },
        {
          id: 'q-u2d-ini-3',
          question: 'Qual componente é obrigatório para que dois objetos sofram detecção de colisão física no Unity 2D?',
          options: [
            'Pelo menos um Collider 2D em cada e ao menos um Rigidbody2D em um deles',
            'Apenas Sprite Renderer',
            'Apenas Animator',
            'Apenas AudioSource',
          ],
          correctIndex: 0,
          explanation: 'O motor de física do Unity requer que haja colisores e que pelo menos um dos corpos possua um Rigidbody2D.',
        },
      ],
      intermediario: [
        {
          id: 'q-u2d-med-1',
          question: 'Qual é a principal função do Object Pooling em jogos de ação com muitos projéteis?',
          options: [
            'Reutilizar objetos inativos para evitar alocações constantes de memória e travamentos pelo Garbage Collector',
            'Aumentar a velocidade das balas em 200%',
            'Fazer as balas mudarem de cor',
            'Gravar replays em vídeo',
          ],
          correctIndex: 0,
          explanation: 'O Object Pooling elimina a criação e destruição repetitiva de GameObjects na memória Heap durante o jogo.',
        },
        {
          id: 'q-u2d-med-2',
          question: 'O que faz a propriedade "Composite Collider 2D" em conjunto com o "Tilemap Collider 2D"?',
          options: [
            'Funde os colisores individuais de cada bloco em uma única malha contínua, prevenindo atritos nas frestas',
            'Apaga todos os tiles da fase',
            'Aumenta o tamanho dos blocos',
            'Desativa a física do jogador',
          ],
          correctIndex: 0,
          explanation: 'Gera uma geometria de colisão contínua sem micro-divisões entre blocos vizinhos.',
        },
      ],
      avancado: [
        {
          id: 'q-u2d-adv-1',
          question: 'Por que ScriptableObjects são ideais para bancos de dados de itens e inimigos em RPGs?',
          options: [
            'Porque são assets independentes da cena, economizando memória e permitindo edição facilitada no editor',
            'Porque aumentam o dano dos ataques',
            'Porque criptografam o jogo automaticamente',
            'Porque impedem que o jogador perca itens',
          ],
          correctIndex: 0,
          explanation: 'ScriptableObjects guardam dados compartilhados em arquivos do projeto sem duplicá-los em instâncias na cena.',
        },
        {
          id: 'q-u2d-adv-2',
          question: 'Em arquitetura de IA, o que caracteriza o padrão Finite State Machine (FSM)?',
          options: [
            'O agente só pode estar em exatamente um estado por vez (Patrol, Chase, Attack) com regras claras de transição',
            'O inimigo executa todos os ataques ao mesmo tempo',
            'A IA é controlada remotamente por um servidor',
            'O inimigo fica invisível',
          ],
          correctIndex: 0,
          explanation: 'Uma FSM garante estados exclusivos e transições controladas, mantendo o código limpo e desacoplado.',
        },
      ],
      projetos: [
        {
          id: 'q-u2d-proj-1',
          question: 'Qual é o compilador do Unity que traduz o código C# para C++ nativo na build final para máxima performance?',
          options: ['IL2CPP', 'Mono JIT', 'GCC', 'LLVM Clang puro'],
          correctIndex: 0,
          explanation: 'IL2CPP converte a linguagem intermediária em C++ nativo e compila para a plataforma alvo com alta otimização.',
        },
        {
          id: 'q-u2d-proj-2',
          question: 'Qual é o papel do "Hit Stop" (congelamento temporário de frames no impacto) no Game Feel?',
          options: [
            'Fornecer peso e impacto dramático imediato a acertos críticos e golpes fortes',
            'Reduzir o consumo de energia do computador',
            'Fazer o jogo travar',
            'Reiniciar a fase',
          ],
          correctIndex: 0,
          explanation: 'O congelamento por milissegundos reforça a sensação de peso e força do impacto físico do golpe.',
        },
      ],
    },
  },
};
