import { getMetricsSchema } from '../../schemas/index.js'

export function validateGetMetrics(req, res, next) {
  const result = getMetricsSchema.safeParse(req.query)
  if (!result.success) {
    return res.status(400).json({
      error: 'Validation failed',
      details: result.error.issues.map(i => ({
        field: i.path.join('.'),
        message: i.message,
      })),
    })
  }

  next()
}
