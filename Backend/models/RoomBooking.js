import mongoose from "mongoose";

const roomBookingSchema = new mongoose.Schema(
  {
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HospitalAdmin",
      required: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    patientName: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    roomType: {
      type: String,
      enum: ["AC", "Non-AC", "ICU"],
      required: true,
    },

    rooms: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

const RoomBooking = mongoose.model("RoomBooking", roomBookingSchema);
export default RoomBooking;
