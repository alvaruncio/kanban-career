import { Router } from 'express'
import cookieParser from 'cookie-parser'
import { AuthController } from '../../controllers/index.js'
import { validateCreateUser } from '../../validators/index.js'
import { requireAuth } from '../../middlewares/index.js'

export const authRouter = Router()

authRouter.post('/register', validateCreateUser, AuthController.register)
authRouter.post('/login', AuthController.login)
authRouter.post('/refresh', cookieParser(), AuthController.refresh)
authRouter.post('/logout', AuthController.logout)
authRouter.get('/me', requireAuth, AuthController.me)
