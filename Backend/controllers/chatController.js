// controllers/chatController.js
import Conversation from "../models/Conversation.js";
import Doctor from "../models/Doctor.js";
import Message from "../models/Message.js";
import Patient from "../models/Patient.js";

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

    // 1. Find all conversations involving this doctor, sorted by latest activity
    const conversations = await Conversation.find({
      participants: doctorId,
    }).sort({ updatedAt: -1 }); // Latest chats at top

    // 2. Build the inbox with real unread counts for the doctor
    const inbox = await Promise.all(
      conversations.map(async (conv) => {
        // Find the patient ID (the other participant)
        const patientId = conv.participants.find(
          (p) => p.toString() !== doctorId
        );

        // Fetch Patient Details (Note: Import Patient model at top of file)
        const patientDetails = await Patient.findById(patientId).select(
          "name age profileImg"
        );
        if (!patientDetails) return null;

        // Count messages sent to THIS doctor that are unread
        const unreadCount = await Message.countDocuments({
          conversationId: conv._id,
          receiverId: doctorId,
          isRead: false,
        });

        return {
          patient: patientDetails.toObject(),
          conversationId: conv._id,
          unreadCount, // Persists on refresh
          lastMessage: conv.lastMessage,
          updatedAt: conv.updatedAt,
        };
      })
    );

    const filteredInbox = inbox.filter((item) => item !== null);

    res.status(200).json({ inbox: filteredInbox });
  } catch (error) {
    console.error("Inbox Error:", error);
    res.status(500).json({ message: "Failed to load inbox" });
  }
};
export const getPatientInbox = async (req, res) => {
  try {
    const patientId = req.user.id;

    // 1. Get all conversations involving this patient, sorted by latest activity (updatedAt)
    const conversations = await Conversation.find({
      participants: patientId,
    }).sort({ updatedAt: -1 }); // Server-side sorting

    const activeDoctorIds = [];

    // 2. Build the inbox with real unread counts from the Message collection
    const inbox = await Promise.all(
      conversations.map(async (conv) => {
        const docId = conv.participants.find((p) => p.toString() !== patientId);

        // Fetch actual Doctor details
        const docDetails = await Doctor.findById(docId).select(
          "name type profileImg"
        );
        if (!docDetails) return null;

        activeDoctorIds.push(docDetails._id.toString());

        // Count how many messages are sent to ME and are NOT read
        const unreadCount = await Message.countDocuments({
          conversationId: conv._id,
          receiverId: patientId,
          isRead: false,
        });

        return {
          ...docDetails.toObject(),
          conversationId: conv._id,
          unreadCount, // This persists on refresh
          lastActivity: conv.updatedAt,
        };
      })
    );

    const filteredInbox = inbox.filter((item) => item !== null);

    // 3. Fetch remaining doctors who haven't chatted yet
    const remainingDoctors = await Doctor.find({
      _id: { $nin: activeDoctorIds },
    }).select("name type profileImg");

    const formattedRemaining = remainingDoctors.map((d) => ({
      ...d.toObject(),
      unreadCount: 0,
      lastActivity: null,
    }));

    // FINAL ARRAY: Active/Latest chats at top, then the rest
    res.status(200).json({ doctor: [...filteredInbox, ...formattedRemaining] });
  } catch (error) {
    console.error("Error in getPatientInbox:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Ensure this marks as read correctly
export const markAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    await Message.updateMany(
      { conversationId, receiverId: req.user.id, isRead: false },
      { $set: { isRead: true } }
    );
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error);
  }
};
