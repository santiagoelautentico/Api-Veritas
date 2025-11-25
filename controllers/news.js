import { newsModel } from "../models/news";

export class NewsController {
    static async createNews(req, res) {
        const { title, subtitle, body, id_country, id_category ,id_user, sources } = req.body;
        try {
            const newNews = await newsModel.createNews(title, subtitle, body, id_country, id_category ,id_user, sources);
            res.status(201).json({ message: "News created successfully", news: newNews });
        } catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }
    static async getAllNews(req, res) {
        try {
            const newsList = await newsModel.getAllNews();
            res.status(200).json({ news: newsList });
        } catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }

    static async getDetailNews(req, res) {
        const { id_news } = req.params;
        try {
            const newList = await newsModel.getDetailNews(id_news);
            res.status(200).json({ news: newList });
        } catch (error) {
            res.status(500).json({ message: "Server error", error: error.message })
        }
    }
    static async getUserNews(req, res) {
        const { id_user } = req.params;
        try {
            const newList = await newsModel.getUserNews(id_user);
            res.status(200).json({ news: newList });
        } catch (error) {
            res.status(500).json({ message: "Server error", error: error.message })
        }
    }
}