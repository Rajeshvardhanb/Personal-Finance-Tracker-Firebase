"use client";

import PageHeader from "@/components/PageHeader";
import DailyExpensesChart from "@/components/reports/DailyExpensesChart";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

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
      
      <DailyExpensesChart />

       <div className="text-center py-16 text-muted-foreground">
        <p>More monthly financial reports will be displayed here.</p>
      </div>
    </div>
  );
}
