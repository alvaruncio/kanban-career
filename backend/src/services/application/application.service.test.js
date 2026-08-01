import { beforeEach, vi, it, expect } from 'vitest'

const { mockRepo } = vi.hoisted(() => ({
  mockRepo: {
    findAllByUserId: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    deleteById: vi.fn(),
  },
}))

vi.mock('../../repositories/index.js', () => ({
  ApplicationRepository: mockRepo,
}))

beforeEach(() => {
  vi.clearAllMocks()
  vi.resetModules()
})

// --- getAll ---

it('should return all applications for user with filters', async () => {
  const applications = [
    { id: 1, companyId: 5, status: 'APPLIED', userId: 1 },
    { id: 2, companyId: 5, status: 'INTERVIEW', userId: 1 },
  ]
  mockRepo.findAllByUserId.mockResolvedValue(applications)

  const { ApplicationService } = await import('./application.service.js')
  const result = await ApplicationService.getAll(1, { companyId: '5', month: '2026-07' })

  expect(mockRepo.findAllByUserId).toHaveBeenCalledWith(1, { companyId: '5', month: '2026-07' })
  expect(result).toEqual(applications)
})

it('should return empty array when user has no applications', async () => {
  mockRepo.findAllByUserId.mockResolvedValue([])

  const { ApplicationService } = await import('./application.service.js')
  const result = await ApplicationService.getAll(2, {})

  expect(result).toEqual([])
})

// --- getById ---

it('should return application when owned by user', async () => {
  const application = { id: 1, userId: 1, companyId: 5, status: 'APPLIED' }
  mockRepo.findById.mockResolvedValue(application)

  const { ApplicationService } = await import('./application.service.js')
  const result = await ApplicationService.getById(1, 1)

  expect(mockRepo.findById).toHaveBeenCalledWith(1)
  expect(result).toEqual(application)
})

it('should return null when application not found', async () => {
  mockRepo.findById.mockResolvedValue(null)

  const { ApplicationService } = await import('./application.service.js')
  const result = await ApplicationService.getById(999, 1)

  expect(result).toBeNull()
})

it('should return null when application belongs to another user', async () => {
  mockRepo.findById.mockResolvedValue({ id: 1, userId: 2, status: 'APPLIED' })

  const { ApplicationService } = await import('./application.service.js')
  const result = await ApplicationService.getById(1, 1)

  expect(result).toBeNull()
})

// --- create ---

it('should create application with APPLIED status', async () => {
  const input = { userId: 1, companyId: 5, position: 'Frontend Dev' }
  const created = { id: 1, ...input, status: 'APPLIED' }
  mockRepo.create.mockResolvedValue(created)

  const { ApplicationService } = await import('./application.service.js')
  const result = await ApplicationService.create(input)

  expect(mockRepo.create).toHaveBeenCalledWith({
    companyId: 5,
    position: 'Frontend Dev',
    userId: 1,
    status: 'APPLIED',
  })
  expect(result).toEqual(created)
})

// --- update ---

it('should update application when owned by user', async () => {
  mockRepo.findById.mockResolvedValue({ id: 1, userId: 1, status: 'APPLIED' })
  mockRepo.update.mockResolvedValue({ id: 1, userId: 1, status: 'INTERVIEW' })

  const { ApplicationService } = await import('./application.service.js')
  const result = await ApplicationService.update(1, 1, { status: 'INTERVIEW' })

  expect(mockRepo.update).toHaveBeenCalledWith(1, { status: 'INTERVIEW' })
  expect(result).toEqual({ id: 1, userId: 1, status: 'INTERVIEW' })
})

it('should return null when updating unowned application', async () => {
  mockRepo.findById.mockResolvedValue({ id: 1, userId: 2, status: 'APPLIED' })

  const { ApplicationService } = await import('./application.service.js')
  const result = await ApplicationService.update(1, 1, { status: 'INTERVIEW' })

  expect(mockRepo.update).not.toHaveBeenCalled()
  expect(result).toBeNull()
})

// --- deleteApplication ---

it('should delete application when owned by user', async () => {
  mockRepo.findById.mockResolvedValue({ id: 1, userId: 1, status: 'APPLIED' })
  mockRepo.deleteById.mockResolvedValue({ id: 1 })

  const { ApplicationService } = await import('./application.service.js')
  await ApplicationService.deleteApplication(1, 1)

  expect(mockRepo.deleteById).toHaveBeenCalledWith(1)
})

it('should return null when deleting unowned application', async () => {
  mockRepo.findById.mockResolvedValue({ id: 1, userId: 2, status: 'APPLIED' })

  const { ApplicationService } = await import('./application.service.js')
  const result = await ApplicationService.deleteApplication(1, 1)

  expect(mockRepo.deleteById).not.toHaveBeenCalled()
  expect(result).toBeNull()
})
