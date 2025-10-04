"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Expense } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type RecentExpensesProps = {
  expenses: Expense[];
};

export default function RecentExpenses({ expenses }: RecentExpensesProps) {
  const paidExpenses = expenses.filter((e) => e.status === "Paid").sort((a,b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
  const unpaidExpenses = expenses.filter((e) => e.status === "Not Paid").sort((a,b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());

  const ExpenseList = ({ expenses, type }: { expenses: Expense[], type: 'paid' | 'unpaid' }) => (
    <ScrollArea className="h-72">
      <div className="space-y-3 pr-4">
        {expenses.length > 0 ? expenses.map((expense) => (
          <div key={expense.id} className={cn(
            "flex items-center p-3 rounded-lg border",
            type === 'paid' ? "bg-emerald-50/50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900/30" : "bg-amber-50/50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900/30",
          )}>
            <div className="flex-1">
              <p className={cn("font-medium", type === 'paid' ? 'text-emerald-900 dark:text-emerald-100' : 'text-amber-900 dark:text-amber-100')}>{expense.description}</p>
              <p className={cn("text-sm", type === 'paid' ? 'text-emerald-700/80 dark:text-emerald-300/70' : 'text-amber-700/80 dark:text-amber-300/70')}>{expense.category}</p>
            </div>
            <div className="text-right">
              <p className={cn("font-bold text-lg", type === 'paid' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400')}>{formatCurrency(expense.amount)}</p>
            </div>
          </div>
        )) : (
          <p className="text-sm text-muted-foreground text-center py-8">No expenses in this category for this month.</p>
        )}
      </div>
    </ScrollArea>
  );

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="font-bold tracking-tighter">Monthly Expenses</CardTitle>
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
            <ExpenseList expenses={unpaidExpenses} type="unpaid" />
          </TabsContent>
          <TabsContent value="paid">
            <ExpenseList expenses={paidExpenses} type="paid" />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
