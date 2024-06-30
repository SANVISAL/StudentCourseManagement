import { z, ZodSchema } from "zod";

export const createStudentSchema: ZodSchema = z
  .object({
    fullNameEn: z.string().nonempty(),
    fullNameKh: z.string().nonempty(),
    dateOfBirth: z.string().nonempty(), // Consider using z.date() if date format needs validation
    gender: z.enum(["Male", "Female"]),
    phoneNumber: z.string().nonempty(), // Consider using z.string().regex() if specific phone format validation is needed
  })
  .strict();
