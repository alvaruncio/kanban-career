import express from 'express'
import cors from 'cors'
import { api } from './routes/index.js'

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    maxAge: 600
}))

app.use(express.json())

app.get('/', (_req, res) => {
  return res.status(200).json({
    message: 'Hello World'
  })
})

app.get('/health', (_req, res) => {
  return res.status(200).json({
    status: 'ok',
    uptime: Math.floor(process.uptime()),
    timestamp: Date.now()
  })
})

app.use('/api/v1', api)

app.use((err, _req, res, _next) => {
  console.error(err.stack)
  return res.status(err.status ?? 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  })
})

export default app
