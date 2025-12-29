// controllers/userChatController.js
import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";

// Keep track of who is online
const onlineUsers = new Map();

export const userSocketHandler = (io) => {
  io.on("connection", (socket) => {
    const userId = socket.user.id;
    onlineUsers.set(userId, socket.id);

    // 1. Join a specific chat room
    socket.on("join_chat", (conversationId) => {
      socket.join(conversationId);
      console.log(`User ${userId} joined room ${conversationId}`);
    });

    // 2. Handle P2P Messaging
    socket.on("send_direct_message", async (data) => {
      const { conversationId, receiverId, text } = data;

      try {
        // Save to Database
        const newMessage = new Message({
          conversationId,
          senderId: userId,
          receiverId,
          text,
        });
        await newMessage.save();

        // Update last message in Conversation
        await Conversation.findByIdAndUpdate(conversationId, {
          lastMessage: { text, senderId: userId },
        });

        // // Emit to the specific room
        // io.to(conversationId).emit("receive_direct_message", {
        //   _id: newMessage._id,
        //   senderId: userId,
        //   text,
        //   createdAt: newMessage.createdAt,
        // });
        // POORA OBJECT EMIT KAREIN
        const messageToEmit = {
          _id: newMessage._id,
          conversationId: newMessage.conversationId, // Yeh zaroori hai filtering ke liye
          senderId: newMessage.senderId,
          receiverId: newMessage.receiverId,
          text: newMessage.text,
          createdAt: newMessage.createdAt,
        };

        // Room mein sabko bhejein (Sender aur Receiver dono ko)
        io.to(conversationId).emit("receive_direct_message", messageToEmit);
      } catch (error) {
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    socket.on("disconnect", () => {
      onlineUsers.delete(userId);
    });
  });
};
