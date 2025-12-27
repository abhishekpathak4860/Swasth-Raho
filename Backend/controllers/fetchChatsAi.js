import PatientChatAi from "../models/PatientChatAi.js";

export const fetchChatsAi = async (req, res) => {
  try {
    const patientId = req.user.id; // from JWT

    // Find chat for this patient
    const chat = await PatientChatAi.findOne({
      patient_id: patientId,
    }).select("messages");

    // If no chat exists yet
    if (!chat || chat.messages.length === 0) {
      return res.status(200).json({
        messages: [],
      });
    }

    return res.status(200).json({
      messages: chat.messages,
    });
  } catch (error) {
    console.error("Fetch AI Chat Error:", error);
    return res.status(500).json({
      error: "Failed to fetch chat history",
    });
  }
};
