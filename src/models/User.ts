import { Schema, model, Document } from 'mongoose'
import bcrypt from 'bcryptjs'

interface UserInterface extends Document {
  nickname: string;
  email: string;
  username: string;
  password: string;
  passwordResetToken: string;
  passwordResetExpiress: Date;
}

const UserSchema = new Schema({
  nickname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  passwordResetToken: { type: String, select: false },
  passwordResetExpiress: { type: Date, select: false }
}, {
  timestamps: true
})

UserSchema.pre('save', async function (next) {
  const hash = await bcrypt.hash(this.get('password'), 10)
  this.set('password', hash)

  next()
})

export default model<UserInterface>('User', UserSchema)
