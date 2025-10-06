
"use client";

import { Pie, PieChart, Cell } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Expense } from "@/lib/types";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { ScrollArea } from "@/components/ui/scroll-area";

type DashboardChartsProps = {
  income: number;
  expenses: number;
  creditCardSpending: number;
  expenseData: Expense[];
};

const COLORS = ["#16a34a", "#dc2626", "#ea580c", "#facc15", "#6d28d9", "#1d4ed8", "#be185d", "#166534", "#b45309", "#581c87", "#1e40af", "#86198f"];

const barChartConfig = {
  value: { label: "Amount" },
  income: { label: "Income", color: "hsl(var(--chart-1))" },
  expenses: { label: "Expenses", color: "hsl(var(--chart-2))" },
  credit: { label: "Credit Cards", color: "hsl(var(--chart-4))" },
} satisfies ChartConfig;

export default function DashboardCharts({ income, expenses, creditCardSpending, expenseData }: DashboardChartsProps) {
  const barChartData = [
    { name: "Income", value: income, fill: "var(--color-income)" },
    { name: "Expenses", value: expenses, fill: "var(--color-expenses)" },
    { name: "Credit Cards", value: creditCardSpending, fill: "var(--color-credit)" },
  ];

  const expenseByCategory = expenseData.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as { [key: string]: number });

  const pieChartData = Object.entries(expenseByCategory).map(([name, value]) => ({ name, value }));
  
  const pieChartConfig = Object.fromEntries(
    pieChartData.map(({ name }, index) => [
      name.replace(/\s/g, ''), // Create valid keys for the config
      { label: name, color: COLORS[index % COLORS.length] },
    ])
  ) satisfies ChartConfig;

  return (
    <Card className="shadow-sm hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="font-headline">Monthly Overview</CardTitle>
        <CardDescription>A visual summary of your income vs. expenses.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-8 sm:grid-cols-2">
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
        <div className="h-[300px] flex items-center justify-center">
          <ChartContainer config={pieChartConfig} className="mx-auto aspect-square h-full">
             <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie data={pieChartData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} strokeWidth={2}>
                   {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartLegend
                    content={({ payload }) => {
                        return (
                          <ScrollArea className="h-full w-full">
                            <div className="flex flex-col space-y-2 pr-4">
                                {payload?.map((item, index) => (
                                    <div key={index} className="flex items-center gap-2 text-sm">
                                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                        <span>{item.value}</span>
                                    </div>
                                ))}
                            </div>
                          </ScrollArea>
                        );
                    }}
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                    wrapperStyle={{
                        width: '35%',
                        height: '80%',
                        paddingLeft: '20px',
                    }}
                />
             </PieChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
