import { Mail, Linkedin, Copy, Check, Github } from 'lucide-react';
import { useState } from 'react';

export default function Footer() {
  const [copied, setCopied] = useState(false);
  const email = "daxperugorria@gmail.com";

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer id="contact" className="px-6 md:px-20 py-24 pb-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(120%_85%_at_50%_45%,rgba(15,23,42,0.2)_0%,rgba(15,23,42,0.14)_28%,rgba(2,6,23,0.08)_56%,rgba(2,6,23,0)_84%),radial-gradient(85%_65%_at_50%_72%,rgba(30,41,59,0.08)_0%,rgba(2,6,23,0)_78%)] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-4xl md:text-6xl font-bold mb-12 tracking-tight">Let's connect!</h2>
        
        <div className="flex justify-center items-center gap-6 mb-16">
          <a href="https://www.linkedin.com/in/daxhielp" className="p-4 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/5 hover:scale-110 transition-transform"><Linkedin className="w-6 h-6" /></a>
          <a href="https://github.com/daxhielp" className="p-4 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/5 hover:scale-110 transition-transform"><Github className="w-6 h-6" /></a>
          <a href={`mailto:${email}`} className="p-4 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/5 hover:scale-110 transition-transform"><Mail className="w-6 h-6" /></a>
        </div>

        <button 
          onClick={handleCopy}
          className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all active:scale-95"
        >
          <span className="text-slate-300">{email}</span>
          {copied ? <Check className="w-4 h-4 text-blue-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
        </button>
        
        <div className="mt-24 text-xs text-slate-600 uppercase tracking-widest">
          © {new Date().getFullYear()} Daxhiel Perugorria Ruciel
        </div>
      </div>
    </footer>
  );
}
