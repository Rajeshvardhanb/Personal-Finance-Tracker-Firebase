
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
import MasterExpenseForm from "@/components/expenses/MasterExpenseForm";
import MasterExpenseTile from "@/components/expenses/MasterExpenseTile";
import type { Expense, MasterExpense } from "@/lib/types";

export default function ExpensesPage() {
  const { data, selectedDate, addExpense, updateExpense, deleteExpense, addMasterExpense, updateMasterExpense, deleteMasterExpense } = useFinances();
  const [isExpenseFormOpen, setIsExpenseFormOpen] = useState(false);
  const [isMasterExpenseFormOpen, setIsMasterExpenseFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [editingMasterExpense, setEditingMasterExpense] = useState<MasterExpense | null>(null);

  const currentMonth = getMonth(selectedDate);
  const currentYear = getYear(selectedDate);

  const monthlyExpenses = data.expenses.filter(
    (exp) =>
      !exp.masterExpenseId &&
      getMonth(new Date(exp.dueDate)) === currentMonth &&
      getYear(new Date(exp.dueDate)) === currentYear
  );

  const handleAddExpense = () => {
    setEditingExpense(null);
    setIsExpenseFormOpen(true);
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setIsExpenseFormOpen(true);
  };

  const handleDeleteExpense = (id: string) => {
    deleteExpense(id);
  };

  const handleToggleStatus = (expense: Expense) => {
    const newStatus = expense.status === 'Paid' ? 'Not Paid' : 'Paid';
    updateExpense({ ...expense, status: newStatus });
  }

  const handleCloseExpenseForm = () => {
    setIsExpenseFormOpen(false);
    setEditingExpense(null);
  };

  const handleAddMasterExpense = () => {
    setEditingMasterExpense(null);
    setIsMasterExpenseFormOpen(true);
  };

  const handleEditMasterExpense = (masterExpense: MasterExpense) => {
    setEditingMasterExpense(masterExpense);
    setIsMasterExpenseFormOpen(true);
  }

  const handleDeleteMasterExpense = (id: string) => {
    deleteMasterExpense(id);
  }

  const handleCloseMasterExpenseForm = () => {
    setIsMasterExpenseFormOpen(false);
    setEditingMasterExpense(null);
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Expenses">
        <div className="flex gap-2">
          <Button onClick={handleAddMasterExpense} variant="secondary">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Master Expense
          </Button>
          <Button onClick={handleAddExpense}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Expense
          </Button>
        </div>
      </PageHeader>
      
      {data.masterExpenses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.masterExpenses.map(me => (
            <MasterExpenseTile 
              key={me.id}
              masterExpense={me}
              onEdit={handleEditMasterExpense}
              onDelete={handleDeleteMasterExpense}
              selectedDate={selectedDate}
            />
          ))}
        </div>
      )}

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

      {isExpenseFormOpen && (
        <ExpenseForm
          isOpen={isExpenseFormOpen}
          onClose={handleCloseExpenseForm}
          expense={editingExpense}
          addExpense={addExpense}
          updateExpense={updateExpense}
        />
      )}

      {isMasterExpenseFormOpen && (
        <MasterExpenseForm
          isOpen={isMasterExpenseFormOpen}
          onClose={handleCloseMasterExpenseForm}
          masterExpense={editingMasterExpense}
          addMasterExpense={addMasterExpense}
          updateMasterExpense={updateMasterExpense}
        />
      )}
    </div>
  );
}
