import { Router } from "express";
import { CategoriesModel } from "../models/categories.js";
//-----------------------------------------------------------------------------------------------------
export const categoriesRouter = Router();

categoriesRouter.get("/", async (req, res) => {
    try {
        const categoriesList = await CategoriesModel.getAllCategories();
        res.status(200).json({ news: categoriesList });
        
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
        console.log(token);
        
    }
});

