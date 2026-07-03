import { Router } from 'express'
import { CompanyController } from '../../controllers/company/company.controller.js'
import { requireAuth } from '../../middlewares/auth/auth.middleware.js'

export const companiesRouter = Router()

companiesRouter.get('/', requireAuth, CompanyController.getAll)
