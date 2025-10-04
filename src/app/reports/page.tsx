import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function ReportsPage() {
  return (
    <div>
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
       <div className="text-center py-16 text-muted-foreground">
        <p>Monthly financial reports will be displayed here.</p>
      </div>
    </div>
  );
}
