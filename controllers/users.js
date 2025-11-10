import { UserModel } from "../models/users.js";
export class UserController {
// Method for admin login
    static async loginAdmin(req, res) {
        const { email, password } = req.body;
        try {
            const user = await UserModel.loginAdmin(email, password);
            if (user) {
                res.status(200).json({ message: "Login successful", user });
            } else {
                res.status(401).json({ message: "Invalid credentials" });
            }
        } catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }
    static async loginUser(req, res) {
        const { email, password } = req.body;
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
    }
    static async loginUserCreator(req, res) {
        const { email, password, identification } = req.body;
        try {
            const user = await UserModel.loginUserCreator(email, password, identification);
            if (user) {
                res.status(200).json({ message: "Login successful", user });
            } else {
                res.status(401).json({ message: "Invalid credentials" });
            }
        } catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }
// New method for user registration
    static async registerRegularUser(req, res) {
        const {name_user, lastname, username, email, password, id_country } = req.body;
        try {
            const newUser = await UserModel.registerRegularUser(name_user, lastname, username, email, password, id_country);
            res.status(201).json({ message: "User registered successfully", user: newUser });
        } catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }
    static async registerContentCreator(req, res) {
        const {name_user, lastname, username, email, password, id_country, ocupation, company, type_of_journalist, identification } = req.body;
        try {
            const newCreator = await UserModel.registerContentCreator(name_user, lastname, username, email, password, id_country, ocupation, company, type_of_journalist, identification);
            res.status(201).json({ message: "Content creator registered successfully", user: newCreator });
        } catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }   
    static async registerAdminUser(req, res) {
        const {name_user, lastname, username, email, password, id_country } = req.body;
        try {
            const newAdmin = await UserModel.createAdminUser(name_user, lastname, username, email, password, id_country);
            res.status(201).json({ message: "Admin user registered successfully", user: newAdmin });
        } catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }
// Method to get all users
    static async getAllUsers(req, res) {
        try {
            const users = await UserModel.getAllUsers();
            res.status(200).json({ users });
        } catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }
}