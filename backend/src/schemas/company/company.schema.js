import { z } from 'zod'

export const createCompanySchema = z.object({
  name: z.string().trim().min(1, 'El nombre de la compañía es obligatorio'),
  website: z.string().url('URL no válida').optional().or(z.literal('')),
  description: z.string().trim().optional(),
  linkedinUrl: z.string().url('URL no válida').optional().or(z.literal('')),
})
