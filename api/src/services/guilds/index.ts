import axios from 'axios'
import { User } from '../../database/schemas'
import { DISCORD_API_URL } from '../../utils/constants'
import { Guild, PartialGuild } from '../../utils/types'

export function getBotGuildsService() {
	return axios.get<PartialGuild[]>(`${DISCORD_API_URL}/users/@me/guilds`, {
		headers: { Authorization: `Bot ${process.env.TOKEN}`}
	})
}

export async function getUserGuildsService(id: string) {
	const user = await User.findById(id)
	if (!user) throw new Error('No user found')
	return axios.get<PartialGuild[]>(`${DISCORD_API_URL}/users/@me/guilds`, {
		headers: { Authorization: `Bearer ${user.accessToken}`}
	})
}

export async function getMutualGuildsService(id: string) {
	const { data: botGuilds } = await getBotGuildsService()
	const { data: userGuilds } = await getUserGuildsService(id)

	const adminUserGuilds = userGuilds.filter(
		({ permissions }) => (parseInt(permissions) & 0x8) === 0x8 // 0x8 is the Admin Permission Flag
	)

	const mutualGuilds = adminUserGuilds.filter((guild) =>
		botGuilds.some((botGuild) => botGuild.id === guild.id)
	)

	return mutualGuilds
}

export function getGuildService(id: string) {
	return axios.get<Guild>(`${DISCORD_API_URL}/guilds/${id}`, {
		headers: { Authorization: `Bot ${process.env.TOKEN}` }
	})
}