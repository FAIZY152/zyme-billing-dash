export interface Plan {
  id: string;
  name: string;
  interval: 'monthly' | 'yearly';
  basePrice: number;
  usageRate?: number;
  freeTrialDays: number;
  createdAt: string;
}

export interface Customer {
  id: string;
  email: string;
  companyName: string;
  currentPlan?: Plan;
  status: 'active' | 'past_due' | 'canceled' | 'trialing';
  createdAt: string;
  trialEndsAt?: string;
}

export interface CreatePlanData {
  name: string;
  interval: 'monthly' | 'yearly';
  basePrice: number;
  usageRate?: number;
  freeTrialDays: number;
}

export interface CreateCustomerData {
  email: string;
  companyName: string;
}

export interface StartSubscriptionData {
  customerId: string;
  planId: string;
}