import { useCustomers } from '@/hooks/useCustomers';
import { usePlans } from '@/hooks/usePlans';
import { CustomersTable } from '@/components/tables/CustomersTable';
import { PlansTable } from '@/components/tables/PlansTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, CreditCard, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
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

  // Calculate MRR (Monthly Recurring Revenue)
  const mrr = customers?.reduce((sum, customer) => {
    if (customer.status === 'active' && customer.currentPlan) {
      const plan = plans?.find(p => p.id === customer.currentPlan.id);
      if (plan) {
        return sum + (plan.interval === 'yearly' ? plan.basePrice / 12 : plan.basePrice);
      }
    }
    return sum;
  }, 0) || 0;

  const stats = [
    {
      title: 'Monthly Recurring Revenue',
      value: `$${mrr.toLocaleString()}`,
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      description: 'From active subscriptions',
    },
    {
      title: 'Active Customers',
      value: activeCustomers.toString(),
      change: `+${totalCustomers - activeCustomers}`,
      trend: 'up',
      icon: Users,
      description: `${totalCustomers} total customers`,
    },
    {
      title: 'Total Plans',
      value: totalPlans.toString(),
      change: 'N/A',
      trend: 'neutral',
      icon: CreditCard,
      description: 'Available subscription plans',
    },
    {
      title: 'Average Plan Value',
      value: `$${averagePrice.toFixed(0)}`,
      change: '+8.2%',
      trend: 'up',
      icon: TrendingUp,
      description: 'Across all plans',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Overview</h1>
        <p className="text-muted-foreground mt-2">
          Monitor your subscription metrics and customer activity
        </p>
      </div>

      {/* Stats Grid - Stripe-style summary tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold mb-1">{stat.value}</div>
              <div className="flex items-center space-x-1">
                {stat.trend === 'up' && <ArrowUpRight className="h-3 w-3 text-success" />}
                {stat.trend === 'down' && <ArrowDownRight className="h-3 w-3 text-destructive" />}
                <span className={`text-xs font-medium ${
                  stat.trend === 'up' ? 'text-success' : 
                  stat.trend === 'down' ? 'text-destructive' : 
                  'text-muted-foreground'
                }`}>
                  {stat.change}
                </span>
                <span className="text-xs text-muted-foreground">
                  {stat.description}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-foreground">Recent Customers</h2>
            <button 
              onClick={() => navigate('/customers')}
              className="text-sm text-primary hover:text-primary/80 font-medium"
            >
              View all →
            </button>
          </div>
          <CustomersTable
            customers={customers?.slice(0, 5) || []}
            onCreate={() => navigate('/customers')}
            isLoading={customersLoading}
          />
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-foreground">Subscription Plans</h2>
            <button 
              onClick={() => navigate('/plans')}
              className="text-sm text-primary hover:text-primary/80 font-medium"
            >
              View all →
            </button>
          </div>
          <PlansTable
            plans={plans?.slice(0, 5) || []}
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