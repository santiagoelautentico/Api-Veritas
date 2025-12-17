import jwt from 'jsonwebtoken';
import { SECRET_JWT_KEY } from '../config/config.js';
export function generateAuthToken(res, user) {
const token = jwt.sign(
  { id: user.id_user, role: user.role },
  SECRET_JWT_KEY,
  { expiresIn: '2h' }
);
  res.cookie("access_token", token, {
    httpOnly: true,
    secure: false, // true solo en producción con HTTPS
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
}
