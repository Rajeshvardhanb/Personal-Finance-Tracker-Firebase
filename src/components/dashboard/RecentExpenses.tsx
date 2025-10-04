"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Expense } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";

type RecentExpensesProps = {
  expenses: Expense[];
};

export default function RecentExpenses({ expenses }: RecentExpensesProps) {
  const paidExpenses = expenses.filter((e) => e.status === "Paid").sort((a,b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
  const unpaidExpenses = expenses.filter((e) => e.status === "Not Paid").sort((a,b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());

  const ExpenseList = ({ expenses }: { expenses: Expense[] }) => (
    <div className="space-y-4 pt-4">
      {expenses.length > 0 ? expenses.map((expense) => (
        <div key={expense.id} className="flex items-center">
          <div className="flex-1">
            <p className="font-medium">{expense.description}</p>
            <p className="text-sm text-muted-foreground">{expense.category}</p>
          </div>
          <div className="text-right">
            <p className="font-medium">{formatCurrency(expense.amount)}</p>
            <p className="text-sm text-muted-foreground">{format(new Date(expense.dueDate), 'dd MMM')}</p>
          </div>
        </div>
      )) : (
        <p className="text-sm text-muted-foreground text-center py-8">No expenses in this category for this month.</p>
      )}
    </div>
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
