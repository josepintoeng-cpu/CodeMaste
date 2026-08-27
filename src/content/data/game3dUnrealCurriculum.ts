import { TechCurriculumData } from '../techCurriculum';

export const GAME_3D_UNREAL_CURRICULUM: Record<string, TechCurriculumData> = {
  // =========================================================================
  // UNITY + BLENDER + C# (FPS, Third-Person, Racing, Survival, Open-World)
  // =========================================================================
  unity_3d_blender: {
    topicsByLevel: {
      iniciante: [
        {
          title: '1. Fundamentos 3D em C#: Transform, Vetores 3D & Quaternions',
          desc: 'Entenda espaço 3D, Vector3, Quaternions para rotação livre de Gimbal Lock e coordenadas locais vs globais.',
          theory: [
            {
              title: 'Matemática do Espaço Tridimensional na Unity',
              text: 'Diferente do 2D, em 3D trabalhamos com 3 eixos (X: Direita/Esquerda, Y: Cima/Baixo, Z: Frente/Trás). Rotações 3D não devem ser somadas como ângulos de Euler simples, pois sofrem de Gimbal Lock (perda de um grau de liberdade quando dois eixos se alinham). Usamos Quaternions para interpolações de rotação suaves (Quaternion.Slerp/RotateTowards).',
              keyPoints: [
                'transform.forward, transform.right, transform.up: Vetores unitários que apontam na orientação LOCAL do objeto.',
                'Quaternion.LookRotation(direction): Retorna a rotação necessária para fazer um objeto apontar para uma direção no espaço.',
                'Space.World vs Space.Self: Define se uma translação ou rotação ocorre no eixo global da cena ou no eixo do próprio objeto.',
              ],
              conceptCard: '📐 Regra dos Quaternions: Nunca edite transform.rotation.x/y/z/w manualmente. Use Quaternion.Euler(x, y, z) ou Quaternion.LookRotation().',
            },
          ],
          code: `using UnityEngine;

public class Basic3DMovement : MonoBehaviour
{
    [SerializeField] private float speed = 6f;
    [SerializeField] private float turnSpeed = 720f;

    public void Move(Vector3 inputDirection)
    {
        if (inputDirection.sqrMagnitude > 0.01f)
        {
            // Rotação suave em direção ao vetor de movimento
            Quaternion targetRotation = Quaternion.LookRotation(inputDirection, Vector3.up);
            transform.rotation = Quaternion.RotateTowards(transform.rotation, targetRotation, turnSpeed * Time.deltaTime);

            // Deslocamento para a frente no espaço global
            transform.Translate(inputDirection * (speed * Time.deltaTime), Space.World);
        }
    }
}`,
          output: '[Unity 3D]: Personagem orientado para vetor [0.71, 0, 0.71] via Quaternion.LookRotation sem Gimbal Lock.',
          lang: 'csharp',
          exercise: {
            id: 'ex-u3d-ini-1',
            prompt: 'Qual classe matemática a Unity utiliza internamente para representar rotações tridimensionais sem o problema de Gimbal Lock?',
            type: 'multiple_choice',
            options: ['Quaternion', 'Vector4', 'Matrix3x3', 'EulerAngle3D'],
            correctAnswer: 'Quaternion',
            hint: 'Estrutura de 4 dimensões (x, y, z, w) que garante rotações esféricas e contínuas.',
            explanation: 'Quaternions representam rotações no espaço 3D evitando o travamento de eixos (Gimbal Lock) que ocorre ao acumular ângulos de Euler.',
          },
        },
        {
          title: '2. Pipeline 3D com Blender: Modelagem, UVs e Materiais PBR',
          desc: 'Aprenda a criar modelos no Blender, aplicar UV Unwrapping e exportar FBX com materiais PBR (Albedo, Normal, Metallic).',
          theory: [
            {
              title: 'Do Blender para a Unity: O Pipeline Profissional',
              text: 'Modelos criados no Blender devem ter a escala aplicada (Ctrl+A -> Apply All Transforms) antes da exportação. Texturas PBR utilizam canais dedicados: Albedo (cor base), Normal Map (relevo de alta resolução sem peso geométrico) e Metallic/Smoothness (propriedades reflexivas e rugosidade).',
              keyPoints: [
                'Normal Maps: Simulam micro-detalhes de iluminação em malhas low-poly (deve ser marcado como "Normal Map" no Texture Type da Unity).',
                'Origem / Pivot Point: A origem do modelo no Blender define o ponto de rotação e ancoragem na Unity (mantenha na base dos pés para personagens).',
                'Eixos Blender vs Unity: Blender usa Z-up, enquanto Unity usa Y-up (o exportador FBX pode converter automaticamente).',
              ],
            },
          ],
          code: `// Estrutura de configuração de material PBR via script
using UnityEngine;

public class MaterialConfigurator : MonoBehaviour
{
    [SerializeField] private MeshRenderer meshRenderer;
    [SerializeField] private Texture2D albedoTex;
    [SerializeField] private Texture2D normalMapTex;
    [SerializeField] private float metallicValue = 0.8f;
    [SerializeField] private float smoothnessValue = 0.9f;

    private void Start()
    {
        Material mat = meshRenderer.material;
        mat.SetTexture("_BaseMap", albedoTex);
        mat.SetTexture("_BumpMap", normalMapTex);
        mat.SetFloat("_Metallic", metallicValue);
        mat.SetFloat("_Smoothness", smoothnessValue);
    }
}`,
          output: '[Asset Pipeline]: Modelo "Hero_Warrior.fbx" importado do Blender. 4.2k polígonos, Normal Map gerado.',
          lang: 'csharp',
          exercise: {
            id: 'ex-u3d-ini-2',
            prompt: 'No pipeline 3D com Blender e Unity, o que o Normal Map faz?',
            type: 'multiple_choice',
            options: [
              'Simula relevos, fendas e detalhes de luz e sombra em uma malha de poucos polígonos sem aumentar a geometria',
              'Aumenta o peso do arquivo 3D em 500%',
              'Torna o objeto invisível no jogo',
              'Substitui o código C# da movimentação',
            ],
            correctAnswer: 'Simula relevos, fendas e detalhes de luz e sombra em uma malha de poucos polígonos sem aumentar a geometria',
            hint: 'Usa as normais da superfície codificadas nas cores RGB (azuladas) para calcular a refração da luz.',
            explanation: 'Normal Maps calculam o ângulo de reflexão da luz na superfície pixel a pixel, dando a ilusão de detalhes de milhões de polígonos em um modelo leve de alta performance.',
          },
        },
        {
          title: '3. Criação do Jogo 1: FPS Simples (Raycast Shooting, Recoil & Reload)',
          desc: 'Construa um jogo de tiro em primeira pessoa completo com mira no mouse, tiro com Raycast e recuo de arma.',
          theory: [
            {
              title: 'Mecânicas Centrais de um FPS',
              text: 'Jogos de tiro em primeira pessoa utilizam CharacterController para movimentação e colisão 3D, controle de câmera com Mouse Look (clamp vertical no eixo X entre -85º e 85º) e tiro instantâneo via Physics.Raycast a partir do centro da tela.',
              keyPoints: [
                'Raycast Shooting: Projeta um raio invisível do centro da câmera no infinito; instantâneo e sem peso de física para balas rápidas.',
                'Impact Decals & SFX: Instancia marcas de bala (bullet holes) e faíscas no ponto exato retornado por `hit.point` e `hit.normal`.',
                'Camera Clamping: Impede que a cabeça do jogador gire 360º para trás ao olhar para cima ou para baixo.',
              ],
            },
          ],
          code: `using UnityEngine;

public class FPSGunController : MonoBehaviour
{
    [SerializeField] private Camera fpsCamera;
    [SerializeField] private float damage = 25f;
    [SerializeField] private float range = 100f;
    [SerializeField] private ParticleSystem muzzleFlash;
    [SerializeField] private GameObject impactEffectPrefab;

    public void Shoot()
    {
        muzzleFlash.Play();

        // Dispara um raio a partir do centro da tela
        Ray ray = fpsCamera.ViewportPointToRay(new Vector3(0.5f, 0.5f, 0));
        if (Physics.Raycast(ray, out RaycastHit hit, range))
        {
            Debug.Log($"Alvo atingido: {hit.collider.name} no ponto {hit.point}");

            // Instancia efeito de impacto alinhado com a normal da superfície
            GameObject impact = Instantiate(impactEffectPrefab, hit.point, Quaternion.LookRotation(hit.normal));
            Destroy(impact, 2f);
        }
    }
}`,
          output: '[FPS Engine]: Tiro disparado! Raycast colidiu com "InimigoTarget" a 24.8m. Efeito de impacto instanciado.',
          lang: 'csharp',
          exercise: {
            id: 'ex-u3d-ini-3',
            prompt: 'Em um FPS, como alinhar a marca de bala (impact decal) perfeitamente com a superfície da parede atingida pelo tiro?',
            type: 'multiple_choice',
            options: [
              'Usando Quaternion.LookRotation(hit.normal) no ponto hit.point retornado pelo RaycastHit',
              'Girando o modelo da bala em 90 graus no eixo Y',
              'Apagando a parede da cena',
              'Usando Vector3.zero',
            ],
            correctAnswer: 'Usando Quaternion.LookRotation(hit.normal) no ponto hit.point retornado pelo RaycastHit',
            hint: 'A normal aponta perpendicularmente para fora da superfície atingida.',
            explanation: 'hit.normal fornece o vetor perpendicular à face onde o raio colidiu, garantindo que o decalque fique perfeitamente colado e virado para fora da parede.',
          },
        },
        {
          title: '4. Universal Render Pipeline (URP), Iluminação 3D & Skyboxes',
          desc: 'Configure iluminação PBR, Directional Lights, Point/Spot Lights, sombras suaves e Global Illumination.',
          theory: [
            {
              title: 'Renderização Moderna com URP',
              text: 'O URP (Universal Render Pipeline) é a arquitetura padrão para alta fidelidade e excelente taxa de quadros em PC, consoles e mobile. Ele suporta Forward+ Rendering (centenas de luzes por cena sem quebrar a performance).',
              keyPoints: [
                'Baking de Iluminação: Pré-calcula sombras e luzes estáticas em Lightmaps para que luzes complexas não consumam GPU em tempo real.',
                'Volume Profile & Post-Processing: Adiciona Bloom, Color Adjustments (ACES Tone Mapping), Vinheta e Oclusão de Ambiente (SSAO).',
                'Directional Light: Representa o Sol ou Lua na cena, emitindo raios paralelos em todo o espaço.',
              ],
            },
          ],
          code: `// Exemplo conceitual de perfil de pós-processamento URP
using UnityEngine;
using UnityEngine.Rendering;
using UnityEngine.Rendering.Universal;

public class DynamicPostProcessing : MonoBehaviour
{
    [SerializeField] private Volume volume;
    private Bloom bloomEffect;
    private Vignette vignetteEffect;

    private void Start()
    {
        if (volume.profile.TryGet(out bloomEffect))
        {
            bloomEffect.intensity.value = 1.2f;
        }
        if (volume.profile.TryGet(out vignetteEffect))
        {
            vignetteEffect.intensity.value = 0.35f;
        }
    }
}`,
          output: '[URP Pipeline]: Volume de pós-processamento ativo: ACES Tonemapping, Bloom (1.2), SSAO ativo a 60 FPS.',
          lang: 'csharp',
          exercise: {
            id: 'ex-u3d-ini-4',
            prompt: 'O que é "Light Baking" no desenvolvimento de jogos 3D?',
            type: 'multiple_choice',
            options: [
              'O processo de pré-calcular a iluminação estática e salvar as sombras em texturas (Lightmaps), economizando processamento em tempo real',
              'Aquecer a placa de vídeo durante o jogo',
              'Desligar todas as lâmpadas da fase',
              'Aumentar o brilho do monitor',
            ],
            correctAnswer: 'O processo de pré-calcular a iluminação estática e salvar as sombras em texturas (Lightmaps), economizando processamento em tempo real',
            hint: 'As luzes estáticas são "assadas" previamente em texturas 2D sobrepostas no cenário.',
            explanation: 'Baking gera sombras e iluminação indireta fotorrealista sem nenhum custo de cálculo de sombras em tempo de execução.',
          },
        },
        {
          title: '5. Criação do Jogo 2: Third-Person Game (Câmera Cinemachine & Blend Trees)',
          desc: 'Desenvolva câmera livre em terceira pessoa, rotação alinhada com a câmera e Blend Trees 2D para andar/correr.',
          theory: [
            {
              title: 'Arquitetura de Jogos em Terceira Pessoa (TPS)',
              text: 'Em jogos em 3ª pessoa, o movimento do personagem deve ser relativo à direção da câmera. O Cinemachine FreeLook Camera orbita em torno do avatar, enquanto um Blend Tree 2D no Animator interpola suavemente entre Idle, Walk, Jog e Sprint baseado nos eixos X e Y.',
              keyPoints: [
                'Câmera Orbital Cinemachine: Três anéis (Top, Middle, Bottom Rig) para órbita sem colisões de parede (Cinemachine Collider).',
                'Cálculo de Direção Relativa à Câmera: Multiplicar o input pelos vetores horizontais `camera.transform.forward` e `camera.transform.right`.',
              ],
            },
          ],
          code: `using UnityEngine;

public class ThirdPersonMovement : MonoBehaviour
{
    [SerializeField] private CharacterController controller;
    [SerializeField] private Transform camTransform;
    [SerializeField] private float speed = 6f;
    [SerializeField] private float smoothTurnTime = 0.1f;
    private float turnSmoothVelocity;

    public void Move(float horizontal, float vertical)
    {
        Vector3 direction = new Vector3(horizontal, 0f, vertical).normalized;

        if (direction.magnitude >= 0.1f)
        {
            // Calcula o ângulo relativo à câmera
            float targetAngle = Mathf.Atan2(direction.x, direction.z) * Mathf.Rad2Deg + camTransform.eulerAngles.y;
            float angle = Mathf.SmoothDampAngle(transform.eulerAngles.y, targetAngle, ref turnSmoothVelocity, smoothTurnTime);
            transform.rotation = Quaternion.Euler(0f, angle, 0f);

            Vector3 moveDir = Quaternion.Euler(0f, targetAngle, 0f) * Vector3.forward;
            controller.Move(moveDir.normalized * (speed * Time.deltaTime));
        }
    }
}`,
          output: '[Third-Person Engine]: Movimento calculado relativo à câmera orbital. Ângulo suavizado: 124.5º.',
          lang: 'csharp',
          exercise: {
            id: 'ex-u3d-ini-5',
            prompt: 'Em jogos em 3ª pessoa, por que a direção de movimento do personagem deve ser calculada usando a rotação Y da câmera?',
            type: 'multiple_choice',
            options: [
              'Para que pressionar "Para Cima/W" faça o personagem sempre andar para a frente na direção para onde o jogador está olhando na tela',
              'Porque o Unity não permite andar para os lados',
              'Para acelerar a velocidade da animação',
              'Para desligar a gravidade do personagem',
            ],
            correctAnswer: 'Para que pressionar "Para Cima/W" faça o personagem sempre andar para a frente na direção para onde o jogador está olhando na tela',
            hint: 'O controle precisa ser intuitivo em relação ao que o jogador vê na tela.',
            explanation: 'Projetar o movimento no espaço da câmera garante que a direção dos comandos do analógico ou teclado coincida com a perspectiva visual do jogador.',
          },
        },
      ],
      intermediario: [
        {
          title: '6. Criação do Jogo 3: Racing Game (WheelColliders, Torque & Derrapagem)',
          desc: 'Desenvolva física automotiva realista com WheelColliders, motor com torque, freios ABS e derrapagem (Drift).',
          theory: [
            {
              title: 'Física Veicular com WheelCollider',
              text: 'O WheelCollider simula rodas de veículos com suspensão por mola (Spring/Damper), atrito dianteiro (Forward Friction) e atrito lateral (Sideways Friction). Alterar a curva de atrito lateral permite mecânicas de derrapagem (Drift).',
              keyPoints: [
                'MotorTorque vs BrakeTorque: MotorTorque aplica força motriz nas rodas tracionadas; BrakeTorque aplica resistência de frenagem.',
                'Centro de Massa (Center of Mass): Mantenha o centro de massa baixo para evitar que o carro capote em curvas fechadas.',
                'SteerAngle: Ângulo de esterçamento das rodas dianteiras para fazer curvas.',
              ],
            },
          ],
          code: `using UnityEngine;

public class CarController : MonoBehaviour
{
    [SerializeField] private WheelCollider frontLeftW, frontRightW, rearLeftW, rearRightW;
    [SerializeField] private Transform frontLeftT, frontRightT, rearLeftT, rearRightT;
    [SerializeField] private Rigidbody carRb;
    [SerializeField] private float motorForce = 1500f;
    [SerializeField] private float brakeForce = 3000f;
    [SerializeField] private float maxSteerAngle = 30f;

    private void Start()
    {
        carRb.centerOfMass = new Vector3(0, -0.5f, 0); // Centro de massa rebaixado
    }

    public void Drive(float accelerateInput, float steerInput, bool isBraking)
    {
        // Esterçamento
        float steer = steerInput * maxSteerAngle;
        frontLeftW.steerAngle = steer;
        frontRightW.steerAngle = steer;

        // Aceleração
        float currentMotor = accelerateInput * motorForce;
        rearLeftW.motorTorque = currentMotor;
        rearRightW.motorTorque = currentMotor;

        // Frenagem
        float currentBrake = isBraking ? brakeForce : 0f;
        frontLeftW.brakeTorque = currentBrake;
        frontRightW.brakeTorque = currentBrake;
        rearLeftW.brakeTorque = currentBrake;
        rearRightW.brakeTorque = currentBrake;

        UpdateWheelPose(frontLeftW, frontLeftT);
        UpdateWheelPose(frontRightW, frontRightT);
    }

    private void UpdateWheelPose(WheelCollider col, Transform trans)
    {
        col.GetWorldPose(out Vector3 pos, out Quaternion rot);
        trans.position = pos;
        trans.rotation = rot;
    }
}`,
          output: '[Car Engine]: Tração traseira ativa. Torque: 1500 N*m. Velocímetro: 82 km/h.',
          lang: 'csharp',
          exercise: {
            id: 'ex-u3d-med-1',
            prompt: 'No Unity, por que devemos rebaixar o centro de massa (centerOfMass) do Rigidbody de um carro?',
            type: 'multiple_choice',
            options: [
              'Para aumentar a estabilidade do veículo e evitar que ele capote facilmente ao realizar curvas em alta velocidade',
              'Para fazer o carro andar mais devagar',
              'Para economizar combustível virtual',
              'Para diminuir a resolução do modelo 3D',
            ],
            correctAnswer: 'Para aumentar a estabilidade do veículo e evitar que ele capote facilmente ao realizar curvas em alta velocidade',
            hint: 'Carros reais mantêm o centro de gravidade próximo ao solo.',
            explanation: 'Um centro de massa rebaixado impede que a força centrífuga nas curvas gere torque de rotação que tombaria o veículo.',
          },
        },
        {
          title: '7. Criação do Jogo 4: Survival Game (Coleta, Crafting, Fome & Sede)',
          desc: 'Construa um sistema completo de sobrevivência com estatísticas vitais, coleta de recursos com machado/picareta e receitas de crafting.',
          theory: [
            {
              title: 'Estrutura de um Jogo de Sobrevivência 3D',
              text: 'Jogos de sobrevivência giram em torno do loop: Coletar Recursos -> Manter Estatísticas Vitais -> Craftar Ferramentas e Abrigo -> Enfrentar Ameaças Maiores. As taxas de drenagem de fome e sede diminuem ao longo do tempo e aumentam ao correr.',
              keyPoints: [
                'Sistema de Dano a Recursos: Árvores e pedras possuem vida e soltam prefabs de madeira/minério ao serem golpeadas com a ferramenta correta.',
                'Receitas de Crafting: Lista de ingredientes exigidos (ex: 5 Madeiras + 2 Pedras = 1 Machado de Pedra).',
                'Status Vitais: Fome zerada começa a causar dano direto na vida do jogador a cada 2 segundos.',
              ],
            },
          ],
          code: `using System;
using UnityEngine;

public class SurvivalStats : MonoBehaviour
{
    [SerializeField] private float maxHealth = 100f;
    [SerializeField] private float maxHunger = 100f;
    [SerializeField] private float hungerDrainRate = 0.5f; // por segundo

    public float CurrentHealth { get; private set; }
    public float CurrentHunger { get; private set; }

    private void Start()
    {
        CurrentHealth = maxHealth;
        CurrentHunger = maxHunger;
    }

    private void Update()
    {
        // Drena fome com o tempo
        CurrentHunger = Mathf.Max(0, CurrentHunger - hungerDrainRate * Time.deltaTime);

        // Se a fome zerou, o jogador sofre inanição
        if (CurrentHunger <= 0)
        {
            CurrentHealth = Mathf.Max(0, CurrentHealth - 2f * Time.deltaTime);
        }
    }
}`,
          output: '[Survival Stats]: Fome: 84%, Sede: 72%, Vida: 100%. Taxa de drenagem estável.',
          lang: 'csharp',
          exercise: {
            id: 'ex-u3d-med-2',
            prompt: 'Como modelar uma receita de Crafting escalável em C# no Unity?',
            type: 'multiple_choice',
            options: [
              'Usando uma classe ou ScriptableObject com uma lista de pares de Item e Quantidade necessária, além do Item resultante',
              'Criando 100 variáveis soltas no script do Player',
              'Colocando os itens no chão sem inventário',
              'Desativando a interface gráfica',
            ],
            correctAnswer: 'Usando uma classe ou ScriptableObject com uma lista de pares de Item e Quantidade necessária, além do Item resultante',
            hint: 'Estruturas de dados modulares permitem adicionar centenas de receitas facilmente no editor.',
            explanation: 'ScriptableObjects de receitas guardam a fórmula (entradas e saída), permitindo verificar se o inventário contém todos os materiais antes de fabricar o item.',
          },
        },
        {
          title: '8. NavMesh 3D & IA de Inimigos com Patrulha e Perseguição',
          desc: 'Construa navegação 3D inteligente com NavMesh Surface, NavMeshAgent, evasão de obstáculos e busca de caminhos.',
          theory: [
            {
              title: 'Navegação Tridimensional com NavMesh',
              text: 'O NavMesh calcula a malha caminhável sobre terrenos e escadas 3D. O NavMeshAgent cuida de calcular a rota ótima evitando obstáculos móveis (NavMeshObstacle com Carve habilitado).',
              keyPoints: [
                'NavMeshAgent.SetDestination(targetPos): Calcula o caminho mais curto usando A* em 3D de forma assíncrona.',
                'StoppingDistance: Distância onde o agente para antes de encostar no alvo para iniciar o ataque.',
                'NavMesh Link: Permite que agentes pulem entre plataformas desconexas ou subam escadas de mão.',
              ],
            },
          ],
          code: `using UnityEngine;
using UnityEngine.AI;

public class EnemyNavMeshAI : MonoBehaviour
{
    [SerializeField] private NavMeshAgent agent;
    [SerializeField] private Transform playerTarget;
    [SerializeField] private float attackRange = 2f;

    private void Update()
    {
        float distance = Vector3.Distance(transform.position, playerTarget.position);

        if (distance <= attackRange)
        {
            agent.isStopped = true;
            // Executa ataque corpo a corpo
        }
        else
        {
            agent.isStopped = false;
            agent.SetDestination(playerTarget.position);
        }
    }
}`,
          output: '[NavMesh AI]: Caminho calculado com sucesso até o jogador. 3 waypoints no trajeto 3D.',
          lang: 'csharp',
          exercise: {
            id: 'ex-u3d-med-3',
            prompt: 'No Unity 3D, qual componente é adicionado a caixas móveis ou portas para que os inimigos com NavMeshAgent desviem delas dinamicamente?',
            type: 'multiple_choice',
            options: ['NavMeshObstacle (com Carving ativo)', 'BoxCollider simples', 'MeshFilter', 'AudioListener'],
            correctAnswer: 'NavMeshObstacle (com Carving ativo)',
            hint: 'O componente "recorta" (carve) um buraco na malha de navegação navegável.',
            explanation: 'O NavMeshObstacle com Carve ativo abre um buraco dinâmico na malha caminhável quando o objeto para, forçando os agentes a recalcular o caminho ao redor.',
          },
        },
        {
          title: '9. Ragdoll Physics e Transição Suave de Animação para Física',
          desc: 'Configure ossos de personagem com Rigidbody/CharacterJoints e alterne dinamicamente entre Animator e Ragdoll.',
          theory: [
            {
              title: 'Ragdoll: De Animação para Física Orgânica',
              text: 'Um Ragdoll é um conjunto de Rigidbodies e CharacterJoints associados aos ossos do esqueleto 3D (cabeça, braços, pernas, torso). Quando o personagem morre, o Animator é desabilitado e os Rigidbodies assumem o controle, reagindo ao impacto de tiros e explosões.',
              keyPoints: [
                'Desabilitar Animator: animator.enabled = false para liberar o controle dos ossos.',
                'Alternar isKinematic: Deixar os Rigidbodies dos ossos em `isKinematic = true` durante a vida e mudar para `false` ao morrer.',
                'AddExplosionForce: Aplica força de impacto físico no osso mais próximo do tiro/explosão.',
              ],
            },
          ],
          code: `using UnityEngine;

public class RagdollController : MonoBehaviour
{
    [SerializeField] private Animator animator;
    private Rigidbody[] ragdollRigidbodies;

    private void Awake()
    {
        ragdollRigidbodies = GetComponentsInChildren<Rigidbody>();
        SetRagdollActive(false); // Inicia desativado enquanto vivo
    }

    public void TriggerRagdoll(Vector3 impactForce, Vector3 hitPoint)
    {
        animator.enabled = false;
        SetRagdollActive(true);

        // Aplica impulso no primeiro osso atingido
        if (ragdollRigidbodies.Length > 0)
        {
            ragdollRigidbodies[0].AddForceAtPosition(impactForce, hitPoint, ForceMode.Impulse);
        }
    }

    private void SetRagdollActive(bool active)
    {
        foreach (var rb in ragdollRigidbodies)
        {
            if (rb.gameObject != gameObject)
            {
                rb.isKinematic = !active;
            }
        }
    }
}`,
          output: '[Physics 3D]: Ragdoll ativado! 11 ossos com CharacterJoints reagindo à gravidade e força de impacto.',
          lang: 'csharp',
          exercise: {
            id: 'ex-u3d-med-4',
            prompt: 'O que deve ser feito com o componente "Animator" ao ativar o Ragdoll de um personagem derrotado?',
            type: 'multiple_choice',
            options: [
              'Deve ser desabilitado (animator.enabled = false) para que a física dos CharacterJoints controle a posição dos ossos livremente',
              'Deve ser colocado na velocidade máxima',
              'Deve ser excluído do disco',
              'Deve tocar a animação de corrida',
            ],
            correctAnswer: 'Deve ser desabilitado (animator.enabled = false) para que a física dos CharacterJoints controle a posição dos ossos livremente',
            hint: 'Se o Animator continuar ativo, ele sobrescreverá a física a cada frame com a animação padrão.',
            explanation: 'O Animator tem prioridade sobre as posições dos ossos. Desabilitá-lo permite que as forças da física (gravidade e colisores) governem o esqueleto.',
          },
        },
        {
          title: '10. Áudio Espacial 3D, Efeito Doppler & Áreas de Reverb',
          desc: 'Configure curvas de atenuação sonora 3D (Linear/Logarithmic), Reverb Zones para cavernas e mixers de áudio.',
          theory: [
            {
              title: 'Áudio Tridimensional Imersivo',
              text: 'Em 3D, a propriedade Spatial Blend do AudioSource deve ser ajustada para 1.0 (100% 3D). O som diminui de volume conforme a distância do AudioListener (câmera/jogador) e se desloca entre os fones esquerdo e direito (Panning).',
              keyPoints: [
                'Spatial Blend = 1.0: Áudio totalmente espacializado em 3D.',
                'Audio Reverb Zone: Aplica eco realista em ambientes fechados (cavernas, hangares, catedrais).',
                'Doppler Level: Altera o pitch do som quando veículos passam em alta velocidade pelo jogador.',
              ],
            },
          ],
          code: `using UnityEngine;

public class SpatialAudioSetup : MonoBehaviour
{
    [SerializeField] private AudioSource audioSource;
    [SerializeField] private float minDistance = 1f;
    [SerializeField] private float maxDistance = 25f;

    private void Awake()
    {
        audioSource.spatialBlend = 1.0f; // 3D Sound
        audioSource.rolloffMode = AudioRolloffMode.Logarithmic;
        audioSource.minDistance = minDistance;
        audioSource.maxDistance = maxDistance;
        audioSource.dopplerLevel = 1.0f;
    }
}`,
          output: '[Audio 3D]: AudioSource configurado em 3D Spatial Blend. Atenuação logarítmica entre 1m e 25m.',
          lang: 'csharp',
          exercise: {
            id: 'ex-u3d-med-5',
            prompt: 'Qual valor deve ter a propriedade "Spatial Blend" de um AudioSource no Unity para que o som seja 100% tridimensional e espacializado?',
            type: 'multiple_choice',
            options: ['1.0 (ou 3D)', '0.0 (ou 2D)', '0.5', '-1.0'],
            correctAnswer: '1.0 (ou 3D)',
            hint: '0 é 2D estéreo puro; 1 é áudio posicional 3D completo.',
            explanation: 'Spatial Blend em 1.0 faz com que o Unity atenue o volume pela distância e posicione o som no estéreo baseado na orientação tridimensional em relação ao AudioListener.',
          },
        },
      ],
      avancado: [
        {
          title: '11. Criação do Jogo 5: Open-World Pequeno (Terreno, Vegetação, Splatmaps & LODs)',
          desc: 'Construa um mundo aberto pequeno com Unity Terrain, pintura de texturas com Splatmaps, árvores com GPU Instancing e LODs.',
          theory: [
            {
              title: 'Técnicas de Mundos Abertos (Open-World)',
              text: 'Mundos abertos exigem gerenciamento eficiente de geometria: LOD (Level of Detail) reduz os polígonos de árvores e rochas distantes, transformando-as em modelos simples ou outdoors 2D (Billboards) longe da câmera.',
              keyPoints: [
                'LOD Group (LOD0, LOD1, LOD2, Cull): Transiciona dinamicamente a malha 3D conforme o percentual da tela ocupado pelo objeto.',
                'Occlusion Culling: Deixa de enviar para a GPU objetos que estão escondidos atrás de montanhas e construções.',
                'Pintura de Vegetação em Lote: O Terrain renderiza milhares de gramas usando Compute Shaders de alta performance.',
              ],
            },
          ],
          code: `// Exemplo conceitual de gerenciador de streaming de terrenos
using UnityEngine;

public class WorldStreamingManager : MonoBehaviour
{
    [SerializeField] private Transform player;
    [SerializeField] private GameObject[] terrainChunks;
    [SerializeField] private float viewDistance = 250f;

    private void Update()
    {
        foreach (var chunk in terrainChunks)
        {
            float dist = Vector3.Distance(player.position, chunk.transform.position);
            chunk.SetActive(dist <= viewDistance);
        }
    }
}`,
          output: '[Terrain Engine]: Terreno 1km x 1km renderizado com 4 Splatmaps, 12.000 árvores com LODs e GPU Instancing.',
          lang: 'csharp',
          exercise: {
            id: 'ex-u3d-adv-1',
            prompt: 'O que o sistema de LOD (Level of Detail) faz em jogos 3D de mundo aberto?',
            type: 'multiple_choice',
            options: [
              'Substitui modelos 3D complexos por versões de menor resolução de polígonos à medida que o objeto se afasta da câmera',
              'Aumenta o volume dos sons distantes',
              'Apaga o inventário do jogador',
              'Gera chuva procedural',
            ],
            correctAnswer: 'Substitui modelos 3D complexos por versões de menor resolução de polígonos à medida que o objeto se afasta da câmera',
            hint: 'Objetos distantes não precisam de milhões de triângulos porque ocupam poucos pixels na tela.',
            explanation: 'O LOD Group alterna entre versões detalhadas (LOD0 perto) e versões leves (LOD1/LOD2 longe), poupando milhões de polígonos e mantendo o FPS alto.',
          },
        },
        {
          title: '12. Ciclo Dia/Noite Dinâmico, Iluminação Volumétrica & Clima',
          desc: 'Implemente rotação solar em tempo real, transição de cores do céu via Gradient, iluminação global dinâmica e névoa.',
          theory: [
            {
              title: 'Atmosfera e Iluminação Dinâmica',
              text: 'Um ciclo dia/noite altera a rotação da Directional Light (Sol) no eixo X ao longo do tempo. Conforme o sol desce no horizonte, avaliamos curvas de gradiente para alterar a cor da luz (amarelo brilhante -> laranja do pôr do sol -> azul escuro da noite).',
              keyPoints: [
                'RenderSettings.ambientLight / Skybox Material: Ajuste da iluminação ambiente para que a noite não fique cinza claro não-realista.',
                'Fog (Névoa Volumétrica): Adiciona profundidade e esconde os limites de corte de renderização do mapa.',
              ],
            },
          ],
          code: `using UnityEngine;

public class DayNightCycle : MonoBehaviour
{
    [SerializeField] private Light sunLight;
    [SerializeField] private float dayDurationInSeconds = 120f;
    [SerializeField] private Gradient sunColorGradient;
    [SerializeField] private AnimationCurve sunIntensityCurve;

    private float timeOfDay = 0f; // 0 a 1

    private void Update()
    {
        timeOfDay += (Time.deltaTime / dayDurationInSeconds);
        if (timeOfDay >= 1f) timeOfDay = 0f;

        // Rotaciona o sol 360 graus
        float sunAngle = timeOfDay * 360f - 90f;
        sunLight.transform.rotation = Quaternion.Euler(sunAngle, 170f, 0);

        // Atualiza cor e intensidade com base na hora do dia
        sunLight.color = sunColorGradient.Evaluate(timeOfDay);
        sunLight.intensity = sunIntensityCurve.Evaluate(timeOfDay);
    }
}`,
          output: '[Sky & Weather]: Ciclo solar ativo (Hora: 17:45 - Pôr do Sol). Gradiente alaranjado aplicado.',
          lang: 'csharp',
          exercise: {
            id: 'ex-u3d-adv-2',
            prompt: 'Em um ciclo Dia/Noite, como garantir que o pôr do sol exiba tons alaranjados e a noite tons azulados de forma contínua?',
            type: 'multiple_choice',
            options: [
              'Avaliando uma curva de Gradient (Gradient.Evaluate(timeOfDay)) ao longo do tempo para controlar a cor da luz solar',
              'Pintando a tela com um sprite vermelho',
              'Desligando a placa de vídeo às 18:00',
              'Usando uma foto estática do céu',
            ],
            correctAnswer: 'Avaliando uma curva de Gradient (Gradient.Evaluate(timeOfDay)) ao longo do tempo para controlar a cor da luz solar',
            hint: 'A classe Gradient permite interpolar cores em qualquer ponto percentual entre 0 e 1.',
            explanation: 'Com Gradient.Evaluate, a engine interpola suavemente entre as chaves de cor definidas para cada horário do ciclo solar.',
          },
        },
        {
          title: '13. Otimização Avançada: Occlusion Culling, Batching & Profiler',
          desc: 'Identifique gargalos de CPU/GPU com o Unity Profiler, configure Occlusion Culling e Static Batching.',
          theory: [
            {
              title: 'Diagnóstico e Eliminação de Gargalos 3D',
              text: 'O Unity Profiler separa o uso em CPU (código de scripts, física, garbage collection) e GPU (renderização de malhas, sombras, pós-processamento). Occlusion Culling calcula quais objetos estão visualmente ocluídos por paredes e deixa de desenhá-los.',
              keyPoints: [
                'Static Batching: Marque objetos estáticos (prédios, pedras) como "Static" para que a Unity combine as malhas na inicialização.',
                'GPU Instancing: Permite desenhar milhares de cópias da mesma malha com o mesmo material (árvores, grama, moedas) em um único Draw Call.',
                'Profiler Markers: Use `using (new ProfilerMarker("MinhaOperacao").Auto())` para medir funções críticas.',
              ],
            },
          ],
          code: `// Exemplo de medição cirúrgica com ProfilerMarker
using Unity.Profiling;
using UnityEngine;

public class HighLoadSystem : MonoBehaviour
{
    private static readonly ProfilerMarker CustomMarker = new ProfilerMarker("HeavyMathCalculation");

    public void ProcessData()
    {
        using (CustomMarker.Auto())
        {
            // Código de física ou matemática pesada medido no Profiler
        }
    }
}`,
          output: '[Unity Profiler]: 60.1 FPS estável. Occlusion Culling reduziu triângulos renderizados de 2.4M para 320k.',
          lang: 'csharp',
          exercise: {
            id: 'ex-u3d-adv-3',
            prompt: 'O que o "Occlusion Culling" faz na Unity?',
            type: 'multiple_choice',
            options: [
              'Desativa o envio para a GPU de objetos que estão completamente escondidos atrás de outros objetos opacos (ex: atrás de paredes)',
              'Exclui os scripts do jogo',
              'Aumenta o volume dos sons de passos',
              'Apaga o terreno',
            ],
            correctAnswer: 'Desativa o envio para a GPU de objetos que estão completamente escondidos atrás de outros objetos opacos (ex: atrás de paredes)',
            hint: 'Oclusão significa algo bloqueando a visão direta da câmera.',
            explanation: 'Diferente do Frustum Culling (que remove o que está fora do campo de visão), o Occlusion Culling remove o que está dentro do campo de visão mas tapado por uma parede ou montanha.',
          },
        },
        {
          title: '14. Shaders Customizados com Shader Graph & Efeitos de Dissolve',
          desc: 'Crie shaders visuais com Shader Graph no URP: efeito de dissolução de inimigos com ruído Voronoi e bordas brilhantes.',
          theory: [
            {
              title: 'Criação Visual de Shaders com Shader Graph',
              text: 'O Shader Graph permite criar shaders complexos sem escrever HLSL à mão. Combinando nós de Texture Sample, Simple Noise / Voronoi e Step / Smoothstep, podemos criar efeitos de teletransporte, fogo, escudo de energia e dissolução.',
              keyPoints: [
                'Efeito de Dissolve: Um nó `Step(Cutoff, Noise)` descarta pixels (Alpha Clip) onde o valor do ruído for menor que o Cutoff.',
                'Borda com Emissão HDR: Multiplica a borda do corte por uma cor HDR brilhante que reage ao Bloom.',
              ],
            },
          ],
          code: `using System.Collections;
using UnityEngine;

public class EnemyDissolveEffect : MonoBehaviour
{
    [SerializeField] private Renderer enemyRenderer;
    [SerializeField] private float dissolveDuration = 1.5f;
    private static readonly int DissolveAmountHash = Shader.PropertyToID("_DissolveAmount");

    public void TriggerDissolve()
    {
        StartCoroutine(DissolveRoutine());
    }

    private IEnumerator DissolveRoutine()
    {
        Material mat = enemyRenderer.material;
        float elapsed = 0f;

        while (elapsed < dissolveDuration)
        {
            elapsed += Time.deltaTime;
            float dissolveValue = Mathf.Clamp01(elapsed / dissolveDuration);
            mat.SetFloat(DissolveAmountHash, dissolveValue);
            yield return null;
        }

        Destroy(gameObject);
    }
}`,
          output: '[Shader Graph]: Efeito de Dissolve executado. Parâmetro _DissolveAmount interpolado de 0 a 1 com borda emissiva.',
          lang: 'csharp',
          exercise: {
            id: 'ex-u3d-adv-4',
            prompt: 'No Shader Graph, qual função matemática é comumente usada para criar um corte nítido entre áreas visíveis e dissolvidas com base em uma textura de ruído?',
            type: 'multiple_choice',
            options: ['Step (ou Smoothstep)', 'Add', 'Sine', 'Normalize'],
            correctAnswer: 'Step (ou Smoothstep)',
            hint: 'Retorna 0 se o valor for menor que o limite, e 1 se for maior.',
            explanation: 'A função Step(edge, x) cria uma transição binária rígida ideal para Alpha Clipping em efeitos de dissolução e destruição.',
          },
        },
        {
          title: '15. Arquitetura de Save System em 3D: Posições, Quests & Itens',
          desc: 'Salve transformações completas no espaço 3D, estados de portas, baús abertos e progresso de missões.',
          theory: [
            {
              title: 'Persistência Completa de Mundos 3D',
              text: 'Um sistema de save para jogos 3D precisa registrar o GUID de cada objeto persistente no mundo, sua posição (X, Y, Z), rotação (Euler X, Y, Z), inventário serializado e estado de gatilhos.',
              keyPoints: [
                'Interface `ISaveable`: Cada objeto que precisa salvar seu estado implementa métodos `CaptureState()` e `RestoreState(state)`.',
                'ID Único (PersistentID): Garante que ao recarregar a cena, cada baú e porta receba exatamente seu estado prévio.',
              ],
            },
          ],
          code: `using System;
using System.Collections.Generic;
using UnityEngine;

[Serializable]
public struct SerializableVector3
{
    public float x, y, z;
    public SerializableVector3(Vector3 v) { x = v.x; y = v.y; z = v.z; }
    public Vector3 ToVector3() => new Vector3(x, y, z);
}

[Serializable]
public class WorldObjectSaveState
{
    public string uniqueId;
    public SerializableVector3 position;
    public SerializableVector3 rotation;
    public bool isInteractableActive;
}`,
          output: '[Save System 3D]: 48 entidades no mundo capturadas e serializadas em JSON estruturado.',
          lang: 'csharp',
          exercise: {
            id: 'ex-u3d-adv-5',
            prompt: 'Por que a estrutura Vector3 padrão da Unity precisa de um invólucro (Wrapper) ou conversor serializável para salvar em JSON com JsonUtility?',
            type: 'multiple_choice',
            options: [
              'Para garantir que os dados sejam formatados em campos primitivos simples e compatíveis com qualquer serializador',
              'Porque o Unity proíbe salvar números',
              'Porque Vector3 ocupa 10 gigabytes',
              'Para mudar a cor do personagem',
            ],
            correctAnswer: 'Para garantir que os dados sejam formatados em campos primitivos simples e compatíveis com qualquer serializador',
            hint: 'Conversão explícita de structs evita problemas de compatibilidade e propriedades ocultas.',
            explanation: 'Criar structs serializáveis customizadas simplifica o parsing de JSON e garante que apenas os valores essenciais de posição e rotação sejam gravados no disco.',
          },
        },
      ],
      projetos: [
        {
          title: '16. Projeto Integrador 1: Survival Island 3D (Construção & Crafting)',
          desc: 'Construa uma ilha de sobrevivência completa com sistema de construção de paredes/pisos com Snap de grade e fogueira.',
          theory: [
            {
              title: 'Sistemas de Construção com Grid Snapping',
              text: 'Sistemas de construção (Building System) projetam uma visualização translúcida (Holograma Verde/Vermelho) via Raycast da câmera, travando em pontos de conexão (Socket Snapping) de peças vizinhas.',
              keyPoints: [
                'Validação de Terreno: Checagem de colisões (Physics.CheckBox) antes de permitir a construção definitiva.',
                'Consumo de Recursos: Remove madeira e pedra do inventário ao posicionar a estrutura.',
              ],
            },
          ],
          code: `// Estrutura de posicionamento com Snap
public class BuildingSnapSystem : MonoBehaviour
{
    [SerializeField] private LayerMask buildSocketLayer;

    public Vector3 GetPlacementPosition(Ray ray, out Quaternion rotation)
    {
        if (Physics.Raycast(ray, out RaycastHit hit, 6f, buildSocketLayer))
        {
            // Encontrou um socket de encaixe de outra parede!
            rotation = hit.transform.rotation;
            return hit.transform.position;
        }
        rotation = Quaternion.identity;
        return ray.GetPoint(4f);
    }
}`,
          output: '[Building System]: Parede de madeira posicionada com socket snap perfeito no piso.',
          lang: 'csharp',
          exercise: {
            id: 'ex-u3d-proj-1',
            prompt: 'Como funciona o sistema de "Socket Snapping" em jogos de construção (como Rust ou Fortnite)?',
            type: 'multiple_choice',
            options: [
              'Pontos invisíveis pré-definidos nas extremidades de paredes e pisos atraem a nova peça quando o jogador mira próximo a elas',
              'As peças caem do céu com paraquedas',
              'O jogo usa apenas números aleatórios',
              'O jogador precisa digitar coordenadas numéricas',
            ],
            correctAnswer: 'Pontos invisíveis pré-definidos nas extremidades de paredes e pisos atraem a nova peça quando o jogador mira próximo a elas',
            hint: 'Pontos de âncora garantem que as paredes fiquem perfeitamente alinhadas sem vãos.',
            explanation: 'Sockets são nós de conexão que capturam a posição e rotação ideais para que as construções se conectem perfeitamente.',
          },
        },
        {
          title: '17. Projeto Integrador 2: FPS Arena 3D com Waves de Inimigos',
          desc: 'Desenvolva uma arena de combate com gerador de hordas, caixas de munição, spawn inteligente de inimigos e placar.',
          theory: [
            {
              title: 'Game Loop de Hordas em FPS',
              text: 'Um sistema de waves gerencia o spawn progressivo de inimigos em pontos fora do campo de visão do jogador, aumentando a dificuldade a cada rodada com novos tipos de inimigos.',
              keyPoints: [
                'Spawn Seguro: Não instanciar inimigos diretamente no campo de visão da câmera (usar Raycast ou checagem de Frustum).',
                'Contador de Vivos: Passar para a próxima wave apenas quando a contagem de inimigos vivos atingir zero.',
              ],
            },
          ],
          code: `// Gerenciador de Waves
public class WaveSpawner : MonoBehaviour
{
    [SerializeField] private Transform[] spawnPoints;
    [SerializeField] private GameObject enemyPrefab;
    private int currentWave = 1;

    public void StartNextWave()
    {
        int enemyCount = currentWave * 5;
        Debug.Log($"Iniciando Wave {currentWave} com {enemyCount} inimigos!");
        // Instancia inimigos nos spawn points
    }
}`,
          output: '[Arena FPS]: Wave 4 iniciada! 20 inimigos instanciados. Placar de Arena: 4.850 pts.',
          lang: 'csharp',
          exercise: {
            id: 'ex-u3d-proj-2',
            prompt: 'Por que jogos de arena evitam instanciar inimigos diretamente na visão do jogador?',
            type: 'multiple_choice',
            options: [
              'Para preservar a imersão e evitar que o jogador veja objetos "brotando" do nada na sua frente',
              'Porque a engine quebra se instanciar perto da câmera',
              'Para economizar energia',
              'Para desabilitar o som',
            ],
            correctAnswer: 'Para preservar a imersão e evitar que o jogador veja objetos "brotando" do nada na sua frente',
            hint: 'Spawns atrás de portas, cantos ou fora do campo de visão mantêm a sensação de um mundo vivo.',
            explanation: 'Instanciar inimigos fora da visão da câmera mantém o suspense e a integridade visual da experiência.',
          },
        },
        {
          title: '18. Menu de Opções Gráficas Avançadas (Qualidade, Resolução, VSync & FOV)',
          desc: 'Construa menus de configurações gráficas conectando com QualitySettings e alterando resoluções de tela.',
          theory: [
            {
              title: 'Configurações de Qualidade Gráfica na Unity',
              text: 'A API `QualitySettings` permite alterar o nível geral de gráficos (Ultra, High, Medium, Low), densidade de sombras, VSync (0 para desligado, 1 para 60Hz) e resolução com `Screen.SetResolution()`.',
              keyPoints: [
                'QualitySettings.SetQualityLevel(index): Ajusta automaticamente dezenas de parâmetros gráficos.',
                'Screen.SetResolution(width, height, FullScreenMode): Altera a resolução da janela.',
                'FOV Slider: Altera `Camera.main.fieldOfView` para conforto visual do jogador.',
              ],
            },
          ],
          code: `using UnityEngine;
using TMPro;

public class GraphicsSettingsMenu : MonoBehaviour
{
    public void SetQuality(int qualityIndex)
    {
        QualitySettings.SetQualityLevel(qualityIndex, true);
    }

    public void SetFullscreen(bool isFullscreen)
    {
        Screen.fullScreen = isFullscreen;
    }

    public void SetFOV(float fov)
    {
        Camera.main.fieldOfView = fov;
    }
}`,
          output: '[Settings]: Nível de qualidade alterado para ULTRA. Resolução: 2560x1440 Fullscreen.',
          lang: 'csharp',
          exercise: {
            id: 'ex-u3d-proj-3',
            prompt: 'Qual método da Unity altera o preset geral de qualidade gráfica (sombras, texturas, iluminação) em tempo de execução?',
            type: 'multiple_choice',
            options: ['QualitySettings.SetQualityLevel()', 'Screen.SetResolution()', 'Camera.SetQuality()', 'Application.SetFPS()'],
            correctAnswer: 'QualitySettings.SetQualityLevel()',
            hint: 'A classe QualitySettings controla todas as opções de renderização da engine.',
            explanation: 'SetQualityLevel aplica os perfis pré-configurados no projeto de forma instantânea.',
          },
        },
        {
          title: '19. Otimização de Polígonos no Blender com Decimate & Exportação glTF/FBX',
          desc: 'Reduza a contagem de triângulos de modelos escaneados ou de alta densidade no Blender mantendo a silhueta.',
          theory: [
            {
              title: 'Retopologia e Modificador Decimate',
              text: 'Modelos esculturais no Blender com 500k triângulos são pesados demais para jogos em tempo real. O modificador Decimate (Collapse / Un-Subdivide) reduz a geometria em 80-90% preservando a forma e mapas UV.',
              keyPoints: [
                'Baking de High-Poly para Low-Poly: Projeta os detalhes do modelo de 1 milhão de polígonos em um Normal Map aplicado no modelo de 5 mil polígonos.',
                'Formatos de Exportação: FBX para pipelines Unity/Unreal; glTF/GLB para Godot e Web.',
              ],
            },
          ],
          code: `// Resumo de script Python no Blender para automação de Decimate
# import bpy
# for obj in bpy.context.selected_objects:
#     modifier = obj.modifiers.new(name="Decimate", type='DECIMATE')
#     modifier.ratio = 0.15 # Reduz para 15% dos polígonos
#     bpy.ops.object.modifier_apply(modifier="Decimate")`,
          output: '[Blender Pipeline]: Modelo decrescido de 320.000 para 18.400 polígonos com UVs preservadas.',
          lang: 'csharp',
          exercise: {
            id: 'ex-u3d-proj-4',
            prompt: 'Qual técnica permite exibir os detalhes de um modelo escultural de 1 milhão de polígonos em um modelo otimizado de apenas 5 mil polígonos?',
            type: 'multiple_choice',
            options: [
              'Fazer o Bake do Normal Map do modelo High-Poly sobre o modelo Low-Poly',
              'Aumentar o brilho do monitor',
              'Exportar em formato TXT',
              'Apagar os materiais do modelo',
            ],
            correctAnswer: 'Fazer o Bake do Normal Map do modelo High-Poly sobre o modelo Low-Poly',
            hint: 'Gera uma textura azulada com os detalhes de relevo da malha complexa.',
            explanation: 'O processo de Bake transfere as normais da geometria complexa para uma textura leve, dando fidelidade visual cinematográfica com custo de processamento mínimo.',
          },
        },
        {
          title: '20. Masterização, Standalone Build & Otimização Final 3D',
          desc: 'Gere a build final para Windows 64-bit com IL2CPP, teste de taxa de quadros e empacotamento do instalador.',
          theory: [
            {
              title: 'Passos Finais para Lançamento Standalone',
              text: 'Antes de gerar o executável final, configure o ícone do jogo, remova câmeras duplicadas, faça o build dos Lightmaps e selecione o modo de compressão de assets LZ4HC para carregamento ultrarrápido.',
              keyPoints: [
                'Compressão LZ4HC: Alta taxa de compressão com descompressão em tempo real quase instantânea.',
                'DirectX 12 / Vulkan: Ative as APIs gráficas mais modernas nas configurações de Player.',
              ],
            },
          ],
          code: `// Exemplo de verificação de FPS em tempo de execução
using UnityEngine;
using TMPro;

public class PerformanceOverlay : MonoBehaviour
{
    [SerializeField] private TextMeshProUGUI fpsText;
    private float deltaTime = 0f;

    private void Update()
    {
        deltaTime += (Time.unscaledDeltaTime - deltaTime) * 0.1f;
        float fps = 1.0f / deltaTime;
        fpsText.text = $"{Mathf.CeilToInt(fps)} FPS";
    }
}`,
          output: '[Final Build]: Standalone Windows x64 gerado com sucesso. Taxa média de quadros: 118 FPS em 1440p.',
          lang: 'csharp',
          exercise: {
            id: 'ex-u3d-proj-5',
            prompt: 'Por que o formato de compressão LZ4HC é amplamente recomendado nas builds finais da Unity?',
            type: 'multiple_choice',
            options: [
              'Porque oferece alta compressão no disco com velocidade de carregamento (loading) extremamente rápida durante o jogo',
              'Porque ele apaga os arquivos temporários do Windows',
              'Porque torna o jogo compatível com televisões antigas',
              'Porque impede travamentos por falta de internet',
            ],
            correctAnswer: 'Porque oferece alta compressão no disco com velocidade de carregamento (loading) extremamente rápida durante o jogo',
            hint: 'Equilíbrio perfeito entre tamanho de download e velocidade de leitura.',
            explanation: 'LZ4HC comprime com eficiência máxima no momento da compilação, permitindo que a CPU descompacte chunks de dados instantaneamente sem pausas longas de carregamento.',
          },
        },
      ],
    },
    quizzesByLevel: {
      iniciante: [
        {
          id: 'q-u3d-ini-1',
          question: 'Qual é a principal razão pela qual engines de jogos utilizam Quaternions para rotações 3D em vez de somar ângulos de Euler simples?',
          options: [
            'Para evitar o fenômeno de Gimbal Lock (travamento de eixos)',
            'Para tornar o modelo 3D invisível',
            'Para aumentar o volume do áudio',
            'Porque Quaternions usam menos memória que um número inteiro',
          ],
          correctIndex: 0,
          explanation: 'Quaternions eliminam a singularidade onde dois eixos de rotação se alinham, garantindo rotações esféricas sem perda de graus de liberdade.',
        },
        {
          id: 'q-u3d-ini-2',
          question: 'No método Raycast da física 3D, o que o vetor hit.normal representa?',
          options: [
            'O vetor perpendicular à face onde o raio colidiu',
            'A velocidade do tiro',
            'A cor do objeto atingido',
            'A gravidade do mundo',
          ],
          correctIndex: 0,
          explanation: 'hit.normal é a direção que aponta diretamente para fora da superfície atingida no ponto exato da colisão.',
        },
      ],
      intermediario: [
        {
          id: 'q-u3d-med-1',
          question: 'Em física de veículos com WheelCollider, o que acontece quando aplicamos "brakeTorque"?',
          options: [
            'Aplica força de resistência de frenagem que desacelera a rotação da roda',
            'Aumenta a velocidade do carro',
            'Faz o carro voar',
            'Desliga o motor',
          ],
          correctIndex: 0,
          explanation: 'BrakeTorque aplica torque de frenagem diretamente nas rodas selecionadas.',
        },
        {
          id: 'q-u3d-med-2',
          question: 'Qual componente é responsável por fazer com que inimigos sigam rotas inteligentes desviando de paredes em um mapa 3D?',
          options: ['NavMeshAgent', 'Rigidbody simples', 'MeshCollider', 'AudioSource'],
          correctIndex: 0,
          explanation: 'O NavMeshAgent calcula o caminho mais curto usando a malha de navegação (NavMesh) com prevenção de obstáculos.',
        },
      ],
      avancado: [
        {
          id: 'q-u3d-adv-1',
          question: 'Qual é a diferença entre Frustum Culling e Occlusion Culling na renderização 3D?',
          options: [
            'Frustum Culling descarta o que está fora do campo de visão da câmera; Occlusion Culling descarta o que está dentro do campo mas tapado por outros objetos',
            'Não há diferença',
            'Frustum Culling funciona apenas em 2D',
            'Occlusion Culling é exclusivo para áudio',
          ],
          correctIndex: 0,
          explanation: 'Ambos trabalham em conjunto para evitar que a GPU gaste tempo desenhando triângulos invisíveis.',
        },
      ],
      projetos: [
        {
          id: 'q-u3d-proj-1',
          question: 'Como o Bake de Normal Map transfere detalhes de um modelo 3D escultural para um modelo de jogo leve?',
          options: [
            'Calculando as direções das normais da malha High-Poly e gravando-as em uma textura RGB aplicada sobre a malha Low-Poly',
            'Pintando a tela com giz virtual',
            'Convertendo o modelo em um arquivo de áudio',
            'Aumentando a quantidade de memória RAM exigida',
          ],
          correctIndex: 0,
          explanation: 'O Normal Map codifica a orientação das superfícies em canais de cor, enganando o cálculo de iluminação para simular relevo de milhões de triângulos.',
        },
      ],
    },
  },

  // =========================================================================
  // UNREAL ENGINE 5 + C++ + BLUEPRINTS (Rendering, Shaders, AI, Multiplayer, Chaos)
  // =========================================================================
  unreal_cpp: {
    topicsByLevel: {
      iniciante: [
        {
          title: '1. Unreal Engine 5 Arquitetura: C++, UCLASS, UPROPERTY & Blueprints',
          desc: 'Compreenda a ponte entre C++ de alto desempenho e o sistema visual de Blueprints na Unreal 5.',
          theory: [
            {
              title: 'A Dupla C++ e Blueprints na Unreal 5',
              text: 'Projetos profissionais na Unreal utilizam C++ para a lógica fundamental pesada (cálculos matemáticos, sistemas de inventário, rede multiplayer e regras centrais) e Blueprints para ajustes visuais, efeitos sonoros e design de fases.',
              keyPoints: [
                'UCLASS() e GENERATED_BODY(): Macros do Unreal Header Tool (UHT) que habilitam Garbage Collection e reflexão.',
                'UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Combat"): Expõe variáveis para o editor visual e Blueprints.',
                'UFUNCTION(BlueprintCallable): Permite chamar funções C++ diretamente dentro de grafos de Blueprints.',
              ],
            },
          ],
          code: `// Exemplo de Header C++ na Unreal Engine 5
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Character.h"
#include "MyHeroCharacter.generated.h"

UCLASS()
class MYGAME_API AMyHeroCharacter : public ACharacter
{
    GENERATED_BODY()

public:
    AMyHeroCharacter();

protected:
    virtual void BeginPlay() override;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Stats")
    float Health = 100.0f;

    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Movement")
    float SprintSpeed = 900.0f;

    UFUNCTION(BlueprintCallable, Category = "Combat")
    void PerformAttack();
};`,
          output: '[Unreal Build Tool]: Compilação C++ concluída com sucesso. UHT gerou MyHeroCharacter.generated.h.',
          lang: 'cpp',
          exercise: {
            id: 'ex-ue5-ini-1',
            prompt: 'Qual macro do Unreal C++ deve ser colocada acima de uma variável para que ela possa ser editada no Editor e lida em Blueprints?',
            type: 'multiple_choice',
            options: ['UPROPERTY(EditAnywhere, BlueprintReadWrite)', 'UFUNCTION(BlueprintCallable)', 'UCLASS()', 'GENERATED_BODY()'],
            correctAnswer: 'UPROPERTY(EditAnywhere, BlueprintReadWrite)',
            hint: 'A macro UPROPERTY controla as propriedades de reflexão e integração da variável.',
            explanation: 'UPROPERTY registra o campo no sistema de reflexão da Unreal Engine, tornando-o visível no painel Details e em grafos de Blueprint.',
          },
        },
        {
          title: '2. Nanite & Lumen: A Nova Era de Geometria e Iluminação Global',
          desc: 'Domine a tecnologia de micropolígonos Nanite e a iluminação global em tempo real Lumen da Unreal 5.',
          theory: [
            {
              title: 'Nanite e Lumen: Revolução Gráfica',
              text: 'Nanite renderiza malhas com centenas de milhões de triângulos em tempo real através de micropolígonos virtuais, eliminando a necessidade manual de criar LODs. Lumen é o sistema de Iluminação Global (GI) e reflexos que reage instantaneamente a mudanças de luz.',
              keyPoints: [
                'Nanite Virtualized Geometry: Transmite para a GPU apenas os triângulos visíveis no tamanho de um pixel.',
                'Lumen Global Illumination: Calcula saltos de luz indireta em tempo real sem necessidade de Light Baking.',
                'Virtual Shadow Maps (VSM): Sombras de altíssima resolução com bordas nítidas para geometrias densas de Nanite.',
              ],
            },
          ],
          code: `// Verificação de Nanite em tempo de execução via C++
#include "Engine/StaticMesh.h"

void ValidateNaniteMesh(UStaticMesh* Mesh)
{
    if (Mesh && Mesh->NaniteSettings.bEnabled)
    {
        UE_LOG(LogTemp, Log, TEXT("Mesh %s possui geometria Nanite ativa com micropolígonos!"), *Mesh->GetName());
    }
}`,
          output: '[Unreal 5 Renderer]: Lumen GI ativo (Hardware Ray Tracing). Nanite renderizando 14.8M de triângulos em 4.2ms.',
          lang: 'cpp',
          exercise: {
            id: 'ex-ue5-ini-2',
            prompt: 'O que a tecnologia Nanite da Unreal Engine 5 faz com modelos 3D hiper-detalhados?',
            type: 'multiple_choice',
            options: [
              'Virtualiza a geometria e renderiza apenas a quantidade de micropolígonos correspondente à resolução da tela em tempo real, sem necessidade de LODs manuais',
              'Apaga todas as texturas do modelo',
              'Converte o jogo em 2D',
              'Desliga a iluminação global',
            ],
            correctAnswer: 'Virtualiza a geometria e renderiza apenas a quantidade de micropolígonos correspondente à resolução da tela em tempo real, sem necessidade de LODs manuais',
            hint: 'Permite importar esculturas do ZBrush com milhões de triângulos diretamente.',
            explanation: 'Nanite transmite e desenha dinamicamente apenas os triângulos que cabem em cada pixel da tela, mantendo 60+ FPS mesmo com bilhões de polígonos na cena.',
          },
        },
        {
          title: '3. Material Editor & Shaders em HLSL: PBR e Shaders Personalizados',
          desc: 'Construa materiais fotorrealistas no Material Editor com nós matemáticos e Custom HLSL Expression.',
          theory: [
            {
              title: 'Pipeline de Materiais da Unreal 5',
              text: 'O Material Editor compila grafos visuais para HLSL (High-Level Shading Language). Trabalhamos com Base Color, Metallic, Specular, Roughness, Emissive e World Position Offset (para animação de folhas e ondas de água).',
              keyPoints: [
                'Material Instances: Criam variações instantâneas de materiais sem recompilar shaders na GPU.',
                'Custom Node (HLSL): Permite escrever blocos puros de código HLSL dentro do grafo.',
              ],
            },
          ],
          code: `// Trecho conceitual de HLSL dentro de um Custom Node na Unreal
// float3 Color = BaseColor;
// float Fresnel = pow(1.0 - saturate(dot(Normal, ViewDir)), Exponent);
// return Color + (Fresnel * EmissiveColor);`,
          output: '[Shader Compiler]: Material "M_SciFi_Armor" compilado para DirectX 12 / SM6 com sucesso.',
          lang: 'cpp',
          exercise: {
            id: 'ex-ue5-ini-3',
            prompt: 'Por que devemos criar "Material Instances" (Instâncias de Material) em vez de duplicar Master Materials na Unreal?',
            type: 'multiple_choice',
            options: [
              'Porque Material Instances alteram parâmetros instantaneamente sem exigir recompilação de shaders, economizando tempo e performance',
              'Porque Material Instances são obrigatórias para ter som',
              'Porque Master Materials não aceitam texturas',
              'Para mudar a linguagem do jogo para C++',
            ],
            correctAnswer: 'Porque Material Instances alteram parâmetros instantaneamente sem exigir recompilação de shaders, economizando tempo e performance',
            hint: 'Instâncias reutilizam o código do shader já compilado, trocando apenas valores.',
            explanation: 'As instâncias de material utilizam o bytecode de shader já compilado pelo Master Material, permitindo ajustar cores, texturas e brilho em tempo real no editor sem pausar o fluxo de trabalho.',
          },
        },
        {
          title: '4. Chaos Physics: Destruição Dinâmica, Fraturas e Campos de Força',
          desc: 'Crie paredes e construções destrutíveis com Chaos Geometry Collections e Fields de Explosão.',
          theory: [
            {
              title: 'Chaos Destruction System',
              text: 'O motor de física Chaos permite fraturar qualquer malha estática em pedaços geométricos pré-calculados (Voronoi Fracture) e aplicar forças de impacto que quebram a estrutura fisicamente quando o dano ultrapassa o limiar de resistência (Damage Threshold).',
              keyPoints: [
                'Geometry Collection: O asset de malha fraturada gerenciado pelo Chaos.',
                'Field Systems: Campos radiais (Radial Falloff) que aplicam impulsos e desancoragem de blocos.',
              ],
            },
          ],
          code: `// Aplicação de dano Chaos via C++
#include "GeometryCollection/GeometryCollectionComponent.h"

void ApplyChaosExplosion(UGeometryCollectionComponent* ChaosComp, FVector Location, float Radius, float Impulse)
{
    if (ChaosComp)
    {
        ChaosComp->ApplyRadialImpulse(Location, Radius, Impulse, ERadialImpulseFalloff::RIF_Linear, true);
    }
}`,
          output: '[Chaos Physics]: Parede de concreto fraturada em 48 pedaços dinâmicos reagindo à onda de choque.',
          lang: 'cpp',
          exercise: {
            id: 'ex-ue5-ini-4',
            prompt: 'Qual sistema substituiu o PhysX para destruição e física avançada na Unreal Engine 5?',
            type: 'multiple_choice',
            options: ['Chaos Physics', 'Havok Classic', 'Box2D', 'Bullet Physics'],
            correctAnswer: 'Chaos Physics',
            hint: 'É o motor de física próprio da Epic Games integrado na UE5.',
            explanation: 'Chaos Physics é o sistema de alta fidelidade da Unreal Engine 5 que gerencia colisões, tecidos (Cloth), veículos e destruição volumétrica.',
          },
        },
        {
          title: '5. Game AI na Unreal: Behavior Trees, Blackboards & Environment Query System (EQS)',
          desc: 'Desenvolva IAs avançadas com Behavior Trees, memória sensorial no Blackboard e testes espaciais com EQS.',
          theory: [
            {
              title: 'Arquitetura de Inteligência Artificial da Unreal',
              text: 'A IA da Unreal separa a tomada de decisão (Behavior Tree) da memória/dados do agente (Blackboard). O Environment Query System (EQS) realiza varreduras espaciais no cenário para encontrar o melhor ponto de cobertura ou ângulo de tiro.',
              keyPoints: [
                'Blackboard: Guarda chaves como `TargetActor`, `SelfLocation`, `AlertState`.',
                'Decorators (Condicionais): Validam se o agente tem linha de visão antes de executar uma Task.',
                'EQS Query: Gera uma grade de pontos e atribui pontuação (Score) baseada em distância do inimigo e visibilidade.',
              ],
            },
          ],
          code: `// Exemplo de Task customizada em C++ para Behavior Tree
#include "BehaviorTree/BTTaskNode.h"
#include "AIController.h"

EBTNodeResult::Type UBTTask_FindCoverPoint::ExecuteTask(UBehaviorTreeComponent& OwnerComp, uint8* NodeMemory)
{
    AAIController* AICon = OwnerComp.GetAIOwner();
    if (!AICon) return EBTNodeResult::Failed;

    // Localiza ponto de cobertura e grava no Blackboard
    return EBTNodeResult::Succeeded;
}`,
          output: '[Unreal AI]: Behavior Tree ativa. EQS selecionou ponto de cobertura com score 94.2/100.',
          lang: 'cpp',
          exercise: {
            id: 'ex-ue5-ini-5',
            prompt: 'Qual componente na Unreal Engine funciona como a "memória de dados" da Inteligência Artificial em um Behavior Tree?',
            type: 'multiple_choice',
            options: ['Blackboard', 'NavMesh', 'CameraComponent', 'GameInstance'],
            correctAnswer: 'Blackboard',
            hint: 'Armazena valores como TargetActor, Posições e Estados que a árvore de comportamento lê.',
            explanation: 'O Blackboard é o quadro de variáveis que a Behavior Tree consulta para tomar decisões contextuais.',
          },
        },
      ],
      intermediario: [
        {
          title: '6. Unreal Multiplayer: Arquitetura Cliente-Servidor e Replication',
          desc: 'Entenda a autoridade do servidor, variáveis replicadas com DOREPLIFETIME e RepNotifies na UE5.',
          theory: [
            {
              title: 'Arquitetura de Rede da Unreal Engine',
              text: 'A Unreal utiliza uma arquitetura Servidor Dedicado / Autoritativo (Authoritative Server). O cliente nunca decide seu próprio dano ou inventário; ele envia comandos (RPCs) para o servidor, que valida e replica as alterações (Replication) para todos os clientes conectados.',
              keyPoints: [
                'UPROPERTY(Replicated) e UPROPERTY(ReplicatedUsing = OnRep_Health): Replicação de variáveis com callbacks de notificação.',
                'GetLifetimeReplicatedProps: Função obrigatória em C++ para registrar quais variáveis viajam pela rede.',
                'Role == ROLE_Authority: Verifica se o código está sendo executado no servidor.',
              ],
            },
          ],
          code: `// Exemplo de Replicação C++ na Unreal
#include "Net/UnrealNetwork.h"

void AMyHeroCharacter::GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const
{
    Super::GetLifetimeReplicatedProps(OutLifetimeProps);

    // Registra Health para replicação pela rede
    DOREPLIFETIME(AMyHeroCharacter, Health);
}

void AMyHeroCharacter::OnRep_Health()
{
    // Executado no cliente automaticamente quando o servidor atualiza o Health!
    UpdateHealthHUD(Health);
}`,
          output: '[Unreal NetDriver]: Variável Health replicada para 4 clientes. OnRep_Health disparado.',
          lang: 'cpp',
          exercise: {
            id: 'ex-ue5-med-1',
            prompt: 'Na arquitetura de rede da Unreal Engine, onde devem ser decididas ações críticas como causar dano ou conceder itens?',
            type: 'multiple_choice',
            options: [
              'Exclusivamente no Servidor (ROLE_Authority) para evitar trapaças e descompassos',
              'No cliente do jogador local',
              'Na placa de som',
              'Em um arquivo TXT no computador do usuário',
            ],
            correctAnswer: 'Exclusivamente no Servidor (ROLE_Authority) para evitar trapaças e descompassos',
            hint: 'O modelo é de servidor autoritativo.',
            explanation: 'Em jogos multiplayer competitivos, o servidor detém a autoridade total para processar regras de combate e física, prevenindo manipulação por clientes mal-intencionados.',
          },
        },
        {
          title: '7. Remote Procedure Calls (RPCs): Server, Client & Multicast',
          desc: 'Implemente comunicação de rede com funções UFUNCTION(Server, Reliable), Client e NetMulticast.',
          theory: [
            {
              title: 'Tipos de RPCs na Unreal Engine',
              text: 'RPCs são funções chamadas localmente que executam em outra máquina da rede: Server RPC (Cliente chama -> Executa no Servidor), Client RPC (Servidor chama -> Executa no Cliente dono) e NetMulticast (Servidor chama -> Executa no Servidor e em Todos os Clientes).',
              keyPoints: [
                'Reliable vs Unreliable: Reliable garante entrega na ordem (usado para compras/dano); Unreliable descarta pacotes se houver perda (usado para cosméticos/passos).',
                'WithValidation: Validação obrigatória no servidor para checar se o input do cliente é plausível.',
              ],
            },
          ],
          code: `// Declaração de RPC Server em C++
UFUNCTION(Server, Reliable, WithValidation)
void Server_FireWeapon(FVector FireDirection);

bool AMyHeroCharacter::Server_FireWeapon_Validate(FVector FireDirection)
{
    // Validação anti-cheat: checa se o jogador tem munição e se o vetor é normalizado
    return FireDirection.SizeSquared() <= 1.1f;
}

void AMyHeroCharacter::Server_FireWeapon_Implementation(FVector FireDirection)
{
    // Executa no servidor e dispara Multicast para efeito visual
    Multicast_SpawnMuzzleEffect();
}`,
          output: '[RPC Network]: Server_FireWeapon validado e executado com sucesso no servidor dedicado.',
          lang: 'cpp',
          exercise: {
            id: 'ex-ue5-med-2',
            prompt: 'Qual tipo de RPC deve ser disparado pelo servidor para que TODOS os jogadores na sessão vejam a explosão de uma granada?',
            type: 'multiple_choice',
            options: ['NetMulticast', 'Server RPC', 'Client RPC', 'Local Function'],
            correctAnswer: 'NetMulticast',
            hint: 'O prefixo "Multi" indica envio para múltiplos clientes conectados.',
            explanation: 'NetMulticast propaga o evento do servidor para todos os clientes conectados simultaneamente, ideal para efeitos visuais e áudio de impacto.',
          },
        },
        {
          title: '8. Otimização de Performance com Unreal Insights & GPU Profiling',
          desc: 'Identifique micro-stutters com a ferramenta de telemetria profunda Unreal Insights e stat gpu.',
          theory: [
            {
              title: 'Telemetria e Diagnóstico com Unreal Insights',
              text: 'O Unreal Insights captura traços em nível de microsegundo da CPU (Game Thread, Render Thread, RHI) e GPU, revelando exatamente quais nós de Blueprint ou chamadas de C++ estão consumindo ciclos excessivos.',
              keyPoints: [
                'stat unit / stat unitgraph: Mostra o tempo de Frame, Game Thread, Draw e GPU em milissegundos.',
                'stat gpu: Abre a lista discriminada de custos de renderização (BasePass, Shadows, Lumen, PostProcess).',
              ],
            },
          ],
          code: `// Medição de escopo em C++ para o Unreal Insights
#include "ProfilingDebugging/CpuProfilerTrace.h"

void AMyHeroCharacter::ComputeComplexPathfinding()
{
    TRACE_CPUPROFILER_EVENT_SCOPE(Hero_ComputeComplexPathfinding);
    // Código pesado analisado no gráfico de timeline do Unreal Insights
}`,
          output: '[Unreal Insights]: Sessão de trace gravada. GameThread: 4.8ms, RenderThread: 3.2ms, GPU: 6.1ms (144 FPS).',
          lang: 'cpp',
          exercise: {
            id: 'ex-ue5-med-3',
            prompt: 'No console de comandos da Unreal Engine, qual comando exibe os tempos de execução divididos entre GameThread, RenderThread e GPU?',
            type: 'multiple_choice',
            options: ['stat unit', 'stat fps', 'r.SetRes', 'show collision'],
            correctAnswer: 'stat unit',
            hint: 'Exibe uma tabela compacta no canto superior da tela com os tempos de cada thread.',
            explanation: '"stat unit" é o comando fundamental de diagnóstico na Unreal, permitindo identificar se o gargalo do jogo é de CPU (Game/Draw) ou de GPU.',
          },
        },
      ],
      avancado: [
        {
          title: '9. Shaders HLSL Customizados & Post-Process Materials',
          desc: 'Construa efeitos visuais cinematográficos como visão noturna, contornos cel-shading com SceneTexture e Custom Stencil.',
          theory: [
            {
              title: 'Materiais de Pós-Processamento e Stencil Buffer',
              text: 'Shaders de pós-processamento atuam sobre o buffer de pixels renderizados da tela. Usando SceneTexture:CustomStencil e SceneTexture:SceneDepth, podemos desenhar contornos brilhantes (Outlines) ao redor de inimigos ou itens destacados através de paredes.',
              keyPoints: [
                'Custom Stencil: Permite mascarar objetos específicos (ex: Stencil Value = 254) para aplicar efeitos visuais exclusivos.',
                'Edge Detection com Sobel Filter: Amostra pixels vizinhos no buffer de profundidade/normais para desenhar bordas cel-shading.',
              ],
            },
          ],
          code: `// Conceito de detecção de borda Sobel em Material Graph da Unreal
// Float2 UV = GetSceneTextureUV();
// Float DepthC = SceneDepth(UV);
// Float DepthL = SceneDepth(UV + float2(-PixelSize.x, 0));
// Float DepthR = SceneDepth(UV + float2(PixelSize.x, 0));
// Float Edge = abs(DepthL - DepthR);`,
          output: '[PostProcess Shader]: Cel-Shading Outline ativo via Custom Stencil Buffer.',
          lang: 'cpp',
          exercise: {
            id: 'ex-ue5-adv-1',
            prompt: 'Qual buffer da Unreal Engine permite destacar silhuetas de personagens através de paredes com shaders de pós-processamento?',
            type: 'multiple_choice',
            options: ['Custom Stencil (Custom Depth)', 'Audio Buffer', 'Color Map', 'Normal Map'],
            correctAnswer: 'Custom Stencil (Custom Depth)',
            hint: 'Permite gravar um valor numérico por malha que pode ser lido no shader da tela.',
            explanation: 'O Custom Stencil grava IDs inteiros em um buffer separado de profundidade, permitindo que pós-processadores filtrem e desenhem contornos ao redor de atores específicos.',
          },
        },
        {
          title: '10. Arquitetura de Gameplay Ability System (GAS) na Unreal',
          desc: 'Domine o framework profissional da Epic para habilidades de combate, atributos (Health/Mana), tags e efeitos.',
          theory: [
            {
              title: 'O que é o Gameplay Ability System (GAS)?',
              text: 'O GAS é o framework de alta flexibilidade usado pela Epic Games (em Fortnite e Paragon) para gerenciar habilidades ativas/passivas, custos de mana, cooldowns, status de buffs/debuffs e replicação de rede automática de atributos.',
              keyPoints: [
                'Gameplay Abilities (UGameplayAbility): A lógica de ativação e execução da habilidade.',
                'AttributeSet: Classe C++ que define atributos replicados (Vida, Mana, Força, Armadura).',
                'Gameplay Tags: Sistema hierárquico de tags (ex: `State.Debuff.Stunned`, `Ability.Spell.Fireball`) que controlam permissões de ação.',
              ],
            },
          ],
          code: `// Declaração de AttributeSet em C++ no GAS
#include "AttributeSet.h"
#include "AbilitySystemComponent.h"
#include "MyHeroAttributeSet.generated.h"

UCLASS()
class MYGAME_API UMyHeroAttributeSet : public UAttributeSet
{
    GENERATED_BODY()

public:
    UPROPERTY(BlueprintReadOnly, ReplicatedUsing = OnRep_Mana, Category = "Attributes")
    FGameplayAttributeData Mana;
    ATTRIBUTE_ACCESSORS(UMyHeroAttributeSet, Mana)

    UFUNCTION()
    virtual void OnRep_Mana(const FGameplayAttributeData& OldMana);
};`,
          output: '[Gameplay Ability System]: AttributeSet inicializado. 12 habilidades ativas vinculadas com Gameplay Tags.',
          lang: 'cpp',
          exercise: {
            id: 'ex-ue5-adv-2',
            prompt: 'Qual é o principal propósito do Gameplay Ability System (GAS) na Unreal Engine?',
            type: 'multiple_choice',
            options: [
              'Gerenciar habilidades de combate, custos, cooldowns, buffs/debuffs e atributos com suporte nativo a multiplayer',
              'Substituir a placa de vídeo por processamento em nuvem',
              'Desenhar os modelos 3D',
              'Gravar áudio com microfone',
            ],
            correctAnswer: 'Gerenciar habilidades de combate, custos, cooldowns, buffs/debuffs e atributos com suporte nativo a multiplayer',
            hint: 'Framework completo para RPGs, MOBAs e Shooters da Epic Games.',
            explanation: 'O GAS fornece uma arquitetura escalável e pronta para rede para qualquer jogo com sistemas complexos de magias, habilidades e atributos numéricos.',
          },
        },
      ],
      projetos: [
        {
          title: '11. Projeto Integrador: Multiplayer Arena Shooter C++ Completo',
          desc: 'Desenvolva um jogo de tiro multiplayer em C++ na Unreal 5 com Dedicated Server, respawn, placar e combate sincronizado.',
          theory: [
            {
              title: 'Pipeline de Jogo Competitivo na UE5',
              text: 'Um Arena Shooter completo exige gerenciamento de GameMode (que roda apenas no servidor), GameState (que replica o estado da partida para todos), PlayerState (que guarda pontuação e ping) e PlayerController (que recebe os inputs locais).',
              keyPoints: [
                'GameModeBase: Define as regras da partida, tempo restante e condições de vitória.',
                'Lag Compensation & Hitscan: Validação de disparos com rebobinamento de tempo (Time Rewind) para tiros justos com ping alto.',
              ],
            },
          ],
          code: `// Exemplo de GameMode na Unreal C++
#include "GameFramework/GameModeBase.h"

void AMyArenaGameMode::PlayerKilled(AController* Killer, AController* Victim)
{
    if (Killer && Killer->PlayerState)
    {
        // Incrementa score no PlayerState replicado
        Killer->PlayerState->Score += 1.0f;
    }
    // Agenda respawn do jogador derrotado
}`,
          output: '[Unreal Dedicated Server]: Partida 4v4 iniciada na porta 7777. Tick rate estável a 60 Hz.',
          lang: 'cpp',
          exercise: {
            id: 'ex-ue5-proj-1',
            prompt: 'Na Unreal Engine multiplayer, qual classe existe APENAS no servidor e contém as regras do jogo e condições de vitória?',
            type: 'multiple_choice',
            options: ['AGameModeBase', 'AGameStateBase', 'APlayerState', 'APlayerController'],
            correctAnswer: 'AGameModeBase',
            hint: 'Os clientes não recebem essa classe para evitar trapaças e vazamento das regras do jogo.',
            explanation: 'AGameModeBase roda exclusivamente na máquina do servidor, garantindo que as regras e julgamento da partida sejam 100% seguros.',
          },
        },
      ],
    },
    quizzesByLevel: {
      iniciante: [
        {
          id: 'q-ue-ini-1',
          question: 'O que o sistema Nanite da Unreal Engine 5 oferece para o desenvolvimento de jogos 3D?',
          options: [
            'Renderização em tempo real de malhas com milhões de micropolígonos com resolução baseada em pixels sem necessidade de LODs manuais',
            'Substituição de todo o código C# por JavaScript',
            'Eliminação de todos os sons do jogo',
            'Geração automática de personagens sem modelos 3D',
          ],
          correctIndex: 0,
          explanation: 'Nanite permite importar modelos esculturais de altíssima densidade diretamente na cena sem perda de desempenho.',
        },
      ],
      intermediario: [
        {
          id: 'q-ue-med-1',
          question: 'Em C++ na Unreal Engine, qual macro e tipo de RPC deve ser utilizado para enviar um comando do jogador para ser processado pelo Servidor?',
          options: ['UFUNCTION(Server, Reliable)', 'UFUNCTION(Client, Unreliable)', 'UFUNCTION(NetMulticast)', 'UPROPERTY(Replicated)'],
          correctIndex: 0,
          explanation: 'Server RPCs são enviados do cliente para o servidor autoritativo.',
        },
      ],
      avancado: [
        {
          id: 'q-ue-adv-1',
          question: 'Qual é o papel do "AttributeSet" no Gameplay Ability System (GAS) da Unreal?',
          options: [
            'Definir e armazenar os atributos numéricos replicados do personagem como Vida, Mana, Defesa e Velocidade',
            'Desenhar a água do oceano',
            'Criar luzes no cenário',
            'Salvar arquivos de vídeo',
          ],
          correctIndex: 0,
          explanation: 'O AttributeSet centraliza os valores de atributos e seus modificadores com replicação e clamps matemáticos.',
        },
      ],
      projetos: [
        {
          id: 'q-ue-proj-1',
          question: 'Qual classe multiplayer na Unreal Engine existe apenas no Servidor e gerencia o ciclo da partida?',
          options: ['GameMode', 'GameState', 'PlayerState', 'HUD'],
          correctIndex: 0,
          explanation: 'GameMode é exclusivo do servidor e governa as regras da partida.',
        },
      ],
    },
  },
};
