import { pool } from "../dbConection.js";
import bcrypt from 'bcrypt';

export class UserModel {
// Method to handle admin login
    static async loginAdmin(email, password) {
        try {
            const [userRows] = await pool.query(
                `SELECT * FROM users WHERE email = ? AND role = 'admin' LIMIT 1`,
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
// Method to handle regular user login
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
// Method to handle content creator login
     static async loginUserCreator(email, password, identification) {
        try {
            const [userRows] = await pool.query(
                `SELECT u.*, c.*
                FROM users u
                JOIN content_creator_data c ON u.id_user = c.id_user
                WHERE u.email = ?
                AND c.identification = ?
                AND u.role = 'creator'
                LIMIT 1;`,
                [email, identification]
            );
            if (userRows.length === 0) {
                return { success: false, message: "User not found" };
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
    static async registerRegularUser(name_user, lastname, username, email, password, id_country) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
            'INSERT INTO users (name_user, lastname, username, email, password_user, id_country) VALUES (?, ?, ?, ?, ?, ?)',
            [name_user, lastname, username, email, hashedPassword, id_country]
        );
         return { name_user, lastname, username, email, id_country };
    }
// Method to create an admin user
    static async createAdminUser(name_user, lastname, username, email, password, id_country) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
            'INSERT INTO users (name_user, lastname, username, email, password_user, id_country, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name_user, lastname, username, email, hashedPassword, id_country, 'admin']
        );
         return { name_user, lastname, username, email, id_country, role: 'admin' };
    }

// Add content creator user
    static async registerContentCreator(name_user, lastname, username, email, password, id_country, ocupation, company, type_of_journalist, identification) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            // Primer insert - usuario
            await connection.query(
                'INSERT INTO users (name_user, lastname, username, email, password_user, id_country, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [name_user, lastname, username, email, hashedPassword, id_country, 'creator']
            );
            // Segundo insert - datos del content creator
            await connection.query(
                'INSERT INTO content_creator_data (id_user, ocupation, company, type_of_journalist, identification, status_account) VALUES (LAST_INSERT_ID(), ?, ?, ?, ?, ?)',
                [ocupation, company, type_of_journalist, identification, '0']
            );
            await connection.commit();
            return { 
                name_user, 
                lastname, 
                username, 
                email, 
                id_country, 
                ocupation, 
                company, 
                type_of_journalist, 
                identification, 
                role: 'creator' 
            };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }      
// Get all users
    static async getAllUsers() {
        const [users] = await pool.query('SELECT * FROM users');
        return users;
    }

}


