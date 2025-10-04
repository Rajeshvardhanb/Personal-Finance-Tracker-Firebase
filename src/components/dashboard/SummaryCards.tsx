"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Banknote, PiggyBank, TrendingDown, TrendingUp } from "lucide-react";

type SummaryCardsProps = {
  totalIncome: number;
  paidExpenses: number;
  unpaidExpenses: number;
  savings: number;
};

export default function SummaryCards({
  totalIncome,
  paidExpenses,
  unpaidExpenses,
  savings,
}: SummaryCardsProps) {
  const summaryData = [
    {
      title: "Total Income",
      icon: TrendingUp,
      value: totalIncome,
      color: "text-chart-1",
    },
    {
      title: "Paid Expenses",
      icon: TrendingDown,
      value: paidExpenses,
      color: "text-chart-2",
    },
    {
      title: "Unpaid Expenses",
      icon: Banknote,
      value: unpaidExpenses,
      color: "text-chart-4",
    },
    {
      title: "Savings",
      icon: PiggyBank,
      value: savings,
      color: "text-chart-3",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {summaryData.map((item) => (
        <Card key={item.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
            <item.icon className={`h-4 w-4 text-muted-foreground ${item.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(item.value)}
            </div>
            <p className="text-xs text-muted-foreground">
              {/* You can add comparison logic here */}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
