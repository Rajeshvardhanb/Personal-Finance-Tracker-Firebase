'use server';
/**
 * @fileOverview Forecasts the next month's savings based on the last three months' financial data.
 * Uses AI to analyze financial history, trends, and overspending categories for more accurate predictions.
 *
 * - forecastSavings - A function that forecasts the savings for the next month.
 * - SavingsForecastInput - The input type for the forecastSavings function.
 * - SavingsForecastOutput - The return type for the forecastSavings function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SavingsForecastInputSchema = z.object({
  lastThreeMonthsData: z.array(
    z.object({
      income: z.number().describe('Monthly income in INR.'),
      expenses: z.number().describe('Monthly expenses in INR.'),
      creditCardSpending: z.number().describe('Monthly credit card spending in INR.'),
      overspendingCategories: z.array(z.string()).optional().describe('Categories where spending exceeded budget.'),
    }).describe('Financial data for a single month.')
  ).length(3).describe('An array containing the financial data of the last three months.'),
});
export type SavingsForecastInput = z.infer<typeof SavingsForecastInputSchema>;

const SavingsForecastOutputSchema = z.object({
  forecastedSavings: z.number().describe('The forecasted savings for the next month in INR.'),
  explanation: z.string().describe('Explanation of how the savings were forecasted, including trends and overspending categories.'),
});
export type SavingsForecastOutput = z.infer<typeof SavingsForecastOutputSchema>;

const forecastSavingsTool = ai.defineTool({
  name: 'calculateForecastedSavings',
  description: 'Calculates the forecasted savings for the next month based on the provided financial data and trends, considering potential changes and overspending categories. The returned number should be in INR (₹).',
  inputSchema: SavingsForecastInputSchema,
  outputSchema: SavingsForecastOutputSchema,
},
async (input) => {
  // Basic implementation: average savings from the last three months
  const {lastThreeMonthsData} = input;
  const totalSavings = lastThreeMonthsData.reduce((acc, month) => {
    return acc + month.income - (month.expenses + month.creditCardSpending);
  }, 0);
  const averageSavings = totalSavings / 3;

  return {
    forecastedSavings: averageSavings,
    explanation: 'The forecasted savings is based on the average savings of the last three months.'
  };
});

const prompt = ai.definePrompt({
  name: 'savingsForecastPrompt',
  tools: [forecastSavingsTool],
  input: {
    schema: SavingsForecastInputSchema,
  },
  output: {
    schema: SavingsForecastOutputSchema,
  },
  prompt: `You are a personal finance advisor. Analyze the user's financial data for the last three months and forecast their savings for the next month.

  Consider income, expenses, credit card spending, and any overspending categories to provide an accurate forecast and a clear explanation.
  The forecasted amount should be in INR (₹).

  Use the calculateForecastedSavings tool to calculate the forecasted savings. Be sure to pass in all the information provided in the prompt.

  Financial Data:
  {{#each lastThreeMonthsData}}
  Month {{index}}:
    Income: ₹{{income}}
    Expenses: ₹{{expenses}}
    Credit Card Spending: ₹{{creditCardSpending}}
    {{#if overspendingCategories}}
    Overspending Categories: {{join overspendingCategories ", "}}
    {{/if}}
  {{/each}}
  `,
});

const savingsForecastFlow = ai.defineFlow(
  {
    name: 'savingsForecastFlow',
    inputSchema: SavingsForecastInputSchema,
    outputSchema: SavingsForecastOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

export async function forecastSavings(input: SavingsForecastInput): Promise<SavingsForecastOutput> {
  return savingsForecastFlow(input);
}
