"use client";

import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CreditCardsPage() {
  const { toast } = useToast();

  const handleAddCard = () => {
    toast({
      title: "Feature Not Implemented",
      description: "Adding a new credit card is not yet available.",
    });
  }

  return (
    <div>
      <PageHeader title="Credit Cards">
        <Button onClick={handleAddCard}>
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
