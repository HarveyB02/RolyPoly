import { Router } from 'express'
import { getGuildController, getGuildPermissionsController, getGuildsController } from '../../controllers/guilds'
import { cacheResult, isAuthenticated, rateLimit } from '../../utils/middlewares' 

const router = Router()

router.get('/', cacheResult(60 * 1000), rateLimit(2000), isAuthenticated, getGuildsController)

router.get('/:id/permissions', cacheResult(60 * 1000), rateLimit(2000), isAuthenticated, getGuildPermissionsController)

router.get('/:id', cacheResult(60 * 1000), rateLimit(2000), isAuthenticated, getGuildController)

export default router