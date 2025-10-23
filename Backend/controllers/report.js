import MedicalReport from "../models/MedicalReport.js";

export const report = async (req, res) => {
  try {
    //  Check role from the decoded token
    const { role } = req.user;

    if (role !== "doctor") {
      return res.status(403).json({
        message: "Access denied. Only doctors can create medical reports.",
      });
    }

    // Extract report details from request body (including doc_id)
    const {
      p_id,
      p_name,
      doc_id,
      doc_name,
      date,
      department,
      disease,
      status,
      symptoms,
      vitals,
      prescription,
      recommendations,
      nextAppointment,
    } = req.body;

    // Create and save report
    const newReport = new MedicalReport({
      p_id,
      p_name,
      doc_id, // coming from frontend
      doc_name,
      date,
      department,
      disease,
      status: status || "pending",
      symptoms,
      vitals,
      prescription,
      recommendations,
      nextAppointment,
    });

    const savedReport = await newReport.save();

    // 4️ Respond with success
    res.status(201).json({
      message: "Medical report created successfully",
      report: savedReport,
    });
  } catch (error) {
    console.error("Error making report:", error);
    res.status(500).json({
      message: "Server error while creating report",
      error: error.message,
    });
  }
};
