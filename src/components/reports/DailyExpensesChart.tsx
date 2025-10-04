"use client";

import { useFinances } from "@/hooks/use-finances";
import { getMonth, getYear, getDate, getDaysInMonth, format, startOfMonth } from "date-fns";
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

export default function DailyExpensesChart() {
  const { data, selectedDate } = useFinances();

  const chartData = useMemo(() => {
    const currentMonth = getMonth(selectedDate);
    const currentYear = getYear(selectedDate);
    const daysInMonth = getDaysInMonth(selectedDate);
    const monthStart = startOfMonth(selectedDate);

    const dailyExpenses = Array.from({ length: daysInMonth }, (_, i) => ({
      date: format(new Date(currentYear, currentMonth, i + 1), "dd MMM"),
      expenses: 0,
    }));

    const allExpenses = data.expenses;
    const creditCardTransactions = data.creditCards.flatMap(c => c.transactions);

    allExpenses.forEach((expense) => {
        const expenseDate = new Date(expense.dueDate);
        if (getMonth(expenseDate) === currentMonth && getYear(expenseDate) === currentYear) {
            const day = getDate(expenseDate) - 1;
            if(dailyExpenses[day]) {
                dailyExpenses[day].expenses += expense.amount;
            }
        }
    });

    creditCardTransactions.forEach((transaction) => {
        const transactionDate = new Date(transaction.date);
        if (getMonth(transactionDate) === currentMonth && getYear(transactionDate) === currentYear) {
            const day = getDate(transactionDate) - 1;
            if(dailyExpenses[day]) {
                dailyExpenses[day].expenses += transaction.amount;
            }
        }
    });

    return dailyExpenses;
  }, [data.expenses, data.creditCards, selectedDate]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Daily Expenses</CardTitle>
        <CardDescription>
          Total expenses for each day in {format(selectedDate, "MMMM yyyy")}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.split(" ")[0]}
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
