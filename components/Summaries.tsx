import React, { useState } from 'react';
import { generateSummary } from '../services/geminiService';
import { SummaryTopic } from '../types';

const TOPICS: SummaryTopic[] = [
  { id: '1', title: 'Anatomia Dental', imageUrl: 'https://picsum.photos/400/200?random=1', prompt: 'Anatomia Dental e morfologia' },
  { id: '2', title: 'Periodontia', imageUrl: 'https://picsum.photos/400/200?random=2', prompt: 'Doenças periodontais e tratamentos' },
  { id: '3', title: 'Endodontia', imageUrl: 'https://picsum.photos/400/200?random=3', prompt: 'Tratamento de canal e patologias pulpares' },
  { id: '4', title: 'Cirurgia Oral', imageUrl: 'https://picsum.photos/400/200?random=4', prompt: 'Exodontia e cirurgias menores' },
];

const Summaries: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleTopicClick = async (topic: SummaryTopic) => {
    if (selectedTopic === topic.id) return;
    
    setSelectedTopic(topic.id);
    setLoading(true);
    setContent('');
    
    const summary = await generateSummary(topic.prompt);
    setContent(summary);
    setLoading(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 pb-24">
      <h2 className="text-3xl font-bold text-white mb-8 border-l-4 border-neon-blue pl-4">Resumos Inteligentes</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {TOPICS.map((topic) => (
          <div 
            key={topic.id}
            onClick={() => handleTopicClick(topic)}
            className={`cursor-pointer group relative rounded-2xl overflow-hidden border transition-all duration-300 ${selectedTopic === topic.id ? 'border-neon-blue shadow-[0_0_15px_rgba(0,243,255,0.3)]' : 'border-white/10 hover:border-white/30'}`}
          >
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all z-10"></div>
            <img src={topic.imageUrl} alt={topic.title} className="w-full h-32 object-cover transform group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black to-transparent z-20">
              <h3 className="text-white font-semibold">{topic.title}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="min-h-[300px] w-full bg-glass backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 relative">
        {!selectedTopic && (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
             <svg className="w-12 h-12 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
             <p>Selecione um tópico acima para gerar um resumo instantâneo.</p>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-8 h-8 border-4 border-neon-blue border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-neon-blue animate-pulse">Consultando base de dados neural...</p>
          </div>
        )}

        {content && !loading && (
          <div className="prose prose-invert max-w-none">
            <h3 className="text-2xl text-neon-blue mb-4">{TOPICS.find(t => t.id === selectedTopic)?.title}</h3>
            <div className="whitespace-pre-line text-slate-200 leading-relaxed">
              {content}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Summaries;