
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CreditCardTransactionSchema, type CreditCardTransactionFormValues } from "@/lib/schemas";
import type { CreditCardTransaction } from "@/lib/types";
import { useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFinances } from "@/hooks/use-finances";

type CreditCardTransactionFormProps = {
  isOpen: boolean;
  onClose: () => void;
  transaction: CreditCardTransaction | null;
  cardId: string;
  addTransaction: (cardId: string, transaction: Omit<CreditCardTransaction, 'id'>) => void;
  updateTransaction: (cardId: string, transaction: CreditCardTransaction) => void;
};

export default function CreditCardTransactionForm({ isOpen, onClose, transaction, cardId, addTransaction, updateTransaction }: CreditCardTransactionFormProps) {
  const isEditing = !!transaction;
  const { data } = useFinances();

  const form = useForm<CreditCardTransactionFormValues>({
    resolver: zodResolver(CreditCardTransactionSchema),
    defaultValues: {
      description: "",
      amount: 0,
      masterExpenseId: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (transaction) {
        form.reset({
          ...transaction,
          date: new Date(transaction.date),
          masterExpenseId: transaction.masterExpenseId || "",
        });
      } else {
        form.reset({
          description: "",
          amount: 0,
          date: new Date(),
          masterExpenseId: "",
        });
      }
    }
  }, [transaction, form, isOpen]);

  function onSubmit(values: CreditCardTransactionFormValues) {
    const dataToSubmit = {
      ...values,
      date: values.date.toISOString(),
      masterExpenseId: values.masterExpenseId || undefined,
    };

    if (isEditing && transaction) {
        updateTransaction(cardId, { ...dataToSubmit, id: transaction.id });
    } else {
        const {id, ...newTransactionData } = dataToSubmit;
        addTransaction(cardId, newTransactionData);
    }
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit' : 'Add'} Transaction</DialogTitle>
          <DialogDescription>
            Fill in the details for the credit card transaction.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Amazon Purchase" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                  <FormItem>
                  <FormLabel>Amount (₹)</FormLabel>
                  <FormControl>
                      <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                  </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Transaction Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
                control={form.control}
                name="masterExpenseId"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Link to Master Expense (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a master expense" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          {data.masterExpenses.map((me) => (
                              <SelectItem key={me.id} value={me.id}>{me.name}</SelectItem>
                          ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit">{isEditing ? 'Save Changes' : 'Add Transaction'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
