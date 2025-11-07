import { pool } from "../dbConection.js";
import bcrypt from 'bcrypt';

export class UserModel {
    // Method to handle admin login
    static async Adminlogin(email, password) {
        try {
            // First we try to find the user
            const [userAdm] = await pool.query(
                `SELECT * FROM users WHERE email = ? AND role = 'admin' LIMIT 1`,
                [email]
            );
            if (userAdm.length === 0) {
                return { success: false, message: "User not found"};
            }
            const user = userAdm[0];
            // We coompare the password with the existing hash
            if (await bcrypt.compare(password, user.password_user)) {
                return { 
                    success: true, 
                    message: "Correct Login",
                    user 
                };
            } else {
                return { 
                    success: false, 
                    message: "Incorrect password" 
                };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { 
                success: false, 
                message: "Error in the server", 
                error: error.message 
            };
        }
    }

    static async loginUser(email, password) {
        try {
            const [userRows] = await pool.query(
                `SELECT * FROM users WHERE email = ? AND role = 'regular' LIMIT 1`,
                [email]
            );
            if (userRows.length === 0) {
                return { success: false, message: "Usuario no encontrado" };
            }
            const user = userRows[0];
            if (await bcrypt.compare(password, user.password_user)) {
                return { 
                    success: true, 
                    message: "Correct login",
                    user 
                };
            } else {
                return { 
                    success: false, 
                    message: "Incorrect password" 
                };
            }
        } catch (error) {
            console.error('Error en login:', error);
            return { 
                success: false, 
                message: "Server failed", 
                error: error.message 
            };
        }
    }

// Method to register a new user
    static async registerRegularUser(name_user, lastname, username, email, password, id_country, company, type_of_journalist, identification) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
            'INSERT INTO users (name_user, lastname, username, email, password_user, id_country, company, type_of_journalist, identification) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [name_user, lastname, username, email, hashedPassword, id_country, company, type_of_journalist, identification]
        );
         return { name_user, lastname, username, email, id_country };
    }
// Get all users
    static async getAllUsers() {
        const [users] = await pool.query('SELECT * FROM users');
        return users;
    }


}


