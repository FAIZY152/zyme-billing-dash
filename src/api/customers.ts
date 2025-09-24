import axios from 'axios';
import { Customer, CreateCustomerData, StartSubscriptionData, Plan } from '@/types';

const API_BASE = '/api';

// Mock data for development
const mockCustomers: Customer[] = [
  {
    id: '1',
    email: 'john@acme.com',
    companyName: 'Acme Corp',
    status: 'active',
    currentPlan: {
      id: '2',
      name: 'Professional',
      interval: 'monthly',
      basePrice: 99,
      usageRate: 0.05,
      freeTrialDays: 14,
      createdAt: '2024-01-15T10:00:00Z'
    },
    createdAt: '2024-02-01T10:00:00Z'
  },
  {
    id: '2',
    email: 'sarah@startup.io',
    companyName: 'Startup Inc',
    status: 'trialing',
    currentPlan: {
      id: '1',
      name: 'Starter',
      interval: 'monthly',
      basePrice: 29,
      usageRate: 0.1,
      freeTrialDays: 14,
      createdAt: '2024-01-15T10:00:00Z'
    },
    createdAt: '2024-02-10T10:00:00Z',
    trialEndsAt: '2024-02-24T10:00:00Z'
  }
];

let customerStorage = [...mockCustomers];

export const customersApi = {
  getAll: async (): Promise<Customer[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return customerStorage;
  },

  create: async (data: CreateCustomerData): Promise<Customer> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newCustomer: Customer = {
      id: (customerStorage.length + 1).toString(),
      ...data,
      status: 'active',
      createdAt: new Date().toISOString()
    };
    customerStorage.push(newCustomer);
    return newCustomer;
  },

  startSubscription: async (data: StartSubscriptionData, plan: Plan): Promise<Customer> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const customerIndex = customerStorage.findIndex(c => c.id === data.customerId);
    if (customerIndex === -1) throw new Error('Customer not found');
    
    const trialEndsAt = plan.freeTrialDays > 0 
      ? new Date(Date.now() + plan.freeTrialDays * 24 * 60 * 60 * 1000).toISOString()
      : undefined;

    customerStorage[customerIndex] = {
      ...customerStorage[customerIndex],
      currentPlan: plan,
      status: plan.freeTrialDays > 0 ? 'trialing' : 'active',
      trialEndsAt
    };

    return customerStorage[customerIndex];
  }
};