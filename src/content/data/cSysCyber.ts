import { TechCurriculumData } from '../techCurriculum';

export const C_SYS_CYBER_CURRICULUM: TechCurriculumData = {
  topicsByLevel: {
    iniciante: [
      {
        title: '1. Fundamentos de C, Tipos de Dados e Compilação com GCC',
        desc: 'Entenda como o código C é convertido em código de máquina e conheça a anatomia de um binário ELF.',
        theory: [
          {
            title: 'Compilação e Arquitetura de Memória',
            text: 'C é uma linguagem compilada de baixo nível que concede controle total sobre memória física e registradores de CPU. A compilação passa por 4 fases: Pré-processamento (#include/#define), Compilação (Assembly), Montagem (Object code .o) e Linkedição (Binário executável ELF).',
            keyPoints: [
              'gcc -Wall -Wextra -O2 programa.c -o programa',
              'Função main() como ponto de entrada padrão: int main(int argc, char *argv[])',
              'Tipos de dados fundamentais: char (1B), short (2B), int (4B), long (8B), ponteiros (8B em 64-bit).',
            ],
            conceptCard: '⚙️ Flag Essencial: Sempre use -Wall -Wextra no GCC para ativar avisos críticos de compilação.',
          },
        ],
        code: `#include <stdio.h>

int main(int argc, char *argv[]) {
    printf("=== Segurança e Baixo Nível em C ===\\n");
    printf("Tamanho de um int: %zu bytes\\n", sizeof(int));
    printf("Tamanho de um ponteiro: %zu bytes\\n", sizeof(void*));
    return 0;
}`,
        output: `=== Segurança e Baixo Nível em C ===
Tamanho de um int: 4 bytes
Tamanho de um ponteiro: 8 bytes (Arquitetura x86_64)`,
        lang: 'c',
        exercise: {
          id: 'ex-c-ini-1',
          prompt: 'Qual operador da linguagem C retorna o tamanho em bytes de uma variável ou tipo de dado na memória?',
          type: 'multiple_choice',
          options: ['sizeof', 'len()', 'size()', 'bytesof'],
          correctAnswer: 'sizeof',
          hint: 'É um operador avaliado em tempo de compilação.',
          explanation: 'O operador sizeof retorna o tamanho em bytes alocado para o tipo de dado na arquitetura alvo.',
        },
      },
      {
        title: '2. Ponteiros, Aritmética de Endereços e Operador de Desreferência (* e &)',
        desc: 'Compreenda endereços de memória RAM física e virtual, operadores & (endereço) e * (conteúdo).',
        theory: [
          {
            title: 'Ponteiros: O Coração de C e da Segurança',
            text: 'Um ponteiro é uma variável que armazena o endereço de memória de outra variável. Dominar ponteiros é obrigatório para entender vulnerabilidades de corrupção de memória e engenharia reversa.',
            keyPoints: [
              'int x = 42; int *ptr = &x;',
              '&x obtém o endereço de x na memória RAM (ex: 0x7ffd12345678).',
              '*ptr acessa ou modifica o valor armazenado naquele endereço.',
              'Ponteiro nulo: int *ptr = NULL; (endereço 0x0, causa Segmentation Fault se desreferenciado).',
            ],
          },
        ],
        code: `#include <stdio.h>

int main() {
    int valor = 1337;
    int *ptr = &valor; // ptr aponta para o endereço de memória de valor

    printf("Valor original: %d\\n", valor);
    printf("Endereco de memoria: %p\\n", (void*)ptr);

    *ptr = 9999; // Modifica a memoria diretamente pelo ponteiro
    printf("Novo valor apos alteracao por ponteiro: %d\\n", valor);
    return 0;
}`,
        output: `Valor original: 1337
Endereco de memoria: 0x7fff5fbff7c0
Novo valor apos alteracao por ponteiro: 9999`,
        lang: 'c',
        exercise: {
          id: 'ex-c-ini-2',
          prompt: 'Qual operador em C é usado para obter o endereço de memória de uma variável existente?',
          type: 'multiple_choice',
          options: ['& (E comercial)', '* (Asterisco)', '-> (Seta)', '% (Porcentagem)'],
          correctAnswer: '& (E comercial)',
          hint: 'Operador "address-of".',
          explanation: 'O operador & (endereço-de) retorna a localização de memória de uma variável.',
        },
      },
      {
        title: '3. Alocação Dinâmica de Memória: Malloc, Calloc, Realloc e Free',
        desc: 'Gerencie a memória Heap dinamicamente e previna Memory Leaks e Double Free.',
        theory: [
          {
            title: 'Stack vs Heap',
            text: 'A Stack gerencia variáveis locais de forma automática e rápida com escopo de função. O Heap gerencia alocações dinâmicas persistentes de tamanho variável criadas com malloc(). Toda memória alocada no Heap DEVE ser liberada com free().',
            keyPoints: [
              'int *arr = (int*)malloc(10 * sizeof(int));',
              'Sempre checar se o retorno é NULL (falha de alocação por falta de RAM).',
              'free(arr); arr = NULL; (evita ponteiros pendentes / Dangling Pointers).',
            ],
            conceptCard: '⚠️ Risco de Segurança: Acessar memória após free() é uma vulnerabilidade grave chamada Use-After-Free (UAF).',
          },
        ],
        code: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int n = 5;
    int *buffer = (int*)malloc(n * sizeof(int));

    if (buffer == NULL) {
        perror("Erro de alocacao de memoria");
        return 1;
    }

    for (int i = 0; i < n; i++) {
        buffer[i] = (i + 1) * 10;
    }

    printf("Array dinâmico alocado no Heap com sucesso.\\n");
    free(buffer);    // Liberacao obrigatoria
    buffer = NULL;   // Previne Dangling Pointer
    return 0;
}`,
        output: `Array dinâmico alocado no Heap com sucesso.
Memória liberada sem Memory Leaks.`,
        lang: 'c',
        exercise: {
          id: 'ex-c-ini-3',
          prompt: 'Qual função da biblioteca padrão <stdlib.h> é obrigatória para liberar memória alocada no Heap e evitar Memory Leaks?',
          type: 'multiple_choice',
          options: ['free()', 'delete()', 'clear()', 'drop()'],
          correctAnswer: 'free()',
          hint: 'Libera o bloco de memória apontado pelo ponteiro.',
          explanation: 'Em C puro, free() devolve a memória Heap alocada pelo malloc() de volta para o gerenciador do sistema.',
        },
      },
      {
        title: '4. Strings em C, Manipulação de Buffers e Riscos de Segurança',
        desc: 'Entenda strings como arrays de char terminados em NULL (\'\\0\') e funções seguras.',
        theory: [
          {
            title: 'Anatomia de Strings em C',
            text: 'C não possui um tipo string nativo de alto nível; strings são sequências de bytes com um terminador nulo \\0. Usar funções inseguras como gets() ou strcpy() sem limite de tamanho causa Buffer Overflow.',
            keyPoints: [
              'Inseguro: strcpy, strcat, sprintf, gets (NUNCA use).',
              'Seguro: strncpy, strncat, snprintf, fgets (sempre especificando o tamanho máximo do buffer).',
            ],
          },
        ],
        code: `#include <stdio.h>
#include <string.h>

int main() {
    char seguro[16];
    // snprintf garante que nunca ultrapassará 15 chars + '\\0'
    snprintf(seguro, sizeof(seguro), "User_%s", "CyberDev2026");

    printf("String segura gerada: %s (comprimento: %zu)\\n", seguro, strlen(seguro));
    return 0;
}`,
        output: `String segura gerada: User_CyberDev20 (comprimento: 15) [Buffer protegido contra transbordamento]`,
        lang: 'c',
        exercise: {
          id: 'ex-c-ini-4',
          prompt: 'Por que a função `gets()` foi completamente removida do padrão C moderno (C11)?',
          type: 'multiple_choice',
          options: [
            'Porque ela não aceita limite de tamanho de buffer, tornando vulnerabilidades de Buffer Overflow inevitáveis',
            'Porque ela só lia números',
            'Porque ocupava muita memória do compilador',
            'Porque ela convertia texto para maiúsculas',
          ],
          correctAnswer: 'Porque ela não aceita limite de tamanho de buffer, tornando vulnerabilidades de Buffer Overflow inevitáveis',
          hint: 'Ela lê a entrada do usuário indefinidamente até achar uma nova linha.',
          explanation: 'gets() não recebe o tamanho do buffer de destino, permitindo que uma entrada maior que o buffer sobrescreva a memória adjacente e o endereço de retorno da função (EIP/RIP).',
        },
      },
      {
        title: '5. Estruturas (Structs), Uniões e Manipulação de Bits (Bitwise)',
        desc: 'Modele cabeçalhos de pacotes de rede (IP, TCP) e utilize operadores de bits (&, |, ^, >>, <<).',
        theory: [
          {
            title: 'Structs e Bitfields para Protocolos',
            text: 'Structs permitem modelar formatos binários exatos de pacotes de rede e registros de hardware. Bitfields e operadores bitwise permitem manipular flags individuais de status de rede.',
            keyPoints: [
              'struct HeaderIP { unsigned char ver_ihl; ... };',
              'Bitwise AND (&) para checar flags (ex: SYN, ACK).',
              'Bitwise OR (|) para combinar permissões.',
              'Left Shift (<<) e Right Shift (>>) para mascaramento de bytes.',
            ],
          },
        ],
        code: `#include <stdio.h>

#define FLAG_SYN (1 << 0) // 0001
#define FLAG_ACK (1 << 1) // 0010
#define FLAG_FIN (1 << 2) // 0100

int main() {
    unsigned char pacote_flags = 0;
    // Setando flags SYN e ACK no pacote TCP simulado
    pacote_flags |= (FLAG_SYN | FLAG_ACK);

    if (pacote_flags & FLAG_SYN) {
        printf("[+] Pacote com flag SYN ativa!\\n");
    }
    if (pacote_flags & FLAG_ACK) {
        printf("[+] Pacote com flag ACK ativa!\\n");
    }
    return 0;
}`,
        output: `[+] Pacote com flag SYN ativa!
[+] Pacote com flag ACK ativa!`,
        lang: 'c',
        exercise: {
          id: 'ex-c-ini-5',
          prompt: 'Qual operador bitwise é utilizado para verificar se um bit/flag específico está ativo em uma variável de controle de rede?',
          type: 'multiple_choice',
          options: ['& (Bitwise AND)', '| (Bitwise OR)', '~ (Bitwise NOT)', '&& (Logical AND)'],
          correctAnswer: '& (Bitwise AND)',
          hint: 'Máscara binária: resultado diferente de zero se o bit estiver ativo.',
          explanation: 'O operador bitwise & aplica uma máscara sobre os bits; se o bit desejado for 1, a expressão avalia como verdadeira.',
        },
      },
    ],
    intermediario: [
        {
          title: '1. Programação de Redes com Sockets TCP em C',
          desc: 'Crie clientes e servidores TCP utilizando a API POSIX Sockets (socket, bind, listen, accept, connect).',
          theory: [
            {
              title: 'A API de Sockets Berkeley/POSIX',
              text: 'Sockets são a interface padrão do sistema operacional para comunicação de rede através de descritores de arquivo.',
              keyPoints: [
                'socket(AF_INET, SOCK_STREAM, 0): Cria socket TCP IPv4.',
                'bind() + listen() + accept(): Fluxo do servidor para escutar e aceitar conexões.',
                'send() e recv(): Transmissão e recebimento de buffers de bytes.',
              ],
            },
          ],
          code: `#include <stdio.h>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <unistd.h>

int main() {
    int sock = socket(AF_INET, SOCK_STREAM, 0);
    struct sockaddr_in server;
    server.sin_family = AF_INET;
    server.sin_port = htons(80);
    inet_pton(AF_INET, "93.184.216.34", &server.sin_addr); // example.com

    printf("[*] Socket TCP criado. Pronto para handshake com porta 80.\\n");
    close(sock);
    return 0;
}`,
          output: `[*] Socket TCP criado (fd: 3). Pronto para handshake com porta 80.`,
          lang: 'c',
          exercise: {
            id: 'ex-c-inter-1',
            prompt: 'Qual função de rede converte um número de porta da ordem de bytes do host (Host Byte Order) para a ordem de bytes da rede (Network Byte Order / Big Endian)?',
            type: 'multiple_choice',
            options: ['htons()', 'ntohs()', 'atoi()', 'inet_addr()'],
            correctAnswer: 'htons()',
            hint: 'Host TO Network Short (16-bit).',
            explanation: 'htons() garante que arquiteturas Little Endian (como x86/x64) enviem a porta de rede no formato padrão Big Endian exigido pelo protocolo TCP/IP.',
          },
        },
        {
          title: '2. Chamadas de Sistema (Syscalls), Fork, Execve e Pipes',
          desc: 'Crie processos filhos, gerencie descritores de arquivo e manipule execução de comandos.',
          theory: [
            {
              title: 'Chamadas de Sistema no Linux',
              text: 'Syscalls são a ponte entre o espaço de usuário (User Space) e o Kernel. fork() duplica o processo atual, enquanto execve() substitui a imagem do processo por um novo binário.',
              keyPoints: [
                'fork(): Retorna 0 no filho e o PID do filho no pai.',
                'execve("/bin/sh", argv, envp): Executa um novo binário substituindo a imagem da memória.',
                'dup2(sock_fd, 0): Redireciona stdin/stdout para um socket de rede (base de Reverse Shells).',
              ],
            },
          ],
          code: `#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>

int main() {
    pid_t pid = fork();

    if (pid == 0) {
        printf("[Filho PID: %d] Executando comando...\\n", getpid());
        char *args[] = {"/bin/echo", "Processo filho em execucao!", NULL};
        execve("/bin/echo", args, NULL);
    } else {
        printf("[Pai PID: %d] Aguardando termino do filho PID: %d\\n", getpid(), pid);
        wait(NULL);
        printf("[Pai] Filho finalizado com sucesso.\\n");
    }
    return 0;
}`,
          output: `[Pai PID: 20450] Aguardando termino do filho PID: 20451
[Filho PID: 20451] Executando comando...
Processo filho em execucao!
[Pai] Filho finalizado com sucesso.`,
          lang: 'c',
          exercise: {
            id: 'ex-c-inter-2',
            prompt: 'O que a chamada de sistema `execve()` faz com a memória do processo que a invocou?',
            type: 'multiple_choice',
            options: [
              'Substitui completamente o código, dados e stack do processo atual pelo novo programa carregado',
              'Cria uma nova aba no navegador',
              'Apaga o HD',
              'Apenas pausa o processo por 10 segundos',
            ],
            correctAnswer: 'Substitui completamente o código, dados e stack do processo atual pelo novo programa carregado',
            hint: 'O processo original não retorna a menos que ocorra um erro de execução.',
            explanation: 'execve carrega o novo binário diretamente no espaço de memória do processo atual, preservando apenas os descritores de arquivos abertos.',
          },
        },
        {
          title: '3. Anatomia de Vulnerabilidades de Memória: Stack-Based Buffer Overflow',
          desc: 'Entenda como o transbordamento de buffers corrompe o Frame Pointer (EBP/RBP) e o Return Address (EIP/RIP).',
          theory: [
            {
              title: 'Como a Pilha de Execução (Stack) é Estruturada',
              text: 'Ao chamar uma função, a CPU empilha os parâmetros, o Endereço de Retorno (onde a CPU deve voltar após a função terminar) e o RBP. Se um buffer local for transbordado, esses bytes sobrescrevem o Return Address, permitindo desviar o fluxo de execução para código arbitrário.',
              keyPoints: [
                'Layout da Stack (de cima para baixo): [Buffer Local] -> [Saved RBP] -> [Saved RIP].',
                'Mitigações modernas: Stack Canaries (-fstack-protector), Non-Executable Stack (NX / DEP), ASLR.',
              ],
            },
          ],
          code: `#include <stdio.h>
#include <string.h>

// Código demonstrativo de vulnerabilidade clássica (CWE-121)
void funcao_vulneravel(char *entrada) {
    char buffer_pequeno[64];
    // VULNERABILIDADE: strcpy não checa o tamanho de entrada!
    strcpy(buffer_pequeno, entrada);
    printf("Buffer preenchido com sucesso: %s\\n", buffer_pequeno);
}

int main() {
    printf("[Analise de Seguranca]: Funcoes vulneraveis a buffer overflow devem ser substituidas por strncpy/snprintf.\\n");
    return 0;
}`,
          output: `[Analise de Seguranca]: Funcoes vulneraveis a buffer overflow devem ser substituidas por strncpy/snprintf.`,
          lang: 'c',
          exercise: {
            id: 'ex-c-inter-3',
            prompt: 'Em um ataque clássico de Stack Buffer Overflow, qual valor crítico na pilha de execução o atacante tenta sobrescrever para controlar o fluxo da CPU?',
            type: 'multiple_choice',
            options: [
              'O Endereço de Retorno da Função (Saved Return Address / RIP / EIP)',
              'O número de série da placa de vídeo',
              'O nome do arquivo no disco',
              'O relógio do sistema operacional',
            ],
            correctAnswer: 'O Endereço de Retorno da Função (Saved Return Address / RIP / EIP)',
            hint: 'É o endereço que aponta para a próxima instrução que a CPU executará ao sair da função (instrução RET).',
            explanation: 'Ao sobrescrever o Saved RIP, quando a função chega na instrução assembly RET, a CPU salta para o endereço fornecido pelo atacante (ex: shellcode ou gadget ROP).',
          },
        },
        {
          title: '4. Format String Vulnerabilities e Sanitização',
          desc: 'Identifique riscos do uso de printf(buffer) sem format specifiers (%s, %x, %n).',
          theory: [
            {
              title: 'O Perigo de printf(variavel)',
              text: 'Se o primeiro argumento de printf() for uma string fornecida pelo usuário (ex: printf(user_input)), o atacante pode passar format specifiers como %x (para ler a memória da stack) ou %n (para escrever na memória RAM).',
              keyPoints: [
                'Inseguro: printf(mensagem);',
                'Seguro: printf("%s", mensagem);',
                '%n: Grava o número de caracteres impressos até o momento em um endereço de memória.',
              ],
            },
          ],
          code: `#include <stdio.h>

int main() {
    char user_input[] = "%x %x %x %x (Tentativa de leitura de Stack)";
    
    // Forma SEGURA:
    printf("Saida segura: %s\\n", user_input);
    return 0;
}`,
          output: `Saida segura: %x %x %x %x (Tentativa de leitura de Stack) [Impresso como texto puro sem interpretar especificadores]`,
          lang: 'c',
          exercise: {
            id: 'ex-c-inter-4',
            prompt: 'Como corrigir a vulnerabilidade de Format String em uma chamada de impressão em C?',
            type: 'multiple_choice',
            options: [
              'Sempre fornecer uma string de formato estática como primeiro argumento: `printf("%s", input);`',
              'Apagar o texto antes de imprimir',
              'Usar sprintf() sem argumentos',
              'Desativar a tela do computador',
            ],
            correctAnswer: 'Sempre fornecer uma string de formato estática como primeiro argumento: `printf("%s", input);`',
            hint: 'Garante que o printf trate o input exclusivamente como dados literais e não como instruções de formatação.',
            explanation: 'Fornecer "%s" como formato instrui o printf a imprimir a variável estritamente como texto, neutralizando qualquer %x ou %n malicioso.',
          },
        },
        {
          title: '5. Sockets Raw e Análise de Cabeçalhos Ethernet/IP/TCP com Sniffers em C',
          desc: 'Capture pacotes no nível de enlace (Data Link Layer) usando AF_PACKET e SOCK_RAW.',
          theory: [
            {
              title: 'Sockets Raw e Packet Sniffing de Baixo Nível',
              text: 'Sockets RAW permitem que aplicações recebam pacotes brutos diretamente da placa de rede sem que o kernel faça o stripping dos cabeçalhos IP/TCP.',
              keyPoints: [
                'socket(AF_PACKET, SOCK_RAW, htons(ETH_P_ALL)): Captura todos os frames Ethernet no Linux.',
                'Parsing de struct ethhdr, struct iphdr e struct tcphdr.',
                'Exige privilégios de root (CAP_NET_RAW).',
              ],
            },
          ],
          code: `#include <stdio.h>
#include <netinet/ip.h>
#include <netinet/tcp.h>

void analisar_cabecalho_ip(unsigned char *buffer, int tamanho) {
    struct iphdr *ip = (struct iphdr*)buffer;
    printf("[SNIFFER]: Pacote IP recebido! Versao: %d, Tamanho Cabecalho: %d bytes, Protocolo: %d\\n",
           ip->version, ip->ihl * 4, ip->protocol);
}

int main() {
    printf("[*] Modulo de parsing de pacotes RAW em C compilado.\\n");
    return 0;
}`,
          output: `[*] Modulo de parsing de pacotes RAW em C compilado.`,
          lang: 'c',
          exercise: {
            id: 'ex-c-inter-5',
            prompt: 'Qual capacidade (Linux Capability) ou privilégio é exigido pelo Kernel Linux para abrir Sockets RAW de captura de pacotes?',
            type: 'multiple_choice',
            options: ['CAP_NET_RAW (ou root)', 'CAP_SYS_TIME', 'Nenhum privilégio', 'Permissão de leitura em /tmp'],
            correctAnswer: 'CAP_NET_RAW (ou root)',
            hint: 'Capacidade de rede para criação de raw e packet sockets.',
            explanation: 'Abrir sockets brutos permite inspecionar todo o tráfego de rede da máquina; por isso o kernel restringe essa operação a processos com CAP_NET_RAW ou UID 0.',
          },
        },
      ],
      avancado: [
          {
            title: '1. Engenharia Reversa com GDB, Radare2 / Ghidra e Desmontagem Assembly',
            desc: 'Analise binários compilados em Assembly x86_64, registradores (RAX, RBX, RDI, RSI, RBP, RSP) e instruções.',
            theory: [
              {
                title: 'Conceitos Fundamentais de x86_64 Assembly',
                text: 'Ao analisar um malware ou binário sem código-fonte, usamos descompiladores e debuggers para inspecionar instruções de máquina (MOV, PUSH, POP, CALL, CMP, JNE).',
                keyPoints: [
                  'gdb ./binario -> disassemble main -> info registers',
                  'RSP (Stack Pointer): Aponta para o topo da pilha.',
                  'RIP (Instruction Pointer): Aponta para a próxima instrução a ser executada.',
                  'Convenção de chamada System V AMD64: primeiros argumentos passados em RDI, RSI, RDX, RCX, R8, R9.',
                ],
              },
            ],
            code: `# Comandos essenciais no GDB com extensão GEF / Pwndbg
gdb -q ./alvo_binario
(gdb) checksec              # Checar mitigacoes (NX, PIE, Canary, RelRO)
(gdb) break main
(gdb) run
(gdb) x/10gx $rsp           # Inspecionar 10 quadwords na pilha`,
            output: `[+] checksec:
    Canary:        No canary found
    NX:            NX enabled
    PIE:           No PIE (0x400000)
    RELRO:         Partial RELRO`,
            lang: 'bash',
            exercise: {
              id: 'ex-c-avanc-1',
              prompt: 'Na arquitetura x86_64, qual registrador da CPU sempre armazena o endereço de memória da próxima instrução Assembly a ser executada?',
              type: 'multiple_choice',
              options: ['RIP (Instruction Pointer)', 'RAX (Accumulator)', 'RSP (Stack Pointer)', 'RBP (Base Pointer)'],
              correctAnswer: 'RIP (Instruction Pointer)',
              hint: 'Instruction Pointer em 64-bit.',
              explanation: 'O registrador RIP aponta para o endereço da instrução corrente/próxima que a CPU decodificará e executará.',
            },
          },
          {
            title: '2. Return-Oriented Programming (ROP Chains) e Evasão de NX/DEP',
            desc: 'Construa cadeias ROP encadeando pequenos trechos de código existentes (gadgets) terminados em RET.',
            theory: [
              {
                title: 'O que é ROP (Return-Oriented Programming)?',
                text: 'Quando a pilha é marcada como Não-Executável (NX/DEP ativado), injetar shellcode direto na stack causa crash. A técnica ROP contorna isso aproveitando instruções já presentes na memória do programa (ex: pop rdi; ret) para preparar registradores e chamar funções da libc como system("/bin/sh").',
                keyPoints: [
                  'Gadgets: Pequenas sequências Assembly que terminam com a instrução RET.',
                  'ropper --file ./binario --search "pop rdi; ret"',
                  'Ret2Libc: Redireciona a execução para system() na biblioteca C padrão.',
                ],
              },
            ],
            code: `# Busca de gadgets ROP com ropper
ropper --file /lib/x86_64-linux-gnu/libc.so.6 --search "pop rdi; ret"
# Gadget encontrado em: 0x00007ffff7de1234: pop rdi; ret;
# Cadeia ROP: [Gadget pop rdi] -> [Endereço da string "/bin/sh"] -> [Endereço de system()]`,
            output: `[ROP Chain]: Construída com sucesso para bypass de NX/DEP.`,
            lang: 'bash',
            exercise: {
              id: 'ex-c-avanc-2',
              prompt: 'Por que a técnica de Return-Oriented Programming (ROP) é capaz de contornar a proteção NX/DEP (Non-Executable Stack)?',
              type: 'multiple_choice',
              options: [
                'Porque ela não injeta código novo em áreas não executáveis; ela reutiliza instruções válidas já existentes na memória executável do binário ou de bibliotecas compartilhadas',
                'Porque ela desliga a eletricidade do processador',
                'Porque ela recompila o programa',
                'Porque o ROP só funciona em JavaScript',
              ],
              correctAnswer: 'Porque ela não injeta código novo em áreas não executáveis; ela reutiliza instruções válidas já existentes na memória executável do binário ou de bibliotecas compartilhadas',
              hint: 'Reaproveitamento de código legítimo existente (Code Reuse Attack).',
              explanation: 'Como os gadgets ROP já estão em páginas de memória com permissão de execução (RX), o mecanismo de proteção NX não é acionado.',
            },
          },
          {
            title: '3. Shellcoding em C e Assembly: Criação de Payloads Compactos e Nulos-Free',
            desc: 'Escreva shellcodes puros que não contenham bytes nulos (0x00) para injeção confiável.',
            theory: [
              {
                title: 'Construção de Shellcodes',
                text: 'Um shellcode é uma sequência de opcodes em linguagem de máquina projetada para invocar chamadas de sistema como sys_execve sem depender de bibliotecas externas.',
                keyPoints: [
                  'Evitar bytes nulos (0x00) que encerram funções de string prematuramente (use xor %eax, %eax).',
                  'Posição Independente (PIC): Deve executar em qualquer endereço de memória.',
                ],
              },
            ],
            code: `// Shellcode x86_64 para spawn de /bin/sh (27 bytes)
unsigned char shellcode[] = 
  "\\x48\\x31\\xf6\\x56\\x48\\xbf\\x2f\\x62\\x69\\x6e\\x2f\\x2f\\x73\\x68"
  "\\x57\\x54\\x5f\\x6a\\x3b\\x58\\x99\\x0f\\x05";

int main() {
    printf("[Shellcode]: Tamanho do payload: %zu bytes (Null-free)\\n", sizeof(shellcode) - 1);
    return 0;
}`,
            output: `[Shellcode]: Tamanho do payload: 23 bytes (Null-free)`,
            lang: 'c',
            exercise: {
              id: 'ex-c-avanc-3',
              prompt: 'Por que é fundamental que um shellcode injetado através de funções de string (como strcpy) seja "Null-Free" (sem bytes 0x00)?',
              type: 'multiple_choice',
              options: [
                'Porque o byte 0x00 é o terminador de string (\\0) em C, o que faria a função parar de copiar o shellcode pela metade',
                'Porque a CPU não aceita o número zero',
                'Porque o arquivo fica muito leve',
                'Para economizar internet',
              ],
              correctAnswer: 'Porque o byte 0x00 é o terminador de string (\\0) em C, o que faria a função parar de copiar o shellcode pela metade',
              hint: 'Strings em C terminam no primeiro byte nulo encontrado.',
              explanation: 'Funções de manipulação de string como strcpy e sprintf encerram a leitura ao atingir o byte 0x00, truncando o payload se ele contiver nulos.',
            },
          },
          {
            title: '4. Heap Exploitation: Use-After-Free (UAF), Fastbin Dup e Tcache Poisoning',
            desc: 'Analise o comportamento dos allocators modernos da glibc (ptmalloc) e corrupção de chunks no Heap.',
            theory: [
              {
                title: 'A Estrutura dos Chunks no Heap (ptmalloc)',
                text: 'A glibc gerencia blocos de memória com metadados (tamanho, flags PREV_INUSE, ponteiros forward e backward). Corromper esses ponteiros permite forçar malloc() a retornar endereços arbitrários na memória.',
                keyPoints: [
                  'Use-After-Free: Manter um ponteiro apontando para um objeto que já foi liberado com free().',
                  'Tcache (Thread Local Caching): Otimização de pequenos chunks em linked lists.',
                ],
              },
            ],
            code: `#include <stdio.h>
#include <stdlib.h>

struct Autenticacao {
    int admin;
    char token[32];
};

int main() {
    struct Autenticacao *auth = malloc(sizeof(struct Autenticacao));
    auth->admin = 0;
    
    free(auth);
    // VULNERABILIDADE UAF: auth nao foi setado para NULL!
    // Se outro objeto for alocado no mesmo espaco, auth->admin pode ser controlado!
    printf("[Analise Heap]: Ponteiros devem SEMPRE ser atribuidos como NULL imediatamente apos free().\\n");
    return 0;
}`,
            output: `[Analise Heap]: Ponteiros devem SEMPRE ser atribuidos como NULL imediatamente apos free().`,
            lang: 'c',
            exercise: {
              id: 'ex-c-avanc-4',
              prompt: 'Qual prática simples de programação em C previne 100% dos ataques do tipo Use-After-Free (UAF)?',
              type: 'multiple_choice',
              options: [
                'Atribuir o ponteiro para NULL imediatamente após chamar `free(ptr); ptr = NULL;`',
                'Usar apenas variáveis float',
                'Desinstalar o compilador GCC',
                'Nunca liberar a memória',
              ],
              correctAnswer: 'Atribuir o ponteiro para NULL imediatamente após chamar `free(ptr); ptr = NULL;`',
              hint: 'Garante que o ponteiro não continue apontando para um endereço reciclado.',
              explanation: 'Setar o ponteiro para NULL neutraliza o dangling pointer; qualquer tentativa de acesso posterior causará uma falha segura (Segmentation Fault) em vez de corrupção silenciosa de memória.',
            },
          },
          {
            title: '5. Mitigações Modernas: ASLR, PIE, Stack Canaries, Shadow Stack e CET',
            desc: 'Implemente proteções de compilação e entenda tecnologias de segurança de hardware como Intel CET.',
            theory: [
              {
                title: 'Defesa em Profundidade em Binários C',
                text: 'Sistemas modernos combinam proteções de software e hardware para tornar a exploração de binários extremamente complexa.',
                keyPoints: [
                  '-fstack-protector-all: Insere um número aleatório (Canary) antes do RIP salvo na stack.',
                  '-fPIE -pie: Position Independent Executable (randomiza a base do código com ASLR).',
                  '-Wl,-z,relro,-z,now: Full RELRO torna a GOT (Global Offset Table) somente leitura.',
                  'Intel CET / Shadow Stack: Salva uma cópia de hardware do RIP que não pode ser modificada por software.',
                ],
              },
            ],
            code: `# Compilação blindada com todas as proteções modernas ativas
gcc -Wall -Wextra -O2 \\
    -fstack-protector-strong \\
    -D_FORTIFY_SOURCE=2 \\
    -fPIE -pie \\
    -Wl,-z,relro,-z,now \\
    servico_seguro.c -o servico_seguro`,
            output: `[GCC]: Binário compilado com Full RELRO, Stack Canary, PIE e Fortify Source ativos.`,
            lang: 'bash',
            exercise: {
              id: 'ex-c-avanc-5',
              prompt: 'Como a proteção "Stack Canary" detecta um ataque de Buffer Overflow antes que o invasor consiga controlar a CPU?',
              type: 'multiple_choice',
              options: [
                'Ela coloca um valor aleatório secreto logo antes do endereço de retorno salvo; antes da função retornar, ela checa se esse valor foi alterado; se foi, o programa aborta imediatamente com `*** stack smashing detected ***`',
                'Ela criptografa todo o disco rígido',
                'Ela envia um SMS para o administrador',
                'Ela aumenta a velocidade da ventoinha',
              ],
              correctAnswer: 'Ela coloca um valor aleatório secreto logo antes do endereço de retorno salvo; antes da função retornar, ela checa se esse valor foi alterado; se foi, o programa aborta imediatamente com `*** stack smashing detected ***`',
              hint: 'Como um canário em uma mina de carvão, qualquer alteração aciona o alarme antes do dano fatal.',
              explanation: 'Como um overflow linear precisa passar pelo canary para alcançar o Saved RIP, o canary é corrompido, permitindo que a verificação no epílogo da função encerre o processo antes do RET.',
            },
          },
        ],
        projetos: [
          {
            title: '1. Projeto: Port Scanner TCP Concorrente Multi-Threaded em C',
            desc: 'Crie um scanner de portas ultrarrápido usando pthread e non-blocking sockets com select/poll.',
            theory: [{ title: 'Concorrência em C', text: 'Escaneie milhares de portas por segundo usando threads POSIX.', keyPoints: ['pthread_create e mutexes', 'Sockets não bloqueantes com fcntl'] }],
            code: `// Scanner de alta performance em C
#include <stdio.h>
#include <pthread.h>

void* escanear_porta(void* arg) {
    int porta = *(int*)arg;
    // Logica de conexao rapida...
    return NULL;
}`,
            output: `[Scanner C]: 1000 portas escaneadas em 0.42 segundos. Portas abertas: [22, 80, 443, 8080]`,
            lang: 'c',
            exercise: {
              id: 'ex-c-prj-1',
              prompt: 'Qual biblioteca padrão POSIX em C é utilizada para gerenciar threads concorrentes?',
              type: 'multiple_choice',
              options: ['<pthread.h>', '<threads.js>', '<sys/thread.py>', '<concurrent.h>'],
              correctAnswer: '<pthread.h>',
              hint: 'POSIX Threads library.',
              explanation: '<pthread.h> é o padrão Unix/Linux para criação de threads, mutexes, condition variables e barreiras de sincronização.',
            },
          },
          {
            title: '2. Projeto: Packet Sniffer e Extrator de Metadados de Rede em C',
            desc: 'Capture e decodifique cabeçalhos Ethernet, IPv4 e TCP extraindo portas de origem e destino.',
            theory: [{ title: 'DPI de Baixo Nível', text: 'Inspeção profunda de pacotes diretamente no buffer de rede.', keyPoints: ['struct ethhdr', 'Cálculo de checksum IP'] }],
            code: `// Parser de cabeçalhos de rede
#include <stdio.h>
#include <netinet/ip.h>

void parse_packet(unsigned char* buffer) {
    struct iphdr* ip = (struct iphdr*)(buffer + 14); // Pula 14 bytes do frame Ethernet
    printf("IP Origem: %s\\n", "192.168.1.50");
}`,
            output: `[Sniffer C]: Pacotes capturados e decodificados em tempo real.`,
            lang: 'c',
            exercise: {
              id: 'ex-c-prj-2',
              prompt: 'Quantos bytes possui o cabeçalho Ethernet padrão (Destination MAC + Source MAC + EtherType) antes do cabeçalho IP?',
              type: 'multiple_choice',
              options: ['14 bytes', '32 bytes', '4 bytes', '64 bytes'],
              correctAnswer: '14 bytes',
              hint: '6 bytes Dest MAC + 6 bytes Src MAC + 2 bytes EtherType.',
              explanation: 'O cabeçalho Ethernet tem exatamente 14 bytes (6+6+2), sendo necessário avançar 14 bytes para ler o início do cabeçalho IP.',
            },
          },
          {
            title: '3. Projeto: Fuzzer de Memória Simples para Testes de Robustez',
            desc: 'Envie mutações randômicas de bytes para binários e capture crashes e falhas de segmentação.',
            theory: [{ title: 'Fuzzing de Software', text: 'Técnica automatizada que gera entradas malformadas para descobrir falhas de corrupção de memória.', keyPoints: ['Mutações de bit/byte', 'Monitoramento com waitpid(SIGSEGV)'] }],
            code: `// Fuzzer mutacional em C
#include <stdio.h>
#include <stdlib.h>

void mutar_buffer(char *buf, int len) {
    int pos = rand() % len;
    buf[pos] = (char)(rand() % 256);
}`,
            output: `[Fuzzer C]: 10.000 iteracoes executadas. 1 crash por SIGSEGV detectado na funcao de parsing.`,
            lang: 'c',
            exercise: {
              id: 'ex-c-prj-3',
              prompt: 'Qual sinal do sistema operacional Unix/Linux é enviado a um processo que tenta acessar um endereço de memória RAM inválido ou não mapeado?',
              type: 'multiple_choice',
              options: ['SIGSEGV (Signal 11 - Segmentation Fault)', 'SIGINT', 'SIGALRM', 'SIGWINCH'],
              correctAnswer: 'SIGSEGV (Signal 11 - Segmentation Fault)',
              hint: 'Famoso "Segmentation Fault".',
              explanation: 'SIGSEGV é gerado pela unidade de gerenciamento de memória (MMU) quando o programa tenta acessar uma página de memória proibida ou inexistente.',
            },
          },
          {
            title: '4. Projeto: Servidor Web HTTP Multi-Processo Seguro em C',
            desc: 'Implemente um servidor HTTP capaz de servir arquivos estáticos com sanitização de caminho contra Path Traversal.',
            theory: [{ title: 'Segurança em Servidores C', text: 'Sirva conexões isoladas com validação rigorosa de diretórios (realpath).', keyPoints: ['Prevenção de ../ (Path Traversal)', 'Chroot jail para isolamento'] }],
            code: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int validar_caminho_seguro(const char *caminho) {
    if (strstr(caminho, "..") != NULL) {
        return 0; // Bloqueia tentativa de Directory Traversal!
    }
    return 1;
}`,
            output: `[HTTP Server C]: Servidor iniciado na porta 8080. Filtro anti-traversal ativo.`,
            lang: 'c',
            exercise: {
              id: 'ex-c-prj-4',
              prompt: 'Qual função da biblioteca padrão C resolve um caminho relativo para seu caminho canônico absoluto, auxiliando na prevenção de ataques de Path Traversal?',
              type: 'multiple_choice',
              options: ['realpath()', 'open()', 'strcpy()', 'printf()'],
              correctAnswer: 'realpath()',
              hint: 'Expande todos os links simbólicos e resolve referências como "/../".',
              explanation: 'realpath() converte o caminho relativo em caminho absoluto e canônico, permitindo verificar se o arquivo solicitado está realmente dentro do diretório web permitido.',
            },
          },
          {
            title: '5. Projeto Final: Biblioteca C de Criptografia e Hashing Seguro',
            desc: 'Integre libcrypto (OpenSSL) para operações de hashing SHA-256 e criptografia simétrica AES-256-GCM.',
            theory: [{ title: 'Criptografia em C', text: 'Uso de primitivas criptográficas auditadas com gerenciamento seguro de chaves.', keyPoints: ['EVP_EncryptInit_ex', 'Limpeza de memória com explicit_bzero'] }],
            code: `#include <stdio.h>
#include <string.h>
#include <openssl/sha.h>

void calcular_sha256(const char *msg, unsigned char *hash_out) {
    SHA256((const unsigned char*)msg, strlen(msg), hash_out);
}`,
            output: `[Crypto C]: Hash SHA-256 calculado com OpenSSL. 256 bits gerados.`,
            lang: 'c',
            exercise: {
              id: 'ex-c-prj-5',
              prompt: 'Por que funções como `explicit_bzero()` ou `OPENSSL_cleanse()` são usadas para limpar buffers que armazenaram senhas e chaves criptográficas na memória RAM?',
              type: 'multiple_choice',
              options: [
                'Porque compiladores modernos com otimização ativada (-O2/-O3) removem chamadas normais de `memset(chave, 0, len)` como código morto desnecessário (Dead Code Elimination)',
                'Para formatar o computador',
                'Porque o memset() não funciona com números',
                'Para aumentar o brilho da tela',
              ],
              correctAnswer: 'Porque compiladores modernos com otimização ativada (-O2/-O3) removem chamadas normais de `memset(chave, 0, len)` como código morto desnecessário (Dead Code Elimination)',
              hint: 'Otimizações do compilador descartam limpezas de variáveis que não serão lidas novamente.',
              explanation: 'explicit_bzero garante que a limpeza de memória sensível aconteça fisicamente na RAM e não seja descartada pelo compilador durante a otimização de código.',
            },
          },
        ],
      },
      quizzesByLevel: {
        iniciante: [
          {
            id: 'cq-ini-1',
            question: 'O que acontece quando você tenta acessar `*ptr` onde `int *ptr = NULL;`?',
            options: [
              'Ocorre uma falha de segmentação (Segmentation Fault / SIGSEGV) e o programa é abortado pelo SO',
              'O programa imprime o número zero',
              'O ponteiro cria uma nova variável automaticamente',
              'Nada, o código continua normalmente',
            ],
            correctIndex: 0,
            explanation: 'Desreferenciar um ponteiro nulo (endereço 0x0) tenta acessar uma página de memória não mapeada, resultando em interrupção por SIGSEGV.',
          },
        ],
        intermediario: [
          {
            id: 'cq-int-1',
            question: 'Qual a diferença entre Stack e Heap em C?',
            options: [
              'Stack gerencia variáveis locais de forma automática e rápida com escopo de função; Heap gerencia memória dinâmica sob demanda criada manualmente com malloc() e liberada com free()',
              'Stack é usada apenas para internet e Heap para disco rígido',
              'Stack é infinita e Heap tem 10 bytes',
              'Não existe diferença',
            ],
            correctIndex: 0,
            explanation: 'A Stack é controlada pelo compilador/CPU na entrada e saída de funções; o Heap é a área de memória dinâmica gerenciada pelo programador.',
          },
        ],
        avancado: [
          {
            id: 'cq-av-1',
            question: 'Em que consiste a proteção ASLR (Address Space Layout Randomization)?',
            options: [
              'Randomiza as posições de memória da pilha (Stack), do heap e de bibliotecas compartilhadas a cada execução do programa, dificultando ataques de salto de memória fixo',
              'Altera o nome do usuário a cada minuto',
              'Impede o uso do mouse',
              'Criptografa o monitor',
            ],
            correctIndex: 0,
            explanation: 'Com ASLR, os endereços base de funções e buffers mudam a cada execução, inviabilizando que atacantes usem endereços estáticos em payloads.',
          },
        ],
        projetos: [
          {
            id: 'cq-prj-1',
            question: 'Por que o uso de Raw Sockets requer privilégios de administrador (root ou CAP_NET_RAW)?',
            options: [
              'Porque permite inspecionar todos os pacotes brutos que trafegam na interface de rede e forjar cabeçalhos IP/TCP personalizados',
              'Porque consome muita bateria',
              'Porque o C não suporta placas de rede',
              'Porque o protocolo IP é pago',
            ],
            correctIndex: 0,
            explanation: 'Sockets brutos contornam a pilha de rede tradicional do kernel, permitindo tanto a leitura de todo o tráfego da máquina quanto a criação de pacotes com IPs forjados (IP spoofing).',
          },
        ],
      },
    };
