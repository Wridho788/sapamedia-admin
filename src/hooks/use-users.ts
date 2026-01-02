import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@/api';
import { activityLogger } from '@/lib/activity-logger';
import { useAuth } from './use-auth';
import { toast } from 'sonner';
import type { Profile, UserRole } from '@/types/database';

// Query Keys Factory
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: string) => [...userKeys.lists(), { filters }] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  stats: (id: string) => [...userKeys.all, 'stats', id] as const,
};

// Get all users (for super_admin)
export function useUsers(filters?: {
  role?: UserRole;
  is_active?: boolean;
  limit?: number;
  offset?: number;
}) {
  const filterStr = JSON.stringify(filters || {});

  return useQuery({
    queryKey: userKeys.list(filterStr),
    queryFn: () => usersApi.getUsers(),
    // TODO: Add filtering on API side if needed
  });
}

// Get single user
export function useUser(userId: string) {
  return useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => usersApi.getUser(userId),
    enabled: !!userId,
  });
}

// Get user stats (articles, approvals, etc)
export function useUserStats(userId: string) {
  return useQuery({
    queryKey: userKeys.stats(userId),
    queryFn: () => usersApi.getUserStats(userId),
    enabled: !!userId,
  });
}

// Create user mutation
export function useCreateUser() {
  const queryClient = useQueryClient();
  const { authUser: currentUser } = useAuth();

  return useMutation({
    mutationFn: (userData: {
      email: string;
      password: string;
      full_name: string;
      role: UserRole;
    }) => usersApi.createUser(userData),
    onSuccess: async (data) => {
      // Invalidate users list
      await queryClient.invalidateQueries({ queryKey: userKeys.lists() });

      // Log activity
      if (currentUser?.id) {
        await activityLogger.log({
          user_id: currentUser.id,
          action: 'USER_CREATED',
          entity_type: 'user',
          entity_id: data.id,
          metadata: {
            role: data.role,
            full_name: data.full_name,
          },
        });
      }

      toast.success('User created successfully');
    },
    onError: (error) => {
      console.error('Error creating user:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to create user'
      );
    },
  });
}

// Update user mutation
export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { authUser: currentUser } = useAuth();

  return useMutation({
    mutationFn: ({
      userId,
      updates,
    }: {
      userId: string;
      updates: Partial<Profile>;
    }) => usersApi.updateUser(userId, updates),
    onSuccess: async (data, variables) => {
      // Invalidate user detail and list
      await queryClient.invalidateQueries({ 
        queryKey: userKeys.detail(variables.userId) 
      });
      await queryClient.invalidateQueries({ queryKey: userKeys.lists() });

      // Log activity
      if (currentUser?.id) {
        await activityLogger.log({
          user_id: currentUser.id,
          action: 'USER_UPDATED',
          entity_type: 'user',
          entity_id: variables.userId,
          metadata: {
            updated_fields: Object.keys(variables.updates),
          },
        });
      }

      toast.success('User updated successfully');
    },
    onError: (error) => {
      console.error('Error updating user:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to update user'
      );
    },
  });
}

// Deactivate user mutation
export function useDeactivateUser() {
  const queryClient = useQueryClient();
  const { authUser: currentUser } = useAuth();

  return useMutation({
    mutationFn: (userId: string) => usersApi.deactivateUser(userId),
    onSuccess: async (data, userId) => {
      // Invalidate user detail and list
      await queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) });
      await queryClient.invalidateQueries({ queryKey: userKeys.lists() });

      // Log activity
      if (currentUser?.id) {
        await activityLogger.log({
          user_id: currentUser.id,
          action: 'USER_DEACTIVATED',
          entity_type: 'user',
          entity_id: userId,
        });
      }

      toast.success('User deactivated successfully');
    },
    onError: (error) => {
      console.error('Error deactivating user:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to deactivate user'
      );
    },
  });
}

// Activate user mutation
export function useActivateUser() {
  const queryClient = useQueryClient();
  const { authUser: currentUser } = useAuth();

  return useMutation({
    mutationFn: (userId: string) => 
      usersApi.updateUser(userId, { is_active: true }),
    onSuccess: async (data, userId) => {
      // Invalidate user detail and list
      await queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) });
      await queryClient.invalidateQueries({ queryKey: userKeys.lists() });

      // Log activity
      if (currentUser?.id) {
        await activityLogger.log({
          user_id: currentUser.id,
          action: 'USER_ACTIVATED',
          entity_type: 'user',
          entity_id: userId,
        });
      }

      toast.success('User activated successfully');
    },
    onError: (error) => {
      console.error('Error activating user:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to activate user'
      );
    },
  });
}
