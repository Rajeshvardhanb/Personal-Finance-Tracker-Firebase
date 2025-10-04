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
  import type { Income } from "@/lib/types";
  import { formatCurrency } from "@/lib/utils";
  import { format } from "date-fns";
  import { Badge } from "@/components/ui/badge";
  
  type IncomeTableProps = {
    incomes: Income[];
    onEdit: (income: Income) => void;
    onDelete: (id: string) => void;
  };
  
  export default function IncomeTable({ incomes, onEdit, onDelete }: IncomeTableProps) {
    return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Source</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {incomes.length > 0 ? incomes.map((income) => (
              <TableRow key={income.id}>
                <TableCell className="font-medium">{income.source}</TableCell>
                <TableCell>{format(new Date(income.date), 'dd MMM yyyy')}</TableCell>
                 <TableCell>
                  <Badge variant={income.status === 'Credited' ? 'default' : 'secondary'}>
                    {income.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{formatCurrency(income.creditedAmount > 0 ? income.creditedAmount : income.expectedAmount)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(income)}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDelete(income.id)} className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
  