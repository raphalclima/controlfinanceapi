import Mongoose, { Schema, model, Document } from 'mongoose'

interface FinanceInterface extends Document {
  user: Mongoose.Types.ObjectId;
  tag: Mongoose.Types.ObjectId;
  origin: Mongoose.Types.ObjectId;
  value: number;
  date: Date;
  type: number;
}

const FinanceSchema = new Schema({
  user: { type: Schema.Types.ObjectId, required: true, select: false, ref: 'User' },
  tag: { type: Schema.Types.ObjectId, required: true, ref: 'Tag' },
  origin: { type: Schema.Types.ObjectId, required: true, ref: 'Origin' },
  value: { type: Number, required: true },
  date: { type: Date, required: true },
  type: { type: Number, required: true }
}, {
  timestamps: true
})

export default model<FinanceInterface>('Finance', FinanceSchema)
