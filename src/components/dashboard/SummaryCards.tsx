"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { TrendingDown, TrendingUp, Hourglass, CheckCircle } from "lucide-react";

type SummaryCardsProps = {
  totalIncome: number;
  totalExpenses: number;
  paidExpenses: number;
  unpaidExpenses: number;
};

export default function SummaryCards({
  totalIncome,
  totalExpenses,
  paidExpenses,
  unpaidExpenses
}: SummaryCardsProps) {
  const summaryData = [
    {
      title: "Total Income",
      icon: TrendingUp,
      value: totalIncome,
      color: "text-chart-1",
    },
    {
      title: "Total Expenses",
      icon: TrendingDown,
      value: totalExpenses,
      color: "text-chart-2",
    },
    {
      title: "Paid Expenses",
      icon: CheckCircle,
      value: paidExpenses,
      color: "text-chart-3",
    },
     {
      title: "Unpaid Expenses",
      icon: Hourglass,
      value: unpaidExpenses,
      color: "text-chart-5",
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
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
