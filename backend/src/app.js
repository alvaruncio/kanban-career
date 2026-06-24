import express from 'express'

const app = express()

app.use(express.json())

app.get("/", (_req, res) => {
  return res.status(200).json({
    message: "Hello World"
  })
})

app.get('/health', (_req, res) => {
  return res.status(200).json({ 
    status: 'ok', 
    uptime: Math.floor(process.uptime()), 
    timestamp: Date.now()
  })
})

app.use((err, _req, res, _next) => {
  console.error(err.stack)
  return res.status(err.status ?? 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  })
})

export default app
