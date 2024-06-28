import { Schema, model, Document } from 'mongoose';

interface IStory extends Document {
  name: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  project: Schema.Types.ObjectId;
  createdAt: Date;
  status: 'todo' | 'doing' | 'done';
  owner: Schema.Types.ObjectId;
}

const storySchema = new Schema<IStory>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  priority: { type: String, required: true, enum: ['low', 'medium', 'high'] },
  project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, required: true, enum: ['todo', 'doing', 'done'] },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

const Story = model<IStory>('Story', storySchema);
export default Story;
