import SectionHeader from '../components/SectionHeader';
import { motion } from 'framer-motion';

import resume from '../assets/daxhiel_resume.pdf';

const experiences = [
  {
    role: "Freelance Developer",
    period: "2026 - Present",
    description: "Develop full stack applications, integrating third party tools such as Apps Script, Excel, etc, bringing platforms to production with Vercel + Render and using Tailwind CSS and Framer Motion",
  }
];

export default function Experience() {
  return (
    <section id="experience" className="px-6 md:px-20 py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface/5 to-transparent pointer-events-none" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
        <div>
          <SectionHeader title="Experience" subtitle="Career" />
          <p className="text-slate-muted max-w-sm mb-8">
            My programming journey has been driven by my passion for solving problems and learning new ideas.
          </p>
          <a href={resume} download='resume.pdf' className="text-sm font-medium border-b border-white pb-1 hover:text-slate-300 transition-colors inline-block">
            View Full Resume
          </a>
        </div>

        <div className="space-y-12">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group pl-6 border-l border-white/10 hover:border-blue-600/50 transition-colors"
            >
              <div className="flex justify-between items-baseline mb-2">
                <h4 className="text-lg font-medium text-white group-hover:text-blue-600 transition-colors">{exp.role}</h4>
                <span className="text-xs text-slate-500 font-mono">{exp.period}</span>
              </div>
              <div className="text-sm text-slate-400 mb-3">{exp.company}</div>
              <p className="text-sm text-slate-500 leading-relaxed max-w-md">{exp.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
