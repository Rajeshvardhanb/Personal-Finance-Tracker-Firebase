"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, cn } from "@/lib/utils";
import { Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import type { Income, Expense, CreditCardTransaction, MasterExpenseTransaction } from "@/lib/types";

type Transaction = Income | Expense | CreditCardTransaction | MasterExpenseTransaction;

type TransactionCardProps = {
  type: 'income' | 'expense' | 'credit-card' | 'master-expense';
  transaction: Transaction;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus?: () => void;
};

export default function TransactionCard({ transaction, type, onEdit, onDelete, onToggleStatus }: TransactionCardProps) {

  const getTitle = () => {
    if ('source' in transaction) return transaction.source; // Income
    return transaction.description; // Expense, CreditCard, MasterExpense
  }

  const getAmount = () => {
    if ('creditedAmount' in transaction && transaction.creditedAmount > 0) return transaction.creditedAmount;
    if ('expectedAmount' in transaction) return transaction.expectedAmount; // Income
    return transaction.amount; // Expense, CreditCard, MasterExpense
  }

  const getDate = () => {
    if ('dueDate' in transaction) return transaction.dueDate; // Expense
    return transaction.date; // Income, CreditCard, MasterExpense
  }
  
  const getSubtext = () => {
    if ('category' in transaction) return transaction.category; // Expense
    if (type === 'income') return format(new Date(getDate()), 'dd MMM yyyy');
    if (type === 'credit-card') return format(new Date(getDate()), 'dd MMM yyyy');
    if (type === 'master-expense') return format(new Date(getDate()), 'dd MMM yyyy');
    return null;
  }

  const getStatus = () => {
    if ('status' in transaction) return transaction.status;
    return null;
  }
  
  const status = getStatus();

  return (
    <div className={cn(
      "flex items-center p-4 rounded-lg border transition-all duration-300 hover:shadow-lg hover:border-primary/20",
      type === 'income' && "bg-green-50/50 border-green-100 dark:bg-green-900/10 dark:border-green-900/20",
      type === 'expense' && status === 'Paid' && "bg-blue-50/50 border-blue-100 dark:bg-blue-900/10 dark:border-blue-900/20",
      type === 'expense' && status === 'Not Paid' && "bg-amber-50/50 border-amber-100 dark:bg-amber-900/10 dark:border-amber-900/20",
      (type === 'credit-card' || type === 'master-expense') && "bg-indigo-50/50 border-indigo-100 dark:bg-indigo-900/10 dark:border-indigo-900/20",
      transaction.masterExpenseId && 'bg-slate-50 dark:bg-slate-800/20'
    )}>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 items-center gap-2">
        {/* Main Info */}
        <div className="md:col-span-1">
          <p className="font-semibold">{getTitle()}</p>
          {getSubtext() && <p className="text-sm text-muted-foreground">{getSubtext()}</p>}
        </div>

        {/* Date and Status */}
        <div className="md:col-span-1 flex items-center gap-4 text-sm">
            {type === 'expense' && (
                <>
                    <span className="text-muted-foreground">{format(new Date(getDate()), 'dd MMM yyyy')}</span>
                    <Badge 
                        variant={status === 'Paid' ? 'default' : 'secondary'}
                        className={cn(!transaction.masterExpenseId && onToggleStatus && 'cursor-pointer', "border")}
                        onClick={onToggleStatus}
                    >
                        {status}
                    </Badge>
                </>
            )}
             {type === 'income' && status && (
                <Badge 
                    variant={status === 'Credited' ? 'default' : 'secondary'}
                    className={cn(onToggleStatus && 'cursor-pointer', "border")}
                    onClick={onToggleStatus}
                >
                    {status}
                </Badge>
            )}
             {type === 'master-expense' && status && (
                <Badge 
                    variant={status === 'Paid' ? 'default' : 'secondary'}
                    className={cn(onToggleStatus && 'cursor-pointer', "border")}
                    onClick={onToggleStatus}
                >
                    {status}
                </Badge>
            )}
        </div>

        {/* Amount */}
        <div className="md:col-span-1 md:text-right">
          <p className={cn(
              "font-bold text-lg",
              type === 'income' && "text-green-600",
              type === 'expense' && "text-red-600",
              (type === 'credit-card' || type === 'master-expense') && "text-indigo-600"
          )}>{formatCurrency(getAmount())}</p>
        </div>
      </div>
      
      {/* Actions */}
      <div className="ml-4 flex items-center">
        {!transaction.masterExpenseId ? (
            <>
            <Button variant="ghost" size="icon" onClick={onEdit} className="h-8 w-8">
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={onDelete} className="h-8 w-8 text-destructive hover:text-destructive">
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
            </Button>
            </>
        ) : (
            <span className="text-xs text-muted-foreground">Managed</span>
        )}
      </div>
    </div>
  );
}
