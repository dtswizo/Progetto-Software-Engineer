import { test, expect, jest } from "@jest/globals"
import CartController from "../../src/controllers/cartController"
import CartDAO from "../../src/dao/cartDAO"
import { Role, User } from "../../src/components/user";
import {Cart, ProductInCart} from "../../src/components/cart";
import { Category, Product } from "../../src/components/product";
import { ProductNotFoundError } from "../../src/errors/productError";

jest.mock("../../src/dao/cartDAO")



describe("Cart controller tests", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        //app = initMockedApp();
    });

/* *************************** FUNZIONE addToCart ****************************** */

describe("addToCart", ()=>{

test("correct addToCart controller", async () => {
    const testUser = {
        username: "test",
        name: "test",
        surname: "test",
        role: Role.CUSTOMER,
        address: "test",
        birthdate: "27/05/2024"
    }
    jest.spyOn(CartDAO.prototype, "addProductInCart").mockResolvedValueOnce(true);
    jest.spyOn(CartDAO.prototype, "checkProductAvailability").mockResolvedValueOnce(3);
    jest.spyOn(CartDAO.prototype, "checkIfCartExists").mockResolvedValueOnce(true);
    jest.spyOn(CartDAO.prototype, "checkIfProductExistsInCart").mockResolvedValueOnce(true);
    
    const controller = new CartController(); 
    let product="test";
    const response = await controller.addToCart(testUser,product);
    
    expect(CartDAO.prototype.addProductInCart).toHaveBeenCalledTimes(1);
    expect(CartDAO.prototype.addProductInCart).toHaveBeenCalledWith(testUser,product,true,true);
    expect(CartDAO.prototype.checkProductAvailability).toHaveBeenCalledTimes(1);
    expect(CartDAO.prototype.checkProductAvailability).toHaveBeenCalledWith(product);
    expect(CartDAO.prototype.checkIfCartExists).toHaveBeenCalledTimes(1);
    expect(CartDAO.prototype.checkIfCartExists).toHaveBeenCalledWith(testUser);
    expect(CartDAO.prototype.checkIfProductExistsInCart).toHaveBeenCalledTimes(1);
    expect(CartDAO.prototype.checkIfProductExistsInCart).toHaveBeenCalledWith(testUser,product);
    expect(response).toBe(true);
});

test("failed addProductInCart DAO", async () => {
    const testUser = {
        username: "test",
        name: "test",
        surname: "test",
        role: Role.CUSTOMER,
        address: "test",
        birthdate: "27/05/2024"
    }
    jest.spyOn(CartDAO.prototype, "addProductInCart").mockResolvedValueOnce(false);
    jest.spyOn(CartDAO.prototype, "checkProductAvailability").mockResolvedValueOnce(3);
    jest.spyOn(CartDAO.prototype, "checkIfCartExists").mockResolvedValueOnce(true);
    jest.spyOn(CartDAO.prototype, "checkIfProductExistsInCart").mockResolvedValueOnce(true);
    
    const controller = new CartController();
    let product="test";
    
    const response = await controller.addToCart(testUser,product);
    
    expect(CartDAO.prototype.addProductInCart).toHaveBeenCalledTimes(1);
    expect(CartDAO.prototype.addProductInCart).toHaveBeenCalledWith(testUser,product,true,true);
    expect(CartDAO.prototype.checkProductAvailability).toHaveBeenCalledTimes(1);
    expect(CartDAO.prototype.checkProductAvailability).toHaveBeenCalledWith(product);
    expect(CartDAO.prototype.checkIfCartExists).toHaveBeenCalledTimes(1);
    expect(CartDAO.prototype.checkIfCartExists).toHaveBeenCalledWith(testUser);
    expect(CartDAO.prototype.checkIfProductExistsInCart).toHaveBeenCalledTimes(1);
    expect(CartDAO.prototype.checkIfProductExistsInCart).toHaveBeenCalledWith(testUser,product);
    expect(response).toBe(false);
});


test("failed checkProductAvailability DAO: 404 ProductNoFoundError", async () => {
    const testUser = {
        username: "test",
        name: "test",
        surname: "test",
        role: Role.CUSTOMER,
        address: "test",
        birthdate: "27/05/2024"
    }
    jest.spyOn(CartDAO.prototype, "addProductInCart").mockResolvedValueOnce(false);
    jest.spyOn(CartDAO.prototype, "checkProductAvailability").mockResolvedValueOnce(-1);
    jest.spyOn(CartDAO.prototype, "checkIfCartExists").mockResolvedValueOnce(true);
    jest.spyOn(CartDAO.prototype, "checkIfProductExistsInCart").mockResolvedValueOnce(true);
    
    const controller = new CartController(); 
    let product="test";

    await expect(controller.addToCart(testUser,product)).rejects.toThrowError(new ProductNotFoundError());
    expect(CartDAO.prototype.checkProductAvailability).toHaveBeenCalledTimes(1);
    expect(CartDAO.prototype.checkProductAvailability).toHaveBeenCalledWith(product);
    expect(CartDAO.prototype.checkIfCartExists).toHaveBeenCalledTimes(0);
    expect(CartDAO.prototype.checkIfProductExistsInCart).toHaveBeenCalledTimes(0);
    expect(CartDAO.prototype.addProductInCart).toHaveBeenCalledTimes(0);
    
});
/*
test("failed checkProductAvailability DAO: 409 EmptyProductStockError", async () => {
    const testUser = {
        username: "test",
        name: "test",
        surname: "test",
        role: Role.CUSTOMER,
        address: "test",
        birthdate: "27/05/2024"
    }
    jest.spyOn(CartDAO.prototype, "addProductInCart").mockResolvedValueOnce(false);
    jest.spyOn(CartDAO.prototype, "checkProductAvailability").mockResolvedValueOnce(0);
    jest.spyOn(CartDAO.prototype, "checkIfCartExists").mockResolvedValueOnce(true);
    jest.spyOn(CartDAO.prototype, "checkIfProductExistsInCart").mockResolvedValueOnce(true);
    
    const controller = new CartController(); 
    let product="test";
    let response=await controller.addToCart(testUser,product);
    
    //await expect(async()=>{await controller.addToCart(testUser,product)}).rejects.toThrow();

    
    expect(CartDAO.prototype.checkProductAvailability).toHaveBeenCalledTimes(1);
    expect(CartDAO.prototype.checkProductAvailability).toHaveBeenCalledWith(product);
    expect(CartDAO.prototype.checkIfCartExists).toHaveBeenCalledTimes(0);
    expect(CartDAO.prototype.checkIfProductExistsInCart).toHaveBeenCalledTimes(0);
    expect(CartDAO.prototype.addProductInCart).toHaveBeenCalledTimes(0);
    
});

test("checkIfCartExists DAO false", async () => {
    const testUser = {
        username: "test",
        name: "test",
        surname: "test",
        role: Role.CUSTOMER,
        address: "test",
        birthdate: "27/05/2024"
    }
    jest.spyOn(CartDAO.prototype, "addProductInCart").mockResolvedValueOnce(true);
    jest.spyOn(CartDAO.prototype, "checkProductAvailability").mockResolvedValueOnce(3);
    jest.spyOn(CartDAO.prototype, "checkIfCartExists").mockResolvedValueOnce(false);
    jest.spyOn(CartDAO.prototype, "checkIfProductExistsInCart").mockResolvedValue(true);
    
    const controller = new CartController(); 
    let product="test";
    let response=await controller.addToCart(testUser,product);
    
    expect(CartDAO.prototype.checkProductAvailability).toHaveBeenCalledTimes(1);
    expect(CartDAO.prototype.checkProductAvailability).toHaveBeenCalledWith(product);
    expect(CartDAO.prototype.checkIfCartExists).toHaveBeenCalledTimes(1);
    expect(CartDAO.prototype.checkIfCartExists).toHaveBeenCalledWith(testUser);
    expect(CartDAO.prototype.checkIfProductExistsInCart).toHaveBeenCalledTimes(1);
    expect(CartDAO.prototype.checkIfProductExistsInCart).toHaveBeenCalledWith(testUser,product);
    expect(CartDAO.prototype.addProductInCart).toHaveBeenCalledTimes(1);
    expect(CartDAO.prototype.addProductInCart).toHaveBeenCalledWith(testUser,product,false,true);
    expect(response).toBe(true);
    
});

test("checkIfProductExistsInCart DAO false", async () => {
    const testUser = {
        username: "test",
        name: "test",
        surname: "test",
        role: Role.CUSTOMER,
        address: "test",
        birthdate: "27/05/2024"
    }
    jest.spyOn(CartDAO.prototype, "addProductInCart").mockResolvedValueOnce(true);
    jest.spyOn(CartDAO.prototype, "checkProductAvailability").mockResolvedValueOnce(3);
    jest.spyOn(CartDAO.prototype, "checkIfCartExists").mockResolvedValueOnce(true);
    jest.spyOn(CartDAO.prototype, "checkIfProductExistsInCart").mockResolvedValueOnce(false);
    
    const controller = new CartController(); 
    let product="test";
    let response=await controller.addToCart(testUser,product);
    
    expect(CartDAO.prototype.checkProductAvailability).toHaveBeenCalledTimes(1);
    expect(CartDAO.prototype.checkProductAvailability).toHaveBeenCalledWith(product);
    expect(CartDAO.prototype.checkIfCartExists).toHaveBeenCalledTimes(1);
    expect(CartDAO.prototype.checkIfCartExists).toHaveBeenCalledWith(testUser);
    expect(CartDAO.prototype.checkIfProductExistsInCart).toHaveBeenCalledTimes(1);
    expect(CartDAO.prototype.checkIfProductExistsInCart).toHaveBeenCalledWith(testUser,product);
    expect(CartDAO.prototype.addProductInCart).toHaveBeenCalledTimes(1);
    expect(CartDAO.prototype.addProductInCart).toHaveBeenCalledWith(testUser,product,true,false);
    expect(response).toBe(true);
    
});

test("checkIfProductExistsInCart DAO false checkIfCartExists DAO false", async () => {
    const testUser = {
        username: "test",
        name: "test",
        surname: "test",
        role: Role.CUSTOMER,
        address: "test",
        birthdate: "27/05/2024"
    }
    jest.spyOn(CartDAO.prototype, "addProductInCart").mockResolvedValueOnce(true);
    jest.spyOn(CartDAO.prototype, "checkProductAvailability").mockResolvedValueOnce(3);
    jest.spyOn(CartDAO.prototype, "checkIfCartExists").mockResolvedValueOnce(false);
    jest.spyOn(CartDAO.prototype, "checkIfProductExistsInCart").mockResolvedValueOnce(false);
    
    const controller = new CartController(); 
    let product="test";
    let response=await controller.addToCart(testUser,product);
    
    expect(CartDAO.prototype.checkProductAvailability).toHaveBeenCalledTimes(1);
    expect(CartDAO.prototype.checkProductAvailability).toHaveBeenCalledWith(product);
    expect(CartDAO.prototype.checkIfCartExists).toHaveBeenCalledTimes(1);
    expect(CartDAO.prototype.checkIfCartExists).toHaveBeenCalledWith(testUser);
    expect(CartDAO.prototype.checkIfProductExistsInCart).toHaveBeenCalledTimes(1);
    expect(CartDAO.prototype.checkIfProductExistsInCart).toHaveBeenCalledWith(testUser,product);
    expect(CartDAO.prototype.addProductInCart).toHaveBeenCalledTimes(1);
    expect(CartDAO.prototype.addProductInCart).toHaveBeenCalledWith(testUser,product,false,false);
    expect(response).toBe(true);
    
});*/

});

/* ****************************** FUNZIONE getCart ****************************** */

describe("getCart", ()=>{
    /*
    test("correct getCart controller", async () => {
        const testUser = new User("test","test","test",Role.CUSTOMER,"test","27/05/2024")
        jest.spyOn(CartDAO.prototype, "getCurrentCart").mockResolvedValueOnce(new Cart("test",false,"",10,[new ProductInCart("test",1,Category.APPLIANCE,10)]));
        
        const controller = new CartController(); 
        
        const response = await controller.getCart(testUser);

        expect(CartDAO.prototype.getCurrentCart).toHaveBeenCalledTimes(1);
        expect(CartDAO.prototype.getCurrentCart).toHaveBeenCalledWith(testUser);
        expect(response).toBe(new Cart("test",false,"",10,[new ProductInCart("test",1,Category.APPLIANCE,10)]));
    });

    test("Test carrello vuoto o carello non pagato non esistente getCart controller", async () => {
        const testUser = new User("test","test","test",Role.CUSTOMER,"test","27/05/2024")
        jest.spyOn(CartDAO.prototype, "getCurrentCart").mockResolvedValueOnce(new Cart("test",false,"",0,[]));    
        
        const controller = new CartController(); 
        
        const response = await controller.getCart(testUser);

        expect(CartDAO.prototype.getCurrentCart).toHaveBeenCalledTimes(1);
        expect(CartDAO.prototype.getCurrentCart).toHaveBeenCalledWith(testUser);
        expect(response).toBe(new Cart("test",false,"",0,[]));
    });*/
});

/* ****************************** FUNZIONE checkoutCart ****************************** */
describe("checkoutCart", ()=>{
/*
    test("correct checkoutCart controller", async () => {
        const testUser = new User("test","test","test",Role.CUSTOMER,"test","27/05/2024")
        jest.spyOn(CartDAO.prototype, "checkIfCartExists").mockResolvedValueOnce(true);
        let product=new ProductInCart("test",1,Category.APPLIANCE,10)
        let cart=new Cart("test",false,"",10,[product])
        jest.spyOn(CartDAO.prototype, "getCurrentCart").mockResolvedValueOnce(cart);
        jest.spyOn(CartDAO.prototype, "checkProductAvailability").mockResolvedValueOnce(3);
        jest.spyOn(CartDAO.prototype, "checkoutCart").mockResolvedValueOnce(true);
        
        let newCart = new Cart(testUser.username,true,'30/05/2024',cart.total,cart.products)

        const controller = new CartController(); 
        
        const response = await controller.checkoutCart(testUser);
        
        expect(CartDAO.prototype.checkIfCartExists).toHaveBeenCalledTimes(1);
        expect(CartDAO.prototype.checkIfCartExists).toHaveBeenCalledWith(testUser);
        expect(CartDAO.prototype.getCurrentCart).toHaveBeenCalledTimes(1);
        expect(CartDAO.prototype.getCurrentCart).toHaveBeenCalledWith(testUser);
        expect(CartDAO.prototype.checkProductAvailability).toHaveBeenCalledTimes(1);
        expect(CartDAO.prototype.checkProductAvailability).toHaveBeenCalledWith(product.model);
        expect(CartDAO.prototype.checkoutCart).toHaveBeenCalledTimes(1);
        expect(CartDAO.prototype.checkoutCart).toHaveBeenCalledWith(testUser);
        expect(response).toBe(new Cart("test",false,"",10,[new ProductInCart("test",1,Category.APPLIANCE,10)]));
    });
*/

    //////////////////////////finire//////////////////////////////////
});

/* ****************************** FUNZIONE getCustomerCarts ****************************** */
describe("getCustomerCarts", ()=>{
    /*
    test("correct getCustomerCarts controller", async () => {
        const testUser = new User("test","test","test",Role.CUSTOMER,"test","27/05/2024")
        let carts=[new Cart("test",true,"10/04/2022",10,[new ProductInCart("test",1,Category.APPLIANCE,10)]),
                    new Cart("test1",true,"10/08/2023",500,[new ProductInCart("apple",2,Category.SMARTPHONE,500)])]
        jest.spyOn(CartDAO.prototype, "getCustomerCarts").mockResolvedValueOnce(carts);    
        
        const controller = new CartController(); 
        
        const response = await controller.getCustomerCarts(testUser);

        expect(CartDAO.prototype.getCustomerCarts).toHaveBeenCalledTimes(1);
        expect(CartDAO.prototype.getCustomerCarts).toHaveBeenCalledWith(testUser);
        expect(response).toBe(carts);
    });*/
})


/* ****************************** FUNZIONE removeProductFromCart ****************************** */
describe("removeProductFromCart", ()=>{
    /*
    test("correct removeProductFromCart controller", async () => {
        const testUser = new User("test","test","test",Role.CUSTOMER,"test","27/05/2024")
        let product="test"
        let quantity=3
        let idCart=1
        jest.spyOn(CartDAO.prototype, "checkIfProductExists").mockResolvedValueOnce(true);
        jest.spyOn(CartDAO.prototype, "checkIfProductExistsInCart").mockResolvedValueOnce(true); 
        jest.spyOn(CartDAO.prototype, "checkIfCartExists").mockResolvedValueOnce(true); 
        jest.spyOn(CartDAO.prototype, "checkProductQuantityInCart").mockResolvedValueOnce(quantity); 
        jest.spyOn(CartDAO.prototype, "getCartId").mockResolvedValueOnce(idCart); 
        jest.spyOn(CartDAO.prototype, "removeProductFromCart").mockResolvedValueOnce(true); 
        
        const controller = new CartController(); 
        
        const response = await controller.removeProductFromCart(testUser,product);

        expect(CartDAO.prototype.checkIfProductExists).toHaveBeenCalledTimes(1);
        expect(CartDAO.prototype.checkIfProductExists).toHaveBeenCalledWith(product);
        expect(CartDAO.prototype.checkIfProductExistsInCart).toHaveBeenCalledTimes(1);
        expect(CartDAO.prototype.checkIfProductExistsInCart).toHaveBeenCalledWith(testUser,product);
        expect(CartDAO.prototype.checkIfCartExists).toHaveBeenCalledTimes(1);
        expect(CartDAO.prototype.checkIfCartExists).toHaveBeenCalledWith(testUser);
        expect(CartDAO.prototype.checkProductQuantityInCart).toHaveBeenCalledTimes(1);
        expect(CartDAO.prototype.checkProductQuantityInCart).toHaveBeenCalledWith(testUser,product);
        expect(CartDAO.prototype.getCartId).toHaveBeenCalledTimes(1);
        expect(CartDAO.prototype.getCartId).toHaveBeenCalledWith(testUser);
        expect(CartDAO.prototype.removeProductFromCart).toHaveBeenCalledTimes(1);
        expect(CartDAO.prototype.removeProductFromCart).toHaveBeenCalledWith(testUser,product,idCart,quantity);
        expect(response).toBe(true);
    });

*/
    //////////////finire/////////////////////////////////////////////
})

/* ****************************** FUNZIONE clearCart ****************************** */
describe("clearCart", ()=>{
    /*
    test("correct getCustomerCarts controller", async () => {
        const testUser = new User("test","test","test",Role.CUSTOMER,"test","27/05/2024")
        let idCart=1
        jest.spyOn(CartDAO.prototype, "checkIfCartExists").mockResolvedValueOnce(true); 
        jest.spyOn(CartDAO.prototype, "getCartId").mockResolvedValueOnce(idCart); 
        jest.spyOn(CartDAO.prototype, "clearCart").mockResolvedValueOnce(true);    
        
        const controller = new CartController(); 
        
        const response = await controller.clearCart(testUser);

        expect(CartDAO.prototype.checkIfCartExists).toHaveBeenCalledTimes(1);
        expect(CartDAO.prototype.checkIfCartExists).toHaveBeenCalledWith(testUser);
        expect(CartDAO.prototype.getCartId).toHaveBeenCalledTimes(1);
        expect(CartDAO.prototype.getCartId).toHaveBeenCalledWith(testUser);
        expect(CartDAO.prototype.clearCart).toHaveBeenCalledTimes(1);
        expect(CartDAO.prototype.clearCart).toHaveBeenCalledWith(testUser);
        expect(response).toBe(true);
    });*/
    ////////////////////////////finire//////////////////////////////////////
})

/* ****************************** FUNZIONE deleteAllCarts ****************************** */
describe("deleteAllCarts", ()=>{
    /*
    test("correct deleteAllCarts controller", async () => {
        jest.spyOn(CartDAO.prototype, "deleteAllCarts").mockResolvedValueOnce(true);  
        
        const controller = new CartController(); 
        
        const response = await controller.deleteAllCarts();

        expect(CartDAO.prototype.deleteAllCarts).toHaveBeenCalledTimes(1);
        expect(CartDAO.prototype.deleteAllCarts).toHaveBeenCalledWith();
        expect(response).toBe(true);
    });*/

    //////////////////////finire/////////////////////////////
})

/* ****************************** FUNZIONE getAllCarts ****************************** */
describe("getAllCarts", ()=>{
    /*
    test("correct getAllCarts controller", async () => {
        let carts=[new Cart("test",true,"10/04/2022",10,[new ProductInCart("test",1,Category.APPLIANCE,10)]),
                    new Cart("test1",false,"",500,[new ProductInCart("apple",2,Category.SMARTPHONE,500)])]
        jest.spyOn(CartDAO.prototype, "getAllCarts").mockResolvedValueOnce(carts);  
        
        const controller = new CartController(); 
        
        const response = await controller.getAllCarts();

        expect(CartDAO.prototype.getAllCarts).toHaveBeenCalledTimes(1);
        expect(CartDAO.prototype.getAllCarts).toHaveBeenCalledWith();
        expect(response).toBe(carts);
    });*/

    //////////////////////finire/////////////////////////////////////////
})


});
