import { Router } from "express";
import { CountriesModel } from "../models/countries.js";
//-----------------------------------------------------------------------------------------------------
export const countriesRouter = Router();

countriesRouter.get("/", async (req, res) => {
    try {
        const countriesList = await CountriesModel.getAllCountries();
        res.status(200).json({ news: countriesList });
        
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
        console.log(token);
        
    }
});

