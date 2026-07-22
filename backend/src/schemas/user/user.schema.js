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

export const updateProfileSchema = z.object({
  name: z.string().trim().min(RULES.NAME.MIN_LENGTH, `Mínimo ${RULES.NAME.MIN_LENGTH} caracteres`).optional(),
  email: z.email({
    pattern: z.regexes.rfc5322Email,
    error: 'Email no válido',
  }).optional(),
  avatar_url: z.string().url('URL no válida').optional().or(z.literal('')),
  bio: z.string().max(500, 'Máximo 500 caracteres').optional(),
  linkedin_url: z.string().url('URL no válida').optional().or(z.literal('')),
  website: z.string().url('URL no válida').optional().or(z.literal('')),
  phone: z.string().max(20, 'Máximo 20 caracteres').optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: 'Debe enviar al menos un campo para actualizar',
})

export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'La contraseña actual es obligatoria'),
  newPassword: z.string()
    .min(RULES.PASSWORD.MIN_LENGTH, `Mínimo ${RULES.PASSWORD.MIN_LENGTH} caracteres`)
    .regex(/[A-Z]/, 'Debe contener 1 mayúscula')
    .regex(/[a-z]/, 'Debe contener 1 minúscula')
    .regex(/\d/, 'Debe contener 1 número')
    .regex(/[^A-Za-z0-9]/, 'Debe contener 1 símbolo'),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
}).transform(({ confirmPassword, ...rest }) => rest)
