import { NextFunction, Request, Response } from 'express'
import cache from 'memory-cache'

let lastCall: Date | undefined

export const isAuthenticated = (
	req: Request,
	res: Response,
	next: NextFunction
) => req.user
	? next()
	: res.status(403).send({ msg: 'Unauthorized' })	

export const cacheResult = (duration: number) => {
	return (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		let key = '__express__' + req.originalUrl || req.url
		let cachedBody = cache.get(key)
		if (cachedBody) {
			res.send(cachedBody)
			return
		}
		// @ts-ignore
		res.sendResponse = res.send
		// @ts-ignore
		res.send = (body) => {
			cache.put(key, body, duration)
			// @ts-ignore
			res.sendResponse(body)
		}
		next()
	}
}

export const rateLimit = (limit: number) => {
	return (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		if (lastCall) {
			let time = (new Date()).getTime() - lastCall.getTime()
			
			if (time < limit) {
				let delay = limit - time

				setTimeout(() => {
					lastCall = new Date()
					next()
				}, delay)

				return
			}
		}
		lastCall = new Date()
		next()
	}
}