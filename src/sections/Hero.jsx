import { motion } from 'framer-motion';
import { ArrowRight, Download } from 'lucide-react';

export default function Hero() {
  return (
    <section id="hero" className="min-h-screen flex flex-col justify-center px-6 md:px-20 pt-20 relative">

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl z-10"
      >
        {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300 mb-8 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Available for new opportunities
        </div> */}
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[1.1] mb-8 bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
          Hi! I'm 
          <span className="italic font-serif text-white/90"> Daxhiel</span>
        </h1>
        
        {/* <p className="text-lg md:text-xl text-slate-muted max-w-xl leading-relaxed mb-10">
          I'm a Frontend Engineer crafting high-performance web applications with a focus on motion, design, and user experience.
        </p> */}
        
        {/* <div className="flex flex-wrap gap-4">
          <a href="#work" className="px-8 py-4 bg-white text-black rounded-full font-medium hover:bg-slate-200 transition-colors flex items-center gap-2 group">
            View Work
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <a href={resume} download='resume.pdf'>
            <button className="px-8 py-4 bg-white/5 text-white border border-white/10 rounded-full font-medium hover:bg-white/10 transition-colors flex items-center gap-2">
              Download Resume
              <Download className="w-4 h-4" />
            </button>
          </a>
        </div> */}
      </motion.div>
    </section>
  );
}
