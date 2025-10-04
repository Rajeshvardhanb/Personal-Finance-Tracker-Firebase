
"use client";

import { useState } from "react";
import { useParams, notFound, useRouter } from "next/navigation";
import { useFinances } from "@/hooks/use-finances";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PlusCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import MasterExpenseTransactionForm from "@/components/expenses/MasterExpenseTransactionForm";
import { MasterExpenseTransaction } from "@/lib/types";
import { getMonth, getYear } from "date-fns";
import TransactionCard from "@/components/transactions/TransactionCard";

export default function MasterExpenseDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { data, selectedDate, addMasterExpenseTransaction, updateMasterExpenseTransaction, deleteMasterExpenseTransaction } = useFinances();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<MasterExpenseTransaction | null>(null);

    const masterExpense = data.masterExpenses.find(c => c.id === id);

    if (!masterExpense) {
        notFound();
    }

    const currentMonth = getMonth(selectedDate);
    const currentYear = getYear(selectedDate);

    const monthlyTransactions = masterExpense.transactions.filter(
        (t) =>
            getMonth(new Date(t.date)) === currentMonth &&
            getYear(new Date(t.date)) === currentYear
    );
    
    const monthlySpending = monthlyTransactions.reduce((sum, t) => sum + t.amount, 0);

    const handleAddTransaction = () => {
        setEditingTransaction(null);
        setIsFormOpen(true);
    };

    const handleEditTransaction = (transaction: MasterExpenseTransaction) => {
        setEditingTransaction(transaction);
        setIsFormOpen(true);
    };

    const handleDeleteTransaction = (transactionId: string) => {
        deleteMasterExpenseTransaction(masterExpense.id, transactionId);
    };

    const handleToggleStatus = (transaction: MasterExpenseTransaction) => {
        const newStatus = transaction.status === 'Paid' ? 'Not Paid' : 'Paid';
        updateMasterExpenseTransaction(masterExpense.id, { ...transaction, status: newStatus });
    }

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingTransaction(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                     <PageHeader title={masterExpense.name} />
                </div>
                <Button onClick={handleAddTransaction}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Transaction
                </Button>
            </div>
            
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Monthly Spending</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{formatCurrency(monthlySpending)}</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Transactions</CardTitle>
                    <CardDescription>
                        A list of transactions for this month.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {monthlyTransactions.length > 0 ? monthlyTransactions.map((transaction) => (
                        <TransactionCard
                            key={transaction.id}
                            type="master-expense"
                            transaction={transaction}
                            onEdit={() => handleEditTransaction(transaction)}
                            onDelete={() => handleDeleteTransaction(transaction.id)}
                            onToggleStatus={() => handleToggleStatus(transaction)}
                         />
                    )) : (
                        <div className="text-center py-10 text-muted-foreground">
                            No transactions found for this month.
                        </div>
                    )}
                </CardContent>
            </Card>

            {isFormOpen && (
                <MasterExpenseTransactionForm
                    isOpen={isFormOpen}
                    onClose={handleCloseForm}
                    transaction={editingTransaction}
                    masterExpenseId={masterExpense.id}
                    addTransaction={addMasterExpenseTransaction}
                    updateTransaction={updateMasterExpenseTransaction}
                />
            )}
        </div>
    )
}
