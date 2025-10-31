import mongoose from "mongoose";

const hospitalAdminSchema = new mongoose.Schema(
  {
    // Basic Info
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "hospital_admin" },

    //Hospital Details
    hospital_name: { type: String, required: true },
    hospital_type: { type: String, required: true }, // e.g., Neurology, Cardiology
    hospital_description: { type: String },
    year_established: { type: Number },
    hospital_address: { type: String, required: true },
    contact_number: { type: String },
    emergency_number: { type: String },
    hospital_duration: { type: String, required: true },
    organisation_type: {
      type: String,
      enum: ["government", "private"],
      default: "private",
    },

    // Room & Facility Details
    total_rooms: { type: Number, default: 0 },
    ac_rooms: { type: Number, default: 0 },
    non_ac_rooms: { type: Number, default: 0 },
    icu_beds: { type: Number, default: 0 },
    ambulances: { type: Number, default: 0 },

    // Services & Facilities
    departments: { type: [String], default: [] },
    lab_facilities: { type: [String], default: [] },
    connected_pharmacies: { type: [String], default: [] },
    payment_modes: { type: [String], default: [] },
    insurance_partners: { type: [String], default: [] },

    // Availability / Booleans
    emergency_available: { type: Boolean, default: false },
    teleconsultation_available: { type: Boolean, default: false },
    parking_available: { type: Boolean, default: false },
    canteen_available: { type: Boolean, default: false },

    // Legal / Accreditation
    accreditation: { type: String },
    license_number: { type: String },

    //  Ratings & Reviews
    rating: { type: Number, default: 0 },
    total_reviews: { type: Number, default: 0 },

    //  Finance
    Total_Revenue_Hospital: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const HospitalAdmin = mongoose.model("HospitalAdmin", hospitalAdminSchema);
export default HospitalAdmin;
