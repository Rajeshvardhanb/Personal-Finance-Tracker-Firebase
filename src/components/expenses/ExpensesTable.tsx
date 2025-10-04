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
  import type { Expense } from "@/lib/types";
  import { formatCurrency } from "@/lib/utils";
  import { format } from "date-fns";
  import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
  
  type ExpensesTableProps = {
    expenses: Expense[];
    onEdit: (expense: Expense) => void;
    onDelete: (id: string) => void;
    onToggleStatus: (expense: Expense) => void;
  };
  
  export default function ExpensesTable({ expenses, onEdit, onDelete, onToggleStatus }: ExpensesTableProps) {
    return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.length > 0 ? expenses.map((expense) => (
              <TableRow key={expense.id} className={cn(expense.masterExpenseId && 'bg-muted/30')}>
                <TableCell className="font-medium">{expense.description}</TableCell>
                <TableCell>
                   <Badge variant="outline">{expense.category}</Badge>
                </TableCell>
                <TableCell>{format(new Date(expense.dueDate), 'dd MMM yyyy')}</TableCell>
                 <TableCell>
                  <Badge 
                    variant={expense.status === 'Paid' ? 'default' : 'secondary'}
                    className={cn(!expense.masterExpenseId && 'cursor-pointer', "border border-transparent")}
                    onClick={() => onToggleStatus(expense)}
                  >
                    {expense.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(expense.amount)}</TableCell>
                <TableCell className="text-right">
                  {!expense.masterExpenseId ? (
                    <>
                      <Button variant="ghost" size="icon" onClick={() => onEdit(expense)} className="h-8 w-8">
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onDelete(expense.id)} className="h-8 w-8 text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </>
                  ) : (
                    <span className="text-xs text-muted-foreground">Managed</span>
                  )}
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">No expenses found for this month.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
    );
  }
  