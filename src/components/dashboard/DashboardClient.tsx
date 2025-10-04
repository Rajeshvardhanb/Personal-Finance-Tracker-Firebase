"use client";

import { useFinances } from "@/hooks/use-finances";
import { getMonth, getYear } from "date-fns";
import SummaryCards from "./SummaryCards";
import DashboardCharts from "./DashboardCharts";
import RecentExpenses from "./RecentExpenses";
import NotesWidget from "./NotesWidget";
import SavingsForecast from "./SavingsForecast";

export default function DashboardClient() {
  const { data, selectedDate } = useFinances();
  
  const currentMonth = getMonth(selectedDate);
  const currentYear = getYear(selectedDate);

  const monthlyIncomes = data.incomes.filter(
    (inc) =>
      getMonth(new Date(inc.date)) === currentMonth &&
      getYear(new Date(inc.date)) === currentYear
  );

  const monthlyExpenses = data.expenses.filter(
    (exp) =>
      getMonth(new Date(exp.dueDate)) === currentMonth &&
      getYear(new Date(exp.dueDate)) === currentYear
  );
  
  const monthlyCardSpending = data.creditCards
    .flatMap(card => card.transactions)
    .filter(
      (t) =>
        getMonth(new Date(t.date)) === currentMonth &&
        getYear(new Date(t.date)) === currentYear
    ).reduce((sum, t) => sum + t.amount, 0);

  const totalIncome = monthlyIncomes
    .filter((i) => i.status === "Credited")
    .reduce((sum, i) => sum + i.creditedAmount, 0);
  
  const paidExpenses = monthlyExpenses
    .filter((e) => e.status === "Paid")
    .reduce((sum, e) => sum + e.amount, 0);
    
  const unpaidExpenses = monthlyExpenses
    .filter((e) => e.status === "Not Paid")
    .reduce((sum, e) => sum + e.amount, 0);

  const savings = totalIncome - (paidExpenses + monthlyCardSpending);

  return (
    <div className="grid gap-6">
      <SummaryCards
        totalIncome={totalIncome}
        paidExpenses={paidExpenses}
        unpaidExpenses={unpaidExpenses}
        savings={savings}
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DashboardCharts 
            income={totalIncome} 
            expenses={paidExpenses} 
            creditCardSpending={monthlyCardSpending} 
            expenseData={monthlyExpenses}
          />
        </div>
        <div className="lg:col-span-1 grid gap-6">
           <SavingsForecast />
           <NotesWidget />
        </div>
      </div>
      <RecentExpenses expenses={monthlyExpenses} />
    </div>
  );
}
