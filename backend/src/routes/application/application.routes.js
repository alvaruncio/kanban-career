import { Router } from 'express'
import { ApplicationController } from '../../controllers/index.js'
import { requireAuth } from '../../middlewares/index.js'
import { validateCreateApplication, validateUpdateApplication } from '../../validators/index.js'

export const applicationsRouter = Router()

applicationsRouter.get('/', requireAuth, ApplicationController.getAll)
applicationsRouter.get('/:id', requireAuth, ApplicationController.getById)
applicationsRouter.post('/', requireAuth, validateCreateApplication, ApplicationController.create)
applicationsRouter.patch('/:id', requireAuth, validateUpdateApplication, ApplicationController.update)
applicationsRouter.delete('/:id', requireAuth, ApplicationController.delete)
