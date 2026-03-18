import { apiClient } from "../client";
import type { ScanResponse, GradingResponse } from "../types";

export const scanService = {
  async scanQuestion(imageUri: string): Promise<ScanResponse> {
    const formData = new FormData();
    formData.append("image", {
      uri: imageUri,
      type: "image/jpeg",
      name: "question.jpg",
    } as any);
    return apiClient.postFormData("/scan/question", formData);
  },

  async gradeAnswer(imageUri: string, questionId: string): Promise<GradingResponse> {
    const formData = new FormData();
    formData.append("image", {
      uri: imageUri,
      type: "image/jpeg",
      name: "answer.jpg",
    } as any);
    formData.append("questionId", questionId);
    return apiClient.postFormData("/scan/grade", formData);
  },
};
