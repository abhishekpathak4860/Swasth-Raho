// import { GoogleGenAI } from "@google/genai";

// const ai = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY,
// });

// export const aiChat = async (req, res) => {
//   try {
//     const { message, history } = req.body;

//     if (!message) {
//       return res.status(400).json({ error: "Message is required" });
//     }

//     // 🔥 Convert previous messages into conversation text
//     let conversationHistory = "";

//     if (Array.isArray(history)) {
//       conversationHistory = history
//         .map((msg) =>
//           msg.sender === "user"
//             ? `Patient: ${msg.text}`
//             : `Swasth Bot: ${msg.text}`
//         )
//         .join("\n");
//     }

//     const prompt = `
// You are Swasth Bot, a healthcare assistant inside Swasth-Raho ecosystem.

// Rules:
// - Give safe, general medical guidance only
// - Do NOT diagnose diseases
// - Do NOT prescribe medicines
// - Always recommend consulting a real doctor if needed

// Conversation so far:
// ${conversationHistory}

// Patient: ${message}
// Swasth Bot:
// `;

//     const response = await ai.models.generateContent({
//       model: "gemini-2.5-flash-lite",
//       contents: prompt,
//     });

//     res.json({
//       reply: response.text,
//     });
//   } catch (error) {
//     console.error("Gemini Error:", error);
//     res.status(500).json({ error: "AI service failed" });
//   }
// };

import { GoogleGenAI } from "@google/genai";
import PatientChatAi from "../models/PatientChatAi.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const aiChat = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Get patient id from token
    const patientId = req.user.id;

    // Convert previous messages into conversation text
    let conversationHistory = "";

    if (Array.isArray(history)) {
      conversationHistory = history
        .map((msg) =>
          msg.sender === "user"
            ? `Patient: ${msg.text}`
            : `Swasth Bot: ${msg.text}`
        )
        .join("\n");
    }

    const prompt = `
You are Swasth Bot, a healthcare assistant inside Swasth-Raho ecosystem.

Rules:
- Give safe, general medical guidance only
- Do NOT diagnose diseases
- Do NOT prescribe medicines
- Always recommend consulting a real doctor if needed

Conversation so far:
${conversationHistory}

Patient: ${message}
Swasth Bot:
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    const aiAnswer = response.text;

    // STORE QUESTION & ANSWER IN DB
    let patientChat = await PatientChatAi.findOne({
      patient_id: patientId,
    });

    if (!patientChat) {
      // First message of patient
      patientChat = new PatientChatAi({
        patient_id: patientId,
        messages: [{ question: message, answer: aiAnswer }],
      });
    } else {
      // Push new message
      patientChat.messages.push({
        question: message,
        answer: aiAnswer,
      });
    }

    await patientChat.save();

    //  Send response as usual
    res.json({
      reply: aiAnswer,
    });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "AI service failed" });
  }
};
