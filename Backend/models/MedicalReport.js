import mongoose from "mongoose";

const medicalReportSchema = new mongoose.Schema(
  {
    appointment_id: { type: String, required: true }, //appointment_id
    p_id: { type: String, required: true }, // Patient ID
    p_name: { type: String, required: true }, // Patient name
    doc_id: { type: String, required: true }, // Doctor ID
    doc_name: { type: String, required: true }, // Doctor name

    date: { type: String, required: true }, // Report date
    department: { type: String, required: true }, // e.g., Cardiology, Dermatology
    disease: { type: String, required: true }, // e.g., ECG Report, Skin Allergy Test
    status: { type: String, default: "pending" }, // completed, pending, etc.

    symptoms: { type: [String], required: true }, // Array of symptoms

    vitals: {
      bloodPressure: { type: String },
      temperature: { type: String },
      heartRate: { type: String },
      weight: { type: String },
    },

    prescription: [
      {
        medicine: { type: String, required: true },
        dosage: { type: String },
        frequency: { type: String },
        days: { type: String },
      },
    ],

    recommendations: { type: [String] }, // Array of text recommendations
    nextAppointment: { type: String }, // e.g., "Follow up in 2 weeks"
  },
  { timestamps: true }
);

const MedicalReport = mongoose.model("medical_report", medicalReportSchema);

export default MedicalReport;
