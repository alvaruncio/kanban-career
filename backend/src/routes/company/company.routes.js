import { Router } from 'express'
import { CompanyController } from '../../controllers/index.js'
import { requireAuth } from '../../middlewares/index.js'

export const companiesRouter = Router()

companiesRouter.get('/', requireAuth, CompanyController.getAll)
