"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NetWorthEntrySchema, type NetWorthEntryFormValues } from "@/lib/schemas";
import { AssetCategories, LiabilityCategories, type Asset, type Liability } from "@/lib/types";
import { useEffect } from "react";

type EntryFormProps = {
  isOpen: boolean;
  onClose: () => void;
  entryType: 'asset' | 'liability';
  entry: Asset | Liability | null;
  addAsset: (asset: Omit<Asset, 'id' | 'lastUpdated'>) => void;
  updateAsset: (asset: Omit<Asset, 'lastUpdated'>) => void;
  addLiability: (liability: Omit<Liability, 'id' | 'lastUpdated'>) => void;
  updateLiability: (liability: Omit<Liability, 'lastUpdated'>) => void;
};

export default function EntryForm({ isOpen, onClose, entryType, entry, ...props }: EntryFormProps) {
  const isEditing = !!entry;
  const categories = entryType === 'asset' ? AssetCategories : LiabilityCategories;

  const form = useForm<NetWorthEntryFormValues>({
    resolver: zodResolver(NetWorthEntrySchema),
    defaultValues: {
      name: "",
      category: "",
      value: 0,
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (entry) {
        form.reset({
          id: entry.id,
          name: entry.name,
          category: entry.category,
          value: entry.value,
        });
      } else {
        form.reset({
          name: "",
          category: "",
          value: 0,
        });
      }
    }
  }, [entry, form, isOpen]);

  function onSubmit(values: NetWorthEntryFormValues) {
    if (entryType === 'asset') {
      if (isEditing) {
        props.updateAsset({ id: entry!.id, ...values });
      } else {
        props.addAsset(values);
      }
    } else { // liability
      if (isEditing) {
        props.updateLiability({ id: entry!.id, ...values });
      } else {
        props.addLiability(values);
      }
    }
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit' : 'Add'} {entryType === 'asset' ? 'Asset' : 'Liability'}</DialogTitle>
          <DialogDescription>
            Fill in the details for your {entryType}. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Savings Account" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 250000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit">{isEditing ? 'Save Changes' : 'Add Entry'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
