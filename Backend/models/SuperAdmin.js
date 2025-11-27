import mongoose from "mongoose";

const superAdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "super_admin" },
  profileImg: { type: String, default: "" },
});

const SuperAdmin = mongoose.model("SuperAdmin", superAdminSchema);
export default SuperAdmin;
