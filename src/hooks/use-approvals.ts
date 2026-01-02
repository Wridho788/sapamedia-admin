import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { approvalsApi } from '@/api';
import { activityLogger } from '@/lib/activity-logger';
import { useAuth } from './use-auth';
import { toast } from 'sonner';
import type { ApprovalHistory } from '@/types/database';

// Query Keys Factory
export const approvalKeys = {
  all: ['approvals'] as const,
  lists: () => [...approvalKeys.all, 'list'] as const,
  list: (filters: string) => [...approvalKeys.lists(), { filters }] as const,
  details: () => [...approvalKeys.all, 'detail'] as const,
  detail: (id: string) => [...approvalKeys.details(), id] as const,
  history: (postId: string) => [...approvalKeys.all, 'history', postId] as const,
};

// Get approval history for a post
export function useApprovalHistory(postId: string) {
  return useQuery({
    queryKey: approvalKeys.history(postId),
    queryFn: () => approvalsApi.getApprovalHistory(postId),
    enabled: !!postId,
  });
}

// Approve article mutation
export function useApproveArticle() {
  const queryClient = useQueryClient();
  const { authUser } = useAuth();

  return useMutation({
    mutationFn: ({ postId }: { postId: string }) => {
      if (!authUser?.id) {
        throw new Error('User not authenticated');
      }
      return approvalsApi.approveArticle(postId, authUser.id);
    },
    onSuccess: async (data, variables) => {
      // Invalidate relevant queries
      await queryClient.invalidateQueries({ queryKey: ['articles'] });
      await queryClient.invalidateQueries({ queryKey: ['approvals'] });
      await queryClient.invalidateQueries({
        queryKey: approvalKeys.history(variables.postId),
      });

      // Log activity
      if (authUser?.id) {
        await activityLogger.log({
          user_id: authUser.id,
          action: 'POST_APPROVED',
          entity_type: 'post',
          entity_id: variables.postId,
        });
      }

      toast.success('Article approved successfully');
    },
    onError: (error) => {
      console.error('Error approving article:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to approve article'
      );
    },
  });
}

// Reject article mutation
export function useRejectArticle() {
  const queryClient = useQueryClient();
  const { authUser } = useAuth();

  return useMutation({
    mutationFn: ({
      postId,
      rejectionReason,
    }: {
      postId: string;
      rejectionReason: string;
    }) => {
      if (!authUser?.id) {
        throw new Error('User not authenticated');
      }
      return approvalsApi.rejectArticle(postId, authUser.id, rejectionReason);
    },
    onSuccess: async (data, variables) => {
      // Invalidate relevant queries
      await queryClient.invalidateQueries({ queryKey: ['articles'] });
      await queryClient.invalidateQueries({ queryKey: ['approvals'] });
      await queryClient.invalidateQueries({
        queryKey: approvalKeys.history(variables.postId),
      });

      // Log activity
      if (authUser?.id) {
        await activityLogger.log({
          user_id: authUser.id,
          action: 'POST_REJECTED',
          entity_type: 'post',
          entity_id: variables.postId,
          metadata: {
            rejection_reason: variables.rejectionReason,
          },
        });
      }

      toast.success('Article rejected');
    },
    onError: (error) => {
      console.error('Error rejecting article:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to reject article'
      );
    },
  });
}

// Get all approvals (for admin/editor dashboard)
export function useApprovals(filters?: {
  status?: string;
  limit?: number;
}) {
  const filterStr = JSON.stringify(filters || {});

  return useQuery({
    queryKey: approvalKeys.list(filterStr),
    queryFn: async () => {
      // This would need to be implemented in the API
      // For now, we'll return an empty array
      // In a real implementation, you'd add an endpoint like:
      // return approvalsApi.getApprovals(filters);
      return [] as ApprovalHistory[];
    },
  });
}
