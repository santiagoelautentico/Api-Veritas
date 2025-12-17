import { newsModel } from "../models/news.js";
import { cloudinary } from "../config/cloudinary.js";

export class NewsController {
  static async createNews(req, res) {
    console.log("📦 Body recibido:", req.body);
    console.log(
      "🖼️ Picture recibido:",
      req.body.picture ? "SÍ HAY" : "NO HAY" 
    );

    const {
      title,
      subtitle,
      body,
      id_country,
      id_category,
      id_user,
      sources,
      picture,
    } = req.body;

    try {
      let picture_url = null; 
      if (picture) {
        try {
          const uploadResult = await cloudinary.uploader.upload(picture, {
            folder: "news",
            resource_type: "auto",
            transformation: [
              { width: 918, height: 630, crop: "limit" },
              { quality: "auto:good" },
            ],
          });
          picture_url = uploadResult.secure_url;
          console.log("✅ Imagen subida a Cloudinary:", picture_url);
        } catch (uploadError) {
          console.error("❌ Error subiendo a Cloudinary:", uploadError);
          return res.status(500).json({
            message: "Error uploading image",
            error: uploadError.message,
          });
        }
      }

      const newNews = await newsModel.createNews(
        title,
        subtitle,
        body,
        id_country,
        id_category,
        id_user,
        sources,
        picture_url
      );

      res
        .status(201)
        .json({ message: "News created successfully", news: newNews });
    } catch (error) {
      console.error("❌ Error general:", error);
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
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
  static async getUserNews(req, res) {
    const { id_user } = req.params;
    try {
      const newList = await newsModel.getUserNews(id_user);
      res.status(200).json({ news: newList });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
  static async deleteNews(req, res) {
    const { id_news } = req.params;
    try {
      const deleteResult = await newsModel.deleteNews(id_news);
      res
        .status(200)
        .json({ message: "News deleted successfully", result: deleteResult });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
}
