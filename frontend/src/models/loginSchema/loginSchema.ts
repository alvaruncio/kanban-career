import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email({
    pattern: z.regexes.rfc5322Email,
    error: 'Email no válido',
  }).min(1, 'El correo es obligatorio'),
  password: z
    .string()
    .min(1, 'La contraseña es obligatoria')
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(128, 'La contraseña debe tener máximo 128 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos 1 mayúscula')
    .regex(/[a-z]/, 'Debe contener al menos 1 minúscula')
    .regex(/\d/, 'Debe contener al menos 1 número')
    .regex(/[^A-Za-z0-9]/, 'Debe contener al menos 1 símbolo'),
})

export type LoginFormData = z.infer<typeof loginSchema>
