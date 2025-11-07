import { UserModel } from "../models/users.js";

export class UserController {
    static async Adminlogin(req, res) {
        const { email, password } = req.body;
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
    }
}