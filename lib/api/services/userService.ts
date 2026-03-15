import { apiClient } from "../client";
import type { UserProfile, Achievement, SubjectProgress, TeacherPost } from "../types";

export const userService = {
  async getCurrentUser(): Promise<UserProfile> {
    return apiClient.get("/users/me");
  },

  async getUserAchievements(): Promise<Achievement[]> {
    return apiClient.get("/users/me/achievements");
  },

  async getSubjectProgress(): Promise<SubjectProgress[]> {
    return apiClient.get("/users/me/progress");
  },

  async getFollowedTeachersPosts(): Promise<TeacherPost[]> {
    return apiClient.get("/users/me/teachers/posts");
  },

  async updateUserProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    return apiClient.post("/users/me", data);
  },
};
