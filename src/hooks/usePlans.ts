import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { plansApi } from '@/api/plans';
import { CreatePlanData } from '@/types';
import { useToast } from '@/hooks/use-toast';

export function usePlans() {
  return useQuery({
    queryKey: ['plans'],
    queryFn: plansApi.getAll,
  });
}

export function useCreatePlan() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreatePlanData) => plansApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      toast({
        title: 'Plan created',
        description: 'Your new plan has been successfully created.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error creating plan',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useUpdatePlan() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreatePlanData> }) =>
      plansApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      toast({
        title: 'Plan updated',
        description: 'Your plan has been successfully updated.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error updating plan',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useDeletePlan() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => plansApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      toast({
        title: 'Plan deleted',
        description: 'The plan has been successfully deleted.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error deleting plan',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}