import { pool } from "../dbConection.js";

export class CategoriesModel {
// Method to get all categories entries
    static async getAllCategories() {
        try {
            const [categoriesRows] = await pool.query(
                `SELECT * FROM categories`
            );
            return categoriesRows;
        } catch (error) {
            return {
                error: error.message 
            };
        }
    }
}