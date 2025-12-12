import { GoogleGenAI, Type, Chat } from "@google/genai";
import { QuizQuestion } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Models
const FAST_MODEL = 'gemini-2.5-flash';
// We use gemini-2.5-flash for vision + search capabilities
const VISION_MODEL = 'gemini-2.5-flash'; 

export const generateSummary = async (topic: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: FAST_MODEL,
      contents: `Forneça um resumo técnico, conciso e estruturado sobre o tópico de odontologia: "${topic}". Use marcadores para pontos chave. O tom deve ser profissional e educativo.`,
    });
    return response.text || "Não foi possível gerar o resumo no momento.";
  } catch (error) {
    console.error("Error generating summary:", error);
    return "Ocorreu um erro ao comunicar com a IA. Verifique sua conexão ou tente novamente em alguns instantes.";
  }
};

export const generateQuizQuestion = async (topic: string = "Odontologia Geral"): Promise<QuizQuestion | null> => {
  try {
    const response = await ai.models.generateContent({
      model: FAST_MODEL,
      contents: `Gere uma questão de múltipla escolha difícil sobre ${topic} para estudantes de odontologia.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "4 opções de resposta"
            },
            correctAnswer: { 
              type: Type.INTEGER, 
              description: "O índice da resposta correta (0-3)" 
            },
            explanation: { type: Type.STRING, description: "Explicação breve da resposta correta" }
          },
          required: ["question", "options", "correctAnswer", "explanation"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as QuizQuestion;
  } catch (error) {
    console.error("Error generating quiz:", error);
    return null;
  }
};

export const gradeExamImage = async (base64Image: string, mimeType: string): Promise<{ text: string, sources: string[] }> => {
  try {
    const response = await ai.models.generateContent({
      model: VISION_MODEL,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType
            }
          },
          {
            text: `Atue como um Corretor de Elite de Odontologia. Analise TODO o conteúdo desta imagem, identificando TODAS as questões presentes (sejam 1 ou várias).

            Sua missão:
            1. Ler o arquivo completo e identificar cada questão (Objetiva ou Subjetiva/Dissertativa).
            2. Para questões OBJETIVAS: Identificar a alternativa correta com 100% de certeza.
            3. Para questões SUBJETIVAS: Fornecer a resposta ideal/gabarito esperado.
            4. Identificar a numeração original da questão na imagem.
            5. Cruzar dados online para encontrar a banca/concurso de origem.

            Formato de Resposta Obrigatório (Markdown):
            
            ---
            ### Questão [Número identificado na imagem]
            **Tipo:** [Objetiva / Subjetiva]
            **Enunciado Identificado:** [Breve trecho do início da questão]
            
            **RESPOSTA CORRETA:** 
            [Se Objetiva: Letra e Texto da alternativa]
            [Se Subjetiva: A resposta dissertativa ideal e completa]

            **Origem:** [Banca/Ano/Concurso se encontrado]
            **Explicação:** [Justificativa técnica baseada na literatura]
            ---
            (Repita a estrutura acima para TODAS as questões encontradas na imagem)`
          }
        ]
      },
      config: {
        tools: [{ googleSearch: {} }], // Enable Google Search Grounding
      }
    });

    const text = response.text || "Não foi possível analisar a imagem.";
    
    // Extract sources from grounding metadata
    const sources: string[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web?.uri) {
          sources.push(chunk.web.uri);
        }
      });
    }

    // Remove duplicate URLs
    const uniqueSources = [...new Set(sources)];

    return { text, sources: uniqueSources };
  } catch (error) {
    console.error("Error grading exam:", error);
    return { 
      text: "Erro ao processar a imagem. Certifique-se de que a imagem é clara e tente novamente.", 
      sources: [] 
    };
  }
};

export const createChatSession = (): Chat => {
  return ai.chats.create({
    model: FAST_MODEL,
    config: {
      systemInstruction: "Você é o assistente virtual inteligente da plataforma 'OdontoFuture AI'. Sua função é ajudar estudantes de odontologia. Você deve responder dúvidas sobre matérias odontológicas (anatomia, periodontia, cirurgia, etc), explicar termos técnicos e guiar o usuário sobre como usar o app (temos Resumos, Quiz e Corretor de Provas). Seja conciso, futurista e educado. Use emojis ocasionalmente. Responda sempre em Markdown."
    }
  });
};