import axios from 'axios'
import { Client, RESTAPIPartialCurrentUserGuild } from 'discord.js'
import { User } from '../../database/schemas'
import { cacheValue, getCachedValue } from '../../utils/cache'

export function getBotGuildsService(client: Client<boolean>) {
	return Array.from(client.guilds.cache.values())
}

export async function getUserGuildsService(id: string) {
	const cacheKey = `getUserGuildsService_${id}`
	const cachedValue: RESTAPIPartialCurrentUserGuild[] = getCachedValue(cacheKey)
	if (cachedValue) return cachedValue
	
	const user = await User.findById(id)
	if (!user) throw new Error('No user found')

	const response = await axios.get<RESTAPIPartialCurrentUserGuild[]>(`https://discord.com/api/v10/users/@me/guilds`, {
		headers: { Authorization: `Bearer ${user.accessToken}`}
	})
	cacheValue(response.data, cacheKey, 10000)

	return response.data
}

export async function getMutualGuildsService(client: Client<boolean>, userId: string) {
	const botGuilds = getBotGuildsService(client)
	const userGuilds = await getUserGuildsService(userId)

	const userAdminGuilds = userGuilds.filter(
		// 0x8 is the Admin Permission Flag
		({ permissions }) => (parseInt(permissions) & 0x8) === 0x8
	)

	const mutualGuilds = userAdminGuilds.filter((guild) =>
		botGuilds.some((botGuild) => botGuild.id === guild.id)
	)

	return mutualGuilds
}

export function getGuildService(client: Client<boolean>, id: string) {
	const guild = client.guilds.cache.get(id)
	if (!guild) return null
	return guild
}

export function getGuildChannelsService(client: Client<boolean>, id: string) {
	const guild = client.guilds.cache.get(id)
	if (!guild) return null
	return guild.channels.cache
}

export function getGuildRolesService(client: Client<boolean>, id: string) {
	const guild = client.guilds.cache.get(id)
	if (!guild) return null
	return guild.roles.cache
}