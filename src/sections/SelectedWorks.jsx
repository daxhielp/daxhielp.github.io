import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ExternalLink, Github } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';

const projects = [
  {
    title: "AudioPrint",
    type: "Signal Processing",
    year: "2026",
    description: "A from-scratch Python implementation of the Shazam-style audio fingerprinting algorithm. Identifies songs from short audio clips using STFT spectrograms, spectral peak extraction, and combinatorial hash matching — with speed-invariant matching for slowed/reverbed audio.",
    tech: ["Python", "FastAPI", "React", "SQLite", "NumPy/SciPy"],
    github: "https://github.com/daxhielp/audioprint",
  },
  {
    title: "Kalshi Arbitrage Bot",
    type: "FinTech",
    year: "2026",
    description: "A Python-based arbitrage engine that integrates with the Kalshi API to scan prediction markets and algorithmically detect risk-free “bundle long” and “bundle short” opportunities.",
    tech: ["Python", "REST", "Market Analysis", "Algorithms"],
    github: "https://github.com/daxhielp/karbot",
  },
  {
    title: "Fake News Detector",
    type: "Machine Learning",
    year: "2025",
    description: "An ML-powered engine that reads and performs sentiment analysis to identify whether a news article is fake or not.",
    tech: ["Python", "NLP", "FastAPI", "React", "ML"],
    link: "https://fake-or-not-6rcp.vercel.app/",
    github: "https://github.com/daxhielp/fake-or-not",
  },
  {
    title: "Flappy Bird Bot",
    type: "Artificial Intelligence",
    year: "2023",
    description: "An automated bot that uses evolutionary algorithms and reinforcement learning to learn and play the hit game \"Flappy Bird\"",
    tech: ["NEAT", "Reinforcement Learning", "Python"],
    github: null,
    link: null,
  },
  {
    title: "Kwii",
    type: "Compiler Design",
    year: "2025",
    description: "An interpreted programming language built from scratch on top of Java with a recursive descent parser, abstract syntax tree evaluator, and runtime environment.",
    tech: ["Java", "Compilers", "AST", "Data Structures"],
    github: "https://github.com/daxhielp/kwii-main",
    link: null,
  }
];

function ProjectRow({ project, isExpanded, onToggle }) {
  return (
    <div className="border-b border-zinc-800">
      <button
        onClick={onToggle}
        className="w-full py-8 flex flex-col md:flex-row md:items-center justify-between group transition-all duration-300 hover:bg-zinc-900/50 px-4 md:px-6"
      >
        <div className="flex items-center gap-4 mb-4 md:mb-0 transition-transform duration-300 group-hover:translate-x-1">
          <h3 className="text-xl md:text-2xl font-bold text-white whitespace-nowrap">{project.title}</h3>
          <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-[10px] uppercase tracking-wider text-zinc-400 font-medium">
            {project.type}
          </span>
        </div>

        <div className="flex items-center justify-between md:justify-end md:gap-12 w-full md:w-auto">
          <div className="hidden lg:flex gap-6">
            {project.tech.slice(0, 3).map((t) => (
              <span key={t} className="font-mono text-sm text-zinc-500 uppercase tracking-tight">
                {t}
              </span>
            ))}
          </div>
          
          <div className="flex items-center gap-6">
            <span className="font-mono text-sm text-zinc-600">{project.year}</span>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            >
              <ChevronDown className="w-5 h-5 text-zinc-500" />
            </motion.div>
          </div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 md:px-6 pb-12 pt-4 max-w-4xl">
              <p className="text-zinc-400 text-lg leading-relaxed mb-8">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-4">
                {project.github && (
                  <a 
                    href={project.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-full text-sm font-medium hover:bg-zinc-200 transition-colors"
                  >
                    <Github size={18} />
                    View Code
                  </a>
                )}
                {project.link && (
                  <a 
                    href={project.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 bg-zinc-800 text-white border border-zinc-700 rounded-full text-sm font-medium hover:bg-zinc-700 transition-colors"
                  >
                    <ExternalLink size={18} />
                    Live Demo
                  </a>
                )}
              </div>

              <div className="mt-8 flex flex-wrap gap-2 lg:hidden">
                {project.tech.map((t) => (
                  <span key={t} className="font-mono text-[10px] text-zinc-500 border border-zinc-800 px-2 py-1 rounded">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SelectedWorks() {
  const [expandedIndex, setExpandedIndex] = useState(0); // Default first one open for better UX

  return (
    <section id="work" className="px-6 md:px-20 py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface/5 to-transparent pointer-events-none" />
      <div className="relative z-10">
        <SectionHeader title="Featured Projects" subtitle="Featured" />

        <div className="mt-12 border-t border-white/5">
          {projects.map((project, index) => (
            <ProjectRow 
              key={project.title} 
              project={project} 
            isExpanded={expandedIndex === index}
            onToggle={() => setExpandedIndex(expandedIndex === index ? null : index)}
          />
        ))}
        </div>
      </div>
    </section>
  );
}
