import MedicalReport from "../models/MedicalReport.js";

export const UpdateReportData = async (req, res) => {
  try {
    // Get report ID from params
    const { reportId } = req.params;

    // Get updated data from request body
    const updatedData = req.body;

    // Find and update report
    const updatedReport = await MedicalReport.findByIdAndUpdate(
      reportId,
      { $set: updatedData },
      { new: true } // return the updated document
    );

    if (!updatedReport) {
      return res.status(404).json({ message: "Medical report not found" });
    }

    res.status(200).json({
      message: "Medical report updated successfully!",
      report: updatedReport,
    });
  } catch (error) {
    console.error("Error editing report:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
