import passport from 'passport'
import { Profile, Strategy } from 'passport-discord'
import { VerifyCallback } from 'passport-oauth2'
import { User } from '../database/schemas'

passport.serializeUser((user: any, done) => {
	return done(null, user.id)
})

passport.deserializeUser(async (id: string, done) => {
	try {
		const user = await User.findById(id)
		return user ? done(null, user) : done(null, null)
	} catch (err) {
		console.error(err)
		return done(err, null)
	}
})

passport.use(
	new Strategy(
		{
			clientID: process.env.CLIENT_ID!,
			clientSecret: process.env.CLIENT_SECRET!,
			callbackURL: process.env.CALLBACK_URL,
			scope: ['identify', 'email', 'guilds']
		},
		async (
			accessToken: string,
			refreshToken: string,
			profile: Profile,
			done: VerifyCallback
		) => {
			try {
				const { id: userId } = profile
				const existingUser = await User.findOneAndUpdate(
					{ userId },
					{ accessToken, refreshToken },
					{ new: true }
				)
	
				if (existingUser) return done(null, existingUser)
	
				const newUser = new User({ userId, accessToken, refreshToken })
				const savedUser = await newUser.save()
	
				return done(null, savedUser)
			} catch (err) {
				console.error(err)
				return done(err as any, undefined)
			}
		}
	)
)