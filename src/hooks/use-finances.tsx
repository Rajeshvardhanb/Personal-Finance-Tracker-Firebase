
'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { FinanceData, initialData } from '@/lib/data';
import type { Income, Expense, Note, Asset, Liability, CreditCard, CreditCardTransaction, MasterExpense, MasterExpenseTransaction, ExpenseStatus } from '@/lib/types';
import { startOfMonth, getMonth, getYear, format, subMonths, isEqual, parse } from 'date-fns';

interface FinanceContextType {
  data: FinanceData;
  setData: (data: FinanceData) => void;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;

  // Income
  addIncome: (income: Omit<Income, 'id'>) => void;
  updateIncome: (income: Income) => void;
  deleteIncome: (id: string) => void;

  // Expense
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;

  // Master Expense
  addMasterExpense: (expense: Omit<MasterExpense, 'id' | 'transactions'>) => void;
  updateMasterExpense: (expense: MasterExpense) => void;
  deleteMasterExpense: (id: string) => void;
  addMasterExpenseTransaction: (masterExpenseId: string, transaction: Omit<MasterExpenseTransaction, 'id'>) => void;
  updateMasterExpenseTransaction: (masterExpenseId: string, transaction: MasterExpenseTransaction) => void;
  deleteMasterExpenseTransaction: (masterExpenseId: string, transactionId: string) => void;

  // Credit Card
  addCreditCard: (card: Omit<CreditCard, 'id' | 'transactions'>) => void;
  updateCreditCard: (card: CreditCard) => void;
  deleteCreditCard: (id: string) => void;
  addCreditCardTransaction: (cardId: string, transaction: Omit<CreditCardTransaction, 'id'>) => void;
  updateCreditCardTransaction: (cardId: string, transaction: CreditCardTransaction) => void;
  deleteCreditCardTransaction: (cardId: string, transactionId: string) => void;


  // Notes
  addNote: (note: Omit<Note, 'id'>) => void;
  deleteNote: (id: string) => void;
  getFinancialDataForPastMonths: (numberOfMonths: number) => { month: string; income: number; expenses: number; creditCardSpending: number, overspendingCategories: string[] }[];

  // Net Worth
  addAsset: (asset: Omit<Asset, 'id' | 'lastUpdated'>) => void;
  updateAsset: (asset: Omit<Asset, 'lastUpdated'>) => void;
  deleteAsset: (id: string) => void;
  addLiability: (liability: Omit<Liability, 'id' | 'lastUpdated'>) => void;
  updateLiability: (liability: Omit<Liability, 'lastUpdated'>) => void;
  deleteLiability: (id: string) => void;
  snapshotNetWorth: () => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [data, setDataState] = useState<FinanceData>(initialData);
  const [selectedDate, setSelectedDate] = useState<Date>(startOfMonth(new Date()));
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem('financeData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        // Ensure masterExpenses is an array
        if (!Array.isArray(parsedData.masterExpenses)) {
          parsedData.masterExpenses = [];
        }
        setDataState(parsedData);
      }
    } catch (error) {
      console.error('Failed to load data from localStorage', error);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem('financeData', JSON.stringify(data));
      } catch (error) {
        console.error('Failed to save data to localStorage', error);
      }
    }
  }, [data, isInitialized]);

  const setData = (newData: FinanceData) => {
    setDataState(newData);
  };

  const addIncome = (income: Omit<Income, 'id'>) => {
    setDataState(prev => ({
      ...prev,
      incomes: [...prev.incomes, { ...income, id: crypto.randomUUID() }]
    }));
  };

  const updateIncome = (income: Income) => {
    setDataState(prev => ({
      ...prev,
      incomes: prev.incomes.map(i => i.id === income.id ? income : i)
    }));
  };

  const deleteIncome = (id: string) => {
    setDataState(prev => ({
      ...prev,
      incomes: prev.incomes.filter(i => i.id !== id)
    }));
  };
  
  const addExpense = (expense: Omit<Expense, 'id'>) => {
    setDataState(prev => ({
      ...prev,
      expenses: [...prev.expenses, { ...expense, id: crypto.randomUUID() }]
    }));
  };

  const updateExpense = (expense: Expense) => {
    setDataState(prev => ({
      ...prev,
      expenses: prev.expenses.map(e => e.id === expense.id ? expense : e)
    }));
  };

  const deleteExpense = (id: string) => {
    setDataState(prev => ({
      ...prev,
      expenses: prev.expenses.filter(e => e.id !== id)
    }));
  };

  const addMasterExpense = (expense: Omit<MasterExpense, 'id' | 'transactions'>) => {
    const newMasterExpense = { ...expense, id: `me-${crypto.randomUUID()}`, transactions: [] };
    setDataState(prev => ({
      ...prev,
      masterExpenses: [...prev.masterExpenses, newMasterExpense],
    }));
  };
  
  const updateMasterExpense = (expense: MasterExpense) => {
    setDataState(prev => ({
      ...prev,
      masterExpenses: prev.masterExpenses.map(e => e.id === expense.id ? expense : e),
    }));
  };
  
  const deleteMasterExpense = (id: string) => {
    setDataState(prev => ({
      ...prev,
      masterExpenses: prev.masterExpenses.filter(e => e.id !== id),
      expenses: prev.expenses.filter(e => !e.id.startsWith(`exp-from-${id}`))
    }));
  };

  const addMasterExpenseTransaction = (masterExpenseId: string, transaction: Omit<MasterExpenseTransaction, 'id'>) => {
    setDataState(prev => ({
      ...prev,
      masterExpenses: prev.masterExpenses.map(me => 
        me.id === masterExpenseId
          ? { ...me, transactions: [...me.transactions, { ...transaction, id: crypto.randomUUID() }] }
          : me
      ),
    }));
  };

  const updateMasterExpenseTransaction = (masterExpenseId: string, transaction: MasterExpenseTransaction) => {
    setDataState(prev => ({
      ...prev,
      masterExpenses: prev.masterExpenses.map(me =>
        me.id === masterExpenseId
          ? { ...me, transactions: me.transactions.map(t => t.id === transaction.id ? transaction : t) }
          : me
      ),
    }));
  };

  const deleteMasterExpenseTransaction = (masterExpenseId: string, transactionId: string) => {
    setDataState(prev => ({
      ...prev,
      masterExpenses: prev.masterExpenses.map(me =>
        me.id === masterExpenseId
          ? { ...me, transactions: me.transactions.filter(t => t.id !== transactionId) }
          : me
      ),
    }));
  };

  const addCreditCard = (card: Omit<CreditCard, 'id' | 'transactions'>) => {
    setDataState(prev => ({
      ...prev,
      creditCards: [...prev.creditCards, { ...card, id: crypto.randomUUID(), transactions: [] }]
    }));
  };

  const updateCreditCard = (card: CreditCard) => {
    setDataState(prev => ({
      ...prev,
      creditCards: prev.creditCards.map(c => c.id === card.id ? card : c)
    }));
  };

  const deleteCreditCard = (id: string) => {
    setDataState(prev => ({
      ...prev,
      creditCards: prev.creditCards.filter(c => c.id !== id)
    }));
  };

  const addCreditCardTransaction = (cardId: string, transaction: Omit<CreditCardTransaction, 'id'>) => {
    setDataState(prev => ({
      ...prev,
      creditCards: prev.creditCards.map(card => 
        card.id === cardId
          ? { ...card, transactions: [...card.transactions, { ...transaction, id: crypto.randomUUID() }] }
          : card
      ),
    }));
  };

  const updateCreditCardTransaction = (cardId: string, transaction: CreditCardTransaction) => {
    setDataState(prev => ({
      ...prev,
      creditCards: prev.creditCards.map(card =>
        card.id === cardId
          ? { ...card, transactions: card.transactions.map(t => t.id === transaction.id ? transaction : t) }
          : card
      ),
    }));
  };

  const deleteCreditCardTransaction = (cardId: string, transactionId: string) => {
    setDataState(prev => ({
      ...prev,
      creditCards: prev.creditCards.map(card =>
        card.id === cardId
          ? { ...card, transactions: card.transactions.filter(t => t.id !== transactionId) }
          : card
      ),
    }));
  };

  const addNote = (note: Omit<Note, 'id'>) => {
    setDataState(prev => ({
      ...prev,
      notes: [{ ...note, id: crypto.randomUUID() }, ...prev.notes]
    }));
  }

  const deleteNote = (id: string) => {
    setDataState(prev => ({
      ...prev,
      notes: prev.notes.filter(note => note.id !== id)
    }));
  }

  const getFinancialDataForPastMonths = (numberOfMonths: number) => {
    const pastMonthsData = [];
    for (let i = 0; i < numberOfMonths; i++) {
        const date = subMonths(new Date(), i);
        const month = getMonth(date);
        const year = getYear(date);

        const income = data.incomes
            .filter(d => getMonth(new Date(d.date)) === month && getYear(new Date(d.date)) === year && d.status === 'Credited')
            .reduce((acc, d) => acc + d.creditedAmount, 0);

        const expenses = data.expenses
            .filter(d => getMonth(new Date(d.dueDate)) === month && getYear(new Date(d.dueDate)) === year && d.status === 'Paid')
            .reduce((acc, d) => acc + d.amount, 0);
        
        const paidExpensesByCategory = data.expenses
            .filter(d => getMonth(new Date(d.dueDate)) === month && getYear(new Date(d.dueDate)) === year && d.status === 'Paid')
            .reduce((acc, d) => {
              acc[d.category] = (acc[d.category] || 0) + d.amount;
              return acc;
            }, {} as {[key: string]: number});
        
        const overspendingCategories = Object.entries(paidExpensesByCategory)
            .filter(([category, amount]) => data.categoryBudgets[category] && amount > data.categoryBudgets[category])
            .map(([category]) => category);

        const creditCardSpending = data.creditCards
            .flatMap(cc => cc.transactions)
            .filter(t => getMonth(new Date(t.date)) === month && getYear(new Date(t.date)) === year)
            .reduce((acc, t) => acc + t.amount, 0);

        pastMonthsData.unshift({
            month: format(date, 'MMM yyyy'),
            income,
            expenses,
            creditCardSpending,
            overspendingCategories,
        });
    }
    return pastMonthsData;
  };

  const addAsset = (asset: Omit<Asset, 'id' | 'lastUpdated'>) => {
    setDataState(prev => ({
      ...prev,
      assets: [...prev.assets, { ...asset, id: crypto.randomUUID(), lastUpdated: new Date().toISOString() }]
    }));
  };

  const updateAsset = (asset: Omit<Asset, 'lastUpdated'>) => {
    setDataState(prev => ({
      ...prev,
      assets: prev.assets.map(a => a.id === asset.id ? { ...asset, lastUpdated: new Date().toISOString() } : a)
    }));
  };

  const deleteAsset = (id: string) => {
    setDataState(prev => ({
      ...prev,
      assets: prev.assets.filter(a => a.id !== id)
    }));
  };

  const addLiability = (liability: Omit<Liability, 'id' | 'lastUpdated'>) => {
    setDataState(prev => ({
      ...prev,
      liabilities: [...prev.liabilities, { ...liability, id: crypto.randomUUID(), lastUpdated: new Date().toISOString() }]
    }));
  };

  const updateLiability = (liability: Omit<Liability, 'lastUpdated'>) => {
    setDataState(prev => ({
      ...prev,
      liabilities: prev.liabilities.map(l => l.id === liability.id ? { ...liability, lastUpdated: new Date().toISOString() } : l)
    }));
  };

  const deleteLiability = (id: string) => {
    setDataState(prev => ({
      ...prev,
      liabilities: prev.liabilities.filter(l => l.id !== id)
    }));
  };

  const snapshotNetWorth = useCallback(() => {
    setDataState(prev => {
      const totalAssets = prev.assets.reduce((sum, a) => sum + a.value, 0);
      const totalLiabilities = prev.liabilities.reduce((sum, l) => sum + l.value, 0);
      const currentNetWorth = totalAssets - totalLiabilities;
      const currentMonthKey = format(new Date(), 'yyyy-MM');
      
      const history = [...prev.netWorthHistory];
      const existingEntryIndex = history.findIndex(h => h.date === currentMonthKey);
      
      if (existingEntryIndex > -1) {
        if (history[existingEntryIndex].value !== currentNetWorth) {
          history[existingEntryIndex] = { date: currentMonthKey, value: currentNetWorth };
        } else {
          return prev; // No change needed
        }
      } else {
        history.push({ date: currentMonthKey, value: currentNetWorth });
      }
      
      history.sort((a, b) => parse(a.date, 'yyyy-MM', new Date()).getTime() - parse(b.date, 'yyyy-MM', new Date()).getTime());
      
      const newHistory = history.slice(-12);

      if (isEqual(newHistory, prev.netWorthHistory)) return prev;

      return { ...prev, netWorthHistory: newHistory };
    });
  }, []);

  const updateTotalFromMasterExpense = useCallback(() => {
    setDataState(prev => {
      const month = getMonth(selectedDate);
      const year = getYear(selectedDate);
      let newExpenses = prev.expenses.filter(e => !e.masterExpenseId);
      let expensesChanged = false;

      prev.masterExpenses.forEach(me => {
        const paidTotal = me.transactions
          .filter(t => getMonth(new Date(t.date)) === month && getYear(new Date(t.date)) === year && t.status === 'Paid')
          .reduce((sum, t) => sum + t.amount, 0);

        const unpaidTotal = me.transactions
          .filter(t => getMonth(new Date(t.date)) === month && getYear(new Date(t.date)) === year && t.status === 'Not Paid')
          .reduce((sum, t) => sum + t.amount, 0);

        const createOrUpdateExpense = (status: ExpenseStatus, amount: number) => {
          if (amount <= 0) return;
          const suffix = status === 'Paid' ? 'Paid' : 'Unpaid';
          const id = `exp-from-${me.id}-${suffix.toLowerCase()}`;
          const description = `${me.name} (${suffix})`;
          const existing = prev.expenses.find(e => e.id === id);

          if (existing) {
            if (existing.amount !== amount) {
              newExpenses.push({ ...existing, amount });
              expensesChanged = true;
            } else {
              newExpenses.push(existing);
            }
          } else {
            newExpenses.push({
              id,
              masterExpenseId: me.id,
              description,
              amount,
              category: 'Other',
              dueDate: selectedDate.toISOString(),
              status,
              isRecurring: false,
            });
            expensesChanged = true;
          }
        };

        createOrUpdateExpense('Paid', paidTotal);
        createOrUpdateExpense('Not Paid', unpaidTotal);
      });
      
      const masterExpenseIds = prev.masterExpenses.map(me => me.id);
      const prevMasterSummaryIds = prev.expenses
          .filter(e => e.masterExpenseId && masterExpenseIds.includes(e.masterExpenseId))
          .map(e => e.id);
      const newMasterSummaryIds = newExpenses
          .filter(e => e.masterExpenseId && masterExpenseIds.includes(e.masterExpenseId))
          .map(e => e.id);

      if (prevMasterSummaryIds.length !== newMasterSummaryIds.length) {
        expensesChanged = true;
      }

      if (expensesChanged) {
        return { ...prev, expenses: newExpenses };
      }
      return prev;
    });
  }, [selectedDate]);

  useEffect(() => {
    if (isInitialized) {
      snapshotNetWorth();
      updateTotalFromMasterExpense();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.assets, data.liabilities, data.masterExpenses, isInitialized, selectedDate, snapshotNetWorth, updateTotalFromMasterExpense]);


  const value = useMemo(() => ({
    data,
    setData,
    selectedDate,
    setSelectedDate,
    addIncome,
    updateIncome,
    deleteIncome,
    addExpense,
    updateExpense,
    deleteExpense,
    addMasterExpense,
    updateMasterExpense,
    deleteMasterExpense,
    addMasterExpenseTransaction,
    updateMasterExpenseTransaction,
    deleteMasterExpenseTransaction,
    addCreditCard,
    updateCreditCard,
    deleteCreditCard,
    addCreditCardTransaction,
    updateCreditCardTransaction,
    deleteCreditCardTransaction,
    addNote,
    deleteNote,
    getFinancialDataForPastMonths,
    addAsset,
    updateAsset,
    deleteAsset,
    addLiability,
    updateLiability,
    deleteLiability,
    snapshotNetWorth,
  }), [data, selectedDate, snapshotNetWorth]);

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinances() {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinances must be used within a FinanceProvider');
  }
  return context;
}
