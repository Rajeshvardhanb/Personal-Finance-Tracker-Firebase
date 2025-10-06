
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Expense } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import TransactionCard from "../transactions/TransactionCard";
import { useFinances } from "@/hooks/use-finances";

type RecentExpensesProps = {
  expenses: Expense[];
};

export default function RecentExpenses({ expenses }: RecentExpensesProps) {
  const { updateExpense, deleteExpense } = useFinances();

  const paidExpenses = expenses.filter((e) => e.status.startsWith("Paid")).sort((a,b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
  const unpaidExpenses = expenses.filter((e) => e.status === "Not Paid").sort((a,b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());

  const handleToggleStatus = (expense: Expense) => {
    if (expense.masterExpenseId || expense.status.startsWith('Paid by')) return;
    const newStatus = expense.status === 'Paid' ? 'Not Paid' : 'Paid';
    updateExpense({ ...expense, status: newStatus });
  }

  const handleDeleteExpense = (id: string) => {
    deleteExpense(id);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Expenses</CardTitle>
        <CardDescription>
          A log of your paid and unpaid expenses for this month.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="unpaid">
          <TabsList className="grid w-full grid-cols-2 bg-muted/60">
            <TabsTrigger value="unpaid">Unpaid</TabsTrigger>
            <TabsTrigger value="paid">Paid</TabsTrigger>
          </TabsList>
          <TabsContent value="unpaid">
            <ScrollArea className="h-72">
              <div className="space-y-3 pr-4">
                {unpaidExpenses.length > 0 ? unpaidExpenses.map((expense) => (
                  <TransactionCard
                    key={expense.id}
                    type="expense"
                    transaction={expense}
                    onEdit={() => {}}
                    onDelete={() => handleDeleteExpense(expense.id)}
                    onToggleStatus={() => handleToggleStatus(expense)}
                  />
                )) : (
                  <p className="text-sm text-muted-foreground text-center py-8">No unpaid expenses for this month.</p>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="paid">
            <ScrollArea className="h-72">
              <div className="space-y-3 pr-4">
                {paidExpenses.length > 0 ? paidExpenses.map((expense) => (
                  <TransactionCard
                    key={expense.id}
                    type="expense"
                    transaction={expense}
                    onEdit={() => {}}
                    onDelete={() => handleDeleteExpense(expense.id)}
                    onToggleStatus={() => handleToggleStatus(expense)}
                  />
                )) : (
                  <p className="text-sm text-muted-foreground text-center py-8">No paid expenses for this month.</p>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
