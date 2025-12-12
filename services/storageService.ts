import { ExamCorrection, QuizState } from '../types';

const STORAGE_KEY = 'ODONTO_FUTURE_HISTORY_V1';
const QUIZ_STATE_KEY = 'ODONTO_FUTURE_QUIZ_STATE_V1';

export const getHistory = (): ExamCorrection[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to load history", e);
    return [];
  }
};

export const saveCorrectionToHistory = (analysis: string, sources: string[], imagePreview: string | null): ExamCorrection[] => {
  const newRecord: ExamCorrection = {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    analysis,
    sources,
    imagePreview: imagePreview || undefined
  };

  const history = getHistory();
  const updatedHistory = [newRecord, ...history];

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  } catch (e) {
    // If quota exceeded, try saving without the image (which is the heavy part)
    console.warn("Storage quota exceeded, trying to save without image...");
    const recordWithoutImage = { ...newRecord, imagePreview: undefined };
    const historyWithoutImage = [recordWithoutImage, ...history];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(historyWithoutImage));
    } catch (e2) {
      console.error("Could not save history even without image", e2);
    }
  }

  return getHistory(); // Return fresh list
};

export const deleteCorrectionFromHistory = (id: string): ExamCorrection[] => {
  const history = getHistory();
  const updated = history.filter(item => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const clearHistory = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

// --- Quiz Persistence ---

export const saveQuizState = (state: QuizState): void => {
  try {
    localStorage.setItem(QUIZ_STATE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save quiz state", e);
  }
};

export const getQuizState = (): QuizState | null => {
  try {
    const stored = localStorage.getItem(QUIZ_STATE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (e) {
    console.error("Failed to load quiz state", e);
    return null;
  }
};

export const clearQuizState = (): void => {
  localStorage.removeItem(QUIZ_STATE_KEY);
};