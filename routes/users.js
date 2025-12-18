import { Router } from "express";
import { UserModel } from "../models/users.js";
import { UserController } from "../controllers/users.js";
import { generateAuthToken } from "../utils/generateAuthToken.js";
import jwt from "jsonwebtoken";
import { SECRET_JWT_KEY } from "../config/config.js";
import multer from "multer";
import {
  validateUserRegistration,
  validateLogin,
} from "../middleware/validations.js";
//-----------------------------------------------------------------------------------------------------
export const usersRouter = Router();
const upload = multer({ dest: "uploads/" });
//-----------------------------------------------------------------------------------------------------
// Login routes
usersRouter.post("/adminLogin", validateLogin, async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.loginAdmin(email, password);
    if (user.success) {
      const token = generateAuthToken(res, user.user);
      res.send({ user, token });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
usersRouter.post("/loginUser", validateLogin, async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.loginUser(email, password);
    if (user.success) {
      const token = generateAuthToken(res, user.user);
      res.json({ user, token });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
usersRouter.post("/loginUserCreator", validateLogin, async (req, res) => {
  const { email, password, identification } = req.body;
  try {
    const user = await UserModel.loginUserCreator(
      email,
      password,
      identification
    );
    if (user.success) {
      const token = generateAuthToken(res, user.user);
      res.send({ user, token });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
//-----------------------------------------------------------------------------------------------------
// Register Content Creator
usersRouter.post(
  "/registerContentCreator",
  upload.single("image"),
  validateUserRegistration,
  async (req, res) => {
    try {
      console.log("Route: req.file:", !!req.file);
      console.log("Route: req.body keys:", Object.keys(req.body));
      await UserController.registerContentCreator(req, res);
    } catch (error) {
      console.log("❌ Error en route:", error.message);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);
usersRouter.post(
  "/registerRegularUser",
  upload.single("image"),
  validateUserRegistration,
  async (req, res) => {
    try {
      console.log("Route: req.file:", !!req.file);
      console.log("Route: req.body keys:", Object.keys(req.body));
      await UserController.registerRegularUser(req, res);
    } catch (error) {
      console.log("❌ Error en route:", error.message);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);
usersRouter.post(
  "/registerAdminUser",
  validateUserRegistration,
  async (req, res) => {
    const {
      name_user,
      lastname,
      username,
      email,
      password,
      id_country,
      ocupation,
      company,
      type_of_journalist,
      identification,
      biography,
    } = req.body;
    try {
      const newAdmin = await UserModel.createAdminUser(
        name_user,
        lastname,
        username,
        email,
        password,
        id_country,
        ocupation,
        company,
        type_of_journalist,
        identification,
        biography
      );
      res.status(201).json({
        message: "Admin registered successfully",
        user: newAdmin,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

//-----------------------------------------------------------------------------------------------------
// Get all users (admin only)
usersRouter.get("/users", async (req, res) => {
  // Lee el token del header Authorization
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // Extrae "TOKEN" de "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const data = jwt.verify(token, SECRET_JWT_KEY);

    if (data.role !== "admin") {
      return res.status(403).json({ message: "Access denied", data });
    }

    const users = await UserModel.getAllUsers();
    res.send({ users });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
// Get user by ID
usersRouter.get("/users/:id_user", async (req, res) => {
  const { id_user } = req.params;
  try {
    const user = await UserModel.getUserById(id_user);
    if (user) {
      res.status(200).json({ user });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
usersRouter.delete("/users/:id_user", async (req, res) => {
  const { id_user } = req.params;
  try {
    const result = await UserModel.deleteUser(id_user);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
usersRouter.put(
  "/users/content-creator/:id_user",
  UserController.updateContentCreator
);
