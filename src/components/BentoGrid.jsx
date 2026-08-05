import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  FaGithub, FaLinkedin, FaEnvelope,
  FaExternalLinkAlt, FaReact, FaPython,
  FaNodeJs, FaGamepad, FaUndo, FaArrowRight, FaMapMarkerAlt
} from 'react-icons/fa';
import data from '../data/portfolio.json';
import profileImg from '../assets/profile.png';

/* ─────────────────────────────────────────────
   CUSTOM CURSOR (desktop only)
───────────────────────────────────────────── */
const CustomCursor = () => {
  const ringRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    const move = (e) => {
      ringRef.current && (ringRef.current.style.transform = `translate(${e.clientX - 20}px,${e.clientY - 20}px)`);
      dotRef.current && (dotRef.current.style.transform = `translate(${e.clientX - 3}px,${e.clientY - 3}px)`);
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <>
      <div ref={ringRef} className="fixed top-0 left-0 w-10 h-10 border border-zinc-400/50 rounded-full pointer-events-none z-[9999] transition-transform duration-[80ms] ease-out mix-blend-difference hidden md:block" />
      <div ref={dotRef} className="fixed top-0 left-0 w-1.5 h-1.5 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:block" />
    </>
  );
};

/* ─────────────────────────────────────────────
   MARQUEE
───────────────────────────────────────────── */
const Marquee = ({ items }) => (
  <div className="overflow-hidden whitespace-nowrap py-3 border-y border-zinc-800">
    <motion.div
      animate={{ x: ['0%', '-50%'] }}
      transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
      className="inline-flex gap-8"
    >
      {[...items, ...items].map((item, i) => (
        <span key={i} className="text-[11px] font-mono tracking-widest uppercase text-zinc-500">
          <span className="text-amber-500 mr-2.5">✦</span>{item}
        </span>
      ))}
    </motion.div>
  </div>
);

/* ─────────────────────────────────────────────
   MEMORY GAME
───────────────────────────────────────────── */
const MemoryGame = () => {
  const base = [
    { id: 1, name: 'react', icon: <FaReact size={22} className="text-[#61DAFB]" /> },
    { id: 2, name: 'python', icon: <FaPython size={22} className="text-[#3776AB]" /> },
    { id: 3, name: 'node', icon: <FaNodeJs size={22} className="text-[#339933]" /> },
    { id: 4, name: 'github', icon: <FaGithub size={22} className="text-zinc-300" /> },
  ];
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [moves, setMoves] = useState(0);

  const shuffle = () => {
    setCards([...base, ...base].sort(() => Math.random() - 0.5).map(c => ({ ...c, uid: Math.random() })));
    setFlipped([]); setSolved([]); setMoves(0); setDisabled(false);
  };
  useEffect(() => { shuffle(); }, []);

  const hit = (i) => {
    if (disabled || solved.includes(i) || flipped.includes(i)) return;
    const next = [...flipped, i];
    setFlipped(next);
    if (flipped.length === 0) setMoves(m => m + 1);
    if (flipped.length === 1) {
      setDisabled(true);
      if (cards[flipped[0]].name === cards[i].name) {
        setSolved(s => [...s, flipped[0], i]);
        setFlipped([]); setDisabled(false);
      } else {
        setTimeout(() => { setFlipped([]); setDisabled(false); }, 900);
      }
    }
  };
  const win = solved.length === cards.length && cards.length > 0;

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-mono tracking-[0.25em] text-amber-500 uppercase mb-0.5">Mini Game</p>
          <h3 className="text-base font-bold text-white">Tech Match</h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-zinc-600">{moves} moves</span>
          <button onClick={shuffle} className="p-2 text-zinc-600 hover:text-zinc-200 hover:bg-zinc-800 rounded-full transition-all active:scale-90">
            <FaUndo size={12} />
          </button>
        </div>
      </div>
      {win ? (
        <div className="flex-1 flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-700 gap-3 py-6 text-center">
          <FaGamepad size={28} className="text-amber-500" />
          <p className="text-white font-bold text-sm">Matched in {moves} moves!</p>
          <button onClick={shuffle} className="px-5 py-2 bg-amber-500 text-zinc-900 text-xs font-bold rounded-full hover:bg-amber-400 active:scale-95 transition-all">Play Again</button>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2 flex-1 content-center">
          {cards.map((card, i) => {
            const isF = flipped.includes(i) || solved.includes(i);
            return (
              <div
                key={card.uid}
                onClick={() => hit(i)}
                className={`aspect-square rounded-xl cursor-pointer flex items-center justify-center border transition-all duration-300 ${
                  isF
                    ? solved.includes(i) ? 'bg-amber-500/10 border-amber-500/40' : 'bg-zinc-800 border-zinc-600'
                    : 'bg-zinc-800/60 border-zinc-700/60 hover:border-zinc-500 active:scale-95'
                }`}
              >
                {isF ? card.icon : <span className="text-zinc-600 font-bold">?</span>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────
   DESKTOP PROJECT CARD (hover reveal)
───────────────────────────────────────────── */
const DesktopProjectCard = ({ project, index }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -6, borderColor: 'rgba(245, 158, 11, 0.4)' }}
      className="group relative bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden cursor-pointer h-[340px]"
    >
      <span className="absolute top-4 right-6 text-7xl font-black text-white/[0.04] select-none pointer-events-none leading-none">
        {String(index + 1).padStart(2, '0')}
      </span>
      <div className="relative z-10 p-7 flex flex-col justify-between h-full">
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <span className="text-[11px] font-mono tracking-widest text-amber-500 uppercase">{project.category}</span>
              <h3 className="text-xl font-bold text-white leading-snug mt-1.5 line-clamp-2">{project.title}</h3>
            </div>
            <motion.div
              animate={{ rotate: hovered ? 45 : 0, x: hovered ? 3 : 0, y: hovered ? -3 : 0 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="shrink-0 w-9 h-9 bg-zinc-800 border border-zinc-700 rounded-full flex items-center justify-center text-zinc-400 group-hover:bg-amber-500 group-hover:border-amber-500 group-hover:text-zinc-900 transition-colors duration-300"
            >
              <FaArrowRight size={13} />
            </motion.div>
          </div>
          <AnimatePresence>
            {hovered && (
              <motion.p
                initial={{ opacity: 0, y: 10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: 10, height: 0 }}
                transition={{ duration: 0.25 }}
                className="text-sm text-zinc-400 leading-relaxed overflow-hidden line-clamp-3"
              >
                {project.description}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-1.5">
            {project.stack.slice(0, 5).map((t, i) => (
              <span key={i} className="text-[11px] font-mono bg-zinc-800 border border-zinc-700/60 text-zinc-400 px-2.5 py-1 rounded-full">{t}</span>
            ))}
            {project.stack.length > 5 && <span className="text-[11px] font-mono text-zinc-600 px-2 py-1">+{project.stack.length - 5}</span>}
          </div>
          <div className="flex gap-2 pt-2 border-t border-zinc-800">
            <a href={project.live_demo} onClick={e => e.stopPropagation()} className="flex items-center gap-1.5 px-4 py-2 bg-white text-zinc-900 text-xs font-bold rounded-full hover:bg-amber-400 transition-colors active:scale-95">
              <FaExternalLinkAlt size={10} /> Live Demo
            </a>
            <a href={project.repository} onClick={e => e.stopPropagation()} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-4 py-2 bg-zinc-800 text-zinc-300 border border-zinc-700 text-xs font-medium rounded-full hover:bg-zinc-700 transition-colors active:scale-95">
              <FaGithub size={12} /> Code
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────
   MOBILE PROJECT CARD (full-featured, no hover tricks)
───────────────────────────────────────────── */
const MobileProjectCard = ({ project, index }) => (
  <div className="snap-start shrink-0 w-[88vw] max-w-[340px] flex flex-col relative overflow-hidden"
    style={{ background: 'linear-gradient(145deg, #1c1c1e 0%, #141414 100%)', borderRadius: '28px', border: '1px solid rgba(255,255,255,0.07)' }}>

    {/* top accent bar */}
    <div className="h-[3px] w-full" style={{ background: `linear-gradient(90deg, #f59e0b ${(index + 1) * 20}%, transparent 100%)` }} />

    <div className="flex flex-col gap-4 p-6 flex-1">
      {/* header row */}
      <div className="flex items-start justify-between">
        <span className="text-[10px] font-mono tracking-[0.25em] text-amber-500 uppercase bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
          {project.category}
        </span>
        <span className="text-[11px] font-mono text-zinc-700 font-black">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      {/* title */}
      <h3 className="text-xl font-black text-white leading-tight tracking-tight">{project.title}</h3>

      {/* description — always visible on mobile */}
      <p className="text-[13px] text-zinc-500 leading-relaxed line-clamp-4">{project.description}</p>

      {/* divider */}
      <div className="h-px bg-gradient-to-r from-zinc-800 via-zinc-700 to-transparent" />

      {/* stack pills */}
      <div className="flex flex-wrap gap-1.5">
        {project.stack.slice(0, 5).map((t, i) => (
          <span key={i} className="text-[10px] font-mono bg-zinc-800/80 border border-zinc-700/50 text-zinc-400 px-2.5 py-1 rounded-full">{t}</span>
        ))}
        {project.stack.length > 5 && <span className="text-[10px] font-mono text-zinc-600 self-center ml-1">+{project.stack.length - 5}</span>}
      </div>
    </div>

    {/* CTA row */}
    <div className="flex gap-2.5 px-6 pb-6">
      <a href={project.live_demo}
        className="flex-1 flex items-center justify-center gap-2 py-3 bg-amber-500 text-zinc-900 text-[13px] font-black rounded-2xl hover:bg-amber-400 active:scale-95 transition-all">
        <FaExternalLinkAlt size={11} /> Live Demo
      </a>
      <a href={project.repository} target="_blank" rel="noreferrer"
        className="flex items-center justify-center gap-2 px-4 py-3 bg-zinc-800 text-zinc-400 border border-zinc-700/60 rounded-2xl hover:bg-zinc-700 active:scale-95 transition-all">
        <FaGithub size={16} />
      </a>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   MAIN
───────────────────────────────────────────── */
const BentoGrid = () => {
  const [activeProject, setActiveProject] = useState(0);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const allTechs = Object.values(data.technical_stack).flat();

  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-zinc-100" style={{ cursor: 'none' }}>
      <CustomCursor />

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section ref={heroRef} className="relative overflow-hidden">

        {/* ambient glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/[0.06] rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-[-100px] w-[400px] h-[400px] bg-zinc-600/[0.04] rounded-full blur-[80px] pointer-events-none" />

        {/* ── NAV ── */}
        <nav className="relative z-20 flex items-center justify-between px-6 md:px-12 pt-7 pb-0">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-[11px] font-mono tracking-widest text-zinc-600 uppercase">
            Portfolio <span className="text-amber-500">©2025</span>
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="flex items-center gap-2 text-[11px] font-mono text-zinc-600">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            Available for work
          </motion.div>
        </nav>

        {/* ── DESKTOP HERO ── */}
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="hidden md:flex relative z-10 flex-row items-center max-w-7xl mx-auto w-full px-12 py-16 gap-0 min-h-[92vh]"
        >
          <div className="flex-1 flex flex-col justify-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
              <p className="text-xs font-mono tracking-[0.3em] text-amber-500 uppercase mb-6">{data.profile.role}</p>
              <h1 className="text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-8 text-white">
                {data.profile.name.split(' ')[0]}<br />
                <span className="text-zinc-600">{data.profile.name.split(' ').slice(1).join(' ')}</span>
              </h1>
              <p className="text-lg text-zinc-400 max-w-md leading-relaxed mb-10">{data.profile.tagline}</p>
              <div className="flex flex-wrap gap-3">
                <a href={data.profile.contact.email}
                  className="group flex items-center gap-2.5 px-6 py-3 bg-white text-zinc-900 rounded-full font-bold text-sm hover:bg-amber-400 transition-all active:scale-95">
                  <FaEnvelope size={14} /> Get in Touch
                  <FaArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
                </a>
                <a href={data.profile.contact.github} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2.5 px-6 py-3 bg-zinc-900 text-zinc-300 border border-zinc-800 rounded-full text-sm hover:bg-zinc-800 transition-all active:scale-95">
                  <FaGithub size={16} /> GitHub
                </a>
                <a href={data.profile.contact.linkedin} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2.5 px-6 py-3 bg-zinc-900 text-zinc-300 border border-zinc-800 rounded-full text-sm hover:bg-zinc-800 transition-all active:scale-95">
                  <FaLinkedin size={16} /> LinkedIn
                </a>
              </div>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 3 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.4, type: 'spring' }}
            className="relative w-80 lg:w-96 shrink-0"
          >
            <div className="absolute -top-3 -right-3 w-full h-full border border-amber-500/20 rounded-3xl" />
            <div className="absolute -top-6 -right-6 w-full h-full border border-amber-500/10 rounded-3xl" />
            <div className="relative rounded-3xl overflow-hidden aspect-[3/4] border border-zinc-800">
              <img src={profileImg} alt={data.profile.name} className="w-full h-full object-cover object-top" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-700/50 rounded-2xl px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-white font-bold text-sm">{data.profile.name}</p>
                    <p className="text-zinc-400 text-xs flex items-center gap-1 mt-0.5"><FaMapMarkerAlt size={9} /> Indonesia</p>
                  </div>
                  <div className="flex gap-1.5">
                    {[...Array(3)].map((_, i) => <div key={i} className="w-2 h-2 rounded-full bg-amber-500" style={{ opacity: 1 - i * 0.3 }} />)}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* ── MOBILE HERO ── */}
        <div className="flex md:hidden flex-col min-h-[100dvh] relative">

          {/* Photo — full bleed, 55% of screen */}
          <div className="relative w-full flex-shrink-0" style={{ height: '58dvh' }}>
            <img src={profileImg} alt={data.profile.name}
              className="w-full h-full object-cover object-top" />
            {/* layered gradients */}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(9,9,11,0.25) 0%, transparent 35%, rgba(9,9,11,0.7) 75%, #09090b 100%)' }} />
            {/* diagonal noise pattern overlay */}
            <div className="absolute inset-0 opacity-[0.15] pointer-events-none"
              style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.03) 4px, rgba(255,255,255,0.03) 5px)' }} />

            {/* floating role chip */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute top-16 left-5"
            >
              <div className="flex items-center gap-2 bg-zinc-900/70 backdrop-blur-md border border-zinc-700/60 rounded-full px-3.5 py-2">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shrink-0" />
                <span className="text-[11px] font-mono tracking-widest text-zinc-300 uppercase">{data.profile.role}</span>
              </div>
            </motion.div>

            {/* floating location chip */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              className="absolute top-16 right-5"
            >
              <div className="flex items-center gap-1.5 bg-zinc-900/70 backdrop-blur-md border border-zinc-700/60 rounded-full px-3 py-2">
                <FaMapMarkerAlt size={9} className="text-amber-500" />
                <span className="text-[11px] font-mono text-zinc-400">Indonesia</span>
              </div>
            </motion.div>
          </div>

          {/* Bio panel — slides up over the photo */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3, type: 'spring', damping: 20 }}
            className="relative z-10 -mt-16 flex flex-col gap-0"
            style={{ background: 'transparent' }}
          >
            {/* Name block */}
            <div className="px-5 mb-5">
              <h1 className="text-[52px] font-black tracking-tighter leading-[0.88] text-white">
                {data.profile.name.split(' ')[0]}<br />
                <span className="text-zinc-500">{data.profile.name.split(' ').slice(1).join(' ')}</span>
              </h1>
            </div>

            {/* Glass card */}
            <div className="mx-4 rounded-[28px] overflow-hidden" style={{ background: 'rgba(24,24,27,0.95)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)' }}>

              {/* amber top accent */}
              <div className="h-[2px]" style={{ background: 'linear-gradient(90deg, #f59e0b 0%, transparent 70%)' }} />

              <div className="p-6 flex flex-col gap-5">
                <p className="text-[14px] text-zinc-400 leading-relaxed">{data.profile.tagline}</p>

                {/* CTA buttons */}
                <div className="flex gap-2.5">
                  <a href={data.profile.contact.email}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-amber-500 text-zinc-900 rounded-2xl text-[13px] font-black tracking-wide hover:bg-amber-400 active:scale-95 transition-all">
                    <FaEnvelope size={14} /> Email Me
                  </a>
                  <a href={data.profile.contact.github} target="_blank" rel="noreferrer"
                    className="flex items-center justify-center w-14 bg-zinc-800 border border-zinc-700/60 rounded-2xl hover:bg-zinc-700 active:scale-95 transition-all">
                    <FaGithub size={18} className="text-zinc-300" />
                  </a>
                  <a href={data.profile.contact.linkedin} target="_blank" rel="noreferrer"
                    className="flex items-center justify-center w-14 bg-zinc-800 border border-zinc-700/60 rounded-2xl hover:bg-zinc-700 active:scale-95 transition-all">
                    <FaLinkedin size={18} className="text-zinc-300" />
                  </a>
                </div>

                {/* stat row */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {[
                    { label: 'Projects', value: data.projects?.length ?? '10+' },
                    { label: 'Experience', value: data.experience?.length + 'yr+' ?? '2yr+' },
                    { label: 'Stack', value: allTechs.length + '+' },
                  ].map((s, i) => (
                    <div key={i} className="flex flex-col items-center py-3 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <span className="text-xl font-black text-amber-500 leading-none">{s.value}</span>
                      <span className="text-[10px] font-mono text-zinc-600 mt-1 tracking-wide">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* scroll nudge */}
            <div className="flex flex-col items-center gap-2 py-6 mt-2">
              <span className="text-[9px] font-mono tracking-[0.3em] text-zinc-700 uppercase">scroll</span>
              <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 1.6, repeat: Infinity }}
                className="w-px h-7 bg-gradient-to-b from-zinc-700 to-transparent" />
            </div>
          </motion.div>
        </div>

        {/* Desktop scroll indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          className="hidden md:flex relative z-10 flex-col items-center pb-8 gap-2">
          <span className="text-[10px] font-mono tracking-widest text-zinc-600 uppercase">scroll</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
            className="w-px h-8 bg-gradient-to-b from-zinc-600 to-transparent" />
        </motion.div>
      </section>

      {/* ══════════════════════════════════════
          MARQUEE
      ══════════════════════════════════════ */}
      <Marquee items={allTechs} />

      {/* ══════════════════════════════════════
          EXPERIENCE — DESKTOP
      ══════════════════════════════════════ */}
      

      {/* ══════════════════════════════════════
          EXPERIENCE — MOBILE (horizontal scroll cards)
      ══════════════════════════════════════ */}
      

      {/* ══════════════════════════════════════
          TECH STACK + GAME
      ══════════════════════════════════════ */}
      <section className="border-y border-zinc-800/50" style={{ background: 'rgba(24,24,27,0.4)' }}>
        <div className="max-w-7xl mx-auto px-5 md:px-12 py-16 md:py-28">

          {/* section header */}
          <div className="mb-8 md:mb-12 px-0">
            <p className="text-[10px] font-mono tracking-[0.25em] text-amber-500 uppercase mb-1">02</p>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">Tech</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">

            {/* Tech Stack */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="flex flex-col gap-6">
                {Object.entries(data.technical_stack).map(([cat, items], ci) => (
                  <motion.div key={cat}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: ci * 0.08 }}
                  >
                    {/* category row */}
                    <div className="flex items-center gap-3 mb-2.5">
                      <div className="h-px flex-1 bg-zinc-800" />
                      <p className="text-[10px] font-mono tracking-widest text-zinc-600 uppercase shrink-0">{cat}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {items.map((item, j) => (
                        <motion.span key={j}
                          whileHover={{ y: -2, scale: 1.05 }}
                          className="px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-default"
                          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#a1a1aa' }}
                          onMouseEnter={e => { e.target.style.borderColor = 'rgba(245,158,11,0.4)'; e.target.style.color = '#fbbf24'; }}
                          onMouseLeave={e => { e.target.style.borderColor = 'rgba(255,255,255,0.07)'; e.target.style.color = '#a1a1aa'; }}
                        >
                          {item}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Memory Game */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="rounded-[28px] p-6 min-h-[280px] flex flex-col"
              style={{ background: 'linear-gradient(145deg, #1c1c1e 0%, #141414 100%)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <MemoryGame />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PROJECTS
      ══════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-5 md:px-12 py-16 md:py-28">

        <div className="flex items-end justify-between gap-4 mb-10 md:mb-12">
          <div>
            <p className="text-[10px] font-mono tracking-[0.25em] text-amber-500 uppercase mb-1">03</p>
            <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight">Selected Work</h2>
          </div>
          <p className="text-[10px] font-mono text-zinc-700 uppercase tracking-wide hidden md:block">hover to reveal</p>
          <p className="text-[10px] font-mono text-zinc-700 uppercase tracking-wide md:hidden">swipe →</p>
        </div>

        {/* Desktop grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-4">
          {data.projects.map((p, i) => <DesktopProjectCard key={i} project={p} index={i} />)}
        </div>

        {/* Mobile: full-bleed swipe */}
        <div className="md:hidden flex flex-col gap-5">
          <div
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory -mx-5 px-5 pb-2"
            style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
            onScroll={(e) => {
              const el = e.target;
              const idx = Math.round(el.scrollLeft / ((el.children[0]?.offsetWidth ?? 0) + 16));
              setActiveProject(idx);
            }}
          >
            {data.projects.map((p, i) => <MobileProjectCard key={i} project={p} index={i} />)}
          </div>

          {/* progress indicator */}
          <div className="flex items-center gap-2 justify-center">
            {data.projects.map((_, i) => (
              <motion.div
                key={i}
                animate={{ width: i === activeProject ? 24 : 6, opacity: i === activeProject ? 1 : 0.3 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="h-1.5 rounded-full bg-amber-500"
              />
            ))}
          </div>

          {/* count label */}
          <p className="text-center text-[11px] font-mono text-zinc-700">
            {activeProject + 1} / {data.projects.length}
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA FOOTER
      ══════════════════════════════════════ */}
      <section className="border-t border-zinc-800/50 relative overflow-hidden">
        {/* glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-amber-500/[0.04] rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-12 py-20 md:py-32 flex flex-col items-center text-center gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-6 w-full"
          >
            <p className="text-[10px] font-mono tracking-[0.3em] text-amber-500 uppercase">Let's Connect</p>

            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-none">
              Got a project<br />
              <span className="text-zinc-700">in mind?</span>
            </h2>

            <p className="text-zinc-500 text-sm md:text-base max-w-sm leading-relaxed">
              I'm always open to discussing new opportunities, creative projects, or just having a good chat about tech.
            </p>

            <a href={data.profile.contact.email}
              className="group flex items-center gap-3 px-8 py-4 bg-amber-500 text-zinc-900 font-black text-base rounded-full hover:bg-amber-400 transition-all active:scale-95 w-full md:w-auto justify-center">
              <FaEnvelope size={16} /> Say Hello
              <FaArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </div>

        <div className="border-t border-zinc-800/50 px-5 md:px-12 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <span className="text-[11px] font-mono text-zinc-700">{data.profile.name} © 2025</span>
          <div className="flex items-center gap-5">
            <a href={data.profile.contact.github} target="_blank" rel="noreferrer" className="text-[11px] font-mono text-zinc-700 hover:text-zinc-400 transition-colors">GitHub</a>
            <a href={data.profile.contact.linkedin} target="_blank" rel="noreferrer" className="text-[11px] font-mono text-zinc-700 hover:text-zinc-400 transition-colors">LinkedIn</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BentoGrid;
