import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const patientChatAiSchema = new mongoose.Schema(
  {
    patient_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // or Patient (use your actual patient model name)
      required: true,
      unique: true,
    },
    messages: [messageSchema],
  },
  { timestamps: true }
);

const PatientChatAi = mongoose.model("PatientChatAi", patientChatAiSchema);

export default PatientChatAi;
