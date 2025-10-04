"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Expense } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";

type RecentExpensesProps = {
  expenses: Expense[];
};

export default function RecentExpenses({ expenses }: RecentExpensesProps) {
  const paidExpenses = expenses.filter((e) => e.status === "Paid").sort((a,b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
  const unpaidExpenses = expenses.filter((e) => e.status === "Not Paid").sort((a,b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());

  const ExpenseList = ({ expenses }: { expenses: Expense[] }) => (
    <ScrollArea className="h-72">
      <div className="space-y-3 pr-4">
        {expenses.length > 0 ? expenses.map((expense) => (
          <div key={expense.id} className="flex items-center bg-emerald-50/50 dark:bg-emerald-900/20 p-3 rounded-lg border border-emerald-100 dark:border-emerald-900/30">
            <div className="flex-1">
              <p className="font-medium text-emerald-900 dark:text-emerald-100">{expense.description}</p>
              <p className="text-sm text-emerald-700/80 dark:text-emerald-300/70">{expense.category}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg text-emerald-600 dark:text-emerald-400">{formatCurrency(expense.amount)}</p>
            </div>
          </div>
        )) : (
          <p className="text-sm text-muted-foreground text-center py-8">No expenses in this category for this month.</p>
        )}
      </div>
    </ScrollArea>
  );

  return (
    <Card className="shadow-sm hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="font-headline">Monthly Expenses</CardTitle>
        <CardDescription>
          A log of your paid and unpaid expenses for this month.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="unpaid">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="unpaid">Unpaid</TabsTrigger>
            <TabsTrigger value="paid">Paid</TabsTrigger>
          </TabsList>
          <TabsContent value="unpaid">
            <ExpenseList expenses={unpaidExpenses} />
          </TabsContent>
          <TabsContent value="paid">
            <ExpenseList expenses={paidExpenses} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
