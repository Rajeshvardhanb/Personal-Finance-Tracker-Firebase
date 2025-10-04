import { z } from "zod";

export const NetWorthEntrySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  category: z.string().min(1, { message: "Please select a category." }),
  value: z.coerce.number().min(0, { message: "Value must be a positive number." }),
});

export type NetWorthEntryFormValues = z.infer<typeof NetWorthEntrySchema>;
