const requireAuth = (req, res, next) => {
  if (req.session.user) {
    req.userRole = req.session.user.role;
  } else {
    req.userRole = "read";
  }
  next();
};

export default requireAuth;
