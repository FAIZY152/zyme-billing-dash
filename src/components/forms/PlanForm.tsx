import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreatePlanData, Plan } from '@/types';

const planSchema = z.object({
  name: z.string().min(1, 'Plan name is required').max(50, 'Name must be less than 50 characters'),
  interval: z.enum(['monthly', 'yearly']),
  basePrice: z.coerce.number().min(0, 'Price must be positive').max(100000, 'Price too high'),
  usageRate: z.coerce.number().min(0, 'Usage rate must be positive').max(10, 'Rate too high').optional(),
  freeTrialDays: z.coerce.number().min(0, 'Trial days must be positive').max(365, 'Trial too long'),
});

interface PlanFormProps {
  onSubmit: (data: CreatePlanData) => void;
  isLoading?: boolean;
  initialData?: Plan;
  onCancel?: () => void;
}

export function PlanForm({ onSubmit, isLoading, initialData, onCancel }: PlanFormProps) {
  const form = useForm<CreatePlanData>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      name: initialData?.name || '',
      interval: initialData?.interval || 'monthly',
      basePrice: initialData?.basePrice || 0,
      usageRate: initialData?.usageRate || undefined,
      freeTrialDays: initialData?.freeTrialDays || 14,
    },
  });

  const handleSubmit = (data: CreatePlanData) => {
    onSubmit(data);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{initialData ? 'Edit Plan' : 'Create New Plan'}</CardTitle>
        <CardDescription>
          {initialData ? 'Update your pricing plan details' : 'Set up a new pricing plan for your customers'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plan Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Starter, Professional" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="interval"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Billing Interval</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select interval" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="basePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Base Price ($)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="29.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="usageRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usage Rate ($ per unit)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01" 
                        placeholder="0.10" 
                        {...field} 
                        value={field.value || ''} 
                      />
                    </FormControl>
                    <FormDescription>Optional - for usage-based pricing</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="freeTrialDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Free Trial Days</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="14" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-3">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : initialData ? 'Update Plan' : 'Create Plan'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}