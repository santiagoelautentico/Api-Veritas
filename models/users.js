import { pool } from "../dbConection.js";
import bcrypt from "bcrypt";

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
          user,
        };
      } else {
        return {
          success: false,
          message: "Incorrect password",
        };
      }
    } catch (error) {
      console.error("Error en login:", error);
      return {
        success: false,
        message: "Server failed",
        error: error.message,
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
          user,
        };
      } else {
        return {
          success: false,
          message: "Incorrect password",
        };
      }
    } catch (error) {
      console.error("Error en login:", error);
      return {
        success: false,
        message: "Server failed",
        error: error.message,
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
                AND (u.role = 'creator' OR u.role = 'admin')
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
          user,
        };
      } else {
        return {
          success: false,
          message: "Incorrect password",
        };
      }
    } catch (error) {
      console.error("Error en login:", error);
      return {
        success: false,
        message: "Server failed",
        error: error.message,
      };
    }
  }
  // Method to register a new user
  static async registerRegularUser(
    name_user,
    lastname,
    username,
    email,
    password,
    id_country,
    picture_url
  ) {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO users (name_user, lastname, username, email, password_user, id_country, picture) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        name_user,
        lastname,
        username,
        email,
        hashedPassword,
        id_country,
        picture_url,
      ]
    );
    return { name_user, lastname, username, email, id_country, picture_url };
  }
  // Method to create an admin user
  static async createAdminUser(
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
  ) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      await connection.query(
        "INSERT INTO users (name_user, lastname, username, email, password_user, id_country, role) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          name_user,
          lastname,
          username,
          email,
          hashedPassword,
          id_country,
          "admin",
        ]
      );
      await connection.query(
        "INSERT INTO content_creator_data (id_user, ocupation, company, type_of_journalist, identification, status_account, biography) VALUES (LAST_INSERT_ID(), ?, ?, ?, ?, ?, ?)",
        [ocupation, company, type_of_journalist, identification, "1", biography]
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
        biography,
        role: "admin",
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
  // Add content creator user
  static async registerContentCreator(
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
    picture_url
  ) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      await connection.query(
        "INSERT INTO users (name_user, lastname, username, email, password_user, id_country, role, picture) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          name_user,
          lastname,
          username,
          email,
          hashedPassword,
          id_country,
          "creator",
          picture_url,
        ]
      );
      await connection.query(
        "INSERT INTO content_creator_data (id_user, ocupation, company, type_of_journalist, identification, status_account, biography) VALUES (LAST_INSERT_ID(), ?, ?, ?, ?, ?, ?)",
        [ocupation, company, type_of_journalist, identification, "0", biography]
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
        biography,
        role: "regular",
        picture_url,
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
    const [users] = await pool.query("SELECT * FROM users");
    return users;
  }
  static async getUserById(id_user) {
    const [users] = await pool.query(
      ` SELECT users.*, content_creator_data.ocupation, content_creator_data.company, content_creator_data.type_of_journalist, content_creator_data.identification, content_creator_data.status_account, content_creator_data.biography FROM users LEFT JOIN content_creator_data ON users.id_user = content_creator_data.id_user WHERE users.id_user = ? `,
      [id_user]
    );
    return users[0];
  }
  static async deleteUser(id_user) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      await connection.query("DELETE FROM news WHERE id_user = ?", [id_user]);

      await connection.query(
        "DELETE FROM content_creator_data WHERE id_user = ?",
        [id_user]
      );

      await connection.query("DELETE FROM users WHERE id_user = ?", [id_user]);

      await connection.commit();

      return { message: "User deleted successfully" };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
  static async updateContentCreator(
    id_user,
    username,
    picture_url,
    company,
    type_of_journalist,
    password = null
  ) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Preparar la query de users según si viene contraseña o no
      let userQuery;
      let userParams;

      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        userQuery =
          "UPDATE users SET username = ?, picture = ?, password_user = ? WHERE id_user = ?";
        userParams = [username, picture_url, hashedPassword, id_user];
      } else {
        userQuery =
          "UPDATE users SET username = ?, picture = ? WHERE id_user = ?";
        userParams = [username, picture_url, id_user];
      }

      // Actualizar tabla users
      await connection.query(userQuery, userParams);

      // Actualizar tabla content_creator_data
      await connection.query(
        "UPDATE content_creator_data SET company = ?, type_of_journalist = ? WHERE id_user = ?",
        [company, type_of_journalist, id_user]
      );

      await connection.commit();

      return {
        id_user,
        username,
        picture_url,
        company,
        type_of_journalist,
        passwordUpdated: !!password,
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}
