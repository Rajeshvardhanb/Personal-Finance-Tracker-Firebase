
"use client";

import { useFinances } from "@/hooks/use-finances";
import { getYear } from "date-fns";
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

export default function YearlyExpensesChart() {
  const { data } = useFinances();

  const chartData = useMemo(() => {
    const yearlyExpenses: { [year: string]: number } = {};
    
    const allExpenses = data.expenses;
    const creditCardTransactions = data.creditCards.flatMap(c => c.transactions);

    allExpenses.forEach((expense) => {
        const year = getYear(new Date(expense.dueDate));
        yearlyExpenses[year] = (yearlyExpenses[year] || 0) + expense.amount;
    });

    creditCardTransactions.forEach((transaction) => {
        const year = getYear(new Date(transaction.date));
        yearlyExpenses[year] = (yearlyExpenses[year] || 0) + transaction.amount;
    });

    return Object.entries(yearlyExpenses)
      .map(([year, expenses]) => ({ year, expenses }))
      .sort((a, b) => parseInt(a.year) - parseInt(b.year));
      
  }, [data.expenses, data.creditCards]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Yearly Expenses</CardTitle>
        <CardDescription>
          Total expenses for each year.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="year"
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
