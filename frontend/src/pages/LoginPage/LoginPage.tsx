import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useAuth } from '../../contexts'
import { useI18nStore } from '../../stores'
import { usePageMeta } from '../../hooks'
import { loginSchema, type LoginFormData } from '../../models'
import { InputForm } from '../../components'

export default function LoginPage() {
  const pageMeta = usePageMeta('Iniciar sesión', 'Accede a tu cuenta de KanbanCareer para gestionar tus candidaturas.')
  const [serverError, setServerError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()
  const { t } = useI18nStore()

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
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
    <>
      {pageMeta}
      <div className="min-h-screen flex items-center justify-center bg-surface px-gutter">
      <div className="w-full max-w-[28rem] bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-md">
        <div className="text-center mb-lg">
          <h1 className="font-headline-md text-headline-md text-on-surface mb-1">{t.login.title}</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">{t.login.subtitle}</p>
        </div>

        {serverError && (
          <div className="bg-error-container text-on-error-container font-body-sm text-body-sm p-sm rounded-lg mb-md" role="alert">
            {serverError}
          </div>
        )}

        <form className="flex flex-col gap-md" onSubmit={handleSubmit(onSubmit)} noValidate>
          <InputForm
            name="email"
            control={control}
            label={t.login.email}
            type="email"
            placeholder={t.login.emailPlaceholder}
            error={errors.email}
          />
          <InputForm
            name="password"
            control={control}
            label={t.login.password}
            type="password"
            placeholder="••••••••"
            error={errors.password}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-on-primary font-label-md text-label-md px-6 py-3 rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? t.login.submitting : t.login.submit}
          </button>
        </form>

        <p className="font-body-sm text-body-sm text-on-surface-variant text-center mt-md">
          {t.login.noAccount}{' '}
          <Link to="/register" className="text-primary hover:underline">{t.login.register}</Link>
        </p>
      </div>
    </div>
    </>
  )
}