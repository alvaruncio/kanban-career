import { AuthService } from '../../services/index.js'

export class AuthController {
  static async register(req, res) {
    req.log?.info?.({ event: 'auth:register:start', email: req.body.email })
    const result = await AuthService.register(req.body)
    req.log?.info?.({ event: 'auth:register:complete', userId: result.user.id })
    res.cookie('refreshToken', result.refreshToken, result.cookieOptions)
    return res.status(201).json({
      accessToken: result.accessToken,
      user: result.user,
    })
  }

  static async login(req, res) {
    const { email, password } = req.body
    req.log?.info?.({ event: 'auth:login:attempt', email })
    const result = await AuthService.login(email, password)
    res.cookie('refreshToken', result.refreshToken, result.cookieOptions)
    return res.json({
      accessToken: result.accessToken,
      user: result.user,
    })
  }

  static async refresh(req, res) {
    const refreshToken = req.cookies?.refreshToken
    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token no encontrado' })
    }

    const result = await AuthService.refresh(refreshToken)
    res.cookie('refreshToken', result.refreshToken, result.cookieOptions)
    return res.json({ accessToken: result.accessToken })
  }

  static async me(req, res) {
    const user = await AuthService.me(req.user.id)
    return res.json({ user })
  }

  static async updateProfile(req, res) {
    const user = req.isPasswordUpdate
      ? await AuthService.updatePassword(req.user.id, req.body)
      : await AuthService.updateProfile(req.user.id, req.body)
    return res.json({ user })
  }

  static async logout(_req, res) {
    res.cookie('refreshToken', '', AuthService.clearCookieOptions())
    return res.json({ message: 'Sesión cerrada' })
  }
}
