import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function IncomePage() {
  return (
    <div>
      <PageHeader title="Income">
        <Button>
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
