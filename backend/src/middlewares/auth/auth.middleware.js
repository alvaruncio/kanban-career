import jwt from 'jsonwebtoken'
import { config } from '../../shared/index.js'

export const requireAuth = (req, res, next) => {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token requerido' })
  }
  try {
    const token = header.split(' ')[1]
    req.user = jwt.verify(token, config.jwtSecret)
    next()
  } catch {
    return res.status(401).json({ error: 'Token inválido o expirado' })
  }
}

export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Acceso denegado' })
  }
  next()
}

export const requireSelfOrAdmin = (req, res, next) => {
  if (req.user?.role !== 'ADMIN' && req.user?.id !== Number(req.params.id)) {
    return res.status(403).json({ error: 'Acceso denegado' })
  }
  next()
}
