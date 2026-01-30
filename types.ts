
export interface ExpenseItem {
  id: string;
  name: string;
  amount: number;
}

export interface User {
  id: string;
  name: string;
  identity: string;
  income: number;
  expenses: number;
  expenseDetails?: ExpenseItem[];
  savingsGoal?: SavingsGoal;
  financialStage?: number; // 1 to 4
}

export interface SavingsGoal {
  target: number;
  saved: number;
  chunks: number[];
  completedChunks: boolean[];
  type: 'FIXED' | 'VARIED';
  months?: number;
}

export interface Quote {
  id: string;
  text: string;
}

export enum AppStep {
  LOGIN,
  FINANCIAL_DATA,
  DASHBOARD,
  SAVINGS,
  INVESTMENT,
  CONSULTATION,
  JOURNEY,
  ABOUT,
  VISUALIZER
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface InvestmentPlatform {
  name: string;
  description: string;
  url: string;
  type: string;
  difficulty: 'VERY_EASY' | 'EASY' | 'MEDIUM' | 'ADVANCED' | 'HARD' | 'VERY_HARD';
  difficultyLabel: string;
  logoUrl?: string;
}
