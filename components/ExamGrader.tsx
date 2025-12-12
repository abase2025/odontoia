import React, { useState, useRef, useEffect } from 'react';
import { gradeExamImage } from '../services/geminiService';
import { getHistory, saveCorrectionToHistory, deleteCorrectionFromHistory } from '../services/storageService';
import { ExamCorrection } from '../types';

const ExamGrader: React.FC = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [sources, setSources] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [history, setHistory] = useState<ExamCorrection[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setAnalysis(''); 
        setSources([]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!imagePreview) return;
    
    setLoading(true);
    // Remove "data:image/jpeg;base64," header
    const base64Data = imagePreview.split(',')[1];
    const mimeType = imagePreview.substring(imagePreview.indexOf(':') + 1, imagePreview.indexOf(';'));

    const result = await gradeExamImage(base64Data, mimeType);
    setAnalysis(result.text);
    setSources(result.sources);
    
    // Save to history automatically
    const updatedHistory = saveCorrectionToHistory(result.text, result.sources, imagePreview);
    setHistory(updatedHistory);
    
    setLoading(false);
  };

  const loadFromHistory = (item: ExamCorrection) => {
    setAnalysis(item.analysis);
    setSources(item.sources || []);
    setImagePreview(item.imagePreview || null);
    // Scroll to top to see result
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = deleteCorrectionFromHistory(id);
    setHistory(updated);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 pb-24">
      <h2 className="text-3xl font-bold text-white mb-2 border-l-4 border-neon-blue pl-4">Corretor de Provas IA</h2>
      <p className="text-slate-400 mb-8 pl-5">Envie uma foto de uma questão ou prova e a IA buscará a origem e a resposta exata.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Upload Section */}
        <div className="flex flex-col gap-4">
          <div 
            className={`relative w-full h-64 md:h-96 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center overflow-hidden transition-all ${imagePreview ? 'border-neon-blue bg-black' : 'border-slate-700 bg-slate-900/50 hover:bg-slate-800'}`}
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="text-center cursor-pointer p-8 w-full h-full flex flex-col items-center justify-center"
              >
                <div className="text-5xl mb-4">📸</div>
                <p className="text-white font-semibold">Toque para enviar foto</p>
                <p className="text-xs text-slate-500 mt-2">Suporta JPG, PNG</p>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
            
            {imagePreview && !loading && (
              <button 
                onClick={() => {
                  setImagePreview(null);
                  setAnalysis('');
                  setSources([]);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="absolute top-2 right-2 bg-black/60 text-white p-2 rounded-full hover:bg-red-500/80 transition-colors"
              >
                ✕
              </button>
            )}
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!imagePreview || loading}
            className={`w-full py-4 rounded-xl font-bold uppercase tracking-wider transition-all ${!imagePreview || loading ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-neon-blue text-black shadow-[0_0_20px_rgba(0,243,255,0.4)] hover:shadow-[0_0_30px_rgba(0,243,255,0.6)]'}`}
          >
            {loading ? 'Consultando Bases...' : 'Corrigir e Buscar Origem'}
          </button>
        </div>

        {/* Results Section */}
        <div className="bg-glass backdrop-blur-md border border-white/10 rounded-2xl p-6 min-h-[300px] max-h-[600px] overflow-y-auto flex flex-col">
          {!analysis && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-60">
              <span className="text-4xl mb-4">⚡</span>
              <p>O resultado da análise aparecerá aqui.</p>
            </div>
          )}

          {loading && (
             <div className="h-full flex flex-col items-center justify-center space-y-4">
               <div className="w-full h-2 bg-slate-800 rounded overflow-hidden max-w-xs">
                 <div className="h-full bg-neon-blue animate-pulse w-full origin-left"></div>
               </div>
               <p className="text-neon-blue text-sm font-mono text-center">
                 Analisando imagem...<br/>
                 Cruzando dados na internet...
               </p>
             </div>
          )}

          {analysis && (
            <div className="prose prose-invert prose-sm md:prose-base max-w-none flex-1">
              <h3 className="text-neon-blue border-b border-neon-blue/30 pb-2 mb-4">Relatório de Precisão</h3>
              <div className="whitespace-pre-wrap text-slate-200">
                {analysis}
              </div>

              {sources.length > 0 && (
                <div className="mt-6 pt-4 border-t border-white/10">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Fontes Verificadas</h4>
                  <ul className="space-y-1">
                    {sources.map((source, idx) => (
                      <li key={idx}>
                        <a 
                          href={source} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-neon-blue hover:text-white truncate block transition-colors"
                        >
                          🔗 {source}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* History Section */}
      {history.length > 0 && (
        <div className="animate-fade-in mt-12">
           <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
             <span className="text-neon-blue">📂</span> Histórico de Consultas
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             {history.map((item) => (
               <div 
                 key={item.id}
                 onClick={() => loadFromHistory(item)}
                 className="bg-slate-900/50 border border-white/10 rounded-xl p-4 cursor-pointer hover:border-neon-blue/50 hover:bg-slate-800 transition-all group relative overflow-hidden"
               >
                 <div className="flex items-start justify-between mb-2">
                    <span className="text-xs text-slate-400 font-mono">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                    <button 
                      onClick={(e) => handleDelete(e, item.id)}
                      className="text-slate-600 hover:text-red-400 z-10 p-1"
                    >
                      ✕
                    </button>
                 </div>
                 
                 <div className="flex gap-3">
                   {item.imagePreview ? (
                     <img src={item.imagePreview} alt="Thumb" className="w-16 h-16 object-cover rounded-lg border border-white/5 bg-black" />
                   ) : (
                     <div className="w-16 h-16 bg-slate-800 rounded-lg flex items-center justify-center border border-white/5">
                       <span className="text-xl">📄</span>
                     </div>
                   )}
                   <div className="flex-1 overflow-hidden">
                     <p className="text-sm text-slate-300 line-clamp-3">
                       {item.analysis.replace(/[#*]/g, '')}
                     </p>
                     {item.sources && item.sources.length > 0 && (
                       <p className="text-[10px] text-neon-blue mt-1">
                         ✓ {item.sources.length} fontes encontradas
                       </p>
                     )}
                   </div>
                 </div>
               </div>
             ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default ExamGrader;