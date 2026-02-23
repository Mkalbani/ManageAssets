import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, updateUserRole, updateProfile } from '../lib/api/usersApi';
import { getReportsSummary } from '../lib/api/reportsApi';
import { User, ReportSummary } from '../lib/types/users';
import { useAuthStore } from '../store/authStore';

export function useUsersList() {
  return useQuery<User[]>({
    queryKey: ['users'],
    queryFn: getUsers,
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      updateUserRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<User> }) =>
      updateProfile(id, payload),
    onSuccess: (updatedUser) => {
      // Update Zustand store to keep sidebar in sync
      useAuthStore.getState().setUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useReportsSummary() {
  return useQuery<ReportSummary>({
    queryKey: ['reportsSummary'],
    queryFn: getReportsSummary,
  });
}
