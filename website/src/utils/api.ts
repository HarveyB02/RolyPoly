import { GetServerSidePropsContext } from 'next'
import axios from 'axios'
import { validateCookies } from './helpers'
import { Guild, PartialGuild } from './types'

const API_URL = 'http://localhost:3001/api'

export const checkGuildAuth = async (id: string, headers: HeadersInit) => {
	return await fetch(
		`${API_URL}/auth/guilds/${id}`,
		{ headers }
	)
}

export const fetchMutualGuilds = async (ctx: GetServerSidePropsContext) => {
	const headers = validateCookies(ctx)
	if (!headers) return null

	try {
		const { data: guilds } = await axios.get<PartialGuild[]>(`${API_URL}/guilds`, { headers })
		if (!Array.isArray(guilds)) return null
		if (!guilds.every(g => g.id)) return null
		return guilds
	} catch (err) {
		console.error(err)
		return null
	}
}

export const fetchGuild = async (ctx: GetServerSidePropsContext) => {
	const headers = validateCookies(ctx)
	if (!headers) return null

	try {
		const { data: guild } = await axios.get<Guild>(`${API_URL}/guilds/${ctx.query.id}`, { headers })
		if (!guild.id) return null
		return guild
	} catch (err) {
		console.error(err)
		return null
	}
}

export const fetchGuildRoles = async (ctx: GetServerSidePropsContext) => {
	const headers = validateCookies(ctx)
	if (!headers) return null

	try {
		const { data: roles } = await axios.get<Guild>(`${API_URL}/guilds/${ctx.query.id}/roles`, { headers })
		if (!Array.isArray(roles)) return null
		if (!roles.every(r => r.id)) return null
		return roles
	} catch (err) {
		console.error(err)
		return null
	}
}

export const fetchGuildChannels = async (ctx: GetServerSidePropsContext) => {
	const headers = validateCookies(ctx)
	if (!headers) return null

	try {
		const { data: channels } = await axios.get<Guild>(`${API_URL}/guilds/${ctx.query.id}/channels`, { headers })
		if (!Array.isArray(channels)) return null
		if (!channels.every(c => c.id)) return null
		return channels
	} catch (err) {
		console.error(err)
		return null
	}
}