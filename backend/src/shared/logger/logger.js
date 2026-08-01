import { mkdirSync } from 'node:fs'
import pino from 'pino'
import { config } from '../config/config.js'

const PINO_LEVELS = ['fatal', 'error', 'warn', 'info', 'debug', 'trace']

const level = PINO_LEVELS.includes(config.logLevel) ? config.logLevel : 'info'
const isProduction = process.env.NODE_ENV === 'production'

const createLogger = () => {
  if (isProduction) {
    return pino({ level })
  }

  try {
    mkdirSync('logs', { recursive: true })
    const transport = pino.transport({
      targets: [
        {
          level: 'trace',
          target: 'pino/file',
          options: { destination: 'logs/app.log', sync: false },
        },
        {
          level: 'info',
          target: 'pino-pretty',
          options: { colorize: true },
        },
      ],
    })
    transport.on('error', (err) => {
      process.stderr.write(`[pino] transport error: ${err.message}\n`)
    })
    return pino({ level }, transport)
  } catch (err) {
    process.stderr.write(`[pino] falling back to stdout logger: ${err.message}\n`)
    return pino({ level })
  }
}

export const logger = createLogger()
