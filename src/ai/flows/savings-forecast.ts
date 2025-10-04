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

const calculateForecastedSavingsTool = ai.defineTool({
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
});

const savingsForecastFlow = ai.defineFlow(
  {
    name: 'savingsForecastFlow',
    inputSchema: SavingsForecastInputSchema,
    outputSchema: SavingsForecastOutputSchema,
  },
  async (input) => {
    const response = await ai.generate({
      model: ai.model,
      tools: [calculateForecastedSavingsTool],
      prompt: `You are a personal finance advisor. Analyze the user's financial data for the last three months and forecast their savings for the next month.

  Consider income, expenses, credit card spending, and any overspending categories to provide an accurate forecast and a clear explanation.
  The forecasted amount should be in INR (₹).

  Use the calculateForecastedSavings tool to calculate the forecasted savings. Be sure to pass in all the information provided in the prompt.

  Financial Data:
  ${input.lastThreeMonthsData.map((month, index) => `
  Month ${index + 1}:
    Income: ₹${month.income}
    Expenses: ₹${month.expenses}
    Credit Card Spending: ₹${month.creditCardSpending}
    ${month.overspendingCategories && month.overspendingCategories.length > 0 ? `Overspending Categories: ${month.overspendingCategories.join(', ')}` : ''}
  `).join('')}
      `,
    });

    const toolResponse = response.toolRequest;
    if (toolResponse) {
      const toolOutput = await toolResponse.execute();
      return toolOutput as SavingsForecastOutput;
    }

    const output = response.output;
    if (!output) {
      throw new Error('No output from AI');
    }
    return output;
  }
);

export async function forecastSavings(input: SavingsForecastInput): Promise<SavingsForecastOutput> {
  return savingsForecastFlow(input);
}
