import { QuizQuestion } from "../types";

// Mock implementation to replace AI API
// const ai = new GoogleGenAI({ apiKey: process.env.API_KEY }); 

export const generateSummary = async (topic: string): Promise<string> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return `### Resumo Técnico: ${topic} (Modo Demonstração)

Este é um resumo simulado gerado pelo sistema offline da OdontoFuture.

*   **Definição Clínica:** ${topic} envolve o estudo e tratamento de estruturas dentárias e tecidos anexos.
*   **Protocolos Principais:**
    *   Diagnóstico por imagem e exame clínico detalhado.
    *   Planejamento reverso para casos complexos.
    *   Biossegurança rigorosa em todos os procedimentos.
*   **Inovações Recentes:**
    *   Uso de escaneamento intraoral 3D.
    *   Materiais bioativos e regenerativos.
    *   Teleodontologia e monitoramento remoto.

> Nota: Para conteúdo gerado por IA em tempo real, é necessária a integração com a API Gemini.`;
};

export const generateQuizQuestion = async (topic: string = "Odontologia Geral"): Promise<QuizQuestion | null> => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Mock Question Bank
  const questions: QuizQuestion[] = [
    {
      question: "Em relação à anestesia local em odontologia, qual o mecanismo de ação principal dos anestésicos do tipo amida?",
      options: [
        "Bloqueio dos canais de cálcio na membrana nervosa",
        "Bloqueio dos canais de sódio voltagem-dependentes",
        "Aumento da permeabilidade ao potássio",
        "Inibição da síntese de prostaglandinas"
      ],
      correctAnswer: 1,
      explanation: "Os anestésicos locais atuam impedindo a geração e condução do impulso nervoso. Seu sítio de ação primário é a membrana celular, onde bloqueiam os canais de sódio, impedindo o influxo deste íon necessário para a despolarização."
    },
    {
      question: "Qual das seguintes alterações sistêmicas requer profilaxia antibiótica prévia a procedimentos invasivos, segundo a AHA?",
      options: [
        "Prolapso da válvula mitral sem regurgitação",
        "Histórico de Febre Reumática sem cardiopatia",
        "Portadores de próteses valvares cardíacas",
        "Marcapasso cardíaco convencional"
      ],
      correctAnswer: 2,
      explanation: "A profilaxia antibiótica é indicada para pacientes com próteses valvares cardíacas, endocardite infecciosa prévia, e certas cardiopatias congênitas, devido ao alto risco de resultados adversos de uma endocardite."
    }
  ];

  return questions[Math.floor(Math.random() * questions.length)];
};

export const gradeExamImage = async (base64Image: string, mimeType: string): Promise<{ text: string, sources: string[] }> => {
  await new Promise(resolve => setTimeout(resolve, 2000));

  return {
    text: `---
### Questão 1
**Tipo:** Objetiva
**Enunciado Identificado:** "Paciente de 45 anos, gênero feminino, comparece à clínica..."

**RESPOSTA CORRETA:** 
C) Pulpite Irreversível Sintomática.

**Origem:** Banca Vunesp / 2023 / Concurso Prefeitura de SP
**Explicação:** O quadro descrito de dor espontânea, pulsátil e exacerbada pelo calor, que não cede com analgésicos comuns, é clássico de pulpite irreversível sintomática. O tratamento indicado é a biopulpectomia.

---
### Questão 2
**Tipo:** Subjetiva
**Enunciado Identificado:** "Descreva os princípios da osteointegração..."

**RESPOSTA CORRETA:** 
A osteointegração é a conexão estrutural e funcional direta entre o osso vivo ordenado e a superfície de um implante submetido a carga funcional. Seus princípios incluem: biocompatibilidade do material (titânio), desenho do implante, acabamento de superfície, leito ósseo saudável, técnica cirúrgica atraumática e controle de carga (estabilidade primária).

**Origem:** Questão Dissertativa Padrão USP
**Explicação:** Baseado nos estudos de Brånemark.
---

*(Nota: Esta é uma análise simulada. A IA foi desligada conforme solicitado.)*`,
    sources: ["https://www.vunesp.com.br", "https://pubmed.ncbi.nlm.nih.gov/"]
  };
};

// Mock Chat Session Interface
export interface MockChatSession {
  sendMessage: (params: { message: string }) => Promise<{ text: string }>;
}

export const createChatSession = (): MockChatSession => {
  return {
    sendMessage: async ({ message }) => {
      await new Promise(resolve => setTimeout(resolve, 800));
      return {
        text: `**Resposta Automática:** Recebi sua mensagem: "${message}". \n\nComo a API de Inteligência Artificial foi desativada, não posso gerar uma resposta contextualizada no momento. Estou operando em modo offline/demonstração. 🤖⛔`
      };
    }
  };
};