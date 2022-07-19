import { NextFunction, Request, Response } from 'express'

export const isAuthenticated = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (!req.user) return res.status(403).send({ msg: 'Unauthorized' })
	next()
}