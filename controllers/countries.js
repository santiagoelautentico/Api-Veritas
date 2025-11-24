import { CountriesModel } from "../models/countries.js";

export class CountriesController {
    static async getAllCountries(req, res) {
        try {
            const countriesList = await CountriesModel.getAllCountries();
            res.status(200).json({ categories: countriesList });
        } catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }
}