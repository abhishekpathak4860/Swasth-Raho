export const googleSuccessHandler = (req, res) => {
  const { token, role } = req.user;

  res.cookie("token", token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production" ? true : false,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const redirects = {
    doctor: "/admin/doctor",
    patient: "/admin/patient",
    hospital_admin: "/admin/hospitalAdmin",
    super_admin: "/admin/superAdmin",
  };

  res.redirect(`${process.env.FRONTEND_URL}${redirects[role]}`);
};
