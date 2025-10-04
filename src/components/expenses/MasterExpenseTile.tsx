
"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import type { MasterExpense } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { getMonth, getYear } from "date-fns";
import { FolderKanban } from "lucide-react";

type MasterExpenseTileProps = {
  masterExpense: MasterExpense;
  selectedDate: Date;
  onEdit: (card: MasterExpense) => void;
  onDelete: (id: string) => void;
};

export default function MasterExpenseTile({ masterExpense, selectedDate, onEdit, onDelete }: MasterExpenseTileProps) {
  const currentMonth = getMonth(selectedDate);
  const currentYear = getYear(selectedDate);

  const monthlySpending = masterExpense.transactions
    .filter(t => getMonth(new Date(t.date)) === currentMonth && getYear(new Date(t.date)) === currentYear)
    .reduce((sum, t) => sum + t.amount, 0);
  
  return (
     <Card className="flex flex-col transition-all hover:shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-bold font-headline">{masterExpense.name}</CardTitle>
            <div className="flex items-center">
              <Button variant="ghost" size="icon" onClick={() => onEdit(masterExpense)} className="h-8 w-8">
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onDelete(masterExpense.id)} className="h-8 w-8 text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
              </Button>
            </div>
        </CardHeader>
        <CardContent className="flex flex-col flex-grow p-6 pt-0">
            <Link href={`/expenses/${masterExpense.id}`} className="block">
                <div className="bg-gradient-to-br from-accent/80 to-accent p-4 rounded-lg text-accent-foreground shadow-lg hover:shadow-xl transition-shadow cursor-pointer aspect-video flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <FolderKanban className="h-8 w-8 text-accent-foreground/80"/>
                    </div>
                    <div>
                        <p className="text-sm text-accent-foreground/80">Total Spent this month</p>
                        <p className="text-2xl font-bold tracking-tight">{formatCurrency(monthlySpending)}</p>
                    </div>
                </div>
            </Link>
        </CardContent>
    </Card>
  );
}
