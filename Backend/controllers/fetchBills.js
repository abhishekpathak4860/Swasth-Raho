import Payment from "../models/Payment.js";

export const fetchBills = async (req, res) => {
  try {
    const { id: patientId, role } = req.user;

    if (role !== "patient") {
      return res.status(403).json({
        message: "access denied",
      });
    }

    // Fetch all payments where doc_id matches logged-in doctor ID
    const payments = await Payment.find({ p_id: patientId });

    res.status(200).json({
      message: "Payments fetched successfully",
      payments,
    });
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
