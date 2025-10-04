
"use client";

import { useFinances } from "@/hooks/use-finances";
import { getYear, getMonth, format } from "date-fns";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useMemo } from "react";
import { formatCurrency } from "@/lib/utils";

const chartConfig = {
  expenses: {
    label: "Expenses",
    color: "hsl(var(--chart-2))",
  },
};

export default function MonthlyExpensesChart() {
  const { data, selectedDate } = useFinances();

  const chartData = useMemo(() => {
    const currentYear = getYear(selectedDate);
    
    const monthlyExpenses = Array.from({ length: 12 }, (_, i) => ({
      month: format(new Date(currentYear, i, 1), "MMM"),
      expenses: 0,
    }));

    const allExpenses = data.expenses;
    const creditCardTransactions = data.creditCards.flatMap(c => c.transactions);

    allExpenses.forEach((expense) => {
        const expenseDate = new Date(expense.dueDate);
        if (getYear(expenseDate) === currentYear) {
            const monthIndex = getMonth(expenseDate);
            if(monthlyExpenses[monthIndex]) {
                monthlyExpenses[monthIndex].expenses += expense.amount;
            }
        }
    });

    creditCardTransactions.forEach((transaction) => {
        const transactionDate = new Date(transaction.date);
        if (getYear(transactionDate) === currentYear) {
            const monthIndex = getMonth(transactionDate);
            if(monthlyExpenses[monthIndex]) {
                monthlyExpenses[monthIndex].expenses += transaction.amount;
            }
        }
    });

    return monthlyExpenses;
  }, [data.expenses, data.creditCards, selectedDate]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Monthly Expenses</CardTitle>
        <CardDescription>
          Total expenses for each month in {getYear(selectedDate)}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => formatCurrency(Number(value)).replace("₹", "₹ ")}
              width={80}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent 
                formatter={(value) => formatCurrency(Number(value))}
                indicator="dot" 
              />}
            />
            <Bar
              dataKey="expenses"
              fill="var(--color-expenses)"
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
