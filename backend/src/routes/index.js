import { Router } from 'express'
import { usersRouter } from './user/user.routes.js'

const api = Router()

api.use('/users', usersRouter)

export { api }
