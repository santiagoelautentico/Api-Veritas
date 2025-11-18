import express from "express"
import { usersRouter } from "./routes/users.js";
import { newsRouter } from "./routes/news.js";
import cookieParser from "cookie-parser";
import { corsMiddelware } from "./middleware/cors.js";
import dotenv from 'dotenv'

//-----------------------------------------------------------------------------------------------------
const app = express();

// Middleware para parsear JSON
app.use(corsMiddelware());
app.use(express.json());
app.use(cookieParser());

dotenv.config();
// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Api-Veritas!' });
});

const PORT = process.env.PORT || 1234;

app.use("/", usersRouter);
app.use("/news", newsRouter);

app.listen(PORT, () => {
    console.log("Server running on port 1234");
});
