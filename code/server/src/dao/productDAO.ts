import { ProductAlreadyExistsError, ProductNotFoundError } from "../errors/productError";
import db from "../db/db";
import sqlite from 'sqlite3';
import e from "express";

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
        registerProducts(model: string, category: string, quantity: number, details: string | null, sellingPrice: number, arrivalDate: string | null) :Promise<void> {
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
    
            });
        }

    /**
     * Increases the available quantity of a product through the addition of new units.
     * @param model The model of the product to increase.
     * @param newQuantity The number of product units to add. This number must be added to the existing quantity, it is not a new total.
     * @param changeDate The optional date in which the change occurred.
     * @returns A Promise that resolves to the new available quantity of the product.
     */
    //finire
    changeProductQuantity(model: string, newQuantity: number, changeDate: string | null) :Promise<number> {
        return new Promise<number>((resolve, reject) => {
            try {
                const sql = "UPDATE products\
                            SET quantity=?\
                            WHERE model=?;" 
                db.run(sql, [newQuantity,model], function (err: Error | null) {
                    
                    if (err) {
                        if(this.changes==0){
                            reject(ProductNotFoundError);
                        }
                        reject(err);
                    }
                    resolve(newQuantity)
                })
            } catch (error) {
                reject(error)
            }

        });
     }

    /*
    async getProductQuantity(model: string) :Promise<number> { 
        return new Promise<number>((resolve, reject) => {
            try {
                const sql = "SELECT quantity FROM products WHERE model=?" 
                db.run(sql, [model], (err: Error | null) => {
                    if (err) {
                        if (err.message.includes("Product model not found: products.model")) reject(new ProductNotFoundError)
                        reject(err)
                    }
                    resolve()
                })
            } catch (error) {
                reject(error)
            }

        });
    }
    */

}

export default ProductDAO