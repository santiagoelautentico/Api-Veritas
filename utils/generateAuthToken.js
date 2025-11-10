import jwt from 'jsonwebtoken';
import { SECRET_JWT_KEY } from '../config.js';
export function generateAuthToken(res, user) {
const token = jwt.sign(
  { id: user.id_user, role: user.role },
  SECRET_JWT_KEY,
  { expiresIn: '2h' }
);
  res.cookie('access_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 2 * 60 * 60 * 1000 // 2 horas
  });

  return token;
}
