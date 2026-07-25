import { createCompanySchema, updateCompanySchema } from '../../schemas/index.js'

export function validateCreateCompany(req, res, next) {
  const result = createCompanySchema.safeParse(req.body)
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

export function validateUpdateCompany(req, res, next) {
  const result = updateCompanySchema.safeParse(req.body)
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
