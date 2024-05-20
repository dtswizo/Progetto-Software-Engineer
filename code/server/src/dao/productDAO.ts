import { ProductAlreadyExistsError } from "../errors/productError";
import db from "../db/db";

/**
 * A class that implements the interaction with the database for all product-related operations.
 * You are free to implement any method you need here, as long as the requirements are satisfied.
 */
class ProductDAO {
    /**
     * Registers a new product concept (model, with quantity defining the number of units available) in the database.
     * @param model The unique model of the product.
     * @param category The category of the product.
     * @param quantity The number of units of the new product.
     * @param details The optional details of the product.
     * @param sellingPrice The price at which one unit of the product is sold.
     * @param arrivalDate The optional date in which the product arrived.
     * @returns A Promise that resolves to nothing.
     */
        registerProducts(model: string, category: string, quantity: number, details: string | null, sellingPrice: number, arrivalDate: string | null) /**:Promise<void> */ {
            return new Promise<void>((resolve, reject) => {
                try {
                    const sql = "INSERT INTO products(model, sellingPrice, category, arrivalDate, details,quantity) VALUES( ?,?, ?, ?, ?, ?)"
                    db.run(sql, [model, sellingPrice, category, arrivalDate, details,quantity], (err: Error | null) => {
                        if (err) {
                            if (err.message.includes("UNIQUE constraint failed: products.model")) reject(new ProductAlreadyExistsError)
                            reject(err)
                        }
                        resolve()
                    })
                } catch (error) {
                    reject(error)
                }
    
            })
         }

}

export default ProductDAO