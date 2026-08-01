import { afterEach, beforeEach, vi, it, expect } from 'vitest'

beforeEach(() => {
  vi.clearAllMocks()
  vi.restoreAllMocks()
  vi.resetModules()
})

afterEach(() => {
  process.removeAllListeners('SIGTERM')
  process.removeAllListeners('SIGINT')
})

it('should log startup with logger.info instead of console.log', async () => {
  vi.spyOn(process, 'exit').mockImplementation(() => {})
  const consoleLogSpy = vi.spyOn(console, 'log')

  vi.doMock('./app.js', () => ({
    default: {
      listen: vi.fn((_port, cb) => {
        cb()
        return { close: vi.fn((cb) => cb()) }
      }),
    },
  }))

  const shared = await import('./shared/index.js')
  await import('../server.js')

  expect(shared.logger.info).toHaveBeenCalled()
  expect(consoleLogSpy).not.toHaveBeenCalled()
})

it('should log shutdown with logger.info on SIGTERM', async () => {
  vi.spyOn(process, 'exit').mockImplementation(() => {})
  const consoleLogSpy = vi.spyOn(console, 'log')

  vi.doMock('./app.js', () => ({
    default: {
      listen: vi.fn((_port, cb) => {
        cb()
        return { close: vi.fn((cb) => cb()) }
      }),
    },
  }))

  const shared = await import('./shared/index.js')
  shared.logger.info.mockClear()

  await import('../server.js')
  shared.logger.info.mockClear()

  process.emit('SIGTERM')

  expect(shared.logger.info).toHaveBeenCalled()
  expect(consoleLogSpy).not.toHaveBeenCalled()
})
