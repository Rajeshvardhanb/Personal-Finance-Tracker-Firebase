"use client";

import { useFinances } from "@/hooks/use-finances";
import { getMonth, getYear } from "date-fns";
import SummaryCards from "./SummaryCards";
import DashboardCharts from "./DashboardCharts";
import RecentExpenses from "./RecentExpenses";
import NotesWidget from "./NotesWidget";
import SavingsForecast from "./SavingsForecast";
import CreditCardSummary from "./CreditCardSummary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { CreditCard as CreditCardIcon } from "lucide-react";

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

  const totalExpenses = paidExpenses + unpaidExpenses + monthlyCardSpending;

  return (
    <div className="grid gap-6">
      <SummaryCards
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        paidExpenses={paidExpenses}
        unpaidExpenses={unpaidExpenses}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Credit Card Spend</CardTitle>
              <CreditCardIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(monthlyCardSpending)}
              </div>
            </CardContent>
        </Card>
        {data.creditCards.map(card => {
           const monthlySpending = card.transactions
            .filter(t => getMonth(new Date(t.date)) === currentMonth && getYear(new Date(t.date)) === currentYear)
            .reduce((sum, t) => sum + t.amount, 0);
          return (
            <Card key={card.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.name}</CardTitle>
                 <CreditCardIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(monthlySpending)}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 grid gap-6">
          <DashboardCharts 
            income={totalIncome} 
            expenses={paidExpenses + unpaidExpenses} 
            creditCardSpending={monthlyCardSpending} 
            expenseData={monthlyExpenses}
          />
          <RecentExpenses expenses={monthlyExpenses} />
        </div>
        <div className="lg:col-span-1 grid gap-6 auto-rows-min">
           <SavingsForecast />
           <CreditCardSummary creditCards={data.creditCards} selectedDate={selectedDate} />
           <NotesWidget />
        </div>
      </div>
    </div>
  );
}
