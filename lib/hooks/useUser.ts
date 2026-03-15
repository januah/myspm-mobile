import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/lib/api/services/userService";
import type { UserProfile } from "@/lib/api/types";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: () => userService.getCurrentUser(),
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
}

export function useAchievements() {
  return useQuery({
    queryKey: ["achievements"],
    queryFn: () => userService.getUserAchievements(),
    staleTime: 1000 * 60 * 10,
  });
}

export function useSubjectProgress() {
  return useQuery({
    queryKey: ["subject-progress"],
    queryFn: () => userService.getSubjectProgress(),
    staleTime: 1000 * 60 * 10,
  });
}

export function useFollowedTeachersPosts() {
  return useQuery({
    queryKey: ["followed-teachers-posts"],
    queryFn: () => userService.getFollowedTeachersPosts(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<UserProfile>) => userService.updateUserProfile(data),
    onSuccess: (data) => {
      queryClient.setQueryData(["current-user"], data);
    },
  });
}
