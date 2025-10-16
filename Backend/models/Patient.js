import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "patient" },
  age: { type: Number, required: true },
  location: { type: String, required: true },
  contact: { type: String, required: true },
});

const Patient = mongoose.model("Patient", patientSchema);
export default Patient;
