import React from 'react';
import { AppSection } from '../types';

interface HeroProps {
  onNavigate: (section: AppSection) => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  return (
    <div className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://picsum.photos/1920/1080?grayscale&blur=2')] bg-cover bg-center opacity-20 z-0"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-neon-blue rounded-full blur-[120px] opacity-20 z-0"></div>

      <div className="relative z-10 max-w-3xl space-y-8 animate-float">
        <div className="inline-block p-2 px-4 rounded-full border border-neon-blue/30 bg-glass backdrop-blur-md mb-4">
          <span className="text-neon-blue text-xs font-bold tracking-widest uppercase">Plataforma de Estudo Inteligente</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-200 to-neon-blue drop-shadow-[0_0_10px_rgba(0,243,255,0.3)]">
          ODONTO<br/>FUTURE
        </h1>
        
        <p className="text-lg md:text-xl text-slate-300 max-w-xl mx-auto leading-relaxed">
          A revolução no aprendizado da Odontologia. Inteligência Artificial avançada para resumos, correção de provas e simulados em tempo real.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <button 
            onClick={() => onNavigate(AppSection.SUMMARIES)}
            className="px-8 py-4 bg-neon-blue text-black font-bold rounded-xl shadow-[0_0_20px_rgba(0,243,255,0.4)] hover:shadow-[0_0_30px_rgba(0,243,255,0.6)] transition-all transform hover:-translate-y-1"
          >
            Começar Agora
          </button>
          <button 
            onClick={() => onNavigate(AppSection.GRADER)}
            className="px-8 py-4 bg-transparent border border-white/20 text-white font-bold rounded-xl backdrop-blur-sm hover:bg-white/10 transition-all"
          >
            Corrigir Prova
          </button>
        </div>
      </div>
      
      {/* Decorative Grid */}
      <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-[#050b14] to-transparent z-10"></div>
    </div>
  );
};

export default Hero;