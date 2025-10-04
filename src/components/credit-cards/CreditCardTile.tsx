
"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import type { CreditCard } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { format, getMonth, getYear } from "date-fns";
import { RupeeIcon } from "../icons";

type CreditCardTileProps = {
  card: CreditCard;
  selectedDate: Date;
  onEdit: (card: CreditCard) => void;
  onDelete: (id: string) => void;
};

export default function CreditCardTile({ card, selectedDate, onEdit, onDelete }: CreditCardTileProps) {
  const currentMonth = getMonth(selectedDate);
  const currentYear = getYear(selectedDate);

  const monthlySpending = card.transactions
    .filter(t => getMonth(new Date(t.date)) === currentMonth && getYear(new Date(t.date)) === currentYear)
    .reduce((sum, t) => sum + t.amount, 0);
  
  return (
     <Card className="flex flex-col transition-all hover:shadow-lg dark:hover:shadow-primary/10">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-bold font-headline">{card.name}</CardTitle>
            <div className="flex items-center">
              <Button variant="ghost" size="icon" onClick={() => onEdit(card)} className="h-8 w-8">
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onDelete(card.id)} className="h-8 w-8 text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
              </Button>
            </div>
        </CardHeader>
        <CardContent className="flex flex-col flex-grow p-6 pt-0">
            <Link href={`/credit-cards/${card.id}`} className="block group">
                <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 dark:from-zinc-800 dark:to-zinc-900 p-4 rounded-lg text-primary-foreground shadow-lg group-hover:shadow-xl group-hover:scale-[1.02] transition-all cursor-pointer aspect-[1.586] flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <RupeeIcon className="h-8 w-8 text-primary-foreground/70"/>
                        <p className="font-mono text-sm opacity-70">CARD</p>
                    </div>
                    <div>
                    <p className="text-xl font-mono tracking-widest">**** **** **** 1234</p>
                    <p className="text-sm font-headline pt-2">{card.name}</p>
                    </div>
                </div>
            </Link>
            <div className="grid grid-cols-2 gap-2 text-sm pt-4">
                <div>
                    <p className="text-muted-foreground">Monthly Spend</p>
                    <p className="font-medium">{formatCurrency(monthlySpending)}</p>
                </div>
                <div className="text-right">
                    <p className="text-muted-foreground">Due Date</p>
                    <p className="font-medium">{format(new Date(card.upcomingBillDueDate), 'dd MMM')}</p>
                </div>
            </div>
        </CardContent>
    </Card>
  );
}
