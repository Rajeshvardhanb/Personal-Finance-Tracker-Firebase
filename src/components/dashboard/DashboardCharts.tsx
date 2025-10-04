"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Pie, PieChart, Cell, Legend } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Expense } from "@/lib/types";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";

type DashboardChartsProps = {
  income: number;
  expenses: number;
  creditCardSpending: number;
  expenseData: Expense[];
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

export default function DashboardCharts({ income, expenses, creditCardSpending, expenseData }: DashboardChartsProps) {
  const barChartData = [
    { name: "Income", value: income, fill: "var(--color-income)" },
    { name: "Expenses", value: expenses, fill: "var(--color-expenses)" },
    { name: "Credit Cards", value: creditCardSpending, fill: "var(--color-credit)" },
  ];

  const barChartConfig = {
    value: { label: "Amount" },
    income: { label: "Income", color: "hsl(var(--chart-1))" },
    expenses: { label: "Expenses", color: "hsl(var(--chart-2))" },
    credit: { label: "Credit Cards", color: "hsl(var(--chart-3))" },
  };

  const expenseByCategory = expenseData.reduce((acc, expense) => {
    if (expense.status === 'Paid') {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    }
    return acc;
  }, {} as { [key: string]: number });

  const pieChartData = Object.entries(expenseByCategory).map(([name, value]) => ({ name, value }));
  const pieChartConfig = Object.fromEntries(
    pieChartData.map(({ name }, index) => [
      name,
      { label: name, color: COLORS[index % COLORS.length] },
    ])
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Monthly Overview</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 sm:grid-cols-2">
        <div className="h-[300px]">
          <ChartContainer config={barChartConfig}>
            <BarChart accessibilityLayer data={barChartData}>
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₹${value / 1000}k`}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="value" radius={4} />
            </BarChart>
          </ChartContainer>
        </div>
        <div className="h-[300px]">
          <ChartContainer config={pieChartConfig} className="mx-auto aspect-square max-h-[300px]">
             <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie data={pieChartData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80}>
                   {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartLegend
                  content={<ChartLegendContent nameKey="name" />}
                  className="-translate-y-[2px] flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                />
             </PieChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
