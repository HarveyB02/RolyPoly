import { GetServerSidePropsContext } from 'next';
import axios from 'axios'
import { validateCookies } from './helpers';
import { Guild, PartialGuild } from './types';

const API_URL = 'http://localhost:3001/api'

export const fetchMutualGuilds = async (ctx: GetServerSidePropsContext) => {
	const headers = validateCookies(ctx)
	if (!headers) return null

	try {
		const { data: guilds } = await axios.get<PartialGuild[]>(`${API_URL}/guilds`, { headers })
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
		return guild
	} catch (err) {
		console.error(err)
		return null
	}
}

export const fetchValidGuild = async (id: string, headers: HeadersInit) => {
	return await fetch(
		`${API_URL}/guilds/${id}/permissions`,
		{ headers }
	)
}

