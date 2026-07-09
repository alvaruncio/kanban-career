import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

try {
  process.loadEnvFile(resolve(__dirname, '../../../../.env'))
} catch {
  // .env no encontrado; puede que las variables vía entorno (Docker)
}

export const config = {
  port: Number(process.env.PORT) || 3000,
  jwtSecret: process.env.JWT_SECRET || 'default-secret-change-in-production',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://kanbancareer:kanbancareer@localhost:5432/kanbancareer',
}
