
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Expense } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import TransactionCard from "../transactions/TransactionCard";

type RecentExpensesProps = {
  expenses: Expense[];
};

export default function RecentExpenses({ expenses }: RecentExpensesProps) {
  const paidExpenses = expenses.filter((e) => e.status.startsWith("Paid")).sort((a,b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
  const unpaidExpenses = expenses.filter((e) => e.status === "Not Paid").sort((a,b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());

  const ExpenseList = ({ expenses, onEdit, onDelete, onToggleStatus }: { expenses: Expense[], onEdit: (expense: Expense) => void, onDelete: (id: string) => void, onToggleStatus: (expense: Expense) => void }) => (
    <ScrollArea className="h-72">
      <div className="space-y-3 pr-4">
        {expenses.length > 0 ? expenses.map((expense) => (
          <TransactionCard 
            key={expense.id}
            type="expense"
            transaction={expense}
            onEdit={() => onEdit(expense)}
            onDelete={() => onDelete(expense.id)}
            onToggleStatus={() => onToggleStatus(expense)}
          />
        )) : (
          <p className="text-sm text-muted-foreground text-center py-8">No expenses in this category for this month.</p>
        )}
      </div>
    </ScrollArea>
  );

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
             {unpaidExpenses.length > 0 ? unpaidExpenses.map((expense) => (
              <TransactionCard
                key={expense.id}
                type="expense"
                transaction={expense}
                onEdit={() => {}}
                onDelete={() => {}}
                onToggleStatus={() => {}}
              />
            )) : (
              <p className="text-sm text-muted-foreground text-center py-8">No expenses in this category for this month.</p>
            )}
          </TabsContent>
          <TabsContent value="paid">
             {paidExpenses.length > 0 ? paidExpenses.map((expense) => (
              <TransactionCard
                key={expense.id}
                type="expense"
                transaction={expense}
                onEdit={() => {}}
                onDelete={() => {}}
                onToggleStatus={() => {}}
              />
            )) : (
              <p className="text-sm text-muted-foreground text-center py-8">No expenses in this category for this month.</p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
