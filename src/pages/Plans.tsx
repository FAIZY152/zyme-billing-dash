import { useState } from 'react';
import { usePlans, useCreatePlan, useUpdatePlan, useDeletePlan } from '@/hooks/usePlans';
import { PlansTable } from '@/components/tables/PlansTable';
import { PlanForm } from '@/components/forms/PlanForm';
import { Plan, CreatePlanData } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function Plans() {
  const { data: plans, isLoading } = usePlans();
  const createPlan = useCreatePlan();
  const updatePlan = useUpdatePlan();
  const deletePlan = useDeletePlan();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

  const handleCreate = () => {
    setEditingPlan(null);
    setIsFormOpen(true);
  };

  const handleEdit = (plan: Plan) => {
    setEditingPlan(plan);
    setIsFormOpen(true);
  };

  const handleSubmit = async (data: CreatePlanData) => {
    try {
      if (editingPlan) {
        await updatePlan.mutateAsync({ id: editingPlan.id, data });
      } else {
        await createPlan.mutateAsync(data);
      }
      setIsFormOpen(false);
      setEditingPlan(null);
    } catch (error) {
      // Error handling is done in the hooks
    }
  };

  const handleDelete = async (planId: string) => {
    try {
      await deletePlan.mutateAsync(planId);
    } catch (error) {
      // Error handling is done in the hooks
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingPlan(null);
  };

  const isFormLoading = createPlan.isPending || updatePlan.isPending;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Plans</h1>
        <p className="text-muted-foreground">
          Create and manage your pricing plans
        </p>
      </div>

      <PlansTable
        plans={plans || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
        isLoading={isLoading}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingPlan ? 'Edit Plan' : 'Create New Plan'}
            </DialogTitle>
          </DialogHeader>
          <PlanForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isFormLoading}
            initialData={editingPlan}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}