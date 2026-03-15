import { apiClient } from "../client";
import type { LeaderboardEntry, SchoolRanking } from "../types";

export const leaderboardService = {
  async getSchoolLeaderboard(): Promise<LeaderboardEntry[]> {
    return apiClient.get("/leaderboard/school");
  },

  async getNationalLeaderboard(): Promise<LeaderboardEntry[]> {
    return apiClient.get("/leaderboard/national");
  },

  async getSchoolRanking(): Promise<SchoolRanking[]> {
    return apiClient.get("/leaderboard/schools");
  },

  async getSubjectLeaderboard(subject: string): Promise<LeaderboardEntry[]> {
    return apiClient.get(`/leaderboard/subject/${subject}`);
  },
};
