"use client";

import { useState } from "react";
import { getMonth, getYear } from "date-fns";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useFinances } from "@/hooks/use-finances";
import IncomeTable from "@/components/income/IncomeTable";
import IncomeForm from "@/components/income/IncomeForm";
import { Card, CardContent } from "@/components/ui/card";
import type { Income } from "@/lib/types";

export default function IncomePage() {
  const { data, selectedDate, addIncome, updateIncome, deleteIncome } = useFinances();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);

  const currentMonth = getMonth(selectedDate);
  const currentYear = getYear(selectedDate);

  const monthlyIncomes = data.incomes.filter(
    (inc) =>
      getMonth(new Date(inc.date)) === currentMonth &&
      getYear(new Date(inc.date)) === currentYear
  );

  const handleAddIncome = () => {
    setEditingIncome(null);
    setIsFormOpen(true);
  };

  const handleEditIncome = (income: Income) => {
    setEditingIncome(income);
    setIsFormOpen(true);
  };

  const handleDeleteIncome = (id: string) => {
    deleteIncome(id);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingIncome(null);
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Income">
        <Button onClick={handleAddIncome}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Income
        </Button>
      </PageHeader>

      <Card>
        <CardContent className="p-0">
          <IncomeTable 
            incomes={monthlyIncomes} 
            onEdit={handleEditIncome}
            onDelete={handleDeleteIncome}
          />
        </CardContent>
      </Card>
      
      {isFormOpen && (
        <IncomeForm
            isOpen={isFormOpen}
            onClose={handleCloseForm}
            income={editingIncome}
            addIncome={addIncome}
            updateIncome={updateIncome}
        />
      )}
    </div>
  );
}
