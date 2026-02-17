import BentoCard from '../components/BentoCard';
import SectionHeader from '../components/SectionHeader';
import { ExternalLink, Github } from 'lucide-react';

import kwii from '../assets/kwii.png'
import { image, title } from 'framer-motion/client';

const projects = [
  {
    title: "Kalshi Arbitrage Bot",
    description: "Built a Python-based arbitrage engine that integrates with the Kalshi API to scan prediction markets and algorithmically detect risk-free “bundle long” and “bundle short” opportunities.",
    tags: ["Python", "REST", "Market Analysis", "Algorithms"],
    image: "data:image/jpeg;base64,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",
    github: "https://github.com/daxhielp/karbot",
    colSpan: "col-span-1 md:col-span-2"
  },
  {
    title: "Fake News Detector",
    description: "Built an end-to-end fake-news classification pipeline using Jupyter notebooks and exported the trained model as an ONNX artifact for portable inference. Deployed with React and FastAPI.",
    tags: ["Python", "NLP", "FastAPI", "React", "ML"],
    image: "https://live.staticflickr.com/6033/6277209256_934f20da10_b.jpg",
    link: "https://fake-or-not-6rcp.vercel.app/",
    github: "https://github.com/daxhielp/fake-or-not",
    colSpan: "col-span-1",
  },
  {
    title: "Kwii",
    description: "Designed and implemented an interpreted programming language from scratch with a recursive descent parser, abstract syntax tree evaluator, and runtime environment.",
    tags: ["Java", "Compilers", "AST", "Data Structures"],
    image: kwii,
    link: null,
    github: "https://github.com/daxhielp/kwii-main",
    colSpan: "col-span-1",
  },
  {
    title: "Flappy Bird Bot",
    description: "An AI model that plays flappy bird on its own.",
    tags: ["NEAT", "Reinforcement Learning", "Python"],
    image: "https://live.staticflickr.com/65535/49203125457_a0184cae7a_o.png",
    link: null,
    github: null,
    colSpan: "col-span-1",
  }
];

export default function SelectedWorks() {
  return (
    <section id="work" className="px-6 md:px-20 py-24">
      <SectionHeader title="Personal Projects" subtitle="Featured" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <BentoCard key={index} className={project.colSpan} delay={index * 0.1}>
            <div className="flex flex-col h-full">
              <div className="mb-6 relative rounded-xl overflow-hidden aspect-video group-hover:shadow-2xl transition-shadow bg-surface">
                <img src={project.image} alt={project.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="p-3 bg-white text-black rounded-full hover:scale-110 transition-transform">
                      <ExternalLink size={20} />
                    </a>
                  )}
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/20 text-white backdrop-blur-md rounded-full hover:scale-110 transition-transform">
                      <Github size={20} />
                    </a>
                  )}
                </div>
              </div>

              <div className="mt-auto">
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map(tag => (
                    <span key={tag} className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-md bg-white/5 border border-white/5 text-slate-400">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{project.description}</p>
              </div>
            </div>
          </BentoCard>
        ))}
      </div>
    </section>
  );
}
