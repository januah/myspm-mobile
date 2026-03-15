import { apiClient } from "../client";
import type { Subject, PracticeSessionResponse } from "../types";

export const practiceService = {
  async getSubjects(): Promise<Subject[]> {
    return apiClient.get("/subjects");
  },

  async getTopics(subjectId: string): Promise<string[]> {
    return apiClient.get(`/subjects/${subjectId}/topics`);
  },

  async getPracticeQuestions(
    subject: string,
    topic: string,
    difficulty: string,
    count: number
  ): Promise<PracticeSessionResponse> {
    const params = new URLSearchParams({
      subject,
      topic,
      difficulty,
      count: count.toString(),
    });
    return apiClient.get(`/practice/questions?${params}`);
  },

  async submitPracticeResults(
    sessionId: string,
    answers: number[]
  ): Promise<{ score: number }> {
    return apiClient.post(`/practice/sessions/${sessionId}/submit`, { answers });
  },
};
