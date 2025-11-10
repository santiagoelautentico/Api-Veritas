import { pool } from "../dbConection.js";

export class newsModel {
// Method to create a news entry
    static async createNews(title, subtitle, body, id_country, id_category ,id_user, sources) {
        try {
            const [newsRows] = await pool.query(
                `INSERT INTO news(title, subtitle, body, id_country, id_category, id_user, sources) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [title, subtitle, body, id_country, id_category ,id_user, sources]
            );
            return { id_news: newsRows.insertId, title, subtitle, body, id_country, id_category ,id_user, sources };
        } catch (error) {
            return {
                error: error.message 
            };
        }
    }
// Method to get all news entries
    static async getAllNews() {
        try {
            const [newsRows] = await pool.query(
                `SELECT * FROM news`
            );
            return newsRows;
        } catch (error) {
            return {
                error: error.message 
            };
        }
    }
}