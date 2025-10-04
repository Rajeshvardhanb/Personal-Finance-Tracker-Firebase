"use client";
import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useFinances } from "@/hooks/use-finances";
import { getMonth, getYear } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import ExpensesTable from "@/components/expenses/ExpensesTable";
import ExpenseForm from "@/components/expenses/ExpenseForm";
import type { Expense } from "@/lib/types";

export default function ExpensesPage() {
  const { data, selectedDate, addExpense, updateExpense, deleteExpense } = useFinances();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const currentMonth = getMonth(selectedDate);
  const currentYear = getYear(selectedDate);

  const monthlyExpenses = data.expenses.filter(
    (exp) =>
      getMonth(new Date(exp.dueDate)) === currentMonth &&
      getYear(new Date(exp.dueDate)) === currentYear
  );

  const handleAddExpense = () => {
    setEditingExpense(null);
    setIsFormOpen(true);
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setIsFormOpen(true);
  };

  const handleDeleteExpense = (id: string) => {
    deleteExpense(id);
  };

  const handleToggleStatus = (expense: Expense) => {
    const newStatus = expense.status === 'Paid' ? 'Not Paid' : 'Paid';
    updateExpense({ ...expense, status: newStatus });
  }

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingExpense(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Expenses">
        <Button onClick={handleAddExpense}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Expense
        </Button>
      </PageHeader>
      
      <Card>
        <CardContent className="p-0">
          <ExpensesTable
            expenses={monthlyExpenses}
            onEdit={handleEditExpense}
            onDelete={handleDeleteExpense}
            onToggleStatus={handleToggleStatus}
          />
        </CardContent>
      </Card>

      {isFormOpen && (
        <ExpenseForm
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          expense={editingExpense}
          addExpense={addExpense}
          updateExpense={updateExpense}
        />
      )}
    </div>
  );
}
