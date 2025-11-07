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
    if (name_user && !name_user.match(/^[a-zA-Z0-9_]+$/)) {
        errors.push("Username can only contain letters, numbers, and underscores");
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

export function validateLoginRegular(req, res, next) {
    const { email, password } = req.query;
    const errors = [];
    if (!email) errors.push("Email is required");
     if (email && !email.includes("@")) {
        errors.push("Invalid email format");
    };
    if (password && password.length < 8) {
        errors.push("Password must be at least 8 characters long");
    }
    if (!password) errors.push("Password is required");
    if (errors.length > 0) {
        return res.status(400).json({ 
            status: "error",
            errors: errors
        });
    }
    next();
}