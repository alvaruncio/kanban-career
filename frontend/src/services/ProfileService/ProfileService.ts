import { api } from '../api/api'
import type { User } from '../../interfaces'

export interface ProfileUpdateData {
  name?: string
  email?: string
  bio?: string
  avatar_url?: string
  linkedin_url?: string
  website?: string
  phone?: string
}

export interface PasswordUpdateData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export class ProfileService {
  static async updateProfile(data: ProfileUpdateData): Promise<{ user: User }> {
    return api.patch<{ user: User }>('/auth/me', data)
  }

  static async updatePassword(data: PasswordUpdateData): Promise<{ user: User }> {
    return api.patch<{ user: User }>('/auth/me', data)
  }
}
