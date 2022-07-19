import mongoose, { Schema } from 'mongoose'

export interface User {
	id: string
	userId: string
	accessToken: string
	refreshToken: string
}

const UserSchema = new Schema<User>({
	userId: {
		type: mongoose.SchemaTypes.String,
		required: true,
		unique: true
	},
	accessToken: {
		type: mongoose.SchemaTypes.String,
		required: true
	},
	refreshToken: {
		type: mongoose.SchemaTypes.String,
		required: true
	}
})

export default mongoose.model('users', UserSchema)