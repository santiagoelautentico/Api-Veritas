import dotenv from 'dotenv'

dotenv.config();

export const SECRET_JWT_KEY = process.env.JWT_SECRET;
