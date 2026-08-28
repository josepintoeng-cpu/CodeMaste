import React from 'react';
import { motion } from 'motion/react';
import {
  Code,
  Terminal,
  ShieldCheck,
  Zap,
  BookOpen,
  Play,
  CheckCircle2,
  Award,
  Sparkles,
  ArrowRight,
  UserCheck,
  Globe,
  Sun,
  Moon,
  Mail,
  Cpu,
  Layers,
  Flame,
  Cloud,
  ExternalLink,
  Laptop
} from 'lucide-react';
import { useI18n } from '../i18n';
import { TECHNOLOGIES } from '../content/technologies';
import { fadeInUp, staggerContainer, cardVariant, floatingVariant } from '../utils/animations';
import { FloatingScrollControls } from '../components/FloatingScrollControls';

interface WelcomeScreenProps {
  onEnterApp: () => void;
  onToggleTheme: () => void;
  isDark: boolean;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onEnterApp,
  onToggleTheme,
  isDark,
}) => {
  const { t, language, toggleLanguage } = useI18n();

  const pillars = [
    {
      num: '01',
      icon: BookOpen,
      title: t('welcome.pillar1Title'),
      desc: t('welcome.pillar1Desc'),
      color: 'text-amber-400',
      border: 'border-amber-500/30',
      bg: 'bg-amber-500/10',
    },
    {
      num: '02',
      icon: Code,
      title: t('welcome.pillar2Title'),
      desc: t('welcome.pillar2Desc'),
      color: 'text-blue-400',
      border: 'border-blue-500/30',
      bg: 'bg-blue-500/10',
    },
    {
      num: '03',
      icon: Play,
      title: t('welcome.pillar3Title'),
      desc: t('welcome.pillar3Desc'),
      color: 'text-emerald-400',
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-500/10',
    },
    {
      num: '04',
      icon: CheckCircle2,
      title: t('welcome.pillar4Title'),
      desc: t('welcome.pillar4Desc'),
      color: 'text-orange-400',
      border: 'border-orange-500/30',
      bg: 'bg-orange-500/10',
    },
  ];

  const features = [
    {
      icon: Layers,
      title: t('welcome.feat1Title'),
      desc: t('welcome.feat1Desc'),
    },
    {
      icon: Cloud,
      title: t('welcome.feat2Title'),
      desc: t('welcome.feat2Desc'),
    },
    {
      icon: Flame,
      title: t('welcome.feat3Title'),
      desc: t('welcome.feat3Desc'),
    },
    {
      icon: Laptop,
      title: t('welcome.feat4Title'),
      desc: t('welcome.feat4Desc'),
    },
  ];

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-250 selection:bg-orange-500 selection:text-black overflow-x-hidden">
      {/* Floating Scroll Indicator and Back-to-Top Control */}
      <FloatingScrollControls />

      {/* Floating Background Glow Orbs */}
      <div className="absolute top-20 left-10 w-80 sm:w-[32rem] h-80 sm:h-[32rem] bg-orange-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-float-slow" />
      <div className="absolute top-1/3 right-10 w-72 sm:w-[28rem] h-72 sm:h-[28rem] bg-amber-500/8 rounded-full blur-3xl pointer-events-none -z-10 animate-float-dynamic" />

      {/* Top Header Bar for Landing */}
      <header className="sticky top-0 z-50 bg-[var(--header-bg)] backdrop-blur-xl border-b border-[var(--border-subtle)] px-4 sm:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 text-black flex items-center justify-center font-black shadow-md shadow-orange-500/20">
              <ShieldCheck className="w-5 h-5 text-black stroke-[2.5]" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-black text-orange-500 tracking-wider leading-none">
                {t('app.name')}
              </div>
              <div className="text-xs sm:text-sm font-bold text-[var(--text-primary)] leading-tight">
                DevMentor Academy
              </div>
            </div>
          </div>

          {/* Quick Actions: Language, Theme & Direct CTA */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full bg-[var(--bg-surface)] hover:bg-[var(--border-strong)] border border-[var(--border-subtle)] text-xs font-black text-[var(--text-primary)] transition-all touch-btn shadow-sm"
              title={language === 'pt' ? 'Switch to English' : 'Mudar para Português'}
            >
              <Globe className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <span className="text-[10px] font-black uppercase">{language === 'pt' ? 'PT' : 'EN'}</span>
            </button>

            <button
              onClick={onToggleTheme}
              className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[var(--bg-surface)] hover:bg-[var(--border-strong)] border border-[var(--border-subtle)] text-xs font-medium text-[var(--text-primary)] transition-all touch-btn shadow-sm"
              title={isDark ? t('header.themeDarkActive') : t('header.themeLightActive')}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-orange-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            <motion.button
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.03 }}
              onClick={onEnterApp}
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-extrabold text-xs uppercase tracking-wider shadow-md shadow-orange-500/20 transition-all touch-btn"
            >
              <span>{t('welcome.ctaEnter')}</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </motion.button>
          </div>
        </div>
      </header>

      {/* Main Presentation Container */}
      <main className="max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-8 pb-24 space-y-16 sm:space-y-24">
        {/* HERO SECTION */}
        <motion.section
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="text-center space-y-6 pt-4 sm:pt-12"
        >
          {/* Institutional Badge */}
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-[11px] sm:text-xs font-extrabold tracking-wider uppercase shadow-sm">
            <Sparkles className="w-4 h-4 text-orange-400 shrink-0" />
            <span>{t('welcome.badge')}</span>
          </motion.div>

          {/* Main Title & Tagline with Fluid Typography */}
          <motion.div variants={fadeInUp} className="space-y-3">
            <h1 className="fluid-title-hero font-extrabold tracking-tight text-[var(--text-primary)]">
              Code<span className="text-orange-500">Master</span>
            </h1>
            <p className="fluid-title-section font-bold text-[var(--text-secondary)] max-w-3xl mx-auto leading-snug">
              {t('welcome.tagline')}
            </p>
          </motion.div>

          {/* Subtitle Description */}
          <motion.p
            variants={fadeInUp}
            className="fluid-text-sub text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed"
          >
            {t('welcome.subtitle')}
          </motion.p>

          {/* Hero CTAs */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"
          >
            <motion.button
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.03, y: -2 }}
              onClick={onEnterApp}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-orange-500 via-orange-400 to-amber-500 hover:from-orange-400 hover:to-amber-400 active:from-orange-600 active:to-amber-600 text-black font-extrabold text-sm uppercase tracking-wider rounded-2xl shadow-xl shadow-orange-500/25 flex items-center justify-center gap-2.5 transition-all touch-btn"
            >
              <Zap className="w-5 h-5 fill-black text-black" />
              <span>{t('welcome.ctaStart')}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.02, y: -1 }}
              onClick={() => scrollToSection('metodologia')}
              className="w-full sm:w-auto px-6 py-4 bg-[var(--bg-surface)] hover:bg-[var(--border-strong)] text-[var(--text-primary)] font-bold text-xs uppercase tracking-wider rounded-2xl border border-[var(--border-subtle)] flex items-center justify-center gap-2 transition-all touch-btn"
            >
              <BookOpen className="w-4 h-4 text-orange-400" />
              <span>{t('welcome.ctaExplore')}</span>
            </motion.button>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            variants={fadeInUp}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-6 max-w-4xl mx-auto"
          >
            <motion.div whileHover={{ y: -3 }} className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-sm">
              <div className="text-2xl sm:text-3xl font-black text-orange-500">{TECHNOLOGIES.length}</div>
              <div className="text-[11px] sm:text-xs font-bold text-[var(--text-secondary)]">{t('welcome.statsTechs')}</div>
            </motion.div>
            <motion.div whileHover={{ y: -3 }} className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-sm">
              <div className="text-2xl sm:text-3xl font-black text-amber-500">{TECHNOLOGIES.length * 20}</div>
              <div className="text-[11px] sm:text-xs font-bold text-[var(--text-secondary)]">{t('welcome.statsLessons')}</div>
            </motion.div>
            <motion.div whileHover={{ y: -3 }} className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-sm">
              <div className="text-2xl sm:text-3xl font-black text-emerald-500">100%</div>
              <div className="text-[11px] sm:text-xs font-bold text-[var(--text-secondary)]">{t('welcome.statsOffline')}</div>
            </motion.div>
            <motion.div whileHover={{ y: -3 }} className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-sm">
              <div className="text-2xl sm:text-3xl font-black text-blue-500">PRO</div>
              <div className="text-[11px] sm:text-xs font-bold text-[var(--text-secondary)]">{t('welcome.statsCert')}</div>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* SECTION 1: PARA QUE SERVE & O QUE É O APLICATIVO */}
        <section id="sobre" className="space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-surface)] text-orange-500 text-[10px] font-black uppercase tracking-widest border border-[var(--border-subtle)]">
              <Terminal className="w-3.5 h-3.5 text-orange-500" />
              <span>{t('welcome.aboutTag')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
              {t('welcome.aboutTitle')}
            </h2>
            <p className="text-sm text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
              {t('welcome.aboutDesc')}
            </p>
          </div>
        </section>

        {/* SECTION 2: METODOLOGIA EM 4 ETAPAS */}
        <section id="metodologia" className="space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-surface)] text-orange-500 text-[10px] font-black uppercase tracking-widest border border-[var(--border-subtle)]">
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              <span>{t('welcome.pillarsTag')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
              {t('welcome.pillarsTitle')}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pillars.map((p, idx) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={idx}
                  variants={cardVariant}
                  className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] transition-all shadow-sm space-y-3 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-xl ${p.bg} ${p.border} border flex items-center justify-center font-bold`}>
                      <Icon className={`w-5 h-5 ${p.color}`} />
                    </div>
                    <span className="text-xs font-mono font-black opacity-40">{p.num}</span>
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[var(--text-primary)] mb-1">
                      {p.title}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* SECTION 3: QUEM FOI O DESENVOLVEDOR (AUTORIA & ENGENHARIA) */}
        <section id="desenvolvedor" className="space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-surface)] text-orange-500 text-[10px] font-black uppercase tracking-widest border border-[var(--border-subtle)]">
              <UserCheck className="w-3.5 h-3.5 text-orange-500" />
              <span>{t('welcome.developerTag')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
              {t('welcome.developerTitle')}
            </h2>
          </div>

          <motion.div
            variants={fadeInUp}
            className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[var(--bg-card)] via-[var(--bg-card)] to-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xl relative overflow-hidden space-y-6"
          >
            {/* Top Developer Badge Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 border-b border-[var(--border-subtle)] pb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-black flex items-center justify-center font-black text-2xl shadow-lg shadow-orange-500/20 shrink-0">
                <ShieldCheck className="w-10 h-10 text-black stroke-[2.2]" />
              </div>
              <div className="space-y-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl sm:text-2xl font-black text-[var(--text-primary)]">
                    Eng. José Alfredo Pinto
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-[10px] font-black uppercase tracking-wider border border-orange-500/30">
                    Autor & Arquiteto
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-orange-500">
                  {t('welcome.devRole')} • <span className="text-[var(--text-secondary)]">{t('welcome.devCompany')}</span>
                </p>
                <p className="text-[11px] text-[var(--text-muted)] font-mono">
                  josepinto.eng@gmail.com
                </p>
              </div>
            </div>

            {/* Bio & Philosophy */}
            <div className="space-y-4 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              <p>
                {t('welcome.devBio')}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center gap-3">
                  <Mail className="w-4 h-4 text-orange-400 shrink-0" />
                  <div className="min-w-0 text-[11px]">
                    <span className="text-[var(--text-muted)] block text-[10px] uppercase font-bold">{t('welcome.devContact')}</span>
                    <strong className="text-[var(--text-primary)] truncate block">josepinto.eng@gmail.com</strong>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center gap-3">
                  <Award className="w-4 h-4 text-amber-400 shrink-0" />
                  <div className="min-w-0 text-[11px]">
                    <span className="text-[var(--text-muted)] block text-[10px] uppercase font-bold">Ecossistema</span>
                    <strong className="text-[var(--text-primary)]">DevMentor Academy</strong>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* SECTION 4: FINALIDADE DO PROJETO & MISSÃO */}
        <section id="finalidade" className="space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-surface)] text-orange-500 text-[10px] font-black uppercase tracking-widest border border-[var(--border-subtle)]">
              <Zap className="w-3.5 h-3.5 text-orange-500" />
              <span>{t('welcome.purposeTag')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
              {t('welcome.purposeTitle')}
            </h2>
            <p className="text-sm text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
              {t('welcome.purposeDesc')}
            </p>
          </div>

          {/* Grid of Key Features & Advantages */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((f, idx) => {
              const Icon = f.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-sm space-y-2"
                >
                  <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-extrabold text-[var(--text-primary)]">
                    {f.title}
                  </h4>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 5: 31 TECNOLOGIAS DA PLATAFORMA */}
        <section id="tecnologias" className="space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-surface)] text-orange-500 text-[10px] font-black uppercase tracking-widest border border-[var(--border-subtle)]">
              <Cpu className="w-3.5 h-3.5 text-orange-500" />
              <span>{TECHNOLOGIES.length} TRILHAS DISPONÍVEIS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
              Grade Tecnológica Abrangente
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-2xl mx-auto">
              Cada tecnologia conta com trilhas estruturadas desde o nível iniciante até avançado e projetos de engenharia.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {TECHNOLOGIES.map(tech => (
              <span
                key={tech.id}
                className="px-3 py-1.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-orange-500/40 text-xs font-bold text-[var(--text-primary)] shadow-sm transition-all flex items-center gap-1.5"
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: tech.color }} />
                <span>{tech.name}</span>
                <span className="text-[10px] opacity-60 font-mono">({tech.category})</span>
              </span>
            ))}
          </div>
        </section>

        {/* BOTTOM CALL TO ACTION BANNER */}
        <motion.section
          variants={fadeInUp}
          className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 text-black text-center space-y-6 shadow-2xl relative overflow-hidden"
        >
          <div className="space-y-2 z-10 relative">
            <h3 className="text-2xl sm:text-4xl font-black text-black tracking-tight">
              Pronto para Começar a Codificar?
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-black/80 max-w-lg mx-auto">
              Acesse a plataforma agora mesmo, escolha sua primeira tecnologia e inicie sua sequência diária de estudos.
            </p>
          </div>

          <div className="z-10 relative flex justify-center">
            <motion.button
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.03 }}
              onClick={onEnterApp}
              className="px-8 py-4 bg-black text-white hover:bg-neutral-900 active:bg-neutral-950 font-extrabold text-sm uppercase tracking-wider rounded-2xl shadow-xl flex items-center gap-2.5 transition-all touch-btn"
            >
              <Zap className="w-4 h-4 fill-orange-400 text-orange-400" />
              <span>{t('welcome.ctaEnter')}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </motion.button>
          </div>
        </motion.section>

        {/* FOOTER DA APRESENTAÇÃO */}
        <footer className="pt-4 text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-muted)] text-xs">
            <ShieldCheck className="w-4 h-4 text-orange-500 shrink-0" />
            <span>
              {t('footer.devBy')}{' '}
              <strong className="text-[var(--text-primary)] font-bold">{t('footer.author')}</strong>,{' '}
              {t('footer.ceo')}{' '}
              <span className="text-orange-400 font-bold">{t('footer.company')}</span>
            </span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] font-mono">
            CodeMaster v2.1 • Todos os direitos reservados © {new Date().getFullYear()}
          </p>
        </footer>
      </main>
    </div>
  );
};
