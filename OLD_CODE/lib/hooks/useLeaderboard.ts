import { useQuery } from "@tanstack/react-query";
import { leaderboardService } from "@/lib/api/services/leaderboardService";

export function useSchoolLeaderboard() {
  return useQuery({
    queryKey: ["leaderboard-school"],
    queryFn: () => leaderboardService.getSchoolLeaderboard(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useNationalLeaderboard() {
  return useQuery({
    queryKey: ["leaderboard-national"],
    queryFn: () => leaderboardService.getNationalLeaderboard(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useSchoolRanking() {
  return useQuery({
    queryKey: ["school-ranking"],
    queryFn: () => leaderboardService.getSchoolRanking(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useSubjectLeaderboard(subjectId: string | null) {
  return useQuery({
    queryKey: ["leaderboard-subject", subjectId],
    queryFn: () => leaderboardService.getSubjectLeaderboard(subjectId!),
    enabled: !!subjectId,
    staleTime: 1000 * 60 * 5,
  });
}
