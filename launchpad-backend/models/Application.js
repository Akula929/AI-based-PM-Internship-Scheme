import mongoose from "mongoose";
import { resume } from "react-dom/server";

const applicationSchema = new mongoose.Schema({
  jobId: String,
  name: String,
  email: String,
  coverNote: String,
  resume:String,

  company: String,   // ✅ ADD
  role: String,      // ✅ ADD

  status: {          // ✅ ADD
    type: String,
    default: "Pending"
  },


  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Application", applicationSchema);