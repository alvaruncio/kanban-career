import { z } from 'zod'
import { isValidPhoneNumber } from 'libphonenumber-js'

export const profileSchema = z.object({
  name: z.string().min(3, 'Mínimo 3 caracteres'),
  email: z.email({
    pattern: z.regexes.rfc5322Email,
    error: 'Email no válido',
  }),
  bio: z.string().max(500).optional().or(z.literal('')),
  linkedin_url: z.url('URL no válida').optional().or(z.literal('')),
  website: z.url('URL no válida').optional().or(z.literal('')),
  phone: z.string().refine(
    (v) => v === '' || isValidPhoneNumber(v),
    'Teléfono no válido',
  ).optional().or(z.literal('')),
  avatar_url: z.url('URL no válida').optional().or(z.literal('')),
})

export type ProfileFormData = z.infer<typeof profileSchema>
