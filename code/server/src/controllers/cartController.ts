import { EmptyProductStockError, LowProductStockError, ProductNotFoundError } from "../errors/productError";
import { User } from "../components/user";
import { Cart } from "../components/cart";
import CartDAO from "../dao/cartDAO";
import { CartNotFoundError, EmptyCartError, ProductInCartError } from "../errors/cartError";
import { ProductNotInCartError } from "../errors/cartError";
import dayjs from "dayjs";

/**
 * Represents a controller for managing shopping carts.
 * All methods of this class must interact with the corresponding DAO class to retrieve or store data.
 */
class CartController {
    private dao: CartDAO

    constructor() {
        this.dao = new CartDAO
    }

    /**
     * Adds a product to the user's cart. If the product is already in the cart, the quantity should be increased by 1.
     * If the product is not in the cart, it should be added with a quantity of 1.
     * If there is no current unpaid cart in the database, then a new cart should be created.
     * @param user - The user to whom the product should be added.
     * @param productId - The model of the product to add.
     * @returns A Promise that resolves to `true` if the product was successfully added.
     */
    async addToCart(user: User, product: string)/*: Promise<Boolean>*/ { 
        
            let quantity = await this.dao.checkProductAvailability(product);
            if (quantity === -1)
                throw new ProductNotFoundError(); //ERROR 404
            if (quantity === 0)
                throw new EmptyProductStockError(); //ERROR 409
            return await this.dao.addToCart(user , product);
        
    }


    /**
     * Retrieves the current cart for a specific user.
     * @param user - The user for whom to retrieve the cart.
     * @returns A Promise that resolves to the user's cart or an empty one if there is no current cart.
     */
    async getCart(user: User)/*: Cart*/ { 
        return await this.dao.getCart(user);
    }

    /**
     * Checks out the user's cart. We assume that payment is always successful, there is no need to implement anything related to payment.
     * @param user - The user whose cart should be checked out.
     * @returns A Promise that resolves to `true` if the cart was successfully checked out.
     * 
     */
    async checkoutCart(user: User) /**Promise<Boolean> */ { 
        let checkCart = await this.dao.checkIfCartExists(user);
        if (checkCart != true)
            throw new CartNotFoundError();
        //check if at least one has 0 in stock
        //checks if at least one has more than whats available in stock
        let cart = await this.dao.getCart(user);
        if(cart.products.length===0){
            throw new EmptyCartError();
        }
        let inStock = new Array<number>(cart.products.length);
        for (let i=0;i<cart.products.length; i++){
            let quantity = await this.dao.checkProductAvailability(cart.products[i].model);
            //Quantity available < Quantity richiesta
            if (quantity === 0)
                throw new EmptyProductStockError()
            if (quantity < cart.products[i].quantity || quantity === 0){    //da rivedere <=
                throw new LowProductStockError()
            }
        }
        return await this.dao.checkoutCart(user);
    }

    /**
     * Retrieves all paid carts for a specific customer.
     * @param user - The customer for whom to retrieve the carts.
     * @returns A Promise that resolves to an array of carts belonging to the customer.
     * Only the carts that have been checked out should be returned, the current cart should not be included in the result.
     */
    async getCustomerCarts(user: User) { 
        return await this.dao.getCustomerCarts(user);
          
    } /**Promise<Cart[]> */

    /**
     * Removes one product unit from the current cart. In case there is more than one unit in the cart, only one should be removed.
     * @param user The user who owns the cart.
     * @param product The model of the product to remove.
     * @returns A Promise that resolves to `true` if the product was successfully removed.
     */
    async removeProductFromCart(user: User, product: string) /**Promise<Boolean> */ { 
        
        let checkProduct = await this.dao.checkIfProductExists(product);
        if (checkProduct!=true){
            throw new ProductNotFoundError();
        }
        let checkCart = await this.dao.checkIfCartExists(user);
        if (checkCart!=true){
            throw new CartNotFoundError();
        }
        let checkInCart = await this.dao.checkIfProductExistsInCart(user,product);
        if (checkInCart!=true){
            throw new ProductNotInCartError();
        }
        let quantity =  await this.dao.checkProductQuantityInCart(user,product);
        let idCart = await this.dao.getCartId(user);

        return await this.dao.removeProductFromCart(user,product);
            
    }
        

    /**
     * Removes all products from the current cart.
     * @param user - The user who owns the cart.
     * @returns A Promise that resolves to `true` if the cart was successfully cleared.
     */
    async clearCart(user: User)/*:Promise<Boolean> */ { 
        
        let checkCart = await this.dao.checkIfCartExists(user);
        
        if (checkCart!=true)
            throw new CartNotFoundError();
        return await this.dao.clearCart(user);
        
    }

    /**
     * Deletes all carts of all users.
     * @returns A Promise that resolves to `true` if all carts were successfully deleted.
     */
    async deleteAllCarts() /**Promise<Boolean> */ { 
        return await this.dao.deleteAllCarts();
    }

    /**
     * Retrieves all carts in the database.
     * @returns A Promise that resolves to an array of carts.
     */
    async getAllCarts() /*:Promise<Cart[]> */ { 
        return await this.dao.getAllCarts();
    }
}

export default CartController