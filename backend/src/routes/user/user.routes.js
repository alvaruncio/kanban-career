import { Router } from 'express'
import { UserController } from '../../controllers/user/user.controller.js'
import { validateCreateUser } from '../../validators/user/user.validator.js'

export const usersRouter = Router()

usersRouter.get('/', UserController.getAll)
usersRouter.get('/:id', UserController.getById)
usersRouter.post('/', validateCreateUser, UserController.create)
usersRouter.patch('/:id', UserController.update)
usersRouter.put('/:id', UserController.update)
usersRouter.delete('/:id', UserController.delete)
