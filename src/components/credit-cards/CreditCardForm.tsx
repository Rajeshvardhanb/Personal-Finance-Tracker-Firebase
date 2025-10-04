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
import { CreditCardSchema, type CreditCardFormValues } from "@/lib/schemas";
import type { CreditCard } from "@/lib/types";
import { useEffect } from "react";

type CreditCardFormProps = {
  isOpen: boolean;
  onClose: () => void;
  card: CreditCard | null;
  addCreditCard: (card: Omit<CreditCard, 'id' | 'transactions'>) => void;
  updateCreditCard: (card: CreditCard) => void;
};

export default function CreditCardForm({ isOpen, onClose, card, addCreditCard, updateCreditCard }: CreditCardFormProps) {
  const isEditing = !!card;

  const form = useForm<CreditCardFormValues>({
    resolver: zodResolver(CreditCardSchema),
    defaultValues: {
      name: "",
      creditLimit: 100000,
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (card) {
        form.reset({
          ...card,
          upcomingBillDueDate: new Date(card.upcomingBillDueDate),
        });
      } else {
        form.reset({
          name: "",
          creditLimit: 100000,
          upcomingBillDueDate: new Date(),
        });
      }
    }
  }, [card, form, isOpen]);

  function onSubmit(values: CreditCardFormValues) {
    const dataToSubmit = {
      ...values,
      upcomingBillDueDate: values.upcomingBillDueDate.toISOString(),
    };

    if (isEditing && card) {
        updateCreditCard({ ...dataToSubmit, id: card.id, transactions: card.transactions });
    } else {
        const {id, ...newCardData } = dataToSubmit;
        addCreditCard(newCardData);
    }
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit' : 'Add'} Credit Card</DialogTitle>
          <DialogDescription>
            Fill in the details for your credit card. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., HDFC Millennia" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="creditLimit"
              render={({ field }) => (
                  <FormItem>
                  <FormLabel>Credit Limit (₹)</FormLabel>
                  <FormControl>
                      <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                  </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="upcomingBillDueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Next Bill Due Date</FormLabel>
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
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit">{isEditing ? 'Save Changes' : 'Add Card'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
