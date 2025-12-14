import { pool } from "../dbConection.js";

export class newsModel {
  // Method to create a news entry
  static async createNews(
    title,
    subtitle,
    body,
    id_country,
    id_category,
    id_user,
    sources,
    picture_url
  ) {
    try {
      const [newsRows] = await pool.query(
        `INSERT INTO news(title, subtitle, body, id_country, id_category, id_user, sources, picture_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          title,
          subtitle,
          body,
          id_country,
          id_category,
          id_user,
          sources,
          picture_url,
        ]
      );
      return {
        id_news: newsRows.insertId,
        title,
        subtitle,
        body,
        id_country,
        id_category,
        id_user,
        sources,
        picture_url,
      };
    } catch (error) {
      return {
        error: error.message,
      };
    }
  }
  // Method to get all news entries
  static async getAllNews() {
    try {
      const [newsRows] = await pool.query(
        `SELECT
            n.*,
            u.username,
            u.picture,
            c.type_of_journalist
            FROM news AS n
            JOIN users AS u
                ON n.id_user = u.id_user
            JOIN content_creator_data AS c
                ON n.id_user = c.id_user;`
      );
      return newsRows;
    } catch (error) {
      return {
        error: error.message,
      };
    }
  }
  static async getNewsByCategory(id_category) {
    try {
      const [newsRows] = await pool.query(
        `SELECT
            n.*,
            u.username,
            u.picture,
            c.type_of_journalist
            FROM news AS n
            JOIN users AS u
                ON n.id_user = u.id_user
            JOIN content_creator_data AS c
                ON n.id_user = c.id_user
            WHERE n.id_category = ?
            ORDER BY n.created_at DESC;`,
        [id_category]
      );
      return newsRows;
    } catch (error) {
      return {
        error: error.message,
      };
    }
  }
  static async getDetailNews(id_news) {
    try {
      const [rows] = await pool.query(
        `SELECT 
            n.*,
            u.username,
            u.picture,
            c.type_of_journalist
            FROM news AS n
            JOIN users AS u
                ON n.id_user = u.id_user
            JOIN content_creator_data AS c
                ON n.id_user = c.id_user
            WHERE n.id_news = ?;`,
        [id_news]
      );
      return rows;
    } catch (error) {
      return { error: error.message };
    }
  }
  // Users news in profile
  static async getUserNews(id_user) {
    try {
      const [rows] = await pool.query(
        `SELECT
        n.*,
        u.username,
        u.picture,
        c.type_of_journalist,
        co.name_country
      FROM news AS n
      JOIN users AS u ON n.id_user = u.id_user
      JOIN content_creator_data AS c ON n.id_user = c.id_user
      LEFT JOIN countries AS co ON n.id_country = co.id_country
      WHERE n.id_user = ?;`,
        [id_user]
      );
      return rows;
    } catch (error) {
      return { error: error.message };
    }
  }
}
