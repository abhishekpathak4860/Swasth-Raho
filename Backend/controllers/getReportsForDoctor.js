import MedicalReport from "../models/MedicalReport.js";

export const getReportsForDoctor = async (req, res) => {
  try {
    const { id, role } = req.user; // Extracted from token by verifyToken middleware

    // Ensure only patients can access this route
    if (role !== "doctor") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Fetch all medical reports where p_id matches patient's id
    const reports = await MedicalReport.find({
      doc_id: id,
    });

    // If no reports found, return empty array with message
    if (!reports || reports.length === 0) {
      return res.status(200).json({
        message: "No reports found for this patient",
        reports: [],
      });
    }

    // Send the reports back to frontend
    res.status(200).json({
      message: "Reports fetched successfully",
      reports,
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({
      message: "Server error while fetching reports",
      error: error.message,
    });
  }
};
