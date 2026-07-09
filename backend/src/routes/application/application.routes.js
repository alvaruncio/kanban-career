import { Router } from 'express'
import { ApplicationController } from '../../controllers/index.js'
import { requireAuth } from '../../middlewares/index.js'
import { validateCreateApplication } from '../../validators/index.js'

export const applicationsRouter = Router()

applicationsRouter.get('/', requireAuth, ApplicationController.getAll)
applicationsRouter.post('/', requireAuth, validateCreateApplication, ApplicationController.create)
