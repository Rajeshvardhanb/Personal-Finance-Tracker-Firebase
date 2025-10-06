

'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { FinanceData, getDefaultData } from '@/lib/data';
import type { Income, Expense, Note, Asset, Liability, CreditCard, CreditCardTransaction, MasterExpense, MasterExpenseTransaction, ExpenseStatus, TransactionStatus } from '@/lib/types';
import { startOfMonth, getMonth, getYear, format, subMonths, isEqual, parse } from 'date-fns';
import { useAuth } from './use-auth';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, writeBatch } from 'firebase/firestore';
import { addDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';

interface FinanceContextType {
  data: FinanceData;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;

  // Income
  addIncome: (income: Omit<Income, 'id' | 'userId'>) => void;
  updateIncome: (income: Omit<Income, 'userId'>) => void;
  deleteIncome: (id: string) => void;

  // Expense
  addExpense: (expense: Omit<Expense, 'id' | 'userId'>) => void;
  updateExpense: (expense: Omit<Expense, 'userId'>) => void;
  deleteExpense: (id: string) => void;

  // Master Expense
  addMasterExpense: (expense: Omit<MasterExpense, 'id' | 'transactions' | 'userId'>) => void;
  updateMasterExpense: (expense: Omit<MasterExpense, 'userId'>) => void;
  deleteMasterExpense: (id: string) => Promise<void>;
  addMasterExpenseTransaction: (masterExpenseId: string, transaction: Omit<MasterExpenseTransaction, 'id' | 'paidViaCard'>) => void;
  updateMasterExpenseTransaction: (masterExpenseId: string, transaction: MasterExpenseTransaction) => void;
  deleteMasterExpenseTransaction: (masterExpenseId: string, transactionId: string) => void;

  // Credit Card
  addCreditCard: (card: Omit<CreditCard, 'id' | 'transactions' | 'userId'>) => void;
  updateCreditCard: (card: Omit<CreditCard, 'userId'>) => void;
  deleteCreditCard: (id: string) => Promise<void>;
  addCreditCardTransaction: (cardId: string, transaction: Omit<CreditCardTransaction, 'id'> & { masterExpenseId?: string }) => void;
  updateCreditCardTransaction: (cardId: string, transaction: CreditCardTransaction) => void;
  deleteCreditCardTransaction: (cardId: string, transactionId: string) => void;

  // Notes
  addNote: (note: Omit<Note, 'id' | 'userId'>) => void;
  deleteNote: (id: string) => void;
  getFinancialDataForPastMonths: (numberOfMonths: number) => { month: string; income: number; expenses: number; creditCardSpending: number, overspendingCategories: string[] }[];

  // Net Worth
  addAsset: (asset: Omit<Asset, 'id' | 'lastUpdated' | 'userId'>) => void;
  updateAsset: (asset: Omit<Asset, 'lastUpdated' | 'userId'>) => void;
  deleteAsset: (id: string) => void;
  addLiability: (liability: Omit<Liability, 'id' | 'lastUpdated' | 'userId'>) => void;
  updateLiability: (liability: Omit<Liability, 'lastUpdated'| 'userId'>) => void;
  deleteLiability: (id: string) => void;
  snapshotNetWorth: () => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const firestore = useFirestore();
  const [selectedDate, setSelectedDate] = useState<Date>(startOfMonth(new Date()));

  // Base collection references
  const incomesCol = useMemoFirebase(() => user ? collection(firestore, 'users', user.uid, 'incomes') : null, [firestore, user]);
  const expensesCol = useMemoFirebase(() => user ? collection(firestore, 'users', user.uid, 'expenses') : null, [firestore, user]);
  const masterExpensesCol = useMemoFirebase(() => user ? collection(firestore, 'users', user.uid, 'masterExpenses') : null, [firestore, user]);
  const creditCardsCol = useMemoFirebase(() => user ? collection(firestore, 'users', user.uid, 'creditCards') : null, [firestore, user]);
  const assetsCol = useMemoFirebase(() => user ? collection(firestore, 'users', user.uid, 'assets') : null, [firestore, user]);
  const liabilitiesCol = useMemoFirebase(() => user ? collection(firestore, 'users', user.uid, 'liabilities') : null, [firestore, user]);
  const notesCol = useMemoFirebase(() => user ? collection(firestore, 'users', user.uid, 'notes') : null, [firestore, user]);
  const netWorthHistoryCol = useMemoFirebase(() => user ? collection(firestore, 'users', user.uid, 'netWorthHistory') : null, [firestore, user]);

  // Fetching data
  const { data: incomesData } = useCollection<Income>(incomesCol);
  const { data: expensesData } = useCollection<Expense>(expensesCol);
  const { data: masterExpensesData } = useCollection<MasterExpense>(masterExpensesCol);
  const { data: creditCardsData } = useCollection<CreditCard>(creditCardsCol);
  const { data: assetsData } = useCollection<Asset>(assetsCol);
  const { data: liabilitiesData } = useCollection<Liability>(liabilitiesCol);
  const { data: notesData } = useCollection<Note>(notesCol);
  const { data: netWorthHistoryData } = useCollection<any>(netWorthHistoryCol);
  
  // Create a memoized data object
  const data: FinanceData = useMemo(() => ({
    incomes: incomesData || [],
    expenses: expensesData || [],
    masterExpenses: masterExpensesData || [],
    creditCards: creditCardsData || [],
    assets: assetsData || [],
    liabilities: liabilitiesData || [],
    notes: notesData || [],
    netWorthHistory: netWorthHistoryData || [],
    categoryBudgets: getDefaultData().categoryBudgets, // Assuming this is static for now
  }), [incomesData, expensesData, masterExpensesData, creditCardsData, assetsData, liabilitiesData, notesData, netWorthHistoryData]);
  
  const { assets, liabilities, netWorthHistory } = data;

  const getCollectionRef = (name: string) => user ? collection(firestore, 'users', user.uid, name) : null;
  

  // --- CRUD Operations ---

  const addIncome = (income: Omit<Income, 'id' | 'userId'>) => {
    const ref = getCollectionRef('incomes');
    if (ref) addDocumentNonBlocking(ref, income);
  };
  const updateIncome = (income: Omit<Income, 'userId'>) => {
    const ref = getCollectionRef('incomes');
    if (ref) updateDocumentNonBlocking(doc(ref, income.id), income);
  };
  const deleteIncome = (id: string) => {
    const ref = getCollectionRef('incomes');
    if (ref) deleteDocumentNonBlocking(doc(ref, id));
  };
  
  const addExpense = useCallback((expense: Omit<Expense, 'id' | 'userId'>) => {
    if (!user) return;
    const ref = getCollectionRef('expenses');
    if (!ref) return;

    addDocumentNonBlocking(ref, expense);
  }, [user, firestore]);

  const updateExpense = (expense: Omit<Expense, 'userId'>) => {
    const ref = getCollectionRef('expenses');
    if (ref) updateDocumentNonBlocking(doc(ref, expense.id), expense);
  };

  const addCreditCard = (card: Omit<CreditCard, 'id' | 'transactions' | 'userId'>) => {
    const ref = getCollectionRef('creditCards');
    if (ref) addDocumentNonBlocking(ref, { ...card, transactions: [] });
  };
  const updateCreditCard = (card: Omit<CreditCard, 'userId'>) => {
    const ref = getCollectionRef('creditCards');
    if (ref) updateDocumentNonBlocking(doc(ref, card.id), card);
  };
  const deleteCreditCard = async (id: string) => {
    const ref = getCollectionRef('creditCards');
    if (ref) deleteDocumentNonBlocking(doc(ref, id));
  };
  
  const updateMasterExpense = (expense: Omit<MasterExpense, 'userId'>) => {
    const ref = getCollectionRef('masterExpenses');
    if (ref) updateDocumentNonBlocking(doc(ref, expense.id), expense);
  };

  const addCreditCardTransaction = useCallback((cardId: string, transaction: Omit<CreditCardTransaction, 'id'> & { masterExpenseId?: string }) => {
    if (!user || !creditCardsData || !masterExpensesData) return;
    const card = creditCardsData.find(c => c.id === cardId);
    if (!card) return;

    const newTransaction: CreditCardTransaction = { ...transaction, id: crypto.randomUUID() };
    
    const updatedCardTransactions = [...card.transactions, newTransaction];
    updateCreditCard({ ...card, transactions: updatedCardTransactions });

    // Link to Master Expense if ID is provided
    if (transaction.masterExpenseId) {
        const masterExpense = masterExpensesData.find(me => me.id === transaction.masterExpenseId);
        if (masterExpense) {
            const masterTransaction: MasterExpenseTransaction = {
                id: newTransaction.id, // Use the same ID for easy linking
                description: newTransaction.description,
                amount: newTransaction.amount,
                date: newTransaction.date,
                status: `Paid by ${card.name}` as 'Paid',
            };
            const updatedMasterTransactions = [...masterExpense.transactions, masterTransaction];
            updateMasterExpense({ ...masterExpense, transactions: updatedMasterTransactions });
        }
    } else {
        // Only add to general expenses if not part of a master expense
        const expenseStatus: ExpenseStatus = `Paid by ${card.name}`;
        addExpense({
            category: 'Credit Card Payment',
            description: newTransaction.description,
            amount: newTransaction.amount,
            dueDate: newTransaction.date,
            status: expenseStatus,
            isRecurring: false,
        });
    }
  }, [user, creditCardsData, masterExpensesData, addExpense, firestore]);

  const addExpenseWithCardSync = useCallback((expense: Omit<Expense, 'id' | 'userId'>) => {
    if (!creditCardsData) return;
    addExpense(expense);

    const paidByPrefix = "Paid by ";
    if (expense.status.startsWith(paidByPrefix)) {
        const cardName = expense.status.substring(paidByPrefix.length);
        const sourceCard = creditCardsData.find(c => c.name === cardName);
        if (sourceCard) {
            addCreditCardTransaction(sourceCard.id, {
                description: expense.description,
                amount: expense.amount,
                date: expense.dueDate,
            }); 
        }
    }
  }, [creditCardsData, addExpense, addCreditCardTransaction]);

  const deleteCreditCardTransaction = useCallback((cardId: string, transactionId: string) => {
    if (!user || !expensesData || !creditCardsData || !masterExpensesData) return;
    const card = creditCardsData.find(c => c.id === cardId);
    if (!card) return;
    const transactionToDelete = card.transactions.find(t => t.id === transactionId);

    // Remove the transaction from the credit card's list
    const updatedTransactions = card.transactions.filter(t => t.id !== transactionId);
    updateCreditCard({ ...card, transactions: updatedTransactions });

    if (transactionToDelete) {
        // If linked to a master expense, remove it from there
        if (transactionToDelete.masterExpenseId) {
            const masterExpense = masterExpensesData.find(me => me.id === transactionToDelete.masterExpenseId);
            if (masterExpense) {
                const updatedMasterTransactions = masterExpense.transactions.filter(t => t.id !== transactionId);
                updateMasterExpense({ ...masterExpense, transactions: updatedMasterTransactions });
            }
        } else {
            // Otherwise, find and delete the corresponding expense from the main expenses list
            const correspondingExpense = expensesData.find(exp =>
                exp.description === transactionToDelete.description &&
                exp.amount === transactionToDelete.amount &&
                Math.abs(new Date(exp.dueDate).getTime() - new Date(transactionToDelete.date).getTime()) < 2000 && // 2s tolerance
                exp.status === `Paid by ${card.name}`
            );
            if (correspondingExpense) {
                const ref = getCollectionRef('expenses');
                if (ref) deleteDocumentNonBlocking(doc(ref, correspondingExpense.id));
            }
        }
    }
  }, [user, expensesData, creditCardsData, masterExpensesData, firestore]);
  
 const deleteExpense = useCallback((id: string) => {
    if (!user || !expensesData || !creditCardsData) return;

    const expenseToDelete = expensesData.find(e => e.id === id);
    if (!expenseToDelete) return;

    const paidByPrefix = "Paid by ";
    if (expenseToDelete.status.startsWith(paidByPrefix)) {
        const cardName = expenseToDelete.status.substring(paidByPrefix.length);
        const sourceCard = creditCardsData.find(c => c.name === cardName);
        if (sourceCard) {
            // Find the transaction by description, amount, and a rough time match.
            const transactionToDelete = sourceCard.transactions.find(
                t => t.description === expenseToDelete.description &&
                     t.amount === expenseToDelete.amount &&
                     Math.abs(new Date(t.date).getTime() - new Date(expenseToDelete.dueDate).getTime()) < 2000 // 2-second tolerance
            );
            if (transactionToDelete) {
                deleteCreditCardTransaction(sourceCard.id, transactionToDelete.id);
                return; 
            }
        }
    }

    const ref = getCollectionRef('expenses');
    if (ref) {
      deleteDocumentNonBlocking(doc(ref, id));
    }
  }, [user, expensesData, creditCardsData, firestore, deleteCreditCardTransaction]);

  
  const addMasterExpense = (expense: Omit<MasterExpense, 'id' | 'transactions' | 'userId'>) => {
    const ref = getCollectionRef('masterExpenses');
    if (ref) addDocumentNonBlocking(ref, { ...expense, transactions: [] });
  };

  const deleteMasterExpense = async (id: string) => {
    const ref = getCollectionRef('masterExpenses');
    if (ref) deleteDocumentNonBlocking(doc(ref, id));
  };

  const addMasterExpenseTransaction = useCallback((masterExpenseId: string, transaction: Omit<MasterExpenseTransaction, 'id'>) => {
    if (!user || !masterExpensesData || !creditCardsData) return;
    const masterExpense = masterExpensesData.find(me => me.id === masterExpenseId);
    if (!masterExpense) return;

    const newTransaction = { ...transaction, id: crypto.randomUUID() };
    const updatedTransactions = [...masterExpense.transactions, newTransaction];
    updateMasterExpense({ ...masterExpense, transactions: updatedTransactions });

    const paidByPrefix = "Paid by ";
    if (transaction.status.startsWith(paidByPrefix)) {
        const cardName = transaction.status.substring(paidByPrefix.length);
        const sourceCard = creditCardsData.find(c => c.name === cardName);
        if (sourceCard) {
            addCreditCardTransaction(sourceCard.id, {
                description: transaction.description,
                amount: transaction.amount,
                date: transaction.date,
                masterExpenseId: masterExpenseId,
            });
        }
    }
  }, [user, masterExpensesData, creditCardsData, firestore, addCreditCardTransaction]);

  const updateMasterExpenseTransaction = (masterExpenseId: string, transaction: MasterExpenseTransaction) => {
    if (!user) return;
    const masterExpense = data.masterExpenses.find(me => me.id === masterExpenseId);
    if (!masterExpense) return;
    const updatedTransactions = masterExpense.transactions.map(t => t.id === transaction.id ? transaction : t);
    updateMasterExpense({ ...masterExpense, transactions: updatedTransactions });
  };
  const deleteMasterExpenseTransaction = (masterExpenseId: string, transactionId: string) => {
    if (!user) return;
    const masterExpense = data.masterExpenses.find(me => me.id === masterExpenseId);
    if (!masterExpense) return;
    const updatedTransactions = masterExpense.transactions.filter(t => t.id !== transactionId);
    updateMasterExpense({ ...masterExpense, transactions: updatedTransactions });
  };

  const updateCreditCardTransaction = (cardId: string, transaction: CreditCardTransaction) => {
    if (!user) return;
    const card = data.creditCards.find(c => c.id === cardId);
    if (!card) return;
    const updatedTransactions = card.transactions.map(t => t.id === transaction.id ? transaction : t);
    updateCreditCard({ ...card, transactions: updatedTransactions });
  };
  
  const addNote = (note: Omit<Note, 'id' | 'userId'>) => {
    const ref = getCollectionRef('notes');
    if (ref) addDocumentNonBlocking(ref, { ...note, createdAt: new Date().toISOString() });
  };
  const deleteNote = (id: string) => {
    const ref = getCollectionRef('notes');
    if (ref) deleteDocumentNonBlocking(doc(ref, id));
  };

  const addAsset = (asset: Omit<Asset, 'id' | 'lastUpdated' | 'userId'>) => {
    const ref = getCollectionRef('assets');
    if (ref) addDocumentNonBlocking(ref, { ...asset, lastUpdated: new Date().toISOString() });
  };
  const updateAsset = (asset: Omit<Asset, 'lastUpdated' | 'userId'>) => {
    const ref = getCollectionRef('assets');
    if (ref) updateDocumentNonBlocking(doc(ref, asset.id), { ...asset, lastUpdated: new Date().toISOString() });
  };
  const deleteAsset = (id: string) => {
    const ref = getCollectionRef('assets');
    if (ref) deleteDocumentNonBlocking(doc(ref, id));
  };
  
  const addLiability = (liability: Omit<Liability, 'id' | 'lastUpdated' | 'userId'>) => {
    const ref = getCollectionRef('liabilities');
    if (ref) addDocumentNonBlocking(ref, { ...liability, lastUpdated: new Date().toISOString() });
  };
  const updateLiability = (liability: Omit<Liability, 'lastUpdated'| 'userId'>) => {
    const ref = getCollectionRef('liabilities');
    if (ref) updateDocumentNonBlocking(doc(ref, liability.id), { ...liability, lastUpdated: new Date().toISOString() });
  };
  const deleteLiability = (id: string) => {
    const ref = getCollectionRef('liabilities');
    if (ref) deleteDocumentNonBlocking(doc(ref, id));
  };
  
  const snapshotNetWorth = useCallback(() => {
    if (!user || !assets || !liabilities || !netWorthHistory) return;
    const totalAssets = assets.reduce((sum, a) => sum + a.value, 0);
    const totalLiabilities = liabilities.reduce((sum, l) => sum + l.value, 0);
    const currentNetWorth = totalAssets - totalLiabilities;
    const currentMonthKey = format(new Date(), 'yyyy-MM');

    const history = netWorthHistory || [];
    const existingEntry = history.find(h => h.date === currentMonthKey);

    if (!existingEntry) {
      const ref = getCollectionRef('netWorthHistory');
      if (ref) addDocumentNonBlocking(ref, { date: currentMonthKey, value: currentNetWorth });
    } else if (existingEntry.value !== currentNetWorth) {
       const ref = getCollectionRef('netWorthHistory');
      if (ref) updateDocumentNonBlocking(doc(ref, existingEntry.id), { value: currentNetWorth });
    }
  }, [assets, liabilities, netWorthHistory, user]);

   useEffect(() => {
    if(assets.length || liabilities.length) {
      snapshotNetWorth();
    }
  }, [assets, liabilities, snapshotNetWorth]);


  const getFinancialDataForPastMonths = (numberOfMonths: number) => {
    const pastMonthsData = [];
    if (!data) return [];
    for (let i = 0; i < numberOfMonths; i++) {
        const date = subMonths(new Date(), i);
        const month = getMonth(date);
        const year = getYear(date);

        const income = data.incomes
            .filter(d => getMonth(new Date(d.date)) === month && getYear(new Date(d.date)) === year && d.status === 'Credited')
            .reduce((acc, d) => acc + d.creditedAmount, 0);

        const expensesValue = data.expenses
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
            expenses: expensesValue,
            creditCardSpending,
            overspendingCategories,
        });
    }
    return pastMonthsData;
  };
  
   // One-time cleanup for old master expense summaries
  useEffect(() => {
    if (!user || !expensesData || !firestore) return;
    
    const cleanup = async () => {
        const expensesToDelete = expensesData.filter(e => e.masterExpenseId && e.category === 'Master Expense');
        if (expensesToDelete.length > 0) {
            const batch = writeBatch(firestore);
            const expensesRef = collection(firestore, 'users', user.uid, 'expenses');
            expensesToDelete.forEach(expense => {
                const docRef = doc(expensesRef, expense.id);
                batch.delete(docRef);
            });
            await batch.commit();
        }
    };
    cleanup();
  }, [user, expensesData, firestore]);

  const value = useMemo(() => ({
    data,
    selectedDate,
    setSelectedDate,
    addIncome, updateIncome, deleteIncome,
    addExpense: addExpenseWithCardSync, 
    updateExpense, deleteExpense,
    addMasterExpense, updateMasterExpense, deleteMasterExpense,
    addMasterExpenseTransaction, updateMasterExpenseTransaction, deleteMasterExpenseTransaction,
    addCreditCard, updateCreditCard, deleteCreditCard,
    addCreditCardTransaction, updateCreditCardTransaction, deleteCreditCardTransaction,
    addNote, deleteNote,
    addAsset, updateAsset, deleteAsset,
    addLiability, updateLiability, deleteLiability,
    snapshotNetWorth,
    getFinancialDataForPastMonths,
  }), [data, selectedDate, snapshotNetWorth, deleteMasterExpense, addCreditCardTransaction, deleteExpense, user, expensesData, firestore, addExpenseWithCardSync, addMasterExpenseTransaction, deleteCreditCardTransaction, updateMasterExpense, updateExpense, addIncome, updateIncome, deleteIncome, addMasterExpense, addCreditCard, updateCreditCard, deleteCreditCard, updateCreditCardTransaction, addNote, deleteNote, addAsset, updateAsset, deleteAsset, addLiability, updateLiability, deleteLiability, getFinancialDataForPastMonths]);

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
