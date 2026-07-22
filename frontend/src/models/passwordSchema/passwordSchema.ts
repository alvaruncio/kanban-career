import { z } from 'zod'

export const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'La contraseña actual es obligatoria'),
  newPassword: z.string()
    .min(8, 'Mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener 1 mayúscula')
    .regex(/[a-z]/, 'Debe contener 1 minúscula')
    .regex(/\d/, 'Debe contener 1 número')
    .regex(/[^A-Za-z0-9]/, 'Debe contener 1 símbolo'),
  confirmPassword: z.string().min(1, 'Debes confirmar la contraseña'),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
})

export type PasswordFormData = z.infer<typeof passwordSchema>
