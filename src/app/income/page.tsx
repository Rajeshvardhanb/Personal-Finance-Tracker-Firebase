"use client";

import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function IncomePage() {
  const { toast } = useToast();

  const handleAddIncome = () => {
    toast({
      title: "Feature Not Implemented",
      description: "Adding new income is not yet available.",
    });
  };

  return (
    <div>
      <PageHeader title="Income">
        <Button onClick={handleAddIncome}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Income
        </Button>
      </PageHeader>
      <div className="text-center py-16 text-muted-foreground">
        <p>Income tracking content will be displayed here.</p>
      </div>
    </div>
  );
}
