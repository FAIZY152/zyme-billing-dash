import { Badge } from '@/components/ui/badge';
import { Customer } from '@/types';

interface StatusBadgeProps {
  status: Customer['status'];
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variants = {
    active: 'default',
    trialing: 'secondary',
    past_due: 'destructive',
    canceled: 'outline',
  } as const;

  const labels = {
    active: 'Active',
    trialing: 'Trial',
    past_due: 'Past Due',
    canceled: 'Canceled',
  } as const;

  return (
    <Badge variant={variants[status]} className="font-medium">
      {labels[status]}
    </Badge>
  );
}