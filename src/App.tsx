import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import {
  Play, ArrowRight, Check, Star, Zap, Clock, Users,
  ChevronDown, Mail, Globe, Sparkles, Eye, TrendingUp
} from 'lucide-react';

// Animated counter component
function AnimatedCounter({ target, suffix = '', duration = 2000 }: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// Floating orb component
function FloatingOrb({ className, delay = 0 }: { className: string; delay?: number }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl opacity-20 pointer-events-none ${className}`}
      animate={{
        y: [0, -30, 0],
        x: [0, 15, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 8,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

// Grid background component
function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0" style={{
        backgroundImage: `
          linear-gradient(rgba(163,230,53,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(163,230,53,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)',
        WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)',
      }} />
    </div>
  );
}

// Section reveal wrapper
function RevealSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

// Navigation
function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-[72px]">
        <motion.a
          href="#"
          className="flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#A3E635] to-[#65A30D] flex items-center justify-center">
            <Play className="w-4 h-4 text-black fill-black" />
          </div>
          <span className="font-['Space_Grotesk'] font-bold text-xl text-white">FocalCut</span>
        </motion.a>

        <div className="hidden md:flex items-center gap-8">
          {['Work', 'Process', 'Pricing', 'FAQ'].map((item, i) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm text-gray-400 hover:text-white transition-colors font-medium"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i + 0.3 }}
              whileHover={{ y: -2 }}
            >
              {item}
            </motion.a>
          ))}
          <motion.a
            href="#pricing"
            className="relative px-5 py-2.5 rounded-full bg-[#A3E635] text-black font-semibold text-sm overflow-hidden group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">Get Started</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-[#BEF264] to-[#A3E635]"
              initial={{ x: '-100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.a>
        </div>

        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? '×' : '☰'}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="md:hidden bg-[#121212]/95 backdrop-blur-xl border-b border-white/5"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {['Work', 'Process', 'Pricing', 'FAQ'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-300 hover:text-[#A3E635] py-2 font-medium"
                  onClick={() => setMobileOpen(false)}
                >
                  {item}
                </a>
              ))}
              <a href="#pricing" className="px-5 py-3 rounded-full bg-[#A3E635] text-black font-semibold text-center">
                Get Started
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

// Hero Section
function HeroSection() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background effects */}
      <GridBackground />
      <FloatingOrb className="w-[500px] h-[500px] bg-[#A3E635] top-[-10%] left-[-10%]" delay={0} />
      <FloatingOrb className="w-[400px] h-[400px] bg-purple-500 bottom-[-10%] right-[-10%]" delay={2} />
      <FloatingOrb className="w-[300px] h-[300px] bg-cyan-500 top-[40%] right-[20%]" delay={4} />

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(163,230,53,0.08),transparent_55%)]" />

      <motion.div className="relative z-10 max-w-5xl mx-auto px-6 text-center" style={{ y, opacity }}>
        {/* Eyebrow */}
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#A3E635]/10 border border-[#A3E635]/20 mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_#22C55E]" />
          <span className="text-[#A3E635] text-xs font-semibold tracking-wider uppercase">Accepting new clients for Q4</span>
        </motion.div>

        {/* Main headline with animated gradient */}
        <motion.h1
          className="font-['Space_Grotesk'] text-[clamp(40px,6vw,72px)] font-bold leading-[1.05] tracking-tight mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <span className="text-white">15 Professional Videos in 24 Hours.</span>
          <br />
          <motion.span
            className="bg-gradient-to-r from-[#A3E635] via-[#65A30D] to-[#A3E635] bg-clip-text text-transparent bg-[length:200%_100%]"
            animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
          >
            Zero Editing Required.
          </motion.span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Send us your raw footage via Drive or Dropbox. Get ready-to-post, retention-engineered Reels delivered in 24–48 hours. No subscriptions, no hassle.
        </motion.p>

        {/* Stats */}
        <motion.div
          className="flex flex-wrap justify-center gap-8 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {[
            { num: 24, suffix: 'h', label: 'Turnaround' },
            { num: 15, suffix: '', label: 'Videos / Package' },
            { num: 2, suffix: '', label: 'Revision Rounds' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="font-['Space_Grotesk'] text-4xl font-bold text-[#A3E635]">
                <AnimatedCounter target={stat.num} suffix={stat.suffix} />
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <motion.a
            href="#pricing"
            className="relative px-8 py-4 rounded-xl bg-[#A3E635] text-black font-bold text-base overflow-hidden group"
            whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(163,230,53,0.4)' }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10 flex items-center gap-2">
              Get Your First Video in 24h <ArrowRight className="w-4 h-4" />
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-[#BEF264] to-[#A3E635]"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              style={{ opacity: 0.5 }}
            />
          </motion.a>
          <motion.a
            href="#work"
            className="px-8 py-4 rounded-xl border border-white/10 text-white font-semibold text-base hover:border-white/30 hover:bg-white/5 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            See Recent Work
          </motion.a>
        </motion.div>

        {/* Guarantee badge */}
        <motion.p
          className="text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          🛡️ <span className="text-gray-300 font-medium">100% Brief-Match Guarantee:</span> If your first draft misses the mark, we re-edit it for free.
        </motion.p>

        {/* Bottom metrics */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-10 border-t border-white/5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {[
            { num: '15', label: 'Videos / flagship package' },
            { num: '24–48h', label: 'First-draft turnaround' },
            { num: '2', label: 'Revision rounds (Growth)' },
            { num: '1-on-1', label: 'Human communication' },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="font-['Space_Grotesk'] text-xl font-bold text-white">{item.num}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">{item.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown className="w-6 h-6 text-gray-500" />
      </motion.div>
    </section>
  );
}

// Trust Strip
function TrustStrip() {
  return (
    <div className="relative py-7 bg-[#121212]/80 border-y border-white/5 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-wrap justify-center items-center gap-3 text-sm text-gray-400">
          <span><strong className="text-white">Built for</strong> TikTok • Instagram Reels • YouTube Shorts</span>
          <span className="text-[#A3E635]">•</span>
          <span>No long-term contracts</span>
          <span className="text-[#A3E635]">•</span>
          <span>Clear revision policy</span>
          <span className="text-[#A3E635]">•</span>
          <span>Secure Stripe checkout</span>
          <span className="text-[#A3E635]">•</span>
          <span>Worldwide remote delivery</span>
        </div>
      </div>
    </div>
  );
}

// Portfolio Section
function PortfolioSection() {
  const works = [
    { cat: 'Business Coach', title: 'Talking-head hook restructure', badge: '1.2M Views', color: 'from-purple-500/20 to-blue-500/20' },
    { cat: 'Fitness Brand', title: 'Seamless loop transition edit', badge: '3x Retention', color: 'from-[#A3E635]/20 to-cyan-500/20' },
    { cat: 'E-commerce', title: 'Product showcase reel', badge: '840K Views', color: 'from-orange-500/20 to-pink-500/20' },
  ];

  return (
    <section id="work" className="relative py-24 overflow-hidden">
      <FloatingOrb className="w-[300px] h-[300px] bg-purple-600 top-[20%] left-[-5%]" delay={1} />

      <div className="max-w-7xl mx-auto px-6">
        <RevealSection className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-[#A3E635] text-xs font-semibold tracking-[0.15em] uppercase mb-4">Selected Work</div>
          <h2 className="font-['Space_Grotesk'] text-[clamp(30px,4vw,44px)] font-bold text-white mb-4">Recent edits, before → after</h2>
          <p className="text-gray-400 text-lg">Real projects from our editing pipeline. Click play to see the retention hooks in action.</p>
        </RevealSection>

        <div className="grid md:grid-cols-3 gap-6">
          {works.map((work, i) => (
            <RevealSection key={i} delay={i * 0.15}>
              <motion.div
                className="group relative aspect-[9/16] rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br ${work.color}"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                {/* Placeholder gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${work.color}`} />
                <div className="absolute inset-0 bg-[#0A0A0A]/60" />

                {/* Animated grid overlay */}
                <div className="absolute inset-0 opacity-20" style={{
                  backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }} />

                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center"
                    whileHover={{ scale: 1.2, backgroundColor: 'rgba(163,230,53,0.2)' }}
                  >
                    <Play className="w-6 h-6 text-white fill-white" />
                  </motion.div>
                </div>

                {/* Badge */}
                <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-[#A3E635]/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_6px_#22C55E]" />
                  <span className="text-[11px] font-bold text-[#A3E635]">{work.badge}</span>
                </div>

                {/* Info overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/90 to-transparent">
                  <div className="text-[10px] font-bold tracking-wider text-[#A3E635] uppercase mb-1">{work.cat}</div>
                  <div className="font-['Space_Grotesk'] text-sm font-semibold text-white">{work.title}</div>
                </div>

                {/* Hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-[#A3E635]/10 to-transparent" />
              </motion.div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// Process Section
function ProcessSection() {
  const steps = [
    { num: '01', title: 'Send Footage', desc: 'Upload your raw clips to Drive or Dropbox and paste the link in your portal. No file size limits.', icon: <Zap className="w-5 h-5" /> },
    { num: '02', title: 'We Edit', desc: 'We apply our retention system (hooks, captions, sound) and deliver a draft in 24-48 hours.', icon: <Sparkles className="w-5 h-5" /> },
    { num: '03', title: 'Approve & Post', desc: 'Review the video in your portal. Request revisions if needed, or approve and download.', icon: <TrendingUp className="w-5 h-5" /> },
  ];

  return (
    <section id="process" className="relative py-24 bg-[#121212]/50 border-y border-white/5">
      <FloatingOrb className="w-[400px] h-[400px] bg-cyan-600 bottom-[-10%] right-[-5%]" delay={3} />

      <div className="max-w-7xl mx-auto px-6">
        <RevealSection className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-[#A3E635] text-xs font-semibold tracking-[0.15em] uppercase mb-4">How It Works</div>
          <h2 className="font-['Space_Grotesk'] text-[clamp(30px,4vw,44px)] font-bold text-white mb-4">From Raw Footage to Posted in 3 Steps</h2>
        </RevealSection>

        <div className="grid md:grid-cols-3 gap-6 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-12 left-[16.66%] right-[16.66%] h-px bg-gradient-to-r from-transparent via-[#A3E635]/30 to-transparent" />

          {steps.map((step, i) => (
            <RevealSection key={i} delay={i * 0.2}>
              <motion.div
                className="relative p-7 rounded-2xl bg-[#0A0A0A] border border-white/5 hover:border-[#A3E635]/20 transition-all duration-300 group"
                whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(163,230,53,0.05)' }}
              >
                {/* Step number with glow */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#A3E635]/10 border border-[#A3E635]/20 flex items-center justify-center text-[#A3E635] group-hover:bg-[#A3E635]/20 transition-colors">
                    {step.icon}
                  </div>
                  <span className="font-['Space_Grotesk'] text-sm font-bold text-[#A3E635]">{step.num}</span>
                </div>
                <h4 className="font-['Space_Grotesk'] text-lg font-semibold text-white mb-2">{step.title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>

                {/* Hover gradient */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#A3E635]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </motion.div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// Testimonials Section
function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Sarah K.',
      role: 'Fitness Creator · 240K followers',
      result: '📈 1.2M Views on TikTok',
      quote: "We took a raw, 20-minute podcast and FocalCut turned it into 5 Reels. One of them hit 1.2 million views within a week. The hook restructuring is real.",
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    },
    {
      name: 'Marcus R.',
      role: 'Business Coach · 85K followers',
      result: '⏱️ 10 Hours Saved Weekly',
      quote: "I used to spend every Sunday trying to edit my own videos. FocalCut's portal makes it so easy — I just dump my Drive link and get them back on Tuesday. Absolute game changer.",
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    },
    {
      name: 'James T.',
      role: 'Real Estate Agent · 42K followers',
      result: '🎯 3x Average View Duration',
      quote: "My average view duration went from 4 seconds to 12 seconds after switching to FocalCut. They don't just cut clips — they engineer them to keep people watching.",
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    },
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      <FloatingOrb className="w-[350px] h-[350px] bg-[#A3E635] top-[10%] right-[-10%]" delay={2} />

      <div className="max-w-7xl mx-auto px-6">
        <RevealSection className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-[#A3E635] text-xs font-semibold tracking-[0.15em] uppercase mb-4">Client Results</div>
          <h2 className="font-['Space_Grotesk'] text-[clamp(30px,4vw,44px)] font-bold text-white mb-4">Edits that actually perform</h2>
          <p className="text-gray-400 text-lg">Real results from creators who trust FocalCut with their content.</p>
        </RevealSection>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <RevealSection key={i} delay={i * 0.15}>
              <motion.div
                className="relative p-7 rounded-2xl bg-[#0A0A0A] border border-white/5 hover:border-white/10 transition-all duration-300 group h-full flex flex-col"
                whileHover={{ y: -5 }}
              >
                {/* Glassmorphism header */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#A3E635]/50">
                    <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-sm">{t.name}</h4>
                    <p className="text-gray-500 text-xs">{t.role}</p>
                  </div>
                </div>

                {/* Result badge */}
                <div className="inline-flex self-start px-3 py-1.5 rounded-full bg-[#A3E635]/10 text-[#A3E635] text-xs font-bold mb-4">
                  {t.result}
                </div>

                {/* Quote */}
                <blockquote className="text-gray-300 text-sm leading-relaxed italic flex-1">
                  "{t.quote}"
                </blockquote>

                {/* Stars */}
                <div className="flex gap-1 mt-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-[#A3E635] fill-[#A3E635]" />
                  ))}
                </div>

                {/* Hover glow */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#A3E635]/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </motion.div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// Pricing Section
function PricingSection() {
  const plans = [
    {
      name: 'The Starter',
      best: 'Best for: Getting Noticed',
      price: 149,
      perVideo: '$37.25',
      features: ['4 short-form videos (15–30s each)', 'Essential captions & hook optimization', '48-hour first-draft turnaround'],
      featured: false,
      link: '#',
    },
    {
      name: 'Consistency Builder',
      best: 'Best for: Weekly posters',
      price: 299,
      perVideo: '$29.90',
      features: ['10 short-form videos (15–30s each)', 'Advanced hook, pacing & retention editing', '48-hour turnaround + 1 revision/video'],
      featured: false,
      link: '#',
    },
    {
      name: 'The Growth Engine',
      best: 'Most Popular · Best Value',
      price: 399,
      perVideo: '$26.60',
      features: ['15 short-form videos (15–30s each)', 'Custom brand styling & sound design', '24-hour turnaround + 2 revisions/video'],
      featured: true,
      link: '#',
    },
  ];

  return (
    <section id="pricing" className="relative py-24 bg-[#121212]/50 border-y border-white/5 overflow-hidden">
      <FloatingOrb className="w-[500px] h-[500px] bg-[#A3E635] top-[-20%] left-[50%] -translate-x-1/2" delay={0} />

      <div className="max-w-7xl mx-auto px-6">
        <RevealSection className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-[#A3E635] text-xs font-semibold tracking-[0.15em] uppercase mb-4">Pricing</div>
          <h2 className="font-['Space_Grotesk'] text-[clamp(30px,4vw,44px)] font-bold text-white mb-4">Simple. Flat. One-time.</h2>
          <p className="text-gray-400 text-lg">No subscriptions. Buy a bundle of video credits and submit footage whenever you're ready.</p>
        </RevealSection>

        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan, i) => (
            <RevealSection key={i} delay={i * 0.15}>
              <motion.div
                className={`relative p-7 rounded-2xl h-full flex flex-col transition-all duration-300 ${
                  plan.featured
                    ? 'bg-gradient-to-b from-[#A3E635]/5 to-[#0A0A0A] border-2 border-[#A3E635]/40 md:scale-105 shadow-[0_20px_60px_rgba(163,230,53,0.1)]'
                    : 'bg-[#0A0A0A] border border-white/5 hover:border-white/15'
                }`}
                whileHover={{ y: -5 }}
              >
                {/* Featured badge */}
                {plan.featured && (
                  <motion.div
                    className="absolute -top-3 right-6 px-4 py-1.5 rounded-full bg-[#A3E635] text-black text-[10px] font-extrabold tracking-wider uppercase"
                    animate={{ boxShadow: ['0 0 20px rgba(163,230,53,0.3)', '0 0 40px rgba(163,230,53,0.5)', '0 0 20px rgba(163,230,53,0.3)'] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    MOST POPULAR
                  </motion.div>
                )}

                {/* Plan icon */}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${
                  plan.featured ? 'bg-[#A3E635]/20' : 'bg-white/5'
                }`}>
                  {i === 0 && <Eye className={`w-6 h-6 ${plan.featured ? 'text-[#A3E635]' : 'text-gray-400'}`} />}
                  {i === 1 && <Users className={`w-6 h-6 ${plan.featured ? 'text-[#A3E635]' : 'text-gray-400'}`} />}
                  {i === 2 && <Zap className={`w-6 h-6 ${plan.featured ? 'text-[#A3E635]' : 'text-gray-400'}`} />}
                </div>

                <div className="text-gray-400 text-xs font-semibold tracking-wider uppercase mb-2">{plan.name}</div>
                <div className="text-[#A3E635] text-xs font-semibold mb-4">{plan.best}</div>

                <div className="flex items-baseline gap-1 mb-1">
                  <span className="font-['Space_Grotesk'] text-5xl font-bold text-white">${plan.price}</span>
                  <span className="text-gray-500 text-sm">one-time</span>
                </div>
                <div className={`text-xs mb-6 ${plan.featured ? 'text-[#A3E635] font-semibold' : 'text-gray-500'}`}>
                  approx. {plan.perVideo} per video
                </div>

                <ul className="space-y-3 mb-7 flex-1">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm text-gray-300">
                      <Check className="w-4 h-4 text-[#A3E635] flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                <motion.a
                  href={plan.link}
                  className={`w-full py-3.5 rounded-xl font-semibold text-center text-sm block transition-all ${
                    plan.featured
                      ? 'bg-[#A3E635] text-black hover:bg-[#BEF264]'
                      : 'border border-white/10 text-white hover:border-white/30 hover:bg-white/5'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Get {plan.name}
                </motion.a>

                {plan.featured && (
                  <p className="text-xs text-gray-500 text-center mt-3">🛡️ Protected by Brief-Match Guarantee</p>
                )}
              </motion.div>
            </RevealSection>
          ))}
        </div>

        <RevealSection className="max-w-3xl mx-auto mt-12 text-center text-gray-500 text-sm leading-relaxed">
          <p>
            Turnaround is measured from receipt of complete footage, instructions and references, to delivery of the <strong className="text-gray-300">first draft</strong>.<br />
            A revision = changes to an existing edit based on the original brief. New concepts, new footage or a different creative direction are treated as new edits.<br />
            Unused videos remain on your account. Reorder any package at any time.
          </p>
        </RevealSection>
      </div>
    </section>
  );
}

// FAQ Section
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const faqs = [
    { q: 'How do I send my raw footage?', a: 'After purchase you receive a private dashboard link. You paste a Google Drive, Dropbox or Frame.io link for your footage — you never upload large files to our website.' },
    { q: 'Is this a monthly subscription?', a: 'No. Every package is a one-time purchase of video credits. Use them at your own pace and reorder only when you need more.' },
    { q: 'What does "24–48h turnaround" mean exactly?', a: 'It is the time from receiving complete footage, instructions and references to delivery of your first draft. Growth Engine drafts arrive within 24 hours; Starter and Consistency Builder within 48 hours.' },
    { q: 'What counts as a revision?', a: 'A revision is a change to an existing edit based on your original brief (pacing, caption tweaks, music swap, trim). A new concept, new footage or a different creative direction is treated as a new edit.' },
    { q: 'I bought 10 videos but only have footage for 1. Is that okay?', a: 'Completely. Submit one project now; your remaining credits stay on your account dashboard and you can submit the rest whenever you\'re ready.' },
  ];

  return (
    <section id="faq" className="relative py-24 overflow-hidden">
      <div className="max-w-3xl mx-auto px-6">
        <RevealSection className="text-center mb-16">
          <div className="text-[#A3E635] text-xs font-semibold tracking-[0.15em] uppercase mb-4">FAQ</div>
          <h2 className="font-['Space_Grotesk'] text-[clamp(30px,4vw,44px)] font-bold text-white">Questions, answered</h2>
        </RevealSection>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <RevealSection key={i} delay={i * 0.1}>
              <motion.div
                className={`rounded-xl border transition-all duration-300 ${
                  openIndex === i ? 'border-[#A3E635]/20 bg-[#A3E635]/5' : 'border-white/5 bg-[#0A0A0A]'
                }`}
              >
                <button
                  className="w-full flex items-center justify-between gap-4 p-5 text-left"
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                >
                  <span className="text-white font-semibold text-sm">{faq.q}</span>
                  <motion.div
                    animate={{ rotate: openIndex === i ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-[#A3E635] text-xl flex-shrink-0"
                  >
                    +
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-gray-400 text-sm leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA Banner
function CTABanner() {
  return (
    <section className="relative py-24 bg-[#121212]/50 border-y border-white/5 overflow-hidden">
      <FloatingOrb className="w-[600px] h-[600px] bg-[#A3E635] top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2" delay={0} />

      <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
        <RevealSection>
          <h2 className="font-['Space_Grotesk'] text-[clamp(28px,4vw,44px)] font-bold text-white mb-4">
            Ready to stop scrolling and start growing?
          </h2>
          <p className="text-gray-400 text-lg mb-8">Secure your package today. First drafts back in 24–48 hours.</p>
          <motion.a
            href="#pricing"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#A3E635] text-black font-bold text-base"
            whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(163,230,53,0.4)' }}
            whileTap={{ scale: 0.95 }}
          >
            Get Your First Video in 24h <ArrowRight className="w-4 h-4" />
          </motion.a>
        </RevealSection>
      </div>
    </section>
  );
}

// Contact Section
function ContactSection() {
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');
    setTimeout(() => {
      setFormStatus('success');
      setTimeout(() => setFormStatus('idle'), 3000);
    }, 1500);
  };

  return (
    <section id="contact" className="relative py-24 overflow-hidden">
      <FloatingOrb className="w-[300px] h-[300px] bg-purple-600 bottom-[-10%] left-[-5%]" delay={2} />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <RevealSection>
            <div className="text-[#A3E635] text-xs font-semibold tracking-[0.15em] uppercase mb-4">Get In Touch</div>
            <h3 className="font-['Space_Grotesk'] text-3xl font-bold text-white mb-4">Questions before you buy?</h3>
            <p className="text-gray-400 mb-8">Tell us about your channel and goals. We reply within 24 hours with an honest recommendation.</p>

            <ul className="space-y-4">
              {[
                { icon: <Mail className="w-4 h-4" />, text: 'hello@focalcut.com' },
                { icon: <Clock className="w-4 h-4" />, text: 'Reply within 24 hours' },
                { icon: <Globe className="w-4 h-4" />, text: 'Remote · Worldwide clients' },
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#A3E635]/10 border border-[#A3E635]/20 flex items-center justify-center text-[#A3E635]">
                    {item.icon}
                  </div>
                  <span className="text-gray-300 text-sm">{item.text}</span>
                </li>
              ))}
            </ul>
          </RevealSection>

          <RevealSection delay={0.2}>
            <form onSubmit={handleSubmit} className="p-7 rounded-2xl bg-[#0A0A0A] border border-white/5">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Your name</label>
                  <input
                    type="text"
                    placeholder="Jane Doe"
                    className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#A3E635]/50 focus:ring-2 focus:ring-[#A3E635]/10 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Email</label>
                  <input
                    type="email"
                    placeholder="jane@brand.com"
                    className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#A3E635]/50 focus:ring-2 focus:ring-[#A3E635]/10 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">What do you need?</label>
                  <select className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#A3E635]/50 focus:ring-2 focus:ring-[#A3E635]/10 transition-all">
                    <option>Video Editing Package</option>
                    <option>Custom Quote</option>
                    <option>General Question</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Message</label>
                  <textarea
                    placeholder="Tell us about your project..."
                    rows={4}
                    className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#A3E635]/50 focus:ring-2 focus:ring-[#A3E635]/10 transition-all resize-none"
                    required
                  />
                </div>
                <motion.button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#A3E635] text-black font-bold text-sm flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(163,230,53,0.3)' }}
                  whileTap={{ scale: 0.98 }}
                  disabled={formStatus === 'sending'}
                >
                  {formStatus === 'sending' ? (
                    <motion.div
                      className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                  ) : formStatus === 'success' ? (
                    <>✓ Message Sent!</>
                  ) : (
                    <>Send Message <ArrowRight className="w-4 h-4" /></>
                  )}
                </motion.button>
              </div>
            </form>
          </RevealSection>
        </div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer className="relative py-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#A3E635] to-[#65A30D] flex items-center justify-center">
                <Play className="w-4 h-4 text-black fill-black" />
              </div>
              <span className="font-['Space_Grotesk'] font-bold text-lg text-white">FocalCut</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">Premium short-form video editing for creators and brands who refuse to compromise on retention.</p>
          </div>

          <div>
            <h4 className="text-xs font-semibold tracking-wider uppercase text-gray-400 mb-4">Product</h4>
            <ul className="space-y-2">
              {['Portfolio', 'Pricing', 'FAQ'].map(item => (
                <li key={item}><a href="#" className="text-gray-500 hover:text-[#A3E635] text-sm transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold tracking-wider uppercase text-gray-400 mb-4">Company</h4>
            <ul className="space-y-2">
              {['Contact', 'Client Portal'].map(item => (
                <li key={item}><a href="#" className="text-gray-500 hover:text-[#A3E635] text-sm transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold tracking-wider uppercase text-gray-400 mb-4">Legal</h4>
            <ul className="space-y-2">
              {['Terms of Service', 'Privacy Policy', 'Refund Policy'].map(item => (
                <li key={item}><a href="#" className="text-gray-500 hover:text-[#A3E635] text-sm transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-xs">© 2026 Big Bay Mall LLC · FocalCut is a brand of Big Bay Mall LLC · Registered in Wyoming, USA</p>
          <div className="flex gap-4">
            {['Twitter', 'Instagram', 'TikTok'].map(social => (
              <a key={social} href="#" className="text-gray-600 hover:text-[#A3E635] text-xs transition-colors">{social}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// Main App
export default function App() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-['Inter'] antialiased overflow-x-hidden">
      <Navigation />
      <HeroSection />
      <TrustStrip />
      <PortfolioSection />
      <ProcessSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <CTABanner />
      <ContactSection />
      <Footer />
    </div>
  );
}
