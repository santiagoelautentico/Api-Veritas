import cors from "cors";

const ACCEPTED_ORIGINS = [
  "http://localhost:4321",
  "http://localhost:8080",
  "http://localhost:1234",
  "http://localhost:5173",
  "https://admin-veritas-web.onrender.com", // ← Tu frontend en Render
];

export const corsMiddelware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => {
  return cors({
    origin: (origin, callback) => {
      // Permite requests sin origin (como Postman, curl, etc.)
      if (!origin) {
        return callback(null, true);
      }
      
      // Verifica si el origin está en la lista de aceptados
      if (acceptedOrigins.includes(origin)) {
        return callback(null, true);
      }
      
      // Rechaza cualquier otro origin
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true, // ← Esto requiere origin específico, NO wildcard
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
  });
};