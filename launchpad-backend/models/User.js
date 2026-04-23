import mongoose from "mongoose";
import { resume } from "react-dom/server";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  resume: String
});

export default mongoose.model("User", userSchema);