import { Router } from 'express'
import passport from 'passport'
import { getGuildAuthController } from '../../controllers/guilds'
import { isAuthenticated } from '../../utils/middlewares'

const router = Router()

router.get('/discord', passport.authenticate('discord'), (req, res) => {
	res.send(200)
})

router.get('/discord/redirect', passport.authenticate('discord'), (req, res) => {
	res.redirect('http://localhost:3000/')
})

router.get('/', (req, res) => {
	return req.user
		? res.send(req.user)
		: res.status(401).send({ msg: 'Unauthorized' })
})

router.get('/guilds/:id', isAuthenticated, getGuildAuthController)

export default router