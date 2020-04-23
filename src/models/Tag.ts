import Mongoose, { Schema, model, Document } from 'mongoose'

interface TagInterface extends Document {
  user: Mongoose.Types.ObjectId;
  title: string;
}

const TagSchema = new Schema({
  user: { type: Schema.Types.ObjectId, required: true, select: false, ref: 'User' },
  title: { type: String, required: true, unique: true }
}, {
  timestamps: true
})

export default model<TagInterface>('Tag', TagSchema)
