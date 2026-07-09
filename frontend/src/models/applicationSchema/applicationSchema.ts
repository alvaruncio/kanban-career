import { z } from 'zod/v4'
import { APPLICATION_CATEGORY, APPLICATION_SOURCE } from '../../interfaces'
import type { ApplicationCategory, ApplicationSource } from '../../interfaces'

const categoryValues = Object.values(APPLICATION_CATEGORY) as [ApplicationCategory, ...ApplicationCategory[]]
const sourceValues = Object.values(APPLICATION_SOURCE) as [ApplicationSource, ...ApplicationSource[]]

export const applicationSchema = z.object({
  jobTitle: z.string().min(1, 'El título del trabajo es obligatorio'),
  companyId: z.string().min(1, 'La compañía es obligatoria'),
  offerUrl: z.url('URL no válida').min(1, 'La URL de la oferta es obligatoria'),
  category: z.enum(categoryValues, { error: 'Selecciona una categoría' }),
  source: z.enum(sourceValues, { error: 'Selecciona una fuente' }),
  applicationDate: z.string().min(1, 'La fecha de aplicación es obligatoria'),
  jobDescription: z.string().optional(),
  notes: z.string().optional(),
})

export type ApplicationFormData = z.infer<typeof applicationSchema>