import { Request, Response } from "express";
import { User } from "../../database/schemas/User";
import { getGuildService, getMutualGuildsService } from "../../services/guilds";

export async function getGuildsController(req: Request, res: Response) {
	const user = req.user as User
	try {
		const guilds = await getMutualGuildsService(user.id)
		res.send(guilds)
	} catch (err) {
		console.error(err)
		res.status(400).send({ msg: 'Error' })
	}
}

export async function getGuildPermissionsController(req: Request, res: Response) {
	const user = req.user as User
	const { id } = req.params
	try {
		const guilds = await getMutualGuildsService(user.id)
		const valid = guilds.some(g => g.id === id)
		return valid ? res.sendStatus(200) : res.sendStatus(403)
	} catch (err) {
		console.error(err)
		res.status(400).send({ msg: 'Error' })
	}
}

export async function getGuildController(req: Request, res: Response) {
	const { id } = req.params
	try {
		const { data: guild } = await getGuildService(id)
		res.send(guild)
	} catch (err) {
		console.error(err)
		res.status(400).send({ msg: 'Error' })
	}
}