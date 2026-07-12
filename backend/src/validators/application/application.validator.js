import { createApplicationSchema, updateApplicationSchema } from '../../schemas/index.js'

export function validateCreateApplication(req, res, next) {
  const result = createApplicationSchema.safeParse(req.body)
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

export function validateUpdateApplication(req, res, next) {
  const result = updateApplicationSchema.safeParse(req.body)
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