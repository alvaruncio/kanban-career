export interface User {
  id: number
  email: string
  name: string
  role: 'USER' | 'ADMIN'
  createdAt: string
  avatarUrl?: string
  bio?: string
  linkedinUrl?: string
  website?: string
  phone?: string
}

export interface LoginFormData {
  email: string
  password: string
}


