import { User } from "../components/user";
import { Cart, ProductInCart } from "../components/cart";
import db from "../db/db"
import { Category } from "../components/product";
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
                else {
                    resolve (true)
                }
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
                        reject(err);
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

    addProductInCart(user: User, product:string, checkCart:boolean, checkProduct:boolean):Promise<Boolean>{
        return new Promise<Boolean>((resolve,reject)=>{
            try{
                let price = 0;
                const query = "SELECT * \
                    FROM products WHERE model=?";
                   db.get(query, [product], (err: Error | null, row:any) => {
                    if(err){
                        reject(err)
                        return
                    }
                    price = row.sellingPrice;
                   })
                if (checkCart === false){
                    //CARRELLO DA CREARE, PRENDERE ID E INSERIRE IN PRODINCART
                    console.log("creo carrello")
                    const sql = "INSERT INTO carts(customer,paid,paymentDate,total) VALUES (?,?,?,?)"
                    db.run(sql,[user.username,false,null,0], (err: Error | null) =>{
                        if(err){
                            reject(err);
                            return 
                        }
                        //console.log(row.idCart);
                        //Seleziono carrello corrente, superfluo se riesco a pescare l'id prima
                       
                        const sql2 = "SELECT * FROM carts WHERE customer = ? AND paid = FALSE;";
                        db.get(sql2,[user.username], (err:Error | null, row: any ) =>{
                            if(err){
                                reject(err);
                                return 
                            }
                            let cartId = row.idCart;
                            const sql3 = "INSERT INTO prod_in_cart(idCart,model,quantity,price) VALUES (?,?,?,?)"
                            db.run(sql3,[cartId,product,1,price], (err: Error | null) =>{
                            if(err){
                                reject(err);
                                return 
                            }
                            resolve(true)
                            })
                        })
                        
                    })
                }
                
                //Carrello esistente
                let cartId = null;
                console.log("carrello esistente")
                const sql = "SELECT * FROM carts c WHERE  customer=? AND paid=FALSE;"
                db.get(sql, [user.username], (err: Error | null, row:any) => {
                    
                    if (err){
                        reject(err)
                        return
                    }
                    
                    cartId = row.idCart;
                    //In questo caso il carrello è vuoto
                    if(!row || checkProduct === false){
                        console.log("prodotto ancora non in carrello")
                        const sql3 = "INSERT INTO prod_in_cart(idCart,model,quantity,price) VALUES (?,?,?,?)"
                            db.run(sql3,[cartId,product,1,price], (err: Error | null) =>{
                            if(err){
                                reject(err);
                                return 
                            }
                            resolve(true)
                            })
                        return
                    }
                    //Prodotto esiste, aggiornarne quantità
                    else if(checkProduct === true){
                        console.log("quantity da aggiornare")
                        const sql3 = "UPDATE prod_in_cart SET quantity=quantity+1 WHERE idCart=? AND model=?"
                            db.run(sql3,[cartId,product], (err: Error | null) =>{
                            if(err){
                                reject(err);
                                return 
                            }
                            resolve(true)
                            })
                        return
                    }
                    
                    //Prodotto presente, si aggiorna quantity
                    //const productsInCart = row.map((p: {model: string; quantity: number; category: Category; price: number;})=> new ProductInCart(p.model,p.quantity,p.category,p.price));
                    
                    });
                
            }
            catch (error){
                console.log("finito in catch")
                reject(error)
            }
        });
        
    }


    getCurrentCart(user: User):Promise<Cart>{
        return new Promise<Cart>((resolve,reject)=>{
            try{
                const sql = "SELECT pc.model, pc.quantity, p.category ,p.sellingPrice \
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
    //PARAMETRI MODIFICATI PER COMODITA
    removeProductFromCart(user:User, product:string, idCart:number ,quantity:number):Promise<boolean>{
        return new Promise<boolean>((resolve,reject)=>{
            try{
                
                if (quantity===1){
                    //eliminare associazione perchè quantity è 1
                    //DA FINIREEEEE
                    const sql = "DELETE FROM prod_in_cart WHERE model=? AND idCart=?"
                    db.run(sql, [product,idCart], (err: Error | null) => {
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
                    
                    const sql = "UPDATE prod_in_cart SET quantity=quantity-1 WHERE model=? AND idCart=?;"
                    db.run(sql, [product,idCart], (err: Error | null) => {
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
    clearCart(user:User,idCart: number):Promise<Boolean>{
        return new Promise<Boolean>((resolve,reject)=>{
            try{
                
                const sql = "DELETE FROM prod_in_cart WHERE idCart=?"
                db.run(sql, [idCart], (err: Error | null) => {
                    if(err){
                        reject(err);
                        return 
                    }
                    resolve(true);
                });
            }
            catch(error){
                reject(error)
            }
        });

    }

    checkoutCart(user:User, cart: Cart, inStock: Array<number>):Promise<Boolean>{
        return new Promise<Boolean>((resolve,reject)=>{
            try{
                //Updating quantities in stock
                for (let i=0;i<cart.products.length; i++){
                    const sql ="UPDATE products\
                                SET quantity=?\
                                WHERE model=?;"
                    db.run(sql, [inStock[i]-cart.products[i].quantity, cart.products[i].model], function (err: Error | null) {
                    if (err) {
                        reject(err);
                        return
                    }
                    if(this.changes==0){
                        reject(err);
                        return
                    }
                    });
                }
                //Marks current cart as paid
                const sql = "UPDATE carts\
                            SET paid=?,paymentDate=?,total=?\
                            WHERE customer=?;" 
                db.run(sql, [cart.paid,cart.paymentDate,cart.total,cart.customer], function (err: Error | null) {
                    if (err) {
                        reject(err);
                        return
                    }
                    if(this.changes==0){
                        reject(err);
                        return
                    }
                    resolve(true)
                });
                 
            }
            catch(error){
                reject(error)
            }
        });
    }


    //TODO Come restituire esattamente la roba per ogni carrello così da riempire productsincart?
    //Possibile: prima query prende tutti gli id dei carrelli interessati, seconda query scorre la lista di carrelli e ogni volta tira giù lista prodotti
    getCustomerCarts(user:User):Promise<Cart[]>{
        return new Promise<Cart[]>((resolve,reject)=>{
            try{
                const sql = "SELECT * FROM carts c JOIN prod_in_cart pc JOIN products p WHERE c.idCart == pc.idCart AND pc.model == p.model AND username=? AND paid=TRUE;"
                db.all(sql, [user.username], (err: Error | null, row:any) => {
                    if (err){
                        reject(err)
                        return
                    }
                    if(!row){
                        resolve ([]);
                        return
                    }
                    let cartId = row.cartId;
                    const productsInCart = row.map((p: {model: string; quantity: number; category: Category; price: number;})=> new ProductInCart(p.model,p.quantity,p.category,p.price));
                    resolve ([]); //DA FINIRE
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
                    
                })
            }
            catch(error){

            }

        })
    }

    //TODO Stesso dilemma di getCustomerCarts
    getAllCarts(){
        return new Promise<boolean>((resolve,reject)=>{
            try{
                const sql = "SELECT * FROM carts AND prod_in_cart;"
                db.run(sql, [], (err: Error | null) => {
                    if (err) {
                        reject(err)
                        return
                    }
                    resolve(true);
                })
            }
            catch(error){

            }

        })
    }


}

export default CartDAO