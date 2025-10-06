
"use client";

import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Expense } from "@/lib/types";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatCurrency } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";

type DashboardChartsProps = {
  income: number;
  expenses: number;
  creditCardSpending: number;
  expenseData: Expense[];
};

const barChartConfig = {
  value: { label: "Amount" },
  income: { label: "Income", color: "hsl(var(--chart-1))" },
  expenses: { label: "Expenses", color: "hsl(var(--chart-2))" },
  credit: { label: "Credit Cards", color: "hsl(var(--chart-4))" },
} satisfies ChartConfig;

const expenseChartConfig = {
  amount: {
    label: "Amount",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function DashboardCharts({
  income,
  expenses,
  creditCardSpending,
  expenseData,
}: DashboardChartsProps) {
  const barChartData = [
    { name: "Income", value: income, fill: "var(--color-income)" },
    { name: "Expenses", value: expenses, fill: "var(--color-expenses)" },
    {
      name: "Credit Cards",
      value: creditCardSpending,
      fill: "var(--color-credit)",
    },
  ];

  const expenseByCategory = expenseData.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as { [key: string]: number });

  const categoryChartData = Object.entries(expenseByCategory)
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount);

  return (
    <Card className="shadow-sm hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="font-headline">Monthly Overview</CardTitle>
        <CardDescription>
          A visual summary of your income vs. expenses.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-8 sm:grid-cols-2">
        <div className="h-[400px]">
          <ChartContainer config={barChartConfig} className="w-full h-full">
            <BarChart accessibilityLayer data={barChartData}>
              <XAxis
                dataKey="name"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₹${Number(value) / 1000}k`}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="value" radius={8} />
            </BarChart>
          </ChartContainer>
        </div>
        <div className="h-[400px]">
           <ChartContainer config={expenseChartConfig} className="w-full h-full">
            <ScrollArea className="h-full">
              <div style={{ height: `${Math.max(400, categoryChartData.length * 40)}px` }}>
                <BarChart
                  data={categoryChartData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                  <XAxis 
                    type="number" 
                    tickFormatter={(value) => formatCurrency(Number(value))}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={100}
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent 
                        labelKey="name" 
                        formatter={(value) => formatCurrency(Number(value))}
                    />}
                  />
                  <Bar dataKey="amount" fill="hsl(var(--chart-2))" radius={4} />
                </BarChart>
              </div>
            </ScrollArea>
           </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
