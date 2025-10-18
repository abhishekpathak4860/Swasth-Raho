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
});

const Doctor = mongoose.model("Doctor", doctorSchema);
export default Doctor;
// {
//   id: 1,
//   name: "Dr. Amit Sharma",
//   specialization: "Cardiologist",
//   experience: "15 years",
//   rating: 4.8,
//   image: "👨‍⚕️",
//   contact: "+91 98765 43210",
//   education: "MBBS, MD Cardiology",
//   hospital: "Heart Care Centre",
//   availability: "Mon-Fri: 9AM-5PM",
//   consultationFee: "₹1500",
// },
