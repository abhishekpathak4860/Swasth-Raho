import HospitalAdmin from "../models/HospitalAdmin.js";

// --- ADD DEPARTMENT ---
export const addDepartment = async (req, res) => {
  try {
    const { department } = req.body;
    const hospitalId = req.user.id;

    if (!department) {
      return res.status(400).json({ message: "Department name is required" });
    }

    const hospital = await HospitalAdmin.findById(hospitalId);
    if (!hospital)
      return res.status(404).json({ message: "Hospital not found" });

    // Check for duplicate (Case insensitive check optional, doing strict for now as requested)
    if (hospital.departments.includes(department)) {
      return res.status(400).json({ message: "Department already exists" });
    }

    // Add to array
    hospital.departments.push(department);
    await hospital.save();

    res
      .status(200)
      .json({
        success: true,
        message: "Department added successfully",
        departments: hospital.departments,
      });
  } catch (error) {
    console.error("Add Department Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// --- EDIT DEPARTMENT ---
export const editDepartment = async (req, res) => {
  try {
    const { oldName, newName } = req.body;
    const hospitalId = req.user.id;

    if (!oldName || !newName) {
      return res
        .status(400)
        .json({ message: "Old and New names are required" });
    }

    const hospital = await HospitalAdmin.findById(hospitalId);

    // Check if new name already exists (and is not the same as old name)
    if (newName !== oldName && hospital.departments.includes(newName)) {
      return res
        .status(400)
        .json({ message: "Department with this name already exists" });
    }

    // Find index and update
    const index = hospital.departments.indexOf(oldName);
    if (index === -1) {
      return res.status(404).json({ message: "Original department not found" });
    }

    hospital.departments[index] = newName;
    await hospital.save();

    res
      .status(200)
      .json({
        success: true,
        message: "Department updated successfully",
        departments: hospital.departments,
      });
  } catch (error) {
    console.error("Edit Department Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// --- DELETE DEPARTMENT ---
export const deleteDepartment = async (req, res) => {
  try {
    const { department } = req.body;
    const hospitalId = req.user.id;

    if (!department) {
      return res.status(400).json({ message: "Department name is required" });
    }

    // Use $pull to remove item from array
    const result = await HospitalAdmin.findByIdAndUpdate(
      hospitalId,
      { $pull: { departments: department } },
      { new: true }, // Return updated doc
    );

    if (!result) return res.status(404).json({ message: "Hospital not found" });

    res
      .status(200)
      .json({
        success: true,
        message: "Department deleted successfully",
        departments: result.departments,
      });
  } catch (error) {
    console.error("Delete Department Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
