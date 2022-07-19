import express, { Express, NextFunction, Request, Response } from 'express'
import { Client } from 'discord.js'
import cors from 'cors'
import session from 'express-session'
import passport from 'passport'
import routes from '../routes'
import store from 'connect-mongo'
require('../strategies/discord')

function createApp(): [Express, Client<boolean>] {
	const app = express()
	const client = new Client({ intents: ["Guilds"] }) // Discord.js

	app.use((req: Request, res: Response, next: NextFunction) => {
		res.locals.client = client
		next()
	})

	// Enable Parsing Middleware for Requests
	app.use(express.json())
	app.use(express.urlencoded({ extended: true }))

	// Enable CORS
	app.use(cors({
		origin: ['http://localhost:3000'],
		credentials: true
	}))

	// Enable Sessions
	app.use(session({
		secret: process.env.SECRET!,
		resave: false,
		saveUninitialized: false,
		cookie: { maxAge: 1000 * 60 * 60 * 24  * 7 },
		store: store.create({ mongoUrl: process.env.MONGODB_URI })
	}))

	// Enable Passport
	app.use(passport.initialize())
	app.use(passport.session())

	app.use('/api', routes)

	return [app, client]
}

export default createApp