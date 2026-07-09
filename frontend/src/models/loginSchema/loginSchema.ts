import { z } from 'zod/v4'

export const loginSchema = z.object({
  email: z.email({ pattern: z.regexes.rfc5322Email }),
  password: z.string().min(1),
})

export type LoginFormData = z.infer<typeof loginSchema>
