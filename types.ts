export enum AppSection {
  HOME = 'HOME',
  SUMMARIES = 'SUMMARIES',
  QUIZ = 'QUIZ',
  GRADER = 'GRADER',
  CONTACT = 'CONTACT'
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number; // Index of the correct option
  explanation: string;
}

export interface SummaryTopic {
  id: string;
  title: string;
  imageUrl: string;
  prompt: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isImage?: boolean;
}

export interface ExamCorrection {
  id: string;
  timestamp: number;
  analysis: string;
  sources?: string[]; // Array of source URLs found by Google Search
  imagePreview?: string; // Optional to handle storage limits
}

export interface QuizState {
  question: QuizQuestion | null;
  selectedOption: number | null;
  showResult: boolean;
}