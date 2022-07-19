import { Router } from 'express'
import { getGuildChannelsController, getGuildController, getGuildRolesController, getGuildsController } from '../../controllers/guilds'
import { isAuthenticated } from '../../utils/middlewares' 

const router = Router()

router.get('/', isAuthenticated, getGuildsController)

router.get('/:id', isAuthenticated, getGuildController)

router.get('/:id/channels', isAuthenticated, getGuildChannelsController)

router.get('/:id/roles', isAuthenticated, getGuildRolesController)

export default router