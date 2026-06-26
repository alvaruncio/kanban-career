const EMAIL_REGEX = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

const PASSWORD_MIN_LENGTH = 8
const PASSWORD_RULES = [
  { test: /[A-Z]/, message: '1 mayúscula' },
  { test: /[a-z]/, message: '1 minúscula' },
  { test: /[0-9]/, message: '1 número' },
  { test: /[^A-Za-z0-9]/, message: '1 símbolo' },
]

export function validateCreateUser(req, res, next) {
  const errors = []

  const name = req.body.name?.trim()
  const email = req.body.email?.trim()
  const password = req.body.password?.trim()

  if (!name || typeof name !== 'string' || name.length < 3) {
    errors.push('Name debe tener al menos 3 caracteres')
  }

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email)) {
    errors.push('Email no es válido')
  }

  if (!password || typeof password !== 'string' || password.length < PASSWORD_MIN_LENGTH) {
    errors.push(`Password debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres`)
  } else {
    for (const rule of PASSWORD_RULES) {
      if (!rule.test(password)) {
        errors.push(`Password debe contener al menos ${rule.message}`)
      }
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validation failed', details: errors })
  }

  req.body.name = name
  req.body.email = email
  req.body.password = password

  next()
}
