
"use client";

import { useFinances } from "@/hooks/use-finances";
import { getMonth, getYear } from "date-fns";
import SummaryCards from "./SummaryCards";
import DashboardCharts from "./DashboardCharts";
import RecentExpenses from "./RecentExpenses";
import NotesWidget from "./NotesWidget";
import SavingsForecast from "./SavingsForecast";
import CreditCardSummary from "./CreditCardSummary";
import PageHeader from "../PageHeader";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";

export default function DashboardClient() {
  const { data, selectedDate } = useFinances();
  const { user } = useAuth();
  
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
    .reduce((sum, i) => sum + (i.creditedAmount > 0 ? i.creditedAmount : i.expectedAmount), 0);
  
  const paidExpenses = monthlyExpenses
    .filter((e) => e.status === "Paid")
    .reduce((sum, e) => sum + e.amount, 0);
    
  const unpaidExpenses = monthlyExpenses
    .filter((e) => e.status === "Not Paid")
    .reduce((sum, e) => sum + e.amount, 0);

  const totalExpenses = paidExpenses + unpaidExpenses;

  return (
    <div className="grid gap-6">
      <PageHeader title="Dashboard" />
      
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold">Welcome, {user?.email}!</h2>
          <p className="text-muted-foreground">Here's your financial overview for the selected month.</p>
        </CardContent>
      </Card>

      <SummaryCards
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        paidExpenses={paidExpenses}
        unpaidExpenses={unpaidExpenses}
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3 grid gap-6">
          <DashboardCharts 
            income={totalIncome} 
            expenses={totalExpenses} 
            creditCardSpending={monthlyCardSpending} 
            expenseData={monthlyExpenses}
          />
        </div>
        <div className="lg:col-span-2 grid gap-6 auto-rows-min">
           <CreditCardSummary creditCards={data.creditCards} selectedDate={selectedDate} />
        </div>
      </div>

       <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3 grid gap-6">
           <RecentExpenses expenses={monthlyExpenses} />
        </div>
        <div className="lg:col-span-2 grid gap-6 auto-rows-min">
            <SavingsForecast />
           <NotesWidget />
        </div>
      </div>
    </div>
  );
}
