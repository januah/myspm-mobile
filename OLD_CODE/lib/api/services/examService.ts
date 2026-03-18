import { apiClient } from "../client";
import type { ExamQuestion, Exam } from "../types";

export const examService = {
  async getExamQuestions(): Promise<ExamQuestion[]> {
    return apiClient.get("/exams/current/questions");
  },

  async submitExamAnswers(answers: number[]): Promise<{ score: number; total: number }> {
    return apiClient.post("/exams/current/submit", { answers });
  },

  async getAvailableExams(): Promise<Exam[]> {
    return apiClient.get("/exams");
  },
};
