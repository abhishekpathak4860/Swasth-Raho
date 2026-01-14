// import express from "express";
// import passport from "passport";
// import { googleSuccessHandler } from "../middleware/googleSuccess.js";

// const router = express.Router();

// /**
//  * STEP 1: Redirect user to Google
//  * role frontend se query me aa raha hai
//  */
// router.get(
//   "/google",
//   (req, res, next) => {
//     const { role } = req.query;
//     if (!role) {
//       return res.status(400).json({ message: "Role is required" });
//     }

//     // role ko session me temporarily store kar lo
//     req.session.role = role;
//     next();
//   },
//   passport.authenticate("google", {
//     scope: ["profile", "email"],
//   })
// );

// /**
//  * STEP 2: Google callback
//  */
// router.get(
//   "/google/callback",
//   passport.authenticate("google", {
//     failureRedirect: `${process.env.FRONTEND_URL}/login`,
//     session: false,
//   }),
//   googleSuccessHandler
// );

// export default router;

// routes/googleAuthRoute.js
import express from "express";
import passport from "passport";
import { googleSuccessHandler } from "../middleware/googleSuccess.js";

const router = express.Router();

router.get(
  "/google",
  (req, res, next) => {
    const { role } = req.query;
    if (!role) {
      return res.status(400).json({ message: "Role is required" });
    }
    // REMOVED: req.session.role = role;
    // We don't need session anymore. Just pass it to the next middleware.
    req.authRole = role;
    next();
  },
  (req, res, next) => {
    passport.authenticate("google", {
      scope: ["profile", "email"],
      state: req.authRole, // Send role to Google here!
    })(req, res, next);
  }
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
    session: false,
  }),
  googleSuccessHandler
);

export default router;
