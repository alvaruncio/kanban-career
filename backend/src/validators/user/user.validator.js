import { REGEX, RULES } from '../../shared/regex.js'

export function validateCreateUser(req, res, next) {
  const errors = []

  const name = req.body.name?.trim()
  const email = req.body.email?.trim()
  const password = req.body.password?.trim()

  if (!name || typeof name !== 'string' || name.length < RULES.NAME.MIN_LENGTH) {
    errors.push(`Name debe tener al menos ${RULES.NAME.MIN_LENGTH} caracteres`)
  }

  if (!email || typeof email !== 'string' || !REGEX.EMAIL.test(email)) {
    errors.push('Email no es válido')
  }

  if (!password || typeof password !== 'string' || password.length < RULES.PASSWORD.MIN_LENGTH) {
    errors.push(`Password debe tener al menos ${RULES.PASSWORD.MIN_LENGTH} caracteres`)
  } else {
    for (const rule of RULES.PASSWORD.COMPLEXITY) {
      if (!rule.regex.test(password)) {
        errors.push(`Password debe contener al menos ${rule.message}`)
      }
    }
  }

  const confirmPassword = req.body.confirmPassword?.trim()

  if (!confirmPassword || typeof confirmPassword !== 'string') {
    errors.push('Debes confirmar la contraseña')
  } else if (password !== confirmPassword) {
    errors.push('Las contraseñas no coinciden')
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validation failed', details: errors })
  }

  req.body.name = name
  req.body.email = email
  req.body.password = password

  next()
}
