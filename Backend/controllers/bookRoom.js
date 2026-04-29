import mongoose from "mongoose";
import RoomBooking from "../models/RoomBooking.js";
import HospitalAdmin from "../models/HospitalAdmin.js";

export const bookRoom = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const { hospitalId, patientName, phone, roomType, rooms } = req.body;

    const patientId = req.user.id; //  coming from verifyToken

    //  Find hospital
    const hospital = await HospitalAdmin.findById(hospitalId);

    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    //  Check availability
    if (roomType === "AC" && hospital.ac_rooms < rooms) {
      return res.status(400).json({ message: "Not enough AC rooms" });
    }

    if (roomType === "Non-AC" && hospital.non_ac_rooms < rooms) {
      return res.status(400).json({ message: "Not enough Non-AC rooms" });
    }

    if (roomType === "ICU" && hospital.icu_beds < rooms) {
      return res.status(400).json({ message: "Not enough ICU beds" });
    }

    //  Deduct rooms
    if (roomType === "AC") {
      hospital.ac_rooms -= rooms;
    } else if (roomType === "Non-AC") {
      hospital.non_ac_rooms -= rooms;
    } else if (roomType === "ICU") {
      hospital.icu_beds -= rooms;
    }

    hospital.total_rooms =
      hospital.ac_rooms + hospital.non_ac_rooms + hospital.icu_beds;

    await hospital.save();

    // Save booking
    const booking = await RoomBooking.create({
      hospitalId,
      patientId,
      patientName,
      phone,
      roomType,
      rooms,
    });

    // COMMIT TRANSACTION

    await session.commitTransaction();
    session.endSession();
    res.status(201).json({
      message: "Room booked successfully",
      booking,
    });
  } catch (error) {
    // ROLLBACK if anything fails

    await session.abortTransaction();
    session.endSession();
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
