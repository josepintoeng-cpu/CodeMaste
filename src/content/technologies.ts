import { Technology } from '../types';

export const TECHNOLOGIES: Technology[] = [
  {
    id: 'python',
    name: 'Python',
    description: 'Aprenda uma das linguagens mais populares para IA, Automação, Ciência de Dados e Backend.',
    iconName: 'Terminal',
    color: '#22c55e', // verde
    bgGradient: 'from-emerald-500/20 to-green-600/10 border-emerald-500/30',
    badge: 'Em Alta',
    category: 'Linguagens',
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    description: 'A linguagem da Web. Crie sites interativos, sistemas web e aplicativos dinâmicos.',
    iconName: 'Code',
    color: '#eab308', // amarelo
    bgGradient: 'from-yellow-500/20 to-amber-600/10 border-yellow-500/30',
    badge: 'Essencial',
    category: 'Frontend',
  },
  {
    id: 'html',
    name: 'HTML',
    description: 'A fundação de toda a internet. Estruture páginas web com tags semânticas e acessíveis.',
    iconName: 'Layout',
    color: '#f97316', // vermelho/laranja
    bgGradient: 'from-orange-500/20 to-red-600/10 border-orange-500/30',
    badge: 'Base Web',
    category: 'Frontend',
  },
  {
    id: 'css',
    name: 'CSS',
    description: 'Estilize a Web com Flexbox, Grid, Animações e Design Responsivo moderno.',
    iconName: 'Palette',
    color: '#3b82f6', // azul
    bgGradient: 'from-blue-500/20 to-cyan-600/10 border-blue-500/30',
    badge: 'Visual',
    category: 'Frontend',
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    description: 'Construa servidores ultrarrápidos, APIs REST e microsserviços usando JavaScript no backend.',
    iconName: 'Server',
    color: '#15803d', // verde escuro
    bgGradient: 'from-green-700/20 to-emerald-800/10 border-green-700/30',
    badge: 'Backend',
    category: 'Backend',
  },
  {
    id: 'java',
    name: 'Java',
    description: 'Linguagem robusta para Grandes Empresas, Orientação a Objetos e ecossistema Android.',
    iconName: 'Coffee',
    color: '#f97316', // laranja
    bgGradient: 'from-amber-600/20 to-orange-700/10 border-orange-600/30',
    badge: 'Corporativo',
    category: 'Linguagens',
  },
  {
    id: 'flutter',
    name: 'Flutter / Dart',
    description: 'Desenvolva aplicativos mobile nativos para Android e iOS com uma única base de código.',
    iconName: 'Smartphone',
    color: '#38bdf8', // azul claro
    bgGradient: 'from-sky-400/20 to-blue-500/10 border-sky-400/30',
    badge: 'Mobile App',
    category: 'Mobile',
  },
  {
    id: 'php',
    name: 'PHP',
    description: 'A linguagem por trás do WordPress e de milhões de sistemas web dinâmicos e modernos.',
    iconName: 'Globe',
    color: '#a855f7', // roxo
    bgGradient: 'from-purple-500/20 to-indigo-600/10 border-purple-500/30',
    badge: 'Sistemas Web',
    category: 'Backend',
  },
  {
    id: 'mysql',
    name: 'MySQL',
    description: 'Domine bancos de dados relacionais, queries SQL, filtros, junções de tabelas e índices.',
    iconName: 'Database',
    color: '#1e3a8a', // azul marinho
    bgGradient: 'from-blue-900/30 to-indigo-900/20 border-blue-700/40',
    badge: 'Dados',
    category: 'Banco de Dados',
  },
];
