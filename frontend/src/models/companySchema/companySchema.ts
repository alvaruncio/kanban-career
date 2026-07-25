import { z } from 'zod/v4'

export const companySchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  website: z.string().url('URL no válida').optional().or(z.literal('')),
  linkedinUrl: z.string().url('URL no válida').optional().or(z.literal('')),
  description: z.string().optional(),
})

export type CompanyFormData = z.infer<typeof companySchema>
