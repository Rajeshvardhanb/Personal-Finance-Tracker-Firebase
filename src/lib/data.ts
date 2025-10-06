
import { FinanceData } from './types';
import { subMonths, format } from 'date-fns';

const generateHistory = () => {
  const history = [];
  for (let i = 11; i >= 0; i--) {
    const date = subMonths(new Date(), i);
    // Pseudo-random growth from a base
    const baseValue = 200000;
    const growthFactor = (12 - i) * 15000;
    const randomFluctuation = (Math.random() - 0.5) * 10000;
    history.push({
      date: format(date, 'yyyy-MM'),
      value: baseValue + growthFactor + randomFluctuation,
    });
  }
  return history;
}

export const getDefaultData = (): FinanceData => ({
  incomes: [],
  expenses: [],
  creditCards: [],
  masterExpenses: [],
  assets: [],
  liabilities: [],
  notes: [],
  expenseCategories: [
    { id: 'cat1', name: 'Groceries' },
    { id: 'cat2', name: 'Rent' },
    { id: 'cat3', name: 'Utilities' },
    { id: 'cat4', name: 'Transport' },
    { id: 'cat5', name: 'Entertainment' },
    { id: 'cat6', name: 'Healthcare' },
    { id: 'cat7', name: 'Dining Out' },
    { id: 'cat8', name: 'Shopping' },
    { id: 'cat9', name: 'EMI' },
    { id: 'cat10', name: 'Vacation' },
    { id: 'cat11', name: 'Other' },
  ],
  categoryBudgets: {
    'Groceries': 15000,
    'Dining Out': 5000,
    'Shopping': 10000,
    'Vacation': 50000,
  },
  netWorthHistory: [],
});

export const initialData: FinanceData = {
  incomes: [
    { id: '1', source: 'Salary', expectedAmount: 75000, creditedAmount: 75000, date: new Date(new Date().setDate(1)).toISOString(), status: 'Credited', isRecurring: true },
    { id: '2', source: 'Freelance Project', expectedAmount: 15000, creditedAmount: 0, date: new Date(new Date().setDate(15)).toISOString(), status: 'Not Credited', isRecurring: false },
  ],
  expenses: [
    { id: '1', category: 'Rent', description: 'Monthly Rent', amount: 20000, dueDate: new Date(new Date().setDate(5)).toISOString(), status: 'Paid', isRecurring: true },
    { id: '2', category: 'Utilities', description: 'Electricity Bill', amount: 1500, dueDate: new Date(new Date().setDate(10)).toISOString(), status: 'Paid', isRecurring: true },
    { id: '3', category: 'Groceries', description: 'Weekly Groceries', amount: 3000, dueDate: new Date(new Date().setDate(7)).toISOString(), status: 'Paid', isRecurring: false },
    { id: '4', category: 'Internet', description: 'Monthly Bill', amount: 800, dueDate: new Date(new Date().setDate(20)).toISOString(), status: 'Not Paid', isRecurring: true },
    { id: '5', category: 'Dining Out', description: 'Weekend Dinner', amount: 1200, dueDate: new Date(new Date().setDate(12)).toISOString(), status: 'Paid', isRecurring: false },
  ],
  creditCards: [
    {
      id: 'cc1',
      name: 'HDFC Millennia',
      creditLimit: 100000,
      upcomingBillDueDate: new Date(new Date().setMonth(new Date().getMonth() + 1, 5)).toISOString(),
      transactions: [
        { id: 'cct1', description: 'Amazon Purchase', amount: 2500, date: new Date(new Date().setDate(3)).toISOString() },
        { id: 'cct2', description: 'Swiggy', amount: 450, date: new Date(new Date().setDate(8)).toISOString() },
      ],
    },
    {
      id: 'cc2',
      name: 'ICICI Amazon Pay',
      creditLimit: 150000,
      upcomingBillDueDate: new Date(new Date().setMonth(new Date().getMonth() + 1, 10)).toISOString(),
      transactions: [],
    },
  ],
  masterExpenses: [],
  assets: [
    { id: 'a1', name: 'Savings Account', category: 'Bank Balance', value: 250000, lastUpdated: new Date().toISOString() },
    { id: 'a2', name: 'Mutual Funds', category: 'Investments', value: 120000, lastUpdated: new Date().toISOString() },
  ],
  liabilities: [
    { id: 'l1', name: 'Personal Loan', category: 'Personal Loan', value: 50000, lastUpdated: new Date().toISOString() },
  ],
  notes: [
    { id: 'n1', content: 'Pay electricity bill before 20th', createdAt: new Date().toISOString() },
    { id: 'n2', content: 'Follow up on freelance payment', createdAt: new Date().toISOString() },
  ],
  expenseCategories: [
    { id: 'cat1', name: 'Groceries' },
    { id: 'cat2', name: 'Rent' },
    { id: 'cat3', name: 'Utilities' },
    { id: 'cat4', name: 'Transport' },
    { id: 'cat5', name: 'Entertainment' },
    { id: 'cat6', name: 'Healthcare' },
    { id: 'cat7', name: 'Dining Out' },
    { id: 'cat8', name: 'Shopping' },
    { id: 'cat9', name: 'EMI' },
    { id: 'cat10', name: 'Vacation' },
    { id: 'cat11', name: 'Other' },
  ],
  categoryBudgets: {
    'Groceries': 15000,
    'Dining Out': 5000,
    'Shopping': 10000,
    'Vacation': 50000,
  },
  netWorthHistory: generateHistory(),
};
