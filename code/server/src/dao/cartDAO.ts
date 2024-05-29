import { User } from "../components/user";
import { Cart, ProductInCart } from "../components/cart";
import db from "../db/db"
import { Category } from "src/components/product";
/**
 * A class that implements the interaction with the database for all cart-related operations.
 * You are free to implement any method you need here, as long as the requirements are satisfied.
 */
class CartDAO {

    checkIfCartExists(user:User){
        return new Promise<Boolean>((resolve,reject)=>{
            try{
                const sql = "SELECT * FROM carts c JOIN prod_in_cart pc JOIN products p WHERE c.idCart = pc.idCart AND pc.model = p.model AND username=? AND paid=FALSE;"
                db.all(sql, [user.username], (err: Error | null, row:any) => {
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


    checkIfProductExists(model: string){
    return new Promise<boolean>((resolve,reject)=>{
        try{
            const sql="SELECT model FROM products WHERE model=?";
            db.get(sql,[model], (err:Error | null, row: any )=>{
                if (err){
                    reject(err)
                    return
                } 
                if (!row || row.model !== model){
                    resolve (false)
                    return 
                }
                else {
                    resolve (true)
                }
            })
        }  catch (error){
            reject(error)
        }
    });
    }

    checkIfProductExistsInCart(user: User, model: string){
        return new Promise<boolean>((resolve,reject)=>{
            try{
                const sql="SELECT model FROM cart c JOIN productincart pc WHERE c.idCart = pc.idCart AND user model=?;";
                db.get(sql,[model], (err:Error | null, row: any )=>{
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

    checkProductAvailability(model: string){
        return new Promise<Number>((resolve,reject)=>{
            try{
                const sql="SELECT model FROM product WHERE model=?;";
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

    checkProductQuantityInCart(user:User, model: string){
        return new Promise<Number>((resolve,reject)=>{
            try{
                const sql="SELECT model FROM cart c JOIN productincart pc WHERE c.idCart = pc.idCart AND user model=?;";
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

    //DOMANDA: QUANTITY DEL PRODOTTO VA RIDOTTA QUA DA PRODUCT?
    //RISPOSTA: NO, VERIFICA TUTTO IL CHECKOUT
    addProductInCart(user: User, product:string){
        return new Promise<Boolean>((resolve,reject)=>{
            try{
                //PROBLEMI SU AWAIT COME FARE? HA SENSO FARE ASYNC?
                let checkCart = this.checkIfCartExists(user);
                if (checkCart === false){
                    //VERIFICARE AUTOINCREMENT
                    //CARRELLO DA CREARE, PRENDERE ID E INSERIRE IN PRODINCART
                    const sql = "INSERT INTO carts(customer,paid,paymentDate,total) VALUES (?,?,?,?)"
                    db.run(sql,[user.username,false,null,0], (err: Error | null) =>{
                        if(err){
                            reject(err);
                            return 
                        }
                        const sql2 = "SELECT * FROM carts WHERE customer = ? AND paid = FALSE";
                        db.get(sql2,[user.username], (err:Error | null, row: any ) =>{
                            if(err){
                                reject(err);
                                return 
                            }
                            let cartId = row.idCart;
                            const sql3 = "INSERT INTO prod_in_cart(idCart,model,quantity) VALUES (?,?,?)"
                            db.run(sql3,[cartId,product,1], (err: Error | null) =>{
                            if(err){
                                reject(err);
                                return 
                            }
                            resolve(true)
                            })
                        })
                        
                    })
                }
                let checkProduct = await this.checkIfProductExistsInCart(user,product);

                let cartId = null;

                const sql = "SELECT * FROM carts c JOIN prod_in_cart pc JOIN products p WHERE c.idCart == pc.idCart AND pc.model == p.model AND username=? AND paid=FALSE;"
                db.all(sql, [user.username], (err: Error | null, row:any) => {
                    if (err){
                        reject(err)
                        return
                    }
                    cartId = row.cartId;
                    //In questo caso il carrello è vuoto
                    if(!row || checkProduct != true){
                        const sql3 = "INSERT INTO prod_in_cart(idCart,model,quantity) VALUES (?,?,?)"
                            db.run(sql3,[cartId,product,1], (err: Error | null) =>{
                            if(err){
                                reject(err);
                                return 
                            }
                            resolve(true)
                            })
                        return
                    }
                    
                    //Prodotto presente, si aggiorna quantity
                    const productsInCart = row.map((p: {model: string; quantity: number; category: Category; price: number;})=> new ProductInCart(p.model,p.quantity,p.category,p.price));
                    
                    });
                
            }
            catch (error){
                reject(error)
            }
        });
        
    }


    getCurrentCart(user: User){
        return new Promise<Cart>((resolve,reject)=>{
            try{
                const sql = "SELECT * FROM carts c JOIN prod_in_cart pc JOIN products p WHERE c.idCart == pc.idCart AND pc.model == p.model AND username=? AND paid=FALSE;"
                db.all(sql, [user.username], (err: Error | null, row:any) => {
                    if (err){
                        reject(err)
                        return
                    }
                    if(!row){
                        resolve (new Cart(user.username,false,null,0,[]));
                        return
                    }
                    let cartId = row.cartId;
                    const productsInCart = row.map((p: {model: string; quantity: number; category: Category; price: number;})=> new ProductInCart(p.model,p.quantity,p.category,p.price));
                    resolve (new Cart(user.username,false,null,0,productsInCart));
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
    removeProductFromCart(user:User, product:string){
        return new Promise<Boolean>((resolve,reject)=>{
            try{
                let quantity =  await this.checkProductQuantityInCart(user,product);
                let idCart = this.getIdCart(); //TODO
                if (quantity===1){
                    //eliminare associazione perchè quantity è 1
                    //DA FINIREEEEE
                    const sql = "DELETE FROM prod_in_cart pc WHERE model=? AND idCart=?"
                    db.run(sql, [user.username,product], (err: Error | null) => {
                    if (err){
                        reject(err)
                        return
                    }
                    resolve (true)
                    });
                }
                else {
                    //quantity>1 quindi aggiornare quantity
                    //INSERIRE IDCART 
                    
                    const sql = "UPDATE prod_in_cart SET quantity=? WHERE model=? AND idCart=?;"
                    db.run(sql, [user.username], (err: Error | null) => {
                    if (err){
                        reject(err)
                        return
                    }
                    resolve (true)
                    });


                }
                
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
    clearCart(user:User){
        return new Promise<Boolean>((resolve,reject)=>{
            try{
                const sql = ""
                db.all(sql, [user.username], (err: Error | null, row:any) => {
                });
            }
            catch(error){
                reject(error)
            }
        });

    }

    /*
    Impostare il carrello da true a false 
    */
    checkoutCart(user:User){
        return new Promise<Boolean>((resolve,reject)=>{
            try{
                let cart = await this.getCurrentCart(user);
                let total = 0;
                for (let i=0;i<cart.products.length; i++){
                    //EFFETTUARE CONTROLLO SU QUANTITY

                    total = total + cart.products[i].price;
                    
                }
                //UPDATE paid = true
                //UPDATE paymentDate
            }
            catch(error){
                reject(error)
            }
        });
    }

    getCustomerCarts(user:User){
        return new Promise<Boolean>((resolve,reject)=>{
            try{
               const sql = "SELECT * FROM cart WHERE username=?;"
                db.all(sql, [user.username], (err: Error | null, row:any) => {
                });
            }
            catch(error){
                reject(error)
            }
        });

    }


}

export default CartDAO