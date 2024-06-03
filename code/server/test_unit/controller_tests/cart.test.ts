import { expect, jest } from "@jest/globals"
import CartController from "../../src/controllers/cartController"
import CartDAO from "../../src/dao/cartDAO"
import { Role, User } from "../../src/components/user";
import {Cart, ProductInCart} from "../../src/components/cart";
import { Category, Product } from "../../src/components/product";
import { EmptyProductStockError, LowProductStockError, ProductNotFoundError } from "../../src/errors/productError";
import { CartNotFoundError, EmptyCartError } from "../../src/errors/cartError";

jest.mock("../../src/dao/cartDAO")


/* *************************** FUNZIONE addToCart ****************************** */

describe("addToCart", ()=>{
    
    beforeEach(() => {
        jest.clearAllMocks();
    });

test("correct addToCart controller", async () => {
    jest.clearAllMocks();
    const testUser = {
        username: "test",
        name: "test",
        surname: "test",
        role: Role.CUSTOMER,
        address: "test",
        birthdate: "27/05/2024"
    }
    jest.spyOn(CartDAO.prototype, "addToCart").mockResolvedValueOnce(true);
    jest.spyOn(CartDAO.prototype, "checkProductAvailability").mockResolvedValueOnce(3);
    //jest.spyOn(CartDAO.prototype, "checkIfCartExists").mockResolvedValueOnce(true);
    //jest.spyOn(CartDAO.prototype, "checkIfProductExistsInCart").mockResolvedValueOnce(true);
    
    const controller = new CartController(); 
    let product="test";
    const response = await controller.addToCart(testUser,product);
    
    expect(CartDAO.prototype.addToCart).toHaveBeenCalledTimes(1);
    expect(CartDAO.prototype.addToCart).toHaveBeenCalledWith(testUser,product);
    expect(CartDAO.prototype.checkProductAvailability).toHaveBeenCalledTimes(1);
    expect(CartDAO.prototype.checkProductAvailability).toHaveBeenCalledWith(product);
    /*expect(CartDAO.prototype.checkIfCartExists).toHaveBeenCalledTimes(1);
    expect(CartDAO.prototype.checkIfCartExists).toHaveBeenCalledWith(testUser);
    expect(CartDAO.prototype.checkIfProductExistsInCart).toHaveBeenCalledTimes(1);
    expect(CartDAO.prototype.checkIfProductExistsInCart).toHaveBeenCalledWith(testUser,product);*/
    expect(response).toBe(true);
});

test("failed addProductInCart DAO", async () => {
    jest.clearAllMocks();
    const testUser = {
        username: "test",
        name: "test",
        surname: "test",
        role: Role.CUSTOMER,
        address: "test",
        birthdate: "27/05/2024"
    }
    jest.spyOn(CartDAO.prototype, "addToCart").mockResolvedValueOnce(false);
    jest.spyOn(CartDAO.prototype, "checkProductAvailability").mockResolvedValueOnce(3);
    
    const controller = new CartController();
    let product="test";
    
    const response = await controller.addToCart(testUser,product);
    
    expect(CartDAO.prototype.addToCart).toHaveBeenCalledTimes(1);
    expect(CartDAO.prototype.addToCart).toHaveBeenCalledWith(testUser,product);
    expect(CartDAO.prototype.checkProductAvailability).toHaveBeenCalledTimes(1);
    expect(CartDAO.prototype.checkProductAvailability).toHaveBeenCalledWith(product);
    expect(response).toBe(false);
});


test("failed DAO: 404 ProductNoFoundError", async () => {
    jest.clearAllMocks();
    const testUser = {
        username: "test",
        name: "test",
        surname: "test",
        role: Role.CUSTOMER,
        address: "test",
        birthdate: "27/05/2024"
    }
    jest.spyOn(CartDAO.prototype, "addToCart").mockResolvedValueOnce(false);
    jest.spyOn(CartDAO.prototype, "checkProductAvailability").mockResolvedValueOnce(-1);
    
    const controller = new CartController(); 
    let product="test";

    await expect(controller.addToCart(testUser,product)).rejects.toThrowError(new ProductNotFoundError());
    expect(CartDAO.prototype.checkProductAvailability).toHaveBeenCalledTimes(1);
    expect(CartDAO.prototype.checkProductAvailability).toHaveBeenCalledWith(product);
    expect(CartDAO.prototype.addToCart).toHaveBeenCalledTimes(0);
    
});

test("failed DAO: 409 EmptyProductStockError", async () => {
    jest.clearAllMocks();
    const testUser = {
        username: "test",
        name: "test",
        surname: "test",
        role: Role.CUSTOMER,
        address: "test",
        birthdate: "27/05/2024"
    }
    jest.spyOn(CartDAO.prototype, "addToCart").mockResolvedValueOnce(false);
    jest.spyOn(CartDAO.prototype, "checkProductAvailability").mockResolvedValueOnce(0);
    
    const controller = new CartController(); 
    let product="test";
    
    await expect(controller.addToCart(testUser,product)).rejects.toThrowError(new EmptyProductStockError());

    expect(CartDAO.prototype.checkProductAvailability).toHaveBeenCalledTimes(1);
    expect(CartDAO.prototype.checkProductAvailability).toHaveBeenCalledWith(product);
    expect(CartDAO.prototype.addToCart).toHaveBeenCalledTimes(0);
    
});

});

/* ****************************** FUNZIONE getCart ****************************** */

describe("getCart", ()=>{
    
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("correct getCart controller", async () => {
        jest.clearAllMocks();
        const testUser = new User("test","test","test",Role.CUSTOMER,"test","27/05/2024")
        jest.spyOn(CartDAO.prototype, "getCart").mockResolvedValueOnce(new Cart("test",false,"",10,[new ProductInCart("test",1,Category.APPLIANCE,10)]));
        
        const controller = new CartController(); 
        
        const response = await controller.getCart(testUser);

        expect(CartDAO.prototype.getCart).toHaveBeenCalledTimes(1);
        expect(CartDAO.prototype.getCart).toHaveBeenCalledWith(testUser);
        expect(response).toStrictEqual(new Cart("test",false,"",10,[new ProductInCart("test",1,Category.APPLIANCE,10)]));
    });

    test("Test carrello vuoto o carello non pagato non esistente getCart controller", async () => {
        jest.clearAllMocks();
        const testUser = new User("test","test","test",Role.CUSTOMER,"test","27/05/2024")
        jest.spyOn(CartDAO.prototype, "getCart").mockResolvedValueOnce(new Cart("test",false,"",0,[]));    
        
        const controller = new CartController(); 
        
        const response = await controller.getCart(testUser);

        expect(CartDAO.prototype.getCart).toHaveBeenCalledTimes(1);
        expect(CartDAO.prototype.getCart).toHaveBeenCalledWith(testUser);
        expect(response).toStrictEqual(new Cart("test",false,"",0,[]));
    });
});

/* ****************************** FUNZIONE checkoutCart ****************************** */
describe("checkoutCart", ()=>{
    
    beforeEach(() => {
        jest.clearAllMocks();
    });

    
    it("correct checkoutCart controller", async () => {
        jest.clearAllMocks();
        const testUser = new User("test","test","test",Role.CUSTOMER,"test","27/05/2024")
        jest.spyOn(CartDAO.prototype, "checkIfCartExists").mockResolvedValueOnce(true);
        let product=new ProductInCart("test",1,Category.APPLIANCE,10)
        let cart=new Cart("test",false,"",10,[product])
        jest.spyOn(CartDAO.prototype, "getCart").mockResolvedValueOnce(cart);
        jest.spyOn(CartDAO.prototype, "checkProductAvailability").mockResolvedValueOnce(3);
        jest.spyOn(CartDAO.prototype, "checkoutCart").mockResolvedValueOnce(true);
        
        //let newCart = new Cart(testUser.username,true,'30/05/2024',cart.total,cart.products)

        const controller = new CartController(); 
        
        const response = await controller.checkoutCart(testUser);
        
        expect(CartDAO.prototype.checkIfCartExists).toHaveBeenCalledTimes(1);
        expect(CartDAO.prototype.checkIfCartExists).toHaveBeenCalledWith(testUser);
        expect(CartDAO.prototype.getCart).toHaveBeenCalledTimes(1);
        expect(CartDAO.prototype.getCart).toHaveBeenCalledWith(testUser);
        expect(CartDAO.prototype.checkProductAvailability).toHaveBeenCalledTimes(1);
        expect(CartDAO.prototype.checkProductAvailability).toHaveBeenCalledWith(product.model);
        expect(CartDAO.prototype.checkoutCart).toHaveBeenCalledTimes(1);
        expect(CartDAO.prototype.checkoutCart).toHaveBeenCalledWith(testUser);
        expect(response).toBe(true);
    });

    jest.clearAllMocks();
    it("Cart not found error", async () => {
        jest.clearAllMocks();
        expect.assertions(6)
        const testUser = new User("test","test","test",Role.CUSTOMER,"test","27/05/2024")
        jest.spyOn(CartDAO.prototype, "checkIfCartExists").mockResolvedValueOnce(false);
        let product=new ProductInCart("test",1,Category.APPLIANCE,10)
        let cart=new Cart("test",false,"",10,[product])
        jest.spyOn(CartDAO.prototype, "getCart").mockResolvedValueOnce(cart);
        jest.spyOn(CartDAO.prototype, "checkProductAvailability").mockResolvedValueOnce(3);
        jest.spyOn(CartDAO.prototype, "checkoutCart").mockResolvedValueOnce(true);

        const controller = new CartController(); 
        //const response = await controller.checkoutCart(testUser);
        await expect(controller.checkoutCart(testUser)).rejects.toThrowError(new CartNotFoundError());

        expect(CartDAO.prototype.checkIfCartExists).toHaveBeenCalledTimes(1);
        expect(CartDAO.prototype.checkIfCartExists).toHaveBeenCalledWith(testUser);
        expect(CartDAO.prototype.getCart).toHaveBeenCalledTimes(0);
        expect(CartDAO.prototype.checkProductAvailability).toHaveBeenCalledTimes(0);
        expect(CartDAO.prototype.checkoutCart).toHaveBeenCalledTimes(0);
    });

    jest.clearAllMocks();
    it("empty product stock error", async () => {
        jest.clearAllMocks();
        expect.assertions(7)
        jest.spyOn(CartDAO.prototype, "checkProductAvailability").mockResolvedValueOnce(0);
        const testUser = new User("test","test","test",Role.CUSTOMER,"test","27/05/2024")
        jest.spyOn(CartDAO.prototype, "checkIfCartExists").mockResolvedValueOnce(true);
        let product=new ProductInCart("test",2,Category.APPLIANCE,10)
        let cart=new Cart("test",false,"",20,[product])
        jest.spyOn(CartDAO.prototype, "getCart").mockResolvedValueOnce(cart);
        //jest.spyOn(CartDAO.prototype, "checkoutCart").mockResolvedValueOnce(true);

        const controller = new CartController(); 
        const response = await controller.checkoutCart(testUser);
        //await expect(controller.checkoutCart(testUser)).rejects.toThrowError(new EmptyProductStockError());

        expect(CartDAO.prototype.checkProductAvailability).toHaveBeenCalledTimes(1);
        expect(CartDAO.prototype.checkProductAvailability).toHaveBeenCalledWith(product.model);

        expect(CartDAO.prototype.checkIfCartExists).toHaveBeenCalledTimes(1);
        expect(CartDAO.prototype.checkIfCartExists).toHaveBeenCalledWith(testUser);
        expect(CartDAO.prototype.getCart).toHaveBeenCalledTimes(1);
        expect(CartDAO.prototype.getCart).toHaveBeenCalledWith(testUser);
        
        expect(CartDAO.prototype.checkoutCart).toHaveBeenCalledTimes(0);
    });
/*
    test("low product stock error", async () => {
        jest.clearAllMocks();
        const testUser = new User("test","test","test",Role.CUSTOMER,"test","27/05/2024")
        jest.spyOn(CartDAO.prototype, "checkIfCartExists").mockResolvedValueOnce(true);
        let product=new ProductInCart("test",10,Category.APPLIANCE,200)
        let cart=new Cart("test",false,"",200,[product])
        jest.spyOn(CartDAO.prototype, "getCart").mockResolvedValueOnce(cart);
        jest.spyOn(CartDAO.prototype, "checkProductAvailability").mockResolvedValueOnce(3);
        jest.spyOn(CartDAO.prototype, "checkoutCart").mockResolvedValueOnce(true);

        const controller = new CartController(); 
        //const response = await controller.checkoutCart(testUser);
        await expect(controller.checkoutCart(testUser)).rejects.toThrowError(new LowProductStockError());

        expect(CartDAO.prototype.checkIfCartExists).toHaveBeenCalledTimes(1);
        expect(CartDAO.prototype.checkIfCartExists).toHaveBeenCalledWith(testUser);
        expect(CartDAO.prototype.getCart).toHaveBeenCalledTimes(1);
        expect(CartDAO.prototype.getCart).toHaveBeenCalledWith(testUser);
        expect(CartDAO.prototype.checkProductAvailability).toHaveBeenCalledTimes(1);
        expect(CartDAO.prototype.checkProductAvailability).toHaveBeenCalledWith(product.model);
        expect(CartDAO.prototype.checkoutCart).toHaveBeenCalledTimes(0);
    });

    test("empty cart error", async () => {
        jest.clearAllMocks();
        const testUser = new User("test","test","test",Role.CUSTOMER,"test","27/05/2024")
        jest.spyOn(CartDAO.prototype, "checkIfCartExists").mockResolvedValueOnce(true);
        //let product=new ProductInCart("test",10,Category.APPLIANCE,200)
        let cart=new Cart("test",false,"",0,[])
        jest.spyOn(CartDAO.prototype, "getCart").mockResolvedValueOnce(cart);
        jest.spyOn(CartDAO.prototype, "checkProductAvailability").mockResolvedValueOnce(3);
        jest.spyOn(CartDAO.prototype, "checkoutCart").mockResolvedValueOnce(true);

        const controller = new CartController(); 
        //const response = await controller.checkoutCart(testUser);
        await expect(controller.checkoutCart(testUser)).rejects.toThrowError(new EmptyCartError());

        expect(CartDAO.prototype.checkIfCartExists).toHaveBeenCalledTimes(1);
        expect(CartDAO.prototype.checkIfCartExists).toHaveBeenCalledWith(testUser);
        expect(CartDAO.prototype.getCart).toHaveBeenCalledTimes(1);
        expect(CartDAO.prototype.getCart).toHaveBeenCalledWith(testUser);
        expect(CartDAO.prototype.checkProductAvailability).toHaveBeenCalledTimes(0);
        //expect(CartDAO.prototype.checkProductAvailability).toHaveBeenCalledWith(product.model);
        expect(CartDAO.prototype.checkoutCart).toHaveBeenCalledTimes(0);
    });*/
});

/* ****************************** FUNZIONE getCustomerCarts ****************************** */
describe("getCustomerCarts", ()=>{
    /*
    beforeEach(() => {
        jest.clearAllMocks();
    });*/

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
    beforeEach(() => {
        jest.clearAllMocks();
    });*/

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
    beforeEach(() => {
        jest.clearAllMocks();
    });*/

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
    beforeEach(() => {
        jest.clearAllMocks();
    });*/

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
    beforeEach(() => {
        jest.clearAllMocks();
    });*/

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
});

