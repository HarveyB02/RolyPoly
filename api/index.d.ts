import { Express } from 'express-serve-static-core'

import { Client } from 'discord.js'

declare module 'express-serve-static-core' {
	interface Request {
		client?: Client<boolean>
	}
}