import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  salary: String,
  description: String,
  role: String,

  // 🆕 NEW FIELDS
  deadline: String,
  type: String,
  eligibility: String,
  skills: [String],

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Job", jobSchema);