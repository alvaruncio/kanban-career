import { Router } from 'express'
import { ApplicationController } from '../../controllers/index.js'
import { requireAuth } from '../../middlewares/index.js'

export const applicationsRouter = Router()

applicationsRouter.get('/', requireAuth, ApplicationController.getAll)
