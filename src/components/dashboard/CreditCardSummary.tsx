"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { CreditCard } from "@/lib/types";
import { getMonth, getYear } from "date-fns";
import { Progress } from "@/components/ui/progress";

type CreditCardSummaryProps = {
  creditCards: CreditCard[];
  selectedDate: Date;
};

export default function CreditCardSummary({ creditCards, selectedDate }: CreditCardSummaryProps) {
  const currentMonth = getMonth(selectedDate);
  const currentYear = getYear(selectedDate);

  const cardSummaries = creditCards.map(card => {
    const monthlySpending = card.transactions
      .filter(t => getMonth(new Date(t.date)) === currentMonth && getYear(new Date(t.date)) === currentYear)
      .reduce((sum, t) => sum + t.amount, 0);
    const utilization = card.creditLimit > 0 ? (monthlySpending / card.creditLimit) * 100 : 0;
    return { ...card, monthlySpending, utilization };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Credit Card Spending</CardTitle>
        <CardDescription>Breakdown of spending for each card this month.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {cardSummaries.map(card => (
          <div key={card.id} className="space-y-2">
            <div className="flex justify-between items-baseline">
              <p className="font-medium">{card.name}</p>
              <p className="font-bold text-lg">{formatCurrency(card.monthlySpending)}</p>
            </div>
            <Progress value={card.utilization} />
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>{Math.round(card.utilization)}% of {formatCurrency(card.creditLimit)}</span>
              <span>Available: {formatCurrency(card.creditLimit - card.monthlySpending)}</span>
            </div>
          </div>
        ))}
         {creditCards.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">No credit cards added yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
