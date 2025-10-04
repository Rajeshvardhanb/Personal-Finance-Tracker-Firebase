'use server';
/**
 * @fileOverview Forecasts the next month's savings based on the last three months' financial data.
 *
 * - forecastSavings - A function that forecasts the savings for the next month.
 * - SavingsForecastInput - The input type for the forecastSavings function.
 * - SavingsForecastOutput - The return type for the forecastSavings function.
 */

import { z } from 'zod';

const SavingsForecastInputSchema = z.object({
  lastThreeMonthsData: z.array(
    z.object({
      income: z.number().describe('Monthly income in INR.'),
      expenses: z.number().describe('Monthly expenses in INR.'),
      creditCardSpending: z.number().describe('Monthly credit card spending in INR.'),
      overspendingCategories: z.array(z.string()).optional().describe('Categories where spending exceeded budget.'),
    }).describe('Financial data for a single month.')
  ).describe('An array containing the financial data of the last three months.'),
});
export type SavingsForecastInput = z.infer<typeof SavingsForecastInputSchema>;

const SavingsForecastOutputSchema = z.object({
  forecastedSavings: z.number().describe('The forecasted savings for the next month in INR.'),
  explanation: z.string().describe('Explanation of how the savings were forecasted, including trends and overspending categories.'),
});
export type SavingsForecastOutput = z.infer<typeof SavingsForecastOutputSchema>;

export async function forecastSavings(input: SavingsForecastInput): Promise<SavingsForecastOutput> {
  const {lastThreeMonthsData} = input;
  const totalSavings = lastThreeMonthsData.reduce((acc, month) => {
    return acc + month.income - (month.expenses + month.creditCardSpending);
  }, 0);
  const averageSavings = totalSavings / 3;

  let explanation = 'The forecasted savings is based on the average savings of the last three months.';

  const overspending = lastThreeMonthsData.flatMap(m => m.overspendingCategories || []);
  if (overspending.length > 0) {
    const uniqueCategories = [...new Set(overspending)];
    explanation += ` Your overspending in ${uniqueCategories.join(', ')} has been considered.`
  }

  return {
    forecastedSavings: averageSavings,
    explanation,
  };
}
