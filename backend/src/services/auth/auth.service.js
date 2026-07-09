import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { AuthRepository } from '../../repositories/index.js'
import { config } from '../../shared/index.js'
import { DEFAULTS, AUTH } from '../../shared/index.js'

export class AuthService {
  static #generateAccessToken(user) {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: AUTH.ACCESS_TOKEN_EXPIRY }
    )
  }

  static #generateRefreshToken(user) {
    return jwt.sign(
      { id: user.id },
      config.jwtSecret,
      { expiresIn: AUTH.REFRESH_TOKEN_EXPIRY }
    )
  }

  static #cookieOptions() {
    return {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: 'strict',
      maxAge: AUTH.REFRESH_TOKEN_EXPIRY_MS,
      path: '/api/v1/auth',
    }
  }

  static async register({ name, email, password }) {
    const existing = await AuthRepository.findByEmail(email)
    if (existing) {
      const error = new Error('El email ya está registrado')
      error.status = 409
      throw error
    }

    const hashedPassword = await bcrypt.hash(password, DEFAULTS.SALT_ROUNDS)

    const user = await AuthRepository.create({
      name,
      email,
      password: hashedPassword,
    })

    const accessToken = this.#generateAccessToken(user)
    const refreshToken = this.#generateRefreshToken(user)

    return {
      accessToken,
      refreshToken,
      cookieOptions: this.#cookieOptions(),
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    }
  }

  static async login(email, password) {
    const user = await AuthRepository.findByEmail(email)
    if (!user) {
      const error = new Error('Email/contraseña inválidos')
      error.status = 401
      throw error
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      const error = new Error('Email/contraseña inválidos')
      error.status = 401
      throw error
    }

    const accessToken = this.#generateAccessToken(user)
    const refreshToken = this.#generateRefreshToken(user)

    return {
      accessToken,
      refreshToken,
      cookieOptions: this.#cookieOptions(),
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    }
  }

  static async refresh(token) {
    try {
      const payload = jwt.verify(token, config.jwtSecret)
      const user = await AuthRepository.findById(payload.id)
      if (!user) {
        const error = new Error('Usuario no encontrado')
        error.status = 401
        throw error
      }

      return {
        accessToken: this.#generateAccessToken(user),
        refreshToken: this.#generateRefreshToken(user),
        cookieOptions: this.#cookieOptions(),
      }
    } catch {
      const error = new Error('Refresh token inválido o expirado')
      error.status = 401
      throw error
    }
  }

  static async me(userId) {
    const user = await AuthRepository.findById(userId, {
      id: true, name: true, email: true, role: true, createdAt: true,
    })
    if (!user) {
      const error = new Error('Usuario no encontrado')
      error.status = 401
      throw error
    }
    return user
  }

  static clearCookieOptions() {
    return {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/api/v1/auth',
    }
  }
}
