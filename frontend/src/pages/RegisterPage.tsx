import { Link, useNavigate } from 'react-router-dom'
import { useForm, useWatch } from 'react-hook-form'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useI18nStore } from '../stores/i18nStore'
import { usePageMeta } from '../hooks/usePageMeta'
import type { RegisterFormData } from '../interfaces/auth'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function RegisterPage() {
  const pageMeta = usePageMeta('Crear cuenta', 'Regístrate en KanbanCareer y empieza a organizar tu búsqueda de empleo.')
  const [serverError, setServerError] = useState('')
  const [passwordFocused, setPasswordFocused] = useState(false)
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const { t } = useI18nStore()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    mode: 'onTouched',
    defaultValues: { name: '', email: '', password: '' },
  })

  const watchPassword = useWatch({ control, name: 'password' })
  const passwordValue = watchPassword ?? ''

  const requirements = [
    { key: 'minLength', test: (v: string) => v.length >= 8, label: t.register.passwordMinLength },
    { key: 'uppercase', test: (v: string) => /[A-Z]/.test(v), label: t.register.passwordUppercase },
    { key: 'lowercase', test: (v: string) => /[a-z]/.test(v), label: t.register.passwordLowercase },
    { key: 'number', test: (v: string) => /[0-9]/.test(v), label: t.register.passwordNumber },
    { key: 'symbol', test: (v: string) => /[^A-Za-z0-9]/.test(v), label: t.register.passwordSymbol },
  ]

  const onSubmit = async (data: RegisterFormData) => {
    setServerError('')
    try {
      await registerUser(data.name, data.email, data.password)
      navigate('/dashboard')
    } catch (err) {
      setServerError((err as Error).message)
    }
  }

  return (
    <>
      {pageMeta}
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
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
              {...register('name', {
                validate: (value: string) => {
                  if (!value || value.trim().length < 3) return t.register.nameMinLength
                  return undefined
                },
              })}
            />
            {errors.name && (
              <p id="name-error" className="font-body-sm text-body-sm text-error" role="alert">{errors.name.message}</p>
            )}
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
              {...register('email', {
                required: t.register.emailRequired,
                pattern: { value: EMAIL_REGEX, message: t.register.emailInvalid },
              })}
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
              onFocus={() => setPasswordFocused(true)}
              {...register('password', {
                required: t.register.passwordRequired,
                minLength: { value: 8, message: t.register.passwordMinLength },
                onBlur: () => setPasswordFocused(false),
                validate: (value: string) => {
                  if (!/[A-Z]/.test(value)) return t.register.passwordUppercase
                  if (!/[a-z]/.test(value)) return t.register.passwordLowercase
                  if (!/[0-9]/.test(value)) return t.register.passwordNumber
                  if (!/[^A-Za-z0-9]/.test(value)) return t.register.passwordSymbol
                  return undefined
                },
              })}
            />
            {passwordFocused && (
              <div className="p-sm border border-outline-variant rounded-lg bg-surface-container-lowest shadow-md space-y-1">
                {requirements.map(req => {
                  const met = req.test(passwordValue)
                  return (
                    <div key={req.key} className="flex items-center gap-1.5 font-body-sm text-body-sm">
                      <span className={met ? 'text-secondary' : 'text-error'}>{met ? '✓' : '✗'}</span>
                      <span className={met ? 'text-secondary' : 'text-error'}>{req.label}</span>
                    </div>
                  )
                })}
              </div>
            )}
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
    </>
  )
}
