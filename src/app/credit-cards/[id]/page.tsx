"use client";

import { useState } from "react";
import { useParams, notFound, useRouter } from "next/navigation";
import { useFinances } from "@/hooks/use-finances";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PlusCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import CreditCardTransactionForm from "@/components/credit-cards/CreditCardTransactionForm";
import CreditCardTransactionsTable from "@/components/credit-cards/CreditCardTransactionsTable";
import { CreditCardTransaction } from "@/lib/types";
import { getMonth, getYear } from "date-fns";

export default function CreditCardDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { data, selectedDate, addCreditCardTransaction, updateCreditCardTransaction, deleteCreditCardTransaction } = useFinances();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<CreditCardTransaction | null>(null);

    const card = data.creditCards.find(c => c.id === id);

    if (!card) {
        notFound();
    }

    const currentMonth = getMonth(selectedDate);
    const currentYear = getYear(selectedDate);

    const monthlyTransactions = card.transactions.filter(
        (t) =>
            getMonth(new Date(t.date)) === currentMonth &&
            getYear(new Date(t.date)) === currentYear
    );
    
    const monthlySpending = monthlyTransactions.reduce((sum, t) => sum + t.amount, 0);

    const handleAddTransaction = () => {
        setEditingTransaction(null);
        setIsFormOpen(true);
    };

    const handleEditTransaction = (transaction: CreditCardTransaction) => {
        setEditingTransaction(transaction);
        setIsFormOpen(true);
    };

    const handleDeleteTransaction = (transactionId: string) => {
        deleteCreditCardTransaction(card.id, transactionId);
    };

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
                     <PageHeader title={card.name} />
                </div>
                <Button onClick={handleAddTransaction}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Transaction
                </Button>
            </div>
            
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Credit Limit</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{formatCurrency(card.creditLimit)}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Monthly Spending</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{formatCurrency(monthlySpending)}</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Available Credit</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{formatCurrency(card.creditLimit - monthlySpending)}</p>
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
                <CardContent className="p-0">
                    <CreditCardTransactionsTable
                        transactions={monthlyTransactions}
                        onEdit={handleEditTransaction}
                        onDelete={handleDeleteTransaction}
                    />
                </CardContent>
            </Card>

            {isFormOpen && (
                <CreditCardTransactionForm
                    isOpen={isFormOpen}
                    onClose={handleCloseForm}
                    transaction={editingTransaction}
                    cardId={card.id}
                    addTransaction={addCreditCardTransaction}
                    updateTransaction={updateCreditCardTransaction}
                />
            )}
        </div>
    )
}
