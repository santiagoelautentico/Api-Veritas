import 'dotenv/config'
import dotenv from 'dotenv'
import express from "express"
import { usersRouter } from "./routes/users.js";
import { newsRouter } from "./routes/news.js";
import { categoriesRouter } from './routes/categories.js'
import { countriesRouter } from './routes/countries.js'
import cookieParser from "cookie-parser";
import { corsMiddelware } from "./middleware/cors.js";
import { PORT } from './config/config.js';
//-----------------------------------------------------------------------------------------------------
const app = express();

app.use(corsMiddelware());
app.use(express.json({ limit: '50mb'}));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

dotenv.config();
// Try Route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Api-Veritas!' });
});

app.listen(PORT);

app.use("/", usersRouter);
app.use("/news", newsRouter);
app.use('/categories', categoriesRouter);
app.use('/countries', countriesRouter);

app.listen(PORT, () => {
    console.log("Server running on port 1234");
});
