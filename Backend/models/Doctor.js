import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "doctor" },
  age: { type: Number, required: true },
  type: { type: String, required: true }, // e.g., "General", "Eye Specialist"
  contact: { type: String, required: true },
  experience: { type: String, required: true },
  education: { type: String, required: true },
  hospital: { type: String, required: true },
  consultationFee: { type: String, required: true },
  Total_Revenue: { type: Number, required: true },
  patient_ids: { type: [String], required: true },
  hospital_id: { type: String, required: true },
});

const Doctor = mongoose.model("Doctor", doctorSchema);
export default Doctor;
