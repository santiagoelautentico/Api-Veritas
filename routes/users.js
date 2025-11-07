import { Router } from "express";
import { UserModel } from "../models/users.js";
import { validateUserRegistration, validateLoginRegular } from "../middleware/validations.js";
export const usersRouter = Router();

usersRouter.get("/Adminlogin", async (req, res) => {
    const { email, password } = req.query;
    try {
        const user = await UserModel.Adminlogin(email, password);
        if (user) {
            res.status(200).json({ message: "Login successful", user });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

usersRouter.get("/loginUser", validateLoginRegular, async (req, res) => {
    const { email, password } = req.query;
    try {
        const user = await UserModel.loginUser(email, password);
        if (user) {
            res.status(200).json({ message: "Login successful", user });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

usersRouter.post("/registerRegularUser", validateUserRegistration ,async (req, res) => {
    const { name_user, lastname, username, email, password, id_country, company, type_of_journalist, identification } = req.body;
    try {
        const newUser = await UserModel.registerRegularUser(name_user, lastname, username, email, password, id_country, company, type_of_journalist, identification);
        res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
   
});

usersRouter.get("/users", async (req, res) => {
    try {
        const users = await UserModel.getAllUsers();
        res.status(200).json({ users });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

