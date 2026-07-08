import { Link, useNavigate } from 'react-router-dom'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useAuth } from '../../contexts'
import { useI18nStore } from '../../stores'
import { registerSchema, type RegisterFormData } from '../../models'
import { InputForm, PageMeta } from '../../components'

export default function RegisterPage() {
  const [serverError, setServerError] = useState('')
  const [passwordFocused, setPasswordFocused] = useState(false)
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const { t } = useI18nStore()

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  })

  const watchPassword = useWatch({ control, name: 'password' })
  const passwordValue = watchPassword ?? ''

  const requirements = [
    { key: 'minLength', test: (v: string) => v.length >= 8, label: t.register.passwordMinLength },
    { key: 'uppercase', test: (v: string) => /[A-Z]/.test(v), label: t.register.passwordUppercase },
    { key: 'lowercase', test: (v: string) => /[a-z]/.test(v), label: t.register.passwordLowercase },
    { key: 'number', test: (v: string) => /\d/.test(v), label: t.register.passwordNumber },
    { key: 'symbol', test: (v: string) => /[^A-Za-z0-9]/.test(v), label: t.register.passwordSymbol },
  ]

  const onSubmit = async (data: RegisterFormData) => {
    setServerError('')
    try {
      await registerUser(data.name, data.email, data.password, data.confirmPassword)
      navigate('/dashboard')
    } catch (err) {
      setServerError((err as Error).message)
    }
  }

  return (
    <>
      <PageMeta title="Crear cuenta" description="Regístrate en KanbanCareer y empieza a organizar tu búsqueda de empleo." />
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
          <InputForm
            name="name"
            control={control}
            label={t.register.name}
            placeholder={t.register.namePlaceholder}
            error={errors.name}
          />
          <InputForm
            name="email"
            control={control}
            label={t.register.email}
            type="email"
            placeholder={t.register.emailPlaceholder}
            error={errors.email}
          />
          <div className="flex flex-col gap-sm">
            <InputForm
              name="password"
              control={control}
              label={t.register.password}
              type="password"
              placeholder="••••••••"
              error={errors.password}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
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
          </div>
          <InputForm
            name="confirmPassword"
            control={control}
            label={t.register.confirmPassword}
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword}
          />
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