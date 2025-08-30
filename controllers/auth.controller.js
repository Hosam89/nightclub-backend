export const login = (req, res) => {
  const { username, password } = req.body;

  // Only one admin account
  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    req.session.user = { role: "admin" };
    return res.json({ message: "Logged in as admin" });
  }

  return res.status(401).json({ message: "Invalid credentials" });
};

export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.clearCookie("connect.sid");
    return res.json({ message: "Logged out successfully" });
  });
};
