# CodeMaster — Plataforma de Ensino de Programação (Mobile-First & PWA)

Uma plataforma estilo "Duolingo para Programadores" desenvolvida em **React 19 + TypeScript + Tailwind CSS** para aprendizado interativo das 9 tecnologias essenciais do mercado:

- 🐍 **Python** (Verde)
- ☕ **Java** (Laranja)
- 🟨 **JavaScript** (Amarelo)
- 🦋 **Flutter / Dart** (Azul Claro)
- 🎨 **CSS** (Azul)
- 🌐 **HTML** (Vermelho/Laranja)
- 🐘 **PHP** (Roxo)
- 🟩 **Node.js** (Verde Escuro)
- 🐬 **MySQL** (Azul Marinho)

---

## 🌟 Funcionalidades

1. **Arquitetura Mobile-First**: Interface responsiva para celulares (360-430px) com Bottom Tab Bar fixa (**Início, Cursos, Progresso, Perfil**).
2. **4 Níveis de Aprendizado por Tecnologia**:
   - 1. Iniciante
   - 2. Intermediário
   - 3. Avançado
   - 4. Projetos Práticos
3. **Estrutura Padrão Fixa por Aula (6 Seções)**:
   - 1. **Teoria** (conceitos-chave e cartões)
   - 2. **Exemplo de Código Comentado** (com cópia em um clique)
   - 3. **Execução / Simulação** (Console interativo com Pyodide em Python, iframe no HTML/JS e simulação visual no Java/PHP/MySQL/Flutter)
   - 4. **Exercício Prático Real** (enunciado com sistema de dicas)
   - 5. **Correção Automática** (teclado de símbolos móveis + validação instantânea)
   - 6. **Feedback Imediato** (XP, sequências de estudo e solução explicada)
4. **Persistência Local**: Progresso salvo em `localStorage` via `storageService.ts` com exportação e importação de JSON.

---

## 📱 Como empacotar como App Mobile para Android e iOS (Capacitor)

Este projeto foi projetado para virar um aplicativo mobile nativo sem alterar a lógica.

### Passo 1: Instalar as dependências do Capacitor

```bash
npm install @capacitor/core @capacitor/cli
```

### Passo 2: Inicializar o Capacitor no projeto

```bash
npx cap init CodeMaster com.codemaster.app --web-dir dist
```

### Passo 3: Gerar o build web de produção

```bash
npm run build
```

### Passo 4: Adicionar as plataformas desejadas

Para Android:
```bash
npm install @capacitor/android
npx cap add android
```

Para iOS (requer macOS):
```bash
npm install @capacitor/ios
npx cap add ios
```

### Passo 5: Sincronizar o build com os projetos nativos

```bash
npx cap copy
npx cap sync
```

### Passo 6: Abrir a IDE nativa para compilar o APK/IPA

Android:
```bash
npx cap open android
```
*(No Android Studio, clique em **Build > Build Bundle(s) / APK(s) > Build APK(s)**)*

iOS:
```bash
npx cap open ios
```
*(No Xcode, selecione seu dispositivo/simulador e execute o Build)*
