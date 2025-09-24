import { useCustomers } from '@/hooks/useCustomers';
import { usePlans } from '@/hooks/usePlans';
import { CustomersTable } from '@/components/tables/CustomersTable';
import { PlansTable } from '@/components/tables/PlansTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, CreditCard, DollarSign, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { data: customers, isLoading: customersLoading } = useCustomers();
  const { data: plans, isLoading: plansLoading } = usePlans();
  const navigate = useNavigate();

  // Calculate stats
  const totalCustomers = customers?.length || 0;
  const activeCustomers = customers?.filter(c => c.status === 'active').length || 0;
  const totalPlans = plans?.length || 0;
  const averagePrice = plans && plans.length > 0 
    ? plans.reduce((sum, plan) => sum + plan.basePrice, 0) / plans.length 
    : 0;

  const stats = [
    {
      title: 'Total Customers',
      value: totalCustomers.toString(),
      icon: Users,
      description: `${activeCustomers} active`,
    },
    {
      title: 'Total Plans',
      value: totalPlans.toString(),
      icon: CreditCard,
      description: 'Available plans',
    },
    {
      title: 'Average Plan Price',
      value: `$${averagePrice.toFixed(0)}`,
      icon: DollarSign,
      description: 'Across all plans',
    },
    {
      title: 'Growth Rate',
      value: '+12%',
      icon: TrendingUp,
      description: 'From last month',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your billing platform and customer metrics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div>
          <CustomersTable
            customers={customers || []}
            onCreate={() => navigate('/customers')}
            isLoading={customersLoading}
          />
        </div>
        <div>
          <PlansTable
            plans={plans || []}
            onEdit={() => navigate('/plans')}
            onDelete={() => {}}
            onCreate={() => navigate('/plans')}
            isLoading={plansLoading}
          />
        </div>
      </div>
    </div>
  );
}