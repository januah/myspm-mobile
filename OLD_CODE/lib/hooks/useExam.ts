import { useQuery } from "@tanstack/react-query";
import { examService } from "@/lib/api/services/examService";

export function useExamQuestions() {
  return useQuery({
    queryKey: ["exam-questions"],
    queryFn: () => examService.getExamQuestions(),
  });
}

export function useSubmitExam() {
  return {
    mutate: (answers: number[]) => examService.submitExamAnswers(answers),
  };
}

export function useAvailableExams() {
  return useQuery({
    queryKey: ["available-exams"],
    queryFn: () => examService.getAvailableExams(),
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}
