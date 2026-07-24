import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useI18nStore } from '../../stores'
import { ProfileService } from '../../services'
import { useAuth } from '../../contexts'
import { InputForm, PageMeta, LoadingSkeleton, ProfileField, PhoneForm } from '../../components'
import { profileSchema, passwordSchema } from '../../models'
import type { ProfileFormData, PasswordFormData } from '../../models'
import type { User } from '../../interfaces'

const DEFAULT_AVATAR_URL = 'https://www.svgrepo.com/svg/335455/profile-default'

export default function ProfilePage() {
  const { t } = useI18nStore()
  const { user: authUser, loading: authLoading, refreshUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showAvatarFallback, setShowAvatarFallback] = useState(false)
  const avatarImgRef = useRef<HTMLImageElement>(null)

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
      bio: '',
      linkedin_url: '',
      website: '',
      phone: '',
      avatar_url: '',
    },
  })

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  useEffect(() => {
    if (authUser) {
      profileForm.reset({
        name: authUser.name,
        email: authUser.email,
        bio: authUser.bio ?? '',
        linkedin_url: authUser.linkedinUrl ?? '',
        website: authUser.website ?? '',
        phone: authUser.phone ?? '',
        avatar_url: authUser.avatarUrl ?? '',
      })
    }
  }, [authUser, profileForm])

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [errorMessage])

  if (authLoading) return <LoadingSkeleton />

  const user: User | null = authUser

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="font-body-md text-body-md text-error">{t.common.loading}</p>
      </div>
    )
  }

  const handleEdit = () => {
    setShowAvatarFallback(false)
    profileForm.reset({
      name: user.name,
      email: user.email,
      bio: user.bio ?? '',
      linkedin_url: user.linkedinUrl ?? '',
      website: user.website ?? '',
      phone: user.phone ?? '',
      avatar_url: user.avatarUrl ?? '',
    })
    setIsEditing(true)
    setSuccessMessage(null)
    setErrorMessage(null)
  }

  const handleCancel = () => {
      profileForm.reset({
        name: user.name,
        email: user.email,
        bio: user.bio ?? '',
        linkedin_url: user.linkedinUrl ?? '',
        website: user.website ?? '',
        phone: user.phone ?? '',
        avatar_url: user.avatarUrl ?? '',
      })
      setIsEditing(false)
      setSuccessMessage(null)
      setErrorMessage(null)
    }

    const handleProfileSubmit = async (data: ProfileFormData) => {
      setSaving(true)
      setSuccessMessage(null)
      setErrorMessage(null)
      try {
        await ProfileService.updateProfile(data)
        // Refresh global auth user so the component re-renders with updated data
        await refreshUser()
        setSuccessMessage(t.profile.profileSaved)
        setIsEditing(false)
        setShowAvatarFallback(false)
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordSubmit = async (data: PasswordFormData) => {
    setChangingPassword(true)
    setSuccessMessage(null)
    setErrorMessage(null)
    try {
      const algo = await ProfileService.updatePassword(data)
      console.log(algo)
      setSuccessMessage(t.profile.passwordSuccess)
      passwordForm.reset()
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Error al cambiar contraseña')
    } finally {
      setChangingPassword(false)
    }
  }

  return (
    <>
      <PageMeta title={t.profile.title} description={t.profile.subtitle} />
      <div className="max-w-5xl w-full mx-auto px-6 space-y-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface">{t.profile.title}</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">{t.profile.subtitle}</p>
          </div>
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 bg-primary text-on-primary font-label-md text-label-md px-4 py-2 rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm active:scale-95"
            >
              <span className="material-symbols-outlined text-lg">edit</span>
              {t.profile.edit}
            </button>
          )}
        </div>

        {successMessage && (
          <div className="bg-secondary-container text-secondary font-body-md text-body-md px-lg py-md rounded-lg" role="alert">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="bg-error-container text-error font-body-md text-body-md px-lg py-md rounded-lg" role="alert">
            {errorMessage}
          </div>
        )}

        {isEditing ? (
          <form noValidate onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg space-y-md">
            <InputForm
              name="name"
              control={profileForm.control}
              label={t.profile.name}
              error={profileForm.formState.errors.name}
            />
            <InputForm
              name="email"
              control={profileForm.control}
              label={t.profile.email}
              type="email"
              error={profileForm.formState.errors.email}
            />
            <InputForm
              name="bio"
              control={profileForm.control}
              label={t.profile.bio}
              placeholder={t.profile.bioPlaceholder}
              error={profileForm.formState.errors.bio}
            />
            <InputForm
              name="linkedin_url"
              control={profileForm.control}
              label={t.profile.linkedinUrl}
              error={profileForm.formState.errors.linkedin_url}
            />
            <InputForm
              name="website"
              control={profileForm.control}
              label={t.profile.website}
              placeholder="https://..."
              error={profileForm.formState.errors.website}
            />
            <PhoneForm
              name="phone"
              control={profileForm.control}
              label={t.profile.phone}
              error={profileForm.formState.errors.phone}
            />
            <InputForm
              name="avatar_url"
              control={profileForm.control}
              label={t.profile.avatarUrl}
              placeholder="https://..."
              error={profileForm.formState.errors.avatar_url}
            />
            <div className="flex items-center gap-md pt-sm">
              <button
                type="submit"
                disabled={saving}
className="bg-primary text-on-primary font-label-md text-label-md px-4 py-2 rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm active:scale-95 disabled:opacity-50"
              >
                {saving ? t.profile.saving : t.profile.save}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className="font-label-md text-label-md text-on-surface-variant border border-outline-variant rounded-lg px-4 py-2 hover:bg-surface-container-low transition-colors active:scale-95 disabled:opacity-50"
              >
                {t.profile.cancel}
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg space-y-lg">
            <div className="flex mb-lg">
              {showAvatarFallback ? (
                <div className="w-24 h-24 rounded-full bg-surface-container-high flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant">person</span>
                </div>
              ) : (
                <img
                  ref={avatarImgRef}
                  src={user.avatarUrl || DEFAULT_AVATAR_URL}
                  alt={t.profile.avatarFallbackText}
                  className="w-24 h-24 rounded-full object-cover"
                  onError={() => {
                    const img = avatarImgRef.current
                    if (!img) return
                    if (img.src !== DEFAULT_AVATAR_URL) {
                      img.src = DEFAULT_AVATAR_URL
                    } else {
                      setShowAvatarFallback(true)
                    }
                  }}
                />
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg items-start">
              <ProfileField label={t.profile.name} value={user.name} />
              <ProfileField label={t.profile.email} value={user.email} />
              <ProfileField label={t.profile.bio} value={user.bio} />
              <ProfileField label={t.profile.linkedinUrl} value={user.linkedinUrl} />
              <ProfileField label={t.profile.website} value={user.website} />
              <ProfileField label={t.profile.phone} value={user.phone} />
            </div>
          </div>
        )}

        {/* Password change section — always editable */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-md">{t.profile.passwordSection}</h2>
          <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-md">
            <InputForm
              name="currentPassword"
              control={passwordForm.control}
              label={t.profile.currentPassword}
              type="password"
              error={passwordForm.formState.errors.currentPassword}
            />
            <InputForm
              name="newPassword"
              control={passwordForm.control}
              label={t.profile.newPassword}
              type="password"
              error={passwordForm.formState.errors.newPassword}
            />
            <InputForm
              name="confirmPassword"
              control={passwordForm.control}
              label={t.profile.confirmPassword}
              type="password"
              error={passwordForm.formState.errors.confirmPassword}
            />
            <button
              type="submit"
              disabled={changingPassword}
              className="bg-primary text-on-primary font-label-md text-label-md px-4 py-2 rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm active:scale-95 disabled:opacity-50"
            >
              {changingPassword ? t.profile.changingPassword : t.profile.changePassword}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
