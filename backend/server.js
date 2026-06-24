import app from './src/app.js'

process.loadEnvFile("../.env")

const PORT = process.env.PORT ?? 3000

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
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
