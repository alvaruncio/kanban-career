import { Router } from 'express'
import { UserController } from '../../controllers/index.js'
import { validateCreateUser } from '../../validators/index.js'
import { requireAuth, requireAdmin, requireSelfOrAdmin } from '../../middlewares/index.js'

export const usersRouter = Router()

usersRouter.get('/', requireAuth, requireAdmin, UserController.getAll)
usersRouter.get('/:id', requireAuth, requireAdmin, UserController.getById)
usersRouter.post('/', requireAuth, requireAdmin, validateCreateUser, UserController.create)
usersRouter.patch('/:id', requireAuth, requireSelfOrAdmin, UserController.update)
usersRouter.put('/:id', requireAuth, requireSelfOrAdmin, UserController.update)
usersRouter.delete('/:id', requireAuth, requireSelfOrAdmin, UserController.delete)
