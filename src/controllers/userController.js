import User from "../models/UserModel.js";
import {
  getAll,
  getOne,
  updateBySlug,
  deleteBySlug,
} from "./factoryController.js";

export const getUsers = getAll(User);
export const getUser = getOne(User);
export const updateUser = updateBySlug(User);
export const deleteUser = async (req, res) => {
  try {
    const userToDelete = await User.findById(req.params.id);

    if (!userToDelete) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent deleting superadmin users
    if (userToDelete.role === "superadmin") {
      return res.status(403).json({
        success: false,
        message: "Cannot delete superadmin users",
      });
    }

    // Prevent deleting yourself
    if (req.user._id.toString() === req.params.id) {
      return res.status(403).json({
        success: false,
        message: "Cannot delete your own account",
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Create user (password will be hashed by pre-save hook)
    const user = await User.create({
      name,
      email,
      password,
      role: role || "viewer",
    });

    // Return user without password
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: userResponse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMe = async (req, res) => {
  try {
    // Get the currently authenticated user from the request (set by protect middleware)
    const currentUser = req.user;

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found in database.",
      });
    }

    res.status(200).json({
      success: true,
      data: currentUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
