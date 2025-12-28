import React from 'react';
import { motion } from 'framer-motion';

const navItems = [
  { name: 'Home', href: '#hero' },
  { name: 'Projects', href: '#work' },
  { name: 'Experience', href: '#experience' },
  { name: 'Connect', href: '#contact' },
];

export default function Navbar() {
  return (
    <div className="fixed top-6 left-0 right-0 flex justify-center z-40 pointer-events-none">
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="glass-panel px-6 py-3 rounded-full flex gap-8 items-center shadow-lg shadow-black/20 pointer-events-auto"
      >
        {navItems.map((item) => (
          <a 
            key={item.name} 
            href={item.href}
            className="text-xs uppercase tracking-widest font-medium text-slate-muted hover:text-white transition-colors duration-300 relative group"
          >
            {item.name}
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full" />
          </a>
        ))}
      </motion.nav>
    </div>
  );
}
