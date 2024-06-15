import { User } from "../components/user";
import { Cart, ProductInCart } from "../components/cart";
import db from "../db/db"
import { Category } from "../components/product";
import dayjs from "dayjs";
import { CartNotFoundError, ProductNotInCartError } from "../errors/cartError";
import { ProductNotFoundError } from "../errors/productError";
/**
 * A class that implements the interaction with the database for all cart-related operations.
 * You are free to implement any method you need here, as long as the requirements are satisfied.
 */
class CartDAO {

    checkIfCartExists(user: User): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            try {
                const sql = "SELECT * FROM carts c WHERE customer=? AND paid=FALSE;"
                db.get(sql, [user.username], (err: Error | null, row: any) => {
                    if (err) {
                        reject(err)
                        return
                    }
                    if (!row) {
                        resolve(false);
                        return
                    }
                    resolve(true);
                });
            }
            catch (error) {
                reject(error);
            }
        });
    }


    checkIfProductExists(model: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            try {
                const sql = "SELECT * FROM products WHERE model=?";
                db.get(sql, [model], (err: Error | null, row: any) => {
                    if (err) {
                        reject(err)
                        return
                    }
                    if (!row || row.model !== model) {
                        resolve(false)
                        return
                    }
                    resolve(true);

                })
            } catch (error) {
                reject(error)
            }
        });
    }

    checkIfProductExistsInCart(user: User, model: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            try {
                const sql = "SELECT * FROM carts c JOIN prod_in_cart pc WHERE   c.idCart = pc.idCart AND customer=? AND model=? AND paid=false;";
                db.get(sql, [user.username, model], (err: Error | null, row: any) => {

                    if (err) {
                        reject(err)
                        return
                    }
                    if (!row) {
                        resolve(false)
                        return
                    }
                    else {
                        resolve(true)
                        return
                    }
                })
            } catch (error) {
                reject(error)
            }
        });
    }

    checkProductAvailability(model: string): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            try {
                const sql = "SELECT * FROM products WHERE model=?;";
                db.get(sql, [model], (err: Error | null, row: any) => {
                    if (err) {
                        reject(err);
                        return
                    }
                    if (!row) {
                        resolve(-1);
                        return
                    }
                    resolve(row.quantity)
                })
            } catch (error) {
                reject(error)
            }
        });
    }

    checkProductQuantityInCart(user: User, model: string): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            try {
                const sql = "SELECT quantity FROM carts c JOIN prod_in_cart pc WHERE c.idCart = pc.idCart AND customer=? AND model=? AND paid=FALSE;";
                db.get(sql, [user.username, model], (err: Error | null, row: any) => {

                    if (err) {
                        reject(err);
                        return
                    }
                    if (!row) {
                        resolve(-1);
                        return
                    }
                    resolve(row.quantity)
                })
            } catch (error) {
                reject(error)
            }
        });
    }

    getCartId(user: User): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            try {
                const sql = "SELECT * FROM carts c WHERE customer=? AND paid=FALSE;"
                db.get(sql, [user.username], (err: Error | null, row: any) => {

                    if (err) {
                        reject(err)
                        return
                    }
                    if (!row) {
                        reject(new CartNotFoundError());
                        return
                    }
                    resolve(row.idCart);
                });
            }
            catch (error) {
                reject(error);
            }
        });
    }

    updateCartTotal(user: User, price: number): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            try {
                const sql = "UPDATE carts \
                    SET total=total+?\
                    WHERE customer=? AND paid=FALSE";
                db.run(sql, [price, user.username], function (err: Error | null) {
                    if (err) {
                        reject(err)
                        return
                    }
                    if (this.changes === 0) {
                        reject(false)
                        return
                    }
                    resolve(true)
                })
            }
            catch { }
        });
    }

    resetCartTotal(user: User) {
        return new Promise<Boolean>((resolve, reject) => {
            try {
                const sql = "UPDATE carts \
                    SET total=0\
                    WHERE customer=? AND paid=FALSE";
                db.run(sql, [user.username], function (err: Error | null) {
                    if (err) {
                        reject(err)
                        return
                    }
                    if (this.changes === 0) {
                        reject(false)
                        return
                    }
                    resolve(true)
                })
            }
            catch { }
        });
    }

    aggiungiProdottoACarrello(user: User, checkProduct: boolean, product: string, category: string, price: number): Promise<Boolean> {
        return new Promise<Boolean>((resolve, reject) => {
            //Carrello esistente
            let cartId = null;
            const sql = "SELECT * FROM carts c WHERE  customer=? AND paid=FALSE;"
            db.get(sql, [user.username], (err: Error | null, row: any) => {

                if (err) {
                    reject(err)
                    return
                }

                cartId = row.idCart;
                //In questo caso il carrello è vuoto
                if (!row || checkProduct === false) {
                    const sql3 = "INSERT INTO prod_in_cart(idCart,model,quantity,category,price) VALUES (?,?,?,?,?)"
                    db.run(sql3, [cartId, product, 1, category, price], (err: Error | null) => {
                        if (err) {
                            reject(err);
                            return
                        }
                        this.updateCartTotal(user, price).then(() => {
                            resolve(true)
                        }).catch((err) => reject(err))
                    })
                    return
                }
                //Prodotto esiste, aggiornarne quantità
                else if (checkProduct === true) {
                    
                    const sql3 = "UPDATE prod_in_cart SET quantity=quantity+1 WHERE idCart=? AND model=?"
                    db.run(sql3, [cartId, product], (err: Error | null) => {
                        if (err) {
                            reject(err);
                            return
                        }
                        this.updateCartTotal(user, price).then(() => {
                            resolve(true)
                        }).catch((err) => reject(err))
                    })
                    return
                }
            });
        })

    }

    addToCart(user: User, product: string): Promise<Boolean> {
        return new Promise<Boolean>((resolve, reject) => {
            try {
                let checkCart: boolean = null
                this.checkIfCartExists(user).then((result: boolean) => {
                    checkCart = result
                    let checkProduct: boolean = null
                    this.checkIfProductExistsInCart(user, product).then((result: boolean) => {
                        checkProduct = result

                        let price = 0;
                        let category = "";
                        const query = "SELECT * FROM products WHERE model=?";
                        db.get(query, [product], (err: Error | null, row: any) => {
                            if (err) {
                                reject(err)
                                return
                            }
                            price = row.sellingPrice;
                            category = row.category;
                            if (checkCart === false) {
                                //CARRELLO DA CREARE, PRENDERE ID E INSERIRE IN PRODINCART
                                const sql = "INSERT INTO carts(customer,paid,paymentDate,total) VALUES (?,?,?,?)"
                                db.run(sql, [user.username, false, null, 0], (err: Error | null) => {
                                    if (err) {
                                        reject(err);
                                        return
                                    }
                                    this.aggiungiProdottoACarrello(user, checkProduct, product, category, price)
                                        .then((res) => resolve(res))
                                        .catch((err) => reject(err))
                                })
                            } else {
                                this.aggiungiProdottoACarrello(user, checkProduct, product, category, price)
                                    .then((res) => resolve(res))
                                    .catch((err) => reject(err))
                            }

                        })

                    }).catch((err) => { reject(err) })
                }).catch((err) => { reject(err) })
            }
            catch (error) {
                reject(error)
            }
        });

    }


    getCart(user: User): Promise<Cart> {
        return new Promise<Cart>((resolve, reject) => {
            try {
                const sql = "SELECT total, pc.model, pc.quantity, p.category ,p.sellingPrice \
                 FROM carts c JOIN prod_in_cart pc JOIN products p WHERE c.idCart == pc.idCart AND pc.model == p.model AND customer=? AND paid=FALSE;";
                db.all(sql, [user.username], (err: Error | null, row: any) => {

                    if (err) {
                        reject(err);
                        return
                    }
                    if (!row || row.length == 0) {
                        resolve(new Cart(user.username, false, null, 0, []));
                        return
                    }
                    //let cartId = row.cartId;
                    const productsInCart = row.map((p: { model: string; quantity: number; category: Category; sellingPrice: number; }) => new ProductInCart(p.model, p.quantity, p.category, p.sellingPrice));
                    resolve(new Cart(user.username, false, null, row[0].total, productsInCart));
                });
            }
            catch { }
        });
    }

    removeProductFromCart(user: User, product: string): Promise<boolean> {
        const self = this
        return new Promise<boolean>((resolve, reject) => {
            try {
                let price = 0;
                let category = "";
                this.getCartId(user).then((idCart: number) => {
                    this.checkProductQuantityInCart(user, product).then((quantity: number) => {

                        const query = "SELECT * FROM products WHERE model=?";
                        db.get(query, [product], (err: Error | null, row: any) => {
                            if (err) {
                                reject(err)
                                return
                            }
                            if (!row) {
                                reject(new ProductNotFoundError())
                                return
                            }
                            price = row.sellingPrice;
                            category = row.category;

                            if (quantity === 1) {
                                let flag = false;
                                //eliminare associazione perchè quantity è 1
                                const sql = "DELETE FROM prod_in_cart WHERE model=? AND idCart=?"
                                db.run(sql, [product, idCart], function (err: Error | null) {
                                    if (err) {
                                        flag = true
                                        reject(err)
                                        return
                                    }
                                    if (this.changes == 0) {
                                        flag = true
                                        reject(new ProductNotInCartError())
                                        return
                                    }
                                    if (!flag) {
                                        self.updateCartTotal(user, -price).then((res) => {
                                            resolve(res)
                                        }).catch((err) => reject(err))
                                    }
                                });

                            } else {
                                //quantity>1 quindi aggiornare quantity 
                                let flag = false;
                                const sql = "UPDATE prod_in_cart SET quantity=quantity-1 WHERE model=? AND idCart=?;"
                                db.run(sql, [product, idCart], function (err: Error | null) {
                                    if (err) {
                                        reject(err)
                                        return
                                    }
                                    if (this.changes == 0) {
                                        flag = true
                                        reject(new ProductNotInCartError())
                                        return
                                    }
                                    if (!flag) {
                                        self.updateCartTotal(user, -price).then((res) => {
                                            resolve(res)
                                        }).catch((err) => reject(err))
                                    }
                                });
                            }
                        })

                    }).catch((err) => reject(err))
                }).catch((err) => reject(err))

            }
            catch (error) {
                reject(error)
            }

        });


    }

    /*
    Join tra cart e prod in cart
    cancellare tutte le associazioni in prod in cart
    */
    clearCart(user: User): Promise<Boolean> {
        return new Promise<Boolean>((resolve, reject) => {
            try {
                this.getCartId(user).then((idCart: number) => {
                    const sql = "DELETE FROM prod_in_cart WHERE idCart=?"
                    db.run(sql, [idCart], (err: Error | null) => {
                        if (err) {
                            reject(err);
                            return
                        }
                        this.resetCartTotal(user).then(() => {
                            resolve(true)
                        }).catch((err) => reject(err))
                    });
                }).catch((err) => reject(err));
            }
            catch (error) {
                reject(error)
            }
        });

    }

    checkoutCart(user: User): Promise<Boolean> {
        return new Promise<Boolean>((resolve, reject) => {
            try {
                let error = false;
                this.getCart(user).then((cart: Cart) => {
                    //Updating quantities in stock
                    for (let i = 0; i < cart.products.length; i++) {
                        const sql = "UPDATE products\
                                    SET quantity=quantity-?\
                                    WHERE model=?;"
                        db.run(sql, [cart.products[i].quantity, cart.products[i].model], function (err: Error | null) {
                            if (err) {
                                error = true;
                                reject(err);
                                //return
                            }
                            //verificare rivedere
                            if (this.changes == 0) {
                                error = true;
                                reject(false);
                                //return
                            }
                        });
                        if (error === true) {
                            break;

                        }
                    }
                    if (!error) {
                        //Marks current cart as paid
                        const sql = "UPDATE carts\
                        SET paid=?,paymentDate=?,total=?\
                        WHERE customer=?;"
                        db.run(sql, [true, dayjs().format('YYYY-MM-DD'), cart.total, cart.customer], function (err: Error | null) {
                            if (err) {
                                reject(err);
                                return
                            }
                            if (this.changes == 0) {
                                reject(new CartNotFoundError());
                                return
                            }
                            resolve(true)
                        });
                    }
                }).catch((error) => { reject(error) })
            }
            catch (error) {
                reject(error)
            }
        });
    }


    getCustomerCarts(user: User): Promise<Cart[]> {
        return new Promise<Cart[]>((resolve, reject) => {
            try {
                const sql = "SELECT * FROM carts LEFT JOIN prod_in_cart ON carts.idCart = prod_in_cart.idCart WHERE customer=? AND paid=TRUE ORDER BY carts.idCart;";
                db.all(sql, [user.username], (err: Error | null, rows: any) => {
                    if (err) {
                        reject(err)
                        return
                    }
                    if (!rows) {
                        resolve([]);
                        return
                    }
                    let list_p_and_c: Array<[number, Cart, ProductInCart]> = rows.map((row: { idCart: number, customer: string, paid: number, paymentDate: string, total: number, model: string, quantity: number, category: Category, price: number }) => {
                        //tupla idCarrello-carrello-prodotto dentro
                        return [row.idCart, new Cart(row.customer, row.paid == 0 ? false : true, row.paymentDate, row.total, []), row.model ? new ProductInCart(row.model, row.quantity, row.category, row.price) : null]
                    })
                    let resultMap = new Map<number, Cart>();
                    list_p_and_c.forEach(([key, cart, prod]) => {
                        // If the key already exists in the Map, add the value to the existing sum

                        if (resultMap.has(key)) {
                            if (prod !== null) {
                                resultMap.get(key).products.push(prod);
                            }
                            resultMap.set(key, resultMap.get(key));
                        } else {
                            // Otherwise, initialize the key with the current value
                            if (prod !== null) {
                                cart.products.push(prod)
                            }
                            resultMap.set(key, cart);
                        }
                    });

                    let resultArray: Cart[] = Array.from(resultMap.values());
                    resolve(resultArray)
                });

            }
            catch (error) {
                reject(error)
            }
        });
    }

    deleteAllCarts(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            try {
                const sql2 = "DELETE FROM prod_in_cart;"
                db.run(sql2, [], (err: Error | null) => {
                    if (err) {
                        reject(err)
                        return
                    }


                })

                const sql = "DELETE FROM carts ;"
                db.run(sql, [], (err: Error | null) => {
                    if (err) {
                        reject(err)
                        return
                    }

                })

                resolve(true)
            }
            catch (error) {

            }

        })
    }

    getAllCarts() {
        return new Promise<Cart[]>((resolve, reject) => {
            try {
                const sql = "SELECT * FROM carts LEFT JOIN prod_in_cart ON carts.idCart = prod_in_cart.idCart ORDER BY carts.idCart;";
                db.all(sql, [], (err: Error | null, rows: any) => {
                    if (err) {
                        reject(err)
                        return
                    }
                    if (!rows) {
                        resolve([]);
                        return
                    }
                    let list_p_and_c: Array<[number, Cart, ProductInCart]> = rows.map((row: { idCart: number, customer: string, paid: number, paymentDate: string, total: number, model: string, quantity: number, category: Category, price: number }) => {
                        //tupla idCarrello-carrello-prodotto dentro
                        return [row.idCart, new Cart(row.customer, row.paid == 0 ? false : true, row.paymentDate, row.total, []), row.model ? new ProductInCart(row.model, row.quantity, row.category, row.price) : null]
                    })
                    let resultMap = new Map<number, Cart>();
                    list_p_and_c.forEach(([key, cart, prod]) => {
                        // If the key already exists in the Map, add the value to the existing sum

                        if (resultMap.has(key)) {
                            if (prod !== null) {
                                resultMap.get(key).products.push(prod);
                            }
                            resultMap.set(key, resultMap.get(key));
                        } else {
                            // Otherwise, initialize the key with the current value
                            if (prod !== null) {
                                cart.products.push(prod)
                            }
                            resultMap.set(key, cart);
                        }
                    });

                    let resultArray: Cart[] = Array.from(resultMap.values());
                    resolve(resultArray)
                });
            }
            catch (error) {
                reject(error)
            }
        });
    }


}

export default CartDAO