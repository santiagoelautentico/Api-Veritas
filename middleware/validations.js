import jwt from "jsonwebtoken";
import { SECRET_JWT_KEY } from "../config/config.js";
export function validateUserRegistration(req, res, next) {
    const { name_user, lastname, username, email, password, id_country } = req.body;
    const errors = [];
    // Verificar campos requeridos individualmente para mensajes más específicos
    if (!name_user) errors.push("Name is required");
    if (!lastname) errors.push("Lastname is required");
    if (!username) errors.push("Username is required");
    if (!email) errors.push("Email is required");
    if (!password) errors.push("Password is required");
    if (!id_country) errors.push("Country is required");
    if (password && password.length < 8) {
        errors.push("Password must be at least 8 characters long");
    }
    if (email && !email.includes("@")) {
        errors.push("Invalid email format");
    }
    // Si hay errores, enviarlos todos juntos
    if (errors.length > 0) {
        return res.status(400).json({ 
            status: "error",
            errors: errors
        });
    }
    next();
}

export function validateLogin(req, res, next) {
    const { email, password } = req.body;
    console.log('Body:', req.body)
    const errors = [];
    
    if (!email || email.trim() === "") {
        errors.push("Email is required");
    } else if (!email.includes("@")) {
        errors.push("Invalid email format");
    };

    if (!password || password.trim() === "") {
        errors.push("Password is required");
    }

    if (errors.length > 0) {
        return res.status(400).json({ 
            status: "error",
            errors: errors
        });
    }
    next();
}

export function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  let token;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_JWT_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
}