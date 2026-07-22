import { createUserSchema, updateProfileSchema, updatePasswordSchema } from '../../schemas/index.js'

export function validateCreateUser(req, res, next) {
  const result = createUserSchema.safeParse(req.body)
  if (!result.success) {
    return res.status(400).json({
      error: 'Validation failed',
      details: result.error.issues.map(i => ({
        field: i.path.join('.'),
        message: i.message,
      })),
    })
  }

  req.body = result.data
  next()
}

export function validateUpdateMe(req, res, next) {
  const hasPasswordData = 'currentPassword' in req.body

  const schema = hasPasswordData ? updatePasswordSchema : updateProfileSchema
  const result = schema.safeParse(req.body)

  if (!result.success) {
    return res.status(400).json({
      error: 'Validation failed',
      details: result.error.issues.map(i => ({
        field: i.path.join('.'),
        message: i.message,
      })),
    })
  }

  req.body = result.data
  req.isPasswordUpdate = hasPasswordData
  next()
}
