import { Router } from 'express'
import { getGuildChannelsController, getGuildController, getGuildRolesController, getGuildsController } from '../../controllers/guilds'
import { cacheResult, isAuthenticated, rateLimit } from '../../utils/middlewares' 

const router = Router()

router.get('/', cacheResult(60 * 1000), rateLimit(3000), isAuthenticated, getGuildsController)

router.get('/:id', cacheResult(60 * 1000), rateLimit(3000), isAuthenticated, getGuildController)

router.get('/:id/roles', cacheResult(60 * 1000), rateLimit(3000), isAuthenticated, getGuildRolesController)

router.get('/:id/channels', cacheResult(60 * 1000), rateLimit(3000), isAuthenticated, getGuildChannelsController)

export default router