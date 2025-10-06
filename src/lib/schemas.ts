
import { z } from "zod";

export const NetWorthEntrySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  category: z.string().min(1, { message: "Please select a category." }),
  value: z.coerce.number().min(0, { message: "Value must be a positive number." }),
});

export type NetWorthEntryFormValues = z.infer<typeof NetWorthEntrySchema>;


export const IncomeSchema = z.object({
    id: z.string().optional(),
    source: z.string().min(2, { message: "Source is required." }),
    expectedAmount: z.coerce.number().min(1, { message: "Expected amount is required." }),
    creditedAmount: z.coerce.number().min(0, { message: "Credited amount is required." }),
    date: z.date({ required_error: "Please select a date."}),
    status: z.enum(["Credited", "Not Credited"]),
    isRecurring: z.boolean().default(false),
});
export type IncomeFormValues = z.infer<typeof IncomeSchema>;


export const ExpenseSchema = z.object({
    id: z.string().optional(),
    description: z.string().min(2, { message: "Description is required." }),
    amount: z.coerce.number().min(1, { message: "Amount is required." }),
    dueDate: z.date({ required_error: "Please select a date."}),
    status: z.enum(["Paid", "Not Paid"]),
    isRecurring: z.boolean().default(false),
    category: z.string().min(1, { message: "Please select a category." }),
});
export type ExpenseFormValues = z.infer<typeof ExpenseSchema>;


export const CreditCardSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(2, { message: "Card name is required." }),
    creditLimit: z.coerce.number().min(1, { message: "Credit limit is required." }),
    upcomingBillDueDate: z.date({ required_error: "Please select a date."}),
});
export type CreditCardFormValues = z.infer<typeof CreditCardSchema>;

export const CreditCardTransactionSchema = z.object({
    id: z.string().optional(),
    description: z.string().min(2, { message: "Description is required." }),
    amount: z.coerce.number().min(1, { message: "Amount must be greater than 0." }),
    date: z.date({ required_error: "Please select a date." }),
    masterExpenseId: z.string().optional(),
});

export type CreditCardTransactionFormValues = z.infer<typeof CreditCardTransactionSchema>;


export const MasterExpenseSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(2, { message: "Name is required." }),
});
export type MasterExpenseFormValues = z.infer<typeof MasterExpenseSchema>;

export const MasterExpenseTransactionSchema = z.object({
    id: z.string().optional(),
    description: z.string().min(2, { message: "Description is required." }),
    amount: z.coerce.number().min(1, { message: "Amount must be greater than 0." }),
    date: z.date({ required_error: "Please select a date." }),
    status: z.enum(["Paid", "Not Paid"]),
});

export type MasterExpenseTransactionFormValues = z.infer<typeof MasterExpenseTransactionSchema>;
