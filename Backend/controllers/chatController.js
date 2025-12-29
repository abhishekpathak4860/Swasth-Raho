// controllers/chatController.js
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

export const getOrCreateConversation = async (req, res) => {
  try {
    const senderId = req.user.id; // From JWT
    const receiverId = req.params.doctorId; // From URL params

    // 1. Look for a conversation where both users are participants
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    // 2. If no conversation exists, create a new one
    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, receiverId],
        participantModel: req.user.role === "patient" ? "Patient" : "Doctor", // Logic to handle dynamic models if needed
      });
      await conversation.save();
    }

    // 3. Fetch all previous messages for this conversation
    const messages = await Message.find({
      conversationId: conversation._id,
    }).sort({ createdAt: 1 }); // Sort by time (oldest first)

    // 4. Return both the ID (for socket joining) and the messages (for UI)
    res.status(200).json({
      conversationId: conversation._id,
      messages: messages,
    });
  } catch (error) {
    console.error("Chat Init Error:", error);
    res.status(500).json({ message: "Server error while initializing chat" });
  }
};

export const getDoctorInbox = async (req, res) => {
  try {
    const doctorId = req.user.id; // From JWT

    // 1. Un Conversations ko dhoondo jisme ye Doctor shamil hai
    const conversations = await Conversation.find({
      participants: doctorId,
    })
      .populate({
        path: "participants",
        match: { _id: { $ne: doctorId } }, // Sirf Patient ki detail chahiye, apni nahi
        select: "name age profileImg", // Patient ke zaroori fields
      })
      .sort({ updatedAt: -1 }); // Latest chat sabse upar

    // 2. Data format karna frontend ke liye
    const inbox = conversations.map((conv) => ({
      conversationId: conv._id,
      patient: conv.participants[0], // populated patient object
      lastMessage: conv.lastMessage,
      updatedAt: conv.updatedAt,
    }));

    res.status(200).json({ inbox });
  } catch (error) {
    console.error("Inbox Error:", error);
    res.status(500).json({ message: "Failed to load inbox" });
  }
};
