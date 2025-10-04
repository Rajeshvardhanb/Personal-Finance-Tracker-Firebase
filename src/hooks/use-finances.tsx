'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { FinanceData, initialData } from '@/lib/data';
import type { Income, Expense, Note, Asset, Liability } from '@/lib/types';
import { startOfMonth, getMonth, getYear, format, subMonths, isEqual, parse } from 'date-fns';

interface FinanceContextType {
  data: FinanceData;
  setData: (data: FinanceData) => void;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  addIncome: (income: Omit<Income, 'id'>) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  addNote: (note: Omit<Note, 'id'>) => void;
  deleteNote: (id: string) => void;
  getFinancialDataForPastMonths: (numberOfMonths: number) => { month: string; income: number; expenses: number; creditCardSpending: number }[];

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
        setDataState(JSON.parse(storedData));
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
  
  const addExpense = (expense: Omit<Expense, 'id'>) => {
    setDataState(prev => ({
      ...prev,
      expenses: [...prev.expenses, { ...expense, id: crypto.randomUUID() }]
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

        const creditCardSpending = data.creditCards
            .flatMap(cc => cc.transactions)
            .filter(t => getMonth(new Date(t.date)) === month && getYear(new Date(t.date)) === year)
            .reduce((acc, t) => acc + t.amount, 0);

        pastMonthsData.unshift({
            month: format(date, 'MMM yyyy'),
            income,
            expenses,
            creditCardSpending,
            overspendingCategories: [], // Placeholder for now
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

  useEffect(() => {
    if (isInitialized) {
      snapshotNetWorth();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.assets, data.liabilities, isInitialized, snapshotNetWorth]);


  const value = useMemo(() => ({
    data,
    setData,
    selectedDate,
    setSelectedDate,
    addIncome,
    addExpense,
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
