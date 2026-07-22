import { z } from 'zod'

export const profileSchema = z.object({
  name: z.string().min(3, 'Mínimo 3 caracteres'),
  email: z.email({
    pattern: z.regexes.rfc5322Email,
    error: 'Email no válido',
  }),
  bio: z.string().max(500).optional().or(z.literal('')),
  linkedinUrl: z.url('URL no válida').optional().or(z.literal('')),
  website: z.url('URL no válida').optional().or(z.literal('')),
  phone: z.string().max(20).optional().or(z.literal('')),
})

export type ProfileFormData = z.infer<typeof profileSchema>
