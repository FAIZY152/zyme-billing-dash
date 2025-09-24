import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customersApi } from '@/api/customers';
import { CreateCustomerData, StartSubscriptionData, Plan } from '@/types';
import { useToast } from '@/hooks/use-toast';

export function useCustomers() {
  return useQuery({
    queryKey: ['customers'],
    queryFn: customersApi.getAll,
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateCustomerData) => customersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({
        title: 'Customer added',
        description: 'New customer has been successfully added.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error adding customer',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useStartSubscription() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ data, plan }: { data: StartSubscriptionData; plan: Plan }) =>
      customersApi.startSubscription(data, plan),
    onSuccess: (customer) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({
        title: 'Subscription started',
        description: `${customer.companyName} is now subscribed to ${customer.currentPlan?.name}.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error starting subscription',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}