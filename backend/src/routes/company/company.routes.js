import { Router } from 'express'
import { CompanyController } from '../../controllers/index.js'
import { requireAuth } from '../../middlewares/index.js'
import { validateCreateCompany, validateUpdateCompany } from '../../validators/index.js'

export const companiesRouter = Router()

companiesRouter.get('/', requireAuth, CompanyController.getAll)
companiesRouter.get('/:id', requireAuth, CompanyController.getById)
companiesRouter.post('/', requireAuth, validateCreateCompany, CompanyController.create)
companiesRouter.patch('/:id', requireAuth, validateUpdateCompany, CompanyController.update)
