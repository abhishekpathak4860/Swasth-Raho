//   appointmentId: paymentAppointment._id,
//         p_id: paymentAppointment.p_id || paymentAppointment.p_id,
//         doc_id: paymentAppointment.doc_id || paymentAppointment.doc_id,
//         p_name: paymentAppointment.p_name,
//         doc_name: paymentAppointment.doc_name,
//         disease: paymentAppointment.disease,
//         amount: paymentAppointment.consultationFee,
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    appointmentId: { type: String, required: true },
    p_id: { type: String, required: true },
    doc_id: { type: String, required: true },
    p_name: { type: String, required: true },
    doc_name: { type: String, required: true },
    disease: { type: String, required: true },
    consultationFee: { type: String, required: true },
    amount_received: { type: String, required: true },
    date: { type: String, required: true },
    txnId: { type: String, required: true },
    status: { type: String, default: "pending", required: true },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
