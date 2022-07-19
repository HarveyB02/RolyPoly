import { NextRequest, NextResponse } from 'next/server'
import { fetchMutualGuilds, checkGuildAuth } from './utils/api'

const PATTERNS = [
		[
			// @ts-ignore - Missing type
			new URLPattern({ pathname: '/dashboard/:id' }),
			// @ts-ignore - Missing type
			({ pathname }) => pathname.groups,
		],
  ]

const getParams = (url: string) => {
	const input = url.split('?')[0]
	let result: {[key: string]: any} = {}

	for (const [pattern, handler] of PATTERNS) {
		const patternResult = pattern.exec(input)
		if (patternResult !== null && 'pathname' in patternResult) {
			result = handler(patternResult)
			break
		}
	}
	return result
}

const validateMiddlewareCookies = (req: NextRequest) => {
	const sessionID = req.cookies.get('connect.sid')

	return sessionID ? ({
		Cookie: `connect.sid=${sessionID}`
	}) : false
}

export async function middleware(req: NextRequest) {
	const url = new URL(req.url)
	const params = getParams(req.url)
	
	if (url.pathname.split('/')[1] === 'dashboard') {
		if (!params.id) return NextResponse.rewrite(new URL('/404', req.url))
		
		const headers = validateMiddlewareCookies(req)
		if (!headers) return NextResponse.rewrite(new URL('/404', req.url))
		
		const response = await checkGuildAuth(params.id, headers)
		if (response.status !== 200) return NextResponse.rewrite(new URL('/404', req.url))
	}

	NextResponse.next()
}