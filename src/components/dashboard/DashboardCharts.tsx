
"use client";

import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Cell, ResponsiveContainer } from "recharts";
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
import { useMemo } from "react";
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
      .map(([name, amount], index) => ({ name, amount, fill: `hsl(var(--chart-${(index % 5) + 1}))` }))
      .sort((a, b) => b.amount - a.amount); // Sort descending for horizontal chart
      
    const chartConfig = chartData.reduce((acc, item) => {
      const key = item.name.replace(/\s+/g, '');
      acc[key] = {
        label: item.name,
        color: item.fill
      }
      return acc;
    }, {} as ChartConfig);

    return { categoryChartData: chartData, expenseChartConfig: chartConfig };
  }, [expenseData]);

  const categoryBarChartHeight = Math.max(200, categoryChartData.length * 40);

  return (
    <Card className="shadow-sm hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="font-headline">Monthly Overview</CardTitle>
        <CardDescription>
          A visual summary of your income, expenses, and category spending.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-8 sm:grid-cols-2">
        <div className="h-[400px]">
          <ChartContainer config={barChartConfig} className="w-full h-full">
            <BarChart
              accessibilityLayer
              data={barChartData}
              margin={{ top: 20, right: 20, left: 20, bottom: 5 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                interval={0}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₹${Number(value) / 1000}k`}
              />
              <ChartTooltip
                cursor={{ fill: 'hsl(var(--muted))' }}
                content={<ChartTooltipContent hideLabel formatter={(value) => formatCurrency(Number(value))}/>}
              />
              <Bar dataKey="value" radius={5}>
                 {barChartData.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>
        <div className="h-[400px] flex flex-col">
           <h4 className="text-sm font-medium text-center mb-4">Expense Breakdown</h4>
           <ScrollArea className="h-full">
             <ChartContainer config={expenseChartConfig} className="w-full" style={{height: `${categoryBarChartHeight}px`}}>
               <BarChart
                  accessibilityLayer
                  data={categoryChartData}
                  layout="vertical"
                  margin={{ left: 20, right: 40 }}
                >
                  <YAxis
                    type="category"
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    interval={0}
                    width={100}
                    tick={{dx: -5}}
                  />
                  <XAxis type="number" hide />
                   <ChartTooltip
                    cursor={{ fill: 'hsl(var(--muted))' }}
                    content={<ChartTooltipContent 
                        formatter={(value) => formatCurrency(Number(value))}
                        hideLabel 
                    />}
                  />
                  <Bar dataKey="amount" layout="vertical" radius={5}>
                     {categoryChartData.map((entry) => (
                      <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
             </ChartContainer>
           </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
