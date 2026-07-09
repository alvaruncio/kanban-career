import { z } from 'zod'
import { RULES } from '../../shared/index.js'

export const createUserSchema = z.object({
  name: z.string().trim().min(RULES.NAME.MIN_LENGTH, `Mínimo ${RULES.NAME.MIN_LENGTH} caracteres`),
  email: z.email({
    pattern: z.regexes.rfc5322Email,
    error: 'Email no válido',
  }).min(1, 'El correo es obligatorio'),
  password: z.string()
    .min(RULES.PASSWORD.MIN_LENGTH, `Mínimo ${RULES.PASSWORD.MIN_LENGTH} caracteres`)
    .regex(/[A-Z]/, 'Debe contener 1 mayúscula')
    .regex(/[a-z]/, 'Debe contener 1 minúscula')
    .regex(/\d/, 'Debe contener 1 número')
    .regex(/[^A-Za-z0-9]/, 'Debe contener 1 símbolo'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
}).transform(({ confirmPassword, ...rest }) => rest)
