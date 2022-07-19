import { config } from 'dotenv'
config()

import createApp from './utils/createApp'
import './database'

const PORT = process.env.PORT || 3001

try {
	const [app, client] = createApp()

	client.on('ready', (c) => console.log(`Connected Discord as ${c.user.tag}`))
	client.login(process.env.TOKEN)
	app.listen(PORT, () => console.log(`API Running on Port ${PORT}`))
} catch (err) {
	console.error(err)
}