import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  FaGithub, FaLinkedin, FaEnvelope,
  FaExternalLinkAlt, FaReact, FaPython,
  FaNodeJs, FaGamepad, FaUndo, FaArrowRight, FaMapMarkerAlt,
  FaTimes, FaCheckCircle, FaEye, FaLayerGroup, FaSearchPlus,
  FaSearchMinus, FaRedo, FaExpand, FaCompress, FaArrowsAlt,
  FaChevronLeft, FaChevronRight, FaImages, FaRobot, FaBrain,
  FaChartLine, FaDatabase, FaServer, FaTools, FaStar, FaCode, FaShieldAlt
} from 'react-icons/fa';
import {
  SiReact, SiTailwindcss, SiJavascript, SiThreedotjs, SiBootstrap,
  SiLaravel, SiPhp, SiPython, SiNodedotjs,
  SiMysql, SiGit, SiPostman, SiVite
} from 'react-icons/si';
import data from '../data/portfolio.json';
import profileImg from '../assets/profile.png';

// Import all images dynamically to make sure Vite bundles and hashes them correctly for production
const projectImages = import.meta.glob('../assets/images/**/*', { eager: true, import: 'default' });

const resolveImage = (path) => {
  if (!path) return '';
  // Convert /src/assets/images/ or src/assets/images/ to ../assets/images/
  const relativePath = path.replace(/^\/?src\/assets\/images\//, '../assets/images/');
  return projectImages[relativePath] || path;
};


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
      <div ref={ringRef} className="fixed top-0 left-0 w-10 h-10 border border-zinc-400/50 rounded-full pointer-events-none z-[999999] transition-transform duration-[80ms] ease-out mix-blend-difference hidden md:block" />
      <div ref={dotRef} className="fixed top-0 left-0 w-1.5 h-1.5 bg-white rounded-full pointer-events-none z-[999999] mix-blend-difference hidden md:block" />
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
   BENTO TECH & EXPERTISE SECTION
───────────────────────────────────────────── */
const techCardsData = [
  {
    id: 'frontend',
    category: 'Frontend & Interactive 3D',
    badge: 'Modern UI',
    icon: <SiReact className="text-[#61DAFB]" size={22} />,
    description: 'Membangun antarmuka modern, interaktif, responsif, dengan animasi dinamis dan visualisasi 3D.',
    skills: [
      { name: 'React', icon: <SiReact className="text-[#61DAFB]" size={14} /> },
      { name: 'Tailwind CSS', icon: <SiTailwindcss className="text-[#38BDF8]" size={14} /> },
      { name: 'JavaScript', icon: <SiJavascript className="text-[#F7DF1E]" size={14} /> },
      { name: 'Three.js 3D', icon: <SiThreedotjs className="text-white" size={14} /> },
      { name: 'Bootstrap 5', icon: <SiBootstrap className="text-[#7952B3]" size={14} /> },
      { name: 'HTML5 / CSS3', icon: <FaCode className="text-amber-400" size={14} /> },
    ],
    accent: 'from-cyan-500/10 via-transparent to-transparent',
    borderHover: 'hover:border-cyan-500/40',
    tagColor: 'text-cyan-400',
  },
  {
    id: 'backend',
    category: 'Backend & API Engineering',
    badge: 'Server & Logic',
    icon: <SiLaravel className="text-[#FF2D20]" size={22} />,
    description: 'Perancangan arsitektur backend terstruktur, web scraping data real-time, dan integrasi REST API efisien.',
    skills: [
      { name: 'Laravel 11', icon: <SiLaravel className="text-[#FF2D20]" size={14} /> },
      { name: 'PHP 8+', icon: <SiPhp className="text-[#777BB4]" size={14} /> },
      { name: 'Python', icon: <SiPython className="text-[#3776AB]" size={14} /> },
      { name: 'Node.js', icon: <SiNodedotjs className="text-[#5FA04E]" size={14} /> },
      { name: 'REST APIs', icon: <FaServer className="text-emerald-400" size={14} /> },
    ],
    accent: 'from-red-500/10 via-transparent to-transparent',
    borderHover: 'hover:border-red-500/40',
    tagColor: 'text-red-400',
  },
  {
    id: 'ai-trading',
    category: 'AI, Trading Bot & Financial Systems',
    badge: 'Flagship Domain',
    icon: <FaBrain className="text-amber-400" size={22} />,
    description: 'Otomasi trading real-time, analisis sentimen berita finansial via LLM lokal, dan bot catur Stockfish.',
    skills: [
      { name: 'Ollama AI (LLM)', icon: <FaRobot className="text-purple-400" size={14} /> },
      { name: 'MetaTrader 5 API', icon: <FaChartLine className="text-emerald-400" size={14} /> },
      { name: 'Sentiment Analysis', icon: <FaSearchPlus className="text-amber-400" size={14} /> },
      { name: 'Stockfish Engine', icon: <FaGamepad className="text-pink-400" size={14} /> },
      { name: 'Risk Management', icon: <FaShieldAlt className="text-blue-400" size={14} /> },
    ],
    accent: 'from-amber-500/15 via-transparent to-transparent',
    borderHover: 'hover:border-amber-500/50',
    tagColor: 'text-amber-400',
    isFlagship: true,
  },
  {
    id: 'tools-db',
    category: 'Database & Workflow Tools',
    badge: 'Ecosystem',
    icon: <FaDatabase className="text-emerald-400" size={22} />,
    description: 'Penyimpanan data relasional dan NoSQL terindeks, version control Git, serta build tools performa tinggi.',
    skills: [
      { name: 'MySQL', icon: <SiMysql className="text-[#4479A1]" size={14} /> },
      { name: 'Git / GitHub', icon: <SiGit className="text-[#F05032]" size={14} /> },
      { name: 'Postman API', icon: <SiPostman className="text-[#FF6C37]" size={14} /> },
      { name: 'Vite', icon: <SiVite className="text-[#646CFF]" size={14} /> },
      { name: 'JSON Indexing', icon: <FaCode className="text-zinc-300" size={14} /> },
    ],
    accent: 'from-emerald-500/10 via-transparent to-transparent',
    borderHover: 'hover:border-emerald-500/40',
    tagColor: 'text-emerald-400',
  },
];

const BentoTechSection = () => {
  const [activeTechIdx, setActiveTechIdx] = useState(0);

  return (
    <div>
      {/* ── MOBILE: Compact Horizontal Swipe Carousel (Cuts vertical space by >75%) ── */}
      <div className="md:hidden flex flex-col gap-3.5">
        <div
          className="flex gap-3.5 overflow-x-auto snap-x snap-mandatory -mx-5 px-5 pb-2"
          style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
          onScroll={(e) => {
            const el = e.target;
            const idx = Math.round(el.scrollLeft / ((el.children[0]?.offsetWidth ?? 0) + 14));
            setActiveTechIdx(idx);
          }}
        >
          {techCardsData.map((card) => (
            <div
              key={card.id}
              className={`snap-start shrink-0 w-[84vw] max-w-[310px] rounded-3xl p-5 bg-zinc-900/95 border border-zinc-800 flex flex-col justify-between relative overflow-hidden shadow-lg ${
                card.isFlagship ? 'ring-1 ring-amber-500/30' : ''
              }`}
            >
              {/* Ambient Glow */}
              <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${card.accent} rounded-full blur-2xl pointer-events-none opacity-50`} />

              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center shrink-0 shadow-inner">
                      {card.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white leading-tight">
                        {card.category}
                      </h3>
                      <span className={`text-[9px] font-mono font-semibold uppercase tracking-wider ${card.tagColor}`}>
                        {card.badge}
                      </span>
                    </div>
                  </div>
                  {card.isFlagship && (
                    <span className="text-[8px] font-mono font-bold bg-amber-500/15 border border-amber-500/30 text-amber-400 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                      <FaStar size={7} /> Core
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-[12px] text-zinc-400 leading-relaxed mb-4 line-clamp-2">
                  {card.description}
                </p>
              </div>

              {/* Skills Badges */}
              <div className="relative z-10 flex flex-wrap gap-1.5 pt-3 border-t border-zinc-800/80">
                {card.skills.map((skill, sIdx) => (
                  <div
                    key={sIdx}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] font-mono text-zinc-300"
                  >
                    {skill.icon}
                    <span>{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Carousel indicator dots */}
        <div className="flex items-center justify-center gap-2 pt-1">
          {techCardsData.map((_, i) => (
            <motion.div
              key={i}
              animate={{ width: i === activeTechIdx ? 20 : 6, opacity: i === activeTechIdx ? 1 : 0.3 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="h-1.5 rounded-full bg-amber-500"
            />
          ))}
        </div>
      </div>

      {/* ── DESKTOP: 2x2 Bento Grid ── */}
      <div className="hidden md:grid md:grid-cols-2 gap-5 lg:gap-6">
        {techCardsData.map((card, idx) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.5, delay: idx * 0.08 }}
            whileHover={{ y: -4 }}
            className={`relative rounded-3xl p-6 md:p-7 bg-zinc-900/90 border border-zinc-800 flex flex-col justify-between overflow-hidden transition-all duration-300 ${card.borderHover} ${
              card.isFlagship ? 'shadow-xl shadow-amber-500/5 ring-1 ring-amber-500/20' : ''
            }`}
          >
            {/* Subtle Ambient Radial Glow */}
            <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${card.accent} rounded-full blur-3xl pointer-events-none opacity-60`} />

            {/* Top Row: Icon + Badge */}
            <div className="relative z-10 flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-center shadow-inner">
                  {card.icon}
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-black text-white leading-tight">
                    {card.category}
                  </h3>
                  <span className={`text-[10px] font-mono font-semibold uppercase tracking-wider ${card.tagColor}`}>
                    {card.badge}
                  </span>
                </div>
              </div>
              {card.isFlagship && (
                <span className="text-[9px] font-mono font-bold bg-amber-500/15 border border-amber-500/30 text-amber-400 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <FaStar size={9} /> Core Focus
                </span>
              )}
            </div>

            {/* Description */}
            <p className="relative z-10 text-xs md:text-sm text-zinc-400 leading-relaxed mb-6">
              {card.description}
            </p>

            {/* Skills Badges with Icons */}
            <div className="relative z-10 flex flex-wrap gap-2 pt-2 border-t border-zinc-800/80">
              {card.skills.map((skill, sIdx) => (
                <div
                  key={sIdx}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-white hover:border-zinc-700 transition-all hover:scale-105"
                >
                  {skill.icon}
                  <span>{skill.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   PROJECT THUMBNAIL (Mac/Web Window Mockup Frame & Procedural Fallback)
───────────────────────────────────────────── */
const ProjectThumbnail = ({ project, heightClass = "h-44 md:h-48", onClickGallery, onClickDetail }) => {
  const [imgError, setImgError] = useState(false);
  const slug = project.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');

  return (
    <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 flex flex-col group/thumb">
      {/* Mac Window Header Bar */}
      <div className="bg-zinc-900/90 border-b border-zinc-800 px-3 py-2 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-zinc-950/80 rounded-md border border-zinc-800 text-[10px] font-mono text-zinc-500 max-w-[170px] truncate">
          <span className="text-emerald-500 font-bold">https://</span>
          <span className="truncate">{slug}.dev</span>
        </div>
        {project.badge ? (
          <span className="text-[9px] font-mono font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
            {project.badge}
          </span>
        ) : (
          <span className="w-4" />
        )}
      </div>

      {/* Main Preview Container */}
      <div className={`relative ${heightClass} w-full overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-950 to-amber-950/20 flex items-center justify-center`}>
        {project.thumbnail && !imgError ? (
          <img
            src={resolveImage(project.thumbnail)}
            alt={project.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover/thumb:scale-105"
          />
        ) : (
          /* Procedural Fallback UI Mockup */
          <div className="w-full h-full p-4 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-zinc-900/90 via-zinc-950 to-zinc-900/60">
            {/* Ambient mesh background */}
            <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Simulated UI App Wireframe Header */}
            <div className="relative z-10 flex items-center justify-between border-b border-zinc-800/80 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-black text-[10px]">
                  {project.title.charAt(0)}
                </div>
                <span className="text-xs font-bold text-zinc-300 font-mono tracking-tight">{project.category}</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-600 bg-zinc-800/80 px-2 py-0.5 rounded border border-zinc-700/50">V1.0</span>
            </div>

            {/* Simulated UI Cards / Graphics */}
            <div className="relative z-10 grid grid-cols-3 gap-2 my-auto">
              <div className="col-span-2 p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 flex flex-col gap-1.5">
                <div className="h-2 w-3/4 bg-amber-500/40 rounded-full" />
                <div className="h-1.5 w-full bg-zinc-800 rounded-full" />
                <div className="h-1.5 w-2/3 bg-zinc-800 rounded-full" />
              </div>
              <div className="col-span-1 p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 flex flex-col items-center justify-center gap-1 text-center">
                <span className="text-[13px] font-black text-amber-400 leading-none">100%</span>
                <span className="text-[8px] font-mono text-zinc-500 uppercase">Ready</span>
              </div>
            </div>

            {/* Tech stack badge row inside mockup */}
            <div className="relative z-10 flex items-center justify-between pt-1">
              <div className="flex items-center gap-1">
                {project.stack.slice(0, 3).map((t, idx) => (
                  <span key={idx} className="text-[9px] font-mono bg-zinc-800/90 text-zinc-400 border border-zinc-700/40 px-1.5 py-0.5 rounded">
                    {t}
                  </span>
                ))}
              </div>
              <span className="text-[10px] font-mono text-amber-400 flex items-center gap-1 font-bold">
                <FaEye size={10} /> Preview
              </span>
            </div>
          </div>
        )}

        {/* Hover Quick Action Overlay */}
        <div className="absolute inset-0 bg-zinc-950/70 backdrop-blur-[2px] opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onClickGallery) onClickGallery(project);
              else if (onClickDetail) onClickDetail(project);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-zinc-950 text-xs font-black rounded-full hover:bg-amber-400 shadow-lg shadow-amber-500/20 transition-transform active:scale-95"
          >
            <FaImages size={13} /> Detail Gambar
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   IMAGE GALLERY MODAL (Fullscreen Interactive Canvas Lightbox with Zoom & Pan)
───────────────────────────────────────────── */
const ImageGalleryModal = ({ project, onClose }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Reset zoom & pos on project change
  useEffect(() => {
    setActiveIdx(0);
    setScale(1);
    setPos({ x: 0, y: 0 });
  }, [project]);

  // Reset zoom & pos when changing active image
  const switchImage = (newIdx) => {
    setActiveIdx(newIdx);
    setScale(1);
    setPos({ x: 0, y: 0 });
  };

  const rawImages = (project?.images && project.images.length > 0)
    ? project.images
    : (project?.thumbnail ? [project.thumbnail] : []);

  const imageList = rawImages.map(img => ({
    raw: img,
    resolved: resolveImage(img),
    name: img.split('/').pop() || 'Screenshot'
  }));

  const currentImg = imageList[activeIdx] || imageList[0];

  const handlePrev = () => {
    switchImage(activeIdx > 0 ? activeIdx - 1 : imageList.length - 1);
  };

  const handleNext = () => {
    switchImage(activeIdx < imageList.length - 1 ? activeIdx + 1 : 0);
  };

  const handleZoomIn = () => {
    setScale(s => Math.min(Number((s + 0.5).toFixed(2)), 4));
  };

  const handleZoomOut = () => {
    setScale(s => {
      const next = Math.max(Number((s - 0.5).toFixed(2)), 1);
      if (next === 1) setPos({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetZoom = () => {
    setScale(1);
    setPos({ x: 0, y: 0 });
  };

  const handleToggleZoom = () => {
    if (scale > 1) {
      handleResetZoom();
    } else {
      setScale(2);
    }
  };

  // Keyboard controls
  useEffect(() => {
    if (!project) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === '+' || e.key === '=') handleZoomIn();
      if (e.key === '-') handleZoomOut();
      if (e.key === '0' || e.key === 'r' || e.key === 'R') handleResetZoom();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, activeIdx, imageList.length, scale]);

  // Non-passive wheel zoom
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e) => {
      e.preventDefault();
      const delta = e.deltaY * -0.002;
      setScale(prev => {
        const next = Math.min(Math.max(Number((prev + delta).toFixed(2)), 1), 4);
        if (next === 1) setPos({ x: 0, y: 0 });
        return next;
      });
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [project]);

  // Mouse Drag handlers
  const handleMouseDown = (e) => {
    if (scale <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pos.x, y: e.clientY - pos.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || scale <= 1) return;
    setPos({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch Drag handlers
  const handleTouchStart = (e) => {
    if (scale <= 1 || e.touches.length !== 1) return;
    setIsDragging(true);
    setDragStart({ x: e.touches[0].clientX - pos.x, y: e.touches[0].clientY - pos.y });
  };

  const handleTouchMove = (e) => {
    if (!isDragging || scale <= 1 || e.touches.length !== 1) return;
    setPos({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  if (!project || !currentImg) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[99999] flex flex-col justify-between overflow-hidden select-none"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Fullscreen Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-zinc-950/95 backdrop-blur-xl"
        />

        {/* ── Top Header Bar (HUD) ── */}
        <div className="relative z-30 flex items-center justify-between px-4 md:px-8 py-3.5 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <FaImages size={15} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm md:text-base font-bold text-white leading-tight">
                  {project.title}
                </h3>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                  {project.category}
                </span>
              </div>
              <p className="text-[11px] font-mono text-zinc-400">
                📷 {currentImg.name} • {activeIdx + 1} dari {imageList.length} screenshot
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Interactive hint pill */}
            <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 bg-zinc-900/90 border border-zinc-800 px-3 py-1 rounded-full">
              <span className="text-amber-400">✦</span>
              <span>Scroll Wheel / Double-click untuk Zoom • Drag untuk Geser</span>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center transition-colors shadow-lg"
              title="Tutup (Esc)"
            >
              <FaTimes size={15} />
            </button>
          </div>
        </div>

        {/* ── Main Interactive Canvas Stage ── */}
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onDoubleClick={handleToggleZoom}
          className={`relative z-20 flex-1 w-full h-full flex items-center justify-center overflow-hidden ${
            scale > 1
              ? isDragging
                ? 'cursor-grabbing'
                : 'cursor-grab'
              : 'cursor-zoom-in'
          }`}
        >
          {/* Main Full-Res Image with Pan & Scale */}
          <div
            className="w-full h-full flex items-center justify-center p-4 md:p-8 pointer-events-none"
          >
            <img
              src={currentImg.resolved}
              alt={`${project.title} screenshot ${activeIdx + 1}`}
              draggable={false}
              style={{
                transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
                transition: isDragging ? 'none' : 'transform 0.15s ease-out',
                transformOrigin: 'center center',
              }}
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl border border-zinc-800/80 filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
            />
          </div>

          {/* Left Arrow Navigation (if > 1 image) */}
          {imageList.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-zinc-900/80 hover:bg-amber-500 hover:text-zinc-950 text-white border border-zinc-700/80 flex items-center justify-center transition-all duration-200 shadow-2xl backdrop-blur-md z-30"
              title="Gambar Sebelumnya (Panah Kiri)"
            >
              <FaChevronLeft size={16} />
            </button>
          )}

          {/* Right Arrow Navigation (if > 1 image) */}
          {imageList.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-zinc-900/80 hover:bg-amber-500 hover:text-zinc-950 text-white border border-zinc-700/80 flex items-center justify-center transition-all duration-200 shadow-2xl backdrop-blur-md z-30"
              title="Gambar Selanjutnya (Panah Kanan)"
            >
              <FaChevronRight size={16} />
            </button>
          )}
        </div>

        {/* ── Bottom Section: Floating Control HUD & Filmstrip ── */}
        <div className="relative z-30 flex flex-col items-center gap-3 pb-4 pt-2 px-4 bg-gradient-to-t from-zinc-950 via-zinc-950/90 to-transparent">
          {/* Floating Controls Toolbar HUD */}
          <div className="flex items-center gap-2 md:gap-3 bg-zinc-900/90 backdrop-blur-md border border-zinc-700/80 px-4 py-2 rounded-2xl shadow-2xl">
            {/* Zoom Out Button */}
            <button
              onClick={handleZoomOut}
              disabled={scale <= 1}
              className="p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Zoom Out (-)"
            >
              <FaSearchMinus size={14} />
            </button>

            {/* Zoom Percentage Display */}
            <span className="text-xs font-mono font-bold text-amber-400 min-w-[46px] text-center">
              {Math.round(scale * 100)}%
            </span>

            {/* Zoom In Button */}
            <button
              onClick={handleZoomIn}
              disabled={scale >= 4}
              className="p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Zoom In (+)"
            >
              <FaSearchPlus size={14} />
            </button>

            <div className="w-[1px] h-4 bg-zinc-700 mx-1" />

            {/* Reset / Fit Button */}
            <button
              onClick={handleResetZoom}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono transition-colors"
              title="Reset Zoom (1:1 / Fit)"
            >
              <FaUndo size={11} />
              <span className="hidden sm:inline">Fit</span>
            </button>

            {/* Direct Link to Raw High-Res Asset */}
            <a
              href={currentImg.resolved}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl text-zinc-400 hover:text-amber-400 hover:bg-zinc-800 transition-colors"
              title="Buka File Gambar Asli di Tab Baru"
            >
              <FaExternalLinkAlt size={12} />
            </a>
          </div>

          {/* Filmstrip Thumbnail Strip (if > 1 image) */}
          {imageList.length > 1 && (
            <div
              className="flex items-center gap-2 max-w-full overflow-x-auto px-4 py-1.5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 backdrop-blur-md"
              style={{ scrollbarWidth: 'thin' }}
            >
              {imageList.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => switchImage(idx)}
                  className={`relative w-14 h-10 md:w-16 md:h-11 rounded-lg overflow-hidden border-2 transition-all duration-200 shrink-0 ${
                    activeIdx === idx
                      ? 'border-amber-500 ring-2 ring-amber-500/40 scale-105 opacity-100'
                      : 'border-zinc-800 hover:border-zinc-600 opacity-50 hover:opacity-90'
                  }`}
                  title={`Lihat ${img.name}`}
                >
                  <img
                    src={img.resolved}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-0 right-0 bg-zinc-950/90 text-[9px] font-mono text-amber-400 px-1 rounded-tl">
                    {idx + 1}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </AnimatePresence>
  );
};


/* ─────────────────────────────────────────────
   PROJECT DETAIL MODAL
───────────────────────────────────────────── */
const ProjectDetailModal = ({ project, onClose, onOpenGallery }) => {
  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 md:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-zinc-950/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl z-10 max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/90">
            <div className="flex items-center gap-2.5">
              <span className="text-[10px] font-mono tracking-widest text-amber-500 uppercase bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
                {project.category}
              </span>
              {project.badge && (
                <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded-full border border-zinc-700">
                  {project.badge}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <FaTimes size={14} />
            </button>
          </div>

          {/* Modal Scrollable Body */}
          <div className="p-6 overflow-y-auto flex flex-col gap-6" style={{ scrollbarWidth: 'thin' }}>
            {/* Visual Thumbnail Frame */}
            <ProjectThumbnail project={project} onClickGallery={onOpenGallery} />

            {/* Title & Description */}
            <div>
              <h3 className="text-2xl md:text-3xl font-black text-white leading-tight mb-3">
                {project.title}
              </h3>
              <p className="text-sm text-zinc-300 leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Key Feature Highlights */}
            {project.highlights && project.highlights.length > 0 && (
              <div className="flex flex-col gap-2.5 bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-4">
                <h4 className="text-xs font-mono uppercase tracking-widest text-amber-500 font-bold flex items-center gap-2">
                  <FaLayerGroup size={12} /> Fitur & Keunggulan Utama
                </h4>
                <ul className="flex flex-col gap-2">
                  {project.highlights.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300 leading-normal">
                      <FaCheckCircle size={13} className="text-amber-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tech Stack */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2 font-bold">
                Teknologi yang Digunakan
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.stack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-mono bg-zinc-800 border border-zinc-700/80 text-amber-400 px-3 py-1 rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-5 border-t border-zinc-800 bg-zinc-950/80 flex items-center gap-3">
            {project.live_demo && project.live_demo !== '#' ? (
              <a
                href={project.live_demo}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-amber-500 text-zinc-950 font-black text-xs rounded-2xl hover:bg-amber-400 transition-colors"
              >
                <FaExternalLinkAlt size={12} /> Live Demo Project
              </a>
            ) : (
              <button
                disabled
                className="flex-1 py-3 bg-zinc-800 text-zinc-500 font-bold text-xs rounded-2xl cursor-not-allowed opacity-60 flex items-center justify-center gap-2"
              >
                <FaExternalLinkAlt size={12} /> Demo Internal / Offline
              </button>
            )}

            {project.repository && project.repository !== '#' ? (
              <a
                href={project.repository}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 px-5 py-3 bg-zinc-800 text-zinc-200 border border-zinc-700 font-bold text-xs rounded-2xl hover:bg-zinc-700 transition-colors"
              >
                <FaGithub size={14} /> Repository Code
              </a>
            ) : null}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

/* ─────────────────────────────────────────────
   DESKTOP PROJECT CARD (Full-Width Immersive Showcase Card)
───────────────────────────────────────────── */
const DesktopProjectCard = ({ project, index, onOpenDetail, onOpenGallery }) => {
  const isEven = index % 2 === 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: 0.05 }}
      className={`group relative w-full bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 md:p-8 lg:p-10 flex flex-col ${
        isEven ? 'lg:flex-row-reverse' : 'lg:flex-row'
      } gap-8 lg:gap-12 items-center hover:border-amber-500/40 hover:shadow-2xl hover:shadow-amber-500/5 transition-all duration-300 overflow-hidden`}
    >
      {/* Subtle Ambient Radial Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-500/[0.07] via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* ── Left/Right: Large Mockup Frame Thumbnail (55% width) ── */}
      <div className="w-full lg:w-[55%] shrink-0">
        <ProjectThumbnail
          project={project}
          heightClass="h-56 sm:h-72 md:h-80 lg:h-[340px]"
          onClickGallery={onOpenGallery}
          onClickDetail={onOpenDetail}
        />
      </div>

      {/* ── Right/Left: Story, Highlights & Actions Panel (45% width) ── */}
      <div className="w-full lg:w-[45%] flex flex-col justify-between gap-5">
        <div className="flex flex-col gap-3">
          {/* Header Row */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono tracking-widest text-amber-400 uppercase font-bold bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                {project.category}
              </span>
              {project.badge && (
                <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800/80 px-2.5 py-1 rounded-full border border-zinc-700">
                  {project.badge}
                </span>
              )}
            </div>
            <span className="text-xs font-mono text-zinc-600 font-black">
              {String(index + 1).padStart(2, '0')}
            </span>
          </div>

          {/* Project Title */}
          <h3
            onClick={() => onOpenDetail(project)}
            className="text-2xl md:text-3xl font-black text-white leading-tight hover:text-amber-400 cursor-pointer transition-colors"
          >
            {project.title}
          </h3>

          {/* Description */}
          <p className="text-xs md:text-sm text-zinc-300 leading-relaxed">
            {project.description}
          </p>

          {/* Key Feature Highlights */}
          {project.highlights && project.highlights.length > 0 && (
            <div className="flex flex-col gap-2 bg-zinc-950/70 p-4 rounded-2xl border border-zinc-800/80">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500/90 font-bold flex items-center gap-1.5 mb-0.5">
                <FaLayerGroup size={11} /> Fitur & Keunggulan
              </span>
              <ul className="flex flex-col gap-1.5">
                {project.highlights.map((item, hIdx) => (
                  <li key={hIdx} className="flex items-start gap-2.5 text-xs text-zinc-300 leading-normal">
                    <FaCheckCircle size={12} className="text-amber-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Stack Pills & CTA Actions */}
        <div className="flex flex-col gap-4 pt-2 border-t border-zinc-800/80">
          {/* Tech Stack */}
          <div className="flex flex-wrap gap-1.5">
            {project.stack.map((t, i) => (
              <span key={i} className="text-[10px] font-mono bg-zinc-800/90 border border-zinc-700/60 text-zinc-300 px-2.5 py-1 rounded-md">
                {t}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 pt-1">
            <button
              onClick={() => onOpenDetail(project)}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-amber-500 text-zinc-950 text-xs font-black rounded-xl hover:bg-amber-400 active:scale-95 transition-all shadow-lg shadow-amber-500/10"
            >
              <FaEye size={12} /> Detail & Rincian
            </button>

            <button
              onClick={() => onOpenGallery(project)}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-bold rounded-xl transition-all"
              title="Lihat Screenshot Penuh"
            >
              <FaImages size={13} />
              <span className="hidden sm:inline">Gallery</span>
            </button>

            {project.live_demo && project.live_demo !== '#' && (
              <a
                href={project.live_demo}
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 text-xs rounded-xl transition-colors"
                title="Live Demo Website"
              >
                <FaExternalLinkAlt size={13} />
              </a>
            )}

            {project.repository && project.repository !== '#' && (
              <a
                href={project.repository}
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 text-xs rounded-xl transition-colors"
                title="Source Code GitHub"
              >
                <FaGithub size={15} />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────
   MOBILE PROJECT CARD (Full-Width Vertical Case Study Card)
───────────────────────────────────────────── */
const MobileProjectCard = ({ project, index, onOpenDetail, onOpenGallery }) => (
  <motion.div
    initial={{ opacity: 0, y: 25 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-20px' }}
    transition={{ duration: 0.5 }}
    className="w-full bg-zinc-900/95 border border-zinc-800 rounded-3xl p-4.5 flex flex-col gap-4 relative overflow-hidden shadow-xl"
  >
    {/* Top accent line */}
    <div className="h-[2px] w-full -mx-4.5 -mt-4.5 mb-1" style={{ background: 'linear-gradient(90deg, #f59e0b 0%, transparent 80%)' }} />

    {/* Thumbnail Frame */}
    <div className="w-full">
      <ProjectThumbnail
        project={project}
        heightClass="h-44 sm:h-52 w-full"
        onClickGallery={onOpenGallery}
        onClickDetail={onOpenDetail}
      />
    </div>

    {/* Project Info */}
    <div className="flex flex-col gap-3">
      {/* Header Tag Row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase font-bold bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
            {project.category}
          </span>
          {project.badge && (
            <span className="text-[9px] font-mono text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded-full border border-zinc-700">
              {project.badge}
            </span>
          )}
        </div>
        <span className="text-xs font-mono text-zinc-600 font-black">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      {/* Title */}
      <h3
        onClick={() => onOpenDetail(project)}
        className="text-lg sm:text-xl font-black text-white leading-tight hover:text-amber-400 cursor-pointer transition-colors"
      >
        {project.title}
      </h3>

      {/* Description */}
      <p className="text-xs text-zinc-300 leading-relaxed line-clamp-3">
        {project.description}
      </p>

      {/* Highlights (Top 2 items) */}
      {project.highlights && project.highlights.length > 0 && (
        <div className="flex flex-col gap-1.5 bg-zinc-950/70 p-3 rounded-2xl border border-zinc-800/80">
          {project.highlights.slice(0, 2).map((item, hIdx) => (
            <div key={hIdx} className="flex items-start gap-2 text-[11px] text-zinc-300">
              <FaCheckCircle size={11} className="text-amber-500 shrink-0 mt-0.5" />
              <span className="truncate">{item}</span>
            </div>
          ))}
        </div>
      )}

      {/* Tech Stack */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {project.stack.slice(0, 4).map((t, i) => (
          <span key={i} className="text-[10px] font-mono bg-zinc-800/90 border border-zinc-700/60 text-zinc-300 px-2 py-0.5 rounded-md">
            {t}
          </span>
        ))}
        {project.stack.length > 4 && (
          <span className="text-[10px] font-mono text-zinc-500 px-1 py-0.5">
            +{project.stack.length - 4}
          </span>
        )}
      </div>

      {/* CTA Buttons Row */}
      <div className="flex items-center gap-2 pt-2 border-t border-zinc-800/80">
        <button
          onClick={() => onOpenDetail(project)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-amber-500 text-zinc-950 text-xs font-black rounded-xl hover:bg-amber-400 active:scale-95 transition-all shadow-md shadow-amber-500/10"
        >
          <FaEye size={12} /> Detail & Rincian
        </button>

        <button
          onClick={() => onOpenGallery(project)}
          className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-bold rounded-xl active:scale-95 transition-all"
          title="Lihat Screenshot"
        >
          <FaImages size={13} />
          <span>Foto</span>
        </button>

        {project.live_demo && project.live_demo !== '#' && (
          <a
            href={project.live_demo}
            target="_blank"
            rel="noreferrer"
            className="p-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 text-xs rounded-xl active:scale-95 transition-colors"
            title="Live Demo Website"
          >
            <FaExternalLinkAlt size={12} />
          </a>
        )}

        {project.repository && project.repository !== '#' && (
          <a
            href={project.repository}
            target="_blank"
            rel="noreferrer"
            className="p-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 text-xs rounded-xl active:scale-95 transition-colors"
            title="Source Code GitHub"
          >
            <FaGithub size={14} />
          </a>
        )}
      </div>
    </div>
  </motion.div>
);

/* ─────────────────────────────────────────────
   MAIN
───────────────────────────────────────────── */
const BentoGrid = () => {
  const [activeProject, setActiveProject] = useState(0);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProjectModal, setSelectedProjectModal] = useState(null);
  const [selectedGalleryModal, setSelectedGalleryModal] = useState(null);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const allTechs = Object.values(data.technical_stack).flat();

  const categories = [
    { id: 'all', label: 'Semua Proyek' },
    { id: 'web', label: 'Web & Interaktif' },
    { id: 'ai', label: 'AI & Bot' },
    { id: 'mobile', label: 'Mobile & Extension' },
  ];

  // Curated Bento ordering for perfectly balanced layout with 0 orphan slots
  const bentoProjectOrder = [1, 3, 5, 2, 4, 7, 8, 6, 9, 10, 11];
  const featuredIds = [1, 2, 4, 6];

  const sortedAllProjects = bentoProjectOrder
    .map(id => data.projects.find(p => p.id === id))
    .filter(Boolean);

  const displayedProjects = activeCategory === 'all'
    ? sortedAllProjects
    : data.projects.filter(p => p.categoryGroup === activeCategory);

  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-zinc-100" style={{ cursor: 'none' }}>
      <CustomCursor />

      {/* Project Detail Modal */}
      <ProjectDetailModal
        project={selectedProjectModal}
        onClose={() => setSelectedProjectModal(null)}
        onOpenGallery={(proj) => setSelectedGalleryModal(proj)}
      />

      {/* Image Gallery Modal */}
      <ImageGalleryModal
        project={selectedGalleryModal}
        onClose={() => setSelectedGalleryModal(null)}
      />

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
          TECH STACK & EXPERTISE
      ══════════════════════════════════════ */}
      <section className="relative border-y border-zinc-800/50 overflow-hidden" style={{ background: 'rgba(18,18,20,0.5)' }}>
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-amber-500/[0.03] rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-12 py-16 md:py-24">
          {/* section header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 md:mb-12">
            <div>
              <p className="text-[10px] font-mono tracking-[0.25em] text-amber-500 uppercase mb-1">02 • Expertise</p>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">Tech & Skills</h2>
              <p className="text-xs md:text-sm text-zinc-400 mt-2 max-w-lg">
                Keahlian teknis dan perangkat lunak yang saya gunakan untuk merancang, membangun, dan mengotomasi sistem skala modern.
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2 text-[11px] font-mono text-zinc-500 bg-zinc-900/80 border border-zinc-800 px-3.5 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>Full-Stack & AI Focused</span>
            </div>
          </div>

          {/* Bento Tech Grid */}
          <BentoTechSection />
        </div>
      </section>

      {/* ══════════════════════════════════════
          PROJECTS / SELECTED WORK
      ══════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-5 md:px-12 py-16 md:py-28">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-12">
          <div>
            <p className="text-[10px] font-mono tracking-[0.25em] text-amber-500 uppercase mb-1">03</p>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">Selected Work</h2>
            <p className="text-xs md:text-sm text-zinc-400 mt-2 max-w-lg">
              Kumpulan proyek terpilih yang mencakup aplikasi web interaktif, bot AI, tool monitoring, dan mobile app.
            </p>
          </div>

          <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-wide hidden md:block">
            Klik card untuk detail & screenshot ✦
          </p>
        </div>

        {/* Category Filter Navigation Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map((cat) => {
            const count = cat.id === 'all'
              ? data.projects.length
              : data.projects.filter(p => p.categoryGroup === cat.id).length;
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setActiveProject(0);
                }}
                className={`relative px-4 py-2 rounded-full text-xs font-mono transition-all whitespace-nowrap flex items-center gap-2 ${
                  isActive
                    ? 'bg-amber-500 text-zinc-950 font-bold shadow-lg shadow-amber-500/20'
                    : 'bg-zinc-900/90 text-zinc-400 border border-zinc-800 hover:border-zinc-700 hover:text-white'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  isActive ? 'bg-zinc-950/20 text-zinc-950 font-black' : 'bg-zinc-800 text-zinc-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Desktop full-width showcase list */}
        <div className="hidden md:flex flex-col gap-10 lg:gap-14">
          {displayedProjects.map((p, i) => (
            <DesktopProjectCard
              key={p.id}
              project={p}
              index={i}
              onOpenDetail={(proj) => setSelectedProjectModal(proj)}
              onOpenGallery={(proj) => setSelectedGalleryModal(proj)}
            />
          ))}
        </div>

        {/* Mobile: Full-Width Vertical Stream (Natural scroll flow) */}
        <div className="md:hidden flex flex-col gap-6">
          {displayedProjects.map((p, i) => (
            <MobileProjectCard
              key={p.id}
              project={p}
              index={i}
              onOpenDetail={(proj) => setSelectedProjectModal(proj)}
              onOpenGallery={(proj) => setSelectedGalleryModal(proj)}
            />
          ))}
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
