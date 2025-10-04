import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function CreditCardsPage() {
  return (
    <div>
      <PageHeader title="Credit Cards">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Card
        </Button>
      </PageHeader>
      <div className="text-center py-16 text-muted-foreground">
        <p>Credit card management content will be displayed here.</p>
      </div>
    </div>
  );
}
