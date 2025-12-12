import React from 'react';
import { AppSection } from '../types';

interface HeaderProps {
  currentSection: AppSection;
  onNavigate: (section: AppSection) => void;
}

const Header: React.FC<HeaderProps> = ({ currentSection, onNavigate }) => {
  const navItems = [
    { id: AppSection.HOME, label: 'Início', icon: '🏠' },
    { id: AppSection.SUMMARIES, label: 'Resumos', icon: '📚' },
    { id: AppSection.QUIZ, label: 'Questões', icon: '🧩' },
    { id: AppSection.GRADER, label: 'Corretor', icon: '📸' },
    { id: AppSection.CONTACT, label: 'Contato', icon: '✉️' },
  ];

  return (
    <>
      {/* Desktop Sticky Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[#050b14]/80 backdrop-blur-md border-b border-white/5 hidden md:block">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div 
            className="text-2xl font-black text-white cursor-pointer tracking-tighter"
            onClick={() => onNavigate(AppSection.HOME)}
          >
            ODONTO<span className="text-neon-blue">AI</span>
          </div>
          <nav className="flex space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`text-sm font-semibold uppercase tracking-wide transition-colors ${currentSection === item.id ? 'text-neon-blue' : 'text-slate-400 hover:text-white'}`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full z-50 bg-[#050b14]/90 backdrop-blur-xl border-t border-white/10 md:hidden pb-safe">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${currentSection === item.id ? 'text-neon-blue' : 'text-slate-500'}`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
};

export default Header;