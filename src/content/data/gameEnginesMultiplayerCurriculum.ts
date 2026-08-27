import { TechCurriculumData } from '../techCurriculum';

export const GAME_ENGINES_MULTIPLAYER_CURRICULUM: Record<string, TechCurriculumData> = {
  // =========================================================================
  // GODOT ENGINE 4 & GDSCRIPT / C#
  // =========================================================================
  godot_engine: {
    topicsByLevel: {
      iniciante: [
        {
          title: '1. Arquitetura do Godot 4: Nós (Nodes), Cenas (Scenes) e GDScript',
          desc: 'Entenda a filosofia "tudo é um nó" do Godot, herança de cenas e a sintaxe moderna do GDScript 2.0.',
          theory: [
            {
              title: 'Filosofia de Nós e Cenas no Godot',
              text: 'No Godot, tudo é composto por uma árvore de Nós (Scene Tree). Uma Cena pode ser um personagem, um botão ou um nível inteiro. Qualquer cena pode ser instanciada dentro de outra cena, criando uma composição modular e sem acoplamento.',
              keyPoints: [
                '_ready(): Executa quando o nó e todos os seus filhos entraram na Scene Tree.',
                '_process(delta): Loop de atualização por frame de renderização.',
                '_physics_process(delta): Loop de física com intervalo de tempo fixo (padrão 60Hz).',
                '@export: Expõe variáveis no Inspector do Godot com tipagem estática (ex: `@export var speed: float = 300.0`).',
              ],
            },
          ],
          code: `extends CharacterBody2D

@export var speed: float = 350.0
@export var jump_velocity: float = -500.0

var gravity = ProjectSettings.get_setting("physics/2d/default_gravity")

func _physics_process(delta: float) -> void:
    # Aplica gravidade
    if not is_on_floor():
        velocity.y += gravity * delta

    # Pulo com Input Mapping
    if Input.is_action_just_pressed("ui_accept") and is_on_floor():
        velocity.y = jump_velocity

    # Movimento horizontal
    var direction = Input.get_axis("ui_left", "ui_right")
    if direction:
        velocity.x = direction * speed
    else:
        velocity.x = move_toward(velocity.x, 0, speed)

    move_and_slide()`,
          output: '[Godot Engine 4]: CharacterBody2D instanciado. move_and_slide() processando colisões com TileMap.',
          lang: 'gdscript',
          exercise: {
            id: 'ex-godot-ini-1',
            prompt: 'No Godot 4, qual método nativo de física deve ser chamado no final de "_physics_process" em um CharacterBody2D para processar o movimento e deslizar sobre paredes?',
            type: 'multiple_choice',
            options: ['move_and_slide()', 'move_and_collide()', 'apply_force()', 'translate()'],
            correctAnswer: 'move_and_slide()',
            hint: 'Lê a propriedade interna "velocity" e move o corpo calculando colisões automaticamente.',
            explanation: 'move_and_slide() utiliza o vetor velocity do CharacterBody2D, calculando rampas, tetos e paredes sem exigir parâmetros manuais no Godot 4.',
          },
        },
        {
          title: '2. Sinais (Signals) & Comunicação Desacoplada no Godot',
          desc: 'Conecte eventos entre nós de forma limpa com Signals tipados, lambdas e await.',
          theory: [
            {
              title: 'Comunicação por Sinais (Signals)',
              text: 'Sinais são o padrão Observer nativo do Godot: "Chame para baixo (métodos), sinalize para cima (signals)". Nós filhos nunca devem referenciar nós pais diretamente; eles emitem sinais que os nós superiores escutam.',
              keyPoints: [
                'Declaração de Signal: `signal health_changed(new_health: int, max_health: int)`.',
                'Emissão: `health_changed.emit(current_health, max_health)`.',
                'Await de Sinais: `await get_tree().create_timer(1.0).timeout` para pausas assíncronas.',
              ],
            },
          ],
          code: `extends Node

signal item_collected(item_name: String, value: int)

func collect_coin():
    item_collected.emit("Moeda de Ouro", 10)

# Em outro script receptor:
func _ready():
    $Coin.item_collected.connect(_on_coin_collected)

func _on_coin_collected(name: String, val: int):
    print("Item recebido: %s (+%d pontos)" % [name, val])`,
          output: '[Signals]: Sinal item_collected emitido e capturado por 2 listeners sem acoplamento direto.',
          lang: 'gdscript',
          exercise: {
            id: 'ex-godot-ini-2',
            prompt: 'Qual é a regra de ouro de arquitetura recomendada pela comunidade do Godot?',
            type: 'multiple_choice',
            options: [
              'Chame para baixo (métodos nos filhos) e sinalize para cima (emita sinais para os pais)',
              'Nunca use mais de um nó na cena',
              'Escreva todo o jogo em uma única cena',
              'Apague o arquivo project.godot',
            ],
            correctAnswer: 'Chame para baixo (métodos nos filhos) e sinalize para cima (emita sinais para os pais)',
            hint: 'Garante que os nós filhos possam ser reutilizados em qualquer outra parte do jogo.',
            explanation: 'Ao usar sinais para avisar os pais e métodos diretos para controlar os filhos, os nós permanecem modulares e independentes.',
          },
        },
      ],
      intermediario: [
        {
          title: '3. Godot 3D: Nodes 3D, Shaders Visuais & Física Jolt',
          desc: 'Explore o motor 3D do Godot 4, RigidBody3D, WorldEnvironment e integração com o motor de física Jolt.',
          theory: [
            {
              title: 'Renderização 3D e Física no Godot 4',
              text: 'O Godot 4 traz renderização Vulkan moderna (Forward+ e Mobile) e suporte oficial à física Jolt, oferecendo estabilidade extrema em simulações de corpos rígidos 3D e veículos.',
              keyPoints: [
                'Node3D / CharacterBody3D: O equivalente tridimensional para movimentação com `velocity` e `move_and_slide()`.',
                'WorldEnvironment: Controla Tone Mapping, Glow (Bloom), SSAO e Iluminação SDFGI (Signed Distance Field Global Illumination).',
              ],
            },
          ],
          code: `extends CharacterBody3D

@export var speed: float = 5.0
@export var mouse_sensitivity: float = 0.002

@onready var camera_pivot: Node3D = $CameraPivot

func _unhandled_input(event: InputEvent) -> void:
    if event is InputEventMouseMotion:
        rotate_y(-event.relative.x * mouse_sensitivity)
        camera_pivot.rotate_x(-event.relative.y * mouse_sensitivity)
        camera_pivot.rotation.x = clamp(camera_pivot.rotation.x, deg_to_rad(-80), deg_to_rad(80))`,
          output: '[Godot 3D]: Câmera FPS em primeira pessoa com clamp vertical rodando a 60 FPS.',
          lang: 'gdscript',
          exercise: {
            id: 'ex-godot-med-1',
            prompt: 'No Godot 4 3D, qual nó é utilizado para configurar efeitos de pós-processamento como Glow, Neblina e Oclusão de Ambiente (SSAO)?',
            type: 'multiple_choice',
            options: ['WorldEnvironment', 'MeshInstance3D', 'DirectionalLight3D', 'CollisionShape3D'],
            correctAnswer: 'WorldEnvironment',
            hint: 'Nó que define as propriedades do ambiente e da atmosfera da cena.',
            explanation: 'O WorldEnvironment contém o recurso Environment que gerencia Sky, Iluminação Global, Tonemapping e efeitos de pós-processamento.',
          },
        },
      ],
      avancado: [
        {
          title: '4. Shaders em Godot (GDShader) & Otimização de Draw Calls',
          desc: 'Escreva shaders de fragmento e vértice em GDShader e use MultiMeshInstance para renderizar florestas inteiras.',
          theory: [
            {
              title: 'Linguagem GDShader e MultiMeshInstance',
              text: 'O GDShader é uma linguagem baseada em GLSL com funções embutidas para spatial, canvas_item e particles. O nó MultiMeshInstance3D permite desenhar dezenas de milhares de árvores e rochas em um único Draw Call usando GPU Instancing.',
              keyPoints: [
                'shader_type spatial: Define um shader para objetos tridimensionais.',
                'MultiMeshInstance3D: Aloca matrizes de transformação de instâncias diretamente na VRAM da GPU.',
              ],
            },
          ],
          code: `shader_type spatial;

uniform vec4 water_color : source_color = vec4(0.1, 0.4, 0.8, 0.8);
uniform float wave_speed = 2.0;

void vertex() {
    // Animação de ondas de água no vértice
    VERTEX.y += sin(VERTEX.x * 2.0 + TIME * wave_speed) * 0.15;
}

void fragment() {
    ALBEDO = water_color.rgb;
    ROUGHNESS = 0.1;
    METALLIC = 0.0;
}`,
          output: '[GDShader]: Shader de água ondulada compilado via Vulkan Pipeline. 0 erros.',
          lang: 'gdscript',
          exercise: {
            id: 'ex-godot-adv-1',
            prompt: 'Qual nó do Godot 4 deve ser utilizado para renderizar 50.000 instâncias de grama ou pedras com altíssimo desempenho e quase nenhum Draw Call extra?',
            type: 'multiple_choice',
            options: ['MultiMeshInstance3D', 'Sprite3D', 'Area3D', 'AnimationPlayer'],
            correctAnswer: 'MultiMeshInstance3D',
            hint: 'Utiliza GPU Instancing para desenhar milhares de cópias da mesma malha.',
            explanation: 'MultiMeshInstance3D desenha milhares de instâncias da mesma geometria com um único comando de renderização enviado à GPU.',
          },
        },
      ],
      projetos: [
        {
          title: '5. Projeto: Exportação Multiplataforma no Godot (Windows, Linux & Android)',
          desc: 'Configure templates de exportação, presets com compressão de texturas e geração de builds finais.',
          theory: [
            {
              title: 'Export Templates e Empacotamento',
              text: 'O Godot gera executáveis autocontidos de tamanho extremamente reduzido (geralmente entre 25MB e 45MB) empacotando os recursos em um arquivo `.pck` rápido.',
              keyPoints: [
                'PCK File: Arquivo de pacote com todos os scripts e assets compactados.',
                'Android Export: Configuração do Android SDK e OpenJDK para geração direta de APK/AAB assinados.',
              ],
            },
          ],
          code: `// Resumo de exportação via linha de comando
// godot --headless --export-release "Windows Desktop" builds/meu_jogo.exe
// godot --headless --export-release "Android" builds/meu_jogo.apk`,
          output: '[Godot Export]: Build Windows x64 e Android APK gerados com sucesso (32.4 MB).',
          lang: 'gdscript',
          exercise: {
            id: 'ex-godot-proj-1',
            prompt: 'Qual arquivo complementar o Godot gera junto ao executável contendo todos os assets e scripts do jogo?',
            type: 'multiple_choice',
            options: ['.pck (Package)', '.mp3', '.obj', '.dll'],
            correctAnswer: '.pck (Package)',
            hint: 'É o formato de empacotamento nativo do motor.',
            explanation: 'O arquivo .pck armazena toda a árvore de cenas, texturas, áudios e bytecode compilado de forma otimizada para carregamento rápido.',
          },
        },
      ],
    },
    quizzesByLevel: {
      iniciante: [
        {
          id: 'q-godot-ini-1',
          question: 'O que representa uma "Cena" no Godot Engine?',
          options: [
            'Uma árvore hierárquica de nós que pode representar desde um botão individual até um personagem ou fase inteira',
            'Apenas um arquivo de vídeo pré-gravado',
            'Uma imagem de fundo estática',
            'Um arquivo de texto sem formatação',
          ],
          correctIndex: 0,
          explanation: 'No Godot, qualquer agrupamento de nós é uma cena reutilizável e instanciável.',
        },
      ],
      intermediario: [
        {
          id: 'q-godot-med-1',
          question: 'Em GDScript, como se conecta um sinal a uma função receptora?',
          options: ['meu_sinal.connect(funcao_alvo)', 'meu_sinal.send(funcao)', 'call(meu_sinal)', 'Signal.bind()'],
          correctIndex: 0,
          explanation: 'A sintaxe moderna do Godot 4 utiliza o método `.connect()` diretamente no objeto de sinal tipado.',
        },
      ],
      avancado: [
        {
          id: 'q-godot-adv-1',
          question: 'Por que o MultiMeshInstance3D é tão eficiente para desenhar florestas e vegetação?',
          options: [
            'Porque desenha milhares de instâncias da mesma malha através de GPU Instancing com 1 único Draw Call',
            'Porque desliga a placa de vídeo',
            'Porque usa apenas 2D',
            'Porque grava tudo em arquivos MP3',
          ],
          correctIndex: 0,
          explanation: 'O hardware gráfico desenha todas as cópias de uma vez usando uma matriz de dados de instâncias.',
        },
      ],
      projetos: [
        {
          id: 'q-godot-proj-1',
          question: 'Como rodar uma exportação automatizada do Godot sem abrir a interface gráfica do editor?',
          options: ['Usando a flag --headless na linha de comando', 'Clicando 10 vezes no ícone', 'Reiniciando o computador', 'Desinstalando o editor'],
          correctIndex: 0,
          explanation: 'A flag --headless executa o motor em modo CLI perfeito para pipelines de CI/CD.',
        },
      ],
    },
  },

  // =========================================================================
  // MULTIPLAYER & GAME NETWORKING
  // =========================================================================
  game_multiplayer: {
    topicsByLevel: {
      iniciante: [
        {
          title: '1. Fundamentos de Redes: TCP vs UDP & Sockets para Jogos',
          desc: 'Entenda por que jogos em tempo real usam UDP, perda de pacotes, headers e latência (Ping/RTT).',
          theory: [
            {
              title: 'Por que Jogos Usam UDP em vez de TCP?',
              text: 'O TCP garante entrega e ordem com retransmissões automáticas. Em jogos de ação rápida, se um pacote de posição for perdido, não queremos esperar uma retransmissão de 150ms atrás — a posição antiga já é inútil! O UDP envia dados sem handshake, permitindo que a camada de aplicação do jogo decida o que é crítico e o que é descartável.',
              keyPoints: [
                'TCP (Reliable & Ordered): Usado para Autenticação, Chat, Inventário e Compras de Loja.',
                'UDP (Fast & Unreliable): Usado para Posição de Jogadores, Velocidades, Tiros e Física em Tempo Real.',
                'RTT (Round-Trip Time / Ping): O tempo que um pacote leva para ir da sua máquina ao servidor e voltar.',
              ],
            },
          ],
          code: `// Conceito de envio de pacote UDP leve para posição
struct PlayerInputPacket
{
    uint32_t sequenceNumber;
    float moveX;
    float moveY;
    uint16_t buttonsPressed;
    uint64_t clientTimestamp;
}; // Apenas 24 bytes por pacote via UDP!`,
          output: '[Socket UDP]: 60 pacotes/segundo transmitidos para 198.51.100.24:7777. Ping: 28ms.',
          lang: 'cpp',
          exercise: {
            id: 'ex-net-ini-1',
            prompt: 'Por que protocolos baseados em UDP são preferidos em jogos de ação multiplayer em tempo real (como shooters e corrida)?',
            type: 'multiple_choice',
            options: [
              'Porque UDP não possui o atraso (overhead) de retransmissão de dados antigos e permite enviar atualizações contínuas com menor latência possível',
              'Porque UDP é criptografado por satélite',
              'Porque TCP não funciona na internet',
              'Porque UDP aumenta a resolução da tela',
            ],
            correctAnswer: 'Porque UDP não possui o atraso (overhead) de retransmissão de dados antigos e permite enviar atualizações contínuas com menor latência possível',
            hint: 'Dados de posição atrasados perdem a utilidade quando novos dados já estão disponíveis.',
            explanation: 'O UDP transmite pacotes leves sem travar a fila de rede esperando dados antigos perdidos (Head-of-Line Blocking do TCP).',
          },
        },
        {
          title: '2. Arquitetura Cliente-Servidor Autoritativo vs P2P',
          desc: 'Descubra por que Peer-to-Peer facilita trapaças e como servidores autoritativos protegem a integridade da partida.',
          theory: [
            {
              title: 'Authoritative Server vs Peer-to-Peer (P2P)',
              text: 'Em P2P, cada jogador conversa diretamente com os outros, permitindo que um jogador mal-intencionado minta sobre sua própria vida ou teletransporte. No modelo Cliente-Servidor Autoritativo, o servidor é a única fonte da verdade (Source of Truth).',
              keyPoints: [
                'Client-Side Input Sending: O cliente envia apenas intenções ("Pressionei W e Espaço").',
                'Server Simulation: O servidor aplica a física e devolve o estado final ("Você está na posição [10, 2, 5]").',
              ],
            },
          ],
          code: `// Loop do Servidor Autoritativo (Tick Rate: 60Hz)
void ServerGameLoop::Tick(float deltaTime)
{
    // 1. Processa pacotes de input recebidos de todos os clientes
    ProcessClientInputs();

    // 2. Simula física e regras do mundo
    WorldPhysics::Step(deltaTime);

    // 3. Serializa e envia o Snapshot do mundo para os clientes
    BroadcastWorldSnapshot();
}`,
          output: '[Server]: Tick #14290 processado em 2.1ms. Snapshot transmitido para 8 clientes.',
          lang: 'cpp',
          exercise: {
            id: 'ex-net-ini-2',
            prompt: 'No modelo Cliente-Servidor Autoritativo, o que o jogador local envia pela rede quando clica para atirar?',
            type: 'multiple_choice',
            options: [
              'Um comando de intenção de disparo (Input) com a direção da mira para que o servidor decida se o tiro acertou',
              'Uma mensagem dizendo "Eu causei 100 de dano no jogador 2"',
              'A imagem da tela do cliente',
              'O código fonte do jogo',
            ],
            correctAnswer: 'Um comando de intenção de disparo (Input) com a direção da mira para que o servidor decida se o tiro acertou',
            hint: 'O cliente nunca deve decidir o resultado de dano por conta própria.',
            explanation: 'Enviar apenas o input garante que o servidor valide se o jogador realmente tinha munição, estava vivo e tinha linha de visão, evitando cheats.',
          },
        },
      ],
      intermediario: [
        {
          title: '3. Previsão no Cliente (Client-Side Prediction) & Reconciliação',
          desc: 'Elimine a sensação de atraso (Lag) simulando o movimento localmente antes da resposta do servidor.',
          theory: [
            {
              title: 'Client Prediction e Server Reconciliation',
              text: 'Se o jogador precisasse esperar 100ms de ping para o servidor responder antes de dar um passo, o controle pareceria pesado e lento. O cliente prevê o movimento imediatamente. Quando a resposta do servidor chega com um número de sequência antigo, o cliente descarta inputs já confirmados e reaplica os inputs pendentes (Reconciliation).',
              keyPoints: [
                'Input Sequence Numbers: Cada comando do jogador recebe um ID sequencial incremental.',
                'Histórico de Estados (Buffer): O cliente guarda uma fila dos últimos 60 inputs e posições.',
                'Erro de Posição (Snap vs Lerp): Se a diferença entre a previsão e a confirmação do servidor for pequena, interpola suavemente para corrigir sem dar "pulos" visuais.',
              ],
            },
          ],
          code: `// Conceito de Reconciliação no Cliente
void ClientPlayer::OnServerStateReceived(ServerStateSnapshot serverState)
{
    // 1. Volta para a posição autorizada pelo servidor
    predictedPosition = serverState.confirmedPosition;

    // 2. Remove da fila os inputs que o servidor já processou
    inputBuffer.RemoveAllBeforeSequence(serverState.lastProcessedSequence);

    // 3. Re-simula todos os inputs restantes que o servidor ainda não viu!
    for (const auto& pendingInput : inputBuffer)
    {
        predictedPosition += CalculateStep(pendingInput);
    }
}`,
          output: '[Net Prediction]: Reconciliação executada (Seq #4102). Desvio de 0.02m corrigido suavemente.',
          lang: 'cpp',
          exercise: {
            id: 'ex-net-med-1',
            prompt: 'O que o "Client-Side Prediction" proporciona ao jogador em um jogo online com latência de 80ms?',
            type: 'multiple_choice',
            options: [
              'Faz com que o personagem responda instantaneamente aos comandos de movimento na tela local sem esperar a resposta do servidor',
              'Aumenta a velocidade da internet',
              'Garante vitória automática na partida',
              'Desativa as colisões do jogo',
            ],
            correctAnswer: 'Faz com que o personagem responda instantaneamente aos comandos de movimento na tela local sem esperar a resposta do servidor',
            hint: 'O cliente calcula onde o avatar estará antes da confirmação do servidor.',
            explanation: 'A previsão no cliente cria a sensação de resposta local instantânea de 0ms, enquanto o servidor valida em segundo plano.',
          },
        },
        {
          title: '4. Compensação de Lag (Lag Compensation) & Hitscan Rewind',
          desc: 'Implemente registro de tiros justo: como o servidor "volta no tempo" para verificar onde o alvo estava na tela do atirador.',
          theory: [
            {
              title: 'Compensação de Atraso em Tiros (Lag Compensation)',
              text: 'Quando um jogador com 60ms de ping atira em um inimigo em movimento, na tela dele o tiro foi na cabeça, mas no servidor o inimigo já andou alguns centímetros. O servidor mantém um buffer dos últimos 1 segundo de posições de todos os jogadores. Ao receber o tiro, o servidor volta a posição de todos os alvos para o timestamp exato do momento do disparo!',
              keyPoints: [
                'Time Rewind (Rebobinamento Temporal): Reposiciona as caixas de colisão (Hitboxes) no momento exato do passado.',
                'Raycast no Passado: Executa o tiro no estado histórico.',
                'Restauração Imediata: Retorna todos os jogadores para o presente do servidor.',
              ],
            },
          ],
          code: `// Conceito de Lag Compensation no Servidor
void ServerCombat::ProcessShot(Player* shooter, uint64_t clientTimestamp, Ray shotRay)
{
    // 1. Salva posições presentes
    SaveCurrentPoses();

    // 2. Rebobina as hitboxes de todos os alvos para o timestamp do tiro
    RewindHitboxesToTimestamp(clientTimestamp);

    // 3. Executa a checagem de colisão do tiro
    if (Physics::Raycast(shotRay, out HitResult hit))
    {
        hit.actor->ApplyDamage(shooter->weaponDamage);
    }

    // 4. Restaura as posições para o tempo presente
    RestoreCurrentPoses();
}`,
          output: '[Lag Compensation]: Tiro do Player 1 rebobinado em 52ms. Headshot confirmado no passado.',
          lang: 'cpp',
          exercise: {
            id: 'ex-net-med-2',
            prompt: 'Como a "Compensação de Lag" (Lag Compensation) no servidor resolve o problema de atirar em jogadores que estão se movendo?',
            type: 'multiple_choice',
            options: [
              'O servidor rebobina temporariamente a posição das hitboxes de todos os alvos para o momento exato em que o tiro foi disparado pelo atirador',
              'O servidor aumenta o tamanho das balas para cobrir todo o mapa',
              'O servidor congela todos os jogadores por 1 segundo',
              'O servidor desconecta o jogador que estiver correndo',
            ],
            correctAnswer: 'O servidor rebobina temporariamente a posição das hitboxes de todos os alvos para o momento exato em que o tiro foi disparado pelo atirador',
            hint: 'Permite que o atirador mire onde vê o inimigo na tela sem precisar "adivinhar" o adiantamento por causa do ping.',
            explanation: 'O rebobinamento temporal garante que "o que você viu na sua tela quando puxou o gatilho" seja honrado pelo servidor de forma justa.',
          },
        },
      ],
      avancado: [
        {
          title: '5. Matchmaking, Lobbies, Autenticação & Dedicated Servers',
          desc: 'Construa infraestrutura de partidas com filas de busca baseadas em ELO/MMR, salas de espera e servidores orquestrados.',
          theory: [
            {
              title: 'Infraestrutura de Partidas Multiplayer',
              text: 'Um sistema completo envolve: Servidor de Autenticação (JWT / Steam Ticket) -> Sistema de Matchmaking (agrupa jogadores por nível de habilidade MMR e região) -> Orquestrador de Servidores (instancia instâncias de Dedicated Servers no Docker/Kubernetes sob demanda).',
              keyPoints: [
                'Ticket de Matchmaking: O cliente solicita entrada na fila informando região (ex: `sa-east-1`) e latência máxima.',
                'Agones / Fleet Orchestration: Frameworks baseados em Kubernetes para escalar servidores dedicados de jogos.',
              ],
            },
          ],
          code: `// Resumo de payload JSON de Matchmaking
{
  "ticketId": "match_884910",
  "playerId": "usr_9921",
  "mmr": 1650,
  "region": "sa-brazil",
  "status": "MATCH_FOUND",
  "serverEndpoint": "200.180.45.10:7777",
  "matchSecret": "token_secure_49201"
}`,
          output: '[Matchmaker]: Partida 5v5 balanceada (MMR Médio: 1640). Servidor dedicado instanciado em 1.4s.',
          lang: 'cpp',
          exercise: {
            id: 'ex-net-adv-1',
            prompt: 'Qual é o papel do sistema de Matchmaking em jogos multiplayer modernos?',
            type: 'multiple_choice',
            options: [
              'Agrupar jogadores de níveis de habilidade (MMR) semelhantes e na mesma região geográfica para disputar uma partida equilibrada com baixo ping',
              'Trocar a cor dos uniformes',
              'Calcular o preço das armas na loja',
              'Instalar o jogo no computador',
            ],
            correctAnswer: 'Agrupar jogadores de níveis de habilidade (MMR) semelhantes e na mesma região geográfica para disputar uma partida equilibrada com baixo ping',
            hint: 'Cria partidas justas e com baixa latência para todos.',
            explanation: 'O Matchmaker equilibra o nível de jogo competitivo e a proximidade de rede entre os participantes.',
          },
        },
        {
          title: '6. Anti-Cheat & Segurança: Validação de Velocidade, Teleporte e Aimbot',
          desc: 'Proteja o servidor contra Speedhack, Teleporte, Flyhack e injeções de memória.',
          theory: [
            {
              title: 'Camadas de Proteção Anti-Cheat no Servidor',
              text: 'A regra número 1 da segurança multiplayer é: "Nunca confie no cliente". Validações heurísticas no servidor verificam se a distância percorrida entre dois ticks ultrapassa a velocidade máxima permitida (Speedhack check) ou se o jogador atirou com ângulos humanamente impossíveis (Aimbot detection).',
              keyPoints: [
                'Speed Check: `if (deltaPosition.Length() > maxSpeed * deltaTime + tolerance) RejectAndReset();`',
                'Line of Sight Validation: Raycast no servidor para garantir que o tiro não atravessou 3 paredes sólidas (Wallhack block).',
                'Encryption de Pacotes: Assinatura HMAC de pacotes para evitar tampering de dados.',
              ],
            },
          ],
          code: `// Verificação Anti-Speedhack no Servidor
bool ValidatePlayerMovement(Player* p, FVector newPos, float dt)
{
    float distanceMoved = FVector::Distance(p->GetPosition(), newPos);
    float maxAllowed = (p->GetMaxSpeed() * dt) + 0.15f; // margem de tolerância

    if (distanceMoved > maxAllowed)
    {
        UE_LOG(LogSecurity, Warning, TEXT("Speedhack detectado para jogador %s! Resetando posição."), *p->GetName());
        p->ForceTeleport(p->GetPosition()); // Reseta para posição válida
        return false;
    }
    return true;
}`,
          output: '[Anti-Cheat Server]: Tentativa de movimentação ilegal rejeitada (Velocidade detectada: 450 m/s > Max: 8 m/s).',
          lang: 'cpp',
          exercise: {
            id: 'ex-net-adv-2',
            prompt: 'Qual é a regra mais fundamental da segurança e combate a trapaças em jogos multiplayer online?',
            type: 'multiple_choice',
            options: [
              'Nunca confiar no cliente: todas as ações críticas devem ser validadas e autorizadas pelo servidor',
              'Confiar sempre no que o cliente envia para economizar CPU no servidor',
              'Bloquear todos os usuários que usam mouse',
              'Exigir que todos joguem na mesma sala física',
            ],
            correctAnswer: 'Nunca confiar no cliente: todas as ações críticas devem ser validadas e autorizadas pelo servidor',
            hint: 'Clientes podem ser modificados por ferramentas de injeção de código na máquina do jogador.',
            explanation: 'Como a memória do cliente pode ser alterada por cheats, apenas o servidor autoritativo pode ter a palavra final sobre vida, posições e validações de combate.',
          },
        },
      ],
      projetos: [
        {
          title: '7. Projeto: Arquitetura de Servidor Dedicado Standalone com WebSockets / UDP',
          desc: 'Monte um servidor de jogo completo pronto para deploy na nuvem com gerenciamento de salas.',
          theory: [
            {
              title: 'Deploy e Operação de Servidores de Jogos',
              text: 'Servidores dedicados rodam sem interface gráfica (Headless/No-Graphics), consumindo o mínimo de memória e CPU para suportar centenas de instâncias simultâneas em servidores Linux na nuvem.',
              keyPoints: [
                'Docker Containers: Empacotamento do binário headless do jogo.',
                'Port Forwarding & NAT Punchthrough: Técnicas para conectar jogadores atrás de roteadores residenciais.',
              ],
            },
          ],
          code: `// Resumo de Dockerfile de Servidor Dedicado
// FROM ubuntu:22.04
// RUN apt-get update && apt-get install -y libssl-dev
// COPY ./DedicatedServerLinux /app/
// EXPOSE 7777/udp
// CMD ["/app/DedicatedServerLinux", "-batchmode", "-nographics", "-port=7777"]`,
          output: '[Server Container]: Servidor Dedicado executando em modo Headless. Uso de RAM: 145 MB.',
          lang: 'cpp',
          exercise: {
            id: 'ex-net-proj-1',
            prompt: 'Por que servidores dedicados de jogos rodam em modo "Headless / No-Graphics"?',
            type: 'multiple_choice',
            options: [
              'Para economizar memória RAM e CPU, eliminando todo o processamento de renderização visual e sons desnecessários em um servidor na nuvem',
              'Porque computadores de servidor não têm processador',
              'Para que ninguém consiga ver o código',
              'Para desligar a internet',
            ],
            correctAnswer: 'Para economizar memória RAM e CPU, eliminando todo o processamento de renderização visual e sons desnecessários em um servidor na nuvem',
            hint: 'Servidores só precisam calcular a matemática da física e da rede, sem desenhar pixels.',
            explanation: 'Rodar sem interface gráfica permite que uma única máquina potente na nuvem execute dezenas de salas de partidas simultâneas com custo reduzido.',
          },
        },
      ],
    },
    quizzesByLevel: {
      iniciante: [
        {
          id: 'q-multi-ini-1',
          question: 'Em redes para jogos, o que significa "RTT" (Round-Trip Time)?',
          options: [
            'O tempo total que um pacote leva para ir do cliente até o servidor e retornar',
            'A quantidade de memória de vídeo livre',
            'A taxa de quadros por segundo',
            'O número de jogadores na sala',
          ],
          correctIndex: 0,
          explanation: 'RTT mede a latência de ida e volta da conexão de rede.',
        },
      ],
      intermediario: [
        {
          id: 'q-multi-med-1',
          question: 'Qual é o objetivo principal da Reconciliação no Cliente (Server Reconciliation)?',
          options: [
            'Corrigir suavemente pequenos desvios de posição entre a previsão local do jogador e a confirmação autorizada do servidor',
            'Apagar o mapa do jogo',
            'Dobrar a velocidade dos tiros',
            'Desligar o som do microfone',
          ],
          correctIndex: 0,
          explanation: 'A reconciliação alinha o estado local ao estado oficial do servidor sem causar travamentos bruscos.',
        },
      ],
      avancado: [
        {
          id: 'q-multi-adv-1',
          question: 'Por que a validação de movimento no servidor previne trapaças como Teleporte e Speedhack?',
          options: [
            'Porque o servidor verifica se a distância percorrida no tempo decorrido respeita a velocidade máxima física permitida',
            'Porque o servidor fecha o jogo se o jogador correr',
            'Porque todos os jogadores ficam parados',
            'Porque o servidor grava a webcam do jogador',
          ],
          correctIndex: 0,
          explanation: 'O servidor rejeita e reposiciona qualquer tentativa de mover o avatar além do limite físico permitido.',
        },
      ],
      projetos: [
        {
          id: 'q-multi-proj-1',
          question: 'Como servidores dedicados escalam dinamicamente na nuvem para acomodar milhares de partidas?',
          options: [
            'Usando orquestradores de containers (como Kubernetes/Agones) que criam instâncias sob demanda conforme jogadores entram na fila',
            'Comprando novos computadores físicos toda semana manualmente',
            'Limitando o jogo a 10 pessoas por dia',
            'Desligando o servidor à noite',
          ],
          correctIndex: 0,
          explanation: 'Orquestradores de contêineres sobem e derrubam instâncias de servidores de forma automática e elástica.',
        },
      ],
    },
  },

  // =========================================================================
  // MOBILE GAME DEV (Android SDK, Gradle, Touch, Mobile UI, Battery, Ads/IAP)
  // =========================================================================
  game_mobile_dev: {
    topicsByLevel: {
      iniciante: [
        {
          title: '1. Arquitetura Mobile: Android SDK, Gradle, APK vs AAB',
          desc: 'Configure o pipeline de compilação mobile, Android NDK, Gradle e o novo formato Android App Bundle (.aab).',
          theory: [
            {
              title: 'O Formato AAB (Android App Bundle)',
              text: 'A Google Play exige a publicação no formato AAB em vez do antigo APK monolítico. Com o AAB, a Google Play gera APKs customizados sob medida para cada aparelho, baixando apenas os assets de textura e código nativo (ARM64) compatíveis com o celular do usuário.',
              keyPoints: [
                'Target API Level: Sempre mantenha alinhado com a versão mínima exigida pela Google Play Console (Android 14+ / API 34).',
                'Android NDK: Compila o código C++/IL2CPP para bibliotecas nativas de alto desempenho (.so).',
                'Asset Delivery (Play Asset Delivery / PAD): Permite jogos com mais de 2GB sem custo extra de download.',
              ],
            },
          ],
          code: `// Trecho conceitual de build.gradle para jogos Android
android {
    compileSdkVersion 34
    defaultConfig {
        applicationId "com.estudio.meujogo"
        minSdkVersion 24 // Android 7.0+
        targetSdkVersion 34 // Android 14
        versionCode 1
        versionName "1.0.0"
        ndk {
            abiFilters 'arm64-v8a' // Foco em 64-bit
        }
    }
}`,
          output: '[Gradle]: Compilação release finalizada. Arquivo "app-release.aab" gerado e assinado com Keystore.',
          lang: 'java',
          exercise: {
            id: 'ex-mob-ini-1',
            prompt: 'Qual é o formato de pacote obrigatório exigido pela Google Play Store para publicação de novos jogos Android?',
            type: 'multiple_choice',
            options: ['AAB (Android App Bundle)', 'APK simples', 'EXE', 'ZIP'],
            correctAnswer: 'AAB (Android App Bundle)',
            hint: 'Permite que a loja gere downloads otimizados para a arquitetura de cada aparelho.',
            explanation: 'O AAB permite o Dynamic Delivery da Google Play, gerando instaladores menores e específicos para a GPU e idioma de cada celular.',
          },
        },
        {
          title: '2. Controles Touch: Virtual Joysticks, Gestos & Multi-Touch',
          desc: 'Implemente analógicos virtuais responsivos na tela, detecção de toques simultâneos, swipes e pinças.',
          theory: [
            {
              title: 'Design Ergonômico de Controles Touch',
              text: 'Jogadores mobile têm mãos de tamanhos diferentes. Joysticks flutuantes dinâmicos (Dynamic Floating Joysticks) que aparecem exatamente onde o polegar toca na tela oferecem uma experiência muito superior a botões fixos rígidos.',
              keyPoints: [
                'FingerID Tracking: Acompanhe múltiplos dedos simultaneamente com `Input.GetTouch(i).fingerId`.',
                'Deadzone Touch: Pequeno raio onde o toque não gera movimento para evitar tremores involuntários dos dedos.',
                'TouchPhase: `Began`, `Moved`, `Stationary`, `Ended`, `Canceled`.',
              ],
            },
          ],
          code: `using UnityEngine;
using UnityEngine.EventSystems;

public class FloatingVirtualJoystick : MonoBehaviour, IPointerDownHandler, IDragHandler, IPointerUpHandler
{
    [SerializeField] private RectTransform joystickBackground;
    [SerializeField] private RectTransform joystickHandle;
    [SerializeField] private float handleLimit = 100f;

    public Vector2 Direction { get; private set; }

    public void OnPointerDown(PointerEventData eventData)
    {
        joystickBackground.position = eventData.position;
        joystickBackground.gameObject.SetActive(true);
        OnDrag(eventData);
    }

    public void OnDrag(PointerEventData eventData)
    {
        Vector2 pos = eventData.position - (Vector2)joystickBackground.position;
        Direction = Vector2.ClampMagnitude(pos, handleLimit) / handleLimit;
        joystickHandle.anchoredPosition = Direction * handleLimit;
    }

    public void OnPointerUp(PointerEventData eventData)
    {
        Direction = Vector2.zero;
        joystickHandle.anchoredPosition = Vector2.zero;
        joystickBackground.gameObject.SetActive(false);
    }
}`,
          output: '[Touch Input]: Analógico virtual flutuante ativado no toque (Pos: [240, 180]). Vetor: [0.85, 0.52].',
          lang: 'csharp',
          exercise: {
            id: 'ex-mob-ini-2',
            prompt: 'Por que é importante rastrear o "fingerId" de cada toque ao programar controles mobile em jogos com múltiplos botões?',
            type: 'multiple_choice',
            options: [
              'Para que o toque do analógico esquerdo não seja confundido ou cancelado quando o jogador tocar no botão de pulo ou tiro com a mão direita',
              'Para salvar a impressão digital do jogador',
              'Para que a tela fique mais brilhante',
              'Para economizar bateria',
            ],
            correctAnswer: 'Para que o toque do analógico esquerdo não seja confundido ou cancelado quando o jogador tocar no botão de pulo ou tiro com a mão direita',
            hint: 'Multi-touch exige diferenciar qual dedo pertence a qual controle na tela.',
            explanation: 'O fingerId identifica unicamente cada dedo em contato com a tela, garantindo que o movimento contínuo não seja interrompido por toques em outros botões.',
          },
        },
      ],
      intermediario: [
        {
          title: '3. UI Adaptativa: Safe Area (Notch / Ilha Dinâmica) & Múltiplas Resoluções',
          desc: 'Evite que menus e botões fiquem escondidos atrás da câmera frontal (Notch) ou cantos arredondados de celulares.',
          theory: [
            {
              title: 'O Desafio da Safe Area Mobile',
              text: 'Smartphones modernos possuem entalhes de câmera (Notch), orifícios (Punch-hole), barras de gestos inferiores e cantos curvos. A API `Screen.safeArea` retorna o retângulo seguro onde a interface pode ser desenhada sem risco de cortes.',
              keyPoints: [
                'Screen.safeArea: Retorna coordenadas (x, y, width, height) livres de obstruções físicas.',
                'Âncoras Percentuais: Converte a Safe Area em porcentagens de âncoras Min/Max no RectTransform raiz da UI.',
              ],
            },
          ],
          code: `using UnityEngine;

[RequireComponent(typeof(RectTransform))]
public class SafeAreaFitter : MonoBehaviour
{
    private RectTransform rectTransform;

    private void Awake()
    {
        rectTransform = GetComponent<RectTransform>();
        ApplySafeArea();
    }

    public void ApplySafeArea()
    {
        Rect safeArea = Screen.safeArea;
        Vector2 minAnchor = safeArea.position;
        Vector2 maxAnchor = minAnchor + safeArea.size;

        minAnchor.x /= Screen.width;
        minAnchor.y /= Screen.height;
        maxAnchor.x /= Screen.width;
        maxAnchor.y /= Screen.height;

        rectTransform.anchorMin = minAnchor;
        rectTransform.anchorMax = maxAnchor;
    }
}`,
          output: '[Mobile UI]: Safe Area ajustada. Top Offset: 48px (Notch compensado). Bottom Offset: 24px.',
          lang: 'csharp',
          exercise: {
            id: 'ex-mob-med-1',
            prompt: 'Qual API deve ser usada em jogos mobile para evitar que botões fiquem escondidos atrás da câmera frontal (Notch) do celular?',
            type: 'multiple_choice',
            options: ['Screen.safeArea', 'Camera.main.pixelRect', 'Input.mousePosition', 'SystemInfo.deviceModel'],
            correctAnswer: 'Screen.safeArea',
            hint: 'Retorna a área segura onde não há obstruções físicas de hardware na tela.',
            explanation: 'Screen.safeArea fornece as dimensões exatas livres de entalhes e barras do sistema operacional, permitindo ajustar a UI automaticamente.',
          },
        },
        {
          title: '4. Otimização Térmica, Bateria & Profiling de GPU/CPU Mobile',
          desc: 'Evite superaquecimento de celulares: limite de taxa de quadros (Application.targetFrameRate), compressão ASTC e VSync.',
          theory: [
            {
              title: 'Thermal Throttling e Gestão de Bateria',
              text: 'Se um jogo mobile rodar a 120 FPS desbloqueado sem necessidade, o celular atingirá 45ºC em minutos e entrará em Thermal Throttling (a CPU derruba a frequência pela metade, gerando travamentos horríveis). Limitar o jogo a 60 ou 30 FPS economiza mais de 40% de bateria e mantém o celular frio.',
              keyPoints: [
                'Application.targetFrameRate = 60: Limite estável para jogos casuais e de ação.',
                'Compressão de Texturas ASTC: O padrão ouro para mobile, economizando até 75% de VRAM sem perda perceptível de qualidade.',
                'Half-Resolution Rendering: Renderiza a 3D em 720p enquanto a UI permanece nítida em 1080p nativo.',
              ],
            },
          ],
          code: `using UnityEngine;

public class MobileBatteryOptimizer : MonoBehaviour
{
    private void Awake()
    {
        // Limita FPS para evitar superaquecimento
        Application.targetFrameRate = 60;
        QualitySettings.vSyncCount = 0;

        // Impede que a tela apague por inatividade
        Screen.sleepTimeout = SleepTimeout.NeverSleep;
    }
}`,
          output: '[Mobile Profile]: FPS travado em 60. Consumo térmico: Normal (36.2ºC). 180MB RAM.',
          lang: 'csharp',
          exercise: {
            id: 'ex-mob-med-2',
            prompt: 'O que é o "Thermal Throttling" em dispositivos móveis e por que devemos evitá-lo em nossos jogos?',
            type: 'multiple_choice',
            options: [
              'É a redução automática da velocidade da CPU/GPU pelo sistema operacional para evitar superaquecimento da bateria, causando quedas severas de FPS',
              'Um efeito especial de fogo no jogo',
              'Uma função para recarregar a bateria mais rápido',
              'O download de novas fases',
            ],
            correctAnswer: 'É a redução automática da velocidade da CPU/GPU pelo sistema operacional para evitar superaquecimento da bateria, causando quedas severas de FPS',
            hint: 'Aparelhos esquentam e reduzem o processamento para não danificar os componentes.',
            explanation: 'Ao manter o framerate estável e shaders leves, evitamos que o hardware atinja temperaturas críticas que ativam o corte de desempenho do celular.',
          },
        },
      ],
      avancado: [
        {
          title: '5. Monetização Ética: Anúncios (Rewarded Ads) & Compras In-App (IAP)',
          desc: 'Integre Google Play Billing para compras seguras de moedas e anúncios premiados sem prejudicar a retenção do jogador.',
          theory: [
            {
              title: 'Monetização Sustentável em Jogos Mobile',
              text: 'Anúncios Premiados (Rewarded Video Ads) são muito mais aceitos do que anúncios intrusivos (Interstitials) que interrompem o gameplay. O jogador escolhe assistir voluntariamente a um vídeo de 15s para dobrar as moedas ou ganhar uma vida extra.',
              keyPoints: [
                'Google Play Billing Client: Validação criptográfica de recibos de compra no servidor para evitar compras fraudulentas.',
                'Produtos Consumíveis vs Não-Consumíveis: Consumíveis (moedas/poções) podem ser comprados repetidamente; Não-Consumíveis (remover anúncios/desbloquear jogo completo) persistem para sempre e têm botão de Restaurar Compras.',
              ],
            },
          ],
          code: `using UnityEngine;

public class RewardedAdManager : MonoBehaviour
{
    public void ShowRewardedReward(System.Action onRewardEarned)
    {
        Debug.Log("Exibindo anúncio premiado com consentimento do usuário...");
        // Ao concluir com sucesso:
        onRewardEarned?.Invoke();
    }
}`,
          output: '[Monetization]: Anúncio premiado concluído. Recompensa +50 Moedas entregue com sucesso.',
          lang: 'csharp',
          exercise: {
            id: 'ex-mob-adv-1',
            prompt: 'Em jogos mobile, qual é a principal diferença entre um produto IAP "Consumível" e um "Não-Consumível"?',
            type: 'multiple_choice',
            options: [
              'Consumíveis podem ser comprados várias vezes (como pacotes de moedas); Não-Consumíveis são comprados apenas uma vez (como remover anúncios) e devem poder ser restaurados',
              'Consumíveis estragam após 3 dias',
              'Não-Consumíveis são de graça',
              'Consumíveis funcionam apenas offline',
            ],
            correctAnswer: 'Consumíveis podem ser comprados várias vezes (como pacotes de moedas); Não-Consumíveis são comprados apenas uma vez (como remover anúncios) e devem poder ser restaurados',
            hint: 'Itens permanentes exigem suporte ao botão "Restore Purchases" exigido pelas lojas.',
            explanation: 'Produtos não-consumíveis ficam vinculados permanentemente à conta da Google Play/Apple ID do jogador e devem ser restaurados se ele trocar de celular.',
          },
        },
      ],
      projetos: [
        {
          title: '6. Publicação na Google Play Console: Keystore, Ficha da Loja e Lançamento',
          desc: 'Gere a chave de assinatura Keystore, configure ícones adaptativos, screenshots, política de privacidade e publique na Google Play.',
          theory: [
            {
              title: 'Checklist de Publicação na Google Play',
              text: 'A publicação na Google Play exige: Geração de Keystore segura (nunca perca o arquivo .keystore), preenchimento da Classificação Indicativa (IARC), Política de Privacidade hospedada, ícones de alta resolução (512x512) e Banner de Destaque (1024x500).',
              keyPoints: [
                'Play App Signing: O Google gerencia e protege a chave de assinatura na nuvem.',
                'Testes Fechados / Abertos: Teste com pelo menos 20 testadores antes de enviar para a esteira de Produção.',
              ],
            },
          ],
          code: `// Comando para gerar Keystore via terminal
// keytool -genkey -v -keystore meu-jogo.keystore -alias meujogo -keyalg RSA -keysize 2048 -validity 10000`,
          output: '[Google Play Console]: AAB versão 1.0.0 enviado para a esteira de Testes Fechados com sucesso.',
          lang: 'csharp',
          exercise: {
            id: 'ex-mob-proj-1',
            prompt: 'Por que o arquivo de chave de assinatura (.keystore) do seu jogo Android deve ser guardado com backup seguro absoluto?',
            type: 'multiple_choice',
            options: [
              'Porque sem ele é impossível enviar atualizações futuras para o mesmo aplicativo na Google Play Store se o Play App Signing não estiver configurado',
              'Porque o arquivo apaga o código do jogo',
              'Porque ele define a velocidade do download',
              'Porque ele muda o idioma do celular',
            ],
            correctAnswer: 'Porque sem ele é impossível enviar atualizações futuras para o mesmo aplicativo na Google Play Store se o Play App Signing não estiver configurado',
            hint: 'A assinatura criptográfica comprova que a atualização veio do desenvolvedor legítimo.',
            explanation: 'A Keystore garante a identidade do desenvolvedor. A perda da chave original impede que novas versões do mesmo app sejam enviadas para a loja.',
          },
        },
      ],
    },
    quizzesByLevel: {
      iniciante: [
        {
          id: 'q-mob-ini-1',
          question: 'O que o formato AAB (Android App Bundle) faz para reduzir o tamanho de download dos jogos?',
          options: [
            'Permite que a Google Play gere APKs otimizados contendo apenas a resolução de texturas e arquitetura de CPU do aparelho específico que está baixando',
            'Apaga metade das fases do jogo',
            'Desativa todos os gráficos 3D',
            'Converte o jogo em texto puro',
          ],
          correctIndex: 0,
          explanation: 'O AAB divide os pacotes para entregar apenas o que o dispositivo do usuário realmente precisa.',
        },
      ],
      intermediario: [
        {
          id: 'q-mob-med-1',
          question: 'Por que a propriedade Screen.safeArea é crucial em smartphones modernos?',
          options: [
            'Para garantir que elementos importantes da interface não fiquem escondidos atrás de entalhes de câmera (Notch) ou cantos arredondados',
            'Para economizar internet',
            'Para deixar a tela preta',
            'Para desabilitar o toque',
          ],
          correctIndex: 0,
          explanation: 'A Safe Area delimita o retângulo seguro e desobstruído da tela.',
        },
      ],
      avancado: [
        {
          id: 'q-mob-adv-1',
          question: 'Por que travar o framerate em 60 FPS em jogos mobile costuma ser melhor do que deixar em FPS destravado?',
          options: [
            'Evita aquecimento excessivo da bateria, economiza energia e previne o Thermal Throttling que derruba a taxa de quadros bruscamente',
            'Para fazer o jogo parecer lento',
            'Porque celulares não aguentam mais que 10 FPS',
            'Para aumentar o tamanho do arquivo',
          ],
          correctIndex: 0,
          explanation: 'Travar o FPS evita esforço inútil da GPU/CPU, mantendo a temperatura baixa e a jogabilidade suave.',
        },
      ],
      projetos: [
        {
          id: 'q-mob-proj-1',
          question: 'Qual é o tamanho padrão do ícone de alta resolução exigido pela Google Play Console para a ficha do aplicativo?',
          options: ['512 x 512 pixels', '64 x 64 pixels', '1920 x 1080 pixels', '16 x 16 pixels'],
          correctIndex: 0,
          explanation: 'A Google Play exige ícone PNG com canal alfa no tamanho exato de 512x512 px.',
        },
      ],
    },
  },

  // =========================================================================
  // WINDOWS, STEAM & PUBLICAÇÃO DE JOGOS
  // =========================================================================
  game_pc_publishing: {
    topicsByLevel: {
      iniciante: [
        {
          title: '1. Arquitetura PC Windows: Builds x64, DirectX 12 & Suporte a Controles (Gamepad)',
          desc: 'Configure o novo Input System para suporte nativo a controle de Xbox, DualSense e Teclado/Mouse com remapeamento.',
          theory: [
            {
              title: 'Desenvolvimento Profissional para PC',
              text: 'Jogos de PC devem suportar nativamente troca instantânea entre controle (Gamepad XInput/DirectInput) e Teclado/Mouse, atualizando os ícones da interface (prompts de botões) dinamicamente com base no último dispositivo tocado.',
              keyPoints: [
                'PlayerInput com Auto-Switching: Detecta quando o jogador aperta uma tecla ou mexe o analógico.',
                'V-Sync e Taxas de Atualização Altas: Suporte a monitores 144Hz, 240Hz e telas Ultrawide (21:9 e 32:9).',
                'Janela Sem Bordas (Borderless Windowed): O modo padrão preferido por jogadores modernos no Windows.',
              ],
            },
          ],
          code: `using UnityEngine;
using UnityEngine.InputSystem;

public class DeviceDetector : MonoBehaviour
{
    [SerializeField] private PlayerInput playerInput;

    public void OnControlsChanged()
    {
        string scheme = playerInput.currentControlScheme;
        if (scheme == "Gamepad")
        {
            Debug.Log("Controle detectado! Exibindo ícones de [A], [B], [X], [Y].");
        }
        else
        {
            Debug.Log("Teclado/Mouse detectado! Exibindo [E], [Espaço], [Shift].");
        }
    }
}`,
          output: '[Input System]: Controle Xbox Series detectado. UI atualizada com ícones de botões do Gamepad.',
          lang: 'csharp',
          exercise: {
            id: 'ex-pc-ini-1',
            prompt: 'No desenvolvimento de jogos para PC no Windows, por que a interface deve alternar dinamicamente os ícones de botões (prompts)?',
            type: 'multiple_choice',
            options: [
              'Para que o jogador veja ícones de controle (A, B, X, Y) ao usar o Gamepad e ícones de teclado (E, Shift, Espaço) ao mexer no mouse',
              'Para mudar a língua do jogo para inglês',
              'Para desligar o monitor',
              'Para aumentar o volume dos efeitos sonoros',
            ],
            correctAnswer: 'Para que o jogador veja ícones de controle (A, B, X, Y) ao usar o Gamepad e ícones de teclado (E, Shift, Espaço) ao mexer no mouse',
            hint: 'Melhora a acessibilidade e clareza visual dos tutoriais e interações.',
            explanation: 'Alternar os ícones automaticamente de acordo com o último dispositivo utilizado proporciona uma experiência polida e profissional.',
          },
        },
      ],
      intermediario: [
        {
          title: '2. Integração com Steamworks SDK: Conquistas, Steam Cloud & Rich Presence',
          desc: 'Conecte seu jogo à API oficial da Steam (Steamworks.NET / Facepunch.Steamworks) para Conquistas e Salvamento em Nuvem.',
          theory: [
            {
              title: 'Ecossistema Steamworks',
              text: 'O Steamworks SDK integra o jogo à plataforma da Valve: Conquistas (SteamUserStats.SetAchievement), Salvamento em Nuvem (Steam Cloud), Leaderboards globais e Rich Presence ("No menu principal", "Em combate no Nível 5").',
              keyPoints: [
                'SteamAPI.Init(): Inicializa a conexão com o cliente Steam local.',
                'SteamUserStats.StoreStats(): Envia as conquistas desbloqueadas para os servidores da Valve.',
                'Steam Cloud: Sincroniza a pasta de saves do jogador entre computadores e Steam Deck automaticamente.',
              ],
            },
          ],
          code: `using UnityEngine;
using Steamworks;

public class SteamManagerScript : MonoBehaviour
{
    private void Start()
    {
        if (SteamAPI.Init())
        {
            string personaName = SteamFriends.GetPersonaName();
            Debug.Log($"Conectado à Steam como: {personaName} (AppID: {SteamUtils.GetAppID()})");
        }
        else
        {
            Debug.LogWarning("Steam não está aberta em segundo plano.");
        }
    }

    public void UnlockSteamAchievement(string achievementId)
    {
        SteamUserStats.SetAchievement(achievementId);
        SteamUserStats.StoreStats();
    }
}`,
          output: '[Steamworks]: SteamAPI conectada. Conquista "ACH_WIN_GAME" sincronizada com os servidores Steam.',
          lang: 'csharp',
          exercise: {
            id: 'ex-pc-med-1',
            prompt: 'Qual método da API Steamworks é responsável por persistir e registrar as conquistas desbloqueadas nos servidores da Valve?',
            type: 'multiple_choice',
            options: ['SteamUserStats.StoreStats()', 'SteamAPI.Shutdown()', 'SteamFriends.SetPersona()', 'SteamCloud.Format()'],
            correctAnswer: 'SteamUserStats.StoreStats()',
            hint: 'Sem chamar este método, a conquista fica apenas na memória temporária local.',
            explanation: 'StoreStats() faz o upload oficial dos novos dados de estatísticas e conquistas para a nuvem da Steam.',
          },
        },
      ],
      avancado: [
        {
          title: '3. Empacotamento de Instaladores (Inno Setup) & Pipeline do SteamPipe',
          desc: 'Crie instaladores profissionais (.exe com assistente e atalhos) com Inno Setup e publique builds via script do SteamPipe.',
          theory: [
            {
              title: 'Distribuição e Atualização com SteamPipe',
              text: 'A Valve utiliza o SteamPipe (ContentBuilder) para gerar atualizações delta (baixando apenas os bytes que foram modificados). Para distribuição fora da Steam (como no itch.io ou GOG), o Inno Setup gera instaladores elegantes e compactados.',
              keyPoints: [
                'Depot & App Build Script: Scripts `.vdf` que mapeiam quais pastas de binários pertencem a qual versão.',
                'Inno Setup Script (.iss): Cria o assistente de instalação com termos de licença, escolha de diretório e desinstalador limpo.',
              ],
            },
          ],
          code: `// Resumo de script Inno Setup (.iss)
[Setup]
AppName=MeuJogoEpico
AppVersion=1.0.0
DefaultDirName={autopf}\\MeuJogoEpico
DefaultGroupName=MeuJogoEpico
OutputDir=OutputInstaller
OutputBaseFilename=MeuJogo_Setup_v1.0.0
Compression=lzma2/ultra64
SolidCompression=yes

[Files]
Source: "Builds\\Windows\\*"; DestDir: "{app}"; Flags: recursesubdirs createallsubdirs

[Icons]
Name: "{group}\\MeuJogoEpico"; Filename: "{app}\\MeuJogo.exe"`,
          output: '[Inno Setup]: Instalador "MeuJogo_Setup_v1.0.0.exe" gerado com compressão LZMA2 (42 MB).',
          lang: 'csharp',
          exercise: {
            id: 'ex-pc-adv-1',
            prompt: 'Qual é o benefício do sistema SteamPipe da Valve para o envio de atualizações (patches) de jogos?',
            type: 'multiple_choice',
            options: [
              'Calcula diferenças binárias (deltas) e faz com que os jogadores baixem apenas os pequenos blocos de arquivos que mudaram, em vez de baixar o jogo inteiro de novo',
              'Exclui os saves do jogador',
              'Torna o jogo mais caro',
              'Obriga o uso de teclado antigo',
            ],
            correctAnswer: 'Calcula diferenças binárias (deltas) e faz com que os jogadores baixem apenas os pequenos blocos de arquivos que mudaram, em vez de baixar o jogo inteiro de novo',
            hint: 'Atualizações inteligentes poupam banda e tempo de download.',
            explanation: 'O SteamPipe fatia os dados em chunks criptográficos de 1MB, permitindo que um patch de 10GB de jogo resulte em apenas 50MB de download real para o usuário.',
          },
        },
      ],
      projetos: [
        {
          title: '4. Publicação Completa na Steam: Steamworks Partner, Cápsulas e Lançamento',
          desc: 'Aprenda todo o processo da página de loja da Steam: cápsulas gráficas (Header, Small, Main), trailers, tags e aprovação da Valve.',
          theory: [
            {
              title: 'Marketing e Lançamento na Loja Steam',
              text: 'O algoritmo de visibilidade da Steam baseia-se em Wishlists acumuladas antes do lançamento, tags precisas (evite colocar apenas "Indie") e cápsulas gráficas com tipografia legível e arte de alto impacto.',
              keyPoints: [
                'Cápsula Principal (Header Capsule 460x215) e Main Capsule (616x353): O cartão de visitas do seu jogo na loja.',
                'Build de Revisão da Valve: A Valve testa a build para verificar se inicia sem erros, fecha corretamente e cumpre as diretrizes antes de liberar o botão de Lançamento.',
              ],
            },
          ],
          code: `// Resumo de checklist de lançamento na Steam
// 1. Pagamento da taxa Steam Direct ($100 App Fee)
// 2. Preenchimento de perfil fiscal (W-8BEN) e dados bancários
// 3. Criação da página "Em Breve" (Coming Soon) para coletar Wishlists
// 4. Upload da build pelo SteamPipe CLI
// 5. Envio para Revisão da Valve (Release Review)
// 6. Clique no botão verde: "Release Game!"`,
          output: '[Steamworks Partner]: Página de loja e build aprovadas pela equipe de QA da Valve. Pronto para lançamento!',
          lang: 'csharp',
          exercise: {
            id: 'ex-pc-proj-1',
            prompt: 'Por que criar a página da loja do seu jogo na Steam com status "Em Breve" (Coming Soon) meses antes do lançamento é crucial para o sucesso comercial?',
            type: 'multiple_choice',
            options: [
              'Para acumular Wishlists (Listas de Desejo), que informam o algoritmo da Steam sobre o interesse do público e aumentam o destaque no dia do lançamento',
              'Para impedir que outros criem jogos parecidos',
              'Para cobrar dos jogadores antes do jogo existir',
              'Porque a Valve proíbe lançamentos sem aviso prévio',
            ],
            correctAnswer: 'Para acumular Wishlists (Listas de Desejo), que informam o algoritmo da Steam sobre o interesse do público e aumentam o destaque no dia do lançamento',
            hint: 'A lista de desejos notifica todos os interessados no segundo exato em que o jogo é lançado.',
            explanation: 'Wishlists geram e-mails automáticos no lançamento e impulsionam o jogo para a seção de "Populares e Recentes" na página principal da Steam.',
          },
        },
      ],
    },
    quizzesByLevel: {
      iniciante: [
        {
          id: 'q-pc-ini-1',
          question: 'Em jogos para PC Windows, qual é a principal vantagem de suportar troca dinâmica de prompts de botões?',
          options: [
            'Fornecer instruções claras na interface de acordo com o dispositivo que o jogador está usando (controle ou teclado)',
            'Aumentar o volume do áudio do jogo',
            'Diminuir a resolução do monitor',
            'Desligar a conexão de rede',
          ],
          correctIndex: 0,
          explanation: 'Garante que tutoriais e dicas mostrem os botões corretos do Gamepad ou Teclado em tempo real.',
        },
      ],
      intermediario: [
        {
          id: 'q-pc-med-1',
          question: 'Para que serve a funcionalidade "Steam Cloud" do Steamworks?',
          options: [
            'Sincronizar arquivos de progresso e savegame do jogador automaticamente entre diferentes computadores e o Steam Deck',
            'Fazer o jogo chover',
            'Apagar os dados ao fechar',
            'Aumentar o preço do jogo na loja',
          ],
          correctIndex: 0,
          explanation: 'O Steam Cloud garante que o jogador continue de onde parou em qualquer máquina vinculada à sua conta Steam.',
        },
      ],
      avancado: [
        {
          id: 'q-pc-adv-1',
          question: 'O que o Inno Setup faz no ecossistema de desenvolvimento de jogos para PC?',
          options: [
            'Gera instaladores autocontidos (.exe) com assistente de instalação, atalhos na Área de Trabalho e desinstalador seguro',
            'Substitui a placa de vídeo',
            'Cria os modelos 3D',
            'Grava músicas para o jogo',
          ],
          correctIndex: 0,
          explanation: 'Inno Setup é a ferramenta de criação de instaladores mais popular para o Windows.',
        },
      ],
      projetos: [
        {
          id: 'q-pc-proj-1',
          question: 'Qual é o impacto direto do acúmulo de Wishlists (Listas de Desejo) na Steam antes do lançamento?',
          options: [
            'Dispara e-mails de notificação no dia do lançamento e impulsiona o algoritmo de recomendação da loja',
            'Nenhum impacto perceptível',
            'Diminui o número de vendas',
            'Altera os requisitos mínimos de hardware',
          ],
          correctIndex: 0,
          explanation: 'Wishlists são o principal indicador de demanda comercial que a Valve utiliza para posicionar jogos na home page.',
        },
      ],
    },
  },
};
