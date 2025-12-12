import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Summaries from './components/Summaries';
import Quiz from './components/Quiz';
import ExamGrader from './components/ExamGrader';
import Contact from './components/Contact';
import ChatBot from './components/ChatBot';
import { AppSection } from './types';

const App: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<AppSection>(AppSection.HOME);

  const renderSection = () => {
    switch (currentSection) {
      case AppSection.HOME:
        return <Hero onNavigate={setCurrentSection} />;
      case AppSection.SUMMARIES:
        return <Summaries />;
      case AppSection.QUIZ:
        return <Quiz />;
      case AppSection.GRADER:
        return <ExamGrader />;
      case AppSection.CONTACT:
        return <Contact />;
      default:
        return <Hero onNavigate={setCurrentSection} />;
    }
  };

  return (
    <div className="min-h-screen text-slate-200 selection:bg-neon-blue selection:text-black">
      <Header currentSection={currentSection} onNavigate={setCurrentSection} />
      
      <main className="pt-0 md:pt-20">
        {renderSection()}
      </main>

      {/* Global AI Chatbot */}
      <ChatBot />
      
      {/* Background fixed elements for aesthetics */}
      <div className="fixed top-20 right-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-cyan-900/10 rounded-full blur-[80px] pointer-events-none -z-10"></div>
    </div>
  );
};

export default App;