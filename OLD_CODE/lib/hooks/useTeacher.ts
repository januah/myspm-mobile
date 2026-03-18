import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { teacherService } from "@/lib/api/services/teacherService";

export function useTeachers() {
  return useQuery({
    queryKey: ["teachers"],
    queryFn: () => teacherService.getTeachers(),
    staleTime: 1000 * 60 * 30,
  });
}

export function useTeacherPosts(teacherId?: string) {
  return useQuery({
    queryKey: ["teacher-posts", teacherId],
    queryFn: () => teacherService.getTeacherPosts(teacherId),
    staleTime: 1000 * 60 * 5,
  });
}

export function useFollowTeacher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (teacherId: string) => teacherService.followTeacher(teacherId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    },
  });
}

export function useUnfollowTeacher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (teacherId: string) => teacherService.unfollowTeacher(teacherId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    },
  });
}
