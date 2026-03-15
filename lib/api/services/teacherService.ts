import { apiClient } from "../client";
import type { Teacher, TeacherPost } from "../types";

export const teacherService = {
  async getTeachers(): Promise<Teacher[]> {
    return apiClient.get("/teachers");
  },

  async getTeacherPosts(teacherId?: string): Promise<TeacherPost[]> {
    const endpoint = teacherId ? `/teachers/${teacherId}/posts` : "/posts";
    return apiClient.get(endpoint);
  },

  async followTeacher(teacherId: string): Promise<{ success: boolean }> {
    return apiClient.post(`/teachers/${teacherId}/follow`, {});
  },

  async unfollowTeacher(teacherId: string): Promise<{ success: boolean }> {
    return apiClient.post(`/teachers/${teacherId}/unfollow`, {});
  },
};
