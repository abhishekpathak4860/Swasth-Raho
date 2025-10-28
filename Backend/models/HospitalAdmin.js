import mongoose from "mongoose";

const hospitalAdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "hospital_admin" },
  hospital_name: { type: String, required: true },
  hospital_type: { type: String, required: true }, // e.g., "General", "Eye Specialist"
  hospital_address: { type: String, required: true },
  total_rooms: { type: Number, required: true },
  ac_rooms: { type: Number, required: true },
  non_ac_rooms: { type: Number, required: true },
  connected_pharmacies: { type: [String], required: true },
  hospital_duration: { type: String, required: true },
  organisation_type: { type: String, required: true },
});

const HospitalAdmin = mongoose.model("HospitalAdmin", hospitalAdminSchema);
export default HospitalAdmin;
