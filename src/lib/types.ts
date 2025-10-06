

export type TransactionStatus = 'Credited' | 'Not Credited';
export type ExpenseStatus = 'Paid' | 'Not Paid' | 'Paid by Credit Card';

export interface Income {
  id: string;
  source: string;
  expectedAmount: number;
  creditedAmount: number;
  date: string; // ISO 8601 format
  status: TransactionStatus;
  isRecurring: boolean;
}

export interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  dueDate: string; // ISO 8601 format
  status: ExpenseStatus;
  isRecurring: boolean;
  masterExpenseId?: string; // Link to master expense
  paidViaCard?: string; // Name of the credit card used
}

export interface CreditCardTransaction {
  id: string;
  description: string;
  amount: number;
  date: string; // ISO 8601 format
  masterExpenseId?: string; // Optional link to a master expense
}

export interface CreditCard {
  id: string;
  name: string;
  creditLimit: number;
  upcomingBillDueDate: string; // ISO 8601 format
  transactions: CreditCardTransaction[];
}

export interface MasterExpenseTransaction {
  id: string;
  description: string;
  amount: number;
  date: string; // ISO 8601 format
  status: ExpenseStatus;
  paidViaCard?: string; // Name of the credit card used
}

export interface MasterExpense {
  id: string;
  name: string;
  transactions: MasterExpenseTransaction[];
}

export interface Asset {
  id: string;
  name: string;
  category: string;
  value: number;
  lastUpdated: string; // ISO 8601 format
}

export interface Liability {
  id: string;
  name: string;
  category: string;
  value: number;
  lastUpdated: string; // ISO 8601 format
}

export interface Note {
  id: string;
  content: string;
  createdAt: string; // ISO 8601 format
}

export interface NetWorthHistory {
  id: string;
  date: string; // "yyyy-MM" format
  value: number;
}

export interface FinanceData {
  incomes: Income[];
  expenses: Expense[];
  creditCards: CreditCard[];
  masterExpenses: MasterExpense[];
  assets: Asset[];
  liabilities: Liability[];
  notes: Note[];
  categoryBudgets: { [category: string]: number };
  netWorthHistory: NetWorthHistory[];
}

export const ExpenseCategories = [
  'Groceries',
  'Rent',
  'Utilities',
  'Transport',
  'Entertainment',
  'Healthcare',
  'Dining Out',
  'Shopping',
  'EMI',
  'Vacation',
  'Other',
] as const;

export const AssetCategories = [
  'Gold',
  'Provident Fund',
  'Cash',
  'Bank Balance',
  'Investments',
  'Property',
  'Other',
] as const;

export const LiabilityCategories = [
  'Personal Loan',
  'Home Loan',
  'Car Loan',
  'Credit Card Outstanding',
  'Other',
] as const;
