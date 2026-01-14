import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";

import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";
import HospitalAdmin from "../models/HospitalAdmin.js";
import SuperAdmin from "../models/SuperAdmin.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const role = req.query.state || null;

        if (!role) {
          return done(null, false, { message: "Role missing" });
        }

        let user;

        if (role === "doctor") {
          user = await Doctor.findOne({ email });
        } else if (role === "patient") {
          user = await Patient.findOne({ email });
        } else if (role === "hospital_admin") {
          user = await HospitalAdmin.findOne({ email });
        } else if (role === "super_admin") {
          user = await SuperAdmin.findOne({ email });
        }

        if (!user) {
          return done(null, false, {
            message: "Email not registered. Please sign up first.",
          });
        }

        // JWT generate
        const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, {
          expiresIn: "7d",
        });

        return done(null, {
          token,
          role,
        });
      } catch (err) {
        done(err, null);
      }
    }
  )
);
