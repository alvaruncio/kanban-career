import pinoHttp from 'pino-http'
import { logger } from './logger.js'

export const httpLogger = pinoHttp({
  logger,
  customLogLevel: function (req, res, _err) {
    if (res.statusCode >= 500) return 'error'
    if (res.statusCode >= 400) return 'warn'
    return 'info'
  },
  serializers: {
    req(req) {
      return { method: req.method, url: req.url }
    },
    res(res) {
      return { statusCode: res.statusCode }
    },
  },
})
