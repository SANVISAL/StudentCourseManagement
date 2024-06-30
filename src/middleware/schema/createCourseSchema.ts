import { z, ZodSchema } from 'zod';
// Define Zod schema for input validation
export const createCourseSchema: ZodSchema = z.object({
  Name: z.string().nonempty(),
  professorName: z.string().nonempty(),
  numberOfStudents: z.number().int().min(0),
  startDate: z.string().nonempty(),
  endDate: z.string().nonempty(),
}).strict();