/**
 * Question Adapter Utility
 * Handles language-specific question text extraction from API responses
 */

import { DEFAULT_LANGUAGE } from '@/i18n/config';

/**
 * Question object structure with translations
 */
export interface QuestionWithTranslations {
  question_key?: string;
  id?: string;
  translations?: Record<string, string>;
  question_text?: string;
  question_text_en?: string;
  question_text_ms?: string;
  question_text_zh?: string;
  [key: string]: any;
}

/**
 * Extract language-specific question text
 * Handles multiple response formats from backend
 *
 * @param {QuestionWithTranslations} question - Question object from API
 * @param {string} language - User's preferred language code
 * @returns {string} - Question text in preferred language with fallback to English
 */
export function getQuestionText(
  question: QuestionWithTranslations,
  language: string = DEFAULT_LANGUAGE,
): string {
  if (!question) {
    return '';
  }

  // Format 1: Backend returns translations object with language codes
  if (question.translations && typeof question.translations === 'object') {
    // Try to get in preferred language
    if (question.translations[language]) {
      return question.translations[language];
    }
    // Fallback to English
    if (question.translations[DEFAULT_LANGUAGE]) {
      return question.translations[DEFAULT_LANGUAGE];
    }
    // Fallback to first available language
    const firstKey = Object.keys(question.translations)[0];
    if (firstKey && question.translations[firstKey]) {
      return question.translations[firstKey];
    }
  }

  // Format 2: Backend returns separate fields for each language
  const fieldKey = `question_text_${language}`;
  if (question[fieldKey]) {
    return question[fieldKey];
  }

  // Format 3: Fallback to English field
  if (question.question_text_en) {
    return question.question_text_en;
  }

  // Format 4: Last resort - generic question_text field
  if (question.question_text) {
    return question.question_text;
  }

  return '';
}

/**
 * Get all available translations for a question
 *
 * @param {QuestionWithTranslations} question - Question object from API
 * @returns {Record<string, string>} - Map of language codes to question text
 */
export function getAvailableTranslations(
  question: QuestionWithTranslations,
): Record<string, string> {
  const translations: Record<string, string> = {};

  // Extract from translations object
  if (question.translations && typeof question.translations === 'object') {
    Object.assign(translations, question.translations);
  }

  // Extract from individual language fields
  const languageFields = ['question_text_en', 'question_text_ms', 'question_text_zh'];
  languageFields.forEach((field) => {
    if (question[field]) {
      const languageCode = field.replace('question_text_', '');
      translations[languageCode] = question[field];
    }
  });

  return translations;
}

/**
 * Check if a question has translation for a specific language
 *
 * @param {QuestionWithTranslations} question - Question object from API
 * @param {string} language - Language code to check
 * @returns {boolean} - True if translation exists
 */
export function hasTranslation(
  question: QuestionWithTranslations,
  language: string,
): boolean {
  // Check in translations object
  if (question.translations?.[language]) {
    return true;
  }

  // Check in individual language field
  const fieldKey = `question_text_${language}`;
  if (question[fieldKey]) {
    return true;
  }

  return false;
}

/**
 * Normalize a question object to always have translations object
 * Converts old format to new format for consistent handling
 *
 * @param {QuestionWithTranslations} question - Question object to normalize
 * @returns {QuestionWithTranslations} - Normalized question with translations object
 */
export function normalizeQuestion(
  question: QuestionWithTranslations,
): QuestionWithTranslations {
  if (!question) {
    return question;
  }

  // If already has translations object, return as-is
  if (question.translations && typeof question.translations === 'object') {
    return question;
  }

  // Build translations object from individual fields
  const translations: Record<string, string> = {};
  const languageFields = ['question_text_en', 'question_text_ms', 'question_text_zh'];

  languageFields.forEach((field) => {
    if (question[field]) {
      const languageCode = field.replace('question_text_', '');
      translations[languageCode] = question[field];
    }
  });

  // If no translations found, use generic question_text
  if (Object.keys(translations).length === 0 && question.question_text) {
    translations[DEFAULT_LANGUAGE] = question.question_text;
  }

  // Return normalized question
  return {
    ...question,
    translations,
  };
}

/**
 * Batch normalize multiple questions
 *
 * @param {QuestionWithTranslations[]} questions - Array of question objects
 * @returns {QuestionWithTranslations[]} - Array of normalized questions
 */
export function normalizeQuestions(
  questions: QuestionWithTranslations[],
): QuestionWithTranslations[] {
  return questions.map((q) => normalizeQuestion(q));
}
