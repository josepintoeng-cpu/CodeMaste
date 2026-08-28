import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { UserProgress, TechId, LevelId, TechCategory, Technology } from '../types';
import { storageService } from '../services/storageService';

export type AppLanguage = 'pt' | 'en';

export interface I18nContextType {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  toggleLanguage: () => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  getTechName: (tech: Technology) => string;
  getTechDescription: (tech: Technology) => string;
  getTechBadge: (tech: Technology) => string;
  getTechCategory: (cat: TechCategory | string) => string;
  getLevelName: (levelId: LevelId) => string;
  getRankTitle: (xp: number) => { title: string; color: string };
  formatDate: (date: Date | string, options?: Intl.DateTimeFormatOptions) => string;
}

const translations: Record<AppLanguage, Record<string, string>> = {
  pt: {
    // Brand & App
    'app.name': 'CODEMASTER',
    'app.version': 'v1.0',
    'app.slogan': 'Plataforma Interativa de Programação',

    // Header & Sync
    'header.xp': 'XP',
    'header.xpTitle': 'Pontos de Experiência',
    'header.theme': 'Tema',
    'header.dark': 'Escuro',
    'header.light': 'Claro',
    'header.themeDarkActive': 'Tema: Escuro (Ativado)',
    'header.themeLightActive': 'Tema: Claro (Ativado)',
    'header.lang': 'Idioma',
    'header.langToggle': 'Mudar para Inglês',
    'sync.offline': 'Offline',
    'sync.syncing': 'Sincronizando',
    'sync.synced': 'Sincronizado',
    'sync.pending': 'Pendente',
    'sync.offlineDesc': 'Modo Offline: lições salvas localmente e sincronizadas quando reconectar',
    'sync.syncingDesc': 'Sincronizando dados em segundo plano...',
    'sync.pendingDesc': '{count} alterações pendentes para envio',
    'sync.syncedDesc': 'Dados 100% sincronizados na nuvem',

    // Bottom Navigation & Global Navigation
    'nav.home': 'Início',
    'nav.courses': 'Cursos',
    'nav.progress': 'Status',
    'nav.profile': 'Perfil',
    'nav.back': 'Voltar',
    'nav.backToHome': 'Voltar ao Início',
    'nav.backToCourses': 'Voltar aos Cursos',
    'nav.selectOther': 'Escolher Outra Opção',
    'nav.selectOtherTech': 'Selecionar Outra Tecnologia',

    // Home Screen
    'home.welcome': 'BEM-VINDO DE VOLTA',
    'home.welcomeBack': 'BEM-VINDO DE VOLTA',
    'home.streakCount_one': '{count} dia',
    'home.streakCount_other': '{count} dias',
    'home.streakBannerTitle': 'SEQUÊNCIA & META DIÁRIA',
    'home.dailyGoalCompleted': 'Meta diária concluída! 🔥',
    'home.dailyGoalPending': 'Mantenha sua sequência ativa',
    'home.goalDone': 'Meta diária concluída! 🔥',
    'home.goalPending': 'Mantenha sua sequência ativa',
    'home.dailyGoalDescDone': 'Você manteve seu fogo aceso por {streak} {streakDays}!',
    'home.dailyGoalDescKeep': 'Complete 1 aula hoje para não perder sua sequência de {streak} dias!',
    'home.dailyGoalDescStart': 'Complete sua 1ª aula hoje para acender seu fogo de sequência diária!',
    'home.streakKept_one': 'Você manteve seu fogo aceso por {count} dia!',
    'home.streakKept_other': 'Você manteve seu fogo aceso por {count} dias!',
    'home.completeOne': 'Complete 1 aula hoje para não perder sua sequência de {count} dias!',
    'home.completeFirst': 'Complete sua 1ª aula hoje para acender seu fogo de sequência diária!',
    'home.continueLearning': 'CONTINUAR APRENDENDO',
    'home.defaultLessonTitle': 'Python: 1. Olá Mundo e Variáveis',
    'home.techCatalogTitle': 'TECNOLOGIAS (31 CURSOS)',
    'home.techCatalogSubtitle': 'Aprenda interativamente do zero ao avançado.',
    'home.technologies': 'TECNOLOGIAS (31 CURSOS)',
    'home.techSubtitle': 'Aprenda interativamente do zero ao avançado.',
    'home.viewAll': 'Ver Todos',
    'home.lessonProgress': '{count}/20 aulas',
    'home.lessonsCount': 'aulas',
    'home.statCompletedLessons': 'Aulas Feitas',
    'home.lessonsDone': 'Aulas Feitas',
    'home.statTotalXp': 'XP Total',
    'home.totalXp': 'XP Total',
    'home.statStreak': 'Sequência',
    'home.streakStat': 'Sequência',

    // Courses Screen
    'courses.tag': 'CATÁLOGO OFICIAL & DOMÍNIO',
    'courses.badge': 'CATÁLOGO OFICIAL & DOMÍNIO',
    'courses.title': 'Cursos & Mestria (31 Stacks)',
    'courses.subtitle': 'Acompanhe sua porcentagem de domínio em cada tecnologia com base em aulas e quizzes.',
    'courses.globalProgress': 'Progresso Global',
    'courses.catalogMastery': 'Domínio Geral do Catálogo',
    'courses.overallMastery': 'Domínio Geral do Catálogo',
    'courses.averageMastery': 'Média Geral',
    'courses.overallAvg': 'Média Geral',
    'courses.lessons': 'Aulas',
    'courses.quizzes': 'Quizzes',
    'courses.masteries': 'Mestrias',
    'courses.searchPlaceholder': 'Buscar tecnologia (ex: Unity, Unreal, Godot, Blender, Multiplayer, Python)...',
    'courses.statusFilter': 'Status',
    'courses.statusAll': 'Todas',
    'courses.filterAll': 'Todas',
    'courses.statusInProgress': '⚡ Em Curso',
    'courses.filterInProgress': '⚡ Em Curso',
    'courses.statusMastered': '👑 Mestres (100%)',
    'courses.filterMastered': '👑 Mestres (100%)',
    'courses.statusUnstarted': '⚪ Não Iniciadas',
    'courses.filterUnstarted': '⚪ Não Iniciadas',
    'courses.noTechFound': 'Nenhuma tecnologia encontrada',
    'courses.noTechFoundDesc': 'Tente ajustar os filtros de categoria ou termo de busca.',
    'courses.notFound': 'Nenhuma tecnologia encontrada',
    'courses.notFoundDesc': 'Tente ajustar os filtros de categoria ou termo de busca.',
    'courses.catAll': 'Todos',
    'courses.catGameDev': 'Game Dev',
    'courses.cat3DEngines': '3D & Engines',
    'courses.catFrontend': 'Frontend',
    'courses.catBackend': 'Backend',
    'courses.catMobile': 'Mobile',
    'courses.catDatabase': 'Banco de Dados',
    'courses.catLanguages': 'Linguagens',
    'courses.catCybersecurity': 'Cybersecurity',
    'courses.catDevOps': 'DevOps & Cloud',
    'courses.catAI': 'IA & Dados',
    'courses.catTools': 'Ferramentas',
    'courses.catCareer': 'Carreira & Inglês',

    // Categories
    'cat.Frontend': 'Frontend',
    'cat.Backend': 'Backend',
    'cat.Mobile': 'Mobile',
    'cat.Banco de Dados': 'Banco de Dados',
    'cat.Linguagens': 'Linguagens',
    'cat.Cybersecurity': 'Cybersecurity',
    'cat.DevOps & Cloud': 'DevOps & Cloud',
    'cat.IA & Dados': 'IA & Dados',
    'cat.Ferramentas': 'Ferramentas',
    'cat.Carreira & Inglês': 'Carreira & Inglês',
    'cat.Game Dev': 'Game Dev',
    'cat.3D & Engines': '3D & Engines',

    // Levels
    'level.iniciante': 'Iniciante',
    'level.intermediario': 'Intermediário',
    'level.avancado': 'Avançado',
    'level.projetos': 'Projetos',
    'level.tabIniciante': '01. INICIANTE',
    'level.tabIntermediario': '02. INTERMEDIÁRIO',
    'level.tabAvancado': '03. AVANÇADO',
    'level.tabProjetos': '04. PROJETOS',

    // Tech Detail Screen
    'tech.modules': 'MÓDULOS DE APRENDIZADO',
    'tech.levelProgress': 'PROGRESSO DO NÍVEL',
    'tech.levelProgressDesc': '{completed} de {total} Aulas Concluídas',
    'tech.availableLessons': 'AULAS DISPONÍVEIS',
    'tech.minutes': 'min',
    'tech.quizTitle': 'Quiz Avaliativo de Nível',
    'tech.quizSubtitle': 'Teste seus conhecimentos e ganhe +50 XP bônus.',
    'tech.startQuiz': 'Iniciar Quiz',

    // Lesson Screen
    'lesson.section1': '1. TEORIA E CONCEITO',
    'lesson.section1Theory': '1. TEORIA E CONCEITO',
    'lesson.section2': '2. CÓDIGO COMENTADO',
    'lesson.section2Code': '2. CÓDIGO COMENTADO',
    'lesson.section3': '3. SIMULAÇÃO DE CÓDIGO',
    'lesson.section3Simulation': '3. SIMULAÇÃO DE CÓDIGO',
    'lesson.section4': '4. EXERCÍCIO PRÁTICO',
    'lesson.section4Exercise': '4. EXERCÍCIO PRÁTICO',
    'lesson.section5': '5. SUA RESPOSTA:',
    'lesson.section5Answer': '5. SUA RESPOSTA:',
    'lesson.section6Correct': '6. Resposta Correta (+{xp} XP)',
    'lesson.section6TryAgain': '6. Tente Novamente (Tentativa {attempt})',
    'lesson.correctAnswer': 'Resposta Correta! (+{xp} XP)',
    'lesson.tryAgain': 'Tente Novamente (Tentativa {attempts})',
    'lesson.showHint': 'Ver Dica',
    'lesson.hideHint': 'Ocultar Dica',
    'lesson.hint': 'Dica',
    'lesson.codePlaceholder': 'Digite sua solução em código aqui...',
    'lesson.editorPlaceholder': 'Digite sua solução em código aqui...',
    'lesson.checkAnswer': 'Verificar Resposta',
    'lesson.checking': 'Executando e Verificando...',
    'lesson.completed': 'Aula Concluída!',
    'lesson.lessonCompleted': 'Aula Concluída! 🎉',
    'lesson.recommendedSolution': 'Solução Recomendada:',
    'lesson.nextLesson': 'Ir para a Próxima Aula',
    'lesson.confettiTitle': 'Lição Concluída!',
    'lesson.confettiSubtitle': 'Você dominou "{title}" com perfeição.',
    'lesson.zenMode': 'Modo Zen',
    'lesson.exitZenMode': 'Sair do Modo Zen',
    'lesson.zenModeTitle': 'Modo Zen: Foco Total',
    'lesson.zenModeActive': 'Modo Zen Ativo',
    'lesson.zenModeDesc': 'Navegação e distrações ocultadas. Foco 100% no código.',
    'lesson.zenToggleTheory': 'Consultar Teoria',
    'lesson.zenHideTheory': 'Ocultar Teoria',
    'lesson.zenEscHint': 'ESC para sair',

    // Quiz Screen
    'quiz.questionProgress': 'Questão {current} de {total}',
    'quiz.explanation': 'Explicação:',
    'quiz.confirmAnswer': 'Confirmar Resposta',
    'quiz.nextQuestion': 'Próxima Questão',
    'quiz.viewResult': 'Ver Resultado do Quiz',
    'quiz.successTitle': 'Quiz Concluído com Sucesso! 🎉',
    'quiz.studyMoreTitle': 'Precisa de Mais Estudo 📚',
    'quiz.resultDesc': 'Você acertou {correct} de {total} questões ({score}%).',
    'quiz.rewardEarned': '+{xp} XP Recompensa Bônus Ganha!',
    'quiz.backToLessons': 'Voltar às Aulas',
    'quiz.confettiTitle': 'Quiz Concluído!',
    'quiz.confettiSubtitle': 'Você atingiu {score}% de acerto no desafio {title}!',

    // Progress Screen
    'progress.tag': 'ESTATÍSTICAS ATUAIS',
    'progress.badge': 'ESTATÍSTICAS ATUAIS',
    'progress.title': 'Status & Conquistas',
    'progress.subtitle': 'Acompanhe o seu desempenho diário e sequência de estudos consecutivos.',
    'progress.dailyActivity': 'ATIVIDADE DIÁRIA',
    'progress.dailyActivityBadge': 'ATIVIDADE DIÁRIA',
    'progress.dailyActivityTitle': 'XP nos Últimos 7 Dias',
    'progress.xpLast7Days': 'XP ganho nos últimos 7 dias',
    'progress.dailyAverage': 'Média Diária',
    'progress.dailyAvg': 'Média Diária',
    'progress.bestDay': 'Melhor Dia',
    'progress.inProgress': 'Em progresso',
    'progress.today': 'Hoje',
    'progress.xpEarned': '+{xp} XP ganho',
    'progress.dailyInsightTag': 'INSIGHT DIÁRIO',
    'progress.dailyInsightBadge': 'INSIGHT DIÁRIO',
    'progress.dailyQuote': '"A persistência na prática de código transforma sintaxe em maestria. Mantenha sua sequência ativa hoje."',
    'progress.techProgress': 'Progresso por Tecnologia',
    'progress.techProgressTitle': 'Progresso por Tecnologia',
    'progress.lessonsDone': '{count} aulas ({pct}%)',
    'progress.unlockedAchievements': 'CONQUISTAS DESBLOQUEADAS',
    'progress.unlockedBadges': 'CONQUISTAS DESBLOQUEADAS',

    // Study Time Estimator
    'time.tag': 'ESTATÍSTICA DE DEDICAÇÃO',
    'time.title': 'Tempo Total de Estudo Estimado',
    'time.investedInCode': 'investidos em código',
    'time.calculatedBased': 'Calculado ponderando {count} {lessonLabel} e seus pesos de complexidade.',
    'time.lessonLabel_one': 'aula concluída',
    'time.lessonLabel_other': 'aulas concluídas',
    'time.complexityDist': 'Distribuição por Complexidade',
    'time.weighted100': '100% ponderado',
    'time.avgWeight': 'Peso Médio',
    'time.minPerLesson': '~{mins} min/aula',
    'time.avgPerLesson': 'Média por Aula',
    'time.focusBlocks': 'Blocos de Foco (25m)',
    'time.pomodoroSessions_one': '{count} sessão Pomodoro',
    'time.pomodoroSessions_other': '{count} sessões Pomodoro',
    'time.nextMilestone': 'Próximo Marco',
    'time.remainingMin': 'Faltam {mins} min',
    'time.achieved': 'Alcançado!',
    'time.howCalculated': 'Como o tempo de estudo é calculado?',
    'time.close': 'Fechar',
    'time.formulaDesc': 'Cada lição concluída possui um tempo estimado baseado na profundidade teórica, volume de código e testes práticos exigidos em seu nível de dificuldade:',
    'time.formulaRule': 'Fórmula: Tempo Total = Σ(Duração de cada lição concluída indexada pelo nível)',
    'time.startFirstLesson': 'Começar Minha 1ª Aula e Contabilizar Horas',

    // Streak Counter
    'streak.title': 'Sequência Diária',
    'streak.subtitle': 'Aulas consecutivas',
    'streak.currentFlame': 'Fogo Atual:',
    'streak.consecutiveDay_one': 'dia consecutivo',
    'streak.consecutiveDay_other': 'dias consecutivos',
    'streak.todayStatus': 'Status de Hoje:',
    'streak.done': 'Concluído!',
    'streak.pending': 'Pendente',
    'streak.active': 'Ativo',
    'streak.goodJob': 'Ótimo trabalho! Você concluiu lições hoje e manteve seu fogo aceso.',
    'streak.callToAction': 'Complete pelo menos 1 aula hoje para manter sua sequência e ganhar bônus de XP!',
    'streak.studyNow': 'Estudar Agora',
    'streak.studyStreak': 'SEQUÊNCIA DE ESTUDOS',
    'streak.record': 'Recorde',
    'streak.goalDone': 'Meta de hoje cumprida! Fogo aceso 🔥',
    'streak.goalPending': 'Complete pelo menos 1 aula hoje para manter a sequência!',
    'streak.activity7Days': 'Atividade nos últimos 7 dias',
    'streak.totalDays': '{count} dia(s) no total',
    'streak.nextMilestone': 'Próximo marco:',
    'streak.daysRemaining': '{count} dia(s) restantes',

    // Tech Mastery Indicator
    'mastery.technicalMastery': 'Domínio Técnico',
    'mastery.completedLessons': 'Aulas concluídas',
    'mastery.quizzesPassed': 'Quizzes aprovados',
    'mastery.tierMaster': '👑 Mestre',
    'mastery.tierAdvanced': '🚀 Avançado',
    'mastery.tierIntermediate': '⚡ Intermediário',
    'mastery.tierBeginner': '🌱 Iniciante',
    'mastery.tierUnstarted': '⚪ Não iniciado',

    // Profile Screen
    'profile.settings': 'CONFIGURAÇÕES DA PLATAFORMA',
    'profile.platformSettings': 'CONFIGURAÇÕES DA PLATAFORMA',
    'profile.language': 'Idioma da Interface',
    'profile.languageOption': 'Idioma do Aplicativo',
    'profile.languageDesc': 'Selecione entre Português e Inglês',
    'profile.pt': 'Português (BR)',
    'profile.en': 'English (US)',
    'profile.darkMode': 'Tema Escuro (Dark Mode)',
    'profile.darkModeOn': 'Ativado — Estética escura editorial',
    'profile.darkModeOff': 'Desativado — Modo Claro ativo',
    'profile.darkActive': 'Ativado — Estética escura editorial',
    'profile.lightActive': 'Desativado — Modo Claro ativo',
    'profile.activated': 'Ativado',
    'profile.deactivated': 'Desativado',
    'profile.enabled': 'Ativado',
    'profile.disabled': 'Desativado',
    'profile.mobileExport': 'Exportar para App Mobile (Capacitor)',
    'profile.exportMobile': 'Exportar para App Mobile (Capacitor)',
    'profile.exportMobileSubtitle': 'Gerar APK Android / App iOS nativo via Capacitor',
    'profile.mobileExportDesc': 'Instruções para gerar APK Android / iOS',
    'profile.bgSync': 'SINCRONIZAÇÃO EM SEGUNDO PLANO',
    'profile.backgroundSync': 'SINCRONIZAÇÃO EM SEGUNDO PLANO',
    'profile.cloudStatus': 'Status da Nuvem:',
    'profile.syncingQueue': 'Sincronizando fila...',
    'profile.pendingActions': '{count} ação(ões) pendente(s)',
    'profile.fullySynced': 'Totalmente Sincronizado',
    'profile.lastSync': 'Última Sincronização:',
    'profile.neverSynced': 'Nunca sincronizado',
    'profile.todayAt': 'Hoje às {time}',
    'profile.recently': 'Recentemente',
    'profile.offlineNotice': 'Suporte offline ativo: você pode concluir aulas e quizzes mesmo sem internet. Os dados ficam salvos localmente e serão sincronizados automaticamente assim que a conexão for reestabelecida.',
    'profile.syncNow': 'Sincronizar Agora',
    'profile.syncingData': 'Sincronizando Dados...',
    'profile.backupData': 'BACKUP & DADOS',
    'profile.exportJson': 'Exportar JSON',
    'profile.importJson': 'Importar JSON',
    'profile.exportCertReport': 'Exportar Relatório de Certificados',
    'profile.resetAllProgress': 'Resetar Todo o Progresso',
    'profile.saveName': 'Salvar',
    'profile.save': 'Salvar',
    'profile.editName': 'Editar',
    'profile.edit': 'Editar',
    'profile.nameUpdated': 'Nome atualizado com sucesso!',
    'profile.importSuccess': 'Dados de progresso importados com êxito!',
    'profile.importInvalid': 'Arquivo ou formato JSON inválido.',
    'profile.resetSuccess': 'Progresso resetado com sucesso!',
    'profile.importModalTitle': 'Importar Backup de Progresso',
    'profile.importModalDesc': 'Cole o conteúdo do seu arquivo JSON exportado abaixo:',
    'profile.restoreData': 'Restaurar Dados',
    'profile.resetConfirmTitle': 'Tem certeza absoluta?',
    'profile.resetConfirmDesc': 'Isso apagará permanentemente todo o seu XP, conquistas e progresso de aulas salvas no localStorage.',
    'profile.cancel': 'Cancelar',
    'profile.resetEverything': 'Resetar Tudo',
    'profile.mobileGuideTitle': 'Guia de Empacotamento Mobile (Capacitor)',
    'profile.mobileGuideText': 'Este app foi construído de forma 100% mobile-first para rodar como PWA ou ser empacotado como app nativo Android/iOS via Capacitor.',

    // Badges / Achievements
    'badge.primeiros_passos.title': 'Primeiros Passos',
    'badge.primeiros_passos.desc': 'Iniciou sua jornada no CodeMaster.',
    'badge.primeira_aula.title': 'Primeira Aula Concluída',
    'badge.primeira_aula.desc': 'Concluiu sua 1ª aula com sucesso.',
    'badge.dedicado_5.title': 'Dedicado (5 Aulas)',
    'badge.dedicado_5.desc': 'Completou 5 aulas na plataforma.',
    'badge.mestre_15.title': 'Mestre da Prática (15 Aulas)',
    'badge.mestre_15.desc': 'Superou a marca de 15 aulas.',
    'badge.xp_100.title': '100 XP Acumulados',
    'badge.xp_100.desc': 'Conquistou seus primeiros 100 pontos.',
    'badge.streak_3.title': 'Tríade de Fogo (3 Dias)',
    'badge.streak_3.desc': 'Manteve 3 dias seguidos de estudo.',
    'badge.streak_7.title': 'Chama Semanal (7 Dias)',
    'badge.streak_7.desc': 'Manteve 7 dias consecutivos de aulas completadas.',

    // Celebration & Effects
    'celebration.unlocked': 'CONQUISTA DESBLOQUEADA',
    'celebration.defaultTitle': 'Excelente Trabalho!',
    'celebration.defaultSubtitle': 'Você completou esta etapa com sucesso!',
    'celebration.rewardAcquired': 'Recompensa Adquirida',
    'celebration.credited': 'Creditado',
    'celebration.continue': 'Continuar Aprendizado',

    // Footer
    'footer.devBy': 'Desenvolvido pelo',
    'footer.author': 'Eng. José Alfredo Pinto',
    'footer.ceo': 'CEO da',
    'footer.company': 'DevMentor',

    // Code Editor / Simulator
    'editor.copy': 'Copiar Código',
    'editor.copied': 'Copiado!',
    'editor.reset': 'Restaurar Código',
    'editor.syntaxOk': 'Sintaxe Válida',
    'editor.syntaxError': 'Problema de Sintaxe',
    'editor.quickSymbols': 'Símbolos Rápidos',
    'editor.line': 'Linha',
    'editor.characters': 'caracteres',
    'editor.simulating': 'Executando código...',
    'editor.run': 'Executar Código',
    'editor.output': 'Saída do Console',

    // Welcome & Intro Screen (Apresentação / Sobre o Projeto)
    'welcome.badge': 'PROJETO OFICIAL • DEVMONTOR ACADEMY',
    'welcome.title': 'CodeMaster',
    'welcome.tagline': 'Plataforma Profissional de Capacitação em Engenharia de Software',
    'welcome.subtitle': 'Formação completa em 31 trilhas tecnológicas de alta demanda, abrangendo desenvolvimento full-stack, bancos de dados, cloud, cibersegurança e desenvolvimento de jogos, com metodologia prática e exames oficiais de aprovação.',
    'welcome.ctaEnter': 'Acessar Plataforma',
    'welcome.ctaStart': 'Iniciar Formação',
    'welcome.ctaExplore': 'Conhecer a Metodologia',
    'welcome.navAbout': 'Apresentação & Sobre',
    'welcome.backToApp': 'Continuar para o Aplicativo',
    'welcome.aboutTag': 'SOBRE A PLATAFORMA',
    'welcome.aboutTitle': 'Objetivo e Arquitetura do CodeMaster',
    'welcome.aboutDesc': 'O CodeMaster é um ecossistema estruturado para capacitação técnica ativa. Cada módulo combina fundamentação conceitual sólida com escrita de código interativa, execução em tempo real no navegador e validação imediata através de testes automatizados e exames de alto rigor.',
    'welcome.pillarsTag': 'METODOLOGIA EM 4 ETAPAS',
    'welcome.pillarsTitle': 'Metodologia Estruturada de Ensino',
    'welcome.pillar1Title': '1. Fundamentação Teórica',
    'welcome.pillar1Desc': 'Conceitos fundamentais, padrões de arquitetura e boas práticas de engenharia apresentados de forma clara e objetiva.',
    'welcome.pillar2Title': '2. Código Anotado e Prático',
    'welcome.pillar2Desc': 'Implementações reais documentadas linha a linha, detalhando a lógica e as decisões de design de cada componente.',
    'welcome.pillar3Title': '3. Execução em Tempo Real',
    'welcome.pillar3Desc': 'Ambiente de execução dinâmico com avaliação imediata de saída de console, interfaces visuais e estado de dados.',
    'welcome.pillar4Title': '4. Desafios Práticos & Exames',
    'welcome.pillar4Desc': 'Exercícios práticos com validação sintática e semântica, culminando em exames oficiais de passagem com exigência de 100% de precisão.',
    'welcome.developerTag': 'AUTORIA & ENGENHARIA',
    'welcome.developerTitle': 'Corpo Técnico & Autoria',
    'welcome.devRole': 'Engenheiro de Software & Arquiteto de Soluções',
    'welcome.devCompany': 'CEO & Fundador da DevMentor',
    'welcome.devBio': 'Concebido e projetado pelo Eng. José Alfredo Pinto com foco em rigor técnico, arquitetura escalável e formação prática de alto nível. A plataforma consolida padrões corporativos globais para preparar profissionais para demandas reais do mercado de tecnologia.',
    'welcome.devContact': 'Contato Profissional',
    'welcome.purposeTag': 'MISSÃO & IMPACTO',
    'welcome.purposeTitle': 'Missão e Propósito Profissional',
    'welcome.purposeDesc': 'Capacitar desenvolvedores e engenheiros através de uma formação rigorosa e orientada à prática, cobrindo desde a lógica fundamental de programação até arquitetura de microsserviços, inteligência artificial, segurança da informação e computação gráfica.',
    'welcome.featuresTag': 'DIRETRIZES DA PLATAFORMA',
    'welcome.featuresTitle': 'Diferenciais Técnicos da Plataforma',
    'welcome.feat1Title': '31 Trilhas Tecnológicas Completas',
    'welcome.feat1Desc': 'Frontend, Backend, Mobile, Cloud, DevOps, Inteligência Artificial, Cibersegurança, Bancos de Dados e Game Development.',
    'welcome.feat2Title': 'Execução Instantânea no Navegador',
    'welcome.feat2Desc': 'Ambiente de código integrado sem necessidade de instalações locais, pronto para testes e simulações imediatas.',
    'welcome.feat3Title': 'Métricas de Maestria & Sequência Diária',
    'welcome.feat3Desc': 'Acompanhamento analítico de progresso com cálculo de maestria por stack, pontuação de experiência e histórico de estudo.',
    'welcome.feat4Title': 'Exames Oficiais Rigorosos',
    'welcome.feat4Desc': 'Avaliações finais com 80 questões estocásticas (60 teóricas e 20 desafios práticos) exigindo nota 20/20 para certificação.',
    'welcome.statsTechs': '31 Tecnologias',
    'welcome.statsLessons': '620 Aulas Estruturadas',
    'welcome.statsOffline': '100% Interativo',
    'welcome.statsCert': 'Exames de Maestria',

    // Unlock Progression
    'unlock.lockedTitle': 'Tecnologia Bloqueada',
    'unlock.locked': 'Bloqueado',
    'unlock.unlocked': 'Desbloqueado',
    'unlock.techOrder': 'Etapa {current} de {total}',
    'unlock.unlockCondition': 'Concluir 100% da anterior',
    'unlock.goToPrev': 'Estudar {prevTech}',
    'unlock.understand': 'Entendido',
    'unlock.completePrevFirst': 'Complete todas as aulas de {prevTech} para desbloquear {currentTech}.',
    'unlock.journeyTitle': 'Trilha Sequencial de Aprendizado',
    'unlock.journeySubtitle': 'Cada linguagem é desbloqueada conforme você conclui a anterior.',
    'unlock.nextToUnlock': 'Próxima a Desbloquear',
    'unlock.currentlyStudying': 'Em Andamento',
    'unlock.completed': 'Concluído',
  },
  en: {
    // Brand & App
    'app.name': 'CODEMASTER',
    'app.version': 'v1.0',
    'app.slogan': 'Interactive Coding & Mastery Platform',

    // Header & Sync
    'header.xp': 'XP',
    'header.xpTitle': 'Experience Points',
    'header.theme': 'Theme',
    'header.dark': 'Dark',
    'header.light': 'Light',
    'header.themeDarkActive': 'Theme: Dark (Active)',
    'header.themeLightActive': 'Theme: Light (Active)',
    'header.lang': 'Language',
    'header.langToggle': 'Switch to Portuguese',
    'sync.offline': 'Offline',
    'sync.syncing': 'Syncing',
    'sync.synced': 'Synced',
    'sync.pending': 'Pending',
    'sync.offlineDesc': 'Offline Mode: lessons saved locally and synced upon reconnecting',
    'sync.syncingDesc': 'Syncing data in background...',
    'sync.pendingDesc': '{count} changes pending upload',
    'sync.syncedDesc': 'Data 100% synchronized in cloud',

    // Bottom Navigation & Global Navigation
    'nav.home': 'Home',
    'nav.courses': 'Courses',
    'nav.progress': 'Progress',
    'nav.profile': 'Profile',
    'nav.back': 'Back',
    'nav.backToHome': 'Back to Home',
    'nav.backToCourses': 'Back to Courses',
    'nav.selectOther': 'Choose Another Option',
    'nav.selectOtherTech': 'Select Another Technology',

    // Home Screen
    'home.welcome': 'WELCOME BACK',
    'home.welcomeBack': 'WELCOME BACK',
    'home.streakCount_one': '{count} day',
    'home.streakCount_other': '{count} days',
    'home.streakBannerTitle': 'STREAK & DAILY GOAL',
    'home.dailyGoalCompleted': 'Daily goal completed! 🔥',
    'home.dailyGoalPending': 'Keep your daily streak alive',
    'home.goalDone': 'Daily goal completed! 🔥',
    'home.goalPending': 'Keep your daily streak alive',
    'home.dailyGoalDescDone': 'You kept your flame burning for {streak} {streakDays}!',
    'home.dailyGoalDescKeep': 'Complete 1 lesson today to protect your {streak}-day streak!',
    'home.dailyGoalDescStart': 'Complete your 1st lesson today to ignite your daily streak flame!',
    'home.streakKept_one': 'You kept your flame burning for {count} day!',
    'home.streakKept_other': 'You kept your flame burning for {count} days!',
    'home.completeOne': 'Complete 1 lesson today to protect your {count}-day streak!',
    'home.completeFirst': 'Complete your 1st lesson today to ignite your daily streak flame!',
    'home.continueLearning': 'CONTINUE LEARNING',
    'home.defaultLessonTitle': 'Python: 1. Hello World & Variables',
    'home.techCatalogTitle': 'TECHNOLOGIES (31 COURSES)',
    'home.techCatalogSubtitle': 'Learn interactively from zero to advanced.',
    'home.technologies': 'TECHNOLOGIES (31 COURSES)',
    'home.techSubtitle': 'Learn interactively from zero to advanced.',
    'home.viewAll': 'View All',
    'home.lessonProgress': '{count}/20 lessons',
    'home.lessonsCount': 'lessons',
    'home.statCompletedLessons': 'Lessons Done',
    'home.lessonsDone': 'Lessons Done',
    'home.statTotalXp': 'Total XP',
    'home.totalXp': 'Total XP',
    'home.statStreak': 'Streak',
    'home.streakStat': 'Streak',

    // Courses Screen
    'courses.tag': 'OFFICIAL CATALOG & MASTERY',
    'courses.badge': 'OFFICIAL CATALOG & MASTERY',
    'courses.title': 'Courses & Mastery (31 Stacks)',
    'courses.subtitle': 'Track your mastery percentage across all technologies based on lessons and quizzes.',
    'courses.globalProgress': 'Global Progress',
    'courses.catalogMastery': 'Overall Catalog Mastery',
    'courses.overallMastery': 'Overall Catalog Mastery',
    'courses.averageMastery': 'Overall Average',
    'courses.overallAvg': 'Overall Average',
    'courses.lessons': 'Lessons',
    'courses.quizzes': 'Quizzes',
    'courses.masteries': 'Masteries',
    'courses.searchPlaceholder': 'Search technology (e.g. Unity, Unreal, Godot, Blender, Multiplayer, Python)...',
    'courses.statusFilter': 'Status',
    'courses.statusAll': 'All',
    'courses.filterAll': 'All',
    'courses.statusInProgress': '⚡ In Progress',
    'courses.filterInProgress': '⚡ In Progress',
    'courses.statusMastered': '👑 Mastered (100%)',
    'courses.filterMastered': '👑 Mastered (100%)',
    'courses.statusUnstarted': '⚪ Unstarted',
    'courses.filterUnstarted': '⚪ Unstarted',
    'courses.noTechFound': 'No technology found',
    'courses.noTechFoundDesc': 'Try adjusting your category filters or search query.',
    'courses.notFound': 'No technology found',
    'courses.notFoundDesc': 'Try adjusting your category filters or search query.',
    'courses.catAll': 'All',
    'courses.catGameDev': 'Game Dev',
    'courses.cat3DEngines': '3D & Engines',
    'courses.catFrontend': 'Frontend',
    'courses.catBackend': 'Backend',
    'courses.catMobile': 'Mobile',
    'courses.catDatabase': 'Databases',
    'courses.catLanguages': 'Languages',
    'courses.catCybersecurity': 'Cybersecurity',
    'courses.catDevOps': 'DevOps & Cloud',
    'courses.catAI': 'AI & Data',
    'courses.catTools': 'Tools',
    'courses.catCareer': 'Career & English',

    // Categories
    'cat.Frontend': 'Frontend',
    'cat.Backend': 'Backend',
    'cat.Mobile': 'Mobile',
    'cat.Banco de Dados': 'Databases',
    'cat.Linguagens': 'Languages',
    'cat.Cybersecurity': 'Cybersecurity',
    'cat.DevOps & Cloud': 'DevOps & Cloud',
    'cat.IA & Dados': 'AI & Data',
    'cat.Ferramentas': 'Tools',
    'cat.Carreira & Inglês': 'Career & English',
    'cat.Game Dev': 'Game Dev',
    'cat.3D & Engines': '3D & Engines',

    // Levels
    'level.iniciante': 'Beginner',
    'level.intermediario': 'Intermediate',
    'level.avancado': 'Advanced',
    'level.projetos': 'Projects',
    'level.tabIniciante': '01. BEGINNER',
    'level.tabIntermediario': '02. INTERMEDIATE',
    'level.tabAvancado': '03. ADVANCED',
    'level.tabProjetos': '04. PROJECTS',

    // Tech Detail Screen
    'tech.modules': 'LEARNING MODULES',
    'tech.levelProgress': 'LEVEL PROGRESS',
    'tech.levelProgressDesc': '{completed} of {total} Lessons Completed',
    'tech.availableLessons': 'AVAILABLE LESSONS',
    'tech.minutes': 'min',
    'tech.quizTitle': 'Level Assessment Quiz',
    'tech.quizSubtitle': 'Test your knowledge and earn +50 XP bonus reward.',
    'tech.startQuiz': 'Start Quiz',

    // Lesson Screen
    'lesson.section1': '1. THEORY & CONCEPTS',
    'lesson.section1Theory': '1. THEORY & CONCEPTS',
    'lesson.section2': '2. COMMENTED CODE',
    'lesson.section2Code': '2. COMMENTED CODE',
    'lesson.section3': '3. CODE SIMULATION',
    'lesson.section3Simulation': '3. CODE SIMULATION',
    'lesson.section4': '4. PRACTICAL EXERCISE',
    'lesson.section4Exercise': '4. PRACTICAL EXERCISE',
    'lesson.section5': '5. YOUR ANSWER:',
    'lesson.section5Answer': '5. YOUR ANSWER:',
    'lesson.section6Correct': '6. Correct Answer (+{xp} XP)',
    'lesson.section6TryAgain': '6. Try Again (Attempt {attempt})',
    'lesson.correctAnswer': 'Correct Answer! (+{xp} XP)',
    'lesson.tryAgain': 'Try Again (Attempt {attempts})',
    'lesson.showHint': 'Show Hint',
    'lesson.hideHint': 'Hide Hint',
    'lesson.hint': 'Hint',
    'lesson.codePlaceholder': 'Type your code solution here...',
    'lesson.editorPlaceholder': 'Type your code solution here...',
    'lesson.checkAnswer': 'Check Answer',
    'lesson.checking': 'Running & Verifying...',
    'lesson.completed': 'Lesson Completed!',
    'lesson.lessonCompleted': 'Lesson Completed! 🎉',
    'lesson.recommendedSolution': 'Recommended Solution:',
    'lesson.nextLesson': 'Go to Next Lesson',
    'lesson.confettiTitle': 'Lesson Completed!',
    'lesson.confettiSubtitle': 'You mastered "{title}" with distinction.',
    'lesson.zenMode': 'Zen Mode',
    'lesson.exitZenMode': 'Exit Zen Mode',
    'lesson.zenModeTitle': 'Zen Mode: Full Focus',
    'lesson.zenModeActive': 'Zen Mode Active',
    'lesson.zenModeDesc': 'Navigation and distractions hidden. 100% focus on code.',
    'lesson.zenToggleTheory': 'Consult Theory',
    'lesson.zenHideTheory': 'Hide Theory',
    'lesson.zenEscHint': 'ESC to exit',

    // Quiz Screen
    'quiz.questionProgress': 'Question {current} of {total}',
    'quiz.explanation': 'Explanation:',
    'quiz.confirmAnswer': 'Confirm Answer',
    'quiz.nextQuestion': 'Next Question',
    'quiz.viewResult': 'View Quiz Results',
    'quiz.successTitle': 'Quiz Successfully Passed! 🎉',
    'quiz.studyMoreTitle': 'More Study Recommended 📚',
    'quiz.resultDesc': 'You got {correct} of {total} questions correct ({score}%).',
    'quiz.rewardEarned': '+{xp} XP Bonus Reward Earned!',
    'quiz.backToLessons': 'Back to Lessons',
    'quiz.confettiTitle': 'Quiz Completed!',
    'quiz.confettiSubtitle': 'You achieved a {score}% score in the {title} challenge!',

    // Progress Screen
    'progress.tag': 'CURRENT PERFORMANCE',
    'progress.badge': 'CURRENT PERFORMANCE',
    'progress.title': 'Stats & Achievements',
    'progress.subtitle': 'Track your daily study routine, XP history and consecutive streaks.',
    'progress.dailyActivity': 'DAILY ACTIVITY',
    'progress.dailyActivityBadge': 'DAILY ACTIVITY',
    'progress.dailyActivityTitle': 'XP Over the Last 7 Days',
    'progress.xpLast7Days': 'XP earned over the last 7 days',
    'progress.dailyAverage': 'Daily Average',
    'progress.dailyAvg': 'Daily Average',
    'progress.bestDay': 'Best Day',
    'progress.inProgress': 'In progress',
    'progress.today': 'Today',
    'progress.xpEarned': '+{xp} XP earned',
    'progress.dailyInsightTag': 'DAILY INSIGHT',
    'progress.dailyInsightBadge': 'DAILY INSIGHT',
    'progress.dailyQuote': '"Persistence in code practice transforms syntax into craftsmanship. Keep your active streak today."',
    'progress.techProgress': 'Progress by Technology',
    'progress.techProgressTitle': 'Progress by Technology',
    'progress.lessonsDone': '{count} lessons ({pct}%)',
    'progress.unlockedAchievements': 'UNLOCKED ACHIEVEMENTS',
    'progress.unlockedBadges': 'UNLOCKED ACHIEVEMENTS',

    // Study Time Estimator
    'time.tag': 'DEDICATION METRICS',
    'time.title': 'Estimated Total Study Time',
    'time.investedInCode': 'invested in code',
    'time.calculatedBased': 'Calculated by weighting {count} {lessonLabel} and their complexity tiers.',
    'time.lessonLabel_one': 'completed lesson',
    'time.lessonLabel_other': 'completed lessons',
    'time.complexityDist': 'Complexity Distribution',
    'time.weighted100': '100% weighted',
    'time.avgWeight': 'Average Weight',
    'time.minPerLesson': '~{mins} min/lesson',
    'time.avgPerLesson': 'Avg per Lesson',
    'time.focusBlocks': 'Focus Blocks (25m)',
    'time.pomodoroSessions_one': '{count} Pomodoro session',
    'time.pomodoroSessions_other': '{count} Pomodoro sessions',
    'time.nextMilestone': 'Next Goal',
    'time.remainingMin': '{mins} min remaining',
    'time.achieved': 'Achieved!',
    'time.howCalculated': 'How is study time calculated?',
    'time.close': 'Close',
    'time.formulaDesc': 'Every completed lesson has an estimated duration based on conceptual depth, code volume, and hands-on exercises at its difficulty level:',
    'time.formulaRule': 'Formula: Total Time = Σ(Duration of each completed lesson indexed by tier)',
    'time.startFirstLesson': 'Start My 1st Lesson to Log Hours',

    // Streak Counter
    'streak.title': 'Daily Streak',
    'streak.subtitle': 'Consecutive study',
    'streak.currentFlame': 'Current Flame:',
    'streak.consecutiveDay_one': 'consecutive day',
    'streak.consecutiveDay_other': 'consecutive days',
    'streak.todayStatus': "Today's Status:",
    'streak.done': 'Completed!',
    'streak.pending': 'Pending',
    'streak.active': 'Active',
    'streak.goodJob': 'Great job! You finished lessons today and kept your streak blazing.',
    'streak.callToAction': 'Complete at least 1 lesson today to keep your streak and earn bonus XP!',
    'streak.studyNow': 'Study Now',
    'streak.studyStreak': 'STUDY STREAK',
    'streak.record': 'Record',
    'streak.goalDone': "Today's goal completed! Flame is lit 🔥",
    'streak.goalPending': 'Complete at least 1 lesson today to maintain your streak!',
    'streak.activity7Days': 'Activity in the last 7 days',
    'streak.totalDays': '{count} total day(s)',
    'streak.nextMilestone': 'Next milestone:',
    'streak.daysRemaining': '{count} day(s) remaining',

    // Tech Mastery Indicator
    'mastery.technicalMastery': 'Technical Mastery',
    'mastery.completedLessons': 'Completed lessons',
    'mastery.quizzesPassed': 'Passed quizzes',
    'mastery.tierMaster': '👑 Master',
    'mastery.tierAdvanced': '🚀 Advanced',
    'mastery.tierIntermediate': '⚡ Intermediate',
    'mastery.tierBeginner': '🌱 Beginner',
    'mastery.tierUnstarted': '⚪ Unstarted',

    // Profile Screen
    'profile.settings': 'PLATFORM SETTINGS',
    'profile.platformSettings': 'PLATFORM SETTINGS',
    'profile.language': 'Interface Language',
    'profile.languageOption': 'Application Language',
    'profile.languageDesc': 'Select between Portuguese and English',
    'profile.pt': 'Portuguese (BR)',
    'profile.en': 'English (US)',
    'profile.darkMode': 'Dark Mode Theme',
    'profile.darkModeOn': 'Active — Editorial dark aesthetics',
    'profile.darkModeOff': 'Inactive — Clean Light mode',
    'profile.darkActive': 'Active — Editorial dark aesthetics',
    'profile.lightActive': 'Inactive — Clean Light mode',
    'profile.activated': 'Active',
    'profile.deactivated': 'Inactive',
    'profile.enabled': 'Active',
    'profile.disabled': 'Inactive',
    'profile.mobileExport': 'Export to Mobile App (Capacitor)',
    'profile.exportMobile': 'Export to Mobile App (Capacitor)',
    'profile.exportMobileSubtitle': 'Build Android APK / Native iOS app via Capacitor',
    'profile.mobileExportDesc': 'Instructions to build Android APK / iOS app',
    'profile.bgSync': 'BACKGROUND SYNCHRONIZATION',
    'profile.backgroundSync': 'BACKGROUND SYNCHRONIZATION',
    'profile.cloudStatus': 'Cloud Status:',
    'profile.syncingQueue': 'Syncing queue...',
    'profile.pendingActions': '{count} pending change(s)',
    'profile.fullySynced': 'Fully Synchronized',
    'profile.lastSync': 'Last Sync:',
    'profile.neverSynced': 'Never synced',
    'profile.todayAt': 'Today at {time}',
    'profile.recently': 'Recently',
    'profile.offlineNotice': 'Full offline support active: you can finish lessons and quizzes without internet. Data is securely saved locally and automatically synced once connection returns.',
    'profile.syncNow': 'Sync Now',
    'profile.syncingData': 'Syncing Data...',
    'profile.backupData': 'BACKUP & DATA',
    'profile.exportJson': 'Export JSON',
    'profile.importJson': 'Import JSON',
    'profile.exportCertReport': 'Export Certificate Report',
    'profile.resetAllProgress': 'Reset All Progress',
    'profile.saveName': 'Save',
    'profile.save': 'Save',
    'profile.editName': 'Edit',
    'profile.edit': 'Edit',
    'profile.nameUpdated': 'Name updated successfully!',
    'profile.importSuccess': 'Progress backup imported successfully!',
    'profile.importInvalid': 'Invalid JSON file or format.',
    'profile.resetSuccess': 'Progress reset successfully!',
    'profile.importModalTitle': 'Import Progress Backup',
    'profile.importModalDesc': 'Paste the contents of your exported JSON file below:',
    'profile.restoreData': 'Restore Data',
    'profile.resetConfirmTitle': 'Are you absolutely sure?',
    'profile.resetConfirmDesc': 'This will permanently wipe all your XP, badges, and lesson progress from local storage.',
    'profile.cancel': 'Cancel',
    'profile.resetEverything': 'Reset Everything',
    'profile.mobileGuideTitle': 'Mobile Packaging Guide (Capacitor)',
    'profile.mobileGuideText': 'This app is engineered 100% mobile-first to run as a high-performance PWA or native Android/iOS application via Capacitor.',

    // Badges / Achievements
    'badge.primeiros_passos.title': 'First Steps',
    'badge.primeiros_passos.desc': 'Started your learning journey in CodeMaster.',
    'badge.primeira_aula.title': 'First Completed Lesson',
    'badge.primeira_aula.desc': 'Completed your 1st lesson with success.',
    'badge.dedicado_5.title': 'Dedicated (5 Lessons)',
    'badge.dedicado_5.desc': 'Completed 5 lessons on the platform.',
    'badge.mestre_15.title': 'Practice Master (15 Lessons)',
    'badge.mestre_15.desc': 'Surpassed the 15 completed lessons milestone.',
    'badge.xp_100.title': '100 XP Accumulated',
    'badge.xp_100.desc': 'Earned your first 100 experience points.',
    'badge.streak_3.title': 'Flame Triad (3 Days)',
    'badge.streak_3.desc': 'Maintained a 3-day consecutive study streak.',
    'badge.streak_7.title': 'Weekly Flame (7 Days)',
    'badge.streak_7.desc': 'Maintained 7 consecutive days of completed lessons.',

    // Celebration & Effects
    'celebration.unlocked': 'ACHIEVEMENT UNLOCKED',
    'celebration.defaultTitle': 'Excellent Work!',
    'celebration.defaultSubtitle': 'You successfully completed this milestone!',
    'celebration.rewardAcquired': 'Reward Acquired',
    'celebration.credited': 'Credited',
    'celebration.continue': 'Continue Learning',

    // Footer
    'footer.devBy': 'Developed by',
    'footer.author': 'Eng. José Alfredo Pinto',
    'footer.ceo': 'CEO of',
    'footer.company': 'DevMentor',

    // Code Editor / Simulator
    'editor.copy': 'Copy Code',
    'editor.copied': 'Copied!',
    'editor.reset': 'Reset Code',
    'editor.syntaxOk': 'Valid Syntax',
    'editor.syntaxError': 'Syntax Issue',
    'editor.quickSymbols': 'Quick Symbols',
    'editor.line': 'Line',
    'editor.characters': 'characters',
    'editor.simulating': 'Running code...',
    'editor.run': 'Run Code',
    'editor.output': 'Console Output',

    // Welcome & Intro Screen (Apresentação / Sobre o Projeto)
    'welcome.badge': 'OFFICIAL PROJECT • DEVMONTOR ACADEMY',
    'welcome.title': 'CodeMaster',
    'welcome.tagline': 'Professional Software Engineering & Game Development Platform',
    'welcome.subtitle': 'Comprehensive training across 31 high-demand technology tracks spanning full-stack, cloud, cybersecurity, database architecture, and game engines, with hands-on practice and rigorous certification exams.',
    'welcome.ctaEnter': 'Enter Platform',
    'welcome.ctaStart': 'Start My Training',
    'welcome.ctaExplore': 'Explore Methodology',
    'welcome.navAbout': 'Introduction & About',
    'welcome.backToApp': 'Continue to Application',
    'welcome.aboutTag': 'ABOUT THE PLATFORM',
    'welcome.aboutTitle': 'Purpose and Architecture of CodeMaster',
    'welcome.aboutDesc': 'CodeMaster is a structured ecosystem built for active engineering mastery. Each module pairs solid conceptual foundations with real-time in-browser code execution, interactive feedback, and high-rigor qualification exams.',
    'welcome.pillarsTag': '4-STEP METHODOLOGY',
    'welcome.pillarsTitle': 'Structured Learning Methodology',
    'welcome.pillar1Title': '1. Theoretical Foundations',
    'welcome.pillar1Desc': 'Core architectural principles, system design patterns, and engineering standards explained with precision.',
    'welcome.pillar2Title': '2. Annotated Production Code',
    'welcome.pillar2Desc': 'Line-by-line documented implementations detailing architectural decisions and best practices.',
    'welcome.pillar3Title': '3. Real-Time Execution',
    'welcome.pillar3Desc': 'Dynamic execution environment with immediate verification of console output, UI rendering, and data states.',
    'welcome.pillar4Title': '4. Code Challenges & Exams',
    'welcome.pillar4Desc': 'Practical challenges with syntax and semantics validation, culminating in official exams requiring 100% accuracy.',
    'welcome.developerTag': 'ENGINEERING & AUTHORSHIP',
    'welcome.developerTitle': 'Technical Direction & Authorship',
    'welcome.devRole': 'Software Engineer & Solutions Architect',
    'welcome.devCompany': 'CEO & Founder of DevMentor',
    'welcome.devBio': 'Designed and architected by Eng. José Alfredo Pinto with a commitment to technical excellence, scalable system design, and practical industry preparation. The platform reflects global enterprise standards to equip engineers for modern technology challenges.',
    'welcome.devContact': 'Professional Contact',
    'welcome.purposeTag': 'MISSION & IMPACT',
    'welcome.purposeTitle': 'Professional Mission & Impact',
    'welcome.purposeDesc': 'To prepare developers and software engineers through rigorous, practice-driven education—ranging from core algorithmic problem solving to microservices architecture, artificial intelligence, security engineering, and computer graphics.',
    'welcome.featuresTag': 'PLATFORM CAPABILITIES',
    'welcome.featuresTitle': 'Technical Strengths of the Platform',
    'welcome.feat1Title': '31 Comprehensive Tech Tracks',
    'welcome.feat1Desc': 'Frontend, Backend, Mobile, Cloud, DevOps, AI, Cybersecurity, Databases, and Game Development.',
    'welcome.feat2Title': 'Zero Setup In-Browser Execution',
    'welcome.feat2Desc': 'Full-featured code execution environment accessible directly in your browser without local configuration.',
    'welcome.feat3Title': 'Mastery Metrics & Daily Continuity',
    'welcome.feat3Desc': 'In-depth progress analytics tracking mastery percentages per stack, experience points, and study consistency.',
    'welcome.feat4Title': 'Rigorous Certification Exams',
    'welcome.feat4Desc': 'Official evaluations featuring 80 randomized questions (60 theory and 20 code challenges) requiring a 20/20 score to pass.',
    'welcome.statsTechs': '31 Technologies',
    'welcome.statsLessons': '620 Structured Lessons',
    'welcome.statsOffline': '100% Interactive',
    'welcome.statsCert': 'Mastery Exams',

    // Unlock Progression
    'unlock.lockedTitle': 'Technology Locked',
    'unlock.locked': 'Locked',
    'unlock.unlocked': 'Unlocked',
    'unlock.techOrder': 'Step {current} of {total}',
    'unlock.unlockCondition': 'Complete 100% of previous track',
    'unlock.goToPrev': 'Study {prevTech}',
    'unlock.understand': 'Understood',
    'unlock.completePrevFirst': 'Complete all lessons of {prevTech} to unlock {currentTech}.',
    'unlock.journeyTitle': 'Sequential Learning Path',
    'unlock.journeySubtitle': 'Each language is unlocked sequentially as you complete the previous one.',
    'unlock.nextToUnlock': 'Next to Unlock',
    'unlock.currentlyStudying': 'In Progress',
    'unlock.completed': 'Completed',
  },
};

// English translations for technology metadata
const TECH_EN_MAP: Record<TechId, { name?: string; description: string; badge: string }> = {
  python: {
    name: 'Python',
    description: 'Learn one of the most versatile languages for Automation, Data Science, AI, and Backend.',
    badge: 'Essential',
  },
  javascript: {
    name: 'JavaScript',
    description: 'The foundation of modern Web development for dynamic web pages, SPAs, and interactive logic.',
    badge: 'Web Core',
  },
  typescript: {
    name: 'TypeScript',
    description: 'JavaScript with strict static typing, Generics, advanced Interfaces, and compile-time safety.',
    badge: 'Industry Std',
  },
  react: {
    name: 'React',
    description: 'Build reactive and modular user interfaces with Hooks (useState, useEffect, useMemo), Custom Hooks & state management.',
    badge: 'Top Demand',
  },
  nextjs: {
    name: 'Next.js Fullstack',
    description: 'Modern React framework featuring App Router, Server Actions, SSR, SSG, ISR, and scalable edge deployment.',
    badge: 'Fullstack',
  },
  html: {
    name: 'Semantic HTML5',
    description: 'The backbone of the web. Structure documents with semantic elements, accessibility (a11y), and SEO.',
    badge: 'Web Core',
  },
  css: {
    name: 'CSS3 & Tailwind',
    description: 'Professional styling with Flexbox, CSS Grid, Keyframe Animations, Mobile-First responsiveness, and Tailwind CSS.',
    badge: 'Design',
  },
  nodejs: {
    name: 'Node.js & Express',
    description: 'High-performance servers with asynchronous event-driven architecture and robust REST microservices.',
    badge: 'Backend',
  },
  apis: {
    name: 'REST & GraphQL APIs + Security',
    description: 'Professional API design, JWT authentication, OAuth2, Rate Limiting, OWASP Top 10, and Swagger OpenAPI docs.',
    badge: 'Architecture',
  },
  python_fastapi: {
    name: 'Python + Automation + FastAPI',
    description: 'Ultra-fast asynchronous APIs with Pydantic validation, Web Scraping with BeautifulSoup/Playwright, and background worker queues.',
    badge: 'High Speed',
  },
  java: {
    name: 'Java Enterprise & Spring',
    description: 'Solid enterprise-grade programming with Object-Oriented Design, Design Patterns, and the Spring ecosystem.',
    badge: 'Enterprise',
  },
  php: {
    name: 'Modern PHP & Laravel',
    description: 'Dynamic web applications, MVC architecture, elegant Eloquent ORM APIs, and secure database management.',
    badge: 'Web Apps',
  },
  flutter: {
    name: 'Flutter & Dart Mobile',
    description: 'Multi-platform native app development for Android and iOS with fluid UI rendering and state management.',
    badge: 'Mobile App',
  },
  postgresql: {
    name: 'PostgreSQL + Architecture & Security',
    description: 'Advanced relational databases, B-Tree & GIN indexes, EXPLAIN ANALYZE tuning, Row-Level Security (RLS), and ACID transactions.',
    badge: 'Enterprise SQL',
  },
  mysql: {
    name: 'MySQL Relational',
    description: 'Relational database modeling, complex SQL joins, foreign key constraints, triggers, and query indexing optimization.',
    badge: 'Relational',
  },
  linux_cyber: {
    name: 'Linux for Cybersecurity & Ethical Hacking',
    description: 'Bash shell scripting, file permissions & ACLs, network reconnaissance (Nmap), log inspection, and privilege escalation.',
    badge: 'Ethical Hacking',
  },
  c_sys_cyber: {
    name: 'C + Networking + OS + Cybersecurity',
    description: 'Pointers & manual memory management, TCP/UDP sockets, Buffer Overflow exploitation analysis, and system calls.',
    badge: 'Low-Level & Sec',
  },
  cloud_devops: {
    name: 'Go → Rust → Cloud & DevOps',
    description: 'Concurrency in Go, memory safety in Rust, Docker containerization, Kubernetes orchestration, and CI/CD pipelines.',
    badge: 'Cloud Native',
  },
  ai_apps: {
    name: 'AI + LLM APIs + Intelligent Apps',
    description: 'Prompt engineering, LLM integration (Gemini / OpenAI), Embeddings, Vector search, RAG, and autonomous agents.',
    badge: 'Gen AI',
  },
  git: {
    name: 'Git & GitHub Professional',
    description: 'Version control mastery, branching workflows (GitFlow, Trunk-based), Rebase vs Merge, conflict resolution, and GitHub Actions.',
    badge: 'Collaboration',
  },
  english_tech: {
    name: 'Technical English for Devs & Security',
    description: 'Core vocabulary for technical documentation, RFCs, OWASP, code reviews, CVE advisories, and international technical interviews.',
    badge: 'Global Career',
  },
  unity_2d: {
    name: 'C# → Unity → 2D Games',
    description: 'From Pong & Flappy Bird to Platformers, Top-Down Shooters, and 2D RPGs with physics, Tilemaps, and C#.',
    badge: 'Game Dev 2D',
  },
  unity_3d: {
    name: 'Unity 3D + Blender + C#',
    description: 'Create complete 3D games: Simple FPS, Third-Person, Racing, Survival, and small Open-World with lighting and physics.',
    badge: 'Game Dev 3D',
  },
  unreal_cpp: {
    name: 'Unreal Engine 5 + C++ & Blueprints',
    description: 'AAA game development with C++, Blueprints, Nanite geometry, Lumen lighting, HLSL Shaders, AI Perception, and profiling.',
    badge: 'AAA Engine',
  },
  godot_engine: {
    name: 'Godot Engine 4 & GDScript / C#',
    description: 'Modern open engine: Node & Scene architecture, GDScript 2.0, 2D/3D Jolt Physics, custom shaders, and cross-platform export.',
    badge: 'Open Source',
  },
  game_multiplayer: {
    name: 'Multiplayer & Game Networking',
    description: 'TCP/IP vs UDP, Authoritative Servers, Replication, Client-Side Prediction, Lag Compensation, Matchmaking & Anti-Cheat.',
    badge: 'Multiplayer',
  },
  game_mobile_dev: {
    name: 'Mobile Game Development',
    description: 'Android SDK, Gradle, AAB bundles, Google Play Console, Touch controls, Safe Area, Battery optimization, and IAP/Ads.',
    badge: 'Mobile Games',
  },
  game_pc_publishing: {
    name: 'Windows, Steam & Game Publishing',
    description: 'x64 builds, Gamepads / XInput, Save Systems, Steamworks SDK (Achievements, Steam Cloud), Inno Setup, and Steam release.',
    badge: 'Publishing',
  },
  game_fundamentals: {
    name: 'Fundamentals: Math & Physics for Games',
    description: 'Linear Algebra (Vectors, Dot/Cross Product), A* Pathfinding, Spatial Partitioning (Quadtrees/Octrees), and 2D physics engines.',
    badge: 'Math & CS',
  },
  game_graphics_ai: {
    name: 'Specialization: Game AI, Shaders & Performance',
    description: 'GPU Graphics Pipeline, HLSL/GLSL Shaders, Advanced AI with GOAP & Utility Curves, Frame Pacing, and Draw Call optimization.',
    badge: 'Advanced',
  },
  blender_3d: {
    name: 'Blender 3D for Game Dev',
    description: 'Low-Poly 3D Modeling, UV Unwrapping, PBR Texturing, Skeletal Rigging, Game Animation Cycles, and FBX/glTF export pipelines.',
    badge: '3D Modeling',
  },
};

const I18nContext = createContext<I18nContextType | null>(null);

const STORAGE_LANG_KEY = 'codemaster_lang_pref';

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<AppLanguage>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LANG_KEY);
      if (saved === 'en' || saved === 'pt') return saved;
      // Browser language check
      if (typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('en')) {
        return 'en';
      }
    } catch {
      // fallback
    }
    return 'pt';
  });

  const setLanguage = (lang: AppLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_LANG_KEY, lang);
      const prog = storageService.getUserProgress();
      if (prog.language !== lang) {
        prog.language = lang;
        storageService.saveUserProgress(prog);
      }
    } catch {
      // ignore
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'pt' ? 'en' : 'pt');
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    if (!key) return '';

    const langDict = translations[language] || {};
    const fallbackDict = translations['pt'] || {};

    let str = langDict[key] || fallbackDict[key];

    // Case-insensitive fallback
    if (!str) {
      const lowerKey = key.toLowerCase();
      const matchInLang = Object.keys(langDict).find(k => k.toLowerCase() === lowerKey);
      if (matchInLang) {
        str = langDict[matchInLang];
      } else {
        const matchInFallback = Object.keys(fallbackDict).find(k => k.toLowerCase() === lowerKey);
        if (matchInFallback) {
          str = fallbackDict[matchInFallback];
        }
      }
    }

    // Clean fallback if key is completely unknown
    if (!str) {
      if (key.includes('.')) {
        const parts = key.split('.');
        const lastPart = parts[parts.length - 1];
        // Convert camelCase to Space Case
        str = lastPart.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()).trim();
      } else {
        str = key;
      }
    }

    if (params) {
      Object.entries(params).forEach(([paramKey, paramVal]) => {
        str = str.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramVal));
      });
    }
    return str;
  };

  const getTechName = (tech: Technology): string => {
    if (language === 'en' && TECH_EN_MAP[tech.id]?.name) {
      return TECH_EN_MAP[tech.id].name!;
    }
    return tech.name;
  };

  const getTechDescription = (tech: Technology): string => {
    if (language === 'en' && TECH_EN_MAP[tech.id]?.description) {
      return TECH_EN_MAP[tech.id].description;
    }
    return tech.description;
  };

  const getTechBadge = (tech: Technology): string => {
    if (language === 'en' && TECH_EN_MAP[tech.id]?.badge) {
      return TECH_EN_MAP[tech.id].badge;
    }
    return tech.badge;
  };

  const getTechCategory = (cat: TechCategory | string): string => {
    return t(`cat.${cat}`);
  };

  const getLevelName = (levelId: LevelId): string => {
    return t(`level.${levelId}`);
  };

  const getRankTitle = (xp: number) => {
    if (language === 'en') {
      if (xp >= 1000) return { title: 'Coding Master 👑', color: 'text-amber-400' };
      if (xp >= 500) return { title: 'Mid-Level Developer 🚀', color: 'text-orange-400' };
      if (xp >= 200) return { title: 'Junior Developer 💻', color: 'text-blue-400' };
      return { title: 'Curious Beginner 🌱', color: 'text-emerald-400' };
    }
    if (xp >= 1000) return { title: 'Mestre da Programação 👑', color: 'text-amber-400' };
    if (xp >= 500) return { title: 'Desenvolvedor Pleno 🚀', color: 'text-orange-400' };
    if (xp >= 200) return { title: 'Desenvolvedor Júnior 💻', color: 'text-blue-400' };
    return { title: 'Iniciante Curioso 🌱', color: 'text-emerald-400' };
  };

  const formatDate = (date: Date | string, options?: Intl.DateTimeFormatOptions): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const locale = language === 'en' ? 'en-US' : 'pt-BR';
    return d.toLocaleDateString(locale, options);
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
      t,
      getTechName,
      getTechDescription,
      getTechBadge,
      getTechCategory,
      getLevelName,
      getRankTitle,
      formatDate,
    }),
    [language]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within a LanguageProvider');
  }
  return context;
};
