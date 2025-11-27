export const getUserToken = async (req, res) => {
  try {
    if (!req.user) return res.json({ role: null });

    return res.json({ role: req.user.role });
  } catch (err) {
    res.status(500).json({ role: null });
  }
};
