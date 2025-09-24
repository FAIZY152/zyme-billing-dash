import axios from 'axios';
import { Plan, CreatePlanData } from '@/types';

const API_BASE = '/api';

// Mock data for development
const mockPlans: Plan[] = [
  {
    id: '1',
    name: 'Starter',
    interval: 'monthly',
    basePrice: 29,
    usageRate: 0.1,
    freeTrialDays: 14,
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Professional',
    interval: 'monthly',
    basePrice: 99,
    usageRate: 0.05,
    freeTrialDays: 14,
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '3',
    name: 'Enterprise',
    interval: 'yearly',
    basePrice: 999,
    freeTrialDays: 30,
    createdAt: '2024-01-15T10:00:00Z'
  }
];

let planStorage = [...mockPlans];

export const plansApi = {
  getAll: async (): Promise<Plan[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return planStorage;
  },

  create: async (data: CreatePlanData): Promise<Plan> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newPlan: Plan = {
      id: (planStorage.length + 1).toString(),
      ...data,
      createdAt: new Date().toISOString()
    };
    planStorage.push(newPlan);
    return newPlan;
  },

  update: async (id: string, data: Partial<CreatePlanData>): Promise<Plan> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const planIndex = planStorage.findIndex(p => p.id === id);
    if (planIndex === -1) throw new Error('Plan not found');
    
    planStorage[planIndex] = { ...planStorage[planIndex], ...data };
    return planStorage[planIndex];
  },

  delete: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    planStorage = planStorage.filter(p => p.id !== id);
  }
};