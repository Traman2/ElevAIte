import mongoose from "mongoose";

const internshipSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    employer: { type: String, required: true },
    status: {
      type: String,
      enum: ["Accepted", "Pending", "Reviewed", "Rejected"],
      required: true,
    },
    description: {type: String },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Internship = mongoose.model("Internship", internshipSchema);
export default Internship;
