import { Schema, model } from 'mongoose';

const activeProjectSchema = new Schema({
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
});

const ActiveProject = model('ActiveProject', activeProjectSchema);
export default ActiveProject;
