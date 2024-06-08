import { User } from "../components/user";
import { Cart, ProductInCart } from "../components/cart";
import db from "../db/db"
import { Category } from "../components/product";
import dayjs from "dayjs";
import { CartNotFoundError } from "../errors/cartError";
import { ProductNotFoundError } from "../errors/productError";
/**
 * A class that implements the interaction with the database for all cart-related operations.
 * You are free to implement any method you need here, as long as the requirements are satisfied.
 */
class CartDAO {

    checkIfCartExists(user:User):Promise<boolean>{
        return new Promise<boolean>((resolve,reject)=>{
            try{
                const sql = "SELECT * FROM carts c WHERE customer=? AND paid=FALSE;"
                db.get(sql, [user.username], (err: Error | null, row:any) => {
                    if (err){
                        reject(err)
                        return
                    }
                    if(!row){
                        resolve (false);
                        return
                    }
                        resolve (true);
                    });
            }
            catch(error){
                reject (error);
            }
        });
    }


    checkIfProductExists(model: string):Promise<boolean>{
    return new Promise<boolean>((resolve,reject)=>{
        try{
            const sql="SELECT * FROM products WHERE model=?";
            db.get(sql,[model], (err:Error | null, row: any )=>{
                if (err){
                    reject(err)
                    return
                } 
                if (!row || row.model !== model){
                    resolve (false)
                    return 
                }
                    resolve (true);
                
            })
        }  catch (error){
            reject(error)
        }
    });
    }

    checkIfProductExistsInCart(user: User, model: string):Promise<boolean>{
        return new Promise<boolean>((resolve,reject)=>{
            try{
                const sql="SELECT * FROM carts c JOIN prod_in_cart pc WHERE   c.idCart = pc.idCart AND customer=? AND model=?;";
                db.get(sql,[user.username,model], (err:Error | null, row: any )=>{
                    
                    if (err){
                        reject(err)
                        return
                    } 
                    if (!row){
                        resolve (false)
                        return 
                    }
                    else {
                        resolve (true)
                        return 
                    }
                })
            }  catch (error){
                reject(error)
            }
        });
    }

    checkProductAvailability(model: string):Promise<number>{
        return new Promise<number>((resolve,reject)=>{
            try{
                const sql="SELECT * FROM products WHERE model=?;";
                db.get(sql,[model], (err:Error | null, row: any )=>{
                    if (err){
                        reject(err);
                        return
                    } 
                    if (!row){
                        resolve (-1);
                        return 
                    }
                        resolve (row.quantity)
                })
            }  catch (error){
                reject(error)
            }
        }); 
    }

    checkProductQuantityInCart(user:User, model: string):Promise<number>{
        return new Promise<number>((resolve,reject)=>{
            try{
                const sql="SELECT quantity FROM carts c JOIN prod_in_cart pc WHERE c.idCart = pc.idCart AND customer=? AND model=? AND paid=FALSE;";
                db.get(sql,[user.username,model], (err:Error | null, row: any )=>{
                    
                    if (err){
                        reject(err);
                        return
                    } 
                    if (!row){
                        resolve (-1);
                        return 
                    }
                        resolve (row.quantity)
                })
            }  catch (error){
                reject(error)
            }
        });
    }

    getCartId(user:User):Promise<number>{
        return new Promise<number>((resolve,reject)=>{
            try{
                const sql = "SELECT * FROM carts c WHERE customer=? AND paid=FALSE;"
                db.get(sql, [user.username], (err: Error | null, row:any) => {
                    
                    if (err){
                        reject(err)
                        return
                    }
                    if(!row){
                        /////////verificare
                        reject(new CartNotFoundError());
                        return
                    }
                        resolve (row.idCart);
                    });
            }
            catch(error){
                reject (error);
            }
        });
    }

    updateCartTotal(user:User, price:number){
        return new Promise<Boolean>((resolve,reject)=>{
            try{
                const sql = "UPDATE carts \
                    SET total=total+?\
                    WHERE customer=? AND paid=FALSE";
                   db.run(sql, [price,user.username], function (err: Error | null) {
                    if(err){
                        reject(err)
                        return
                    }
                    if(this.changes===0){
                        reject(false)
                        return
                    }
                    resolve(true)
                   })
            }
            catch{}
        });
    }
    
    resetCartTotal(user:User){
        return new Promise<Boolean>((resolve,reject)=>{
            try{
                const sql = "UPDATE carts \
                    SET total=0\
                    WHERE customer=? AND paid=FALSE";
                   db.run(sql, [user.username], function (err: Error | null) {
                    if(err){
                        reject(err)
                        return
                    }
                    if(this.changes===0){
                        reject(false)
                        return
                    }
                    resolve(true)
                   })
            }
            catch{}
        });
    }

    addToCart(user: User, product:string):Promise<Boolean>{
        return new Promise<Boolean>((resolve,reject)=>{
            try{
                let checkCart: boolean = null 
                this.checkIfCartExists(user).then((result:boolean)=>{
                    checkCart=result
                
                //console.log(checkCart)
                let checkProduct: boolean = null
                this.checkIfProductExistsInCart(user,product).then((result:boolean)=>{
                    checkProduct=result
                
                //console.log(checkProduct)
                let price = 0;
                let category = "";
                const query = "SELECT * \
                    FROM products WHERE model=?";
                   db.get(query, [product], (err: Error | null, row:any) => {
                    if(err){
                        reject(err)
                        return
                    }
                    price = row.sellingPrice;
                    category = row.category;
                   })
                if (checkCart === false){
                    //CARRELLO DA CREARE, PRENDERE ID E INSERIRE IN PRODINCART
                    //console.log("creo carrello")
                    const sql = "INSERT INTO carts(customer,paid,paymentDate,total) VALUES (?,?,?,?)"
                    db.run(sql,[user.username,false,null,0], (err: Error | null) =>{
                        if(err){
                            reject(err);
                            return 
                        }
                        //rivedere
                        //console.log(row.idCart);
                        //Seleziono carrello corrente, superfluo se riesco a pescare l'id prima
                        /*
                        const sql2 = "SELECT * FROM carts WHERE customer = ? AND paid = FALSE;";
                        db.get(sql2,[user.username], (err:Error | null, row: any ) =>{
                            if(err){
                                reject(err);
                                return 
                            }
                            let cartId = row.idCart;
                            const sql3 = "INSERT INTO prod_in_cart(idCart,model,quantity,category,price) VALUES (?,?,?,?,?)"
                            db.run(sql3,[cartId,product,1,category,price], (err: Error | null) =>{
                            if(err){
                                reject(err);
                                return 
                            }
                            this.updateCartTotal(user,price).then(()=>{
                                resolve(true)
                            })
                            resolve(true)
                            })
                        })*/
                        
                    })
                }
                
                //Carrello esistente
                let cartId = null;
                //console.log("carrello esistente")
                const sql = "SELECT * FROM carts c WHERE  customer=? AND paid=FALSE;"
                db.get(sql, [user.username], (err: Error | null, row:any) => {
                    
                    if (err){
                        reject(err)
                        return
                    }
                    
                    cartId = row.idCart;
                    //In questo caso il carrello è vuoto
                    if(!row || checkProduct === false){
                        //console.log("prodotto ancora non in carrello")
                        const sql3 = "INSERT INTO prod_in_cart(idCart,model,quantity,category,price) VALUES (?,?,?,?,?)"
                            db.run(sql3,[cartId,product,1,category,price], (err: Error | null) =>{
                            if(err){
                                reject(err);
                                return 
                            }
                            this.updateCartTotal(user,price).then(()=>{
                                resolve(true)
                            }).catch((err)=>reject(err))
                            //rivedere
                            //resolve(true)
                            })
                        return
                    }
                    //Prodotto esiste, aggiornarne quantità
                    else if(checkProduct === true){
                        //console.log("quantity da aggiornare")
                        const sql3 = "UPDATE prod_in_cart SET quantity=quantity+1 WHERE idCart=? AND model=?"
                            db.run(sql3,[cartId,product], (err: Error | null) =>{
                            if(err){
                                reject(err);
                                return 
                            }
                            this.updateCartTotal(user,price).then(()=>{
                                resolve(true)
                            }).catch((err)=>reject(err))
                            // rivedere
                            //resolve(true)
                            })
                        return
                    }
                    
                    //Prodotto presente, si aggiorna quantity
                    //const productsInCart = row.map((p: {model: string; quantity: number; category: Category; price: number;})=> new ProductInCart(p.model,p.quantity,p.category,p.price));
                    
                    });
                }).catch((err)=>{reject(err)})
                }).catch((err)=>{reject(err)})
            }
            catch (error){
                //console.log("finito in catch")
                reject(error)
            }
        });
        
    }


    getCart(user: User):Promise<Cart>{
        return new Promise<Cart>((resolve,reject)=>{
            try{
                const sql = "SELECT total, pc.model, pc.quantity, p.category ,p.sellingPrice \
                 FROM carts c JOIN prod_in_cart pc JOIN products p WHERE c.idCart == pc.idCart AND pc.model == p.model AND customer=? AND paid=FALSE;";
                db.all(sql, [user.username], (err: Error | null, row:any) => {
                    
                    if (err){
                        reject(err);
                        return
                    }
                    if(!row || row.length==0){
                        //console.log("Carrello non trovato");
                        resolve (new Cart(user.username,false,null,0,[]));
                        return
                    }
                    //console.log("Carrello trovato");
                    //console.log(row);
                    //let cartId = row.cartId;
                    const productsInCart = row.map((p: {model: string; quantity: number; category: Category; sellingPrice: number;})=> new ProductInCart(p.model,p.quantity,p.category,p.sellingPrice));
                    resolve (new Cart(user.username,false,null,row[0].total,productsInCart));
                    });
            }
            catch{}
        });
    }

    /*
    Verificare la quantità
    Se quantità è 1, rimuovere associazione
    Se quantità > 1, aggiornare quantity
    */
    //CODICE SCRITTO MALE DA PULIRE 
    removeProductFromCart(user:User, product:string):Promise<boolean>{
        return new Promise<boolean>((resolve,reject)=>{
            try{
                let price = 0;
                let category = "";
                this.getCartId(user).then((idCart:number)=>{
                this.checkProductQuantityInCart(user,product).then((quantity:number)=>{
                
                const query = "SELECT * \
                    FROM products WHERE model=?";
                   db.get(query, [product], (err: Error | null, row:any) => {
                    if(err){
                        reject(err)
                        return
                    }
                    price = row.sellingPrice;
                    category = row.category;
                   })
                if (quantity===1){
                    //eliminare associazione perchè quantity è 1
                    //DA FINIREEEEE
                    const sql = "DELETE FROM prod_in_cart WHERE model=? AND idCart=?"
                    db.run(sql, [product,idCart], (err: Error | null) => {
                    if (err){
                        reject(err)
                        return
                    }
                    this.updateCartTotal(user,-price).then(()=>{
                        resolve(true)
                    }).catch((err)=>reject(err))
                    });
                }
                else {
                    //quantity>1 quindi aggiornare quantity
                    //INSERIRE IDCART 
                    
                    const sql = "UPDATE prod_in_cart SET quantity=quantity-1 WHERE model=? AND idCart=?;"
                    db.run(sql, [product,idCart], (err: Error | null) => {
                    if (err){
                        reject(err)
                        return
                    }
                    this.updateCartTotal(user,-price).then(()=>{
                        resolve(true)
                    }).catch((err)=>reject(err))
                    });


                }
                }).catch((err)=>reject(err))
            }).catch((err)=>reject(err))
                
            }
            catch(error){
                reject(error)
            }
            
        });
        

    }

    /*
    Join tra cart e prod in cart
    cancellare tutte le associazioni in prod in cart
    */
    clearCart(user:User):Promise<Boolean>{
        return new Promise<Boolean>((resolve,reject)=>{
            try{
                this.getCartId(user).then((idCart:number)=>{
                const sql = "DELETE FROM prod_in_cart WHERE idCart=?"
                db.run(sql, [idCart], (err: Error | null) => {
                    if(err){
                        reject(err);
                        return 
                    }
                    this.resetCartTotal(user).then(()=>{
                        resolve(true)
                    }).catch((err)=>reject(err))
                    //rivedere
                    //resolve(true);
                });
            }).catch((err)=>reject(err));
            }
            catch(error){
                reject(error)
            }
        });

    }

    checkoutCart(user:User):Promise<Boolean>{
        return new Promise<Boolean>((resolve,reject)=>{
            try{
                let error=false;
                this.getCart(user).then((cart:Cart)=>{
                    //Updating quantities in stock
                    for (let i=0;i<cart.products.length; i++){
                        const sql ="UPDATE products\
                                    SET quantity=quantity-?\
                                    WHERE model=?;"
                        db.run(sql, [cart.products[i].quantity, cart.products[i].model], function (err: Error | null) {
                        if (err) {
                            error=true;
                            reject(err);
                            //return
                        }
                        //verificare
                        if(this.changes==0){
                            error=true;
                            reject(new ProductNotFoundError());
                            //return
                        }
                        });
                        if (error===true){
                            break;
                            
                        }
                    }
                    if(!error){
                        //Marks current cart as paid
                        const sql = "UPDATE carts\
                        SET paid=?,paymentDate=?,total=?\
                        WHERE customer=?;" 
                        db.run(sql, [true,dayjs().format('YYYY-MM-DD'),cart.total,cart.customer], function (err: Error | null) {
                            if (err) {
                                reject(err);
                                return
                            }
                            if(this.changes==0){
                                reject(new CartNotFoundError());
                                return
                            }
                            resolve(true)
                        });
                    }
                }).catch((error)=>{reject(error)})
            }
            catch(error){
                reject(error)
            }
        });
    }


    getCustomerCarts(user:User):Promise<Cart[]>{
    return new Promise<Cart[]>((resolve,reject)=>{
            try{
                
                const result: Cart[] = []
                const sql = "SELECT * FROM carts c  WHERE customer=? AND paid=TRUE;"
                db.all(sql, [user.username], (err: Error | null, rows:any) => {
                    if (err){
                        reject(err)
                        return
                    }
                    if(!rows){
                        //console.log("prova")
                        resolve ([]);
                        return
                    }
                     let cartQueries = rows.map((row: any, i:number) => {
                    return new Promise<void>((resolve, reject) => {
                        const sql = "SELECT * FROM carts c JOIN prod_in_cart pc WHERE c.idCart = pc.idCart AND c.idCart = ? AND paid = TRUE;";
                        db.all(sql, [row.idCart], (err: Error | null, row: any) => {
                            if (err) {
                                reject(err);
                                return;
                            }
                            if (!row) {
                                //rivedere
                                reject(new CartNotFoundError());
                                return;
                            }
                            const productsInCart = row.map((p: { model: string; quantity: number; category: Category; price: number; }) => new ProductInCart(p.model, p.quantity, p.category, p.price));

                            let cartToAdd = new Cart(row[0].customer, true, row[0].paymentDate, row[0].total, productsInCart);
                            
                            result.push(cartToAdd);
                            resolve();
                        });
                    });
                });

                Promise.all(cartQueries).then(() => {
                    //console.log(result)
                    resolve(result);
                }).catch((error)=>reject(error))
                    
            });
        }
            catch(error){
                reject(error)
            }
        });
    }

    deleteAllCarts():Promise<boolean>{
        return new Promise<boolean>((resolve,reject)=>{
            try{
                const sql = "DELETE * FROM carts ;"
                db.run(sql, [], (err: Error | null) => {
                    if (err) {
                        reject(err)
                        return
                    }
                    
                })
                const sql2 = "DELETE * FROM prod_in_cart;"
                db.run(sql2, [], (err: Error | null) => {
                    if (err) {
                        reject(err)
                        return
                    }
                    resolve(true)
                    
                })
            }
            catch(error){

            }

        })
    }

    getAllCarts(){return new Promise<Cart[]>((resolve,reject)=>{
        try{
            const result: Cart[] = []
            const sql = "SELECT * FROM carts c "
            db.all(sql, [], (err: Error | null, rows:any) => {
                if (err){
                    reject(err)
                    return
                }
                if(!rows){
                    resolve ([]);
                    return
                }
                let cartQueries = rows.map((row: any, i: number) => {
                return new Promise<void>((resolve, reject) => {
                    const sql = "SELECT * FROM carts c JOIN prod_in_cart pc WHERE c.idCart = pc.idCart AND c.idCart = ? AND paid = TRUE;";
                    db.all(sql, [row.idCart], (err: Error | null, row: any) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        if (!row) {
                            ///resolve();
                            // vedere che errore c'è
                            reject(new Error())
                            return;
                        }
                        const productsInCart = row.map((p: { model: string; quantity: number; category: Category; price: number; }) => new ProductInCart(p.model, p.quantity, p.category, p.price));
                       
                        let cartToAdd = new Cart(rows[i].customer, true, rows[i].paymentDate, rows[i].total, productsInCart);
                        
                        result.push(cartToAdd);
                        resolve();
                    });
                });
            });

            Promise.all(cartQueries).then(() => {
                //console.log(result)
                resolve(result);
            }).catch((error)=>{reject(error)})
                
        });
    }
        catch(error){
            reject(error)
        }
    });
}


}

export default CartDAO