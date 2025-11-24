import { pool } from "../dbConection.js";

export class CountriesModel {
// Method to get all countries entries
    static async getAllCountries() {
        try {
            const [countriesRows] = await pool.query(
                `SELECT * FROM countries`
            );
            return countriesRows;
        } catch (error) {
            return {
                error: error.message 
            };
        }
    }
}