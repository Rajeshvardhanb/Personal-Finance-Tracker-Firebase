"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { useFinances } from "@/hooks/use-finances";
import { format, addMonths, subMonths } from "date-fns";

export default function MonthSelector() {
  const { selectedDate, setSelectedDate } = useFinances();

  const handlePrevMonth = () => {
    setSelectedDate(subMonths(selectedDate, 1));
  };

  const handleNextMonth = () => {
    setSelectedDate(addMonths(selectedDate, 1));
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <Button variant="outline" size="icon" className="h-8 w-8" onClick={handlePrevMonth}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="w-32 text-center font-medium">
        {format(selectedDate, "MMMM yyyy")}
      </span>
      <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleNextMonth}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
