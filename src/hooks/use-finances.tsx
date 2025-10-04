

'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { FinanceData, getDefaultData } from '@/lib/data';
import type { Income, Expense, Note, Asset, Liability, CreditCard, CreditCardTransaction, MasterExpense, MasterExpenseTransaction, ExpenseStatus } from '@/lib/types';
import { startOfMonth, getMonth, getYear, format, subMonths, isEqual, parse } from 'date-fns';
import { useAuth } from './use-auth';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, writeBatch } from 'firebase/firestore';
import { addDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase/non-blocking-updates';

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
  addMasterExpenseTransaction: (masterExpenseId: string, transaction: Omit<MasterExpenseTransaction, 'id'>) => void;
  updateMasterExpenseTransaction: (masterExpenseId: string, transaction: MasterExpenseTransaction) => void;
  deleteMasterExpenseTransaction: (masterExpenseId: string, transactionId: string) => void;

  // Credit Card
  addCreditCard: (card: Omit<CreditCard, 'id' | 'transactions' | 'userId'>) => void;
  updateCreditCard: (card: Omit<CreditCard, 'userId'>) => void;
  deleteCreditCard: (id: string) => Promise<void>;
  addCreditCardTransaction: (cardId: string, transaction: Omit<CreditCardTransaction, 'id'>) => void;
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
  updateLiability: (liability: Omit<Liability, 'lastUpdated' | 'userId'>) => void;
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
  const { data: incomes } = useCollection<Income>(incomesCol);
  const { data: expenses } = useCollection<Expense>(expensesCol);
  const { data: masterExpenses } = useCollection<MasterExpense>(masterExpensesCol);
  const { data: creditCards } = useCollection<CreditCard>(creditCardsCol);
  const { data: assets } = useCollection<Asset>(assetsCol);
  const { data: liabilities } = useCollection<Liability>(liabilitiesCol);
  const { data: notes } = useCollection<Note>(notesCol);
  const { data: netWorthHistory } = useCollection<NetWorthHistory>(netWorthHistoryCol);
  
  // Create a memoized data object
  const data: FinanceData = useMemo(() => ({
    incomes: incomes || [],
    expenses: expenses || [],
    masterExpenses: masterExpenses || [],
    creditCards: creditCards || [],
    assets: assets || [],
    liabilities: liabilities || [],
    notes: notes || [],
    netWorthHistory: netWorthHistory || [],
    categoryBudgets: getDefaultData().categoryBudgets, // Assuming this is static for now
  }), [incomes, expenses, masterExpenses, creditCards, assets, liabilities, notes, netWorthHistory]);

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
  
  const addExpense = (expense: Omit<Expense, 'id' | 'userId'>) => {
    const ref = getCollectionRef('expenses');
    if (ref) addDocumentNonBlocking(ref, expense);
  };
  const updateExpense = (expense: Omit<Expense, 'userId'>) => {
    const ref = getCollectionRef('expenses');
    if (ref) updateDocumentNonBlocking(doc(ref, expense.id), expense);
  };
  const deleteExpense = (id: string) => {
    const ref = getCollectionRef('expenses');
    if (ref) deleteDocumentNonBlocking(doc(ref, id));
  };

  const addMasterExpense = (expense: Omit<MasterExpense, 'id' | 'transactions' | 'userId'>) => {
    const ref = getCollectionRef('masterExpenses');
    if (ref) addDocumentNonBlocking(ref, { ...expense, transactions: [] });
  };
  const updateMasterExpense = (expense: Omit<MasterExpense, 'userId'>) => {
    const ref = getCollectionRef('masterExpenses');
    if (ref) updateDocumentNonBlocking(doc(ref, expense.id), expense);
  };
  const deleteMasterExpense = async (id: string) => {
    if (!user) return;
    const batch = writeBatch(firestore);
    // Delete the master expense doc
    const masterExpenseDocRef = doc(firestore, 'users', user.uid, 'masterExpenses', id);
    batch.delete(masterExpenseDocRef);
    // Delete the associated summary expenses
    const summaryExpensesToDelete = data.expenses.filter(e => e.masterExpenseId === id);
    summaryExpensesToDelete.forEach(exp => {
      const expDocRef = doc(firestore, 'users', user.uid, 'expenses', exp.id);
      batch.delete(expDocRef);
    });
    await batch.commit();
  };

  const addMasterExpenseTransaction = (masterExpenseId: string, transaction: Omit<MasterExpenseTransaction, 'id'>) => {
    if (!user) return;
    const masterExpense = data.masterExpenses.find(me => me.id === masterExpenseId);
    if (!masterExpense) return;
    const updatedTransactions = [...masterExpense.transactions, { ...transaction, id: crypto.randomUUID() }];
    updateMasterExpense({ ...masterExpense, transactions: updatedTransactions });
  };
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
  
  const addCreditCardTransaction = (cardId: string, transaction: Omit<CreditCardTransaction, 'id'>) => {
    if (!user) return;
    const card = data.creditCards.find(c => c.id === cardId);
    if (!card) return;
    const newTransaction = { ...transaction, id: crypto.randomUUID() };
    const updatedTransactions = [...card.transactions, newTransaction];
    updateCreditCard({ ...card, transactions: updatedTransactions });

    if (transaction.masterExpenseId) {
        addMasterExpenseTransaction(transaction.masterExpenseId, {
            id: `cc-trans-${newTransaction.id}`,
            description: transaction.description,
            amount: transaction.amount,
            date: transaction.date,
            status: 'Paid',
            paidViaCard: card.name,
        });
    }
  };
  const updateCreditCardTransaction = (cardId: string, transaction: CreditCardTransaction) => {
      if (!user) return;
      const card = data.creditCards.find(c => c.id === cardId);
      if (!card) return;

      const originalTransaction = card.transactions.find(t => t.id === transaction.id);
      
      const updatedTransactions = card.transactions.map(t => t.id === transaction.id ? transaction : t);
      updateCreditCard({ ...card, transactions: updatedTransactions });

      const newMasterExpenseTransaction: Omit<MasterExpenseTransaction, "id"> = {
        description: transaction.description,
        amount: transaction.amount,
        date: transaction.date,
        status: 'Paid',
        paidViaCard: card.name,
      };

      // If master expense link changed
      if (originalTransaction?.masterExpenseId !== transaction.masterExpenseId) {
          // Remove from old master expense if it existed
          if (originalTransaction?.masterExpenseId) {
              deleteMasterExpenseTransaction(originalTransaction.masterExpenseId, `cc-trans-${transaction.id}`);
          }
          // Add to new master expense if it exists
          if (transaction.masterExpenseId) {
              addMasterExpenseTransaction(transaction.masterExpenseId, {
                ...newMasterExpenseTransaction,
                id: `cc-trans-${transaction.id}`,
              });
          }
      } else if (transaction.masterExpenseId) {
          // If link didn't change but other details might have, update it
          updateMasterExpenseTransaction(transaction.masterExpenseId, {
            ...newMasterExpenseTransaction,
            id: `cc-trans-${transaction.id}`,
          });
      }
  };
  const deleteCreditCardTransaction = (cardId: string, transactionId: string) => {
    if (!user) return;
    const card = data.creditCards.find(c => c.id === cardId);
    if (!card) return;
    const transaction = card.transactions.find(t => t.id === transactionId);
    const updatedTransactions = card.transactions.filter(t => t.id !== transactionId);
    updateCreditCard({ ...card, transactions: updatedTransactions });

    if (transaction?.masterExpenseId) {
        deleteMasterExpenseTransaction(transaction.masterExpenseId, `cc-trans-${transaction.id}`);
    }
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
  const updateLiability = (liability: Omit<Liability, 'lastUpdated' | 'userId'>) => {
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

    const ref = collection(firestore, 'users', user.uid, 'netWorthHistory');

    if (!existingEntry) {
        addDocumentNonBlocking(ref, { date: currentMonthKey, value: currentNetWorth });
    } else if (existingEntry.value !== currentNetWorth) {
        updateDocumentNonBlocking(doc(ref, existingEntry.id), { value: currentNetWorth });
    }
}, [user, firestore, assets, liabilities, netWorthHistory]);

useEffect(() => {
    snapshotNetWorth();
}, [assets, liabilities, snapshotNetWorth]);


  const updateTotalFromMasterExpense = useCallback(() => {
    if (!user || !masterExpenses || !expenses) return;
    const batch = writeBatch(firestore);
    const month = getMonth(selectedDate);
    const year = getYear(selectedDate);

    const existingSummaries = expenses.filter(e => e.masterExpenseId);
    const summaryMap = new Map(existingSummaries.map(e => [e.id, e]));

    masterExpenses.forEach(me => {
      const paidTotal = me.transactions
        .filter(t => getMonth(new Date(t.date)) === month && getYear(new Date(t.date)) === year && t.status === 'Paid')
        .reduce((sum, t) => sum + t.amount, 0);

      const unpaidTotal = me.transactions
        .filter(t => getMonth(new Date(t.date)) === month && getYear(new Date(t.date)) === year && t.status === 'Not Paid')
        .reduce((sum, t) => sum + t.amount, 0);

      const processSummary = (status: ExpenseStatus, amount: number) => {
        const suffix = status === 'Paid' ? 'paid' : 'unpaid';
        const id = `exp-from-${me.id}-${suffix}`;
        const description = me.name;
        const expDocRef = doc(firestore, 'users', user.uid, 'expenses', id);

        if (amount > 0) {
          batch.set(expDocRef, {
            id, masterExpenseId: me.id, description, amount, category: 'Master Expense',
            dueDate: selectedDate.toISOString(), status, isRecurring: false,
          }, { merge: true });
        } else {
          if (summaryMap.has(id)) {
            batch.delete(expDocRef);
          }
        }
      };

      processSummary('Paid', paidTotal);
      processSummary('Not Paid', unpaidTotal);
    });

    batch.commit().catch(e => console.error("Batch update for master expenses failed", e));
  }, [selectedDate, user, firestore, masterExpenses, expenses]);

  const syncCreditCardExpenses = useCallback(() => {
    if (!user || !creditCards || !expenses) return;

    // This function will now ONLY sync transactions NOT linked to a master expense
    const allCreditCardTransactions = creditCards.flatMap(card => 
      card.transactions.map(t => ({...t, cardName: card.name}))
    );
    
    // Key change: Filter out transactions that have a masterExpenseId
    const transactionsToSync = allCreditCardTransactions.filter(t => !t.masterExpenseId);
    
    const existingCCExpenses = expenses.filter(e => e.paidViaCard);

    const batch = writeBatch(firestore);
    const expensesRef = collection(firestore, 'users', user.uid, 'expenses');

    const transactionsToSyncMap = new Map(transactionsToSync.map(t => [`cc-trans-${t.id}`, t]));
    const existingCCExpensesMap = new Map(existingCCExpenses.map(e => [e.id, e]));

    // Add or update expenses from credit card transactions
    for(const [id, transaction] of transactionsToSyncMap.entries()) {
        const expenseData: Omit<Expense, 'id'> = {
            description: transaction.description,
            amount: transaction.amount,
            dueDate: transaction.date,
            status: 'Paid',
            isRecurring: false,
            category: 'Credit Card',
            paidViaCard: transaction.cardName,
        };
        const docRef = doc(expensesRef, id);
        batch.set(docRef, expenseData, { merge: true });
    }
    
    // Delete expenses that are no longer in credit card transactions (or have been moved to a master expense)
    for(const [id, expense] of existingCCExpensesMap.entries()) {
      // Only delete if it's not a master expense summary
      if (!expense.masterExpenseId && !transactionsToSyncMap.has(id)) {
        const docRef = doc(expensesRef, id);
        batch.delete(docRef);
      }
    }

    batch.commit().catch(e => console.error("Batch update for credit card expenses failed", e));
  }, [user, firestore, creditCards, expenses]);

  useEffect(() => {
      if (!user || !data) return;
      updateTotalFromMasterExpense();
      syncCreditCardExpenses();
  }, [user, data, selectedDate, updateTotalFromMasterExpense, syncCreditCardExpenses]);

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


  const value = useMemo(() => ({
    data,
    selectedDate,
    setSelectedDate,
    addIncome, updateIncome, deleteIncome,
    addExpense, updateExpense, deleteExpense,
    addMasterExpense, updateMasterExpense, deleteMasterExpense,
    addMasterExpenseTransaction, updateMasterExpenseTransaction, deleteMasterExpenseTransaction,
    addCreditCard, updateCreditCard, deleteCreditCard,
    addCreditCardTransaction, updateCreditCardTransaction, deleteCreditCardTransaction,
    addNote, deleteNote,
    addAsset, updateAsset, deleteAsset,
    addLiability, updateLiability, deleteLiability,
    snapshotNetWorth,
    getFinancialDataForPastMonths,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [data, selectedDate, snapshotNetWorth, deleteMasterExpense, deleteCreditCard, user, firestore]);

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
