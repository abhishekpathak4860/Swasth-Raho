// import Doctor from "../models/Doctor.js";
// import Patient from "../models/Patient.js";

// export const getHospitalPatients = async (req, res) => {
//   try {
//     const hospitalId = req.user.id;

//     // Pagination Parameters (Default: Page 1, Limit 6)
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 6;
//     const skip = (page - 1) * limit;

//     // Search Query (Search by Name)
//     const search = req.query.search || "";

//     // 1. Find all doctors belonging to this hospital to get their patient lists
//     const doctors = await Doctor.find({ hospital_id: hospitalId }).select(
//       "patient_ids",
//     );

//     // 2. Extract all patient IDs into a single flat array
//     const patientIds = doctors.reduce((acc, doc) => {
//       return acc.concat(doc.patient_ids);
//     }, []);

//     // Remove duplicate IDs (if any patient is treated by multiple doctors)
//     const uniquePatientIds = [...new Set(patientIds)];

//     // 3. Build Patient Query
//     let query = {
//       _id: { $in: uniquePatientIds },
//       name: { $regex: search, $options: "i" }, // Case-insensitive search
//     };

//     // 4. Execute Query with Pagination
//     const patients = await Patient.find(query)
//       .select("-password") // Exclude sensitive info
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit);

//     // Get Total Count for Pagination Logic
//     const total = await Patient.countDocuments(query);

//     // --- Calculate Stats ---
//     // Fetch all patients (lightweight) for stats calculation
//     const allPatients = await Patient.find({
//       _id: { $in: uniquePatientIds },
//     }).select("age");

//     const totalPatients = allPatients.length;

//     // Example Stat: Patients under 18 (Pediatric)
//     const pediatricPatients = allPatients.filter((p) => p.age < 18).length;

//     // Example Stat: Senior Citizens (> 60)
//     const seniorPatients = allPatients.filter((p) => p.age > 60).length;

//     res.status(200).json({
//       success: true,
//       count: patients.length,
//       total,
//       totalPages: Math.ceil(total / limit),
//       currentPage: page,
//       stats: {
//         totalPatients,
//         pediatricPatients,
//         seniorPatients,
//       },
//       patients,
//     });
//   } catch (error) {
//     console.error("Error fetching patients:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//       error: error.message,
//     });
//   }
// };

import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";

export const getHospitalPatients = async (req, res) => {
  try {
    const hospitalId = req.user.id;

    // Pagination & Filter Parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";
    const doctorId = req.query.doctorId || ""; // New parameter

    // 1. Determine which doctors to look at
    let doctorQuery = { hospital_id: hospitalId };

    // If a specific doctor is selected, filter by that ID
    if (doctorId && doctorId !== "All") {
      doctorQuery._id = doctorId;
    }

    // 2. Find doctors matching the criteria (All or Specific)
    const doctors = await Doctor.find(doctorQuery).select("patient_ids");

    // 3. Extract all patient IDs into a single flat array
    const patientIds = doctors.reduce((acc, doc) => {
      return acc.concat(doc.patient_ids);
    }, []);

    // Remove duplicate IDs
    const uniquePatientIds = [...new Set(patientIds)];

    // 4. Build Patient Query
    let patientQuery = {
      _id: { $in: uniquePatientIds },
      name: { $regex: search, $options: "i" },
    };

    // 5. Execute Query with Pagination
    const patients = await Patient.find(patientQuery)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get Total Count
    const total = await Patient.countDocuments(patientQuery);

    // Fetch all matching patients (lightweight) for stats
    const statsPatients = await Patient.find({
      _id: { $in: uniquePatientIds },
    }).select("age");

    const totalPatients = statsPatients.length;
    const pediatricPatients = statsPatients.filter((p) => p.age < 18).length;
    const seniorPatients = statsPatients.filter((p) => p.age > 60).length;

    res.status(200).json({
      success: true,
      count: patients.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      stats: {
        totalPatients,
        pediatricPatients,
        seniorPatients,
      },
      patients,
    });
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
