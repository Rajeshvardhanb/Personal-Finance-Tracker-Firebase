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
  import type { Income } from "@/lib/types";
  import { formatCurrency } from "@/lib/utils";
  import { format } from "date-fns";
  import { Badge } from "@/components/ui/badge";
  
  type IncomeTableProps = {
    incomes: Income[];
    onEdit: (income: Income) => void;
    onDelete: (id: string) => void;
    onToggleStatus: (income: Income) => void;
  };
  
  export default function IncomeTable({ incomes, onEdit, onDelete, onToggleStatus }: IncomeTableProps) {
    return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Source</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {incomes.length > 0 ? incomes.map((income) => (
              <TableRow key={income.id}>
                <TableCell className="font-medium">{income.source}</TableCell>
                <TableCell>{format(new Date(income.date), 'dd MMM yyyy')}</TableCell>
                 <TableCell>
                  <Badge 
                    variant={income.status === 'Credited' ? 'default' : 'secondary'}
                    className="cursor-pointer"
                    onClick={() => onToggleStatus(income)}
                  >
                    {income.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{formatCurrency(income.creditedAmount > 0 ? income.creditedAmount : income.expectedAmount)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(income)} className="h-8 w-8">
                    <Pencil className="h-4 w-4" />
                     <span className="sr-only">Edit</span>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(income.id)} className="h-8 w-8 text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                     <span className="sr-only">Delete</span>
                  </Button>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">No income found for this month.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
    );
  }
  