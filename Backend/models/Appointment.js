import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    p_id: { type: String, required: true },
    doc_id: { type: String, required: true },
    p_name: { type: String, required: true },
    doc_name: { type: String, required: true },
    p_email: { type: String, required: true },
    disease: { type: String, required: true },
    type: { type: String, required: true },
    consultationFee: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    status: { type: String, default: "pending", required: true },
  },
  { timestamps: true }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
