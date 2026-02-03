// import Doctor from "../models/Doctor.js";

// export const getHospitalDoctors = async (req, res) => {
//   try {
//     // 1. Get the Hospital Admin's ID from the verified token
//     const hospitalId = req.user.id;

//     // 2. Find all doctors where 'hospital_id' matches this admin's ID
//     // We exclude the password field for security
//     const doctors = await Doctor.find({ hospital_id: hospitalId })
//       .select("-password")
//       .sort({ createdAt: -1 }); // Optional: Show newest doctors first

//     // 3. Send response
//     res.status(200).json({
//       success: true,
//       count: doctors.length,
//       doctors: doctors,
//     });
//   } catch (error) {
//     console.error("Error fetching doctors:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server Error while fetching doctors",
//       error: error.message,
//     });
//   }
// };

import Doctor from "../models/Doctor.js";

export const getHospitalDoctors = async (req, res) => {
  try {
    const hospitalId = req.user.id;

    // Pagination Parameters (Default: Page 1, Limit 6)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    // Filter Parameters (Search & Type)
    const search = req.query.search || "";
    const type = req.query.type || "";

    // Build Query
    let query = {
      hospital_id: hospitalId,
      name: { $regex: search, $options: "i" }, // Case-insensitive search
    };

    // Apply Type Filter if selected and not "All"
    if (type && type !== "All") {
      query.type = type;
    }

    // Execute Query with Pagination
    const doctors = await Doctor.find(query)
      .select("-password") // Exclude password
      .sort({ createdAt: -1 }) // Sort by newest
      .skip(skip)
      .limit(limit);

    // Get Total Count for Pagination Logic
    const total = await Doctor.countDocuments(query);

    // --- Calculate Stats (Optimized) ---
    // We fetch a lean version of all docs just for stats to avoid heavy data transfer
    const allDocs = await Doctor.find({ hospital_id: hospitalId }).select(
      "consultationFee experience",
    );

    const totalDoctors = allDocs.length;
    // Assuming experience is stored as a string like "10 years", we parse it.
    // If it's just a number in your DB, remove parseInt.
    const experiencedDocs = allDocs.filter(
      (d) => parseInt(d.experience) > 8,
    ).length;

    const avgFee =
      allDocs.length > 0
        ? Math.round(
            allDocs.reduce(
              (acc, curr) => acc + parseInt(curr.consultationFee || 0),
              0,
            ) / allDocs.length,
          )
        : 0;

    res.status(200).json({
      success: true,
      count: doctors.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      stats: {
        totalDoctors,
        experiencedDocs,
        avgFee,
      },
      doctors,
    });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
