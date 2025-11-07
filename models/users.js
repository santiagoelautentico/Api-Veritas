import mysql from "mysql2/promise";
import bcrypt from 'bcrypt';
// DataBase connection configuration
const config = {
  host: "localhost",
  user: "root",
  port: 3306,
  password: "",
  database: "veritas_db",
};
const connection = await mysql.createConnection(config);

console.log('Conexión a MySQL exitosa');

export class UserModel {
    static async Adminlogin(email, password) {
        try {
            // Primero intentamos encontrar al usuario
            const [userAdm] = await connection.query(
                `SELECT * FROM users WHERE email = ? AND role = 'admin' LIMIT 1`,
                [email]
            );
            if (userAdm.length === 0) {
                return { success: false, message: "Usuario no encontrado" };
            }
            const user = userAdm[0];
            // Comparamos la contraseña con el hash existente
            if (await bcrypt.compare(password, user.password_user)) {
                return { 
                    success: true, 
                    message: "Login exitoso",
                    user 
                };
            } else {
                return { 
                    success: false, 
                    message: "Contraseña incorrecta" 
                };
            }
        } catch (error) {
            console.error('Error en login:', error);
            return { 
                success: false, 
                message: "Error en el servidor", 
                error: error.message 
            };
        }
    }
}