
"use client";

import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Pie, PieChart, Legend, RadialBar, RadialBarChart } from "recharts";
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
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { formatCurrency } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";
import { useMemo } from "react";


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

  const { categoryChartData, expenseChartConfig } = useMemo(() => {
    const expenseByCategory = expenseData.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as { [key: string]: number });
  
    const chartData = Object.entries(expenseByCategory)
      .map(([name, amount], index) => ({ name, amount, fill: `var(--color-${name.replace(/ /g, '')})` }))
      .sort((a, b) => b.amount - a.amount);
      
    const chartConfig = chartData.reduce((acc, item, index) => {
      acc[item.name.replace(/ /g, '')] = {
        label: item.name,
        color: `hsl(var(--chart-${(index % 5) + 1}))`
      }
      return acc;
    }, {} as ChartConfig);

    return { categoryChartData: chartData, expenseChartConfig: chartConfig };
  }, [expenseData]);

  return (
    <Card className="shadow-sm hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="font-headline">Monthly Overview</CardTitle>
        <CardDescription>
          A visual summary of your income vs. expenses.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 sm:grid-cols-2">
        <div className="h-[300px]">
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
        <div className="h-[300px]">
          <ChartContainer config={expenseChartConfig} className="w-full h-full">
             <RadialBarChart 
                data={categoryChartData} 
                innerRadius="20%"
                outerRadius="100%"
                startAngle={90}
                endAngle={-270}
             >
                <ChartTooltip 
                    cursor={false} 
                    content={<ChartTooltipContent 
                        formatter={(value, name) => [formatCurrency(Number(value)), name]}
                        labelKey="name"
                        hideIndicator
                    />} 
                />
                <RadialBar dataKey="amount" background />
            </RadialBarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
