import Link from "next/link";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { Button } from "@/components/ui/button";
  import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
  import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
  import type { CreditCard } from "@/lib/types";
  import { formatCurrency } from "@/lib/utils";
  import { format, getMonth, getYear } from "date-fns";
  
  type CreditCardsTableProps = {
    cards: CreditCard[];
    onEdit: (card: CreditCard) => void;
    onDelete: (id: string) => void;
    selectedDate: Date;
  };
  
  export default function CreditCardsTable({ cards, onEdit, onDelete, selectedDate }: CreditCardsTableProps) {
    const currentMonth = getMonth(selectedDate);
    const currentYear = getYear(selectedDate);

    return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Card Name</TableHead>
              <TableHead>Bill Due Date</TableHead>
              <TableHead>Monthly Spending</TableHead>
              <TableHead className="text-right">Credit Limit</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cards.length > 0 ? cards.map((card) => {
              const monthlySpending = card.transactions
                .filter(t => getMonth(new Date(t.date)) === currentMonth && getYear(new Date(t.date)) === currentYear)
                .reduce((sum, t) => sum + t.amount, 0);

              return (
              <TableRow key={card.id}>
                <TableCell className="font-medium">
                  <Link href={`/credit-cards/${card.id}`} className="hover:underline">
                    {card.name}
                  </Link>
                </TableCell>
                <TableCell>{format(new Date(card.upcomingBillDueDate), 'dd MMM yyyy')}</TableCell>
                <TableCell>{formatCurrency(monthlySpending)}</TableCell>
                <TableCell className="text-right">{formatCurrency(card.creditLimit)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(card)}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDelete(card.id)} className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )}) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">No credit cards found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
    );
  }
  