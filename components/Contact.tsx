import React from 'react';

const Contact: React.FC = () => {
  return (
    <div className="w-full max-w-xl mx-auto p-4 pb-24">
      <h2 className="text-3xl font-bold text-white mb-8 border-l-4 border-neon-blue pl-4">Contato</h2>
      
      <div className="bg-glass backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-lg">
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Seu Nome</label>
            <input 
              type="text" 
              className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-neon-blue transition-colors"
              placeholder="Dr. Exemplo"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email Acadêmico</label>
            <input 
              type="email" 
              className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-neon-blue transition-colors"
              placeholder="aluno@universidade.edu"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Mensagem</label>
            <textarea 
              rows={4}
              className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-neon-blue transition-colors"
              placeholder="Dúvidas sobre a plataforma ou sugestões..."
            ></textarea>
          </div>

          <button className="w-full py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/20 transition-all flex items-center justify-center gap-2">
            <span>Enviar Mensagem</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;