import { beforeEach, vi, it, expect } from 'vitest'

const { mockRepo } = vi.hoisted(() => ({
  mockRepo: {
    findAllByUserId: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
}))

vi.mock('../../repositories/index.js', () => ({
  CompanyRepository: mockRepo,
}))

beforeEach(() => {
  vi.clearAllMocks()
  vi.resetModules()
})

// --- getAll ---

it('should return all companies for user', async () => {
  const companies = [
    { id: 1, name: 'Google', userId: 1 },
    { id: 2, name: 'Meta', userId: 1 },
  ]
  mockRepo.findAllByUserId.mockResolvedValue(companies)

  const { CompanyService } = await import('./company.service.js')
  const result = await CompanyService.getAll(1)

  expect(mockRepo.findAllByUserId).toHaveBeenCalledWith(1)
  expect(result).toEqual(companies)
})

it('should return empty array when user has no companies', async () => {
  mockRepo.findAllByUserId.mockResolvedValue([])

  const { CompanyService } = await import('./company.service.js')
  const result = await CompanyService.getAll(2)

  expect(result).toEqual([])
})

// --- getById ---

it('should return company when owned by user', async () => {
  const company = { id: 1, name: 'Google', userId: 1 }
  mockRepo.findById.mockResolvedValue(company)

  const { CompanyService } = await import('./company.service.js')
  const result = await CompanyService.getById(1, 1)

  expect(mockRepo.findById).toHaveBeenCalledWith(1)
  expect(result).toEqual(company)
})

it('should return null when company not found', async () => {
  mockRepo.findById.mockResolvedValue(null)

  const { CompanyService } = await import('./company.service.js')
  const result = await CompanyService.getById(999, 1)

  expect(result).toBeNull()
})

it('should return null when company belongs to another user', async () => {
  mockRepo.findById.mockResolvedValue({ id: 1, name: 'Google', userId: 2 })

  const { CompanyService } = await import('./company.service.js')
  const result = await CompanyService.getById(1, 1)

  expect(result).toBeNull()
})

// --- create ---

it('should create company with userId', async () => {
  const input = { name: 'Google', website: 'https://google.com' }
  const created = { id: 1, ...input, userId: 1 }
  mockRepo.create.mockResolvedValue(created)

  const { CompanyService } = await import('./company.service.js')
  const result = await CompanyService.create(1, input)

  expect(mockRepo.create).toHaveBeenCalledWith({ name: 'Google', website: 'https://google.com', userId: 1 })
  expect(result).toEqual(created)
})

// --- update ---

it('should update company when owned by user', async () => {
  mockRepo.findById.mockResolvedValue({ id: 1, name: 'Google', userId: 1 })
  mockRepo.update.mockResolvedValue({ id: 1, name: 'Google Updated', userId: 1 })

  const { CompanyService } = await import('./company.service.js')
  const result = await CompanyService.update(1, 1, { name: 'Google Updated' })

  expect(mockRepo.findById).toHaveBeenCalledWith(1)
  expect(mockRepo.update).toHaveBeenCalledWith(1, { name: 'Google Updated' })
  expect(result).toEqual({ id: 1, name: 'Google Updated', userId: 1 })
})

it('should return null when updating unowned company', async () => {
  mockRepo.findById.mockResolvedValue({ id: 1, name: 'Google', userId: 2 })

  const { CompanyService } = await import('./company.service.js')
  const result = await CompanyService.update(1, 1, { name: 'Hacked' })

  expect(mockRepo.update).not.toHaveBeenCalled()
  expect(result).toBeNull()
})

it('should return null when updating non-existent company', async () => {
  mockRepo.findById.mockResolvedValue(null)

  const { CompanyService } = await import('./company.service.js')
  const result = await CompanyService.update(999, 1, { name: 'Ghost' })

  expect(mockRepo.update).not.toHaveBeenCalled()
  expect(result).toBeNull()
})
