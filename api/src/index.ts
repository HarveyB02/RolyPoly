import { config } from 'dotenv'
config()

import createApp from './utils/createApp'
import './database'

const port = process.env.PORT || 3001

async function main() {
	try {
		const app = createApp()
		app.listen(port, () => console.log(`API Running on Port ${port}`))
	} catch (err) {
		console.error(err)
	}
}

main()