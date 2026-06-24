import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '../stores/authStore'
import { useState } from 'react'
import type { LoginFormData } from '../interfaces/auth'

export default function LoginPage() {
  const [serverError, setServerError] = useState('')
  const login = useAuthStore(state => state.login)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data: LoginFormData) => {
    setServerError('')
    try {
      await login(data.email, data.password)
      navigate('/dashboard')
    } catch (err) {
      setServerError((err as Error).message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-gutter">
      <div className="w-full max-w-[28rem] bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-md">
        <div className="text-center mb-lg">
          <h1 className="font-headline-md text-headline-md text-on-surface mb-1">Iniciar sesión</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Accede a tu cuenta de KanbanCareer</p>
        </div>

        {serverError && (
          <div className="bg-error-container text-on-error-container font-body-sm text-body-sm p-sm rounded-lg mb-md" role="alert">
            {serverError}
          </div>
        )}

        <form className="flex flex-col gap-md" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="flex flex-col gap-sm">
            <label className="font-label-md text-label-md text-on-surface" htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="tu@email.com"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
              {...register('email', { required: 'El correo es obligatorio' })}
            />
            {errors.email && (
              <p id="email-error" className="font-body-sm text-body-sm text-error" role="alert">{errors.email.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-sm">
            <label className="font-label-md text-label-md text-on-surface" htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="••••••••"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-error' : undefined}
              {...register('password', { required: 'La contraseña es obligatoria' })}
            />
            {errors.password && (
              <p id="password-error" className="font-body-sm text-body-sm text-error" role="alert">{errors.password.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-on-primary font-label-md text-label-md px-6 py-3 rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Iniciando sesión…' : 'Iniciar sesión'}
          </button>
        </form>

        <p className="font-body-sm text-body-sm text-on-surface-variant text-center mt-md">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-primary hover:underline">Regístrate</Link>
        </p>
      </div>
    </div>
  )
}
