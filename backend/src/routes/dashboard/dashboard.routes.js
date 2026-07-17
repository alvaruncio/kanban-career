import { Router } from 'express'
import { DashboardController } from '../../controllers/index.js'
import { requireAuth } from '../../middlewares/index.js'
import { validateGetMetrics } from '../../validators/index.js'

export const dashboardRouter = Router()

dashboardRouter.get('/metrics', requireAuth, validateGetMetrics, DashboardController.getMetrics)
