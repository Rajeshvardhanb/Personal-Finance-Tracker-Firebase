"use client";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ExpensesPage() {
  const { toast } = useToast();

  const handleAddExpense = () => {
    toast({
      title: "Feature Not Implemented",
      description: "Adding a new expense is not yet available.",
    });
  }

  return (
    <div>
      <PageHeader title="Expenses">
        <Button onClick={handleAddExpense}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Expense
        </Button>
      </PageHeader>
      <div className="text-center py-16 text-muted-foreground">
        <p>Expense tracking and budget content will be displayed here.</p>
      </div>
    </div>
  );
}
