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
  import type { Expense } from "@/lib/types";
  import { formatCurrency } from "@/lib/utils";
  import { format } from "date-fns";
  import { Badge } from "@/components/ui/badge";
  
  type ExpensesTableProps = {
    expenses: Expense[];
    onEdit: (expense: Expense) => void;
    onDelete: (id: string) => void;
  };
  
  export default function ExpensesTable({ expenses, onEdit, onDelete }: ExpensesTableProps) {
    return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.length > 0 ? expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell className="font-medium">{expense.description}</TableCell>
                <TableCell>{expense.category}</TableCell>
                <TableCell>{format(new Date(expense.dueDate), 'dd MMM yyyy')}</TableCell>
                 <TableCell>
                  <Badge variant={expense.status === 'Paid' ? 'default' : 'secondary'}>
                    {expense.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{formatCurrency(expense.amount)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(expense)}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDelete(expense.id)} className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
  