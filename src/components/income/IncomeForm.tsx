"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { IncomeSchema, type IncomeFormValues } from "@/lib/schemas";
import type { Income } from "@/lib/types";
import { useEffect } from "react";

type IncomeFormProps = {
  isOpen: boolean;
  onClose: () => void;
  income: Income | null;
  addIncome: (income: Omit<Income, 'id'>) => void;
  updateIncome: (income: Income) => void;
};

export default function IncomeForm({ isOpen, onClose, income, addIncome, updateIncome }: IncomeFormProps) {
  const isEditing = !!income;

  const form = useForm<IncomeFormValues>({
    resolver: zodResolver(IncomeSchema),
    defaultValues: {
      source: "",
      expectedAmount: 0,
      creditedAmount: 0,
      status: "Not Credited",
      isRecurring: false,
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (income) {
        form.reset({
          ...income,
          date: new Date(income.date),
        });
      } else {
        form.reset({
          source: "",
          expectedAmount: 0,
          creditedAmount: 0,
          status: "Not Credited",
          date: new Date(),
          isRecurring: false,
        });
      }
    }
  }, [income, form, isOpen]);

  function onSubmit(values: IncomeFormValues) {
    const dataToSubmit = {
      ...values,
      date: values.date.toISOString(),
    };

    if (isEditing && income) {
        updateIncome({ ...dataToSubmit, id: income.id });
    } else {
        const {id, ...newIncomeData } = dataToSubmit;
        addIncome(newIncomeData);
    }
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit' : 'Add'} Income</DialogTitle>
          <DialogDescription>
            Fill in the details for your income. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Income Source</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Salary, Freelance" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="expectedAmount"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Expected Amount (₹)</FormLabel>
                    <FormControl>
                        <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="creditedAmount"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Credited Amount (₹)</FormLabel>
                    <FormControl>
                        <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
             <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
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
                name="status"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="Credited">Credited</SelectItem>
                            <SelectItem value="Not Credited">Not Credited</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="isRecurring"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                        <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                        <FormLabel>Is this a recurring income?</FormLabel>
                        <FormDescription>
                           Select if this income occurs on a regular basis.
                        </FormDescription>
                    </div>
                    </FormItem>
                )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit">{isEditing ? 'Save Changes' : 'Add Income'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
