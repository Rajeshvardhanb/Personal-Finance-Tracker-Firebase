"use client";

import { useEffect, useState, useTransition } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useFinances } from "@/hooks/use-finances";
import { forecastSavings, type SavingsForecastOutput } from "@/ai/flows/savings-forecast";
import { Button } from "@/components/ui/button";
import { Sparkles, LoaderCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function SavingsForecast() {
  const { getFinancialDataForPastMonths } = useFinances();
  const [forecast, setForecast] = useState<SavingsForecastOutput | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleForecast = async () => {
    setError(null);
    setForecast(null);
    startTransition(async () => {
      try {
        const lastThreeMonthsData = getFinancialDataForPastMonths(3);
        
        if(lastThreeMonthsData.some(d => d.income === 0 && d.expenses === 0 && d.creditCardSpending === 0) || lastThreeMonthsData.length < 3) {
          setError("Not enough data for a forecast. At least 3 months of data with transactions are required.");
          return;
        }

        const result = await forecastSavings({ lastThreeMonthsData });
        setForecast(result);
      } catch (e) {
        console.error(e);
        setError("Failed to generate forecast. Please try again.");
      }
    });
  };
  
  // Automatically run forecast on component mount
  useEffect(() => {
    handleForecast();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          Savings Forecast
        </CardTitle>
        <CardDescription>
          Next month's savings projection based on your recent activity.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isPending && (
          <div className="flex items-center justify-center h-24">
            <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        {error && (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
                <Button variant="link" size="sm" onClick={handleForecast} className="p-0 h-auto mt-2">Try Again</Button>
            </Alert>
        )}
        {forecast && !isPending && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Forecasted Savings</p>
              <p className="text-3xl font-bold text-primary">{formatCurrency(forecast.forecastedSavings)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">How we calculated this:</p>
              <p className="text-sm">{forecast.explanation}</p>
            </div>
            <Button onClick={handleForecast} size="sm" variant="ghost" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Regenerate
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
