import express from 'express'
import cors from 'cors'
import { api } from './routes/index.js'
import { httpLogger } from './shared/index.js'

const app = express()

app.use(httpLogger)

/*

CORS CONFIGURACION

*/

app.use(cors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
    maxAge: 600
}))

/*

MIDDLEWARES

*/
app.use(express.json())


/*

RUTA BASE

*/

app.get('/', (_req, res) => {
  return res.status(200).json({
    message: 'Hello World'
  })
})


/*

HEALTH CHECK ENDPOINT

*/
app.get('/health', (_req, res) => {
  return res.status(200).json({
    status: 'ok',
    uptime: Math.floor(process.uptime()),
    timestamp: Date.now()
  })
})

/*

RUTAS

*/
app.use('/api/v1', api)


/*

MIDDLEWARES DE MANEJO DE ERRORES

*/

export const errorHandler = (err, req, res, _next) => {
  if (req.log) {
    req.log.error(err)
  } else {
    console.error(err.stack)
  }
  return res.status(err.status ?? 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  })
}

app.use(errorHandler)

export default app
