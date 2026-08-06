import WorkAssignment from "../models/WorkAssignmentModel.js";

/**
 * Middleware to check if user has permission to perform an action on a specific assignment
 * @param {string} permission - The permission to check (canCreate, canEdit, canDelete, canView)
 */
export const checkPermission = (permission) => {
  return async (req, res, next) => {
    try {
      if (req.user && req.user.role === "superadmin") {
        return next();
      }

      const userId = req.user?._id || req.user?.id;
      const assignmentId = req.params.assignmentId || req.body.assignmentId;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      // Find the user's work assignment
      const assignment = await WorkAssignment.findOne({
        user: userId,
        _id: assignmentId,
      });

      if (!assignment) {
        return res.status(403).json({ message: "Assignment not found" });
      }

      // Check if user has the required permission
      if (!assignment.permissions || !assignment.permissions[permission]) {
        return res.status(403).json({
          message: `You do not have permission to ${permission.replace("can", "").toLowerCase()}`,
        });
      }

      // Attach assignment to request for use in next middleware
      req.assignment = assignment;
      next();
    } catch (error) {
      console.error("Permission check error:", error);
      res.status(500).json({ message: "Error checking permissions" });
    }
  };
};

/**
 * Middleware to check if user has permission for a specific geographic area
 * @param {string} permission - The permission to check (canCreate, canEdit, canDelete, canView)
 */
export const checkGeographicPermission = (permission) => {
  return async (req, res, next) => {
    try {
      // Superadmin bypasses permission checks
      if (req.user && req.user.role === "superadmin") {
        return next();
      }

      const userId = req.user?._id || req.user?.id;
      const { division, district, taluka, settlementType, settlementSlug, institutionType } =
        { ...req.params, ...req.body };

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      // Find the user's active work assignments
      const assignments = await WorkAssignment.find({
        user: userId,
        status: "active",
      });

      if (!assignments || assignments.length === 0) {
        return res.status(403).json({ message: "No active assignments found for this user" });
      }

      // Check if any assignment matches the requested geographic area and has the permission
      const hasPerm = assignments.some((assignment) => {
        if (!assignment.permissions || !assignment.permissions[permission]) {
          return false;
        }

        // Global / Add Divisions assignment
        if (assignment.assignmentType === "add_divisions") {
          if (!division && !district && !taluka) {
            return true;
          }
          return !division || assignment.assignedRegion === division;
        }

        // Division level assignment
        if (assignment.assignmentType === "division") {
          if (!division) return true;
          return assignment.assignedRegion === division;
        }

        // District level assignment
        if (assignment.assignmentType === "district") {
          if (!division && !district) return true;
          if (division && assignment.assignedDivision && assignment.assignedDivision !== division) {
            return false;
          }
          if (district && assignment.assignedRegion !== district) {
            return false;
          }
          return true;
        }

        // Taluka, Settlement, or Institution level assignment
        if (
          ["taluka", "settlement_type", "institution_type"].includes(
            assignment.assignmentType,
          )
        ) {
          if (division && assignment.assignedDivision && assignment.assignedDivision !== division) {
            return false;
          }
          if (district && assignment.assignedDistrict && assignment.assignedDistrict !== district) {
            return false;
          }
          if (taluka && assignment.assignedTaluka && assignment.assignedTaluka !== taluka) {
            return false;
          }
          if (settlementType && assignment.settlementType && assignment.settlementType !== settlementType) {
            return false;
          }
          if (settlementSlug && assignment.settlementSlug && assignment.settlementSlug !== settlementSlug) {
            return false;
          }
          if (institutionType && assignment.institutionType && assignment.institutionType !== institutionType) {
            return false;
          }
          return true;
        }

        return false;
      });

      if (!hasPerm) {
        return res.status(403).json({
          message: `You do not have permission to ${permission.replace("can", "").toLowerCase()} in this region`,
        });
      }

      next();
    } catch (error) {
      console.error("Geographic permission check error:", error);
      res.status(500).json({ message: "Error checking geographic permissions" });
    }
  };
};

