import { Request, Response } from "express"
import { User } from "../../database/schemas/User"
import { getGuildChannelsService, getGuildRolesService, getGuildService, getMutualGuildsService } from "../../services/guilds"

export async function getGuildsController(req: Request, res: Response) {
	const user = req.user as User
	try {
		const guilds = await getMutualGuildsService(res.locals.client, user.id)
		res.send(guilds)
	} catch (err) {
		console.error(err)
		res.status(400).send({ msg: 'Error' })
	}
}

export async function getGuildAuthController(req: Request, res: Response) {
	const user = req.user as User
	const { id } = req.params
	try {
		const guilds = await getMutualGuildsService(res.locals.client, user.id)
		const valid = guilds.some(g => g.id === id)
		return valid ? res.sendStatus(200) : res.sendStatus(403)
	} catch (err) {
		console.error(err)
		res.status(400).send({ msg: 'Error' })
	}
}

export function getGuildController(req: Request, res: Response) {
	const { id } = req.params
	try {
		res.send(getGuildService(res.locals.client, id))
	} catch (err) {
		console.error(err)
		res.status(400).send({ msg: 'Error' })
	}
}

export function getGuildChannelsController(req: Request, res: Response) {
	const { id } = req.params
	try {
		res.send(getGuildChannelsService(res.locals.client, id))
	} catch (err) {
		console.error(err)
		res.status(400).send({ msg: 'Error' })
	}
}

export function getGuildRolesController(req: Request, res: Response) {
	const { id } = req.params
	try {
		res.send(getGuildRolesService(res.locals.client, id))
	} catch (err) {
		console.error(err)
		res.status(400).send({ msg: 'Error' })
	}
}