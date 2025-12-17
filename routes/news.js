import { Router } from "express";
import { newsModel } from "../models/news.js";
import jwt from "jsonwebtoken";
import { SECRET_JWT_KEY } from "../config/config.js";
import { authMiddleware } from "../middleware/validations.js";
import { NewsController } from "../controllers/news.js";
import multer from "multer";
//-----------------------------------------------------------------------------------------------------
export const newsRouter = Router();

const upload = multer({ dest: "uploads/" });

newsRouter.post("/createNew", upload.single("image"), async (req, res) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(403).send("Access not authorized.");
  }
  try {
    const data = jwt.verify(token, SECRET_JWT_KEY);
    if (data.role !== "creator" && data.role !== "admin") {
      console.log("❌ Rol no autorizado");
      return res.status(403).json({ message: "Access denied", data });
    }
    await NewsController.createNews(req, res);
  } catch (error) {
    console.log("❌ Error en route:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
newsRouter.get("/", authMiddleware, async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(403).send("Access not authorized.");
  }

  try {
    const { category } = req.query;
    let newsList;
    if (category) {
      newsList = await newsModel.getNewsByCategory(category);
    } else {
      newsList = await newsModel.getAllNews();
    }
    res.status(200).json({ news: newsList });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
newsRouter.get("/:id_news", authMiddleware, async (req, res) => {
  const { id_news } = req.params;
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(403).send("Access not authorized.");
  }

  try {
    const newsList = await newsModel.getDetailNews(id_news);
    res.status(200).json({ news: newsList });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
newsRouter.get("/profileNews/:id_user", authMiddleware, async (req, res) => {
  const { id_user } = req.params;
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(403).send("Access not authorized.");
  }

  try {
    const newsList = await newsModel.getUserNews(id_user);
    res.status(200).json({ news: newsList });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
newsRouter.delete("/:id_news", authMiddleware, async (req, res) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(403).send("Access not authorized.");
  }
  try {
    await NewsController.deleteNews(req, res);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
