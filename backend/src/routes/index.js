import { Router } from 'express'
import { usersRouter } from './user/user.routes.js'
import { authRouter } from './auth/auth.routes.js'
import { applicationsRouter } from './application/application.routes.js'
import { companiesRouter } from './company/company.routes.js'
import { dashboardRouter } from './dashboard/dashboard.routes.js'

const api = Router()

api.use('/users', usersRouter)
api.use('/auth', authRouter)
api.use('/applications', applicationsRouter)
api.use('/companies', companiesRouter)
api.use('/dashboard', dashboardRouter)

export { api }
