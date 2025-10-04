"use client";

import { useState } from "react";
import { useParams, notFound, useRouter } from "next/navigation";
import { useFinances } from "@/hooks/use-finances";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { getMonth, getYear } from "date-fns";

export default function CreditCardDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { data, selectedDate } = useFinances();

    const card = data.creditCards.find(c => c.id === id);

    if (!card) {
        notFound();
    }

    const currentMonth = getMonth(selectedDate);
    const currentYear = getYear(selectedDate);

    const monthlyTransactions = card.transactions.filter(
        (t) =>
            getMonth(new Date(t.date)) === currentMonth &&
            getYear(new Date(t.date)) === currentYear
    );
    
    const monthlySpending = monthlyTransactions.reduce((sum, t) => sum + t.amount, 0);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                     <PageHeader title={card.name} />
                </div>
            </div>
            
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Credit Limit</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{formatCurrency(card.creditLimit)}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Monthly Spending</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{formatCurrency(monthlySpending)}</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Available Credit</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{formatCurrency(card.creditLimit - monthlySpending)}</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
