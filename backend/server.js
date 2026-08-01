import { config, logger } from './src/shared/index.js'
import app from './src/app.js'

const server = app.listen(config.port, () => {
  logger.info({ port: config.port }, 'Server started')
})

const shutdown = (signal) => {
  logger.info({ signal }, 'Shutdown signal received — closing server')
  server.close(() => {
    logger.info('Server closed')
    process.exit(0)
  })
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))
