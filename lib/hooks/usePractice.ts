import { useQuery } from "@tanstack/react-query";
import { practiceService } from "@/lib/api/services/practiceService";

export function useSubjects() {
  return useQuery({
    queryKey: ["subjects"],
    queryFn: () => practiceService.getSubjects(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useTopics(subjectId: string | null) {
  return useQuery({
    queryKey: ["topics", subjectId],
    queryFn: () => practiceService.getTopics(subjectId!),
    enabled: !!subjectId,
    staleTime: 1000 * 60 * 10,
  });
}

export function usePracticeQuestions(
  subject: string | null,
  topic: string | null,
  difficulty: string | null,
  count: number,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ["practice-questions", { subject, topic, difficulty, count }],
    queryFn: () =>
      practiceService.getPracticeQuestions(
        subject!,
        topic!,
        difficulty!,
        count
      ),
    enabled: enabled && !!subject && !!topic && !!difficulty,
  });
}

export function useSubmitPracticeSession() {
  return {
    mutate: (sessionId: string, answers: number[]) =>
      practiceService.submitPracticeResults(sessionId, answers),
  };
}
