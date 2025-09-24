import { useState } from 'react';
import { useCustomers, useCreateCustomer, useStartSubscription } from '@/hooks/useCustomers';
import { usePlans } from '@/hooks/usePlans';
import { CustomersTable } from '@/components/tables/CustomersTable';
import { CustomerForm } from '@/components/forms/CustomerForm';
import { CreateCustomerData } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type CustomerFormData = CreateCustomerData & { planId?: string };

export default function Customers() {
  const { data: customers, isLoading: customersLoading } = useCustomers();
  const { data: plans } = usePlans();
  const createCustomer = useCreateCustomer();
  const startSubscription = useStartSubscription();
  
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleCreate = () => {
    setIsFormOpen(true);
  };

  const handleSubmit = async (data: CustomerFormData) => {
    try {
      // First create the customer
      const newCustomer = await createCustomer.mutateAsync({
        email: data.email,
        companyName: data.companyName,
      });

      // If a plan was selected, start subscription
      if (data.planId && plans) {
        const selectedPlan = plans.find(p => p.id === data.planId);
        if (selectedPlan) {
          await startSubscription.mutateAsync({
            data: { customerId: newCustomer.id, planId: data.planId },
            plan: selectedPlan,
          });
        }
      }

      setIsFormOpen(false);
    } catch (error) {
      // Error handling is done in the hooks
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
  };

  const isFormLoading = createCustomer.isPending || startSubscription.isPending;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Customers</h1>
        <p className="text-muted-foreground">
          Manage your customer accounts and subscriptions
        </p>
      </div>

      <CustomersTable
        customers={customers || []}
        onCreate={handleCreate}
        isLoading={customersLoading}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
          </DialogHeader>
          <CustomerForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isFormLoading}
            plans={plans}
            showPlanSelection={true}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}