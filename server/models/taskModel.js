import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    isComplete: { type: Boolean, default: false },
    dueDate: { type: Date, required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
  },
  { timestamps: true }
);

const TaskModel = mongoose.model("Task", taskSchema);
export default TaskModel; 