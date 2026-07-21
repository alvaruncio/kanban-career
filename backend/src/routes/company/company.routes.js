import { Router } from 'express'
import { CompanyController } from '../../controllers/index.js'
import { requireAuth } from '../../middlewares/index.js'
import { validateCreateCompany } from '../../validators/index.js'

export const companiesRouter = Router()

companiesRouter.get('/', requireAuth, CompanyController.getAll)
companiesRouter.post('/', requireAuth, validateCreateCompany, CompanyController.create)
