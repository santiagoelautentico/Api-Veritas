import { Router } from "express";
import { UserModel } from "../models/users.js";
import { generateAuthToken } from "../utils/generateAuthToken.js";
import jwt from 'jsonwebtoken';
import { SECRET_JWT_KEY } from "../config.js";
import { validateUserRegistration, validateLogin } from "../middleware/validations.js";
//-----------------------------------------------------------------------------------------------------
export const usersRouter = Router();
//-----------------------------------------------------------------------------------------------------
// Login routes
usersRouter.post("/adminLogin", validateLogin, async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.loginAdmin(email, password);
        if (user.success) {
            const token = generateAuthToken(res, user.user);
            res.send({user, token});
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
            res.send({user, token});
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
        const user = await UserModel.loginUserCreator(email, password, identification);
        if (user.success) {
            const token = generateAuthToken(res, user.user);
            res.send({user, token});
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});
//-----------------------------------------------------------------------------------------------------
// Registration routes
usersRouter.post("/registerRegularUser", validateUserRegistration ,async (req, res) => {
    const { name_user, lastname, username, email, password, id_country } = req.body;
    try {
        const newUser = await UserModel.registerRegularUser(name_user, lastname, username, email, password, id_country);
        res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
   
});
usersRouter.post("/registerAdminUser", validateUserRegistration ,async (req, res) => {
    const { name_user, lastname, username, email, password, id_country } = req.body;
    try {
        const newAdmin = await UserModel.createAdminUser(name_user, lastname, username, email, password, id_country);
        res.status(201).json({ message: "Admin user registered successfully", user: newAdmin });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
   
});
usersRouter.post("/registerContentCreator", validateUserRegistration ,async (req, res) => {
    const { name_user, lastname, username, email, password, id_country, ocupation, company, type_of_journalist, identification } = req.body;
    try {
        const newCreator = await UserModel.registerContentCreator(name_user, lastname, username, email, password, id_country, ocupation, company, type_of_journalist, identification);
        res.status(201).json({ message: "Content creator registered successfully", user: newCreator });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});
//-----------------------------------------------------------------------------------------------------
// Get all users (admin only)
usersRouter.get("/users", async (req, res) => {
    const token = req.cookies.access_token;
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    try {
        const data = jwt.verify(token, SECRET_JWT_KEY);
        const users = await UserModel.getAllUsers();
        if (data.role !== 'admin') {
            return res.status(403).json({ message: "Access denied", data });
        }
        res.send({ users });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

