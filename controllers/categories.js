import { CategoriesModel } from "../models/categories.js";

export class CategoriesController {
    static async getAllCategories(req, res) {
        try {
            const categoriesList = await CategoriesModel.getAllCategories();
            res.status(200).json({ categories: categoriesList });
        } catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }
}