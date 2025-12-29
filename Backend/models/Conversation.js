// models/Conversation.js
import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema(
  {
    participants: [
      { type: mongoose.Schema.Types.ObjectId, refPath: "participantModel" },
    ],
    participantModel: {
      type: String,
      enum: ["Patient", "Doctor"],
      required: true,
    },
    lastMessage: {
      text: String,
      senderId: mongoose.Schema.Types.ObjectId,
      createdAt: { type: Date, default: Date.now },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Conversation", ConversationSchema);
