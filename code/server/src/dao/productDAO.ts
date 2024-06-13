import { ProductAlreadyExistsError, ProductNotFoundError } from "../errors/productError";
import db from "../db/db";
import sqlite from 'sqlite3';
import e from "express";
import { Category, Product } from "../components/product";

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
                            if (err.message.includes("UNIQUE constraint failed: products.model")) reject(new ProductAlreadyExistsError())
                            reject(err)
                        }
                        resolve()
                    })
                } catch (error) {
                    reject(error)
                }
    
            });
        }

        getArrivalDate(model:string):Promise<string>{
            return new Promise<string>((resolve, reject) => {
                try {
                    const sql = "SELECT arrivalDate FROM products WHERE model=?;"
                    db.get(sql, [model], (err: Error | null, row: any) => {
                        if (err) {
                            reject(err)
                            return
                        }
                        if (!row) {
                            reject(new ProductNotFoundError())
                            return
                        }
                        resolve(row.arrivalDate)
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

    changeProductQuantity(model: string, newQuantity: number, changeDate: string | null): Promise<number> {
        return new Promise<number>((resolve, reject) => { //modificata poichè sovrascriveva la newquantity piuttosto che sommarla
            try {
                const selectSql = "SELECT quantity FROM products WHERE model = ?";
                db.get(selectSql, [model], (err: Error | null, row: { quantity: number }) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (!row) {
                        reject(new ProductNotFoundError());
                        return;
                    }
    
                    const updatedQuantity = row.quantity + newQuantity;
    
                    const updateSql = "UPDATE products SET quantity = ? WHERE model = ?";
                    db.run(updateSql, [updatedQuantity, model], function (err: Error | null) {
                        if (err) {
                            reject(err);
                            return;
                        }
                        if (this.changes === 0) {
                            reject(new ProductNotFoundError());
                            return;
                        }
                        resolve(updatedQuantity);
                    });
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    
    async getProductQuantity(model: string) :Promise<number> { 
        return new Promise<number>((resolve, reject) => {
            try {
                const sql = "SELECT quantity FROM products WHERE model=?;"
                    db.get(sql, [model], (err: Error | null, row: any) => {
                        if (err) {
                            reject(err)
                            return
                        }
                        if (!row) {
                            reject(new ProductNotFoundError())
                            return
                        }
                        resolve(row.quantity)
                    })
            } catch (error) {
                reject(error)
            }

        });
    }

    getFilteredProducts(filterType:string, filterValue:string):Promise<Product[]> {
        return new Promise<Product[]>((resolve, reject) => {
            try {
                //ipotizzo filterType category altrimenti cambio
                let sql="SELECT * FROM products WHERE category=?;"
                if (filterType==="model"){
                    sql = "SELECT * FROM products WHERE model=?;"
                }
                db.all(sql, [filterValue], (err: Error | null, rows:any) => {
                    if (err) {
                        reject(err)
                        return
                    }
                    if (filterType==="model" && rows.length === 0) {
                        reject(new ProductNotFoundError())
                        return
                    }
                    const products=rows.map((p: { sellingPrice: number; model: string; category: Category; arrivalDate: string|null; details: string|null; quantity: number; })=>new Product(p.sellingPrice,p.model,p.category,p.arrivalDate,p.details,p.quantity));
                    resolve(products);
                })
            } catch (error) {
                reject(error)
            }

        });
    }

    getAllProducts():Promise<Product[]> {
        return new Promise<Product[]>((resolve, reject) => {
            try {
                let sql="SELECT * FROM products;"
                db.all(sql, [], (err: Error | null, rows:any) => {
                    if (err) {
                        reject(err)
                        return
                    }
                    const products=rows.map((p: { sellingPrice: number; model: string; category: Category; arrivalDate: string|null; details: string|null; quantity: number; })=>new Product(p.sellingPrice,p.model,p.category,p.arrivalDate,p.details,p.quantity));
                    resolve(products);
                })
            } catch (error) {
                reject(error)
            }

        });
    }

    deleteAllProducts():Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            try {
                let sql="DELETE FROM products;"
                db.run(sql, [], (err: Error | null) => {
                    if (err) {
                        reject(err)
                        return
                    }
                    resolve(true);
                })
            } catch (error) {
                reject(error)
            }

        });
    }

    deleteProduct(model: string) :Promise <Boolean> {
        return new Promise<boolean>((resolve, reject) => {
            try {
                let sql="DELETE FROM products WHERE model=?;"
                db.run(sql, [model], function (err: Error | null) {
                    if (err) {
                        reject(err)
                        return
                    }
                    if(this.changes==0){
                        reject(new ProductNotFoundError());
                        return
                    }
                    resolve(true);
                })
            } catch (error) {
                reject(error)
            }

        });
    }




}

export default ProductDAO