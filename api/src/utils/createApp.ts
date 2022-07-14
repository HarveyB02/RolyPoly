import express, { Express } from 'express'
import cors from 'cors'
import session from 'express-session'
import passport from 'passport'
import routes from '../routes'
import store from 'connect-mongo'
require('../strategies/discord')

function createApp(): Express {
	const app = express()

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
		secret: 'IMbbZ1HJqrTnSHQjpfLSmjGjIOllkvaNLcx5OnqKK7m',
		resave: false,
		saveUninitialized: false,
		cookie: { maxAge: 1000 * 60 * 60 * 24  * 7 },
		store: store.create({ mongoUrl: process.env.MONGODB_URI })
	}))

	// Enable Passport
	app.use(passport.initialize())
	app.use(passport.session())

	app.use('/api', routes)

	return app
}

export default createApp