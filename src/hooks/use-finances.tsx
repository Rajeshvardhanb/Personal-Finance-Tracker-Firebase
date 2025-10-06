

'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { FinanceData, getDefaultData } from '@/lib/data';
import type { Income, Expense, Note, Asset, Liability, CreditCard, CreditCardTransaction, MasterExpense, MasterExpenseTransaction, ExpenseStatus, TransactionStatus, ExpenseCategory } from '@/lib/types';
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

  // Expense Categories
  addExpenseCategory: (category: Omit<ExpenseCategory, 'id'>) => void;
  deleteExpenseCategory: (id: string) => void;

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
  const [hasCheckedCategories, setHasCheckedCategories] = useState(false);


  // Base collection references
  const incomesCol = useMemoFirebase(() => user ? collection(firestore, 'users', user.uid, 'incomes') : null, [firestore, user]);
  const expensesCol = useMemoFirebase(() => user ? collection(firestore, 'users', user.uid, 'expenses') : null, [firestore, user]);
  const masterExpensesCol = useMemoFirebase(() => user ? collection(firestore, 'users', user.uid, 'masterExpenses') : null, [firestore, user]);
  const creditCardsCol = useMemoFirebase(() => user ? collection(firestore, 'users', user.uid, 'creditCards') : null, [firestore, user]);
  const assetsCol = useMemoFirebase(() => user ? collection(firestore, 'users', user.uid, 'assets') : null, [firestore, user]);
  const liabilitiesCol = useMemoFirebase(() => user ? collection(firestore, 'users', user.uid, 'liabilities') : null, [firestore, user]);
  const notesCol = useMemoFirebase(() => user ? collection(firestore, 'users', user.uid, 'notes') : null, [firestore, user]);
  const netWorthHistoryCol = useMemoFirebase(() => user ? collection(firestore, 'users', user.uid, 'netWorthHistory') : null, [firestore, user]);
  const expenseCategoriesCol = useMemoFirebase(() => user ? collection(firestore, 'users', user.uid, 'expenseCategories') : null, [firestore, user]);

  // Fetching data
  const { data: incomesData } = useCollection<Income>(incomesCol);
  const { data: expensesData } = useCollection<Expense>(expensesCol);
  const { data: masterExpensesData } = useCollection<MasterExpense>(masterExpensesCol);
  const { data: creditCardsData } = useCollection<CreditCard>(creditCardsCol);
  const { data: assetsData } = useCollection<Asset>(assetsCol);
  const { data: liabilitiesData } = useCollection<Liability>(liabilitiesCol);
  const { data: notesData } = useCollection<Note>(notesCol);
  const { data: netWorthHistoryData } = useCollection<any>(netWorthHistoryCol);
  const { data: expenseCategoriesData, isLoading: expenseCategoriesLoading } = useCollection<ExpenseCategory>(expenseCategoriesCol);

  // One-time check to populate default expense categories
  useEffect(() => {
    if (user && !expenseCategoriesLoading && expenseCategoriesData !== null && !hasCheckedCategories) {
      const defaultCategories = getDefaultData().expenseCategories;
      const userCategoryNames = new Set(expenseCategoriesData.map(c => c.name));
      const missingCategories = defaultCategories.filter(dc => !userCategoryNames.has(dc.name));

      if (missingCategories.length > 0) {
        const batch = writeBatch(firestore);
        const categoriesRef = collection(firestore, 'users', user.uid, 'expenseCategories');
        missingCategories.forEach(category => {
          // We don't need a specific doc ID, Firestore will generate one
          const docRef = doc(categoriesRef);
          batch.set(docRef, { name: category.name });
        });
        batch.commit();
      }
      setHasCheckedCategories(true);
    }
  }, [user, firestore, expenseCategoriesData, expenseCategoriesLoading, hasCheckedCategories]);

  // Create a memoized data object
  const data: FinanceData = useMemo(() => {
    const defaultData = getDefaultData();
    return {
      incomes: incomesData || [],
      expenses: expensesData || [],
      masterExpenses: masterExpensesData || [],
      creditCards: creditCardsData || [],
      assets: assetsData || [],
      liabilities: liabilitiesData || [],
      notes: notesData || [],
      expenseCategories: expenseCategoriesData || [],
      netWorthHistory: netWorthHistoryData || [],
      categoryBudgets: defaultData.categoryBudgets, // Assuming this is static for now
    }
  }, [incomesData, expensesData, masterExpensesData, creditCardsData, assetsData, liabilitiesData, notesData, netWorthHistoryData, expenseCategoriesData]);
  
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
  
  const addExpense = (expense: Omit<Expense, 'id' | 'userId'>) => {
    const ref = getCollectionRef('expenses');
    if (ref) addDocumentNonBlocking(ref, expense);
  };

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

 const addCreditCardTransaction = useCallback((cardId: string, transaction: Omit<CreditCardTransaction, 'id'>) => {
    if (!user || !creditCardsData) return;
    const card = creditCardsData.find(c => c.id === cardId);
    if (!card) return;

    const newTransactionData: Partial<CreditCardTransaction> = { ...transaction, id: crypto.randomUUID() };

    // Remove masterExpenseId if it's not provided or "none"
    if (!transaction.masterExpenseId || transaction.masterExpenseId === 'none') {
      delete newTransactionData.masterExpenseId;
    }

    const newTransaction = newTransactionData as CreditCardTransaction;
    
    const updatedCardTransactions = [...card.transactions, newTransaction];
    updateCreditCard({ ...card, transactions: updatedCardTransactions });

    // Link to Master Expense if ID is provided
    if (newTransaction.masterExpenseId && masterExpensesData) {
        const masterExpense = masterExpensesData.find(me => me.id === newTransaction.masterExpenseId);
        if (masterExpense) {
            const masterTransaction: MasterExpenseTransaction = {
                id: newTransaction.id, // Use the same ID for easy linking
                description: newTransaction.description,
                amount: newTransaction.amount,
                date: newTransaction.date,
                status: 'Paid',
                paidViaCard: card.name
            };
            const updatedMasterTransactions = [...masterExpense.transactions, masterTransaction];
            updateMasterExpense({ ...masterExpense, transactions: updatedMasterTransactions });
        }
    }
  }, [user, creditCardsData, masterExpensesData, firestore]);

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
    if (!user || !creditCardsData) return;
    const card = creditCardsData.find(c => c.id === cardId);
    if (!card) return;
    const transactionToDelete = card.transactions.find(t => t.id === transactionId);

    // Remove the transaction from the credit card's list
    const updatedTransactions = card.transactions.filter(t => t.id !== transactionId);
    updateCreditCard({ ...card, transactions: updatedTransactions });

    if (transactionToDelete) {
        // If linked to a master expense, remove it from there
        if (transactionToDelete.masterExpenseId && masterExpensesData) {
            const masterExpense = masterExpensesData.find(me => me.id === transactionToDelete.masterExpenseId);
            if (masterExpense) {
                const updatedMasterTransactions = masterExpense.transactions.filter(t => t.id !== transactionId);
                updateMasterExpense({ ...masterExpense, transactions: updatedMasterTransactions });
            }
        }
    }
  }, [user, creditCardsData, masterExpensesData, firestore]);
  
 const deleteExpense = useCallback((id: string) => {
    if (!user || !expensesData) return;

    const expenseToDelete = expensesData.find(e => e.id === id);
    if (!expenseToDelete) return;
    
    // This part is problematic because it might not find the exact transaction to delete
    // if there are multiple similar ones. It's better to handle deletion from the credit card side
    // if the transaction originated there. We will assume for now that if an expense is paid by card
    // it can be deleted from the expenses list, and the user can manage the card transaction separately.

    const ref = getCollectionRef('expenses');
    if (ref) {
      deleteDocumentNonBlocking(doc(ref, id));
    }
  }, [user, expensesData, firestore]);

  
  const addMasterExpense = (expense: Omit<MasterExpense, 'id' | 'transactions' | 'userId'>) => {
    const ref = getCollectionRef('masterExpenses');
    if (ref) addDocumentNonBlocking(ref, { ...expense, transactions: [] });
  };

  const deleteMasterExpense = async (id: string) => {
    const ref = getCollectionRef('masterExpenses');
    if (ref) deleteDocumentNonBlocking(doc(ref, id));
  };

  const addMasterExpenseTransaction = useCallback((masterExpenseId: string, transaction: Omit<MasterExpenseTransaction, 'id' | 'paidViaCard'>) => {
    if (!user || !masterExpensesData) return;
    const masterExpense = masterExpensesData.find(me => me.id === masterExpenseId);
    if (!masterExpense) return;
    
    let paidViaCard: string | undefined = undefined;
    const paidByPrefix = "Paid by ";
    if (transaction.status.startsWith(paidByPrefix)) {
        const cardName = transaction.status.substring(paidByPrefix.length);
        if(creditCardsData?.find(c => c.name === cardName)) {
            paidViaCard = cardName;
        }
    }

    const newTransaction: MasterExpenseTransaction = { ...transaction, id: crypto.randomUUID(), status: paidViaCard ? 'Paid' : (transaction.status as 'Paid' | 'Not Paid'), paidViaCard };
    const updatedTransactions = [...masterExpense.transactions, newTransaction];
    updateMasterExpense({ ...masterExpense, transactions: updatedTransactions });

    if (paidViaCard) {
        const sourceCard = creditCardsData?.find(c => c.name === paidViaCard);
        if (sourceCard) {
            addCreditCardTransaction(sourceCard.id, {
                description: `${masterExpense.name}: ${transaction.description}`,
                amount: transaction.amount,
                date: transaction.date,
                masterExpenseId: masterExpenseId,
            });
        }
    }
  }, [user, masterExpensesData, creditCardsData, firestore, addCreditCardTransaction]);

  const updateMasterExpenseTransaction = (masterExpenseId: string, transaction: MasterExpenseTransaction) => {
    if (!user || !data.masterExpenses) return;
    const masterExpense = data.masterExpenses.find(me => me.id === masterExpenseId);
    if (!masterExpense) return;
    const updatedTransactions = masterExpense.transactions.map(t => t.id === transaction.id ? transaction : t);
    updateMasterExpense({ ...masterExpense, transactions: updatedTransactions });
  };
  const deleteMasterExpenseTransaction = (masterExpenseId: string, transactionId: string) => {
    if (!user || !data.masterExpenses) return;
    const masterExpense = data.masterExpenses.find(me => me.id === masterExpenseId);
    if (!masterExpense) return;

    const transactionToDelete = masterExpense.transactions.find(t => t.id === transactionId);

    const updatedTransactions = masterExpense.transactions.filter(t => t.id !== transactionId);
    updateMasterExpense({ ...masterExpense, transactions: updatedTransactions });

    if(transactionToDelete?.paidViaCard && creditCardsData){
        const sourceCard = creditCardsData.find(c => c.name === transactionToDelete.paidViaCard);
        if(sourceCard) {
            deleteCreditCardTransaction(sourceCard.id, transactionId);
        }
    }
  };

  const updateCreditCardTransaction = (cardId: string, transaction: CreditCardTransaction) => {
    if (!user || !creditCardsData) return;
    const card = creditCardsData.find(c => c.id === cardId);
    if (!card) return;

    const transactionData: Partial<CreditCardTransaction> = { ...transaction };
    if (!transactionData.masterExpenseId || transactionData.masterExpenseId === 'none') {
        delete transactionData.masterExpenseId;
    }
    
    const updatedTransactions = card.transactions.map(t => t.id === transaction.id ? transactionData as CreditCardTransaction : t);
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
  
  const addExpenseCategory = (category: Omit<ExpenseCategory, 'id'>) => {
    const ref = getCollectionRef('expenseCategories');
    if (ref) addDocumentNonBlocking(ref, category);
  };

  const deleteExpenseCategory = (id: string) => {
    const ref = getCollectionRef('expenseCategories');
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
            .filter(d => getMonth(new Date(d.dueDate)) === month && getYear(new Date(d.dueDate)) === year && d.status.startsWith('Paid'))
            .reduce((acc, d) => acc + d.amount, 0);
        
        const paidExpensesByCategory = data.expenses
            .filter(d => getMonth(new Date(d.dueDate)) === month && getYear(new Date(d.dueDate)) === year && d.status.startsWith('Paid'))
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
    addExpenseCategory, deleteExpenseCategory,
    addAsset, updateAsset, deleteAsset,
    addLiability, updateLiability, deleteLiability,
    snapshotNetWorth,
    getFinancialDataForPastMonths,
  }), [data, selectedDate, snapshotNetWorth, deleteMasterExpense, addCreditCardTransaction, deleteExpense, user, expensesData, firestore, addExpenseWithCardSync, addMasterExpenseTransaction, deleteCreditCardTransaction, updateMasterExpense, updateExpense, addIncome, updateIncome, deleteIncome, addMasterExpense, addCreditCard, updateCreditCard, deleteCreditCard, updateCreditCardTransaction, addNote, deleteNote, addAsset, updateAsset, deleteAsset, addLiability, updateLiability, deleteLiability, getFinancialDataForPastMonths, addExpenseCategory, deleteExpenseCategory]);

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

    
