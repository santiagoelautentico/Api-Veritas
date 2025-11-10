import { Router } from "express";
import { newsModel } from "../models/news.js";
import jwt from 'jsonwebtoken';
import { SECRET_JWT_KEY } from "../config.js";
//-----------------------------------------------------------------------------------------------------
export const newsRouter = Router();

newsRouter.post("/createNew", async (req, res) => {
    const { title, subtitle, body, id_country, id_category ,id_user, sources } = req.body;
    const token = req.cookies.access_token;
    if (!token) {
        return res.status(403).send('Access not authorized.');
    }
    try {
        const data = jwt.verify(token, SECRET_JWT_KEY);
        if (data.role !== 'creator' && data.role !== 'admin') {
            return res.status(403).json({ message: "Access denied", data });
        }
        const newNews = await newsModel.createNews(title, subtitle, body, id_country, id_category ,id_user, sources);
        res.status(201).json({ message: "News created successfully", news: newNews });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }       
});
newsRouter.get("/",  async (req, res) => {
    const token = req.cookies.access_token;
    if (!token) {
        return res.status(403).send('Access not authotized.');
    }
    try {
        const newsList = await newsModel.getAllNews();
        res.status(200).json({ news: newsList });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});
