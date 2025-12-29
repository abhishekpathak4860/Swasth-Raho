import PatientChatAi from "../models/PatientChatAi.js";

export const deleteChatsAi = async (req, res) => {
  try {
    const patientId = req.user.id; // JWT middleware se id nikaali

    // MongoDB se us patient ka poora chat document delete karein
    const deletedChat = await PatientChatAi.findOneAndDelete({
      patient_id: patientId,
    });

    if (!deletedChat) {
      return res.status(404).json({
        message: "No chat history found to delete",
      });
    }

    // Success response
    return res.status(200).json({
      success: true,
      message: "Chat history deleted successfully",
    });
  } catch (error) {
    console.error("Delete AI Chat Error:", error);
    return res.status(500).json({
      error: "Failed to clear chat history",
    });
  }
};
