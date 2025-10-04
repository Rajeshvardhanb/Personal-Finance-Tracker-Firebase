
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MasterExpenseSchema, type MasterExpenseFormValues } from "@/lib/schemas";
import type { MasterExpense } from "@/lib/types";
import { useEffect } from "react";

type MasterExpenseFormProps = {
  isOpen: boolean;
  onClose: () => void;
  masterExpense: MasterExpense | null;
  addMasterExpense: (expense: Omit<MasterExpense, 'id' | 'transactions'>) => void;
  updateMasterExpense: (expense: MasterExpense) => void;
};

export default function MasterExpenseForm({ isOpen, onClose, masterExpense, addMasterExpense, updateMasterExpense }: MasterExpenseFormProps) {
  const isEditing = !!masterExpense;

  const form = useForm<MasterExpenseFormValues>({
    resolver: zodResolver(MasterExpenseSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (masterExpense) {
        form.reset({
          name: masterExpense.name,
        });
      } else {
        form.reset({
          name: "",
        });
      }
    }
  }, [masterExpense, form, isOpen]);

  function onSubmit(values: MasterExpenseFormValues) {
    if (isEditing && masterExpense) {
        updateMasterExpense({ ...masterExpense, ...values });
    } else {
        addMasterExpense(values);
    }
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit' : 'Add'} Master Expense</DialogTitle>
          <DialogDescription>
            Create a master expense to group multiple transactions.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Master Expense Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Vacation, Wedding" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit">{isEditing ? 'Save Changes' : 'Add Master Expense'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
