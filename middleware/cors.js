import cors from "cors";

const ACCEPTED_ORIGINS = [
  "http://localhost:4321",
  "http://localhost:8080",
  "http://localhost:1234",
  "http://localhost:5173",
];

export const corsMiddelware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => {
  return cors({
    origin: (origin, callback) => {
      if (acceptedOrigins.includes(origin)) {
        return callback(null, true);
      }
      if (!origin) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
  });
};