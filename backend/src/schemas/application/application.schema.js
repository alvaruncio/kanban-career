import { z } from 'zod'

const applicationSchema = z.object({
  jobTitle: z.string().min(1, 'El título del trabajo es obligatorio'),
  offerUrl: z.url('URL no válida'),
  companyId: z.string().min(1, 'La compañía es obligatoria'),
  category: z.enum(['FRONTEND', 'BACKEND', 'FULL_STACK'], { error: 'Categoría no válida' }),
  source: z.enum(
    ['LINKEDIN', 'INFOJOBS', 'INDEED', 'TECNOEMPLEO', 'COMPANY_WEBSITE', 'REFERRAL', 'OTHER'],
    { error: 'Fuente no válida' },
  ),
  applicationDate: z.string().min(1, 'La fecha de aplicación es obligatoria').transform(d => new Date(d)),
  jobDescription: z.string().optional(),
  notes: z.string().optional(),
})

export const createApplicationSchema = applicationSchema

export const updateApplicationSchema = applicationSchema.extend({
  status: z.enum(['APPLIED', 'INTERVIEW', 'OFFER', 'HIRED', 'REJECTED'], { error: 'Estado no válido' }),
}).partial()