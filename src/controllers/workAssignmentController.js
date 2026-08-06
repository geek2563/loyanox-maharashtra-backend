import WorkAssignment from "../models/WorkAssignmentModel.js";
import User from "../models/UserModel.js";
import {
  createOne,
  getAll,
  updateBySlug,
  deleteBySlug,
  getBySlug,
} from "./factoryController.js";

// Custom methods for work assignments
export const createWorkAssignment = async (req, res) => {
  try {
    console.log("Received work assignment request body:", req.body);
    console.log("User from request:", req.user);

    const {
      userId,
      assignmentType,
      permissions,
      notes,
      startDate,
      endDate,
      ...assignmentData
    } = req.body;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Use user's existing role
    const userRole = user.role;

    // Create work assignment
    const workAssignmentData = {
      user: userId,
      assignedBy: req.user ? req.user._id : userId, // Fallback to userId if req.user is not available
      role: userRole,
      assignmentType,
      permissions: permissions || {
        canCreate: true,
        canEdit: true,
        canDelete: false,
        canView: true,
      },
      notes,
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : null,
      ...assignmentData,
    };

    console.log("Creating work assignment with data:", workAssignmentData);
    const workAssignment = await WorkAssignment.create(workAssignmentData);
    console.log("Work assignment created:", workAssignment);

    const populatedAssignment = await WorkAssignment.findById(
      workAssignment._id,
    )
      .populate("user", "name email role")
      .populate("assignedBy", "name email");

    res.status(201).json({
      success: true,
      data: populatedAssignment,
    });
  } catch (error) {
    console.error("Error creating work assignment:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getWorkAssignments = async (req, res) => {
  try {
    const { userId, role, status } = req.query;
    const filter = {};

    if (userId) filter.user = userId;
    if (role) filter.role = role;
    if (status) filter.status = status;

    const assignments = await WorkAssignment.find(filter)
      .populate("user", "name email role")
      .populate("assignedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: assignments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getWorkAssignment = async (req, res) => {
  try {
    const assignment = await WorkAssignment.findById(req.params.id)
      .populate("user", "name email role")
      .populate("assignedBy", "name email");

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Work assignment not found",
      });
    }

    res.status(200).json({
      success: true,
      data: assignment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateWorkAssignment = async (req, res) => {
  try {
    const assignment = await WorkAssignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Work assignment not found",
      });
    }

    // Update user role if changed
    if (req.body.role && assignment.user) {
      const user = await User.findById(assignment.user);
      if (user && user.role !== req.body.role) {
        user.role = req.body.role;
        await user.save();
      }
    }

    Object.assign(assignment, req.body);
    await assignment.save();

    const updatedAssignment = await WorkAssignment.findById(req.params.id)
      .populate("user", "name email role")
      .populate("assignedBy", "name email");

    res.status(200).json({
      success: true,
      data: updatedAssignment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteWorkAssignment = async (req, res) => {
  try {
    const assignment = await WorkAssignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Work assignment not found",
      });
    }

    await assignment.deleteOne();

    res.status(200).json({
      success: true,
      message: "Work assignment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserAssignments = async (req, res) => {
  try {
    // Use req.params.userId if available (for superadmin viewing specific user)
    // Otherwise use req.user._id (for current user viewing their own assignments)
    const userId = req.params.userId || req.user._id;

    const assignments = await WorkAssignment.find({
      user: userId,
      status: "active",
    })
      .populate("assignedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: assignments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
