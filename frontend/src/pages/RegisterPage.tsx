import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '../stores/authStore'
import { useState } from 'react'
import { useI18nStore } from '../stores/i18nStore'
import type { RegisterFormData } from '../interfaces/auth'

export default function RegisterPage() {
  const [serverError, setServerError] = useState('')
  const registerUser = useAuthStore(state => state.register)
  const navigate = useNavigate()
  const { t } = useI18nStore()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    defaultValues: { name: '', email: '', password: '' },
  })

  const onSubmit = async (data: RegisterFormData) => {
    setServerError('')
    try {
      await registerUser(data.email, data.password, data.name || undefined)
      navigate('/dashboard')
    } catch (err) {
      setServerError((err as Error).message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-gutter">
      <div className="w-full max-w-[28rem] bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-md">
        <div className="text-center mb-lg">
          <h1 className="font-headline-md text-headline-md text-on-surface mb-1">{t.register.title}</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">{t.register.subtitle}</p>
        </div>

        {serverError && (
          <div className="bg-error-container text-on-error-container font-body-sm text-body-sm p-sm rounded-lg mb-md" role="alert">
            {serverError}
          </div>
        )}

        <form className="flex flex-col gap-md" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="flex flex-col gap-sm">
            <label className="font-label-md text-label-md text-on-surface" htmlFor="name">{t.register.name}</label>
            <input
              id="name"
              type="text"
              className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder={t.register.namePlaceholder}
              {...register('name')}
            />
          </div>
          <div className="flex flex-col gap-sm">
            <label className="font-label-md text-label-md text-on-surface" htmlFor="email">{t.register.email}</label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder={t.register.emailPlaceholder}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
              {...register('email', { required: t.register.emailRequired })}
            />
            {errors.email && (
              <p id="email-error" className="font-body-sm text-body-sm text-error" role="alert">{errors.email.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-sm">
            <label className="font-label-md text-label-md text-on-surface" htmlFor="password">{t.register.password}</label>
            <input
              id="password"
              type="password"
              className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="••••••••"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-error' : undefined}
              {...register('password', {
                required: t.register.passwordRequired,
                minLength: { value: 8, message: t.register.passwordMinLength },
              })}
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
            {isSubmitting ? t.register.submitting : t.register.submit}
          </button>
        </form>

        <p className="font-body-sm text-body-sm text-on-surface-variant text-center mt-md">
          {t.register.hasAccount}{' '}
          <Link to="/login" className="text-primary hover:underline">{t.register.login}</Link>
        </p>
      </div>
    </div>
  )
}
