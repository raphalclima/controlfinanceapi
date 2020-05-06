import Mongoose, { Schema, model, Document } from 'mongoose'

interface OriginInterface extends Document {
  user: Mongoose.Types.ObjectId;
  tag: Mongoose.Types.ObjectId;
  title: string;
}

const OriginSchema = new Schema({
  user: { type: Schema.Types.ObjectId, required: true, select: false, ref: 'User' },
  tag: { type: Schema.Types.ObjectId, required: true, ref: 'Tag' },
  title: { type: String, required: true, unique: true }
}, {
  timestamps: true
})

export default model<OriginInterface>('Origin', OriginSchema)
