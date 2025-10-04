import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function ExpensesPage() {
  return (
    <div>
      <PageHeader title="Expenses">
        <Button>
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
