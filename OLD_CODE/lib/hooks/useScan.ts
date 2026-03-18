import { useMutation } from "@tanstack/react-query";
import { scanService } from "@/lib/api/services/scanService";

export function useScanQuestion() {
  return useMutation({
    mutationFn: (imageUri: string) => scanService.scanQuestion(imageUri),
  });
}

export function useGradeAnswer() {
  return useMutation({
    mutationFn: ({ imageUri, questionId }: { imageUri: string; questionId: string }) =>
      scanService.gradeAnswer(imageUri, questionId),
  });
}
