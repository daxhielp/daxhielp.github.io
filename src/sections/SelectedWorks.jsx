import BentoCard from '../components/BentoCard';
import SectionHeader from '../components/SectionHeader';
import { ExternalLink, Github } from 'lucide-react';

const projects = [
  {
    title: "Fake News Detector",
    description: "An ML-powered model that scans a news article and analyzes text structure to determine if it is fake. Deployed with with React and FastAPI.",
    tags: ["Python", "NLP", "FastAPI", "React"],
    image: "https://live.staticflickr.com/6033/6277209256_934f20da10_b.jpg",
    link: null,
    github: null,
    colSpan: "col-span-1 md:col-span-2",
  },
  {
    title: "Kwii",
    description: "A fully interpreted programming language with a built-in REPL. Enables dynamic typing and OOP.",
    tags: ["Java", "Abstract Syntax Trees", "Data Structures"],
    image: "https://daxhielp.github.io/portfolio/assets/kwii-B2C3m0Ra.jpg",
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
