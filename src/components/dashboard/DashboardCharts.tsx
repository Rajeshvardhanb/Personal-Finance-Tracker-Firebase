
"use client";

import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Pie, PieChart, Legend, RadialBar, RadialBarChart, Cell } from "recharts";
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
      .map(([name, amount], index) => ({ name, amount, fill: `var(--color-chart-${(index % 5) + 1})` }))
      .sort((a, b) => b.amount - a.amount);
      
    const chartConfig = chartData.reduce((acc, item) => {
      // Create a key that's safe for CSS variables
      const key = item.name.replace(/ /g, '');
      acc[key] = {
        label: item.name,
        color: item.fill // Use the direct fill color
      }
      return acc;
    }, {} as ChartConfig);

    return { categoryChartData: chartData, expenseChartConfig: chartConfig };
  }, [expenseData]);

  const COLORS = Array.from({length: 5}, (_, i) => `hsl(var(--chart-${i + 1}))`);

  return (
    <Card className="shadow-sm hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="font-headline">Monthly Overview</CardTitle>
        <CardDescription>
          A visual summary of your income vs. expenses.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 sm:grid-cols-2">
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
             <PieChart>
                <ChartTooltip 
                    cursor={false} 
                    content={<ChartTooltipContent 
                        formatter={(value, name) => [formatCurrency(Number(value)), name]}
                        nameKey="name"
                        hideIndicator
                    />} 
                />
                <Pie 
                  data={categoryChartData} 
                  dataKey="amount" 
                  nameKey="name" 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={150} 
                  labelLine={false}
                  label={({
                    cx,
                    cy,
                    midAngle,
                    innerRadius,
                    outerRadius,
                    percent,
                    index,
                  }) => {
                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

                    if ((percent * 100) < 5) return null; // Don't render small labels

                    return (
                      <text
                        x={x}
                        y={y}
                        fill="white"
                        textAnchor={x > cx ? 'start' : 'end'}
                        dominantBaseline="central"
                        className="text-xs font-bold"
                      >
                        {`${(percent * 100).toFixed(0)}%`}
                      </text>
                    );
                  }}
                >
                   {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
            </PieChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
