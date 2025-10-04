
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { CreditCard } from "@/lib/types";
import { getMonth, getYear } from "date-fns";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
    <Card className="shadow-sm hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="font-headline">Credit Card Spending</CardTitle>
        <CardDescription>Breakdown of spending for each card this month.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {cardSummaries.map(card => (
          <div key={card.id}>
             <Link href={`/credit-cards/${card.id}`} className="group">
                <div className="flex justify-between items-baseline">
                  <p className="font-medium group-hover:text-primary">{card.name}</p>
                  <p className="font-bold text-lg">{formatCurrency(card.monthlySpending)}</p>
                </div>
                <Progress value={card.utilization} className="my-2" />
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>{Math.round(card.utilization)}% of {formatCurrency(card.creditLimit)}</span>
                  <span>Available: {formatCurrency(card.creditLimit - card.monthlySpending)}</span>
                </div>
            </Link>
          </div>
        ))}
         {creditCards.length === 0 && (
           <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-4">No credit cards added yet.</p>
            <Button asChild variant="outline" size="sm">
              <Link href="/credit-cards">Add a Card</Link>
            </Button>
           </div>
        )}
      </CardContent>
    </Card>
  );
}
