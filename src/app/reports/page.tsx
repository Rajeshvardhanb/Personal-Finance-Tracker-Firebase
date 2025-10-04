
"use client";

import PageHeader from "@/components/PageHeader";
import DailyExpensesChart from "@/components/reports/DailyExpensesChart";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MonthlyExpensesChart from "@/components/reports/MonthlyExpensesChart";
import YearlyExpensesChart from "@/components/reports/YearlyExpensesChart";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Reports">
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </PageHeader>
      
      <Tabs defaultValue="daily">
        <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
        </TabsList>
        <TabsContent value="daily">
            <DailyExpensesChart />
        </TabsContent>
        <TabsContent value="monthly">
            <MonthlyExpensesChart />
        </TabsContent>
        <TabsContent value="yearly">
            <YearlyExpensesChart />
        </TabsContent>
      </Tabs>
    </div>
  );
}
