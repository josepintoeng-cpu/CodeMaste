import { SimulationConfig } from '../types';

export interface ExecutionResult {
  output: string;
  error?: string;
  executionTimeMs?: number;
  isSimulated: boolean;
}

// In-memory Pyodide cache
let pyodideInstance: any = null;
let isPyodideLoading = false;

/**
 * Service responsável pela execução e simulação de código por linguagem
 */
export const codeRunnerService = {
  /**
   * Executa código baseado na linguagem e configuração da aula
   */
  async runCode(
    code: string,
    simulation: SimulationConfig,
    language: string
  ): Promise<ExecutionResult> {
    const startTime = performance.now();

    try {
      if (simulation.type === 'real_js' || language === 'javascript') {
        return this.runJavaScript(code, startTime);
      }

      if (simulation.type === 'real_html' || language === 'html' || language === 'css') {
        return {
          output: 'Renderizado com sucesso no painel de visualização ao vivo.',
          executionTimeMs: Math.round(performance.now() - startTime),
          isSimulated: false,
        };
      }

      if (simulation.type === 'real_pyodide' || language === 'python') {
        return await this.runPythonPyodide(code, simulation.defaultOutput, startTime);
      }

      if (simulation.type === 'sql_mock' || language === 'mysql') {
        return this.runMockSql(code, startTime);
      }

      // Para linguagens sem runtime web direto (Java, PHP, Flutter, Node.js):
      return this.runSimulatedCode(code, simulation.defaultOutput || 'Execução concluída com sucesso!', startTime);
    } catch (err: any) {
      return {
        output: '',
        error: err.message || 'Erro inesperado durante a execução do código.',
        executionTimeMs: Math.round(performance.now() - startTime),
        isSimulated: false,
      };
    }
  },

  /**
   * Executa JavaScript capturando console.log
   */
  runJavaScript(code: string, startTime: number): ExecutionResult {
    const logs: string[] = [];
    const customConsole = {
      log: (...args: any[]) => {
        logs.push(args.map(a => (typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a))).join(' '));
      },
      error: (...args: any[]) => {
        logs.push('[ERRO] ' + args.join(' '));
      },
      warn: (...args: any[]) => {
        logs.push('[AVISO] ' + args.join(' '));
      },
      info: (...args: any[]) => {
        logs.push('[INFO] ' + args.join(' '));
      }
    };

    try {
      // Executa de forma isolada usando Function com escopo controlado
      const runFn = new Function('console', code);
      runFn(customConsole);

      const output = logs.length > 0 ? logs.join('\n') : 'Código executado com sucesso (sem retorno no console).';
      return {
        output,
        executionTimeMs: Math.round(performance.now() - startTime),
        isSimulated: false,
      };
    } catch (e: any) {
      return {
        output: logs.join('\n'),
        error: e.message || 'Erro de sintaxe no JavaScript.',
        executionTimeMs: Math.round(performance.now() - startTime),
        isSimulated: false,
      };
    }
  },

  /**
   * Executa Python usando Pyodide (WebAssembly) quando disponível, ou simulação realista como fallback
   */
  async runPythonPyodide(
    code: string,
    defaultOutput?: string,
    startTime: number = performance.now()
  ): Promise<ExecutionResult> {
    // Tenta carregar Pyodide dinamicamente se o script estiver na janela
    if (typeof (window as any).loadPyodide === 'function' && !pyodideInstance && !isPyodideLoading) {
      try {
        isPyodideLoading = true;
        pyodideInstance = await (window as any).loadPyodide();
        isPyodideLoading = false;
      } catch {
        isPyodideLoading = false;
      }
    }

    if (pyodideInstance) {
      try {
        // Redireciona stdout do Python
        pyodideInstance.runPython(`
import sys
import io
sys.stdout = io.StringIO()
        `);

        pyodideInstance.runPython(code);

        const stdout = pyodideInstance.runPython('sys.stdout.getvalue()');
        return {
          output: stdout || 'Código Python executado com sucesso sem saída.',
          executionTimeMs: Math.round(performance.now() - startTime),
          isSimulated: false,
        };
      } catch (e: any) {
        return {
          output: '',
          error: e.message || 'Erro durante a execução do Python.',
          executionTimeMs: Math.round(performance.now() - startTime),
          isSimulated: false,
        };
      }
    }

    // Fallback gracioso para simulação se Pyodide não estiver pré-carregado
    return this.runSimulatedCode(code, defaultOutput || 'Saída do script Python executado com sucesso.', startTime);
  },

  /**
   * Simula um mini banco de dados MySQL em JS
   */
  runMockSql(sqlCode: string, startTime: number): ExecutionResult {
    const cleanSql = sqlCode.trim().toUpperCase();

    // Mock Database Tables
    const mockUsers = [
      { id: 1, nome: 'Ana Silva', email: 'ana@email.com', ativo: 1 },
      { id: 2, nome: 'Carlos Souza', email: 'carlos@email.com', ativo: 1 },
      { id: 3, nome: 'Mariana Lima', email: 'mariana@email.com', ativo: 0 },
    ];

    if (cleanSql.includes('SELECT') && cleanSql.includes('USUARIOS')) {
      if (cleanSql.includes('WHERE ATIVO = 1')) {
        const filtered = mockUsers.filter(u => u.ativo === 1);
        return {
          output: this.formatSqlTable(filtered),
          executionTimeMs: Math.round(performance.now() - startTime),
          isSimulated: true,
        };
      }
      return {
        output: this.formatSqlTable(mockUsers),
        executionTimeMs: Math.round(performance.now() - startTime),
        isSimulated: true,
      };
    }

    if (cleanSql.includes('INSERT INTO')) {
      return {
        output: 'Query OK, 1 row affected (0.02 sec)\nRegistros inseridos na tabela com sucesso.',
        executionTimeMs: Math.round(performance.now() - startTime),
        isSimulated: true,
      };
    }

    if (cleanSql.includes('UPDATE') || cleanSql.includes('DELETE')) {
      return {
        output: 'Query OK, 1 row affected (0.01 sec)',
        executionTimeMs: Math.round(performance.now() - startTime),
        isSimulated: true,
      };
    }

    return {
      output: `+-------------------------------------+
| Execução MySQL (Simulada)           |
+-------------------------------------+
| Comando executado no banco com êxito.|
+-------------------------------------+`,
      executionTimeMs: Math.round(performance.now() - startTime),
      isSimulated: true,
    };
  },

  /**
   * Formata lista de objetos como tabela ASCII estilo MySQL CLI
   */
  formatSqlTable(rows: any[]): string {
    if (!rows || rows.length === 0) return 'Empty set (0.00 sec)';

    const keys = Object.keys(rows[0]);
    const header = '| ' + keys.map(k => k.toUpperCase().padEnd(12)).join(' | ') + ' |';
    const divider = '+' + keys.map(() => '--------------').join('+') + '+';

    const body = rows
      .map(
        row =>
          '| ' +
          keys
            .map(k => String(row[k]).padEnd(12))
            .join(' | ') +
          ' |'
      )
      .join('\n');

    return `${divider}\n${header}\n${divider}\n${body}\n${divider}\n(${rows.length} rows in set)`;
  },

  /**
   * Retorna simulação de execução com delay e visual realista
   */
  runSimulatedCode(code: string, defaultOutput: string, startTime: number): ExecutionResult {
    let output = defaultOutput;

    try {
      const vars: Record<string, string> = {};
      const lines = code.split('\n');
      const outputs: string[] = [];

      for (const line of lines) {
        const clean = line.trim();
        // Ignora comentários
        if (clean.startsWith('#') || clean.startsWith('//') || clean.startsWith('--')) continue;

        // Match declaração/atribuição: let/const/var/nome = "valor" ou número ou booleano
        const assignMatch = clean.match(/^(?:(?:let|const|var)\s+)?([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(?:["'](.*?)["']|(\d+(?:\.\d+)?)|(True|False|true|false));?$/);
        if (assignMatch) {
          const varName = assignMatch[1];
          const strVal = assignMatch[2];
          const numVal = assignMatch[3];
          const boolVal = assignMatch[4];
          vars[varName] = strVal !== undefined ? strVal : (numVal !== undefined ? numVal : (boolVal || ''));
        }

        // Match print(var) ou print("texto") ou console.log(...) ou echo ...
        const printMatch = clean.match(/(?:print|console\.log|echo|System\.out\.println)\s*\(\s*(.*?)\s*\)/i);
        if (printMatch) {
          const rawArg = printMatch[1].trim();
          // Separar múltiplos argumentos separados por vírgula se houver
          const parts = rawArg.split(',').map(p => p.trim());
          const lineOut = parts.map(p => {
            if ((p.startsWith('"') && p.endsWith('"')) || (p.startsWith("'") && p.endsWith("'"))) {
              return p.slice(1, -1);
            }
            if (vars[p] !== undefined) {
              return vars[p];
            }
            return p;
          }).join(' ');

          outputs.push(lineOut);
        }
      }

      if (outputs.length > 0) {
        output = outputs.join('\n');
      }
    } catch {
      // Fallback para defaultOutput se der algum erro
    }

    return {
      output: output,
      executionTimeMs: Math.round(performance.now() - startTime) + 60,
      isSimulated: true,
    };
  },

  /**
   * Ponto de extensão preparado para integração com API externa (ex: Judge0) no futuro
   * @param _code Código a ser enviado ao backend
   * @param _languageId ID da linguagem na API Judge0
   */
  async runRemoteCode(_code: string, _languageId: number): Promise<ExecutionResult> {
    // Reservado para integração com API externa quando houver servidor backend
    throw new Error('Serviço de execução remota de código via API ainda não configurado.');
  }
};
