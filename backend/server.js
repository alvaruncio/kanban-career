import { config } from './src/shared/index.js'
import app from './src/app.js'

const server = app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
})

const shutdown = (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`)
  server.close(() => {
    console.log('Server closed')
    process.exit(0)
  })
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))
