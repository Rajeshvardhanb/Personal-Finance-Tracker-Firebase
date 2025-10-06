
'use client';

import { useState } from 'react';
import { useFinances } from '@/hooks/use-finances';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ExpenseCategorySchema, type ExpenseCategoryFormValues } from '@/lib/schemas';
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form';
import { Plus, Trash2 } from 'lucide-react';

export default function ExpenseCategoryManager() {
  const { data, addExpenseCategory, deleteExpenseCategory } = useFinances();
  const [isAdding, setIsAdding] = useState(false);

  const form = useForm<ExpenseCategoryFormValues>({
    resolver: zodResolver(ExpenseCategorySchema),
    defaultValues: { name: '' },
  });

  const onSubmit = (values: ExpenseCategoryFormValues) => {
    addExpenseCategory(values);
    form.reset();
    setIsAdding(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Categories</CardTitle>
        <CardDescription>Add, or delete your expense categories.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            {data.expenseCategories.map((category) => (
              <div key={category.id} className="flex items-center justify-between rounded-md border p-3">
                <p className="font-medium">{category.name}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => deleteExpenseCategory(category.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {isAdding ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormControl>
                        <Input {...field} placeholder="New category name" autoFocus />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Add</Button>
                <Button variant="outline" onClick={() => setIsAdding(false)}>
                  Cancel
                </Button>
              </form>
            </Form>
          ) : (
            <Button variant="outline" onClick={() => setIsAdding(true)}>
              <Plus className="mr-2" />
              Add Category
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
