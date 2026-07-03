import { Router } from 'express'
import { ApplicationController } from '../../controllers/application/application.controller.js'
import { requireAuth } from '../../middlewares/auth/auth.middleware.js'

export const applicationsRouter = Router()

applicationsRouter.get('/', requireAuth, ApplicationController.getAll)
