import React, { useState, useEffect } from 'react';
import { generateQuizQuestion } from '../services/geminiService';
import { saveQuizState, getQuizState } from '../services/storageService';
import { QuizQuestion } from '../types';

const Quiz: React.FC = () => {
  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = getQuizState();
    if (savedState && savedState.question) {
      setQuestion(savedState.question);
      setSelectedOption(savedState.selectedOption);
      setShowResult(savedState.showResult);
    }
  }, []);

  const fetchQuestion = async () => {
    setLoading(true);
    setShowResult(false);
    setSelectedOption(null);
    setQuestion(null);
    
    // Clear state while loading
    saveQuizState({ question: null, selectedOption: null, showResult: false });

    const q = await generateQuizQuestion();
    setQuestion(q);
    
    // Save new question state
    if (q) {
      saveQuizState({ question: q, selectedOption: null, showResult: false });
    }
    
    setLoading(false);
  };

  const handleOptionSelect = (index: number) => {
    if (showResult) return;
    
    setSelectedOption(index);
    setShowResult(true);

    // Save updated state with result
    saveQuizState({ 
      question: question, 
      selectedOption: index, 
      showResult: true 
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 pb-24 flex flex-col items-center">
       <h2 className="text-3xl font-bold text-white mb-8 border-l-4 border-neon-blue pl-4 w-full">Banco de Questões</h2>

       <div className="w-full bg-glass backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
         {/* Decoration */}
         <div className="absolute top-0 right-0 w-32 h-32 bg-neon-blue/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

         {!question && !loading && (
           <div className="text-center py-12">
             <div className="text-6xl mb-6">🧠</div>
             <h3 className="text-2xl font-bold text-white mb-2">Pronto para testar?</h3>
             <p className="text-slate-400 mb-8">Gere perguntas de nível avançado baseadas em casos clínicos e teoria.</p>
             <button 
               onClick={fetchQuestion}
               className="px-8 py-3 bg-neon-blue text-black font-bold rounded-full hover:shadow-[0_0_20px_rgba(0,243,255,0.5)] transition-all"
             >
               Gerar Nova Questão
             </button>
           </div>
         )}

         {loading && (
           <div className="py-20 text-center">
              <div className="inline-block w-12 h-12 border-4 border-neon-blue border-r-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-slate-300">A IA está formulando um desafio...</p>
           </div>
         )}

         {question && !loading && (
           <div className="animate-fade-in">
             <span className="text-xs font-bold text-neon-blue uppercase tracking-widest mb-2 block">Questão Gerada</span>
             <h3 className="text-xl md:text-2xl font-semibold text-white mb-6 leading-snug">{question.question}</h3>
             
             <div className="space-y-3">
               {question.options.map((opt, idx) => {
                 let btnClass = "w-full text-left p-4 rounded-xl border border-white/10 text-slate-200 transition-all hover:bg-white/5";
                 
                 if (showResult) {
                   if (idx === question.correctAnswer) {
                     btnClass = "w-full text-left p-4 rounded-xl border border-green-500/50 bg-green-500/20 text-white font-bold";
                   } else if (idx === selectedOption && idx !== question.correctAnswer) {
                     btnClass = "w-full text-left p-4 rounded-xl border border-red-500/50 bg-red-500/20 text-red-100 opacity-70";
                   } else {
                     btnClass = "w-full text-left p-4 rounded-xl border border-white/5 bg-transparent text-slate-500 opacity-50";
                   }
                 }

                 return (
                   <button
                     key={idx}
                     onClick={() => handleOptionSelect(idx)}
                     disabled={showResult}
                     className={btnClass}
                   >
                     <span className="inline-block w-6 font-bold opacity-50 mr-2">{String.fromCharCode(65 + idx)}.</span>
                     {opt}
                   </button>
                 );
               })}
             </div>

             {showResult && (
               <div className="mt-6 p-4 bg-blue-900/30 border border-blue-500/30 rounded-xl">
                 <h4 className="font-bold text-neon-blue mb-1">Explicação:</h4>
                 <p className="text-slate-300 text-sm">{question.explanation}</p>
                 <button 
                  onClick={fetchQuestion}
                  className="mt-4 w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-colors"
                 >
                   Próxima Questão &rarr;
                 </button>
               </div>
             )}
           </div>
         )}
       </div>
    </div>
  );
};

export default Quiz;