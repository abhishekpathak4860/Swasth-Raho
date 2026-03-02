import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { getHospitalData } from "../controllers/getHospitalData.js";
import { getAdminProfile } from "../controllers/getAdminProfile.js";
import { updatedHospitalData } from "../controllers/updatedHospitalData.js";
import { getHospitalDoctors } from "../controllers/getHospitalDoctors.js";
import { getHospitalPatients } from "../controllers/getHospitalPatients.js";
import {
  addDepartment,
  deleteDepartment,
  editDepartment,
} from "../controllers/hospitalDepartments.js";
import {
  updateHospitalAdminPassword,
  updateHospitalAdminProfile,
} from "../controllers/updateHospitalAdminPassword-profile.js";

const router = express.Router();

router.get("/get-hospitalData", getHospitalData);

router.get("/get-profile", verifyToken, getAdminProfile);
router.patch("/update-profile", verifyToken, updatedHospitalData);
router.get("/doctors", verifyToken, getHospitalDoctors);
router.get("/patients", verifyToken, getHospitalPatients);
router.post("/add-department", verifyToken, addDepartment);
router.put("/edit-department", verifyToken, editDepartment);
router.delete("/delete-department", verifyToken, deleteDepartment);
router.patch("/updatePassword", verifyToken, updateHospitalAdminPassword);
router.patch("/update-personalData", verifyToken, updateHospitalAdminProfile);
export default router;
