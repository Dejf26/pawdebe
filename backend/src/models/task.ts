import { Schema, model, Document } from 'mongoose';

export interface ITask extends Document {
  name: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  story: Schema.Types.ObjectId;
  estimatedHours: string;
  status: 'todo' | 'doing' | 'done';
  createdAt: Date;
  startDate?: Date;
  endDate?: Date;
  assignedUser?: Schema.Types.ObjectId;
}

const taskSchema = new Schema<ITask>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  priority: { type: String, enum: ['low', 'medium', 'high'], required: true },
  story: { type: Schema.Types.ObjectId, ref: 'Story', required: true },
  estimatedHours: { type: String, required: true },
  status: { type: String, enum: ['todo', 'doing', 'done'], default: 'todo' },
  createdAt: { type: Date, default: Date.now },
  startDate: { type: Date },
  endDate: { type: Date },
  assignedUser: { type: Schema.Types.ObjectId, ref: 'User' },
});

export default model<ITask>('Task', taskSchema);
