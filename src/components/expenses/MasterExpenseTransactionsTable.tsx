
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { Button } from "@/components/ui/button";
  import { Pencil, Trash2 } from "lucide-react";
  import type { MasterExpenseTransaction } from "@/lib/types";
  import { formatCurrency } from "@/lib/utils";
  import { format } from "date-fns";
  import { Badge } from "@/components/ui/badge";
  
  type MasterExpenseTransactionsTableProps = {
    transactions: MasterExpenseTransaction[];
    onEdit: (transaction: MasterExpenseTransaction) => void;
    onDelete: (id: string) => void;
    onToggleStatus: (transaction: MasterExpenseTransaction) => void;
  };
  
  export default function MasterExpenseTransactionsTable({ transactions, onEdit, onDelete, onToggleStatus }: MasterExpenseTransactionsTableProps) {
    return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length > 0 ? transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">{transaction.description}</TableCell>
                <TableCell>{format(new Date(transaction.date), 'dd MMM yyyy')}</TableCell>
                <TableCell>
                  <Badge
                    variant={transaction.status === 'Paid' ? 'default' : 'secondary'}
                    className="cursor-pointer"
                    onClick={() => onToggleStatus(transaction)}
                  >
                    {transaction.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{formatCurrency(transaction.amount)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(transaction)} className="h-8 w-8">
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(transaction.id)} className="h-8 w-8 text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                     <span className="sr-only">Delete</span>
                  </Button>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">No transactions found for this month.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
    );
  }
