import React, { useState, useRef, useEffect } from 'react';
import { Chat } from "@google/genai";
import { createChatSession } from '../services/geminiService';
import { ChatMessage } from '../types';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Olá, futuro dentista! 🦷 Sou a IA da OdontoFuture. Como posso ajudar nos seus estudos hoje?' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Ref to store the chat session so it persists between renders without causing re-renders
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize chat session on mount
    chatSessionRef.current = createChatSession();
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || !chatSessionRef.current) return;

    const userMsg = inputText;
    setInputText('');
    
    // Add user message to UI
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const response = await chatSessionRef.current.sendMessage({ message: userMsg });
      const text = response.text || "Desculpe, não consegui processar sua resposta.";
      
      setMessages(prev => [...prev, { role: 'model', text: text }]);
    } catch (error) {
      console.error("Chat error", error);
      setMessages(prev => [...prev, { role: 'model', text: "Erro de conexão. Tente novamente." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-20 md:bottom-8 right-4 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[90vw] md:w-96 h-[60vh] md:h-[500px] bg-[#0a111e]/95 backdrop-blur-xl border border-neon-blue/30 rounded-2xl shadow-[0_0_30px_rgba(0,243,255,0.2)] flex flex-col overflow-hidden animate-float">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-4 border-b border-white/10 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-bold text-white tracking-wider">Odonto<span className="text-neon-blue">Assistant</span></span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-700">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-neon-blue/20 text-white border border-neon-blue/30 rounded-br-none' 
                      : 'bg-white/5 text-slate-200 border border-white/10 rounded-bl-none'
                  }`}
                >
                  <div className="prose prose-invert prose-sm max-w-none">
                     {/* Simple rendering, in a real app use a markdown parser */}
                     {msg.text.split('\n').map((line, i) => <p key={i} className="mb-1 last:mb-0">{line}</p>)}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/5 p-3 rounded-2xl rounded-bl-none flex gap-1 items-center">
                  <div className="w-1.5 h-1.5 bg-neon-blue rounded-full animate-bounce delay-0"></div>
                  <div className="w-1.5 h-1.5 bg-neon-blue rounded-full animate-bounce delay-150"></div>
                  <div className="w-1.5 h-1.5 bg-neon-blue rounded-full animate-bounce delay-300"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 bg-slate-900/50 border-t border-white/10 flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Digite sua dúvida..."
              className="flex-1 bg-black/40 text-white text-sm rounded-xl px-4 py-3 border border-white/10 focus:border-neon-blue focus:outline-none transition-colors"
            />
            <button 
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="bg-neon-blue text-black p-3 rounded-xl hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-5 h-5 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </button>
          </form>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group p-4 rounded-full shadow-[0_0_20px_rgba(0,243,255,0.4)] transition-all transform hover:scale-110 active:scale-95 flex items-center justify-center ${isOpen ? 'bg-slate-800 text-white border border-white/20' : 'bg-neon-blue text-black'}`}
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        ) : (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
        )}
        
        {!isOpen && (
          <span className="absolute right-full mr-3 bg-white text-black px-2 py-1 rounded text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Ajuda IA
          </span>
        )}
      </button>
    </div>
  );
};

export default ChatBot;