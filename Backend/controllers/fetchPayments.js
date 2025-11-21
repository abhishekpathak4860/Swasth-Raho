import Payment from "../models/Payment.js";

export const fetchPayments = async (req, res) => {
  try {
    const { id: doctorId, role } = req.user;

    if (role !== "doctor") {
      return res.status(403).json({
        message: "access denied",
      });
    }

    // Fetch all payments where doc_id matches logged-in doctor ID
    const payments = await Payment.find({ doc_id: doctorId });

    res.status(200).json({
      message: "Payments fetched successfully",
      payments,
    });
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
