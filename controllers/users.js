import { UserModel } from "../models/users.js";
import { cloudinary } from "../config/cloudinary.js";
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
      const user = await UserModel.loginUserCreator(
        email,
        password,
        identification
      );
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
    if (!req.body) return res.status(400).json({ message: "No body received" });
    console.log("📦 Body recibido:", req.body);
    console.log("🖼️ Picture recibido:", req.body.picture ? "SÍ HAY" : "NO HAY");

    const {
      name_user,
      lastname,
      username,
      email,
      password,
      id_country,
      picture,
    } = req.body;
    try {
      let picture_url = null;

      if (picture) {
        try {
          const uploadResult = await cloudinary.uploader.upload(picture, {
            folder: "users",
            resource_type: "auto",
            transformation: [
              { width: 500, height: 500, crop: "limit" },
              { quality: "auto:good" },
            ],
          });
          picture_url = uploadResult.secure_url;
          console.log("✅ Imagen subida a Cloudinary:", picture_url);
        } catch (uploadError) {
          console.error("❌ Error subiendo a Cloudinary:", uploadError);
          return res.status(500).json({
            message: "Error uploading image",
            error: uploadError.message,
          });
        }
      }
      const newUser = await UserModel.registerRegularUser(
        name_user,
        lastname,
        username,
        email,
        password,
        id_country,
        picture_url
      );
      return res
        .status(201)
        .json({ message: "User Created Perfect", user: newUser });
    } catch (error) {
      console.error("❌ Error general:", error);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  }

  static async registerContentCreator(req, res) {
    if (!req.body) return res.status(400).json({ message: "No body received" });

    console.log("📦 Body recibido:", req.body);
    console.log("🖼️ Picture recibido:", req.body.picture ? "SÍ HAY" : "NO HAY");

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
      picture,
    } = req.body;

    try {
      let picture_url = null;

      if (picture) {
        try {
          const uploadResult = await cloudinary.uploader.upload(picture, {
            folder: "users",
            resource_type: "auto",
            transformation: [
              { width: 918, height: 630, crop: "limit" },
              { quality: "auto:good" },
            ],
          });
          picture_url = uploadResult.secure_url;
          console.log("✅ Imagen subida a Cloudinary:", picture_url);
        } catch (uploadError) {
          console.error("❌ Error subiendo a Cloudinary:", uploadError);
          return res.status(500).json({
            message: "Error uploading image",
            error: uploadError.message,
          });
        }
      }

      const newUser = await UserModel.registerContentCreator(
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
        picture_url // <- pasar la URL, no el base64
      );

      return res
        .status(201)
        .json({ message: "User Created Perfect", user: newUser });
    } catch (error) {
      console.error("❌ Error general:", error);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  }

  static async registerAdminUser(req, res) {
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
      const newAdmin = await UserModel.registerContentCreator(
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
        message: "Content creator registered successfully",
        user: newAdmin,
      });
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
  static async getUserById(req, res) {
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
  }
  static async deleteUser(req, res) {
    const { id_user } = req.params;
    try {
      const result = await UserModel.deleteUser(id_user);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
}
