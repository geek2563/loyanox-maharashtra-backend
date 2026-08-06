export const superAdminOnly = async (req, res, next) => {
  try {
    if (req.user.role !== "superadmin") {
      return res.status(403).json({
        message: "Only superadmin can perform this action",
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Authorization failed",
    });
  }
};
